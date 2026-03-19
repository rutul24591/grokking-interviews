"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-versioning-backward-compatibility-extensive",
  title: "Versioning & Backward Compatibility",
  description: "Comprehensive guide to API versioning, schema evolution, backward compatibility strategies, deprecation policies, and migration patterns for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "versioning-backward-compatibility",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "versioning", "api", "backward-compatibility", "deprecation", "migration"],
  relatedTopics: ["api-versioning", "schema-governance", "change-management"],
};

export default function VersioningBackwardCompatibilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Versioning & Backward Compatibility</strong> encompasses the strategies and practices
          for evolving systems without breaking existing clients. In distributed systems, you cannot
          control when clients upgrade — they may lag weeks, months, or even years behind. Backward
          compatibility ensures old clients continue working as the system evolves.
        </p>
        <p>
          Versioning applies to APIs, data schemas, message formats, configuration, and protocols. Each
          has different considerations but shares the core principle: changes should not break existing
          consumers without explicit migration.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/versioning-api-strategies.svg"
          alt="API Versioning Strategies"
          caption="API Versioning — comparing URL, Header, and Query Parameter versioning with lifecycle timeline"
        />
        <p>
          Versioning applies to APIs, data schemas, message formats, configuration, and protocols. Each
          has different considerations but shares the core principle: changes should not break existing
          consumers without explicit migration.
        </p>
        <p>
          <strong>Key principles:</strong>
        </p>
        <ul>
          <li><strong>Backward Compatible:</strong> New version works with old clients.</li>
          <li><strong>Forward Compatible:</strong> Old version can handle new data (gracefully ignores unknown fields).</li>
          <li><strong>Explicit Deprecation:</strong> Clear timeline for removing old versions.</li>
          <li><strong>Migration Support:</strong> Tools and documentation for upgrading.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Compatibility Is a Contract</h3>
          <p>
            Every API, schema, or interface is a contract with consumers. Breaking changes violate that
            contract. Versioning allows you to evolve the contract while honoring existing commitments.
          </p>
        </div>
      </section>

      <section>
        <h2>API Versioning Strategies</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">URL Versioning</h3>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
{`GET /api/v1/users
GET /api/v2/users`}
        </pre>
        <p><strong>Pros:</strong> Clear, cacheable, easy to route. <strong>Cons:</strong> URL pollution, not RESTful.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Header Versioning</h3>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
{`Accept: application/vnd.api.v1+json
Accept: application/vnd.api.v2+json`}
        </pre>
        <p><strong>Pros:</strong> Clean URLs, RESTful. <strong>Cons:</strong> Less visible, harder to test.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Query Parameter Versioning</h3>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
{`GET /api/users?version=1
GET /api/users?version=2`}
        </pre>
        <p><strong>Pros:</strong> Easy to test. <strong>Cons:</strong> Cache issues, not RESTful.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Content Negotiation</h3>
        <p>Use Accept headers with media type versioning (most RESTful but complex).</p>
      </section>

      <section>
        <h2>Schema Evolution</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Compatible Changes</h3>
        <ul>
          <li><strong>Add Optional Field:</strong> Safe if clients ignore unknown fields.</li>
          <li><strong>Add Enum Value:</strong> Safe if clients handle unknown values.</li>
          <li><strong>Deprecate Field:</strong> Mark deprecated, don&apos;t remove immediately.</li>
          <li><strong>Widen Type:</strong> int32 → int64 is safe.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Breaking Changes</h3>
        <ul>
          <li><strong>Remove Field:</strong> Breaks clients reading that field.</li>
          <li><strong>Rename Field:</strong> Breaks all clients.</li>
          <li><strong>Change Type:</strong> int → string breaks parsing.</li>
          <li><strong>Change Semantics:</strong> Same field, different meaning.</li>
          <li><strong>Add Required Field:</strong> Old clients can&apos;t provide it.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Schema Registry</h3>
        <p>Use schema registry (Confluent, AWS Glue) to track compatibility:</p>
        <ul>
          <li><strong>Backward:</strong> New schema reads old data.</li>
          <li><strong>Forward:</strong> Old schema reads new data.</li>
          <li><strong>Full:</strong> Both backward and forward compatible.</li>
        </ul>
      </section>

      <section>
        <h2>Deprecation Policy</h2>
        <p>
          Clear process for retiring old versions:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Announce Deprecation:</strong> 6-12 months notice minimum.</li>
          <li><strong>Document Migration:</strong> Clear upgrade guide with examples.</li>
          <li><strong>Monitor Usage:</strong> Track which clients still use old version.</li>
          <li><strong>Direct Outreach:</strong> Contact remaining users before shutdown.</li>
          <li><strong>Grace Period:</strong> Return warnings in headers before hard cutoff.</li>
          <li><strong>Shutdown:</strong> Return 410 Gone with migration docs.</li>
        </ol>
      </section>

      <section>
        <h2>Migration Patterns</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Parallel Run</h3>
        <p>Run old and new versions simultaneously during migration.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Strangler Fig</h3>
        <p>Gradually migrate functionality, routing traffic incrementally.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Expansion-Contract</h3>
        <p>Add new field, migrate data, remove old field (two deployments).</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Shadow Mode</h3>
        <p>Run new version in parallel, compare results before switching.</p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What makes a change backward compatible?</p>
            <p className="mt-2 text-sm">
              A: Adding optional fields, adding enum values (if unknown handled), deprecating without
              removing, widening types. Breaking changes: removing fields, renaming, changing types,
              adding required fields, changing semantics.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you deprecate an API version?</p>
            <p className="mt-2 text-sm">
              A: Announce 6-12 months ahead, document migration path, add deprecation headers to responses,
              monitor usage, contact remaining users, provide grace period with warnings, then return 410
              Gone with migration docs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What API versioning strategy would you choose?</p>
            <p className="mt-2 text-sm">
              A: URL versioning for clarity and cacheability in public APIs. Header versioning for internal
              APIs where RESTful design matters. Query params for quick testing. Consistency matters more
              than the specific choice.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle schema evolution in event-driven systems?</p>
            <p className="mt-2 text-sm">
              A: Use schema registry with compatibility checks. Make additive changes only (new optional
              fields). Consumers should ignore unknown fields. For breaking changes, use new topic/version
              and migrate consumers gradually.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
