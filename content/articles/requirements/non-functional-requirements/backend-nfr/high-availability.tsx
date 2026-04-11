"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-high-availability-extensive",
  title: "High Availability",
  description: "Comprehensive guide to backend high availability, covering redundancy, failover strategies, replication patterns, RTO/RPO, and production reliability for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "high-availability",
  version: "extensive",
  wordCount: 5800,
  readingTime: 25,
  lastUpdated: "2026-04-11",
  tags: ["backend", "nfr", "high-availability", "failover", "replication", "redundancy", "reliability"],
  relatedTopics: ["fault-tolerance", "disaster-recovery", "scalability-strategy", "consistency-model"],
};

export default function HighAvailabilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>High availability</strong> is the ability of a system to remain operational and accessible
          for a high percentage of time, typically measured as a percentage (availability SLA). It is achieved
          through redundancy, failover mechanisms, and the elimination of single points of failure.
        </p>
        <p>
          Availability is expressed as a percentage of uptime over a given period, usually one year. The
          industry standard uses &quot;nines&quot; to describe availability targets. Two nines (99%) allows
          approximately 3.65 days of downtime per year — acceptable for internal tools and development
          environments. Three nines (99.9%) allows 8.76 hours — the standard for production web applications
          and APIs. Four nines (99.99%) allows 52.6 minutes — required for business-critical systems like
          e-commerce platforms and SaaS products. Five nines (99.999%) allows 5.26 minutes — reserved for
          telecommunications, emergency services, and financial trading systems.
        </p>
        <p>
          For staff and principal engineer candidates, availability architecture is a core competency.
          Interviewers expect you to design systems that meet specific availability targets, choose appropriate
          redundancy patterns for each component, define RTO and RPO objectives, and articulate the trade-offs
          between availability, consistency, and cost. The ability to design for four or five nines — and to
          explain why most systems do not need them — demonstrates engineering maturity.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Distinction: Availability vs Reliability vs Fault Tolerance</h3>
          <p>
            <strong>Availability</strong> measures whether the system is up and responding. <strong>Reliability</strong> measures whether the system performs correctly without failures. <strong>Fault tolerance</strong> focuses on continuing correct operation despite failures. A system can be available but unreliable (responding with errors), reliable but unavailable (correct when running, but frequently down), or fault tolerant but slow (correct responses with degraded latency).
          </p>
          <p className="mt-3">
            In interviews, always clarify whether the requirement is availability (uptime), reliability (correctness), or fault tolerance (continuity under failure). The design strategies differ significantly.
          </p>
        </div>

        <p>
          High availability is not accidental — it requires deliberate architectural choices at every layer:
          network (multiple ISPs, redundant load balancers), compute (auto-scaling groups across availability
          zones), storage (replicated databases, distributed file systems), and application (stateless design,
          circuit breakers, graceful degradation). Each layer must eliminate single points of failure and
          provide mechanisms for automatic or manual failover.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding high availability requires grasping several foundational concepts that govern how
          systems maintain uptime despite component failures.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">RTO and RPO</h3>
        <p>
          <strong>Recovery Time Objective (RTO)</strong> is the maximum acceptable duration of downtime — how
          quickly the system must recover after a failure. <strong>Recovery Point Objective (RPO)</strong> is
          the maximum acceptable data loss — how far back in time the system can recover to. These are business
          requirements that drive technical architecture. A payment system with RTO of 5 minutes and RPO of
          zero requires synchronous replication and automatic failover. An analytics dashboard with RTO of 1
          hour and RPO of 15 minutes can use asynchronous replication with manual failover.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Single Point of Failure</h3>
        <p>
          A single point of failure (SPOF) is any component whose failure brings down the entire system.
          Achieving high availability requires identifying and eliminating all SPOFs. Common SPOFs include:
          a single database server, a single load balancer, a single network connection, a single availability
          zone, and a single engineer with deployment access. Each SPOF must be addressed through redundancy
          — multiple instances, multiple paths, or automated failover mechanisms.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Failure Detection and Health Checks</h3>
        <p>
          High availability requires rapid and accurate failure detection. Health checks probe components at
          regular intervals to determine whether they are healthy. Active health checks send requests (HTTP,
          TCP) and validate responses. Passive health checks monitor actual request outcomes and mark
          components unhealthy after repeated failures. The detection time directly impacts RTO — if it takes
          30 seconds to detect a failure and 30 seconds to fail over, the minimum RTO is 60 seconds regardless
          of how fast the failover mechanism is.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          High availability architecture is built on redundancy patterns at every layer, with failover
          mechanisms that automatically or manually redirect traffic from failed components to healthy ones.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/high-availability-architecture.svg"
          alt="High Availability Architecture"
          caption="High Availability — showing availability nines, redundancy patterns, failover flow, and multi-AZ deployment"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Active-Passive Architecture</h3>
        <p>
          In active-passive configuration, one component (the primary) handles all traffic while another
          (the standby) remains idle, ready to take over if the primary fails. The standby continuously
          synchronizes state from the primary — synchronously for zero data loss, or asynchronously for
          lower latency. A health monitor checks the primary&apos;s health through heartbeats or health
          checks. On failure detection, the standby is promoted to primary and begins handling traffic.
        </p>
        <p>
          This pattern is used for databases with strong consistency requirements (MySQL master-slave,
          PostgreSQL streaming replication), stateful services where only one instance can write at a time,
          and systems where simplicity is preferred over resource utilization. The trade-off is wasted
          capacity (the standby sits idle) and failover downtime (detection plus promotion takes seconds
          to minutes).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Active-Active Architecture</h3>
        <p>
          In active-active configuration, all components handle traffic simultaneously. A load balancer
          distributes requests across multiple active nodes. If one node fails, the load balancer detects
          the failure and routes traffic to remaining nodes — typically within seconds. This pattern provides
          better resource utilization (all nodes serve traffic) and faster failover (no promotion needed —
          traffic is already distributed). However, it introduces complexity in state synchronization —
          all active nodes must maintain consistent state, which requires either synchronous replication
          (adding latency) or conflict resolution mechanisms (adding complexity).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Multi-AZ and Multi-Region Deployment</h3>
        <p>
          Availability zones (AZs) are isolated data centers within a region, connected by low-latency
          links (1-2ms). Deploying across multiple AZs protects against data center failures (power loss,
          network outage, fire) while maintaining low replication latency. Multi-region deployments protect
          against region-wide failures (natural disasters, major network outages) but add significant
          replication latency (50-200ms) and complexity in data consistency management.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/replication-failover-patterns.svg"
          alt="Replication Patterns and Failover Strategies"
          caption="Replication and Failover — comparing synchronous, asynchronous, and multi-primary replication with failover strategies"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-Offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Pattern</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Active-Passive</strong></td>
              <td className="p-3">
                Simple to implement and reason about. No split-brain risk. Strong consistency guaranteed.
              </td>
              <td className="p-3">
                Wasted capacity — standby sits idle. Failover takes seconds to minutes. Manual promotion may be slow.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Active-Active</strong></td>
              <td className="p-3">
                Full resource utilization. Near-instant failover (LB removes failed node). Better throughput.
              </td>
              <td className="p-3">
                Complex state synchronization. Split-brain risk. Conflict resolution overhead.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Sync Replication</strong></td>
              <td className="p-3">
                Zero data loss (RPO=0). Strong consistency. Immediate failover with no data loss.
              </td>
              <td className="p-3">
                Higher write latency (wait for replica ack). Limited by distance (latency). Replica failure blocks writes.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Async Replication</strong></td>
              <td className="p-3">
                Low write latency. Works across regions. Replica failure does not block writes.
              </td>
              <td className="p-3">
                Possible data loss (RPO&gt;0). Replica may lag behind. Failover may lose recent writes.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Auto Failover</strong></td>
              <td className="p-3">
                Fast RTO (30s-2min). No human intervention needed. Consistent response to failures.
              </td>
              <td className="p-3">
                Split-brain risk. False positives trigger unnecessary failovers. Complex to implement correctly.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Design for Failure at Every Layer</h3>
        <p>
          Assume every component will fail — disks corrupt, networks partition, processes crash, and
          engineers make mistakes. Design each layer with redundancy: multiple network paths (BGP with
          multiple ISPs), multiple load balancers (active-active with health checks), multiple application
          servers (auto-scaling groups across AZs), multiple database replicas (primary with standbys), and
          multiple storage copies (distributed file systems with replication factor of 3+).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Automate Failover with Guardrails</h3>
        <p>
          Manual failover is too slow for critical systems — aim for automatic failover with RTO under 2
          minutes. However, automatic failover carries the risk of split-brain (both nodes believing they
          are primary) and false positives (triggering failover for transient issues). Implement guardrails:
          use a consensus mechanism (Paxos, Raft) or a tiebreaker (witness node, quorum) to prevent
          split-brain. Require multiple consecutive health check failures before triggering failover to
          avoid false positives. Log every failover decision with the evidence that triggered it.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Test Failover Regularly</h3>
        <p>
          A failover mechanism that has never been tested is a failover mechanism that will not work when
          needed. Schedule regular failover tests — quarterly at minimum, monthly for critical systems. Test
          each failure scenario: primary process crash, primary host failure, network partition, data
          corruption, and zone outage. Measure actual RTO and RPO against targets. Document any gaps and
          remediate them before the next test.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitor Availability Continuously</h3>
        <p>
          Deploy synthetic monitoring from multiple geographic locations that probe your system every 1-5
          minutes. Track availability percentage in real time, alert when it drops below target, and
          investigate every outage — no matter how brief. Maintain a rolling 12-month availability report
          that tracks your actual performance against your SLA. Use this data to identify patterns: are
          outages correlated with deployments, traffic spikes, or specific components?
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Hidden Single Points of Failure</h3>
        <p>
          The most dangerous SPOFs are the ones you do not know about. A shared DNS provider, a shared
          certificate authority, a shared NTP server, a shared monitoring system, a shared deployment
          pipeline — each of these can bring down your entire system despite redundant application servers
          and databases. Conduct a regular SPOF audit: for every component, ask &quot;what happens if this
          fails?&quot; If the answer is &quot;the system goes down,&quot; you have found a SPOF that needs
          redundancy.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Split-Brain Scenarios</h3>
        <p>
          Split-brain occurs when both the primary and the standby believe they are the active node,
          typically because a network partition prevents them from communicating. Both accept writes,
          creating divergent data that cannot be reconciled. This is one of the most destructive failure
          modes in distributed systems. Prevent split-brain with a quorum mechanism (majority of nodes
          must agree on the primary), a witness node (a third party that breaks ties), or fencing tokens
          (only the node holding the current token can write).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Failover Without Testing</h3>
        <p>
          Many teams configure automatic failover but never test it. When a real failure occurs, the
          failover mechanism fails — because of configuration drift, expired credentials, or untested
          edge cases. The result is a prolonged outage while engineers scramble to manually fail over.
          Test failover under realistic conditions: with actual production traffic, during peak load, and
          with realistic failure scenarios (not just stopping a process, but simulating network partitions
          and disk failures).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Over-Engineering for Unnecessary Nines</h3>
        <p>
          Designing for five nines (5.26 minutes of downtime per year) is 10-100× more expensive than
          designing for three nines (8.76 hours). Most systems do not need five nines — an internal tool
          with 8 hours of annual downtime is perfectly acceptable. Only design for the availability level
          that your business requires. Over-engineering wastes resources, increases complexity, and creates
          more failure modes to manage.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">AWS — Multi-AZ RDS</h3>
        <p>
          Amazon RDS provides high availability through multi-AZ deployment. The primary database instance
          runs in one availability zone, with a synchronous standby replica in a different AZ. If the primary
          fails, RDS automatically promotes the standby, updates the DNS record, and resumes service —
          typically within 60-120 seconds. The failover is transparent to the application (DNS propagation
          handles the redirect). RPO is zero because replication is synchronous. This architecture protects
          against AZ-level failures (power loss, network outage) while maintaining strong consistency.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Google — Global Load Balancing</h3>
        <p>
          Google Cloud&apos;s global load balancer distributes traffic across multiple regions automatically.
          If a region becomes unhealthy (detected through health checks), the load balancer redirects traffic
          to healthy regions within seconds. Combined with Cloud Spanner&apos;s globally distributed database
          (synchronous replication within regions, asynchronous across regions), this provides a foundation
          for multi-region high availability. Google&apos;s own services (Search, Gmail, YouTube) run on this
          infrastructure, demonstrating that multi-region HA is achievable at planetary scale.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Netflix — Active-Active Multi-Region</h3>
        <p>
          Netflix operates an active-active multi-region architecture across AWS regions. Both regions serve
          traffic simultaneously, with data replicated asynchronously between regions. If one region fails,
          traffic is automatically redirected to the healthy region. Netflix&apos;s Chaos Monkey regularly
          terminates instances in production to validate that the system can tolerate failures without user
          impact. Their availability target is 99.99% — 52 minutes of annual downtime — achieved through
          redundant infrastructure, automated failover, and a culture of failure testing.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stripe — Payment System Reliability</h3>
        <p>
          Stripe&apos;s payment processing system requires near-perfect availability with zero data loss. They
          use active-active deployment across multiple data centers, synchronous replication within regions,
          and automatic failover with quorum-based split-brain prevention. Their RTO is under 30 seconds and
          RPO is zero — no payment is ever lost. They achieve this through meticulous failure testing,
          redundant infrastructure at every layer, and a culture that treats every outage as a learning
          opportunity.
        </p>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          High availability mechanisms introduce security risks that must be addressed to prevent exploitation during failover events.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Failover-Related Vulnerabilities</h3>
          <ul className="space-y-2">
            <li>
              <strong>Split-Brain Data Corruption:</strong> If split-brain occurs, both nodes accept writes, creating conflicting data. An attacker could exploit this by timing writes during a partition to create inconsistent state. Mitigation: use quorum-based consensus (Paxos, Raft), implement fencing tokens, detect and resolve conflicts automatically.
            </li>
            <li>
              <strong>Failover Credential Exposure:</strong> Automated failover systems require credentials to promote standbys and update DNS. If these credentials are compromised, an attacker can trigger false failovers. Mitigation: use short-lived credentials, restrict failover permissions to specific roles, monitor failover events for anomalies.
            </li>
            <li>
              <strong>Replication Interception:</strong> Asynchronous replication traffic may be intercepted during cross-region transfer. Mitigation: encrypt replication traffic with TLS, use private network connections (VPC peering, Direct Connect), implement mutual authentication between replicas.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Availability as a Security Property</h3>
          <ul className="space-y-2">
            <li>
              <strong>DDoS Resilience:</strong> High availability architecture must withstand DDoS attacks. Single-region systems are vulnerable to volumetric attacks. Mitigation: use CDN/WAF at edge, implement rate limiting, design for horizontal scaling under attack, use DDoS protection services (AWS Shield, Cloudflare).
            </li>
            <li>
              <strong>Resource Exhaustion Attacks:</strong> Attackers may trigger failover by exhausting primary resources, causing health check failures. Mitigation: implement resource quotas, use circuit breakers, distinguish between legitimate load and attack traffic, set failover thresholds based on error rates rather than resource utilization alone.
            </li>
            <li>
              <strong>Backup Security:</strong> Backups are critical for disaster recovery but are often less secured than production data. Mitigation: encrypt backups at rest and in transit, restrict backup access with least privilege, regularly test backup restoration to verify integrity.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Testing Strategies */}
      <section>
        <h2>Testing Strategies</h2>
        <p>
          High availability must be validated through systematic testing — mechanisms that work in theory often fail in practice due to configuration errors, timing issues, or unexpected interactions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Failover Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Planned Failover:</strong> Manually trigger failover during maintenance windows. Measure actual RTO and RPO. Verify that data is consistent after failover. Test both directions (A→B and B→A). Run quarterly at minimum.
            </li>
            <li>
              <strong>Unplanned Failover:</strong> Simulate unexpected failures: kill the primary process, terminate the primary host, sever network connections. Verify that health checks detect the failure, failover triggers automatically, and service resumes within RTO.
            </li>
            <li>
              <strong>Split-Brain Testing:</strong> Introduce network partitions between primary and standby. Verify that only one node remains active (no split-brain). Verify that the partition is detected and resolved when connectivity is restored.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Chaos Engineering for Availability</h3>
          <ul className="space-y-2">
            <li>
              <strong>Instance Termination:</strong> Randomly terminate instances in production. Verify that auto-scaling replaces them, load balancers redistribute traffic, and users experience no impact. Tools: Chaos Monkey, Gremlin, AWS Fault Injection Simulator.
            </li>
            <li>
              <strong>Regional Failures:</strong> Simulate entire region outages. Verify that traffic is routed to healthy regions, data is consistent after failover, and RTO/RPO targets are met. Test during peak traffic to validate under load.
            </li>
            <li>
              <strong>Dependency Failures:</strong> Inject failures into specific dependencies (database, cache, external API). Verify that circuit breakers protect the system, fallback responses are served, and the system recovers when the dependency is restored.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Availability Readiness Checklist</h3>
          <ul className="space-y-2">
            <li>✓ All SPOFs identified and eliminated (or documented as accepted risks)</li>
            <li>✓ Redundancy configured at every layer (network, compute, storage, application)</li>
            <li>✓ Health checks configured with appropriate thresholds and intervals</li>
            <li>✓ Automatic failover tested within last 30 days with documented results</li>
            <li>✓ RTO and RPO targets defined, measured, and met for all critical systems</li>
            <li>✓ Split-brain prevention mechanism implemented and tested</li>
            <li>✓ Multi-AZ deployment configured for all critical components</li>
            <li>✓ Synthetic monitoring deployed from multiple geographic locations</li>
            <li>✓ Rolling 12-month availability report maintained and reviewed monthly</li>
            <li>✓ Runbook documented for every failure scenario with step-by-step remediation</li>
          </ul>
        </div>
      </section>

      {/* Section 10: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://aws.amazon.com/architecture/high-availability/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS — High Availability Architecture Best Practices
            </a>
          </li>
          <li>
            <a href="https://cloud.google.com/architecture/disaster-recovery" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google Cloud — Disaster Recovery and High Availability
            </a>
          </li>
          <li>
            <a href="https://netflixtechblog.com/netflix-chaos-engineering-updated-ff6680662a7d" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Netflix — Chaos Engineering for Production Resilience
            </a>
          </li>
          <li>
            <a href="https://stripe.com/blog/stripe-infrastructure-multi-region" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Stripe — Multi-Region Infrastructure Design
            </a>
          </li>
          <li>
            <a href="https://www.infoq.com/articles/availability-and-cap-theorem/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              InfoQ — Availability and the CAP Theorem
            </a>
          </li>
          <li>
            <a href="https://www.usenix.org/system/files/login-logout_1305_bettis.pdf" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google Site Reliability Engineering — Managing Critical Services
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
