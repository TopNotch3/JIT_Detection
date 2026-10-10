# Product Requirements Document

## 1. Product

A web-based JIT defect-prediction demonstrator connected to GitHub repositories.

## 2. Primary workflow

1. Repository/commit is ingested.
2. Historical commits can be prepared for training.
3. Pre/post source code is extracted.
4. ASTs are generated.
5. A diff graph is constructed.
6. Structural and textual representations are encoded.
7. The trained GNN produces a defect-risk score.
8. Calibration converts the model output into a more trustworthy confidence estimate.
9. Explainability maps model attention to AST/code regions.
10. The API exposes the prediction.
11. The React dashboard displays repository/commit risk and explanations.

## 3. Functional requirements

### FR-01 Commit ingestion

The system shall support GitHub webhook-based ingestion for new commits.

### FR-02 Historical ingestion

The system shall support retrieval of historical commit data for training.

### FR-03 AST parsing

The pipeline shall parse pre- and post-change code using tree-sitter.

### FR-04 Diff graph

The pipeline shall construct a graph in which nodes represent changed functions/branches and edges capture relevant call/control-flow relationships.

### FR-05 Counterfactual generation

The training pipeline shall support generation of semantics-breaking but statistically similar variants using documented perturbation recipes.

### FR-06 Model

The proposed model shall use CodeBERT node/text embeddings and a Graph Attention Network.

### FR-07 Training objective

Training shall combine classification loss with a counterfactual-contrastive objective.

### FR-08 Calibration

The system shall support temperature scaling or an equivalent documented calibration procedure.

### FR-09 Explainability

The system shall expose attention/evidence that can be mapped to AST/code regions.

### FR-10 Risk API

FastAPI shall expose commit-level prediction results.

### FR-11 Dashboard

React shall display repository risk information and allow commit drill-down.

## 4. Non-functional requirements

- Reproducible experiments
- Deterministic configuration where practical
- Secure secret handling
- Clear error reporting
- Modular pipeline components
- Testable services
- Documented data lineage

## 5. Out of scope for MVP

Unless later approved:
- autonomous code modification;
- autonomous merge approval;
- automatic production deployment;
- claims of perfect bug detection;
- unsupported programming languages beyond the selected tree-sitter coverage.

## 6. Research constraints

The implementation must preserve the ability to run controlled ablations and counterfactual evaluations.
