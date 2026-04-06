"use client";

import { useEffect, useState } from "react";
import type { BreadcrumbItem, SeparatorType } from "../lib/breadcrumb-types";
import { BreadcrumbItem as BreadcrumbItemComponent } from "./breadcrumb-item";
import { BreadcrumbSeparator } from "./breadcrumb-separator";

interface BreadcrumbMobileProps {
  items: BreadcrumbItem[];
  separatorType: SeparatorType;
  customNode?: React.ReactNode;
}

// BreadcrumbMobile renders a compact mobile breadcrumb variant.
// Shows only the last two items with a dropdown button that reveals the full trail.
export function BreadcrumbMobile({
  items,
  separatorType,
  customNode,
}: BreadcrumbMobileProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when path changes
  useEffect(() => {
    setIsOpen(false);
  }, [items]);

  // Get the last two items for compact display
  const visibleItems = items.slice(-2);

  // Build the full list for the dropdown (expand any ellipsis)
  const fullItems: BreadcrumbItem[] = [];
  for (const item of items) {
    if (item.isEllipsis && item.hiddenItems) {
      fullItems.push(...item.hiddenItems);
    } else if (!item.isEllipsis) {
      fullItems.push(item);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {/* Dropdown toggle button */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label="Show full breadcrumb trail"
        className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        Menu
      </button>

      {/* Compact trail: last two items */}
      <div className="flex items-center gap-0 overflow-hidden">
        {visibleItems.map((item, index) => (
          <span key={`${item.href}-${index}`} className="flex items-center">
            {index > 0 && (
              <BreadcrumbSeparator type={separatorType} customNode={customNode} />
            )}
            <BreadcrumbItemComponent item={item} />
          </span>
        ))}
      </div>

      {/* Dropdown popover with full trail */}
      {isOpen && (
        <div className="absolute left-2 top-full z-50 mt-1 w-64 rounded-lg border border-border bg-popover p-2 shadow-lg">
          <ol className="space-y-1">
            {fullItems.map((item, index) => (
              <li key={`${item.href}-${index}`} className="flex items-center gap-0">
                {index > 0 && (
                  <BreadcrumbSeparator type={separatorType} customNode={customNode} />
                )}
                <BreadcrumbItemComponent item={item} />
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
