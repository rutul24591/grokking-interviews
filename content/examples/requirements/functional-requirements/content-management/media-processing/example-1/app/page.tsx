"use client";

import { useEffect, useState } from "react";

type Job = {
  id: string;
  asset: string;
  stage: "queued" | "transcoding" | "ready" | "failed";
  outputs: string[];
  retryCount: number;
};

type ProcessingState = {
  jobs: Job[];
  outputProfiles: string[];
  operatorQueue: string[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ProcessingState | null>(null);

  async function refresh() {
    const response = await fetch("/api/media-processing/state");
    setState((await response.json()) as ProcessingState);
  }

  async function act(type: "advance" | "fail") {
    const response = await fetch("/api/media-processing/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as ProcessingState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Media Processing Pipeline</h1>
      <p className="mt-2 text-slate-300">Track derivative generation, operator retries, and failed media jobs before assets are allowed into live content.</p>
      <section className="mt-8 grid gap-4">
        <div className="flex gap-3">
          <button onClick={() => void act("advance")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Advance pipeline</button>
          <button onClick={() => void act("fail")} className="rounded border border-rose-700 px-4 py-2 text-sm font-semibold text-rose-300">Simulate failure</button>
        </div>
        {state?.jobs.map((job) => (
          <article key={job.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <div className="font-semibold text-slate-100">{job.asset}</div>
            <div className="mt-1 text-xs text-slate-400">{job.id} · {job.stage} · retries {job.retryCount}</div>
            <div className="mt-2 text-xs text-slate-400">outputs: {job.outputs.join(", ") || "pending"}</div>
          </article>
        ))}
        <p className="text-sm text-slate-400">Profiles: {state?.outputProfiles.join(", ")} · operator queue: {state?.operatorQueue.join(", ") || "empty"} · {state?.lastMessage}</p>
      </section>
    </main>
  );
}
