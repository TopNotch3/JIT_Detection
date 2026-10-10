# Product and Research Vision

## Working title

Structurally-Aware, Counterfactual-Robust Just-In-Time Defect Prediction

## Vision

Create a JIT defect-prediction system that does more than identify statistical patterns associated with risky commits.

The proposed system should incorporate software structure and explicitly train against shortcut behaviour so that predictions are more responsive to meaningful changes in code semantics and structure.

## Core question

When a developer commits code, can the system predict whether that commit is likely to introduce a defect before it reaches production?

## Intended users

The proposal explicitly targets developers and code-review workflows.

Engineering expansion to other user groups is possible, but must be treated as future scope unless supported by research evidence.

## Product outcome

The demonstrator should make a risk prediction available at commit/code-review time and provide an explanation that points developers toward the code regions associated with the prediction.

## Research outcome

The project should determine whether combining:
- structural diff representations, and
- counterfactual-contrastive training

can address the shortcut-learning weakness identified in prior JIT-DP evaluation.

## Success is not defined as

- having the most visually impressive dashboard;
- using the largest model;
- maximizing one metric on one dataset.

## Success is defined as

A reproducible experimental result that clearly establishes:
1. whether the proposed structural representation helps;
2. whether counterfactual training improves robustness;
3. whether the combined approach improves the relevant evaluation criteria;
4. what limitations remain.
