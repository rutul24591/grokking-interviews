"use client";
import { useEffect, useState } from "react";

type FeatureFlag = {
  id: string;
  label: string;
  supported: boolean;
  fallback: string;
  required: boolean;
  affectedSurface: string;
};
type FeatureState = {
  features: FeatureFlag[];
  browserProfile: string;
  releaseChannel: string;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<FeatureState | null>(null);
  async function refresh() { const response = await fetch('/api/features/state'); setState((await response.json()) as FeatureState); }
  async function toggle(id: string, supported: boolean) { const response = await fetch('/api/features/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, supported }) }); setState((await response.json()) as FeatureState); }
  useEffect(() => { void refresh(); }, []);
  const supportedCount = state?.features.filter((feature) => feature.supported).length ?? 0;
  const requiredGaps = state?.features.filter((feature) => feature.required && !feature.supported).length ?? 0;

  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Feature Detection</h1><p className="mt-2 text-slate-300">Gate advanced UI behavior on real capability checks and expose the fallback path for unsupported browsers.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><div className="rounded-lg border border-slate-800 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Browser profile</div><div className="mt-2 font-semibold text-slate-100">{state?.browserProfile}</div><div className="mt-3 text-slate-400">Release {state?.releaseChannel}</div></div><div className="mt-4 grid gap-3"><div className="rounded-lg border border-slate-800 px-3 py-3">Supported capabilities <span className="font-semibold text-slate-100">{supportedCount}</span></div><div className="rounded-lg border border-slate-800 px-3 py-3">Required gaps <span className="font-semibold text-slate-100">{requiredGaps}</span></div></div><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><ul className="space-y-3 text-sm text-slate-300">{state?.features.map((feature) => <li key={feature.id} className="rounded border border-slate-800 px-3 py-3"><div className="flex items-center justify-between gap-3"><div><div className="font-semibold text-slate-100">{feature.label}</div><div className="mt-1 text-xs uppercase tracking-wide text-slate-500">{feature.affectedSurface}</div></div><button onClick={() => void toggle(feature.id, !feature.supported)} className="rounded bg-sky-600 px-3 py-2 text-xs font-semibold hover:bg-sky-500">Mark {feature.supported ? "unsupported" : "supported"}</button></div><div className="mt-3 grid gap-2 md:grid-cols-3"><div className="rounded border border-slate-800 px-3 py-2">required: {String(feature.required)}</div><div className="rounded border border-slate-800 px-3 py-2">supported: {String(feature.supported)}</div><div className="rounded border border-slate-800 px-3 py-2">fallback: {feature.fallback}</div></div></li>)}</ul></article></section></main>;
}
