import type { BreadcrumbItem } from "./breadcrumb-types";

interface SchemaListItem {
  "@type": string;
  position: number;
  name: string;
  item: string;
}

interface SchemaBreadcrumbList {
  "@context": string;
  "@type": string;
  itemListElement: SchemaListItem[];
}

// generateBreadcrumbJSONLD produces a JSON-LD BreadcrumbList string
// following the Schema.org specification.
export function generateBreadcrumbJSONLD(
  items: BreadcrumbItem[],
  baseUrl: string
): string {
  // Strip any ellipsis items from the schema — search engines should see the full trail
  const fullItems = items.filter((item) => !item.isEllipsis);

  // If ellipsis item has hidden items, expand them for the schema
  const expandedItems: BreadcrumbItem[] = [];
  for (const item of items) {
    if (item.isEllipsis && item.hiddenItems) {
      expandedItems.push(...item.hiddenItems);
    } else if (!item.isEllipsis) {
      expandedItems.push(item);
    }
  }

  const itemListElement: SchemaListItem[] = expandedItems.map(
    (item, index) => {
      const position = index + 1;
      const absoluteUrl = item.href.startsWith("http")
        ? item.href
        : `${baseUrl}${item.href}`;

      return {
        "@type": "ListItem",
        position,
        name: item.label,
        // For the current page (last item), use the URL without making it a link
        item: item.isCurrent ? absoluteUrl : absoluteUrl,
      };
    }
  );

  const schema: SchemaBreadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return JSON.stringify(schema);
}
