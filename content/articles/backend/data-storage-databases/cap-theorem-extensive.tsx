"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-cap-theorem-extensive",
  title: "CAP Theorem",
  description:
    "Deep guide to CAP theorem, consistency models, and practical system trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "cap-theorem",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "distributed-systems", "databases", "cap"],
  relatedTopics: [
    "base-properties",
    "read-replicas",
    "database-partitioning",
  ],
};

export default function CapTheoremExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          The <strong>CAP theorem</strong> states that in the presence of a
          network partition, a distributed system must choose between providing
          <strong>Consistency</strong> and <strong>Availability</strong>.
          Partition tolerance is required in real networks, so the practical
          choice is between CP and AP behavior during failures.
        </p>
        <p>
          CAP is often misunderstood. It does not claim systems are always
          inconsistent or unavailable. It describes what happens when the
          network splits and nodes cannot coordinate.
        </p>
        <p>
          Modern databases often offer tunable consistency, letting teams
          decide at query time which side of the trade-off to favor.
        </p>
      </section>

      <section>
        <h2>CAP Triangle and Trade-offs</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/cap-triangle.svg"
          alt="CAP triangle"
          caption="During partitions, systems choose consistency or availability"
        />
        <p>
          The CAP triangle illustrates the trade-off. In partition scenarios:
        </p>
        <ul className="space-y-2">
          <li><strong>CP:</strong> reject requests to preserve consistency.</li>
          <li><strong>AP:</strong> serve requests with possible staleness.</li>
        </ul>
        <p className="mt-4">
          In practice, most systems are “mostly consistent” or “mostly
          available” with configurable policies.
        </p>
      </section>

      <section>
        <h2>Consistency Models</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/consistency-spectrum.svg"
          alt="Consistency spectrum"
          caption="Consistency levels range from strong to eventual"
        />
        <p>
          Consistency is not binary. Common models include:
        </p>
        <ul className="space-y-2">
          <li><strong>Strong consistency:</strong> linearizable reads.</li>
          <li><strong>Read-after-write:</strong> a user sees their own writes.</li>
          <li><strong>Eventual consistency:</strong> replicas converge over time.</li>
        </ul>
        <p className="mt-4">
          The stronger the consistency, the more coordination is required, which
          increases latency and reduces availability during partitions.
        </p>
      </section>

      <section>
        <h2>Availability in Practice</h2>
        <p>
          Availability means the system continues to serve requests, even if
          the data might be slightly stale or conflicting. For user-facing
          systems, this can be more important than strict correctness.
        </p>
        <p>
          In AP systems, conflicts are resolved after the partition heals,
          often using techniques like last-write-wins or vector clocks.
        </p>
      </section>

      <section>
        <h2>Quorums and Tunable Consistency</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/quorum-reads-writes.svg"
          alt="Quorum reads and writes"
          caption="Quorum settings let systems tune consistency"
        />
        <p>
          Many distributed databases use quorum reads and writes. If the system
          has N replicas, choosing read quorum R and write quorum W can enforce
          consistency if R + W &gt; N.
        </p>
        <p>
          Lower quorum values increase availability but allow staleness. Higher
          quorum values increase consistency but reduce availability.
        </p>
      </section>

      <section>
        <h2>Example: CP vs AP Behavior</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// CP-style write: require majority
await db.write({ consistency: "quorum", value: data });

// AP-style write: accept local write
await db.write({ consistency: "local", value: data });`}</code>
        </pre>
        <p>
          CP-style ensures consistency but may reject writes during partitions.
          AP-style accepts writes but may require reconciliation later.
        </p>
      </section>

      <section>
        <h2>Common Misconceptions</h2>
        <p>
          <strong>CAP is only about partitions.</strong> Outside partitions,
          systems can often be both consistent and available.
        </p>
        <p>
          <strong>CA is possible only in single-node or perfectly connected
          systems.</strong> Real distributed systems must tolerate partitions.
        </p>
        <p>
          <strong>CAP is not the whole story.</strong> Latency, throughput,
          and consistency models also matter in system design.
        </p>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Define which user flows require strong consistency.</li>
          <li>Decide if availability or correctness matters more during outages.</li>
          <li>Use quorum settings to tune trade-offs.</li>
          <li>Plan conflict resolution for AP behavior.</li>
          <li>Document SLAs for staleness and availability.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
