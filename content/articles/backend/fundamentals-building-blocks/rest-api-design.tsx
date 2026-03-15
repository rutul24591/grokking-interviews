"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-rest-api-design-extensive",
  title: "REST API Design",
  description:
    "A practical, operational guide to REST API design: resources, semantics, pagination, versioning, and production failure modes.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "rest-api-design",
  wordCount: 2000,
  readingTime: 10,
  lastUpdated: "2026-03-14",
  tags: ["backend", "api", "rest", "http", "design"],
  relatedTopics: [
    "http-https-protocol",
    "api-design-best-practices",
    "request-response-lifecycle",
    "stateless-vs-stateful-services",
  ],
};

export default function RestApiDesignConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>REST</strong> is an architectural style for building APIs around a{" "}
          <strong>uniform interface</strong>, <strong>stateless requests</strong>, and{" "}
          <strong>resource-based modeling</strong>. In practice, a “RESTful” API is one where URLs
          identify resources, HTTP methods communicate intent, and status codes communicate outcomes.
        </p>
        <p>
          The payoff is predictability. Predictable APIs scale across teams and clients: web, mobile,
          internal services, and partner integrations can reuse the same mental model. That reduces
          client-specific glue code and makes operational behavior (timeouts, retries, caching) safer
          by default.
        </p>
      </section>

      <section>
        <h2>Resource Modeling (The Foundation)</h2>
        <p>
          A resource is a stable concept in your domain: users, orders, invoices, feature flags, and
          so on. The resource model should reflect business invariants and ownership boundaries, not
          your database schema. If clients couple directly to storage details, internal refactors
          become breaking changes.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Collections:</strong> plural nouns (`/orders`), with pagination.
          </li>
          <li>
            <strong>Identifiers:</strong> opaque, stable IDs (`/orders/ord_123`).
          </li>
          <li>
            <strong>Relationships:</strong> links or sub-resources when ownership is strict (for
            example, `/users/123/orders`).
          </li>
          <li>
            <strong>State transitions:</strong> represent as state fields (status) rather than custom
            verbs in paths.
          </li>
        </ul>
        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/web-api-diagram.svg"
          alt="Web API diagram showing multiple clients and API layers"
          caption="A REST API is a boundary: one interface serving many clients."
        />
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">
          Example code moved to the Example tab.
        </div>
      </section>

      <section>
        <h2>Semantics: Methods, Idempotency, and Safe Retries</h2>
        <p>
          REST relies on HTTP semantics to keep clients and intermediaries safe. Methods encode
          intent and determine retry behavior. GET and HEAD should be safe; PUT and DELETE should be
          idempotent. For POST operations that create side effects, use idempotency keys so a retry
          cannot create duplicates after timeouts.
        </p>
        <p>
          Designing for safe retries is not optional. Retries can happen in browsers, mobile
          networks, proxies, SDKs, and background workers. If your API cannot tolerate retries,
          reliability work becomes constant firefighting.
        </p>
      </section>

      <section>
        <h2>Status Codes and an Error Model Clients Can Trust</h2>
        <p>
          Status codes are a contract: clients use them to decide whether to retry, prompt for
          authentication, or fail fast. Don’t overload 200 for error cases. A good baseline:
          <strong> 400</strong> for validation, <strong>401/403</strong> for auth, <strong>404</strong>{" "}
          for missing resources, <strong>409</strong> for conflicts, <strong>429</strong> for rate
          limits, and <strong>5xx</strong> for server issues.
        </p>
        <p>
          Error payloads should be consistent and machine-readable: stable error codes, a human
          message, optional field-level details, and a request ID. Consistency matters more than the
          exact schema because clients and tooling depend on it.
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">
          Example code moved to the Example tab.
        </div>
      </section>

      <section>
        <h2>Pagination, Filtering, and Sorting (Design for Scale)</h2>
        <p>
          List endpoints must be bounded. Offset pagination is easy but can become inconsistent under
          concurrent writes and expensive at high offsets. Cursor pagination is more stable at scale
          because it relies on a stable ordering key and avoids deep scans.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Safety limits:</strong> enforce a maximum `limit` regardless of client input.
          </li>
          <li>
            <strong>Stable ordering:</strong> use immutable keys (createdAt + id) for cursors.
          </li>
          <li>
            <strong>Query semantics:</strong> keep filters explicit and indexed; avoid arbitrary query
            operators unless you can support them safely.
          </li>
        </ul>
      </section>

      <section>
        <h2>Concurrency Control and Partial Updates</h2>
        <p>
          Real APIs face concurrent updates: two clients editing the same resource, background jobs
          applying changes, or retries replaying requests. Use optimistic concurrency to prevent lost
          updates: return an <strong>ETag</strong> (or version field) and require <strong>If-Match</strong>{" "}
          on writes that must not overwrite newer state.
        </p>
        <p>
          For partial updates, PATCH is often the right method, but it must be well-specified.
          Document which fields are mutable, how nulls are treated, and what validation errors look
          like. Ambiguous patch semantics become a long-term maintenance burden.
        </p>
      </section>

      <section>
        <h2>Caching and Performance</h2>
        <p>
          REST pairs naturally with HTTP caching. Even when you cannot cache private or sensitive
          data broadly, you can often cache public resources, configuration, and reference data. Use
          Cache-Control and ETags to reduce payloads and protect origins.
        </p>
        <p>
          Performance is also about payload shape. Avoid accidental N+1 patterns by providing
          expansions thoughtfully. If clients always need related data, support an explicit `expand`
          parameter rather than forcing multiple round-trips.
        </p>
        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/http-pipelining.svg"
          alt="HTTP pipelining diagram"
          caption="Connection reuse and caching reduce origin load and tail latency."
        />
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">
          Example code moved to the Example tab.
        </div>
      </section>

      <section>
        <h2>Security and Multi-Tenant Boundaries</h2>
        <p>
          Authentication is table stakes; authorization is where most API security bugs occur. Always
          authorize at resource boundaries: ownership checks, role/scopes, and tenant isolation. If a
          user can guess another resource ID, they still must not be able to access it.
        </p>
        <p>
          For multi-tenant systems, tenant isolation should be enforced consistently in every query.
          The most common failure mode is “tenant filter applied in one code path but missing in
          another,” which becomes a data leak incident.
        </p>
      </section>

      <section>
        <h2>Versioning and Backward Compatibility</h2>
        <p>
          Treat backward compatibility as a default requirement. Adding fields is usually safe if
          clients ignore unknown fields. Renaming or changing types is breaking by default and should
          be avoided or versioned. When you must introduce breaking changes, define a deprecation
          policy, publish timelines, and measure client adoption before removing old behavior.
        </p>
        <p>
          Versioning mechanisms (path, header, media-type) are less important than process: staged
          rollouts, compatibility tests, and documentation that stays aligned with the implementation.
        </p>
      </section>

      <section>
        <h2>Observability and Operational Practices</h2>
        <p>
          A production API must be debuggable. Emit request IDs, propagate tracing headers across
          services, and segment metrics by endpoint, status code, and tenant. Instrument client-facing
          SLOs such as p95 latency and error rate, and monitor saturation signals that predict outages
          (CPU, memory, queue depth, connection pools).
        </p>
        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/ajax-request-response.svg"
          alt="Request response flow diagram"
          caption="Observability spans the full request path, including downstream dependencies."
        />
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>Verb-based URLs that encode actions instead of resources.</li>
          <li>Unbounded list endpoints (missing pagination, missing safety limits).</li>
          <li>Inconsistent status codes and ad hoc error payloads per endpoint.</li>
          <li>Ignoring idempotency and then debugging duplicate writes under retries.</li>
          <li>Authorization checks done “after the query” instead of at the boundary.</li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough: Orders API</h2>
        <p>
          Imagine an e-commerce API where order creation must be safe under retries. The client sends
          POST `/orders` with an idempotency key. The API validates input, authorizes the user, and
          either creates the order or returns the previously created order for the same key. Reads use
          cursor pagination (`/orders?cursor=...&limit=50`) and allow `expand=lineItems` only when
          necessary to avoid bloated list payloads.
        </p>
        <p>
          This design makes retries safe, keeps list views fast, and makes performance predictable
          under load. It also gives you clear places to attach operational guardrails: rate limits on
          create endpoints, per-tenant quotas, and alerts on conflict and retry rates.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Define resource boundaries and stable IDs; keep URLs noun-based.</li>
          <li>Use consistent status codes and a stable error schema with request IDs.</li>
          <li>Design pagination for scale; enforce limits and stable ordering.</li>
          <li>Make retries safe (idempotency keys + backoff + budgets).</li>
          <li>Instrument SLOs and segment metrics by endpoint and tenant.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When do you prefer cursor pagination over offset?</p>
            <p className="mt-2 text-sm">
              A: When datasets are large or frequently updated. Cursors avoid deep scans and reduce
              inconsistent results under concurrent writes.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent duplicate creates when clients retry POST?</p>
            <p className="mt-2 text-sm">
              A: Use idempotency keys. Store the outcome keyed by the client token and return the
              same result for duplicate submissions.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design error responses that scale across clients?</p>
            <p className="mt-2 text-sm">
              A: Use a consistent schema with stable error codes, request IDs, and optional
              field-level details so clients can handle failures programmatically.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What makes a breaking API change, and how do you ship it safely?</p>
            <p className="mt-2 text-sm">
              A: Removing or renaming fields, changing types, or changing semantics. Ship safely with
              additive changes first, deprecation windows, compatibility tests, and measured client
              adoption.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          Strong REST APIs are predictable and operationally safe. Model stable resources, rely on HTTP
          semantics, design for pagination and concurrency, and treat retries, caching, authorization,
          and observability as first-class design requirements.
        </p>
      </section>
    </ArticleLayout>
  );
}

