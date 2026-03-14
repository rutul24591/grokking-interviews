"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-geo-sharding-extensive",
  title: "Geo-Sharding",
  description:
    "Shard data by geography to reduce latency and meet compliance: routing strategies, user mobility, cross-region queries, and operational playbooks for rebalancing and failover.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "geo-sharding",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "advanced", "distributed-systems", "latency"],
  relatedTopics: ["global-distribution", "consistency-models", "conflict-resolution"],
};

export default function GeoShardingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What Geo-Sharding Is</h2>
        <p>
          <strong>Geo-sharding</strong> partitions data by geographic dimension, typically aligning shards with regions
          or countries. The motivation is usually latency (keep reads and writes close to users) and policy (data
          residency requirements). Instead of a single global shard map, geo-sharding introduces multiple regional maps
          with routing based on user location, tenant region, or regulatory boundaries.
        </p>
        <p>
          Geo-sharding is powerful but expensive: it changes your failure model, introduces cross-region query and
          transaction complexity, and requires a strategy for users and tenants that move or operate across regions.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/geo-sharding-diagram-1.svg"
          alt="Geo-sharding diagram showing data partitions per region and traffic routed to the nearest region"
          caption="Geo-sharding reduces latency by keeping data and compute near users. The complexity comes from cross-region behavior and mobility."
        />
      </section>

      <section>
        <h2>Routing: How Requests Find the Right Region</h2>
        <p>
          The first design decision is routing. You need a deterministic mapping from a request to the region that owns
          the data. Routing can be based on user home region, tenant residency configuration, or the data itself.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/geo-sharding-diagram-2.svg"
          alt="Geo-sharding control points: routing, directory service, cross-region fallback, and consistency boundaries"
          caption="Geo-sharding requires a directory of ownership: a mapping from identity or tenant to region. That directory becomes a correctness dependency."
        />
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Practical Routing Patterns</h3>
          <ul className="space-y-2">
            <li>
              <strong>Home region:</strong> assign each user or tenant to a home region and route all stateful requests there.
            </li>
            <li>
              <strong>Data-derived routing:</strong> route based on resource identifiers that encode region ownership.
            </li>
            <li>
              <strong>Directory lookup:</strong> maintain a lookup service that maps identities to regions, with caching and strong correctness guarantees.
            </li>
          </ul>
        </div>
        <p>
          Routing correctness is critical. If requests go to the wrong region, users see missing data or inconsistent
          state. This is why geo-sharding often implies a global directory system that remains available and consistent.
        </p>
      </section>

      <section>
        <h2>User Mobility and Multi-Region Usage</h2>
        <p>
          Users travel. Companies operate across regions. Geo-sharding must define what mobility means:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Read locality:</strong> can users read from a nearby region while writes go to home region?
          </li>
          <li>
            <strong>Write locality:</strong> can users write locally and replicate back, or must all writes go to the home region?
          </li>
          <li>
            <strong>Residency:</strong> what data is allowed to leave a region, and what derived data can be shared?
          </li>
        </ul>
        <p className="mt-4">
          Many systems use a hybrid: sensitive data remains in home region, while derived or cached data can be served
          closer to the user. This is a product and compliance decision, not only a performance decision.
        </p>
      </section>

      <section>
        <h2>Cross-Region Queries and Aggregation</h2>
        <p>
          Geo-sharding makes global queries harder. Aggregations across regions require fanout and merge, which increases
          tail latency and cost. Some systems avoid global queries by changing product semantics (region-scoped views) or
          by maintaining derived global indexes that contain only non-sensitive fields.
        </p>
        <p>
          When global queries are required, you need explicit budgets and fallback behavior. A partial region outage
          should not cause every global query to hang indefinitely. Timeouts and partial results are product decisions
          that must be made consciously.
        </p>
      </section>

      <section>
        <h2>Rebalancing and Migration</h2>
        <p>
          Over time, tenants can grow and regions can become imbalanced. Geo-sharding requires migration mechanisms:
          moving a tenant or user from one region to another. This is operationally risky because it involves data
          movement, routing updates, and correctness during the transition.
        </p>
        <p>
          A common approach is to treat migration as a workflow: dual-write or replicate, validate, cut over routing,
          and then clean up old copies. The system should provide explicit tooling and audit trails for migrations.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          Geo-sharding failures typically involve routing mistakes, cross-region dependency failures, and mobility edge
          cases. The mitigations are about directory correctness, fallback behavior, and operational discipline in
          migrations.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/geo-sharding-diagram-3.svg"
          alt="Geo-sharding failure modes: wrong routing, directory outages, cross-region latency, and migration errors"
          caption="Geo-sharding adds new failure modes: wrong routing and directory outages. Strong ownership mapping and staged migrations prevent user-visible inconsistency."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Wrong routing and stale directory caches</h3>
            <p className="mt-2 text-sm text-muted">
              Requests go to the wrong region and users see missing data or inconsistent state.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> versioned routing, directory correctness SLOs, and explicit cache invalidation for migrations.
              </li>
              <li>
                <strong>Signal:</strong> increased &quot;not found&quot; rates for known-existing resources and cross-region redirect spikes.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Cross-region tail latency</h3>
            <p className="mt-2 text-sm text-muted">
              Global queries or cross-region writes increase p99 latency and create unpredictable performance under partial degradation.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> minimize cross-region dependencies, use derived global views, and enforce budgets with timeouts and partial results when acceptable.
              </li>
              <li>
                <strong>Signal:</strong> tail latency spikes correlated with cross-region calls and partial region health events.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Data Residency for a Multi-Tenant SaaS</h2>
        <p>
          A SaaS product must keep EU customer data in EU regions while serving global users. Geo-sharding assigns each
          tenant a home region based on residency. The directory maps tenant to region and routes requests accordingly.
          Non-sensitive metadata may be replicated globally for discovery, while sensitive fields remain in-region.
        </p>
        <p>
          The operational emphasis is on migration tooling and auditability: if a tenant changes residency requirements,
          you need an explicit migration workflow that proves data movement and ensures old copies are removed according
          to policy.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Ownership mapping is explicit: a directory or encoding maps identities to regions, with strong correctness SLOs.
          </li>
          <li>
            Mobility semantics are defined: local reads, local writes, and what can be replicated are explicit decisions.
          </li>
          <li>
            Cross-region queries have budgets and fallback behavior, not unbounded fanout.
          </li>
          <li>
            Migration is a workflow with validation, routing cutover, and cleanup, with audit trails.
          </li>
          <li>
            Observability covers routing errors, cross-region latency, and directory health.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the biggest hidden dependency in geo-sharding?</p>
            <p className="mt-2 text-sm text-muted">
              A: The directory and routing layer. If it is wrong or unavailable, the system cannot find data ownership and user experience breaks quickly.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle users traveling across regions?</p>
            <p className="mt-2 text-sm text-muted">
              A: Define mobility semantics explicitly. Commonly, writes go to a home region while reads can use caches or replicas nearer the user, depending on data sensitivity and correctness needs.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why are cross-region queries expensive?</p>
            <p className="mt-2 text-sm text-muted">
              A: They fan out across regions and are gated by the slowest response. They increase tail latency and cost and require explicit budgets and fallback behavior.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

