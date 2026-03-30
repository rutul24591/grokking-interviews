"use client";

import { useMemo, useState } from "react";
import { createCircuitBreaker, type BreakerSnapshot } from "../lib/breaker/circuitBreaker";
import { loadQueue, pushQueue, removeQueueItem, type QueuedCall } from "../lib/queue/localQueue";

export function BreakerClient() {
  const breaker = useMemo(() => createCircuitBreaker({ failureThreshold: 3, openMs: 4_000 }), []);
  const [snapshot, setSnapshot] = useState<BreakerSnapshot>(() => breaker.snapshot());
  const [queue, setQueue] = useState<QueuedCall[]>(() => loadQueue());
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const [failRate, setFailRate] = useState(0.6);
  const endpoint = `/api/unstable?failRate=${encodeURIComponent(String(failRate))}&delayMs=180`;

  async function callOnce() {
    setError(null);
    setResult(null);
    try {
      const json = await breaker.exec(async () => {
        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error(`http-${res.status}`);
        return await res.json();
      });
      setResult(json);
      setSnapshot(breaker.snapshot());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSnapshot(breaker.snapshot());
    }
  }

  function queueCall() {
    const item = pushQueue({ method: "GET", url: endpoint });
    setQueue(loadQueue());
    setResult({ queued: item.id, url: endpoint });
  }

  async function drainQueue() {
    setError(null);
    setResult(null);
    const items = loadQueue();
    for (const item of items) {
      try {
        const json = await breaker.exec(async () => {
          const res = await fetch(item.url, { cache: "no-store" });
          if (!res.ok) throw new Error(`http-${res.status}`);
          return await res.json();
        });
        removeQueueItem(item.id);
        setQueue(loadQueue());
        setResult({ drained: item.id, json });
      } catch (e) {
        setError(`Drain failed at ${item.id}: ${e instanceof Error ? e.message : String(e)}`);
        setQueue(loadQueue());
        break;
      } finally {
        setSnapshot(breaker.snapshot());
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/80">
        <div>
          breaker: <span className="font-semibold">{snapshot.state}</span>{" "}
          {snapshot.state === "open" ? <span className="text-white/60">(until {new Date(snapshot.openUntil).toLocaleTimeString()})</span> : null}
        </div>
        <div>
          recent failures: <span className="font-semibold">{snapshot.consecutiveFailures}</span>
        </div>
        <div>
          queue size: <span className="font-semibold">{queue.length}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-white/80">
          failRate
          <input
            className="w-40"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={failRate}
            onChange={(e) => setFailRate(Number(e.target.value))}
          />
          <span className="w-10 text-right font-semibold">{failRate.toFixed(2)}</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          onClick={callOnce}
        >
          Call endpoint
        </button>
        <button
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          onClick={queueCall}
        >
          Queue call
        </button>
        <button
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50"
          disabled={queue.length === 0}
          onClick={drainQueue}
        >
          Drain queue
        </button>
      </div>

      <div className="text-sm text-white/70">
        URL: <code>{endpoint}</code>
      </div>

      {result ? (
        <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/20 p-4 text-xs text-white/80">
{JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
      {error ? <p className="text-sm text-red-200">Error: <code>{error}</code></p> : null}

      <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/70">
        <div className="font-semibold text-white/80">Why this matters</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Connectivity != dependency health (you can be “online” and still fail to reach a service).</li>
          <li>Circuit breakers prevent thundering herds and protect battery/CPU by failing fast.</li>
          <li>Queueing helps preserve user intent until conditions recover.</li>
        </ul>
      </div>
    </div>
  );
}

