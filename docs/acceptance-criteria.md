# Acceptance Criteria

## System

- [ ] Project starts using documented setup instructions.
- [ ] Services can run through the documented development environment.
- [ ] Secrets are not committed.
- [ ] Errors are observable.

## Data

- [ ] Dataset source is recorded.
- [ ] Commit IDs are retained.
- [ ] Labels are traceable to source data.
- [ ] Train/validation/test split is explicit.
- [ ] Potential leakage is documented.
- [ ] Counterfactual provenance is retained.

## Graph

- [ ] Pre/post code can be parsed.
- [ ] Changed nodes are identifiable.
- [ ] Graph edges have documented semantics.
- [ ] Graph serialization is reproducible.

## Model

- [ ] Baseline exists.
- [ ] Structural-only ablation exists.
- [ ] Robust-training-only ablation exists.
- [ ] Combined model exists.
- [ ] Training configuration is saved.
- [ ] Model checkpoint is versioned.

## Evaluation

- [ ] Classification metrics are reported.
- [ ] Counterfactual sensitivity is measured.
- [ ] Calibration is evaluated.
- [ ] Results are reported across the defined test split.
- [ ] Failed experiments are retained/documented.

## Explainability

- [ ] Model evidence can be linked to AST/code regions.
- [ ] Missing/uncertain explanations are handled explicitly.
- [ ] Explanation quality is not claimed to be faithful without evaluation.

## Dashboard

- [ ] Repository risk view works.
- [ ] Commit drill-down works.
- [ ] Risk score is visible.
- [ ] Explanation is visible.
- [ ] Loading/error/empty states exist.

## Research integrity

- [ ] No fabricated results.
- [ ] No unsupported novelty claims.
- [ ] All external sources are documented.
