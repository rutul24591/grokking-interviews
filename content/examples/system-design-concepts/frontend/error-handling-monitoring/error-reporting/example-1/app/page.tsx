"use client";
import { useEffect, useState } from "react";

type ClientError = { id: string; surface: string; severity: "warning" | "error"; fingerprint: string; count: number };
type ReportingState = { environment: string; release: string; events: ClientError[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<ReportingState | null>(null);
  const [surface, setSurface] = useState("search-bar");
  const [severity, setSeverity] = useState<"warning" | "error">("error");
  const [fingerprint, setFingerprint] = useState("search-bar-empty-state");
  async function refresh() { const response = await fetch('/api/reporting/state'); setState((await response.json()) as ReportingState); }
  async function capture() { const response = await fetch('/api/reporting/capture', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ surface, severity, fingerprint }) }); setState((await response.json()) as ReportingState); }
  useEffect(() => { void refresh(); }, []);
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Error Reporting</h1><p className="mt-2 text-slate-300">Capture client exceptions, group them by fingerprint, and attach release context before shipping them.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><label className="block">Surface</label><input value={surface} onChange={(event) => setSurface(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" /><label className="mt-4 block">Severity</label><select value={severity} onChange={(event) => setSeverity(event.target.value as 'warning' | 'error')} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"><option value="warning">warning</option><option value="error">error</option></select><label className="mt-4 block">Fingerprint</label><input value={fingerprint} onChange={(event) => setFingerprint(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" /><button onClick={capture} className="mt-4 rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">Capture event</button><p className="mt-4 text-slate-400">{state?.environment} · {state?.release}</p></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><ul className="space-y-3 text-sm text-slate-300">{state?.events.map((event) => <li key={event.id} className="rounded border border-slate-800 px-3 py-3"><div className="flex items-center justify-between"><div className="font-semibold text-slate-100">{event.fingerprint}</div><span>{event.count}x</span></div><div className="mt-2 text-slate-400">{event.surface} · {event.severity}</div></li>)}</ul><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article></section></main>;
}
