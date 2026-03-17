"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-faceted-search",
  title: "Faceted Search",
  description: "Guide to implementing faceted search covering facet computation, filtering, and performance optimization.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "faceted-search",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "search", "facets", "backend"],
  relatedTopics: ["search-indexing", "filters", "search-ranking"],
};

export default function FacetedSearchArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Faceted Search</strong> enables users to filter search results by 
          multiple dimensions (facets) like category, price, date, enabling precise 
          result refinement.
        </p>
      </section>

      <section>
        <h2>Facet Types</h2>
        <ul className="space-y-3">
          <li><strong>Categorical:</strong> Categories, tags, brands (checkboxes).</li>
          <li><strong>Numeric:</strong> Price, rating (sliders).</li>
          <li><strong>Temporal:</strong> Date ranges (date pickers).</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Pre-compute:</strong> Calculate facet counts per query.</li>
          <li><strong>Cache:</strong> Cache facet results for common queries.</li>
          <li><strong>Update:</strong> Update counts as filters are applied.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you compute facet counts efficiently?</p>
            <p className="mt-2 text-sm">A: Use search engine facets (Elasticsearch aggregations), cache results, limit facet count, sample for large result sets.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle multi-select facets?</p>
            <p className="mt-2 text-sm">A: OR within facet (category A OR B), AND across facets (category A AND brand B). Update counts accordingly.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
