"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-disaster-recovery-extensive",
  title: "Disaster Recovery Strategy",
  description: "Comprehensive guide to disaster recovery, covering RTO/RPO, backup strategies, failover patterns, multi-region deployment, and business continuity planning for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "disaster-recovery-strategy",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "disaster-recovery", "business-continuity", "failover", "backup", "multi-region"],
  relatedTopics: ["high-availability", "durability-guarantees", "fault-tolerance-resilience", "scalability-strategy"],
};

export default function DisasterRecoveryStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Disaster Recovery (DR)</strong> is the set of policies, tools, and procedures to recover
          from catastrophic events that cause extended downtime or data loss. Unlike high availability
          (which handles individual component failures), DR addresses region-wide outages, natural disasters,
          and major infrastructure failures.
        </p>
        <p>
          DR is defined by two key metrics:
        </p>
        <ul>
          <li>
            <strong>RTO (Recovery Time Objective):</strong> Maximum acceptable downtime. How quickly must
            you recover?
          </li>
          <li>
            <strong>RPO (Recovery Point Objective):</strong> Maximum acceptable data loss. How much data
            can you afford to lose?
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: DR is Insurance</h3>
          <p>
            DR capabilities are expensive and (hopefully) never used. The business case is risk mitigation,
            not ROI. Investment should be proportional to the cost of downtime and data loss.
          </p>
        </div>
      </section>

      <section>
        <h2>DR Strategies</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/disaster-recovery-strategy.svg"
          alt="Disaster Recovery Strategies"
          caption="Disaster Recovery — showing RTO/RPO matrix, DR strategy comparison (Backup/Restore, Pilot Light, Warm Standby, Active-Active), and testing types"
        />
        <p>
          DR strategies range from basic backup/restore to fully automated multi-region failover.
        </p>
      </section>

      <section>
        <h2>Disaster Recovery Deep Dive</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/disaster-recovery-deep-dive.svg"
          alt="Disaster Recovery Deep Dive"
          caption="Disaster Recovery Deep Dive — showing RTO/RPO decision matrix, DR testing types, failover implementation patterns"
        />
        <p>
          Advanced disaster recovery concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Backup and Restore</h3>
        <p>
          Regular backups stored offsite. Recovery involves restoring from backup.
        </p>
        <p>
          <strong>RTO:</strong> Hours to days (depending on data size).
        </p>
        <p>
          <strong>RPO:</strong> Time since last backup (hours to days).
        </p>
        <p>
          <strong>Best for:</strong> Non-critical systems, cost-sensitive applications.
        </p>
        <p>
          <strong>Cost:</strong> $ (lowest).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pilot Light</h3>
        <p>
          Minimal version of system always running in DR region. Full scale-up on disaster.
        </p>
        <p>
          <strong>RTO:</strong> Minutes to hours.
        </p>
        <p>
          <strong>RPO:</strong> Minutes (with continuous replication).
        </p>
        <p>
          <strong>Best for:</strong> Systems needing faster recovery than backup/restore.
        </p>
        <p>
          <strong>Cost:</strong> $$ (low ongoing, high during failover).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Warm Standby</h3>
        <p>
          Scaled-down but functional version running in DR region. Scale up on disaster.
        </p>
        <p>
          <strong>RTO:</strong> Minutes.
        </p>
        <p>
          <strong>RPO:</strong> Seconds to minutes.
        </p>
        <p>
          <strong>Best for:</strong> Business-critical systems.
        </p>
        <p>
          <strong>Cost:</strong> $$$ (moderate ongoing).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Multi-Site Active-Active</h3>
        <p>
          Full system running in multiple regions. Traffic distributed across all regions.
        </p>
        <p>
          <strong>RTO:</strong> Near-zero (automatic failover).
        </p>
        <p>
          <strong>RPO:</strong> Zero (synchronous replication) or near-zero.
        </p>
        <p>
          <strong>Best for:</strong> Mission-critical systems (payments, healthcare, emergency services).
        </p>
        <p>
          <strong>Cost:</strong> $$$$ (highest ongoing).
        </p>
      </section>

      <section>
        <h2>DR Planning</h2>
        <p>
          Effective DR requires careful planning and regular testing.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DR Runbook</h3>
        <p>
          Documented procedures for disaster recovery:
        </p>
        <ul>
          <li>Disaster declaration criteria (who can declare, under what conditions).</li>
          <li>Step-by-step failover procedures.</li>
          <li>Communication plan (stakeholders, customers, regulators).</li>
          <li>Failback procedures (return to normal operations).</li>
          <li>Contact information (on-call, vendors, emergency services).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DR Testing</h3>
        <p>
          Untested DR plans fail when needed. Test regularly:
        </p>
        <ul>
          <li>
            <strong>Tabletop exercises:</strong> Walk through scenarios in conference room.
          </li>
          <li>
            <strong>Simulated failover:</strong> Actual failover to DR region (during maintenance window).
          </li>
          <li>
            <strong>Chaos engineering:</strong> Random failure injection in production-like environment.
          </li>
          <li>
            <strong>Full DR drill:</strong> Complete failover and failback (annually).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Replication for DR</h3>
        <p>
          <strong>Asynchronous replication:</strong> Most common for DR. Accepts some data loss for lower
          latency and cost.
        </p>
        <p>
          <strong>Synchronous replication:</strong> Zero data loss but higher latency. Only practical within
          ~100km due to speed of light.
        </p>
        <p>
          <strong>Snapshot replication:</strong> Periodic snapshots replicated to DR. Simple but higher RPO.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a disaster recovery plan for a global e-commerce platform. What RTO/RPO would you target and why?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>RTO/RPO by tier:</strong> (1) Checkout/Payment: RTO=5min, RPO=0 (critical, revenue-impacting). (2) Product browsing: RTO=30min, RPO=5min. (3) Recommendations: RTO=1hr, RPO=1hr.</li>
                <li><strong>DR strategy:</strong> Active-active for checkout (zero downtime). Warm standby for product catalog. Pilot light for recommendations.</li>
                <li><strong>Multi-region:</strong> Primary (US-East), Secondary (US-West), DR (EU-West). Each can handle 100% traffic independently.</li>
                <li><strong>Data replication:</strong> Synchronous within region, async cross-region. Conflict resolution for active-active.</li>
                <li><strong>Testing:</strong> Quarterly failover tests. Annual full DR drill with failback.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Compare pilot light, warm standby, and active-active DR strategies. When would you choose each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Pilot Light:</strong> Minimal DR environment (database replication, no app servers). RTO=hours, RPO=minutes. Cost: $. Best for: Non-critical systems, startups.</li>
                <li><strong>Warm Standby:</strong> Scaled-down but functional (some app servers, read replicas). RTO=minutes, RPO=seconds. Cost: $$. Best for: Business-critical systems.</li>
                <li><strong>Active-Active:</strong> Full capacity in both regions, traffic split. RTO=0, RPO=0. Cost: $$$. Best for: Mission-critical (payments, healthcare).</li>
                <li><strong>Decision framework:</strong> Calculate cost of downtime. If 1hr downtime = $1M, invest in active-active. If 1hr = $10K, warm standby sufficient.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Your primary region just went offline. Walk through your disaster recovery procedure.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Detection (0-2 min):</strong> Monitoring alerts (health checks failing, region unreachable). On-call paged.</li>
                <li><strong>Assessment (2-5 min):</strong> Confirm outage (not false positive). Determine scope (full region or partial). Declare disaster.</li>
                <li><strong>Failover (5-15 min):</strong> (1) Update DNS to secondary region. (2) Promote read replica to primary. (3) Scale up secondary app servers. (4) Verify health.</li>
                <li><strong>Communication:</strong> Notify stakeholders. Update status page. Customer support briefed.</li>
                <li><strong>Post-failover:</strong> Monitor secondary region capacity. Investigate root cause. Plan failback when primary restored.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. How do you test disaster recovery without impacting production?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Tabletop exercises:</strong> Walk through DR scenarios in conference room. No infrastructure impact. Quarterly.</li>
                <li><strong>Simulated failover (staging):</strong> Full failover test in staging environment. Validate procedures work. Monthly.</li>
                <li><strong>Partial failover (production):</strong> Failover non-critical services only. Test infrastructure without full risk. Quarterly.</li>
                <li><strong>Chaos engineering:</strong> Randomly kill instances in production. Verify auto-recovery works. Continuous.</li>
                <li><strong>Full DR drill:</strong> Complete failover + failback. Schedule maintenance window. Annually.</li>
                <li><strong>Best practice:</strong> Automate failover procedures. Manual steps fail under pressure.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. What are the challenges of multi-region active-active deployment? How do you handle data consistency?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Challenge 1 - Data consistency:</strong> Writes in both regions cause conflicts. Solution: Conflict-free replicated data types (CRDTs) or last-write-wins with vector clocks.</li>
                <li><strong>Challenge 2 - Latency:</strong> Cross-region sync adds latency. Solution: Accept eventual consistency for non-critical data. Use synchronous only for critical data within region.</li>
                <li><strong>Challenge 3 - Complexity:</strong> Debugging distributed systems is hard. Solution: Distributed tracing, comprehensive monitoring.</li>
                <li><strong>Challenge 4 - Cost:</strong> 2x infrastructure, cross-region data transfer. Solution: Only for critical workloads. Use warm standby for rest.</li>
                <li><strong>Best practice:</strong> Partition by user (user A always uses region 1). Reduces conflicts significantly.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you determine appropriate DR investment for a startup vs enterprise?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Startup:</strong> Limited budget, survival mode. Use pilot light or warm standby. Focus on automated backups + quick restore. RTO=1-4hr acceptable.</li>
                <li><strong>Growth stage:</strong> More customers, more downtime cost. Upgrade to warm standby. RTO=30min. Test quarterly.</li>
                <li><strong>Enterprise:</strong> High downtime cost, compliance requirements. Active-active for critical, warm standby for rest. RTO=5min. Test monthly.</li>
                <li><strong>Decision framework:</strong> Calculate hourly downtime cost. DR investment should be &lt;10% of potential annual loss. Example: If 1hr downtime = $100K, annual risk = $1.2M. DR budget = $120K/year.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Disaster Recovery Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Defined RTO/RPO for each system tier</li>
          <li>✓ Selected appropriate DR strategy (backup, pilot light, warm standby, active-active)</li>
          <li>✓ DR region configured and tested</li>
          <li>✓ Data replication implemented and monitored</li>
          <li>✓ DR runbook documented and accessible</li>
          <li>✓ Communication plan defined</li>
          <li>✓ Regular DR testing scheduled (quarterly minimum)</li>
          <li>✓ Backup verification automated</li>
          <li>✓ Failback procedures documented</li>
          <li>✓ Post-incident review process established</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
