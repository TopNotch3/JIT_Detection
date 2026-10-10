from typing import Tuple, Optional
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GATv2Conv, global_mean_pool, global_max_pool

class JITGraphAttentionNet(nn.Module):
    """Graph Attention Network for JIT Defect Prediction with attention extraction."""

    def __init__(self, in_channels: int = 64, hidden_channels: int = 64, out_channels: int = 1, heads: int = 2):
        super().__init__()
        self.gat1 = GATv2Conv(in_channels, hidden_channels, heads=heads, concat=True, dropout=0.1)
        self.gat2 = GATv2Conv(hidden_channels * heads, hidden_channels, heads=1, concat=False, dropout=0.1)

        # Commit message projection
        self.msg_fc = nn.Linear(in_channels, hidden_channels)

        # Classification head combining graph representation + commit message
        self.fc_classifier = nn.Sequential(
            nn.Linear(hidden_channels * 2 + hidden_channels, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, out_channels)
        )

    def forward(
        self,
        x: torch.Tensor,
        edge_index: torch.Tensor,
        batch: Optional[torch.Tensor] = None,
        msg_embed: Optional[torch.Tensor] = None,
        return_attention: bool = False
    ) -> Tuple[torch.Tensor, torch.Tensor, Optional[Tuple[torch.Tensor, torch.Tensor]]]:
        """Returns (logit, graph_embedding, attention_weights)."""
        if batch is None:
            batch = torch.zeros(x.size(0), dtype=torch.long, device=x.device)

        # GAT Layer 1
        h1 = self.gat1(x, edge_index)
        h1 = F.elu(h1)

        # GAT Layer 2 with attention weights
        if return_attention:
            h2, (att_edge_index, att_weights) = self.gat2(
                h1, edge_index, return_attention_weights=True
            )
            attention_info = (att_edge_index, att_weights)
        else:
            h2 = self.gat2(h1, edge_index)
            attention_info = None

        h2 = F.elu(h2)

        # Graph-level pooling (mean + max pooling for rich structural context)
        pool_mean = global_mean_pool(h2, batch)
        pool_max = global_max_pool(h2, batch)
        graph_repr = torch.cat([pool_mean, pool_max], dim=-1)

        # Text/Message representation
        if msg_embed is None:
            msg_embed = torch.zeros((graph_repr.size(0), self.msg_fc.in_features), device=x.device)
        msg_repr = F.relu(self.msg_fc(msg_embed))

        # Joint fused representation
        joint_repr = torch.cat([graph_repr, msg_repr], dim=-1)
        logit = self.fc_classifier(joint_repr).squeeze(-1)

        return logit, joint_repr, attention_info

class TextOnlyBaseline(nn.Module):
    """Text-only baseline model ignoring AST and graph structure."""

    def __init__(self, embed_dim: int = 64):
        super().__init__()
        self.fc = nn.Sequential(
            nn.Linear(embed_dim * 2, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 1)
        )

    def forward(self, code_embed: torch.Tensor, msg_embed: torch.Tensor) -> torch.Tensor:
        feat = torch.cat([code_embed, msg_embed], dim=-1)
        return self.fc(feat).squeeze(-1)
