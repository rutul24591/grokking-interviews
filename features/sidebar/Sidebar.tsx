"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sidebarData } from "@/features/sidebar/sidebar.mock";
import { SidebarItem } from "@/features/sidebar/SidebarItem";
import { useSidebarStore } from "@/features/sidebar/sidebar.store";
import { slugify } from "@/lib/slugify";
import type { SubCategoryItem } from "@/types/content";

type SidebarProps = {
  frontendSubCategories: SubCategoryItem[];
};

export function Sidebar({ frontendSubCategories }: SidebarProps) {
  const router = useRouter();

  useEffect(() => {
    useSidebarStore.persist.rehydrate();
  }, []);

  const selectedSubCategoryId = useSidebarStore((state) => state.selectedSubCategoryId);
  const selectedSubCategoryItemId = useSidebarStore(
    (state) => state.selectedSubCategoryItemId
  );
  const setSelectedSubCategoryId = useSidebarStore((state) => state.setSelectedSubCategoryId);
  const setSelectedSubCategoryItemId = useSidebarStore(
    (state) => state.setSelectedSubCategoryItemId
  );

  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);

  // Navigate to category page (e.g., /frontend)
  const handleSubCategorySelect = (subCategoryId: string, subCategoryName: string) => {
    setSelectedSubCategoryId(subCategoryId);
    const categorySlug = slugify(subCategoryName).replace(/-concepts$/, "");
    setMobileOpen(false);
    router.push(`/${categorySlug}`);
  };

  // Navigate to subcategory page (e.g., /frontend/rendering-strategies)
  const handleSubCategoryItemSelect = (
    subCategoryId: string,
    subCategoryItemId: string,
    subCategoryName: string,
    subCategoryItemName: string,
  ) => {
    setSelectedSubCategoryId(subCategoryId);
    setSelectedSubCategoryItemId(subCategoryItemId);
    const categorySlug = slugify(subCategoryName).replace(/-concepts$/, "");
    const subcategorySlug = slugify(subCategoryItemName);
    setMobileOpen(false);
    router.push(`/${categorySlug}/${subcategorySlug}`);
  };

  return (
    <nav
      className="h-full overflow-y-auto px-3 pb-6 pt-4"
      aria-label="Interview prep navigation"
      role="tree"
    >
      <div className="space-y-3">
        {sidebarData.map((category) => (
          <SidebarItem key={category.id} id={category.id} label={category.name} level={1}>
            {category.subCategories.map((subCategory) => {
              // Use parsed data for Frontend, mock data for others
              const subCategoryItems = subCategory.id === "sub-frontend"
                ? frontendSubCategories
                : (subCategory.subCategories ?? []);

              return (
                <SidebarItem
                  key={subCategory.id}
                  id={subCategory.id}
                  label={subCategory.name}
                  level={2}
                  isActive={selectedSubCategoryId === subCategory.id}
                  onSelect={() => handleSubCategorySelect(subCategory.id, subCategory.name)}
                >
                  {/* Render SubCategoryItems (third level - now leaf nodes) */}
                  {subCategoryItems.map((subCategoryItem) => (
                    <SidebarItem
                      key={subCategoryItem.id}
                      id={subCategoryItem.id}
                      label={subCategoryItem.name}
                      level={3}
                      isLeaf
                      isActive={selectedSubCategoryItemId === subCategoryItem.id}
                      onSelect={() =>
                        handleSubCategoryItemSelect(
                          subCategory.id,
                          subCategoryItem.id,
                          subCategory.name,
                          subCategoryItem.name,
                        )
                      }
                    />
                  ))}
                </SidebarItem>
              );
            })}
          </SidebarItem>
        ))}
      </div>
    </nav>
  );
}
