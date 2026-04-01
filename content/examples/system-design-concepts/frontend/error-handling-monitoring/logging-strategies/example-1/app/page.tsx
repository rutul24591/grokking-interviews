"use client";
import { useEffect, useState } from "react";

type LogEvent = { id: string; level: 'info' | 'warn' | 'error'; category: string; message: string };
type LoggingState = { samplingRate: number; events: LogEvent[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<LoggingState | null>(null);
  const [level, setLevel] = useState<'info' | 'warn' | 'error'>('info');
  const [category, setCategory] = useState('ui');
  const [message, setMessage] = useState('User retried a failed widget');
  async function refresh() { const response = await fetch('/api/logging/state'); setState((await response.json()) as LoggingState); }
  async function writeLog() { const response = await fetch('/api/logging/write', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level, category, message }) }); setState((await response.json()) as LoggingState); }
  useEffect(() => { void refresh(); }, []);
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">Logging Strategies</h1><p className="mt-2 text-slate-300">Emit structured logs with explicit level and category tags to support debugging and sampling downstream.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><label className="block">Level</label><select value={level} onChange={(event) => setLevel(event.target.value as 'info' | 'warn' | 'error')} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"><option value="info">info</option><option value="warn">warn</option><option value="error">error</option></select><label className="mt-4 block">Category</label><input value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" /><label className="mt-4 block">Message</label><input value={message} onChange={(event) => setMessage(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" /><button onClick={writeLog} className="mt-4 rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">Write log</button></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><ul className="space-y-3 text-sm text-slate-300">{state?.events.map((event) => <li key={event.id} className="rounded border border-slate-800 px-3 py-3"><div className="flex items-center justify-between"><div className="font-semibold text-slate-100">{event.level}</div><span>{event.category}</span></div><div className="mt-2 text-slate-400">{event.message}</div></li>)}</ul><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article></section></main>;
}
