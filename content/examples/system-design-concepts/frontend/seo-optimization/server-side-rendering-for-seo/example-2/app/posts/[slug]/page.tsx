import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getPost, getRelatedPosts } from "@/lib/posts";

const ParamsSchema = z.object({ slug: z.string().min(1) });
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = ParamsSchema.parse(await params);
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/posts/${post.slug}` }
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = ParamsSchema.parse(await params);

  const [post, related] = await Promise.all([getPost(slug), getRelatedPosts(slug)]);
  if (!post) notFound();

  return (
    <main className="grid gap-8 lg:grid-cols-[1fr_260px]">
      <article className="rounded-xl border border-white/10 bg-white/5 p-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
          <p className="mt-2 text-slate-300">{post.excerpt}</p>
          <p className="mt-4 text-sm text-slate-300">
            Published <time dateTime={post.publishedAt}>{post.publishedAt}</time>
          </p>
        </header>

        {post.sections.map((s) => (
          <section key={s.id} aria-labelledby={s.id} className="mt-8">
            <h2 id={s.id} className="text-xl font-semibold">
              {s.heading}
            </h2>
            <p className="mt-2 text-slate-200">{s.body}</p>
          </section>
        ))}

        <footer className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-300">
          <p>
            Both metadata and HTML content come from <code>getPost()</code> (cached), preventing double-fetch.
          </p>
        </footer>
      </article>

      <aside className="space-y-4">
        <section className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold">Related posts</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {related.map((r) => (
              <li key={r.slug}>
                <a className="hover:underline" href={`/posts/${r.slug}`}>
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Why this matters</h2>
          <p className="mt-2">
            SEO pages often call data loaders twice: once for <code>generateMetadata()</code> and once for rendering.
            Caching prevents duplicate DB/API work under load.
          </p>
        </section>
      </aside>
    </main>
  );
}

