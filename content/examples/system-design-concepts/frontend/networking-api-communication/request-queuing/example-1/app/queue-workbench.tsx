"use client";

import { useMemo, useState } from "react";

type QueueJob = {
  id: number;
  label: string;
  status: "queued" | "processing" | "done";
};

export default function QueueWorkbench() {
  const [jobs, setJobs] = useState<QueueJob[]>([]);
  const [nextId, setNextId] = useState(1);
  const [status, setStatus] = useState("idle");

  const backlog = useMemo(() => jobs.filter((job) => job.status !== "done").length, [jobs]);

  async function enqueueJob() {
    const label = `article-${nextId}-metrics`;
    setJobs((current) => [{ id: nextId, label, status: "queued" }, ...current]);
    setNextId((current) => current + 1);
    await fetch("http://localhost:4400/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label })
    });
  }

  async function refreshQueue() {
    setStatus("refreshing");
    const payload = (await fetch("http://localhost:4400/jobs").then((response) => response.json())) as { jobs: QueueJob[] };
    setJobs(payload.jobs);
    setStatus("synced");
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Queue controls</h2>
        <p className="mt-2 text-sm text-slate-600">Backlog: {backlog} jobs waiting or running. The API only processes two jobs at a time.</p>
        <div className="mt-4 flex gap-3">
          <button onClick={() => void enqueueJob()} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Enqueue job
          </button>
          <button onClick={() => void refreshQueue()} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            Refresh queue
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-700">{status}</p>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Queue state</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {jobs.map((job) => (
            <li key={job.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span>{job.label}</span>
              <span className="font-medium">{job.status}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
