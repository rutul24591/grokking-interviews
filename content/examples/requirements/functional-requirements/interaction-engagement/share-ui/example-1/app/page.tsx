"use client";

import { useEffect, useState } from "react";

type ShareTarget = {
  id: string;
  label: string;
  available: boolean;
  requiresAuth: boolean;
  latency: string;
};

type ShareState = {
  mode: "native" | "fallback";
  targets: ShareTarget[];
  copied: boolean;
  canonicalUrl: string;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ShareState | null>(null);

  async function refresh() {
    const response = await fetch("/api/share-ui/state");
    setState((await response.json()) as ShareState);
  }

  async function act(type: "switch-mode" | "copy-link") {
    const response = await fetch("/api/share-ui/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as ShareState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Share UI</h1>
      <p className="mt-2 text-slate-300">Switch between native and fallback share modes, expose destination availability, and keep copy-link as a reliable escape hatch.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <button onClick={() => void act("switch-mode")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Switch mode</button>
          <button onClick={() => void act("copy-link")} className="ml-3 rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Copy link</button>
          <div className="mt-4 rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">canonical url: {state?.canonicalUrl}</div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.targets.map((target) => (
            <div key={target.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{target.label}</div>
              <div className="mt-1 text-xs text-slate-500">available: {String(target.available)}</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                <span className="rounded border border-slate-800 px-2 py-1">auth {target.requiresAuth ? "required" : "not required"}</span>
                <span className="rounded border border-slate-800 px-2 py-1">latency {target.latency}</span>
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">copied: {String(state?.copied)} · mode {state?.mode}</div>
        </article>
      </section>
    </main>
  );
}
