"use client";

import { useMemo, useState } from "react";
import { sign, timingSafeEq } from "@/lib/signing";

export default function Page() {
  const [secret, setSecret] = useState("dev-secret-change-me");
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/private/report.json");
  const [expires, setExpires] = useState(String(Date.now() + 60_000));
  const [token, setToken] = useState("");

  const canonical = useMemo(() => `${method}\n${path}\n${expires}`, [method, path, expires]);
  const expected = useMemo(() => sign(canonical, secret), [canonical, secret]);
  const ok = useMemo(() => (token ? timingSafeEq(token, expected) : false), [token, expected]);

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Signed URL primitives</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            <span className="opacity-80">Secret</span>
            <input className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2" value={secret} onChange={(e) => setSecret(e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="opacity-80">Method</span>
            <input className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2" value={method} onChange={(e) => setMethod(e.target.value)} />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="opacity-80">Path</span>
            <input className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2" value={path} onChange={(e) => setPath(e.target.value)} />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="opacity-80">Expires (ms)</span>
            <input className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2" value={expires} onChange={(e) => setExpires(e.target.value)} />
          </label>
        </div>

        <div className="mt-4 text-sm">
          <div className="opacity-80">Canonical string</div>
          <div className="mt-2 break-all rounded bg-black/30 p-3">
            <code>{canonical}</code>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <div className="opacity-80">Expected signature</div>
          <div className="mt-2 break-all rounded bg-black/30 p-3">
            <code>{expected}</code>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <div className="opacity-80">Verify token</div>
          <input className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2" placeholder="paste a token to verify" value={token} onChange={(e) => setToken(e.target.value)} />
          <div className="mt-2">
            Result: <code>{token ? (ok ? "valid" : "invalid") : "-"}</code>
          </div>
        </div>
      </section>
    </main>
  );
}

