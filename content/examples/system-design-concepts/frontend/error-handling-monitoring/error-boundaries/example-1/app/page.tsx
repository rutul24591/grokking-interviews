"use client";
import { useEffect, useState } from "react";

type Widget = { id: string; title: string; status: "healthy" | "crashed"; owner: string };
type BoundaryState = { widgets: Widget[]; selectedWidget: string; fallbackVisible: boolean; incidentCount: number; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<BoundaryState | null>(null);
  async function refresh() {
    const response = await fetch("/api/error-boundary/state");
    setState((await response.json()) as BoundaryState);
  }
  async function reset(widgetId: string) {
    const response = await fetch("/api/error-boundary/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ widgetId })
    });
    setState((await response.json()) as BoundaryState);
  }
  useEffect(() => { void refresh(); }, []);
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Error Boundaries</h1><p className="mt-2 text-slate-300">Isolate failing widgets, render a fallback, and recover without tearing down the rest of the screen.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><div className="rounded-lg border border-slate-800 px-3 py-3"><div>Incident count <span className="font-semibold text-slate-100">{state?.incidentCount ?? 0}</span></div><div className="mt-2">Fallback visible <span className="font-semibold text-slate-100">{state?.fallbackVisible ? "yes" : "no"}</span></div></div><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><ul className="space-y-3 text-sm text-slate-300">{state?.widgets.map((widget) => <li key={widget.id} className="rounded border border-slate-800 px-3 py-3"><div className="flex items-center justify-between"><div className="font-semibold text-slate-100">{widget.title}</div><span className="text-xs uppercase tracking-wide text-slate-400">{widget.owner}</span></div><div className="mt-2 flex items-center justify-between"><span>{widget.status}</span><button onClick={() => void reset(widget.id)} className="rounded bg-sky-600 px-3 py-2 text-xs font-semibold hover:bg-sky-500">Reset widget</button></div></li>)}</ul></article></section></main>;
}
