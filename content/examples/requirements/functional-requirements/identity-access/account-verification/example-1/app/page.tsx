"use client";

import { useEffect, useState } from "react";

type VerificationView = { email: string; status: "pending" | "verified"; token: string; expiresAt: number; resendAvailableAt: number; lastMessage: string; expired: boolean; resendSeconds: number };

export default function Page() {
  const [state, setState] = useState<VerificationView | null>(null);
  const [token, setToken] = useState("VERIFY-7890");

  async function refresh() {
    const response = await fetch("/api/verification/state");
    setState((await response.json()) as VerificationView);
  }

  async function verify() {
    const response = await fetch("/api/verification/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
    setState((await response.json()) as VerificationView);
  }

  async function resend() {
    const response = await fetch("/api/verification/resend", { method: "POST" });
    setState((await response.json()) as VerificationView);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Account Verification Flow</h1>
      <p className="mt-2 text-slate-300">Handle verification success, expiry, and resend cooldown behavior.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-300">Status: <span className="font-semibold text-slate-100">{state?.status ?? "pending"}</span></p>
          <p className="mt-2 text-sm text-slate-300">Expired: <span className="font-semibold text-slate-100">{state?.expired ? "yes" : "no"}</span></p>
          <input value={token} onChange={(e) => setToken(e.target.value)} className="mt-4 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono" />
          <div className="mt-4 flex gap-3">
            <button onClick={verify} className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500">Verify token</button>
            <button onClick={resend} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Resend link</button>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>{state?.lastMessage}</p>
          <p className="mt-3">Resend cooldown: <span className="font-semibold text-slate-100">{state?.resendSeconds ?? 0}s</span></p>
          <p className="mt-2">Current demo token: <span className="font-mono text-slate-100">{state?.token}</span></p>
        </article>
      </section>
    </main>
  );
}
