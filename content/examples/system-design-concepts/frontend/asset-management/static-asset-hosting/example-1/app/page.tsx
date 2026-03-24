"use client";

import { useCallback, useState } from "react";

type Signed = { url: string; expires: number };

export default function Page() {
  const [signed, setSigned] = useState<Signed | null>(null);
  const [privateJson, setPrivateJson] = useState<object | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const signUrl = useCallback(async () => {
    setErr(null);
    setPrivateJson(null);
    const res = await fetch("/api/sign?name=report.json", { cache: "no-store" });
    const j = (await res.json()) as Signed;
    setSigned(j);
  }, []);

  const fetchPrivate = useCallback(async () => {
    if (!signed) return;
    setErr(null);
    const res = await fetch(signed.url, { cache: "no-store" });
    if (!res.ok) {
      setErr(`Asset server returned ${res.status}`);
      return;
    }
    setPrivateJson((await res.json()) as object);
  }, [signed]);

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Static asset hosting</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">Public asset</h2>
        <p className="mt-2 text-sm opacity-80">
          Public assets can be cached aggressively (especially when versioned). This example serves a public SVG from a separate asset server.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mt-3 h-24 rounded bg-white p-2" src="http://localhost:4020/public/logo.svg" alt="Public logo" />
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">Private asset (signed URL)</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-black" onClick={signUrl}>
            Generate signed URL
          </button>
          <button
            className="rounded border border-white/10 bg-black/30 px-3 py-2 text-sm font-medium"
            onClick={fetchPrivate}
            disabled={!signed}
          >
            Fetch private asset
          </button>
        </div>

        <div className="mt-4 text-sm">
          <div className="opacity-80">Signed URL</div>
          <div className="mt-2 break-all rounded bg-black/30 p-3">
            <code>{signed?.url ?? "-"}</code>
          </div>
        </div>

        {err ? (
          <div className="mt-4 rounded border border-red-500/30 bg-red-500/10 p-3 text-sm">{err}</div>
        ) : null}

        <div className="mt-4 text-sm">
          <div className="opacity-80">Private JSON</div>
          <div className="mt-2 overflow-auto rounded bg-black/30 p-3 text-xs">
            <code>{privateJson ? JSON.stringify(privateJson, null, 2) : "-"}</code>
          </div>
        </div>
      </section>
    </main>
  );
}

