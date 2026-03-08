"use client";

import { useRouter } from "next/navigation";
import { sidebarData } from "@/features/sidebar/sidebar.mock";
import { useSidebarStore } from "@/features/sidebar/sidebar.store";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { slugify } from "@/lib/slugify";
import type { SubCategoryItem } from "@/types/content";

type SubCategoryCardsProps = {
  frontendSubCategories: SubCategoryItem[];
};

export function SubCategoryCards({
  frontendSubCategories,
}: SubCategoryCardsProps) {
  const router = useRouter();

  const selectedSubCategoryId = useSidebarStore(
    (state) => state.selectedSubCategoryId,
  );
  const selectedSubCategoryItemId = useSidebarStore(
    (state) => state.selectedSubCategoryItemId,
  );
  const setSelectedSubCategoryItemId = useSidebarStore(
    (state) => state.setSelectedSubCategoryItemId,
  );

  const category = sidebarData[0];
  const selectedSubCategory = selectedSubCategoryId
    ? category?.subCategories.find(
        (subCategory) => subCategory.id === selectedSubCategoryId,
      )
    : undefined;
  const resolvedSubCategories =
    selectedSubCategoryId === "sub-frontend"
      ? frontendSubCategories
      : (selectedSubCategory?.subCategories ?? []);
  const selectedSubCategoryItem = resolvedSubCategories.find(
    (item) => item.id === selectedSubCategoryItemId,
  );

  const handleTopicClick = (topicName: string) => {
    // Build the URL from the current selections
    const categorySlug = slugify(selectedSubCategory?.name || "").replace(
      /-concepts$/,
      "",
    );
    const subcategorySlug = slugify(selectedSubCategoryItem?.name || "");
    // Remove text in parentheses (e.g., "Client-Side Rendering (CSR)" -> "Client-Side Rendering")
    const topicNameClean = topicName.replace(/\s*\([^)]*\)/g, "").trim();
    const topicSlug = slugify(topicNameClean);

    // Navigate to the article page
    router.push(`/${categorySlug}/${subcategorySlug}/${topicSlug}`);
  };

  if (!category) {
    return (
      <section className="rounded-2xl border border-dashed border-theme p-6 text-sm text-muted">
        No categories found yet.
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col gap-6">
      <div className="space-y-3">
        <Breadcrumbs />
      </div>

      {!selectedSubCategory && (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-theme bg-panel-soft px-6 py-10 text-center">
          <p className="text-lg uppercase tracking-[0.35em] font-bold text-heading">
            Interview Prep Knowledge Hub
          </p>
          <p className="mt-2 max-w-xl text-md text-muted">
            A curated knowledge base for system design and frontend engineering,
            built to support deep understanding, structured practice, and
            interview readiness. Your one stop destination for mastering coding
            interviews. Explore comprehensive guides, practice problems, and
            expert insights to ace your next coding interview with confidence.
          </p>
        </div>
      )}

      {selectedSubCategory && !selectedSubCategoryItem && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {resolvedSubCategories.map((subCategory) => (
            <button
              key={subCategory.id}
              type="button"
              onClick={() => setSelectedSubCategoryItemId(subCategory.id)}
              className="group cursor-pointer rounded-2xl border border-theme bg-panel-soft p-5 text-left transition hover:-translate-y-0.5 hover:border-accent"
            >
              <h3 className="text-lg font-semibold text-heading">
                {subCategory.name}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {subCategory.topics[0]?.name ?? "Coming soon"}
              </p>
            </button>
          ))}
          {resolvedSubCategories.length === 0 && (
            <div className="rounded-2xl border border-dashed border-theme bg-panel-soft p-6 text-sm text-muted">
              No concepts available.
            </div>
          )}
        </div>
      )}

      {selectedSubCategory && selectedSubCategoryItem && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {selectedSubCategoryItem.topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleTopicClick(topic.name)}
              className="group cursor-pointer rounded-2xl border border-theme bg-panel-soft p-5 text-left transition hover:-translate-y-0.5 hover:border-accent"
            >
              <h3 className="text-lg font-semibold text-heading">
                {topic.name}
              </h3>
              <p className="mt-2 text-sm text-muted">View article</p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
