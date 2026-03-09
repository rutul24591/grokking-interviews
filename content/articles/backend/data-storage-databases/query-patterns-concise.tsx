"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-query-patterns-concise",
  title: "Query Patterns",
  description:
    "Concise guide to query patterns, access-driven modeling, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "query-patterns",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "modeling", "performance"],
  relatedTopics: [
    "data-modeling-in-nosql",
    "query-optimization-techniques",
    "database-indexes",
  ],
};

export default function QueryPatternsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Query patterns</strong> describe how your application reads
          data. They are the primary driver of data modeling decisions,
          indexing strategy, and partitioning.
        </p>
        <p>
          Designing for the actual query patterns avoids slow scans and
          unpredictable performance. In NoSQL, queries often dictate schema.
        </p>
      </section>

      <section>
        <h2>Common Patterns</h2>
        <ul className="space-y-2">
          <li><strong>Point lookups:</strong> Fetch by primary key.</li>
          <li><strong>Range queries:</strong> Time or ID ranges.</li>
          <li><strong>Top-N queries:</strong> Most recent or highest scores.</li>
          <li><strong>Aggregation:</strong> Counts, sums, percentiles.</li>
          <li><strong>Fan-out reads:</strong> Multiple partitions or shards.</li>
        </ul>
        <p className="mt-4">
          The most frequent queries deserve dedicated indexes or precomputed
          views to keep latency predictable.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Pattern: fetch recent orders by user
SELECT * FROM orders
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 20;`}</code>
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
                ✓ Predictable performance<br />
                ✓ Efficient indexing and caching<br />
                ✓ Clear modeling decisions
              </td>
              <td className="p-3">
                ✗ Requires up-front planning<br />
                ✗ Schema changes when patterns shift<br />
                ✗ Over-optimization risk
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Focus on query patterns when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Latency SLAs are strict</li>
          <li>• Workloads are predictable</li>
          <li>• You need to scale reads efficiently</li>
        </ul>
        <p><strong>Be cautious when:</strong></p>
        <ul className="space-y-1">
          <li>• Requirements change rapidly</li>
          <li>• Over-indexing could hurt writes</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain how access patterns drive schema design.</li>
          <li>Discuss index selection based on query frequency.</li>
          <li>Mention precomputed views for heavy aggregations.</li>
          <li>Highlight fan-out queries as a scaling risk.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why are query patterns important in NoSQL?</p>
            <p className="mt-2 text-sm">
              A: Because schema design is query-driven; inefficient patterns
              lead to full scans and poor performance.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a fan-out query?</p>
            <p className="mt-2 text-sm">
              A: A query that must hit multiple shards or partitions, increasing
              latency and resource use.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize a top-N query?</p>
            <p className="mt-2 text-sm">
              A: Use indexes that support ordering and limit, or precompute
              results if needed.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When do query patterns change?</p>
            <p className="mt-2 text-sm">
              A: As product requirements change; schemas must evolve accordingly.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
