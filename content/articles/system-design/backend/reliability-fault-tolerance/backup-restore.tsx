"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-backup-restore-extensive",
  title: "Backup and Restore",
  description: "Strategies for durable backups and reliable restore procedures.",
  category: "backend",
  subcategory: "reliability-fault-tolerance",
  slug: "backup-restore",
  wordCount: 666,
  readingTime: 6,
  lastUpdated: "2026-03-13",
  tags: ['backend', 'reliability', 'data'],
  relatedTopics: ['disaster-recovery', 'data-integrity', 'rollback-strategies'],
};

export default function BackupRestoreConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Backups preserve data for recovery from corruption, deletion, or catastrophic loss. Restore is the real test: a backup is only valuable if it can be restored quickly and accurately.</p>
        <p>Backup design should be driven by recovery point objectives (RPO) and recovery time objectives (RTO). The tighter the objectives, the more frequent and accessible the backups must be.</p>
      </section>

      <section>
        <h2>Backup Strategies</h2>
        <p>Common strategies include full backups, incremental backups, and continuous log shipping. Full backups are straightforward but heavy; incremental backups reduce storage but complicate restore; log shipping offers near-real-time recovery but requires careful ordering.</p>
        <p>Retention policies matter. Keep short-term fast access backups for immediate recovery and long-term archival backups for audit or compliance.</p>
        <p>
          Another axis is <strong>logical</strong> vs <strong>physical</strong> backups. Logical backups export records and can be portable across versions, but they are slower and may not preserve engine-specific internals. Physical backups (snapshots, volume-level copies) are faster and closer to the live system, but they can be sensitive to storage layout and engine version compatibility. The best choice depends on restore speed requirements and how often infrastructure or database versions change.
        </p>
        <p>
          For many databases, the difference between a usable backup and a risky backup is whether it is <strong>application-consistent</strong>. A crash-consistent snapshot might contain partial work, requiring WAL or logs to recover. If your system has multiple related stores (database plus object storage plus search index), you need a clear strategy for what gets restored and what gets rebuilt so that restored systems remain coherent.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/backup-method-comparison-azure.png"
          alt="Full differential and incremental backup comparison"
          caption="Comparison of full, differential, and incremental backup strategies."
        />
      </section>

      <section>
        <h2>Restore Mechanics</h2>
        <p>Restore requires replaying data in the correct order, verifying integrity, and rebuilding indexes or derived views. Plan for staging: restore to a quarantine environment and validate before reintroducing into production.</p>
        <p>Automate restore steps wherever possible. Manual restore is error-prone and slow under incident pressure.</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4">
          <h3 className="font-semibold">A Practical Restore Sequence</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><strong>Pick the recovery point:</strong> choose the timestamp or backup chain that matches your RPO.</li>
            <li><strong>Restore in isolation:</strong> recover into a quarantined environment to avoid contaminating production.</li>
            <li><strong>Run integrity checks:</strong> validate invariants, row counts, and checksums; rebuild indexes if required.</li>
            <li><strong>Rebuild derived systems:</strong> search indexes, caches, and projections are often rebuilt rather than restored.</li>
            <li><strong>Cut over safely:</strong> reintroduce traffic gradually and monitor for inconsistencies or missing dependencies.</li>
          </ul>
        </div>
        <p className="mt-4">
          Restore also depends on operational prerequisites: access to encryption keys, credentials for storage systems, and
          configuration needed to bring services up. Many &quot;restore failures&quot; are actually key management or access
          control failures discovered too late.
        </p>
      </section>

      <section>
        <h2>Failure Modes</h2>
        <p>The most common failure is untested backups. Teams discover missing data, corrupted archives, or incompatible formats only during incidents.</p>
        <p>Another failure is backup drift: schema changes, new services, or new storage systems are not included in the backup plan, leaving gaps during recovery.</p>
        <p>
          A more subtle failure is treating restore time as purely a storage problem. Restore time is often dominated by
          rebuilding indexes, rehydrating caches, reprocessing pipelines, and validating correctness. If restore runbooks
          do not include these steps, the system may come &quot;up&quot; quickly but behave incorrectly for hours.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/backup-restore-architecture-aws.png"
          alt="AWS backup and restore architecture"
          caption="Backup and restore architecture showing cross-region protection and restore paths."
        />
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <p>Run restore drills that measure RTO and validate RPO. Treat drill failures as production incidents with action items and owners.</p>
        <p>Monitor backup job success and storage health. Alert on skipped runs, unusual backup sizes, or checksum mismatches.</p>
        <p>
          A good playbook includes decision points. Not every incident should trigger a full restore. Sometimes a targeted
          correction (undoing an accidental delete) is safer and faster than restoring an entire database. Define when you
          restore, when you repair in place, and when you fail over to a replica or standby.
        </p>
      </section>

      <section>
        <h2>Trade-offs</h2>
        <p>More frequent backups reduce data loss but increase cost and operational load. Faster restore paths require more storage and dedicated recovery environments.</p>
        <p>Backup encryption and access controls improve security but can slow recovery if keys or credentials are not readily available.</p>
        <p>
          Storing more backups is not always safer. Large retention windows increase the number of artifacts you must
          protect, monitor, and periodically verify. Teams often strike a balance: frequent short-term backups, plus
          weekly or monthly long-term archives with integrity verification.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/backup-restore-test-aws.png"
          alt="Backup restore testing workflow"
          caption="Automated restore testing workflow to validate backup reliability."
        />
      </section>

      <section>
        <h2>Security and Key Management</h2>
        <p>
          Backups often contain the most sensitive data in the organization. Encrypt backups at rest, enforce least
          privilege on restore access, and log all restore operations. The restore path should be considered a privileged
          operation with approvals and auditability.
        </p>
        <p>
          Key management is part of reliability. If keys are rotated or revoked, old backups can become unrecoverable.
          Document key rotation procedures, test restores across rotations, and keep emergency access paths so an incident
          responder can restore without breaking security policy.
        </p>
      </section>

      <section>
        <h2>Operational Signals to Watch</h2>
        <ul className="space-y-2">
          <li><strong>Backup success rate:</strong> failures, retries, and skipped runs.</li>
          <li><strong>Backup size anomalies:</strong> sudden growth or shrink that indicates missing tables or runaway data.</li>
          <li><strong>Checksum and integrity verification:</strong> corruption detection in stored archives.</li>
          <li><strong>Restore drill results:</strong> measured RTO, data validation failures, and time spent rebuilding indexes.</li>
          <li><strong>Coverage drift:</strong> new services or new storage systems not included in backup scope.</li>
        </ul>
      </section>

      <section>
        <h2>Testing and Validation</h2>
        <p>Perform full restores to a test environment at regular intervals. Validate data correctness and application behavior, not just database integrity.</p>
        <p>Test partial restores as well, such as recovering a single tenant or table, because those are the most common real incidents.</p>
      </section>

      <section>
        <h2>Scenario: Accidental Deletion</h2>
        <p>A production table is accidentally deleted. A point-in-time restore is required to recover data without losing recent valid updates. Log shipping enables recovery to a precise timestamp, while full + incremental backups may require manual reconciliation.</p>
        <p>The scenario emphasizes the need for granular restores and a clear data reconciliation plan when restoring into a live system.</p>
      </section>

      <section>
        <h2>Backup Scope and Coverage</h2>
        <p>Backups should cover not only primary databases but also configuration, secrets, and metadata needed to rebuild services. Missing config can delay recovery even if data is intact.</p>
        <p>For multi-tenant systems, define tenant-level restore workflows so recovery can be targeted without impacting all tenants.</p>
      </section>

      <section>
        <h2>Data Validation After Restore</h2>
        <p>Restoring data is not the end. Validate invariants, rebuild materialized views, and verify downstream pipelines. Silent inconsistency after restore is a common failure mode.</p>
        <p>Automated validation checks reduce the risk of reintroducing corrupted data into production.</p>
      </section>

      <section>
        <h2>Backup Cost and Retention</h2>
        <p>Retention is a balance between compliance requirements and cost. Long retention periods may be legally required but can be expensive without lifecycle management.</p>
        <p>Tiered storage with periodic checksum verification keeps costs manageable while maintaining trust in old backups.</p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Define RPO/RTO, automate backups, test full and partial restores, and monitor backup integrity.</p>
        <p>Document key access, storage locations, and restore runbooks.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you validate backups are usable?</p>
            <p className="mt-2 text-sm text-muted">
              A: Restore regularly. Integrity checks and “backup succeeded” logs are not enough. Run restore drills,
              validate application invariants, and measure time-to-restore against RTO.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Incremental backups vs log shipping: what are the trade-offs?</p>
            <p className="mt-2 text-sm text-muted">
              A: Incrementals are simpler operationally but can increase restore time because you must replay a chain.
              Log shipping supports point-in-time recovery and tighter RPO, but it requires more careful operational
              management and monitoring of log continuity.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you restore a single tenant without affecting others?</p>
            <p className="mt-2 text-sm text-muted">
              A: Design for targeted restores: tenant-scoped backups, row-level export/import, or logical restore into a
              separate environment followed by controlled re-ingestion. The workflow should include reconciliation so the
              tenant’s data is consistent with downstream indexes and caches.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the most common backup failure in practice?</p>
            <p className="mt-2 text-sm text-muted">
              A: Backups exist but restores fail: missing permissions, missing encryption keys, incomplete config, or a
              restore that exceeds RTO. “We never tested restore” is the root cause of many DR incidents.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
