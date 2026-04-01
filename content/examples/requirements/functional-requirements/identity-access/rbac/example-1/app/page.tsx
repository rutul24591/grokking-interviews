"use client";

import { useEffect, useState } from "react";

type RbacState = {
  role: string;
  resource: string;
  action: string;
  lastDecision: string;
  allowed?: boolean;
};

export default function Page() {
  const [state, setState] = useState<RbacState | null>(null);
  const [role, setRole] = useState("editor");
  const [resource, setResource] = useState("content");
  const [action, setAction] = useState("content.edit");

  async function refresh() {
    const response = await fetch("/api/rbac/state");
    setState((await response.json()) as RbacState);
  }

  async function evaluate() {
    const response = await fetch("/api/rbac/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, resource, action })
    });
    setState((await response.json()) as RbacState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">RBAC Evaluation Console</h1>
      <p className="mt-2 text-slate-300">Assign a role, choose an action, and evaluate access to a protected resource.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm text-slate-300">Role</label>
          <select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="viewer">viewer</option>
            <option value="editor">editor</option>
            <option value="admin">admin</option>
          </select>
          <label className="mt-4 block text-sm text-slate-300">Resource</label>
          <input value={resource} onChange={(event) => setResource(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-4 block text-sm text-slate-300">Action</label>
          <select value={action} onChange={(event) => setAction(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="dashboard.read">dashboard.read</option>
            <option value="content.edit">content.edit</option>
            <option value="content.publish">content.publish</option>
            <option value="users.manage">users.manage</option>
          </select>
          <button onClick={evaluate} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Evaluate role</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Allowed: <span className="font-semibold text-slate-100">{state?.allowed ? "yes" : "no"}</span></p>
          <p className="mt-4">{state?.lastDecision}</p>
        </article>
      </section>
    </main>
  );
}
