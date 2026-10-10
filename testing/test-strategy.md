# Test Strategy

## Testing layers

### Unit tests
Test:
- AST parsing;
- diff extraction;
- graph construction;
- perturbation recipes;
- feature encoding;
- loss functions;
- calibration;
- explanation mapping.

### Integration tests
Test:
- GitHub webhook → ingestion;
- ingestion → processing;
- processing → prediction;
- prediction → API;
- API → dashboard.

### Data tests
Validate:
- schema;
- nulls;
- duplicate IDs;
- label distributions;
- split integrity;
- counterfactual provenance.

### ML tests
Validate:
- output shape;
- deterministic inference where configured;
- checkpoint loading;
- loss computation;
- gradient flow;
- no train/test contamination.

### Regression tests
Every fixed defect should have a regression test where practical.

## Experimental reproducibility

Record:
- code version;
- dataset version;
- configuration;
- seed;
- environment;
- model checkpoint;
- metrics.

## Definition

Tests prove implementation behaviour. They do not by themselves prove scientific validity.
