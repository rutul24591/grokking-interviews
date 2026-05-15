import { systemDesignConceptsRoutes } from "./system-design-concepts";
import { requirementsRoutes } from "./requirements";
import { systemDesignProblemsRoutes } from "./system-design-problems";
import { otherRoutes } from "./other";

export const articleRoutes: Record<string, () => Promise<any>> = {
  ...systemDesignConceptsRoutes,
  ...requirementsRoutes,
  ...systemDesignProblemsRoutes,
  ...otherRoutes,
};

/**
 * Get all article paths for static generation
 */
export function getAllArticlePaths() {
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
 * Load an article by its path
 */
export async function loadArticle(domain: string, category: string, subcategory: string, topic: string) {
  const key = `${domain}/${category}/${subcategory}/${topic}`;
  const loadModule = articleRoutes[key];

  if (!loadModule) {
    return null;
  }

  try {
    const module = await loadModule();
    return {
      metadata: module.metadata,
      component: module.default,
    };
  } catch {
    return null;
  }
}
