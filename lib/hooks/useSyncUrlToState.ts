"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/features/sidebar/sidebar.store";
import { sidebarData } from "@/features/sidebar/sidebar.mock";
import { slugify } from "@/lib/slugify";

/**
 * Syncs the current URL pathname with the sidebar state
 * This ensures the sidebar highlights the correct item when:
 * - User navigates directly to a URL
 * - User refreshes the page
 * - User uses browser back/forward buttons
 */
export function useSyncUrlToState() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Skip if pathname hasn't changed (prevents unnecessary store updates)
    if (prevPathname.current === pathname && prevPathname.current !== pathname) return;
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
        for (const subCategoryItem of subCategory.subCategories || []) {
          const itemSlug = slugify(subCategoryItem.name);

          if (itemSlug !== subcategorySlug) continue;

          if (segments.length === 2) {
            setSelectedSubCategoryId(subCategory.id);
            setSelectedSubCategoryItemId(subCategoryItem.id);
            setSelectedTopicId(null);
            const idsToExpand = [
              category.id,
              subCategory.id,
              ...expandedIds,
            ];
            setExpanded(Array.from(new Set(idsToExpand)));
            return;
          }

          // Topic level (e.g., /frontend/rendering-strategies/client-side-rendering)
          if (topicSlug) {
            for (const topic of subCategoryItem.topics || []) {
              const topicSlugged = slugify(topic.name.replace(/\s*\([^)]*\)/g, "").trim());

              if (
                topicSlugged.includes(topicSlug) ||
                topicSlug.includes(topicSlugged)
              ) {
                setSelectedSubCategoryId(subCategory.id);
                setSelectedSubCategoryItemId(subCategoryItem.id);
                setSelectedTopicId(topic.id);

                const idsToExpand = [
                  category.id,
                  subCategory.id,
                  subCategoryItem.id,
                  ...expandedIds,
                ];
                setExpanded(Array.from(new Set(idsToExpand)));
                return;
              }
            }
          }
        }
      }
    }
  }, [pathname]);
}
