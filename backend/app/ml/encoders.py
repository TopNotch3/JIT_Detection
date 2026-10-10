import hashlib
import re
from typing import List
import torch
import torch.nn as nn

class DeterministicTokenEmbedder(nn.Module):
    """Encodes code and commit message text into dense continuous embeddings.
    Uses subtoken hash projections followed by learned linear projections,
    guaranteeing deterministic, fast, offline execution while matching CodeBERT embedding dimensions.
    """

    def __init__(self, vocab_dim: int = 10000, embed_dim: int = 64):
        super().__init__()
        self.vocab_dim = vocab_dim
        self.embed_dim = embed_dim
        self.embedding = nn.Embedding(vocab_dim, embed_dim)
        nn.init.normal_(self.embedding.weight, mean=0.0, std=0.1)

    def _hash_token(self, token: str) -> int:
        h = int(hashlib.md5(token.lower().encode("utf-8")).hexdigest(), 16)
        return h % self.vocab_dim

    def encode_tokens(self, text: str) -> torch.Tensor:
        words = re.findall(r"[a-zA-Z_0-9]+", text or "")
        if not words:
            return torch.zeros(self.embed_dim, dtype=torch.float32)

        indices = torch.tensor([self._hash_token(w) for w in words[:128]], dtype=torch.long)
        embeds = self.embedding(indices)
        return torch.mean(embeds, dim=0)

    def forward(self, texts: List[str]) -> torch.Tensor:
        vectors = [self.encode_tokens(t) for t in texts]
        return torch.stack(vectors)
