import pytest
import torch
import numpy as np
from app.ml.encoders import DeterministicTokenEmbedder
from app.ml.models import JITGraphAttentionNet
from app.ml.loss import CounterfactualJointLoss
from app.ml.calibration import TemperatureCalibrator
from app.ml.pipeline import JITPredictionPipeline

def test_token_embedder_deterministic():
    embedder = DeterministicTokenEmbedder(embed_dim=64)
    v1 = embedder.encode_tokens("def foo(): return 42")
    v2 = embedder.encode_tokens("def foo(): return 42")
    assert torch.allclose(v1, v2)
    assert v1.shape == (64,)

def test_gat_forward_pass_with_attention():
    model = JITGraphAttentionNet(in_channels=64, hidden_channels=64, out_channels=1)
    x = torch.randn(5, 64)
    edge_index = torch.tensor([[0, 1, 2, 3], [1, 2, 3, 4]], dtype=torch.long)
    msg_embed = torch.randn(1, 64)

    logit, graph_repr, attention_info = model(x, edge_index, msg_embed=msg_embed, return_attention=True)
    assert logit.shape in (torch.Size([]), torch.Size([1])) or logit.dim() <= 1
    assert graph_repr.shape[1] == 64 * 3
    assert attention_info is not None

def test_counterfactual_joint_loss():
    loss_fn = CounterfactualJointLoss(lambda_contrastive=0.35, margin=0.5)
    orig_logit = torch.tensor([1.2])
    orig_target = torch.tensor([1.0])
    orig_repr = torch.randn(1, 64)
    cf_repr = torch.randn(1, 64)

    loss, details = loss_fn(orig_logit, orig_target, orig_repr, cf_repr, is_semantics_breaking=True)
    assert loss > 0.0
    assert "classification_loss" in details
    assert "contrastive_loss" in details

def test_calibration_ece_and_brier():
    calibrator = TemperatureCalibrator(initial_temperature=1.5)
    prob = calibrator.calibrate_scalar(0.0)
    assert 0.49 < prob < 0.51

    probs = np.array([0.9, 0.8, 0.2, 0.1])
    targets = np.array([1, 1, 0, 0])
    ece = TemperatureCalibrator.compute_ece(probs, targets)
    brier = TemperatureCalibrator.compute_brier_score(probs, targets)
    assert 0.0 <= ece <= 1.0
    assert 0.0 <= brier <= 1.0

def test_end_to_end_prediction_pipeline():
    pipeline = JITPredictionPipeline()
    diff = """diff --git a/test.py b/test.py
--- a/test.py
+++ b/test.py
@@ -1,3 +1,4 @@
 def run():
+    dangerous_operation()
     return True
"""
    result = pipeline.predict_commit(diff, commit_message="add dangerous call", commit_sha="test123")
    assert "raw_score" in result
    assert "calibrated_confidence" in result
    assert "risk_category" in result
    assert result["risk_category"] in ("low", "medium", "high")
    assert len(result["explanation"]) > 0
