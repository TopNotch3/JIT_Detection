from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Repository, Commit, Prediction, CodeRegion
from app.api.schemas import PredictRequest, PredictResponse
from app.ml.pipeline import pipeline_instance

router = APIRouter(prefix="", tags=["Prediction"])

@router.post("/predict", response_model=PredictResponse)
def predict_defect_risk(req: PredictRequest, db: Session = Depends(get_db)):
    """Accepts a commit diff, extracts AST, constructs diff graph, runs GAT inference,
    calibrates risk score, and maps model attention evidence to AST code regions.
    """
    if not req.diff or not req.diff.strip():
        raise HTTPException(status_code=400, detail="Diff content cannot be empty")

    try:
        result = pipeline_instance.predict_commit(
            diff_text=req.diff,
            commit_message=req.message or "",
            commit_sha=req.commit_sha or "custom_sha"
        )

        # If repo is specified, persist commit and prediction
        if req.repository_id:
            repo = db.query(Repository).filter_by(id=req.repository_id).first()
            if repo:
                commit_obj = Commit(
                    repository_id=repo.id,
                    sha=req.commit_sha or f"pred_{result['commit'][:10]}",
                    message=req.message or "Ad-hoc predicted commit",
                    author="developer",
                    diff_content=req.diff,
                    files_changed=result["files_changed"],
                    additions=result["additions"],
                    deletions=result["deletions"]
                )
                db.add(commit_obj)
                db.commit()
                db.refresh(commit_obj)

                pred_obj = Prediction(
                    commit_id=commit_obj.id,
                    model_version=result["model_version"],
                    raw_score=result["raw_score"],
                    calibrated_score=result["calibrated_confidence"],
                    risk_category=result["risk_category"],
                    raw_explanation=result.get("explanation")
                )
                db.add(pred_obj)

                for reg in result.get("explanation", [])[:8]:
                    db.add(CodeRegion(
                        commit_id=commit_obj.id,
                        file_path=reg["file_path"],
                        ast_node_id=reg.get("ast_node_id"),
                        node_type=reg.get("node_type"),
                        start_line=reg["start_line"],
                        end_line=reg["end_line"],
                        start_col=reg.get("start_col", 0),
                        end_col=reg.get("end_col", 0),
                        evidence_score=reg["evidence_score"],
                        code_snippet=reg.get("code_snippet")
                    ))
                db.commit()

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failure: {str(e)}")
