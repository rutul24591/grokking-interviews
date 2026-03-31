"use client";

import { useEffect, useState } from "react";

type Comment = { id: string; author: string; body: string };

export default function CommentsPanel() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN_API?.trim() || "http://localhost:4170";
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetch(`${origin}/comments`, { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setComments(payload as Comment[]));
  }, [origin]);

  return (
    <div className="rounded-[1.8rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.08)]">
      <h3 className="text-lg font-semibold">Comments chunk</h3>
      <div className="mt-4 space-y-3">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold">{comment.author}</div>
            <p className="mt-2 text-sm leading-7 text-slate-600">{comment.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
