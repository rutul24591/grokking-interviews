"use client";

import { useEffect, useRef, useState } from "react";

type CommentsIslandModule = typeof import("./CommentsIsland");

export default function CommentsSlot() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [Island, setIsland] = useState<React.ComponentType | null>(null);
  const [status, setStatus] = useState<"idle" | "observing" | "loading" | "mounted">("idle");

  useEffect(() => {
    if (Island) return;
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    const observer = new IntersectionObserver(
      async (entries) => {
        const isVisible = entries.some((e) => e.isIntersecting);
        if (!isVisible || cancelled) return;
        observer.disconnect();

        setStatus("loading");
        const mod = (await import("./CommentsIsland")) as CommentsIslandModule;
        if (cancelled) return;
        setIsland(() => mod.default);
        setStatus("mounted");
      },
      { rootMargin: "200px" },
    );

    setStatus("observing");
    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [Island]);

  return (
    <div ref={rootRef} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
          Comments (island)
        </div>
        <div className="text-[11px] font-mono text-slate-400">{status}</div>
      </div>

      <div className="mt-3">
        {Island ? (
          <Island />
        ) : (
          <div className="space-y-2">
            <div className="h-3 w-5/6 animate-pulse rounded bg-slate-800/60" />
            <div className="h-3 w-4/6 animate-pulse rounded bg-slate-800/60" />
            <div className="text-xs text-slate-500">
              Placeholder HTML is cheap. The real island JS is imported only when you scroll near it.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

