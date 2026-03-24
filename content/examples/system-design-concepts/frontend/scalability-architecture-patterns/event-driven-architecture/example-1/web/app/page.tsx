"use client";

import { useMemo, useRef, useState } from "react";
import { openDomainEventStream, type SseStatus } from "../lib/sse";
import { renderEventSummary, type DomainEventEnvelopeV1 } from "../lib/events";

type Projection = {
  counter: number;
  lastEventAt?: number;
  lastType?: string;
};

function applyEvent(p: Projection, evt: DomainEventEnvelopeV1): Projection {
  const next: Projection = { ...p, lastEventAt: evt.ts, lastType: evt.type };
  if (evt.type === "counter.incremented") {
    const by = typeof (evt.data as any)?.by === "number" ? (evt.data as any).by : 1;
    next.counter = p.counter + by;
  }
  return next;
}

export default function Page() {
  const [status, setStatus] = useState<SseStatus>("disconnected");
  const [projection, setProjection] = useState<Projection>({ counter: 0 });
  const [log, setLog] = useState<Array<{ ts: number; summary: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef<null | (() => void)>(null);

  const streamUrl = useMemo(() => "http://localhost:4000/events", []);

  function connect() {
    if (stopRef.current) return;
    setError(null);
    stopRef.current = openDomainEventStream({
      url: streamUrl,
      onStatus: setStatus,
      onError: (reason) => setError(reason),
      onDomainEvent: (evt) => {
        setProjection((p) => applyEvent(p, evt));
        setLog((l) => [{ ts: evt.ts, summary: renderEventSummary(evt) }, ...l].slice(0, 30));
      }
    });
  }

  function disconnect() {
    stopRef.current?.();
    stopRef.current = null;
    setStatus("disconnected");
  }

  async function publishIncrement() {
    setError(null);
    try {
      const res = await fetch("http://localhost:4000/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "counter.incremented", data: { by: 1 } })
      });
      if (!res.ok) throw new Error("Publish failed");
    } catch {
      setError("Failed to publish event. Is the server running?");
    }
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Event-Driven Architecture: SSE stream + projection</h1>
        <p className="text-sm text-white/70">
          The UI consumes a domain event stream and derives state by applying events (a small projection).
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Stream</div>
          <div className="mt-1 flex items-center gap-2">
            <div
              className={[
                "h-2 w-2 rounded-full",
                status === "connected" ? "bg-emerald-400" : status === "connecting" ? "bg-amber-400" : "bg-rose-400"
              ].join(" ")}
            />
            <div className="text-sm font-medium">{status}</div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-50"
              onClick={connect}
              disabled={!!stopRef.current}
            >
              Connect
            </button>
            <button
              className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
              onClick={disconnect}
              disabled={!stopRef.current}
            >
              Disconnect
            </button>
          </div>
          <div className="mt-3 text-xs text-white/50">
            URL: <code>{streamUrl}</code>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Projection</div>
          <div className="mt-1 text-3xl font-semibold tabular-nums">{projection.counter}</div>
          <div className="mt-2 text-sm text-white/70">counter</div>
          <div className="mt-4 text-xs text-white/50">
            Last: <code>{projection.lastType ?? "—"}</code>
          </div>
          <button
            className="mt-4 w-full rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-400"
            onClick={publishIncrement}
          >
            Publish increment event
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Why this matters</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
            <li>Decouples producers and consumers.</li>
            <li>Supports realtime UIs with a stable contract.</li>
            <li>Enables multiple projections from the same stream.</li>
          </ul>
        </div>
      </section>

      {error ? <div className="rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm">{error}</div> : null}

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold">Recent events</h2>
        <div className="mt-3 grid gap-2">
          {log.length === 0 ? (
            <div className="text-sm text-white/60">No events yet. Connect and publish one.</div>
          ) : (
            log.map((e, idx) => (
              <div key={`${e.ts}-${idx}`} className="flex items-center justify-between rounded-md bg-black/20 px-3 py-2">
                <div className="text-sm">{e.summary}</div>
                <div className="text-xs text-white/50 tabular-nums">{new Date(e.ts).toLocaleTimeString()}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

