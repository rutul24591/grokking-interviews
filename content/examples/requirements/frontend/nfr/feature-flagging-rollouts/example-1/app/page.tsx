"use client";

import { useEffect, useState } from "react";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(res.status + " " + res.statusText + (text ? " — " + text : ""));
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export default function Page() {
  const [userId, setUserId] = useState("user_123");
  const [rolloutPct, setRolloutPct] = useState(0);
  const [killSwitch, setKillSwitch] = useState(false);
  const [salt, setSalt] = useState("v1");
  const [evalOut, setEvalOut] = useState<any>(null);
  const [error, setError] = useState("");

  async function refreshEval() {
    setEvalOut(await json(`/api/eval?userId=${encodeURIComponent(userId)}`));
  }

  async function apply() {
    setError("");
    try {
      await json("/api/update", { method: "POST", body: JSON.stringify({ rolloutPct, killSwitch, salt }) });
      await refreshEval();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    setRolloutPct(0);
    setKillSwitch(false);
    setSalt("v1");
    await refreshEval();
  }

  useEffect(() => {
    refreshEval().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Flag Lab</h1>
        <p className="mt-2 text-slate-300">
          Deterministic bucketing makes rollouts stable across sessions and servers; kill switches make rollbacks instant.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div>
        ) : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="grid gap-1 text-sm">
            <span className="text-slate-300">User ID</span>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="rounded border border-slate-700 bg-black/30 px-3 py-2 font-mono"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-slate-300">Rollout %</span>
            <input
              type="number"
              min={0}
              max={100}
              value={rolloutPct}
              onChange={(e) => setRolloutPct(Number(e.target.value))}
              className="rounded border border-slate-700 bg-black/30 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-slate-300">Salt</span>
            <input
              value={salt}
              onChange={(e) => setSalt(e.target.value)}
              className="rounded border border-slate-700 bg-black/30 px-3 py-2 font-mono"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={killSwitch} onChange={(e) => setKillSwitch(e.target.checked)} />
            Kill switch
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={apply}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={refreshEval}
            className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700"
          >
            Re-evaluate
          </button>
          <button
            type="button"
            onClick={reset}
            className="ml-auto rounded bg-amber-700 px-4 py-2 text-sm font-semibold hover:bg-amber-600"
          >
            Reset
          </button>
        </div>
        <pre className="mt-4 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">
          {JSON.stringify(evalOut, null, 2)}
        </pre>
      </section>
    </main>
  );
}

