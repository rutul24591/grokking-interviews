"use client";

import { useFrontendData } from "@/lib/frontend-data-context";
import { sidebarData } from "@/features/sidebar/sidebar.mock";
import { slugify } from "@/lib/slugify";
import { SubCategoryPageContent } from "@/components/SubCategoryPageContent";
import { notFound } from "next/navigation";

type SubCategoryPageClientProps = {
  categorySlug: string;
  subcategorySlug: string;
  subCategoryName: string;
  subCategoryId: string;
};

export function SubCategoryPageClient({
  categorySlug,
  subcategorySlug,
  subCategoryName,
  subCategoryId,
}: SubCategoryPageClientProps) {
  const frontendData = useFrontendData();

  // Resolve items: use frontend context data for frontend category, otherwise static sidebar data
  const subCategory = sidebarData[0]?.subCategories.find(
    (sc) => sc.id === subCategoryId,
  );
  const items = subCategoryId === "sub-frontend" && frontendData.length > 0
    ? frontendData
    : subCategory?.subCategories ?? [];

  // Find the matching subcategory item
  const item = items.find((i) => slugify(i.name) === subcategorySlug);

  if (!item) {
    notFound();
  }

  return (
    <SubCategoryPageContent
      categorySlug={categorySlug}
      subCategoryName={subCategoryName}
      subcategorySlug={subcategorySlug}
      itemName={item.name}
      topics={item.topics}
    />
  );
}
