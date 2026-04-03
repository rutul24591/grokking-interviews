"use client";

import { useMemo, useState } from "react";
import { collaborationPolicies, editingSessions, recoveryActions } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [presenceVisible, setPresenceVisible] = useState(true);
  const [publishRequested, setPublishRequested] = useState(false);
  const session = editingSessions[selected];

  const editorState = useMemo(() => {
    if (session.syncHealth === "diverged") return "Switch to recovery mode. Freeze publish, group pending edits by block, and ask the user to reconcile the divergent revision.";
    if (session.syncHealth === "lagging") return "Keep editing optimistic, but surface the pending operation backlog and delay final publish until acknowledgements catch up.";
    return publishRequested ? "Publish can proceed once the remaining pending operations flush and collaborator cursors settle." : "Session is healthy. Keep live cursors, comments, and optimistic edits visible.";
  }, [publishRequested, session]);

  const presenceSummary = useMemo(() => {
    if (!presenceVisible) return "Presence indicators are hidden. Keep authorship in the activity rail so users can still reason about concurrent edits.";
    return `${session.presence} active collaborator(s), local cursor on ${session.localCursor}, and ${session.remoteCursors.length} remote cursor lane(s).`;
  }, [presenceVisible, session]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Real-time features</p>
        <h1 className="mt-2 text-3xl font-semibold">Collaborative editing studio</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Review presence, optimistic operations, publish gating, and recovery when shared document state diverges.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {editingSessions.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={presenceVisible} onChange={(event) => setPresenceVisible(event.target.checked)} /> Show live presence</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={publishRequested} onChange={(event) => setPublishRequested(event.target.checked)} /> Request publish</label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Session snapshot</div>
                <p className="mt-2">User: {session.localUser}</p>
                <p className="mt-2">Pending ops: {session.pendingOps}</p>
                <p className="mt-2">Review state: {session.reviewState}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Presence summary</div>
                <p className="mt-2">{presenceSummary}</p>
                <ul className="mt-3 space-y-2">{session.remoteCursors.map((item) => <li key={item}>• {item}</li>)}</ul>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Editor state</div>
              <p className="mt-2">{editorState}</p>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{collaborationPolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{recoveryActions.map((item) => <li key={item.risk}><span className="font-medium text-slate-100">{item.risk}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
