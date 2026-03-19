"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-availability-slas-extensive",
  title: "Availability SLAs",
  description: "Comprehensive guide to availability Service Level Agreements, covering uptime calculations, SLA tiers, penalty structures, availability architecture, and SLA negotiation for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "availability-slas",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
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
          downtime — with corresponding cost implications.
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
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: SLA vs SLO</h3>
          <p>
            SLA is external (contractual commitment with penalties). SLO is internal (target for engineering
            teams). Internal SLOs should be stricter than external SLAs to provide buffer. Example: SLA
            99.9%, SLO 99.95%.
          </p>
        </div>
      </section>

      <section>
        <h2>Availability Tiers</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">The Nines</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Availability</th>
                <th className="p-2 text-left">Annual Downtime</th>
                <th className="p-2 text-left">Monthly Downtime</th>
                <th className="p-2 text-left">Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">99% (Two Nines)</td>
                <td className="p-2">3.65 days</td>
                <td className="p-2">7.3 hours</td>
                <td className="p-2">Internal tools, dev</td>
              </tr>
              <tr>
                <td className="p-2">99.9% (Three Nines)</td>
                <td className="p-2">8.76 hours</td>
                <td className="p-2">44 minutes</td>
                <td className="p-2">Standard production</td>
              </tr>
              <tr>
                <td className="p-2">99.95%</td>
                <td className="p-2">4.38 hours</td>
                <td className="p-2">22 minutes</td>
                <td className="p-2">Business-critical</td>
              </tr>
              <tr>
                <td className="p-2">99.99% (Four Nines)</td>
                <td className="p-2">52.6 minutes</td>
                <td className="p-2">4.4 minutes</td>
                <td className="p-2">Payment, auth</td>
              </tr>
              <tr>
                <td className="p-2">99.999% (Five Nines)</td>
                <td className="p-2">5.26 minutes</td>
                <td className="p-2">26 seconds</td>
                <td className="p-2">Telecom, emergency</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>SLA Calculation</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Uptime Formula</h3>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
{`Uptime % = (Total Minutes - Downtime Minutes) / Total Minutes × 100

Example (Monthly):
Total minutes = 30 days × 24 hours × 60 minutes = 43,200
Downtime = 45 minutes
Uptime = (43,200 - 45) / 43,200 × 100 = 99.896%`}
        </pre>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What Counts as Downtime</h3>
        <ul>
          <li>Service completely unavailable</li>
          <li>Error rate exceeds threshold (e.g., {'>'} 5% 5xx errors)</li>
          <li>Latency exceeds SLA threshold (e.g., P99 {'>'} 2s)</li>
          <li>Data loss or corruption</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Exclusions</h3>
        <ul>
          <li>Scheduled maintenance (with notice)</li>
          <li>Customer-caused issues</li>
          <li>Force majeure (natural disasters, war)</li>
          <li>Third-party dependencies (sometimes)</li>
          <li>Trial/free tier (often excluded)</li>
        </ul>
      </section>

      <section>
        <h2>SLA Penalty Structures</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Service Credits</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Uptime</th>
                <th className="p-2 text-left">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">99.0% - 99.9%</td>
                <td className="p-2">10% of monthly fee</td>
              </tr>
              <tr>
                <td className="p-2">95.0% - 99.0%</td>
                <td className="p-2">25% of monthly fee</td>
              </tr>
              <tr>
                <td className="p-2">{'<'} 95.0%</td>
                <td className="p-2">50% of monthly fee + termination right</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Claim Process</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Customer submits claim within 30 days of incident.</li>
          <li>Provider validates against monitoring data.</li>
          <li>Credit applied to next invoice.</li>
          <li>Credits typically capped at 100% of monthly fee.</li>
        </ol>
      </section>

      <section>
        <h2>Architecture for High Availability</h2>
        <p>
          Achieving high availability requires:
        </p>
        <ul>
          <li><strong>Redundancy:</strong> Multiple instances across zones/regions.</li>
          <li><strong>Load Balancing:</strong> Distribute traffic, detect failures.</li>
          <li><strong>Failover:</strong> Automatic switching to healthy instances.</li>
          <li><strong>Health Checks:</strong> Continuous monitoring of instance health.</li>
          <li><strong>Database Replication:</strong> Synchronous or asynchronous replicas.</li>
          <li><strong>Backup & Recovery:</strong> Regular backups, tested restore procedures.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between 99.9% and 99.99% availability?</p>
            <p className="mt-2 text-sm">
              A: 99.9% allows 8.76 hours downtime annually (44 minutes monthly). 99.99% allows 52.6 minutes
              annually (4.4 minutes monthly). 10× less downtime, but significantly higher cost to achieve
              (more redundancy, faster failover, better monitoring).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you calculate availability?</p>
            <p className="mt-2 text-sm">
              A: Uptime % = (Total Time - Downtime) / Total Time × 100. Downtime includes complete
              unavailability, error rate exceeding threshold, or latency exceeding SLA. Exclude scheduled
              maintenance with proper notice.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What architecture is needed for 99.99% availability?</p>
            <p className="mt-2 text-sm">
              A: Multi-AZ deployment minimum, auto-scaling, health checks with automatic replacement, database
              replication with failover, load balancers across zones, regular disaster recovery testing,
              comprehensive monitoring and alerting.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do SLAs differ from SLOs?</p>
            <p className="mt-2 text-sm">
              A: SLA is external contractual commitment with penalties (service credits). SLO is internal
              target for engineering teams. SLOs should be stricter than SLAs to provide buffer. Example:
              SLA 99.9%, SLO 99.95%, internal target 99.99%.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
