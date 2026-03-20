"use client";

import { Suspense, useState } from "react";
import QueuedButton from "@/app/_components/QueuedButton";
import { suspendOnClient } from "@/lib/clientSuspend";

function ClientHydrationDelay({ ms, children }: { ms: number; children: React.ReactNode }) {
  // Intentionally suspend only on the client to simulate a boundary that can’t hydrate immediately.
  suspendOnClient("delay", ms);
  return children;
}

export default function SelectiveDemo() {
  const [fastCount, setFastCount] = useState(0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
          Fast island (hydrates immediately)
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFastCount((c) => c + 1)}
            className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-sm text-slate-200 hover:border-slate-600"
          >
            Fast button
          </button>
          <div className="text-sm text-slate-100">
            Count: <span className="font-mono">{fastCount}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
          Suspended boundary (hydrates later)
        </div>
        <p className="mt-2 text-sm text-slate-300">
          The button is visible from SSR, but hydration is delayed for ~3s. Click before it hydrates to test replay.
        </p>

        <div className="mt-3">
          <Suspense
            fallback={
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3 text-sm text-slate-200">
                Hydrating boundary… (simulated delay)
              </div>
            }
          >
            <ClientHydrationDelay ms={3000}>
              <QueuedButton />
            </ClientHydrationDelay>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

