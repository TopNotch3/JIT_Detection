from typing import List, Dict, Any, Optional
from app.ingestion.parser import ParsedCommitDiff, ParsedFileDiff, DiffHunk
from app.ast_graph.contracts import (
    DiffGraph, GraphNode, GraphEdge, NodeType, ModificationType, EdgeType
)
from app.ast_graph.tree_sitter_parser import MultiLanguageASTParser, ASTElement

class DiffGraphBuilder:
    """Builds a structural Diff Graph from parsed unified diffs and tree-sitter ASTs."""

    def __init__(self, parser: Optional[MultiLanguageASTParser] = None):
        self.parser = parser or MultiLanguageASTParser()

    def build_graph(self, commit_diff: ParsedCommitDiff, commit_sha: str = "") -> DiffGraph:
        nodes: List[GraphNode] = []
        edges: List[GraphEdge] = []
        node_id_counter = 0

        def next_id(prefix: str = "node") -> str:
            nonlocal node_id_counter
            nid = f"{prefix}_{node_id_counter}"
            node_id_counter += 1
            return nid

        for file_diff in commit_diff.files:
            file_path = file_diff.new_path or file_diff.old_path

            # 1. File Root Node
            file_node_id = next_id("file")
            file_mod = ModificationType.MODIFY
            if file_diff.is_new:
                file_mod = ModificationType.ADD
            elif file_diff.is_deleted:
                file_mod = ModificationType.DELETE

            file_node = GraphNode(
                id=file_node_id,
                label=f"File: {file_path}",
                node_type=NodeType.FILE,
                modification_type=file_mod,
                file_path=file_path,
                start_line=1,
                end_line=1,
                code_text=file_path
            )
            nodes.append(file_node)

            # 2. Extract AST elements from post-code (and pre-code if deleted)
            source_for_ast = file_diff.post_source if not file_diff.is_deleted else file_diff.pre_source
            ast_elements = self.parser.parse_source(source_for_ast, file_path)

            prev_hunk_id: Optional[str] = None

            # 3. Process Hunks
            for h_idx, hunk in enumerate(file_diff.hunks):
                hunk_node_id = next_id("hunk")
                hunk_mod = ModificationType.MODIFY
                if hunk.added_lines and not hunk.deleted_lines:
                    hunk_mod = ModificationType.ADD
                elif hunk.deleted_lines and not hunk.added_lines:
                    hunk_mod = ModificationType.DELETE

                hunk_preview = "\n".join(hunk.added_lines[:4] or hunk.deleted_lines[:4] or ["hunk"])
                hunk_node = GraphNode(
                    id=hunk_node_id,
                    label=f"Hunk {h_idx + 1}: L{hunk.new_start}-{hunk.new_start + max(1, hunk.new_length)}",
                    node_type=NodeType.HUNK,
                    modification_type=hunk_mod,
                    file_path=file_path,
                    start_line=hunk.new_start,
                    end_line=hunk.new_start + max(0, hunk.new_length - 1),
                    code_text=hunk_preview[:250]
                )
                nodes.append(hunk_node)

                # Edge from File -> Hunk
                edges.append(GraphEdge(
                    source=file_node_id,
                    target=hunk_node_id,
                    edge_type=EdgeType.AST_CHILD,
                    weight=1.0
                ))

                # Edge between consecutive hunks (Control/Sequential flow in diff)
                if prev_hunk_id:
                    edges.append(GraphEdge(
                        source=prev_hunk_id,
                        target=hunk_node_id,
                        edge_type=EdgeType.CONTROL_FLOW,
                        weight=0.8
                    ))
                prev_hunk_id = hunk_node_id

                # 4. Map AST elements overlapping this hunk
                hunk_start = hunk.new_start
                hunk_end = hunk.new_start + max(1, hunk.new_length)

                for ast_elem in ast_elements:
                    # Check overlap with hunk lines
                    if not (ast_elem.end_line < hunk_start or ast_elem.start_line > hunk_end):
                        elem_type = NodeType.STATEMENT
                        if ast_elem.kind == "function":
                            elem_type = NodeType.FUNCTION
                        elif ast_elem.kind == "branch":
                            elem_type = NodeType.BRANCH
                        elif ast_elem.kind == "loop":
                            elem_type = NodeType.LOOP
                        elif ast_elem.kind == "call":
                            elem_type = NodeType.CALL

                        ast_node_id = next_id(ast_elem.kind)
                        ast_node = GraphNode(
                            id=ast_node_id,
                            label=f"{ast_elem.kind.capitalize()}: {ast_elem.name or 'block'}",
                            node_type=elem_type,
                            modification_type=hunk_mod,
                            file_path=file_path,
                            start_line=ast_elem.start_line,
                            end_line=ast_elem.end_line,
                            start_col=ast_elem.start_col,
                            end_col=ast_elem.end_col,
                            code_text=ast_elem.text
                        )
                        nodes.append(ast_node)

                        # Edge from Hunk -> AST Node (Diff Alignment)
                        edges.append(GraphEdge(
                            source=hunk_node_id,
                            target=ast_node_id,
                            edge_type=EdgeType.DIFF_ALIGN,
                            weight=1.0
                        ))

                        # If it's a call or branch, add control/call edge
                        if elem_type in (NodeType.BRANCH, NodeType.LOOP):
                            edges.append(GraphEdge(
                                source=ast_node_id,
                                target=hunk_node_id,
                                edge_type=EdgeType.CONTROL_FLOW,
                                weight=0.9
                            ))
                        elif elem_type == NodeType.CALL:
                            edges.append(GraphEdge(
                                source=hunk_node_id,
                                target=ast_node_id,
                                edge_type=EdgeType.CALL,
                                weight=0.9
                            ))

        # Fallback if no nodes created (empty diff)
        if not nodes:
            fallback_id = next_id("empty")
            nodes.append(GraphNode(
                id=fallback_id,
                label="Empty Commit Diff",
                node_type=NodeType.HUNK,
                modification_type=ModificationType.CONTEXT,
                file_path="empty",
                start_line=1,
                end_line=1,
                code_text="empty"
            ))

        return DiffGraph(
            nodes=nodes,
            edges=edges,
            metadata={
                "commit_sha": commit_sha,
                "node_count": len(nodes),
                "edge_count": len(edges),
                "file_count": len(commit_diff.files)
            }
        )
