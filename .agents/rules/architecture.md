# Architecture Rule

- Preserve separation between ingestion, parsing, graph construction, modeling, serving and UI.
- Do not move logic across layers without documenting why.
- Prefer interfaces between pipeline stages.
- Keep research code testable independently from API code.
- Keep model code independent from React.
- Any architecture change must update architecture documentation.
