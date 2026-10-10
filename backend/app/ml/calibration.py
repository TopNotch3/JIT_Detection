from typing import List, Tuple, Dict, Any
import numpy as np
import torch
import torch.nn as nn

class TemperatureCalibrator(nn.Module):
    """Post-hoc temperature scaling calibration module for binary risk probabilities."""

    def __init__(self, initial_temperature: float = 1.38):
        super().__init__()
        self.temperature = nn.Parameter(torch.tensor([initial_temperature], dtype=torch.float32))

    def forward(self, logits: torch.Tensor) -> torch.Tensor:
        """Scales logits and applies sigmoid."""
        temp = torch.clamp(self.temperature, min=0.1, max=10.0)
        return torch.sigmoid(logits / temp)

    def calibrate_scalar(self, logit: float) -> float:
        """Convenience method for a single scalar logit."""
        t = float(torch.clamp(self.temperature, min=0.1, max=10.0).item())
        scaled = logit / t
        # sigmoid
        prob = 1.0 / (1.0 + np.exp(-scaled))
        return float(prob)

    def fit(self, val_logits: torch.Tensor, val_targets: torch.Tensor, max_iter: int = 100):
        """Fits temperature on validation set via NLL loss minimization."""
        criterion = nn.BCEWithLogitsLoss()
        optimizer = torch.optim.LBFGS([self.temperature], lr=0.05, max_iter=max_iter)

        def eval_step():
            optimizer.zero_grad()
            temp = torch.clamp(self.temperature, min=0.1, max=10.0)
            scaled = val_logits / temp
            loss = criterion(scaled, val_targets.float())
            loss.backward()
            return loss

        optimizer.step(eval_step)

    @staticmethod
    def compute_ece(probs: np.ndarray, targets: np.ndarray, n_bins: int = 10) -> float:
        """Computes Expected Calibration Error (ECE)."""
        bin_limits = np.linspace(0.0, 1.0, n_bins + 1)
        ece = 0.0
        n_samples = len(probs)
        if n_samples == 0:
            return 0.0

        for i in range(n_bins):
            bin_lower = bin_limits[i]
            bin_upper = bin_limits[i + 1]

            in_bin = (probs >= bin_lower) & (probs < bin_upper) if i < n_bins - 1 else (probs >= bin_lower) & (probs <= bin_upper)
            bin_size = np.sum(in_bin)

            if bin_size > 0:
                bin_acc = np.mean(targets[in_bin])
                bin_conf = np.mean(probs[in_bin])
                ece += (bin_size / n_samples) * np.abs(bin_acc - bin_conf)

        return float(ece)

    @staticmethod
    def compute_brier_score(probs: np.ndarray, targets: np.ndarray) -> float:
        """Computes Mean Squared Error / Brier Score."""
        if len(probs) == 0:
            return 0.0
        return float(np.mean((probs - targets) ** 2))
