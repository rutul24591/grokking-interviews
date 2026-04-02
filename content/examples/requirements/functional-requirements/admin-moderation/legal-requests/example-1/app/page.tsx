"use client";

import { useEffect, useState } from "react";

type LegalRequest = {
  id: string;
  requester: string;
  region: string;
  priority: "standard" | "urgent";
  status: "intake" | "counsel-review" | "fulfilled";
};

type LegalRequestState = {
  counselOwner: string;
  requests: LegalRequest[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<LegalRequestState | null>(null);

  async function refresh() {
    const response = await fetch("/api/legal-requests/state");
    setState((await response.json()) as LegalRequestState);
  }

  async function act(type: "assign-counsel" | "mark-fulfilled", id?: string) {
    const response = await fetch("/api/legal-requests/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id })
    });
    setState((await response.json()) as LegalRequestState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Legal Requests Console</h1>
      <p className="mt-2 text-slate-300">Route takedowns and data requests through counsel review, then track fulfillment state for high-risk jurisdictions.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Counsel owner</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.counselOwner}</div>
          <button onClick={() => void act("assign-counsel")} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Rotate counsel</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.requests.map((request) => (
            <div key={request.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{request.requester}</div>
                  <div className="mt-1 text-xs text-slate-500">{request.region} · {request.priority}</div>
                </div>
                <button onClick={() => void act("mark-fulfilled", request.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Fulfill</button>
              </div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2">status: {request.status}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
