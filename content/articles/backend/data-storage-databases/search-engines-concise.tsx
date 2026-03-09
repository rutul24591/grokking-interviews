"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-search-engines-concise",
  title: "Search Engines",
  description:
    "Concise guide to search engines, indexing, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "search-engines",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "search", "databases", "indexing"],
  relatedTopics: [
    "query-optimization-techniques",
    "serialization-formats",
    "caching-performance",
  ],
};

export default function SearchEnginesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Search engines</strong> (like Elasticsearch, OpenSearch, Solr)
          are optimized for full-text search, relevance ranking, and fast
          retrieval over large text datasets. They use inverted indexes to map
          terms to documents.
        </p>
        <p>
          Search engines are not a replacement for databases. They are usually
          used alongside a primary database for search and analytics workloads.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Inverted index:</strong> Terms map to document IDs.</li>
          <li><strong>Tokenization:</strong> Text is split into searchable terms.</li>
          <li><strong>Ranking:</strong> Relevance scoring (BM25, TF-IDF).</li>
          <li><strong>Shards:</strong> Index partitions for scalability.</li>
          <li><strong>Replicas:</strong> Improve availability and read throughput.</li>
          <li><strong>Near real-time:</strong> Search latency for indexing updates.</li>
        </ul>
        <p className="mt-4">
          The core trade-off: indexing adds write overhead but enables fast,
          ranked search queries.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Elasticsearch-style query
GET /products/_search
{
  "query": { "match": { "title": "wireless headset" } }
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                ✓ Fast full-text search<br />
                ✓ Relevance ranking and scoring<br />
                ✓ Flexible filtering and aggregations<br />
                ✓ Scales with sharding
              </td>
              <td className="p-3">
                ✗ Write overhead due to indexing<br />
                ✗ Eventual consistency for indexing<br />
                ✗ Requires separate system from DB<br />
                ✗ Schema tuning and mapping complexity
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use search engines when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• You need full-text search with ranking</li>
          <li>• Queries include fuzzy matching or synonyms</li>
          <li>• You need faceted search or aggregations</li>
        </ul>
        <p><strong>Use databases when:</strong></p>
        <ul className="space-y-1">
          <li>• Queries are exact matches or simple filters</li>
          <li>• Strong transactional guarantees are required</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain inverted indexes and why they are fast.</li>
          <li>Discuss relevance scoring and ranking.</li>
          <li>Note indexing latency and eventual consistency.</li>
          <li>Highlight use cases like product search and log analytics.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why not use SQL LIKE queries for search?</p>
            <p className="mt-2 text-sm">
              A: LIKE queries scale poorly for large text data. Search engines
              use inverted indexes for fast term lookups and ranking.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is near real-time indexing?</p>
            <p className="mt-2 text-sm">
              A: Indexed documents become searchable after a short delay, not
              immediately, due to refresh intervals.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do shards help scaling?</p>
            <p className="mt-2 text-sm">
              A: Shards split the index across nodes so queries can run in
              parallel and data can scale horizontally.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a synonym analyzer?</p>
            <p className="mt-2 text-sm">
              A: A component that expands terms to include synonyms so queries
              match related words.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
