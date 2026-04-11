"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-versioning-backward-compatibility",
  title: "Versioning & Backward Compatibility",
  description:
    "Comprehensive guide to API versioning, schema evolution, backward compatibility strategies, deprecation policies, and migration patterns for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "versioning-backward-compatibility",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: [
    "nfr",
    "versioning",
    "api",
    "backward-compatibility",
    "deprecation",
    "migration",
    "schema-evolution",
  ],
  relatedTopics: ["api-design", "schema-governance", "change-management"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Versioning &amp; Backward Compatibility</strong> encompass the
          strategies and practices for evolving distributed systems without
          breaking existing clients. In any architecture where you do not control
          all consumers simultaneously — public APIs, mobile backends,
          microservice meshes, or event-driven pipelines — the ability to change
          system behavior while honoring existing contracts is a foundational
          architectural capability. Backward compatibility ensures that a newer
          server version continues to work correctly with older clients that have
          not yet upgraded. Forward compatibility ensures that older servers can
          gracefully handle requests from newer clients, typically by ignoring
          unknown fields.
        </p>
        <p>
          The fundamental challenge is balancing evolution with stability.
          Systems must evolve to add features, fix architectural flaws, improve
          performance, and respond to changing business requirements. Yet every
          change introduces risk: removing a field breaks clients that read it,
          changing a type breaks clients that parse it, tightening validation
          breaks clients that previously succeeded. Versioning provides a
          structured framework for managing this tension, allowing you to
          introduce breaking changes under a new version identifier while
          maintaining the old version for clients that have not migrated.
        </p>
        <p>
          For staff and principal engineers, versioning strategy is a critical
          architectural concern that affects developer experience, operational
          complexity, and long-term system maintainability. The decisions you
          make about API versioning mechanisms, schema evolution rules,
          deprecation timelines, and migration tooling directly shape how quickly
          your organization can innovate and how much technical debt accumulates
          from supporting legacy versions. A well-designed versioning strategy
          enables rapid evolution; a poor one locks you into supporting ancient
          interfaces indefinitely or forces disruptive breaking changes that
          damage consumer trust.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Versioning applies to multiple surface areas within a system. API
          versioning governs how clients specify which interface contract they
          expect. Schema versioning governs how data structures evolve in
          databases, message brokers, and configuration stores. Protocol
          versioning governs how communication formats change between services.
          Each area has its own considerations but shares the core principle that
          changes should not break existing consumers without an explicit,
          well-communicated migration path.
        </p>
        <p>
          Backward compatibility is the property that a new version of a system
          works correctly with clients built against an older version. When you
          deploy version 2 of an API, any client written for version 1 should
          continue to function without modification. This is achieved through
          additive changes — adding optional fields, adding new endpoints, adding
          enum values — and through compatibility layers that translate between
          old and new formats when breaking changes are unavoidable.
        </p>
        <p>
          Forward compatibility is the complementary property that an older
          version of a system can handle data from a newer version by gracefully
          ignoring elements it does not understand. This is typically achieved by
          designing clients to ignore unknown fields in responses, a behavior
          that must be explicitly implemented and tested. Without forward
          compatibility, a client built against version 1 would fail when it
          encounters a new field added in version 2, even if that field is
          irrelevant to the client&apos;s use case.
        </p>
        <p>
          Semantic versioning — the MAJOR.MINOR.PATCH convention — provides a
          widely understood vocabulary for communicating the nature of changes.
          A major version bump signals incompatible API changes, a minor version
          signals backward-compatible feature additions, and a patch signals
          backward-compatible bug fixes. While semantic versioning originated in
          library packaging, its concepts map directly to API versioning: major
          API versions represent incompatible contracts, minor versions represent
          additive enhancements within the same contract, and patches represent
          behavioral fixes that do not change the contract surface.
        </p>
        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/dependency-version-strategy.svg"
          alt="Version Strategy comparison showing semantic versioning, calendar versioning, and sequential versioning with their use cases and trade-offs"
          caption="Version Strategy: Comparing semantic versioning, calendar versioning, and sequential versioning with their use cases and trade-offs."
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The architecture of a versioned system involves multiple layers working
          together to route requests to the correct handler, translate between
          versions when necessary, and manage the lifecycle from active support
          through deprecation to sunset. Understanding this flow is essential for
          designing systems that can evolve without disruption.
        </p>

        <p>
          API versioning strategies determine how clients specify their desired
          version. URL versioning embeds the version in the path — such as{" "}
          <code className="mx-1 rounded bg-panel-soft px-1">
            /api/v1/users
          </code>{" "}
          and{" "}
          <code className="mx-1 rounded bg-panel-soft px-1">
            /api/v2/users
          </code>
          . This is the most common approach for public APIs, used by Stripe,
          GitHub, and Twitter, because it is explicit, easily cacheable, and
          simple to route at the load balancer level. Header versioning uses HTTP
          headers like{" "}
          <code className="mx-1 rounded bg-panel-soft px-1">
            Accept: application/vnd.api.v2+json
          </code>{" "}
          to keep URLs clean and align with REST content negotiation principles,
          though it sacrifices visibility and makes testing more complex. Query
          parameter versioning appends the version as a query string, offering a
          middle ground that is easy to test but problematic for caching since
          some CDNs ignore query parameters. Date-based versioning, used by
          cloud providers like AWS and Azure, specifies a version date such as{" "}
          <code className="mx-1 rounded bg-panel-soft px-1">
            X-API-Version: 2023-01-01
          </code>
          , providing clear timelines for deprecation since &quot;versions older
          than one year&quot; is unambiguous, though it does not convey whether a
          change is breaking or non-breaking.
        </p>

        <p>
          The request flow through a versioned API typically begins at the edge
          router or API gateway, which inspects the version identifier and routes
          to the appropriate backend handler. Each supported version may have its
          own handler implementation, or a single handler may contain branching
          logic that adapts its response based on the requested version. The
          latter approach reduces code duplication but increases handler
          complexity, while the former approach keeps each version&apos;s logic
          isolated but requires maintaining multiple code paths. Most production
          systems at scale use a hybrid: shared business logic in a common layer
          with version-specific presentation layers that format responses
          according to each version&apos;s contract.
        </p>

        <p>
          Schema evolution operates through a registry that tracks all versions
          of data structures and enforces compatibility rules. When a producer
          wants to evolve a schema, the registry validates that the change
          satisfies the configured compatibility level — backward compatible
          (new schema reads old data), forward compatible (old schema reads new
          data), or fully compatible (both directions). This validation prevents
          accidental breaking changes from reaching production. Compatible
          changes — adding optional fields, widening types from int32 to int64,
          adding enum values when consumers handle unknowns gracefully — pass
          through without a version bump. Breaking changes — removing fields,
          renaming fields, changing field types, adding required fields, or
          altering field semantics — require a new schema version and trigger the
          migration process.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/versioning-lifecycle.svg"
          alt="API Version Lifecycle showing progression from Current through Deprecated to Sunset with communication channels and migration patterns"
          caption="API Version Lifecycle: From current (active) through deprecated (with headers and migration guides) to sunset (HTTP 410 Gone), with communication channels and migration patterns."
        />

        <p>
          The deprecation lifecycle formalizes how old versions are retired. A
          typical timeline spans six to twelve months minimum, with enterprise
          customers often requiring the full period due to their internal release
          cycles. The process begins with a public announcement via blog posts,
          email notifications, and dashboard alerts, specifying the sunset date
          and providing migration guides. During the warning period, deprecated
          versions return headers such as{" "}
          <code className="mx-1 rounded bg-panel-soft px-1">
            Deprecation: sunsetting on 2026-12-31
          </code>{" "}
          and{" "}
          <code className="mx-1 rounded bg-panel-soft px-1">
            Sunset: 2026-12-31
          </code>
          , and the system logs usage to identify which clients need direct
          outreach. In the final phase before sunset, active users are contacted
          individually, migration support is offered, and rate limiting may be
          applied to incentivize migration. At sunset, the version returns HTTP
          410 Gone with a link to migration documentation, though a redirect or
          compatibility layer may be maintained for critical enterprise customers
          under special arrangement.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/schema-evolution-patterns.svg"
          alt="Schema Evolution showing compatible changes (add optional field, widen type) vs breaking changes (remove field, rename, change type)"
          caption="Schema Evolution: Compatible changes that don't require version bumps versus breaking changes that require new major versions and migration."
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>URL Versioning</strong>
              </td>
              <td className="p-3">
                Explicit and visible in every request, trivially cacheable by
                CDNs, easy to route at the load balancer, works in browser
                address bars for testing.
              </td>
              <td className="p-3">
                Violates REST purity principles since the same resource has
                multiple URLs, creates URL proliferation as versions accumulate.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Header Versioning</strong>
              </td>
              <td className="p-3">
                Keeps resource URLs clean, aligns with HTTP content negotiation
                standards, supports granular versioning per resource type.
              </td>
              <td className="p-3">
                Hidden in headers making debugging harder, cache must vary by
                header value complicating CDN configuration, not testable in
                browser address bar.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Date-Based Versioning</strong>
              </td>
              <td className="p-3">
                Natural ordering of versions, clear deprecation windows based on
                age, aligns with cloud provider release cadences.
              </td>
              <td className="p-3">
                Arbitrary date selection for minor changes, does not convey
                breaking versus non-breaking distinction, clients may not
                understand which date to pin.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Parallel Run Migration</strong>
              </td>
              <td className="p-3">
                Zero downtime during migration, instant rollback capability,
                allows gradual traffic shifting with monitoring.
              </td>
              <td className="p-3">
                Doubles operational cost during migration, requires data
                synchronization between versions, complex to maintain consistency
                across both versions.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Strangler Fig Migration</strong>
              </td>
              <td className="p-3">
                Incremental risk exposure, migrate one unit at a time, each step
                is independently reversible.
              </td>
              <td className="p-3">
                Requires routing layer to split traffic, migration takes longer
                than bulk replacement, intermediate state is complex to reason
                about.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Design for backward compatibility from the outset by making fields
          optional by default, avoiding required fields unless absolutely
          necessary, and ensuring clients ignore unknown fields in responses.
          This defensive posture means that most future changes can be made
          without breaking existing consumers, reducing the operational burden of
          version management. When a breaking change is unavoidable, plan the
          migration path before introducing it — determine how clients will
          migrate, what tooling you can provide, whether the migration can be
          incremental, and what the rollback plan is if issues arise.
        </p>
        <p>
          Maintain a strict limit on concurrent versions, typically supporting
          only the current version and the immediately preceding version, with a
          possible third version for enterprise customers under special
          arrangement. Supporting more than three concurrent versions becomes an
          operational burden: every bug fix must be tested against each version,
          every feature addition requires decisions about backporting, and the
          cognitive load on the engineering team grows with each additional
          surface area. A clear deprecation policy with firm timelines prevents
          version accumulation from becoming unmanageable.
        </p>
        <p>
          Provide automated migration tooling such as codemods that transform
          consumer code from the old interface to the new one. When a breaking
          change removes a field and adds a replacement, a codemod can
          automatically update the consumer&apos;s API calls, reducing the
          friction of migration from days of manual work to minutes of automated
          transformation. Include these tools in release notes and provide
          step-by-step migration guides with concrete examples for each breaking
          change.
        </p>
        <p>
          Track version usage metrics continuously to understand which clients
          are on which versions, how quickly they migrate after a new version
          launches, and which clients are at risk when a deprecation deadline
          approaches. This data drives proactive outreach: when a deprecated
          version still has active users, the team can contact those specific
          clients rather than broadcasting generic reminders. Version usage
          metrics also inform capacity planning — if version 1 still handles
          forty percent of traffic after six months, the sunset timeline may need
          extension or additional migration incentives.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most pervasive pitfall is designing schemas with required fields
          that later turn out to be unnecessary, forcing a breaking change to
          make them optional. The discipline of starting every field as optional
          and only promoting to required when business logic absolutely demands
          it prevents this class of breaking change. Similarly, assuming that
          clients will ignore unknown fields without testing this behavior is a
          frequent source of breakage — clients using strict JSON parsers or
          code-generated deserializers will fail on unknown fields unless
          explicitly configured to be lenient.
        </p>
        <p>
          Another common mistake is accumulating versions without a deprecation
          strategy, resulting in a system that supports five or more concurrent
          API versions. Each additional version multiplies the testing matrix,
          fragments the codebase, and slows feature development as engineers must
          consider the impact on every supported version. Without a firm
          deprecation timeline and the organizational discipline to enforce it,
          version accumulation becomes a form of technical debt that eventually
          paralyzes the team.
        </p>
        <p>
          Changing the semantics of an existing field without creating a new
          field is a subtle but destructive breaking change. When a field called{" "}
          <code className="mx-1 rounded bg-panel-soft px-1">status</code>{" "}
          changes from a boolean to an enumeration, every client that reads that
          field will receive unexpected values. The correct approach is to add a
          new field with the new semantics, deprecate the old field, and remove
          it only after all clients have migrated. The same principle applies to
          tightening validation rules — making an email field stricter breaks
          clients that previously submitted values that passed the looser
          validation.
        </p>
        <p>
          Failing to provide migration support — tooling, documentation, and
          direct assistance — turns deprecation into a unilateral breakage event
          rather than a collaborative transition. Consumers resent being forced
          to migrate without guidance, and the resulting friction damages the
          relationship between API producers and consumers. Investing in
          migration tooling, comprehensive documentation, and responsive support
          during the deprecation period turns a potentially painful transition
          into a manageable process.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Stripe&apos;s API versioning is a canonical example of URL-based
          versioning done at scale. Stripe pins each API key to a specific
          version, meaning that existing integrations continue to work on their
          pinned version even as Stripe releases new versions. Developers can
          explicitly request a different version per request, and Stripe provides
          a dashboard showing which version each integration uses, deprecation
          warnings, and one-click upgrade buttons. This approach balances
          stability for existing integrations with easy migration paths for
          developers who want new features.
        </p>
        <p>
          GitHub&apos;s REST API uses URL versioning with a clear lifecycle. The
          v3 API has been in production for years while GitHub developed the
          GraphQL API as a parallel surface. Rather than forcing migration,
          GitHub maintains both APIs with independent versioning, allowing
          consumers to choose the interface that best fits their needs. The
          GraphQL API itself has its own schema evolution strategy, using
          deprecation directives on fields rather than version numbers,
          demonstrating how different interface types within the same product
          require different versioning approaches.
        </p>
        <p>
          Amazon Web Services uses date-based versioning across its API surface,
          with each service publishing its API version as a date string like{" "}
          <code className="mx-1 rounded bg-panel-soft px-1">2023-01-01</code>.
          This approach aligns with AWS&apos;s continuous deployment model, where
          services evolve on their own cadence and the date provides a clear
          reference point for consumers. AWS SDKs automatically use the latest
          API version while allowing explicit version pinning for applications
          that require stability, and deprecation is communicated through SDK
          warnings and documentation updates.
        </p>
        <p>
          Apache Kafka&apos;s schema evolution model, implemented through the
          Confluent Schema Registry, demonstrates versioning in event-driven
          systems. Producers register schemas before publishing events, and the
          registry validates compatibility against the existing schema history.
          This prevents a producer from accidentally publishing an incompatible
          schema that would break all downstream consumers. Kafka consumers are
          designed to ignore unknown fields, providing forward compatibility that
          allows producers to evolve schemas independently of consumer deployment
          schedules.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What makes a schema change backward compatible versus breaking?
            </p>
            <p className="mt-2 text-sm">
              A: A backward compatible change is one that existing consumers can
              handle without modification. Adding optional fields is safe because
              old consumers simply ignore the new field. Adding enum values is
              safe if consumers handle unknown values gracefully, typically by
              falling back to default behavior. Widening types from int32 to
              int64 is safe because the wider type encompasses all values the old
              type could represent. Deprecating a field while keeping it
              functional is safe because the field still works for existing
              consumers. A breaking change is one that causes existing consumers
              to fail: removing a field breaks consumers that read it, renaming a
              field breaks all consumers using the old name, changing a field
              type breaks parsing, adding a required field breaks old consumers
              that do not provide it, and changing field semantics breaks
              consumers relying on the old behavior. The guiding principle is to
              design schemas expecting change — use optional fields, avoid
              required fields unless truly necessary, and ensure consumers ignore
              unknown fields.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you design a deprecation process for a public API?
            </p>
            <p className="mt-2 text-sm">
              A: A robust deprecation process spans six to twelve months minimum
              and involves multiple communication channels. Phase one is
              announcement: publish a blog post, send emails to registered
              developers, add dashboard notifications, and update documentation
              with the deprecation notice and sunset date. Phase two is the
              warning period: add deprecation headers to every API response
              including the Deprecation header with the sunset date, the Sunset
              header per RFC 8594, and a Link header pointing to migration
              documentation. Log all usage of the deprecated version to identify
              which clients are still active. Phase three is direct outreach:
              contact remaining active users individually, understand their
              migration blockers, and offer dedicated support. Phase four is the
              grace period: return warnings in every response, consider rate
              limiting to incentivize migration, and send final reminders. Phase
              five is sunset: return HTTP 410 Gone with a response body
              containing the migration guide URL. Maintain a redirect or
              compatibility layer for critical enterprise customers if needed,
              but only under explicit agreement.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What API versioning strategy would you choose for a public API
              and why?
            </p>
            <p className="mt-2 text-sm">
              A: For a public API, URL versioning is the most pragmatic choice.
              It is explicit and visible — any developer can see which version
              they are calling by looking at the URL. It is trivially cacheable
              since different URLs are different cache keys. It is easy to route
              at the load balancer level using simple path matching. It works in
              browser address bars for quick testing. Major public APIs like
              Stripe, GitHub, and Twitter all use URL versioning for these
              reasons. Header versioning is more RESTful but less visible, making
              it harder for developers to debug and for operations teams to
              monitor. Query parameter versioning has caching issues and conflates
              versioning with filtering. Date-based versioning works well for
              cloud providers with continuous deployment but requires consumers to
              understand which date corresponds to which feature set. The specific
              strategy matters less than consistency — whatever you choose,
              document it clearly, apply it uniformly across all endpoints, and
              do not change it once consumers have adopted it.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle zero-downtime database migrations in a
              versioned system?
            </p>
            <p className="mt-2 text-sm">
              A: The expansion-contract pattern is the standard approach. In the
              expansion phase, you add the new column or table alongside the old
              one, and modify the application to write to both the old and new
              structures while continuing to read from the old. This ensures that
              if the migration needs to be rolled back, the old structure has all
              the data. In the migration phase, you run a backfill process that
              copies existing data from the old structure to the new one,
              handling any necessary transformations. Once the backfill is
              complete, you switch reads to the new structure while continuing to
              write to both, monitoring for any discrepancies. In the contract
              phase, you stop writing to the old structure, verify that all reads
              are satisfied by the new structure, and finally remove the old
              structure. Each phase must be independently deployable and
              reversible. For large tables, use online migration tools that
              process data in chunks to avoid locking, and test rollback at each
              phase before proceeding to the next.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How many API versions should you support concurrently?
            </p>
            <p className="mt-2 text-sm">
              A: Typically two to three versions: the current version that
              receives all new features, the previous version that exists solely
              to give consumers time to migrate, and optionally a third version
              for enterprise customers with exceptionally long release cycles
              under a special support agreement. Supporting more than three
              versions becomes operationally unsustainable — every bug fix must be
              evaluated against each version, every new feature requires a
              backporting decision, and the testing matrix grows quadratically.
              The limit should be enforced by a clear deprecation policy: when a
              new version is released, the oldest supported version enters
              deprecation with a firm sunset date, and the team commits to
              removing it on that date regardless of remaining usage. Enterprise
              exceptions should be rare, documented, and time-bounded to prevent
              version accumulation from becoming permanent.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle schema evolution in an event-driven system
              with many downstream consumers?
            </p>
            <p className="mt-2 text-sm">
              A: Use a schema registry such as Confluent Schema Registry or AWS
              Glue Schema Registry that validates every schema change against
              compatibility rules before it is accepted. Configure the registry
              for backward compatibility mode, which ensures that the new schema
              can read data written by the old schema. Make only additive changes
              to schemas — add optional fields, add enum values, widen types —
              and ensure all consumers are designed to ignore unknown fields. For
              breaking changes, create a new topic or a new schema version with a
              different subject name, and migrate consumers gradually by deploying
              new consumer versions that read from the new schema while old
              consumers continue reading from the old schema. Test compatibility
              in CI by running the schema registry&apos;s compatibility check as
              part of the build pipeline, preventing incompatible schemas from
              reaching production. Monitor consumer lag during migration to ensure
              the transition does not cause processing backlogs.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            &quot;Designing Data-Intensive Applications&quot; by Martin
            Kleppmann — Chapters on schema evolution and data encoding
          </li>
          <li>
            &quot;Building Microservices&quot; by Sam Newman — API versioning and
            decomposition strategies
          </li>
          <li>
            Semantic Versioning specification:{" "}
            <a
              href="https://semver.org"
              className="text-accent hover:underline"
            >
              semver.org
            </a>
          </li>
          <li>
            Stripe API Versioning:{" "}
            <a
              href="https://stripe.com/docs/api/versioning"
              className="text-accent hover:underline"
            >
              stripe.com/docs/api/versioning
            </a>
          </li>
          <li>
            GitHub REST API Versioning:{" "}
            <a
              href="https://docs.github.com/en/rest/about-the-rest-api/api-versions"
              className="text-accent hover:underline"
            >
              docs.github.com/en/rest
            </a>
          </li>
          <li>
            Microsoft REST API Guidelines — Versioning and deprecation
            recommendations
          </li>
          <li>
            Confluent Schema Registry Documentation — Compatibility modes and
            evolution strategies
          </li>
          <li>
            RFC 8594 — The Sunset HTTP Header for deprecation communication
          </li>
          <li>
            &quot;Versioning in a Distributed Systems&quot; by Kelsey Hightower —
            Practical versioning at Google Cloud scale
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}