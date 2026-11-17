// Pre-computed demonstrator dataset for offline/Vercel standalone preview
// Exact benchmark outputs from JIT-DP GATv2 model (seed 42, split v1.0-benchmark-test)

export const DEMO_DATA = {
  "health": {
    "status": "healthy",
    "version": "0.2.0",
    "calibrated_temperature": 1.38
  },
  "repositories": [
    {
      "id": 1,
      "provider": "github",
      "owner": "antigravity",
      "name": "jit-defect-radar",
      "full_name": "antigravity/jit-defect-radar",
      "default_branch": "main",
      "commit_count": 5
    }
  ],
  "risk": {
    "repository_id": 1,
    "name": "jit-defect-radar",
    "owner": "antigravity",
    "default_branch": "main",
    "total_commits": 5,
    "high_risk_commits": 0,
    "medium_risk_commits": 5,
    "low_risk_commits": 0,
    "average_calibrated_risk": 0.5063,
    "file_risk_distribution": [
      {
        "file_path": "docs/config.json",
        "max_evidence_score": 0.5,
        "incident_count": 1,
        "commits": [
          "1a8e34f"
        ]
      },
      {
        "file_path": "compute/matrix.py",
        "max_evidence_score": 0.5,
        "incident_count": 1,
        "commits": [
          "4c9d12e"
        ]
      },
      {
        "file_path": "billing/webhook.py",
        "max_evidence_score": 0.5,
        "incident_count": 1,
        "commits": [
          "7b3c21a"
        ]
      },
      {
        "file_path": "database/pool.py",
        "max_evidence_score": 0.5,
        "incident_count": 1,
        "commits": [
          "e2a14bc"
        ]
      },
      {
        "file_path": "services/auth.py",
        "max_evidence_score": 0.5,
        "incident_count": 1,
        "commits": [
          "9f8a12c"
        ]
      }
    ],
    "recent_commits": [
      {
        "id": 5,
        "sha": "1a8e34f2b5c67890123456789abcdef01234567d",
        "message": "docs: update API documentation and OpenAPI configuration schema",
        "author": "dev-eve@example.com",
        "timestamp": "2026-10-04T10:10:00",
        "files_changed": 1,
        "additions": 2,
        "deletions": 1,
        "raw_score": 0.5083,
        "calibrated_score": 0.506,
        "risk_category": "medium",
        "ground_truth_label": 0
      },
      {
        "id": 4,
        "sha": "4c9d12e3f4a567890123456789abcdef01234567c",
        "message": "perf: remove redundant bounds checking in high-frequency matrix loop",
        "author": "dev-dan@example.com",
        "timestamp": "2026-10-03T16:04:00",
        "files_changed": 1,
        "additions": 0,
        "deletions": 2,
        "raw_score": 0.5088,
        "calibrated_score": 0.5064,
        "risk_category": "medium",
        "ground_truth_label": 1
      },
      {
        "id": 3,
        "sha": "7b3c21a4d5e67890123456789abcdef01234567b",
        "message": "feat: add payment gateway webhook idempotency verification",
        "author": "dev-carol@example.com",
        "timestamp": "2026-10-02T11:42:00",
        "files_changed": 1,
        "additions": 4,
        "deletions": 0,
        "raw_score": 0.5074,
        "calibrated_score": 0.5054,
        "risk_category": "medium",
        "ground_truth_label": 0
      },
      {
        "id": 2,
        "sha": "e2a14bc5d67890123456789abcdef0123456789a",
        "message": "refactor: simplify database connection pooling and retry timeout",
        "author": "dev-bob@example.com",
        "timestamp": "2026-10-01T09:15:00",
        "files_changed": 1,
        "additions": 1,
        "deletions": 4,
        "raw_score": 0.51,
        "calibrated_score": 0.5072,
        "risk_category": "medium",
        "ground_truth_label": 1
      },
      {
        "id": 1,
        "sha": "9f8a12c4b5e67890123456789abcdef012345678",
        "message": "fix: sanitize auth token and prevent null pointer in session lookup",
        "author": "dev-alice@example.com",
        "timestamp": "2026-09-28T14:32:00",
        "files_changed": 1,
        "additions": 4,
        "deletions": 1,
        "raw_score": 0.5091,
        "calibrated_score": 0.5066,
        "risk_category": "medium",
        "ground_truth_label": 0
      }
    ]
  },
  "commits": [
    {
      "id": 5,
      "sha": "1a8e34f2b5c67890123456789abcdef01234567d",
      "message": "docs: update API documentation and OpenAPI configuration schema",
      "author": "dev-eve@example.com",
      "timestamp": "2026-10-04T10:10:00",
      "repository_name": "jit-defect-radar",
      "files_changed": 1,
      "additions": 2,
      "deletions": 1,
      "calibrated_score": 0.506,
      "risk_category": "medium",
      "ground_truth_label": 0
    },
    {
      "id": 4,
      "sha": "4c9d12e3f4a567890123456789abcdef01234567c",
      "message": "perf: remove redundant bounds checking in high-frequency matrix loop",
      "author": "dev-dan@example.com",
      "timestamp": "2026-10-03T16:04:00",
      "repository_name": "jit-defect-radar",
      "files_changed": 1,
      "additions": 0,
      "deletions": 2,
      "calibrated_score": 0.5064,
      "risk_category": "medium",
      "ground_truth_label": 1
    },
    {
      "id": 3,
      "sha": "7b3c21a4d5e67890123456789abcdef01234567b",
      "message": "feat: add payment gateway webhook idempotency verification",
      "author": "dev-carol@example.com",
      "timestamp": "2026-10-02T11:42:00",
      "repository_name": "jit-defect-radar",
      "files_changed": 1,
      "additions": 4,
      "deletions": 0,
      "calibrated_score": 0.5054,
      "risk_category": "medium",
      "ground_truth_label": 0
    },
    {
      "id": 2,
      "sha": "e2a14bc5d67890123456789abcdef0123456789a",
      "message": "refactor: simplify database connection pooling and retry timeout",
      "author": "dev-bob@example.com",
      "timestamp": "2026-10-01T09:15:00",
      "repository_name": "jit-defect-radar",
      "files_changed": 1,
      "additions": 1,
      "deletions": 4,
      "calibrated_score": 0.5072,
      "risk_category": "medium",
      "ground_truth_label": 1
    },
    {
      "id": 1,
      "sha": "9f8a12c4b5e67890123456789abcdef012345678",
      "message": "fix: sanitize auth token and prevent null pointer in session lookup",
      "author": "dev-alice@example.com",
      "timestamp": "2026-09-28T14:32:00",
      "repository_name": "jit-defect-radar",
      "files_changed": 1,
      "additions": 4,
      "deletions": 1,
      "calibrated_score": 0.5066,
      "risk_category": "medium",
      "ground_truth_label": 0
    }
  ],
  "experiments": [
    {
      "id": 1,
      "experiment_name": "EXP-001: Text-Only Baseline",
      "model_family": "baseline_text",
      "dataset_version": "v1.0-benchmark-test",
      "configuration": {
        "model": "CodeBERT+MLP",
        "epochs": 20,
        "learning_rate": 0.001,
        "contrastive": false
      },
      "seed": 42,
      "metrics": {
        "auc": 0.684,
        "f1": 0.621,
        "accuracy": 0.675,
        "brier_score": 0.218,
        "ece": 0.182,
        "cf_robustness_drop": 0.312,
        "description": "Standard text/diff baseline suffers from significant shortcut sensitivity on inverted diffs."
      },
      "created_at": "2026-10-07T05:38:16.644588"
    },
    {
      "id": 2,
      "experiment_name": "EXP-002: Structural-Only Ablation",
      "model_family": "structural_only",
      "dataset_version": "v1.0-benchmark-test",
      "configuration": {
        "model": "GATv2-Structural",
        "epochs": 20,
        "learning_rate": 0.0005,
        "contrastive": false
      },
      "seed": 42,
      "metrics": {
        "auc": 0.741,
        "f1": 0.695,
        "accuracy": 0.73,
        "brier_score": 0.174,
        "ece": 0.141,
        "cf_robustness_drop": 0.228,
        "description": "AST graph improves structural comprehension but retains shortcut vulnerability without contrastive regularizer."
      },
      "created_at": "2026-10-07T05:38:16.644594"
    },
    {
      "id": 3,
      "experiment_name": "EXP-003: Robust-Only Ablation",
      "model_family": "robust_only",
      "dataset_version": "v1.0-benchmark-test",
      "configuration": {
        "model": "Text+CF-Contrastive",
        "epochs": 20,
        "learning_rate": 0.0005,
        "lambda_cf": 0.35
      },
      "seed": 42,
      "metrics": {
        "auc": 0.718,
        "f1": 0.662,
        "accuracy": 0.705,
        "brier_score": 0.189,
        "ece": 0.155,
        "cf_robustness_drop": 0.145,
        "description": "Counterfactual training improves shortcut resistance but lacks rich graph structure."
      },
      "created_at": "2026-10-07T05:38:16.644597"
    },
    {
      "id": 4,
      "experiment_name": "EXP-004: Proposed Combined Model",
      "model_family": "proposed_combined",
      "dataset_version": "v1.0-benchmark-test",
      "configuration": {
        "model": "GATv2+AST+CF-Contrastive",
        "epochs": 20,
        "learning_rate": 0.0005,
        "lambda_cf": 0.35,
        "temperature_scaled": true
      },
      "seed": 42,
      "metrics": {
        "auc": 0.812,
        "f1": 0.774,
        "accuracy": 0.805,
        "brier_score": 0.128,
        "ece": 0.068,
        "cf_robustness_drop": 0.082,
        "description": "Proposed architecture achieves superior discrimination, well-calibrated confidence (ECE: 0.068), and high counterfactual robustness."
      },
      "created_at": "2026-10-07T05:38:16.644599"
    }
  ],
  "commit_details": {
    "1a8e34f2b5c67890123456789abcdef01234567d": {
      "id": 5,
      "sha": "1a8e34f2b5c67890123456789abcdef01234567d",
      "parent_sha": "4c9d12e3f4a567890123456789abcdef01234567c",
      "message": "docs: update API documentation and OpenAPI configuration schema",
      "author": "dev-eve@example.com",
      "timestamp": "2026-10-04T10:10:00",
      "diff_content": "diff --git a/docs/config.json b/docs/config.json\n--- a/docs/config.json\n+++ b/docs/config.json\n@@ -1,4 +1,5 @@\n {\n-  \"version\": \"1.0.0\"\n+  \"version\": \"1.1.0\",\n+  \"title\": \"API Reference\"\n }\n",
      "files_changed": 1,
      "additions": 2,
      "deletions": 1,
      "ground_truth_label": 0,
      "prediction": {
        "model_version": "gat-v2-cf-contrastive",
        "raw_score": 0.5083,
        "calibrated_score": 0.506,
        "risk_category": "medium",
        "created_at": "2026-10-07T05:38:16.637711"
      },
      "code_regions": [
        {
          "id": 5,
          "file_path": "docs/config.json",
          "ast_node_id": "hunk_1",
          "node_type": "hunk",
          "start_line": 1,
          "end_line": 5,
          "start_col": 0,
          "end_col": 0,
          "evidence_score": 0.5,
          "code_snippet": "  \"version\": \"1.1.0\",\n  \"title\": \"API Reference\"",
          "explanation_note": "Influential hunk region with model attention weight 0.5."
        }
      ],
      "counterfactuals": [
        {
          "id": 13,
          "recipe": "polarity_invert",
          "seed": 42,
          "validation_status": "valid",
          "similarity_score": 1.0,
          "generated_diff": "diff --git a/docs/config.json b/docs/config.json\n--- a/docs/config.json\n+++ b/docs/config.json\n@@ -1,4 +1,5 @@\n {\n+  \"version\": \"1.0.0\"\n-  \"version\": \"1.1.0\",\n-  \"title\": \"API Reference\"\n }"
        },
        {
          "id": 14,
          "recipe": "condition_flip",
          "seed": 42,
          "validation_status": "invalid_invalid_syntax",
          "similarity_score": 0.0,
          "generated_diff": "diff --git a/docs/config.json b/docs/config.json\n--- a/docs/config.json\n+++ b/docs/config.json\n@@ -1,4 +1,5 @@\n {\n-  \"version\": \"1.0.0\"\n+  \"version\": \"1.1.1\",\n+  \"title\": \"API Reference\"\n }"
        },
        {
          "id": 15,
          "recipe": "rename_vars",
          "seed": 42,
          "validation_status": "invalid_invalid_syntax",
          "similarity_score": 0.0,
          "generated_diff": "diff --git a/docs/config.json b/docs/config.json\n--- a/docs/config.json\n+++ b/docs/config.json\n@@ -1,4 +1,5 @@\n {\n-  \"version_renamed_13\": \"1.0.0\"\n+  \"version_renamed_13\": \"1.1.0\",\n+  \"title_renamed_91\": \"API Reference_renamed_24\"\n }"
        }
      ],
      "diff_graph": {
        "nodes": [
          {
            "id": "file_0",
            "label": "File: docs/config.json",
            "node_type": "file",
            "modification_type": "modify",
            "file_path": "docs/config.json",
            "start_line": 1,
            "end_line": 1,
            "start_col": 0,
            "end_col": 0,
            "code_text": "docs/config.json",
            "evidence_score": 0.5
          },
          {
            "id": "hunk_1",
            "label": "Hunk 1: L1-6",
            "node_type": "hunk",
            "modification_type": "modify",
            "file_path": "docs/config.json",
            "start_line": 1,
            "end_line": 5,
            "start_col": 0,
            "end_col": 0,
            "code_text": "  \"version\": \"1.1.0\",\n  \"title\": \"API Reference\"",
            "evidence_score": 0.5
          }
        ],
        "edges": [
          {
            "source": "file_0",
            "target": "hunk_1",
            "edge_type": "ast_child",
            "weight": 1.0
          }
        ],
        "metadata": {
          "commit_sha": "1a8e34f2b5c67890123456789abcdef01234567d",
          "node_count": 2,
          "edge_count": 1,
          "file_count": 1
        }
      }
    },
    "4c9d12e3f4a567890123456789abcdef01234567c": {
      "id": 4,
      "sha": "4c9d12e3f4a567890123456789abcdef01234567c",
      "parent_sha": "7b3c21a4d5e67890123456789abcdef01234567b",
      "message": "perf: remove redundant bounds checking in high-frequency matrix loop",
      "author": "dev-dan@example.com",
      "timestamp": "2026-10-03T16:04:00",
      "diff_content": "diff --git a/compute/matrix.py b/compute/matrix.py\n--- a/compute/matrix.py\n+++ b/compute/matrix.py\n@@ -30,6 +30,4 @@ def multiply_block(matrix_a, matrix_b, size):\n     for i in range(size):\n-        if i >= len(matrix_a):\n-            break\n         for j in range(size):\n             total += matrix_a[i] * matrix_b[j]\n",
      "files_changed": 1,
      "additions": 0,
      "deletions": 2,
      "ground_truth_label": 1,
      "prediction": {
        "model_version": "gat-v2-cf-contrastive",
        "raw_score": 0.5088,
        "calibrated_score": 0.5064,
        "risk_category": "medium",
        "created_at": "2026-10-07T05:38:16.624572"
      },
      "code_regions": [
        {
          "id": 4,
          "file_path": "compute/matrix.py",
          "ast_node_id": "hunk_1",
          "node_type": "hunk",
          "start_line": 30,
          "end_line": 33,
          "start_col": 0,
          "end_col": 0,
          "evidence_score": 0.5,
          "code_snippet": "        if i >= len(matrix_a):\n            break",
          "explanation_note": "Influential hunk region with model attention weight 0.5."
        }
      ],
      "counterfactuals": [
        {
          "id": 10,
          "recipe": "polarity_invert",
          "seed": 42,
          "validation_status": "valid",
          "similarity_score": 0.931,
          "generated_diff": "diff --git a/compute/matrix.py b/compute/matrix.py\n--- a/compute/matrix.py\n+++ b/compute/matrix.py\n@@ -30,6 +30,4 @@ def multiply_block(matrix_a, matrix_b, size):\n     for i in range(size):\n+        if i >= len(matrix_a):\n+            break\n         for j in range(size):\n             total += matrix_a[i] * matrix_b[j]"
        },
        {
          "id": 11,
          "recipe": "condition_flip",
          "seed": 42,
          "validation_status": "invalid_identical_no_perturbation",
          "similarity_score": 1.0,
          "generated_diff": "diff --git a/compute/matrix.py b/compute/matrix.py\n--- a/compute/matrix.py\n+++ b/compute/matrix.py\n@@ -30,6 +30,4 @@ def multiply_block(matrix_a, matrix_b, size):\n     for i in range(size):\n-        if i >= len(matrix_a):\n-            break\n         for j in range(size):\n             total += matrix_a[i] * matrix_b[j]"
        },
        {
          "id": 12,
          "recipe": "rename_vars",
          "seed": 42,
          "validation_status": "valid",
          "similarity_score": 0.8065,
          "generated_diff": "diff --git a/compute/matrix.py b/compute/matrix.py\n--- a/compute/matrix.py\n+++ b/compute/matrix.py\n@@ -30,6 +30,4 @@ def multiply_block(matrix_a, matrix_b, size):\n     for i in range(size):\n-        if i >= len(matrix_a_renamed_91):\n-            break_renamed_24\n         for j in range(size):\n             total += matrix_a_renamed_91[i] * matrix_b[j]"
        }
      ],
      "diff_graph": {
        "nodes": [
          {
            "id": "file_0",
            "label": "File: compute/matrix.py",
            "node_type": "file",
            "modification_type": "modify",
            "file_path": "compute/matrix.py",
            "start_line": 1,
            "end_line": 1,
            "start_col": 0,
            "end_col": 0,
            "code_text": "compute/matrix.py",
            "evidence_score": 0.0
          },
          {
            "id": "hunk_1",
            "label": "Hunk 1: L30-34",
            "node_type": "hunk",
            "modification_type": "delete",
            "file_path": "compute/matrix.py",
            "start_line": 30,
            "end_line": 33,
            "start_col": 0,
            "end_col": 0,
            "code_text": "        if i >= len(matrix_a):\n            break",
            "evidence_score": 0.5
          },
          {
            "id": "loop_2",
            "label": "Loop: for",
            "node_type": "loop",
            "modification_type": "delete",
            "file_path": "compute/matrix.py",
            "start_line": 30,
            "end_line": 32,
            "start_col": 4,
            "end_col": 46,
            "code_text": "for i in range(size):\n        for j in range(size):\n            total += matrix_a[i] * matrix_b[j]",
            "evidence_score": 0.5
          },
          {
            "id": "call_3",
            "label": "Call: range",
            "node_type": "call",
            "modification_type": "delete",
            "file_path": "compute/matrix.py",
            "start_line": 30,
            "end_line": 30,
            "start_col": 13,
            "end_col": 24,
            "code_text": "range(size)",
            "evidence_score": 0.5
          },
          {
            "id": "loop_4",
            "label": "Loop: for",
            "node_type": "loop",
            "modification_type": "delete",
            "file_path": "compute/matrix.py",
            "start_line": 31,
            "end_line": 32,
            "start_col": 8,
            "end_col": 46,
            "code_text": "for j in range(size):\n            total += matrix_a[i] * matrix_b[j]",
            "evidence_score": 0.5
          },
          {
            "id": "call_5",
            "label": "Call: range",
            "node_type": "call",
            "modification_type": "delete",
            "file_path": "compute/matrix.py",
            "start_line": 31,
            "end_line": 31,
            "start_col": 17,
            "end_col": 28,
            "code_text": "range(size)",
            "evidence_score": 0.5
          }
        ],
        "edges": [
          {
            "source": "file_0",
            "target": "hunk_1",
            "edge_type": "ast_child",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "loop_2",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "loop_2",
            "target": "hunk_1",
            "edge_type": "control_flow",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "call_3",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_3",
            "edge_type": "call",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "loop_4",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "loop_4",
            "target": "hunk_1",
            "edge_type": "control_flow",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "call_5",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_5",
            "edge_type": "call",
            "weight": 0.9
          }
        ],
        "metadata": {
          "commit_sha": "4c9d12e3f4a567890123456789abcdef01234567c",
          "node_count": 6,
          "edge_count": 9,
          "file_count": 1
        }
      }
    },
    "7b3c21a4d5e67890123456789abcdef01234567b": {
      "id": 3,
      "sha": "7b3c21a4d5e67890123456789abcdef01234567b",
      "parent_sha": "e2a14bc5d67890123456789abcdef0123456789a",
      "message": "feat: add payment gateway webhook idempotency verification",
      "author": "dev-carol@example.com",
      "timestamp": "2026-10-02T11:42:00",
      "diff_content": "diff --git a/billing/webhook.py b/billing/webhook.py\n--- a/billing/webhook.py\n+++ b/billing/webhook.py\n@@ -18,6 +18,10 @@ def handle_event(event_id, payload):\n+    if redis_client.exists(f'event:{event_id}'):\n+        logger.info('Duplicate event skipped', extra={'event_id': event_id})\n+        return {'status': 'ignored'}\n+    redis_client.setex(f'event:{event_id}', 86400, 'processed')\n     process_transaction(payload)\n     return {'status': 'processed'}\n",
      "files_changed": 1,
      "additions": 4,
      "deletions": 0,
      "ground_truth_label": 0,
      "prediction": {
        "model_version": "gat-v2-cf-contrastive",
        "raw_score": 0.5074,
        "calibrated_score": 0.5054,
        "risk_category": "medium",
        "created_at": "2026-10-07T05:38:16.611787"
      },
      "code_regions": [
        {
          "id": 3,
          "file_path": "billing/webhook.py",
          "ast_node_id": "hunk_1",
          "node_type": "hunk",
          "start_line": 18,
          "end_line": 27,
          "start_col": 0,
          "end_col": 0,
          "evidence_score": 0.5,
          "code_snippet": "    if redis_client.exists(f'event:{event_id}'):\n        logger.info('Duplicate event skipped', extra={'event_id': event_id})\n        return {'status': 'ignored'}\n    redis_client.setex(f'event:{event_id}', 86400, 'processed')",
          "explanation_note": "Influential hunk region with model attention weight 0.5."
        }
      ],
      "counterfactuals": [
        {
          "id": 7,
          "recipe": "polarity_invert",
          "seed": 42,
          "validation_status": "valid",
          "similarity_score": 0.931,
          "generated_diff": "diff --git a/billing/webhook.py b/billing/webhook.py\n--- a/billing/webhook.py\n+++ b/billing/webhook.py\n@@ -18,6 +18,10 @@ def handle_event(event_id, payload):\n-    if redis_client.exists(f'event:{event_id}'):\n-        logger.info('Duplicate event skipped', extra={'event_id': event_id})\n-        return {'status': 'ignored'}\n-    redis_client.setex(f'event:{event_id}', 86400, 'processed')\n     process_transaction(payload)\n     return {'status': 'processed'}"
        },
        {
          "id": 8,
          "recipe": "condition_flip",
          "seed": 42,
          "validation_status": "valid",
          "similarity_score": 0.931,
          "generated_diff": "diff --git a/billing/webhook.py b/billing/webhook.py\n--- a/billing/webhook.py\n+++ b/billing/webhook.py\n@@ -18,6 +18,10 @@ def handle_event(event_id, payload):\n+    if redis_client.exists(f'event:{event_id}'):\n+        logger.info('Duplicate event skipped', extra={'event_id': event_id})\n+        return {'status': 'ignored'}\n+    redis_client.setex(f'event:{event_id}', 86410, 'processed')\n     process_transaction(payload)\n     return {'status': 'processed'}"
        },
        {
          "id": 9,
          "recipe": "rename_vars",
          "seed": 42,
          "validation_status": "valid",
          "similarity_score": 0.4359,
          "generated_diff": "diff --git a/billing/webhook.py b/billing/webhook.py\n--- a/billing/webhook.py\n+++ b/billing/webhook.py\n@@ -18,6 +18,10 @@ def handle_event(event_id, payload):\n+    if redis_client_renamed_38.exists_renamed_91(f'event_renamed_45:{event_id_renamed_21}'):\n+        logger_renamed_24.info_renamed_79('Duplicate_renamed_41 event_renamed_45 skipped_renamed_64', extra_renamed_27={'event_id_renamed_21': event_id_renamed_21})\n+        return {'status_renamed_13': 'ignored_renamed_23'}\n+    redis_client_renamed_38.setex_renamed_96(f'event_renamed_45:{event_id_renamed_21}', 86400, 'processed_renamed_85')\n     process_transaction(payload)\n     return {'status_renamed_13': 'processed_renamed_85'}"
        }
      ],
      "diff_graph": {
        "nodes": [
          {
            "id": "file_0",
            "label": "File: billing/webhook.py",
            "node_type": "file",
            "modification_type": "modify",
            "file_path": "billing/webhook.py",
            "start_line": 1,
            "end_line": 1,
            "start_col": 0,
            "end_col": 0,
            "code_text": "billing/webhook.py",
            "evidence_score": 0.0
          },
          {
            "id": "hunk_1",
            "label": "Hunk 1: L18-28",
            "node_type": "hunk",
            "modification_type": "add",
            "file_path": "billing/webhook.py",
            "start_line": 18,
            "end_line": 27,
            "start_col": 0,
            "end_col": 0,
            "code_text": "    if redis_client.exists(f'event:{event_id}'):\n        logger.info('Duplicate event skipped', extra={'event_id': event_id})\n        return {'status': 'ignored'}\n    redis_client.setex(f'event:{event_id}', 86400, 'processed')",
            "evidence_score": 0.5
          },
          {
            "id": "branch_2",
            "label": "Branch: if",
            "node_type": "branch",
            "modification_type": "add",
            "file_path": "billing/webhook.py",
            "start_line": 18,
            "end_line": 20,
            "start_col": 4,
            "end_col": 36,
            "code_text": "if redis_client.exists(f'event:{event_id}'):\n        logger.info('Duplicate event skipped', extra={'event_id': event_id})\n        return {'status': 'ignored'}",
            "evidence_score": 0.5
          },
          {
            "id": "call_3",
            "label": "Call: redis_client.exists",
            "node_type": "call",
            "modification_type": "add",
            "file_path": "billing/webhook.py",
            "start_line": 18,
            "end_line": 18,
            "start_col": 7,
            "end_col": 47,
            "code_text": "redis_client.exists(f'event:{event_id}')",
            "evidence_score": 0.5
          },
          {
            "id": "call_4",
            "label": "Call: logger.info",
            "node_type": "call",
            "modification_type": "add",
            "file_path": "billing/webhook.py",
            "start_line": 19,
            "end_line": 19,
            "start_col": 8,
            "end_col": 76,
            "code_text": "logger.info('Duplicate event skipped', extra={'event_id': event_id})",
            "evidence_score": 0.5
          },
          {
            "id": "statement_5",
            "label": "Statement: return_statement",
            "node_type": "statement",
            "modification_type": "add",
            "file_path": "billing/webhook.py",
            "start_line": 20,
            "end_line": 20,
            "start_col": 8,
            "end_col": 36,
            "code_text": "return {'status': 'ignored'}",
            "evidence_score": 0.5
          },
          {
            "id": "call_6",
            "label": "Call: redis_client.setex",
            "node_type": "call",
            "modification_type": "add",
            "file_path": "billing/webhook.py",
            "start_line": 21,
            "end_line": 21,
            "start_col": 4,
            "end_col": 63,
            "code_text": "redis_client.setex(f'event:{event_id}', 86400, 'processed')",
            "evidence_score": 0.5
          },
          {
            "id": "call_7",
            "label": "Call: process_transaction",
            "node_type": "call",
            "modification_type": "add",
            "file_path": "billing/webhook.py",
            "start_line": 22,
            "end_line": 22,
            "start_col": 4,
            "end_col": 32,
            "code_text": "process_transaction(payload)",
            "evidence_score": 0.5
          },
          {
            "id": "statement_8",
            "label": "Statement: return_statement",
            "node_type": "statement",
            "modification_type": "add",
            "file_path": "billing/webhook.py",
            "start_line": 23,
            "end_line": 23,
            "start_col": 4,
            "end_col": 34,
            "code_text": "return {'status': 'processed'}",
            "evidence_score": 0.5
          }
        ],
        "edges": [
          {
            "source": "file_0",
            "target": "hunk_1",
            "edge_type": "ast_child",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "branch_2",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "branch_2",
            "target": "hunk_1",
            "edge_type": "control_flow",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "call_3",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_3",
            "edge_type": "call",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "call_4",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_4",
            "edge_type": "call",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "statement_5",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_6",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_6",
            "edge_type": "call",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "call_7",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_7",
            "edge_type": "call",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "statement_8",
            "edge_type": "diff_align",
            "weight": 1.0
          }
        ],
        "metadata": {
          "commit_sha": "7b3c21a4d5e67890123456789abcdef01234567b",
          "node_count": 9,
          "edge_count": 13,
          "file_count": 1
        }
      }
    },
    "e2a14bc5d67890123456789abcdef0123456789a": {
      "id": 2,
      "sha": "e2a14bc5d67890123456789abcdef0123456789a",
      "parent_sha": "9f8a12c4b5e67890123456789abcdef012345678",
      "message": "refactor: simplify database connection pooling and retry timeout",
      "author": "dev-bob@example.com",
      "timestamp": "2026-10-01T09:15:00",
      "diff_content": "diff --git a/database/pool.py b/database/pool.py\n--- a/database/pool.py\n+++ b/database/pool.py\n@@ -45,7 +45,5 @@ class ConnectionPool:\n     def acquire(self):\n-        while not self.queue.empty():\n-            conn = self.queue.get()\n-            if conn.is_alive():\n-                return conn\n+        conn = self.queue.get_nowait()\n         return self.create_connection()\n",
      "files_changed": 1,
      "additions": 1,
      "deletions": 4,
      "ground_truth_label": 1,
      "prediction": {
        "model_version": "gat-v2-cf-contrastive",
        "raw_score": 0.51,
        "calibrated_score": 0.5072,
        "risk_category": "medium",
        "created_at": "2026-10-07T05:38:16.594038"
      },
      "code_regions": [
        {
          "id": 2,
          "file_path": "database/pool.py",
          "ast_node_id": "hunk_1",
          "node_type": "hunk",
          "start_line": 45,
          "end_line": 49,
          "start_col": 0,
          "end_col": 0,
          "evidence_score": 0.5,
          "code_snippet": "        conn = self.queue.get_nowait()",
          "explanation_note": "Influential hunk region with model attention weight 0.5."
        }
      ],
      "counterfactuals": [
        {
          "id": 4,
          "recipe": "polarity_invert",
          "seed": 42,
          "validation_status": "valid",
          "similarity_score": 1.0,
          "generated_diff": "diff --git a/database/pool.py b/database/pool.py\n--- a/database/pool.py\n+++ b/database/pool.py\n@@ -45,7 +45,5 @@ class ConnectionPool:\n     def acquire(self):\n+        while not self.queue.empty():\n+            conn = self.queue.get()\n+            if conn.is_alive():\n+                return conn\n-        conn = self.queue.get_nowait()\n         return self.create_connection()"
        },
        {
          "id": 5,
          "recipe": "condition_flip",
          "seed": 42,
          "validation_status": "invalid_identical_no_perturbation",
          "similarity_score": 1.0,
          "generated_diff": "diff --git a/database/pool.py b/database/pool.py\n--- a/database/pool.py\n+++ b/database/pool.py\n@@ -45,7 +45,5 @@ class ConnectionPool:\n     def acquire(self):\n-        while not self.queue.empty():\n-            conn = self.queue.get()\n-            if conn.is_alive():\n-                return conn\n+        conn = self.queue.get_nowait()\n         return self.create_connection()"
        },
        {
          "id": 6,
          "recipe": "rename_vars",
          "seed": 42,
          "validation_status": "valid",
          "similarity_score": 0.625,
          "generated_diff": "diff --git a/database/pool.py b/database/pool.py\n--- a/database/pool.py\n+++ b/database/pool.py\n@@ -45,7 +45,5 @@ class ConnectionPool:\n     def acquire(self):\n-        while_renamed_24 not self.queue_renamed_45.empty_renamed_13():\n-            conn_renamed_38 = self.queue_renamed_45.get()\n-            if conn_renamed_38.is_alive_renamed_41():\n-                return conn_renamed_38\n+        conn_renamed_38 = self.queue_renamed_45.get_nowait_renamed_91()\n         return self.create_connection()"
        }
      ],
      "diff_graph": {
        "nodes": [
          {
            "id": "file_0",
            "label": "File: database/pool.py",
            "node_type": "file",
            "modification_type": "modify",
            "file_path": "database/pool.py",
            "start_line": 1,
            "end_line": 1,
            "start_col": 0,
            "end_col": 0,
            "code_text": "database/pool.py",
            "evidence_score": 0.0
          },
          {
            "id": "hunk_1",
            "label": "Hunk 1: L45-50",
            "node_type": "hunk",
            "modification_type": "modify",
            "file_path": "database/pool.py",
            "start_line": 45,
            "end_line": 49,
            "start_col": 0,
            "end_col": 0,
            "code_text": "        conn = self.queue.get_nowait()",
            "evidence_score": 0.5
          },
          {
            "id": "function_2",
            "label": "Function: acquire",
            "node_type": "function",
            "modification_type": "modify",
            "file_path": "database/pool.py",
            "start_line": 45,
            "end_line": 47,
            "start_col": 4,
            "end_col": 39,
            "code_text": "def acquire(self):\n        conn = self.queue.get_nowait()\n        return self.create_connection()",
            "evidence_score": 0.5
          },
          {
            "id": "statement_3",
            "label": "Statement: assignment",
            "node_type": "statement",
            "modification_type": "modify",
            "file_path": "database/pool.py",
            "start_line": 46,
            "end_line": 46,
            "start_col": 8,
            "end_col": 38,
            "code_text": "conn = self.queue.get_nowait()",
            "evidence_score": 0.5
          },
          {
            "id": "call_4",
            "label": "Call: self.queue.get_nowait",
            "node_type": "call",
            "modification_type": "modify",
            "file_path": "database/pool.py",
            "start_line": 46,
            "end_line": 46,
            "start_col": 15,
            "end_col": 38,
            "code_text": "self.queue.get_nowait()",
            "evidence_score": 0.5
          },
          {
            "id": "statement_5",
            "label": "Statement: return_statement",
            "node_type": "statement",
            "modification_type": "modify",
            "file_path": "database/pool.py",
            "start_line": 47,
            "end_line": 47,
            "start_col": 8,
            "end_col": 39,
            "code_text": "return self.create_connection()",
            "evidence_score": 0.5
          },
          {
            "id": "call_6",
            "label": "Call: self.create_connection",
            "node_type": "call",
            "modification_type": "modify",
            "file_path": "database/pool.py",
            "start_line": 47,
            "end_line": 47,
            "start_col": 15,
            "end_col": 39,
            "code_text": "self.create_connection()",
            "evidence_score": 0.5
          }
        ],
        "edges": [
          {
            "source": "file_0",
            "target": "hunk_1",
            "edge_type": "ast_child",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "function_2",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "statement_3",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_4",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_4",
            "edge_type": "call",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "statement_5",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_6",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_6",
            "edge_type": "call",
            "weight": 0.9
          }
        ],
        "metadata": {
          "commit_sha": "e2a14bc5d67890123456789abcdef0123456789a",
          "node_count": 7,
          "edge_count": 8,
          "file_count": 1
        }
      }
    },
    "9f8a12c4b5e67890123456789abcdef012345678": {
      "id": 1,
      "sha": "9f8a12c4b5e67890123456789abcdef012345678",
      "parent_sha": "8e7b01b3a4d567890123456789abcdef01234567",
      "message": "fix: sanitize auth token and prevent null pointer in session lookup",
      "author": "dev-alice@example.com",
      "timestamp": "2026-09-28T14:32:00",
      "diff_content": "diff --git a/services/auth.py b/services/auth.py\n--- a/services/auth.py\n+++ b/services/auth.py\n@@ -12,5 +12,8 @@ def authenticate_request(headers):\n     token = headers.get('Authorization')\n-    user = db.get_user(token)\n+    if not token:\n+        raise AuthenticationError('Missing token')\n+    clean_token = token.strip()\n+    user = db.get_user(clean_token)\n     return user\n",
      "files_changed": 1,
      "additions": 4,
      "deletions": 1,
      "ground_truth_label": 0,
      "prediction": {
        "model_version": "gat-v2-cf-contrastive",
        "raw_score": 0.5091,
        "calibrated_score": 0.5066,
        "risk_category": "medium",
        "created_at": "2026-10-07T05:38:16.577471"
      },
      "code_regions": [
        {
          "id": 1,
          "file_path": "services/auth.py",
          "ast_node_id": "hunk_1",
          "node_type": "hunk",
          "start_line": 12,
          "end_line": 19,
          "start_col": 0,
          "end_col": 0,
          "evidence_score": 0.5,
          "code_snippet": "    if not token:\n        raise AuthenticationError('Missing token')\n    clean_token = token.strip()\n    user = db.get_user(clean_token)",
          "explanation_note": "Influential hunk region with model attention weight 0.5."
        }
      ],
      "counterfactuals": [
        {
          "id": 1,
          "recipe": "polarity_invert",
          "seed": 42,
          "validation_status": "valid",
          "similarity_score": 1.0,
          "generated_diff": "diff --git a/services/auth.py b/services/auth.py\n--- a/services/auth.py\n+++ b/services/auth.py\n@@ -12,5 +12,8 @@ def authenticate_request(headers):\n     token = headers.get('Authorization')\n+    user = db.get_user(token)\n-    if not token:\n-        raise AuthenticationError('Missing token')\n-    clean_token = token.strip()\n-    user = db.get_user(clean_token)\n     return user"
        },
        {
          "id": 2,
          "recipe": "condition_flip",
          "seed": 42,
          "validation_status": "invalid_identical_no_perturbation",
          "similarity_score": 1.0,
          "generated_diff": "diff --git a/services/auth.py b/services/auth.py\n--- a/services/auth.py\n+++ b/services/auth.py\n@@ -12,5 +12,8 @@ def authenticate_request(headers):\n     token = headers.get('Authorization')\n-    user = db.get_user(token)\n+    if not token:\n+        raise AuthenticationError('Missing token')\n+    clean_token = token.strip()\n+    user = db.get_user(clean_token)\n     return user"
        },
        {
          "id": 3,
          "recipe": "rename_vars",
          "seed": 42,
          "validation_status": "valid",
          "similarity_score": 0.4737,
          "generated_diff": "diff --git a/services/auth.py b/services/auth.py\n--- a/services/auth.py\n+++ b/services/auth.py\n@@ -12,5 +12,8 @@ def authenticate_request(headers):\n     token_renamed_27 = headers.get('Authorization')\n-    user_renamed_23 = db.get_user_renamed_41(token_renamed_27)\n+    if not token_renamed_27:\n+        raise_renamed_38 AuthenticationError_renamed_45('Missing_renamed_13 token_renamed_27')\n+    clean_token_renamed_91 = token_renamed_27.strip_renamed_24()\n+    user_renamed_23 = db.get_user_renamed_41(clean_token_renamed_91)\n     return user_renamed_23"
        }
      ],
      "diff_graph": {
        "nodes": [
          {
            "id": "file_0",
            "label": "File: services/auth.py",
            "node_type": "file",
            "modification_type": "modify",
            "file_path": "services/auth.py",
            "start_line": 1,
            "end_line": 1,
            "start_col": 0,
            "end_col": 0,
            "code_text": "services/auth.py",
            "evidence_score": 0.0
          },
          {
            "id": "hunk_1",
            "label": "Hunk 1: L12-20",
            "node_type": "hunk",
            "modification_type": "modify",
            "file_path": "services/auth.py",
            "start_line": 12,
            "end_line": 19,
            "start_col": 0,
            "end_col": 0,
            "code_text": "    if not token:\n        raise AuthenticationError('Missing token')\n    clean_token = token.strip()\n    user = db.get_user(clean_token)",
            "evidence_score": 0.5
          },
          {
            "id": "statement_2",
            "label": "Statement: assignment",
            "node_type": "statement",
            "modification_type": "modify",
            "file_path": "services/auth.py",
            "start_line": 12,
            "end_line": 12,
            "start_col": 4,
            "end_col": 40,
            "code_text": "token = headers.get('Authorization')",
            "evidence_score": 0.5
          },
          {
            "id": "call_3",
            "label": "Call: headers.get",
            "node_type": "call",
            "modification_type": "modify",
            "file_path": "services/auth.py",
            "start_line": 12,
            "end_line": 12,
            "start_col": 12,
            "end_col": 40,
            "code_text": "headers.get('Authorization')",
            "evidence_score": 0.5
          },
          {
            "id": "branch_4",
            "label": "Branch: if",
            "node_type": "branch",
            "modification_type": "modify",
            "file_path": "services/auth.py",
            "start_line": 13,
            "end_line": 14,
            "start_col": 4,
            "end_col": 50,
            "code_text": "if not token:\n        raise AuthenticationError('Missing token')",
            "evidence_score": 0.5
          },
          {
            "id": "call_5",
            "label": "Call: AuthenticationError",
            "node_type": "call",
            "modification_type": "modify",
            "file_path": "services/auth.py",
            "start_line": 14,
            "end_line": 14,
            "start_col": 14,
            "end_col": 50,
            "code_text": "AuthenticationError('Missing token')",
            "evidence_score": 0.5
          },
          {
            "id": "statement_6",
            "label": "Statement: assignment",
            "node_type": "statement",
            "modification_type": "modify",
            "file_path": "services/auth.py",
            "start_line": 15,
            "end_line": 15,
            "start_col": 4,
            "end_col": 31,
            "code_text": "clean_token = token.strip()",
            "evidence_score": 0.5
          },
          {
            "id": "call_7",
            "label": "Call: token.strip",
            "node_type": "call",
            "modification_type": "modify",
            "file_path": "services/auth.py",
            "start_line": 15,
            "end_line": 15,
            "start_col": 18,
            "end_col": 31,
            "code_text": "token.strip()",
            "evidence_score": 0.5
          },
          {
            "id": "statement_8",
            "label": "Statement: assignment",
            "node_type": "statement",
            "modification_type": "modify",
            "file_path": "services/auth.py",
            "start_line": 16,
            "end_line": 16,
            "start_col": 4,
            "end_col": 35,
            "code_text": "user = db.get_user(clean_token)",
            "evidence_score": 0.5
          },
          {
            "id": "call_9",
            "label": "Call: db.get_user",
            "node_type": "call",
            "modification_type": "modify",
            "file_path": "services/auth.py",
            "start_line": 16,
            "end_line": 16,
            "start_col": 11,
            "end_col": 35,
            "code_text": "db.get_user(clean_token)",
            "evidence_score": 0.5
          },
          {
            "id": "statement_10",
            "label": "Statement: return_statement",
            "node_type": "statement",
            "modification_type": "modify",
            "file_path": "services/auth.py",
            "start_line": 17,
            "end_line": 17,
            "start_col": 4,
            "end_col": 15,
            "code_text": "return user",
            "evidence_score": 0.5
          }
        ],
        "edges": [
          {
            "source": "file_0",
            "target": "hunk_1",
            "edge_type": "ast_child",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "statement_2",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_3",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_3",
            "edge_type": "call",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "branch_4",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "branch_4",
            "target": "hunk_1",
            "edge_type": "control_flow",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "call_5",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_5",
            "edge_type": "call",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "statement_6",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_7",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_7",
            "edge_type": "call",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "statement_8",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_9",
            "edge_type": "diff_align",
            "weight": 1.0
          },
          {
            "source": "hunk_1",
            "target": "call_9",
            "edge_type": "call",
            "weight": 0.9
          },
          {
            "source": "hunk_1",
            "target": "statement_10",
            "edge_type": "diff_align",
            "weight": 1.0
          }
        ],
        "metadata": {
          "commit_sha": "9f8a12c4b5e67890123456789abcdef012345678",
          "node_count": 11,
          "edge_count": 15,
          "file_count": 1
        }
      }
    }
  }
};
