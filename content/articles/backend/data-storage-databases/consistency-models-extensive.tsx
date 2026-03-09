"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-consistency-models-extensive",
  title: "Consistency Models",
  description:
    "Deep guide to consistency models, user-visible guarantees, and system trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "consistency-models",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "distributed-systems", "databases", "consistency"],
  relatedTopics: [
    "cap-theorem",
    "base-properties",
    "read-replicas",
  ],
};

export default function ConsistencyModelsExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Consistency models</strong> describe the guarantees a
          distributed system provides about the visibility and ordering of
          updates. They define whether a read sees the latest write, a recent
          write, or possibly stale data.
        </p>
        <p>
          Strong consistency makes systems easy to reason about but introduces
          coordination overhead. Weaker consistency improves availability and
          latency but requires application-level handling.
        </p>
        <p>
          Modern systems often offer tunable consistency, allowing different
          endpoints or workloads to choose different guarantees.
        </p>
      </section>

      <section>
        <h2>Consistency Spectrum</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/consistency-spectrum-wide.svg"
          alt="Consistency spectrum"
          caption="Consistency ranges from strong to eventual"
        />
        <p>
          Consistency is a spectrum. The stronger the model, the more
          coordination and latency. The weaker the model, the more the
          application must tolerate or resolve anomalies.
        </p>
      </section>

      <section>
        <h2>Strong and Sequential Consistency</h2>
        <p>
          <strong>Linearizable consistency</strong> ensures reads always return
          the most recent write, as if all operations occur in a single global
          order. This is the easiest model to reason about.
        </p>
        <p>
          <strong>Sequential consistency</strong> guarantees a single global
          order, but not necessarily the most recent write. It is slightly weaker
          but still provides predictable ordering.
        </p>
      </section>

      <section>
        <h2>Session Guarantees</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/session-guarantees.svg"
          alt="Session guarantees"
          caption="Session guarantees provide user-level consistency"
        />
        <p>
          Session guarantees ensure a user sees consistent behavior even if the
          system is eventually consistent globally.
        </p>
        <ul className="space-y-2">
          <li><strong>Read-your-writes:</strong> Users see their own updates.</li>
          <li><strong>Monotonic reads:</strong> Reads never go backwards.</li>
          <li><strong>Monotonic writes:</strong> Writes from one client are ordered.</li>
        </ul>
      </section>

      <section>
        <h2>Eventual Consistency</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/eventual-consistency-wide.svg"
          alt="Eventual consistency"
          caption="Replicas converge after propagation"
        />
        <p>
          Eventual consistency guarantees convergence if no new writes occur.
          It allows replicas to diverge temporarily, which improves availability
          and performance during partitions.
        </p>
        <p>
          This model is common in distributed caches, feeds, and analytics.
        </p>
      </section>

      <section>
        <h2>Tunable Consistency with Quorums</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/quorum-reads-writes.svg"
          alt="Quorum reads and writes"
          caption="R + W > N provides stronger consistency"
        />
        <p>
          Many distributed databases allow tuning consistency per request using
          quorum reads and writes. If R + W &gt; N, a read overlaps the latest
          write, yielding stronger consistency.
        </p>
        <p>
          Lower quorums increase availability but allow stale reads.
        </p>
      </section>

      <section>
        <h2>Example: Consistency Choices</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Stronger consistency
await db.write({ consistency: "quorum", value: data });
const fresh = await db.read({ consistency: "quorum" });

// Faster availability
const staleOk = await db.read({ consistency: "local" });`}</code>
        </pre>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Consistency choices influence system behavior:
        </p>
        <ul className="space-y-2">
          <li>Strong consistency increases latency and coordination.</li>
          <li>Eventual consistency requires reconciliation and conflict handling.</li>
          <li>Session guarantees can improve UX without full global consistency.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Identify which workflows require strong consistency.</li>
          <li>Use session guarantees for user-facing flows.</li>
          <li>Adopt eventual consistency where staleness is acceptable.</li>
          <li>Monitor replication lag to enforce SLAs.</li>
          <li>Document consistency expectations in APIs.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
