"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-availability-slas-extensive",
  title: "Availability SLAs",
  description: "Comprehensive guide to availability Service Level Agreements, covering uptime calculations, SLA tiers, penalty structures, availability architecture, and SLA negotiation for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "availability-slas",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "availability", "sla", "uptime", "reliability", "sre"],
  relatedTopics: ["high-availability", "slo-error-budget", "disaster-recovery"],
};

export default function AvailabilitySlasArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Availability SLAs</strong> (Service Level Agreements) are contractual commitments that
          define the minimum acceptable uptime for a service, along with penalties for failing to meet
          those commitments. SLAs translate reliability into business terms that customers understand and
          can hold providers accountable to.
        </p>
        <p>
          Availability is expressed as a percentage of uptime over a measurement period (typically monthly
          or annually). The difference between 99.9% and 99.99% represents a 10× reduction in allowable
          downtime—with corresponding cost implications. Each additional &quot;nine&quot; of availability
          requires exponentially more investment in redundancy, monitoring, and operational excellence.
        </p>
        <p>
          For staff and principal engineers, SLAs represent a critical intersection of technical capability
          and business commitment. The SLAs you commit to drive architectural decisions, operational
          processes, and cost structures. Over-committing leads to penalties and lost trust; under-committing
          loses competitive advantage.
        </p>
        <p>
          <strong>Key concepts:</strong>
        </p>
        <ul>
          <li><strong>Uptime:</strong> Percentage of time service is available.</li>
          <li><strong>Downtime:</strong> Time when service is unavailable.</li>
          <li><strong>Measurement Period:</strong> Monthly, quarterly, or annual.</li>
          <li><strong>Exclusions:</strong> Scheduled maintenance, force majeure.</li>
          <li><strong>Service Credits:</strong> Penalties for missing SLA.</li>
          <li><strong>SLO vs SLA:</strong> Internal targets vs external commitments.</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/availability-sla-tiers.svg"
          alt="Availability SLA Tiers showing the nines and corresponding downtime"
          caption="Availability Tiers: From 99% (two nines) to 99.999% (five nines) with corresponding annual and monthly downtime allowances."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: SLA vs SLO vs SLI</h3>
          <p>
            SLA is external (contractual commitment with penalties). SLO is internal (target for engineering
            teams). SLI is the actual measurement (Service Level Indicator). Internal SLOs should be stricter
            than external SLAs to provide buffer. Example: SLA 99.9%, SLO 99.95%, SLI measured at 99.97%.
          </p>
        </div>
      </section>

      <section>
        <h2>Availability Tiers</h2>
        <p>
          Availability is expressed in &quot;nines&quot;—each nine represents an order of magnitude
          improvement in uptime. Understanding what each tier means in practical terms is essential for
          setting appropriate expectations.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">The Nines Table</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Availability</th>
                <th className="p-3 text-left">Annual Downtime</th>
                <th className="p-3 text-left">Monthly Downtime</th>
                <th className="p-3 text-left">Weekly Downtime</th>
                <th className="p-3 text-left">Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">99% (Two Nines)</td>
                <td className="p-3">3.65 days</td>
                <td className="p-3">7.3 hours</td>
                <td className="p-3">1.7 hours</td>
                <td className="p-3">Internal tools, dev environments</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">99.9% (Three Nines)</td>
                <td className="p-3">8.76 hours</td>
                <td className="p-3">44 minutes</td>
                <td className="p-3">10 minutes</td>
                <td className="p-3">Standard production, SMB SaaS</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">99.95%</td>
                <td className="p-3">4.38 hours</td>
                <td className="p-3">22 minutes</td>
                <td className="p-3">5 minutes</td>
                <td className="p-3">Business-critical, enterprise SaaS</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">99.99% (Four Nines)</td>
                <td className="p-3">52.6 minutes</td>
                <td className="p-3">4.4 minutes</td>
                <td className="p-3">1 minute</td>
                <td className="p-3">Payment processing, authentication</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">99.999% (Five Nines)</td>
                <td className="p-3">5.26 minutes</td>
                <td className="p-3">26 seconds</td>
                <td className="p-3">6 seconds</td>
                <td className="p-3">Telecom, emergency services, trading</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cost of Availability</h3>
        <p>
          Each additional nine requires exponentially more investment:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">99% to 99.9% (Two to Three Nines)</h4>
        <ul>
          <li>Basic redundancy (multiple instances)</li>
          <li>Automated health checks</li>
          <li>Basic monitoring and alerting</li>
          <li><strong>Cost multiplier:</strong> 2-3x infrastructure</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">99.9% to 99.99% (Three to Four Nines)</h4>
        <ul>
          <li>Multi-AZ deployment</li>
          <li>Automatic failover</li>
          <li>Database replication</li>
          <li>Comprehensive monitoring</li>
          <li><strong>Cost multiplier:</strong> 5-10x infrastructure</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">99.99% to 99.999% (Four to Five Nines)</h4>
        <ul>
          <li>Multi-region deployment</li>
          <li>Active-active architecture</li>
          <li>Zero-downtime deployments</li>
          <li>Sub-minute failover</li>
          <li><strong>Cost multiplier:</strong> 20-50x infrastructure</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Choosing the Right Tier</h3>
        <p>
          Match availability tier to business requirements:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Consider User Impact</h4>
        <ul>
          <li>What happens when service is down?</li>
          <li>How quickly do users notice?</li>
          <li>Can users retry successfully?</li>
          <li>Is there financial impact per minute?</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Consider Business Model</h4>
        <ul>
          <li>Revenue per minute of uptime</li>
          <li>Competitive differentiation on reliability</li>
          <li>Customer expectations and contracts</li>
          <li>Regulatory requirements</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Consider Cost-Benefit</h4>
        <ul>
          <li>Cost of additional redundancy</li>
          <li>Cost of SLA penalties</li>
          <li>Cost of lost customers from downtime</li>
          <li>ROI of additional investment</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Diminishing Returns</h3>
          <p>
            The jump from 99% to 99.9% is relatively easy and cheap. The jump from 99.99% to 99.999% is
            extremely expensive. Most services should target 99.9% to 99.99%. Five nines is only justified
            for truly critical infrastructure.
          </p>
        </div>
      </section>

      <section>
        <h2>SLA Calculation</h2>
        <p>
          Understanding how availability is calculated is essential for both setting and measuring SLAs.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Uptime Formula</h3>
        <p>
          Basic calculation: Uptime % = (Total Minutes - Downtime Minutes) / Total Minutes × 100
        </p>
        <p>
          Example (Monthly - 30 days): Total minutes = 30 × 24 × 60 = 43,200 minutes. With 45 minutes
          downtime: Uptime = (43,200 - 45) / 43,200 × 100 = 99.896%. This misses 99.9% SLA by 0.004%.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What Counts as Downtime</h3>
        <p>
          Downtime isn&apos;t just &quot;service unreachable&quot;:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Complete Unavailability</h4>
        <ul>
          <li>Service returns 5xx errors for all requests</li>
          <li>Connection timeouts</li>
          <li>DNS failures</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Partial Unavailability</h4>
        <ul>
          <li>Error rate exceeds threshold (e.g., &gt;5% 5xx errors)</li>
          <li>Specific endpoints unavailable</li>
          <li>Geographic region unavailable</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Performance Degradation</h4>
        <ul>
          <li>Latency exceeds SLA threshold (e.g., P99 &gt; 2s)</li>
          <li>Throughput below minimum</li>
          <li>Queue depth exceeds threshold</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Data Issues</h4>
        <ul>
          <li>Data loss or corruption</li>
          <li>Incorrect responses</li>
          <li>Stale data beyond acceptable window</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Measurement Methods</h3>
        <h4 className="mt-4 mb-2 font-semibold">External Monitoring</h4>
        <ul>
          <li>Synthetic transactions from multiple locations</li>
          <li>Third-party monitoring services (Pingdom, StatusCake)</li>
          <li>Customer perspective of availability</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Internal Monitoring</h4>
        <ul>
          <li>Application health checks</li>
          <li>Error rate monitoring</li>
          <li>Latency percentiles</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Which to Use for SLA</h4>
        <p>
          External monitoring is typically used for SLA calculation—it represents customer experience.
          Internal monitoring is used for SLO tracking and alerting.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Exclusions</h3>
        <p>
          Not all downtime counts against SLA:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Scheduled Maintenance</h4>
        <ul>
          <li>Must provide advance notice (typically 48-72 hours)</li>
          <li>Must be during maintenance window</li>
          <li>Should minimize customer impact</li>
          <li>Duration typically capped (e.g., 4 hours/month)</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Customer-Caused Issues</h4>
        <ul>
          <li>Misconfiguration by customer</li>
          <li>Customer network issues</li>
          <li>Abuse or attack from customer</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Force Majeure</h4>
        <ul>
          <li>Natural disasters</li>
          <li>War, terrorism</li>
          <li>Government actions</li>
          <li>Internet backbone failures</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Third-Party Dependencies</h4>
        <ul>
          <li>Cloud provider outages (sometimes excluded)</li>
          <li>Payment processor outages</li>
          <li>CDN failures</li>
          <li><strong>Note:</strong> Many customers push back on this exclusion</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Trial/Free Tier</h4>
        <ul>
          <li>Often excluded from SLA entirely</li>
          <li>Or lower SLA than paid tiers</li>
          <li>Should be clearly disclosed</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/slo-sla-hierarchy.svg"
          alt="SLI/SLO/SLA Hierarchy showing relationship between metrics, targets, and commitments"
          caption="SLI/SLO/SLA Hierarchy: SLIs (metrics) feed SLOs (internal targets) which feed SLAs (external commitments with penalties)."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Define Downtime Clearly</h3>
          <p>
            Ambiguity in what counts as downtime leads to disputes. Define downtime explicitly in SLA:
            error rate thresholds, latency thresholds, geographic scope, measurement methodology. Both
            parties should agree on measurement before signing.
          </p>
        </div>
      </section>

      <section>
        <h2>SLA Penalty Structures</h2>
        <p>
          Penalties for missing SLA commitments vary by provider and contract. Understanding common
          structures helps in negotiation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Service Credits</h3>
        <p>
          Most common penalty structure—credits applied to future invoices:
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Uptime Achieved</th>
                <th className="p-3 text-left">Service Credit</th>
                <th className="p-3 text-left">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">99.0% - 99.9%</td>
                <td className="p-3">10% of monthly fee</td>
                <td className="p-3">$100 credit on $1000 bill</td>
              </tr>
              <tr>
                <td className="p-3">95.0% - 99.0%</td>
                <td className="p-3">25% of monthly fee</td>
                <td className="p-3">$250 credit on $1000 bill</td>
              </tr>
              <tr>
                <td className="p-3">&lt; 95.0%</td>
                <td className="p-3">50% of monthly fee</td>
                <td className="p-3">$500 credit on $1000 bill</td>
              </tr>
              <tr>
                <td className="p-3">&lt; 95.0% + extended</td>
                <td className="p-3">Termination right</td>
                <td className="p-3">Cancel contract without penalty</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Credit Calculation</h3>
        <p>
          How credits are typically calculated:
        </p>
        <ul>
          <li><strong>Based on:</strong> Monthly service fees (not annual, not usage)</li>
          <li><strong>Capped at:</strong> 100% of monthly fee (rarely more)</li>
          <li><strong>Applied to:</strong> Next invoice (not cash refund)</li>
          <li><strong>Expires:</strong> Must be used within specified period (e.g., 12 months)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Claim Process</h3>
        <ol>
          <li>
            <strong>Customer Submits Claim:</strong> Within 30 days of incident end.
          </li>
          <li>
            <strong>Provider Validates:</strong> Against monitoring data, checks exclusions.
          </li>
          <li>
            <strong>Credit Approved/Denied:</strong> Provider responds within 30 days.
          </li>
          <li>
            <strong>Credit Applied:</strong> To next invoice if approved.
          </li>
          <li>
            <strong>Dispute Resolution:</strong> If denied, customer can dispute with evidence.
          </li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Alternative Penalty Structures</h3>
        <h4 className="mt-4 mb-2 font-semibold">Performance-Based Pricing</h4>
        <p>
          Price varies based on actual performance:
        </p>
        <ul>
          <li>Base price + bonus for exceeding targets</li>
          <li>Or base price - penalty for missing targets</li>
          <li>More aligned incentives than credits</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Liquidated Damages</h4>
        <p>
          Pre-agreed damages for SLA breach:
        </p>
        <ul>
          <li>Fixed amount per incident</li>
          <li>Or amount based on customer&apos;s actual damages</li>
          <li>More significant than credits</li>
          <li>Requires legal negotiation</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Termination Rights</h4>
        <p>
          Customer can exit contract for repeated breaches:
        </p>
        <ul>
          <li>After X SLA misses in Y months</li>
          <li>Or single severe breach (&lt;95% uptime)</li>
          <li>Without early termination penalty</li>
          <li>Often negotiated by enterprise customers</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Credits Are Small Compared to Downtime Cost</h3>
          <p>
            Service credits (10-50% of monthly fee) are typically much smaller than customer&apos;s actual
            cost of downtime. The real penalty is reputational damage and customer churn. Design for
            reliability, not just credit avoidance.
          </p>
        </div>
      </section>

      <section>
        <h2>Architecture for High Availability</h2>
        <p>
          Achieving high availability requires architectural investment. The level of investment depends
          on the availability target.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Redundancy</h3>
        <p>
          Multiple instances to survive failures:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Instance Redundancy</h4>
        <ul>
          <li>Multiple application instances</li>
          <li>Auto-scaling to maintain minimum</li>
          <li>Spread across failure domains</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Zone Redundancy</h4>
        <ul>
          <li>Deploy across multiple availability zones</li>
          <li>Zone failure doesn&apos;t take down service</li>
          <li>Required for 99.9%+</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Region Redundancy</h4>
        <ul>
          <li>Deploy across multiple geographic regions</li>
          <li>Region failure doesn&apos;t take down service</li>
          <li>Required for 99.99%+</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Load Balancing</h3>
        <p>
          Distribute traffic and detect failures:
        </p>
        <ul>
          <li>Layer 4 (TCP) or Layer 7 (HTTP) load balancers</li>
          <li>Health check integration</li>
          <li>Automatic removal of unhealthy instances</li>
          <li>Cross-zone or cross-region load balancing</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Failover</h3>
        <p>
          Automatic switching to healthy instances:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Active-Passive</h4>
        <ul>
          <li>One region active, one on standby</li>
          <li>Failover when primary fails</li>
          <li>Lower cost, but failover delay</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Active-Active</h4>
        <ul>
          <li>Multiple regions serving traffic</li>
          <li>Instant failover (just shift traffic)</li>
          <li>Higher cost, but faster recovery</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Database High Availability</h3>
        <p>
          Database is often the hardest part to make highly available:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Synchronous Replication</h4>
        <ul>
          <li>Write confirmed only after all replicas acknowledge</li>
          <li>Strong consistency</li>
          <li>Higher latency, lower availability</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Asynchronous Replication</h4>
        <ul>
          <li>Write confirmed after primary, replicas catch up</li>
          <li>Lower latency, higher availability</li>
          <li>Risk of data loss on primary failure</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Multi-Region Database</h4>
        <ul>
          <li>Spanner, CockroachDB, Cosmos DB</li>
          <li>Global distribution with consistency</li>
          <li>Complex, expensive</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Health Checks</h3>
        <p>
          Continuous monitoring of instance health:
        </p>
        <ul>
          <li>HTTP health endpoints</li>
          <li>TCP connection checks</li>
          <li>Application-level health (database connectivity, dependencies)</li>
          <li>Configurable thresholds and intervals</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Backup & Recovery</h3>
        <p>
          Protect against data loss:
        </p>
        <ul>
          <li>Regular automated backups</li>
          <li>Cross-region backup storage</li>
          <li>Tested restore procedures</li>
          <li>Point-in-time recovery capability</li>
          <li>RTO (Recovery Time Objective) and RPO (Recovery Point Objective) defined</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/high-availability-architecture.svg"
          alt="High Availability Architecture showing multi-region deployment"
          caption="High Availability Architecture: Multi-region active-active deployment with load balancers, auto-scaling, database replication, and automatic failover."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Test Failover Regularly</h3>
          <p>
            Failover mechanisms that haven&apos;t been tested will fail when you need them. Run regular
            disaster recovery tests. Practice region failover. Verify RTO and RPO are achievable. Chaos
            engineering can help validate resilience.
          </p>
        </div>
      </section>

      <section>
        <h2>SLA Negotiation</h2>
        <p>
          SLA terms are often negotiable, especially for enterprise customers. Understanding leverage
          points helps in negotiation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Provider Perspective</h3>
        <p>
          What providers want:
        </p>
        <ul>
          <li>Standard SLA terms (no customization)</li>
          <li>Lower availability commitments</li>
          <li>Broad exclusions</li>
          <li>Limited penalties</li>
          <li>Customer must claim credits (many won&apos;t)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Customer Perspective</h3>
        <p>
          What customers want:
        </p>
        <ul>
          <li>Higher availability commitments</li>
          <li>Narrow exclusions</li>
          <li>Meaningful penalties</li>
          <li>Automatic credit application</li>
          <li>Termination rights for repeated failures</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Negotiation Leverage</h3>
        <p>
          Factors that increase customer leverage:
        </p>
        <ul>
          <li>Large contract value</li>
          <li>Multi-year commitment</li>
          <li>Competitive situation</li>
          <li>Strategic customer (reference potential)</li>
          <li>Early adopter of new product</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Negotiated Terms</h3>
        <h4 className="mt-4 mb-2 font-semibold">Availability Percentage</h4>
        <ul>
          <li>Standard: 99.9%</li>
          <li>Negotiated: 99.95% or 99.99% for enterprise</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Credit Percentages</h4>
        <ul>
          <li>Standard: 10-50% based on severity</li>
          <li>Negotiated: Higher percentages, lower thresholds</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Exclusions</h4>
        <ul>
          <li>Standard: Broad exclusions for third-party dependencies</li>
          <li>Negotiated: Provider responsible for their dependencies</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Termination Rights</h4>
        <ul>
          <li>Standard: No termination for SLA breach</li>
          <li>Negotiated: Termination after X breaches in Y months</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: SLA Is Insurance, Not Goal</h3>
          <p>
            The SLA is the minimum acceptable availability, not the target. Internal SLOs should be
            stricter. If you&apos;re consistently just meeting SLA, you&apos;re failing—customers
            experience near-misses even when SLA is met.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <h3 className="mt-8 mb-4 text-xl font-semibold">Setting SLAs</h3>
        <ul>
          <li>Base SLA on historical performance (add buffer)</li>
          <li>Start conservative, improve over time</li>
          <li>Different SLAs for different service tiers</li>
          <li>Document measurement methodology clearly</li>
          <li>Review and update periodically</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring & Measurement</h3>
        <ul>
          <li>Use external monitoring for SLA calculation</li>
          <li>Track SLI continuously</li>
          <li>Alert on SLO burn rate, not just breaches</li>
          <li>Dashboard availability for customers</li>
          <li>Regular SLA reporting to stakeholders</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Communication</h3>
        <ul>
          <li>Status page for real-time availability</li>
          <li>Proactive notification of issues</li>
          <li>Post-incident reports for significant outages</li>
          <li>Monthly/quarterly SLA reports</li>
          <li>Clear escalation paths</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Continuous Improvement</h3>
        <ul>
          <li>Post-mortem every SLA miss</li>
          <li>Track root causes of downtime</li>
          <li>Invest in prevention based on data</li>
          <li>Regular disaster recovery testing</li>
          <li>Chaos engineering for resilience validation</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>
            <strong>Over-committing:</strong> Promising 99.99% without architecture to support it.
            Fix: Base SLA on historical performance with buffer.
          </li>
          <li>
            <strong>Ambiguous definitions:</strong> Unclear what counts as downtime. Fix: Define
            explicitly in contract.
          </li>
          <li>
            <strong>Measuring wrong thing:</strong> Internal metrics don&apos;t match customer experience.
            Fix: Use external monitoring for SLA.
          </li>
          <li>
            <strong>Ignoring exclusions:</strong> Customer assumes everything is covered. Fix: Clearly
            disclose exclusions upfront.
          </li>
          <li>
            <strong>No credit claim process:</strong> Customers don&apos;t know how to claim. Fix:
            Document process, make it easy.
          </li>
          <li>
            <strong>SLA without SLO:</strong> No internal target stricter than SLA. Fix: Set SLO at
            least one nine higher.
          </li>
          <li>
            <strong>Not testing failover:</strong> Assume redundancy works without testing. Fix: Regular
            DR tests.
          </li>
          <li>
            <strong>Single point of failure:</strong> Hidden SPOF undermines availability. Fix:
            Architecture review for SPOFs.
          </li>
          <li>
            <strong>Ignoring dependencies:</strong> Your SLA depends on provider SLAs. Fix: Understand
            dependency chain, build redundancy.
          </li>
          <li>
            <strong>No improvement loop:</strong> SLA misses happen but nothing changes. Fix:
            Post-mortem, action items, follow-through.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between 99.9% and 99.99% availability?</p>
            <p className="mt-2 text-sm">
              A: 99.9% allows 8.76 hours downtime annually (44 minutes monthly). 99.99% allows 52.6 minutes
              annually (4.4 minutes monthly). That&apos;s 10× less downtime, but requires significantly
              more investment: multi-AZ deployment, automatic failover, comprehensive monitoring. Cost
              increases exponentially with each nine.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you calculate availability?</p>
            <p className="mt-2 text-sm">
              A: Uptime % = (Total Time - Downtime) / Total Time × 100. Downtime includes complete
              unavailability, error rate exceeding threshold, or latency exceeding SLA. Exclude scheduled
              maintenance with proper notice. Use external monitoring for SLA calculation to match customer
              experience.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What architecture is needed for 99.99% availability?</p>
            <p className="mt-2 text-sm">
              A: Multi-AZ deployment minimum, auto-scaling with health checks, automatic failover, load
              balancers across zones, database replication with failover capability, comprehensive
              monitoring and alerting, regular disaster recovery testing. For 99.999%, add multi-region
              active-active deployment.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do SLAs differ from SLOs?</p>
            <p className="mt-2 text-sm">
              A: SLA is external contractual commitment with penalties (service credits). SLO is internal
              target for engineering teams. SLI is the actual measurement. SLOs should be stricter than
              SLAs to provide buffer. Example: SLA 99.9%, SLO 99.95%, SLI measured at 99.97%.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What should you do if you&apos;re consistently missing SLA?</p>
            <p className="mt-2 text-sm">
              A: Immediate: Communicate with customers, offer credits. Short-term: Post-mortem to identify
              root causes, implement fixes. Long-term: Invest in architecture improvements, consider
              renegotiating SLA if unrealistic, improve monitoring and alerting to catch issues earlier.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle third-party dependency failures in SLA?</p>
            <p className="mt-2 text-sm">
              A: Ideally, absorb the risk—customer doesn&apos;t care if it&apos;s your dependency. Build
              redundancy (multiple providers), implement circuit breakers, have fallback options. If
              excluding dependencies from SLA, disclose clearly. Better to design architecture that doesn&apos;t
              rely on single dependency.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>Google SRE Book: Service Level Objectives</li>
          <li>AWS SLA: <a href="https://aws.amazon.com/sla" className="text-accent hover:underline">aws.amazon.com/sla</a></li>
          <li>GCP SLA: <a href="https://cloud.google.com/terms/sla" className="text-accent hover:underline">cloud.google.com/terms/sla</a></li>
          <li>&quot;Site Reliability Engineering&quot; by Google</li>
          <li>&quot;Implementing Service Level Objectives&quot; by Alex Hidalgo</li>
          <li>NIST Cloud Computing SLA Guidelines</li>
          <li>ITIL Service Level Management</li>
          <li>Error Budgets: Google SRE approach</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}