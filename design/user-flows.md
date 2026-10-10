# User Flows

## Developer flow

```text
Open repository
    ↓
View risk heatmap
    ↓
Select risky commit
    ↓
Inspect risk score
    ↓
Inspect affected files
    ↓
Inspect highlighted code region
    ↓
Read model evidence
    ↓
Perform human review
```

## Researcher flow

```text
Select dataset
    ↓
Run preprocessing
    ↓
Validate labels
    ↓
Build graphs
    ↓
Generate counterfactuals
    ↓
Train baseline
    ↓
Train ablations
    ↓
Train proposed model
    ↓
Evaluate
    ↓
Store experiment
    ↓
Compare results
```

## Error flow

```text
Invalid commit/source
    ↓
Record failure reason
    ↓
Do not silently discard
    ↓
Show actionable status
```
