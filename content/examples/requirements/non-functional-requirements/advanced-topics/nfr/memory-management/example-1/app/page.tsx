"use client";

import { useEffect, useMemo, useState } from "react";

type Config = {
  mode: "none" | "leaky" | "lru";
  leakSize: number;
  lruSize: number;
  lruBytes: number;
};

type Memory = {
  ts: string;
  memory: { rss: number; heapTotal: number; heapUsed: number; external: number; arrayBuffers: number };
  store: {
    mode: "none" | "leaky" | "lru";
    requests: number;
    bytesAllocatedTotal: number;
    leakEntries: number;
    lruEntries: number;
    lruBytes: number;
  };
};

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

function fmtBytes(n: number) {
  const u = ["B", "KB", "MB", "GB"];
  let x = n;
  let i = 0;
  while (x >= 1024 && i < u.length - 1) {
    x /= 1024;
    i++;
  }
  return `${x.toFixed(i === 0 ? 0 : 1)} ${u[i]}`;
}

export default function Page() {
  const [config, setConfig] = useState<Config | null>(null);
  const [mem, setMem] = useState<Memory | null>(null);
  const [error, setError] = useState("");
  const [kb, setKb] = useState(64);
  const [key, setKey] = useState("hot-key");

  async function refresh() {
    try {
      const [c, m] = await Promise.all([json<Config>("/api/config"), json<Memory>("/api/memory")]);
      setConfig(c);
      setMem(m);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function setMode(mode: Config["mode"]) {
    await json("/api/config", { method: "POST", body: JSON.stringify({ mode }) });
    await refresh();
  }

  async function doWork() {
    await json(`/api/work?key=${encodeURIComponent(key)}&kb=${kb}`, { method: "POST" });
    await refresh();
  }

  async function reset() {
    await json("/api/reset", { method: "POST" });
    await refresh();
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 1500);
    return () => clearInterval(t);
  }, []);

  const status = useMemo(() => {
    if (!mem) return null;
    return [
      { k: "rss", v: fmtBytes(mem.memory.rss) },
      { k: "heapUsed", v: fmtBytes(mem.memory.heapUsed) },
      { k: "external", v: fmtBytes(mem.memory.external) },
      { k: "alloc(total)", v: fmtBytes(mem.store.bytesAllocatedTotal) },
    ];
  }, [mem]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Memory Lab</h1>
        <p className="mt-2 text-slate-300">
          Compare leak vs bounded cache vs no retention. Watch memory stats change under load.
        </p>
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-200">
          <div className="font-semibold">Agent</div>
          <pre className="mt-2 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">{`pnpm agent:run -- --baseUrl http://localhost:3000 --mode leaky --requests 200`}</pre>
        </div>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Mode</h2>
          <p className="mt-1 text-sm text-slate-300">
            Pick a retention strategy. “Leaky” stores every allocation forever.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(["none", "lru", "leaky"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={
                  "rounded px-3 py-2 text-sm font-semibold " +
                  (config?.mode === m ? "bg-emerald-600 hover:bg-emerald-500" : "bg-slate-800 hover:bg-slate-700")
                }
              >
                {m}
              </button>
            ))}
            <button
              type="button"
              className="ml-auto rounded bg-amber-700 px-3 py-2 text-sm font-semibold hover:bg-amber-600"
              onClick={reset}
            >
              Reset
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Key</span>
              <input
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">KB alloc</span>
              <input
                type="number"
                min={1}
                max={512}
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                value={kb}
                onChange={(e) => setKb(Number(e.target.value))}
              />
            </label>
          </div>

          <button
            type="button"
            className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500"
            onClick={doWork}
          >
            Allocate once
          </button>

          <div className="mt-6 rounded border border-slate-800 bg-black/30 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">Store</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded bg-black/40 px-3 py-2">
                leakEntries: <span className="font-semibold">{mem?.store.leakEntries ?? 0}</span>
              </div>
              <div className="rounded bg-black/40 px-3 py-2">
                lruEntries: <span className="font-semibold">{mem?.store.lruEntries ?? 0}</span>
              </div>
              <div className="rounded bg-black/40 px-3 py-2">
                lruBytes: <span className="font-semibold">{fmtBytes(mem?.store.lruBytes ?? 0)}</span>
              </div>
              <div className="rounded bg-black/40 px-3 py-2">
                requests: <span className="font-semibold">{mem?.store.requests ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Memory</h2>
          <p className="mt-1 text-sm text-slate-300">
            Watch RSS/heap/external. Leaks often show up in RSS/external even if heap looks stable.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {status?.map((s) => (
              <div key={s.k} className="rounded border border-slate-800 bg-black/30 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-300">{s.k}</div>
                <div className="mt-1 text-xl font-bold">{s.v}</div>
              </div>
            ))}
          </div>
          <pre className="mt-6 overflow-auto rounded border border-slate-800 bg-black/40 p-4 text-xs text-slate-100">
{JSON.stringify(mem, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}

