"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-crud-apis",
  title: "CRUD APIs",
  description:
    "Comprehensive guide to implementing CRUD APIs for content covering RESTful endpoint design, input validation, authorization patterns, optimistic locking, rate limiting, API security, scaling patterns, and operational concerns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "crud-apis",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "content",
    "crud",
    "api",
    "backend",
    "rest",
  ],
  relatedTopics: ["content-storage", "content-validation", "api-security"],
};

export default function CRUDAPIsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>CRUD APIs</strong> provide the backend interface for creating, reading, updating,
          and deleting content. They enforce validation, authorization, and business logic while
          providing consistent, performant access to content data. CRUD APIs are the foundation of
          any content management system — without well-designed APIs, content operations are
          unreliable, insecure, and difficult to scale.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/crud-api-design.svg"
          alt="CRUD API Design"
          caption="CRUD API Design — showing REST endpoints, validation layers, authorization flow, and response handling"
        />

        <p>
          For staff and principal engineers, implementing CRUD APIs requires deep understanding of
          RESTful endpoint design with resource-oriented URLs, proper HTTP methods, status codes,
          and versioning strategies. Input validation includes schema validation, length limits,
          required fields, type validation, and sanitization. Authorization patterns encompass
          role-based access control, resource-level permissions, and policy enforcement. Optimistic
          locking uses ETags and version fields for concurrent edit detection. Rate limiting
          implements token bucket or sliding window algorithms with per-user and per-IP limits. API
          security covers authentication, CORS, CSRF protection, input sanitization, and SQL
          injection prevention. Scaling patterns include caching, pagination, connection pooling,
          and read replicas. Operational concerns encompass logging, monitoring, alerting, and error
          handling. The implementation must balance flexibility with consistency and performance
          while maintaining security and reliability.
        </p>

        <p>
          Modern CRUD APIs have evolved from simple database wrappers to sophisticated service
          layers with comprehensive validation, authorization, rate limiting, and observability.
          Platforms like Stripe, Twilio, and GitHub provide well-documented REST APIs with
          consistent patterns, proper error handling, rate limiting, and comprehensive
          documentation. API design choices impact developer experience, system reliability, and
          long-term maintainability.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          CRUD APIs are built on fundamental concepts that determine how content operations are
          exposed, secured, and scaled. Understanding these concepts is essential for designing
          effective API architectures.
        </p>

        <p>
          <strong>RESTful Endpoint Design:</strong> Resource-oriented URLs like /content,
          {'/content/{id}'}, and {'/content/{id}/versions'} provide intuitive API structure. Proper HTTP
          methods map to operations with POST for create, GET for read, PUT/PATCH for update, and
          DELETE for delete. Status codes communicate results including 200 OK, 201 Created, 204 No
          Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict,
          429 Too Many Requests, and 500 Internal Server Error. API versioning through URL path
          /v1/, header Accept-Version, or query param ?version=1 enables backward-compatible
          evolution. Consistent response format with JSON envelope containing data, error, and meta
          simplifies client integration.
        </p>

        <p>
          <strong>Input Validation:</strong> Schema validation ensures input matches expected
          structure with required fields present, correct types, and valid formats. Length limits
          prevent abuse with title max 200 chars and body max 50000 chars. Type validation ensures
          integers are integers, strings are strings, and dates are valid ISO 8601. Sanitization
          removes dangerous content for XSS prevention and SQL injection prevention. Validation
          happens at API boundary before business logic executes, rejecting invalid requests early
          with clear error messages indicating which fields failed and why.
        </p>

        <p>
          <strong>Authorization:</strong> Role-based access control grants permissions based on
          user roles like admin, editor, and viewer. Resource-level permissions check if user can
          access specific resource such as user can edit only their own content. Policy enforcement
          evaluates policies dynamically where user can edit if content.status equals draft OR
          user.role equals admin. Authorization happens after authentication but before business
          logic, denying unauthorized requests with 403 Forbidden. Audit logging records
          authorization decisions for compliance and debugging.
        </p>

        <p>
          <strong>Optimistic Locking:</strong> Detects concurrent edits by including version
          information in requests through ETag header or version field. Client reads resource with
          version v1, modifies locally, submits update with If-Match: v1 header. Server checks if
          current version matches v1, if yes applies update and increments to v2, if no returns 409
          Conflict with current version. Client resolves conflict by reloading current version and
          reapplying changes. Optimistic locking assumes conflicts are rare, avoiding lock overhead
          while preventing lost updates.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          CRUD API architecture separates concerns into layers including routing, authentication,
          validation, authorization, business logic, and data access enabling modular
          implementation with clear boundaries. This architecture is critical for maintainability,
          security, and scalability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/crud-api-design.svg"
          alt="CRUD API Design"
          caption="CRUD API Design — showing REST endpoints, validation layers, authorization flow, and response handling"
        />

        <p>
          API request flow begins with routing matching URL and HTTP method to handler.
          Authentication validates credentials through JWT token, API key, or session cookie
          extracting user identity. Input validation checks request body and parameters against
          schema rejecting invalid requests with 400 Bad Request and field-level error messages.
          Authorization verifies user has permission for requested operation on target resource
          denying with 403 Forbidden if not authorized. Business logic executes the CRUD operation
          with create validating uniqueness and generating ID, read fetching by ID with access
          control, update applying changes with optimistic locking, and delete soft-deleting with
          cascade handling. Data access layer executes database operations with connection pooling
          and query optimization. Response formatting returns consistent JSON with data envelope,
          error details if failed, and metadata including pagination and rate limit headers.
        </p>

        <p>
          Validation architecture includes schema validation using JSON Schema or custom validators
          checking required fields, types, and formats. Length limits enforce string max lengths
          and array max sizes. Type coercion converts string to integer, string to date with
          validation. Sanitization provides XSS prevention by escaping HTML and SQL injection
          prevention by parameterized queries. Validation errors return 400 Bad Request with
          detailed field-level errors enabling clients to fix specific issues.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/api-authorization.svg"
          alt="API Authorization Flow"
          caption="API Authorization Flow — showing authentication, RBAC, resource-level permissions, policy enforcement, and audit logging"
        />

        <p>
          Authorization architecture includes authentication verifying identity via JWT, API key, or
          session. RBAC checks user role has permission for operation. Resource-level permissions
          check user owns or has access to specific resource. Policy enforcement evaluates dynamic
          policies based on resource state and user attributes. Authorization decisions are logged
          for audit trails showing who accessed what when and whether access was granted or denied.
          This architecture ensures only authorized users can perform operations while maintaining
          comprehensive audit trails for compliance.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing CRUD APIs involves trade-offs between flexibility, security, performance, and
          complexity. Understanding these trade-offs is essential for making informed architecture
          decisions.
        </p>

        <p>
          REST versus GraphQL for CRUD operations presents fundamental trade-offs. REST uses
          multiple endpoints like /content, {'/content/{id}'}, {'/content/{id}/versions'} with fixed
          response shapes per endpoint, enabling aggressive caching at CDN level and simple
          implementation but potentially requiring multiple round trips for related data. GraphQL
          uses single endpoint with client-specified queries requesting exactly needed fields in
          single round trip, reducing over-fetching and under-fetching but complicating caching
          with query-level caching required and introducing complexity with query depth limits and
          resolver optimization. The recommendation is REST for simple CRUD with predictable data
          shapes and caching needs, GraphQL for complex data requirements with varied client needs
          and single-round-trip requirements.
        </p>

        <p>
          Optimistic versus pessimistic locking for concurrent edits presents consistency versus
          performance trade-offs. Optimistic locking assumes conflicts are rare, including version
          in requests through ETag or version field and returning 409 Conflict on version mismatch,
          enabling high concurrency with no lock overhead but requiring client-side conflict
          resolution. Pessimistic locking acquires database lock on read holding until write
          completes, preventing conflicts entirely but reducing concurrency and adding lock overhead.
          The recommendation is optimistic locking for most content editing scenarios where
          conflicts are rare, pessimistic locking for high-contention scenarios like inventory
          management where conflicts are common and must be prevented.
        </p>

        <p>
          Soft delete versus hard delete for delete operations presents recovery versus compliance
          trade-offs. Soft delete marks records as deleted with deleted_at timestamp or is_deleted
          flag retaining data for recovery and audit but accumulating storage and requiring query
          filtering with WHERE deleted_at IS NULL. Hard delete permanently removes records freeing
          storage immediately but preventing recovery and complicating audit trails. The
          recommendation is soft delete for most content operations enabling recovery from
          accidental deletes and maintaining audit trails, hard delete for GDPR right-to-erasure
          requests and sensitive data requiring complete removal.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing CRUD APIs requires following established best practices to ensure security,
          reliability, performance, and developer experience.
        </p>

        <p>
          RESTful design uses resource-oriented URLs like /content, {'/content/{id}'},
          {'/content/{id}/versions'} with proper HTTP methods for POST create, GET read, PUT/PATCH
          update, and DELETE delete. Return appropriate status codes including 200 OK, 201 Created
          with Location header, 204 No Content for delete, 400 Bad Request with field errors, 401
          Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict for optimistic locking failures,
          and 429 Too Many Requests. Version APIs with /v1/content enabling backward-compatible
          evolution. Use consistent response format with data envelope containing data, error, and
          meta simplifying client integration.
        </p>

        <p>
          Input validation happens at API boundary before business logic. Validate schema with
          required fields present, correct types, and valid formats. Enforce length limits with
          title max 200 chars and body max 50000 chars. Sanitize input by escaping HTML and
          parameterizing SQL queries. Return detailed field-level errors with field, message, and
          value enabling clients to fix specific issues. Never trust client input — validate
          everything server-side even if client-side validation exists.
        </p>

        <p>
          Authorization checks occur after authentication but before business logic. Implement RBAC
          with roles admin, editor, viewer with operation permissions. Apply resource-level
          permissions where user can edit only their content or content shared with them. Enforce
          policies dynamically based on resource state and user attributes. Log all authorization
          decisions for audit trails. Deny by default — explicitly grant permissions rather than
          denying specific actions.
        </p>

        <p>
          Optimistic locking prevents lost updates from concurrent edits. Include ETag header or
          version field in responses. Require If-Match header or version field in update requests.
          Return 409 Conflict with current version on mismatch including current resource state
          enabling client resolution. Document conflict resolution patterns for API consumers.
        </p>

        <p>
          Rate limiting protects APIs from abuse and ensures fair usage. Implement token bucket or
          sliding window algorithms. Apply per-user limits for authenticated users and per-IP limits
          for anonymous users. Return 429 Too Many Requests with Retry-After header when limit
          exceeded. Include rate limit headers X-RateLimit-Limit, X-RateLimit-Remaining,
          X-RateLimit-Reset in all responses enabling clients to self-regulate.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing CRUD APIs to ensure security, reliability,
          and developer experience.
        </p>

        <p>
          Missing input validation allows invalid or malicious data into system. Fix by validating
          all input at API boundary with schema validation, length limits, type checks, and
          sanitization. Return detailed field-level errors enabling clients to fix issues. Never
          trust client-side validation — always validate server-side.
        </p>

        <p>
          Inconsistent error responses confuse API consumers. Fix by standardizing error format
          with error object containing code, message, and field across all endpoints. Use
          appropriate HTTP status codes with 400 for validation, 401 for auth, 403 for
          authorization, 404 for not found, 409 for conflicts, and 429 for rate limits. Include
          actionable error messages indicating what went wrong and how to fix.
        </p>

        <p>
          Missing optimistic locking causes lost updates from concurrent edits. Fix by including
          ETag or version field in responses, requiring If-Match or version in update requests, and
          returning 409 Conflict with current version on mismatch. Document conflict resolution for
          API consumers.
        </p>

        <p>
          No rate limiting enables API abuse and denial of service. Fix by implementing token bucket
          or sliding window rate limiting, applying per-user and per-IP limits, returning 429 with
          Retry-After header, and including rate limit headers in responses.
        </p>

        <p>
          Inadequate authorization allows unauthorized access. Fix by implementing RBAC with
          resource-level permissions, checking authorization before business logic, logging all
          authorization decisions, and denying by default with explicit grants.
        </p>

        <p>
          Missing pagination causes performance issues with large datasets. Fix by implementing
          cursor-based or offset-based pagination, returning pagination metadata with has_more,
          next_cursor, and total_count, and setting reasonable default and max page sizes.
        </p>

        <p>
          No API versioning breaks clients on changes. Fix by versioning APIs from start with /v1/,
          maintaining backward compatibility within major versions, and providing deprecation
          timeline for old versions.
        </p>

        <p>
          Insufficient logging hinders debugging and compliance. Fix by logging all requests with
          method, path, user, and timestamp, response status, errors with stack traces, and
          authorization decisions. Use structured logging enabling search and analysis.
        </p>

        <p>
          No monitoring leaves issues undetected. Fix by tracking API metrics including request
          rate, error rate, and latency percentiles, setting up alerts for anomalies like error
          rate spikes and latency increases, and creating dashboards for visibility.
        </p>

        <p>
          SQL injection vulnerabilities from string concatenation. Fix by using parameterized
          queries or ORM with built-in protection, never concatenating user input into SQL, and
          validating input types before database operations.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          CRUD APIs power content operations across different domains. Here are real-world
          implementations from production systems demonstrating different approaches to API design
          challenges.
        </p>

        <p>
          Stripe payment APIs address secure payment processing with comprehensive validation,
          idempotency, and detailed error handling. The solution uses RESTful endpoints
          /v1/charges and /v1/customers with proper HTTP methods, idempotency keys preventing
          duplicate charges from retries, detailed validation with field-level errors, and
          consistent error format with error object containing type, code, message, and param. The
          result is developer favorite API with comprehensive documentation, predictable behavior,
          and reliable error handling enabling seamless payment integration.
        </p>

        <p>
          GitHub REST APIs address code and content management with versioning, pagination, and
          rate limiting. The solution uses versioned endpoints /v1/repos and
          {'/v1/repos/{owner}/{repo}'} with ETag-based caching, cursor-based pagination for large
          result sets, generous rate limits of 5000 requests/hour authenticated with clear headers,
          and OAuth2 authentication. The result is scalable API serving millions of developers with
          predictable performance and comprehensive documentation.
        </p>

        <p>
          Contentful content APIs address headless CMS requirements with flexible queries,
          localization, and preview capabilities. The solution uses RESTful endpoints
          {'/spaces/{id}/entries'} with query parameters for filtering and sorting, localization
          support with ?locale=en-US, preview API for unpublished content, and comprehensive
          webhooks for content changes. The result is flexible API enabling omnichannel content
          delivery with real-time updates.
        </p>

        <p>
          Shopify admin APIs address e-commerce operations with webhooks, rate limiting, and
          GraphQL option. The solution uses REST endpoints /admin/api/2023-10/products with
          leaky bucket rate limiting, webhooks for real-time notifications, GraphQL API for complex
          queries, and OAuth2 for app authentication. The result is scalable API supporting
          millions of merchants with flexible integration options.
        </p>

        <p>
          Notion APIs address block-based content management with hierarchical data and rich
          content. The solution uses RESTful endpoints /v1/pages and /v1/blocks with hierarchical
          resource paths, rich text representation in JSON, pagination for block lists, and OAuth2
          for integrations. The result is intuitive API enabling programmatic content management
          with block-level granularity.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of CRUD API design, implementation, and operational
          concerns for staff and principal engineer interviews.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design RESTful CRUD endpoints?</p>
            <p className="mt-2 text-sm">
              A: Use resource-oriented URLs (/content, {'/content/{id}'}, {'/content/{id}/versions'}). Map
              HTTP methods to operations (POST create, GET read, PUT/PATCH update, DELETE delete).
              Return appropriate status codes (200 OK, 201 Created with Location header, 204 No
              Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409
              Conflict, 429 Too Many Requests). Version APIs (/v1/content) for backward-compatible
              evolution. Use consistent response format ({`{ data, error, meta }`}).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement input validation?</p>
            <p className="mt-2 text-sm">
              A: Validate at API boundary before business logic. Schema validation (required fields,
              types, formats). Length limits (title max 200 chars, body max 50000 chars). Type
              validation (integers, strings, dates). Sanitization (XSS prevention, SQL injection
              prevention). Return detailed field-level errors ({`{ field, message, value }`}) enabling
              clients to fix specific issues. Never trust client-side validation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement authorization?</p>
            <p className="mt-2 text-sm">
              A: Check authorization after authentication but before business logic. Implement RBAC
              (roles: admin, editor, viewer). Resource-level permissions (user owns content or
              content shared with them). Policy enforcement (dynamic policies based on resource
              state). Log all authorization decisions for audit. Deny by default with explicit
              grants.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement optimistic locking?</p>
            <p className="mt-2 text-sm">
              A: Include ETag header or version field in responses. Require If-Match header or
              version field in update requests. Check if current version matches request version.
              If yes, apply update and increment version. If no, return 409 Conflict with current
              version and resource state enabling client resolution. Document conflict resolution
              patterns for API consumers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement rate limiting?</p>
            <p className="mt-2 text-sm">
              A: Use token bucket or sliding window algorithms. Apply per-user limits
              (authenticated) and per-IP limits (anonymous). Return 429 Too Many Requests with
              Retry-After header when limit exceeded. Include rate limit headers (X-RateLimit-Limit,
              X-RateLimit-Remaining, X-RateLimit-Reset) in all responses. Store counters in Redis
              for distributed rate limiting.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle pagination?</p>
            <p className="mt-2 text-sm">
              A: Use cursor-based pagination (more efficient for large datasets) or offset-based
              pagination (simpler but slower for large offsets). Return pagination metadata
              (has_more, next_cursor, total_count). Set reasonable default (20 items) and max (100
              items) page sizes. Document pagination behavior clearly for API consumers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure API security?</p>
            <p className="mt-2 text-sm">
              A: Authentication (JWT, API keys, OAuth2). Authorization (RBAC, resource-level
              permissions). Input sanitization (XSS prevention, SQL injection prevention with
              parameterized queries). CORS configuration (restrict allowed origins). HTTPS only
              (encrypt all traffic). Rate limiting (prevent abuse). Audit logging (track all
              operations).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle API versioning?</p>
            <p className="mt-2 text-sm">
              A: Version from start (/v1/content). Use URL path versioning (clear, cacheable) or
              header versioning (Accept-Version: v1). Maintain backward compatibility within major
              versions. Deprecate old versions with timeline (announce 6 months before sunset).
              Provide migration guides for breaking changes. Support multiple versions simultaneously
              during transition.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement error handling?</p>
            <p className="mt-2 text-sm">
              A: Standardize error format ({`{ error: { code, message, field, details } }`}). Use
              appropriate HTTP status codes (400 validation, 401 auth, 403 authorization, 404 not
              found, 409 conflict, 429 rate limit). Include actionable error messages indicating
              what went wrong and how to fix. Log errors with stack traces for debugging. Return
              correlation ID enabling support to trace requests.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://restfulapi.net/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RESTful API Design Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP REST Security Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Input Validation Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authorization Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - HTTP Status Codes
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Forgot Password Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Credential Stuffing Prevention
            </a>
          </li>
          <li>
            <a
              href="https://stripe.com/docs/api"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe API Documentation (Reference)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
