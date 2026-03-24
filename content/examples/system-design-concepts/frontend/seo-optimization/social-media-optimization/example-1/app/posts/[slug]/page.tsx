import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/posts";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const og = `/api/og?title=${encodeURIComponent(post.title)}`;
  const url = `/posts/${post.slug}`;

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.summary,
      url,
      type: "article",
      images: [{ url: og, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [og]
    }
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">{post.title}</h1>
      <p className="text-sm opacity-80">{post.summary}</p>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm opacity-80">
        <p>View Source to see the Open Graph and Twitter meta tags.</p>
      </div>
    </main>
  );
}

