"use client";

import { useEffect, useState } from "react";

type RotationState = {
  credentialName: string;
  activeVersion: number;
  rotatedAt: string;
  status: string;
  consumersUpdated: boolean;
  consumers: { service: string; updated: boolean }[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<RotationState | null>(null);

  async function refresh() {
    const response = await fetch("/api/rotation/state");
    setState((await response.json()) as RotationState);
  }

  async function rotate() {
    const response = await fetch("/api/rotation/rotate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    setState((await response.json()) as RotationState);
  }

  async function markUpdated(service: string) {
    const response = await fetch("/api/rotation/rotate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service })
    });
    setState((await response.json()) as RotationState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Credential Rotation Dashboard</h1>
      <p className="mt-2 text-slate-300">
        Rotate a secret, track which dependent services have updated, and confirm when the new version is fully promoted.
      </p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Credential: <span className="font-semibold text-slate-100">{state?.credentialName}</span></p>
          <p className="mt-2">Active version: <span className="font-semibold text-slate-100">v{state?.activeVersion}</span></p>
          <p className="mt-2">Status: <span className="font-semibold text-slate-100">{state?.status}</span></p>
          <p className="mt-2">Rotated at: <span className="font-semibold text-slate-100">{state?.rotatedAt}</span></p>
          <button onClick={rotate} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Rotate credential</button>
          <p className="mt-4">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <ul className="space-y-3 text-sm text-slate-300">
            {state?.consumers.map((consumer) => (
              <li key={consumer.service} className="flex items-center justify-between rounded-lg border border-slate-800 px-4 py-3">
                <div>
                  <div className="font-semibold text-slate-100">{consumer.service}</div>
                  <div className="mt-1 text-xs text-slate-400">{consumer.updated ? "updated to current version" : "still pinned to previous version"}</div>
                </div>
                <button onClick={() => markUpdated(consumer.service)} className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold hover:bg-emerald-500">
                  Mark updated
                </button>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
