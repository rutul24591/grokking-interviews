import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getPost, listPosts } from "@/lib/posts";

const ParamsSchema = z.object({ slug: z.string().min(1) });
type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;
export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = ParamsSchema.parse(await params);
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = ParamsSchema.parse(await params);
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main>
      <article className="rounded-xl border border-white/10 bg-white/5 p-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
          <p className="mt-2 text-slate-300">{post.excerpt}</p>
          <p className="mt-4 text-sm text-slate-300">
            Published <time dateTime={post.publishedAt}>{post.publishedAt}</time> · ISR revalidate{" "}
            <code>{post.revalidateSeconds}s</code>
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
            This page is pre-rendered (SSG) and incrementally refreshed (ISR). It’s fast, crawlable, and reliable for
            SEO.
          </p>
        </footer>
      </article>
    </main>
  );
}
