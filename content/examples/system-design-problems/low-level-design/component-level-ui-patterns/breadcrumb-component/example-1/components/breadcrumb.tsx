"use client";

import { useBreadcrumbs } from "../hooks/use-breadcrumbs";
import type { BreadcrumbConfig } from "../lib/breadcrumb-types";
import { BreadcrumbItem } from "./breadcrumb-item";
import { BreadcrumbSeparator } from "./breadcrumb-separator";
import { BreadcrumbMobile } from "./breadcrumb-mobile";

interface BreadcrumbProps {
  path: string;
  config?: Partial<BreadcrumbConfig>;
}

// Breadcrumb is the root component that renders the breadcrumb navigation.
// It handles responsive switching between desktop and mobile variants,
// renders JSON-LD schema markup, and orchestrates item rendering with separators.
export function Breadcrumb({ path, config }: BreadcrumbProps) {
  const { items, jsonLD } = useBreadcrumbs(path, config);

  const separatorType =
    typeof config?.separator === "string"
      ? config.separator
      : "chevron";
  const customNode =
    typeof config?.separator !== "string" ? config?.separator : undefined;

  return (
    <>
      {/* JSON-LD schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLD }}
      />

      {/* Desktop variant: visible on sm and above */}
      <nav
        aria-label="Breadcrumb"
        className="hidden sm:block"
      >
        <ol className="flex flex-wrap items-center gap-0">
          {items.map((item, index) => (
            <li key={`${item.href}-${index}`} className="flex items-center">
              <BreadcrumbItem item={item} />
              {index < items.length - 1 && (
                <BreadcrumbSeparator type={separatorType} customNode={customNode} />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Mobile variant: visible below sm breakpoint */}
      <nav
        aria-label="Breadcrumb"
        className="sm:hidden"
      >
        <BreadcrumbMobile
          items={items}
          separatorType={separatorType}
          customNode={customNode}
        />
      </nav>
    </>
  );
}
