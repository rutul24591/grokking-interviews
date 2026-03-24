"use client";

import { useMemo, useState } from "react";
import { computeCacheKey } from "@/lib/cacheKey";

export default function Page() {
  const [url, setUrl] = useState("/assets/hero.svg?utm_source=twitter&q=shoes&sort=price&fbclid=abc");
  const [accept, setAccept] = useState("image/avif,image/webp,image/*,*/*;q=0.8");
  const [acceptEncoding, setAcceptEncoding] = useState("br,gzip");

  const cacheKey = useMemo(
    () =>
      computeCacheKey({
        url,
        headers: {
          accept,
          "accept-encoding": acceptEncoding,
        },
      }),
    [url, accept, acceptEncoding],
  );

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">CDN cache keys</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-sm md:col-span-3">
            <span className="opacity-80">URL</span>
            <input
              className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="opacity-80">Accept</span>
            <input
              className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2"
              value={accept}
              onChange={(e) => setAccept(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="opacity-80">Accept-Encoding</span>
            <input
              className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2"
              value={acceptEncoding}
              onChange={(e) => setAcceptEncoding(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-4 text-sm">
          <div className="opacity-80">Computed cache key</div>
          <div className="mt-2 break-all rounded bg-black/30 p-3">
            <code>{cacheKey}</code>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm opacity-80">
        <h2 className="font-semibold text-white">Key takeaways</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Strip analytics params (`utm_*`) to avoid fragmenting cache.</li>
          <li>Normalize query param ordering (CDNs differ).</li>
          <li>Vary by only necessary headers; “Vary: *” destroys cacheability.</li>
        </ul>
      </section>
    </main>
  );
}

