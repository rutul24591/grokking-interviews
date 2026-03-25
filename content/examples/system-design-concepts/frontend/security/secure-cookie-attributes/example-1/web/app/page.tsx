"use client";

import { useState } from "react";
import { login, logout, whoami } from "../lib/api";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(fn: () => Promise<unknown>) {
    setError(null);
    setData(null);
    try {
      setData(await fn());
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message} (tip: open https://localhost:9443/whoami and accept the cert warning)`
          : "request failed"
      );
    }
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Secure cookie attributes</h1>
        <p className="text-sm text-white/70">
          The server issues <code>__Host-session</code> with <code>Secure</code>, <code>HttpOnly</code>,{" "}
          <code>SameSite=Lax</code>, and <code>Path=/</code>.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => run(login)}
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
          >
            Login (set cookie)
          </button>
          <button
            onClick={() => run(whoami)}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Whoami
          </button>
          <button
            onClick={() => run(logout)}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Logout (clear cookie)
          </button>
          <a
            href="https://localhost:9443/whoami"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Open server /whoami (accept cert)
          </a>
        </div>

        {error ? <div className="mt-3 rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm">{error}</div> : null}
        {data ? <pre className="mt-3 overflow-auto rounded bg-black/20 p-3 text-xs">{JSON.stringify(data, null, 2)}</pre> : null}
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold">Verify in DevTools</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
          <li>Application → Cookies → look for <code>__Host-session</code>.</li>
          <li>Confirm <code>HttpOnly</code> is set (JS cannot read it).</li>
          <li>Confirm <code>Secure</code> is set (sent only to HTTPS).</li>
        </ul>
      </section>
    </main>
  );
}

