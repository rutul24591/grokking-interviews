import { notFound } from "next/navigation";
import { Metadata } from "next";
import { sidebarData } from "@/features/sidebar/sidebar.mock";
import { slugify } from "@/lib/slugify";
import { SubCategoryPageClient } from "@/components/SubCategoryPageClient";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseBackendConcepts } from "@/lib/parseBackendConcepts";
import { parseNfrMasterChecklist } from "@/lib/parseNfrMasterChecklist";
import { parseFunctionalRequirements } from "@/lib/parseFunctionalRequirements";
import type { Topic } from "@/types/content";

type PageProps = {
  params: Promise<{ category: string; subcategory: string }>;
};

async function findMatch(
  categorySlug: string,
  subcategorySlug: string,
) {
  for (const category of sidebarData) {
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
  }

  return { subCategory: null, item: null };
}

export async function generateStaticParams() {
  const results: { category: string; subcategory: string }[] = [];

  for (const category of sidebarData) {
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

  let overrideTopics: Topic[] | undefined;
  let disableTopicLinks = false;

  if (category === "non-functional-requirements") {
    // For frontend NFRs, check if articles exist in registry and enable links
    if (subcategory === "frontend-non-functional-requirements") {
      disableTopicLinks = false; // Enable links for frontend NFRs that have articles
      try {
        const nfrChecklistPath = path.join(
          process.cwd(),
          "concepts",
          "NFR_Master_Checklist.md",
        );
        const nfrChecklistRaw = await readFile(nfrChecklistPath, "utf8");
        const parsed = parseNfrMasterChecklist(nfrChecklistRaw);
        overrideTopics = parsed[subcategory as keyof typeof parsed] ?? [];
      } catch {
        overrideTopics = [];
      }
    } else {
      // For other NFR categories (backend, shared, bonus), keep links disabled
      disableTopicLinks = true;
      try {
        const nfrChecklistPath = path.join(
          process.cwd(),
          "concepts",
          "NFR_Master_Checklist.md",
        );
        const nfrChecklistRaw = await readFile(nfrChecklistPath, "utf8");
        const parsed = parseNfrMasterChecklist(nfrChecklistRaw);
        overrideTopics = parsed[subcategory as keyof typeof parsed] ?? [];
      } catch {
        overrideTopics = [];
      }
    }
  } else if (category === "functional-requirements") {
    try {
      const functionalReqsPath = path.join(
        process.cwd(),
        "concepts",
        "system_design_functional_requirements.txt",
      );
      const functionalReqsRaw = await readFile(functionalReqsPath, "utf8");
      const parsed = parseFunctionalRequirements(functionalReqsRaw);
      const entry = parsed.find((cat) => cat.slug === subcategory);
      overrideTopics = entry
        ? entry.groups.map((group) => ({ id: group.id, name: group.name }))
        : [];
    } catch {
      overrideTopics = [];
    }
  }

  return (
    <SubCategoryPageClient
      categorySlug={category}
      subcategorySlug={subcategory}
      subCategoryName={subCategory.name}
      subCategoryId={subCategory.id}
      overrideTopics={overrideTopics}
      disableTopicLinks={disableTopicLinks}
    />
  );
}
