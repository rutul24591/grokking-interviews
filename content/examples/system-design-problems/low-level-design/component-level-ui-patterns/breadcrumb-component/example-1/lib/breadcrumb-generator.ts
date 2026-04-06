import type { BreadcrumbItem } from "./breadcrumb-types";

// slugToLabel converts a kebab-case URL slug to a human-readable title case label.
// Handles acronyms, numeric segments, and Unicode preservation.
export function slugToLabel(slug: string): string {
  // Preserve numeric-only segments as-is
  if (/^\d+$/.test(slug)) return slug;

  // Split on hyphens, capitalize each word
  const words = slug.split("-");
  return words
    .map((word) => {
      // Handle acronyms: keep them uppercase if all caps and short (2-4 chars)
      if (/^[A-Z]{2,4}$/.test(word)) return word;
      // Capitalize first letter, lowercase rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

// generateBreadcrumbs derives a breadcrumb trail from a URL path string.
// Accepts an optional labelOverrides map for context-sensitive label replacements.
// Accepts an optional idResolver to map dynamic ID segments to human-readable names.
export function generateBreadcrumbs(
  path: string,
  labelOverrides: Map<string, string> = new Map(),
  idResolver?: (segment: string) => string | null
): BreadcrumbItem[] {
  // Strip query parameters and hash
  const cleanPath = path.split("?")[0].split("#")[0];

  // Split on '/' and filter empty segments
  const segments = cleanPath.split("/").filter(Boolean);

  // Root path: return single "Home" item
  if (segments.length === 0) {
    return [
      { label: "Home", href: "/", isCurrent: false },
    ];
  }

  const items: BreadcrumbItem[] = [];
  let cumulativePath = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    cumulativePath += `/${segment}`;

    // Resolve label: check override map first, then try idResolver, then fall back to slugToLabel
    let label: string;
    const overrideKey = cumulativePath;

    if (labelOverrides.has(overrideKey)) {
      label = labelOverrides.get(overrideKey)!;
    } else if (idResolver && idResolver(segment)) {
      label = idResolver(segment)!;
    } else {
      label = slugToLabel(segment);
    }

    const isCurrent = i === segments.length - 1;

    items.push({
      label,
      href: cumulativePath,
      isCurrent,
    });
  }

  // Prepend "Home" if not already the root
  items.unshift({ label: "Home", href: "/", isCurrent: false });

  // If the path was root-level, mark the only item as non-current
  // (Home is always navigable unless it IS the current page)
  if (items.length === 2 && items[1].isCurrent) {
    // Normal case: Home > CurrentPage
  }

  return items;
}
