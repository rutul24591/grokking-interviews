import Link from "next/link";
import { listPosts } from "@/lib/content";

export const dynamic = "force-static";

export default function Page() {
  const posts = listPosts();
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">SSG Blog</h1>
        <p className="mt-1 text-sm text-slate-300">
          These pages are generated at build time from `content/posts.json`.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Posts
          </div>
          <ul className="mt-4 space-y-3">
            {posts.map((p) => (
              <li key={p.slug} className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                <Link href={`/posts/${encodeURIComponent(p.slug)}`} className="text-sm font-semibold text-slate-100 hover:underline">
                  {p.title}
                </Link>
                <div className="mt-1 text-xs text-slate-400">
                  Updated {new Date(p.updatedAt).toLocaleDateString()}
                </div>
                <div className="mt-2 text-sm text-slate-300">{p.excerpt}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

