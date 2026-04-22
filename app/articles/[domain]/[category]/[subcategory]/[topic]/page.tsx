import { Suspense } from "react";
import { notFound } from "next/navigation";
import { articleRoutes, loadArticle } from "@/lib/article-routes";

type ArticlePageProps = {
  params: Promise<{
    domain: string;
    category: string;
    subcategory: string;
    topic: string;
  }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { domain, category, subcategory, topic } = await params;

  const article = await loadArticle(domain, category, subcategory, topic);

  if (!article) {
    notFound();
  }

  const ArticleComponent = article.component;

  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted">Loading article...</div>
      }
    >
      <ArticleComponent />
    </Suspense>
  );
}

/**
 * Generate static params from article routes manifest
 */
export function generateStaticParams() {
  return Object.keys(articleRoutes).map((key) => {
    const parts = key.split("/");
    return {
      domain: parts[0],
      category: parts[1],
      subcategory: parts[2],
      topic: parts[3],
    };
  });
}

/**
 * Generate metadata for the article
 */
export async function generateMetadata({ params }: ArticlePageProps) {
  const { domain, category, subcategory, topic } = await params;

  const article = await loadArticle(domain, category, subcategory, topic);

  if (!article?.metadata) {
    return { title: "Article Not Found" };
  }

  const m = article.metadata;
  return {
    title: m.title,
    description: m.description,
    keywords: m.tags?.join(", "),
    openGraph: {
      title: m.title,
      description: m.description,
      type: "article",
      locale: "en_US",
      images: [
        {
          url: `/og-article.png?title=${encodeURIComponent(m.title)}`,
          width: 1200,
          height: 630,
          alt: m.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
    },
  };
}

/**
 * Enable Incremental Static Regeneration (ISR).
 * Articles are statically generated at build time but revalidated
 * every 1 hour to pick up content changes without a full rebuild.
 */
export const revalidate = 3600; // 1 hour
