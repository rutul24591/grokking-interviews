"use client";

import { useEffect, useState } from "react";

type Route = { path: string; chunk: string; weightKb: number };
type State = { routes: Route[]; activePath: string; logs: string[] };

export default function RouteSplitLab() {
  const [state, setState] = useState<State | null>(null);

  async function refresh() {
    const response = await fetch("http://localhost:4547/state");
    setState((await response.json()) as State);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function activate(path: string) {
    await fetch("http://localhost:4547/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path })
    });
    await refresh();
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Route chunks</h2>
        <div className="mt-4 grid gap-3">
          {state?.routes.map((route) => (
            <button key={route.path} className={`rounded-2xl border px-4 py-3 text-left ${route.path === state.activePath ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`} onClick={() => void activate(route.path)}>
              <p className="font-semibold">{route.path}</p>
              <p className={`mt-1 text-sm ${route.path === state.activePath ? "text-slate-200" : "text-slate-600"}`}>{route.chunk} · {route.weightKb} KB</p>
            </button>
          ))}
        </div>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Chunk activity</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{state?.logs.map((entry) => <li key={entry}>• {entry}</li>)}</ul>
      </article>
    </section>
  );
}
