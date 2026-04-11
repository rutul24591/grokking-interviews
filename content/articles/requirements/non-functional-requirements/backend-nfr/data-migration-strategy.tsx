"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-data-migration-strategy",
  title: "Data Migration Strategy",
  description: "Comprehensive guide to data migration — schema evolution, zero-downtime migration, backward compatibility, expand-contract pattern, and migration testing for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "data-migration-strategy",
  wordCount: 5800,
  readingTime: 25,
  lastUpdated: "2026-04-11",
  tags: ["backend", "nfr", "data-migration", "schema-evolution", "zero-downtime", "backward-compatibility"],
  relatedTopics: ["schema-governance", "api-versioning", "durability-guarantees", "compliance-auditing"],
};

export default function DataMigrationStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Data migration</strong> is the process of moving data from one storage format, schema,
          or system to another while maintaining data integrity, availability, and consistency. Data
          migrations are required when evolving database schemas, migrating between database technologies,
          consolidating or splitting data stores, or transitioning to new data models. Unlike application
          deployments that can be rolled back instantly, data migrations are often irreversible or
          expensive to reverse — a failed migration can corrupt data, cause extended downtime, or require
          manual data recovery.
        </p>
        <p>
          The challenge of data migration is compounded by the requirement for zero-downtime deployments.
          Modern services must remain available 24/7, which means data migrations must execute while the
          application continues to read and write data. This requires careful coordination between schema
          changes, data transformation, and application deployment — the old application version must
          work with the new schema during the migration window, and the new application version must
          work with both the old and new schema during the transition.
        </p>
        <p>
          For staff and principal engineer candidates, data migration architecture demonstrates
          understanding of schema evolution, backward compatibility, and the ability to design migrations
          that are safe, reversible, and transparent to users. Interviewers expect you to design
          migrations that can be rolled forward or backward without data loss, handle terabytes of data
          without extended downtime, and maintain data consistency throughout the migration process.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Distinction: Schema Migration vs Data Migration</h3>
          <p>
            <strong>Schema migration</strong> changes the structure of the database (adding columns, changing data types, creating indexes) without moving data between systems. <strong>Data migration</strong> moves data from one system or format to another (MySQL to PostgreSQL, monolith database to sharded databases, row-based to columnar storage).
          </p>
          <p className="mt-3">
            Schema migrations are typically faster and lower-risk — they modify metadata and gradually transform data in place. Data migrations are higher-risk — they involve copying or transforming large volumes of data between systems, requiring dual-write, verification, and cutover planning. In interviews, always clarify which type of migration you are designing.
          </p>
        </div>

        <p>
          A mature data migration strategy follows the expand-contract pattern: expand the schema to
          support both old and new formats, run a backfill to migrate existing data to the new format,
          deploy the new application version that uses the new format, and contract the schema by
          removing the old format. Each step is backward compatible, allowing rollback at any point
          without data loss.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding data migration requires grasping several foundational concepts about schema
          evolution, backward compatibility, and migration patterns.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Expand-Contract Pattern</h3>
        <p>
          The expand-contract pattern is the safest approach to schema migration. In the expand phase,
          the schema is modified to support both the old and new formats — new columns are added (not
          renamed or removed), new tables are created alongside existing tables, and triggers or
          application logic maintain data in both formats. In the backfill phase, existing data is
          migrated from the old format to the new format while the application continues to operate.
          In the contract phase, after all data is migrated and the new application version is deployed,
          the old format is removed — columns are dropped, old tables are deleted, and triggers are
          removed. Each phase is backward compatible, allowing rollback at any point.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Backward-Compatible Schema Changes</h3>
        <p>
          Schema changes must be backward compatible — the old application version must continue to
          function correctly after the schema change. Adding columns is backward compatible (old
          applications ignore new columns). Adding tables is backward compatible (old applications
          do not access new tables). Removing columns is NOT backward compatible (old applications
          expect the column to exist). Renaming columns is NOT backward compatible (old applications
          reference the old column name). Changing data types is NOT backward compatible (old
          applications expect the old data type).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Dual-Write and Verification</h3>
        <p>
          For data migrations between systems (MySQL to PostgreSQL, monolith to sharded), the dual-write
          pattern writes data to both the old and new systems simultaneously. A verification process
          compares data between the two systems to ensure consistency. Once verification confirms that
          the new system contains all data and is consistent with the old system, read traffic is
          migrated to the new system, and eventually the old system is decommissioned. Dual-write
          ensures zero data loss during migration but adds write latency and operational complexity.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Data migration architecture spans schema evolution, backfill execution, verification,
          cutover, and rollback.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/data-migration-strategies.svg"
          alt="Data Migration Strategies"
          caption="Data Migration — showing expand-contract pattern, dual-write verification, and cutover flow"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Migration Execution Flow</h3>
        <p>
          The migration begins with schema expansion — adding new columns, tables, or indexes that
          support both old and new application versions. The expansion is deployed as a backward-compatible
          schema change that does not affect the old application&apos;s behavior. Next, the backfill process
          runs — a batch job that reads existing data from the old format and writes it to the new format.
          The backfill runs at a controlled rate to avoid overwhelming the database, and can be paused
          and resumed if issues are detected.
        </p>
        <p>
          After the backfill completes, the new application version is deployed. The new version reads
          from the new format and writes to both formats (dual-write) during the transition period. A
          verification process compares data between the old and new formats to detect discrepancies.
          Once verification confirms consistency, read traffic is migrated from the old format to the
          new format. Finally, the schema is contracted — the old format is removed, dual-write is
          disabled, and the migration is complete.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/migration-patterns.svg"
          alt="Migration Patterns"
          caption="Migration Patterns — comparing online migration, offline migration, and dual-write verification"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/data-migration-deep-dive.svg"
          alt="Data Migration Deep Dive"
          caption="Migration Deep Dive — showing backfill execution, verification, and rollback mechanisms"
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
              <td className="p-3"><strong>Expand-Contract</strong></td>
              <td className="p-3">
                Zero downtime. Rollback at any phase. Backward compatible. Safe for large datasets.
              </td>
              <td className="p-3">
                Multi-phase process (weeks). Schema bloat during migration. Complex coordination.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Dual-Write + Verify</strong></td>
              <td className="p-3">
                Zero data loss. Verification ensures consistency. Can rollback to old system.
              </td>
              <td className="p-3">
                Write latency overhead. Verification complexity. Temporary storage cost (2× data).
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Offline Migration</strong></td>
              <td className="p-3">
                Simple to implement. No dual-write overhead. Fast execution (no concurrency concerns).
              </td>
              <td className="p-3">
                Downtime required. Not suitable for 24/7 services. Rollback requires full restore.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Online CDC Migration</strong></td>
              <td className="p-3">
                Zero downtime. Continuous replication. Minimal write overhead. Near-real-time sync.
              </td>
              <td className="p-3">
                Requires CDC infrastructure. Complex conflict resolution. Schema compatibility required.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Make All Migrations Reversible</h3>
        <p>
          Every migration must have a rollback plan that restores the pre-migration state without data
          loss. For schema migrations, rollback means deploying the old application version and reversing
          the schema change (dropping new columns, recreating old columns from backup data). For data
          migrations, rollback means switching read traffic back to the old system and verifying data
          consistency. Test the rollback plan before executing the migration — a rollback plan that has
          never been tested is not a rollback plan, it is a hope.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Backfill at Controlled Rate</h3>
        <p>
          Backfill operations read and write large volumes of data, which can overwhelm the database
          and degrade application performance. Control the backfill rate by limiting throughput (rows
          per second), running during off-peak hours, and monitoring database utilization (CPU, memory,
          disk I/O, replication lag). If the backfill causes database utilization to exceed 80%, pause
          the backfill and resume when utilization drops. A backfill that takes 2 weeks at a controlled
          rate is preferable to a backfill that takes 2 days and causes production incidents.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Verify Data Consistency Before Cutover</h3>
        <p>
          Before migrating read traffic from the old system to the new system, verify that the new
          system contains all data and that the data is consistent with the old system. Run comparison
          queries that check row counts, checksums, and sample records between the two systems. For
          large datasets, use statistical sampling — compare 1% of records randomly selected from both
          systems. If the sample passes, proceed with cutover. If the sample fails, investigate and
          resolve discrepancies before proceeding.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitor Migration Progress</h3>
        <p>
          Migrations that run for hours or days require continuous monitoring to detect issues early.
          Monitor migration progress (rows migrated, percentage complete, estimated time remaining),
          database health (CPU, memory, disk I/O, replication lag), and application performance
          (latency, error rate, throughput). Set alerts for migration stalls (no progress for 30
          minutes), database overload (utilization &gt; 80%), and application degradation (latency
          increase &gt; 50%). If any alert fires, pause the migration and investigate before resuming.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Non-Backward-Compatible Schema Changes</h3>
        <p>
          The most destructive migration pitfall is deploying a schema change that breaks the old
          application version — removing a column that the old application reads, renaming a column
          that the old application references, or changing a data type that the old application expects.
          If the old application is deployed when the schema change is applied, it will crash, and
          rolling back requires restoring the old schema — which may not be possible if data has already
          been written in the new format. Always deploy schema changes that are backward compatible with
          the old application version.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Migrating Data Without Dual-Write</h3>
        <p>
          For data migrations between systems, writing only to the new system after the migration starts
          causes data loss — data written during the migration window is lost if the migration fails
          and rollback is required. Implement dual-write — write to both the old and new systems
          simultaneously during the migration window. Dual-write ensures that all data is available in
          both systems, enabling rollback to the old system without data loss.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Skipping Verification</h3>
        <p>
          Migrating data without verifying consistency between the old and new systems risks data
          corruption going undetected until users report issues — at which point the old system may
          have been decommissioned and rollback is impossible. Always run verification before cutover
          — compare row counts, checksums, and sample records between the two systems. Automate
          verification as part of the migration pipeline — the migration cannot proceed to cutover
          until verification passes.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Unbounded Backfill Impact</h3>
        <p>
          Running a backfill at full speed can overwhelm the database, causing latency spikes,
          replication lag, and application timeouts. Unbounded backfills are the most common cause of
          production incidents during migrations. Always bound the backfill rate — limit rows per
          second, monitor database utilization, and pause the backfill if utilization exceeds
          thresholds. A slow, controlled backfill is always preferable to a fast, disruptive one.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">GitHub — MySQL Schema Migration at Scale</h3>
        <p>
          GitHub manages one of the largest MySQL deployments in the world, with schema migrations that
          affect billions of rows. GitHub uses the expand-contract pattern for all schema migrations —
          new columns are added alongside existing columns, data is backfilled at a controlled rate
          (thousands of rows per second), and old columns are removed only after the new application
          version is fully deployed. GitHub&apos;s migration tool (gh-ost) performs online schema changes
          without locking tables, allowing the database to continue serving reads and writes during the
          migration. GitHub&apos;s migration process has zero downtime and has been tested on tables with
          billions of rows.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Slack — Database Sharding Migration</h3>
        <p>
          Slack migrated from a monolithic database to a sharded architecture to support growing user
          base and message volume. The migration used dual-write — new messages were written to both the
          monolithic database and the sharded database, while historical messages were backfilled from
          the monolithic database to the sharded database. A verification process compared message
          counts and checksums between the two systems to ensure consistency. Once verification passed,
          read traffic was migrated to the sharded database, and the monolithic database was
          decommissioned. The migration was completed with zero downtime and zero data loss.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stripe — Payment Schema Evolution</h3>
        <p>
          Stripe&apos;s payment schema evolves frequently as new payment methods, currencies, and regulatory
          requirements are added. Stripe uses backward-compatible schema changes exclusively — new fields
          are added as nullable columns with default values, allowing the old application version to
          continue functioning without modification. New application versions read and write the new
          fields, while the old application version ignores them. After all application instances are
          deployed to the new version, the schema is finalized (default values removed, NOT NULL
          constraints added). Stripe&apos;s migration process supports continuous deployment — schema
          changes are deployed independently of application changes, with no coordination required.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Airbnb — Data Warehouse Migration</h3>
        <p>
          Airbnb migrated its data warehouse from a Hadoop-based system to a cloud-native analytics
          platform. The migration used a parallel run approach — both systems ingested the same data,
          and automated comparison queries verified that query results were identical between the two
          systems. The migration was phased — non-critical workloads were migrated first, followed by
          critical workloads after verification passed. The migration completed with zero data loss and
          zero impact on business operations, and the new system provided 5× better query performance
          at 50% lower cost.
        </p>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          Data migrations involve copying and transforming large volumes of data, creating security risks that must be addressed.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Migration Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>Data Exposure During Migration:</strong> Data copied between systems may be exposed in transit or in temporary storage. Mitigation: encrypt data in transit (TLS) and at rest during migration, use dedicated migration infrastructure with restricted access, delete temporary data after migration completes.
            </li>
            <li>
              <strong>Migration Access Controls:</strong> Migration tools require elevated database permissions that could be exploited if compromised. Mitigation: use dedicated migration service accounts with minimum required permissions, rotate credentials before and after migration, audit all migration tool access.
            </li>
            <li>
              <strong>Dual-Write Data Consistency:</strong> During dual-write, data exists in two systems with potentially different security controls. Mitigation: ensure both systems have equivalent security controls (encryption, access control, audit logging), monitor both systems for unauthorized access during the migration window, decommission the old system promptly after cutover.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Compliance During Migration</h3>
          <ul className="space-y-2">
            <li>
              <strong>GDPR Data Mapping:</strong> Migrations must maintain accurate records of where personal data is stored. Update data maps during migration to reflect new storage locations, and ensure that GDPR rights (access, erasure, portability) can be fulfilled from both the old and new systems during the migration window.
            </li>
            <li>
              <strong>Audit Trail Preservation:</strong> Audit logs must be preserved during migration and remain accessible for compliance investigations. Migrate audit logs to the new system with integrity verification (checksums), and verify that the new system&apos;s audit log format satisfies compliance requirements.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Testing Strategies */}
      <section>
        <h2>Testing Strategies</h2>
        <p>
          Data migrations must be validated through systematic testing — migration correctness, rollback
          functionality, data consistency, and performance impact must all be verified.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Migration Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Dry Run Testing:</strong> Execute the migration against a production-like staging environment with a representative data sample. Verify that the migration completes successfully, data is consistent after migration, and the application functions correctly with the migrated data. Measure migration duration and resource utilization.
            </li>
            <li>
              <strong>Rollback Testing:</strong> After a successful dry run, execute the rollback plan. Verify that the system returns to the pre-migration state without data loss, the old application version functions correctly, and all data is consistent. Measure rollback duration and verify that it meets the RTO target.
            </li>
            <li>
              <strong>Verification Testing:</strong> Run comparison queries between the old and new systems to verify data consistency. Check row counts, checksums, and sample records. Test with edge cases (null values, special characters, large payloads) to ensure the migration handles all data types correctly.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Performance Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Backfill Impact Testing:</strong> Run the backfill at the planned rate and verify that database utilization remains within acceptable thresholds (CPU &lt; 80%, replication lag &lt; 10 seconds, application latency increase &lt; 50%). Test with different backfill rates to find the optimal rate that balances migration speed with production impact.
            </li>
            <li>
              <strong>Concurrency Testing:</strong> Test the migration while the application is running at production traffic levels. Verify that the migration does not cause deadlocks, lock contention, or transaction conflicts. Verify that application latency and error rate remain within SLOs during the migration.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Data Migration Readiness Checklist</h3>
          <ul className="space-y-2">
            <li>✓ Migration plan documented with phases, timeline, and rollback procedure</li>
            <li>✓ Schema changes are backward compatible with old application version</li>
            <li>✓ Dry run completed successfully in staging environment</li>
            <li>✓ Rollback plan tested and verified in staging environment</li>
            <li>✓ Backfill rate bounded and tested at production traffic levels</li>
            <li>✓ Verification process automated (row counts, checksums, sample records)</li>
            <li>✓ Monitoring configured (migration progress, database health, application performance)</li>
            <li>✓ Alerts configured for migration stall, database overload, application degradation</li>
            <li>✓ Dual-write implemented for data migrations between systems</li>
            <li>✓ Compliance requirements verified (GDPR data mapping, audit trail preservation)</li>
          </ul>
        </div>
      </section>

      {/* Section 10: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://github.blog/2020-04-20-engineering-mysql-schema-changes-github/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub — Engineering Safe MySQL Schema Changes
            </a>
          </li>
          <li>
            <a href="https://slack.engineering/mysql-schema-migrations/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Slack — MySQL Schema Migrations at Scale
            </a>
          </li>
          <li>
            <a href="https://stripe.com/blog" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Stripe Engineering Blog — Schema Evolution
            </a>
          </li>
          <li>
            <a href="https://github.com/github/gh-ost" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub — gh-ost: Online Schema Migration Tool
            </a>
          </li>
          <li>
            <a href="https://www.martinfowler.com/articles/schema-evolution.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler — Schema Evolution Patterns
            </a>
          </li>
          <li>
            <a href="https://www.usenix.org/system/files/login-logout_1305_bettis.pdf" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              USENIX — Database Migration Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
