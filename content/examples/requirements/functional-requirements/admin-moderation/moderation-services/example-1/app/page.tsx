"use client";

import { useEffect, useState } from "react";

type ServiceLane = {
  id: string;
  name: string;
  mode: "auto" | "review" | "blocked";
  backlog: number;
};

type ServiceState = {
  policyVersion: string;
  lanes: ServiceLane[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ServiceState | null>(null);

  async function refresh() {
    const response = await fetch("/api/moderation-services/state");
    setState((await response.json()) as ServiceState);
  }

  async function act(type: "roll-policy" | "toggle-lane", id?: string) {
    const response = await fetch("/api/moderation-services/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id })
    });
    setState((await response.json()) as ServiceState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Moderation Services Control Plane</h1>
      <p className="mt-2 text-slate-300">Roll policy versions, inspect service lanes, and force risky categories into human review when automation drifts.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Policy version</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.policyVersion}</div>
          <button onClick={() => void act("roll-policy")} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Roll policy</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.lanes.map((lane) => (
            <div key={lane.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{lane.name}</div>
                  <div className="mt-1 text-xs text-slate-500">mode {lane.mode} · backlog {lane.backlog}</div>
                </div>
                <button onClick={() => void act("toggle-lane", lane.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Toggle lane</button>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
