"use client";

import { useMemo, useState } from "react";
import { choosePreloads, type Candidate } from "@/lib/preloadPolicy";

const CANDIDATES: Candidate[] = [
  { href: "/hero.webp", as: "image", bytes: 180_000, confidence: 0.95 },
  { href: "/logo.svg", as: "image", bytes: 4_000, confidence: 0.9 },
  { href: "/critical.css", as: "style", bytes: 8_000, confidence: 0.9 },
  { href: "/analytics.js", as: "script", bytes: 95_000, confidence: 0.3 },
  { href: "/editor.js", as: "script", bytes: 420_000, confidence: 0.2 },
  { href: "/hero.webp", as: "image", bytes: 180_000, confidence: 0.95 }, // duplicate
];

export default function Page() {
  const [maxBytes, setMaxBytes] = useState(240_000);
  const [maxCount, setMaxCount] = useState(3);

  const decision = useMemo(() => choosePreloads(CANDIDATES, maxBytes, maxCount), [maxBytes, maxCount]);

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Preload policy — budget + dedupe</h1>
        <p className="text-sm text-slate-300">
          Preload decisions are easier to reason about when you treat them as a policy: candidate set → budget → chosen.
        </p>
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-950/30 p-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-slate-200">
            Max bytes
            <input
              className="mt-2 w-full rounded-lg border border-slate-700 bg-black/30 px-3 py-2 text-sm"
              type="number"
              value={maxBytes}
              onChange={(e) => setMaxBytes(Number(e.target.value))}
              min={50_000}
              step={10_000}
            />
          </label>
          <label className="text-sm text-slate-200">
            Max count
            <input
              className="mt-2 w-full rounded-lg border border-slate-700 bg-black/30 px-3 py-2 text-sm"
              type="number"
              value={maxCount}
              onChange={(e) => setMaxCount(Number(e.target.value))}
              min={1}
              max={8}
            />
          </label>
        </div>
        <div className="text-xs text-slate-400">
          Rule of thumb: preload above-the-fold images and critical CSS; avoid preloading low-confidence scripts.
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <div className="text-sm font-medium text-slate-200">Chosen</div>
          <pre className="mt-3 text-xs text-slate-200">{JSON.stringify(decision.chosen, null, 2)}</pre>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <div className="text-sm font-medium text-slate-200">Skipped (with reasons)</div>
          <pre className="mt-3 text-xs text-slate-200">{JSON.stringify(decision.skipped, null, 2)}</pre>
        </div>
      </section>
    </main>
  );
}

