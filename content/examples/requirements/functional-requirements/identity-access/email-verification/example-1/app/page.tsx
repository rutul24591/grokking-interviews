"use client";

import { useEffect, useState } from "react";

type State = { email: string; sent: boolean; token: string; verified: boolean; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<State | null>(null);
  const [token, setToken] = useState('EMAIL-4321');

  async function refresh() {
    const response = await fetch('/api/email-verification/state');
    setState((await response.json()) as State);
  }

  async function send() {
    const response = await fetch('/api/email-verification/send', { method: 'POST' });
    setState((await response.json()) as State);
  }

  async function confirm() {
    const response = await fetch('/api/email-verification/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    setState((await response.json()) as State);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Email Verification Flow</h1>
      <p className="mt-2 text-slate-300">Send a verification email, confirm the token, and transition the account into verified state.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <button onClick={send} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Send verification email</button>
          <input value={token} onChange={(e) => setToken(e.target.value)} className="mt-4 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono" />
          <button onClick={confirm} className="mt-4 rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500">Confirm token</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Email: <span className="font-semibold text-slate-100">{state?.email}</span></p>
          <p className="mt-2">Sent: <span className="font-semibold text-slate-100">{state?.sent ? 'yes' : 'no'}</span></p>
          <p className="mt-2">Verified: <span className="font-semibold text-slate-100">{state?.verified ? 'yes' : 'no'}</span></p>
          <p className="mt-4">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
