"use client";

import { useEffect, useMemo, useState } from "react";

type Ref = { key: string; size: number; updatedAt: number; etag: string };

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export default function Page() {
  const [provider, setProvider] = useState<"local" | "s3mock">("local");
  const [caps, setCaps] = useState<{ presignedGet: boolean; multipartUpload: boolean } | null>(null);
  const [objects, setObjects] = useState<Ref[]>([]);
  const [key, setKey] = useState("docs/runbook.txt");
  const [value, setValue] = useState("Hello from a portable object store.\n");
  const [selected, setSelected] = useState<{ ref: Ref; value: string } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const r = await json<{
      provider: "local" | "s3mock";
      capabilities: { presignedGet: boolean; multipartUpload: boolean };
      objects: Ref[];
    }>("/api/objects");
    setProvider(r.provider);
    setCaps(r.capabilities);
    setObjects(r.objects);
  }

  async function createObject() {
    setBusy(true);
    setError("");
    try {
      await json("/api/objects", { method: "POST", body: JSON.stringify({ key, value }) });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function openObject(k: string) {
    setBusy(true);
    setError("");
    try {
      const r = await json<{ ref: Ref; value: string }>(`/api/objects/${encodeURIComponent(k)}`);
      setSelected({ ref: r.ref, value: r.value });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function deleteObject(k: string) {
    setBusy(true);
    setError("");
    try {
      await json(`/api/objects/${encodeURIComponent(k)}`, { method: "DELETE" });
      setSelected(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  const posture = useMemo(
    () => [
      { label: "Adapter boundary", value: "Domain code depends on ObjectStore, not a vendor SDK" },
      { label: "S3-compatible option", value: "Mock S3 API simulates a portable protocol surface" },
      { label: "Capabilities", value: "Expose provider features without leaking them into core flows" },
      { label: "Contract testing", value: "Same API endpoints work with local and s3mock providers" },
      { label: "Migration-ready", value: "Example 3 shows dual-write/backfill cutover mechanics" },
    ],
    [],
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Portable Object Store</h1>
        <p className="mt-2 text-slate-300">
          A small demo showing how to reduce vendor lock-in with adapters, portable protocols, and
          contract-style behavior checks.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-300">
            Provider: <span className="font-mono text-slate-100">{provider}</span>
            {caps ? (
              <>
                {" "}
                • capabilities:{" "}
                <span className="font-mono text-slate-100">
                  {JSON.stringify(caps).replaceAll(",", ", ")}
                </span>
              </>
            ) : null}
          </div>
          <button
            type="button"
            onClick={refresh}
            className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700"
          >
            Refresh
          </button>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold">Strategy Checklist</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {posture.map((p) => (
            <div key={p.label} className="rounded-lg border border-slate-800 bg-black/20 p-3">
              <div className="text-sm font-semibold">{p.label}</div>
              <div className="mt-1 text-sm text-slate-300">{p.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Put object (text)</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Key</span>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="rounded border border-slate-700 bg-black/30 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Value</span>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={6}
                className="rounded border border-slate-700 bg-black/30 px-3 py-2"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={createObject}
            disabled={busy || !key.trim()}
            className="mt-4 rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
          >
            {busy ? "Working..." : "Put"}
          </button>
          <p className="mt-3 text-xs text-slate-400">
            The UI talks only to <span className="font-mono">/api/objects</span>. Switching providers
            is a config change (no UI rewrite).
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Objects</h2>
          <div className="mt-4 grid gap-2">
            {objects.map((o) => (
              <button
                type="button"
                key={o.key}
                onClick={() => openObject(o.key)}
                className="flex items-center justify-between gap-3 rounded border border-slate-800 bg-black/20 px-3 py-2 text-left text-sm hover:bg-black/30"
              >
                <span className="font-mono">{o.key}</span>
                <span className="text-xs text-slate-400">{o.size}B</span>
              </button>
            ))}
            {!objects.length ? (
              <div className="rounded border border-slate-800 bg-black/20 p-3 text-sm text-slate-300">
                No objects yet.
              </div>
            ) : null}
          </div>

          {selected ? (
            <div className="mt-5 rounded border border-slate-800 bg-black/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">
                    <span className="font-mono">{selected.ref.key}</span>
                  </div>
                  <div className="mt-2 whitespace-pre-wrap text-sm text-slate-300">
                    {selected.value}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteObject(selected.ref.key)}
                  className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold hover:bg-slate-700"
                >
                  Delete
                </button>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                etag: <span className="font-mono">{selected.ref.etag.slice(0, 12)}…</span> • updated:{" "}
                {new Date(selected.ref.updatedAt).toLocaleString()}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

