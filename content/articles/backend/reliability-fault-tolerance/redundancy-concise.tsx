"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-redundancy-extensive",
  title: "Redundancy",
  description: "Using duplication across components, data, and networks to reduce single points of failure.",
  category: "backend",
  subcategory: "reliability-fault-tolerance",
  slug: "redundancy",
  wordCount: 748,
  readingTime: 6,
  lastUpdated: "2026-03-13",
  tags: ['backend', 'reliability', 'redundancy'],
  relatedTopics: ['high-availability', 'backup-restore', 'multi-region-deployment'],
};

export default function RedundancyConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Redundancy is the deliberate duplication of critical components or data so that a failure does not end service. It is the simplest reliability primitive and the foundation for HA, failover, and recovery.</p>
        <p>Redundancy must be aligned to failure domains. Duplicating within the same power rack or the same control plane does not meaningfully reduce correlated risk.</p>
      </section>

      <section>
        <h2>Levels of Redundancy</h2>
        <p>Common levels include compute redundancy (extra instances), network redundancy (multiple paths and providers), and data redundancy (replication, erasure coding). Each level protects against different failure types.</p>
        <p>Designers should map redundancy to the probability and impact of failures. For example, dual power supplies may be sufficient for single-server resilience, but not for an entire zone loss.</p>
        <ArticleImage src="/diagrams/backend/reliability-fault-tolerance/redundancy-diagram-1.svg" alt="Redundancy diagram 1" caption="Redundancy overview diagram 1." />
      </section>

      <section>
        <h2>Redundancy vs Replication</h2>
        <p>Compute redundancy focuses on availability, while data replication focuses on durability and correctness. Combining the two requires careful consistency models: synchronous replication improves data accuracy but reduces availability during partitions.</p>
        <p>A common pitfall is redundant compute with a single shared database. The system appears redundant but still has a single point of failure in the data layer.</p>
      </section>

      <section>
        <h2>Failure Modes</h2>
        <p>Redundancy can create hidden coupling. If redundant systems share a configuration pipeline, a bad deployment can break them all at once. Similarly, shared secrets or identical dependencies can lead to common-mode failure.</p>
        <p>Stale redundancy is another failure. If standby nodes are not exercised, configuration drift or data staleness can make failover unreliable.</p>
        <ArticleImage src="/diagrams/backend/reliability-fault-tolerance/redundancy-diagram-2.svg" alt="Redundancy diagram 2" caption="Redundancy overview diagram 2." />
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <p>Maintain redundancy with regular rotation. Exercise standby capacity with periodic traffic or shadow reads. Validate that redundant paths are usable and monitored.</p>
        <p>Redundancy must be visible. Observability should show capacity, health, and readiness of all redundant components, not just the active ones.</p>
      </section>

      <section>
        <h2>Trade-offs</h2>
        <p>Redundancy increases cost and operational complexity. The right level depends on business impact. For services with low downtime tolerance, redundancy is mandatory; for low-impact internal tools, lighter redundancy is acceptable.</p>
        <p>Excessive redundancy can also complicate debugging and deployment. More nodes and paths mean more variables to control during incidents.</p>
        <ArticleImage src="/diagrams/backend/reliability-fault-tolerance/redundancy-diagram-3.svg" alt="Redundancy diagram 3" caption="Redundancy overview diagram 3." />
      </section>

      <section>
        <h2>Testing and Validation</h2>
        <p>Test by removing a redundant component and verifying that capacity, latency, and error rates remain within targets. Exercises should include both planned and unplanned removals.</p>
        <p>Data redundancy must be tested for recovery paths, not just existence. You must be able to promote a replica or restore from redundant storage quickly.</p>
      </section>

      <section>
        <h2>Scenario: Redundant API and Database</h2>
        <p>A mid-size service uses two API clusters across zones and a replicated database. The API redundancy is effective, but the database replication lag grows under load. Without read routing and conflict handling, redundancy in the API tier does not protect against data-layer bottlenecks.</p>
        <p>The correct mitigation is to scale the data layer or introduce read replicas with a clear staleness budget, which aligns redundancy with actual load paths.</p>
      </section>

      <section>
        <h2>Redundancy in Control Planes</h2>
        <p>Redundancy should include the control plane itself. If deployment systems, config services, or secret managers are single points of failure, the service may be redundant but unmanageable during incidents.</p>
        <p>A practical check is to ask: can the service be restored and operated if the primary control plane is down? If not, redundancy is incomplete.</p>
      </section>

      <section>
        <h2>Economic Efficiency</h2>
        <p>Redundancy can be optimized with shared standby capacity across services, but shared standby creates coupling. Decide explicitly which services can share redundant capacity and which need dedicated headroom.</p>
        <p>The cost model should include the operational burden of extra nodes, not just infrastructure spend.</p>
      </section>

      <section>
        <h2>Drift Management</h2>
        <p>Redundant components fail silently when configuration or schema drift accumulates. Continuous validation and periodic rehydration of standby environments reduce this risk.</p>
        <p>Consider running a small percentage of production traffic through standby systems to keep them exercised and observable.</p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Identify critical components, replicate across fault domains, and ensure redundant systems can take traffic at any time.</p>
        <p>Regularly exercise standby capacity and check for configuration drift.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>What kinds of redundancy matter most for a user-facing API?</p>
        <p>How do you prevent common-mode failure across redundant components?</p>
        <p>When is redundancy not enough, and you still need a recovery plan?</p>
        <p>How would you test whether redundancy is effective?</p>
      </section>
    </ArticleLayout>
  );
}
