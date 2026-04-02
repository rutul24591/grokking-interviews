"use client";

import { useEffect, useMemo, useState } from "react";

type Me = { user: { id: string; email: string } | null; csrfToken?: string };
type Note = { id: string; title: string; body: string; createdAt: number };

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    credentials: "include",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export default function Page() {
  const [email, setEmail] = useState("staff@example.com");
  const [password, setPassword] = useState("password12345");
  const [me, setMe] = useState<Me>({ user: null });
  const [notes, setNotes] = useState<Note[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loggedIn = Boolean(me.user);
  const csrfToken = me.csrfToken ?? "";

  async function refreshMe() {
    try {
      const r = await json<Me>("/api/auth/me");
      setMe(r);
    } catch {
      setMe({ user: null });
    }
  }

  async function refreshNotes() {
    if (!loggedIn) return;
    const r = await json<{ notes: Note[] }>("/api/notes");
    setNotes(r.notes);
  }

  async function login() {
    setBusy(true);
    setError("");
    try {
      const r = await json<Me>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setMe(r);
      setNewTitle("");
      setNewBody("");
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
      setMe({ user: null });
      setNotes([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function createNote() {
    setBusy(true);
    setError("");
    try {
      await json("/api/notes", {
        method: "POST",
        headers: { "x-csrf-token": csrfToken },
        body: JSON.stringify({ title: newTitle, body: newBody }),
      });
      setNewTitle("");
      setNewBody("");
      await refreshNotes();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function deleteNote(id: string) {
    setBusy(true);
    setError("");
    try {
      await json(`/api/notes/${id}`, {
        method: "DELETE",
        headers: { "x-csrf-token": csrfToken },
      });
      await refreshNotes();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    refreshMe().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refreshNotes().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  const posture = useMemo(() => {
    return [
      { label: "Security headers", value: "CSP, XFO, nosniff, referrer-policy, permissions-policy" },
      { label: "Input validation", value: "Zod schemas for all mutation payloads" },
      { label: "Auth/session", value: "Signed session cookie + server-side session store" },
      { label: "CSRF", value: "Same-origin check + per-session CSRF token" },
      { label: "Abuse controls", value: "In-memory rate limiting (IP + endpoint)" },
      { label: "Safe logging", value: "Redaction for secrets/PII in error responses" },
    ];
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Secure Notes</h1>
        <p className="mt-2 text-slate-300">
          A small app that demonstrates an end-to-end security posture across UI, APIs, and runtime
          controls.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold">Posture Checklist</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {posture.map((p) => (
            <div key={p.label} className="rounded-lg border border-slate-800 bg-black/20 p-3">
              <div className="text-sm font-semibold">{p.label}</div>
              <div className="mt-1 text-sm text-slate-300">{p.value}</div>
            </div>
          ))}
        </div>
      </section>

      {!loggedIn ? (
        <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
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
          <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-300">
                Signed session cookie: <span className="text-slate-100">active</span> • CSRF token:{" "}
                <span className="font-mono text-slate-100">
                  {csrfToken ? `${csrfToken.slice(0, 8)}…` : "—"}
                </span>
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
            <h2 className="text-lg font-semibold">Create Note</h2>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1 text-sm">
                <span className="text-slate-300">Title</span>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="rounded border border-slate-700 bg-black/30 px-3 py-2"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-slate-300">Body</span>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={4}
                  className="rounded border border-slate-700 bg-black/30 px-3 py-2"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={createNote}
              disabled={busy || !newTitle.trim()}
              className="mt-4 rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
            >
              {busy ? "Working..." : "Create (CSRF protected)"}
            </button>
          </section>

          <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Notes</h2>
              <button
                type="button"
                onClick={refreshNotes}
                disabled={busy}
                className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="rounded-lg border border-slate-800 bg-black/20 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{n.title}</div>
                      <div className="mt-1 whitespace-pre-wrap text-sm text-slate-300">
                        {n.body}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteNote(n.id)}
                      className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold hover:bg-slate-700"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="mt-3 text-xs text-slate-400">
                    id: <span className="font-mono">{n.id}</span> • created:{" "}
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
              {!notes.length ? (
                <div className="rounded border border-slate-800 bg-black/20 p-4 text-sm text-slate-300">
                  No notes yet.
                </div>
              ) : null}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

