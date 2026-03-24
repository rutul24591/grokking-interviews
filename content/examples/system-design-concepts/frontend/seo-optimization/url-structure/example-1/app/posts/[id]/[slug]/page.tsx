import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPostById } from "@/lib/posts";

type PageProps = { params: Promise<{ id: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return {};
  return { title: post.title, alternates: { canonical: `/posts/${post.id}/${post.slug}` } };
}

export default async function PostPage({ params }: PageProps) {
  const { id, slug } = await params;
  const post = await getPostById(id);
  if (!post) redirect("/");

  if (slug !== post.slug) {
    redirect(`/posts/${post.id}/${post.slug}`);
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">{post.title}</h1>
      <p className="text-sm opacity-80">{post.body}</p>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm opacity-80">
        Canonical URL: <code>/posts/{post.id}/{post.slug}</code>
      </div>
    </main>
  );
}

