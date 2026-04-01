"use client";
import { useEffect, useState } from "react";

type Capability = {
  id: string;
  feature: string;
  mode: "full" | "degraded";
  fallbackUi: string;
  critical: boolean;
  journey: string;
};
type DegradationState = { capabilities: Capability[]; degradedBanner: string; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<DegradationState | null>(null);
  async function refresh() { const response = await fetch('/api/degradation/state'); setState((await response.json()) as DegradationState); }
  async function toggle(id: string, mode: "full" | "degraded") { const response = await fetch('/api/degradation/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, mode }) }); setState((await response.json()) as DegradationState); }
  useEffect(() => { void refresh(); }, []);
  const degradedCount = state?.capabilities.filter((cap) => cap.mode === "degraded").length ?? 0;
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Graceful Degradation</h1><p className="mt-2 text-slate-300">Downgrade optional features while keeping essential user flows available.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><div className="rounded-lg border border-slate-800 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Banner scope</div><div className="mt-2 font-semibold text-slate-100">{state?.degradedBanner}</div></div><div className="mt-4 grid gap-3"><div className="rounded-lg border border-slate-800 px-3 py-3">Degraded features <span className="font-semibold text-slate-100">{degradedCount}</span></div><div className="rounded-lg border border-slate-800 px-3 py-3">Critical flows impacted <span className="font-semibold text-slate-100">{state?.capabilities.filter((cap) => cap.critical && cap.mode === "degraded").length ?? 0}</span></div></div><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><ul className="space-y-3 text-sm text-slate-300">{state?.capabilities.map((cap) => <li key={cap.id} className="rounded border border-slate-800 px-3 py-3"><div className="flex items-center justify-between gap-3"><div><div className="font-semibold text-slate-100">{cap.feature}</div><div className="mt-1 text-xs uppercase tracking-wide text-slate-500">{cap.journey}</div></div><button onClick={() => void toggle(cap.id, cap.mode === "full" ? "degraded" : "full")} className="rounded bg-sky-600 px-3 py-2 text-xs font-semibold hover:bg-sky-500">Switch to {cap.mode === "full" ? "degraded" : "full"}</button></div><div className="mt-3 grid gap-2 md:grid-cols-3"><div className="rounded border border-slate-800 px-3 py-2">mode: {cap.mode}</div><div className="rounded border border-slate-800 px-3 py-2">critical: {String(cap.critical)}</div><div className="rounded border border-slate-800 px-3 py-2">fallback: {cap.fallbackUi}</div></div></li>)}</ul></article></section></main>;
}
