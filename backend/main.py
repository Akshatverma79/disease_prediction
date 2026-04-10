import os
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from utils import PredictionEngine

load_dotenv()

ARTIFACT_DIR = os.getenv("ARTIFACT_DIR", "artifacts")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*")


def parse_allowed_origins(raw: str) -> List[str]:
    origins = [origin.strip() for origin in raw.split(",") if origin.strip()]
    return origins or ["*"]


origins = parse_allowed_origins(ALLOWED_ORIGINS)
allow_all_origins = "*" in origins


class PredictRequest(BaseModel):
    symptoms: List[str] = Field(..., min_length=1, max_length=30)

    @field_validator("symptoms")
    @classmethod
    def validate_symptoms(cls, values: List[str]) -> List[str]:
        cleaned = [v.strip() for v in values if v and v.strip()]
        if not cleaned:
            raise ValueError("At least one symptom is required.")
        return cleaned


class PredictResponse(BaseModel):
    predictions: List[dict]
    disclaimer: str


app = FastAPI(
    title="Disease Prediction API",
    version="1.0.0",
    description="Predicts possible diseases from user symptoms. Not a medical diagnosis system.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # Browsers reject credentialed CORS with wildcard origin, so disable it for '*'.
    allow_credentials=not allow_all_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    engine = PredictionEngine(artifact_dir=ARTIFACT_DIR)
except Exception:
    engine = None


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "disease-prediction-api",
        "disclaimer": "This is not a medical diagnosis system.",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "artifacts_loaded": engine is not None,
    }


@app.get("/symptoms")
def get_symptoms():
    if engine is None:
        raise HTTPException(status_code=503, detail="Model artifacts not found. Run training first.")

    return {
        "symptoms": sorted(engine.symptoms),
        "count": len(engine.symptoms),
    }


@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    if engine is None:
        raise HTTPException(status_code=503, detail="Model artifacts not found. Run training first.")

    try:
        predictions = engine.predict_top_k(payload.symptoms, top_k=3)
        return {
            "predictions": predictions,
            "disclaimer": "This is not a medical diagnosis system.",
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(exc)}")
