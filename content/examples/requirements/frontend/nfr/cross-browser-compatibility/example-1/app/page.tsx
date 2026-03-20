"use client";

import { useEffect, useState } from "react";

type Capabilities = {
  intersectionObserver: boolean;
  resizeObserver: boolean;
  intl: boolean;
  webCrypto: boolean;
  broadcastChannel: boolean;
};
type Recommendation = { id: string; title: string; action: string; tradeoff: string };

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(res.status + " " + res.statusText + (text ? " — " + text : ""));
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

function detect(): Capabilities {
  return {
    intersectionObserver: typeof (globalThis as any).IntersectionObserver !== "undefined",
    resizeObserver: typeof (globalThis as any).ResizeObserver !== "undefined",
    intl: typeof (globalThis as any).Intl !== "undefined",
    webCrypto: Boolean((globalThis as any).crypto?.subtle),
    broadcastChannel: typeof (globalThis as any).BroadcastChannel !== "undefined",
  };
}

export default function Page() {
  const [caps, setCaps] = useState<Capabilities | null>(null);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [error, setError] = useState("");

  async function analyze(c: Capabilities) {
    const r = await json<{ recommendations: Recommendation[] }>("/api/recommend", {
      method: "POST",
      body: JSON.stringify({ capabilities: c }),
    });
    setRecs(r.recommendations);
  }

  useEffect(() => {
    const c = detect();
    setCaps(c);
    analyze(c).catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Feature Detection Lab</h1>
        <p className="mt-2 text-slate-300">
          Cross-browser compatibility is best handled by feature detection + explicit fallbacks (not UA sniffing).
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div>
        ) : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold">Detected capabilities</h2>
        <pre className="mt-4 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">
          {JSON.stringify(caps, null, 2)}
        </pre>
      </section>

      <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold">Recommendations</h2>
        <div className="mt-4 grid gap-3">
          {recs.map((r) => (
            <div key={r.id} className="rounded border border-slate-800 bg-black/20 p-4">
              <div className="text-sm font-semibold">{r.title}</div>
              <div className="mt-2 text-sm text-slate-200">{r.action}</div>
              <div className="mt-2 text-xs text-slate-400">Trade-off: {r.tradeoff}</div>
            </div>
          ))}
          {!recs.length ? (
            <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-slate-200">
              No compatibility gaps detected for these checks.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

