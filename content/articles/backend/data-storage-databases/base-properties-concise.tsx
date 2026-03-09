"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-base-properties-concise",
  title: "BASE Properties",
  description:
    "Concise guide to BASE properties, eventual consistency, and system trade-offs for interviews.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "base-properties",
  version: "concise",
  wordCount: 1800,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "distributed-systems", "databases", "base"],
  relatedTopics: [
    "cap-theorem",
    "read-replicas",
    "consistency-models",
  ],
};

export default function BasePropertiesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>BASE</strong> stands for <strong>Basically Available</strong>,
          <strong>Soft state</strong>, and <strong>Eventually consistent</strong>.
          It describes systems that prioritize availability and partition
          tolerance over immediate consistency.
        </p>
        <p>
          BASE is often contrasted with ACID. While ACID emphasizes strict
          transactional guarantees, BASE embraces eventual consistency for
          scalability and resilience.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Basically Available:</strong> System responds even under failure.</li>
          <li><strong>Soft State:</strong> State may change without new input.</li>
          <li><strong>Eventually Consistent:</strong> Replicas converge over time.</li>
          <li><strong>Staleness:</strong> Reads can be outdated temporarily.</li>
          <li><strong>Conflict resolution:</strong> Required when updates diverge.</li>
        </ul>
        <p className="mt-4">
          BASE is common in distributed databases where availability and
          performance outweigh strict correctness.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Eventual consistency in a profile update
await db.write({ consistency: "local", value: profile });
const profileCopy = await db.read({ consistency: "local" });`}</code>
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
                ✓ High availability during failures<br />
                ✓ Scales horizontally well<br />
                ✓ Lower coordination overhead<br />
                ✓ Good for global distribution
              </td>
              <td className="p-3">
                ✗ Stale or conflicting reads possible<br />
                ✗ More complex application logic<br />
                ✗ Harder to reason about state<br />
                ✗ Requires conflict resolution
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use BASE when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Availability matters more than strict correctness</li>
          <li>• Global distribution is required</li>
          <li>• Eventual consistency is acceptable</li>
        </ul>
        <p><strong>Use ACID-style systems when:</strong></p>
        <ul className="space-y-1">
          <li>• Financial correctness is required</li>
          <li>• Stale reads are unacceptable</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain how BASE differs from ACID.</li>
          <li>Connect BASE to AP behavior in CAP.</li>
          <li>Mention conflict resolution strategies.</li>
          <li>Highlight eventual consistency and staleness trade-offs.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What does BASE stand for?</p>
            <p className="mt-2 text-sm">
              A: Basically Available, Soft state, Eventually consistent.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does BASE relate to CAP?</p>
            <p className="mt-2 text-sm">
              A: BASE aligns with AP systems that choose availability over
              strong consistency during partitions.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why accept eventual consistency?</p>
            <p className="mt-2 text-sm">
              A: It enables higher availability, lower latency, and easier
              scaling in distributed systems.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is soft state?</p>
            <p className="mt-2 text-sm">
              A: The system’s state may change over time without new input as
              replicas converge and reconcile.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
