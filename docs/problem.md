# Problem Statement

## Problem

Just-In-Time Defect Prediction (JIT-DP) attempts to identify commits that are likely to introduce bugs before those changes reach production.

The project proposal notes that existing approaches such as DeepJIT, CC2Vec, CodeBERT-JIT and JIT-Fine commonly treat the code diff as a token sequence and predict a risk score.

## Identified weakness

The proposal cites recent evaluation work using counterfactual perturbations. The reported observation is that state-of-the-art models can show very small prediction changes when surface statistics are preserved while semantics are disrupted.

This suggests shortcut learning: the model may rely on superficial statistical cues rather than sufficiently meaningful code understanding.

## Why this matters

A defect predictor that relies on shortcuts may:
- assign similar scores to substantially different changes;
- fail to react appropriately to meaningful structural changes;
- provide risk estimates that do not generalize reliably.

## Proposed response

The project addresses this gap using:

### Structural representation

Represent each commit as a graph containing changed functions/branches and structural relationships such as calls and control flow.

### Counterfactual-robust training

Generate paired counterfactual examples and use a contrastive objective that explicitly encourages different predictions for real and semantics-breaking counterfactual diffs.

## Research gap

The proposal frames the gap as follows:

- existing models use predominantly flat representations;
- prior evaluation exposes shortcut learning;
- the diagnosis does not itself provide a concrete architecture/training solution.

The proposed contribution is an architecture plus training method targeting this gap.

## Open questions

The following must be experimentally validated rather than assumed:

- How much does the graph representation improve performance?
- How much does the contrastive objective improve counterfactual sensitivity?
- Does the combined method outperform each component independently?
- Does calibration improve?
- Are explanations useful and faithful?
