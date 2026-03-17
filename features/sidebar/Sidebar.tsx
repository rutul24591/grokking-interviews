"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSidebarStore, type Domain } from "@/features/sidebar/sidebar.store";
import { SidebarContext } from "@/features/sidebar/SidebarContext";
import { SidebarItem, CategoryItem } from "@/features/sidebar/SidebarItem";
import { classNames } from "@/lib/classNames";

type SidebarProps = {
  domains: Domain[];
};

export function Sidebar({ domains }: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const { focusedItemId, setFocusedItemId } = useSidebarContextValue();

  const {
    expandedDomains,
    expandedCategories,
    expandedSubcategories,
    isMobileOpen,
    setMobileOpen,
    selectTopic,
  } = useSidebarStore();

  // Auto-expand based on current path
  useEffect(() => {
    if (!pathname) return;

    const parts = pathname.split("/").filter(Boolean);
    // Path format: /articles/{domain}/{category}/{subcategory}
    if (parts[0] === "articles" && parts.length >= 4) {
      const domainId = `domain-${parts[1]}`;
      const categoryId = `${domainId}-cat-${parts[2]}`;
      const subcategoryId = `${categoryId}-sub-${parts[3]}`;

      // Expand the path to current location
      const state = useSidebarStore.getState();
      if (!state.expandedDomains.includes(domainId)) {
        useSidebarStore.getState().toggleDomain(domainId);
      }
      if (!state.expandedCategories.includes(categoryId)) {
        useSidebarStore.getState().toggleCategory(categoryId);
      }
      if (!state.expandedSubcategories.includes(subcategoryId)) {
        useSidebarStore.getState().toggleSubcategory(subcategoryId);
      }
    }
  }, [pathname]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const allItems = getAllNavigableItems(domains);
      const currentIndex = allItems.findIndex(
        (item) => item.id === focusedItemId,
      );

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < allItems.length - 1) {
            setFocusedItemId(allItems[currentIndex + 1].id);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            setFocusedItemId(allItems[currentIndex - 1].id);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          // Expand current item if it has children
          if (currentIndex >= 0) {
            const item = allItems[currentIndex];
            if (item.hasChildren) {
              item.onExpand?.();
            }
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          // Collapse current item if it has children and is expanded
          if (currentIndex >= 0) {
            const item = allItems[currentIndex];
            if (item.hasChildren) {
              item.onCollapse?.();
            }
          }
          break;
        case "Home":
          e.preventDefault();
          if (allItems.length > 0) {
            setFocusedItemId(allItems[0].id);
          }
          break;
        case "End":
          e.preventDefault();
          if (allItems.length > 0) {
            setFocusedItemId(allItems[allItems.length - 1].id);
          }
          break;
      }
    },
    [domains, focusedItemId, setFocusedItemId],
  );

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        className={classNames(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-80 overflow-y-auto border-r border-theme bg-theme-80",
          "transition-transform duration-300 lg:translate-x-0 lg:static lg:h-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        onKeyDown={handleKeyDown}
        role="tree"
        aria-label="Navigation sidebar"
      >
        <div className="p-4">
          <SidebarContext.Provider value={{ focusedItemId, setFocusedItemId }}>
            {domains.map((domain) => (
              <div key={domain.id} className="mb-4">
                <SidebarItem
                  id={domain.id}
                  name={domain.name}
                  slug={domain.slug}
                  level="domain"
                  hasChildren={domain.categories.length > 0}
                >
                  {domain.categories.map((category) => (
                    <CategoryItem
                      key={category.id}
                      category={category}
                      domainSlug={domain.slug}
                    />
                  ))}
                </SidebarItem>
              </div>
            ))}
          </SidebarContext.Provider>
        </div>
      </motion.aside>

      {/* Mobile Toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(!isMobileOpen)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-theme bg-panel px-4 py-2 shadow-lg lg:hidden"
        aria-label="Toggle navigation menu"
      >
        <span>{isMobileOpen ? "✕" : "☰"}</span>
        <span className="text-sm font-medium">Menu</span>
      </button>
    </>
  );
}

// Helper hook for context value
function useSidebarContextValue() {
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  return { focusedItemId, setFocusedItemId };
}

// Helper to get all navigable items
function getAllNavigableItems(domains: Domain[]): Array<{
  id: string;
  hasChildren: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}> {
  const items: Array<{
    id: string;
    hasChildren: boolean;
    onExpand?: () => void;
    onCollapse?: () => void;
  }> = [];

  const state = useSidebarStore.getState();

  for (const domain of domains) {
    const isDomainExpanded = state.expandedDomains.includes(domain.id);
    items.push({
      id: domain.id,
      hasChildren: domain.categories.length > 0,
      onExpand: () => useSidebarStore.getState().toggleDomain(domain.id),
      onCollapse: () => {
        if (isDomainExpanded) {
          useSidebarStore.getState().toggleDomain(domain.id);
        }
      },
    });

    if (isDomainExpanded) {
      for (const category of domain.categories) {
        const isCategoryExpanded = state.expandedCategories.includes(
          category.id,
        );
        items.push({
          id: category.id,
          hasChildren: category.subcategories.length > 0,
          onExpand: () =>
            useSidebarStore.getState().toggleCategory(category.id),
          onCollapse: () => {
            if (isCategoryExpanded) {
              useSidebarStore.getState().toggleCategory(category.id);
            }
          },
        });

        if (isCategoryExpanded) {
          for (const subcategory of category.subcategories) {
            // Subcategories are now leaf nodes (clickable links)
            items.push({
              id: subcategory.id,
              hasChildren: false,
            });
          }
        }
      }
    }
  }

  return items;
}
