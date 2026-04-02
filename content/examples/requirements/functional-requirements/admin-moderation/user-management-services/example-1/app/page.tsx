"use client";

import { useEffect, useState } from "react";

type ServiceAccount = {
  id: string;
  service: string;
  role: string;
  status: "active" | "review" | "disabled";
};

type ServiceState = {
  owner: string;
  accounts: ServiceAccount[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ServiceState | null>(null);

  async function refresh() {
    const response = await fetch("/api/user-management-services/state");
    setState((await response.json()) as ServiceState);
  }

  async function act(type: "rotate-owner" | "disable-account", id?: string) {
    const response = await fetch("/api/user-management-services/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id })
    });
    setState((await response.json()) as ServiceState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">User Management Services</h1>
      <p className="mt-2 text-slate-300">Inspect privileged service accounts, rotate ownership, and disable risky automation before it propagates incorrect user state.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Service owner</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.owner}</div>
          <button onClick={() => void act("rotate-owner")} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Rotate owner</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.accounts.map((account) => (
            <div key={account.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{account.service}</div>
                  <div className="mt-1 text-xs text-slate-500">{account.role} · {account.status}</div>
                </div>
                <button onClick={() => void act("disable-account", account.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Disable</button>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
