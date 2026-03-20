"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

type Comment = { id: string; author: string; message: string; createdAt: string };

const CommentInputSchema = z.object({
  author: z.string().min(1).max(40),
  message: z.string().min(1).max(280),
});

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export default function Page() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const formRef = useRef<HTMLFormElement | null>(null);

  async function loadInitial() {
    const page = await json<{ comments: Comment[]; nextCursor: string | null }>("/api/comments?limit=10");
    setComments(page.comments);
    setCursor(page.nextCursor);
  }

  async function loadMore() {
    if (!cursor) return;
    const page = await json<{ comments: Comment[]; nextCursor: string | null }>(
      `/api/comments?limit=10&cursor=${cursor}`,
    );
    setComments((prev) => [...prev, ...page.comments]);
    setCursor(page.nextCursor);
  }

  useEffect(() => {
    loadInitial().catch((e) => setError(e instanceof Error ? e.message : String(e)));

    // Surface PRG status flags (no-JS mode) to show the UX is still meaningful.
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("ok") === "1") setStatus("Comment posted (no-JS PRG path).");
    if (sp.get("error") === "1") setError("Validation failed (no-JS PRG path).");
  }, []);

  const canLoadMore = useMemo(() => Boolean(cursor), [cursor]);

  async function onSubmitEnhanced(e: React.FormEvent<HTMLFormElement>) {
    // Progressive enhancement: if JS is available, intercept and do a JSON submit.
    e.preventDefault();
    setStatus("");
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      author: String(fd.get("author") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = CommentInputSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join("; "));
      return;
    }

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { accept: "application/json", "x-enhanced": "1" },
      body: (() => {
        const b = new FormData();
        b.set("author", parsed.data.author);
        b.set("message", parsed.data.message);
        return b;
      })(),
    });
    if (!res.ok) {
      setError(`${res.status} ${res.statusText}`);
      return;
    }
    const data = (await res.json()) as { comment: Comment };

    // Optimistic-ish: prepend the created comment.
    setComments((prev) => [data.comment, ...prev]);
    form.reset();
    setStatus("Comment posted (enhanced JS path).");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Progressive Enhancement</h1>
        <p className="mt-2 text-slate-300">
          The form works without JS (server redirect). With JS, it becomes inline + fetch-based.
        </p>
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-200">
          <div className="font-semibold">Try no-JS mode</div>
          <p className="mt-1 text-slate-300">
            Disable JavaScript in your browser devtools and submit the form. It still works via a normal POST + redirect.
          </p>
        </div>
        {status ? (
          <div className="mt-4 rounded border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
            {status}
          </div>
        ) : null}
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold">Leave a comment</h2>
        <form
          ref={formRef}
          className="mt-4 grid gap-3"
          action="/api/comments"
          method="post"
          onSubmit={onSubmitEnhanced}
        >
          <label className="grid gap-1">
            <span className="text-sm font-semibold text-slate-200">Author</span>
            <input
              name="author"
              required
              maxLength={40}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="Ada"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-semibold text-slate-200">Message</span>
            <textarea
              name="message"
              required
              maxLength={280}
              className="min-h-[96px] rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="This is a great article…"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500"
            >
              Post
            </button>
            <span className="text-xs text-slate-300">
              Without JS: server redirect. With JS: fetch + inline update.
            </span>
          </div>
          <noscript>
            <div className="rounded border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
              JavaScript is disabled: the form will submit normally and the server will redirect back here.
            </div>
          </noscript>
        </form>
      </section>

      <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Comments</h2>
          {canLoadMore ? (
            // Baseline behavior without JS: a normal link to fetch JSON is not useful.
            // In a real app, you’d have an HTML page route for pagination. Example 3 shows that pattern.
            <button
              type="button"
              className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold hover:bg-slate-700"
              onClick={loadMore}
            >
              Load more
            </button>
          ) : null}
        </div>

        <div className="mt-4 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="rounded border border-slate-800 bg-black/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-slate-100">{c.author}</div>
                <div className="font-mono text-xs text-slate-300">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-2 whitespace-pre-wrap text-sm text-slate-200">{c.message}</div>
            </div>
          ))}
          {!comments.length ? (
            <div className="rounded border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
              No comments yet.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

