import { articleRegistry } from "@/content/registry";
export async function loadArticle(
  category: string,
  subcategory: string,
  topic: string
) {
  const path = `${category}/${subcategory}/${topic}`;
  const entry = articleRegistry[path];

  if (!entry) {
    return null;
  }

  try {
    const loaded = await entry.loader();

    return {
      metadata: entry.metadata,
      component: loaded.default,
    };
  } catch (error) {
    console.error(`Failed to load article at path: ${path}`, error);
    return null;
  }
}

export function getAllArticlePaths() {
  const paths = Object.keys(articleRegistry).map((path) => {
    const parts = path.split("/");

    if (parts.length !== 3) {
      console.warn(`Invalid article path format: ${path}`);
      return null;
    }

    const [category, subcategory, topic] = parts;

    return { category, subcategory, topic };
  });

  return paths.filter(
    (p): p is { category: string; subcategory: string; topic: string } => p !== null
  );
}
