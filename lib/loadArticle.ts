import { articleRegistry } from "@/content/registry";
import type { ArticleMetadata } from "@/types/article";

/**
 * Load an article by its path components
 * @param domain - The domain (e.g., "system-design-concepts")
 * @param category - The category (e.g., "frontend-concepts")
 * @param subcategory - The subcategory (e.g., "rendering-strategies")
 * @param topic - The topic slug (e.g., "client-side-rendering")
 */
export async function loadArticle(params: {
  domain: string;
  category: string;
  subcategory: string;
  topic: string;
}) {
  const { domain, category, subcategory, topic } = params;

  // Map category slug from URL to registry format
  // URL uses "backend-concepts", "frontend-concepts" but registry uses "backend", "frontend"
  const registryCategory = category.replace("-concepts", "");

  // Build the registry key from the path
  // The registry uses format: "{category}/{subcategory}/{topic}"
  // where category is like "backend", "frontend", etc.
  const registryKey = `${registryCategory}/${subcategory}/${topic}`;

  // Check if article exists in registry
  const article = articleRegistry[registryKey];

  if (!article) {
    return null;
  }

  // Load the article module
  const module = await article.loader();

  return {
    metadata: article.metadata,
    component: module.default,
  };
}

/**
 * Get all available article paths for static generation
 */
export function getAllArticlePaths() {
  return Object.keys(articleRegistry).map((key) => {
    const parts = key.split("/");
    return {
      domain: "system-design-concepts", // Default domain for now
      category: parts[0],
      subcategory: parts[1],
      topic: parts[2],
    };
  });
}

/**
 * Get article metadata without loading the component
 */
export function getArticleMetadata(registryKey: string): ArticleMetadata | null {
  const article = articleRegistry[registryKey];
  return article?.metadata ?? null;
}
