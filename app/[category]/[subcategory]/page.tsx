import { notFound } from "next/navigation";
import { Metadata } from "next";
import { sidebarData } from "@/features/sidebar/sidebar.mock";
import { slugify } from "@/lib/slugify";
import { SubCategoryPageClient } from "@/components/SubCategoryPageClient";
import type { SubCategoryItem } from "@/types/content";

type PageProps = {
  params: Promise<{ category: string; subcategory: string }>;
};

function findMatch(
  categorySlug: string,
  subcategorySlug: string,
) {
  const category = sidebarData[0];
  if (!category) return { subCategory: null, item: null };

  for (const subCategory of category.subCategories) {
    const slug = slugify(subCategory.name).replace(/-concepts$/, "");
    if (slug !== categorySlug) continue;

    const items = subCategory.subCategories ?? [];
    for (const item of items) {
      if (slugify(item.name) === subcategorySlug) {
        return { subCategory, item };
      }
    }
    return { subCategory, item: null };
  }
  return { subCategory: null, item: null };
}

export async function generateStaticParams() {
  const category = sidebarData[0];
  if (!category) return [];

  const results: { category: string; subcategory: string }[] = [];

  for (const sub of category.subCategories) {
    const catSlug = slugify(sub.name).replace(/-concepts$/, "");
    const items = sub.subCategories ?? [];

    for (const item of items) {
      results.push({ category: catSlug, subcategory: slugify(item.name) });
    }
  }

  return results;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, subcategory } = await params;
  const { item } = findMatch(category, subcategory);

  if (!item) {
    return { title: "Not Found | Interview Prep Studio" };
  }

  return {
    title: `${item.name} | Interview Prep Studio`,
    description: `Explore ${item.name} topics for system design interviews.`,
  };
}

export default async function SubCategoryPage({ params }: PageProps) {
  const { category, subcategory } = await params;
  const { subCategory } = findMatch(category, subcategory);

  if (!subCategory) {
    notFound();
  }

  return (
    <SubCategoryPageClient
      categorySlug={category}
      subcategorySlug={subcategory}
      subCategoryName={subCategory.name}
      subCategoryId={subCategory.id}
    />
  );
}
