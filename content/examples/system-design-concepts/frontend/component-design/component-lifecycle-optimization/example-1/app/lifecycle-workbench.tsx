"use client";

import { useEffect, useState } from "react";

type Status = { mounts: number; cleanups: number; polls: number; notes: string[] };

function LiveWidget({ active }: { active: boolean }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;
    void (async () => {
      await fetch("http://localhost:4523/widget/mount", { method: "POST" });
      interval = setInterval(async () => {
        await fetch("http://localhost:4523/widget/poll", { method: "POST" });
        const response = await fetch("http://localhost:4523/widget/status");
        if (!cancelled) setStatus((await response.json()) as Status);
      }, 1000);
    })();

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      void fetch("http://localhost:4523/widget/cleanup", { method: "POST" });
    };
  }, [active]);

  if (!active) return <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">Widget unmounted. No polling work is running.</div>;
  return (
    <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
      <p className="font-semibold text-slate-950">Live widget status</p>
      <p className="mt-2">Mounts: {status?.mounts ?? 0} · Cleanups: {status?.cleanups ?? 0} · Polls: {status?.polls ?? 0}</p>
      <ul className="mt-3 space-y-2">{status?.notes.map((note) => <li key={note}>• {note}</li>)}</ul>
    </div>
  );
}

export default function LifecycleWorkbench() {
  const [active, setActive] = useState(true);
  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Lifecycle controls</h2>
        <button className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white" onClick={() => setActive((current) => !current)}>
          {active ? "Unmount widget" : "Mount widget"}
        </button>
        <p className="mt-4 text-sm text-slate-600">Mounting starts polling. Unmounting should release the interval immediately.</p>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <LiveWidget active={active} />
      </article>
    </section>
  );
}
