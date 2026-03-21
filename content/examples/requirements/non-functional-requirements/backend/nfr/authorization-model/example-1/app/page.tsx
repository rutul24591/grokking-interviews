"use client";

import { useEffect, useState } from "react";

type Decision = any;

async function getJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  return { status: res.status, body: await res.json() };
}

export default function Page() {
  const [userId, setUserId] = useState("u_editor");
  const [docId, setDocId] = useState("d1");
  const [action, setAction] = useState<"read" | "edit" | "delete">("read");
  const [docs, setDocs] = useState<any[]>([]);
  const [decision, setDecision] = useState<Decision | null>(null);

  useEffect(() => {
    const run = async () => {
      const r = await getJson(`/api/authz/docs?userId=${encodeURIComponent(userId)}`);
      setDocs(r.status === 200 ? r.body.docs : []);
      if (r.status === 200 && r.body.docs?.length) setDocId(r.body.docs[0].id);
    };
    void run();
  }, [userId]);

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Authorization model — RBAC + ABAC with a trace</h1>
        <p className="text-sm text-slate-300">
          Evaluates permissions with org boundary (ABAC) + role rules (RBAC). Returns a decision trace for debugging.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-3 text-sm">
          <label className="space-y-1">
            <div className="text-slate-300">User</div>
            <select
              className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              <option value="u_admin">u_admin (admin org1)</option>
              <option value="u_editor">u_editor (editor org1)</option>
              <option value="u_viewer">u_viewer (viewer org1)</option>
              <option value="u_other_org">u_other_org (admin org2)</option>
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-slate-300">Document</div>
            <select
              className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2"
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
            >
              {docs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.id} ({d.classification})
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-slate-300">Action</div>
            <select
              className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2"
              value={action}
              onChange={(e) => setAction(e.target.value as any)}
            >
              <option value="read">read</option>
              <option value="edit">edit</option>
              <option value="delete">delete</option>
            </select>
          </label>
        </div>

        <button
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
          onClick={async () =>
            setDecision(
              (
                await getJson(
                  `/api/authz/eval?userId=${encodeURIComponent(userId)}&docId=${encodeURIComponent(docId)}&action=${action}`,
                )
              ).body,
            )
          }
        >
          Evaluate
        </button>

        <pre className="rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">
          {JSON.stringify(decision, null, 2)}
        </pre>
      </section>
    </main>
  );
}

