"use client";

import { useMemo } from "react";
import { generateBreadcrumbs } from "../lib/breadcrumb-generator";
import { truncateBreadcrumbs } from "../lib/breadcrumb-truncator";
import { generateBreadcrumbJSONLD } from "../lib/breadcrumb-seo";
import {
  DEFAULT_CONFIG,
  DEFAULT_TRUNCATION,
  type BreadcrumbConfig,
  type BreadcrumbItem,
} from "../lib/breadcrumb-types";

interface UseBreadcrumbsResult {
  items: BreadcrumbItem[];
  jsonLD: string;
}

// useBreadcrumbs is the main hook that ties together generation, truncation, and SEO.
// It accepts the current path and optional configuration, and returns the final
// breadcrumb items array and JSON-LD schema string.
export function useBreadcrumbs(
  path: string,
  config?: Partial<BreadcrumbConfig>
): UseBreadcrumbsResult {
  const resolvedConfig: BreadcrumbConfig = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...config,
      truncation: {
        ...DEFAULT_TRUNCATION,
        ...config?.truncation,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(config)]
  );

  return useMemo(() => {
    // Step 1: Generate breadcrumbs from path
    const items = generateBreadcrumbs(
      path,
      resolvedConfig.labelOverrides,
      resolvedConfig.idResolver
    );

    // Step 2: Apply truncation
    const truncatedItems = truncateBreadcrumbs(items, resolvedConfig.truncation);

    // Step 3: Generate JSON-LD schema (uses full trail, not truncated)
    const jsonLD = generateBreadcrumbJSONLD(items, resolvedConfig.baseUrl);

    return { items: truncatedItems, jsonLD };
  }, [path, resolvedConfig]);
}
