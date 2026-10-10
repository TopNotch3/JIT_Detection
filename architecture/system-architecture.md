# System Architecture

## Proposed end-to-end architecture

```text
GitHub Repository / Webhook
            |
            v
     Commit Ingestion
          FastAPI
            |
            v
   Pre/Post Source Extraction
            |
            v
      tree-sitter AST
            |
            v
     Diff Graph Builder
       /            \
      v              v
Graph Node Data   Commit Message
      |              |
      v              v
 CodeBERT Node/Text Encoding
             |
             v
      Graph Attention Network
             |
     +-------+--------+
     |                |
Classification   Contrastive Objective
     |                |
     +-------+--------+
             v
       Risk Prediction
             |
       Calibration
             |
       Explainability
             |
             v
        FastAPI API
             |
             v
       React Dashboard
             |
             v
 Repository Heatmap + Commit Drill-down
```

## Components

### Commit ingestion
FastAPI service receiving GitHub webhook events and retrieving historical commit information.

### AST parser
tree-sitter for multi-language parsing.

### Graph builder
Transforms changed source elements into a graph.

### Encoder
CodeBERT-based encoding of graph node content and commit-message text as defined by the proposal.

### GNN
Graph Attention Network using PyTorch Geometric.

### Training
Combined classification + counterfactual-contrastive objective.

### Calibration
Temperature scaling.

### Explainability
Attention/evidence mapped back to AST nodes.

### Serving
FastAPI prediction API.

### Dashboard
React + D3.js.

## Engineering principle

Each stage must have a clear input/output contract and independently testable implementation.
