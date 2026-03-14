"use client";

import { useBackendData } from "@/lib/backend-data-context";
import { useFrontendData } from "@/lib/frontend-data-context";
import { sidebarData } from "@/features/sidebar/sidebar.mock";
import { slugify } from "@/lib/slugify";
import { SubCategoryPageContent } from "@/components/SubCategoryPageContent";
import { notFound } from "next/navigation";
import type { Topic } from "@/types/content";

type SubCategoryPageClientProps = {
  categorySlug: string;
  subcategorySlug: string;
  subCategoryName: string;
  subCategoryId: string;
  overrideTopics?: Topic[];
  disableTopicLinks?: boolean;
};

export function SubCategoryPageClient({
  categorySlug,
  subcategorySlug,
  subCategoryName,
  subCategoryId,
  overrideTopics,
  disableTopicLinks,
}: SubCategoryPageClientProps) {
  const frontendData = useFrontendData();
  const backendData = useBackendData();

  // Resolve items: use frontend context data for frontend category, otherwise static sidebar data
  const subCategory = sidebarData
    .flatMap((category) => category.subCategories)
    .find((sc) => sc.id === subCategoryId);
  const items = subCategoryId === "sub-frontend" && frontendData.length > 0
    ? frontendData
    : subCategoryId === "sub-backend" && backendData.length > 0
      ? backendData
      : subCategory?.subCategories ?? [];

  // Find the matching subcategory item
  const item = items.find((i) => slugify(i.name) === subcategorySlug);

  if (!item) {
    notFound();
  }

  const resolvedTopics = overrideTopics ?? item.topics;

  return (
    <SubCategoryPageContent
      categorySlug={categorySlug}
      subCategoryName={subCategoryName}
      subcategorySlug={subcategorySlug}
      itemName={item.name}
      topics={resolvedTopics}
      disableTopicLinks={Boolean(disableTopicLinks)}
    />
  );
}
