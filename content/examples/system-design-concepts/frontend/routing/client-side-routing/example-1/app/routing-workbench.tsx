"use client";

import { useEffect, useState } from "react";

type Route = { path: string; label: string; preservedState: string };
type State = { routes: Route[]; activePath: string; navigationLog: string[] };

export default function RoutingWorkbench() {
  const [state, setState] = useState<State | null>(null);

  async function refresh() {
    const response = await fetch("http://localhost:4541/state");
    setState((await response.json()) as State);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function navigate(path: string) {
    await fetch("http://localhost:4541/navigate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path })
    });
    await refresh();
  }

  const activeRoute = state?.routes.find((route) => route.path === state.activePath);

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Route transitions</h2>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {state?.routes.map((route) => (
            <button key={route.path} className={`rounded-full px-4 py-2 font-semibold ${route.path === state.activePath ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-800"}`} onClick={() => void navigate(route.path)}>
              {route.label}
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Active route: {activeRoute?.label ?? "Feed"}</p>
          <p className="mt-2">Preserved state: {activeRoute?.preservedState ?? "scroll=320"}</p>
        </div>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Navigation log</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {state?.navigationLog.map((entry) => <li key={entry}>• {entry}</li>)}
        </ul>
      </article>
    </section>
  );
}
