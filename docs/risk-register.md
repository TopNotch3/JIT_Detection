# Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Noisy labels | High | Document label source; manually inspect subset |
| SZZ-related label errors | High | Discuss ghost/tangled commits; validate subset |
| Data leakage | Critical | Use explicit, documented splits and leakage checks |
| Counterfactuals are invalid | High | Validate perturbation recipes |
| Counterfactuals are too easy | High | Measure surface/statistical similarity |
| Counterfactuals are not semantics-breaking | High | Add validity checks |
| Model overfits dataset | High | Multiple seeds/splits and ablations |
| Poor calibration | Medium | Calibration stage + evaluation |
| Unfaithful explanations | High | Treat attention as evidence, not proof |
| Unsupported language syntax | Medium | Document supported tree-sitter languages |
| GitHub API limits | Medium | Rate-limit handling and caching |
| Source-code privacy | Critical | Secure handling; no secrets in logs |
| GPU/resource limitations | Medium | Profile and document hardware |
| Dashboard hides model limitations | Medium | Show confidence, evidence and limitations |

## Risk review rule

Every high/critical risk must have:
- owner;
- status;
- mitigation;
- verification method.
