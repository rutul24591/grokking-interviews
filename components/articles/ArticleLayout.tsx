"use client";

import { type ReactNode, useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import type { ArticleMetadata } from "@/types/article";
import { ExampleViewer } from "@/components/articles/ExampleViewer";
import {
  ArticleExampleToggle,
  useArticleViewMode,
} from "@/components/articles/ArticleExampleToggle";
import { classNames } from "@/lib/classNames";
import type { ExampleGroup } from "@/types/examples";

type ArticleLayoutProps = {
  metadata: ArticleMetadata;
  children: ReactNode;
};

export function ArticleLayout({ metadata, children }: ArticleLayoutProps) {
  const [examples, setExamples] = useState<ExampleGroup[]>([]);
  const formattedDate = new Date(metadata.lastUpdated).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
  const pathname = usePathname();
  const backHref = useMemo(() => {
    const segments = pathname.split("/");
    segments.pop();
    return segments.join("/");
  }, [pathname]);
  const [view, setView] = useArticleViewMode();
  const hasExamples = useMemo(() => examples.length > 0, [examples]);
  const [activeExampleId, setActiveExampleId] = useState(examples[0]?.id ?? "");

  // Load examples for this article
  useEffect(() => {
    async function loadExamplesForArticle() {
      try {
        // Build the manifest key from metadata
        const manifestCategory = metadata.category.replace("-concepts", "");
        const manifestKey = `${manifestCategory}/${metadata.subcategory}/${metadata.slug}`;

        // Import manifest dynamically
        const manifest = await import("@/content/examples-manifest.json");
        const articleExamples =
          (manifest.default as Record<string, ExampleGroup[]>)[manifestKey] ||
          [];
        setExamples(articleExamples);
      } catch (error) {
        console.warn("Failed to load examples:", error);
        setExamples([]);
      }
    }

    loadExamplesForArticle();
  }, [metadata.category, metadata.subcategory, metadata.slug]);

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
        {/* Article Header */}
        <header className="mb-8 border-b border-theme pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <Link
                href={backHref}
                className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-accent"
              >
                <MoveLeft size={36} color="#ec4899" strokeWidth={2} />
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg> */}
                All Topics
              </Link>
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
