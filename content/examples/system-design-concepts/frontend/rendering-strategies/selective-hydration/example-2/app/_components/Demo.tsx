"use client";

import { Suspense } from "react";
import InteractionIsland from "@/app/_components/InteractionIsland";
import { suspendOnClient } from "@/lib/clientSuspend";

function Delay({ ms, children }: { ms: number; children: React.ReactNode }) {
  suspendOnClient("delay", ms);
  return children;
}

export default function Demo() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200">
          Hydrating boundary… (simulated 3s delay)
        </div>
      }
    >
      <Delay ms={3000}>
        <InteractionIsland />
      </Delay>
    </Suspense>
  );
}

