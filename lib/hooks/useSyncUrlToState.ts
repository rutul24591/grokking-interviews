"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/features/sidebar/sidebar.store";
import { sidebarData } from "@/features/sidebar/sidebar.mock";
import { slugify } from "@/lib/slugify";
import type { SubCategoryItem } from "@/types/content";

/**
 * Syncs the current URL pathname with the sidebar state
 * This ensures the sidebar highlights the correct item when:
 * - User navigates directly to a URL
 * - User refreshes the page
 * - User uses browser back/forward buttons
 */
export function useSyncUrlToState({
  frontendSubCategories,
  backendSubCategories,
}: {
  frontendSubCategories: SubCategoryItem[];
  backendSubCategories: SubCategoryItem[];
}) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Skip if pathname hasn't changed (prevents unnecessary store updates)
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    const {
      setSelectedSubCategoryId,
      setSelectedSubCategoryItemId,
      setSelectedTopicId,
      setExpanded,
      expandedIds,
    } = useSidebarStore.getState();

    // Home page - clear selections
    if (pathname === "/") {
      setSelectedSubCategoryId(null);
      return;
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return;

    const [categorySlug, subcategorySlug, topicSlug] = segments;

    // Find matching items in sidebarData
    for (const category of sidebarData) {
      for (const subCategory of category.subCategories) {
        const subCatSlug = slugify(subCategory.name).replace(/-concepts$/, "");

        if (subCatSlug !== categorySlug) continue;

        // Category-level page (e.g., /frontend)
        if (segments.length === 1) {
          setSelectedSubCategoryId(subCategory.id);
          setSelectedSubCategoryItemId(null);
          setSelectedTopicId(null);
          const idsToExpand = [category.id, subCategory.id, ...expandedIds];
          setExpanded(Array.from(new Set(idsToExpand)));
          return;
        }

        // SubCategoryItem level (e.g., /frontend/rendering-strategies)
        const resolvedItems = subCategory.id === "sub-frontend"
          ? frontendSubCategories
          : subCategory.id === "sub-backend"
            ? backendSubCategories
            : (subCategory.subCategories || []);

        for (const subCategoryItem of resolvedItems) {
          const itemSlug = slugify(subCategoryItem.name);

          if (itemSlug !== subcategorySlug) continue;

          // We always select the matching subcategory item once found (even if a deeper segment exists).
          setSelectedSubCategoryId(subCategory.id);
          setSelectedSubCategoryItemId(subCategoryItem.id);

          const idsToExpand = [
            category.id,
            subCategory.id,
            ...expandedIds,
          ];
          setExpanded(Array.from(new Set(idsToExpand)));

          // SubCategoryItem level (e.g., /frontend/rendering-strategies)
          if (segments.length === 2) {
            setSelectedTopicId(null);
            return;
          }

          // Topic level (e.g., /frontend/rendering-strategies/client-side-rendering)
          if (topicSlug) {
            for (const topic of subCategoryItem.topics || []) {
              const topicSlugged = slugify(
                topic.name.replace(/\s*\([^)]*\)/g, "").trim(),
              );

              if (
                topicSlugged.includes(topicSlug) ||
                topicSlug.includes(topicSlugged)
              ) {
                setSelectedTopicId(topic.id);
                return;
              }
            }
          }

          // Topic not found (or not applicable for this subcategory)
          setSelectedTopicId(null);
          return;
        }
      }
    }
  }, [pathname]);
}
