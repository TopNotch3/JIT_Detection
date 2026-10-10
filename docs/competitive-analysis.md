# Competitive and Baseline Analysis

## Purpose

Separate the project's research contribution from existing JIT-DP models and from conventional code-analysis alternatives.

## Explicit proposal references

The proposal identifies DeepJIT, CC2Vec, CodeBERT-JIT and JIT-Fine as relevant existing JIT-DP approaches.

The proposal also references the ReDef study as evidence concerning counterfactual robustness and shortcut learning.

## Baseline categories

### Baseline A: Existing JIT-DP model

Use a representative existing approach as a direct benchmark.

### Baseline B: Text-only transformer

Use a CodeBERT-style representation without graph structure.

### Baseline C: Graph-only model

Use structural representation without the proposed counterfactual objective.

### Baseline D: Proposed combined model

Structural graph representation + counterfactual-contrastive objective.

## Required ablation matrix

| Model | Graph | Counterfactual training | Purpose |
|---|---:|---:|---|
| Baseline | No | No | Reference |
| Structural-only | Yes | No | Measure graph contribution |
| Robust-only | No | Yes | Measure objective contribution |
| Proposed | Yes | Yes | Combined contribution |

## Competitive questions

For every external tool or paper evaluated, document:
- input;
- output;
- representation;
- training method;
- dataset;
- evaluation protocol;
- strengths;
- limitations;
- relevance to this project.

## Rule

Do not claim the proposed system is commercially or scientifically superior until the relevant comparison has been performed.
