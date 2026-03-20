"use client";

import { useEffect, useState } from "react";
import { SafeRichText } from "@/components/SafeRichText";

type Comment = { id: string; ts: number; author: string; text: string };

async function fetchComments(): Promise<Comment[]> {
  const res = await fetch("/api/comments", { cache: "no-store" });
  const body = (await res.json()) as { ok: true; comments: Comment[] };
  return body.comments;
}

export function CommentsUi() {
  const [author, setAuthor] = useState("bob");
  const [text, setText] = useState("Try: <img src=x onerror=alert(1)> **bold** `code`");
  const [items, setItems] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      setItems(await fetchComments());
    } catch (e) {
      setError(String(e));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-4">
      <h2 className="font-medium">Comments</h2>
      <div className="grid gap-2 md:grid-cols-[160px_1fr_auto]">
        <input
          className="rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="author"
        />
        <input
          className="rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="comment"
        />
        <button
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
          onClick={async () => {
            setError(null);
            try {
              const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ author, text })
              });
              if (!res.ok) throw new Error(`post failed: ${res.status}`);
              await load();
            } catch (e) {
              setError(String(e));
            }
          }}
        >
          Post
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-800 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</div>
      ) : null}

      <ul className="space-y-2 text-sm">
        {items.map((c) => (
          <li key={c.id} className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
            <div className="text-xs text-slate-400">
              {c.author} • {new Date(c.ts).toISOString()}
            </div>
            <div className="mt-1 text-slate-200">
              <SafeRichText text={c.text} />
            </div>
          </li>
        ))}
      </ul>

      <p className="text-xs text-slate-400">
        Notice the <code className="rounded bg-slate-800 px-1">{"<img ... onerror=...>"}</code> payload is
        rendered as text, not executed. No <code className="rounded bg-slate-800 px-1">dangerouslySetInnerHTML</code>.
      </p>
    </section>
  );
}

