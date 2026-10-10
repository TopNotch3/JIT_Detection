# Security Architecture

## Threat areas

### Repository source code
Treat source code as potentially confidential.

### GitHub webhooks
Validate webhook authenticity before processing.

### Credentials
Store secrets in environment/secret management, never source control.

### API
Use authentication and authorization appropriate to deployment mode.

### Logs
Do not log:
- tokens;
- private keys;
- credentials;
- unnecessary source-code content.

### Uploaded/generated artifacts
Validate type, size and path handling.

### Model/API abuse
Consider:
- request limits;
- authentication;
- authorization;
- resource exhaustion.

## AI-specific risks

Consider:
- prompt injection if LLM components are later introduced;
- malicious repository content;
- misleading explanations;
- over-trust in model scores.

## Principle

The system is an assistive risk predictor, not an autonomous authority.
