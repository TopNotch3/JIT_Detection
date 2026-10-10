import re
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

try:
    import tree_sitter
    import tree_sitter_python
    import tree_sitter_javascript
    TREE_SITTER_AVAILABLE = True
except ImportError:
    TREE_SITTER_AVAILABLE = False

@dataclass
class ASTElement:
    kind: str          # function, branch, loop, call, assignment, return
    name: str          # identifier or label
    start_line: int    # 1-indexed
    end_line: int      # 1-indexed
    start_col: int
    end_col: int
    text: str
    children: List["ASTElement"]

class MultiLanguageASTParser:
    """Parses source code into structured AST elements across Python and JavaScript with tree-sitter."""

    def __init__(self):
        self.parsers = {}
        if TREE_SITTER_AVAILABLE:
            try:
                py_lang = tree_sitter.Language(tree_sitter_python.language())
                py_p = tree_sitter.Parser(py_lang)
                self.parsers["py"] = (py_p, "python")
            except Exception:
                pass

            try:
                js_lang = tree_sitter.Language(tree_sitter_javascript.language())
                js_p = tree_sitter.Parser(js_lang)
                self.parsers["js"] = (js_p, "javascript")
                self.parsers["ts"] = (js_p, "javascript")
                self.parsers["jsx"] = (js_p, "javascript")
                self.parsers["tsx"] = (js_p, "javascript")
            except Exception:
                pass

    def get_extension(self, file_path: str) -> str:
        parts = file_path.rsplit(".", 1)
        return parts[1].lower() if len(parts) > 1 else ""

    def parse_source(self, code_text: str, file_path: str) -> List[ASTElement]:
        ext = self.get_extension(file_path)
        if ext in self.parsers and TREE_SITTER_AVAILABLE:
            parser, lang_name = self.parsers[ext]
            try:
                source_bytes = code_text.encode("utf-8")
                tree = parser.parse(source_bytes)
                return self._extract_elements_tree_sitter(tree.root_node, source_bytes)
            except Exception:
                # Fall back to regex-based structural parser if tree-sitter fails on malformed code
                return self._fallback_regex_parse(code_text)
        else:
            return self._fallback_regex_parse(code_text)

    def _extract_elements_tree_sitter(self, root_node, source_bytes: bytes) -> List[ASTElement]:
        elements: List[ASTElement] = []

        def visit(node):
            node_type = node.type
            kind = None
            name = ""

            if node_type in ("function_definition", "function_declaration", "method_definition", "arrow_function"):
                kind = "function"
                # try to find identifier child
                for c in node.children:
                    if c.type in ("identifier", "property_identifier"):
                        name = source_bytes[c.start_byte:c.end_byte].decode("utf-8", errors="replace")
                        break
                if not name:
                    name = "anonymous_function"

            elif node_type in ("if_statement", "elif_clause", "else_clause", "switch_statement", "case_statement"):
                kind = "branch"
                name = node_type.replace("_statement", "").replace("_clause", "")

            elif node_type in ("for_statement", "while_statement", "for_in_statement"):
                kind = "loop"
                name = node_type.replace("_statement", "")

            elif node_type in ("call", "call_expression"):
                kind = "call"
                # get function being called
                if node.children:
                    name = source_bytes[node.children[0].start_byte:node.children[0].end_byte].decode("utf-8", errors="replace")
                else:
                    name = "call"

            elif node_type in ("return_statement", "assignment", "augmented_assignment_expression"):
                kind = "statement"
                name = node_type

            if kind:
                text = source_bytes[node.start_byte:node.end_byte].decode("utf-8", errors="replace")
                elem = ASTElement(
                    kind=kind,
                    name=name,
                    start_line=node.start_point.row + 1,
                    end_line=node.end_point.row + 1,
                    start_col=node.start_point.column,
                    end_col=node.end_point.column,
                    text=text[:300], # truncated preview for graph nodes
                    children=[]
                )
                elements.append(elem)

            for child in node.children:
                visit(child)

        visit(root_node)
        return elements

    def _fallback_regex_parse(self, code_text: str) -> List[ASTElement]:
        """Heuristic parser for when tree-sitter is unavailable or code is fragmented."""
        elements: List[ASTElement] = []
        lines = code_text.splitlines()

        for idx, line in enumerate(lines):
            line_num = idx + 1
            stripped = line.strip()

            # Function match
            func_m = re.match(r"^(?:def|async def|function)\s+([a-zA-Z0-9_]+)", stripped)
            if func_m:
                elements.append(ASTElement(
                    kind="function",
                    name=func_m.group(1),
                    start_line=line_num,
                    end_line=line_num,
                    start_col=0,
                    end_col=len(line),
                    text=stripped,
                    children=[]
                ))
                continue

            # Branch match
            branch_m = re.match(r"^(?:if|elif|else if|else|switch|case)\b", stripped)
            if branch_m:
                elements.append(ASTElement(
                    kind="branch",
                    name=stripped.split()[0],
                    start_line=line_num,
                    end_line=line_num,
                    start_col=0,
                    end_col=len(line),
                    text=stripped,
                    children=[]
                ))
                continue

            # Loop match
            loop_m = re.match(r"^(?:for|while)\b", stripped)
            if loop_m:
                elements.append(ASTElement(
                    kind="loop",
                    name=stripped.split()[0],
                    start_line=line_num,
                    end_line=line_num,
                    start_col=0,
                    end_col=len(line),
                    text=stripped,
                    children=[]
                ))
                continue

            # Call match
            call_m = re.search(r"([a-zA-Z0-9_]+)\s*\(", stripped)
            if call_m and call_m.group(1) not in ("if", "for", "while", "def", "class"):
                elements.append(ASTElement(
                    kind="call",
                    name=call_m.group(1),
                    start_line=line_num,
                    end_line=line_num,
                    start_col=0,
                    end_col=len(line),
                    text=stripped,
                    children=[]
                ))

        return elements
