# Antigravity Project Instructions

## Mission

Build a rigorous, reproducible, production-quality research demonstrator for structurally-aware and counterfactual-robust Just-In-Time Defect Prediction.

The project is not merely a dashboard and not merely a model implementation. The deliverable is an integrated pipeline:

GitHub repository/commit
→ commit ingestion
→ pre/post source extraction
→ AST parsing
→ diff graph construction
→ node/text encoding
→ GNN prediction
→ calibration
→ explainability
→ API
→ React dashboard.

## Source-of-truth rule

The project proposal and approved research documents are the source of truth for project scope.

Never silently replace the proposed architecture with another approach.

If an implementation decision requires information that the proposal does not specify:
1. mark it as TBD;
2. propose a reasonable option;
3. explain the trade-off;
4. do not present the option as part of the original proposal.

## Scientific integrity

Never:
- invent performance numbers;
- invent datasets or labels;
- claim a model is state of the art without evidence;
- claim the counterfactual objective works before testing it;
- claim explanations are faithful without evaluation;
- hide failed experiments.

Every reported result must identify:
- dataset;
- split;
- metric;
- baseline;
- random seed where applicable;
- model version;
- preprocessing;
- date/time or experiment ID.

## Engineering principles

- Prefer simple, explicit implementations.
- Avoid unnecessary dependencies.
- Keep business/research logic modular.
- Use type hints where practical.
- Validate inputs at system boundaries.
- Never hardcode secrets.
- Never commit credentials.
- Log important pipeline failures with actionable context.
- Do not silently drop malformed commits.
- Preserve reproducibility.

## ML principles

- Keep train/validation/test separation explicit.
- Prevent temporal/data leakage.
- Record preprocessing configuration.
- Version model checkpoints.
- Record experiment configuration.
- Report class imbalance.
- Compare against meaningful baselines.
- Evaluate calibration separately from discrimination.
- Evaluate counterfactual robustness separately from ordinary classification performance.

## Counterfactual rule

Counterfactual generation is a training/evaluation research mechanism. It must not modify the original repository or be presented to developers as an actual commit.

Every generated counterfactual must retain:
- source commit ID;
- perturbation recipe;
- random seed if applicable;
- generation status;
- validity metadata.

## UI principles

The dashboard should communicate:
- risk;
- confidence/calibration;
- evidence;
- affected code regions;
- commit context.

Do not use decorative AI language to compensate for missing evidence.

## Definition of done

A feature is not complete until:
1. acceptance criteria are satisfied;
2. tests are added or updated;
3. relevant documentation is updated;
4. errors are handled;
5. the implementation has been manually reviewed;
6. reproducibility impact is considered.

## Priority

When trade-offs occur, prioritize:

1. Scientific validity
2. Correctness
3. Reproducibility
4. Security
5. Explainability
6. Maintainability
7. UX polish
8. Performance optimization
