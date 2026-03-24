import { z } from "zod";

export const BreadcrumbItemSchema = z.object({
  name: z.string(),
  item: z.string().url()
});

export function breadcrumbList(params: { baseUrl: string; items: Array<{ name: string; path: string }> }) {
  const list = params.items.map((i) =>
    BreadcrumbItemSchema.parse({ name: i.name, item: new URL(i.path, params.baseUrl).toString() })
  );

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item
    }))
  };
}

export function articleSchema(params: {
  baseUrl: string;
  path: string;
  title: string;
  description: string;
  authorName: string;
  publishedAt: string;
}) {
  const url = new URL(params.path, params.baseUrl).toString();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: url,
    headline: params.title,
    description: params.description,
    author: { "@type": "Person", name: params.authorName },
    datePublished: params.publishedAt,
    dateModified: params.publishedAt,
    url
  };
}

