"use client";

export function BuggyClock() {
  // BUG: this value differs between SSR and client hydration.
  const now = new Date().toISOString();
  return (
    <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-red-200">
        Buggy (mismatch)
      </div>
      <div className="mt-2 font-mono text-sm text-red-100">{now}</div>
      <div className="mt-2 text-xs text-red-200/80">
        React will warn because the server-rendered HTML doesn’t match the client’s first render.
      </div>
    </div>
  );
}

