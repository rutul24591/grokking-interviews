"use client";

import { useState } from "react";
import { BuggyClock } from "@/components/BuggyClock";
import { FixedClock } from "@/components/FixedClock";

export default function Page() {
  const [mode, setMode] = useState<"buggy" | "fixed">("fixed");

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Hydration Mismatch Demo</h1>
        <p className="mt-1 text-sm text-slate-300">
          Toggle buggy vs fixed. Buggy mode renders non-deterministic values during hydration.
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("buggy")}
            className={[
              "rounded-xl border px-4 py-2 text-sm transition",
              mode === "buggy"
                ? "border-red-400 bg-red-500/10 text-slate-50"
                : "border-slate-800 bg-slate-950/30 text-slate-300 hover:border-slate-600",
            ].join(" ")}
          >
            Buggy
          </button>
          <button
            type="button"
            onClick={() => setMode("fixed")}
            className={[
              "rounded-xl border px-4 py-2 text-sm transition",
              mode === "fixed"
                ? "border-indigo-400 bg-indigo-500/10 text-slate-50"
                : "border-slate-800 bg-slate-950/30 text-slate-300 hover:border-slate-600",
            ].join(" ")}
          >
            Fixed
          </button>
        </div>

        <div className="mt-6">{mode === "buggy" ? <BuggyClock /> : <FixedClock />}</div>

        <div className="mt-6 text-xs text-slate-500">
          In real SSR apps, mismatches often come from `Date.now()`, `Math.random()`, locale formatting,
          or reading `window` during the first client render.
        </div>
      </div>
    </main>
  );
}

