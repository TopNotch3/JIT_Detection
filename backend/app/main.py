import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.data.seeder import seed_database
from app.api.routes_predict import router as predict_router
from app.api.routes_repo import router as repo_router
from app.api.routes_experiments import router as exp_router
from app.api.routes_webhook import router as webhook_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("jit_dp")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database and seeding benchmark data...")
    seed_database()
    logger.info("JIT-DP backend initialization complete.")
    yield

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Structurally-Aware, Counterfactual-Robust Just-In-Time Defect Prediction Service",
    lifespan=lifespan
)

# CORS setup for dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(predict_router)
app.include_router(repo_router)
app.include_router(exp_router)
app.include_router(webhook_router)

@app.get("/")
def root():
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "model_version": settings.model_version,
        "status": "operational",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": settings.app_version,
        "calibrated_temperature": settings.calibrated_temperature
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
