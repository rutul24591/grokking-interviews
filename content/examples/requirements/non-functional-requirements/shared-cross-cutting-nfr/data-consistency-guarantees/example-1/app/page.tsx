"use client";

import { useEffect, useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export default function Page() {
  const [sessionId, setSessionId] = useState("s1");
  const [value, setValue] = useState("v2");
  const [eventual, setEventual] = useState<any>(null);
  const [ryw, setRyw] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState("");

  async function refresh() {
    try {
      setStatus(await json("/api/status"));
      setEventual(await json(`/api/read?consistency=eventual&sessionId=${encodeURIComponent(sessionId)}`));
      setRyw(await json(`/api/read?consistency=read-your-writes&sessionId=${encodeURIComponent(sessionId)}`));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 800);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function writeNow() {
    await json("/api/write", { method: "POST", body: JSON.stringify({ sessionId, value }) });
    await refresh();
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    await refresh();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Consistency Playground</h1>
        <p className="mt-2 text-slate-300">Eventual vs read-your-writes over lagging replicas.</p>
        {error ? <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div> : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold">Controls</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Session</span>
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Write value</span>
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={value} onChange={(e) => setValue(e.target.value)} />
            </label>
            <div className="flex flex-wrap gap-2">
              <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={writeNow}>Write</button>
              <button className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700" onClick={reset}>Reset</button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Reads</h2>
          <pre className="mt-4 overflow-auto rounded border border-slate-800 bg-black/40 p-4 text-xs text-slate-100">
{JSON.stringify({ eventual, readYourWrites: ryw, status }, null, 2)}
          </pre>
        </div>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether data consistency guarantees is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For data consistency guarantees, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For data consistency guarantees, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For data consistency guarantees, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Data Consistency Guarantees</div>
          <p className="mt-2">
            Strong non-functional examples must go beyond toggles and raw JSON. They need a review layer that makes the
            operational contract visible: what is being protected, what degrades first, and what evidence an operator
            or reviewer should use before changing policy.
          </p>
        </div>
      </section>

</main>
  );
}

