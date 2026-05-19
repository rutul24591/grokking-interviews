import { ConceptCard, ConceptGrid } from "@/components/ConceptCard";
import { getSearchResultLimit, searchArticles } from "@/lib/article-search";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

export const metadata = {
  title: "Search Articles",
  description: "Search interview preparation articles by topic and path.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = rawQuery?.trim() ?? "";
  const results = searchArticles(query);
  const resultLimit = getSearchResultLimit();
  const hasQuery = query.length > 0;
  const hasResults = results.length > 0;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">
          Article Search
        </p>
        <h1 className="text-3xl font-bold text-heading sm:text-4xl">
          Find article topics
        </h1>
        <p className="mt-3 text-lg text-muted">
          Search by article title, domain, category, or sub-category.
        </p>
      </header>

      {hasQuery ? (
        <section aria-live="polite">
          <div className="mb-6 rounded-2xl border border-theme bg-panel-soft p-5">
            <p className="text-sm text-muted">
              {hasResults ? (
                <>
                  Showing{" "}
                  <strong className="text-heading">{results.length}</strong>{" "}
                  {results.length === 1 ? "result" : "results"} for{" "}
                  <strong className="text-heading">&ldquo;{query}&rdquo;</strong>
                  {results.length === resultLimit ? (
                    <>
                      . Refine the query to narrow broad matches.
                    </>
                  ) : (
                    "."
                  )}
                </>
              ) : (
                <>
                  No article topics matched{" "}
                  <strong className="text-heading">&ldquo;{query}&rdquo;</strong>.
                </>
              )}
            </p>
          </div>

          {hasResults ? (
            <ConceptGrid>
              {results.map((article) => (
                <ConceptCard
                  key={article.href}
                  title={article.title}
                  slug={article.slug}
                  description={article.description}
                  href={article.href}
                  eyebrow={article.breadcrumb}
                />
              ))}
            </ConceptGrid>
          ) : (
            <NoResults query={query} />
          )}
        </section>
      ) : (
        <EmptySearchPrompt />
      )}
    </div>
  );
}

function EmptySearchPrompt() {
  return (
    <section className="rounded-2xl border border-theme bg-panel-soft p-8 text-center">
      <h2 className="text-2xl font-bold text-heading">
        Search for an article topic
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-muted">
        Use the search box in the top bar to find topics such as rendering,
        caching, CI pipeline, security, accessibility, or system design problem
        areas.
      </p>
    </section>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <section className="rounded-2xl border border-theme bg-panel-soft p-8 text-center">
      <h2 className="text-2xl font-bold text-heading">No results found</h2>
      <p className="mx-auto mt-3 max-w-2xl text-muted">
        Try a broader topic, a sub-category name, or fewer words. For example,
        search for <strong className="text-heading">security</strong>,{" "}
        <strong className="text-heading">rendering</strong>, or{" "}
        <strong className="text-heading">CI</strong> instead of{" "}
        <strong className="text-heading">&ldquo;{query}&rdquo;</strong>.
      </p>
    </section>
  );
}
