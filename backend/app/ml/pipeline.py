from typing import Dict, Any, List, Optional
import torch
from app.config import settings
from app.ingestion.parser import UnifiedDiffParser
from app.ast_graph.graph_builder import DiffGraphBuilder
from app.ast_graph.contracts import DiffGraph
from app.ml.encoders import DeterministicTokenEmbedder
from app.ml.models import JITGraphAttentionNet
from app.ml.calibration import TemperatureCalibrator
from app.ml.explainability import AttentionExplainer

class JITPredictionPipeline:
    """End-to-end pipeline coordinating ingestion, AST graph construction, GAT prediction,
    temperature scaling calibration, and explainability mapping.
    """

    def __init__(self):
        self.diff_parser = UnifiedDiffParser()
        self.graph_builder = DiffGraphBuilder()
        self.token_embedder = DeterministicTokenEmbedder(embed_dim=64)
        self.model = JITGraphAttentionNet(in_channels=64, hidden_channels=64, out_channels=1)
        self.calibrator = TemperatureCalibrator(initial_temperature=settings.calibrated_temperature)
        self.model.eval()

    def _graph_to_tensors(self, graph: DiffGraph):
        """Converts DiffGraph to node features x and edge_index tensors."""
        node_texts = [f"{n.node_type.value} {n.label} {n.code_text}" for n in graph.nodes]
        x = self.token_embedder(node_texts) # [N, 64]

        node_id_to_idx = {n.id: i for i, n in enumerate(graph.nodes)}
        edges_src = []
        edges_tgt = []

        for e in graph.edges:
            if e.source in node_id_to_idx and e.target in node_id_to_idx:
                edges_src.append(node_id_to_idx[e.source])
                edges_tgt.append(node_id_to_idx[e.target])

        if not edges_src:
            # Self-loops if no edges exist
            edges_src = list(range(len(graph.nodes)))
            edges_tgt = list(range(len(graph.nodes)))

        edge_index = torch.tensor([edges_src, edges_tgt], dtype=torch.long)
        return x, edge_index

    def predict_commit(
        self,
        diff_text: str,
        commit_message: str = "",
        commit_sha: str = "custom"
    ) -> Dict[str, Any]:
        """Runs end-to-end prediction and returns risk scores, calibration, and explanations."""
        # 1. Parse unified diff
        parsed_diff = self.diff_parser.parse(diff_text)

        # 2. Build AST diff graph
        diff_graph = self.graph_builder.build_graph(parsed_diff, commit_sha=commit_sha)

        # 3. Embed message and graph
        msg_tensor = self.token_embedder.encode_tokens(commit_message).unsqueeze(0)
        x, edge_index = self._graph_to_tensors(diff_graph)

        # 4. Forward pass through GAT with attention
        with torch.no_grad():
            logit_tensor, graph_repr, attention_info = self.model(
                x, edge_index, msg_embed=msg_tensor, return_attention=True
            )
            raw_logit = float(logit_tensor.item())

            # Sigmoid for raw score
            raw_score = float(torch.sigmoid(logit_tensor).item())

            # Calibrated score via temperature scaling
            calibrated_prob = self.calibrator.calibrate_scalar(raw_logit)

        # 5. Determine risk category
        if calibrated_prob >= settings.high_risk_threshold:
            risk_category = "high"
        elif calibrated_prob >= settings.medium_risk_threshold:
            risk_category = "medium"
        else:
            risk_category = "low"

        # 6. Extract explainability regions
        code_regions = AttentionExplainer.extract_node_importance(diff_graph, attention_info)

        return {
            "commit": commit_sha,
            "model_version": settings.model_version,
            "raw_logit": round(raw_logit, 4),
            "raw_score": round(raw_score, 4),
            "calibrated_confidence": round(calibrated_prob, 4),
            "risk_category": risk_category,
            "files_changed": len(parsed_diff.files),
            "additions": parsed_diff.total_additions,
            "deletions": parsed_diff.total_deletions,
            "graph_summary": {
                "nodes": len(diff_graph.nodes),
                "edges": len(diff_graph.edges)
            },
            "explanation": code_regions,
            "diff_graph": diff_graph.to_dict()
        }

# Global singleton pipeline instance
pipeline_instance = JITPredictionPipeline()
