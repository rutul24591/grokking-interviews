"use client";

import { useEffect, useState } from "react";

type RecordItem = {
  id: string;
  title: string;
  status: "draft" | "published" | "deleted";
};

type CrudState = {
  items: RecordItem[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<CrudState | null>(null);

  async function refresh() {
    const response = await fetch("/api/crud/state");
    setState((await response.json()) as CrudState);
  }

  async function act(type: "create" | "update" | "delete", id?: string) {
    const response = await fetch("/api/crud/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id })
    });
    setState((await response.json()) as CrudState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">CRUD API Console</h1>
      <p className="mt-2 text-slate-300">Exercise create, update, and delete flows the content platform expects from its editorial APIs.</p>
      <section className="mt-8 grid gap-4">
        <div className="flex gap-3">
          <button onClick={() => void act("create")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">
            Create draft
          </button>
        </div>
        {state?.items.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-slate-100">{item.title}</div>
                <div className="mt-1 text-xs text-slate-400">{item.id} · {item.status}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => void act("update", item.id)} className="rounded border border-slate-700 px-3 py-1.5 text-xs font-semibold">
                  Update
                </button>
                <button onClick={() => void act("delete", item.id)} className="rounded border border-rose-700 px-3 py-1.5 text-xs font-semibold text-rose-300">
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        <p className="text-sm text-slate-400">{state?.lastMessage}</p>
      </section>
    </main>
  );
}
