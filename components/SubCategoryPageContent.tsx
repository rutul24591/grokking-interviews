"use client";

import Link from "next/link";
import { slugify } from "@/lib/slugify";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Topic } from "@/types/content";

type SubCategoryPageContentProps = {
  categorySlug: string;
  subCategoryName: string;
  subcategorySlug: string;
  itemName: string;
  topics: Topic[];
  disableTopicLinks?: boolean;
};

export function SubCategoryPageContent({
  categorySlug,
  subcategorySlug,
  itemName,
  topics,
  disableTopicLinks,
}: SubCategoryPageContentProps) {
  return (
    <section className="flex h-full flex-col gap-6">
      <Breadcrumbs />

      <div>
        <h1 className="text-2xl font-bold text-heading">{itemName}</h1>
        <p className="mt-2 text-sm text-muted">
          {topics.length} topic{topics.length !== 1 ? "s" : ""} in {itemName}
        </p>
      </div>

      <div className="grid gap-4 pb-6 sm:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => {
          const topicNameClean = topic.name.replace(/\s*\([^)]*\)/g, "").trim();
          const topicSlug = slugify(topicNameClean);

          if (disableTopicLinks) {
            return (
              <div
                key={topic.id}
                className="flex h-full flex-col rounded-2xl border border-theme bg-panel-soft p-5 text-left"
              >
                <h3 className="text-lg font-semibold text-heading">
                  {topic.name}
                </h3>
                <p className="mt-2 text-sm text-muted">Checklist item</p>
              </div>
            );
          }

          return (
            <Link
              key={topic.id}
              href={`/${categorySlug}/${subcategorySlug}/${topicSlug}`}
              className="group flex h-full flex-col rounded-2xl border border-theme bg-panel-soft p-5 text-left transition hover:-translate-y-0.5 hover:border-accent"
            >
              <h3 className="text-lg font-semibold text-heading">
                {topic.name}
              </h3>
              <p className="mt-2 text-sm text-muted">View article</p>
            </Link>
          );
        })}
      </div>

      {topics.length === 0 && (
        <div className="rounded-2xl border border-dashed border-theme bg-panel-soft p-6 text-sm text-muted">
          No topics available yet.
        </div>
      )}
    </section>
  );
}
