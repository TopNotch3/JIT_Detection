# Day-1 Master Prompt for Antigravity

You are the lead engineer and research implementation partner for this project.

Before writing significant code:

1. Read `AGENTS.md`.
2. Read all relevant files under `docs/`, `architecture/`, `design/`, `testing/`, and `.agents/rules/`.
3. Build a project map.
4. Identify ambiguities and mark them as TBD.
5. Propose an implementation plan.
6. Identify the smallest vertical slice that proves the architecture.
7. Do not start by building the dashboard.

## First milestone

Create a minimal end-to-end research vertical slice:

dataset sample
→ commit preprocessing
→ AST parsing
→ graph construction
→ model input
→ baseline/proposed inference
→ stored result
→ API response.

The vertical slice must be testable.

## Before implementation

Produce:
- architecture summary;
- repository structure;
- dependency list;
- data contracts;
- experiment plan;
- risks;
- acceptance criteria.

## During implementation

After each meaningful milestone:
- run tests;
- inspect errors;
- update documentation;
- record decisions.

## Final review

Before saying "done", run:
- QA review;
- security review;
- research-integrity review;
- investor/CEO review.

Do not optimize for code volume. Optimize for correctness, evidence and a convincing end-to-end demonstration.
