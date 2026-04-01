"use client";
import { useEffect, useState } from "react";

type GlobalIncident = {
  id: string;
  channel: "window.onerror" | "unhandledrejection";
  message: string;
  acknowledged: boolean;
  severity: "warning" | "error" | "fatal";
  duplicateCount: number;
};
type GlobalState = { incidents: GlobalIncident[]; escalationMode: string; onCallTarget: string; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<GlobalState | null>(null);
  async function refresh() { const response = await fetch('/api/global-handlers/state'); setState((await response.json()) as GlobalState); }
  async function dispatch(channel: "window.onerror" | "unhandledrejection", severity: "warning" | "error" | "fatal") { const response = await fetch('/api/global-handlers/dispatch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ channel, severity, message: `${channel} synthetic event` }) }); setState((await response.json()) as GlobalState); }
  useEffect(() => { void refresh(); }, []);
  const fatalCount = state?.incidents.filter((incident) => incident.severity === "fatal").length ?? 0;
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Global Error Handlers</h1><p className="mt-2 text-slate-300">Capture uncaught exceptions and unhandled promise rejections that escape component-level recovery.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><div className="rounded-lg border border-slate-800 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Escalation mode</div><div className="mt-2 font-semibold text-slate-100">{state?.escalationMode}</div><div className="mt-2 text-slate-400">On-call target: {state?.onCallTarget}</div></div><div className="mt-4 grid gap-3"><div className="rounded-lg border border-slate-800 px-3 py-3">Open incidents <span className="font-semibold text-slate-100">{state?.incidents.length ?? 0}</span></div><div className="rounded-lg border border-slate-800 px-3 py-3">Fatal incidents <span className="font-semibold text-slate-100">{fatalCount}</span></div></div><div className="mt-4 flex flex-wrap gap-3"><button onClick={() => void dispatch("window.onerror", "error")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Trigger sync error</button><button onClick={() => void dispatch("unhandledrejection", "warning")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Trigger async rejection</button><button onClick={() => void dispatch("window.onerror", "fatal")} className="rounded border border-rose-700 px-4 py-2 text-sm font-semibold text-rose-200">Trigger fatal incident</button></div><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><ul className="space-y-3 text-sm text-slate-300">{state?.incidents.map((incident) => <li key={incident.id} className="rounded border border-slate-800 px-3 py-3"><div className="flex items-center justify-between"><div className="font-semibold text-slate-100">{incident.channel}</div><div className="flex gap-3 text-xs uppercase tracking-wide text-slate-500"><span>{incident.severity}</span><span>{incident.duplicateCount}x</span></div></div><div className="mt-2 text-slate-400">{incident.message}</div></li>)}</ul></article></section></main>;
}
