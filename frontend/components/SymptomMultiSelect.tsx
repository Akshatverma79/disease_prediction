"use client";

import { useMemo, useState } from "react";

type Props = {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
};

export function SymptomMultiSelect({ options, selected, onChange }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((item) => item.toLowerCase().includes(q));
  }, [query, options]);

  const toggleSymptom = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
      return;
    }
    onChange([...selected, value]);
  };

  return (
    <div className="space-y-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search symptoms (autocomplete)..."
        className="w-full rounded-xl border border-white/40 bg-white/50 px-4 py-3 text-sm outline-none focus:border-accent-500 dark:bg-slate-900/50"
      />

      <div className="flex flex-wrap gap-2">
        {selected.map((item) => (
          <button
            key={item}
            onClick={() => toggleSymptom(item)}
            className="rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-white"
          >
            {item} x
          </button>
        ))}
      </div>

      <div className="max-h-64 overflow-auto rounded-xl border border-white/30 bg-white/35 p-2 dark:bg-slate-900/30">
        <p className="mb-2 px-2 text-xs text-slate-600 dark:text-slate-300">
          Showing {filtered.length} of {options.length} symptoms
        </p>
        {filtered.map((item) => {
          const active = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => toggleSymptom(item)}
              className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                active
                  ? "bg-accent-500 text-white"
                  : "hover:bg-white/50 dark:hover:bg-slate-800/70"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
