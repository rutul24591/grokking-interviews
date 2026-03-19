import { ConceptCard, ConceptGrid } from "@/components/ConceptCard";
import * as fs from "fs";
import * as path from "path";

type SubcategoryPageProps = {
  params: Promise<{
    domain: string;
    category: string;
    subcategory: string;
  }>;
};

// Map category slugs to filesystem directories
const CATEGORY_DIR_MAP: Record<string, string> = {
  "frontend-concepts": "frontend",
  "backend-concepts": "backend",
  "functional-requirements": "functional-requirements",
  "non-functional-requirements": "non-functional-requirements",
};

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { domain, category, subcategory } = await params;

  // Map category to filesystem directory
  const fsCategory = CATEGORY_DIR_MAP[category] || category;

  // Build the path to articles
  const articlesDir = path.join(
    process.cwd(),
    "content",
    "articles",
    domain === "system-design-concepts" ? "system-design" : domain,
    fsCategory,
    subcategory
  );

  // Find all article files in this subcategory
  const articles: Array<{ slug: string; title: string; description: string }> = [];

  if (fs.existsSync(articlesDir)) {
    const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.tsx') || f.endsWith('.mdx'));
    
    for (const file of files) {
      const slug = file.replace(/\.tsx$/, '').replace(/\.mdx$/, '');
      const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
      
      // Extract title and description from metadata
      const titleMatch = content.match(/title:\s*"([^"]*)"/);
      const descMatch = content.match(/description:\s*"([^"]*)"/);
      
      articles.push({
        slug,
        title: titleMatch ? titleMatch[1] : slug,
        description: descMatch ? descMatch[1] : '',
      });
    }
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
      {articles.length > 0 ? (
        <ConceptGrid>
          {articles.map((article) => (
            <ConceptCard
              key={article.slug}
              title={article.title}
              slug={article.slug}
              description={article.description}
              href={`/articles/${domain}/${category}/${subcategory}/${article.slug}`}
            />
          ))}
        </ConceptGrid>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4 text-6xl">📚</div>
          <h2 className="text-2xl font-bold text-heading">
            No concepts available yet
          </h2>
          <p className="mt-3 text-muted">
            Content for <strong className="text-heading">{subcategoryName}</strong> is coming soon.
            Check back later for in-depth articles and examples.
          </p>
        </div>
      )}

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
