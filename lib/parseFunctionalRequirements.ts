import { slugify } from "@/lib/slugify";
import type { Topic } from "@/types/content";

export type FunctionalRequirementGroup = {
  id: string;
  name: string;
  slug: string;
  items: Topic[];
};

export type FunctionalRequirementCategory = {
  id: string;
  name: string;
  slug: string;
  groups: FunctionalRequirementGroup[];
};

function makeUniqueId(prefix: string, name: string, counts: Map<string, number>) {
  const base = `${prefix}${slugify(name)}`;
  const seen = counts.get(base) ?? 0;
  counts.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen + 1}`;
}

export function parseFunctionalRequirements(
  input: string,
): FunctionalRequirementCategory[] {
  const lines = input.split(/\r?\n/).map((line) => line.trim());

  const categoryIdCounts = new Map<string, number>();
  const groupIdCountsByCategorySlug = new Map<string, Map<string, number>>();
  const itemIdCountsByGroupKey = new Map<string, Map<string, number>>();

  const result: FunctionalRequirementCategory[] = [];

  let currentCategory: FunctionalRequirementCategory | null = null;
  let currentGroup: FunctionalRequirementGroup | null = null;

  for (const line of lines) {
    if (!line) continue;

    // Separator between sections
    if (/^-{5,}$/.test(line)) {
      currentGroup = null;
      continue;
    }

    // Main category header like "1. Identity & Access"
    const categoryMatch = line.match(/^\d+\.\s+(.+)$/);
    if (categoryMatch) {
      const name = categoryMatch[1].trim();
      const slug = slugify(name);

      currentCategory = {
        id: makeUniqueId("sub-functional-requirements-", name, categoryIdCounts),
        name,
        slug,
        groups: [],
      };
      result.push(currentCategory);
      currentGroup = null;

      groupIdCountsByCategorySlug.set(slug, new Map());
      continue;
    }

    if (!currentCategory) {
      continue;
    }

    // Bullet item
    const bulletMatch = line.match(/^-+\s+(.+)$/);
    if (bulletMatch) {
      if (!currentGroup) continue;

      const itemName = bulletMatch[1].trim();
      if (!itemName) continue;

      const groupKey = `${currentCategory.slug}/${currentGroup.slug}`;
      const counts = itemIdCountsByGroupKey.get(groupKey) ?? new Map<string, number>();
      itemIdCountsByGroupKey.set(groupKey, counts);

      currentGroup.items.push({
        id: makeUniqueId("topic-functional-requirements-item-", itemName, counts),
        name: itemName,
      });
      continue;
    }

    // Group header (e.g., "Frontend", "Backend", "Other", or any sub-heading in section 8)
    const groupName = line;
    const categoryCounts = groupIdCountsByCategorySlug.get(currentCategory.slug);
    if (!categoryCounts) continue;

    const groupSlug = slugify(groupName);
    const group: FunctionalRequirementGroup = {
      id: makeUniqueId(
        `topic-functional-requirements-group-${currentCategory.slug}-`,
        groupName,
        categoryCounts,
      ),
      name: groupName,
      slug: groupSlug,
      items: [],
    };
    currentCategory.groups.push(group);
    currentGroup = group;
  }

  return result;
}

