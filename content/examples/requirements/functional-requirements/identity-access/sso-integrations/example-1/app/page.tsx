"use client";

import { useEffect, useState } from "react";

type SsoState = {
  tenant: string;
  protocol: string;
  started: boolean;
  completed: boolean;
  lastAssertionId: string;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<SsoState | null>(null);
  const [tenant, setTenant] = useState("acme-corp");
  const [protocol, setProtocol] = useState("SAML");
  const [assertionId, setAssertionId] = useState("assertion-001");

  async function refresh() {
    const response = await fetch("/api/sso/state");
    setState((await response.json()) as SsoState);
  }

  async function startFlow() {
    const response = await fetch("/api/sso/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenant, protocol })
    });
    setState((await response.json()) as SsoState);
  }

  async function completeFlow() {
    const response = await fetch("/api/sso/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assertionId })
    });
    setState((await response.json()) as SsoState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">SSO Integration Flow</h1>
      <p className="mt-2 text-slate-300">Configure tenant SSO, initiate an IdP redirect, and complete the federated login callback.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm text-slate-300">Tenant</label>
          <input value={tenant} onChange={(event) => setTenant(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-4 block text-sm text-slate-300">Protocol</label>
          <select value={protocol} onChange={(event) => setProtocol(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="SAML">SAML</option>
            <option value="OIDC">OIDC</option>
          </select>
          <button onClick={startFlow} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Start SSO</button>
          <label className="mt-6 block text-sm text-slate-300">Assertion or token ID</label>
          <input value={assertionId} onChange={(event) => setAssertionId(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono" />
          <button onClick={completeFlow} className="mt-4 rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500">Complete SSO</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Started: <span className="font-semibold text-slate-100">{state?.started ? "yes" : "no"}</span></p>
          <p className="mt-2">Completed: <span className="font-semibold text-slate-100">{state?.completed ? "yes" : "no"}</span></p>
          <p className="mt-2">Last assertion: <span className="font-mono text-slate-100">{state?.lastAssertionId}</span></p>
          <p className="mt-4">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
