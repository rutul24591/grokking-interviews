"use client";

import { useEffect, useState } from "react";

type TokenState = {
  subject: string;
  accessToken: string;
  refreshToken: string;
  scopes: string[];
  refreshCount: number;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<TokenState | null>(null);
  const [subject, setSubject] = useState("user-123");
  const [scopeInput, setScopeInput] = useState("profile:read,sessions:read");

  async function refreshState() {
    const response = await fetch("/api/token/state");
    setState((await response.json()) as TokenState);
  }

  async function issue() {
    const response = await fetch("/api/token/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, scopes: scopeInput.split(",").map((item) => item.trim()).filter(Boolean) })
    });
    setState((await response.json()) as TokenState);
  }

  async function rotateAccess() {
    const response = await fetch("/api/token/refresh", { method: "POST" });
    setState((await response.json()) as TokenState);
  }

  useEffect(() => { void refreshState(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Token-Based Authentication</h1>
      <p className="mt-2 text-slate-300">Issue scoped token pairs, inspect active claims, and refresh the access token without re-authenticating.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm text-slate-300">Subject</label>
          <input value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-4 block text-sm text-slate-300">Scopes</label>
          <input value={scopeInput} onChange={(event) => setScopeInput(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <div className="mt-4 flex gap-3">
            <button onClick={issue} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Issue tokens</button>
            <button onClick={rotateAccess} className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500">Refresh access token</button>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Access token: <span className="font-mono text-slate-100">{state?.accessToken}</span></p>
          <p className="mt-2">Refresh token: <span className="font-mono text-slate-100">{state?.refreshToken}</span></p>
          <p className="mt-2">Refresh count: <span className="font-semibold text-slate-100">{state?.refreshCount ?? 0}</span></p>
          <p className="mt-2">Scopes: <span className="font-semibold text-slate-100">{state?.scopes.join(", ")}</span></p>
          <p className="mt-4">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
