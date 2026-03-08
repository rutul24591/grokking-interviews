import type { SubCategoryItem } from "@/types/content";
import { slugify } from "@/lib/slugify";

function makeUniqueId(prefix: string, name: string, counts: Map<string, number>) {
  const base = `${prefix}${slugify(name)}`;
  const seen = counts.get(base) ?? 0;
  counts.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen + 1}`;
}

export function parseFrontendConcepts(input: string): SubCategoryItem[] {
  const lines = input.split(/\r?\n/).map((line) => line.trim());
  const subCategoryIdCounts = new Map<string, number>();
  const topicIdCounts = new Map<string, number>();
  const result: SubCategoryItem[] = [];

  let current: SubCategoryItem | null = null;

  for (const line of lines) {
    if (!line) {
      continue;
    }

    const sectionMatch = line.match(/^\d+\.\s+(.+)$/);
    if (sectionMatch) {
      current = {
        id: makeUniqueId("sub-frontend-", sectionMatch[1], subCategoryIdCounts),
        name: sectionMatch[1],
        topics: [],
      };
      result.push(current);
      continue;
    }

    const bulletMatch = line.match(/^[•*-]\s+(.+)$/);
    if (bulletMatch && current) {
      current.topics.push({
        id: makeUniqueId("topic-frontend-", bulletMatch[1], topicIdCounts),
        name: bulletMatch[1],
      });
    }
  }

  return result;
}
