"use client";

import { useMemo, useState } from "react";
import { recommendedCacheControl, type Strategy, urlWithFilenameHash, urlWithQuery } from "@/lib/bust";

export default function Page() {
  const [strategy, setStrategy] = useState<Strategy>("filename");
  const [version, setVersion] = useState("2026.03.24");
  const [hash, setHash] = useState("7a3d1c2f");

  const url = useMemo(() => {
    const base = "/assets/logo.svg";
    return strategy === "filename" ? urlWithFilenameHash(base, hash) : urlWithQuery(base, version);
  }, [strategy, version, hash]);

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Query params vs filename hashing</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm">
            <span className="opacity-80">Strategy</span>
            <select
              className="ml-2 rounded border border-white/10 bg-black/30 px-2 py-1"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as Strategy)}
            >
              <option value="filename">Filename hashing</option>
              <option value="query">Query-string busting</option>
            </select>
          </label>

          {strategy === "query" ? (
            <label className="text-sm">
              <span className="opacity-80">Version</span>
              <input
                className="ml-2 rounded border border-white/10 bg-black/30 px-2 py-1"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </label>
          ) : (
            <label className="text-sm">
              <span className="opacity-80">Hash</span>
              <input
                className="ml-2 rounded border border-white/10 bg-black/30 px-2 py-1"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
              />
            </label>
          )}
        </div>

        <div className="mt-4 text-sm">
          <div className="opacity-80">Computed URL</div>
          <div className="mt-1 break-all">
            <code>{url}</code>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <div className="opacity-80">Recommended Cache-Control</div>
          <div className="mt-1">
            <code>{recommendedCacheControl(strategy)}</code>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm opacity-80">
        <h2 className="font-semibold text-white">Rule of thumb</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Use filename hashing when you want long TTLs, CDNs, and safe rollbacks.</li>
          <li>Use query params as a retrofit, but keep TTLs short and avoid relying on immutable caching.</li>
        </ul>
      </section>
    </main>
  );
}

