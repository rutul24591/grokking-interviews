"use client";

import { useState } from "react";

type FeedPayload = {
  etag: string;
  generatedAt: string;
  items: string[];
};

type RefreshResult =
  | { status: 200; etag: string; payload: FeedPayload }
  | { status: 304; etag: string };

export function ConditionalRefreshClient() {
  const [etag, setEtag] = useState<string | null>(null);
  const [payload, setPayload] = useState<FeedPayload | null>(null);
  const [lastResult, setLastResult] = useState<RefreshResult | null>(null);

  async function refresh(forceVersion?: string) {
    const url = new URL("/api/conditional-feed", window.location.origin);
    if (forceVersion) url.searchParams.set("version", forceVersion);

    const res = await fetch(url.toString(), {
      headers: etag ? { "If-None-Match": etag } : {},
      cache: "no-store"
    });

    const nextEtag = res.headers.get("etag") || etag || "";

    if (res.status === 304) {
      const result: RefreshResult = { status: 304, etag: nextEtag };
      setLastResult(result);
      return;
    }

    const json = (await res.json()) as FeedPayload;
    setEtag(nextEtag);
    setPayload(json);
    setLastResult({ status: 200, etag: nextEtag, payload: json });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          onClick={() => void refresh()}
        >
          Refresh feed
        </button>
        <button
          type="button"
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          onClick={() => void refresh("v2")}
        >
          Simulate new version
        </button>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm">
          cached etag: <span className="font-semibold">{etag ?? "none"}</span>
        </span>
      </div>

      {lastResult ? (
        <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/20 p-4 text-xs text-white/80">
{JSON.stringify(lastResult, null, 2)}
        </pre>
      ) : null}

      {payload ? (
        <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/80">
          <div>
            generatedAt: <span className="font-semibold">{payload.generatedAt}</span>
          </div>
          <div className="mt-3 space-y-2">
            {payload.items.map((item) => (
              <div key={item} className="rounded-md border border-white/10 bg-white/5 p-3">
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/70">
        <div className="font-semibold text-white/80">Expected behavior</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>First refresh returns <code>200</code> with payload and an <code>ETag</code>.</li>
          <li>Subsequent refreshes often return <code>304</code>, meaning “content unchanged”.</li>
          <li>When content changes, the server emits a new <code>ETag</code> and returns the new payload.</li>
        </ul>
      </div>
    </div>
  );
}

