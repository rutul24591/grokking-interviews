"use client";

import { useEffect, useState } from "react";

type LockoutView = { email: string; failedAttempts: number; threshold: number; lockoutUntil: number | null; lastOutcome: string; locked: boolean; secondsRemaining: number };

export default function Page() {
  const [state, setState] = useState<LockoutView | null>(null);
  const [password, setPassword] = useState("wrong-password");

  async function refresh() {
    const response = await fetch("/api/lockout/state");
    setState((await response.json()) as LockoutView);
  }

  async function submit() {
    const response = await fetch("/api/lockout/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setState((await response.json()) as LockoutView);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Account Lockout Simulator</h1>
      <p className="mt-2 text-slate-300">Observe failed-attempt counting, temporary lockout, and reset-on-success behavior.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Demo password: <span className="font-mono text-slate-200">CorrectHorseBatteryStaple</span></p>
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="mt-4 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <button onClick={submit} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Attempt login</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm">
          <p>Failed attempts: <span className="font-semibold text-slate-100">{state?.failedAttempts ?? 0}</span></p>
          <p className="mt-2">Threshold: <span className="font-semibold text-slate-100">{state?.threshold ?? 3}</span></p>
          <p className="mt-2">Lock status: <span className={`font-semibold ${state?.locked ? "text-rose-300" : "text-emerald-300"}`}>{state?.locked ? `locked (${state.secondsRemaining}s remaining)` : "open"}</span></p>
          <p className="mt-4 text-slate-300">{state?.lastOutcome}</p>
        </article>
      </section>
    </main>
  );
}
