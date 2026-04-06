import type { BreadcrumbItem, TruncationConfig } from "./breadcrumb-types";

// truncateBreadcrumbs collapses middle items into an ellipsis when the trail
// exceeds the visible limit. Keeps the first N and last M items visible.
export function truncateBreadcrumbs(
  items: BreadcrumbItem[],
  config: TruncationConfig
): BreadcrumbItem[] {
  const { visibleLimit, keepFirst, keepLast } = config;

  // If within limit, return unchanged
  if (items.length <= visibleLimit) {
    return items;
  }

  // Collect hidden items (the middle portion that will be collapsed)
  const hiddenItems = items.slice(keepFirst, items.length - keepLast);

  // Build the truncated array
  const firstItems = items.slice(0, keepFirst);
  const lastItems = items.slice(items.length - keepLast);

  // Create ellipsis item with hidden items attached for expand-on-click
  const ellipsisItem: BreadcrumbItem = {
    label: "...",
    href: "",
    isCurrent: false,
    isEllipsis: true,
    hiddenItems,
  };

  return [...firstItems, ellipsisItem, ...lastItems];
}

// expandEllipsis replaces the ellipsis item with the hidden items in-place.
// Returns a new array with the full trail restored.
export function expandEllipsis(items: BreadcrumbItem[]): BreadcrumbItem[] {
  const result: BreadcrumbItem[] = [];

  for (const item of items) {
    if (item.isEllipsis && item.hiddenItems) {
      result.push(...item.hiddenItems);
    } else {
      result.push(item);
    }
  }

  return result;
}
