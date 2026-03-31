"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Suggestion = {
  id: string;
  title: string;
  kind: string;
  latencyMs: number;
};

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, value]);

  return debouncedValue;
}

function useThrottledCallback<T extends unknown[]>(callback: (...args: T) => void, intervalMs: number) {
  const callbackRef = useRef(callback);
  const lastCallRef = useRef(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return (...args: T) => {
    const now = Date.now();
    if (now - lastCallRef.current < intervalMs) return;
    lastCallRef.current = now;
    callbackRef.current(...args);
  };
}

export default function SearchWorkbench() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN_API?.trim() || "http://localhost:4150";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [requestCount, setRequestCount] = useState(0);
  const debouncedQuery = useDebouncedValue(query, 300);
  const abortRef = useRef<AbortController | null>(null);

  const throttledAnalytics = useThrottledCallback((value: string) => {
    void fetch(`${origin}/telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryLength: value.length, kind: "typing" }),
    });
  }, 1000);

  useEffect(() => {
    throttledAnalytics(query);
  }, [query, throttledAnalytics]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setStatus("idle");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");

    fetch(`${origin}/search?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()) as Suggestion[];
      })
      .then((payload) => {
        setRequestCount((count) => count + 1);
        setResults(payload);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });

    return () => controller.abort();
  }, [debouncedQuery, origin]);

  const summary = useMemo(
    () => ({
      keystrokes: query.length,
      dispatchedSearches: requestCount,
      droppedRequests: Math.max(query.length - requestCount, 0),
    }),
    [query.length, requestCount],
  );

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[1.8rem] border border-white/70 bg-white/80 p-7 shadow-[0_24px_70px_rgba(90,54,11,0.08)]">
        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500" htmlFor="query">
          Search articles
        </label>
        <input
          id="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try: hydration, caching, consistency"
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0"
        />

        <div className="mt-4 flex gap-3 text-xs text-slate-500">
          <span className="rounded-full border border-slate-200 px-3 py-1">Debounce: 300ms</span>
          <span className="rounded-full border border-slate-200 px-3 py-1">Telemetry throttle: 1s</span>
          <span className="rounded-full border border-slate-200 px-3 py-1">Abort stale requests</span>
        </div>

        <div className="mt-6 space-y-3">
          {status === "idle" ? <div className="text-sm text-slate-500">Start typing to dispatch debounced search.</div> : null}
          {status === "loading" ? <div className="text-sm text-slate-500">Waiting for the quiet period, then fetching.</div> : null}
          {status === "error" ? <div className="text-sm text-rose-700">Search failed. The input loop still stays responsive.</div> : null}
          {status === "ready"
            ? results.map((result) => (
                <article key={result.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{result.title}</div>
                      <div className="mt-1 text-xs leading-6 text-slate-600">{result.kind}</div>
                    </div>
                    <div className="text-xs text-slate-500">{result.latencyMs}ms backend latency</div>
                  </div>
                </article>
              ))
            : null}
        </div>
      </div>

      <aside className="rounded-[1.8rem] border border-white/70 bg-slate-950 p-7 text-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <h2 className="text-lg font-semibold">Observed behavior</h2>
        <dl className="mt-5 space-y-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-400">Keystrokes</dt>
            <dd>{summary.keystrokes}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-400">Network searches</dt>
            <dd>{summary.dispatchedSearches}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-400">Requests avoided</dt>
            <dd>{summary.droppedRequests}</dd>
          </div>
        </dl>

        <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
          <li>Use debounce for server-bound work such as autocomplete or autosave.</li>
          <li>Use throttle for periodic reporting where every event is not needed.</li>
          <li>Abort stale fetches so late responses cannot overwrite newer input state.</li>
        </ul>
      </aside>
    </section>
  );
}
