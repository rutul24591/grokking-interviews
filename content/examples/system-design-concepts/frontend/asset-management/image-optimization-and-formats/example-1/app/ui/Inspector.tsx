"use client";

import { useMemo, useState } from "react";
import { imgUrl, type ImgFormat } from "@/lib/imageUrl";

type Row = { fmt: ImgFormat; contentType: string | null; cacheControl: string | null; bytes: number; status: number };

async function inspect(fmt: ImgFormat): Promise<Row> {
  const url = imgUrl({ w: 960, h: 240, fmt, v: "demo-v1" });
  const res = await fetch(url, { cache: "no-store" });
  const buf = await res.arrayBuffer();
  return {
    fmt,
    status: res.status,
    contentType: res.headers.get("content-type"),
    cacheControl: res.headers.get("cache-control"),
    bytes: buf.byteLength,
  };
}

export default function Inspector() {
  const [rows, setRows] = useState<Row[]>([]);
  const formats: ImgFormat[] = useMemo(() => ["avif", "webp", "png"], []);

  return (
    <section className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h2 className="text-lg font-semibold">Inspect API responses</h2>
      <p className="mt-2 text-sm opacity-80">
        Fetches one image per format and prints response headers. This models what a CDN/browser would cache.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {formats.map((f) => (
          <button
            key={f}
            className="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-black"
            onClick={async () => setRows((r) => [...r, await inspect(f)])}
          >
            Inspect {f}
          </button>
        ))}
        <button className="rounded border border-white/10 bg-black/30 px-3 py-2 text-sm font-medium" onClick={() => setRows([])}>
          Clear
        </button>
      </div>
      <div className="mt-4 overflow-auto rounded bg-black/30 p-3 text-xs">
        <code>{rows.length ? JSON.stringify(rows, null, 2) : "No inspections yet"}</code>
      </div>
    </section>
  );
}

