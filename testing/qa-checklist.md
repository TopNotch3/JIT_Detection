# QA Checklist

## Functional

- [x] GitHub webhook is accepted securely (HMAC SHA-256 verified).
- [x] Commit ingestion works (UnifiedDiffParser parses hunks and reconstructions).
- [x] Historical data can be processed (benchmark dataset and seeder).
- [x] AST parsing works for supported languages (tree-sitter Python and JavaScript).
- [x] Graph generation works (DiffGraphBuilder connects AST nodes and hunks).
- [x] Prediction works (GATv2 model forward pass and risk calculation).
- [x] Calibration works (temperature scaling, ECE, and Brier metrics).
- [x] Explanation mapping works (AttentionExplainer extracts node evidence).
- [x] Dashboard renders results (React + Vite full-stack developer interface).

## Data

- [x] Invalid data is reported (clear error handling and HTTPException details).
- [x] Duplicate commits are handled (SHA uniqueness check).
- [x] Label provenance exists (ground_truth_label recorded from benchmark dataset).
- [x] Counterfactual provenance exists (recipe, seed, validity, similarity stored).
- [x] Split integrity is verified (test split metrics tracked).

## ML

- [x] Baselines run (Text-Only / CodeBERT baseline recorded).
- [x] Ablations run (Structural-Only and Robust-Only ablations tracked).
- [x] Proposed model runs (GATv2 + AST + Counterfactual Contrastive).
- [x] Metrics are reproducible (deterministic seeds and configurations logged).
- [x] Counterfactual evaluation runs (interactive lab and evaluation metrics).

## Security

- [x] No credentials in repository (environment variables with dev fallback).
- [x] Webhook validation works (HMAC SHA-256 timing attack resistant comparison).
- [x] Sensitive data is not unnecessarily logged.
- [x] API authorization is enforced where required.

## UX

- [x] Loading state (skeleton/pulsing loaders on dashboard and commit drill-down).
- [x] Empty state (handled across commits, live predictor, and files).
- [x] Error state (actionable inline error messages with return actions).
- [x] Mobile/responsive behaviour (responsive grid and overflow handling).
- [x] Risk is not represented by color alone (badges include explicit text and numerical %).
- [x] Explanation is understandable (influential regions mapped to line numbers).

## Release

- [x] README updated with quickstart, architecture, and API documentation.
- [x] Changelog updated to 0.2.0.
- [x] Version recorded across config, frontend, and database models.
- [x] Demo path tested from clean environment (18/18 pytest tests passing, Vite bundle built).
