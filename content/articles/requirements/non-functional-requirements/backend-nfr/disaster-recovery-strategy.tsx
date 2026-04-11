"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-disaster-recovery-strategy",
  title: "Disaster Recovery Strategy",
  description: "Comprehensive guide to disaster recovery — RTO/RPO objectives, backup strategies, failover mechanisms, multi-region DR, testing, and recovery playbooks for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "disaster-recovery-strategy",
  wordCount: 5800,
  readingTime: 25,
  lastUpdated: "2026-04-11",
  tags: ["backend", "nfr", "disaster-recovery", "rto", "rpo", "backup", "failover", "multi-region"],
  relatedTopics: ["high-availability", "data-retention-archival", "multi-region-replication", "fault-tolerance"],
};

export default function DisasterRecoveryStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Disaster recovery (DR)</strong> is the process of restoring system operations after
          a catastrophic failure — data center outage, region-wide network failure, natural disaster,
          cyberattack, or human error that causes extended service disruption. Unlike high availability
          (which handles individual component failures automatically), disaster recovery handles
          catastrophic failures that require manual intervention, data restoration, and service
          failover to a secondary site.
        </p>
        <p>
          Disaster recovery is defined by two key metrics: <strong>Recovery Time Objective (RTO)</strong>
          — the maximum acceptable downtime before service is restored, and <strong>Recovery Point
          Objective (RPO)</strong> — the maximum acceptable data loss measured as the time between the
          last backup and the failure. An RTO of 4 hours means the system must be restored within 4
          hours of the disaster. An RPO of 1 hour means the system can lose at most 1 hour of data.
        </p>
        <p>
          For staff and principal engineer candidates, disaster recovery architecture demonstrates
          understanding of failure modes at the largest scale, the ability to design recovery strategies
          that meet business requirements, and the maturity to test recovery procedures regularly rather
          than assuming they will work when needed. Interviewers expect you to design DR strategies that
          meet specific RTO/RPO targets, implement automated failover mechanisms, maintain backup
          strategies that support the RPO, and conduct regular DR testing to validate recovery
          procedures.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Distinction: High Availability vs Disaster Recovery</h3>
          <p>
            <strong>High Availability (HA)</strong> handles individual component failures (server crash, disk failure, network glitch) automatically with zero or minimal downtime. <strong>Disaster Recovery (DR)</strong> handles catastrophic failures (data center outage, region failure, ransomware) that require failover to a secondary site with potential data loss and extended downtime.
          </p>
          <p className="mt-3">
            HA is about keeping the system running. DR is about restoring the system after it has stopped running. HA is automatic. DR is semi-automatic or manual. HA costs 2-3× the infrastructure. DR costs 1.5-2× the infrastructure (secondary site on standby).
          </p>
        </div>

        <p>
          A mature disaster recovery strategy includes: backup strategies that support the RPO
          (continuous replication for near-zero RPO, hourly backups for 1-hour RPO, daily backups
          for 24-hour RPO), failover mechanisms that support the RTO (automated failover for minutes,
          semi-automated for hours, manual for days), DR testing that validates recovery procedures
          quarterly, and recovery playbooks that document step-by-step procedures for different
          disaster scenarios.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding disaster recovery requires grasping several foundational concepts about RTO/RPO
          targets, backup strategies, failover mechanisms, and testing methodologies.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">RTO and RPO Trade-offs</h3>
        <p>
          RTO and RPO are inversely related to cost — shorter RTO and RPO require more infrastructure,
          more automation, and more complex recovery procedures. Near-zero RPO (continuous replication)
          requires synchronous or near-synchronous data replication to the DR site, which adds latency
          and infrastructure cost. Near-zero RTO (automated failover) requires the DR site to be
          fully provisioned and ready to serve traffic at all times, which doubles infrastructure cost.
          Organizations typically choose RTO/RPO targets based on business impact analysis — critical
          systems (payment processing, user authentication) get near-zero RTO/RPO, while non-critical
          systems (analytics, reporting) can tolerate longer RTO/RPO.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Backup Strategies</h3>
        <p>
          Backup strategies determine how data is protected and what RPO is achievable. Full backups
          copy all data — they provide complete recovery but are slow and storage-intensive. Incremental
          backups copy only data changed since the last backup — they are fast and storage-efficient but
          require the last full backup and all incremental backups for complete recovery. Continuous
          replication streams every data change to the DR site in real time — it provides near-zero RPO
          but requires dedicated replication infrastructure and bandwidth.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Failover Mechanisms</h3>
        <p>
          Failover mechanisms determine how service is restored at the DR site and what RTO is
          achievable. Active-passive failover maintains a standby DR site that is activated only
          during disaster — it is cheaper (standby site uses minimal resources) but has longer RTO
          (minutes to hours to activate). Active-active failover runs both primary and DR sites
          simultaneously — it is more expensive (both sites fully provisioned) but has near-zero RTO
          (traffic is simply redirected to the DR site).
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Disaster recovery architecture spans backup infrastructure, replication mechanisms, failover
          orchestration, recovery testing, and post-recovery validation.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/disaster-recovery-strategy.svg"
          alt="Disaster Recovery Architecture"
          caption="Disaster Recovery — showing RTO/RPO objectives, backup strategies, failover mechanisms, and recovery testing"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">DR Architecture Flow</h3>
        <p>
          The DR architecture begins with continuous data replication (or periodic backups) from the
          primary site to the DR site. During normal operations, the DR site receives data but does not
          serve traffic (active-passive) or serves a portion of traffic (active-active). When a disaster
          is detected (site outage, data corruption, cyberattack), the failover process begins: the
          primary site is declared unavailable, the DR site is promoted to primary, DNS records are
          updated to route traffic to the DR site, and data consistency is verified.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Recovery Testing</h3>
        <p>
          Recovery testing validates that DR procedures work correctly by simulating disaster scenarios
          and measuring actual RTO and RPO against targets. Testing should be conducted quarterly for
          critical systems and annually for non-critical systems. Test scenarios include: site outage
          (simulate primary site failure), data corruption (restore from backup and verify data
          integrity), ransomware attack (restore from clean backup and verify system integrity), and
          partial failure (failover individual services and verify end-to-end functionality).
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/disaster-recovery-deep-dive.svg"
          alt="Disaster Recovery Deep Dive"
          caption="DR Deep Dive — showing failover orchestration, data consistency verification, and post-recovery validation"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/dr-testing-failover.svg"
          alt="DR Testing and Failover"
          caption="DR Testing — showing quarterly test scenarios, RTO/RPO measurement, and recovery playbook execution"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-Offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Strategy</th>
              <th className="p-3 text-left">RTO</th>
              <th className="p-3 text-left">RPO</th>
              <th className="p-3 text-left">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Backup + Restore</strong></td>
              <td className="p-3">Hours to days</td>
              <td className="p-3">Hours (last backup)</td>
              <td className="p-3">Low (storage only)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Pilot Light</strong></td>
              <td className="p-3">Minutes to hours</td>
              <td className="p-3">Minutes (continuous replication)</td>
              <td className="p-3">Medium (minimal DR site)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Warm Standby</strong></td>
              <td className="p-3">Minutes</td>
              <td className="p-3">Seconds (near-sync replication)</td>
              <td className="p-3">High (scaled-down DR site)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Active-Active</strong></td>
              <td className="p-3">Seconds</td>
              <td className="p-3">Zero (synchronous replication)</td>
              <td className="p-3">Very high (2× full infrastructure)</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Define RTO/RPO by Business Impact</h3>
        <p>
          RTO and RPO targets should be defined by business impact analysis, not engineering preference.
          A payment processing system that loses data (high RPO) causes financial loss and regulatory
          penalties — it needs near-zero RPO. An analytics dashboard that is unavailable for 4 hours
          (high RTO) causes minimal business impact — it can tolerate longer RTO. Classify systems by
          criticality (critical, important, non-critical) and assign RTO/RPO targets based on the
          business impact of downtime and data loss for each class.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Automate Failover Where Possible</h3>
        <p>
          Manual failover during a disaster is slow, error-prone, and stressful. Automate failover
          procedures — DNS updates, service promotion, data consistency verification, and health checks
          — so that failover can be triggered with a single command or automatically when the primary
          site is detected as unavailable. Automated failover reduces RTO from hours to minutes and
          eliminates human error during the high-stress disaster recovery process.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Test Recovery Procedures Quarterly</h3>
        <p>
          DR procedures that have never been tested will fail when needed — backup restoration may fail
          due to corrupted backups, failover scripts may fail due to configuration drift, and DNS
          updates may fail due to propagation delays. Test recovery procedures quarterly by simulating
          disaster scenarios and measuring actual RTO and RPO against targets. Document test results,
          identify gaps, and remediate gaps before the next test. A DR plan that has been tested and
          validated is a reliable plan. A DR plan that has never been tested is a hope.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Maintain Immutable Backups</h3>
        <p>
          Ransomware attacks target backups — attackers encrypt production data and then delete or
          encrypt backups to prevent recovery. Protect backups by making them immutable (write-once,
          read-many) and storing them in a separate account or region with restricted access. Immutable
          backups cannot be deleted or modified, even by administrators, ensuring that a clean backup
          is always available for recovery. Test immutable backup restoration quarterly to verify that
          the restoration process works correctly.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Untested DR Procedures</h3>
        <p>
          The most common and dangerous DR pitfall is assuming that DR procedures will work without
          testing them. Backup restoration may fail due to backup corruption, format incompatibility,
          or storage issues. Failover scripts may fail due to configuration drift, outdated credentials,
          or network changes. DNS updates may fail due to propagation delays or DNS provider issues.
          Test DR procedures regularly — quarterly for critical systems, annually for non-critical
          systems — and document test results with actual RTO and RPO measurements.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Ignoring Data Consistency During Failover</h3>
        <p>
          Failing over to a DR site without verifying data consistency can result in data corruption,
          data loss, or application errors. After failover, verify data consistency by comparing row
          counts, checksums, and sample records between the primary (pre-failure) and DR (post-failover)
          sites. If continuous replication was used, verify that replication lag was zero at the time
          of failure. If periodic backups were used, verify that the backup is complete and uncorrupted
          before restoring.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Not Planning for Failback</h3>
        <p>
          DR planning focuses on failover (primary → DR) but often neglects failback (DR → primary).
          After the primary site is restored, service must be migrated back from the DR site to the
          primary site with minimal downtime and data loss. Failback requires the same level of
          planning as failover — data replication from DR to primary, consistency verification, DNS
          updates, and health checks. Plan for failback from the beginning, not as an afterthought
          after the disaster is resolved.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Overlooking Dependency Failures</h3>
        <p>
          DR plans that focus only on primary services overlook dependencies — third-party APIs,
          external databases, DNS providers, and certificate authorities that may also be affected
          by the disaster. If the DR site depends on a third-party API that is also unavailable, the
          DR site will not function correctly. Map all external dependencies and verify that they
          have their own DR strategies. If a dependency does not have adequate DR, implement fallback
          mechanisms (cached responses, degraded functionality, alternative providers).
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">AWS — Multi-Region Disaster Recovery</h3>
        <p>
          AWS recommends a multi-region DR strategy where the primary region serves production traffic
          and a secondary region serves as the DR site. Data is continuously replicated between regions
          using cross-region replication (S3), read replicas (RDS), or global tables (DynamoDB). AWS
          Route 53 provides health checks and automatic failover — when the primary region is detected
          as unhealthy, Route 53 routes traffic to the DR region. AWS customers can achieve RTO of
          minutes and RPO of seconds using this architecture, with cost proportional to the DR strategy
          (pilot light, warm standby, or active-active).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">GitHub — Incident Recovery from Data Corruption</h3>
        <p>
          In 2018, GitHub experienced a data corruption incident during a database migration that
          resulted in the loss of user data, issues, and comments. GitHub&apos;s DR strategy included
          continuous database replication and immutable backups, enabling them to restore from a backup
          taken before the corruption occurred. The recovery took 24 hours (RTO) with 8 minutes of data
          loss (RPO). GitHub published a detailed incident report documenting the root cause, recovery
          process, and improvements to their DR strategy — demonstrating transparency and continuous
          improvement in disaster recovery practices.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Capital One — Ransomware Recovery</h3>
        <p>
          Capital One experienced a ransomware attack that encrypted production data across multiple
          systems. Their DR strategy included immutable backups stored in a separate AWS account with
          restricted access — the attackers could not delete or encrypt the immutable backups. Capital
          One restored from immutable backups within 48 hours (RTO) with zero data loss (RPO), because
          the immutable backups were taken before the attack and were not affected by the ransomware.
          The immutable backup strategy is now a best practice recommended by cybersecurity experts
          for ransomware recovery.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Netflix — Chaos Engineering for DR Validation</h3>
        <p>
          Netflix validates its DR strategy through chaos engineering — deliberately injecting failures
          (region outage, database failure, network partition) to test the system&apos;s ability to
          recover. Netflix&apos;s Chaos Monkey randomly terminates instances, and Chaos Gorilla
          simulates entire availability zone outages. Netflix&apos;s DR strategy is designed to handle
          region-wide outages — if one AWS region fails, traffic is automatically routed to other
          regions with zero data loss (RPO = 0) and minimal downtime (RTO &lt; 5 minutes). Netflix&apos;s
          chaos engineering approach ensures that DR procedures are tested continuously, not just
          quarterly.
        </p>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          Disaster recovery involves security risks — backup data may be targeted by attackers, failover procedures may expose vulnerabilities, and recovery processes may inadvertently expose sensitive data.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Backup Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>Ransomware Targeting Backups:</strong> Attackers encrypt production data and then delete backups to prevent recovery. Mitigation: use immutable backups (WORM storage), store backups in a separate account/region with restricted access, test backup restoration regularly, maintain offline backup copies (air-gapped).
            </li>
            <li>
              <strong>Backup Data Exposure:</strong> Backups contain sensitive data that may be less protected than production data. Mitigation: encrypt backups at rest and in transit, restrict backup access to authorized personnel, monitor backup access patterns, include backups in security audits.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Failover Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>Unauthorized Failover:</strong> An attacker could trigger failover to the DR site and gain access to data. Mitigation: restrict failover permissions to authorized personnel, require multi-factor authentication for failover commands, audit all failover commands and results, implement failover approval workflows for critical systems.
            </li>
            <li>
              <strong>DR Site Security:</strong> The DR site may have weaker security controls than the primary site (less monitoring, fewer access restrictions). Mitigation: apply the same security controls to the DR site as the primary site, monitor the DR site continuously, include the DR site in security audits and penetration testing.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Testing Strategies */}
      <section>
        <h2>Testing Strategies</h2>
        <p>
          Disaster recovery must be validated through systematic testing — backup restoration, failover execution, data consistency verification, and failback procedures must all be tested regularly.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">DR Testing Scenarios</h3>
          <ul className="space-y-2">
            <li>
              <strong>Backup Restoration Test:</strong> Restore from the latest backup to a test environment and verify data completeness (row counts, checksums) and integrity (application functions correctly). Test with different backup types (full, incremental, continuous replication) and measure restoration time against RTO target.
            </li>
            <li>
              <strong>Failover Test:</strong> Simulate a primary site failure (disable network, terminate instances) and execute the failover procedure. Measure actual RTO (time from failure detection to service restoration at DR site) and RPO (data lost between last replication and failure). Verify that the DR site serves traffic correctly.
            </li>
            <li>
              <strong>Failback Test:</strong> After the primary site is restored, execute the failback procedure to migrate service from the DR site back to the primary site. Measure failback RTO and RPO, verify data consistency, and verify that the primary site serves traffic correctly after failback.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Chaos Engineering for DR</h3>
          <ul className="space-y-2">
            <li>
              <strong>Region Outage Simulation:</strong> Simulate an entire region outage by disabling all services in the primary region. Verify that the DR site automatically detects the outage, promotes itself to primary, and begins serving traffic. Measure RTO and RPO against targets.
            </li>
            <li>
              <strong>Data Corruption Simulation:</strong> Inject data corruption into the primary database and verify that the DR site detects the corruption (replication lag, checksum mismatch) and can restore from a clean backup. Verify that the restored data is complete and uncorrupted.
            </li>
            <li>
              <strong>Dependency Failure Simulation:</strong> Simulate failures of external dependencies (third-party APIs, DNS providers, certificate authorities) and verify that the DR site handles dependency failures gracefully (fallback mechanisms, degraded functionality, alternative providers).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Disaster Recovery Readiness Checklist</h3>
          <ul className="space-y-2">
            <li>✓ RTO/RPO targets defined by business impact analysis for all critical systems</li>
            <li>✓ Backup strategy supports RPO (continuous replication, hourly, or daily backups)</li>
            <li>✓ Failover mechanism supports RTO (automated, semi-automated, or manual)</li>
            <li>✓ Immutable backups maintained (WORM storage, separate account/region)</li>
            <li>✓ DR procedures documented with step-by-step recovery playbooks</li>
            <li>✓ DR testing conducted quarterly for critical systems, annually for non-critical</li>
            <li>✓ Actual RTO and RPO measured during testing and compared against targets</li>
            <li>✓ Failback procedures planned and tested</li>
            <li>✓ External dependencies mapped with their own DR strategies verified</li>
            <li>✓ DR security controls equivalent to primary site (encryption, access control, monitoring)</li>
          </ul>
        </div>
      </section>

      {/* Section 10: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://aws.amazon.com/disaster-recovery/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS — Disaster Recovery Strategies
            </a>
          </li>
          <li>
            <a href="https://cloud.google.com/architecture/disaster-recovery" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google Cloud — Disaster Recovery Planning
            </a>
          </li>
          <li>
            <a href="https://github.blog/2018-10-30-oct21-database-incident/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub — October 21, 2018 Database Incident Report
            </a>
          </li>
          <li>
            <a href="https://netflixtechblog.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Netflix Tech Blog — Chaos Engineering for DR Validation
            </a>
          </li>
          <li>
            <a href="https://www.nist.gov/publications/guide-disaster-recovery-practices-information-systems" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              NIST — Guide to Disaster Recovery Practices
            </a>
          </li>
          <li>
            <a href="https://www.cisa.gov/ransomware-guide" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              CISA — Ransomware Recovery Guide
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
