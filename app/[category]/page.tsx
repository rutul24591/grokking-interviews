import { notFound } from "next/navigation";
import { Metadata } from "next";
import { sidebarData } from "@/features/sidebar/sidebar.mock";
import { slugify } from "@/lib/slugify";
import { CategoryPageClient } from "@/components/CategoryPageClient";

type PageProps = {
  params: Promise<{ category: string }>;
};

function findSubCategory(categorySlug: string) {
  const category = sidebarData[0];
  if (!category) return null;

  for (const subCategory of category.subCategories) {
    const slug = slugify(subCategory.name).replace(/-concepts$/, "");
    if (slug === categorySlug) {
      return subCategory;
    }
  }
  return null;
}

export async function generateStaticParams() {
  const category = sidebarData[0];
  if (!category) return [];

  return category.subCategories.map((sub) => ({
    category: slugify(sub.name).replace(/-concepts$/, ""),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const subCategory = findSubCategory(category);

  if (!subCategory) {
    return { title: "Not Found | Interview Prep Studio" };
  }

  return {
    title: `${subCategory.name} | Interview Prep Studio`,
    description: `Explore ${subCategory.name} for system design interviews.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const subCategory = findSubCategory(category);

  if (!subCategory) {
    notFound();
  }

  return (
    <CategoryPageClient
      categorySlug={category}
      subCategoryName={subCategory.name}
      subCategoryId={subCategory.id}
      staticItems={subCategory.subCategories ?? []}
    />
  );
}
