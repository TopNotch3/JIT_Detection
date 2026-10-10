# Data Pipeline

## Source data

The proposal suggests bootstrapping from an existing labeled JIT-DP dataset, such as:
- OpenStack/QT commit sets used in prior JIT-DP work;
- revert-anchored data such as the ReDef dataset.

Final dataset selection is TBD and must be justified.

## Pipeline

1. Acquire dataset.
2. Record provenance.
3. Normalize commits.
4. Extract pre/post code.
5. Parse ASTs.
6. Identify changed functions/branches.
7. Build graph.
8. Encode textual information.
9. Generate counterfactual pairs for training/evaluation as appropriate.
10. Validate labels and counterfactual metadata.
11. Split data.
12. Serialize model-ready samples.

## Label quality

The proposal explicitly notes known SZZ issues including:
- ghost commits;
- tangled commits.

A manually checked subset should be used to sanity-check label quality.

## Data lineage

Each processed example should retain:
- source dataset;
- repository;
- commit SHA;
- parent SHA where applicable;
- label;
- preprocessing version;
- graph builder version;
- counterfactual recipe if applicable.

## Leakage controls

The implementation must explicitly investigate:
- duplicate commits;
- near-duplicate commits;
- repository overlap;
- temporal leakage;
- preprocessing leakage;
- counterfactual leakage across splits.
