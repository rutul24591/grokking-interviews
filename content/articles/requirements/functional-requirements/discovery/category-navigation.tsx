"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-category-navigation",
  title: "Category Navigation",
  description: "Guide to implementing category navigation covering hierarchical navigation, breadcrumbs, and category browsing.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "category-navigation",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "navigation", "categories", "frontend"],
  relatedTopics: ["content-categorization", "browsing", "discovery"],
};

export default function CategoryNavigationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Category Navigation</strong> provides hierarchical browsing 
          structure, enabling users to explore content by topic or classification.
        </p>
      </section>

      <section>
        <h2>Navigation Patterns</h2>
        <ul className="space-y-3">
          <li><strong>Sidebar:</strong> Expandable category tree.</li>
          <li><strong>Mega Menu:</strong> Full dropdown with subcategories.</li>
          <li><strong>Breadcrumbs:</strong> Show current path (Home {'>'} Tech {'>'} Programming).</li>
          <li><strong>Quick Links:</strong> Popular categories at top level.</li>
        </ul>
      </section>

      <section>
        <h2>UX Considerations</h2>
        <ul className="space-y-3">
          <li><strong>Item Counts:</strong> Show content count per category.</li>
          <li><strong>Active State:</strong> Highlight current category.</li>
          <li><strong>Mobile:</strong> Collapsible accordion, bottom nav for top categories.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How deep should category hierarchy be?</p>
            <p className="mt-2 text-sm">A: Max 3-4 levels. Deeper hierarchies cause navigation friction. Use tags for fine-grained classification.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle category changes?</p>
            <p className="mt-2 text-sm">A: 301 redirects for old URLs, update sitemaps, notify affected content owners, gradual migration.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
