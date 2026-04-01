"use client";

import { useEffect, useState } from "react";

type SessionRecord = {
  sessionId: string;
  device: string;
  createdAt: string;
  expiresAt: string;
  risk: "low" | "medium" | "high";
};

type SessionState = {
  active: SessionRecord[];
  rotationCount: number;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<SessionState | null>(null);
  const [device, setDevice] = useState("Safari on iPhone");
  const [risk, setRisk] = useState<SessionRecord["risk"]>("medium");

  async function refresh() {
    const response = await fetch("/api/session/state");
    setState((await response.json()) as SessionState);
  }

  async function createSession() {
    const response = await fetch("/api/session/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device, risk })
    });
    setState((await response.json()) as SessionState);
  }

  async function rotate(sessionId: string) {
    const response = await fetch("/api/session/rotate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId })
    });
    setState((await response.json()) as SessionState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Session Management Console</h1>
      <p className="mt-2 text-slate-300">Create, inspect, and rotate active sessions to model the primary lifecycle requirement.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[340px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm text-slate-300">Device label</label>
          <input value={device} onChange={(event) => setDevice(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-4 block text-sm text-slate-300">Risk level</label>
          <select value={risk} onChange={(event) => setRisk(event.target.value as SessionRecord["risk"])} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <button onClick={createSession} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Create session</button>
          <p className="mt-4 text-sm text-slate-300">Rotations: <span className="font-semibold text-slate-100">{state?.rotationCount ?? 0}</span></p>
          <p className="mt-2 text-sm text-slate-300">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <ul className="space-y-3 text-sm text-slate-300">
            {state?.active.map((session) => (
              <li key={session.sessionId} className="rounded-lg border border-slate-800 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-100">{session.device}</div>
                    <div className="mt-1 font-mono text-xs text-slate-400">{session.sessionId}</div>
                  </div>
                  <button onClick={() => rotate(session.sessionId)} className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold hover:bg-emerald-500">Rotate</button>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  <div>Created: {session.createdAt}</div>
                  <div>Expires: {session.expiresAt}</div>
                  <div>Risk: <span className="font-semibold text-slate-100">{session.risk}</span></div>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
