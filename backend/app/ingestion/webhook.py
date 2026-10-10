import hmac
import hashlib
from typing import Dict, Any, Optional, Tuple

class GitHubWebhookProcessor:
    """Verifies HMAC SHA-256 signatures and extracts repository and commit payloads."""

    @staticmethod
    def verify_signature(payload_bytes: bytes, secret: str, signature_header: Optional[str]) -> bool:
        if not secret:
            return True # In development without secret configured
        if not signature_header:
            return False

        if not signature_header.startswith("sha256="):
            return False

        expected_sig = "sha256=" + hmac.new(
            secret.encode("utf-8"),
            msg=payload_bytes,
            digestmod=hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(expected_sig, signature_header)

    @staticmethod
    def parse_payload(data: Dict[str, Any]) -> Tuple[Optional[Dict[str, Any]], list]:
        """Extracts repository and commit metadata from a GitHub push webhook event."""
        repo_data = data.get("repository")
        commits_data = data.get("commits", [])

        if not repo_data:
            return None, []

        repo_info = {
            "external_id": str(repo_data.get("id", "")),
            "owner": repo_data.get("owner", {}).get("name") or repo_data.get("owner", {}).get("login", "unknown"),
            "name": repo_data.get("name", "unknown"),
            "default_branch": repo_data.get("default_branch", "main")
        }

        extracted_commits = []
        for c in commits_data:
            extracted_commits.append({
                "sha": c.get("id") or c.get("sha"),
                "message": c.get("message", ""),
                "author": c.get("author", {}).get("name", "unknown"),
                "timestamp": c.get("timestamp"),
                "added": c.get("added", []),
                "removed": c.get("removed", []),
                "modified": c.get("modified", [])
            })

        return repo_info, extracted_commits
