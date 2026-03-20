import Link from "next/link";
import { draftMode } from "next/headers";
import { getDraftPost, getPost, listPosts } from "@/lib/content";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return listPosts().map((p) => ({ slug: p.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  const isDraft = draftMode().isEnabled;
  const post = isDraft ? getDraftPost(slug) : getPost(slug);

  if (!post) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm text-slate-300 hover:underline">
            ← Back
          </Link>
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
            <h1 className="text-xl font-semibold text-slate-100">Not found</h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-300 hover:underline">
            ← Back
          </Link>
          <a
            className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-200 hover:border-slate-500"
            href="/api/draft/disable"
          >
            Exit draft mode
          </a>
        </div>

        <article className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Mode: {isDraft ? "DRAFT" : "PUBLISHED"}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">
            {post.title}
          </h1>
          <div className="mt-2 text-xs text-slate-400">
            Updated {new Date(post.updatedAt).toLocaleString()}
          </div>
          <div className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
            {post.body}
          </div>
        </article>
      </div>
    </main>
  );
}

