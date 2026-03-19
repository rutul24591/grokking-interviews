"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-multi-region-replication-extensive",
  title: "Multi-Region Replication",
  description: "Comprehensive guide to multi-region replication, covering active-active, active-passive, conflict resolution, latency considerations, and global distribution patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "multi-region-replication",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "multi-region", "replication", "global", "distributed-systems", "latency"],
  relatedTopics: ["high-availability", "consistency-model", "disaster-recovery", "scalability-strategy"],
};

export default function MultiRegionReplicationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Multi-Region Replication</strong> distributes data across geographic regions to improve
          latency, availability, and disaster recovery. It is essential for global applications serving
          users across continents.
        </p>
        <p>
          Multi-region architectures trade complexity for benefits:
        </p>
        <ul>
          <li>
            <strong>Lower latency:</strong> Users access nearest region.
          </li>
          <li>
            <strong>Higher availability:</strong> Survive region-wide outages.
          </li>
          <li>
            <strong>Disaster recovery:</strong> Geographic separation protects against regional disasters.
          </li>
          <li>
            <strong>Data residency:</strong> Store data in specific jurisdictions for compliance.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Physics Matters</h3>
          <p>
            Speed of light limits replication speed. US to Europe is ~70ms one-way. Synchronous replication
            across continents is impossible. Multi-region requires accepting eventual consistency or
            partitioning data by region.
          </p>
        </div>
      </section>

      <section>
        <h2>Replication Patterns</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/multi-region-replication.svg"
          alt="Multi-Region Replication Patterns"
          caption="Multi-Region Replication — showing Active-Passive, Active-Active, and Regional Sharding patterns with conflict resolution strategies and latency considerations"
        />
        <p>
          Several patterns for multi-region data:
        </p>
      </section>

      <section>
        <h2>Multi-Region Architecture Deep Dive</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/multi-region-deep-dive.svg"
          alt="Multi-Region Deep Dive"
          caption="Multi-Region Deep Dive — showing global distribution patterns, data residency and compliance requirements, cross-region conflict resolution"
        />
        <p>
          Advanced multi-region concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Active-Passive (Primary-Secondary)</h3>
        <p>
          One region handles all writes, others are read-only replicas:
        </p>
        <ul>
          <li>
            <strong>Write path:</strong> All writes go to primary region.
          </li>
          <li>
            <strong>Read path:</strong> Reads served from nearest region.
          </li>
          <li>
            <strong>Replication:</strong> Async from primary to secondaries.
          </li>
        </ul>
        <p>
          <strong>Pros:</strong> Simple, no write conflicts, strong consistency for writes.
        </p>
        <p>
          <strong>Cons:</strong> Write latency for distant users, single point of failure (primary).
        </p>
        <p>
          <strong>Use when:</strong> Write consistency is critical, writes are infrequent.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Active-Active (Multi-Primary)</h3>
        <p>
          Multiple regions accept writes, replicate to each other:
        </p>
        <ul>
          <li>
            <strong>Write path:</strong> Writes accepted in any region.
          </li>
          <li>
            <strong>Read path:</strong> Reads from nearest region.
          </li>
          <li>
            <strong>Replication:</strong> Bidirectional async between regions.
          </li>
        </ul>
        <p>
          <strong>Pros:</strong> Low latency for all operations, survives region failures.
        </p>
        <p>
          <strong>Cons:</strong> Write conflicts, complex conflict resolution, eventual consistency.
        </p>
        <p>
          <strong>Use when:</strong> Low latency required globally, conflicts are rare or resolvable.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Regional Sharding</h3>
        <p>
          Data partitioned by region, each region owns its data:
        </p>
        <ul>
          <li>
            <strong>Write path:</strong> Writes go to user&apos;s home region.
          </li>
          <li>
            <strong>Read path:</strong> Reads from home region.
          </li>
          <li>
            <strong>Replication:</strong> Optional replication for disaster recovery.
          </li>
        </ul>
        <p>
          <strong>Pros:</strong> No conflicts, data residency compliance, low latency.
        </p>
        <p>
          <strong>Cons:</strong> Cross-region access complex, user mobility challenges.
        </p>
        <p>
          <strong>Use when:</strong> Data residency required, users primarily access own data.
        </p>
      </section>

      <section>
        <h2>Conflict Resolution</h2>
        <p>
          Active-active replication requires conflict handling:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Last Write Wins (LWW)</h3>
        <p>
          Use timestamp to determine winner:
        </p>
        <ul>
          <li>Simple to implement.</li>
          <li>Data loss possible (losing write discarded).</li>
          <li>Clock synchronization critical.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Application-Level Merge</h3>
        <p>
          Custom merge logic per data type:
        </p>
        <ul>
          <li>Shopping cart: Union of items.</li>
          <li>Counters: Sum of increments.</li>
          <li>Documents: Field-level merge.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CRDTs (Conflict-Free Replicated Data Types)</h3>
        <p>
          Mathematical structures that guarantee convergence:
        </p>
        <ul>
          <li>G-Counter (grow-only counter).</li>
          <li>PN-Counter (increment/decrement).</li>
          <li>OR-Set (observed-remove set).</li>
          <li>LWW-Register (last-write-wins register).</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a globally distributed social media platform. How do you handle multi-region replication?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Region strategy:</strong> Active-active in 3 regions (US-East, EU-West, APAC). Each region handles local traffic.</li>
                <li><strong>Data partitioning:</strong> User data partitioned by region (user&apos;s home region). Reduces cross-region reads.</li>
                <li><strong>Replication:</strong> Async replication for feeds/likes (eventual consistency OK). Sync replication for critical data (auth, payments).</li>
                <li><strong>Conflict resolution:</strong> Last-write-wins for likes/comments. CRDTs for counters (share counts).</li>
                <li><strong>CDN:</strong> Cache static content (images, videos) at edge. Reduces origin load.</li>
                <li><strong>Failover:</strong> DNS-based failover. If region fails, route to nearest healthy region.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Compare active-active vs active-passive multi-region. When would you choose each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Active-Active:</strong> All regions handle traffic. ✓ Zero downtime failover, full capacity utilization. ✗ Complex (conflict resolution), higher cost. Best for: Mission-critical (payments, healthcare).</li>
                <li><strong>Active-Passive:</strong> One region active, others on standby. ✓ Simpler (no conflicts), lower cost. ✗ Wasted capacity, failover delay. Best for: Business-critical (e-commerce, SaaS).</li>
                <li><strong>Decision:</strong> Active-active if RTO=0 required. Active-passive if RTO=minutes acceptable.</li>
                <li><strong>Cost:</strong> Active-active = 2-3× infrastructure cost. Active-passive = 1.5× (standby scaled down).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. How do you handle write conflicts in an active-active setup?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Prevention:</strong> Partition by user (user A always writes to region 1). Eliminates most conflicts.</li>
                <li><strong>Last-write-wins:</strong> Use timestamp to pick winner. ✓ Simple. ✗ Data loss (losing write discarded).</li>
                <li><strong>Vector clocks:</strong> Track causality. Detect true conflicts. Application resolves conflicts. ✓ No data loss. ✗ Complex.</li>
                <li><strong>CRDTs:</strong> Mathematical structures that merge automatically (counters, sets). ✓ Automatic merge. ✗ Limited data types.</li>
                <li><strong>Application merge:</strong> Custom merge logic per data type. Example: Merge shopping carts (union of items).</li>
                <li><strong>Best practice:</strong> Prevent conflicts (partitioning) + CRDTs for counters + last-write-wins for rest.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Design a system that must comply with GDPR data residency requirements while serving global users.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Data residency:</strong> EU user data stays in EU region. No cross-border transfer without consent.</li>
                <li><strong>Region routing:</strong> EU users → EU region. US users → US region. Enforce at DNS/load balancer level.</li>
                <li><strong>Data isolation:</strong> Separate databases per region. No replication of EU data to non-EU regions.</li>
                <li><strong>Global features:</strong> For global features (search), use anonymized/aggregated data (not personal data).</li>
                <li><strong>User consent:</strong> Explicit consent for cross-border transfer. Allow users to opt-out.</li>
                <li><strong>Audit:</strong> Log all data access. Prove compliance during audits.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. What is the impact of speed of light on multi-region replication? How do you design around it?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Speed of light limit:</strong> ~100ms round-trip US-East to EU-West. Can&apos;t be faster (physics).</li>
                <li><strong>Impact on sync replication:</strong> Sync replication across regions adds 100-200ms latency per write. Too slow for interactive apps.</li>
                <li><strong>Design around it:</strong> (1) Async replication for cross-region. (2) Sync replication only within region. (3) Accept eventual consistency across regions.</li>
                <li><strong>User experience:</strong> Users read/write to their home region (low latency). Cross-region reads may be stale.</li>
                <li><strong>Best practice:</strong> Don&apos;t fight physics. Design for async cross-region replication. Use sync only within region.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you handle failover in an active-passive multi-region setup?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Detection:</strong> Health checks from multiple locations. Confirm outage (not false positive). 2-5 minutes.</li>
                <li><strong>DNS failover:</strong> Update DNS to point to passive region. TTL should be low (60 seconds) for fast failover.</li>
                <li><strong>Database promotion:</strong> Promote read replica to primary. Verify data consistency. 5-10 minutes.</li>
                <li><strong>Scale up:</strong> Passive region is scaled down. Auto-scale to full capacity. 5-10 minutes.</li>
                <li><strong>Verification:</strong> Run smoke tests. Verify all services healthy. Update status page.</li>
                <li><strong>Total RTO:</strong> 15-30 minutes for active-passive. Test quarterly to validate.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Multi-Region Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Selected replication pattern (active-active, active-passive, sharded)</li>
          <li>✓ Conflict resolution strategy defined</li>
          <li>✓ Data residency requirements identified</li>
          <li>✓ Latency targets per region defined</li>
          <li>✓ Failover procedures documented</li>
          <li>✓ Monitoring per region configured</li>
          <li>✓ Cross-region testing performed</li>
          <li>✓ DNS/routing configured for geo-routing</li>
          <li>✓ Backup strategy per region</li>
          <li>✓ Cost analysis for multi-region (egress, storage)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
