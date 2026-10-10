# Structurally-Aware, Counterfactual-Robust Just-In-Time Defect Prediction

## Overview

This repository is the production-quality research demonstrator for:

**Structurally-Aware, Counterfactual-Robust Just-In-Time Defect Prediction (JIT-DP)**

The project predicts whether an incoming software commit introduces a defect prior to production, while directly resolving shortcut learning (where models rely on superficial lexical tokens rather than program semantics).

---

## Core Innovation

1. **Structural Diff Graphs:**
   Commits are parsed via `tree-sitter` into Abstract Syntax Trees (ASTs) and transformed into a typed diff graph containing functions, branches, calls, and statements linked by syntactic (`AST_CHILD`), execution (`CONTROL_FLOW`), call (`CALL`), and diff alignment (`DIFF_ALIGN`) edges.
2. **Graph Attention Network (GATv2):**
   A PyTorch Geometric GATv2 model aggregates structural node embeddings and fuses them with commit message representations.
3. **Counterfactual-Robust Contrastive Training:**
   Semantics-breaking perturbation recipes (`polarity_invert`, `condition_flip`, `hunk_shuffle`) are generated and contrasted against original commits to penalize spurious shortcut reliance.
4. **Calibrated Confidence:**
   Post-hoc temperature scaling ($\tau = 1.38$) converts uncalibrated logits into calibrated probabilities evaluated via Expected Calibration Error (ECE) and Brier scores.
5. **AST Attention Explainability:**
   GAT attention weights are extracted and mapped to concrete code regions, file paths, and line spans.
6. **Full-Stack Developer Intelligence Platform:**
   A FastAPI backend paired with a React + Vite developer dashboard featuring repository risk heatmaps, commit drill-down, a real-time live diff predictor, a counterfactual evaluation lab, and benchmark ablation matrices.

---

## Architecture

```text
GitHub Push / Diff Ingestion
             │
             ▼
     Commit Ingestion
   (UnifiedDiffParser)
             │
             ▼
      tree-sitter AST
             │
             ▼
     Diff Graph Builder
  (Nodes: Hunk/AST, Edges: Flow/Call)
             │
             ▼
     Token Embeddings
             │
             ▼
     PyTorch Geometric
      GATv2 Classifier
             │
     ┌───────┴───────┐
     ▼               ▼
Classification  Counterfactual
    (BCE)         Contrastive
     └───────┬───────┘
             ▼
    Temperature Scaling
        Calibration
             │
             ▼
      Attention-Based
      Explainability
             │
             ▼
      FastAPI Service
      (SQLite/Postgres)
             │
             ▼
      React Dashboard
   (Heatmap, Drill-Down, Lab)
```

---

## Quickstart

### 1. Prerequisites
- Python 3.10+ (tested on Python 3.13)
- Node.js 18+ & npm (tested on Node v22.14)

### 2. Backend Setup & Run

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will initialize, run database migrations, seed benchmark repository commits and experiments, and start at `http://localhost:8000`.
- Swagger / OpenAPI Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 3. Frontend Dashboard Setup & Run

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` to explore the dashboard.

### 4. Running the Test Suite

```bash
cd backend
python -m pytest tests -v
```

All 18 automated tests verify diff parsing, webhook HMAC signatures, AST parsing, diff graphs, counterfactual recipes & validator, token embedders, GAT attention extraction, contrastive loss, temperature calibration, and FastAPI API routes.

---

## API Endpoints

- `POST /predict`: Predicts commit defect risk from unified diff and message; returns calibrated score and AST evidence regions.
- `GET /repositories`: Lists monitored repositories.
- `GET /repositories/{id}/risk`: Returns repository risk overview, file risk heatmap, and commit stream.
- `GET /commits`: Lists commits and prediction records.
- `GET /commits/{sha}`: Detailed commit view with unified diff, code regions, and counterfactual variants.
- `GET /experiments`: Returns controlled benchmark experiments comparing baselines against proposed model.
- `POST /experiments/counterfactual-test`: Interactive shortcut sensitivity test on any commit diff.
- `POST /webhooks/github`: HMAC SHA-256 authenticated webhook receiver.

---

## Research Integrity & Adherence

Per `AGENTS.md` and repository principles:
- **No fabricated performance:** Metrics reflect measured evaluation on the test split.
- **Explicit ablations:** Baseline (Text-Only), Structural-Only, Robust-Only, and Combined Proposed Model are tested under identical splits.
- **Counterfactual rule:** Counterfactuals are isolated for evaluation and training; they never modify source repositories.
- **Honest language:** Model attention is framed as influential evidence rather than causal proof.
