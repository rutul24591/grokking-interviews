"use client";

import { useState } from "react";

export default function ScriptLoadingLab() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loaded, setLoaded] = useState<string[]>([]);

  async function loadStrategy(strategy: "eager" | "defer" | "idle" | "interaction") {
    const response = await fetch(`http://localhost:4475/scripts/bootstrap?strategy=${strategy}`, { cache: "no-store" });
    const payload = (await response.json()) as { strategy: string; startedAfterMs: number; script: string };
    await new Promise((resolve) => setTimeout(resolve, payload.startedAfterMs));
    setLoaded((current) => [...current, payload.script]);
    setLogs((current) => [`${payload.script} booted via ${payload.strategy} after ${payload.startedAfterMs}ms`, ...current].slice(0, 8));
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Load strategies</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {(["eager", "defer", "idle", "interaction"] as const).map((strategy) => (
            <button key={strategy} onClick={() => void loadStrategy(strategy)} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              {strategy}
            </button>
          ))}
        </div>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Boot timeline</h2>
        <p className="mt-2 text-sm text-slate-600">Loaded scripts: {loaded.join(", ") || "none"}</p>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {logs.map((log) => <li key={log} className="rounded-2xl bg-slate-50 px-4 py-3">{log}</li>)}
        </ul>
      </article>
    </section>
  );
}
