"use client";

import { useState } from "react";

type Result = { accept: string; status: number; contentType: string | null; vary: string | null; bytes: number };

async function fetchWithAccept(accept: string): Promise<Result> {
  const res = await fetch("/api/image-negotiated?w=960&h=240", {
    headers: { Accept: accept },
    cache: "no-store",
  });
  const buf = await res.arrayBuffer();
  return {
    accept,
    status: res.status,
    contentType: res.headers.get("content-type"),
    vary: res.headers.get("vary"),
    bytes: buf.byteLength,
  };
}

export default function Page() {
  const [rows, setRows] = useState<Result[]>([]);

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Accept-based image negotiation</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-black"
            onClick={async () => setRows((r) => [...r, await fetchWithAccept("image/avif,image/webp,image/*,*/*;q=0.8")])}
          >
            Fetch (AVIF preferred)
          </button>
          <button
            className="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-black"
            onClick={async () => setRows((r) => [...r, await fetchWithAccept("image/webp,image/*,*/*;q=0.8")])}
          >
            Fetch (WebP only)
          </button>
          <button
            className="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-black"
            onClick={async () => setRows((r) => [...r, await fetchWithAccept("image/png,image/*,*/*;q=0.8")])}
          >
            Fetch (PNG)
          </button>
          <button className="rounded border border-white/10 bg-black/30 px-3 py-2 text-sm font-medium" onClick={() => setRows([])}>
            Clear
          </button>
        </div>

        <div className="mt-4 overflow-auto rounded bg-black/30 p-3 text-xs">
          <code>{rows.length ? JSON.stringify(rows, null, 2) : "No fetches yet"}</code>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm opacity-80">
        <h2 className="font-semibold text-white">CDN requirement</h2>
        <p className="mt-2">
          If you negotiate by <code>Accept</code>, set <code>Vary: Accept</code> so a CDN doesn’t serve AVIF to clients that can’t decode it.
        </p>
      </section>
    </main>
  );
}

