"use client";

import { useMemo, useState } from "react";

import { SignalCard } from "../components/SignalCard";

async function post(body: unknown) {
  const res = await fetch("/api/capacity", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

const operatingNotes = [
  "Plan for baseline weekday traffic before layering seasonal spikes.",
  "Carry enough headroom to absorb one instance-group failure without paging.",
  "Track concurrency, queue wait, and CPU saturation together; one metric alone lies.",
];

const planningChecks = [
  "Recommended instances cover steady-state load and failure-domain headroom.",
  "Per-instance concurrency stays inside the p95 latency target.",
  "The projected reserve can absorb a release rollback or regional spillover.",
];

export default function Page() {
  const [input, setInput] = useState({
    rps: 800,
    p95LatencyMs: 220,
    cpuMsPerReq: 8,
    coresPerInstance: 2,
    targetUtilization: 0.65,
    headroomPct: 30,
  });
  const [out, setOut] = useState<any>(null);
  const [runLabel, setRunLabel] = useState("Baseline weekday plan");
  const recommendation = useMemo(() => out?.body?.plan ?? null, [out]);
  const summary = useMemo(
    () => [
      {
        label: "Planner status",
        value: out ? String(out.status) : "Not run",
        hint: "The planner should stay deterministic so on-call can trust repeat runs.",
      },
      {
        label: "Recommended fleet",
        value: recommendation?.instances ? `${recommendation.instances} nodes` : "—",
        hint: "This should represent the minimum safe fleet after headroom is applied.",
      },
      {
        label: "Concurrency target",
        value: recommendation?.perInstanceConcurrency ? String(recommendation.perInstanceConcurrency) : "—",
        hint: "Concurrency should not push the service into a latency cliff at p95.",
      },
    ],
    [out, recommendation],
  );

  async function calculate(label: string, overrides?: Partial<typeof input>) {
    const payload = { ...input, ...overrides };
    setRunLabel(label);
    setOut(await post(payload));
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-white">Capacity Planning Control Room</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          Model a backend fleet plan from request rate, CPU cost, and target utilization. The workflow is built for the
          real question capacity planning teams answer: how many nodes are needed, what reserve is left after a zone
          failure, and whether the plan still holds when traffic jumps during a launch or incident.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Traffic and efficiency inputs</h2>
            <p className="mt-1 text-sm text-slate-400">
              Adjust the assumptions, then compare the baseline plan with a launch spike and an incident reserve check.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            {Object.entries(input).map(([key, value]) => (
              <label key={key} className="space-y-1">
                <div className="text-slate-300">{key}</div>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2"
                  value={String(value)}
                  onChange={(event) =>
                    setInput((previous) => ({ ...previous, [key]: Number(event.target.value) }))
                  }
                />
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
              onClick={() => calculate("Baseline weekday plan")}
            >
              Calculate baseline
            </button>
            <button
              className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium hover:bg-sky-500"
              onClick={() => calculate("Launch spike plan", { rps: input.rps * 2, headroomPct: input.headroomPct + 10 })}
            >
              Model launch spike
            </button>
            <button
              className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium hover:bg-amber-500"
              onClick={() => calculate("Zone failure reserve check", { targetUtilization: 0.55, headroomPct: input.headroomPct + 15 })}
            >
              Check zone loss
            </button>
          </div>
          <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">Current planning scenario</div>
            <div className="mt-1">{runLabel}</div>
            <ul className="mt-3 space-y-2 text-slate-400">
              {operatingNotes.map((note) => (
                <li key={note}>• {note}</li>
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
          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Planner review</h2>
              <p className="mt-1 text-sm text-slate-400">
                A capacity plan is only useful if the assumptions are visible and the operator can challenge them.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {planningChecks.map((check, index) => (
                <div key={check} className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Check {index + 1}</div>
                  <p className="mt-2">{check}</p>
                </div>
              ))}
            </div>
            <pre className="overflow-auto rounded-xl bg-slate-950/50 p-4 text-xs text-slate-100">
              {JSON.stringify(out, null, 2)}
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
