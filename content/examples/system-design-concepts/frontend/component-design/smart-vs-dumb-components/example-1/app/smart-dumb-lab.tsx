"use client";

import { useEffect, useMemo, useState } from "react";

type Article = { title: string; category: string };

function ArticleList({ items }: { items: Article[] }) {
  return <ul className="space-y-3 text-sm text-slate-700">{items.map((item) => <li key={item.title} className="rounded-2xl bg-white px-4 py-3 shadow-sm">{item.title} · {item.category}</li>)}</ul>;
}

export default function SmartDumbLab() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    void (async () => {
      const response = await fetch("http://localhost:4528/articles");
      setArticles((await response.json()) as Article[]);
    })();
  }, []);

  const visible = useMemo(() => filter === "all" ? articles : articles.filter((article) => article.category === filter), [articles, filter]);

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-semibold text-slate-950">Smart container</h2>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {["all", "frontend", "backend"].map((value) => (
            <button key={value} className={`rounded-full px-4 py-2 font-semibold ${filter === value ? "bg-slate-950 text-white" : "bg-white text-slate-700"}`} onClick={() => setFilter(value)}>{value}</button>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">This component owns fetching, filtering, and memoized selection.</p>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-semibold text-slate-950">Dumb list</h2>
        <div className="mt-4"><ArticleList items={visible} /></div>
      </article>
    </section>
  );
}
