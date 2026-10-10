from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Experiment
from app.api.schemas import ExperimentSchema, CounterfactualTestRequest, CounterfactualTestResponse
from app.counterfactual.recipes import CounterfactualPerturber
from app.counterfactual.validator import CounterfactualValidator
from app.ml.pipeline import pipeline_instance

router = APIRouter(prefix="", tags=["Experiments & Counterfactuals"])

@router.get("/experiments", response_model=List[ExperimentSchema])
def list_experiments(db: Session = Depends(get_db)):
    """Returns benchmark and ablation experiment records comparing baselines against proposed model."""
    experiments = db.query(Experiment).order_by(Experiment.id.asc()).all()
    return [
        ExperimentSchema(
            id=e.id,
            experiment_name=e.experiment_name,
            model_family=e.model_family,
            dataset_version=e.dataset_version,
            configuration=e.configuration,
            seed=e.seed,
            metrics=e.metrics,
            created_at=e.created_at.isoformat()
        )
        for e in experiments
    ]

@router.post("/experiments/counterfactual-test", response_model=CounterfactualTestResponse)
def test_counterfactual(req: CounterfactualTestRequest):
    """Executes an interactive counterfactual perturbation test on a given commit diff.
    Measures surface similarity, prediction sensitivity, and shortcut resistance.
    """
    if not req.diff or not req.diff.strip():
        raise HTTPException(status_code=400, detail="Diff cannot be empty")

    validator = CounterfactualValidator()

    # 1. Predict original commit
    orig_pred = pipeline_instance.predict_commit(req.diff, commit_message="Original commit", commit_sha="orig_test")

    # 2. Perturb commit diff
    try:
        cf_diff, cf_meta = CounterfactualPerturber.apply_recipe(req.diff, req.recipe, seed=req.seed or 42)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Perturbation error: {str(e)}")

    # 3. Validate counterfactual
    is_valid, status, similarity, _ = validator.validate(req.diff, cf_diff, req.recipe)

    # 4. Predict counterfactual commit
    cf_pred = pipeline_instance.predict_commit(cf_diff, commit_message=f"Counterfactual ({req.recipe})", commit_sha="cf_test")

    # 5. Measure risk score divergence
    risk_diff = abs(orig_pred["calibrated_confidence"] - cf_pred["calibrated_confidence"])

    return CounterfactualTestResponse(
        recipe=req.recipe,
        seed=req.seed or 42,
        original_prediction=orig_pred,
        counterfactual_prediction=cf_pred,
        risk_divergence=round(risk_diff, 4),
        surface_similarity=round(similarity, 4),
        is_valid=is_valid,
        status=status,
        perturbed_diff=cf_diff
    )
