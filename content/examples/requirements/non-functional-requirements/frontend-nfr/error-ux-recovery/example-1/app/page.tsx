"use client";

import { useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url: string) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  return { ok: res.ok, status: res.status, body };
}

async function retryWithBackoff(opts: { tries: number; baseDelayMs: number; jitterMs: number }, fn: () => Promise<any>) {
  const attempts: Array<{ attempt: number; ok: boolean; status?: number }> = [];
  for (let i = 1; i <= opts.tries; i++) {
    const r = await fn();
    attempts.push({ attempt: i, ok: r.ok, status: r.status });
    if (r.ok) return { ok: true as const, result: r, attempts };
    const delay = opts.baseDelayMs * Math.pow(2, i - 1) + Math.floor(Math.random() * opts.jitterMs);
    await sleep(delay);
  }
  return { ok: false as const, attempts };
}

export default function Page() {
  const [key, setKey] = useState("demo");
  const [out, setOut] = useState<any>(null);
  const [error, setError] = useState("");

  async function run() {
    setError("");
    setOut(null);
    const r = await retryWithBackoff({ tries: 5, baseDelayMs: 80, jitterMs: 40 }, () =>
      fetchJson(`/api/flaky?key=${encodeURIComponent(key)}`),
    );
    setOut(r);
    if (!r.ok) setError("Exhausted retries (see attempts).");
  }

  async function reset() {
    await fetchJson("/api/reset");
    setOut(null);
    setError("");
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Retry Lab</h1>
        <p className="mt-2 text-slate-300">
          Error UX isn’t just “show an error”. It’s: retry policy, backoff, user messaging, and safe fallbacks.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-sm">{error}</div>
        ) : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-slate-300">Key</span>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="rounded border border-slate-700 bg-black/30 px-3 py-2"
            />
          </label>
          <button
            type="button"
            onClick={run}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
          >
            Load with retries
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
          {JSON.stringify(out, null, 2)}
        </pre>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether error ux recovery is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For error ux recovery, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For error ux recovery, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For error ux recovery, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Error Ux Recovery</div>
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

