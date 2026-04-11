"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-api-versioning",
  title: "API Versioning",
  description: "Comprehensive guide to API versioning strategies — URL versioning, header versioning, semantic versioning, backward compatibility, deprecation patterns, and migration strategies for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "api-versioning",
  wordCount: 5800,
  readingTime: 25,
  lastUpdated: "2026-04-11",
  tags: ["backend", "nfr", "api-versioning", "backward-compatibility", "deprecation", "schema-evolution"],
  relatedTopics: ["schema-governance", "data-migration-strategy", "authentication-infrastructure", "latency-slas"],
};

export default function APIVersioningArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>API versioning</strong> is the practice of managing changes to an API over time while
          maintaining compatibility with existing consumers. Every API evolves — new fields are added,
          existing fields are renamed or removed, response structures change, and business logic updates
          alter behavior. Without a versioning strategy, changes break existing consumers. With a versioning
          strategy, changes are introduced gradually, giving consumers time to migrate at their own pace.
        </p>
        <p>
          API versioning is a non-functional requirement that directly impacts developer experience,
          deployment velocity, and system reliability. A poor versioning strategy forces all consumers to
          upgrade simultaneously (breaking changes), causing deployment coordination nightmares and outages.
          A good versioning strategy allows the API to evolve independently of its consumers — new versions
          are deployed alongside old versions, and consumers migrate when ready.
        </p>
        <p>
          For staff and principal engineer candidates, API versioning architecture demonstrates maturity in
          managing distributed system evolution. Interviewers expect you to articulate versioning strategies
          (URL, header, content negotiation), design backward-compatible changes, define deprecation
          lifecycles, implement migration tooling (codemods, compatibility layers), and manage the
          operational complexity of supporting multiple versions simultaneously.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Distinction: Breaking vs Non-Breaking Changes</h3>
          <p>
            <strong>Non-breaking changes</strong> are safe to deploy without versioning: adding optional fields,
            adding new endpoints, adding enum values, relaxing validation rules, and improving performance.
            <strong>Breaking changes</strong> require versioning: removing fields, renaming fields, changing field
            types, adding required fields, tightening validation rules, and altering error semantics.
          </p>
          <p className="mt-3">
            The golden rule: if a consumer built against the old API works correctly against the new API
            without changes, it is a non-breaking change. If the consumer fails, it is a breaking change.
          </p>
        </div>

        <p>
          API versioning is not just about technical implementation — it is about consumer trust. Every
          breaking change erodes trust. Every deprecation without adequate notice creates operational chaos.
          Every undocumented change causes integration failures. Mature API providers treat versioning as a
          product commitment, not an engineering convenience.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding API versioning requires grasping several foundational concepts about how APIs
          evolve and how consumers integrate with them.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Semantic Versioning for APIs</h3>
        <p>
          Semantic versioning (SemVer) uses MAJOR.MINOR.PATCH numbering. For APIs, a MAJOR version bump
          indicates breaking changes — consumers must update their integration code. A MINOR version bump
          indicates non-breaking additions — new endpoints, new optional fields — that consumers can adopt
          at their discretion. A PATCH version bump indicates bug fixes that do not change the API contract.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Versioning Strategies</h3>
        <p>
          There are three dominant approaches to communicating API versions to consumers. URL versioning
          embeds the version in the path (v1/users, v2/users). Header versioning communicates the version
          via a custom header (API-Version: 2024-01-01). Content negotiation uses the Accept header
          (application/vnd.api+json; version=2). Each approach has trade-offs in discoverability, caching,
          and operational complexity.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Deprecation Lifecycle</h3>
        <p>
          Every API version follows a lifecycle: active (fully supported, receives new features), deprecated
          (still functional but no new features, migration recommended), sunset (functional but will be
          removed on a specific date), and retired (no longer accessible). The transition between these
          stages is governed by a deprecation policy that gives consumers adequate time to migrate —
          typically 6-12 months for major versions.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          API versioning architecture spans version detection, routing, response transformation, and
          deprecation management. The architecture must support multiple versions simultaneously while
          minimizing code duplication and operational overhead.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/api-versioning-strategies.svg"
          alt="API Versioning Strategies"
          caption="API Versioning — comparing URL, header, and content negotiation versioning with their trade-offs"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Version Routing Architecture</h3>
        <p>
          When a request arrives at the API gateway, the version is extracted from the URL path, header, or
          Accept header. The router maps the version to the appropriate service implementation. For URL
          versioning, the router strips the version prefix and routes to the versioned service instance.
          For header versioning, the router reads the header and routes accordingly. For content negotiation,
          the router parses the Accept header and selects the appropriate response formatter.
        </p>
        <p>
          The service implementation should be version-agnostic where possible — the core business logic
          remains the same across versions, with version-specific adapters handling request parsing and
          response formatting. This minimizes code duplication and ensures that bug fixes in the core logic
          benefit all versions simultaneously.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Response Transformation Pipeline</h3>
        <p>
          When multiple API versions share the same core service, response transformation bridges the gap
          between versions. The service produces a canonical response (the latest version&apos;s format), and
          a transformation pipeline converts it to the requested version&apos;s format by removing new fields,
          renaming fields, or restructuring data. This approach — canonical model with version-specific
          transformers — is used by Stripe, GitHub, and other mature API providers.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/api-backward-compatibility.svg"
          alt="Backward Compatibility Patterns"
          caption="Backward Compatibility — showing additive changes, tolerance readers, and contract testing"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/api-deprecation-lifecycle.svg"
          alt="API Deprecation Lifecycle"
          caption="Deprecation Lifecycle — active → deprecated → sunset → retired, with migration tooling and communication"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-Offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Strategy</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>URL Versioning</strong></td>
              <td className="p-3">
                Simple and discoverable. Easy to test in browser. Works with all HTTP clients. CDN-friendly.
              </td>
              <td className="p-3">
                Pollutes URL namespace. Version baked into resource identity. Hard to switch versions dynamically.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Header Versioning</strong></td>
              <td className="p-3">
                Clean URLs. Version decoupled from resource identity. Easy to switch versions per request.
              </td>
              <td className="p-3">
                Harder to test in browser. Requires custom client configuration. CDN caching complications.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Content Negotiation</strong></td>
              <td className="p-3">
                Standards-based (HTTP Accept header). Semantically correct. Supports multiple content types.
              </td>
              <td className="p-3">
                Complex to implement. Limited tooling support. Confusing for API consumers unfamiliar with content negotiation.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Canonical Model + Transformers</strong></td>
              <td className="p-3">
                Single codebase for business logic. Bug fixes benefit all versions. Minimal code duplication.
              </td>
              <td className="p-3">
                Transformation overhead. Complex transformation rules for divergent versions. Testing all version combinations.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Prefer Additive Changes Over Breaking Changes</h3>
        <p>
          The best versioning strategy is the one you do not need. Design APIs to evolve additively — add
          new fields rather than renaming them, add new endpoints rather than changing existing ones, and
          make new fields optional with sensible defaults. This allows the API to evolve without forcing
          consumers to migrate, reducing operational complexity and maintaining consumer trust.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implement Tolerance Readers</h3>
        <p>
          Tolerance readers are response parsers that ignore unknown fields rather than failing. When a
          consumer built against v1 receives a v2 response with new fields, the tolerance reader discards
          the unknown fields and processes the known ones. This enables forward compatibility — consumers
          work correctly against newer API versions without any changes.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Provide Migration Tooling</h3>
        <p>
          When breaking changes are unavoidable, provide automated migration tooling. Codemods
          (jscodeshift scripts for JavaScript, ast transformers for other languages) automatically update
          consumer code to the new API. Compatibility shims provide a v1-compatible interface on top of the
          v2 implementation, giving consumers time to migrate. Detailed migration guides with before-and-after
          examples help consumers understand the changes.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Define a Clear Deprecation Policy</h3>
        <p>
          Publish a deprecation policy that specifies the lifecycle stages, timelines, and communication
          channels for API version changes. A typical policy: active versions receive new features and bug
          fixes for 18 months. Deprecated versions receive bug fixes only for 12 months. Sunset versions
          receive critical security fixes only for 6 months before retirement. Communicate deprecation
          through multiple channels: API response headers (Deprecation: true, Sunset: date), email
          notifications, and dashboard announcements.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Version Proliferation</h3>
        <p>
          Supporting too many API versions simultaneously creates operational overhead — each version needs
          testing, monitoring, documentation, and security patching. Set a maximum limit on concurrent
          versions (typically 2-3) and enforce a deprecation schedule that retires old versions on a
          predictable cadence. Communicate retirement dates well in advance (12+ months) and provide
          automated migration paths.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Breaking Changes Disguised as Non-Breaking</h3>
        <p>
          The most destructive pitfall is deploying a breaking change without a version bump. Renaming a
          field from user_name to username, changing a field type from string to number, or tightening
          validation rules all break consumers that depend on the old behavior. These changes must go
          through the versioning process — deploy as a new version, run both versions in parallel, and
          migrate consumers gradually.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Inadequate Deprecation Communication</h3>
        <p>
          Announcing a deprecation in release notes is not adequate communication. Consumers must be
          notified through multiple channels: API response headers on every deprecated endpoint, email
          notifications to registered API key owners, dashboard announcements, and direct outreach for
          high-volume consumers. Assume that most consumers will not read release notes and design
          notifications that reach them where they are.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Versioned Database Schemas</h3>
        <p>
          A common anti-pattern is creating database schemas that mirror API versions — a users_v1 table
          and a users_v2 table with different schemas. This creates data duplication, synchronization
          complexity, and query performance issues. Instead, use a single canonical schema that supports
          all API versions, with version-specific read/write adapters that translate between the canonical
          schema and the version-specific API contract.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stripe — Date-Based Versioning</h3>
        <p>
          Stripe uses date-based API versioning (2024-01-01, 2023-10-01) rather than numbered versions.
          Each version represents a point-in-time snapshot of the API&apos;s behavior. Consumers pin to a
          specific version and receive consistent behavior regardless of when Stripe deploys new changes.
          Stripe provides a migration dashboard that shows consumers exactly which API changes affect their
          pinned version, with before-and-after examples for each change. Their compatibility layer allows
          consumers to test against newer versions by passing a Stripe-Version header, enabling safe
          migration testing in production.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">GitHub — URL Versioning with Transformer Pipeline</h3>
        <p>
          GitHub&apos;s REST API uses URL versioning (/api/v3, /api/v4) with a canonical model and
          transformation pipeline. The core service produces the latest version&apos;s response, and
          version-specific transformers convert it to the requested version by removing new fields,
          renaming deprecated fields, and restructuring data. This allows GitHub to ship new features
          in the canonical model immediately while maintaining backward compatibility with older API
          versions. Their deprecation policy provides 12 months notice before retiring a version, with
          automated migration guides and codemods for common changes.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Twilio — Header Versioning with Forward Compatibility</h3>
        <p>
          Twilio uses header-based versioning (Twilio-API-Version) with forward compatibility built into
          all SDKs. Twilio&apos;s SDKs implement tolerance readers that ignore unknown fields, allowing
          consumers to upgrade SDKs without upgrading their API version pin. This means a consumer running
          against API version 2010-04-01 can upgrade to the latest SDK without breaking, because the SDK
          gracefully handles new fields in responses. Twilio&apos;s deprecation policy includes a 24-month
          sunset period — the longest in the industry — giving enterprise consumers ample time to migrate.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">AWS — Service-Level Versioning</h3>
        <p>
          AWS does not version its APIs at the platform level — each AWS service manages its own version
          independently. S3, EC2, Lambda, and DynamoDB each have their own API evolution timeline. This
          decentralized approach allows services to evolve at their own pace but creates complexity for
          consumers that use multiple services. AWS manages backward compatibility through additive changes
          — new parameters are always optional, new response fields are always additive, and existing
          behavior is never changed without a new API operation. This allows AWS to serve millions of
          consumers across decades of API evolution without forced migrations.
        </p>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          API versioning introduces security risks that must be addressed to prevent exploitation during version transitions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Version-Related Vulnerabilities</h3>
          <ul className="space-y-2">
            <li>
              <strong>Deprecated Version Exploits:</strong> Old API versions may have known security vulnerabilities that are patched in newer versions but not backported. Mitigation: enforce deprecation timelines, apply security patches to all active versions, retire versions with unfixable vulnerabilities immediately with consumer notification.
            </li>
            <li>
              <strong>Version Downgrade Attacks:</strong> Attackers may force requests to older, less-secure API versions to exploit known vulnerabilities. Mitigation: require minimum API version, reject requests to retired versions, monitor version usage patterns for anomalies, implement version-specific rate limiting.
            </li>
            <li>
              <strong>Transformation Layer Injection:</strong> Response transformers that process version-specific data may be vulnerable to injection attacks if they process untrusted input. Mitigation: sanitize data before transformation, use safe serialization libraries, validate transformer outputs against version schemas.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authentication Across Versions</h3>
          <ul className="space-y-2">
            <li>
              <strong>Token Compatibility:</strong> Authentication tokens issued for v1 must work with v2 (and vice versa during migration). Mitigation: use version-agnostic token formats (JWT with version-independent claims), implement token validation that accepts all active API versions.
            </li>
            <li>
              <strong>Permission Model Changes:</strong> New API versions may introduce new permission scopes that old versions do not understand. Mitigation: maintain backward-compatible permission models, grant new permissions to existing tokens during migration, validate permissions against the requested API version.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Data Exposure During Migration</h3>
          <ul className="space-y-2">
            <li>
              <strong>Schema Divergence:</strong> During migration, the same data may be exposed differently across API versions (v1 exposes email, v2 does not). Consumers accessing both versions may receive inconsistent data. Mitigation: document schema differences between versions, ensure consistent authorization checks across all versions, audit data access patterns during migration windows.
            </li>
            <li>
              <strong>Migration Tool Trust:</strong> Consumers must trust automated migration tools (codemods) to not introduce security regressions. Mitigation: open-source migration tools, provide detailed change logs, allow consumers to review generated code before deployment.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Testing Strategies */}
      <section>
        <h2>Testing Strategies</h2>
        <p>
          API versioning must be validated through systematic testing — version-specific behavior, transformation correctness, and migration paths must all be verified.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Version-Specific Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Per-Version Contract Tests:</strong> Test each API version against its own schema. Verify that v1 responses conform to the v1 schema, v2 responses conform to the v2 schema, and so on. Tools: OpenAPI validation, JSON Schema validation, Pact contract testing.
            </li>
            <li>
              <strong>Cross-Version Compatibility Tests:</strong> Verify that a consumer built against v1 works correctly against v2 (forward compatibility). Test that tolerance readers handle unknown fields, that default values are sensible, and that deprecated fields still function.
            </li>
            <li>
              <strong>Transformation Pipeline Tests:</strong> Test the response transformers that convert canonical responses to version-specific formats. Verify that field renames, removals, and restructuring are correct for each target version. Test with edge cases (empty responses, large payloads, nested structures).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Migration Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Codemod Testing:</strong> Test automated migration tools against a representative sample of consumer codebases. Verify that the codemod produces correct code, preserves existing behavior, and handles edge cases (custom request logic, error handling, pagination).
            </li>
            <li>
              <strong>Dual-Version Testing:</strong> Run consumer integration tests against both the old and new API versions simultaneously. Verify that the consumer produces correct results against both versions. This is the most reliable way to validate migration correctness before deploying to production.
            </li>
            <li>
              <strong>Deprecation Communication Testing:</strong> Verify that deprecation headers (Deprecation: true, Sunset: date) are present in all deprecated endpoint responses. Test that email notifications are sent to all registered API key owners. Verify that the migration dashboard accurately reflects the consumer&apos;s version and migration status.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">API Versioning Readiness Checklist</h3>
          <ul className="space-y-2">
            <li>✓ Versioning strategy chosen and documented (URL, header, or content negotiation)</li>
            <li>✓ Breaking vs non-breaking change classification defined and enforced</li>
            <li>✓ Deprecation policy published with clear timelines and communication channels</li>
            <li>✓ Maximum concurrent versions limited (2-3) with enforcement mechanisms</li>
            <li>✓ Response transformation pipeline implemented for canonical model approach</li>
            <li>✓ Migration tooling (codemods, compatibility shims) provided for breaking changes</li>
            <li>✓ Per-version contract tests running in CI/CD pipeline</li>
            <li>✓ Cross-version compatibility tests validating forward compatibility</li>
            <li>✓ Deprecation headers (Deprecation, Sunset) implemented on all deprecated endpoints</li>
            <li>✓ Consumer communication channels established (email, dashboard, in-product notifications)</li>
          </ul>
        </div>
      </section>

      {/* Section 10: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://stripe.com/docs/api/versioning" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Stripe — API Versioning Documentation
            </a>
          </li>
          <li>
            <a href="https://docs.github.com/en/rest/overview/api-versions" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub — API Versioning Guide
            </a>
          </li>
          <li>
            <a href="https://semver.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Semantic Versioning 2.0.0 Specification
            </a>
          </li>
          <li>
            <a href="https://jsonapi.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              JSON:API — Content Negotiation and Versioning
            </a>
          </li>
          <li>
            <a href="https://www.twilio.com/docs/usage/api" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Twilio — API Versioning and Forward Compatibility
            </a>
          </li>
          <li>
            <a href="https://martinfowler.com/articles/enterpriseREST.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler — Building Evolvable REST APIs
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
