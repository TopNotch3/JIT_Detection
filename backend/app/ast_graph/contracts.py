from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from enum import Enum

class NodeType(str, Enum):
    FILE = "file"
    FUNCTION = "function"
    BRANCH = "branch"      # if, elif, else, switch, case
    LOOP = "loop"          # for, while
    CALL = "call"          # function/method invocation
    STATEMENT = "statement"
    HUNK = "hunk"          # raw diff hunk node

class ModificationType(str, Enum):
    ADD = "add"
    DELETE = "delete"
    MODIFY = "modify"
    CONTEXT = "context"

class EdgeType(str, Enum):
    AST_CHILD = "ast_child"       # syntactic parent -> child
    CONTROL_FLOW = "control_flow" # branch / loop -> body or branch -> branch
    CALL = "call"                 # caller -> callee invocation
    DIFF_ALIGN = "diff_align"     # connects pre-image node to post-image counterpart
    DATA_FLOW = "data_flow"       # variable assignment -> variable usage

@dataclass
class GraphNode:
    id: str                       # e.g. "node_0"
    label: str                    # node human description or identifier name
    node_type: NodeType
    modification_type: ModificationType
    file_path: str
    start_line: int
    end_line: int
    start_col: int = 0
    end_col: int = 0
    code_text: str = ""
    evidence_score: float = 0.0   # assigned by explainability / attention layer

@dataclass
class GraphEdge:
    source: str                   # source node id
    target: str                   # target node id
    edge_type: EdgeType
    weight: float = 1.0

@dataclass
class DiffGraph:
    nodes: List[GraphNode] = field(default_factory=list)
    edges: List[GraphEdge] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "nodes": [
                {
                    "id": n.id,
                    "label": n.label,
                    "node_type": n.node_type.value,
                    "modification_type": n.modification_type.value,
                    "file_path": n.file_path,
                    "start_line": n.start_line,
                    "end_line": n.end_line,
                    "start_col": n.start_col,
                    "end_col": n.end_col,
                    "code_text": n.code_text,
                    "evidence_score": round(n.evidence_score, 4)
                }
                for n in self.nodes
            ],
            "edges": [
                {
                    "source": e.source,
                    "target": e.target,
                    "edge_type": e.edge_type.value,
                    "weight": round(e.weight, 4)
                }
                for e in self.edges
            ],
            "metadata": self.metadata
        }
