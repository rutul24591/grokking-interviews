"use client";

import { useState } from "react";

type StartPayload = {
  authorizationUrl: string;
  state: string;
};

type ExchangePayload = {
  user: {
    id: string;
    name: string;
    provider: string;
  };
};

export default function OAuthWorkbench() {
  const [logs, setLogs] = useState<string[]>([]);
  const [user, setUser] = useState<ExchangePayload["user"] | null>(null);

  async function runLogin() {
    const start = (await fetch("http://localhost:4473/oauth/start").then((response) => response.json())) as StartPayload;
    setLogs((current) => [`redirect -> ${start.authorizationUrl}`, ...current].slice(0, 8));

    const callbackCode = "code_demo_123";
    const exchange = await fetch("http://localhost:4473/oauth/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: callbackCode, state: start.state })
    });
    const payload = (await exchange.json()) as ExchangePayload;
    setUser(payload.user);
    setLogs((current) => [`exchanged authorization code for ${payload.user.name}`, ...current].slice(0, 8));
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">OAuth flow</h2>
        <button onClick={() => void runLogin()} className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Run login flow</button>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          {user ? `Signed in as ${user.name} via ${user.provider}` : "No authenticated user yet."}
        </div>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Flow log</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {logs.map((log) => <li key={log} className="rounded-2xl bg-slate-50 px-4 py-3">{log}</li>)}
        </ul>
      </article>
    </section>
  );
}
