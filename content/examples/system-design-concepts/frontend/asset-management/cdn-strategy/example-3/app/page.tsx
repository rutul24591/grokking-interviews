"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { getPublicEnv } from "@/lib/env";
import { closeBreaker, readBreakerState } from "@/lib/circuitBreaker";
import { fetchWithCdnFailover, type FailoverResult } from "@/lib/fetchWithFailover";

export default function Page() {
  const env = getPublicEnv();
  const [last, setLast] = useState<FailoverResult | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const breaker = useMemo(() => readBreakerState(now), [now]);
  const openForMs = Math.max(0, breaker.openUntilMs - now);

  const path = "/assets/logo.svg";
  const primaryUrl = `${env.NEXT_PUBLIC_PRIMARY_CDN}${path}`;
  const secondaryUrl = `${env.NEXT_PUBLIC_SECONDARY_CDN}${path}`;

  const run = useCallback(async () => {
    const r = await fetchWithCdnFailover({
      primary: env.NEXT_PUBLIC_PRIMARY_CDN,
      secondary: env.NEXT_PUBLIC_SECONDARY_CDN,
      path,
      breakerOpenMs: 20_000,
    });
    setLast(r);
    setNow(Date.now());
  }, [env.NEXT_PUBLIC_PRIMARY_CDN, env.NEXT_PUBLIC_SECONDARY_CDN]);

  const reset = useCallback(() => {
    closeBreaker();
    setNow(Date.now());
    setLast(null);
  }, []);

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Multi-CDN failover</h1>
        <p className="text-sm opacity-80">
          Primary: <code>{env.NEXT_PUBLIC_PRIMARY_CDN}</code> · Secondary: <code>{env.NEXT_PUBLIC_SECONDARY_CDN}</code>
        </p>
      </header>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button className="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-black" onClick={run}>
            Fetch (with failover)
          </button>
          <button className="rounded border border-white/10 bg-black/30 px-3 py-2 text-sm font-medium" onClick={reset}>
            Reset breaker
          </button>
          <span className="text-sm opacity-80">
            Breaker: <code>{openForMs > 0 ? `OPEN (${Math.ceil(openForMs / 1000)}s)` : "CLOSED"}</code>
          </span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-md bg-black/30 p-3">
            <div className="text-xs uppercase opacity-70">Primary URL</div>
            <div className="mt-2 break-all text-xs">
              <code>{primaryUrl}</code>
            </div>
            <div className="mt-3 rounded bg-white p-2">
              <Image src={primaryUrl} alt="Primary CDN asset" width={240} height={96} />
            </div>
          </div>

          <div className="rounded-md bg-black/30 p-3">
            <div className="text-xs uppercase opacity-70">Secondary URL</div>
            <div className="mt-2 break-all text-xs">
              <code>{secondaryUrl}</code>
            </div>
            <div className="mt-3 rounded bg-white p-2">
              <Image src={secondaryUrl} alt="Secondary CDN asset" width={240} height={96} />
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <div className="opacity-80">Last fetch result</div>
          <div className="mt-2 rounded bg-black/30 p-3">
            <code>{last ? JSON.stringify(last, null, 2) : "No fetch yet"}</code>
          </div>
        </div>
      </section>
    </main>
  );
}

