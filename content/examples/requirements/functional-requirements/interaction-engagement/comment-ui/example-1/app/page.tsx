"use client";

import { useEffect, useState } from "react";

type Comment = {
  id: string;
  author: string;
  body: string;
  status: "visible" | "pending" | "flagged";
};

type CommentState = {
  sort: "top" | "new";
  comments: Comment[];
  draft: string;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<CommentState | null>(null);

  async function refresh() {
    const response = await fetch("/api/comment-ui/state");
    setState((await response.json()) as CommentState);
  }

  async function act(type: "switch-sort" | "submit-draft" | "flag-comment", value?: string) {
    const response = await fetch("/api/comment-ui/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value })
    });
    setState((await response.json()) as CommentState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Comment UI</h1>
      <p className="mt-2 text-slate-300">Render comment threads, switch sort order, and submit or flag comments while keeping moderation status visible.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void act("switch-sort", "top")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Top</button>
            <button onClick={() => void act("switch-sort", "new")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">New</button>
          </div>
          <button onClick={() => void act("submit-draft")} className="mt-4 rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Submit draft</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{comment.author}</div>
                  <div className="mt-2">{comment.body}</div>
                  <div className="mt-2 text-xs text-slate-500">status {comment.status}</div>
                </div>
                <button onClick={() => void act("flag-comment", comment.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Flag</button>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
