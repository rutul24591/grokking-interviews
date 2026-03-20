import LikeButton from "@/app/_components/LikeButton";
import { likeAction } from "@/app/actions";
import { getArticle } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const article = getArticle("a-1");
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">{article.title}</h1>
        <p className="mt-1 text-sm text-slate-300">
          Updated: <span className="font-mono">{article.updatedAt}</span>
        </p>

        <article className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 text-sm text-slate-100">
          <p>{article.body}</p>
        </article>

        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="text-sm text-slate-100">
            Likes: <span className="font-mono">{article.likes}</span>
          </div>
          <form action={likeAction} className="flex items-center gap-3">
            <input type="hidden" name="articleId" value={article.id} />
            <LikeButton />
          </form>
        </div>

        <div className="mt-6 text-xs text-slate-500">
          Only <span className="font-mono">LikeButton</span> is a client component. The rest stays server-rendered.
        </div>
      </div>
    </main>
  );
}

