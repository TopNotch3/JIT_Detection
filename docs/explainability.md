# Explainability

## Proposal-aligned approach

The proposal uses attention-weight extraction and mapping back to AST nodes for explainability.

## Intended output

For a prediction, the system should identify code regions that contributed evidence to the model output.

## Important limitation

Attention should not automatically be described as a causal explanation.

Use language such as:
- model attention;
- highlighted evidence;
- influential region.

Avoid:
- "this line caused the bug"
unless supported by a separate causal/experimental analysis.

## Evaluation questions

- Can evidence be mapped reliably?
- Are highlighted regions stable?
- Do developers find them useful?
- Do explanations change appropriately under counterfactual perturbations?
