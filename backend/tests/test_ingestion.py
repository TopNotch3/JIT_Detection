import pytest
from app.ingestion.parser import UnifiedDiffParser
from app.ingestion.webhook import GitHubWebhookProcessor

SAMPLE_DIFF = """diff --git a/calc.py b/calc.py
--- a/calc.py
+++ b/calc.py
@@ -5,3 +5,4 @@ def add(a, b):
     return a + b
+def multiply(a, b):
+    return a * b
"""

def test_unified_diff_parser_hunks():
    parsed = UnifiedDiffParser.parse(SAMPLE_DIFF)
    assert len(parsed.files) == 1
    f = parsed.files[0]
    assert f.new_path == "calc.py"
    assert len(f.hunks) == 1
    h = f.hunks[0]
    assert h.new_start == 5
    assert len(h.added_lines) == 2
    assert "def multiply(a, b):" in h.added_lines[0]
    assert parsed.total_additions == 2

def test_webhook_hmac_signature():
    secret = "test_secret_123"
    body = b'{"ref": "refs/heads/main"}'
    import hmac, hashlib
    sig = "sha256=" + hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()

    assert GitHubWebhookProcessor.verify_signature(body, secret, sig) is True
    assert GitHubWebhookProcessor.verify_signature(body, secret, "sha256=invalid") is False
