import argparse
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


@dataclass
class DatasetBundle:
    X: np.ndarray
    y: np.ndarray
    symptom_names: List[str]
    target_name: str


def normalize_token(value: str) -> str:
    return str(value).strip().lower().replace("_", " ")


def pick_target_column(df: pd.DataFrame) -> str:
    candidates = ["prognosis", "disease", "target", "label"]
    lower_map = {col.lower(): col for col in df.columns}
    for candidate in candidates:
        if candidate in lower_map:
            return lower_map[candidate]
    return df.columns[-1]


def infer_binary_feature_matrix(df: pd.DataFrame, feature_cols: List[str]) -> Tuple[np.ndarray, List[str]]:
    X = df[feature_cols].copy()
    X = X.replace({"yes": 1, "no": 0, "true": 1, "false": 0, "": 0, "nan": 0})
    X = X.apply(pd.to_numeric, errors="coerce").fillna(0)
    X = (X > 0).astype(int)
    return X.to_numpy(dtype=np.float32), [normalize_token(col) for col in feature_cols]


def prepare_dataset(csv_path: Path) -> Tuple[DatasetBundle, LabelEncoder]:
    df = pd.read_csv(csv_path)
    df = df.drop_duplicates().reset_index(drop=True)
    df = df.fillna("")

    target_col = pick_target_column(df)
    feature_cols = [col for col in df.columns if col != target_col]

    X, symptom_names = infer_binary_feature_matrix(df, feature_cols)

    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(df[target_col].astype(str))

    return DatasetBundle(X=X, y=y, symptom_names=symptom_names, target_name=target_col), label_encoder


def evaluate_models(X_train, X_test, y_train, y_test) -> Dict[str, Dict[str, float]]:
    models = {
        "logistic_regression": LogisticRegression(max_iter=2000, n_jobs=None),
        "random_forest": RandomForestClassifier(
            n_estimators=300,
            random_state=42,
            n_jobs=-1,
            class_weight="balanced_subsample",
        ),
        "gradient_boosting": GradientBoostingClassifier(random_state=42),
    }

    evaluations: Dict[str, Dict[str, float]] = {}

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        evaluations[name] = {
            "accuracy": accuracy_score(y_test, y_pred),
            "precision_weighted": precision_score(y_test, y_pred, average="weighted", zero_division=0),
            "recall_weighted": recall_score(y_test, y_pred, average="weighted", zero_division=0),
            "f1_weighted": f1_score(y_test, y_pred, average="weighted", zero_division=0),
            "model": model,
        }

    return evaluations


def save_artifacts(output_dir: Path, best_model, label_encoder: LabelEncoder, symptom_names: List[str], metrics: Dict[str, Dict[str, float]]):
    output_dir.mkdir(parents=True, exist_ok=True)

    cleaned_metrics = {
        name: {k: v for k, v in scores.items() if k != "model"}
        for name, scores in metrics.items()
    }

    joblib.dump(best_model, output_dir / "model.joblib")
    joblib.dump(label_encoder, output_dir / "label_encoder.joblib")
    joblib.dump({"symptoms": symptom_names}, output_dir / "symptom_encoder.joblib")
    joblib.dump(cleaned_metrics, output_dir / "metrics.joblib")


def main():
    parser = argparse.ArgumentParser(description="Train disease prediction model from CSV dataset.")
    parser.add_argument("--data", type=str, required=True, help="Path to dataset CSV")
    parser.add_argument("--output", type=str, default="artifacts", help="Directory to save model artifacts")
    args = parser.parse_args()

    csv_path = Path(args.data)
    output_dir = Path(args.output)

    if not csv_path.exists():
        raise FileNotFoundError(f"Dataset not found: {csv_path}")

    bundle, label_encoder = prepare_dataset(csv_path)

    X_train, X_test, y_train, y_test = train_test_split(
        bundle.X,
        bundle.y,
        test_size=0.2,
        random_state=42,
        stratify=bundle.y,
    )

    results = evaluate_models(X_train, X_test, y_train, y_test)
    best_name = max(results.keys(), key=lambda k: results[k]["f1_weighted"])
    best_model = results[best_name]["model"]
    best_model.fit(bundle.X, bundle.y)

    save_artifacts(output_dir, best_model, label_encoder, bundle.symptom_names, results)

    print("\n=== Model Comparison ===")
    for name, scores in results.items():
        print(
            f"{name:20} | accuracy={scores['accuracy']:.4f} "
            f"precision={scores['precision_weighted']:.4f} "
            f"recall={scores['recall_weighted']:.4f} "
            f"f1={scores['f1_weighted']:.4f}"
        )

    print(f"\nBest model: {best_name}")
    print(f"Artifacts saved to: {output_dir.resolve()}")


if __name__ == "__main__":
    main()
