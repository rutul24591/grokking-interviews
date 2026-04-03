"use client";

import { useMemo, useState } from "react";

import { SignalCard } from "../components/SignalCard";

async function hit(apiKey: string) {
  const res = await fetch("/api/protected", { headers: { "x-api-key": apiKey }, cache: "no-store" });
  const text = await res.text();
  return {
    status: res.status,
    retryAfter: res.headers.get("retry-after"),
    remaining: res.headers.get("x-ratelimit-remaining"),
    body: text ? JSON.parse(text) : null,
  };
}

const operatorChecks = [
  "Legitimate traffic should see a stable remaining budget and a predictable refill story.",
  "Aggressive burst traffic should trigger explicit retry guidance instead of silent failures.",
  "Different client identities should isolate their own budget and penalty-box state.",
];

const investigationSteps = [
  "Confirm whether the caller hit a soft burst limit or a hard abuse threshold.",
  "Check that retry-after values stay short enough for legitimate automation to recover.",
  "Validate that support can explain the rejection using rate-limit headers alone.",
];

export default function Page() {
  const [apiKey, setApiKey] = useState("demo");
  const [history, setHistory] = useState<any[]>([]);
  const summary = useMemo(() => {
    const blocked = history.filter((entry) => entry.status !== 200).length;
    const latest = history[0] ?? null;
    return [
      {
        label: "Observed responses",
        value: String(history.length),
        hint: "The console keeps the latest burst together so an operator can reason about bucket behavior.",
      },
      {
        label: "Blocked requests",
        value: String(blocked),
        hint: "A healthy limiter rejects abusive bursts while preserving signal for legitimate clients.",
      },
      {
        label: "Latest remaining",
        value: latest?.remaining ?? "—",
        hint: "Remaining budget should step down cleanly and expose retry timing when it hits zero.",
      },
    ];
  }, [history]);

  async function invokeMany(label: string, count: number, keyOverride?: string) {
    const next: any[] = [];
    const effectiveKey = keyOverride ?? apiKey;
    for (let index = 0; index < count; index += 1) {
      next.push({ label, key: effectiveKey, ...(await hit(effectiveKey)) });
    }
    setHistory((previous) => [...next, ...previous].slice(0, 16));
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-white">Rate Limit and Abuse Guardrail Lab</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          Compare a normal client flow, a burst from one identity, and a fresh identity that should still have clean
          budget. The goal is not only to reject abuse, but to make the limiter understandable enough for support,
          security, and product teams to explain what happened.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Client identity under test</h2>
            <p className="mt-1 text-sm text-slate-400">
              Drive the same key into a burst, then compare it with a different client identity to confirm isolation.
            </p>
          </div>
          <label className="space-y-1 text-sm">
            <div className="text-slate-300">API key</div>
            <input className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2" value={apiKey} onChange={(event) => setApiKey(event.target.value)} />
          </label>
          <div className="flex flex-wrap gap-2">
            <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={() => invokeMany("Single request", 1)}>Single request</button>
            <button className="rounded bg-amber-600 px-4 py-2 text-sm font-semibold hover:bg-amber-500" onClick={() => invokeMany("Burst x6", 6)}>Burst x6</button>
            <button className="rounded bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500" onClick={() => invokeMany("Burst x12", 12)}>Burst x12</button>
            <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={() => invokeMany("Fresh identity", 3, `${apiKey}-new`)}>Try fresh identity</button>
          </div>
          <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">Limiter review checklist</div>
            <ul className="mt-3 space-y-2 text-slate-400">
              {operatorChecks.map((check) => (
                <li key={check}>• {check}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            {summary.map((item) => (
              <SignalCard key={item.label} {...item} />
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {investigationSteps.map((step, index) => (
              <div key={step} className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Investigation {index + 1}</div>
                <p className="mt-2">{step}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Admission history</h2>
              <p className="mt-1 text-sm text-slate-400">
                Inspect the budget drain, retry hints, and isolation behavior across bursts. The limiter is only safe if
                it protects the service without obscuring why a request was rejected.
              </p>
            </div>
            <pre className="overflow-auto rounded-xl border border-slate-700 bg-black/40 p-4 text-xs text-slate-100">{JSON.stringify(history, null, 2)}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}
