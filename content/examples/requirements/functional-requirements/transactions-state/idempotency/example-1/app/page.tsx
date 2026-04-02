"use client";

import { useEffect, useState } from "react";

type RequestRecord = { id: string; key: string; result: string; duplicate: boolean };
type PageState = { requests: RequestRecord[]; summary: { duplicates: number }; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);
  const [key, setKey] = useState("pay-ord-102");

  async function refresh() {
    const response = await fetch("/api/idempotency/state");
    setState((await response.json()) as PageState);
  }

  async function act(type: "submit" | "replay") {
    const response = await fetch("/api/idempotency/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value: key })
    });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Idempotency Console</h1>
      <p className="mt-2 text-slate-300">Submit and replay transaction requests to verify duplicate suppression and stored-response behavior.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <label className="block text-sm text-slate-300">Idempotency key</label>
          <input value={key} onChange={(event) => setKey(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <div className="mt-4 flex gap-3">
            <button onClick={() => void act("submit")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Submit</button>
            <button onClick={() => void act("replay")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Replay</button>
          </div>
          <div className="mt-5 rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">duplicates: {state?.summary.duplicates ?? 0}</div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-3">
          {state?.requests.map((request) => (
            <div key={request.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{request.key}</div>
              <div className="mt-1 text-xs text-slate-500">{request.result} · duplicate {String(request.duplicate)}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
