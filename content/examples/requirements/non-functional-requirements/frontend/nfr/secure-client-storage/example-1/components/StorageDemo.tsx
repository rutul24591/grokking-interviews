"use client";

import { useEffect, useState } from "react";

type Secret =
  | { ok: true; userId: string; secret: string; note: string }
  | { error: string; details?: unknown };

async function getSecret(init?: RequestInit): Promise<Secret> {
  const res = await fetch("/api/auth/secret", { cache: "no-store", ...init });
  const body = (await res.json()) as any;
  if (!res.ok) return body;
  return body as Secret;
}

export function StorageDemo() {
  const [token, setToken] = useState<string | null>(null);
  const [secret, setSecret] = useState<Secret | null>(null);

  useEffect(() => {
    setToken(window.localStorage.getItem("demo.token"));
  }, []);

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
      <h2 className="font-medium">Storage choices</h2>
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500"
          onClick={async () => {
            await fetch("/api/auth/login-cookie", { method: "POST" });
            const s = await getSecret();
            setSecret(s);
          }}
        >
          Login (httpOnly cookie)
        </button>
        <button
          className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium hover:bg-amber-500"
          onClick={async () => {
            const res = await fetch("/api/auth/login-token", { method: "POST" });
            const body = (await res.json()) as { ok: true; token: string };
            window.localStorage.setItem("demo.token", body.token);
            setToken(body.token);
            const s = await getSecret({ headers: { authorization: `Bearer ${body.token}` } });
            setSecret(s);
          }}
        >
          Login (localStorage token)
        </button>
        <button
          className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
          onClick={async () => {
            window.localStorage.removeItem("demo.token");
            setToken(null);
            setSecret(null);
          }}
        >
          Clear local token
        </button>
      </div>

      <div className="text-xs text-slate-400">
        localStorage token: <span className="font-mono">{token ? token.slice(0, 12) + "…" : "none"}</span>
      </div>

      <pre className="rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">
        {JSON.stringify(secret, null, 2)}
      </pre>
    </section>
  );
}

