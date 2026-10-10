from fastapi import APIRouter, Request, Header, HTTPException, Depends
from sqlalchemy.orm import Session
from app.config import settings
from app.db.session import get_db
from app.db.models import Repository, Commit, Prediction, CodeRegion
from app.ingestion.webhook import GitHubWebhookProcessor
from app.ml.pipeline import pipeline_instance

router = APIRouter(prefix="", tags=["Webhooks"])

@router.post("/webhooks/github")
async def github_webhook(
    request: Request,
    x_hub_signature_256: str = Header(None),
    db: Session = Depends(get_db)
):
    """Handles GitHub push webhook events with HMAC signature verification."""
    payload_bytes = await request.body()

    # Validate HMAC signature if secret is set and header present
    if settings.webhook_secret and x_hub_signature_256:
        is_valid = GitHubWebhookProcessor.verify_signature(
            payload_bytes=payload_bytes,
            secret=settings.webhook_secret,
            signature_header=x_hub_signature_256
        )
        if not is_valid:
            raise HTTPException(status_code=403, detail="Invalid webhook signature")

    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed JSON payload")

    repo_info, commits_data = GitHubWebhookProcessor.parse_payload(data)
    if not repo_info:
        return {"status": "ignored", "reason": "No repository payload found"}

    # Find or create repository
    repo = db.query(Repository).filter_by(
        owner=repo_info["owner"],
        name=repo_info["name"]
    ).first()

    if not repo:
        repo = Repository(
            provider="github",
            external_id=repo_info["external_id"],
            owner=repo_info["owner"],
            name=repo_info["name"],
            default_branch=repo_info["default_branch"]
        )
        db.add(repo)
        db.commit()
        db.refresh(repo)

    processed_count = 0
    for c_data in commits_data:
        existing = db.query(Commit).filter_by(sha=c_data["sha"]).first()
        if existing:
            continue

        # In a real GitHub webhook, diff might be synthesized from added/modified files or fetched
        synth_diff = f"diff --git a/{c_data.get('modified', ['main.py'])[0] if c_data.get('modified') else 'main.py'} b/{c_data.get('modified', ['main.py'])[0] if c_data.get('modified') else 'main.py'}\n--- a/main.py\n+++ b/main.py\n@@ -1,3 +1,5 @@\n+// Webhook ingested commit\n"
        pred = pipeline_instance.predict_commit(synth_diff, commit_message=c_data["message"], commit_sha=c_data["sha"])

        commit_obj = Commit(
            repository_id=repo.id,
            sha=c_data["sha"],
            message=c_data["message"],
            author=c_data["author"],
            diff_content=synth_diff,
            files_changed=pred["files_changed"],
            additions=pred["additions"],
            deletions=pred["deletions"]
        )
        db.add(commit_obj)
        db.commit()
        db.refresh(commit_obj)

        prediction_obj = Prediction(
            commit_id=commit_obj.id,
            model_version=pred["model_version"],
            raw_score=pred["raw_score"],
            calibrated_score=pred["calibrated_confidence"],
            risk_category=pred["risk_category"],
            raw_explanation=pred.get("explanation")
        )
        db.add(prediction_obj)
        db.commit()
        processed_count += 1

    return {
        "status": "accepted",
        "repository": f"{repo.owner}/{repo.name}",
        "commits_processed": processed_count
    }
