"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";

type Result = { id: string; title: string; score: number };

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function SearchPanel() {
  const [q, setQ] = useState("cache");
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [pending, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);
  const reqSeq = useRef(0);
  const [optimisticLiked, setOptimisticLiked] = useState<Set<string>>(new Set());

  const likedCount = useMemo(() => optimisticLiked.size, [optimisticLiked]);

  const runSearch = async (query: string) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setError(null);
    const mySeq = ++reqSeq.current;

    // Show skeleton only if the request takes longer than 150ms (avoid flicker).
    setShowSkeleton(false);
    const skeletonTimer = window.setTimeout(() => setShowSkeleton(true), 150);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&delayMs=650`, {
        signal: ac.signal,
        cache: "no-store"
      });
      if (!res.ok) throw new Error(`search failed: ${res.status}`);
      const body = (await res.json()) as { ok: true; results: Result[] };

      // Guard against out-of-order updates.
      if (mySeq !== reqSeq.current) return;
      startTransition(() => setResults(body.results));
    } catch (e) {
      if (String(e).includes("AbortError")) return;
      setError(String(e));
    } finally {
      window.clearTimeout(skeletonTimer);
      setShowSkeleton(false);
    }
  };

  useEffect(() => {
    void runSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Search (abort + skeleton threshold)</h2>
        <div className="text-xs text-slate-400">
          optimistic likes: <span className="font-mono">{likedCount}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          className="min-w-[240px] flex-1 rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm"
          value={q}
          onChange={(e) => {
            const next = e.target.value;
            setQ(next);
            void runSearch(next);
          }}
          placeholder="Type to search…"
        />
        <button
          className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
          onClick={() => void runSearch(q)}
        >
          Search
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-800 bg-rose-950/30 p-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {showSkeleton ? <Skeleton /> : null}

      <ul className="space-y-2 text-sm">
        {results.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded-lg bg-slate-950/40 p-3">
            <div>
              <div className="text-slate-200">{r.title}</div>
              <div className="text-xs text-slate-400">score: {r.score}</div>
            </div>
            <button
              className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold hover:bg-indigo-500"
              onClick={async () => {
                // optimistic update
                setOptimisticLiked((prev) => new Set(prev).add(r.id));
                try {
                  const res = await fetch("/api/like", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ id: r.id })
                  });
                  if (!res.ok) throw new Error(`like failed: ${res.status}`);
                } catch {
                  // rollback
                  await sleep(1);
                  setOptimisticLiked((prev) => {
                    const next = new Set(prev);
                    next.delete(r.id);
                    return next;
                  });
                }
              }}
            >
              Like
            </button>
          </li>
        ))}
      </ul>

      <div className="text-xs text-slate-400">
        {pending ? "Updating results…" : "Idle"} • skeleton is shown only after 150ms.
      </div>
    </section>
  );
}

function Skeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-12 rounded-lg bg-slate-800/40 animate-pulse" />
      ))}
    </div>
  );
}

