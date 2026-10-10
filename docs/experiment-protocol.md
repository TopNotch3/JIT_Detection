# Experiment Protocol

## Goal

Evaluate the proposed architecture and training objective under controlled conditions.

## Required model families

1. Existing/representative JIT-DP baseline.
2. Text-only baseline.
3. Structural-only model.
4. Counterfactual-training-only model.
5. Combined proposed model.

## Required comparisons

### Classification
Compare appropriate classification metrics under the same test protocol.

### Counterfactual robustness
Compare prediction behaviour between real and paired counterfactual examples.

### Calibration
Compare calibrated and uncalibrated confidence.

### Error analysis
Inspect:
- false positives;
- false negatives;
- unstable predictions;
- counterfactual failures;
- parsing failures.

## Reproducibility

Record:
- commit;
- dataset version;
- configuration;
- seed;
- hardware;
- software versions;
- checkpoint;
- metrics.

## Scientific reporting

Every conclusion must distinguish:
- observation;
- interpretation;
- hypothesis.
