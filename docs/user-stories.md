# User Stories

## US-001 — Commit risk

As a developer, I want to see the predicted defect risk of a commit so that I can prioritize review attention.

### Acceptance criteria
- Commit is identifiable.
- Risk score is displayed.
- Risk category is displayed.
- Prediction timestamp/model version is available.

## US-002 — Risk explanation

As a developer, I want to understand which changed code regions contributed to the risk score so that I can focus my review.

### Acceptance criteria
- Relevant code region is highlighted.
- Explanation is connected to a concrete AST/code element.
- The UI distinguishes model evidence from human interpretation.

## US-003 — Repository heatmap

As a development lead, I want a repository-level risk view so that I can identify areas requiring review attention.

### Acceptance criteria
- Files/commits can be visualized.
- Risk is visually encoded.
- The user can drill down to commit details.

## US-004 — Training dataset preparation

As a researcher, I want historical commits and labels to be reproducibly prepared so that experiments can be repeated.

## US-005 — Counterfactual evaluation

As a researcher, I want paired real/counterfactual commits so that shortcut sensitivity can be measured.

## US-006 — Model comparison

As a researcher, I want baseline, ablation and proposed-model results in one experiment framework so that claims can be supported quantitatively.

## US-007 — Calibration

As a user, I want risk confidence to be calibrated so that a score can be interpreted more responsibly.

## US-008 — Failure visibility

As a researcher, I want malformed or unsupported commits to be visible in pipeline logs rather than silently discarded.
