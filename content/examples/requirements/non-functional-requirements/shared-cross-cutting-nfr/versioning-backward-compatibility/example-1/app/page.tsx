"use client";

import { useEffect, useState } from "react";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export default function Page() {
  const [version, setVersion] = useState<"v1" | "v2">("v1");
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("Ada");
  const [error, setError] = useState("");

  async function refresh() {
    try {
      const p = await json(`/api/${version}/profile`);
      setProfile(p);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  async function patch() {
    const body =
      version === "v1"
        ? { name }
        : { displayName: name, locale: "en" };
    await json(`/api/${version}/profile`, { method: "PATCH", body: JSON.stringify(body) });
    await refresh();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Versioning & Backward Compatibility</h1>
        <p className="mt-2 text-slate-300">Switch API versions and see compatibility shims in action.</p>
        {error ? <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div> : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Controls</h2>
          <div className="mt-4 flex gap-2">
            {(["v1", "v2"] as const).map((v) => (
              <button
                key={v}
                className={
                  "rounded px-3 py-2 text-sm font-semibold " +
                  (version === v ? "bg-emerald-600 hover:bg-emerald-500" : "bg-slate-800 hover:bg-slate-700")
                }
                onClick={() => setVersion(v)}
              >
                {v}
              </button>
            ))}
          </div>
          <label className="mt-4 grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              {version === "v1" ? "name" : "displayName"}
            </span>
            <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <div className="mt-4 flex gap-2">
            <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={patch}>
              PATCH
            </button>
            <button className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700" onClick={refresh}>
              Refresh
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Response</h2>
          <pre className="mt-4 overflow-auto rounded border border-slate-800 bg-black/40 p-4 text-xs text-slate-100">
{JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}

