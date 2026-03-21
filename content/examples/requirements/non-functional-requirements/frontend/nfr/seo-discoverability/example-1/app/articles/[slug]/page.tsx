import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { getArticle } from "@/lib/articles";
import { SeoJsonLd } from "@/components/SeoJsonLd";

function baseUrlFromHeaders(h: Headers) {
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Not found" };
  const h = await headers();
  const baseUrl = baseUrlFromHeaders(h);
  const canonical = `${baseUrl}/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.description,
      url: canonical,
      type: "article"
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Not found</h1>
        <Link className="text-sm text-slate-300 underline" href="/">
          Back
        </Link>
      </main>
    );
  }

  const h = await headers();
  const baseUrl = baseUrlFromHeaders(h);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <SeoJsonLd article={article} baseUrl={baseUrl} />
      <Link className="text-sm text-slate-300 underline" href="/">
        Back
      </Link>
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{article.title}</h1>
        <p className="text-sm text-slate-300">{article.description}</p>
        <div className="text-xs text-slate-400">Published: {article.publishedAt}</div>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300 space-y-2">
        <h2 className="font-medium text-slate-200">What search engines need</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Stable canonical URLs (avoid duplicate content)</li>
          <li>Metadata (title/description/OpenGraph)</li>
          <li>Structured data (JSON-LD) where applicable</li>
          <li>Sitemap + robots directives</li>
        </ul>
      </section>
    </main>
  );
}

