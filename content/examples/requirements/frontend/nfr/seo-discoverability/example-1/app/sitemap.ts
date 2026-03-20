import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "http://localhost:3000";
  return [
    { url: base, lastModified: new Date("2026-03-20T00:00:00Z") },
    ...ARTICLES.map((a) => ({ url: `${base}/articles/${a.slug}`, lastModified: new Date(a.publishedAt) }))
  ];
}

