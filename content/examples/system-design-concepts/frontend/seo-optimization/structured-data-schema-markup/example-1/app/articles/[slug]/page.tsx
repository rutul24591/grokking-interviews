import { notFound } from "next/navigation";
import { articleSchema, breadcrumbList } from "@/lib/schema";

type PageProps = { params: Promise<{ slug: string }> };

const BASE = "http://localhost:3000";

const ARTICLES: Record<string, { title: string; description: string }> = {
  "edge-cache": {
    title: "Edge Cache",
    description: "How caching at the edge changes latency, reliability, and cost."
  }
};

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const a = ARTICLES[slug];
  if (!a) notFound();

  const article = articleSchema({
    baseUrl: BASE,
    path: `/articles/${slug}`,
    title: a.title,
    description: a.description,
    authorName: "Example Author",
    publishedAt: "2026-03-24T00:00:00.000Z"
  });

  const crumbs = breadcrumbList({
    baseUrl: BASE,
    items: [
      { name: "Home", path: "/" },
      { name: "Articles", path: "/articles/edge-cache" }
    ]
  });

  const ld = JSON.stringify([crumbs, article]);

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">{a.title}</h1>
      <p className="text-sm opacity-80">{a.description}</p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />

      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm opacity-80">
        JSON-LD is embedded in the HTML response. View Source and search for <code>application/ld+json</code>.
      </div>
    </main>
  );
}

