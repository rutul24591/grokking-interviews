"use client";

import { useEffect, useState } from "react";

type SoftDeleteState = {
  title: string;
  deleted: boolean;
  purgeInDays: number;
  recoverable: boolean;
  visibleInFeed: boolean;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<SoftDeleteState | null>(null);

  async function refresh() {
    const response = await fetch("/api/soft-delete/state");
    setState((await response.json()) as SoftDeleteState);
  }

  async function act(type: "delete" | "restore") {
    const response = await fetch("/api/soft-delete/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as SoftDeleteState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Soft Delete Lifecycle</h1>
      <p className="mt-2 text-slate-300">Move content out of active discovery while preserving recovery windows and verifying feed visibility is removed.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="font-semibold text-slate-100">{state?.title}</div>
          <div className="mt-2">Deleted: {state?.deleted ? "yes" : "no"}</div>
          <div className="mt-2">Recoverable: {state?.recoverable ? "yes" : "no"}</div>
          <div className="mt-2">Purge in: {state?.purgeInDays} days</div>
          <div className="mt-2">Visible in feed: {String(state?.visibleInFeed)}</div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => void act("delete")} className="rounded bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Soft delete</button>
            <button onClick={() => void act("restore")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Restore</button>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p className="text-slate-400">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
