"use client";

import { useEffect, useMemo, useState } from "react";
import { listDocs, listOutbox, upsertDoc, type Doc, type OutboxItem } from "../lib/store";
import { resolveByAcceptingServer, resolveByOverwritingServer, syncOutbox } from "../lib/sync";

type OutboxRow = (OutboxItem & { id: number }) | null;

export function OfflineFirstClient() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [outbox, setOutbox] = useState<(OutboxItem & { id: number })[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);

  const selected = useMemo(() => docs.find((d) => d.id === selectedId) ?? null, [docs, selectedId]);
  const conflicts = useMemo(() => outbox.filter((o) => o.status === "conflict"), [outbox]);
  const pendingCount = useMemo(() => outbox.filter((o) => o.status === "pending").length, [outbox]);

  const appendLog = (line: string) => setLog((l) => [line, ...l].slice(0, 12));

  async function refresh() {
    setDocs(await listDocs());
    setOutbox(await listOutbox());
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setTitle(selected.title);
    setBody(selected.body);
  }, [selectedId]);

  async function createNew() {
    const doc = await upsertDoc({ title: "Untitled", body: "" });
    await refresh();
    setSelectedId(doc.id);
  }

  async function save() {
    const doc = await upsertDoc({ id: selectedId ?? undefined, title, body });
    await refresh();
    setSelectedId(doc.id);
  }

  async function doSync() {
    setSyncing(true);
    try {
      const r = await syncOutbox({
        onProgress: (m) => appendLog(`${new Date().toLocaleTimeString()}: ${m}`)
      });
      appendLog(
        `${new Date().toLocaleTimeString()}: applied=${r.applied} conflicts=${r.conflicts} stoppedEarly=${r.stoppedEarly}`,
      );
    } finally {
      setSyncing(false);
      await refresh();
    }
  }

  async function acceptServer(row: OutboxRow) {
    if (!row || row.status !== "conflict") return;
    await resolveByAcceptingServer({ outboxId: row.id, serverDoc: row.serverDoc });
    await refresh();
  }

  async function overwriteServer(row: OutboxRow) {
    if (!row || row.status !== "conflict") return;
    await resolveByOverwritingServer({ outboxId: row.id, serverDoc: row.serverDoc });
    await refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/80">Docs</h2>
          <button
            className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-400"
            onClick={createNew}
          >
            New
          </button>
        </div>

        <div className="space-y-2">
          {docs.length === 0 ? <p className="text-sm text-white/60">No docs yet.</p> : null}
          {docs.map((d) => (
            <button
              key={d.id}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                d.id === selectedId ? "border-white/30 bg-white/10" : "border-white/10 bg-black/20 hover:bg-white/5"
              }`}
              onClick={() => setSelectedId(d.id)}
            >
              <div className="font-semibold">{d.title || "(untitled)"}</div>
              <div className="mt-0.5 text-xs text-white/60">
                localV={d.localVersion} serverV={d.serverVersion} • {new Date(d.updatedAt).toLocaleString()}
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-xs text-white/70">
          <div>
            pending outbox: <span className="font-semibold text-white">{pendingCount}</span>
          </div>
          <div>
            conflicts: <span className="font-semibold text-white">{conflicts.length}</span>
          </div>
        </div>

        <button
          className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={syncing}
          onClick={doSync}
        >
          {syncing ? "Syncing…" : "Sync outbox"}
        </button>
      </aside>

      <section className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h2 className="text-lg font-semibold">Editor</h2>
          <div className="mt-3 grid gap-3">
            <label className="space-y-1">
              <div className="text-xs font-semibold text-white/70">Title</div>
              <input
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/25"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </label>
            <label className="space-y-1">
              <div className="text-xs font-semibold text-white/70">Body</div>
              <textarea
                className="h-40 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/25"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write something…"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
                onClick={save}
              >
                Save locally (enqueue)
              </button>
              <span className="text-sm text-white/60">
                Tip: DevTools → Network → Offline, then keep saving and watch the outbox grow.
              </span>
            </div>
          </div>
        </div>

        {conflicts.length > 0 ? (
          <div className="rounded-xl border border-amber-300/20 bg-amber-400/10 p-4">
            <h2 className="text-lg font-semibold text-amber-100">Conflicts (manual resolution)</h2>
            <p className="mt-1 text-sm text-amber-100/80">
              Offline-first systems need a deliberate conflict policy. This example detects conflicts and lets you pick a
              manual outcome; the dedicated Conflict Resolution topic goes deeper.
            </p>
            <div className="mt-4 space-y-3">
              {conflicts.map((c) => (
                <div key={c.id} className="rounded-lg border border-amber-300/20 bg-black/20 p-3">
                  <div className="text-sm">
                    docId: <code>{c.docId}</code> (baseServerVersion={c.baseServerVersion})
                  </div>
                  <div className="mt-2 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                      <div className="text-xs font-semibold text-white/70">Local (queued)</div>
                      <div className="mt-1 text-sm font-semibold">{c.payload.title}</div>
                      <div className="mt-1 text-xs text-white/60">localV={c.payload.localVersion}</div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                      <div className="text-xs font-semibold text-white/70">Server</div>
                      <div className="mt-1 text-sm font-semibold">{c.serverDoc.title}</div>
                      <div className="mt-1 text-xs text-white/60">serverV={c.serverDoc.serverVersion}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                      onClick={() => acceptServer(c)}
                    >
                      Accept server (drop local)
                    </button>
                    <button
                      className="rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-black hover:bg-amber-300"
                      onClick={() => overwriteServer(c)}
                    >
                      Overwrite server (new mutation)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h2 className="text-sm font-semibold text-white/80">Sync log</h2>
          <div className="mt-2 space-y-1 text-xs text-white/70">
            {log.length === 0 ? <div>(no sync yet)</div> : null}
            {log.map((l, idx) => (
              <div key={idx}>{l}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

