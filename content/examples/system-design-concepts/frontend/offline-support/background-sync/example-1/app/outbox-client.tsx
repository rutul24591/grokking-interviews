"use client";

import { useEffect, useMemo, useState } from "react";
import { addOutboxItem, deleteOutboxItem, listOutboxItems, type OutboxItem } from "../lib/outbox/outboxStore";
import { registerSw, requestSwDrain, supportsBackgroundSync } from "../lib/sw/swClient";

type SwState =
  | { status: "unsupported" }
  | { status: "registering" }
  | { status: "ready"; bgSync: boolean }
  | { status: "error"; message: string };

export function OutboxClient() {
  const [items, setItems] = useState<OutboxItem[]>([]);
  const [sw, setSw] = useState<SwState>({ status: "registering" });
  const [lastResult, setLastResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const browserOnline = useMemo(() => (typeof navigator === "undefined" ? true : navigator.onLine), []);

  async function refresh() {
    setItems(await listOutboxItems());
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof window === "undefined") return;
      if (!("serviceWorker" in navigator)) {
        setSw({ status: "unsupported" });
        return;
      }
      try {
        await registerSw("/sw.js");
        const bgSync = await supportsBackgroundSync();
        if (!cancelled) setSw({ status: "ready", bgSync });
      } catch (e) {
        if (!cancelled) setSw({ status: "error", message: e instanceof Error ? e.message : String(e) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function queueMutation() {
    setError(null);
    setLastResult(null);
    const payload = { kind: "UPSERT_NOTE", noteId: crypto.randomUUID(), content: `Hello @ ${new Date().toISOString()}` };
    const item = await addOutboxItem(payload);
    await refresh();

    try {
      const reg = await navigator.serviceWorker.ready;
      const anyReg = reg as ServiceWorkerRegistration & { sync?: { register: (tag: string) => Promise<void> } };
      if (anyReg.sync?.register) {
        await anyReg.sync.register("outbox-sync");
        setLastResult({ queued: item.id, backgroundSync: "registered" });
      } else {
        setLastResult({ queued: item.id, backgroundSync: "unsupported" });
      }
    } catch (e) {
      setLastResult({ queued: item.id, backgroundSync: "registration-failed", error: e instanceof Error ? e.message : String(e) });
    }
  }

  async function drainViaSw() {
    setError(null);
    setLastResult(null);
    try {
      const res = await requestSwDrain();
      setLastResult(res);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function drainViaPage() {
    setError(null);
    setLastResult(null);
    const all = await listOutboxItems();
    const applied: string[] = [];
    const failed: { id: string; error: string }[] = [];

    for (const item of all) {
      try {
        const res = await fetch("/api/apply", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-idempotency-key": item.idempotencyKey
          },
          body: JSON.stringify({ id: item.id, idempotencyKey: item.idempotencyKey, payload: item.payload })
        });
        if (!res.ok) throw new Error(`http-${res.status}`);
        await deleteOutboxItem(item.id);
        applied.push(item.id);
      } catch (e) {
        failed.push({ id: item.id, error: e instanceof Error ? e.message : String(e) });
      }
    }

    setLastResult({ applied, failed, note: "Manual drain runs in the page (fallback when sync event never fires)." });
    await refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-white/80">
          navigator.onLine: <span className="font-semibold">{String(browserOnline)}</span>
        </span>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-white/80">
          SW:{" "}
          <span className="font-semibold">
            {sw.status === "ready" ? (sw.bgSync ? "ready + bg-sync" : "ready (no bg-sync)") : sw.status}
          </span>
        </span>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-white/80">
          outbox: <span className="font-semibold">{items.length}</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          onClick={queueMutation}
        >
          Queue mutation
        </button>
        <button
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50"
          disabled={sw.status !== "ready"}
          onClick={drainViaSw}
        >
          Drain via service worker
        </button>
        <button
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          onClick={drainViaPage}
        >
          Drain via page (fallback)
        </button>
        <button
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          onClick={refresh}
        >
          Refresh outbox
        </button>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/80">
        <div className="font-semibold text-white/90">Outbox items</div>
        {items.length === 0 ? (
          <div className="mt-2 text-white/60">No pending mutations.</div>
        ) : (
          <div className="mt-2 space-y-2">
            {items.map((it) => (
              <div key={it.id} className="rounded-md border border-white/10 bg-white/5 p-3">
                <div>
                  id: <code>{it.id}</code>
                </div>
                <div>
                  idempotencyKey: <code>{it.idempotencyKey}</code>
                </div>
                <div>
                  payload: <code>{JSON.stringify(it.payload)}</code>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lastResult ? (
        <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/20 p-4 text-xs text-white/80">
{JSON.stringify(lastResult, null, 2)}
        </pre>
      ) : null}
      {error ? <p className="text-sm text-red-200">Error: <code>{error}</code></p> : null}

      <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/70">
        <div className="font-semibold text-white/80">Key production takeaways</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Sync events are <span className="font-semibold">at-least-once</span> → use idempotency keys.</li>
          <li>Draining should be <span className="font-semibold">bounded</span> (batch size, time budget, backoff).</li>
          <li>Always ship a <span className="font-semibold">manual fallback</span> path.</li>
        </ul>
      </div>
    </div>
  );
}

