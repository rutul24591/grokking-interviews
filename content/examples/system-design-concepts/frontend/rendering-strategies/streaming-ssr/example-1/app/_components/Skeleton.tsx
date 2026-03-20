export function Skeleton({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
        {label}
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-800/60" />
        <div className="h-3 w-4/6 animate-pulse rounded bg-slate-800/60" />
        <div className="h-3 w-3/6 animate-pulse rounded bg-slate-800/60" />
      </div>
      <div className="mt-4 text-xs text-slate-500">
        Streaming: shell rendered, waiting for this panel…
      </div>
    </div>
  );
}

