"use client";

import { useFrontendData } from "@/lib/frontend-data-context";
import { CategoryPageContent } from "@/components/CategoryPageContent";
import type { SubCategoryItem } from "@/types/content";

type CategoryPageClientProps = {
  categorySlug: string;
  subCategoryName: string;
  subCategoryId: string;
  staticItems: SubCategoryItem[];
};

export function CategoryPageClient({
  categorySlug,
  subCategoryName,
  subCategoryId,
  staticItems,
}: CategoryPageClientProps) {
  const frontendData = useFrontendData();

  // Use frontend data from context for frontend category, otherwise use static sidebar data
  const subCategoryItems = subCategoryId === "sub-frontend" && frontendData.length > 0
    ? frontendData
    : staticItems;

  return (
    <CategoryPageContent
      categorySlug={categorySlug}
      subCategoryName={subCategoryName}
      subCategoryItems={subCategoryItems}
    />
  );
}
