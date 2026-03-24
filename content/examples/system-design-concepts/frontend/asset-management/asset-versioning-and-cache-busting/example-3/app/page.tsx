"use client";

import { useCallback, useState } from "react";

type FetchResult = {
  status: number;
  etag: string | null;
  bytes: number;
  bodyPreview: string;
};

async function fetchAsset(ifNoneMatch?: string): Promise<FetchResult> {
  const headers: Record<string, string> = {};
  if (ifNoneMatch) headers["If-None-Match"] = ifNoneMatch;

  const res = await fetch("/api/assets/mutable-asset.txt", { headers, cache: "no-store" });
  const etag = res.headers.get("etag");
  const text = res.status === 304 ? "" : await res.text();
  return {
    status: res.status,
    etag,
    bytes: new TextEncoder().encode(text).byteLength,
    bodyPreview: text ? text.slice(0, 120) : "(no body for 304)",
  };
}

export default function Page() {
  const [last, setLast] = useState<FetchResult | null>(null);
  const [etag, setEtag] = useState<string | null>(null);

  const doFetch = useCallback(async () => {
    const r = await fetchAsset();
    setLast(r);
    setEtag(r.etag);
  }, []);

  const doConditional = useCallback(async () => {
    const r = await fetchAsset(etag ?? undefined);
    setLast(r);
    setEtag(r.etag);
  }, [etag]);

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Conditional requests (ETag / 304)</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap gap-2">
          <button className="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-black" onClick={doFetch}>
            Fetch
          </button>
          <button
            className="rounded border border-white/10 bg-black/30 px-3 py-2 text-sm font-medium"
            onClick={doConditional}
            disabled={!etag}
            title={!etag ? "Fetch once to capture an ETag" : undefined}
          >
            Conditional fetch
          </button>
        </div>

        <div className="mt-4 text-sm">
          <div className="opacity-80">Last response</div>
          <div className="mt-2 grid gap-2 rounded bg-black/30 p-3">
            <div>
              Status: <code>{last?.status ?? "-"}</code>
            </div>
            <div>
              ETag: <code>{last?.etag ?? "-"}</code>
            </div>
            <div>
              Bytes: <code>{last?.bytes ?? "-"}</code>
            </div>
            <div className="break-words">
              Preview: <code>{last?.bodyPreview ?? "-"}</code>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm opacity-80">
        <h2 className="font-semibold text-white">Why this matters</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Mutable URLs can’t safely be cached with long TTLs + immutable.</li>
          <li>ETags enable bandwidth savings via 304 responses even when TTL is short.</li>
          <li>Prefer hashed filenames for deployable static assets; use ETags for stable URLs you can’t rename.</li>
        </ul>
      </section>
    </main>
  );
}

