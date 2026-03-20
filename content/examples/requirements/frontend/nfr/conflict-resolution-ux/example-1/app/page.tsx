"use client";

import { useEffect, useMemo, useState } from "react";

type Doc = { id: string; version: number; content: string; updatedAtMs: number };

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<{ status: number; body: T }> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  const body = text ? (JSON.parse(text) as T) : (undefined as T);
  return { status: res.status, body };
}

export default function Page() {
  const [server, setServer] = useState<Doc | null>(null);
  const [base, setBase] = useState<Doc | null>(null);
  const [draft, setDraft] = useState("");
  const [conflict, setConflict] = useState<Doc | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const r = await json<{ doc: Doc }>("/api/doc");
    setServer(r.body.doc);
    if (!base) setBase(r.body.doc);
    if (!draft) setDraft(r.body.doc.content);
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    setServer(null);
    setBase(null);
    setDraft("");
    setConflict(null);
    await refresh();
  }

  async function save(force = false, contentOverride?: string) {
    if (!server) return;
    setBusy(true);
    setError("");
    setConflict(null);
    const content = contentOverride ?? draft;
    try {
      const r = await json<{ error?: string; details?: { doc?: Doc }; doc?: Doc }>("/api/doc", {
        method: "PATCH",
        body: JSON.stringify({ baseVersion: base?.version ?? 0, content, force }),
      });
      if (r.status === 409) {
        setConflict(r.body.details?.doc ?? null);
        setError("Conflict: server changed since you loaded. Choose a resolution path.");
        await refresh();
        return;
      }
      if (r.status !== 200) {
        setError("Save failed: " + (r.body.error ?? "unknown"));
        return;
      }
      setServer(r.body.doc ?? null);
      setBase(r.body.doc ?? null);
      setDraft((r.body.doc as Doc).content);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const mergePreview = useMemo(() => {
    if (!conflict || !base) return null;
    if (draft === conflict.content) return { ok: true, merged: draft };
    if (draft === base.content) return { ok: true, merged: conflict.content };
    if (conflict.content === base.content) return { ok: true, merged: draft };
    const merged =
      `<<<<<<< local\\n` +
      draft +
      `\\n=======\\n` +
      conflict.content +
      `\\n>>>>>>> remote\\n`;
    return { ok: false, merged };
  }, [conflict, base, draft]);

  useEffect(() => {
    refresh().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Conflict Lab</h1>
        <p className="mt-2 text-slate-300">
          Optimistic edits with explicit conflict UX. Open this page in two tabs and save in both.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-sm">{error}</div>
        ) : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-300">
            serverVersion: <span className="font-mono text-slate-100">{server?.version ?? "—"}</span>{" "}
            • baseVersion: <span className="font-mono text-slate-100">{base?.version ?? "—"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => refresh()}
              className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => save(false)}
              disabled={busy}
              className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded bg-amber-700 px-4 py-2 text-sm font-semibold hover:bg-amber-600"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <div className="text-sm font-semibold">Your draft</div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={14}
              className="mt-2 w-full rounded border border-slate-700 bg-black/30 px-3 py-2 font-mono text-sm"
            />
          </div>
          <div>
            <div className="text-sm font-semibold">Server (latest)</div>
            <pre className="mt-2 overflow-auto rounded border border-slate-700 bg-black/30 p-3 text-xs text-slate-100">
              {server?.content ?? "—"}
            </pre>
          </div>
        </div>
      </section>

      {conflict ? (
        <section className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-5">
          <h2 className="text-lg font-semibold">Conflict resolution</h2>
          <p className="mt-1 text-sm text-slate-200">
            Decide how to resolve. A “merge” preview is shown; if it contains markers, manual review is required.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700"
              onClick={() => {
                setDraft(conflict.content);
                setBase(conflict);
                setConflict(null);
                setError("");
              }}
            >
              Use server
            </button>
            <button
              type="button"
              className="rounded bg-amber-700 px-4 py-2 text-sm font-semibold hover:bg-amber-600"
              onClick={() => save(true)}
            >
              Force overwrite (mine)
            </button>
            <button
              type="button"
              className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
              onClick={() => mergePreview && save(true, mergePreview.merged)}
              disabled={!mergePreview}
            >
              Save merge (force)
            </button>
          </div>
          <pre className="mt-4 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">
            {mergePreview?.merged ?? "—"}
          </pre>
        </section>
      ) : null}
    </main>
  );
}

