"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-global-distribution-extensive",
  title: "Global Distribution",
  description:
    "Design multi-region systems: routing, replication, consistency trade-offs, failover strategy, and operational playbooks that keep global services predictable under regional failures.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "global-distribution",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "advanced", "distributed-systems", "availability"],
  relatedTopics: ["geo-sharding", "consistency-models", "conflict-resolution"],
};

export default function GlobalDistributionConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What Global Distribution Means</h2>
        <p>
          <strong>Global distribution</strong> is the practice of running a system across multiple geographic regions
          to reduce latency, increase availability, and meet regulatory or customer requirements. It includes routing
          users to regions, replicating data, and operating failover when a region or dependency degrades.
        </p>
        <p>
          The complexity comes from the speed of light and from partial failure. Cross-region replication introduces
          consistency trade-offs. Region failover introduces correctness and operational risks. A good design makes those
          risks explicit and aligns them with product requirements rather than assuming &quot;multi-region equals always better&quot;.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/global-distribution-diagram-1.svg"
          alt="Global distribution diagram showing multiple regions with routing and replication"
          caption="Global distribution is a set of choices: where traffic goes, where data lives, and how the system behaves when regions degrade."
        />
      </section>

      <section>
        <h2>Topologies: Active-Active vs Active-Passive</h2>
        <p>
          Most global systems choose one of two topologies:
        </p>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Active-passive</h3>
            <p className="mt-2 text-sm text-muted">
              One region serves traffic, another stands by. Easier correctness, but failover is an operational event and can be slow.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Active-active</h3>
            <p className="mt-2 text-sm text-muted">
              Multiple regions serve traffic. Better latency and availability, but consistency and conflict resolution become core design problems.
            </p>
          </div>
        </div>
        <p>
          The right answer depends on write patterns and correctness requirements. If you can keep writes in one region
          and serve reads globally, you can get much of the latency benefit with far less conflict risk. If you need
          writes everywhere, you must define conflict resolution and accept eventual consistency in some dimensions.
        </p>
      </section>

      <section>
        <h2>Routing: Getting Users to the Right Place</h2>
        <p>
          Routing decisions include:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Latency routing:</strong> send users to the nearest healthy region for fast response.
          </li>
          <li>
            <strong>Affinity routing:</strong> keep users in a home region for stateful interactions and predictable consistency.
          </li>
          <li>
            <strong>Compliance routing:</strong> route based on residency rules, not only proximity.
          </li>
        </ul>
        <p className="mt-4">
          Routing has to handle failover. If a region degrades, the system must decide whether to fail over immediately,
          partially, or not at all. That decision depends on whether the data and session state required for correctness
          are available elsewhere.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/global-distribution-diagram-2.svg"
          alt="Global routing control points: health checks, traffic shifting, session affinity, and data dependencies"
          caption="Global routing is a control plane: health signals and dependency readiness determine whether traffic can safely shift without breaking correctness."
        />
      </section>

      <section>
        <h2>Data Replication and Consistency</h2>
        <p>
          Data replication is where global distribution becomes difficult. Cross-region replication adds latency to
          writes and creates opportunities for divergence under partitions. The system needs explicit consistency
          expectations for each data type.
        </p>
        <p>
          A practical approach is to classify data:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Strongly consistent control data:</strong> authentication, authorization, billing state, and other correctness-critical state often stays regionalized or uses strong coordination.
          </li>
          <li>
            <strong>Eventually consistent content:</strong> feeds, analytics, and cached projections can replicate asynchronously.
          </li>
          <li>
            <strong>Derived and cached views:</strong> global read views can be built from regional sources with explicit staleness budgets.
          </li>
        </ul>
        <p className="mt-4">
          If you require multi-region writes on the same entity, you need conflict resolution. That can be application-level
          (last-write-wins, merge semantics) or data-type-level (CRDTs). The key is to define what &quot;correct&quot; means under conflict.
        </p>
      </section>

      <section>
        <h2>Failover: The System Only Exists If You Practice It</h2>
        <p>
          Global systems fail over under stress. If failover is untested, it fails when you need it. Practicing failover
          reveals hidden dependencies: a region can serve traffic only if it has the right data, keys, configuration, and
          capacity.
        </p>
        <p>
          Failover plans should be explicit about:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>What fails over:</strong> read traffic, write traffic, background jobs, and control plane operations can have different behaviors.
          </li>
          <li>
            <strong>What is degraded:</strong> some features may be disabled to preserve core functionality.
          </li>
          <li>
            <strong>How data recovers:</strong> reconcile divergence, rebuild caches, and repair indexes after the event.
          </li>
        </ul>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          Global distribution failures are usually coordination failures: routing changes that break state assumptions,
          replication lag that violates product expectations, and split brain behavior when two regions accept writes
          without conflict handling.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/global-distribution-diagram-3.svg"
          alt="Global distribution failure modes: replication lag, unsafe failover, split brain writes, and recovery backlog"
          caption="Global systems fail in the gaps: replication lag, unsafe failover, and conflict resolution mistakes. Practiced failover and explicit consistency budgets prevent surprise."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Unsafe failover</h3>
            <p className="mt-2 text-sm text-muted">
              Traffic shifts to a region that lacks required state or is not ready, causing widespread errors.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> readiness checks based on data and dependency health, staged traffic shifting, and feature-level degradation plans.
              </li>
              <li>
                <strong>Signal:</strong> error spikes immediately after traffic shifting or health-based routing changes.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Replication lag breaches</h3>
            <p className="mt-2 text-sm text-muted">
              Users see stale state beyond acceptable windows, causing correctness or trust problems.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> explicit staleness budgets per data type and routing that respects where fresh data exists.
              </li>
              <li>
                <strong>Signal:</strong> rising replication lag correlated with user reports and mismatch between regions.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Multi-Region Read Latency Improvement Without Multi-Region Writes</h2>
        <p>
          A product wants faster reads globally but can keep writes centralized. A practical design serves reads from
          regional replicas with explicit staleness budgets and keeps all writes in a home region. This avoids most write
          conflicts while still reducing latency for global users.
        </p>
        <p>
          The operational focus is replication health and safe failover. If the home region is down, the system may serve
          read-only mode from replicas or degrade features until write authority is restored.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Global topology is chosen intentionally (active-passive or active-active) based on write patterns and correctness needs.
          </li>
          <li>
            Routing decisions consider data ownership, affinity, and compliance, not only latency.
          </li>
          <li>
            Replication has explicit staleness budgets per data class, with monitoring and alerts.
          </li>
          <li>
            Failover is practiced and staged, with readiness checks based on dependency and data health.
          </li>
          <li>
            Conflict resolution is explicit where multi-region writes exist; otherwise writes are intentionally centralized.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is active-active harder than active-passive?</p>
            <p className="mt-2 text-sm text-muted">
              A: Because multiple regions can accept writes concurrently, requiring conflict resolution and clear consistency semantics. Active-passive centralizes writes and simplifies correctness.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What makes failover risky?</p>
            <p className="mt-2 text-sm text-muted">
              A: Hidden dependencies and stale state. A region can only serve traffic safely if it has correct data, keys, and capacity. Unpracticed failover fails when needed most.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide what data replicates globally?</p>
            <p className="mt-2 text-sm text-muted">
              A: Classify data by correctness sensitivity. Control and security state often stays strongly consistent or centralized, while derived and content data can be eventually consistent with explicit staleness budgets.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

