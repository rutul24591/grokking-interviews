"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-api-versioning-extensive",
  title: "API Versioning",
  description:
    "Comprehensive guide to API versioning strategies, covering URL vs header versioning, backward compatibility, deprecation policies, and migration patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "api-versioning",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-16",
  tags: [
    "backend",
    "nfr",
    "api",
    "versioning",
    "compatibility",
    "deprecation",
    "migration",
  ],
  relatedTopics: [
    "rate-limiting-abuse-protection",
    "scalability-strategy",
    "fault-tolerance-resilience",
  ],
};

export default function APIVersioningArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>API Versioning</strong> is the practice of managing changes to
          APIs while maintaining compatibility with existing clients. As APIs
          evolve, breaking changes are sometimes necessary. Versioning allows
          these changes without disrupting existing integrations.
        </p>
        <p>
          <strong>Breaking changes</strong> require version bumps: removing
          fields, changing types, modifying behavior.{" "}
          <strong>Non-breaking changes</strong> (adding fields, new endpoints)
          don&apos;t require version changes.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">
            Key Insight: Versioning is a Contract
          </h3>
          <p>
            An API is a contract with clients. Breaking that contract without
            warning erodes trust. Versioning, deprecation notices, and migration
            support maintain that trust while allowing evolution.
          </p>
        </div>
      </section>

      <section>
        <h2>API Versioning in Practice</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/api-versioning-practice.svg"
          alt="API Versioning Implementation"
          caption="API Versioning Practice — showing URL path versioning example, header versioning flow, breaking vs non-breaking changes, and deprecation timeline"
        />
        <p>Real-world API versioning implementation:</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          URL Path Versioning Example
        </h3>
        <p>Most common approach for public APIs:</p>
        <ul>
          <li>/api/v1/users - Legacy clients</li>
          <li>/api/v2/users - New clients with updated schema</li>
          <li>API router directs traffic based on version prefix</li>
        </ul>
        <p>
          <strong>Benefits:</strong> Clear, cacheable, easy to test and debug.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Header Versioning Flow
        </h3>
        <p>For REST-purists and internal APIs:</p>
        <ul>
          <li>Client sends X-API-Version: 2 header</li>
          <li>Server routes to appropriate handler</li>
          <li>Same URL, different behavior based on header</li>
        </ul>
        <p>
          <strong>Benefits:</strong> Clean URLs, REST-compliant.
          <strong>Trade-offs:</strong> Less visible, harder to test in browser.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Managing Breaking Changes
        </h3>
        <p>Breaking changes require new major version:</p>
        <ul>
          <li>Removing fields or endpoints</li>
          <li>Changing field types</li>
          <li>Changing authentication mechanisms</li>
        </ul>
        <p>Non-breaking changes can be made within same version:</p>
        <ul>
          <li>Adding optional fields</li>
          <li>Adding new endpoints</li>
          <li>Adding new query parameters</li>
        </ul>
      </section>

      <section>
        <h2>Versioning Strategies</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/api-versioning.svg"
          alt="API Versioning Strategies"
          caption="API Versioning — showing versioning approaches (URL, Header, Accept, Query Param), deprecation timeline, backward compatible changes, and migration strategies"
        />
        <p>Several approaches to API versioning:</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">URL Versioning</h3>
        <p>
          Include version in URL path: <code>/api/v1/users</code>,{" "}
          <code>/api/v2/users</code>
        </p>
        <p>
          <strong>Pros:</strong> Clear, cacheable, easy to test, visible in
          logs.
        </p>
        <p>
          <strong>Cons:</strong> URL pollution, violates REST principles (URL
          should identify resource, not version).
        </p>
        <p>
          <strong>Best for:</strong> Public APIs, major version changes.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Header Versioning</h3>
        <p>
          Use custom header: <code>Accept-Version: v2</code> or{" "}
          <code>X-API-Version: 2</code>
        </p>
        <p>
          <strong>Pros:</strong> Clean URLs, REST-compliant.
        </p>
        <p>
          <strong>Cons:</strong> Less visible, harder to test in browser,
          caching complexity.
        </p>
        <p>
          <strong>Best for:</strong> Internal APIs, API-first companies.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Content Negotiation</h3>
        <p>
          Use Accept header with media type version:{" "}
          <code>Accept: application/vnd.company.v2+json</code>
        </p>
        <p>
          <strong>Pros:</strong> REST-compliant, standard mechanism.
        </p>
        <p>
          <strong>Cons:</strong> Verbose, less intuitive.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Query Parameter Versioning
        </h3>
        <p>
          <code>/api/users?version=2</code>
        </p>
        <p>
          <strong>Pros:</strong> Easy to implement, visible.
        </p>
        <p>
          <strong>Cons:</strong> Caching issues, not REST-compliant.
        </p>
        <p>
          <strong>Recommendation:</strong> Avoid for public APIs.
        </p>
      </section>

      <section>
        <h2>Backward Compatibility</h2>
        <p>
          Maintain backward compatibility when possible to avoid version bumps:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compatible Changes</h3>
        <ul>
          <li>✓ Adding new endpoints.</li>
          <li>✓ Adding optional fields to responses.</li>
          <li>✓ Adding optional query parameters.</li>
          <li>✓ Extending enums (adding values).</li>
          <li>✓ Adding new HTTP methods to existing endpoints.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Breaking Changes</h3>
        <ul>
          <li>✗ Removing endpoints or fields.</li>
          <li>✗ Changing field types.</li>
          <li>✗ Renaming fields or endpoints.</li>
          <li>✗ Changing authentication mechanisms.</li>
          <li>✗ Modifying error response formats.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Strangler Pattern for API Migration
        </h3>
        <p>Gradually migrate from v1 to v2:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Build v2 alongside v1.</li>
          <li>Route new clients to v2.</li>
          <li>Migrate existing clients gradually.</li>
          <li>Deprecate v1 with timeline.</li>
          <li>Remove v1 after migration complete.</li>
        </ol>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design an API versioning strategy for a public API with 10,000
              developers. What approach do you choose?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <strong>Versioning strategy:</strong> URL versioning
                  (api.example.com/v1/resource). Clear, explicit, easy to
                  understand.
                </li>
                <li>
                  <strong>Deprecation policy:</strong> 12 months notice before
                  sunset. Email notifications at 12, 6, 3, 1 months.
                </li>
                <li>
                  <strong>Documentation:</strong> Versioned docs
                  (docs.example.com/v1/, /v2/). Migration guides between
                  versions.
                </li>
                <li>
                  <strong>Monitoring:</strong> Track usage per version. Identify
                  clients still on deprecated versions. Proactive outreach.
                </li>
                <li>
                  <strong>Backward compatibility:</strong> Non-breaking changes
                  within major version. Breaking changes = new major version.
                </li>
                <li>
                  <strong>Tooling:</strong> SDK generation for each version.
                  Postman collections. OpenAPI specs per version.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Compare URL versioning vs header versioning. What are the
              trade-offs?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <strong>URL versioning (api/v1/resource):</strong> ✓ Clear,
                  explicit, cacheable, debuggable. ✗ URL pollution, REST purists
                  object.
                </li>
                <li>
                  <strong>
                    Header versioning (Accept: application/vnd.api.v1+json):
                  </strong>{" "}
                  ✓ Clean URLs, RESTful. ✗ Harder to debug, caching complexity,
                  less discoverable.
                </li>
                <li>
                  <strong>Query param (?version=1):</strong> ✓ Easy to test. ✗
                  Can be forgotten, caching issues.
                </li>
                <li>
                  <strong>Recommendation:</strong> URL versioning for public
                  APIs (clarity over purity). Header versioning for internal
                  APIs (if REST purity matters).
                </li>
                <li>
                  <strong>Industry standard:</strong> Most public APIs use URL
                  versioning (Stripe, GitHub, Twilio).
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. You need to remove a field from your API response. How do you
              handle this without breaking clients?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <strong>Deprecation phase (3-6 months):</strong> (1) Mark
                  field as deprecated in docs. (2) Add deprecation warning in
                  response headers. (3) Notify API consumers.
                </li>
                <li>
                  <strong>Transition phase (6-12 months):</strong> (1) Field
                  still returned but documented as deprecated. (2) Provide
                  migration guide to new field/endpoint.
                </li>
                <li>
                  <strong>Removal phase:</strong> (1) Remove field in new major
                  version. (2) Keep old version running for stragglers. (3)
                  Sunset old version after migration period.
                </li>
                <li>
                  <strong>Best practice:</strong> Add new field instead of
                  removing. Old field becomes alias. Eventually deprecate alias.
                </li>
                <li>
                  <strong>Communication:</strong> Changelog, email
                  notifications, dashboard warnings for deprecated field usage.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Design a deprecation policy for your API. How do you
              communicate and enforce deprecation?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <strong>Deprecation timeline:</strong> (1) Announce
                  deprecation (12 months before sunset). (2) Warning headers in
                  responses. (3) Sunset date in docs.
                </li>
                <li>
                  <strong>Communication:</strong> Email at 12, 6, 3, 1 months.
                  Dashboard warnings. Changelog entries. Blog posts for major
                  changes.
                </li>
                <li>
                  <strong>Enforcement:</strong> (1) Return 410 Gone after sunset
                  date. (2) Grace period (30 days) with warnings. (3) Hard
                  cutoff after grace period.
                </li>
                <li>
                  <strong>Monitoring:</strong> Track deprecated endpoint usage.
                  Proactive outreach to heavy users before sunset.
                </li>
                <li>
                  <strong>Exceptions:</strong> Enterprise customers may get
                  extended sunset (contractual). Document exceptions clearly.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. How do you handle a critical security fix that requires a
              breaking change?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <strong>Immediate fix:</strong> Deploy security fix to all
                  versions. Security takes priority over versioning.
                </li>
                <li>
                  <strong>If breaking change required:</strong> (1) Deploy fix
                  with backward compatibility layer. (2) Announce deprecation of
                  old behavior. (3) Timeline for removal (30-90 days for
                  security).
                </li>
                <li>
                  <strong>Communication:</strong> Security advisory (not
                  detailed public post). Direct outreach to API consumers.
                  Emergency migration guide.
                </li>
                <li>
                  <strong>Enforcement:</strong> Shorter deprecation window for
                  security (30-90 days vs 12 months). May force upgrade.
                </li>
                <li>
                  <strong>Best practice:</strong> Design APIs with security in
                  mind. Avoid breaking changes for security by using extensible
                  patterns.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. Your v1 API has 1000 active clients. How do you migrate them to
              v2?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <strong>Announcement:</strong> Announce v2 with benefits (new
                  features, better performance). Provide migration guide.
                </li>
                <li>
                  <strong>Incentives:</strong> v2-only features. Better rate
                  limits for v2. Deprecation timeline for v1.
                </li>
                <li>
                  <strong>Monitoring:</strong> Track v1 vs v2 usage. Identify
                  top v1 users. Proactive outreach.
                </li>
                <li>
                  <strong>Support:</strong> Dedicated migration support for
                  enterprise customers. Office hours for questions.
                </li>
                <li>
                  <strong>Timeline:</strong> 12 months for migration. Warnings
                  at 12, 6, 3, 1 months. Sunset v1 after 12 months.
                </li>
                <li>
                  <strong>Enforcement:</strong> After sunset, return 410 Gone
                  for v1. Keep v1 running for emergency exceptions (30 days).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>API Versioning Checklist</h2>
        <ul className="space-y-2">
          <li>
            ✓ Selected versioning strategy (URL, header, content negotiation)
          </li>
          <li>✓ Documented versioning approach for API consumers</li>
          <li>✓ Defined breaking vs non-breaking changes</li>
          <li>✓ Deprecation policy documented (timeline, communication)</li>
          <li>✓ Version routing implemented</li>
          <li>✓ Monitoring per API version</li>
          <li>✓ Automated compatibility testing</li>
          <li>✓ Migration guides for major versions</li>
          <li>✓ Sunset headers for deprecated versions</li>
          <li>✓ Usage analytics to track version adoption</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
