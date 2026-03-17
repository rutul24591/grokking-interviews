"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-other-elasticsearch",
  title: "Elasticsearch",
  description: "Guide to using Elasticsearch for search covering cluster setup, index design, and query optimization.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "elasticsearch",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "elasticsearch", "search", "infrastructure"],
  relatedTopics: ["search-indexing", "query-processing", "search-ranking"],
};

export default function ElasticsearchArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Elasticsearch</strong> is the industry-standard search engine for 
          full-text search, analytics, and discovery features. It provides distributed, 
          scalable search capabilities.
        </p>
      </section>

      <section>
        <h2>Cluster Setup</h2>
        <ul className="space-y-3">
          <li><strong>Nodes:</strong> Master, data, ingest nodes.</li>
          <li><strong>Shards:</strong> Split index across nodes for scale.</li>
          <li><strong>Replicas:</strong> 2-3 replicas for HA and read scale.</li>
        </ul>
      </section>

      <section>
        <h2>Index Design</h2>
        <ul className="space-y-3">
          <li><strong>Mappings:</strong> Define field types, analyzers.</li>
          <li><strong>Aliases:</strong> Abstract index names for zero-downtime reindex.</li>
          <li><strong>Templates:</strong> Index templates for consistent setup.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize Elasticsearch queries?</p>
            <p className="mt-2 text-sm">A: Use filters (cached) vs queries, limit fields returned, use scroll for large results, avoid wildcards at start.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle index growth?</p>
            <p className="mt-2 text-sm">A: Index lifecycle management (ILM), rollover to new index, archive old indices to cold storage, adjust shard count.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
