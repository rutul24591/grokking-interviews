"use client";

import type { SeparatorType } from "../lib/breadcrumb-types";

interface BreadcrumbSeparatorProps {
  type: SeparatorType;
  customNode?: React.ReactNode;
}

// BreadcrumbSeparator renders the separator between breadcrumb items.
// Supports slash, chevron-right SVG, or a custom React node.
export function BreadcrumbSeparator({
  type,
  customNode,
}: BreadcrumbSeparatorProps) {
  if (type === "custom" && customNode) {
    return (
      <span aria-hidden="true" className="mx-2 text-muted-foreground">
        {customNode}
      </span>
    );
  }

  if (type === "slash") {
    return (
      <span
        aria-hidden="true"
        className="mx-2 text-muted-foreground select-none"
      >
        /
      </span>
    );
  }

  // Chevron-right SVG
  return (
    <span aria-hidden="true" className="mx-1 text-muted-foreground">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="inline-block"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </span>
  );
}
