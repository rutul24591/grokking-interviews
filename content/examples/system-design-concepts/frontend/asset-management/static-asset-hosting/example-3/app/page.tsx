"use client";

import { useCallback, useState } from "react";

type Result = { status: number; contentRange: string | null; bytes: number; preview: string };

async function fetchRange(range: string | null): Promise<Result> {
  const res = await fetch("http://localhost:4030/asset.bin", {
    headers: range ? { Range: range } : undefined,
    cache: "no-store",
  });
  const buf = await res.arrayBuffer();
  const text = new TextDecoder().decode(buf.slice(0, 120));
  return {
    status: res.status,
    contentRange: res.headers.get("content-range"),
    bytes: buf.byteLength,
    preview: text,
  };
}

export default function Page() {
  const [last, setLast] = useState<Result | null>(null);

  const full = useCallback(async () => setLast(await fetchRange(null)), []);
  const first = useCallback(async () => setLast(await fetchRange("bytes=0-99")), []);
  const mid = useCallback(async () => setLast(await fetchRange("bytes=1000-1099")), []);

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Range requests</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap gap-2">
          <button className="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-black" onClick={first}>
            Fetch bytes=0-99
          </button>
          <button className="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-black" onClick={mid}>
            Fetch bytes=1000-1099
          </button>
          <button className="rounded border border-white/10 bg-black/30 px-3 py-2 text-sm font-medium" onClick={full}>
            Fetch full
          </button>
        </div>

        <div className="mt-4 overflow-auto rounded bg-black/30 p-3 text-xs">
          <code>{last ? JSON.stringify(last, null, 2) : "No fetch yet"}</code>
        </div>
      </section>
    </main>
  );
}

