"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-base-properties-extensive",
  title: "BASE Properties",
  description:
    "Deep guide to BASE properties, eventual consistency patterns, and system design trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "base-properties",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "distributed-systems", "databases", "base"],
  relatedTopics: [
    "cap-theorem",
    "read-replicas",
    "consistency-models",
  ],
};

export default function BasePropertiesExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>BASE</strong> stands for <strong>Basically Available</strong>,
          <strong>Soft state</strong>, and <strong>Eventually consistent</strong>.
          It describes systems that prioritize availability and partition
          tolerance, accepting that data may be temporarily inconsistent.
        </p>
        <p>
          BASE emerged as a pragmatic alternative to strict ACID guarantees in
          large-scale distributed systems, where high availability and global
          scale are more important than immediate consistency.
        </p>
        <p>
          BASE does not mean “no consistency.” It means consistency is relaxed
          and achieved eventually rather than immediately.
        </p>
      </section>

      <section>
        <h2>BASE vs ACID</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/base-vs-acid.svg"
          alt="BASE vs ACID"
          caption="BASE favors availability; ACID favors strict consistency"
        />
        <p>
          ACID systems prioritize correctness with transactional guarantees.
          BASE systems relax those guarantees to achieve scale and resilience.
        </p>
        <p>
          Many modern systems offer a hybrid: strong consistency for critical
          workflows and eventual consistency for non-critical data.
        </p>
      </section>

      <section>
        <h2>Basically Available</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/availability-focus.svg"
          alt="Availability focus"
          caption="System continues to respond even during partial failures"
        />
        <p>
          Availability means the system responds to requests even during
          partial failures. This often requires serving stale data or allowing
          local writes that will be reconciled later.
        </p>
        <p>
          For user-facing systems, this trade-off can be critical to perceived
          reliability. A slightly stale UI is often better than a failed request.
        </p>
      </section>

      <section>
        <h2>Soft State</h2>
        <p>
          Soft state means the system’s state may change over time without new
          input. This happens as replicas converge and asynchronous updates are
          applied.
        </p>
        <p>
          Soft state is a core property of eventually consistent systems. It
          requires careful reasoning about how users experience changes over
          time.
        </p>
      </section>

      <section>
        <h2>Eventually Consistent</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/eventual-consistency.svg"
          alt="Eventual consistency"
          caption="Replicas converge over time after a write"
        />
        <p>
          Eventually consistent systems guarantee that if no new updates occur,
          all replicas will converge to the same state. The convergence time
          depends on replication lag and network conditions.
        </p>
        <p>
          This model works well for feeds, analytics, and other use cases where
          immediate consistency is not required.
        </p>
      </section>

      <section>
        <h2>Conflict Resolution</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/conflict-resolution.svg"
          alt="Conflict resolution"
          caption="Conflicts are resolved after partitions heal"
        />
        <p>
          In BASE systems, concurrent updates can conflict. Common resolution
          strategies include:
        </p>
        <ul className="space-y-2">
          <li><strong>Last-write-wins:</strong> use timestamps to pick a winner.</li>
          <li><strong>Merge rules:</strong> combine fields deterministically.</li>
          <li><strong>Application reconciliation:</strong> human or business logic.</li>
        </ul>
      </section>

      <section>
        <h2>Example: Eventual Consistency Workflow</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Write locally, replicate asynchronously
await db.write({ consistency: "local", value: profile });

// Later: replicas converge and conflicts are resolved
await reconcileConflicts();`}</code>
        </pre>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          BASE systems require more operational sophistication:
        </p>
        <ul className="space-y-2">
          <li>Monitoring for replication lag and divergence.</li>
          <li>Conflict resolution logic and tooling.</li>
          <li>Clear SLAs for staleness windows.</li>
        </ul>
        <p className="mt-4">
          The payoff is availability at scale, especially across regions.
        </p>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Identify which workflows tolerate eventual consistency.</li>
          <li>Define conflict resolution rules early.</li>
          <li>Communicate staleness expectations to consumers.</li>
          <li>Monitor replication lag and convergence times.</li>
          <li>Use strong consistency for critical financial or inventory flows.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
