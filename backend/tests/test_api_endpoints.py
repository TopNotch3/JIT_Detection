import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.data.seeder import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    seed_database()

client = TestClient(app)

def test_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    assert "service" in res.json()

    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_predict_endpoint():
    diff = """diff --git a/app.py b/app.py
--- a/app.py
+++ b/app.py
@@ -1,3 +1,4 @@
 def start():
+    initialize_services()
     return True
"""
    payload = {
        "diff": diff,
        "message": "feat: initialize background services",
        "commit_sha": "test_sha_predict"
    }
    res = client.post("/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "calibrated_confidence" in data
    assert "risk_category" in data
    assert "explanation" in data

def test_list_repositories_and_risk():
    res = client.get("/repositories")
    assert res.status_code == 200
    repos = res.json()
    assert len(repos) > 0
    repo_id = repos[0]["id"]

    risk_res = client.get(f"/repositories/{repo_id}/risk")
    assert risk_res.status_code == 200
    risk_data = risk_res.json()
    assert "total_commits" in risk_data
    assert "average_calibrated_risk" in risk_data
    assert "file_risk_distribution" in risk_data

def test_commits_list_and_details():
    res = client.get("/commits")
    assert res.status_code == 200
    commits = res.json()
    assert len(commits) > 0
    first_sha = commits[0]["sha"]

    detail_res = client.get(f"/commits/{first_sha}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert "prediction" in detail
    assert "code_regions" in detail

def test_experiments_list():
    res = client.get("/experiments")
    assert res.status_code == 200
    exps = res.json()
    assert len(exps) >= 4 # Baseline, Structural-only, Robust-only, Proposed
    families = [e["model_family"] for e in exps]
    assert "baseline_text" in families
    assert "proposed_combined" in families

def test_counterfactual_test_route():
    diff = """diff --git a/calc.py b/calc.py
--- a/calc.py
+++ b/calc.py
@@ -1,3 +1,3 @@
-if count == 0:
+if count != 0:
     return False
"""
    payload = {
        "diff": diff,
        "recipe": "polarity_invert"
    }
    res = client.post("/experiments/counterfactual-test", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["recipe"] == "polarity_invert"
    assert "risk_divergence" in data
    assert "surface_similarity" in data
