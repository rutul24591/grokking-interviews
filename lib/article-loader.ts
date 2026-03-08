import { articleRegistry } from "@/content/registry";
import type { ArticleVersion } from "@/types/article";

export async function loadArticle(
  category: string,
  subcategory: string,
  topic: string,
  version: ArticleVersion
) {
  const path = `${category}/${subcategory}/${topic}-${version}`;
  const entry = articleRegistry[path];

  if (!entry) {
    return null;
  }

  try {
    const module = await entry.loader();

    return {
      metadata: entry.metadata,
      component: module.default,
    };
  } catch (error) {
    console.error(`Failed to load article at path: ${path}`, error);
    return null;
  }
}

export function getAllArticlePaths() {
  const paths = Object.keys(articleRegistry).map((path) => {
    const parts = path.split("/");

    // Handle paths like: frontend/rendering-strategies/client-side-rendering-concise
    if (parts.length !== 3) {
      console.warn(`Invalid article path format: ${path}`);
      return null;
    }

    const [category, subcategory, topicWithVersion] = parts;
    // Remove the version suffix (-concise or -extensive)
    const topic = topicWithVersion.replace(/-(?:extensive|concise)$/, "");

    return { category, subcategory, topic };
  });

  // Filter out nulls and remove duplicates (since each topic has 2 versions)
  const uniquePaths = Array.from(
    new Map(
      paths
        .filter((p): p is { category: string; subcategory: string; topic: string } => p !== null)
        .map((p) => [`${p.category}/${p.subcategory}/${p.topic}`, p])
    ).values()
  );

  return uniquePaths;
}

export function getArticleVersions(
  category: string,
  subcategory: string,
  topic: string
): ArticleVersion[] {
  const concisePath = `${category}/${subcategory}/${topic}-concise`;
  const extensivePath = `${category}/${subcategory}/${topic}-extensive`;

  const versions: ArticleVersion[] = [];

  if (articleRegistry[concisePath]) {
    versions.push("concise");
  }

  if (articleRegistry[extensivePath]) {
    versions.push("extensive");
  }

  return versions;
}
