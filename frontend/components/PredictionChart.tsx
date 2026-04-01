"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Prediction } from "@/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  predictions: Prediction[];
};

export function PredictionChart({ predictions }: Props) {
  const data = {
    labels: predictions.map((p) => p.disease),
    datasets: [
      {
        label: "Confidence",
        data: predictions.map((p) => Number((p.confidence * 100).toFixed(2))),
        backgroundColor: ["#20bfa8", "#69a3ff", "#9ad6cd"],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="rounded-2xl bg-white/50 p-4 dark:bg-slate-900/40">
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, max: 100, ticks: { callback: (value) => `${value}%` } },
          },
        }}
      />
    </div>
  );
}
