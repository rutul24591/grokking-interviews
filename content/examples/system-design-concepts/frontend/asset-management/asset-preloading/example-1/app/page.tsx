"use client";

import { useEffect, useMemo, useState } from "react";

type FetchResult = { status: number; etag: string | null; cacheControl: string | null; bytes: number };

async function fetchHero(ifNoneMatch?: string | null): Promise<FetchResult> {
  const res = await fetch("/api/assets/hero?variant=hero&delayMs=250", {
    headers: ifNoneMatch ? { "if-none-match": ifNoneMatch } : undefined,
  });
  const buf = await res.arrayBuffer();
  return {
    status: res.status,
    etag: res.headers.get("etag"),
    cacheControl: res.headers.get("cache-control"),
    bytes: buf.byteLength,
  };
}

export default function Page() {
  const [first, setFirst] = useState<FetchResult | null>(null);
  const [second, setSecond] = useState<FetchResult | null>(null);
  const [busy, setBusy] = useState(false);

  const imgSrc = useMemo(() => "/api/assets/hero?variant=hero&delayMs=250", []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      try {
        const r1 = await fetchHero();
        if (cancelled) return;
        setFirst(r1);
        const r2 = await fetchHero(r1.etag);
        if (cancelled) return;
        setSecond(r2);
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Asset preloading — do it surgically</h1>
        <p className="text-sm text-slate-300">
          Preloading can improve LCP when used for above-the-fold resources. Overuse can waste bandwidth and delay more
          important work.
        </p>
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-950/30 p-4 space-y-3">
        <div className="text-sm font-medium text-slate-200">Hero (preloaded)</div>
        <img
          src={imgSrc}
          alt="Hero"
          className="w-full rounded-lg border border-slate-800 bg-black"
          style={{ height: 220, objectFit: "cover" }}
        />
        <p className="text-xs text-slate-400">
          The head includes <code>rel=preload</code> for this resource. The server returns strong caching headers.
        </p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">Caching behavior (ETag / 304)</div>
          <div className="text-xs text-slate-500">{busy ? "loading…" : "ready"}</div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Fetch #1</div>
            <pre className="mt-2 text-xs text-slate-200">{JSON.stringify(first, null, 2)}</pre>
          </div>
          <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Fetch #2 (If-None-Match)</div>
            <pre className="mt-2 text-xs text-slate-200">{JSON.stringify(second, null, 2)}</pre>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          In production you usually rely on the browser cache, but ETags matter for CDNs and intermediate caches.
        </p>
      </section>
    </main>
  );
}

