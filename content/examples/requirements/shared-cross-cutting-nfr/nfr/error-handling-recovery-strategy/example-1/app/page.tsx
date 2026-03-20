"use client";

import { useEffect, useMemo, useState } from "react";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text}`);
  return JSON.parse(text) as T;
}

export default function Page() {
  const [idempotencyKey, setIdempotencyKey] = useState("idem-12345678");
  const [contentId, setContentId] = useState("post-1");
  const [state, setState] = useState<any>(null);
  const [last, setLast] = useState<any>(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);

  async function refresh() {
    try {
      setState(await json("/api/state"));
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 1200);
    return () => clearInterval(t);
  }, []);

  async function publish() {
    setRunning(true);
    setError("");
    try {
      const r = await json("/api/publish", {
        method: "POST",
        body: JSON.stringify({
          idempotencyKey,
          contentId,
          retry: { maxAttempts: 4, baseDelayMs: 60, maxDelayMs: 800, jitterPct: 0.2 },
        }),
      });
      setLast(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
      await refresh();
    }
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    setLast(null);
    await refresh();
  }

  const breaker = useMemo(() => state?.breaker, [state]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Resilient Publish</h1>
        <p className="mt-2 text-slate-300">
          Idempotency + retries + circuit breaker around a flaky dependency.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Publish</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Idempotency key</span>
              <input
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                value={idempotencyKey}
                onChange={(e) => setIdempotencyKey(e.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Content ID</span>
              <input
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={publish}
                disabled={running}
                className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
              >
                {running ? "Publishing..." : "Publish"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-6 rounded border border-slate-800 bg-black/30 p-4 text-sm">
            <div className="font-semibold text-slate-200">Circuit breaker</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="rounded bg-black/40 px-3 py-2">
                state: <span className="font-mono text-slate-100">{breaker?.state ?? "—"}</span>
              </div>
              <div className="rounded bg-black/40 px-3 py-2">
                failures: <span className="font-mono text-slate-100">{breaker?.failures ?? 0}</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-300">
              dependency writes:{" "}
              <span className="font-mono text-slate-100">{state?.dependencyWrites ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Last response</h2>
          <pre className="mt-4 overflow-auto rounded border border-slate-800 bg-black/40 p-4 text-xs text-slate-100">
{JSON.stringify(last, null, 2)}
          </pre>
          <h3 className="mt-6 text-sm font-semibold text-slate-200">State</h3>
          <pre className="mt-2 overflow-auto rounded border border-slate-800 bg-black/40 p-4 text-xs text-slate-100">
{JSON.stringify(state, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}

