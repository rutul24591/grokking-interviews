"use client";
import { useEffect, useMemo, useState } from "react";

type Panel = { id: string; title: string; priority: "high" | "medium" | "low"; status: "healthy" | "stale" | "degraded"; owner: string };
type DashboardState = { viewport: string; panels: Panel[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<DashboardState | null>(null);

  async function refresh() {
    const response = await fetch("/api/dashboard/state");
    setState((await response.json()) as DashboardState);
  }

  async function updateLayout(viewport: "desktop" | "tablet" | "mobile") {
    const response = await fetch("/api/dashboard/layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewport })
    });
    setState((await response.json()) as DashboardState);
  }

  useEffect(() => { void refresh(); }, []);

  const orderedPanels = useMemo(() => [...(state?.panels ?? [])].sort((a, b) => {
    const score = { high: 0, medium: 1, low: 2 };
    return score[a.priority] - score[b.priority];
  }), [state]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Dashboard Design</h1>
      <p className="mt-2 text-slate-300">Balance panel priority, viewport density, and degraded data states so the dashboard stays decision-useful under real-world constraints.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="rounded-lg border border-slate-800 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Viewport</div>
            <div className="mt-2 font-semibold text-slate-100">{state?.viewport}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => void updateLayout("desktop")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Desktop</button>
            <button onClick={() => void updateLayout("tablet")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Tablet</button>
            <button onClick={() => void updateLayout("mobile")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Mobile</button>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="grid gap-4 md:grid-cols-2">
          {orderedPanels.map((panel) => (
            <div key={panel.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-slate-100">{panel.title}</div>
                <span className="text-xs uppercase tracking-wide text-slate-500">{panel.priority}</span>
              </div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2 text-slate-400">owner: {panel.owner}</div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2 text-slate-400">status: {panel.status}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
