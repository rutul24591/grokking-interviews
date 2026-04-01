"use client";

import { useEffect, useState } from "react";

type AuthState = { user: null | { email: string; role: string }; lastMessage: string };

export default function Page() {
  const [email, setEmail] = useState("owner@example.com");
  const [password, setPassword] = useState("CorrectHorseBatteryStaple");
  const [state, setState] = useState<AuthState>({ user: null, lastMessage: "No login attempt yet." });

  async function refresh() {
    const response = await fetch("/api/authentication/me");
    setState((await response.json()) as AuthState);
  }

  async function submit() {
    const response = await fetch("/api/authentication/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setState((await response.json()) as AuthState);
    if (response.ok) await refresh();
  }

  useEffect(() => { refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Authentication Service Flow</h1>
      <p className="mt-2 text-slate-300">Submit credentials, issue session state, and inspect the authenticated user contract.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Demo credentials: owner@example.com / CorrectHorseBatteryStaple</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-4 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="mt-3 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <button onClick={submit} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Authenticate</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>{state.lastMessage}</p>
          <p className="mt-4">Authenticated user: <span className="font-semibold text-slate-100">{state.user ? `${state.user.email} (${state.user.role})` : 'none'}</span></p>
        </article>
      </section>
    </main>
  );
}
