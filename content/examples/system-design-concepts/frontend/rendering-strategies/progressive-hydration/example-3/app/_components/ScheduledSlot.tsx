"use client";

import { useEffect, useState } from "react";
import { loadHeavyWidget } from "@/lib/heavyLoader";

type HeavyType = React.ComponentType<{ label: string; seed: number }>;

function scheduleIdle(cb: () => void) {
  if (typeof (window as any).requestIdleCallback === "function") {
    const id = (window as any).requestIdleCallback(cb, { timeout: 1400 });
    return () => (window as any).cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 650);
  return () => window.clearTimeout(id);
}

export default function ScheduledSlot(props: { label: string; seed: number }) {
  const [Comp, setComp] = useState<HeavyType | null>(null);
  const [status, setStatus] = useState<"scheduled" | "loading" | "mounted">("scheduled");

  useEffect(() => {
    if (Comp) return;
    let cancelled = false;
    const cancel = scheduleIdle(async () => {
      setStatus("loading");
      const mod = await loadHeavyWidget();
      if (cancelled) return;
      setComp(() => mod.default as HeavyType);
      setStatus("mounted");
    });
    return () => {
      cancelled = true;
      cancel();
    };
  }, [Comp]);

  async function loadNow() {
    if (Comp) return;
    setStatus("loading");
    const mod = await loadHeavyWidget();
    setComp(() => mod.default as HeavyType);
    setStatus("mounted");
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
          {props.label}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-mono text-slate-400">{status}</div>
          <button
            type="button"
            onPointerDown={() => void loadNow()}
            onClick={() => void loadNow()}
            className="rounded-lg border border-slate-800 bg-slate-950/30 px-2 py-1 text-[11px] text-slate-200 hover:border-slate-600"
          >
            Load now
          </button>
        </div>
      </div>

      <div className="mt-3">
        {Comp ? (
          <Comp label={props.label} seed={props.seed} />
        ) : (
          <div className="text-sm text-slate-200">
            Scheduled for idle. Interactions can preempt and load immediately.
          </div>
        )}
      </div>
    </div>
  );
}

