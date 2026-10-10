import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String(50), default="github")
    external_id = Column(String(100), nullable=True)
    owner = Column(String(100), nullable=False)
    name = Column(String(100), nullable=False)
    default_branch = Column(String(50), default="main")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    commits = relationship("Commit", back_populates="repository", cascade="all, delete-orphan")

class Commit(Base):
    __tablename__ = "commits"

    id = Column(Integer, primary_key=True, index=True)
    repository_id = Column(Integer, ForeignKey("repositories.id"), nullable=False)
    sha = Column(String(64), unique=True, index=True, nullable=False)
    parent_sha = Column(String(64), nullable=True)
    message = Column(Text, nullable=False)
    author = Column(String(100), default="unknown")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    ingestion_status = Column(String(50), default="completed") # pending, completed, failed
    diff_content = Column(Text, nullable=True)
    files_changed = Column(Integer, default=0)
    additions = Column(Integer, default=0)
    deletions = Column(Integer, default=0)
    ground_truth_label = Column(Integer, nullable=True) # 0 = clean, 1 = defect-introducing, None = unlabelled

    repository = relationship("Repository", back_populates="commits")
    predictions = relationship("Prediction", back_populates="commit", cascade="all, delete-orphan")
    code_regions = relationship("CodeRegion", back_populates="commit", cascade="all, delete-orphan")
    counterfactuals = relationship("Counterfactual", back_populates="source_commit", cascade="all, delete-orphan")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    commit_id = Column(Integer, ForeignKey("commits.id"), nullable=False)
    model_version = Column(String(50), nullable=False)
    raw_score = Column(Float, nullable=False)
    calibrated_score = Column(Float, nullable=False)
    risk_category = Column(String(20), nullable=False) # low, medium, high
    explanation_status = Column(String(20), default="available")
    raw_explanation = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    commit = relationship("Commit", back_populates="predictions")

class CodeRegion(Base):
    __tablename__ = "code_regions"

    id = Column(Integer, primary_key=True, index=True)
    commit_id = Column(Integer, ForeignKey("commits.id"), nullable=False)
    file_path = Column(String(255), nullable=False)
    ast_node_id = Column(String(100), nullable=True)
    node_type = Column(String(50), nullable=True)
    start_line = Column(Integer, nullable=False)
    end_line = Column(Integer, nullable=False)
    start_col = Column(Integer, default=0)
    end_col = Column(Integer, default=0)
    evidence_score = Column(Float, nullable=False) # Normalized attention/importance weight (0.0 to 1.0)
    code_snippet = Column(Text, nullable=True)

    commit = relationship("Commit", back_populates="code_regions")

class Counterfactual(Base):
    __tablename__ = "counterfactuals"

    id = Column(Integer, primary_key=True, index=True)
    source_commit_id = Column(Integer, ForeignKey("commits.id"), nullable=False)
    recipe = Column(String(100), nullable=False) # polarity_invert, condition_flip, hunk_shuffle, rename_vars
    seed = Column(Integer, default=42)
    generated_diff = Column(Text, nullable=False)
    validation_status = Column(String(50), default="valid") # valid, invalid_syntax, low_similarity
    similarity_score = Column(Float, default=1.0) # Surface similarity with original commit
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    source_commit = relationship("Commit", back_populates="counterfactuals")

class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    experiment_name = Column(String(100), nullable=False)
    model_family = Column(String(50), nullable=False) # baseline_text, structural_only, robust_only, proposed_combined
    dataset_version = Column(String(50), nullable=False)
    configuration = Column(JSON, nullable=False)
    seed = Column(Integer, default=42)
    metrics = Column(JSON, nullable=False) # auc, f1, accuracy, brier, ece, cf_robustness_drop
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
