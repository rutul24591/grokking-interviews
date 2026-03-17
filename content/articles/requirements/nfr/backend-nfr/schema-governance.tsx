"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-schema-governance-extensive",
  title: "Schema Governance",
  description: "Comprehensive guide to schema governance, covering schema evolution, backward compatibility, schema registry, and database migration patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "schema-governance",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "schema", "governance", "evolution", "compatibility", "migration"],
  relatedTopics: ["api-versioning", "database-selection", "data-migration", "consistency-model"],
};

export default function SchemaGovernanceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Schema Governance</strong> is the management of data schema changes across systems.
          As applications evolve, schemas must change while maintaining compatibility with existing
          consumers and data.
        </p>
        <p>
          Poor schema governance leads to:
        </p>
        <ul>
          <li>Breaking changes that disrupt consumers.</li>
          <li>Data corruption from incompatible migrations.</li>
          <li>Downtime during schema changes.</li>
          <li>Schema drift (different systems, different schemas).</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Schema is a Contract</h3>
          <p>
            A schema is a contract between data producers and consumers. Changing it requires coordination,
            versioning, and migration strategies. Treat schema changes like API changes — with versioning
            and deprecation policies.
          </p>
        </div>
      </section>

      <section>
        <h2>Schema Evolution</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/schema-governance.svg"
          alt="Schema Governance and Evolution"
          caption="Schema Governance — showing schema registry flow, compatibility types (Backward/Forward/Full/None), safe schema changes, and database migration patterns"
        />
        <p>
          Strategies for evolving schemas over time:
        </p>
      </section>

      <section>
        <h2>Schema Governance Deep Dive</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/schema-governance-deep-dive.svg"
          alt="Schema Governance Deep Dive"
          caption="Schema Governance Deep Dive — showing schema registry workflow, compatibility matrix, safe schema evolution rules"
        />
        <p>
          Advanced schema governance concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Backward Compatibility</h3>
        <p>
          New schema can read old data:
        </p>
        <ul>
          <li>
            <strong>Additive changes:</strong> Adding fields (with defaults).
          </li>
          <li>
            <strong>Optional fields:</strong> New fields are optional, not required.
          </li>
          <li>
            <strong>Never remove:</strong> Don&apos;t remove fields in use.
          </li>
        </ul>
        <p>
          <strong>Use when:</strong> Consumers upgrade at different times.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Forward Compatibility</h3>
        <p>
          Old schema can read new data:
        </p>
        <ul>
          <li>
            <strong>Ignore unknown fields:</strong> Consumers ignore fields they don&apos;t recognize.
          </li>
          <li>
            <strong>Never add required fields:</strong> Old consumers can&apos;t provide them.
          </li>
        </ul>
        <p>
          <strong>Use when:</strong> Producers upgrade before consumers.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Full Compatibility</h3>
        <p>
          Both backward and forward compatible:
        </p>
        <ul>
          <li>Only additive, optional changes.</li>
          <li>Most restrictive but safest.</li>
          <li>Required for event streaming (Kafka).</li>
        </ul>
      </section>

      <section>
        <h2>Schema Registry</h2>
        <p>
          Centralized schema management:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Confluent Schema Registry</h3>
        <p>
          For Kafka ecosystems:
        </p>
        <ul>
          <li>Stores schema versions.</li>
          <li>Compatibility checking.</li>
          <li>Schema evolution enforcement.</li>
          <li>Supports Avro, Protobuf, JSON Schema.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compatibility Checks</h3>
        <p>
          Automated validation of schema changes:
        </p>
        <ul>
          <li>BACKWARD: New reads old.</li>
          <li>FORWARD: Old reads new.</li>
          <li>FULL: Both directions.</li>
          <li>NONE: No checking (dangerous).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Schema Versioning</h3>
        <p>
          Track schema versions:
        </p>
        <ul>
          <li>Auto-increment version IDs.</li>
          <li>Schema + version in messages.</li>
          <li>Deprecation timeline for old versions.</li>
        </ul>
      </section>

      <section>
        <h2>Database Schema Migrations</h2>
        <p>
          Changing database schemas safely:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Expand-Contract Pattern</h3>
        <p>
          Two-phase migrations:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Expand:</strong> Add new column (nullable), deploy code that writes both.
          </li>
          <li>
            <strong>Migrate:</strong> Backfill old data to new column.
          </li>
          <li>
            <strong>Contract:</strong> Remove old column, deploy code that only uses new.
          </li>
        </ol>
        <p>
          <strong>Benefit:</strong> Zero-downtime migrations.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Migration Tools</h3>
        <ul>
          <li>
            <strong>Flyway:</strong> Versioned SQL migrations.
          </li>
          <li>
            <strong>Liquibase:</strong> XML/YAML/SQL migrations.
          </li>
          <li>
            <strong>DbMate:</strong> Simple SQL migrations.
          </li>
          <li>
            <strong>ORM migrations:</strong> Django, Rails, Prisma.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Migration Best Practices</h3>
        <ul>
          <li>Test migrations on production-sized data.</li>
          <li>Use transactions where possible.</li>
          <li>Have rollback plan.</li>
          <li>Monitor during migration.</li>
          <li>Large tables: batch migrations.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. How do you handle schema evolution in a microservices architecture with multiple teams?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Schema registry:</strong> Central registry (Confluent Schema Registry) for all schemas. Enforce compatibility rules.</li>
                <li><strong>Compatibility rules:</strong> Backward compatible by default. Breaking changes require new version.</li>
                <li><strong>Versioning:</strong> Semantic versioning for schemas (major.minor.patch). Major = breaking, minor = new fields, patch = fixes.</li>
                <li><strong>Expand-Contract:</strong> (1) Add new field (expand). (2) Deploy writers + readers. (3) Remove old field (contract).</li>
                <li><strong>Communication:</strong> Schema change notifications via Slack/email. Deprecation timeline (90 days minimum).</li>
                <li><strong>Testing:</strong> Automated compatibility tests in CI. Block incompatible schema changes.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Explain backward vs forward compatibility. When is each important?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Backward compatibility:</strong> New schema can read old data. ✓ Most common requirement. Example: Adding optional field.</li>
                <li><strong>Forward compatibility:</strong> Old schema can read new data. ✓ Important for gradual rollouts. Example: Ignoring unknown fields.</li>
                <li><strong>Full compatibility:</strong> Both backward and forward. ✓ Safest but most restrictive.</li>
                <li><strong>When backward:</strong> Database migrations, event consumers (new consumer reads old events).</li>
                <li><strong>When forward:</strong> Gradual service rollouts (old service receives new events during rollout).</li>
                <li><strong>Best practice:</strong> Default to backward compatible. Use forward compatibility for gradual rollouts.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. How do you migrate a database table with 100M rows without downtime?
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
              4. What is a schema registry? When do you need one?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Schema registry:</strong> Central store for schemas. Validates compatibility. Provides versioning.</li>
                <li><strong>When you need one:</strong> (1) Multiple teams producing/consuming events. (2) Microservices with shared data contracts. (3) Event sourcing architectures.</li>
                <li><strong>Features:</strong> Compatibility checking, version history, schema evolution rules.</li>
                <li><strong>Tools:</strong> Confluent Schema Registry (Avro), AWS Glue Schema Registry, Protobuf registry.</li>
                <li><strong>When not needed:</strong> Single team, simple schemas, no schema evolution requirements.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. How do you handle breaking schema changes in an event-driven system?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Avoid breaking changes:</strong> Add optional fields instead of removing. Rename by adding new field + deprecating old.</li>
                <li><strong>New topic + migration:</strong> (1) Create new topic with new schema. (2) Migrate consumers one by one. (3) Deprecate old topic.</li>
                <li><strong>Schema transformation:</strong> Transform old schema to new schema in streaming layer (Kafka Streams, Flink).</li>
                <li><strong>Versioned events:</strong> Include schema version in event. Consumers handle multiple versions.</li>
                <li><strong>Best practice:</strong> Design schemas for evolution. Assume schema will change. Use optional fields liberally.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. Compare Avro, Protobuf, and JSON Schema for schema evolution.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Avro:</strong> ✓ Compact binary format, excellent schema evolution, requires schema registry. ✗ Less human-readable, Java-centric.</li>
                <li><strong>Protobuf:</strong> ✓ Compact binary, strong typing, good tooling. ✗ Requires compilation, less flexible than Avro.</li>
                <li><strong>JSON Schema:</strong> ✓ Human-readable, widely supported, no compilation. ✗ Larger payload, weaker evolution guarantees.</li>
                <li><strong>Use Avro when:</strong> Kafka-based event streaming, need strong evolution guarantees.</li>
                <li><strong>Use Protobuf when:</strong> gRPC services, need strong typing across languages.</li>
                <li><strong>Use JSON Schema when:</strong> REST APIs, need human-readable schemas, web-based systems.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Schema Governance Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Schema registry implemented (if using events/microservices)</li>
          <li>✓ Compatibility rules defined (backward, forward, full)</li>
          <li>✓ Schema versioning in place</li>
          <li>✓ Migration tooling configured</li>
          <li>✓ Expand-contract pattern for breaking changes</li>
          <li>✓ Migration testing procedures</li>
          <li>✓ Rollback procedures documented</li>
          <li>✓ Schema documentation maintained</li>
          <li>✓ Deprecation policy for old schema versions</li>
          <li>✓ Schema change review process</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
