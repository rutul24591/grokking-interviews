"use client";

import { useMemo, useState } from "react";

import { SignalCard } from "../components/SignalCard";

async function run(priority: "low" | "high", durationMs: number) {
  const res = await fetch(`/api/work?priority=${priority}&durationMs=${durationMs}`, { cache: "no-store" });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null, retryAfter: res.headers.get("retry-after"), priority };
}

const reviewChecks = [
  "High-priority work should keep flowing even when the queue is protecting the service.",
  "Low-priority work should fail fast with enough metadata to make retries safe and visible.",
  "Operators need a simple summary that explains whether the shed policy is aligned with business priority.",
];

const responsePlans = [
  "Escalate only if high-priority work starts seeing the same shed behavior as bulk traffic.",
  "Tune retry-after windows when low-priority callers immediately re-enter the queue.",
  "Record which product features were deliberately sacrificed so the business tradeoff is explicit.",
];

export default function Page() {
  const [durationMs, setDurationMs] = useState(250);
  const [history, setHistory] = useState<any[]>([]);
  const summary = useMemo(() => {
    const highOk = history.filter((item) => item.priority === "high" && item.status === 200).length;
    const lowRejected = history.filter((item) => item.priority === "low" && item.status !== 200).length;
    const latestRetry = history.find((item) => item.retryAfter)?.retryAfter ?? "—";
    return [
      {
        label: "High-priority admitted",
        value: String(highOk),
        hint: "Critical flows should remain available when the system protects itself under surge.",
      },
      {
        label: "Low-priority shed",
        value: String(lowRejected),
        hint: "Shedding only helps if it is selective and measurable instead of indiscriminately failing traffic.",
      },
      {
        label: "Latest retry-after",
        value: latestRetry,
        hint: "Rejected work should include a bounded retry signal so callers can back off cleanly.",
      },
    ];
  }, [history]);

  async function invoke(label: string, priority: "low" | "high", count = 1) {
    const next = [] as any[];
    for (let index = 0; index < count; index += 1) {
      next.push({ label, ...(await run(priority, durationMs)) });
    }
    setHistory((previous) => [...next, ...previous].slice(0, 16));
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-white">Load Shedding Decision Console</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          Stress a protected worker queue with high- and low-priority traffic. The goal is to verify that shed policy
          preserves critical work, returns actionable retry metadata, and leaves a readable trail for incident review.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Workload pressure</h2>
            <p className="mt-1 text-sm text-slate-400">
              Increase duration to simulate saturation, then compare low-priority shedding with high-priority admission.
            </p>
          </div>
          <label className="space-y-1 text-sm">
            <div className="text-slate-300">Work duration (ms)</div>
            <input className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2" type="number" value={durationMs} onChange={(event) => setDurationMs(Number(event.target.value))} />
          </label>
          <div className="flex flex-wrap gap-2">
            <button className="rounded bg-amber-600 px-4 py-2 text-sm font-semibold hover:bg-amber-500" onClick={() => invoke("Low-priority burst", "low", 4)}>Burst low x4</button>
            <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={() => invoke("High-priority burst", "high", 4)}>Burst high x4</button>
            <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={() => invoke("Mixed follow-up", "low", 2)}>Mixed follow-up</button>
          </div>
          <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">Shedding checklist</div>
            <ul className="mt-3 space-y-2 text-slate-400">
              {reviewChecks.map((check) => (
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
            {responsePlans.map((plan, index) => (
              <div key={plan} className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Response plan {index + 1}</div>
                <p className="mt-2">{plan}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Admission history</h2>
              <p className="mt-1 text-sm text-slate-400">
                Review how the queue handled each burst. The difference between graceful shedding and customer-visible
                collapse is whether the system remains intentional under pressure.
              </p>
            </div>
            <pre className="overflow-auto rounded-xl border border-slate-700 bg-black/40 p-4 text-xs text-slate-100">{JSON.stringify(history, null, 2)}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}
