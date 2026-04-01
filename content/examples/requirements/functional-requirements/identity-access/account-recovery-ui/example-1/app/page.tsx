"use client";

import { useEffect, useState } from "react";

type RecoveryState = { email: string; requestAccepted: boolean; token: string; tokenExpiresAt: number; passwordUpdated: boolean; lastMessage: string; tokenExpired: boolean };

export default function Page() {
  const [state, setState] = useState<RecoveryState | null>(null);
  const [email, setEmail] = useState("owner@example.com");
  const [token, setToken] = useState("RECOVER-123456");
  const [password, setPassword] = useState("new-password-123");

  async function refresh() {
    const response = await fetch("/api/recovery/state");
    setState((await response.json()) as RecoveryState);
  }

  async function requestRecovery() {
    const response = await fetch("/api/recovery/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    setState((await response.json()) as RecoveryState);
  }

  async function resetPassword() {
    const response = await fetch("/api/recovery/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
    setState((await response.json()) as RecoveryState);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Account Recovery Journey</h1>
      <p className="mt-2 text-slate-300">Simulate recovery request, token verification, and password reset completion.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-lg font-semibold">Request recovery</h2>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-4 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <button onClick={requestRecovery} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Send recovery request</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-lg font-semibold">Reset password</h2>
          <input value={token} onChange={(e) => setToken(e.target.value)} className="mt-4 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="mt-3 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <button onClick={resetPassword} className="mt-4 rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500">Complete reset</button>
        </article>
      </section>
      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
        <p>{state?.lastMessage}</p>
        <p className="mt-2">Token expired: <span className="font-semibold text-slate-100">{state?.tokenExpired ? "yes" : "no"}</span></p>
        <p className="mt-2">Password updated: <span className="font-semibold text-slate-100">{state?.passwordUpdated ? "yes" : "no"}</span></p>
      </section>
    </main>
  );
}
