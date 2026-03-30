"use client";

import { useEffect, useMemo, useState } from "react";
import { registerServiceWorker, requestCacheStats } from "../lib/sw/swClient";

type SwStatus =
  | { status: "unsupported" }
  | { status: "idle" }
  | { status: "registering" }
  | { status: "ready"; scope: string }
  | { status: "error"; message: string };

type CacheStats = { cacheNames: string[]; totalEntries: number } | null;

export function Client() {
  const [status, setStatus] = useState<SwStatus>({ status: "idle" });
  const [cacheStats, setCacheStats] = useState<CacheStats>(null);
  const [apiResult, setApiResult] = useState<{ now: string; nonce: string; swSource?: string } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const canUseSw = useMemo(() => status.status === "ready", [status.status]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof window === "undefined") return;
      if (!("serviceWorker" in navigator)) {
        setStatus({ status: "unsupported" });
        return;
      }
      setStatus({ status: "registering" });
      try {
        const reg = await registerServiceWorker("/sw.js");
        if (cancelled) return;
        setStatus({ status: "ready", scope: reg.scope });
      } catch (e) {
        if (cancelled) return;
        setStatus({ status: "error", message: e instanceof Error ? e.message : String(e) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshCacheStats() {
    setCacheStats(await requestCacheStats());
  }

  async function callApi() {
    setApiError(null);
    setApiResult(null);
    try {
      const res = await fetch("/api/time", { cache: "no-store" });
      const swSource = res.headers.get("x-sw-source") ?? undefined;
      const json = (await res.json()) as { now: string; nonce: string };
      setApiResult({ ...json, swSource });
    } catch (e) {
      setApiError(e instanceof Error ? e.message : String(e));
    }
  }

  async function clearCaches() {
    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage({ type: "CLEAR_CACHES" });
    await new Promise((r) => setTimeout(r, 250));
    await refreshCacheStats();
  }

  async function skipWaiting() {
    const reg = await navigator.serviceWorker.ready;
    reg.waiting?.postMessage({ type: "SKIP_WAITING" });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm">
          SW: <span className="font-semibold">{status.status}</span>
        </span>
        {status.status === "ready" ? (
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm">
            scope: <code>{status.scope}</code>
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canUseSw}
          onClick={refreshCacheStats}
        >
          Get cache stats
        </button>
        <button
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canUseSw}
          onClick={clearCaches}
        >
          Clear caches
        </button>
        <button
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canUseSw}
          onClick={skipWaiting}
        >
          Skip waiting
        </button>
        <a
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          href="/offline"
        >
          Open /offline
        </a>
      </div>

      {cacheStats ? (
        <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/80">
          <div>
            caches: <span className="font-semibold">{cacheStats.cacheNames.length}</span>
          </div>
          <div>
            total entries: <span className="font-semibold">{cacheStats.totalEntries}</span>
          </div>
          <div className="mt-2 space-y-1">
            {cacheStats.cacheNames.map((n) => (
              <div key={n}>
                - <code>{n}</code>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
            onClick={callApi}
          >
            Call /api/time
          </button>
          <span className="text-sm text-white/70">Check header <code>x-sw-source</code> to see cache vs network.</span>
        </div>
        {apiResult ? (
          <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/20 p-4 text-xs text-white/80">
{JSON.stringify(apiResult, null, 2)}
          </pre>
        ) : null}
        {apiError ? <p className="text-sm text-red-200">API error: <code>{apiError}</code></p> : null}
      </div>

      {status.status === "error" ? (
        <p className="text-sm text-red-200">
          SW error: <code>{status.message}</code>
        </p>
      ) : null}
    </div>
  );
}

