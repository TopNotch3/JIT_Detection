# Product and Research Roadmap

## Phase 0 — Research foundation

- Literature review
- Dataset selection
- Label-quality review
- Baseline reproduction
- Experimental protocol

## Phase 1 — Data pipeline

- GitHub ingestion
- Commit normalization
- Pre/post source extraction
- tree-sitter parsing
- graph construction
- counterfactual generation

## Phase 2 — Modeling

- CodeBERT encoding
- GAT implementation
- classification objective
- counterfactual-contrastive objective
- checkpointing

## Phase 3 — Evaluation

- baseline
- structural-only ablation
- robust-only ablation
- combined model
- counterfactual evaluation
- calibration evaluation
- error analysis

## Phase 4 — Serving

- FastAPI
- prediction endpoint
- calibration layer
- explanation endpoint

## Phase 5 — Dashboard

- repository heatmap
- commit drill-down
- risk visualization
- highlighted code regions

## Phase 6 — Demonstration

- polished demo repository
- reproducible run
- research results
- technical report
- 5-minute CEO/investor-style demonstration

## Gate rule

Do not prioritize visual polish over scientific validation. The dashboard is the final presentation layer of the research pipeline.
