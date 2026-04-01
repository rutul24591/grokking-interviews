"use client";

import { useEffect, useState } from "react";

type Provider = { id: string; label: string; domains: string[] };
type ProviderState = { available: Provider[]; selected: string; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<ProviderState | null>(null);

  async function refresh() {
    const response = await fetch('/api/providers/state');
    setState((await response.json()) as ProviderState);
  }

  async function select(providerId: string) {
    const response = await fetch('/api/providers/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerId }),
    });
    setState((await response.json()) as ProviderState);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Identity Provider Selector</h1>
      <p className="mt-2 text-slate-300">Choose the provider that should own the authentication path for the account.</p>
      <section className="mt-8 grid gap-4">
        {state?.available.map((provider) => (
          <article key={provider.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-100">{provider.label}</p>
                <p className="mt-1">Domains: {provider.domains.join(', ')}</p>
              </div>
              <button onClick={() => select(provider.id)} className={`rounded px-4 py-2 text-sm font-semibold ${state.selected === provider.id ? 'bg-emerald-600' : 'bg-sky-600 hover:bg-sky-500'}`}>{state.selected === provider.id ? 'Selected' : 'Use provider'}</button>
            </div>
          </article>
        ))}
      </section>
      <p className="mt-6 text-sm text-slate-300">{state?.lastMessage}</p>
    </main>
  );
}
