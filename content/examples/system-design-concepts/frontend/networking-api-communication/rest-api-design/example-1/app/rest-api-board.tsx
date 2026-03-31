"use client";

import { useEffect, useState } from "react";

type Article = {
  id: string;
  title: string;
  author: string;
};

type Comment = {
  id: string;
  body: string;
};

export default function RestApiBoard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedId, setSelectedId] = useState("csr");
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("Helpful summary of REST tradeoffs.");

  useEffect(() => {
    fetch("http://localhost:4410/articles")
      .then((response) => response.json())
      .then((payload: { items: Article[] }) => setArticles(payload.items));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:4410/articles/${selectedId}`)
      .then((response) => response.json())
      .then((payload: { comments: Comment[] }) => setComments(payload.comments));
  }, [selectedId]);

  async function createComment() {
    const payload = (await fetch(`http://localhost:4410/articles/${selectedId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft })
    }).then((response) => response.json())) as Comment;
    setComments((current) => [payload, ...current]);
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Resources</h2>
        <ul className="mt-4 space-y-3">
          {articles.map((article) => (
            <li key={article.id}>
              <button
                onClick={() => setSelectedId(article.id)}
                className={`w-full rounded-2xl px-4 py-3 text-left ${selectedId === article.id ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-800"}`}
              >
                <p className="font-medium">{article.title}</p>
                <p className="mt-1 text-sm opacity-80">{article.author}</p>
              </button>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Nested comments resource</h2>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
        />
        <button onClick={() => void createComment()} className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          POST comment
        </button>
        <ul className="mt-6 space-y-3 text-sm text-slate-700">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-2xl bg-slate-50 px-4 py-3">
              {comment.body}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
