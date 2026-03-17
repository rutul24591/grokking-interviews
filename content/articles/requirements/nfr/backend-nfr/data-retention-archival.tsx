"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-data-retention-archival-extensive",
  title: "Data Retention & Archival",
  description: "Comprehensive guide to data retention and archival, covering retention policies, storage tiers, compliance requirements, and data lifecycle management for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "data-retention-archival",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "data-retention", "archival", "storage", "compliance", "lifecycle"],
  relatedTopics: ["compliance-auditing", "durability-guarantees", "cost-optimization", "database-selection"],
};

export default function DataRetentionArchivalArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Data Retention</strong> defines how long data is kept before deletion.
          <strong>Archival</strong> moves infrequently accessed data to cheaper, slower storage.
          Together, they manage data lifecycle to balance cost, compliance, and accessibility.
        </p>
        <p>
          Data retention is driven by:
        </p>
        <ul>
          <li>
            <strong>Compliance:</strong> Legal requirements (tax records: 7 years, medical: 6+ years).
          </li>
          <li>
            <strong>Business needs:</strong> Analytics, historical reporting, customer service.
          </li>
          <li>
            <strong>User expectations:</strong> Data availability for their use.
          </li>
          <li>
            <strong>Cost:</strong> Storage costs increase with data volume.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Retention is a Liability</h3>
          <p>
            Data you don&apos;t need is a liability, not an asset. It increases breach risk, compliance
            burden, and storage costs. Define clear retention policies and delete data when no longer needed.
          </p>
        </div>
      </section>

      <section>
        <h2>Data Retention &amp; Archival Deep Dive</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/retention-archival-deep-dive.svg"
          alt="Data Retention and Archival Deep Dive"
          caption="Data Retention Deep Dive — showing storage tier economics, compliance requirements, archive strategies, secure deletion methods"
        />
        <p>
          Advanced data retention and archival concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Storage Tier Economics</h3>
        <p>
          Understanding the cost vs. access speed trade-off:
        </p>
        <ul>
          <li>
            <strong>Hot Storage (SSD/NVMe):</strong> ~$0.10/GB, &lt;1ms access. For frequently accessed data,
            active debugging, real-time analytics. Most expensive tier.
          </li>
          <li>
            <strong>Warm Storage (HDD):</strong> ~$0.03/GB, ~10ms access. For moderately accessed data,
            historical analysis, incident investigation. Good balance of cost and performance.
          </li>
          <li>
            <strong>Cold Storage (Archive):</strong> ~$0.004/GB, hours to retrieve. For compliance archives,
            rarely accessed data, long-term retention. 25x cheaper than hot storage but slow retrieval.
          </li>
        </ul>
        <p>
          <strong>Key insight:</strong> Move data to colder tiers as it ages. Automate lifecycle policies
          to optimize costs while maintaining accessibility for business needs.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compliance Retention Requirements</h3>
        <p>
          Different regulations mandate different retention periods:
        </p>
        <ul>
          <li>
            <strong>SOX (Financial):</strong> 7 years minimum for financial records, audit trails,
            and supporting documentation. Applies to publicly traded companies.
          </li>
          <li>
            <strong>HIPAA (Healthcare):</strong> 6-10 years for medical records, PHI access logs,
            and security documentation. Varies by state.
          </li>
          <li>
            <strong>GDPR (EU Data Protection):</strong> Minimum necessary retention. Must delete
            personal data when no longer needed for original purpose. Right to erasure.
          </li>
          <li>
            <strong>Tax Records (US):</strong> 7 years for tax-related documents and supporting records.
            IRS can audit up to 6 years back.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Archive Strategies</h3>
        <p>
          Different approaches to archiving data:
        </p>
        <ul>
          <li>
            <strong>Full Archive:</strong> Complete snapshot of data at point in time.
            Simple but storage intensive. Good for compliance snapshots.
          </li>
          <li>
            <strong>Incremental:</strong> Only changes since last archive.
            Storage efficient but complex restoration (need full + all incrementals).
          </li>
          <li>
            <strong>Differential:</strong> Changes since last full archive.
            Balance between full and incremental. Faster restoration than incremental.
          </li>
          <li>
            <strong>Continuous (WAL Archiving):</strong> Capture every change in real-time.
            Enables point-in-time recovery. Most complex but most flexible.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Secure Data Deletion</h3>
        <p>
          Different approaches to deleting data securely:
        </p>
        <ul>
          <li>
            <strong>Soft Delete:</strong> Mark as deleted with timestamp, retain for grace period (30-90 days).
            Allows recovery from accidental deletion. Common pattern for user-facing applications.
          </li>
          <li>
            <strong>Hard Delete:</strong> Permanent removal after retention period expires.
            Overwrite storage blocks to prevent recovery. Verify deletion completed successfully.
          </li>
          <li>
            <strong>Crypto-Shredding:</strong> Delete encryption keys instead of data.
            Data becomes unrecoverable without key deletion. Efficient for large datasets,
            cloud storage, or when physical deletion is impractical.
          </li>
        </ul>
      </section>

      <section>
        <h2>Retention Policy Design</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/data-retention-archival.svg"
          alt="Data Retention and Storage Tiers"
          caption="Data Retention — showing storage tier pyramid (Hot/Warm/Cold), lifecycle policy timeline, archive patterns, and compliance requirements"
        />
        <p>
          A retention policy defines how long each data type is kept:
        </p>
      </section>

      <section>
        <h2>Retention &amp; Archival Deep Dive</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/data-retention-deep-dive.svg"
          alt="Data Retention Deep Dive"
          caption="Data Retention Deep Dive — showing storage tier economics, compliance requirements, archive strategies, and secure deletion methods"
        />
        <p>
          Advanced retention and archival concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Classification</h3>
        <p>
          Classify data by retention requirements:
        </p>
        <ul>
          <li>
            <strong>Transactional:</strong> Orders, payments (7+ years for tax/legal).
          </li>
          <li>
            <strong>Operational:</strong> Logs, metrics (30-90 days for debugging, 1 year for analysis).
          </li>
          <li>
            <strong>User-generated:</strong> Posts, comments (indefinite or user-controlled).
          </li>
          <li>
            <strong>Personal data:</strong> PII (minimum necessary, delete on request/expiration).
          </li>
          <li>
            <strong>Temporary:</strong> Sessions, caches (hours to days).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Retention Periods</h3>
        <p>
          Example retention schedule:
        </p>
        <ul>
          <li>Authentication logs: 1 year (security).</li>
          <li>Financial transactions: 7 years (tax compliance).</li>
          <li>Medical records: 6-10 years (HIPAA/state laws).</li>
          <li>Application logs: 90 days hot, 1 year archived.</li>
          <li>User data: Until account deletion + grace period.</li>
          <li>Backups: 30 days rolling, monthly for 1 year.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Legal Hold</h3>
        <p>
          Suspend deletion when data is relevant to litigation:
        </p>
        <ul>
          <li>Legal team issues hold notice.</li>
          <li>Retention policies suspended for affected data.</li>
          <li>Hold tracked and documented.</li>
          <li>Released when litigation concludes.</li>
        </ul>
      </section>

      <section>
        <h2>Storage Tiers</h2>
        <p>
          Move data to appropriate storage based on access patterns:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Hot Storage</h3>
        <p>
          Frequently accessed data:
        </p>
        <ul>
          <li>SSD/NVMe storage.</li>
          <li>In-memory caches.</li>
          <li>Low latency, high cost.</li>
          <li>Recent data (last 30 days).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Warm Storage</h3>
        <p>
          Infrequently accessed data:
        </p>
        <ul>
          <li>HDD storage.</li>
          <li>Standard cloud storage (S3 Standard).</li>
          <li>Medium latency, medium cost.</li>
          <li>30 days to 1 year old data.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cold Storage</h3>
        <p>
          Rarely accessed data (archival):
        </p>
        <ul>
          <li>Tape, optical, or cold cloud storage (S3 Glacier).</li>
          <li>High latency (hours to retrieve), low cost.</li>
          <li>1+ year old data.</li>
          <li>Compliance archives.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Lifecycle Policies</h3>
        <p>
          Automate tier transitions:
        </p>
        <ul>
          <li>Day 0-30: Hot storage.</li>
          <li>Day 31-365: Warm storage.</li>
          <li>Day 365+: Cold storage.</li>
          <li>Day 2555 (7 years): Delete (if no legal hold).</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a data retention policy for a fintech application. What data do you keep and for how long?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Transaction records:</strong> 7 years (SEC/FINRA requirements). Store in cold storage after 1 year.</li>
                <li><strong>Account statements:</strong> 7 years. Provide user access for 2 years, archive thereafter.</li>
                <li><strong>Trade confirmations:</strong> 3 years minimum. Keep accessible for 1 year.</li>
                <li><strong>AML/KYC records:</strong> 5 years after account closure. Required for regulatory audits.</li>
                <li><strong>Access logs:</strong> 1 year for security monitoring. 7 years for compliance audit trail.</li>
                <li><strong>User communications:</strong> 3 years (emails, chat logs with support).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Compare hot, warm, and cold storage tiers. When would you use each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Hot storage (SSD/NVMe):</strong> ~$0.10/GB/month, &lt;1ms access. For frequently accessed data, active debugging, real-time analytics.</li>
                <li><strong>Warm storage (HDD):</strong> ~$0.03/GB/month, ~10ms access. For moderately accessed data, historical analysis, incident investigation.</li>
                <li><strong>Cold storage (Archive):</strong> ~$0.004/GB/month, hours to retrieve. For compliance archives, rarely accessed data, long-term retention.</li>
                <li><strong>Cost optimization:</strong> Move data to colder tiers as it ages. 100 TB on hot = $10,000/month. On cold = $400/month. 25× savings.</li>
                <li><strong>Use cases:</strong> Hot for recent transactions, warm for 30 days-1 year data, cold for 1+ year archives.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. How do you implement automated data archival in a cloud environment?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Partitioning:</strong> Partition tables by date (monthly/quarterly). Easy to move old partitions to archive.</li>
                <li><strong>Lifecycle policies:</strong> Use S3 Lifecycle Policies to auto-transition objects (Standard → IA → Glacier).</li>
                <li><strong>Archival process:</strong> (1) Identify data older than threshold. (2) Export to compressed format. (3) Move to cold storage. (4) Delete from primary.</li>
                <li><strong>Automation:</strong> Scheduled jobs (weekly/monthly) to archive old data. Monitor archival progress.</li>
                <li><strong>Tools:</strong> AWS S3 Lifecycle, Azure Blob Lifecycle, GCS Object Lifecycle. Database-native tools (pg_partman for PostgreSQL).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. A user requests deletion under GDPR &quot;right to be forgotten&quot;. How do you handle this with backups and archives?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Data inventory:</strong> Catalog all systems storing user data (databases, caches, backups, logs, analytics).</li>
                <li><strong>Deletion strategy:</strong> (1) Soft delete first (30-day grace period). (2) Hard delete from active systems. (3) Crypto-shredding for backups.</li>
                <li><strong>Backups:</strong> Can&apos;t delete from backups without compromising integrity. Use crypto-shredding (delete encryption key for user data).</li>
                <li><strong>Propagation:</strong> Publish deletion event to all systems. Each system deletes asynchronously.</li>
                <li><strong>Verification:</strong> Audit deletion completion. Generate compliance report for user.</li>
                <li><strong>Exceptions:</strong> Legal hold, regulatory requirements (financial/medical records) override deletion requests.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. How do you balance compliance retention requirements with cost optimization?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Classify data:</strong> Identify data with legal retention requirements vs. operational data.</li>
                <li><strong>Tiered storage:</strong> Keep compliance data in cold storage (cheap, long-term). Delete operational data when no longer needed.</li>
                <li><strong>Compression:</strong> Compress archived data (Parquet/ORC) to reduce storage costs by 5-10×.</li>
                <li><strong>Sampling:</strong> For non-critical logs, sample verbose data (10% of DEBUG logs). Keep all ERROR/WARN logs.</li>
                <li><strong>Downsampling:</strong> Aggregate old metrics (1-second → 1-minute → 1-hour granularity).</li>
                <li><strong>Regular audits:</strong> Review retention policies annually. Delete data past retention period (unless legal hold).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. Design a lifecycle policy for application logs that must be kept for 1 year but are rarely accessed after 30 days.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Day 0-30 (Hot):</strong> Elasticsearch for active debugging. Full-text search, fast queries.</li>
                <li><strong>Day 31-90 (Warm):</strong> Compressed indices in Elasticsearch. Slower queries, lower cost.</li>
                <li><strong>Day 91-365 (Cold):</strong> S3 Glacier for compliance archive. Hours to retrieve, very cheap.</li>
                <li><strong>Day 365+:</strong> Delete logs (unless legal hold).</li>
                <li><strong>Implementation:</strong> Use Elasticsearch ILM (Index Lifecycle Management) with rollover policy. S3 Lifecycle for Glacier transition.</li>
                <li><strong>Cost:</strong> 10 TB logs: All in hot = $1,000/month. With lifecycle = ~$100/month (90% savings).</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Data Retention Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Data classification completed (PII, financial, operational)</li>
          <li>✓ Retention periods defined per data type</li>
          <li>✓ Legal requirements documented (GDPR, HIPAA, tax laws)</li>
          <li>✓ Storage tiers configured (hot, warm, cold)</li>
          <li>✓ Lifecycle policies automated</li>
          <li>✓ Deletion procedures documented</li>
          <li>✓ Legal hold process defined</li>
          <li>✓ Backup retention aligned with policies</li>
          <li>✓ User data export/deletion functionality</li>
          <li>✓ Regular retention audits scheduled</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
