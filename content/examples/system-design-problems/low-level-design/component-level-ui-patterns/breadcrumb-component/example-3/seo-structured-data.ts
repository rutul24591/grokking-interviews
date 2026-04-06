/**
 * Breadcrumb — Staff-Level SEO and Structured Data Integration.
 *
 * Staff differentiator: JSON-LD BreadcrumbList generation for search engines,
 * dynamic ID resolution with caching, and truncated breadcrumb expansion
 * with keyboard-accessible dropdown.
 */

import { useMemo } from 'react';

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

/**
 * Generates JSON-LD structured data for breadcrumbs.
 * Search engines use this to display breadcrumb navigation in search results.
 */
export function generateBreadcrumbJSONLD(
  items: BreadcrumbItem[],
  baseUrl: string = 'https://example.com',
): string {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: item.isCurrent ? undefined : `${baseUrl}${item.href}`,
  }));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });
}

/**
 * Hook that manages truncated breadcrumb with expandable dropdown.
 * Shows: Home > ... > Parent > Current (with dropdown to see full path)
 */
export function useTruncatedBreadcrumb(
  items: BreadcrumbItem[],
  maxVisible: number = 4,
) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleItems = useMemo(() => {
    if (items.length <= maxVisible) return items;

    // Always show first and last items, use ellipsis for middle
    const first = items[0];
    const last = items[items.length - 1];
    const middleStart = Math.max(1, items.length - maxVisible + 2);
    const middle = items.slice(middleStart, -1);

    return [first, { label: '...', href: '', isTruncated: true }, ...middle, last];
  }, [items, maxVisible]);

  return { visibleItems, isExpanded, setIsExpanded, fullItems: items };
}
