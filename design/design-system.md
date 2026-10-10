# Design System

## Product character

The UI should feel like a professional developer intelligence platform, not a generic AI chatbot or decorative analytics dashboard.

## Visual priorities

1. Information hierarchy
2. Risk visibility
3. Evidence visibility
4. Code readability
5. Fast navigation
6. Consistency

## Primary views

### Repository overview
- risk heatmap;
- recent risky commits;
- filters;
- model/version indicator.

### Commit detail
- commit metadata;
- risk score;
- calibrated confidence;
- changed files;
- highlighted code regions;
- explanation.

### Research/experiment view
Optional for internal use:
- model version;
- dataset version;
- evaluation metrics;
- experiment ID.

## States

Every major component needs:
- loading;
- empty;
- error;
- success;
- partial-data state.

## Accessibility

- keyboard navigation;
- sufficient contrast;
- non-color-only risk indicators;
- readable code;
- meaningful labels.

## Anti-patterns

Do not:
- use excessive gradients;
- overuse glowing AI visuals;
- hide uncertainty;
- display unsupported certainty;
- add charts without decision value.
