"use client";

import { type ReactNode } from "react";
import { VersionToggle } from "./VersionToggle";
import { Breadcrumbs } from "../Breadcrumbs";
import type { ArticleMetadata } from "@/types/article";

type ArticleLayoutProps = {
  metadata: ArticleMetadata;
  children: ReactNode;
};

export function ArticleLayout({ metadata, children }: ArticleLayoutProps) {
  const formattedDate = new Date(metadata.lastUpdated).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="min-h-screen bg-theme">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        {/* Article Header */}
        <header className="mb-8 border-b border-theme pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-heading sm:text-4xl">
                {metadata.title}
              </h1>
              <p className="mt-3 text-lg text-muted">{metadata.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
                {metadata.readingTime > 0 && (
                  <span className="rounded-full bg-panel-soft px-3 py-1">
                    {metadata.readingTime} min read
                  </span>
                )}
                {metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-accent/10 px-3 py-1 text-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="sm:sticky sm:top-4">
              <VersionToggle currentVersion={metadata.version} />
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose max-w-none">
          {children}
        </article>

        {/* Article Footer */}
        <footer className="mt-12 border-t border-theme pt-6">
          <p className="text-sm text-muted">
            Last updated: {formattedDate}
          </p>

          {/* Related Topics */}
          {metadata.relatedTopics && metadata.relatedTopics.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold text-heading">
                Related Topics
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {metadata.relatedTopics.map((slug) => (
                  <a
                    key={slug}
                    href={`/${metadata.category}/${metadata.subcategory}/${slug}`}
                    className="group rounded-lg border border-theme bg-panel-soft p-4 transition hover:border-accent hover:shadow-soft-theme"
                  >
                    <span className="text-body group-hover:text-accent">
                      {slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
