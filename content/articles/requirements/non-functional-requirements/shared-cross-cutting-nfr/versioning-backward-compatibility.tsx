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
          control when clients upgrade—they may lag weeks, months, or even years behind. Backward
          compatibility ensures old clients continue working as the system evolves.
        </p>
        <p>
          Versioning applies to APIs, data schemas, message formats, configuration, and protocols. Each
          has different considerations but shares the core principle: changes should not break existing
          consumers without explicit migration. For staff and principal engineers, versioning strategy is
          a critical architectural concern—the decisions you make about API versioning, schema evolution,
          and deprecation directly impact developer experience, system evolution, and operational complexity.
        </p>
        <p>
          The fundamental challenge is balancing evolution with stability. Systems must evolve to add
          features, fix issues, and improve performance. But every change risks breaking existing
          integrations. Versioning provides a structured approach to manage this tension.
        </p>
        <p>
          <strong>Key principles:</strong>
        </p>
        <ul>
          <li><strong>Backward Compatible:</strong> New version works with old clients (new server, old client).</li>
          <li><strong>Forward Compatible:</strong> Old version can handle new data by gracefully ignoring unknown fields.</li>
          <li><strong>Explicit Deprecation:</strong> Clear timeline and communication for removing old versions.</li>
          <li><strong>Migration Support:</strong> Tools, documentation, and support for upgrading.</li>
          <li><strong>Version Discovery:</strong> Clients can discover available versions and capabilities.</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/dependency-version-strategy.svg"
          alt="Version Strategy comparison showing different approaches"
          caption="Version Strategy: Comparing semantic versioning, calendar versioning, and sequential versioning with their use cases and trade-offs."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Compatibility Is a Contract</h3>
          <p>
            Every API, schema, or interface is a contract with consumers. Breaking changes violate that
            contract. Versioning allows you to evolve the contract while honoring existing commitments.
            Treat versioning as a first-class concern, not an afterthought.
          </p>
        </div>
      </section>

      <section>
        <h2>API Versioning Strategies</h2>
        <p>
          API versioning determines how clients specify which version of an API they want to use. Different
          strategies have different trade-offs for discoverability, cacheability, and REST compliance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">URL Versioning</h3>
        <p>
          Version is part of the URL path. Most common and straightforward approach.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Examples</h4>
        <ul>
          <li><code className="mx-1 rounded bg-panel-soft px-1">GET /api/v1/users</code></li>
          <li><code className="mx-1 rounded bg-panel-soft px-1">GET /api/v2/users</code></li>
          <li><code className="mx-1 rounded bg-panel-soft px-1">POST /api/v1/orders</code></li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Pros</h4>
        <ul>
          <li><strong>Clear and explicit:</strong> Version is visible in URL, easy to understand</li>
          <li><strong>Cacheable:</strong> Different URLs cache separately</li>
          <li><strong>Easy to route:</strong> Load balancers can route by URL pattern</li>
          <li><strong>Easy to test:</strong> Can test multiple versions simultaneously</li>
          <li><strong>Browser-friendly:</strong> Works in browser address bar</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Cons</h4>
        <ul>
          <li><strong>URL pollution:</strong> Version in every URL</li>
          <li><strong>Not RESTful:</strong> REST says version shouldn&apos;t be in URL (resource should be same)</li>
          <li><strong>Resource duplication:</strong> Same resource has multiple URLs</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Public APIs (Stripe, Twitter, GitHub use this)</li>
          <li>When cacheability is important</li>
          <li>When simplicity is valued over REST purity</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Header Versioning</h3>
        <p>
          Version specified in HTTP headers, keeping URLs clean.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Examples</h4>
        <ul>
          <li><code className="mx-1 rounded bg-panel-soft px-1">Accept: application/vnd.api.v1+json</code></li>
          <li><code className="mx-1 rounded bg-panel-soft px-1">Accept: application/vnd.api.v2+json</code></li>
          <li><code className="mx-1 rounded bg-panel-soft px-1">X-API-Version: 1</code></li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Pros</h4>
        <ul>
          <li><strong>Clean URLs:</strong> Resource URLs don&apos;t change with version</li>
          <li><strong>RESTful:</strong> Aligns with REST content negotiation</li>
          <li><strong>Content negotiation:</strong> Can negotiate version, format, locale together</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Cons</h4>
        <ul>
          <li><strong>Less visible:</strong> Version hidden in headers, harder to see</li>
          <li><strong>Harder to test:</strong> Need tools to set headers</li>
          <li><strong>Cache complexity:</strong> Cache must vary by header</li>
          <li><strong>Browser limitations:</strong> Can&apos;t easily test in browser</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Internal APIs where RESTful design matters</li>
          <li>When URL cleanliness is important</li>
          <li>APIs with complex content negotiation</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Query Parameter Versioning</h3>
        <p>
          Version specified as query parameter.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Examples</h4>
        <ul>
          <li><code className="mx-1 rounded bg-panel-soft px-1">GET /api/users?version=1</code></li>
          <li><code className="mx-1 rounded bg-panel-soft px-1">GET /api/users?v=2</code></li>
          <li><code className="mx-1 rounded bg-panel-soft px-1">GET /api/users?api-version=2023-01-01</code></li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Pros</h4>
        <ul>
          <li><strong>Easy to test:</strong> Can test in browser</li>
          <li><strong>Optional:</strong> Default version if not specified</li>
          <li><strong>Flexible:</strong> Can version individual endpoints</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Cons</h4>
        <ul>
          <li><strong>Cache issues:</strong> Some caches ignore query params</li>
          <li><strong>Not RESTful:</strong> Query params should filter, not version</li>
          <li><strong>URL pollution:</strong> Version in every URL</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Quick testing and experimentation</li>
          <li>When you want optional versioning</li>
          <li>Internal tools and dashboards</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Content Negotiation (Media Type Versioning)</h3>
        <p>
          Most RESTful approach—version is part of the media type in Accept header.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Examples</h4>
        <ul>
          <li><code className="mx-1 rounded bg-panel-soft px-1">Accept: application/vnd.company.resource+json;version=1</code></li>
          <li><code className="mx-1 rounded bg-panel-soft px-1">Accept: application/vnd.company.user-v2+json</code></li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Pros</h4>
        <ul>
          <li><strong>Most RESTful:</strong> Follows HTTP content negotiation</li>
          <li><strong>Clean URLs:</strong> Resource URLs never change</li>
          <li><strong>Granular:</strong> Can version individual resources differently</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Cons</h4>
        <ul>
          <li><strong>Complex:</strong> Harder to implement and document</li>
          <li><strong>Less visible:</strong> Version hidden in headers</li>
          <li><strong>Tool support:</strong> Some tools don&apos;t handle complex Accept headers well</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Date-Based Versioning</h3>
        <p>
          Version by date (often used with header or query parameter). Common in cloud APIs.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Examples</h4>
        <ul>
          <li><code className="mx-1 rounded bg-panel-soft px-1">X-API-Version: 2023-01-01</code></li>
          <li><code className="mx-1 rounded bg-panel-soft px-1">GET /api/users?api-version=2023-06-15</code></li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Pros</h4>
        <ul>
          <li><strong>Clear timeline:</strong> Date indicates when version was released</li>
          <li><strong>Automatic ordering:</strong> Dates are naturally ordered</li>
          <li><strong>Deprecation clarity:</strong> &quot;Versions older than 1 year&quot; is clear</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Cons</h4>
        <ul>
          <li><strong>Arbitrary dates:</strong> What date do you use for minor changes?</li>
          <li><strong>Not semantic:</strong> Doesn&apos;t convey breaking vs non-breaking</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Cloud provider APIs (AWS, Azure use this)</li>
          <li>When you release on regular cadence</li>
          <li>Regulated industries with compliance timelines</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/documentation-hierarchy.svg"
          alt="API Versioning Lifecycle showing version progression"
          caption="API Versioning Lifecycle: From current (v2) through deprecated (v1) to sunset, with deprecation timeline and migration windows."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Choose Based on Your Context</h3>
          <p>
            There&apos;s no universally best versioning strategy. URL versioning is most common for public
            APIs (Stripe, GitHub, Twitter use it). Header versioning is more RESTful but less visible.
            Choose based on your audience, tooling, and operational needs. Consistency matters more than
            the specific choice.
          </p>
        </div>
      </section>

      <section>
        <h2>Schema Evolution</h2>
        <p>
          Schema evolution addresses how to change data structures (API responses, database schemas,
          message formats) without breaking existing consumers. This is critical for long-lived systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compatible Changes</h3>
        <p>
          These changes can be made without breaking existing consumers:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Add Optional Field</h4>
        <p>
          Adding a new field that&apos;s optional (has default or can be null) is safe if clients ignore
          unknown fields.
        </p>
        <p><strong>Example:</strong> Adding <code className="mx-1 rounded bg-panel-soft px-1">middle_name</code> to a User object.</p>
        <p><strong>Requirement:</strong> Clients must ignore unknown fields (forward compatibility).</p>

        <h4 className="mt-4 mb-2 font-semibold">Add Enum Value</h4>
        <p>
          Adding new values to an enum is safe if clients handle unknown values gracefully.
        </p>
        <p><strong>Example:</strong> Adding &quot;PREMIUM&quot; to a SubscriptionTier enum.</p>
        <p><strong>Requirement:</strong> Clients must handle unknown enum values (default behavior or error gracefully).</p>

        <h4 className="mt-4 mb-2 font-semibold">Deprecate Field</h4>
        <p>
          Marking a field as deprecated (but not removing it) is safe. Clients have time to migrate.
        </p>
        <p><strong>Example:</strong> Mark <code className="mx-1 rounded bg-panel-soft px-1">phone_number</code> as deprecated, add <code className="mx-1 rounded bg-panel-soft px-1">phones[]</code> array.</p>
        <p><strong>Requirement:</strong> Keep deprecated field functional during deprecation period.</p>

        <h4 className="mt-4 mb-2 font-semibold">Widen Type</h4>
        <p>
          Changing from narrower to wider type is safe (int32 → int64, float32 → float64).
        </p>
        <p><strong>Example:</strong> Changing <code className="mx-1 rounded bg-panel-soft px-1">age</code> from int32 to int64.</p>
        <p><strong>Requirement:</strong> Clients must handle wider type (usually automatic).</p>

        <h4 className="mt-4 mb-2 font-semibold">Add Optional Parameter</h4>
        <p>
          Adding optional query parameters or request fields is safe.
        </p>
        <p><strong>Example:</strong> Adding <code className="mx-1 rounded bg-panel-soft px-1">?include=metadata</code> to API endpoint.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Breaking Changes</h3>
        <p>
          These changes break existing consumers and require version bump:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Remove Field</h4>
        <p>
          Removing a field breaks any client that reads it.
        </p>
        <p><strong>Example:</strong> Removing <code className="mx-1 rounded bg-panel-soft px-1">legacy_id</code> from response.</p>
        <p><strong>Solution:</strong> Deprecate first, remove in next major version.</p>

        <h4 className="mt-4 mb-2 font-semibold">Rename Field</h4>
        <p>
          Renaming breaks all clients using the old name.
        </p>
        <p><strong>Example:</strong> Renaming <code className="mx-1 rounded bg-panel-soft px-1">userName</code> to <code className="mx-1 rounded bg-panel-soft px-1">username</code>.</p>
        <p><strong>Solution:</strong> Add new field, deprecate old, remove old in next version.</p>

        <h4 className="mt-4 mb-2 font-semibold">Change Type</h4>
        <p>
          Changing field type breaks parsing.
        </p>
        <p><strong>Example:</strong> Changing <code className="mx-1 rounded bg-panel-soft px-1">price</code> from number to string.</p>
        <p><strong>Solution:</strong> Add new field with new type, deprecate old.</p>

        <h4 className="mt-4 mb-2 font-semibold">Change Semantics</h4>
        <p>
          Changing what a field means breaks clients relying on old behavior.
        </p>
        <p><strong>Example:</strong> <code className="mx-1 rounded bg-panel-soft px-1">status</code> changes from boolean to enum.</p>
        <p><strong>Solution:</strong> New field with new semantics, deprecate old.</p>

        <h4 className="mt-4 mb-2 font-semibold">Add Required Field</h4>
        <p>
          Adding required field breaks old clients that don&apos;t provide it.
        </p>
        <p><strong>Example:</strong> Making <code className="mx-1 rounded bg-panel-soft px-1">email</code> required when it was optional.</p>
        <p><strong>Solution:</strong> Add as optional first, make required in next version with validation.</p>

        <h4 className="mt-4 mb-2 font-semibold">Change Validation Rules</h4>
        <p>
          Stricter validation breaks clients that previously succeeded.
        </p>
        <p><strong>Example:</strong> Email validation becomes stricter.</p>
        <p><strong>Solution:</strong> Grace period with warnings, then enforce.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Schema Registry</h3>
        <p>
          Schema registry tracks schema versions and enforces compatibility rules:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Compatibility Levels</h4>
        <ul>
          <li><strong>Backward:</strong> New schema can read old data. Most common for event streaming.</li>
          <li><strong>Forward:</strong> Old schema can read new data. Consumers updated before producers.</li>
          <li><strong>Full:</strong> Both backward and forward compatible. Most restrictive.</li>
          <li><strong>None:</strong> No compatibility checking. Not recommended for production.</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Tools</h4>
        <ul>
          <li><strong>Confluent Schema Registry:</strong> For Apache Kafka, supports Avro, Protobuf, JSON Schema.</li>
          <li><strong>AWS Glue Schema Registry:</strong> For AWS, supports Avro, JSON Schema.</li>
          <li><strong>ProtoBuf:</strong> Built-in schema evolution support.</li>
          <li><strong>JSON Schema:</strong> Validation with evolution support.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Design for Evolution</h3>
          <p>
            Design schemas expecting change. Use optional fields, ignore unknown fields, avoid required
            fields unless truly necessary. This makes future evolution easier without breaking changes.
          </p>
        </div>
      </section>

      <section>
        <h2>Deprecation Policy</h2>
        <p>
          A clear deprecation policy manages the lifecycle of old versions. Without it, you accumulate
          technical debt supporting ancient versions indefinitely.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Deprecation Timeline</h3>
        <p>
          Typical timeline for API deprecation:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Phase 1: Announcement (Month 0)</h4>
        <ul>
          <li>Public announcement via blog, email, dashboard notifications</li>
          <li>Update documentation with deprecation notice</li>
          <li>Specify sunset date (6-12 months minimum)</li>
          <li>Provide migration guide with examples</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Phase 2: Warning Period (Months 1-6)</h4>
        <ul>
          <li>Add deprecation headers to API responses</li>
          <li>Log usage of deprecated version</li>
          <li>Send reminder emails to active users</li>
          <li>Offer migration support (office hours, documentation)</li>
        </ul>
        <p>
          Example deprecation headers: <code className="mx-1 rounded bg-panel-soft px-1">Deprecation: sunsetting on 2026-12-31</code>,
          <code className="mx-1 rounded bg-panel-soft px-1">Sunset: 2026-12-31</code>, and
          <code className="mx-1 rounded bg-panel-soft px-1">Link: &lt;https://docs.example.com/migration&gt;; rel=&quot;deprecation&quot;</code>.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Phase 3: Direct Outreach (Months 6-11)</h4>
        <ul>
          <li>Identify remaining active users of deprecated version</li>
          <li>Direct contact (email, calls) to understand blockers</li>
          <li>Offer dedicated migration support</li>
          <li>Document common migration issues</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Phase 4: Grace Period (Month 12)</h4>
        <ul>
          <li>Return warnings in every response</li>
          <li>Consider rate limiting deprecated version</li>
          <li>Final reminder communications</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Phase 5: Sunset (Month 12+)</h4>
        <ul>
          <li>Return HTTP 410 (Gone) for deprecated version</li>
          <li>Include migration documentation in response</li>
          <li>Keep redirect/compatibility layer for critical users (optional)</li>
          <li>Monitor for unexpected impact</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Deprecation Best Practices</h3>
        <ul>
          <li><strong>Minimum 6 months:</strong> Enterprise customers need time for their release cycles.</li>
          <li><strong>Clear communication:</strong> Multiple channels, multiple reminders.</li>
          <li><strong>Migration guide:</strong> Step-by-step with code examples.</li>
          <li><strong>Track usage:</strong> Know who&apos;s using deprecated version.</li>
          <li><strong>Understand blockers:</strong> Some users may have legitimate reasons to delay.</li>
          <li><strong>Be flexible:</strong> Consider extensions for enterprise customers.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Deprecation Is a Service</h3>
          <p>
            Deprecation isn&apos;t just about removing old code—it&apos;s about helping users migrate.
            Invest in migration tooling, documentation, and support. Happy migrating users become loyal
            customers.
          </p>
        </div>
      </section>

      <section>
        <h2>Migration Patterns</h2>
        <p>
          Migration patterns help transition from old to new versions with minimal disruption.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Parallel Run</h3>
        <p>
          Run old and new versions simultaneously during migration period.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Implementation</h4>
        <ul>
          <li>Deploy both versions side-by-side</li>
          <li>Route traffic based on client version preference</li>
          <li>Monitor both versions for issues</li>
          <li>Gradually shift traffic to new version</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Major version migrations</li>
          <li>When rollback must be instant</li>
          <li>High-traffic, business-critical APIs</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Strangler Fig Pattern</h3>
        <p>
          Gradually migrate functionality piece by piece, routing traffic incrementally.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Implementation</h4>
        <ul>
          <li>Identify migration units (endpoints, features)</li>
          <li>Migrate one unit at a time</li>
          <li>Route traffic for that unit to new version</li>
          <li>Repeat until all units migrated</li>
          <li>Remove old version</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Large, complex migrations</li>
          <li>Monolith to microservices</li>
          <li>When you can&apos;t migrate all at once</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Expansion-Contract Pattern</h3>
        <p>
          Two-phase migration: add new, then remove old.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Implementation</h4>
        <ol>
          <li><strong>Expand:</strong> Add new field/endpoint alongside old</li>
          <li><strong>Migrate:</strong> Update producers to write both, consumers to read new</li>
          <li><strong>Contract:</strong> Remove old field/endpoint</li>
        </ol>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Database schema changes</li>
          <li>Field renames</li>
          <li>Type changes</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Shadow Mode</h3>
        <p>
          Run new version in parallel, compare results before switching traffic.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Implementation</h4>
        <ul>
          <li>Send production traffic to both versions</li>
          <li>Compare responses for discrepancies</li>
          <li>Fix issues in new version</li>
          <li>When confident, switch traffic</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Algorithm changes</li>
          <li>Database migrations</li>
          <li>When correctness is critical</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Adapter/Translation Layer</h3>
        <p>
          Build translation layer that converts between old and new formats.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Implementation</h4>
        <ul>
          <li>Old clients send requests in old format</li>
          <li>Adapter translates to new format</li>
          <li>New system processes</li>
          <li>Adapter translates response back to old format</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>When you can&apos;t update all clients</li>
          <li>Long-tail of legacy clients</li>
          <li>Acquired systems with different APIs</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Plan Migration Before Breaking</h3>
          <p>
            Before introducing a breaking change, plan the migration path. How will clients migrate?
            What tooling can you provide? Can you make it incremental? Migration planning should happen
            before the breaking change is made, not after.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/dependency-version-strategy.svg"
          alt="Version Strategy comparison showing different approaches"
          caption="Version Strategy: Comparing semantic versioning, calendar versioning, and sequential versioning with their use cases and trade-offs."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">API Design</h3>
        <ul>
          <li>Design for backward compatibility from the start</li>
          <li>Use optional fields, avoid required unless necessary</li>
          <li>Design clients to ignore unknown fields</li>
          <li>Use semantic versioning (MAJOR.MINOR.PATCH)</li>
          <li>Document versioning strategy clearly</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Version Management</h3>
        <ul>
          <li>Support limited number of versions (2-3 concurrent)</li>
          <li>Clear deprecation timeline (6-12 months minimum)</li>
          <li>Track version usage metrics</li>
          <li>Automate version sunset where possible</li>
          <li>Document all versions and their differences</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Communication</h3>
        <ul>
          <li>Announce deprecations via multiple channels</li>
          <li>Provide clear migration guides with examples</li>
          <li>Include deprecation headers in responses</li>
          <li>Offer migration support (documentation, office hours)</li>
          <li>Be responsive to migration blockers</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing</h3>
        <ul>
          <li>Test all supported versions in CI/CD</li>
          <li>Include backward compatibility tests</li>
          <li>Test migration paths</li>
          <li>Automate deprecation warnings in tests</li>
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
            <strong>Not testing failover:</strong> Assume redundancy works without testing. Fix:
            Regular DR tests.
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
            <p className="font-semibold">Q: What makes a change backward compatible?</p>
            <p className="mt-2 text-sm">
              A: Adding optional fields, adding enum values (if unknown handled), deprecating without
              removing, widening types (int32 to int64). Breaking changes: removing fields, renaming,
              changing types, adding required fields, changing semantics. Design schemas expecting change.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you deprecate an API version?</p>
            <p className="mt-2 text-sm">
              A: Announce 6-12 months ahead via blog, email, docs. Document migration path with examples.
              Add deprecation headers to responses (Deprecation, Sunset headers). Monitor usage, contact
              remaining users directly. Provide grace period with warnings. Return 410 Gone with migration
              docs at sunset.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What API versioning strategy would you choose?</p>
            <p className="mt-2 text-sm">
              A: URL versioning for public APIs—clear, cacheable, easy to route (Stripe, GitHub use it).
              Header versioning for internal APIs where RESTful design matters. Query params for quick
              testing. Date-based for cloud APIs. Consistency matters more than specific choice. Document
              and stick with it.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle schema evolution in event-driven systems?</p>
            <p className="mt-2 text-sm">
              A: Use schema registry with compatibility checks (Confluent, AWS Glue). Make additive changes
              only (new optional fields). Consumers should ignore unknown fields. For breaking changes,
              use new topic/version and migrate consumers gradually. Test compatibility in CI.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle database migrations with zero downtime?</p>
            <p className="mt-2 text-sm">
              A: Expansion-contract pattern. Phase 1: Add new column alongside old (both written). Phase 2:
              Migrate reads to new column. Phase 3: Stop writing to old column. Phase 4: Remove old column.
              Use online migration tools for large tables. Test rollback at each phase.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How many versions should you support concurrently?</p>
            <p className="mt-2 text-sm">
              A: Typically 2-3 versions. Current version, previous version (for migration), maybe one more
              for enterprise customers with long cycles. More than 3 becomes operational burden. Clear
              deprecation policy helps limit versions.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>Semantic Versioning: <a href="https://semver.org" className="text-accent hover:underline">semver.org</a></li>
          <li>Stripe API Versioning: Stripe&apos;s approach to API versioning</li>
          <li>GitHub API Versioning: <a href="https://docs.github.com/en/rest" className="text-accent hover:underline">docs.github.com</a></li>
          <li>Microsoft REST API Guidelines: Versioning best practices</li>
          <li>Confluent Schema Registry: Schema evolution for Kafka</li>
          <li>&quot;Designing Data-Intensive Applications&quot; by Martin Kleppmann</li>
          <li>&quot;Building Microservices&quot; by Sam Newman</li>
          <li>AWS API Versioning Best Practices</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
