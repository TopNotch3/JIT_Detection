# Counterfactual Design

## Purpose

Generate semantics-breaking but surface-similar variants of real commits so that shortcut sensitivity can be evaluated and discouraged during training.

## Proposal-aligned perturbation examples

The proposal lists:
- swapping added/deleted blocks;
- inverting diff polarity;
- shuffling unrelated hunks.

## Requirements

A counterfactual should:
- retain a link to the source commit;
- record the perturbation recipe;
- preserve intended surface-statistical similarity where the recipe requires it;
- be flagged as counterfactual;
- never alter the original repository;
- be validated before use.

## Critical research question

A perturbation is useful only if it meaningfully tests the intended weakness.

Therefore, do not assume that every generated pair is valid.

## Validation dimensions

Potential checks:
- syntactic validity;
- structural difference;
- surface similarity;
- semantic disruption proxy;
- duplicate detection.

The final validation method must be documented and experimentally justified.
