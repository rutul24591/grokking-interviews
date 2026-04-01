"use client";

import { useEffect, useState } from "react";

type Attempt = { id: string; result: 'success' | 'failure'; sourceIp: string; at: string };

export default function Page() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  async function refresh() {
    const response = await fetch('/api/attempts/state');
    setAttempts((await response.json()) as Attempt[]);
  }

  async function add(result: 'success' | 'failure') {
    const response = await fetch('/api/attempts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result, sourceIp: '192.0.2.44' }),
    });
    setAttempts((await response.json()) as Attempt[]);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Login Attempt Tracker</h1>
      <p className="mt-2 text-slate-300">Track success and failure attempts as durable input for account protection workflows.</p>
      <div className="mt-6 flex gap-3">
        <button onClick={() => add('failure')} className="rounded bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500">Add failure</button>
        <button onClick={() => add('success')} className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500">Add success</button>
      </div>
      <section className="mt-8 grid gap-3">
        {attempts.map((attempt) => (
          <article key={attempt.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <p className="font-semibold text-slate-100">{attempt.result}</p>
            <p className="mt-1">{attempt.sourceIp} · {attempt.at}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
