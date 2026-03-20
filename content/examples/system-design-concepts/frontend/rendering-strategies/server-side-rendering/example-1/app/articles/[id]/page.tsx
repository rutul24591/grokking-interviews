import Link from "next/link";
import { cookies } from "next/headers";
import { getArticle } from "@/lib/api";

export const dynamic = "force-dynamic";

type ArticlePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const uid = cookies().get("uid")?.value ?? null;

  const article = await getArticle({ uid, id });
  if (!article) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm text-slate-300 hover:underline">
            ← Back
          </Link>
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
            <h1 className="text-xl font-semibold text-slate-100">Not found</h1>
            <p className="mt-2 text-sm text-slate-300">
              No article with id <span className="font-mono">{id}</span>.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-slate-300 hover:underline">
          ← Back
        </Link>
        <article className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
              {article.title}
            </h1>
            <div className="mt-2 text-xs text-slate-400">
              Updated {new Date(article.updatedAt).toLocaleString()} · uid=
              <span className="ml-1 font-mono">{uid ?? "guest"}</span>
            </div>
          </header>
          <div className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
            {article.body}
          </div>
        </article>
      </div>
    </main>
  );
}

