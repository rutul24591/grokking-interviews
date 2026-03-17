import type { Domain, Category, Subcategory, Topic } from "@/features/sidebar/sidebar.store";

/**
 * Parse the hierarchy-data.txt file into structured data.
 * Format:
 * 1.  Domain Name
 *     a.  Category Name
 *         1.  Subcategory Name
 *         • Topic Name
 *         • Topic Name
 */

export function parseHierarchy(content: string): Domain[] {
  const lines = content.split("\n");
  const domains: Domain[] = [];

  let currentDomain: Domain | null = null;
  let currentCategory: Category | null = null;
  let currentSubcategory: Subcategory | null = null;

  for (const line of lines) {
    // Skip empty lines and "Coming soon" lines
    if (!line.trim() || line.includes("Coming soon")) continue;

    // Domain level: "1.  Domain Name"
    const domainMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (domainMatch) {
      currentDomain = {
        id: `domain-${domainMatch[1]}`,
        name: domainMatch[2].trim(),
        slug: slugify(domainMatch[2]),
        categories: [],
      };
      domains.push(currentDomain);
      currentCategory = null;
      currentSubcategory = null;
      continue;
    }

    // Category level: "    a.  Category Name"
    const categoryMatch = line.match(/^\s{4}([a-z])\.\s+(.+)$/);
    if (categoryMatch && currentDomain) {
      currentCategory = {
        id: `${currentDomain.id}-cat-${categoryMatch[1]}`,
        name: categoryMatch[2].trim(),
        slug: slugify(categoryMatch[2]),
        subcategories: [],
      };
      currentDomain.categories.push(currentCategory);
      currentSubcategory = null;
      continue;
    }

    // Subcategory level: "        1.  Subcategory Name"
    const subcategoryMatch = line.match(/^\s{8}(\d+)\.\s+(.+)$/);
    if (subcategoryMatch && currentCategory) {
      currentSubcategory = {
        id: `${currentCategory.id}-sub-${subcategoryMatch[1]}`,
        name: subcategoryMatch[2].trim(),
        slug: slugify(subcategoryMatch[2]),
        topics: [],
      };
      currentCategory.subcategories.push(currentSubcategory);
      continue;
    }

    // Topic level: "        • Topic Name"
    const topicMatch = line.match(/^\s{8}•\s+(.+)$/);
    if (topicMatch && currentSubcategory) {
      const topicName = topicMatch[1].trim();
      const topic: Topic = {
        id: `${currentSubcategory.id}-topic-${slugify(topicName)}`,
        name: topicName,
        slug: slugify(topicName),
      };
      currentSubcategory.topics.push(topic);
      continue;
    }
  }

  return domains;
}

/**
 * Convert slug to display name
 */
export function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Convert string to URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Get the full path for a topic
 */
export function getTopicPath(
  domains: Domain[],
  topicSlug: string
): { domain: Domain; category: Category; subcategory: Subcategory; topic: Topic } | null {
  for (const domain of domains) {
    for (const category of domain.categories) {
      for (const subcategory of category.subcategories) {
        for (const topic of subcategory.topics) {
          if (topic.slug === topicSlug) {
            return { domain, category, subcategory, topic };
          }
        }
      }
    }
  }
  return null;
}

/**
 * Get all topics as a flat list for quick lookup
 */
export function getAllTopics(domains: Domain[]): Topic[] {
  const topics: Topic[] = [];
  for (const domain of domains) {
    for (const category of domain.categories) {
      for (const subcategory of category.subcategories) {
        topics.push(...subcategory.topics);
      }
    }
  }
  return topics;
}
