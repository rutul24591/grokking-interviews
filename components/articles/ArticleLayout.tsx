"use client";

import {
  type ReactNode,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import type { ArticleMetadata } from "@/types/article";
import { ExampleViewer } from "@/components/articles/ExampleViewer";
import {
  ArticleExampleToggle,
  useArticleViewMode,
} from "@/components/articles/ArticleExampleToggle";
import { HighlightsProvider } from "@/components/articles/HighlightsContext";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // The scroll container is the closest ancestor with overflow-y-auto (ContentArea's <main>)
    const scrollContainer = containerRef.current?.closest("main");
    if (!scrollContainer) return;

    const handleScroll = () => {
      setShowBackToTop(scrollContainer.scrollTop > 400);
    };
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    const scrollContainer = containerRef.current?.closest("main");
    scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [view, setView] = useArticleViewMode();
  const hasExamples = useMemo(() => examples.length > 0, [examples]);
  const [activeExampleId, setActiveExampleId] = useState(examples[0]?.id ?? "");
  const [highlightsOn, setHighlightsOn] = useState(false);

  // Reset highlights when navigating to a different article
  useEffect(() => {
    setHighlightsOn(false);
  }, [pathname]);

  // Wrap all <table> elements in a responsive scroll container
  useEffect(() => {
    const article = containerRef.current?.querySelector("article.prose");
    if (!article) return;

    const tables = article.querySelectorAll("table");
    tables.forEach((table) => {
      // Skip if already wrapped
      if (table.parentElement?.classList.contains("table-scroll-wrapper"))
        return;

      const wrapper = document.createElement("div");
      wrapper.className = "table-scroll-wrapper";
      wrapper.style.maxWidth = "100%";
      wrapper.style.overflowX = "auto";
      wrapper.style.setProperty("-webkit-overflow-scrolling", "touch");
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }, []);

  // Load examples for this article
  useEffect(() => {
    async function loadExamplesForArticle() {
      try {
        // Build the manifest key from metadata
        let manifestKey: string;
        if (
          metadata.category === "frontend" &&
          metadata.subcategory === "nfr"
        ) {
          manifestKey = `non-functional-requirements/frontend-nfr/${metadata.slug}`;
        } else if (
          metadata.category === "backend" &&
          metadata.subcategory === "nfr"
        ) {
          manifestKey = `non-functional-requirements/backend-nfr/${metadata.slug}`;
        } else if (metadata.category === "shared-cross-cutting-nfr") {
          manifestKey = `non-functional-requirements/shared-cross-cutting-nfr/${metadata.slug}`;
        } else if (metadata.category === "advanced-topics") {
          manifestKey = `non-functional-requirements/advanced-bonus/${metadata.slug}`;
        } else {
          const manifestCategory = metadata.category.replace("-concepts", "");
          manifestKey = `${manifestCategory}/${metadata.subcategory}/${metadata.slug}`;
        }

        // Import manifest dynamically
        const manifestModule = await import("@/content/examples-manifest.json");
        // The manifest is the module itself (JSON files don't have a default export in this setup)
        const manifest = (manifestModule.default ?? manifestModule) as Record<
          string,
          unknown
        >;
        const rawData = manifest[manifestKey];

        // Normalize the data to match ExampleGroup type
        const articleExamples: ExampleGroup[] = Array.isArray(rawData)
          ? rawData.map((item: unknown) => {
              const eg = item as Record<string, unknown>;
              return {
                id: String(eg.id ?? ""),
                label: String(eg.label ?? eg.id ?? ""),
                files: Array.isArray(eg.files)
                  ? eg.files.map((f: unknown) => {
                      const file = f as Record<string, unknown>;
                      return {
                        name: String(file.name ?? file.path ?? ""),
                        content: String(file.content ?? ""),
                      };
                    })
                  : [],
              };
            })
          : [];
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
    <div ref={containerRef} className="min-h-screen bg-theme">
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
            <div className="sm:sticky sm:top-4 self-start sm:self-end">
              <div className="flex w-fit flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center">
                {/* Highlights Toggle */}
                <button
                  type="button"
                  onClick={() => setHighlightsOn(!highlightsOn)}
                  className={classNames(
                    "inline-flex cursor-pointer items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition sm:px-4 sm:py-2 sm:text-sm",
                    highlightsOn
                      ? "bg-accent text-white"
                      : "border border-theme bg-panel text-muted hover:text-body",
                  )}
                  aria-label="Toggle highlights"
                >
                  Highlights
                </button>

                {/* Article / Example Toggle */}
                <ArticleExampleToggle value={view} onChange={setView} />
              </div>
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
        <HighlightsProvider value={{ highlightsOn, setHighlightsOn }}>
          <article className="prose">
            {view === "example" ? (
              <ExampleViewer
                key={activeExample?.id ?? "no-example"}
                example={activeExample}
              />
            ) : (
              children
            )}
          </article>
        </HighlightsProvider>

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

      {/* Back to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={classNames(
          "fixed bottom-6 right-6/12 z-50 cursor-pointer flex h-14 w-14 items-center justify-center rounded-full border border-theme bg-panel shadow-soft-theme transition-all duration-300 hover:bg-accent hover:text-white",
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ec4699"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </div>
  );
}
