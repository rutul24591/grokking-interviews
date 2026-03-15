"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-high-availability-extensive",
  title: "High Availability",
  description: "In-depth guide to high availability architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "reliability-fault-tolerance",
  slug: "high-availability",
  wordCount: 1056,
  readingTime: 6,
  lastUpdated: "2026-03-13",
  tags: ['backend', 'reliability', 'availability'],
  relatedTopics: ['failover-mechanisms', 'redundancy', 'multi-region-deployment'],
};

export default function HighAvailabilityConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>High availability (HA) is the ability of a system to serve traffic within defined error and latency budgets even while components fail. It is a property of the full stack and the organization: architecture choices, capacity policy, deployment discipline, and incident response all contribute.</p>
        <p>A useful HA definition is anchored in time. Targets such as 99.9% or 99.99% translate into allowed minutes of downtime per month. Designing to the target means ensuring that the most likely failures stay within that window and that rare failures have a fast, rehearsed recovery path.</p>
      </section>

      <section>
        <h2>Availability Budgets and SLOs</h2>
        <p>HA design starts by mapping business impact to an availability SLO and an error budget. The budget converts reliability work into a concrete constraint: if you burn it, you slow down changes. This keeps “always up” rhetoric grounded in measurable outcomes.</p>
        <p>SLO alignment must include dependencies. If the service relies on an auth provider, database cluster, or external API with weaker guarantees, then the system can only be as available as the weakest link. In practice, you either improve the dependency or insert buffering and degradation so the core experience survives.</p>
        <ArticleImage src="/diagrams/backend/reliability-fault-tolerance/high-availability-diagram-1.svg" alt="High Availability diagram 1" caption="High Availability overview diagram 1." />
      </section>

      <section>
        <h2>Architecture Baselines</h2>
        <p>The baseline for HA is redundancy plus fast routing away from unhealthy nodes. Stateless tiers with shared state stores are easier to scale and failover than stateful nodes. Keep enough headroom so that losing a node or zone does not saturate the remaining capacity.</p>
        <p>HA routing decisions are only as good as health signals. Conservative, multi-signal health checks avoid false positives that can evict healthy capacity. For critical services, use both passive signals (error rate, latency spikes) and active probes to validate readiness.</p>
      </section>

      <section>
        <h2>Failure Modes and Correlated Risk</h2>
        <p>The most damaging outages are correlated: shared power domains, shared networks, or shared control planes. HA requires fault isolation boundaries and a plan for what happens when a dependency fails at the same time as your primary service.</p>
        <p>Misconfigured autoscaling and aggressive health checks are also common causes of self-induced outages. If the control plane is too eager, it can oscillate the system into instability. Stabilization rules, warm pools, and circuit breakers reduce these dynamics.</p>
        <ArticleImage src="/diagrams/backend/reliability-fault-tolerance/high-availability-diagram-2.svg" alt="High Availability diagram 2" caption="High Availability overview diagram 2." />
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <p>A pragmatic playbook is detect, isolate, stabilize, and restore. Detection should be tied to SLO burn rather than raw error counts. Isolation removes unhealthy nodes and stops risky automation that may amplify the incident. Stabilization reduces work: rate limit, shed optional features, or switch to cached reads.</p>
        <p>Restoration should be controlled and incremental. Reintroduce capacity in small waves, validate error budgets, and keep rollback paths warm. Mature HA operations also include change freezes after a major incident and explicit risk reviews before large releases.</p>
      </section>

      <section>
        <h2>Trade-offs and Decision Framework</h2>
        <p>Higher availability costs more and increases operational complexity. Active-active designs reduce downtime but require careful data consistency models and conflict handling. Active-passive designs are cheaper but increase recovery time. The right choice depends on user tolerance and revenue impact.</p>
        <p>Automation is a double-edged sword. Fast failover is essential, but automated decisions can propagate faults if they are wrong. Build manual overrides, cap the blast radius of automation, and require guardrails such as “two independent signals” before large actions.</p>
        <ArticleImage src="/diagrams/backend/reliability-fault-tolerance/high-availability-diagram-3.svg" alt="High Availability diagram 3" caption="High Availability overview diagram 3." />
      </section>

      <section>
        <h2>Validation and Continuous Testing</h2>
        <p>HA assumptions should be tested in production-like conditions. Run failover drills, capacity loss tests, and dependency outage simulations. Measure detection time, time-to-eject, and time-to-recover, then compare against the availability budget.</p>
        <p>Change management is part of testing. Canary rollouts, progressive delivery, and automatic rollbacks reduce downtime caused by deployments, which remain the most common source of HA breaches in mature systems.</p>
      </section>

      <section>
        <h2>Multi-Zone and Multi-Region Patterns</h2>
        <p>
          High availability often starts with multi-zone designs. Zones are close enough that synchronous replication and
          low-latency failover can be feasible, while still protecting against many infrastructure failures. Multi-region
          availability is a larger step: it improves blast radius and user latency but increases data consistency
          complexity, operational overhead, and the probability of partial partitions.
        </p>
        <p>
          A practical progression is: single region, multi-zone; then active-passive across regions; then selective
          active-active for read-heavy or conflict-tolerant workloads. Each step should be justified with a concrete
          reduction in downtime risk or a concrete improvement in user experience, not only with architectural preference.
        </p>
      </section>

      <section>
        <h2>Scenario: Tiered Service With Shared Database</h2>
        <p>Consider a three-tier web app with a shared primary database. The web tier can be highly available with load-balanced stateless instances, but the database is a single failure point. The HA plan may include synchronous replicas, read-only fallbacks, or a warm standby. The database strategy becomes the dominant factor in the overall availability.</p>
        <p>The practical mitigation is to introduce read separation and robust caching, and to plan a failover that is as automated as possible without violating data integrity. In many cases, accepting degraded read-only mode during a write-path outage keeps availability within budget.</p>
      </section>

      <section>
        <h2>Capacity and Load Shedding</h2>
        <p>HA targets are meaningless if the system runs near saturation. Capacity planning should include loss-of-zone and loss-of-region scenarios, and the service should have explicit load-shedding rules so it fails partially rather than catastrophically.</p>
        <p>A common pattern is tiered degradation: shed optional features first, then reduce request volume for non-critical tenants, and only last reject traffic for core journeys. The order should be explicit and tied to business impact.</p>
      </section>

      <section>
        <h2>Dependency Budgeting</h2>
        <p>Availability budgets should be allocated across dependencies. If the API requires a search index and a personalization engine, define how much of the total downtime budget each dependency can consume.</p>
        <p>This makes trade-offs explicit and helps prioritize fixes. Without dependency budgets, availability discussions often become subjective and unproductive.</p>
      </section>

      <section>
        <h2>Governance and Change Control</h2>
        <p>Many HA breaches come from change, not hardware failure. Mature teams gate high-risk changes behind progressive delivery, and tie release velocity to error budget burn.</p>
        <p>Governance does not mean bureaucracy. It means having an explicit policy for when to slow down, when to accelerate, and who can override that policy in emergencies.</p>
      </section>

      <section>
        <h2>Operational Signals to Watch</h2>
        <ul className="space-y-2">
          <li><strong>Error budget burn:</strong> burn rate over short and long windows for critical SLOs.</li>
          <li><strong>Capacity headroom:</strong> saturation metrics under loss-of-node and loss-of-zone scenarios.</li>
          <li><strong>Failover readiness:</strong> time since last successful failover drill and promotion success rate.</li>
          <li><strong>Dependency health:</strong> latency and error rates of the weakest-link dependencies that constrain overall availability.</li>
          <li><strong>Change risk:</strong> rollback rate and incidents correlated with deployments, migrations, or config changes.</li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Define availability target and allowed downtime, remove single points of failure across compute/network/storage, reserve capacity headroom, and automate health-based routing.</p>
        <p>Run regular failover drills, rehearse dependency outages, and tie change velocity to error budget burn.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you translate an availability target into design choices?</p>
            <p className="mt-2 text-sm text-muted">
              A: Convert the target into downtime minutes, then design for the most likely failures inside that budget:
              remove single points of failure, reserve headroom, and automate safe routing away from unhealthy nodes.
              Validate the plan with drills and compare measured recovery time to the budget.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Active-active vs active-passive: what are the trade-offs?</p>
            <p className="mt-2 text-sm text-muted">
              A: Active-active improves latency and uses capacity efficiently but increases data and operational
              complexity. Active-passive is simpler for correctness, but it can waste capacity and may have longer
              failover if the standby is not warm and exercised.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent automation from amplifying outages?</p>
            <p className="mt-2 text-sm text-muted">
              A: Guard large actions behind multi-signal confirmation, cooldowns, and blast-radius caps. Keep manual
              overrides, and avoid feedback loops where alerts trigger automation that increases load (retries, restarts,
              rebalances) during incidents.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you keep a service partially available during dependency outages?</p>
            <p className="mt-2 text-sm text-muted">
              A: Degrade optional features, serve cached or read-only responses, and apply backpressure to protect the
              data tier. Partial availability is often the difference between staying inside the error budget and a full
              outage.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
