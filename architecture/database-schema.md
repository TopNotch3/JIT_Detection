# Database Schema

## Purpose

PostgreSQL stores application metadata, repository/commit information, prediction records and operational state.

The exact schema may evolve after implementation.

## Core entities

### Repository
- id
- provider
- external_id
- owner
- name
- default_branch
- created_at
- updated_at

### Commit
- id
- repository_id
- sha
- parent_sha
- message
- author metadata as permitted
- timestamp
- ingestion_status

### Prediction
- id
- commit_id
- model_version
- raw_score
- calibrated_score
- risk_category
- explanation_status
- created_at

### CodeRegion
- id
- commit_id
- file_path
- AST node identifier
- start position
- end position
- evidence score

### Experiment
- id
- model_version
- dataset_version
- configuration
- seed
- metrics
- created_at

### Counterfactual
- id
- source_commit_id
- recipe
- seed
- generated_artifact_reference
- validation_status

## Security

Do not store secrets or full sensitive source code in the database unless explicitly required and protected.

## Versioning

Schema migrations must be tracked and reproducible.
