"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-explore-page",
  title: "Explore Page",
  description: "Guide to implementing explore pages covering discovery features, topic following, and curated collections.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "explore-page",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "explore", "browse", "frontend"],
  relatedTopics: ["trending-section", "category-navigation", "discovery"],
};

export default function ExplorePageArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Explore Page</strong> is a dedicated discovery destination featuring 
          trending topics, curated collections, and personalized recommendations for 
          users to discover new content and topics.
        </p>
      </section>

      <section>
        <h2>Page Sections</h2>
        <ul className="space-y-3">
          <li><strong>Trending Topics:</strong> Popular hashtags, topics.</li>
          <li><strong>Curated Collections:</strong> Editor picks, themed collections.</li>
          <li><strong>Topics to Follow:</strong> Personalized suggestions.</li>
          <li><strong>New & Noteworthy:</strong> Fresh content from new creators.</li>
        </ul>
      </section>

      <section>
        <h2>Personalization</h2>
        <ul className="space-y-3">
          <li><strong>Based On:</strong> Followed topics, engagement history.</li>
          <li><strong>Diversity:</strong> Mix of familiar and new topics.</li>
          <li><strong>Refresh:</strong> Update suggestions as user follows topics.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How is Explore different from Feed?</p>
            <p className="mt-2 text-sm">A: Feed: personalized content from followed accounts. Explore: discovery of new topics, trending, broader content beyond follow graph.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you curate collections?</p>
            <p className="mt-2 text-sm">A: Manual curation by editors, algorithmic collections, hybrid approach. Update regularly, track engagement.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
