# API Specification

## Status

Initial contract. Exact routes may evolve.

## POST /webhooks/github

Receives a GitHub webhook event.

### Responsibilities
- authenticate/validate webhook;
- identify repository;
- identify commit;
- enqueue/process ingestion;
- return quickly enough for webhook expectations.

## POST /predict

Accepts a commit or prepared feature representation and returns risk information.

### Response concept

```json
{
  "commit": "sha",
  "model_version": "version",
  "risk_score": 0.0,
  "calibrated_confidence": 0.0,
  "risk_category": "high",
  "explanation": []
}
```

Values above are illustrative schema only, not target results.

## GET /repositories/{id}/risk

Returns repository-level risk information for dashboard visualization.

## GET /commits/{sha}

Returns commit metadata, risk result and explanation information.

## Error handling

Use consistent:
- status codes;
- error identifiers;
- human-readable messages;
- correlation/request IDs where practical.

Never expose stack traces or secrets to clients.
