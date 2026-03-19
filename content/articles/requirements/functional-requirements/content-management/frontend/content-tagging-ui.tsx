"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-content-tagging",
  title: "Content Tagging UI",
  description: "Guide to implementing content tagging covering tag input, autocomplete, hierarchies, and tag management.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-tagging-ui",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "tagging", "categorization", "frontend"],
  relatedTopics: ["content-categorization", "search", "discovery"],
};

export default function ContentTaggingUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Content Tagging UI</strong> enables users to add metadata tags to content 
          for organization, discovery, and search. Good tagging improves content findability 
          and enables powerful filtering.
        </p>
      </section>

      <section>
        <h2>Tag Input Patterns</h2>
        <ul className="space-y-3">
          <li><strong>Autocomplete:</strong> Suggest existing tags as user types.</li>
          <li><strong>Create New:</strong> Allow creating new tags if not found.</li>
          <li><strong>Tag Limits:</strong> Max tags per content (5-10).</li>
          <li><strong>Visual Tags:</strong> Display as chips with remove (×) button.</li>
        </ul>
      </section>

      <section>
        <h2>Tag Hierarchies</h2>
        <ul className="space-y-3">
          <li><strong>Parent/Child:</strong> Nested tags (Technology → Programming → Python).</li>
          <li><strong>Tag Groups:</strong> Related tags grouped together.</li>
          <li><strong>Synonyms:</strong> Map synonyms to canonical tag.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent tag proliferation?</p>
            <p className="mt-2 text-sm">A: Suggest existing tags, require minimum usage for tag creation, merge duplicates, tag governance.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle tag changes?</p>
            <p className="mt-2 text-sm">A: Update content tags, re-index for search, notify followers of new tags, track tag history.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
