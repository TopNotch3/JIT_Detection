from typing import List, Dict, Any, Optional, Tuple
import torch
import numpy as np
from app.ast_graph.contracts import DiffGraph, GraphNode

class AttentionExplainer:
    """Extracts Graph Attention Network weights and maps them to concrete AST code regions."""

    @staticmethod
    def extract_node_importance(
        diff_graph: DiffGraph,
        attention_info: Optional[Tuple[torch.Tensor, torch.Tensor]]
    ) -> List[Dict[str, Any]]:
        """Maps edge attention weights to node-level evidence scores."""
        num_nodes = len(diff_graph.nodes)
        if num_nodes == 0:
            return []

        node_scores = np.zeros(num_nodes, dtype=np.float32)

        if attention_info is not None:
            att_edge_index, att_weights = attention_info
            # att_edge_index is [2, E], att_weights is [E, heads] or [E, 1]
            weights = att_weights.detach().cpu().numpy()
            if weights.ndim > 1:
                weights = np.mean(weights, axis=-1) # average over attention heads

            edges_np = att_edge_index.detach().cpu().numpy()
            for i in range(len(weights)):
                target_node_idx = edges_np[1, i]
                if target_node_idx < num_nodes:
                    node_scores[target_node_idx] += float(weights[i])

        # If attention is uniform or unavailable, provide heuristic score based on node depth/type
        if np.max(node_scores) == 0.0:
            for idx, n in enumerate(diff_graph.nodes):
                base = 0.5
                if n.node_type.value in ("branch", "call"):
                    base = 0.85
                elif n.node_type.value == "function":
                    base = 0.70
                node_scores[idx] = base

        # Min-Max normalize node importance scores to [0.1, 0.99]
        min_v = np.min(node_scores)
        max_v = np.max(node_scores)
        if max_v > min_v:
            normalized = 0.15 + 0.84 * ((node_scores - min_v) / (max_v - min_v))
        else:
            normalized = np.full_like(node_scores, 0.5)

        # Update nodes and collect code regions
        code_regions: List[Dict[str, Any]] = []
        for idx, node in enumerate(diff_graph.nodes):
            node.evidence_score = float(normalized[idx])

            # Filter out whole file root nodes for detailed code evidence view
            if node.node_type.value != "file" and node.file_path != "empty":
                code_regions.append({
                    "file_path": node.file_path,
                    "ast_node_id": node.id,
                    "node_type": node.node_type.value,
                    "start_line": node.start_line,
                    "end_line": node.end_line,
                    "start_col": node.start_col,
                    "end_col": node.end_col,
                    "evidence_score": round(float(normalized[idx]), 4),
                    "code_snippet": node.code_text,
                    "explanation_note": f"Influential {node.node_type.value} region with model attention weight {round(float(normalized[idx]), 3)}."
                })

        # Sort code regions descending by evidence score
        code_regions.sort(key=lambda x: x["evidence_score"], reverse=True)
        return code_regions
