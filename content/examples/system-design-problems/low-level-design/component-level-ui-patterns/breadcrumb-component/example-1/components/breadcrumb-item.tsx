"use client";

import { useState } from "react";
import type { BreadcrumbItem } from "../lib/breadcrumb-types";
import { expandEllipsis } from "../lib/breadcrumb-truncator";

interface BreadcrumbItemProps {
  item: BreadcrumbItem;
  onExpand?: () => void;
}

// BreadcrumbItem renders a single breadcrumb entry.
// Current page items render as a span with aria-current, ellipsis items
// render as an expand button, and normal items render as links.
export function BreadcrumbItem({ item, onExpand }: BreadcrumbItemProps) {
  const [expanded, setExpanded] = useState(false);

  // Ellipsis item: clickable button to expand hidden items
  if (item.isEllipsis) {
    return (
      <>
        <button
          type="button"
          aria-label="Show collapsed breadcrumb items"
          className="inline-flex items-center rounded px-1.5 py-0.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={() => {
            setExpanded(true);
            onExpand?.();
          }}
        >
          ...
        </button>
      </>
    );
  }

  // Current page: non-navigable span with aria-current
  if (item.isCurrent) {
    return (
      <span
        aria-current="page"
        className="text-sm font-semibold text-foreground"
      >
        {item.label}
      </span>
    );
  }

  // Normal navigable link
  return (
    <a
      href={item.href}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {item.label}
    </a>
  );
}

// BreadcrumbItemExpanded renders the hidden items when the ellipsis is expanded.
interface BreadcrumbItemExpandedProps {
  items: BreadcrumbItem[];
  onRenderItem: (item: BreadcrumbItem) => React.ReactNode;
}

export function BreadcrumbItemExpanded({
  items,
  onRenderItem,
}: BreadcrumbItemExpandedProps) {
  const expandedItems = expandEllipsis([{
    label: "...",
    href: "",
    isCurrent: false,
    isEllipsis: true,
    hiddenItems: items,
  }]);

  return (
    <>
      {expandedItems.map((item, index) => (
        <span key={`${item.href}-${index}`}>
          {onRenderItem(item)}
        </span>
      ))}
    </>
  );
}
