"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-data-migration-strategy-extensive",
  title: "Data Migration Strategy",
  description: "Comprehensive guide to zero-downtime data migrations, covering expand-contract pattern, dual writes, schema evolution, and production migration patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "data-migration-strategy",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "data-migration", "schema", "zero-downtime", "database", "deployment"],
  relatedTopics: ["schema-governance", "api-versioning", "database-selection", "disaster-recovery"],
};

export default function DataMigrationStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Data Migration</strong> is the process of changing data schema or structure while
          maintaining system availability. Zero-downtime migrations are essential for systems that
          must remain available 24/7.
        </p>
        <p>
          Migration challenges:
        </p>
        <ul>
          <li>Large tables (millions/billions of rows).</li>
          <li>High-traffic systems (can&apos;t afford downtime).</li>
          <li>Complex schema changes (splitting columns, normalizing).</li>
          <li>Backward compatibility (old and new code running simultaneously).</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Migration is a Deployment Problem</h3>
          <p>
            Data migrations aren&apos;t just database operations — they require coordinating code
            deployments, schema changes, and data backfills. The safest migrations are gradual,
            reversible, and tested at production scale.
          </p>
        </div>
      </section>

      <section>
        <h2>Migration Patterns</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/migration-patterns.svg"
          alt="Zero-Downtime Migration Patterns"
          caption="Migration Patterns — showing Expand-Contract pattern phases, Dual Write pattern, and strategy comparison"
        />
        <p>
          Three-phase migration for schema changes:
        </p>
      </section>

      <section>
        <h2>Migration Strategies Deep Dive</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/data-migration-strategies.svg"
          alt="Data Migration Strategies"
          caption="Data Migration — showing Expand-Contract pattern with database schema evolution, Dual Write pattern, and migration checklist"
        />
        <p>
          Advanced migration techniques for production systems:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Expand-Contract Pattern</h3>
        <p>
          Three-phase migration for schema changes:
        </p>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>Expand:</strong> Add new schema elements (columns, tables) without removing old.
            Deploy code that writes to both old and new.
          </li>
          <li>
            <strong>Migrate:</strong> Backfill existing data from old to new schema. Run as background
            job, batched to avoid load.
          </li>
          <li>
            <strong>Contract:</strong> Once all data migrated and old code deprecated, remove old schema.
          </li>
        </ol>
        <p>
          <strong>Example: Renaming a column</strong>
        </p>
        <ul>
          <li>Phase 1: Add new column as nullable, deploy code writing to both old and new columns</li>
          <li>Phase 2: Backfill existing data in batches (e.g., 10,000 rows at a time) to avoid table locks</li>
          <li>Phase 3: Deploy code reading from new column only, then remove old column</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Dual Write Pattern</h3>
        <p>
          Write to both old and new schema simultaneously:
        </p>
        <ul>
          <li>Deploy code that writes to both schemas.</li>
          <li>Read from old, verify new matches.</li>
          <li>Once verified, switch reads to new.</li>
          <li>Remove old schema.</li>
        </ul>
        <p>
          <strong>Use when:</strong> Complex migrations, need to validate before switching.
        </p>
        <p>
          <strong>Risk:</strong> Inconsistency if one write fails.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Shadow Read Pattern</h3>
        <p>
          Read from both schemas, compare results:
        </p>
        <ul>
          <li>Deploy code that reads from old and new.</li>
          <li>Use old for actual response.</li>
          <li>Log discrepancies between old and new.</li>
          <li>Fix issues, then switch to new.</li>
        </ul>
        <p>
          <strong>Use when:</strong> Validating migration correctness before cutover.
        </p>
      </section>

      <section>
        <h2>Data Migration Deep Dive</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/data-migration-deep-dive.svg"
          alt="Data Migration Deep Dive"
          caption="Data Migration Deep Dive — showing zero-downtime migration patterns, backfill strategies, migration best practices"
        />
        <p>
          Advanced data migration concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Zero-Downtime Migration Patterns</h3>
        <p>
          Different approaches to migrating data without downtime:
        </p>
        <ul>
          <li>
            <strong>Expand-Contract (Safest):</strong> Add new column/table (expand), migrate data gradually,
            remove old column/table (contract). Most common pattern for schema changes. Allows rollback at any stage.
          </li>
          <li>
            <strong>Dual Write:</strong> Write to both old and new schema simultaneously during transition.
            Faster migration but risk of inconsistency if one write fails. Requires careful error handling.
          </li>
          <li>
            <strong>Shadow Read:</strong> Read from both schemas, compare results to validate correctness
            before switching. Excellent for testing but doubles read load during migration.
          </li>
          <li>
            <strong>Strangler Fig:</strong> Gradually replace old system with new, routing traffic incrementally.
            Low risk but slow. Good for large-scale migrations.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Backfill Strategies</h3>
        <p>
          Different approaches to migrating existing data:
        </p>
        <ul>
          <li>
            <strong>Batch Backfill:</strong> Process data in chunks (e.g., 1000 rows at a time).
            Control database load, can pause/resume, easy to monitor progress. Most common approach.
          </li>
          <li>
            <strong>Trigger-Based:</strong> Backfill data on first access (lazy migration).
            No bulk operation needed, but inconsistent migration state during transition.
          </li>
          <li>
            <strong>Parallel Backfill:</strong> Multiple workers process different data ranges simultaneously.
            Fastest approach but complex coordination, risk of conflicts.
          </li>
          <li>
            <strong>CDC-Based:</strong> Use Change Data Capture to replicate changes in real-time.
            Most accurate, enables zero-downtime cutover. Requires CDC infrastructure.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Migration Best Practices</h3>
        <p>
          Critical practices for successful migrations:
        </p>
        <ul>
          <li>
            <strong>Test on Production-Sized Dataset:</strong> Performance characteristics change at scale.
            Test migration scripts on data volume matching production.
          </li>
          <li>
            <strong>Implement Rollback Procedure:</strong> Always have a way to revert if migration fails.
            Test rollback procedure before starting migration.
          </li>
          <li>
            <strong>Monitor Replication Lag:</strong> During backfill, monitor database replication lag.
            Slow down batch size if lag increases.
          </li>
          <li>
            <strong>Use Feature Flags:</strong> Gradually roll out new schema usage via feature flags.
            Enables quick rollback by disabling flag.
          </li>
          <li>
            <strong>Batch Backfill:</strong> Avoid table locks by processing in small batches.
            Add delays between batches to reduce load.
          </li>
          <li>
            <strong>Verify Data Consistency:</strong> Before cutover, verify data consistency between
            old and new schema. Sample comparison or full checksum verification.
          </li>
        </ul>
      </section>

      <section>
        <h2>Large Table Migrations</h2>
        <p>
          Migrating tables with millions/billions of rows requires special techniques:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Batched Backfill</h3>
        <p>
          Process data in small batches to avoid locks and replication lag:
        </p>
        <ul>
          <li>Query for rows needing migration with LIMIT clause</li>
          <li>Update batch of rows (e.g., 10,000 at a time)</li>
          <li>Sleep briefly between batches to avoid overwhelming database</li>
          <li>Repeat until all rows migrated</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Trigger-Based Migration</h3>
        <p>
          Use database triggers to keep new schema in sync during migration:
        </p>
        <ul>
          <li>Create trigger that fires on UPDATE/INSERT</li>
          <li>Trigger populates new column from old column automatically</li>
          <li>Ensures new column stays in sync during transition</li>
        </ul>
        <p>
          <strong>Pros:</strong> Automatic, no code changes needed.
        </p>
        <p>
          <strong>Cons:</strong> Database load, hard to debug.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Table Copy Strategy</h3>
        <p>
          For major schema changes, create new table and migrate:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Create new table with new schema.</li>
          <li>Set up triggers to sync old → new.</li>
          <li>Backfill existing data.</li>
          <li>Swap tables (rename).</li>
          <li>Drop old table.</li>
        </ol>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. How do you migrate a database table with 100M rows without downtime?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Expand-Contract pattern:</strong> (1) Add new column. (2) Dual write (old + new). (3) Backfill in batches. (4) Switch reads. (5) Remove old column.</li>
                <li><strong>Batching:</strong> Backfill 1000 rows at a time. Sleep between batches. Prevents replication lag.</li>
                <li><strong>Triggers:</strong> Keep old + new in sync during migration. Automatic sync for new writes.</li>
                <li><strong>Monitoring:</strong> Watch replication lag, query latency. Pause migration if lag &gt; threshold.</li>
                <li><strong>Timeline:</strong> 100M rows at 1000/batch = 100K batches. At 10 batches/sec = 3 hours. Plan for 6-8 hours with buffer.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Explain the Expand-Contract pattern. When would you use it?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Expand phase:</strong> Add new schema element (column, table, field). Both old and new coexist.</li>
                <li><strong>Migration phase:</strong> Deploy code that writes to both. Backfill existing data gradually.</li>
                <li><strong>Contract phase:</strong> Remove old schema element. Complete migration.</li>
                <li><strong>When to use:</strong> Zero-downtime migrations, breaking schema changes, large tables.</li>
                <li><strong>Benefits:</strong> No downtime, gradual rollout, easy rollback (just stop writing to new).</li>
                <li><strong>Trade-offs:</strong> More complex, temporary storage overhead, longer migration time.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Your migration is causing replication lag. How do you diagnose and fix this?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Diagnosis:</strong> (1) Check replication lag metrics. (2) Identify long-running queries. (3) Check lock waits.</li>
                <li><strong>Immediate fix:</strong> Pause migration. Reduce batch size. Add sleep between batches.</li>
                <li><strong>Root causes:</strong> (1) Batch too large (locks held too long). (2) No sleep between batches. (3) Missing index on backfill query.</li>
                <li><strong>Long-term fix:</strong> (1) Smaller batches (100-1000 rows). (2) Sleep 100-500ms between batches. (3) Add indexes for backfill queries.</li>
                <li><strong>Monitoring:</strong> Alert on replication lag &gt; 30 seconds. Auto-pause migration if lag &gt; 60 seconds.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. How do you handle rollback if a migration fails halfway through?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Prevention:</strong> Test rollback before migration. Every UP migration needs DOWN migration.</li>
                <li><strong>Rollback strategy:</strong> (1) Stop deployment. (2) Deploy old code. (3) Run DOWN migration. (4) Verify data integrity.</li>
                <li><strong>Partial migration:</strong> If backfill partially complete, old code must handle both migrated and unmigrated rows.</li>
                <li><strong>Data integrity:</strong> Verify row counts, checksums after rollback. Ensure no data loss.</li>
                <li><strong>Best practice:</strong> Design migrations to be forward-only (old code ignores new columns). Avoids rollback complexity.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Design a migration strategy for splitting a monolithic database into microservices.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Strangler fig pattern:</strong> Gradually extract tables into service-specific databases.</li>
                <li><strong>Phase 1:</strong> Create new service with own database. Dual write from monolith to new service.</li>
                <li><strong>Phase 2:</strong> Migrate reads to new service. Verify data consistency.</li>
                <li><strong>Phase 3:</strong> Migrate writes to new service. Remove dual write.</li>
                <li><strong>Phase 4:</strong> Remove old tables from monolith.</li>
                <li><strong>Data sync:</strong> Use CDC (Debezium) to keep databases in sync during transition.</li>
                <li><strong>Rollback:</strong> Keep old tables until migration complete. Can revert at any phase.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you test database migrations before deploying to production?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Unit tests:</strong> Test migration logic (UP and DOWN). Verify data transformations.</li>
                <li><strong>Integration tests:</strong> Run migration on test database. Verify schema changes, data integrity.</li>
                <li><strong>Staging test:</strong> Run on staging with production-sized data. Measure migration time, replication lag.</li>
                <li><strong>Dry run:</strong> Run migration in read-only mode. Verify no errors, estimate time.</li>
                <li><strong>Rollback test:</strong> Run UP migration, then DOWN migration. Verify data integrity after rollback.</li>
                <li><strong>Best practice:</strong> Automate migration testing in CI. Block deployment if migration tests fail.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Migration Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Migration tested on production-sized dataset</li>
          <li>✓ Rollback plan documented and tested</li>
          <li>✓ Backfill script batched to avoid locks</li>
          <li>✓ Monitoring for replication lag, query performance</li>
          <li>✓ Old and new code compatible during transition</li>
          <li>✓ Feature flag for gradual rollout</li>
          <li>✓ Communication plan for stakeholders</li>
          <li>✓ Post-migration validation queries</li>
          <li>✓ Cleanup plan for old schema/data</li>
          <li>✓ Runbook for common issues</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
