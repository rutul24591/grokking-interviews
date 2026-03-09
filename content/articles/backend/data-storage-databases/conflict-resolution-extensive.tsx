"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-conflict-resolution-extensive",
  title: "Conflict Resolution",
  description:
    "Deep guide to conflict resolution strategies in distributed systems and their trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "conflict-resolution",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "distributed-systems", "consistency", "conflicts"],
  relatedTopics: [
    "replication-in-nosql",
    "consistency-models",
    "cap-theorem",
  ],
};

export default function ConflictResolutionExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Conflict resolution</strong> is the mechanism by which
          distributed systems reconcile divergent updates that occur due to
          network partitions, replication lag, or concurrent writes. It is
          essential for AP and leaderless systems.
        </p>
        <p>
          The challenge is balancing availability with correctness. Simple
          resolution strategies are fast but risk losing updates. Stronger
          strategies preserve data but add complexity.
        </p>
        <p>
          Effective conflict resolution is a design choice, not an afterthought.
        </p>
      </section>

      <section>
        <h2>Conflict Detection</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/conflict-detection.svg"
          alt="Conflict detection"
          caption="Concurrent updates require detection before resolution"
        />
        <p>
          To resolve conflicts, systems first detect them. Techniques include
          timestamps, version vectors, or causal metadata.
        </p>
        <p>
          If conflicts are rare, a simple detection scheme may be sufficient.
          If conflicts are frequent, you need robust metadata tracking.
        </p>
      </section>

      <section>
        <h2>Resolution Strategies</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/conflict-strategies.svg"
          alt="Conflict strategies"
          caption="Different strategies trade simplicity for correctness"
        />
        <ul className="space-y-2">
          <li><strong>Last-write-wins (LWW):</strong> Easy but can discard updates.</li>
          <li><strong>Vector clocks:</strong> Track causality and detect conflicts.</li>
          <li><strong>CRDTs:</strong> Automatically merge without coordination.</li>
          <li><strong>Application merge:</strong> Domain-specific logic.</li>
          <li><strong>Manual review:</strong> Human decisions for critical data.</li>
        </ul>
      </section>

      <section>
        <h2>Vector Clocks in Practice</h2>
        <p>
          Vector clocks record per-node version counters, allowing the system
          to determine if one update supersedes another or if they are concurrent.
        </p>
        <p>
          If concurrent, the system either merges or keeps multiple versions
          for resolution.
        </p>
      </section>

      <section>
        <h2>CRDTs</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/crdt-example.svg"
          alt="CRDT example"
          caption="CRDTs converge without conflicts"
        />
        <p>
          Conflict-free replicated data types are structures designed to merge
          deterministically. Examples include grow-only counters and sets.
        </p>
        <p>
          CRDTs simplify consistency but are limited to certain data types.
        </p>
      </section>

      <section>
        <h2>Example: LWW Strategy</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`function resolve(current, incoming) {
  return incoming.ts > current.ts ? incoming : current;
}`}</code>
        </pre>
        <p>
          LWW is simple but can lose updates if clocks drift or concurrent
          writes occur.
        </p>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Conflict resolution increases operational complexity:
        </p>
        <ul className="space-y-2">
          <li>Tracking metadata for causality.</li>
          <li>Monitoring conflict rates.</li>
          <li>Designing domain-specific merge rules.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Define acceptable conflict rates and resolution strategy.</li>
          <li>Choose LWW only if data loss is acceptable.</li>
          <li>Use vector clocks or CRDTs for safer convergence.</li>
          <li>Monitor conflicts and tune replication.</li>
          <li>Document resolution semantics for consumers.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
