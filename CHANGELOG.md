# Changelog

## 0.2.0 — Full-Stack Research Demonstrator Implementation

- **Commit Ingestion & Webhook:** Added `UnifiedDiffParser` and `GitHubWebhookProcessor` with HMAC-SHA256 signature verification.
- **AST Parsing & Diff Graph:** Implemented multi-language `tree-sitter` AST parsing (Python, JavaScript/TypeScript) and `DiffGraphBuilder` with typed nodes (`FILE`, `HUNK`, `FUNCTION`, `BRANCH`, `LOOP`, `CALL`, `STATEMENT`) and edges (`AST_CHILD`, `CONTROL_FLOW`, `CALL`, `DIFF_ALIGN`).
- **Counterfactual Engine:** Implemented perturbation recipes (`polarity_invert`, `condition_flip`, `hunk_shuffle`, `rename_vars`) and syntactic/surface similarity `CounterfactualValidator`.
- **Machine Learning Architecture:**
  - Implemented `JITGraphAttentionNet` using PyTorch Geometric GATv2 with attention weight extraction.
  - Implemented `DeterministicTokenEmbedder` and `TextOnlyBaseline`.
  - Implemented `CounterfactualJointLoss` combining BCE classification with contrastive objective.
  - Implemented `TemperatureCalibrator` with Expected Calibration Error (ECE) and Brier Score evaluation.
  - Implemented `AttentionExplainer` mapping GAT attention weights to AST code regions.
- **Persistence & API:**
  - Created SQLAlchemy data models (`Repository`, `Commit`, `Prediction`, `CodeRegion`, `Experiment`, `Counterfactual`).
  - Implemented FastAPI endpoints (`/predict`, `/repositories`, `/commits`, `/experiments`, `/webhooks/github`).
  - Added benchmark dataset and automated database seeder.
- **Frontend Dashboard:**
  - Built modern React + Vite + CSS application with dark developer intelligence design system.
  - Added Repository Risk Heatmap, Commit Drill-Down, Live Diff Predictor, Counterfactual Lab, and Research Benchmark Matrix.
- **Testing:** 18 comprehensive unit and integration tests passing in `backend/tests/`.

## 0.1.0 — Initial Antigravity Starter Pack

- Added project-wide instructions.
- Added product/research documentation.
- Added architecture documentation.
- Added design guidance.
- Added testing and QA guidance.
- Added security guidance.
- Added Antigravity rules and skills.
- Added experiment and counterfactual methodology templates.
- Added CEO/investor demonstration framework.
