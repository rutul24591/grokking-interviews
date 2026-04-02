"use client";

import { useState } from "react";

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
    </main>
  );
}

