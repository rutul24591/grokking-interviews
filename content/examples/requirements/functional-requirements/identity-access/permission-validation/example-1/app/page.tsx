"use client";

import { useState } from "react";

type Result = {
  key: string;
  allowed: boolean;
  resource: string;
  override: string | null;
  reason: string;
};

export default function Page() {
  const [role, setRole] = useState("editor");
  const [action, setAction] = useState("publish-report");
  const [resource, setResource] = useState("finance");
  const [result, setResult] = useState<Result | null>(null);

  async function check() {
    const response = await fetch("/api/permissions/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, action, resource })
    });
    setResult((await response.json()) as Result);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Permission Validation Console</h1>
      <p className="mt-2 text-slate-300">
        Evaluate base policy, inspect resource-specific overrides, and decide whether an operation can proceed or needs approval.
      </p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[360px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm text-slate-300">Role</label>
          <select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="viewer">viewer</option>
            <option value="editor">editor</option>
            <option value="admin">admin</option>
          </select>
          <label className="mt-4 block text-sm text-slate-300">Action</label>
          <select value={action} onChange={(event) => setAction(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="view-draft">view-draft</option>
            <option value="edit-draft">edit-draft</option>
            <option value="delete-report">delete-report</option>
            <option value="publish-report">publish-report</option>
          </select>
          <label className="mt-4 block text-sm text-slate-300">Resource</label>
          <input value={resource} onChange={(event) => setResource(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <button onClick={check} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">
            Validate permission
          </button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          {result ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-slate-800 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Decision key</div>
                  <div className="mt-2 font-mono text-slate-100">{result.key}</div>
                </div>
                <div className="rounded-lg border border-slate-800 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Allowed</div>
                  <div className="mt-2 font-semibold text-slate-100">{result.allowed ? "yes" : "no"}</div>
                </div>
                <div className="rounded-lg border border-slate-800 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Override</div>
                  <div className="mt-2 font-semibold text-slate-100">{result.override ?? "none"}</div>
                </div>
              </div>
              <p className="mt-5">{result.reason}</p>
            </>
          ) : (
            <p>Run validation to inspect the permission decision.</p>
          )}
        </article>
      </section>
    </main>
  );
}
