"use client";

import { useEffect, useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

async function post(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {})
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), body: json };
}

async function get(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  return { status: res.status, body: await res.json() };
}

export default function Page() {
  const [stats, setStats] = useState<any>(null);
  const [out, setOut] = useState<any>(null);

  const refresh = async () => setStats((await get("/api/work/stats")).body);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Backpressure handling — bounded queue + 429</h1>
        <p className="text-sm text-slate-300">
          Submitting too many jobs triggers backpressure (HTTP 429 + Retry-After). This prevents unbounded memory growth.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
            onClick={async () => {
              // stampede: 40 submissions
              const results = await Promise.all(
                Array.from({ length: 40 }, () => post("/api/work", { ms: 900 })),
              );
              setOut(results.slice(0, 8));
              await refresh();
            }}
          >
            Stampede submit (40)
          </button>
          <button
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500"
            onClick={async () => {
              setOut(await post("/api/work", { ms: 900 }));
              await refresh();
            }}
          >
            Submit one
          </button>
          <button
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
            onClick={async () => {
              await post("/api/work/reset");
              await refresh();
              setOut(null);
            }}
          >
            Reset
          </button>
        </div>

        <pre className="rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">{JSON.stringify(stats, null, 2)}</pre>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
        <h2 className="font-medium text-slate-200">Latest output (sample)</h2>
        <pre className="mt-3 rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">{JSON.stringify(out, null, 2)}</pre>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Production notes</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Use bounded queues; fail fast with Retry-After rather than OOMing.</li>
          <li>Apply load shedding per tenant/priority class.</li>
          <li>Client retries must be budgeted; otherwise you create retry storms.</li>
        </ul>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether backpressure handling is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For backpressure handling, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For backpressure handling, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For backpressure handling, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Backpressure Handling</div>
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

