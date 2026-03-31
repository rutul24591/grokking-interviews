"use client";

import { useEffect, useState } from "react";

type Route = { path: string; minimumRole: string; fallback: string };
type State = { role: string; activePath: string; routes: Route[]; logs: string[] };

export default function RouteGuardsLab() {
  const [state, setState] = useState<State | null>(null);

  async function refresh() {
    const response = await fetch("http://localhost:4548/state");
    setState((await response.json()) as State);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function run(actionId: string, payload: Record<string, string>) {
    await fetch("http://localhost:4548/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionId, ...payload })
    });
    await refresh();
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Current role: {state?.role}</h2>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {['guest', 'member', 'admin'].map((role) => <button key={role} className={`rounded-full px-4 py-2 font-semibold ${state?.role === role ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-800"}`} onClick={() => void run("set-role", { role })}>{role}</button>)}
        </div>
        <div className="mt-6 grid gap-3">
          {state?.routes.map((route) => <button key={route.path} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-800" onClick={() => void run("navigate", { path: route.path })}>{route.path} → min role {route.minimumRole}</button>)}
        </div>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Resolved destination</h2>
        <p className="mt-4 text-sm text-slate-700">Active path: <span className="font-semibold text-slate-950">{state?.activePath}</span></p>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{state?.logs.map((entry) => <li key={entry}>• {entry}</li>)}</ul>
      </article>
    </section>
  );
}
