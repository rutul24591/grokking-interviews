import { ConceptCard, ConceptGrid } from "@/components/ConceptCard";
import { articleRegistry } from "@/content/registry";

type SubcategoryPageProps = {
  params: Promise<{
    domain: string;
    category: string;
    subcategory: string;
  }>;
};

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { domain, category, subcategory } = await params;

  // Map category slug from URL to registry format
  // URL uses "backend-concepts", "frontend-concepts" but registry uses "backend", "frontend"
  const registryCategory = category.replace("-concepts", "");

  // Get all articles that belong to this subcategory
  const articles = Object.entries(articleRegistry)
    .filter(([key]) => {
      const parts = key.split("/");
      return parts[0] === registryCategory && parts[1] === subcategory;
    })
    .map(([key, value]) => ({
      key,
      ...value.metadata,
    }));

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-6xl text-center py-12">
        <div className="mb-4 text-6xl">📚</div>
        <h2 className="text-2xl font-bold text-heading">
          No concepts available yet
        </h2>
        <p className="mt-3 text-muted">
          Content for <strong className="text-heading">{formatName(subcategory)}</strong> is coming soon.
          Check back later for in-depth articles and examples.
        </p>
      </div>
    );
  }

  // Format display names
  const subcategoryName = formatName(subcategory);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-heading sm:text-4xl">
          {subcategoryName}
        </h1>
        <p className="mt-3 text-lg text-muted">
          Explore {articles.length} {articles.length === 1 ? "concept" : "concepts"} in{" "}
          <span className="font-medium text-heading">{subcategoryName}</span>
        </p>
      </header>

      {/* Concept Cards Grid */}
      <ConceptGrid>
        {articles.map((article) => (
          <ConceptCard
            key={article.key}
            title={article.title}
            slug={article.slug}
            description={article.description}
            href={`/articles/${domain}/${category}/${subcategory}/${article.slug}`}
          />
        ))}
      </ConceptGrid>

      {/* Footer Info */}
      <div className="mt-12 rounded-2xl border border-theme bg-panel-soft p-6">
        <h2 className="mb-3 text-lg font-semibold text-heading">
          About {subcategoryName}
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          This section covers {subcategoryName.toLowerCase()} with in-depth explanations,
          architecture diagrams, code examples, and interview questions.
        </p>
      </div>
    </div>
  );
}

/**
 * Format slug to display name
 */
function formatName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
