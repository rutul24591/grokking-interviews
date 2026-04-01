"use client";

import { useEffect, useState } from "react";

type ObjectRecord = {
  id: string;
  key: string;
  storageClass: "standard" | "infrequent" | "archive";
  retentionDays: number;
  encrypted: boolean;
  restoreEta: string;
};

type StorageState = {
  objects: ObjectRecord[];
  encrypted: boolean;
  complianceBlocked: boolean;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<StorageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/object-storage/state");
    setState((await response.json()) as StorageState);
  }

  async function act(type: "promote" | "archive") {
    const response = await fetch("/api/object-storage/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as StorageState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Object Storage Operations</h1>
      <p className="mt-2 text-slate-300">Review lifecycle placement, retention, restore expectations, and encryption policy for persisted editorial assets.</p>
      <section className="mt-8 grid gap-4">
        <div className="flex gap-3">
          <button onClick={() => void act("promote")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Promote to standard</button>
          <button onClick={() => void act("archive")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Archive old object</button>
        </div>
        {state?.objects.map((object) => (
          <article key={object.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <div className="font-semibold text-slate-100">{object.key}</div>
            <div className="mt-1 text-xs text-slate-400">{object.storageClass} · retention {object.retentionDays} days · encrypted {String(object.encrypted)} · restore {object.restoreEta}</div>
          </article>
        ))}
        <p className="text-sm text-slate-400">Compliance blocked: {String(state?.complianceBlocked)} · {state?.lastMessage}</p>
      </section>
    </main>
  );
}
