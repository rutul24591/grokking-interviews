"use client";

import { useEffect, useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

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
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether versioning backward compatibility is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For versioning backward compatibility, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For versioning backward compatibility, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For versioning backward compatibility, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Versioning Backward Compatibility</div>
          <p className="mt-2">
            Strong non-functional examples must go beyond toggles and raw JSON. They need a review layer that makes the
            operational contract visible: what is being protected, what degrades first, and what evidence an operator
            or reviewer should use before changing policy.
          </p>
        </div>
      </section>

</main>
  );
}

