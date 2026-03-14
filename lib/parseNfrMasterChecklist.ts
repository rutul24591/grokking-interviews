import { slugify } from "@/lib/slugify";
import type { Topic } from "@/types/content";

export type NfrSectionSlug =
  | "frontend-non-functional-requirements"
  | "backend-non-functional-requirements"
  | "shared-cross-cutting-nfrs"
  | "bonus-advanced-nfrs";

function makeUniqueId(prefix: string, name: string, counts: Map<string, number>) {
  const base = `${prefix}${slugify(name)}`;
  const seen = counts.get(base) ?? 0;
  counts.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen + 1}`;
}

export function parseNfrMasterChecklist(input: string): Record<NfrSectionSlug, Topic[]> {
  const result: Record<NfrSectionSlug, Topic[]> = {
    "frontend-non-functional-requirements": [],
    "backend-non-functional-requirements": [],
    "shared-cross-cutting-nfrs": [],
    "bonus-advanced-nfrs": [],
  };

  const topicIdCountsBySection = new Map<NfrSectionSlug, Map<string, number>>([
    ["frontend-non-functional-requirements", new Map()],
    ["backend-non-functional-requirements", new Map()],
    ["shared-cross-cutting-nfrs", new Map()],
    ["bonus-advanced-nfrs", new Map()],
  ]);

  const lines = input.split(/\r?\n/);
  let currentSection: NfrSectionSlug | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      const heading = headingMatch[1].toLowerCase();

      if (heading.includes("frontend non-functional requirements")) {
        currentSection = "frontend-non-functional-requirements";
        continue;
      }
      if (heading.includes("backend non-functional requirements")) {
        currentSection = "backend-non-functional-requirements";
        continue;
      }
      if (heading.includes("shared") && heading.includes("cross-cutting")) {
        currentSection = "shared-cross-cutting-nfrs";
        continue;
      }
      if (heading.includes("bonus") && heading.includes("advanced")) {
        currentSection = "bonus-advanced-nfrs";
        continue;
      }

      currentSection = null;
      continue;
    }

    if (!currentSection) continue;

    const itemMatch = line.match(/^\d+\.\s+(.+)$/);
    if (!itemMatch) continue;

    const itemName = itemMatch[1].replace(/\\\s*$/, "").trim();
    if (!itemName) continue;

    const counts = topicIdCountsBySection.get(currentSection);
    if (!counts) continue;

    result[currentSection].push({
      id: makeUniqueId("topic-nfr-", itemName, counts),
      name: itemName,
    });
  }

  return result;
}

