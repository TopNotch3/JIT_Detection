from typing import Optional, Tuple, Dict
import torch
import torch.nn as nn
import torch.nn.functional as F

class CounterfactualJointLoss(nn.Module):
    """Combines binary cross-entropy classification loss with a counterfactual contrastive objective.
    Discourages shortcut learning by penalizing representation collapse on semantics-breaking pairs.
    """

    def __init__(self, lambda_contrastive: float = 0.35, margin: float = 0.5):
        super().__init__()
        self.bce = nn.BCEWithLogitsLoss()
        self.lambda_contrastive = lambda_contrastive
        self.margin = margin

    def forward(
        self,
        orig_logit: torch.Tensor,
        orig_target: torch.Tensor,
        orig_repr: torch.Tensor,
        cf_repr: Optional[torch.Tensor] = None,
        is_semantics_breaking: bool = True
    ) -> Tuple[torch.Tensor, Dict[str, float]]:
        """Computes combined loss."""
        cls_loss = self.bce(orig_logit, orig_target.float())

        if cf_repr is None:
            return cls_loss, {
                "total_loss": float(cls_loss.item()),
                "classification_loss": float(cls_loss.item()),
                "contrastive_loss": 0.0
            }

        # Normalize representations for cosine similarity
        z1 = F.normalize(orig_repr, p=2, dim=-1)
        z2 = F.normalize(cf_repr, p=2, dim=-1)
        cosine_sim = torch.sum(z1 * z2, dim=-1) # in range [-1, 1]

        if is_semantics_breaking:
            # Semantics are broken: Representations should NOT be identical
            # Penalize high cosine similarity (shortcut learning penalty)
            # Loss is higher when cosine similarity is above margin
            contrastive_loss = torch.mean(F.relu(cosine_sim - self.margin))
        else:
            # Control perturbation (e.g. variable rename): should be invariant
            contrastive_loss = torch.mean(1.0 - cosine_sim)

        total_loss = cls_loss + (self.lambda_contrastive * contrastive_loss)

        return total_loss, {
            "total_loss": float(total_loss.item()),
            "classification_loss": float(cls_loss.item()),
            "contrastive_loss": float(contrastive_loss.item())
        }
