"use client";

import { useEffect, useState } from "react";

type Me =
  | { authenticated: false }
  | { authenticated: true; user: { userId: string; username: string; roles: string[]; createdAt: number } };

export default function Page() {
  const [me, setMe] = useState<Me>({ authenticated: false });
  const [username, setUsername] = useState("alice");
  const [password, setPassword] = useState("password");
  const [secret, setSecret] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshMe() {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    setMe((await res.json()) as Me);
  }

  useEffect(() => {
    void refreshMe();
  }, []);

  async function login() {
    setError(null);
    setSecret(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error ?? "login failed");
      return;
    }
    await refreshMe();
  }

  async function logout() {
    setError(null);
    setSecret(null);
    await fetch("/api/auth/logout", { method: "POST" });
    await refreshMe();
  }

  async function fetchSecret() {
    setError(null);
    const res = await fetch("/api/secret", { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error ?? "failed");
      return;
    }
    setSecret(json);
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Authentication patterns: session cookies (BFF)</h1>
        <p className="text-sm text-white/70">
          Login sets an HttpOnly session cookie; the UI cannot read it directly. APIs authenticate by looking up the
          session server-side.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-semibold">Login</h2>
          <div className="mt-3 grid gap-2">
            <label className="text-xs text-white/60">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
            />
            <label className="text-xs text-white/60">Password</label>
            <input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={login}
                className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
              >
                Login
              </button>
              <button
                onClick={logout}
                className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
              >
                Logout
              </button>
              <button
                onClick={refreshMe}
                className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
              >
                Refresh /me
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-semibold">Session state</h2>
          <div className="mt-3 text-sm text-white/70">
            {me.authenticated ? (
              <>
                Logged in as <code>{me.user.username}</code> roles: <code>{me.user.roles.join(",")}</code>
              </>
            ) : (
              "Not authenticated"
            )}
          </div>
          <button
            onClick={fetchSecret}
            className="mt-4 rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-400"
          >
            Call protected API (/api/secret)
          </button>
          {secret ? <pre className="mt-3 overflow-auto rounded bg-black/20 p-3 text-xs">{JSON.stringify(secret, null, 2)}</pre> : null}
        </div>
      </section>

      {error ? <div className="rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm">{error}</div> : null}
    </main>
  );
}

