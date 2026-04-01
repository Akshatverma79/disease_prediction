from pathlib import Path
from typing import Dict, List

import joblib
import numpy as np


class PredictionEngine:
    def __init__(self, artifact_dir: str = "artifacts"):
        artifact_path = Path(artifact_dir)
        self.model = joblib.load(artifact_path / "model.joblib")
        self.label_encoder = joblib.load(artifact_path / "label_encoder.joblib")
        self.symptom_encoder = joblib.load(artifact_path / "symptom_encoder.joblib")

        self.symptoms: List[str] = self.symptom_encoder["symptoms"]
        self._symptom_to_idx = {self._normalize(symptom): i for i, symptom in enumerate(self.symptoms)}

    @staticmethod
    def _normalize(value: str) -> str:
        return value.strip().lower().replace("_", " ")

    def encode_symptoms(self, user_symptoms: List[str]) -> np.ndarray:
        vector = np.zeros((1, len(self.symptoms)), dtype=np.float32)

        for symptom in user_symptoms:
            key = self._normalize(symptom)
            if key in self._symptom_to_idx:
                vector[0, self._symptom_to_idx[key]] = 1.0

        return vector

    def predict_top_k(self, user_symptoms: List[str], top_k: int = 3) -> List[Dict[str, float]]:
        X = self.encode_symptoms(user_symptoms)

        if hasattr(self.model, "predict_proba"):
            probabilities = self.model.predict_proba(X)[0]
            top_indices = np.argsort(probabilities)[::-1][:top_k]
            return [
                {
                    "disease": str(self.label_encoder.inverse_transform([idx])[0]),
                    "confidence": float(probabilities[idx]),
                }
                for idx in top_indices
            ]

        predicted_idx = int(self.model.predict(X)[0])
        disease = str(self.label_encoder.inverse_transform([predicted_idx])[0])
        return [{"disease": disease, "confidence": 1.0}]
