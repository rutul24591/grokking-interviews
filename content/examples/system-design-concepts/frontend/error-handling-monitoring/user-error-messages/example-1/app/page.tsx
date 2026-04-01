"use client";
import { useEffect, useMemo, useState } from "react";

type UserError = { id: string; code: string; tone: 'blocking' | 'recoverable'; message: string; action: string };
type MessageState = { messages: UserError[]; selectedId: string; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<MessageState | null>(null);
  async function refresh() { const response = await fetch('/api/messages/state'); setState((await response.json()) as MessageState); }
  async function select(id: string) { const response = await fetch('/api/messages/select', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); setState((await response.json()) as MessageState); }
  useEffect(() => { void refresh(); }, []);
  const selected = useMemo(() => state?.messages.find((message) => message.id === state.selectedId), [state]);
  return <main className="mx-auto max-w-6xl px-6 py-10"><h1 className="text-3xl font-bold">User Error Messages</h1><p className="mt-2 text-slate-300">Review user-facing error copy, action labels, and recovery guidance.</p><section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]"><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><ul className="space-y-3">{state?.messages.map((message) => <li key={message.id} className="rounded border border-slate-800 px-3 py-3"><div className="font-semibold text-slate-100">{message.code}</div><button onClick={() => void select(message.id)} className="mt-2 rounded bg-sky-600 px-3 py-2 text-xs font-semibold hover:bg-sky-500">Preview message</button></li>)}</ul></article><article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"><div className="rounded-lg border border-slate-800 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Tone</div><div className="mt-2 font-semibold text-slate-100">{selected?.tone}</div><p className="mt-3">{selected?.message}</p><button className="mt-4 rounded border border-slate-700 px-4 py-2 text-sm font-semibold">{selected?.action}</button></div><p className="mt-4 text-slate-400">{state?.lastMessage}</p></article></section></main>;
}
