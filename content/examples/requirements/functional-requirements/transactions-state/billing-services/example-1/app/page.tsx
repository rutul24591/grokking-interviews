"use client";

import { useEffect, useMemo, useState } from "react";

type BillingJob = {
  id: string;
  account: string;
  stage: string;
  retries: number;
  amount: string;
};

type BillingServiceState = {
  cycle: "daily" | "monthly";
  summary: { retries: number; inFlight: number };
  jobs: BillingJob[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<BillingServiceState | null>(null);
  const [selectedJob, setSelectedJob] = useState<string>("job-2");

  async function refresh() {
    const response = await fetch("/api/billing-services/state");
    setState((await response.json()) as BillingServiceState);
  }

  async function act(type: "switch-cycle" | "run-job", value?: string) {
    const response = await fetch("/api/billing-services/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value })
    });
    setState((await response.json()) as BillingServiceState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const selected = state?.jobs.find((job) => job.id === selectedJob) ?? state?.jobs[0] ?? null;
  const executionNotes = useMemo(() => {
    if (!state) return [];
    return [
      `${state.summary.inFlight} jobs still need to finish before the cycle can close.`,
      `${state.summary.retries} jobs are in retry or recovery mode.`,
      state.cycle === "monthly" ? "Monthly cycle runs need customer-facing invoice correctness before posting." : "Daily cycle runs prioritize incremental reconciliation."
    ];
  }, [state]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Billing Services Runbook</h1>
      <p className="mt-2 text-slate-300">Drive invoice-cycle execution, inspect retry queues, and verify when a billing run is safe to post into the ledger.</p>
      <section className="mt-8 grid gap-6 xl:grid-cols-[320px,1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Run controls</h2>
          <div className="mt-4 grid gap-3">
            <button onClick={() => void act("switch-cycle", "daily")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Daily</button>
            <button onClick={() => void act("switch-cycle", "monthly")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Monthly</button>
          </div>
          <div className="mt-5 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">cycle: {state?.cycle}</div>
            <div className="rounded border border-slate-800 px-3 py-2">in-flight jobs: {state?.summary.inFlight ?? 0}</div>
            <div className="rounded border border-slate-800 px-3 py-2">jobs with retries: {state?.summary.retries ?? 0}</div>
          </div>
          <ul className="mt-4 grid gap-2 text-xs text-slate-400">
            {executionNotes.map((note) => (
              <li key={note} className="rounded border border-slate-800 px-3 py-2">{note}</li>
            ))}
          </ul>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.jobs.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => setSelectedJob(job.id)}
              className={`w-full rounded-xl border p-5 text-left text-sm ${selected?.id === job.id ? "border-sky-500 bg-slate-900" : "border-slate-800 bg-slate-900/60"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-100">{job.account}</div>
                  <div className="mt-1 text-xs text-slate-500">{job.amount}</div>
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    void act("run-job", job.id);
                  }}
                  className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold"
                >
                  Run job
                </button>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <div className="rounded border border-slate-800 px-3 py-2">stage: {job.stage}</div>
                <div className="rounded border border-slate-800 px-3 py-2">retries: {job.retries}</div>
              </div>
            </button>
          ))}
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Selected job detail</h2>
          {selected ? (
            <div className="mt-4 grid gap-3">
              <div className="rounded border border-slate-800 px-3 py-2">account: {selected.account}</div>
              <div className="rounded border border-slate-800 px-3 py-2">stage: {selected.stage}</div>
              <div className="rounded border border-slate-800 px-3 py-2">retries: {selected.retries}</div>
              <div className="rounded border border-slate-800 px-3 py-2">amount: {selected.amount}</div>
              <div className="rounded border border-slate-800 px-3 py-2">next operator step: {selected.stage === "posted-ledger" ? "cycle step complete" : "review retry outcome after execution"}</div>
            </div>
          ) : null}
        </article>
      </section>
    </main>
  );
}
