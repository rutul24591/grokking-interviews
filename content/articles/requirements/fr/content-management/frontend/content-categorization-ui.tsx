"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-content-categorization",
  title: "Content Categorization UI",
  description: "Guide to implementing content categorization covering category selection, hierarchies, and multi-category assignment.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-categorization-ui",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "categorization", "taxonomy", "frontend"],
  relatedTopics: ["content-tagging", "discovery", "navigation"],
};

export default function ContentCategorizationUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Content Categorization UI</strong> allows users to assign content to 
          categories for organization and discovery. Categories provide hierarchical 
          structure while tags provide flat metadata.
        </p>
      </section>

      <section>
        <h2>Category Selection</h2>
        <ul className="space-y-3">
          <li><strong>Tree View:</strong> Expandable category tree.</li>
          <li><strong>Search:</strong> Find category by name.</li>
          <li><strong>Suggestions:</strong> Suggest based on content analysis.</li>
          <li><strong>Multi-select:</strong> Assign to multiple categories if allowed.</li>
        </ul>
      </section>

      <section>
        <h2>Category Hierarchies</h2>
        <ul className="space-y-3">
          <li><strong>Parent/Child:</strong> Nested categories (max 3-4 levels).</li>
          <li><strong>Breadcrumbs:</strong> Show full path (Home {'>'} Tech {'>'} Programming).</li>
          <li><strong>Inheritance:</strong> Child inherits parent properties.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Categories vs Tags?</p>
            <p className="mt-2 text-sm">A: Categories: hierarchical, required, limited. Tags: flat, optional, many. Use both for flexible organization.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle category changes?</p>
            <p className="mt-2 text-sm">A: Update content, re-index for search, update category counts, redirect old category URLs.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
