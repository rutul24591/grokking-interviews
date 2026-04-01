"use client";

import { useEffect, useState } from "react";

type ResetState = {
  identifier: string;
  requested: boolean;
  token: string;
  complete: boolean;
  tokenExpiresInMinutes: number;
  attemptCount: number;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ResetState | null>(null);
  const [identifier, setIdentifier] = useState("owner@example.com");
  const [token, setToken] = useState("RESET-5566");
  const [password, setPassword] = useState("StrongerPass!42");

  async function refresh() {
    const response = await fetch("/api/password-reset/state");
    setState((await response.json()) as ResetState);
  }

  async function requestReset() {
    const response = await fetch("/api/password-reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier })
    });
    setState((await response.json()) as ResetState);
  }

  async function confirmReset() {
    const response = await fetch("/api/password-reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    setState((await response.json()) as ResetState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Password Reset Journey</h1>
      <p className="mt-2 text-slate-300">
        Start a reset by identifier, track the reset token lifetime, and finish only when the replacement password meets policy.
      </p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[360px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm text-slate-300">Identifier</label>
          <input
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
          />
          <button onClick={requestReset} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">
            Request password reset
          </button>
          <label className="mt-6 block text-sm text-slate-300">Reset token</label>
          <input
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono"
          />
          <label className="mt-4 block text-sm text-slate-300">Replacement password</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
          />
          <button onClick={confirmReset} className="mt-4 rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500">
            Complete reset
          </button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-800 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">Challenge</div>
              <div className="mt-2 font-semibold text-slate-100">{state?.requested ? "issued" : "idle"}</div>
            </div>
            <div className="rounded-lg border border-slate-800 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">Expiry</div>
              <div className="mt-2 font-semibold text-slate-100">{state?.tokenExpiresInMinutes} minutes</div>
            </div>
            <div className="rounded-lg border border-slate-800 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">Attempts</div>
              <div className="mt-2 font-semibold text-slate-100">{state?.attemptCount ?? 0}</div>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-slate-800 p-4">
            <div>Completed: <span className="font-semibold text-slate-100">{state?.complete ? "yes" : "no"}</span></div>
            <p className="mt-3">{state?.lastMessage}</p>
          </div>
        </article>
      </section>
    </main>
  );
}
