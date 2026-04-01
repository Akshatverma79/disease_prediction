"use client";

import { Prediction } from "@/types";
import { PredictionChart } from "@/components/PredictionChart";

type Props = {
  predictions: Prediction[];
  disclaimer: string;
};

function doctorRecommendation(disease: string): string {
  const value = disease.toLowerCase();
  if (value.includes("skin")) return "Consult a dermatologist for specialist evaluation.";
  if (value.includes("heart") || value.includes("hypertension")) return "Consult a cardiologist or internal medicine specialist.";
  if (value.includes("diabetes")) return "Consult an endocrinologist and get blood sugar tests.";
  if (value.includes("asthma") || value.includes("lung")) return "Consult a pulmonologist for respiratory assessment.";
  return "Consult a general physician for clinical confirmation and next steps.";
}

export function PredictionResults({ predictions, disclaimer }: Props) {
  const best = predictions[0];

  const exportPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Disease Prediction Report", 14, 18);
    doc.setFontSize(11);

    let y = 30;
    predictions.forEach((p, idx) => {
      doc.text(`${idx + 1}. ${p.disease} - ${(p.confidence * 100).toFixed(2)}%`, 14, y);
      y += 8;
    });

    y += 5;
    doc.text(`Recommendation: ${doctorRecommendation(best?.disease ?? "")}`, 14, y);
    y += 10;
    doc.text(disclaimer, 14, y);

    doc.save("prediction-report.pdf");
  };

  return (
    <section className="space-y-4">
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold">Most Likely Condition</h2>
        <p className="mt-2 text-2xl font-black text-accent-700 dark:text-accent-400">{best?.disease ?? "N/A"}</p>
        <p className="mt-1 text-sm">Confidence: {best ? `${(best.confidence * 100).toFixed(2)}%` : "N/A"}</p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display text-lg font-bold">Top 3 Predictions</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {predictions.map((item) => (
            <li key={item.disease} className="rounded-lg bg-white/40 p-3 dark:bg-slate-800/60">
              {item.disease} - {(item.confidence * 100).toFixed(2)}%
            </li>
          ))}
        </ul>
      </div>

      <PredictionChart predictions={predictions} />

      <div className="glass-card rounded-2xl p-6 text-sm">
        <p className="font-semibold">Doctor Recommendation</p>
        <p className="mt-1">{doctorRecommendation(best?.disease ?? "")}</p>
        <p className="mt-3 rounded-lg bg-amber-100/80 p-3 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100">
          {disclaimer}
        </p>

        <button
          onClick={exportPdf}
          className="mt-4 rounded-full bg-secondary-600 px-5 py-2 text-sm font-bold text-white transition hover:brightness-110"
        >
          Export as PDF
        </button>
      </div>
    </section>
  );
}
