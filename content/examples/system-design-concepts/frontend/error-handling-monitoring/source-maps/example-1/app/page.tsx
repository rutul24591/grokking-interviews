"use client";
import { useEffect, useState } from "react";

type BuildArtifact = {
  id: string;
  asset: string;
  sourceMaps: "private" | "public" | "disabled";
  release: string;
  uploadedToErrorTool: boolean;
  containsSensitivePaths: boolean;
};
type SourceMapState = { artifacts: BuildArtifact[]; deploymentSurface: string; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<SourceMapState | null>(null);
  async function refresh() { const response = await fetch('/api/source-maps/state'); setState((await response.json()) as SourceMapState); }
  async function update(id: string, sourceMaps: "private" | "public" | "disabled") { const response = await fetch('/api/source-maps/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, sourceMaps }) }); setState((await response.json()) as SourceMapState); }
  useEffect(() => { void refresh(); }, []);
  const publicRisk = state?.artifacts.filter((artifact) => artifact.sourceMaps === "public" && artifact.containsSensitivePaths).length ?? 0;
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Source Maps</h1><p className="mt-2 text-slate-300">Control whether source maps are disabled, private to an error tool, or publicly exposed for a build artifact.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><div className="rounded-lg border border-slate-800 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Deployment surface</div><div className="mt-2 font-semibold text-slate-100">{state?.deploymentSurface}</div></div><div className="mt-4 grid gap-3"><div className="rounded-lg border border-slate-800 px-3 py-3">Artifacts at risk <span className="font-semibold text-slate-100">{publicRisk}</span></div><div className="rounded-lg border border-slate-800 px-3 py-3">Private uploads <span className="font-semibold text-slate-100">{state?.artifacts.filter((artifact) => artifact.uploadedToErrorTool).length ?? 0}</span></div></div><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><ul className="space-y-3 text-sm text-slate-300">{state?.artifacts.map((artifact) => <li key={artifact.id} className="rounded border border-slate-800 px-3 py-3"><div className="flex items-center justify-between gap-3"><div><div className="font-semibold text-slate-100">{artifact.asset}</div><div className="mt-1 text-xs uppercase tracking-wide text-slate-500">release {artifact.release}</div></div><select value={artifact.sourceMaps} onChange={(event) => void update(artifact.id, event.target.value as "private" | "public" | "disabled")} className="rounded border border-slate-700 bg-slate-950 px-3 py-2"><option value="private">private</option><option value="public">public</option><option value="disabled">disabled</option></select></div><div className="mt-3 grid gap-2 md:grid-cols-3"><div className="rounded border border-slate-800 px-3 py-2">uploaded: {String(artifact.uploadedToErrorTool)}</div><div className="rounded border border-slate-800 px-3 py-2">sensitive paths: {String(artifact.containsSensitivePaths)}</div><div className="rounded border border-slate-800 px-3 py-2">policy: {artifact.sourceMaps}</div></div></li>)}</ul></article></section></main>;
}
