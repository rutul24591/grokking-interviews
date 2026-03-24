"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createBatchedObservable } from "../lib/batchedObservable";
import { useObservableValue } from "../lib/useObservableValue";

export default function Page() {
  const store$ = useMemo(() => createBatchedObservable(0), []);
  const value = useObservableValue(store$);

  const rendersRef = useRef(0);
  const [renders, setRenders] = useState(0);
  useEffect(() => {
    rendersRef.current += 1;
    setRenders(rendersRef.current);
  }, [value]);

  function burstUpdates() {
    // Without batching, this would notify subscribers 100 times.
    for (let i = 0; i < 100; i += 1) store$.set((p) => p + 1);
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Observer Pattern: batched notifications</h1>
        <p className="text-sm text-white/70">
          100 synchronous <code>set()</code> calls are coalesced into one notification per microtask.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Value</div>
          <div className="mt-1 text-3xl font-semibold tabular-nums">{value}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Render count (approx)</div>
          <div className="mt-1 text-3xl font-semibold tabular-nums">{renders}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Controls</div>
          <button
            className="mt-3 w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            onClick={burstUpdates}
          >
            Burst +100
          </button>
          <button
            className="mt-2 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            onClick={() => store$.set(0)}
          >
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold">Production caveat</h2>
        <p className="mt-2 text-sm text-white/70">
          Batching improves throughput but can hide intermediate states. For critical events (payments, security), prefer
          lossless delivery with explicit queues and acknowledgements.
        </p>
      </section>
    </main>
  );
}
