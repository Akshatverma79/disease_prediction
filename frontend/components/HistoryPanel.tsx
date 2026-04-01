"use client";

import { HistoryItem } from "@/types";

type Props = {
  history: HistoryItem[];
};

export function HistoryPanel({ history }: Props) {
  if (history.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-4 text-sm text-slate-700 dark:text-slate-300">
        No previous predictions yet.
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-4">
      <h3 className="font-display text-lg font-bold">Recent Predictions</h3>
      <div className="mt-3 space-y-2">
        {history.map((item) => (
          <div key={item.id} className="rounded-xl bg-white/40 p-3 text-sm dark:bg-slate-800/60">
            <p className="font-semibold">{item.predictions[0]?.disease ?? "Unknown"}</p>
            <p className="text-xs opacity-80">{new Date(item.timestamp).toLocaleString()}</p>
            <p className="mt-1 text-xs">Symptoms: {item.symptoms.slice(0, 4).join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
