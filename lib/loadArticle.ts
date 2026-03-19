import type { ArticleMetadata } from "@/types/article";

/**
 * Get the import path for an article
 * This is a helper to construct the correct import path
 */
export function getArticleImportPath(params: {
  domain: string;
  category: string;
  subcategory: string;
  topic: string;
}): string {
  const { domain, category, subcategory, topic } = params;

  // Map domain to articles directory
  const articlesBase = domain === "system-design-concepts" ? "system-design" : domain;

  // Map category slugs to filesystem directories
  const CATEGORY_DIR_MAP: Record<string, string> = {
    "frontend-concepts": "frontend",
    "backend-concepts": "backend",
    "functional-requirements": "functional-requirements",
    "non-functional-requirements": "non-functional-requirements",
  };
  const fsCategory = CATEGORY_DIR_MAP[category] || category;

  return `@/content/articles/${articlesBase}/${fsCategory}/${subcategory}/${topic}`;
}

/**
 * Load an article by its path components
 * 
 * Note: This uses dynamic import which requires the component to be wrapped in Suspense
 */
export async function loadArticle(params: {
  domain: string;
  category: string;
  subcategory: string;
  topic: string;
}) {
  const importPath = getArticleImportPath(params);

  try {
    const module = await import(importPath);

    if (!module.default) {
      return null;
    }

    return {
      metadata: module.metadata as ArticleMetadata,
      component: module.default,
    };
  } catch (error) {
    console.warn(`Failed to load article: ${importPath}`, error);
    return null;
  }
}

/**
 * Get all available article paths for static generation
 * Note: This is a build-time function that scans the filesystem
 */
export function getAllArticlePaths() {
  // This needs to be run at build time, not runtime
  // For now, return empty array - static params will be generated differently
  return [];
}

/**
 * Get article metadata without loading the component
 */
export function getArticleMetadata(_registryKey: string): ArticleMetadata | null {
  // Metadata is loaded with the component
  return null;
}
