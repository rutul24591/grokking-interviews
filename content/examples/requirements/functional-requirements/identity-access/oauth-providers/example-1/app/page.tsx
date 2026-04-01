"use client";

import { useEffect, useState } from "react";

type OAuthProvider = {
  name: string;
  available: boolean;
  scopes: string[];
  redirectUri: string;
};

type OAuthState = {
  started: boolean;
  provider: string;
  code: string;
  completed: boolean;
  stateToken: string;
  redirectUri: string;
  providers: OAuthProvider[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<OAuthState | null>(null);
  const [provider, setProvider] = useState("google");
  const [code, setCode] = useState("oauth-code-123");
  const [stateToken, setStateToken] = useState("state-789");

  async function refresh() {
    const response = await fetch("/api/oauth/state");
    setState((await response.json()) as OAuthState);
  }

  async function start() {
    const response = await fetch("/api/oauth/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider })
    });
    setState((await response.json()) as OAuthState);
  }

  async function callback() {
    const response = await fetch("/api/oauth/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, stateToken })
    });
    setState((await response.json()) as OAuthState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">OAuth Provider Integration</h1>
      <p className="mt-2 text-slate-300">
        Select a delegated-login provider, inspect the scopes and redirect target, and complete the callback with state validation.
      </p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="grid gap-4 md:grid-cols-3">
            {state?.providers.map((entry) => (
              <button
                key={entry.name}
                type="button"
                disabled={!entry.available}
                onClick={() => setProvider(entry.name)}
                className={`rounded-lg border p-4 text-left text-sm ${
                  provider === entry.name ? "border-sky-500 bg-sky-500/10" : "border-slate-800"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <div className="font-semibold text-slate-100">{entry.name}</div>
                <div className="mt-2 text-slate-300">Scopes: {entry.scopes.join(", ")}</div>
                <div className="mt-1 text-slate-400">Available: {entry.available ? "yes" : "no"}</div>
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={start} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">
              Start OAuth
            </button>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="min-w-56 rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm"
            />
            <input
              value={stateToken}
              onChange={(event) => setStateToken(event.target.value)}
              className="min-w-40 rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm"
            />
            <button onClick={callback} className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500">
              Complete callback
            </button>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Started: <span className="font-semibold text-slate-100">{state?.started ? "yes" : "no"}</span></p>
          <p className="mt-2">Completed: <span className="font-semibold text-slate-100">{state?.completed ? "yes" : "no"}</span></p>
          <p className="mt-2">Redirect URI: <span className="font-mono text-slate-100">{state?.redirectUri}</span></p>
          <p className="mt-2">Expected state token: <span className="font-mono text-slate-100">{state?.stateToken}</span></p>
          <div className="mt-5 rounded-lg border border-slate-800 p-4">
            <div className="font-semibold text-slate-100">Operator checks</div>
            <ul className="mt-3 space-y-2">
              <li>1. Pick only providers that are currently enabled for the tenant.</li>
              <li>2. Validate state and redirect URI before exchanging the callback code.</li>
              <li>3. Establish a local session only after callback verification succeeds.</li>
            </ul>
          </div>
          <p className="mt-4">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
