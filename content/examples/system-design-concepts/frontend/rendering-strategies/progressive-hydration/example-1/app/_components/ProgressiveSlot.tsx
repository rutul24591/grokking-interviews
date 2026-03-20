"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Strategy = "immediate" | "idle" | "visible";
type HeavyModule = typeof import("./HeavyWidget");

function scheduleIdle(cb: () => void) {
  if (typeof (window as any).requestIdleCallback === "function") {
    const id = (window as any).requestIdleCallback(cb, { timeout: 1200 });
    return () => (window as any).cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 650);
  return () => window.clearTimeout(id);
}

export default function ProgressiveSlot(props: { strategy: Strategy; label: string }) {
  const [Comp, setComp] = useState<React.ComponentType<{ label: string }> | null>(null);
  const [status, setStatus] = useState<"waiting" | "loading" | "mounted">("waiting");
  const rootRef = useRef<HTMLDivElement | null>(null);

  const strategyLabel = useMemo(() => {
    if (props.strategy === "immediate") return "immediate";
    if (props.strategy === "idle") return "idle";
    return "visible";
  }, [props.strategy]);

  useEffect(() => {
    if (Comp) return;
    let cancelled = false;

    async function load() {
      setStatus("loading");
      const mod = (await import("./HeavyWidget")) as HeavyModule;
      if (cancelled) return;
      setComp(() => mod.default);
      setStatus("mounted");
    }

    if (props.strategy === "immediate") {
      void load();
      return () => {
        cancelled = true;
      };
    }

    if (props.strategy === "idle") {
      const cancel = scheduleIdle(() => void load());
      return () => {
        cancelled = true;
        cancel();
      };
    }

    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((e) => e.isIntersecting);
        if (!isVisible || cancelled) return;
        observer.disconnect();
        void load();
      },
      { rootMargin: "200px" },
    );
    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [Comp, props.strategy]);

  return (
    <div ref={rootRef} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
          Slot: {strategyLabel}
        </div>
        <div className="text-[11px] font-mono text-slate-400">{status}</div>
      </div>

      <div className="mt-3">
        {Comp ? (
          <Comp label={props.label} />
        ) : (
          <div className="space-y-2">
            <div className="h-3 w-5/6 animate-pulse rounded bg-slate-800/60" />
            <div className="h-3 w-4/6 animate-pulse rounded bg-slate-800/60" />
            <div className="text-xs text-slate-500">
              Heavy island not loaded yet. Strategy: <span className="font-mono">{strategyLabel}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

