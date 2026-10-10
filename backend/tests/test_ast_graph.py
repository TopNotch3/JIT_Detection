import pytest
from app.ast_graph.tree_sitter_parser import MultiLanguageASTParser
from app.ast_graph.graph_builder import DiffGraphBuilder
from app.ingestion.parser import UnifiedDiffParser
from app.ast_graph.contracts import NodeType

def test_ast_parser_python():
    parser = MultiLanguageASTParser()
    code = """
def process_data(items):
    total = 0
    if len(items) > 0:
        total = sum(items)
    return total
"""
    elements = parser.parse_source(code, "example.py")
    assert len(elements) > 0
    kinds = [e.kind for e in elements]
    assert "function" in kinds
    assert "branch" in kinds

def test_diff_graph_builder():
    diff_text = """diff --git a/handler.py b/handler.py
--- a/handler.py
+++ b/handler.py
@@ -10,3 +10,4 @@ def handle():
     if status == 200:
+        print("Success")
         return True
"""
    parsed_diff = UnifiedDiffParser.parse(diff_text)
    builder = DiffGraphBuilder()
    graph = builder.build_graph(parsed_diff, commit_sha="test_sha_123")

    assert len(graph.nodes) >= 2 # File + Hunk + AST nodes
    assert len(graph.edges) >= 1
    node_types = [n.node_type for n in graph.nodes]
    assert NodeType.FILE in node_types
    assert NodeType.HUNK in node_types
