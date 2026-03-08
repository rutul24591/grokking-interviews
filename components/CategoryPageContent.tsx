"use client";

import Link from "next/link";
import { slugify } from "@/lib/slugify";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { SubCategoryItem } from "@/types/content";

type CategoryPageContentProps = {
  categorySlug: string;
  subCategoryName: string;
  subCategoryItems: SubCategoryItem[];
};

export function CategoryPageContent({
  categorySlug,
  subCategoryName,
  subCategoryItems,
}: CategoryPageContentProps) {
  return (
    <section className="flex h-full flex-col gap-6">
      <Breadcrumbs />

      <div>
        <h1 className="text-2xl font-bold text-heading">{subCategoryName}</h1>
        <p className="mt-2 text-sm text-muted">
          Explore {subCategoryItems.length} subcategories in {subCategoryName}.
        </p>
      </div>

      <div className="grid gap-4 pb-6 sm:grid-cols-2 xl:grid-cols-3">
        {subCategoryItems.map((item) => (
          <Link
            key={item.id}
            href={`/${categorySlug}/${slugify(item.name)}`}
            className="group flex h-full flex-col rounded-2xl border border-theme bg-panel-soft p-5 text-left transition hover:-translate-y-0.5 hover:border-accent"
          >
            <h3 className="text-lg font-semibold text-heading">
              {item.name}
            </h3>
            <p className="mt-2 text-sm text-muted">
              {item.topics.length} topic{item.topics.length !== 1 ? "s" : ""}
            </p>
          </Link>
        ))}
      </div>

      {subCategoryItems.length === 0 && (
        <div className="rounded-2xl border border-dashed border-theme bg-panel-soft p-6 text-sm text-muted">
          No concepts available yet.
        </div>
      )}
    </section>
  );
}
