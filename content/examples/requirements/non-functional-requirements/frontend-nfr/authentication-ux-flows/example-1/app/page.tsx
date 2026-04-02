"use client";

import { useEffect, useState } from "react";

type Me = { user: { id: string; email: string } | null; stepUp: { ok: boolean } };

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    credentials: "include",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(res.status + " " + res.statusText + (text ? " — " + text : ""));
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export default function Page() {
  const [email, setEmail] = useState("staff@example.com");
  const [password, setPassword] = useState("password12345");
  const [me, setMe] = useState<Me>({ user: null, stepUp: { ok: false } });
  const [challenge, setChallenge] = useState<{ id: string; code: string } | null>(null);
  const [code, setCode] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      setMe(await json<Me>("/api/auth/me"));
    } catch {
      setMe({ user: null, stepUp: { ok: false } });
    }
  }

  async function login() {
    setBusy(true);
    setError("");
    try {
      await json("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      setChallenge(null);
      setCode("");
      setSecret("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    setError("");
    try {
      await json("/api/auth/logout", { method: "POST", body: "{}" });
      setChallenge(null);
      setCode("");
      setSecret("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function startStepUp() {
    setBusy(true);
    setError("");
    try {
      const r = await json<{ challengeId: string; code: string }>("/api/auth/stepup/start", {
        method: "POST",
        body: "{}",
      });
      setChallenge({ id: r.challengeId, code: r.code });
      setCode(r.code);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    if (!challenge) return;
    setBusy(true);
    setError("");
    try {
      await json("/api/auth/stepup/verify", {
        method: "POST",
        body: JSON.stringify({ challengeId: challenge.id, code }),
      });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function fetchSecret() {
    setBusy(true);
    setError("");
    try {
      const r = await json<{ secret: string }>("/api/secret");
      setSecret(r.secret);
    } catch (e) {
      setSecret("");
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Auth UX Simulator</h1>
        <p className="mt-2 text-slate-300">
          Demonstrates a common UX pattern: basic login + step-up authentication for sensitive actions.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div>
        ) : null}
      </header>

      {!me.user ? (
        <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Login</h2>
          <p className="mt-1 text-sm text-slate-300">
            Demo creds: <span className="font-mono">staff@example.com</span> /{" "}
            <span className="font-mono">password12345</span>
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded border border-slate-700 bg-black/30 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Password</span>
              <input
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="rounded border border-slate-700 bg-black/30 px-3 py-2"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={login}
            disabled={busy}
            className="mt-4 rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
          >
            {busy ? "Working..." : "Login"}
          </button>
        </section>
      ) : (
        <>
          <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-300">
                User: <span className="font-mono text-slate-100">{me.user.email}</span> • step-up:{" "}
                <span className="font-mono text-slate-100">{me.stepUp.ok ? "fresh" : "required"}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                disabled={busy}
                className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700 disabled:opacity-50"
              >
                Logout
              </button>
            </div>
          </section>

          <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
            <h2 className="text-lg font-semibold">Step-up</h2>
            <p className="mt-1 text-sm text-slate-300">
              In real systems, the code would be delivered out-of-band (TOTP/push/SMS).
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <button
                type="button"
                onClick={startStepUp}
                disabled={busy}
                className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500 disabled:opacity-50"
              >
                Start step-up
              </button>
              <label className="grid gap-1 text-sm">
                <span className="text-slate-300">Code</span>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-40 rounded border border-slate-700 bg-black/30 px-3 py-2 font-mono"
                />
              </label>
              <button
                type="button"
                onClick={verify}
                disabled={busy || !challenge}
                className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
              >
                Verify
              </button>
              {challenge ? (
                <div className="text-xs text-slate-400">
                  challenge: <span className="font-mono">{challenge.id}</span> • demo code:{" "}
                  <span className="font-mono text-slate-200">{challenge.code}</span>
                </div>
              ) : null}
            </div>
          </section>

          <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
            <h2 className="text-lg font-semibold">Sensitive action</h2>
            <button
              type="button"
              onClick={fetchSecret}
              disabled={busy}
              className="mt-3 rounded bg-amber-700 px-4 py-2 text-sm font-semibold hover:bg-amber-600 disabled:opacity-50"
            >
              Fetch secret (requires step-up)
            </button>
            {secret ? (
              <pre className="mt-4 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">{secret}</pre>
            ) : null}
          </section>
        </>
      )}
    </main>
  );
}

