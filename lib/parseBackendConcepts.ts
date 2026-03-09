import type { SubCategoryItem } from "@/types/content";
import { slugify } from "@/lib/slugify";

function makeUniqueId(prefix: string, name: string, counts: Map<string, number>) {
  const base = `${prefix}${slugify(name)}`;
  const seen = counts.get(base) ?? 0;
  counts.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen + 1}`;
}

export function parseBackendConcepts(input: string): SubCategoryItem[] {
  const lines = input.split(/\r?\n/).map((line) => line.trim());
  const subCategoryIdCounts = new Map<string, number>();
  const topicIdCounts = new Map<string, number>();
  const result: SubCategoryItem[] = [];

  let current: SubCategoryItem | null = null;
  let pastToc = false;

  for (const line of lines) {
    if (!line) {
      continue;
    }

    // Skip the Table of Contents block (lines before the first actual section "1. ...")
    // The ToC has entries like "1. Fundamentals & Building Blocks" without topics following them.
    // We detect the end of ToC when we hit "1. " for the second time.
    const mainSectionMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (mainSectionMatch) {
      const sectionNum = mainSectionMatch[1];
      if (sectionNum === "1" && !pastToc) {
        // First time seeing "1." — this is in the ToC, skip until we see "1." again
        pastToc = true;
        continue;
      }
      if (sectionNum === "1" && pastToc && result.length === 0) {
        // Second time seeing "1." — this is the actual first section
        current = {
          id: makeUniqueId("sub-backend-", mainSectionMatch[2], subCategoryIdCounts),
          name: mainSectionMatch[2],
          topics: [],
        };
        result.push(current);
        continue;
      }
      if (pastToc && result.length === 0) {
        // Still in ToC (sections 2-13 before the real content starts)
        continue;
      }
      // Regular main section (after ToC)
      current = {
        id: makeUniqueId("sub-backend-", mainSectionMatch[2], subCategoryIdCounts),
        name: mainSectionMatch[2],
        topics: [],
      };
      result.push(current);
      continue;
    }

    // Sub-section headers like "2.1 SQL Databases" are folded into the
    // current main section. We ignore these headings so bullets keep
    // accumulating under the parent section.
    const subSectionMatch = line.match(/^\d+\.\d+\s+(.+)$/);
    if (subSectionMatch && pastToc) {
      continue;
    }

    // Bullet points — topics
    const bulletMatch = line.match(/^[•*-]\s+(.+)$/);
    if (bulletMatch && current) {
      // Extract just the topic name (before the dash description)
      const topicName = bulletMatch[1].split(" - ")[0].trim();
      current.topics.push({
        id: makeUniqueId("topic-backend-", topicName, topicIdCounts),
        name: topicName,
      });
      continue;
    }

    // Skip description lines (e.g., "Understanding different storage systems...")
    // These are lines that don't match any pattern above — just ignore them
  }

  return result;
}
