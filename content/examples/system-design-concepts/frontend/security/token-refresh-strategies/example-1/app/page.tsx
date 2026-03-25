"use client";

import { useMemo, useState } from "react";

type Access = { token: string; expMs: number } | null;

export default function Page() {
  const [access, setAccess] = useState<Access>(null);
  const [log, setLog] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshSingleflight = useMemo(() => {
    let inFlight: Promise<Access> | null = null;
    return async () => {
      if (inFlight) return inFlight;
      inFlight = fetch("/api/auth/refresh", { method: "POST" })
        .then(async (r) => {
          const j = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(j?.error ?? "refresh failed");
          return { token: j.accessToken as string, expMs: j.accessExpMs as number } satisfies Access;
        })
        .finally(() => {
          inFlight = null;
        });
      return inFlight;
    };
  }, []);

  async function login() {
    setError(null);
    const res = await fetch("/api/auth/login", { method: "POST" });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j?.error ?? "login failed");
      return;
    }
    setAccess({ token: j.accessToken, expMs: j.accessExpMs });
    setLog((l) => [{ event: "login", j }, ...l].slice(0, 30));
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAccess(null);
    setLog((l) => [{ event: "logout" }, ...l].slice(0, 30));
  }

  async function callProtected() {
    setError(null);
    if (!access) {
      setError("login first");
      return;
    }
    const doCall = async (a: Access) => {
      const res = await fetch("/api/protected", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${a!.token}` }
      });
      const j = await res.json().catch(() => ({}));
      return { res, j };
    };

    let { res, j } = await doCall(access);
    if (res.status === 401 && j?.error === "expired") {
      const next = await refreshSingleflight();
      setAccess(next);
      setLog((l) => [{ event: "refresh", next }, ...l].slice(0, 30));
      ({ res, j } = await doCall(next));
    }

    if (!res.ok) setError(j?.error ?? "request failed");
    setLog((l) => [{ event: "protected", status: res.status, j }, ...l].slice(0, 30));
  }

  async function callProtectedConcurrent() {
    // Simulate concurrent requests that might all hit expired access token.
    await Promise.all(Array.from({ length: 5 }, () => callProtected()));
  }

  const expIn = access ? Math.max(0, access.expMs - Date.now()) : 0;

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Token refresh strategies</h1>
        <p className="text-sm text-white/70">
          Access token expires quickly; refresh token is HttpOnly. Client refresh uses singleflight to reduce herd.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={login}
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
          >
            Login (issue tokens)
          </button>
          <button
            onClick={logout}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Logout (clear refresh cookie)
          </button>
          <button
            onClick={callProtected}
            className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-400"
          >
            Call protected
          </button>
          <button
            onClick={callProtectedConcurrent}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Call protected ×5 (concurrent)
          </button>
        </div>

        <div className="mt-3 text-sm text-white/70">
          Access token: {access ? <code>{access.token.slice(0, 10)}…</code> : "—"}{" "}
          {access ? (
            <>
              expires in <code>{Math.ceil(expIn / 1000)}s</code>
            </>
          ) : null}
        </div>

        {error ? <div className="mt-3 rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm">{error}</div> : null}
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold">Log</h2>
        <pre className="mt-3 max-h-80 overflow-auto rounded bg-black/20 p-3 text-xs">{JSON.stringify(log, null, 2)}</pre>
      </section>
    </main>
  );
}

