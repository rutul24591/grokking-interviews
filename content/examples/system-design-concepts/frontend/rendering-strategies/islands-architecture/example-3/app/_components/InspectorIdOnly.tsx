"use client";

import { useEffect, useState } from "react";

type Article = { id: string; body: string };

export default function InspectorIdOnly(props: { articleId: string }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [htmlBytes, setHtmlBytes] = useState<number | null>(null);

  useEffect(() => {
    setHtmlBytes(document.documentElement.outerHTML.length);

    const abortController = new AbortController();
    fetch(`/api/article?id=${encodeURIComponent(props.articleId)}`, {
      signal: abortController.signal,
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => setArticle(data))
      .catch(() => {});

    return () => abortController.abort();
  }, [props.articleId]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
        Island (id-only)
      </div>
      <div className="mt-3 grid gap-1 text-sm text-slate-100">
        <div>
          article id: <span className="font-mono">{props.articleId}</span>
        </div>
        <div>
          island fetched:{" "}
          <span className="font-mono">{article ? "yes" : "loading…"}</span>
        </div>
        <div>
          document HTML chars (approx):{" "}
          <span className="font-mono">{htmlBytes ?? "…"}</span>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-500">
        Server ships minimal props; island fetches details. This often reduces initial payload size.
      </div>
    </div>
  );
}

