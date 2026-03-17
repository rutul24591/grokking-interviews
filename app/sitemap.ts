import { getAllArticlePaths } from "@/lib/loadArticle";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Get all article paths from registry
  const articles = getAllArticlePaths();

  // Create entries for article pages
  const articleEntries = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.domain}/${article.category}/${article.subcategory}/${article.topic}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Home page
  const homeEntry = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  };

  return [homeEntry, ...articleEntries];
}
