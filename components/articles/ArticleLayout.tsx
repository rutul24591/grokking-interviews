"use client";

import { type ReactNode, useContext, useMemo, useState } from "react";
import { Breadcrumbs } from "../Breadcrumbs";
import type { ArticleMetadata } from "@/types/article";
import { ExampleContext } from "@/components/articles/ExampleContext";
import { ExampleViewer } from "@/components/articles/ExampleViewer";
import {
  ArticleExampleToggle,
  useArticleViewMode,
} from "@/components/articles/ArticleExampleToggle";
import { classNames } from "@/lib/classNames";

type ArticleLayoutProps = {
  metadata: ArticleMetadata;
  children: ReactNode;
};

export function ArticleLayout({ metadata, children }: ArticleLayoutProps) {
  const formattedDate = new Date(metadata.lastUpdated).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
  const { examples } = useContext(ExampleContext);
  const [view, setView] = useArticleViewMode();
  const hasExamples = useMemo(() => examples.length > 0, [examples]);
  const [activeExampleId, setActiveExampleId] = useState(examples[0]?.id ?? "");

  const resolvedActiveExampleId = useMemo(() => {
    if (!examples.length) return "";
    const exists = examples.some((example) => example.id === activeExampleId);
    return exists ? activeExampleId : examples[0].id;
  }, [examples, activeExampleId]);

  const activeExample = useMemo(() => {
    return (
      examples.find((example) => example.id === resolvedActiveExampleId) ??
      examples[0]
    );
  }, [examples, resolvedActiveExampleId]);

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
                        className="rounded-full bg-accent/10 px-3 py-1 text-accent font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="sm:sticky sm:top-4">
              <ArticleExampleToggle value={view} onChange={setView} />
            </div>
          </div>
        </header>

        {view === "example" && hasExamples && (
          <div className="mb-6 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example.id}
                type="button"
                onClick={() => setActiveExampleId(example.id)}
                className={classNames(
                  "cursor-pointer rounded-full border border-theme px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition",
                  example.id === activeExample?.id
                    ? "bg-accent text-white shadow-soft-theme"
                    : "bg-panel text-muted hover:text-body",
                )}
              >
                {example.label}
              </button>
            ))}
          </div>
        )}

        {/* Article Content */}
        <article className="prose max-w-none">
          {view === "example" ? (
            <ExampleViewer
              key={activeExample?.id ?? "no-example"}
              example={activeExample}
            />
          ) : (
            children
          )}
        </article>

        {/* Article Footer */}
        <footer className="mt-12 border-t border-theme pt-6">
          <p className="text-sm text-muted">Last updated: {formattedDate}</p>

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
                      {slug
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
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
