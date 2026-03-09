import { notFound } from "next/navigation";
import { Metadata } from "next";
import { sidebarData } from "@/features/sidebar/sidebar.mock";
import { slugify } from "@/lib/slugify";
import { SubCategoryPageClient } from "@/components/SubCategoryPageClient";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseBackendConcepts } from "@/lib/parseBackendConcepts";

type PageProps = {
  params: Promise<{ category: string; subcategory: string }>;
};

async function findMatch(
  categorySlug: string,
  subcategorySlug: string,
) {
  const category = sidebarData[0];
  if (!category) return { subCategory: null, item: null };

  for (const subCategory of category.subCategories) {
    const slug = slugify(subCategory.name).replace(/-concepts$/, "");
    if (slug !== categorySlug) continue;

    let items = subCategory.subCategories ?? [];
    if (subCategory.id === "sub-backend") {
      const backendConceptsPath = path.join(
        process.cwd(),
        "concepts",
        "backend-concepts.txt",
      );
      const backendConceptsRaw = await readFile(backendConceptsPath, "utf8");
      items = parseBackendConcepts(backendConceptsRaw);
    }
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
    let items = sub.subCategories ?? [];
    if (sub.id === "sub-backend") {
      const backendConceptsPath = path.join(
        process.cwd(),
        "concepts",
        "backend-concepts.txt",
      );
      const backendConceptsRaw = await readFile(backendConceptsPath, "utf8");
      items = parseBackendConcepts(backendConceptsRaw);
    }

    for (const item of items) {
      results.push({ category: catSlug, subcategory: slugify(item.name) });
    }
  }

  return results;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, subcategory } = await params;
  const { item } = await findMatch(category, subcategory);

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
  const { subCategory } = await findMatch(category, subcategory);

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
