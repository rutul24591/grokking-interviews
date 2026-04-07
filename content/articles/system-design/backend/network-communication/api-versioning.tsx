"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-api-versioning-complete",
  title: "API Versioning",
  description:
    "Comprehensive guide to API versioning strategies: URI path, query parameters, headers, content negotiation, backward compatibility, deprecation, and production-scale version management.",
  category: "backend",
  subcategory: "network-communication",
  slug: "api-versioning",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-04",
  tags: ["backend", "api-versioning", "backward-compatibility", "deprecation", "content-negotiation"],
  relatedTopics: [
    "api-gateway-pattern",
    "grpc",
    "graphql",
    "throttling-rate-limiting",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/network-communication";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>API Versioning</h1>
        <p className="lead">
          API versioning is the practice of managing changes to an API in a way that allows
          existing clients to continue functioning while new clients can take advantage of updated
          functionality. Every API evolves: fields are added, removed, or renamed; business rules
          change; new endpoints are introduced; and error responses are refined. Without versioning,
          any change to the API risks breaking existing clients that depend on the previous behavior.
          Versioning provides a structured mechanism for introducing changes while maintaining
          backward compatibility and giving clients time to migrate.
        </p>

        <p>
          Consider a payments API with an endpoint <code className="inline-code">POST /charges</code>
          that accepts a JSON body with <code className="inline-code">amount</code> and
          <code className="inline-code">currency</code> fields. A business requirement emerges to
          support installment payments, requiring an <code className="inline-code">installments</code>
          object in the request body. If the API simply adds this optional field, existing clients
          continue to work (backward compatible). But if the API changes the response format—say,
          splitting a single <code className="inline-code">amount</code> field into
          <code className="inline-code">principal</code> and <code className="inline-code">fee</code>
          fields—existing clients that expect a single <code className="inline-code">amount</code>
          field will break. This is where versioning becomes essential: the new response format
          is exposed as <code className="inline-code">/v2/charges</code>, while the original
          format remains at <code className="inline-code">/v1/charges</code> for existing clients.
        </p>

        <p>
          API versioning strategies fall into several categories: URI path versioning
          (<code className="inline-code">/v1/resource</code>), query parameter versioning
          (<code className="inline-code">/resource?version=1</code>), header versioning
          (<code className="inline-code">Api-Version: 1</code>), and content negotiation
          (<code className="inline-code">Accept: application/vnd.example.v1+json</code>).
          Each strategy has trade-offs in terms of discoverability, cacheability, and
          implementation complexity. The choice of versioning strategy affects how clients
          discover available versions, how CDNs cache responses, and how the API gateway
          routes requests to backend implementations.
        </p>

        <p>
          This article provides a comprehensive examination of API versioning: versioning
          strategies (URI path, query parameters, headers, content negotiation), backward
          compatibility principles, deprecation lifecycle management, semantic versioning for
          APIs, production-scale version management (supporting multiple versions simultaneously),
          and real-world examples from Stripe, GitHub, and Twitter. We will also cover common
          pitfalls (version explosion, tight coupling, documentation drift) and best practices
          for maintaining multiple API versions at scale.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/api-versioning-strategies.svg`}
          caption="Figure 1: API Versioning Strategies showing four approaches. URI Path: /v1/users, /v2/users — simple, cacheable, but exposes version in URL. Query Parameter: /users?version=1 — flexible, but not cacheable by default. Header-based: Api-Version: 1 — clean URLs, but harder to discover. Content Negotiation: Accept: application/vnd.example.v1+json — RESTful, but complex to implement. Each strategy has trade-offs in discoverability, cacheability, and implementation complexity."
          alt="API versioning strategies comparison"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Versioning Strategies</h2>

        <h3>URI Path Versioning</h3>
        <p>
          URI path versioning is the most common and widely understood versioning strategy. The
          version identifier is embedded in the URL path:
          <code className="inline-code">/v1/users</code>,
          <code className="inline-code">/v2/users</code>. This approach is highly discoverable:
          developers can see the version directly in the URL. It is also cacheable: CDNs and
          browsers treat <code className="inline-code">/v1/users</code> and
          <code className="inline-code">/v2/users</code> as separate resources, so each version
          can be cached independently.
        </p>

        <p>
          However, URI path versioning has drawbacks. It violates the REST principle that URLs
          should identify resources, not versions of resources. It also creates a coupling between
          the URL structure and the API version: if a client is hardcoded to use
          <code className="inline-code">/v1/users</code>, it must be updated to use
          <code className="inline-code">/v2/users</code> when migrating. This is not inherently
          bad—explicit version migration is often desirable—but it means that the version is
          visible and mutable by clients, which can lead to version pinning and delayed migrations.
        </p>

        <h3>Query Parameter Versioning</h3>
        <p>
          Query parameter versioning appends the version as a query string parameter:
          <code className="inline-code">/users?version=1</code> or
          <code className="inline-code">/users?v=2</code>. This approach keeps the base URL
          clean and allows clients to switch versions by changing a single parameter. It is also
          easy to implement: the API gateway or routing layer reads the query parameter and routes
          to the appropriate backend implementation.
        </p>

        <p>
          The primary drawback is cacheability. Many CDNs and caching proxies do not cache URLs
          with query parameters by default, or they treat each unique query string as a separate
          cache entry. This means that <code className="inline-code">/users?version=1</code> and
          <code className="inline-code">/users?version=2</code> may not share a cache, even if
          the response bodies are identical. Additionally, query parameter versioning is less
          discoverable than URI path versioning: the version is not visible at a glance in the URL.
        </p>

        <h3>Header-Based Versioning</h3>
        <p>
          Header-based versioning communicates the version through a custom request header:
          <code className="inline-code">Api-Version: 2</code> or
          <code className="inline-code">X-Api-Version: v2</code>. This approach keeps URLs clean
          and version-agnostic: the same URL serves different versions based on the request header.
          It also separates the version concern from the resource identifier, aligning more closely
          with REST principles.
        </p>

        <p>
          The drawback is discoverability. Developers cannot see the version in the URL, so they
          must read documentation or inspect request headers to understand which version they are
          using. Header-based versioning is also harder to test in a browser (you need a tool like
          curl or Postman to set custom headers) and harder to debug (the version is not visible
          in browser developer tools without inspecting the request headers).
        </p>

        <h3>Content Negotiation (Accept Header)</h3>
        <p>
          Content negotiation uses the HTTP <code className="inline-code">Accept</code> header to
          specify the version:
          <code className="inline-code">Accept: application/vnd.example.v1+json</code> or
          <code className="inline-code">Accept: application/vnd.example.v2+json</code>. This is
          the most RESTful approach because it uses the standard HTTP mechanism for content
          negotiation. The version is communicated as part of the media type, allowing the server
          to serve different representations of the same resource based on the client&apos;s
          preferences.
        </p>

        <p>
          Content negotiation is the most complex to implement. The server must parse the
          <code className="inline-code">Accept</code> header, match it against available versions,
          and return the appropriate representation. It also requires clients to understand media
          type negotiation, which is less common in API development than URI-based versioning.
          However, for organizations that prioritize RESTful design and media type-driven evolution,
          content negotiation is the preferred approach.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/api-versioning-lifecycle.svg`}
          caption="Figure 2: API Version Lifecycle showing four phases: Introduction (v3 released, v2 becomes active), Active (recommended for new integrations, full support), Deprecated (Sunset header returned, existing clients supported, new clients discouraged), Sunset (version removed, requests rejected). Timeline example: v1 introduced Jan 2022, deprecated Jan 2024, sunset Jul 2024. v2 introduced Jan 2023, active Jan 2024, deprecated Jan 2025. v3 introduced Jan 2024, active Jul 2024. Each version overlaps with adjacent versions for 12-24 months to allow migration."
          alt="API version lifecycle timeline"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation Patterns</h2>

        <h3>Backward Compatibility Principles</h3>
        <p>
          The foundation of effective API versioning is backward compatibility: changes to an
          existing version should not break existing clients. This means that additive changes
          (adding optional fields, adding new endpoints, adding new enum values) are always safe,
          while breaking changes (removing fields, renaming fields, changing field types, removing
          endpoints) require a new version.
        </p>

        <p>
          The key principle is to make every change additive whenever possible. Instead of removing
          a field, mark it as deprecated and continue to return it alongside the new field. Instead
          of changing a field type, introduce a new field with the new type and deprecate the old
          field. Instead of removing an endpoint, return a deprecation warning in the response
          headers and document the replacement endpoint. This approach allows clients to migrate
          at their own pace while the API continues to evolve.
        </p>

        <h3>Version Routing at the Gateway</h3>
        <p>
          In a production API gateway, version routing determines which backend implementation
          handles a request based on the version identifier. The gateway maintains a routing table
          that maps version identifiers to backend service endpoints:
          <code className="inline-code">v1</code> →
          <code className="inline-code"> users-service-v1:8080</code>,
          <code className="inline-code">v2</code> →
          <code className="inline-code">users-service-v2:8080</code>. When a request arrives,
          the gateway extracts the version (from the URL path, query parameter, header, or
          Accept header), looks up the corresponding backend, and forwards the request.
        </p>

        <p>
          The gateway also enforces version lifecycle policies: it rejects requests to deprecated
          versions that have passed their sunset date, returns deprecation warnings in response
          headers for versions approaching deprecation, and logs version usage metrics to track
          migration progress. This centralized version management ensures consistent enforcement
          across all endpoints and services.
        </p>

        <h3>Deprecation Lifecycle</h3>
        <p>
          Every API version follows a lifecycle: introduction (new version released), active
          (recommended version for new integrations), deprecated (existing clients supported,
          new clients discouraged), and sunset (version removed). The transition from active to
          deprecated is triggered by the release of a new version. The transition from deprecated
          to sunset is triggered by a deprecation window (typically 12-24 months) that gives
          clients sufficient time to migrate.
        </p>

        <p>
          During the deprecated phase, the API returns a
          <code className="inline-code">Sunset</code> header with the date when the version will
          be removed, and a <code className="inline-code">Deprecation</code> header with the date
          when the version was deprecated. The API also returns a
          <code className="inline-code">Link</code> header pointing to the documentation for the
          replacement version. This machine-readable deprecation information allows clients to
          programmatically detect deprecation status and plan migrations.
        </p>

        <h3>Supporting Multiple Versions Simultaneously</h3>
        <p>
          At scale, an API may support three to five versions simultaneously. Each version has
          its own backend implementation (or shared implementation with version-specific branches),
          its own documentation, its own test suite, and its own deprecation timeline. The
          operational overhead of supporting multiple versions is significant: bug fixes must be
          backported to all supported versions, security patches must be applied to all versions,
          and documentation must be maintained for each version.
        </p>

        <p>
          To manage this overhead, organizations implement version consolidation strategies. When
          a version approaches its sunset date, the organization runs a migration campaign:
          identifying clients still using the deprecated version, contacting the client owners,
          providing migration guides and support, and monitoring migration progress. The goal is
          to migrate all clients before the sunset date so that the version can be decommissioned
          without breaking any client integrations.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/api-versioning-tradeoffs.svg`}
          caption="Figure 3: API Versioning Trade-offs comparing versioning strategies across dimensions. URI Path: high discoverability, high cacheability, low RESTful purity, low implementation complexity. Query Parameter: medium discoverability, low cacheability, medium RESTful purity, low complexity. Header-based: low discoverability, medium cacheability, high RESTful purity, medium complexity. Content Negotiation: low discoverability, medium cacheability, high RESTful purity, high complexity. Decision matrix helps teams choose based on their API audience and requirements."
          alt="API versioning trade-offs comparison"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <p>
          Choosing a versioning strategy involves trade-offs between discoverability, cacheability,
          RESTful purity, and implementation complexity. URI path versioning is the most discoverable
          and cacheable but least RESTful. Content negotiation is the most RESTful but least
          discoverable and most complex. Query parameter versioning and header-based versioning
          fall in between.
        </p>

        <p>
          The choice should be driven by the API&apos;s audience and usage patterns. For public
          APIs consumed by external developers, discoverability and cacheability are paramount:
          URI path versioning is the pragmatic choice. For internal APIs consumed by services
          within the organization, RESTful purity and URL cleanliness may take priority:
          header-based or content negotiation versioning is more appropriate.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for API Versioning</h2>

        <p>
          <strong>Prefer additive changes over breaking changes.</strong> Whenever possible, make
          changes that are backward compatible: add optional fields, add new endpoints, add new
          enum values, widen numeric ranges. Avoid removing fields, renaming fields, changing
          field types, or removing endpoints. If a breaking change is unavoidable, introduce a
          new version and maintain the old version during the deprecation window.
        </p>

        <p>
          <strong>Set clear deprecation timelines.</strong> When releasing a new version, immediately
          announce the deprecation date for the previous version (typically 12-24 months in the
          future). This gives clients a clear migration deadline and prevents indefinite version
          sprawl. Communicate the deprecation timeline prominently in documentation, response
          headers, and developer communications.
        </p>

        <p>
          <strong>Return deprecation metadata in responses.</strong> Include
          <code className="inline-code">Deprecation</code>, <code className="inline-code">Sunset</code>,
          and <code className="inline-code">Link</code> headers in responses from deprecated
          versions. This allows clients to detect deprecation programmatically and plan migrations
          without reading documentation. Log deprecation header exposure to track which clients
          are seeing deprecation warnings.
        </p>

        <p>
          <strong>Version at the resource level, not the API level.</strong> Instead of versioning
          the entire API (<code className="inline-code">/v1/...</code>, <code className="inline-code">/v2/...</code>),
          version individual resources when possible
          (<code className="inline-code">/users/v1</code>, <code className="inline-code">/users/v2</code>).
          This allows different resources to evolve at different paces: the users resource may be
          on v3 while the orders resource is on v1. This reduces the blast radius of version
          changes and allows teams to version independently.
        </p>

        <p>
          <strong>Maintain comprehensive version documentation.</strong> Each API version should
          have its own documentation with a changelog documenting every change from the previous
          version. Include migration guides that walk clients through the steps needed to migrate
          from the deprecated version to the current version. Provide code examples in multiple
          languages showing the before and after patterns.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Version explosion.</strong> Supporting too many versions simultaneously creates
          operational overhead: each version requires its own backend, test suite, documentation,
          and bug fix backporting. The fix is to enforce strict deprecation timelines (12-24 months)
          and actively manage version consolidation. Run migration campaigns to move clients off
          deprecated versions before the sunset date. Monitor version usage metrics and prioritize
          migration support for high-volume clients.
        </p>

        <p>
          <strong>Tight coupling between versions.</strong> When version-specific implementations
          share code through conditional branches (if version == v1, do X; else do Y), the codebase
          becomes increasingly complex with each new version. The fix is to maintain separate
          codebases or modules for each major version, with shared libraries for common logic.
          This allows each version to evolve independently without introducing version-specific
          conditionals throughout the codebase.
        </p>

        <p>
          <strong>Documentation drift.</strong> As API versions evolve, documentation for older
          versions can become stale, leading to confusion for clients still using deprecated
          versions. The fix is to version documentation alongside the API: each version has its
          own documentation site or section that is frozen when the version is deprecated.
          Automated documentation generation from API specifications (OpenAPI, GraphQL schema)
          ensures that documentation stays in sync with implementation.
        </p>

        <p>
          <strong>Inconsistent versioning across endpoints.</strong> When different endpoints in
          the same API use different versioning strategies (some use URI path, some use headers),
          client integration becomes confusing and error-prone. The fix is to enforce a consistent
          versioning strategy across all endpoints in the API. Document the chosen strategy
          prominently and provide client SDKs that abstract away version management.
        </p>

        <p>
          <strong>Breaking changes within a version.</strong> Making breaking changes to an
          existing version (removing a field from v1, changing a response format in v2) breaks
          the trust that clients place in version stability. The fix is to treat versioned APIs
          as immutable contracts: once a version is released, it does not change except for bug
          fixes. All new functionality goes into a new version. This discipline ensures that
          clients can rely on version stability and plan migrations with confidence.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Stripe: URI Path Versioning with Date-Based Versions</h3>
        <p>
          Stripe uses date-based versioning in the URI path:
          <code className="inline-code">/v1/charges</code> with a
          <code className="inline-code">Stripe-Version</code> header specifying the API version
          date (e.g., <code className="inline-code">2023-10-16</code>). This hybrid approach
          combines the discoverability of URI versioning with the precision of date-based versioning.
          Stripe releases API changes on a regular cadence, and each release is identified by its
          release date rather than a sequential version number. This allows Stripe to communicate
          exactly which changes are included in each version and allows clients to pin to a specific
          date.
        </p>

        <h3>GitHub: URI Path Versioning with Preview Headers</h3>
        <p>
          GitHub API v3 uses URI path versioning for the stable API
          (<code className="inline-code">/api/v3</code>), while preview features are exposed
          through custom Accept headers
          (<code className="inline-code">Accept: application/vnd.github.baptiste-preview+json</code>).
          This allows GitHub to release new features as previews before they are promoted to the
          stable API. Preview features can change based on feedback without requiring a new version
          number, and once stabilized, they are incorporated into the next stable API release.
        </p>

        <h3>Twitter: Content Negotiation for API Evolution</h3>
        <p>
          Twitter&apos;s API uses content negotiation for versioning, with media types such as
          <code className="inline-code">application/vnd.twitter.v1+json</code> for the stable
          API and
          <code className="inline-code">application/vnd.twitter.v2+json</code> for the newer
          version. This approach allows Twitter to evolve the API while maintaining clean URLs
          and RESTful semantics. Twitter v2 was a significant redesign of the API, with new
          endpoints, response formats, and authentication mechanisms, and the content negotiation
          approach allowed both versions to coexist during the multi-year migration period.
        </p>
      </section>

      {/* Section 8: Interview Questions */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q1: What are the different API versioning strategies, and when would you use each?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> The main API versioning strategies are: URI path versioning
              (/v1/resource) — most discoverable and cacheable, best for public APIs consumed by
              external developers. Query parameter versioning (/resource?version=1) — flexible but
              less cacheable, useful when URL structure must remain version-agnostic. Header-based
              versioning (Api-Version: 1) — clean URLs, harder to discover, good for internal APIs.
              Content negotiation (Accept: application/vnd.example.v1+json) — most RESTful, most
              complex, best for organizations prioritizing RESTful design. The choice depends on
              the API&apos;s audience: public APIs favor discoverability (URI path), while internal
              APIs favor clean URLs (header-based or content negotiation).
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q2: How do you handle a breaking change in an API without creating a new version?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> The best approach is to avoid breaking changes within a
              version. Instead, make additive changes: add a new field alongside the old field
              (both return the same data), add a new endpoint alongside the old endpoint, or add
              a new optional parameter that changes behavior when present. If a breaking change is
              absolutely necessary, use feature flags to expose the new behavior only to clients
              that opt in (via a request header or query parameter), while maintaining the default
              behavior for existing clients. This allows gradual migration without requiring a full
              version bump.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q3: How would you design a deprecation strategy for an API version?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> A deprecation strategy involves: (1) Announcing the
              deprecation date when the new version is released (typically 12-24 months in the
              future). (2) Returning deprecation headers (Deprecation, Sunset, Link) in all
              responses from the deprecated version. (3) Publishing migration documentation with
              before/after examples and step-by-step guides. (4) Running a migration campaign:
              identifying clients using the deprecated version, contacting them directly, providing
              migration support, and tracking progress. (5) Enforcing the sunset date: rejecting
              requests to the deprecated version after the sunset date, with a clear error message
              pointing to the replacement version.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q4: How do you manage backward compatibility when evolving an API schema?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Backward compatibility means that changes to the API do not
              break existing clients. The rules are: (1) Adding optional fields is safe — existing
              clients that don&apos;t send them continue to work. (2) Adding new endpoints is safe
              — existing clients that don&apos;t call them are unaffected. (3) Removing fields is
              breaking — existing clients that read them will fail. (4) Renaming fields is breaking
              — existing clients that send the old field name will fail. (5) Changing field types
              is breaking — existing clients that parse the old type will fail. The strategy is to
              make every change additive: add new fields alongside old ones, deprecate old fields
              with warnings, and only remove them in a new version after the deprecation window.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q5: How would you handle versioning for a GraphQL API compared to a REST API?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> GraphQL has a fundamentally different versioning model than
              REST. In GraphQL, the schema is the contract, and clients request exactly the fields
              they need. This means additive changes (adding fields, adding types, adding enum
              values) are always backward compatible — clients that don&apos;t request the new
              fields are unaffected. Breaking changes (removing fields, changing field types,
              removing types) still require a migration strategy, but the impact is narrower than
              REST because clients only receive the fields they explicitly request. GraphQL APIs
              typically use schema evolution rather than version numbering: deprecated fields are
              marked with @deprecated directives, and clients are notified through introspection
              queries about deprecated fields they are using. Versioning in GraphQL is more
              granular and client-specific than REST versioning.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q6: Your API supports three versions simultaneously, and version v1 has a security vulnerability. How do you handle it?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Security patches must be applied to all supported versions,
              regardless of deprecation status. The fix is backported to v1, v2, and v3
              simultaneously, with the same security patch logic adapted to each version&apos;s
              implementation. If the v1 codebase has diverged significantly from v2 and v3, the
              patch is implemented independently in each version&apos;s codebase and tested against
              each version&apos;s test suite. Additionally, v1 clients should be accelerated through
              the deprecation pipeline: communicate the security vulnerability to v1 clients,
              provide migration support to move them to v2 or v3, and consider shortening the
              sunset date for v1 if the vulnerability cannot be adequately patched in the v1
              codebase. The key principle is that security takes priority over version lifecycle
              management.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://stripe.com/docs/api/versioning"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe Documentation — API Versioning
            </a>
          </li>
          <li>
            <a
              href="https://docs.github.com/en/rest/overview/api-versions"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Documentation — API Versions
            </a>
          </li>
          <li>
            <a
              href="https://datatracker.ietf.org/doc/html/rfc7231"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 7231 — HTTP/1.1 Semantics and Content (Content Negotiation)
            </a>
          </li>
          <li>
            <a
              href="https://jsonapi.org/recommendations/#versioning"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              JSON:API Recommendations — Versioning
            </a>
          </li>
          <li>
            <a
              href="https://apisyouwonthate.com/blog/api-versioning"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              APIs You Won&apos;t Hate — API Versioning Strategies
            </a>
          </li>
          <li>
            <a
              href="https://www.rfc-editor.org/rfc/rfc8594"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 8594 — The Sunset HTTP Header
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
