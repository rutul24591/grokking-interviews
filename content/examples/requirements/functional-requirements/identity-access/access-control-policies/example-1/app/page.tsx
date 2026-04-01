"use client";

import { useState } from "react";

const roles = ["viewer", "editor", "reviewer", "admin"] as const;
const resources = ["draft", "published", "billing-report"] as const;
const actions = ["view", "edit", "publish", "delete"] as const;

type Decision = { allowed: boolean; reason: string; role: string; resource: string; action: string };

export default function Page() {
  const [role, setRole] = useState<(typeof roles)[number]>("editor");
  const [resource, setResource] = useState<(typeof resources)[number]>("draft");
  const [action, setAction] = useState<(typeof actions)[number]>("publish");
  const [decision, setDecision] = useState<Decision | null>(null);

  async function evaluate() {
    const response = await fetch("/api/policies/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, resource, action }),
    });
    setDecision((await response.json()) as Decision);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Access Control Policy Workbench</h1>
      <p className="mt-2 text-slate-300">Evaluate how role, resource, and action combine into product-visible authorization behavior.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-1 text-sm"><span>Role</span><select value={role} onChange={(e) => setRole(e.target.value as (typeof roles)[number])} className="rounded border border-slate-700 bg-slate-950 px-3 py-2">{roles.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="grid gap-1 text-sm"><span>Resource</span><select value={resource} onChange={(e) => setResource(e.target.value as (typeof resources)[number])} className="rounded border border-slate-700 bg-slate-950 px-3 py-2">{resources.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="grid gap-1 text-sm"><span>Action</span><select value={action} onChange={(e) => setAction(e.target.value as (typeof actions)[number])} className="rounded border border-slate-700 bg-slate-950 px-3 py-2">{actions.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          <button onClick={evaluate} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Evaluate policy</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          {decision ? (
            <>
              <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${decision.allowed ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>{decision.allowed ? "ALLOW" : "DENY"}</p>
              <p className="mt-4 text-sm text-slate-300">{decision.role} → {decision.action} → {decision.resource}</p>
              <p className="mt-2 text-sm text-slate-100">{decision.reason}</p>
            </>
          ) : <p className="text-sm text-slate-400">Run an evaluation to inspect the policy decision and reasoning.</p>}
        </article>
      </section>
    </main>
  );
}
