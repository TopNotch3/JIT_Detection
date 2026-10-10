import pytest
from app.counterfactual.recipes import CounterfactualPerturber
from app.counterfactual.validator import CounterfactualValidator

SAMPLE_DIFF = """diff --git a/check.py b/check.py
--- a/check.py
+++ b/check.py
@@ -1,3 +1,3 @@
-if count == 0:
+if count != 0:
     return False
"""

def test_counterfactual_polarity_invert():
    perturbed, meta = CounterfactualPerturber.polarity_invert(SAMPLE_DIFF)
    assert meta["flipped_lines"] == 2
    assert "+if count == 0:" in perturbed
    assert "-if count != 0:" in perturbed

def test_counterfactual_condition_flip():
    diff = """diff --git a/a.py b/a.py
--- a/a.py
+++ b/a.py
@@ -1,2 +1,2 @@
+if x == 10 and ready:
     pass
"""
    import random
    perturbed, meta = CounterfactualPerturber.condition_flip(diff, random.Random(42))
    assert meta["semantics_breaking"] is True
    assert "!=" in perturbed or "or" in perturbed

def test_counterfactual_validator():
    validator = CounterfactualValidator()
    pert, _ = CounterfactualPerturber.polarity_invert(SAMPLE_DIFF)
    is_valid, status, similarity, _ = validator.validate(SAMPLE_DIFF, pert, "polarity_invert")
    assert is_valid is True
    assert status == "valid"
    assert similarity > 0.5
