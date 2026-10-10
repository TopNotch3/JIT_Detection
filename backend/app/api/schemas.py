from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    diff: str = Field(..., description="Unified diff text of the commit")
    message: Optional[str] = Field("", description="Commit message")
    commit_sha: Optional[str] = Field("custom_sha", description="Commit SHA or identifier")
    repository_id: Optional[int] = Field(None, description="Optional repository id to associate and persist")

class CodeRegionSchema(BaseModel):
    file_path: str
    ast_node_id: Optional[str] = None
    node_type: Optional[str] = None
    start_line: int
    end_line: int
    start_col: Optional[int] = 0
    end_col: Optional[int] = 0
    evidence_score: float
    code_snippet: Optional[str] = None
    explanation_note: Optional[str] = None

class PredictResponse(BaseModel):
    commit: str
    model_version: str
    raw_logit: float
    raw_score: float
    calibrated_confidence: float
    risk_category: str
    files_changed: int
    additions: int
    deletions: int
    graph_summary: Dict[str, int]
    explanation: List[CodeRegionSchema]
    diff_graph: Optional[Dict[str, Any]] = None

class CommitSummarySchema(BaseModel):
    id: int
    sha: str
    message: str
    author: str
    timestamp: str
    files_changed: int
    additions: int
    deletions: int
    raw_score: Optional[float] = None
    calibrated_score: Optional[float] = None
    risk_category: Optional[str] = None
    ground_truth_label: Optional[int] = None

class RepositoryRiskResponse(BaseModel):
    repository_id: int
    name: str
    owner: str
    default_branch: str
    total_commits: int
    high_risk_commits: int
    medium_risk_commits: int
    low_risk_commits: int
    average_calibrated_risk: float
    file_risk_distribution: List[Dict[str, Any]]
    recent_commits: List[CommitSummarySchema]

class ExperimentSchema(BaseModel):
    id: int
    experiment_name: str
    model_family: str
    dataset_version: str
    configuration: Dict[str, Any]
    seed: int
    metrics: Dict[str, Any]
    created_at: str

class CounterfactualTestRequest(BaseModel):
    diff: str
    recipe: str
    seed: Optional[int] = 42

class CounterfactualTestResponse(BaseModel):
    recipe: str
    seed: int
    original_prediction: PredictResponse
    counterfactual_prediction: PredictResponse
    risk_divergence: float
    surface_similarity: float
    is_valid: bool
    status: str
    perturbed_diff: str
