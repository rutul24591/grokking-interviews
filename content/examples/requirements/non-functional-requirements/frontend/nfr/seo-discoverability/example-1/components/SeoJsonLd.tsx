import type { Article } from "@/lib/articles";

export function SeoJsonLd({ article, baseUrl }: { article: Article; baseUrl: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    mainEntityOfPage: `${baseUrl}/articles/${article.slug}`,
    author: { "@type": "Organization", name: "System Design Prep" },
    publisher: { "@type": "Organization", name: "System Design Prep" }
  };

  return (
    <script
      type="application/ld+json"
      // Safe: JSON built from known fields; no user-provided HTML.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

