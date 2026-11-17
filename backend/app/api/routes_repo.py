from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Repository, Commit, Prediction, CodeRegion, Counterfactual
from app.api.schemas import RepositoryRiskResponse, CommitSummarySchema
from app.ml.pipeline import pipeline_instance

router = APIRouter(prefix="", tags=["Repositories & Commits"])

@router.get("/repositories")
def list_repositories(db: Session = Depends(get_db)):
    """Lists all monitored repositories."""
    repos = db.query(Repository).all()
    return [
        {
            "id": r.id,
            "provider": r.provider,
            "owner": r.owner,
            "name": r.name,
            "full_name": f"{r.owner}/{r.name}",
            "default_branch": r.default_branch,
            "commit_count": len(r.commits)
        }
        for r in repos
    ]

@router.get("/repositories/{repo_id}/risk", response_model=RepositoryRiskResponse)
def get_repository_risk(repo_id: int, db: Session = Depends(get_db)):
    """Returns repository-level risk overview, file risk distribution, and commit stream."""
    repo = db.query(Repository).filter_by(id=repo_id).first()
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    commits = db.query(Commit).filter_by(repository_id=repo.id).order_by(Commit.timestamp.desc()).all()

    total_commits = len(commits)
    high_count = 0
    med_count = 0
    low_count = 0
    risk_sum = 0.0

    recent_list: List[CommitSummarySchema] = []
    file_risk_map: Dict[str, Dict[str, Any]] = {}

    for c in commits:
        latest_pred = c.predictions[-1] if c.predictions else None
        calibrated = latest_pred.calibrated_score if latest_pred else 0.0
        raw = latest_pred.raw_score if latest_pred else 0.0
        cat = latest_pred.risk_category if latest_pred else "low"

        risk_sum += calibrated
        if cat == "high":
            high_count += 1
        elif cat == "medium":
            med_count += 1
        else:
            low_count += 1

        recent_list.append(CommitSummarySchema(
            id=c.id,
            sha=c.sha,
            message=c.message,
            author=c.author,
            timestamp=c.timestamp.isoformat(),
            files_changed=c.files_changed,
            additions=c.additions,
            deletions=c.deletions,
            raw_score=round(raw, 4) if latest_pred else None,
            calibrated_score=round(calibrated, 4) if latest_pred else None,
            risk_category=cat,
            ground_truth_label=c.ground_truth_label
        ))

        # Accumulate file-level risk from code regions
        for cr in c.code_regions:
            fp = cr.file_path
            if fp not in file_risk_map:
                file_risk_map[fp] = {
                    "file_path": fp,
                    "max_evidence_score": 0.0,
                    "incident_count": 0,
                    "associated_commits": set()
                }
            file_risk_map[fp]["incident_count"] += 1
            file_risk_map[fp]["associated_commits"].add(c.sha[:7])
            if cr.evidence_score > file_risk_map[fp]["max_evidence_score"]:
                file_risk_map[fp]["max_evidence_score"] = cr.evidence_score

    avg_risk = round(risk_sum / max(1, total_commits), 4)

    file_distribution = [
        {
            "file_path": data["file_path"],
            "max_evidence_score": round(data["max_evidence_score"], 4),
            "incident_count": data["incident_count"],
            "commits": list(data["associated_commits"])
        }
        for data in sorted(file_risk_map.values(), key=lambda x: x["max_evidence_score"], reverse=True)
    ]

    return RepositoryRiskResponse(
        repository_id=repo.id,
        name=repo.name,
        owner=repo.owner,
        default_branch=repo.default_branch,
        total_commits=total_commits,
        high_risk_commits=high_count,
        medium_risk_commits=med_count,
        low_risk_commits=low_count,
        average_calibrated_risk=avg_risk,
        file_risk_distribution=file_distribution,
        recent_commits=recent_list
    )

@router.get("/commits")
def list_commits(limit: int = 50, repo_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Lists commits across all repositories or for a specific repository."""
    query = db.query(Commit)
    if repo_id:
        query = query.filter_by(repository_id=repo_id)
    commits = query.order_by(Commit.timestamp.desc()).limit(limit).all()
    out = []
    for c in commits:
        latest_pred = c.predictions[-1] if c.predictions else None
        out.append({
            "id": c.id,
            "sha": c.sha,
            "message": c.message,
            "author": c.author,
            "timestamp": c.timestamp.isoformat(),
            "repository_name": c.repository.name if c.repository else "",
            "files_changed": c.files_changed,
            "additions": c.additions,
            "deletions": c.deletions,
            "calibrated_score": round(latest_pred.calibrated_score, 4) if latest_pred else None,
            "risk_category": latest_pred.risk_category if latest_pred else "low",
            "ground_truth_label": c.ground_truth_label
        })
    return out

@router.get("/commits/{sha}")
def get_commit_details(sha: str, db: Session = Depends(get_db)):
    """Returns detailed commit information, diff content, prediction, highlighted code regions,
    and associated counterfactuals.
    """
    commit_obj = db.query(Commit).filter(Commit.sha.startswith(sha)).first()
    if not commit_obj:
        raise HTTPException(status_code=404, detail="Commit not found")

    latest_pred = commit_obj.predictions[-1] if commit_obj.predictions else None

    regions = [
        {
            "id": r.id,
            "file_path": r.file_path,
            "ast_node_id": r.ast_node_id,
            "node_type": r.node_type,
            "start_line": r.start_line,
            "end_line": r.end_line,
            "start_col": r.start_col,
            "end_col": r.end_col,
            "evidence_score": round(r.evidence_score, 4),
            "code_snippet": r.code_snippet,
            "explanation_note": f"Influential {r.node_type} region with model attention weight {round(r.evidence_score, 3)}."
        }
        for r in commit_obj.code_regions
    ]
    regions.sort(key=lambda x: x["evidence_score"], reverse=True)

    cfs = [
        {
            "id": cf.id,
            "recipe": cf.recipe,
            "seed": cf.seed,
            "validation_status": cf.validation_status,
            "similarity_score": round(cf.similarity_score, 4),
            "generated_diff": cf.generated_diff
        }
        for cf in commit_obj.counterfactuals
    ]

    # Build structural AST Diff Graph
    try:
        parsed_diff = pipeline_instance.diff_parser.parse(commit_obj.diff_content)
        diff_graph = pipeline_instance.graph_builder.build_graph(parsed_diff, commit_sha=commit_obj.sha)
        for node in diff_graph.nodes:
            matched_scores = [
                r.evidence_score
                for r in commit_obj.code_regions
                if r.file_path == node.file_path and not (node.end_line < r.start_line or node.start_line > r.end_line)
            ]
            if matched_scores:
                node.evidence_score = max(matched_scores)
        diff_graph_dict = diff_graph.to_dict()
    except Exception as e:
        diff_graph_dict = {"nodes": [], "edges": [], "metadata": {"error": str(e)}}

    return {
        "id": commit_obj.id,
        "sha": commit_obj.sha,
        "parent_sha": commit_obj.parent_sha,
        "message": commit_obj.message,
        "author": commit_obj.author,
        "timestamp": commit_obj.timestamp.isoformat(),
        "diff_content": commit_obj.diff_content,
        "files_changed": commit_obj.files_changed,
        "additions": commit_obj.additions,
        "deletions": commit_obj.deletions,
        "ground_truth_label": commit_obj.ground_truth_label,
        "prediction": {
            "model_version": latest_pred.model_version if latest_pred else None,
            "raw_score": round(latest_pred.raw_score, 4) if latest_pred else None,
            "calibrated_score": round(latest_pred.calibrated_score, 4) if latest_pred else None,
            "risk_category": latest_pred.risk_category if latest_pred else "low",
            "created_at": latest_pred.created_at.isoformat() if latest_pred else None
        } if latest_pred else None,
        "code_regions": regions,
        "counterfactuals": cfs,
        "diff_graph": diff_graph_dict
    }
