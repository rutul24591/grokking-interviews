"use client";

import { useEffect, useMemo, useState } from "react";

type Msg = { clientId: string; opId: string; message: string; acceptedAtMs: number };

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(res.status + " " + res.statusText + (text ? " — " + text : ""));
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

function newId(prefix: string) {
  return prefix + "_" + Math.random().toString(16).slice(2);
}

type OutboxItem = { opId: string; message: string };

function loadOutbox(key: string): OutboxItem[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as OutboxItem[]) : [];
  } catch {
    return [];
  }
}

function saveOutbox(key: string, items: OutboxItem[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

export default function Page() {
  const clientId = useMemo(() => {
    const k = "outbox_client_id";
    const existing = typeof window !== "undefined" ? localStorage.getItem(k) : null;
    if (existing) return existing;
    const id = newId("client");
    if (typeof window !== "undefined") localStorage.setItem(k, id);
    return id;
  }, []);

  const outboxKey = useMemo(() => `outbox_${clientId}`, [clientId]);

  const [draft, setDraft] = useState("");
  const [outbox, setOutbox] = useState<OutboxItem[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);

  async function refresh() {
    const r = await json<{ messages: Msg[] }>("/api/messages");
    setMessages(r.messages);
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    setDraft("");
    setOutbox([]);
    saveOutbox(outboxKey, []);
    await refresh();
  }

  function enqueue() {
    const item: OutboxItem = { opId: newId("op"), message: draft.trim() };
    const next = [item, ...outbox];
    setOutbox(next);
    saveOutbox(outboxKey, next);
    setDraft("");
  }

  async function flush() {
    setBusy(true);
    setError("");
    try {
      if (offline) throw new Error("simulated_offline");
      const remaining: OutboxItem[] = [];
      for (const item of outbox) {
        const r = await json<{ duplicate: boolean }>("/api/send", {
          method: "POST",
          body: JSON.stringify({ clientId, opId: item.opId, message: item.message }),
        });
        if (r.duplicate) {
          // Already processed; drop from outbox.
        }
      }
      setOutbox(remaining);
      saveOutbox(outboxKey, remaining);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    setOutbox(loadOutbox(outboxKey));
    refresh().catch(() => {});
  }, [outboxKey]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Outbox Lab</h1>
        <p className="mt-2 text-slate-300">
          Client persistence strategy: store pending operations locally (outbox) and deliver with idempotency keys.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div>
        ) : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-300">
            clientId: <span className="font-mono text-slate-100">{clientId}</span> • outbox:{" "}
            <span className="font-mono text-slate-100">{outbox.length}</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={offline} onChange={(e) => setOffline(e.target.checked)} />
              Simulate offline
            </label>
            <button
              type="button"
              onClick={reset}
              className="rounded bg-amber-700 px-4 py-2 text-sm font-semibold hover:bg-amber-600"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className="rounded border border-slate-700 bg-black/30 px-3 py-2"
            placeholder="Write a message..."
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={enqueue}
              disabled={!draft.trim()}
              className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700 disabled:opacity-50"
            >
              Enqueue (local)
            </button>
            <button
              type="button"
              onClick={flush}
              disabled={busy || !outbox.length}
              className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
            >
              {busy ? "Flushing..." : "Flush outbox"}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Outbox (local)</h2>
          <pre className="mt-4 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">
            {JSON.stringify(outbox, null, 2)}
          </pre>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Server messages</h2>
          <pre className="mt-4 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">
            {JSON.stringify(messages, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}

