import { getAllArticlePaths } from "@/lib/article-loader";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Get all article paths from registry
  const articles = getAllArticlePaths();

  // Create entries for concise versions (default)
  const articleEntries = articles.map((article) => ({
    url: `${baseUrl}/${article.category}/${article.subcategory}/${article.topic}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Create entries for extensive versions
  const extensiveEntries = articles.map((article) => ({
    url: `${baseUrl}/${article.category}/${article.subcategory}/${article.topic}/extensive`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Home page
  const homeEntry = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  };

  return [homeEntry, ...articleEntries, ...extensiveEntries];
}
