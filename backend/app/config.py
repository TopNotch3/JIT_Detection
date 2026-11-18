import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "app" / "data"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/jit_dp.db")

class Settings(BaseModel):
    app_name: str = "SAGA-JIT API: Structurally-Aware Graph Attention & Counterfactual-Robust Defect Prediction"
    app_version: str = "1.0.0"
    model_version: str = "gat-v2-cf-contrastive"
    database_url: str = DATABASE_URL
    webhook_secret: str = os.getenv("GITHUB_WEBHOOK_SECRET", "jit_dp_dev_secret_token_123")
    calibrated_temperature: float = 1.38
    default_risk_threshold: float = 0.50
    high_risk_threshold: float = 0.70
    medium_risk_threshold: float = 0.40
    data_dir: Path = DATA_DIR

settings = Settings()
