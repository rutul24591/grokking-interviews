"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type Article = { title: string; summary: string; bullets: string[]; category: string };

function ArticleLoader({ category, render }: { category: string; render: (articles: Article[], reload: () => void) => ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);
  async function load() {
    const response = await fetch(`http://localhost:4527/articles?category=${category}`);
    setArticles((await response.json()) as Article[]);
  }
  useEffect(() => {
    void load();
  }, [category]);
  if (articles.length === 0) return <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">Loading article data…</div>;
  return <>{render(articles, load)}</>;
}

export default function RenderPropsLab() {
  const [category, setCategory] = useState("frontend");
  return (
    <section className="mt-8 space-y-6">
      <div className="flex flex-wrap gap-2">
        {["frontend", "backend"].map((value) => (
          <button key={value} className={`rounded-full px-4 py-2 text-sm font-semibold ${category === value ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`} onClick={() => setCategory(value)}>
            {value}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
      <ArticleLoader category={category} render={(articles, reload) => (
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Summary View</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {articles.map((article) => <li key={article.title} className="rounded-2xl bg-slate-50 px-4 py-3"><p className="font-semibold text-slate-950">{article.title}</p><p className="mt-2">{article.summary}</p></li>)}
          </ul>
          <button className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white" onClick={() => void reload()}>Reload</button>
        </article>
      )} />
      <ArticleLoader category={category} render={(articles) => (
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Detailed View</h2>
          <div className="mt-4 space-y-4">
            {articles.map((article) => (
              <div key={article.title} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-lg font-medium text-slate-900">{article.title}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">{article.bullets.map((bullet) => <li key={bullet}>• {bullet}</li>)}</ul>
              </div>
            ))}
          </div>
        </article>
      )} />
      </div>
    </section>
  );
}
