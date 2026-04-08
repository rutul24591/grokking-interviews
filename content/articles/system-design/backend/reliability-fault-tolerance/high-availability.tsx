"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-high-availability",
  title: "High Availability",
  description: "Staff-level high availability patterns: nines of availability, active-passive vs active-active architectures, failure domain isolation, multi-AZ and multi-region HA design, and operational readiness for production-scale systems.",
  category: "backend",
  subcategory: "reliability-fault-tolerance",
  slug: "high-availability",
  wordCount: 5900,
  readingTime: 24,
  lastUpdated: "2026-04-08",
  tags: ["backend", "reliability", "high-availability", "active-active", "active-passive", "failure-domains", "multi-region"],
  relatedTopics: ["failover-mechanisms", "redundancy", "multi-region-deployment", "disaster-recovery"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>High availability (HA)</strong> is the ability of a system to serve traffic within defined error and latency budgets even while components fail. It is not a binary property—"available" or "unavailable"—but a measurable characteristic defined by availability targets expressed as percentages of uptime over a time period. High availability is a property of the full stack and the organization: architecture choices, capacity policy, deployment discipline, and incident response all contribute.
        </p>
        <p>
          High availability is often misunderstood as "never go down." In practice, HA design starts by mapping business impact to an availability target and an error budget. A target of 99.9 percent allows about 43 minutes of downtime per month. A target of 99.99 percent allows about 4 minutes. Designing to the target means ensuring that the most likely failures stay within that window and that rare failures have a fast, rehearsed recovery path. The target drives every architectural decision: redundancy level, failover speed, deployment strategy, and operational budget.
        </p>
        <p>
          For staff and principal engineers, high availability requires balancing four competing concerns. <strong>Redundancy</strong> means eliminating single points of failure across compute, network, storage, and data layers. <strong>Consistency</strong> means that redundant systems must maintain data correctness—active-active designs with concurrent writes introduce conflict resolution complexity that can itself reduce availability if conflicts are not handled correctly. <strong>Automation</strong> means that detection, failover, and recovery must happen automatically within the error budget window, but automation must be guarded against self-induced outages. <strong>Cost</strong> means that higher availability requires more infrastructure, more operational complexity, and more engineering investment—the right level depends on actual business requirements, not aspirational nines.
        </p>
        <p>
          The business impact of availability decisions is directly measurable in revenue, user trust, and competitive positioning. For an e-commerce platform, every minute of downtime during peak hours represents lost revenue that is not recovered. For a financial services platform, availability is a regulatory requirement with contractual penalties. For a developer platform, availability affects developer trust and platform adoption. The availability target should be derived from business impact analysis, not copied from industry benchmarks.
        </p>
        <p>
          In system design interviews, high availability demonstrates understanding of failure domain analysis, redundancy patterns, data consistency trade-offs, and the relationship between architecture and operational practice. It shows you design for the reality that hardware fails, networks partition, deployments introduce bugs, and that a system must survive all of these without violating its availability commitments.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/ha-architecture-patterns.svg"
          alt="High availability architecture patterns showing three designs: Active-Passive (primary serves all traffic, standby waits, failover on primary failure), Active-Active (both regions serve traffic, load balancer distributes, data replication bidirectional), and Multi-AZ (single region with multiple availability zones, each zone has compute and data, load balancer distributes across zones). Each pattern shows traffic flow, data replication, and failover behavior"
          caption="High availability architecture patterns — active-passive for simplicity, active-active for performance, and multi-AZ for regional resilience"
        />

        <h3>Nines of Availability</h3>
        <p>
          Availability is expressed as a percentage of uptime over a defined period, typically monthly or annually. The "nines" represent the number of 9s in this percentage. Three nines (99.9 percent) allows 43.2 minutes of downtime per month or 8.76 hours per year. Four nines (99.99 percent) allows 4.32 minutes per month or 52.6 minutes per year. Five nines (99.999 percent) allows 26 seconds per month or 5.26 minutes per year.
        </p>
        <p>
          Each additional nine requires an order-of-magnitude improvement in reliability, which typically means an order-of-magnitude increase in cost and complexity. Moving from two nines to three nines requires eliminating obvious single points of failure. Moving from three to four nines requires automated failover, zero-downtime deployments, and robust monitoring. Moving from four to five nines requires geographic redundancy, automated cross-region failover, and elimination of all manual operations that could cause downtime.
        </p>
        <p>
          The critical insight is that your system can only be as available as its weakest dependency. If your service has 99.99 percent availability but depends on an authentication provider with 99.9 percent availability, your effective availability is bounded by 99.9 percent unless you implement buffering, caching, or degradation that allows your service to function when the dependency is unavailable. Availability budgets must be allocated across all dependencies, and the sum of dependency downtime must not exceed the overall budget.
        </p>

        <h3>Active-Passive Architecture</h3>
        <p>
          In an active-passive architecture, one instance (or region) serves all traffic while the standby waits ready to take over. The standby can be cold (resources allocated but not running), warm (running and synchronized but not receiving traffic), or hot (running, synchronized, and receiving a small percentage of traffic for validation). The failover process detects primary failure, promotes the standby, and redirects traffic.
        </p>
        <p>
          Active-passive is simpler for data correctness because only one instance handles writes, eliminating conflict resolution. The standby can be an exact replica of the primary with synchronous or asynchronous data replication. The trade-off is recovery time: failover takes time—detecting the failure, promoting the standby, and redirecting traffic—and this time must fit within the availability budget.
        </p>
        <p>
          Warm standby is the practical sweet spot for most systems. Keep the standby running, serving a small percentage of traffic or shadow reads. This exercises the failover path continuously, reduces promotion time because the standby is already initialized, and detects configuration drift because the standby is actively processing. Cold standby is cheaper but riskier—the standby may have drifted and failover may be slow or broken.
        </p>

        <h3>Active-Active Architecture</h3>
        <p>
          In an active-active architecture, multiple instances (or regions) serve traffic concurrently. A load balancer distributes requests across all active instances. If one instance fails, traffic is automatically redistributed to the remaining instances. Active-active designs provide faster failover—no promotion is needed, traffic simply shifts—and better resource utilization because all capacity is productive.
        </p>
        <p>
          The challenge for active-active is data consistency. If multiple instances can write to the same data concurrently, conflict resolution is required. Options include: partitioning writes by user or tenant so that each instance owns a subset of data (no conflicts for partitioned data, but cross-partition queries become complex), using conflict-free replicated data types (CRDTs) that mathematically guarantee convergence, or accepting last-write-wins semantics with reconciliation processes that detect and repair divergence.
        </p>
        <p>
          Active-active is ideal for read-heavy workloads, stateless tiers, and workloads that can be partitioned by geography or tenant. It is less suitable for workloads that require strong consistency across all instances, such as financial ledgers or inventory management, unless the partitioning strategy ensures that each write goes to a single authoritative instance.
        </p>

        <h3>Failure Domain Isolation</h3>
        <p>
          A failure domain is a boundary within which a single failure can cause correlated component failures. Redundancy only reduces risk if redundant components are in different failure domains. Duplicating servers within the same rack does not protect against rack power failure. Duplicating racks within the same data center does not protect against data center fire. Duplicating data centers within the same region does not protect against regional network outage.
        </p>
        <p>
          Failure domains exist at multiple levels. Hardware domains include power supplies, network switches, and physical racks. Infrastructure domains include availability zones, regions, and cloud providers. Software domains include shared libraries, configuration pipelines, and deployment systems. A bug in a shared library deployed to all instances simultaneously is a failure domain, even if the instances are spread across multiple regions.
        </p>
        <p>
          The most damaging outages come from correlated failures across failure domains. Shared control planes, shared identity systems, shared CI/CD pipelines, and shared configuration management can all turn geographically distributed redundancy into a common-mode failure. HA planning must explicitly enumerate common-mode dependencies and decide which require diversity—multiple providers, multiple routes, multiple credential paths.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/nines-of-availability.svg"
          alt="Nines of availability chart showing availability percentages from 99% to 99.999% with corresponding allowed downtime per month and per year. Also shows the architecture complexity and cost increasing with each additional nine. Visual comparison of what each level requires"
          caption="Nines of availability — each additional nine requires order-of-magnitude improvement in reliability and corresponding increase in cost and complexity"
        />

        <h3>Multi-AZ and Multi-Region HA</h3>
        <p>
          Multi-AZ high availability distributes instances across availability zones within a single region. Zones are close enough that synchronous replication and low-latency failover are feasible, while still protecting against many infrastructure failures such as power loss, cooling failure, or network issues within a single zone. Multi-AZ is the baseline for production systems that need better than 99.9 percent availability.
        </p>
        <p>
          Multi-region HA distributes instances across geographic regions. It improves blast radius protection and user latency but increases data consistency complexity, operational overhead, and the probability of partial network partitions. Multi-region is appropriate for systems that need 99.99 percent or higher availability, or for systems that serve global users with latency requirements.
        </p>
        <p>
          A practical progression is: single region with multi-AZ first, then active-passive across regions for disaster recovery, then selective active-active for read-heavy or conflict-tolerant workloads. Each step should be justified with a concrete reduction in downtime risk or a concrete improvement in user experience, not only with architectural preference. Multi-region is expensive and complex—use it when the business requires it, not because it is technically impressive.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A high availability architecture follows a pragmatic playbook: detect, isolate, stabilize, and restore. Detection should be tied to SLO burn rather than raw error counts—isolate removes unhealthy nodes and stops risky automation that may amplify the incident. Stabilization reduces work through rate limiting, shedding optional features, or switching to cached reads. Restoration should be controlled and incremental, reintroducing capacity in small waves and validating error budgets at each step.
        </p>

        <h3>Availability Budget Allocation</h3>
        <p>
          Start by converting the availability target into a monthly downtime budget. Then allocate portions of this budget to each component and dependency. If the target is 99.9 percent (43 minutes per month), and the system has a web tier, an API tier, a database, and an external authentication provider, allocate the budget based on criticality and historical failure rates. The database might get 15 minutes, the API tier 10 minutes, the web tier 5 minutes, and the auth provider 13 minutes.
        </p>
        <p>
          This allocation makes trade-offs explicit. If the auth provider's historical downtime exceeds its allocated budget, you must either improve the provider (add caching, add a fallback provider) or reduce the budget allocated elsewhere. Without dependency budgets, availability discussions remain subjective and unproductive.
        </p>

        <h3>Capacity Headroom and Loss Scenarios</h3>
        <p>
          HA targets are meaningless if the system runs near saturation. Capacity planning must include loss-of-zone and loss-of-region scenarios. If the system uses three availability zones and each runs at 70 percent utilization, losing one zone means the remaining two must handle 105 percent of the original load each—which is impossible. The system must be designed so that losing the largest credible failure domain (one zone, one region) does not push remaining capacity into saturation.
        </p>
        <p>
          The practical rule is to plan for N+1 capacity at minimum: if you need N instances to handle peak load, run N+1 instances so that losing one leaves N still capable. For multi-AZ designs, ensure that each zone can handle the full load if all other zones fail, or at least that the remaining zones combined can handle peak load. This often means running at 50-67 percent utilization in steady state, which has cost implications that must be justified by the availability target.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/ha-failure-domains.svg"
          alt="Failure domain isolation diagram showing nested failure boundaries: Instance level (single server failure), Rack level (power/network switch failure), AZ level (availability zone outage), Region level (regional outage), and Provider level (cloud provider outage). Each level shows the blast radius and the redundancy strategy needed to protect against it"
          caption="Failure domain isolation — redundancy must cross failure domain boundaries to be effective; duplicating within the same domain does not reduce risk"
        />

        <h3>Load Shedding and Tiered Degradation</h3>
        <p>
          Even with redundancy and capacity headroom, there are scenarios where the system cannot sustain full functionality. Load shedding is the controlled rejection of traffic to protect core operations. Tiered degradation sheds optional features first, then reduces request volume for non-critical tenants, and only as a last resort rejects traffic for core journeys. The order should be explicit and tied to business impact.
        </p>
        <p>
          Load shedding is not a failure of HA design—it is a necessary safety valve. A system that tries to accept all traffic during overload will fail catastrophically, taking down even core functionality. A system that sheds load gracefully preserves what matters most and recovers faster when the overload subsides.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Higher availability costs more and increases operational complexity. Active-active designs reduce downtime but require careful data consistency models and conflict handling. Active-passive designs are cheaper for correctness but increase recovery time and waste standby capacity. The right choice depends on user tolerance for downtime, revenue impact per minute of outage, and the organization's operational maturity to manage complex architectures.
        </p>
        <p>
          Automation is a double-edged sword in HA. Fast failover is essential for meeting tight availability budgets, but automated decisions can propagate faults if they are wrong. A misconfigured health check triggering automated failover can cause an outage rather than prevent one. Build manual overrides, cap the blast radius of automation, and require guardrails such as "two independent signals" before large actions like cross-region failover.
        </p>
        <p>
          There is also a trade-off between HA and development velocity. Systems with tight availability budgets require more testing, more cautious deployments, and more operational overhead. Progressive delivery, canary rollouts, and automatic rollbacks reduce the deployment-related downtime that is the most common source of HA breaches in mature systems, but they slow the release pipeline. The balance between velocity and stability should be explicit and tied to the availability budget.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Define the availability target explicitly and design every component to fit within the allocated budget. Remove single points of failure across compute, network, storage, and data layers. Reserve capacity headroom so that losing the largest credible failure domain does not saturate remaining capacity. Automate health-based routing so that unhealthy instances are removed from rotation within seconds, not minutes.
        </p>
        <p>
          Run regular failover drills and rehearse dependency outages. Measure detection time, time-to-eject, and time-to-recover, then compare against the availability budget. If measured recovery time exceeds the budget, the architecture needs improvement. Drills should be conducted in production-like conditions with realistic traffic patterns and dependency configurations.
        </p>
        <p>
          Tie change velocity to error budget burn. When the error budget is healthy, release normally. When the budget is burning fast, slow down releases and focus on stability. This creates a natural feedback loop between reliability and development velocity that keeps the system within its availability target.
        </p>
        <p>
          Implement progressive delivery for all production changes. Canary rollouts, feature flags, and automatic rollbacks reduce the risk that a bad deployment causes an availability breach. Deployments are the most common source of outages in mature systems—treating every deployment as a potential failure event and designing for fast rollback is essential for high availability.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is designing for the wrong availability target. Teams aspirationally target 99.99 percent without analyzing whether the business actually needs it, and then cannot sustain the cost and complexity. Conversely, teams under-target availability for revenue-critical services and suffer repeated outages that cost more than the investment in HA would have. The target must be derived from business impact analysis, not guesswork.
        </p>
        <p>
          Correlated failures across failure domains are the most dangerous HA failure mode. Teams build multi-AZ or multi-region redundancy but share a control plane, identity provider, or CI/CD pipeline across all zones or regions. When the shared dependency fails, all redundant instances fail simultaneously. Redundancy planning must explicitly enumerate common-mode dependencies and add diversity where the shared dependency represents a significant risk.
        </p>
        <p>
          Misconfigured autoscaling and aggressive health checks are common causes of self-induced outages. If the control plane is too eager to scale down or eject unhealthy nodes, it can oscillate the system into instability. Stabilization rules, warm pools, and circuit breakers reduce these dynamics. The system should be conservative about removing capacity, especially during incidents when it is most needed.
        </p>
        <p>
          Insufficient testing of standby systems is another critical pitfall. A standby that has not been exercised may have configuration drift, outdated schemas, or stale caches that make failover slow or broken. Warm standby with shadow traffic or periodic synthetic transactions exercises the failover path continuously and detects drift before an actual failure.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce: Multi-AZ During Zone Outage</h3>
        <p>
          An e-commerce platform deployed across three availability zones in a single region experienced a complete zone outage when the zone lost network connectivity. Because the platform was designed with multi-AZ redundancy and each zone had sufficient headroom to handle the full load, the remaining two zones absorbed all traffic automatically. The load balancer detected the zone failure within 30 seconds and stopped routing traffic to the affected zone. Users experienced a brief latency spike during the failover but no errors. The platform maintained 100 percent availability during the zone outage, which lasted 4 hours.
        </p>

        <h3>Financial Services: Active-Passive Cross-Region DR</h3>
        <p>
          A financial services company maintained an active-passive multi-region setup with synchronous data replication to the passive region. During a regional network outage, the failover process was initiated automatically based on multi-signal confirmation: sustained error rate spikes, elevated tail latency, and loss of routing health checks. The passive region was promoted, DNS was updated, and traffic was redirected within 3 minutes. The RPO was zero due to synchronous replication, and the RTO was under 5 minutes, well within the 99.99 percent availability target.
        </p>

        <h3>SaaS Platform: Active-Active Read Replicas</h3>
        <p>
          A B2B SaaS platform served global customers with an active-active frontend across three regions and a primary-write database in one region with read replicas in the other two. Read traffic was served locally from regional replicas, reducing latency by 60 percent for international users. Writes went to the primary region with asynchronous replication to replicas. During a primary region degradation, the platform temporarily switched to read-only mode in all regions, preserving 90 percent of user functionality while write operations were queued and replayed after recovery.
        </p>

        <h3>Social Media: Progressive Deployment for HA</h3>
        <p>
          A social media platform with 500 million daily users implemented progressive delivery to protect availability during deployments. Each release started with 1 percent of traffic, automatically monitored error rates, latency, and resource utilization. If metrics remained healthy for 15 minutes, traffic increased to 10 percent, then 50 percent, then 100 percent. If any metric degraded, the deployment automatically rolled back. This reduced deployment-related incidents by 90 percent and eliminated the single largest source of availability breaches in their system.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: How do you translate an availability target into architectural design choices?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Convert the target into downtime minutes per month, then design for the most likely failures within that budget. Remove single points of failure across all layers. Reserve capacity headroom so that losing the largest credible failure domain does not saturate remaining capacity. Automate health-based routing for fast removal of unhealthy nodes. Allocate the downtime budget across dependencies and ensure each dependency fits within its allocation.
            </p>
            <p>
              Validate the plan with drills—measure detection time, time-to-eject, and time-to-recover, and compare against the budget. If measured recovery exceeds the budget, the architecture needs improvement. The target drives everything: redundancy level, failover automation, deployment strategy, and operational budget.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: Active-active versus active-passive: what are the trade-offs?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Active-active improves latency because users are served from the nearest instance and uses capacity efficiently because all instances are productive. However, it increases data and operational complexity—concurrent writes require conflict resolution, and failover safety is more complex because traffic redistribution must not overload surviving instances.
            </p>
            <p>
              Active-passive is simpler for correctness because only one instance handles writes, eliminating conflict resolution. However, it wastes standby capacity—the passive instance sits idle—and may have longer failover time if the standby is not warmed and exercised. The choice depends on the availability target, data consistency requirements, and operational maturity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you prevent automation from amplifying outages?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Guard large automated actions behind multi-signal confirmation, cooldowns, and blast-radius caps. Require two independent signals before triggering failover, not just one metric spike. Cap how much capacity can be removed or redirected in a single automated action. Keep manual overrides available so operators can stop runaway automation.
            </p>
            <p>
              Avoid feedback loops where alerts trigger automation that increases load during incidents. For example, automatic retries on failed requests amplify load on an already-stressed system. Automatic instance restarts during a dependency outage increase initialization load. Automation should reduce load during incidents, not increase it.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you keep a service partially available during dependency outages?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Degrade optional features that depend on the unavailable dependency, serve cached or read-only responses, and apply backpressure to protect the data tier. For example, if a recommendation service is down, serve cached recommendations. If a write path is unavailable, queue writes for later processing. Partial availability is often the difference between staying inside the error budget and a full outage.
            </p>
            <p>
              Design the system with explicit degradation paths and automated triggers. The system should degrade automatically when it detects that a dependency is unavailable, not wait for human operators to decide during an incident. Pre-defined degradation paths ensure fast, consistent response under pressure.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: Why do correlated failures threaten high availability?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Correlated failures occur when redundant components share a common dependency or failure domain. A shared control plane, identity provider, CI/CD pipeline, or configuration system can take down all redundant instances simultaneously, defeating the purpose of redundancy. The most damaging outages come from correlated failures that cross geographic or infrastructure boundaries.
            </p>
            <p>
              Mitigation requires explicitly enumerating common-mode dependencies and adding diversity where needed. Use multiple identity providers, diverse network paths, separate deployment pipelines for different failure domains. Test failures that take out the shared layer, not only a single host. Redundancy within the same failure domain is not meaningful redundancy.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How does change management affect availability?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Deployments and configuration changes are the most common source of availability breaches in mature systems. Every change introduces risk of bugs, misconfiguration, or incompatibility. Progressive delivery—canary rollouts, feature flags, automatic rollbacks—reduces this risk by limiting the blast radius of bad changes and enabling fast recovery.
            </p>
            <p>
              Tie change velocity to error budget burn. When the budget is healthy, release at normal speed. When the budget is burning, slow down releases and focus on stability. This creates a natural feedback loop that prevents the system from exceeding its availability target due to change-related incidents. Change freezes after major incidents and explicit risk reviews before large releases are also essential governance practices.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://sre.google/sre-book/service-availability/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google SRE: Service Availability
            </a> — Comprehensive guide to availability targets, error budgets, and availability design.
          </li>
          <li>
            <a href="https://aws.amazon.com/architecture/high-availability/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS: High Availability Architecture
            </a> — AWS reference architectures for multi-AZ and multi-region high availability.
          </li>
          <li>
            <a href="https://docs.microsoft.com/en-us/azure/architecture/framework/resiliability/availability-targets" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Azure: Availability Targets
            </a> — Azure framework for defining and achieving availability targets.
          </li>
          <li>
            <a href="https://www.usenix.org/system/files/conference/nsdi15/nsdi15-paper-gill.pdf" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              USENIX NSDI: Understanding Data Center Failures
            </a> — Empirical study of data center failures and correlated failure patterns.
          </li>
          <li>
            <a href="https://martinfowler.com/articles/patterns-for-resilient-architecture.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler: Patterns for Resilient Architecture
            </a> — Catalog of resilience patterns including active-active and active-passive designs.
          </li>
          <li>
            <a href="https://sre.google/workbook/availability-in-distributed-systems/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google SRE Workbook: Availability in Distributed Systems
            </a> — Practical guidance on achieving availability in distributed architectures.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}