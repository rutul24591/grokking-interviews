"use client";

import { useEffect, useMemo, useState } from "react";

type Note = { id: string; ts: number; text: string };
type Snapshot = { notes: Note[]; version: number };

async function getNotes(): Promise<Snapshot> {
  const res = await fetch("/api/notes", { cache: "no-store" });
  if (!res.ok) throw new Error(`notes failed: ${res.status}`);
  return (await res.json()) as Snapshot;
}

export default function Page() {
  const [snapshot, setSnapshot] = useState<Snapshot>({ notes: [], version: 0 });
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const lastUpdated = useMemo(() => {
    const ts = snapshot.notes[0]?.ts;
    return ts ? new Date(ts).toISOString() : "—";
  }, [snapshot.notes]);

  const load = async () => {
    setError(null);
    try {
      const s = await getNotes();
      setSnapshot(s);
    } catch (e) {
      setError(String(e));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Offline Support (PWA) — cache + offline fallback</h1>
        <p className="text-sm text-slate-300">
          The service worker caches the offline page and implements a minimal{" "}
          <strong>stale-while-revalidate</strong> strategy for{" "}
          <code className="rounded bg-slate-800 px-1">/api/notes</code>.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="text-sm text-slate-300">
          Version: <span className="font-mono">{snapshot.version}</span> • Latest note:{" "}
          <span className="font-mono">{lastUpdated}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
            onClick={() => void load()}
          >
            Refresh
          </button>
          <button
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
            onClick={async () => {
              await fetch("/api/notes/reset", { method: "POST" });
              await load();
            }}
          >
            Reset server state
          </button>
        </div>

        <div className="grid gap-2 md:grid-cols-[1fr_auto]">
          <input
            className="rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm"
            placeholder="Add a note (try offline after one refresh)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
            disabled={!text.trim() || busy}
            onClick={async () => {
              setBusy(true);
              setError(null);
              try {
                const res = await fetch("/api/notes/add", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ text: text.trim() })
                });
                if (!res.ok) throw new Error(`add failed: ${res.status}`);
                setText("");
                await load();
              } catch (e) {
                setError(String(e));
              } finally {
                setBusy(false);
              }
            }}
          >
            Add
          </button>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-800 bg-rose-950/30 p-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
        <h2 className="font-medium">Notes</h2>
        <ul className="mt-3 space-y-2">
          {snapshot.notes.map((n) => (
            <li key={n.id} className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
              <div className="text-slate-200">{n.text}</div>
              <div className="mt-1 text-xs text-slate-400">
                {n.id} • {new Date(n.ts).toISOString()}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">How to demo offline</h2>
        <ol className="mt-2 list-decimal pl-5 space-y-1">
          <li>Load the page once (service worker installs).</li>
          <li>Refresh once (to ensure caches warm).</li>
          <li>Toggle DevTools → Network → Offline.</li>
          <li>Reload: you should see the offline fallback and cached notes response.</li>
        </ol>
      </section>
    </main>
  );
}

