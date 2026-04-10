import { HistoryItem } from "@/types";

const KEY = "disease-prediction-history";

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as HistoryItem[];
  } catch {
    return [];
  }
}

export function saveHistory(item: HistoryItem): HistoryItem[] {
  const existing = loadHistory();
  const next = [item, ...existing].slice(0, 10);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
