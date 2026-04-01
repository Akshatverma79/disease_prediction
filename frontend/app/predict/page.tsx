"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { HistoryPanel } from "@/components/HistoryPanel";
import { PredictionResults } from "@/components/PredictionResults";
import { SymptomMultiSelect } from "@/components/SymptomMultiSelect";
import { fetchSymptoms, predictDiseases } from "@/lib/api";
import { loadHistory, saveHistory } from "@/lib/storage";
import { HistoryItem, PredictResponse } from "@/types";

export default function PredictPage() {
  const [allSymptoms, setAllSymptoms] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        setError(null);
        const data = await fetchSymptoms();
        setAllSymptoms(data);
      } catch (err) {
        setError("Unable to load symptom list. Verify backend API URL.");
      }
    };

    initialize();
    setHistory(loadHistory());
  }, []);

  const canSubmit = useMemo(() => selectedSymptoms.length > 0 && !loading, [selectedSymptoms, loading]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const response = await predictDiseases(selectedSymptoms);
      setResult(response);

      const historyItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        symptoms: selectedSymptoms,
        predictions: response.predictions,
      };
      const updated = saveHistory(historyItem);
      setHistory(updated);
    } catch (err) {
      setError("Prediction request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.72fr]">
      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold">Symptom Checker</h1>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
            Select all symptoms you are experiencing. The model returns top-3 possible conditions.
          </p>

          <div className="mt-5">
            <SymptomMultiSelect options={allSymptoms} selected={selectedSymptoms} onChange={setSelectedSymptoms} />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
            disabled={!canSubmit}
            className="mt-6 inline-flex min-w-40 items-center justify-center rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Predicting...
              </span>
            ) : (
              "Run Prediction"
            )}
          </motion.button>

          {error ? <p className="mt-4 text-sm font-semibold text-red-600 dark:text-red-300">{error}</p> : null}
        </div>

        {result ? <PredictionResults predictions={result.predictions} disclaimer={result.disclaimer} /> : null}
      </div>

      <div>
        <HistoryPanel history={history} />
      </div>
    </section>
  );
}
