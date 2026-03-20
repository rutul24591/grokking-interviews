"use client";

import { Box } from "@/app/_components/Box";
import { useHydrateOnIdle } from "@/lib/hooks";

export function IdleGate() {
  const ready = useHydrateOnIdle({ timeoutMs: 900 });
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">Idle gate</div>
        <div className="text-[11px] font-mono text-slate-400">{ready ? "mounted" : "waiting"}</div>
      </div>
      <div className="mt-3">
        {ready ? (
          <Box label="Idle-loaded island" />
        ) : (
          <div className="text-sm text-slate-200">Waiting for idle time…</div>
        )}
      </div>
    </div>
  );
}

