"use client";

import { useEffect, useState } from "react";

type Provider = { name: string; available: boolean; enterpriseReady: boolean };
type SocialState = { providers: Provider[]; selectedProvider: string; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<SocialState | null>(null);

  async function refresh() {
    const response = await fetch("/api/social/state");
    setState((await response.json()) as SocialState);
  }

  async function selectProvider(provider: string) {
    const response = await fetch("/api/social/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider })
    });
    setState((await response.json()) as SocialState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Social Login Options</h1>
      <p className="mt-2 text-slate-300">Present viable delegated-login providers and expose which options fit the user or tenant profile.</p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {state?.providers.map((provider) => (
          <article key={provider.name} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <div className="font-semibold text-slate-100">{provider.name}</div>
            <div className="mt-2">Available: {provider.available ? "yes" : "no"}</div>
            <div className="mt-1">Enterprise-ready: {provider.enterpriseReady ? "yes" : "no"}</div>
            <button disabled={!provider.available} onClick={() => selectProvider(provider.name)} className="mt-4 rounded bg-sky-600 px-4 py-2 text-xs font-semibold hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-700">Select provider</button>
          </article>
        ))}
      </section>
      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
        <p>Selected: <span className="font-semibold text-slate-100">{state?.selectedProvider}</span></p>
        <p className="mt-2">{state?.lastMessage}</p>
      </section>
    </main>
  );
}
