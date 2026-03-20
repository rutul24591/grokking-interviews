"use client";

import { Box } from "@/app/_components/Box";
import { useHydrateOnVisible } from "@/lib/hooks";

export function VisibleGate() {
  const { ref, ready } = useHydrateOnVisible({ rootMargin: "250px" });
  return (
    <div ref={ref} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">Visible gate</div>
        <div className="text-[11px] font-mono text-slate-400">{ready ? "mounted" : "waiting"}</div>
      </div>
      <div className="mt-3">
        {ready ? (
          <Box label="Visible-loaded island" />
        ) : (
          <div className="text-sm text-slate-200">Scroll near me to mount…</div>
        )}
      </div>
    </div>
  );
}

