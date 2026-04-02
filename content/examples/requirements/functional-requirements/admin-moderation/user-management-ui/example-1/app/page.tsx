"use client";

import { useEffect, useState } from "react";

type UserRow = {
  id: string;
  email: string;
  tier: string;
  status: "active" | "suspended" | "pending-review";
};

type UserManagementUiState = {
  operator: string;
  users: UserRow[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<UserManagementUiState | null>(null);

  async function refresh() {
    const response = await fetch("/api/user-management-ui/state");
    setState((await response.json()) as UserManagementUiState);
  }

  async function act(type: "rotate-operator" | "suspend-user", id?: string) {
    const response = await fetch("/api/user-management-ui/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id })
    });
    setState((await response.json()) as UserManagementUiState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">User Management UI</h1>
      <p className="mt-2 text-slate-300">Review user state, rotate operator ownership, and suspend risky accounts with visible audit context.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Current operator</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.operator}</div>
          <button onClick={() => void act("rotate-operator")} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Rotate operator</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.users.map((user) => (
            <div key={user.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{user.email}</div>
                  <div className="mt-1 text-xs text-slate-500">{user.tier} · {user.status}</div>
                </div>
                <button onClick={() => void act("suspend-user", user.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Suspend</button>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
