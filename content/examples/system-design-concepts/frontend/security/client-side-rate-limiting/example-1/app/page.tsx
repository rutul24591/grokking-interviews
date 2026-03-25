"use client";

import { useEffect, useMemo, useState } from "react";
import { TokenBucket } from "../lib/tokenBucket";

export default function Page() {
  const bucket = useMemo(() => new TokenBucket(5, 5), []);
  const [stats, setStats] = useState(bucket.snapshot());
  const [allowed, setAllowed] = useState(0);
  const [blocked, setBlocked] = useState(0);
  const [last, setLast] = useState<any>(null);

  useEffect(() => {
    const t = setInterval(() => setStats(bucket.snapshot()), 200);
    return () => clearInterval(t);
  }, [bucket]);

  async function callApi() {
    const res = await fetch("/api/ping", { cache: "no-store" });
    setLast(await res.json());
  }

  async function spam() {
    for (let i = 0; i < 30; i += 1) {
      if (bucket.tryTake(1)) {
        setAllowed((x) => x + 1);
        // Fire-and-forget; in real apps you would also debounce in-flight requests.
        void callApi();
      } else {
        setBlocked((x) => x + 1);
      }
    }
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Client-side rate limiting (token bucket)</h1>
        <p className="text-sm text-white/70">
          Bucket: capacity <code>{stats.capacity}</code>, refill <code>{stats.refillPerSec}/sec</code>.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={spam}
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
          >
            Spam API (30 attempts)
          </button>
          <div className="text-sm text-white/70">
            tokens now: <code>{stats.tokens.toFixed(2)}</code>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-md bg-black/20 p-3">
            <div className="text-xs text-white/60">Allowed</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{allowed}</div>
          </div>
          <div className="rounded-md bg-black/20 p-3">
            <div className="text-xs text-white/60">Blocked</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{blocked}</div>
          </div>
          <div className="rounded-md bg-black/20 p-3">
            <div className="text-xs text-white/60">Last server response</div>
            <pre className="mt-2 max-h-24 overflow-auto text-xs">{last ? JSON.stringify(last, null, 2) : "—"}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}

