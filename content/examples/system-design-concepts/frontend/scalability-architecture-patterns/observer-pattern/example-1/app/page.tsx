"use client";

import { useMemo } from "react";
import { createObservable } from "../lib/observable";
import { useObservableValue } from "../lib/useObservableValue";

function CounterCard({ label, counter$ }: { label: string; counter$: ReturnType<typeof createObservable<number>> }) {
  const v = useObservableValue(counter$);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-3xl font-semibold tabular-nums">{v}</div>
    </div>
  );
}

export default function Page() {
  const counter$ = useMemo(() => createObservable(0), []);
  const v = useObservableValue(counter$);

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Observer Pattern: a tiny observable store</h1>
        <p className="text-sm text-white/70">
          Multiple components subscribe to the same subject. React integrates via <code>useSyncExternalStore</code>.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <CounterCard label="Observer A" counter$={counter$} />
        <CounterCard label="Observer B" counter$={counter$} />
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Derived (observer)</div>
          <div className="mt-1 text-3xl font-semibold tabular-nums">{v * 2}</div>
          <div className="mt-2 text-sm text-white/70">counter × 2</div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold">Mutations (notify observers)</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            onClick={() => counter$.set((p) => p + 1)}
          >
            Increment
          </button>
          <button
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            onClick={() => counter$.set(0)}
          >
            Reset
          </button>
        </div>
        <p className="mt-3 text-sm text-white/60">
          Production note: prefer selectors/batching for high-frequency updates (Example 2).
        </p>
      </section>
    </main>
  );
}

