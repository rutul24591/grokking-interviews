"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchJsonWithRetry } from "@/lib/fetchWithRetry";

type SearchItem = { label: string; score: number };
type SearchResponse =
  | { q: string; items: SearchItem[]; jitterMs: number }
  | { error: string; jitterMs: number };

type CacheEntry = { expiresAt: number; value: SearchResponse };

export default function Page() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [res, setRes] = useState<SearchResponse | null>(null);

  const cache = useRef(new Map<string, CacheEntry>());
  const seq = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const normalized = useMemo(() => q.trim().toLowerCase(), [q]);

  useEffect(() => {
    setError(null);
    if (!normalized) {
      setRes(null);
      setStatus("idle");
      abortRef.current?.abort();
      return;
    }

    const cached = cache.current.get(normalized);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
      setRes(cached.value);
      setStatus("idle");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const mySeq = ++seq.current;
    setStatus("loading");

    const url = `/api/search?q=${encodeURIComponent(normalized)}`;
    void (async () => {
      try {
        const data = await fetchJsonWithRetry<SearchResponse>(url, {
          signal: controller.signal,
          maxAttempts: 3,
          baseDelayMs: 120,
        });

        // “Latest request wins” guard: ignore out-of-order completions.
        if (mySeq !== seq.current) return;
        cache.current.set(normalized, { value: data, expiresAt: Date.now() + 15_000 });
        setRes(data);
        setStatus("idle");
      } catch (e) {
        if (controller.signal.aborted) return;
        if (mySeq !== seq.current) return;
        setStatus("error");
        setError(e instanceof Error ? e.message : "Request failed");
      }
    })();
  }, [normalized]);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">CSR Typeahead (Races)</h1>
        <p className="mt-1 text-sm text-slate-300">
          Type quickly to reproduce out-of-order responses; this example prevents stale UI updates.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Search
          </label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try: re, react, request..."
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-indigo-400"
          />
          <div className="mt-2 text-xs text-slate-500">
            Correctness tricks: cancellation + sequence guard + bounded retries.
          </div>

          {status === "loading" ? (
            <div className="mt-4 text-sm text-slate-300">Loading suggestions…</div>
          ) : null}

          {status === "error" ? (
            <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {res && "error" in res ? (
            <div className="mt-4 rounded-xl border border-amber-900/50 bg-amber-950/30 p-3 text-sm text-amber-100">
              API says: {res.error} (jitter: {res.jitterMs}ms)
            </div>
          ) : null}

          {res && !("error" in res) ? (
            <div className="mt-4">
              <div className="text-xs text-slate-500">Server jitter: {res.jitterMs}ms</div>
              <ul className="mt-3 space-y-2">
                {res.items.map((it) => (
                  <li
                    key={it.label}
                    className="rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2 text-sm text-slate-100"
                  >
                    {it.label}
                  </li>
                ))}
                {!res.items.length ? (
                  <li className="text-sm text-slate-400">No matches.</li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

