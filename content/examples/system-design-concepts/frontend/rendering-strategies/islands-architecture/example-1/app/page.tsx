import BookmarkButton from "@/app/_components/BookmarkButton";
import ReadingProgress from "@/app/_components/ReadingProgress";
import type { Article } from "@/lib/types";

export const dynamic = "force-dynamic";

async function fetchArticles(): Promise<Article[]> {
  const origin = process.env.ORIGIN_API?.trim() || "http://localhost:4030";
  const res = await fetch(`${origin}/v1/articles`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Article[];
}

function formatIsoDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString();
}

export default async function Page() {
  const articles = await fetchArticles();

  return (
    <main className="min-h-screen">
      <ReadingProgress />

      <div className="px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-semibold tracking-tight">Islands Architecture</h1>
          <p className="mt-1 text-sm text-slate-300">
            Server-rendered list + small interactive islands (bookmark, reading progress).
          </p>

          <div className="mt-6 grid gap-4">
            {articles.map((article) => (
              <article
                key={article.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">{article.title}</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatIsoDate(article.publishedAt)}
                    </p>
                  </div>
                  <BookmarkButton articleId={article.id} />
                </div>
                <p className="mt-3 text-sm text-slate-200">{article.summary}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 text-xs text-slate-500">
            Most HTML is rendered on the server. Only the small islands ship client JS and hydrate.
          </div>
        </div>
      </div>
    </main>
  );
}

