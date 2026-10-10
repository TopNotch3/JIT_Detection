# Success Metrics

## Research metrics

### Classification
Select and document appropriate metrics for the dataset and class imbalance, such as:
- precision;
- recall;
- F1;
- ROC-AUC;
- PR-AUC.

### Counterfactual robustness

Define a metric that measures whether predictions respond appropriately when real commits are transformed into semantics-breaking counterfactuals.

The exact metric must be defined before final evaluation.

### Calibration

Evaluate whether predicted confidence corresponds to observed outcomes.

Potential metrics include:
- Expected Calibration Error;
- reliability diagrams;
- Brier score.

## Product metrics

For the demonstrator:
- prediction latency;
- ingestion success rate;
- explanation availability;
- dashboard response time.

## Scientific success criteria

The project is successful if it can clearly answer:
1. Does structural representation help?
2. Does counterfactual-contrastive training help?
3. Does their combination help?
4. Does robustness improve without unacceptable classification degradation?
5. What failure modes remain?

Do not set arbitrary performance thresholds until baselines and dataset properties are understood.
