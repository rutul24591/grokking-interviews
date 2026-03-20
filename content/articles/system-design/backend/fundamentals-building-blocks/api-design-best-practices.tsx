"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-api-design-best-practices-extensive",
  title: "API Design Best Practices",
  description: "Comprehensive guide to API design covering resource modeling, pagination strategies, error handling, versioning, rate limiting, and production trade-offs for scalable APIs.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "api-design-best-practices",
  version: "extensive",
  wordCount: 7000,
  readingTime: 28,
  lastUpdated: "2026-03-19",
  tags: ["backend", "api", "design", "reliability", "standards", "rest", "best-practices"],
  relatedTopics: ["rest-api-design", "http-https-protocol", "request-response-lifecycle", "serialization-formats"],
};

export default function ApiDesignBestPracticesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>API design best practices</strong> are principles and patterns that make interfaces predictable, maintainable, secure, and performant at scale. Well-designed APIs reduce client complexity, minimize breaking changes, enable self-service integration, and operate reliably under load. Poorly designed APIs create friction for consumers, increase support burden, and become technical debt that slows product development.
        </p>
        <p>
          API design is not just about technical correctness—it&apos;s about <strong>developer experience</strong>. Every API decision affects how quickly developers can integrate, how easily they can debug issues, and how much trust they have in your platform. At companies like Stripe, Twilio, and GitHub, API design is a core product differentiator.
        </p>
        <p>
          <strong>Key goals of API design:</strong>
        </p>
        <ul>
          <li>
            <strong>Predictability:</strong> Consistent naming, error formats, and behavior across endpoints reduce cognitive load for developers.
          </li>
          <li>
            <strong>Backward Compatibility:</strong> APIs evolve without breaking existing clients. Deprecation is managed, not forced.
          </li>
          <li>
            <strong>Discoverability:</strong> Clear documentation, examples, and SDKs enable self-service integration.
          </li>
          <li>
            <strong>Safety:</strong> Idempotency, rate limiting, and validation protect against accidental misuse and abuse.
          </li>
          <li>
            <strong>Performance:</strong> Pagination, filtering, field selection, and caching enable efficient data access.
          </li>
          <li>
            <strong>Observability:</strong> Request IDs, consistent errors, and clear status codes enable debugging.
          </li>
        </ul>
        <p>
          <strong>Why this matters for staff/principal engineers:</strong> API design decisions have long-term consequences. A breaking change can affect thousands of clients. A poorly paginated endpoint can cause database outages. Inconsistent errors increase support costs. Senior engineers must balance velocity (shipping features) with stability (not breaking clients).
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: API Design Is Product Design</h3>
          <p>
            Your API is a product used by developers. Just as UX designers optimize for end users, API designers optimize for developer experience. Stripe&apos;s success is largely attributed to best-in-class API design—clear documentation, consistent patterns, and thoughtful error messages. Treat API design as a product discipline, not an engineering afterthought.
          </p>
        </div>
      </section>

      <section>
        <h2>Resource Modeling and Naming</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Use Nouns, Not Verbs</h3>
        <p>
          RESTful APIs model resources (nouns), not actions (verbs). Resources are things your API manages: users, orders, invoices, products.
        </p>
        <p>
          <strong>Good:</strong>
        </p>
        <ul>
          <li><code>GET /users</code> — List users</li>
          <li><code>POST /users</code> — Create a user</li>
          <li><code>GET /users/123</code> — Get user 123</li>
          <li><code>PUT /users/123</code> — Update user 123</li>
          <li><code>DELETE /users/123</code> — Delete user 123</li>
        </ul>
        <p>
          <strong>Bad (verb-based):</strong>
        </p>
        <ul>
          <li><code>GET /getUsers</code></li>
          <li><code>POST /createUser</code></li>
          <li><code>POST /updateUser</code></li>
          <li><code>POST /deleteUser</code></li>
        </ul>
        <p>
          <strong>Why:</strong> HTTP methods already convey the action (GET = read, POST = create, PUT = replace, DELETE = remove). Adding verbs to URLs is redundant and breaks REST conventions.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Use Plural Nouns for Collections</h3>
        <p>
          Collections should use plural nouns consistently:
        </p>
        <ul>
          <li><code>/users</code> — Collection of users</li>
          <li><code>/users/123</code> — Single user resource</li>
          <li><code>/users/123/orders</code> — Collection of orders for user 123</li>
        </ul>
        <p>
          <strong>Why:</strong> Plurals clearly distinguish collection endpoints from single-resource endpoints. <code>/user</code> vs <code>/users</code> is ambiguous; <code>/users/123</code> is clear.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Nested Resources for Ownership</h3>
        <p>
          Use nested paths to show ownership relationships:
        </p>
        <ul>
          <li><code>/users/123/orders</code> — Orders belonging to user 123</li>
          <li><code>/users/123/orders/456/items</code> — Items in order 456 for user 123</li>
        </ul>
        <p>
          <strong>Guideline:</strong> Limit nesting to 2-3 levels. Deep nesting (<code>/a/b/c/d/e</code>) is hard to read and suggests poor resource modeling.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Use Lowercase with Hyphens</h3>
        <p>
          URLs should be lowercase with hyphens for readability:
        </p>
        <ul>
          <li><strong>Good:</strong> <code>/user-profiles</code>, <code>/order-items</code></li>
          <li><strong>Bad:</strong> <code>/UserProfiles</code>, <code>/orderItems</code> (camelCase), <code>/order_items</code> (snake_case)</li>
        </ul>
        <p>
          <strong>Why:</strong> URLs are case-sensitive on some servers. Hyphens are more readable than underscores in URLs (search engines treat hyphens as word separators).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Use Opaque IDs, Not Implementation Details</h3>
        <p>
          Resource IDs should be opaque identifiers, not database internals:
        </p>
        <ul>
          <li><strong>Good:</strong> <code>user_abc123</code>, <code>ord_xyz789</code> (opaque, prefixed)</li>
          <li><strong>Bad:</strong> <code>123</code> (auto-increment integer), <code>550e8400-e29b-41d4-a716-446655440000</code> (raw UUID without prefix)</li>
        </ul>
        <p>
          <strong>Why:</strong> Opaque IDs hide implementation details (database type, sharding strategy). Prefixes (<code>user_</code>, <code>ord_</code>) make logs and debugging easier. Avoid auto-increment integers—they reveal business metrics (e.g., &quot;we have 10,000 users&quot;) and are guessable.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/web-api-diagram.svg"
          alt="Web API Architecture showing multiple clients consuming consistent API"
          caption="API Design: Consistent resource naming, clear error formats, and stable contracts enable multiple clients (web, mobile, partners) to integrate reliably."
        />
      </section>

      <section>
        <h2>Pagination Strategies</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Why Pagination Matters</h3>
        <p>
          Unpaginated endpoints are a production risk:
        </p>
        <ul>
          <li><strong>Memory exhaustion:</strong> Loading 100,000 records into memory crashes servers.</li>
          <li><strong>Slow responses:</strong> Large queries take seconds, violating SLOs.</li>
          <li><strong>Network saturation:</strong> Multi-MB responses consume bandwidth.</li>
          <li><strong>DoS vulnerability:</strong> Malicious clients can request all data.</li>
        </ul>
        <p>
          <strong>Rule:</strong> All collection endpoints MUST be paginated.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Offset Pagination (Simple but Flawed)</h3>
        <p>
          Offset pagination uses <code>offset</code> (or <code>page</code>) and <code>limit</code> parameters:
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          GET /users?offset=0&amp;limit=20
          GET /users?offset=20&amp;limit=20
          GET /users?offset=40&amp;limit=20
        </pre>
        <p>
          <strong>Advantages:</strong> Simple to implement, easy to understand, supports random access (jump to page 50).
        </p>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li><strong>Performance degrades with depth:</strong> <code>OFFSET 10000 LIMIT 20</code> scans 10,020 rows, discards 10,000. Slow on large datasets.</li>
          <li><strong>Inconsistent results under concurrent writes:</strong> If a row is inserted/deleted between requests, pages shift—items may be duplicated or skipped.</li>
        </ul>
        <p>
          <strong>Use when:</strong> Dataset is small (&lt;10,000 rows), data is static, or random page access is required.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cursor Pagination (Recommended for Scale)</h3>
        <p>
          Cursor pagination uses an opaque cursor pointing to a position in the result set:
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          {`GET /users?limit=20
→ { "data": [...], "next_cursor": "eyJpZCI6MjB9", "has_more": true }

GET /users?limit=20&cursor=eyJpZCI6MjB9
→ { "data": [...], "next_cursor": "eyJpZCI6NDB9", "has_more": true }`}
        </pre>
        <p>
          <strong>How it works:</strong> The cursor encodes the position (e.g., last seen ID or timestamp). The server queries <code>WHERE id &gt; last_seen_id ORDER BY id ASC LIMIT 21</code>. If 21 rows are returned, <code>has_more = true</code> and the 21st row&apos;s ID becomes the next cursor.
        </p>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li><strong>Consistent performance:</strong> Query uses index on ID, no matter how deep in the result set.</li>
          <li><strong>Stable results:</strong> New rows inserted after the cursor don&apos;t affect pagination. Deleted rows are simply skipped.</li>
          <li><strong>No offset scanning:</strong> Database only fetches the requested rows.</li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li><strong>No random access:</strong> Can&apos;t jump to page 50—must iterate from the start.</li>
          <li><strong>Cursor encoding:</strong> Need to encode/decode cursors (base64, JWT).</li>
        </ul>
        <p>
          <strong>Use when:</strong> Dataset is large, data is frequently updated, or performance is critical.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Keyset Pagination (Variant of Cursor)</h3>
        <p>
          Keyset pagination uses explicit keys instead of opaque cursors:
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          GET /users?limit=20&amp;after_id=123
          GET /users?limit=20&amp;after_id=456
        </pre>
        <p>
          <strong>Advantages:</strong> Simpler than cursor encoding, transparent to clients.
        </p>
        <p>
          <strong>Disadvantages:</strong> Exposes internal IDs (may reveal business metrics), requires stable sort key.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pagination Best Practices</h3>
        <ul>
          <li><strong>Default limit:</strong> 20-50 items. Reasonable for most UIs.</li>
          <li><strong>Max limit:</strong> 100-1000 items. Prevents abuse.</li>
          <li><strong>Include has_more:</strong> Boolean indicating if more results exist. Easier than counting total.</li>
          <li><strong>Avoid total_count:</strong> Counting all rows is expensive. If needed, provide approximate count or async endpoint.</li>
          <li><strong>Stable sort order:</strong> Always sort by a stable key (ID, timestamp). Unordered results cause pagination inconsistencies.</li>
          <li><strong>Document behavior:</strong> Specify default limit, max limit, sort order, and whether cursors expire.</li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/http-pipelining.svg"
          alt="Pagination Strategies comparison"
          caption="Pagination Strategies: Offset (simple but slow at depth), Cursor (consistent performance, stable results), Keyset (transparent but exposes IDs). Choose based on dataset size and update frequency."
        />
      </section>

      <section>
        <h2>Filtering, Sorting, and Field Selection</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Filtering</h3>
        <p>
          Support filtering with query parameters:
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          GET /users?status=active&amp;role=admin
          GET /orders?created_at[gte]=2024-01-01&amp;created_at[lte]=2024-12-31
          GET /products?price[min]=10&amp;price[max]=100
        </pre>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul>
          <li><strong>Use consistent operators:</strong> <code>gte</code>, <code>lte</code>, <code>min</code>, <code>max</code>, <code>contains</code>.</li>
          <li><strong>Support multiple filters:</strong> Combine with AND logic by default.</li>
          <li><strong>Document filterable fields:</strong> Not all fields need filtering. Document which fields support filtering.</li>
          <li><strong>Validate filter values:</strong> Return 400 for invalid filter values (e.g., <code>status=invalid</code>).</li>
          <li><strong>Index filtered fields:</strong> Ensure filtered queries are performant.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sorting</h3>
        <p>
          Support sorting with <code>sort</code> parameter:
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          GET /users?sort=created_at
          GET /users?sort=-created_at  (descending)
          GET /users?sort=last_name,first_name  (multi-field)
        </pre>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul>
          <li><strong>Default sort:</strong> Document default sort order (e.g., <code>created_at DESC</code>).</li>
          <li><strong>Allow descending:</strong> Prefix with <code>-</code> or <code>desc</code>.</li>
          <li><strong>Limit sortable fields:</strong> Not all fields should be sortable (e.g., full-text fields).</li>
          <li><strong>Include sort in cache key:</strong> Different sort orders = different responses.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Field Selection (Sparse Fieldsets)</h3>
        <p>
          Allow clients to request specific fields to reduce payload size:
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          {`GET /users?fields=id,name,email
→ { "id": "123", "name": "John", "email": "john@example.com" }`}
        </pre>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li><strong>Reduced payload:</strong> Fetch only needed fields.</li>
          <li><strong>Privacy:</strong> Clients can&apos;t accidentally access sensitive fields.</li>
          <li><strong>Performance:</strong> Less data to serialize, transmit, parse.</li>
        </ul>
        <p>
          <strong>Implementation:</strong>
        </p>
        <ul>
          <li>Use <code>fields</code> or <code>include</code> parameter.</li>
          <li>Validate field names (reject unknown fields).</li>
          <li>Always include ID (even if not requested) for resource identification.</li>
          <li>Document available fields.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Expanding Related Resources</h3>
        <p>
          Allow clients to include related resources to reduce round trips:
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          {`GET /orders?expand=user,items
→ {
  "id": "ord_123",
  "user": { "id": "usr_456", "name": "John" },
  "items": [{ "id": "item_1", "product": "Widget" }]
}`}
        </pre>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul>
          <li><strong>Limit expandable fields:</strong> Not all relationships should be expandable.</li>
          <li><strong>Max depth:</strong> Limit expansion depth (e.g., max 2 levels) to prevent abuse.</li>
          <li><strong>N+1 query prevention:</strong> Use eager loading to avoid N+1 queries when expanding.</li>
        </ul>
      </section>

      <section>
        <h2>Error Handling</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Use Appropriate Status Codes</h3>
        <p>
          Status codes communicate the outcome and guide client behavior:
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Status Code</th>
              <th className="p-3 text-left">Meaning</th>
              <th className="p-3 text-left">Client Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>200 OK</strong></td>
              <td className="p-3">Request succeeded</td>
              <td className="p-3">Process response</td>
            </tr>
            <tr>
              <td className="p-3"><strong>201 Created</strong></td>
              <td className="p-3">Resource created</td>
              <td className="p-3">Read Location header, process response</td>
            </tr>
            <tr>
              <td className="p-3"><strong>204 No Content</strong></td>
              <td className="p-3">Request succeeded, no body</td>
              <td className="p-3">No action needed</td>
            </tr>
            <tr>
              <td className="p-3"><strong>400 Bad Request</strong></td>
              <td className="p-3">Invalid request syntax or validation failure</td>
              <td className="p-3">Fix request, don&apos;t retry without changes</td>
            </tr>
            <tr>
              <td className="p-3"><strong>401 Unauthorized</strong></td>
              <td className="p-3">Missing or invalid authentication</td>
              <td className="p-3">Authenticate, then retry</td>
            </tr>
            <tr>
              <td className="p-3"><strong>403 Forbidden</strong></td>
              <td className="p-3">Authenticated but not authorized</td>
              <td className="p-3">Don&apos;t retry—user lacks permission</td>
            </tr>
            <tr>
              <td className="p-3"><strong>404 Not Found</strong></td>
              <td className="p-3">Resource doesn&apos;t exist</td>
              <td className="p-3">Don&apos;t retry—resource won&apos;t appear</td>
            </tr>
            <tr>
              <td className="p-3"><strong>409 Conflict</strong></td>
              <td className="p-3">Request conflicts with current state</td>
              <td className="p-3">Resolve conflict (e.g., fetch latest, merge), then retry</td>
            </tr>
            <tr>
              <td className="p-3"><strong>422 Unprocessable Entity</strong></td>
              <td className="p-3">Valid syntax but semantic errors</td>
              <td className="p-3">Fix validation errors, don&apos;t retry without changes</td>
            </tr>
            <tr>
              <td className="p-3"><strong>429 Too Many Requests</strong></td>
              <td className="p-3">Rate limited</td>
              <td className="p-3">Wait (see Retry-After header), then retry</td>
            </tr>
            <tr>
              <td className="p-3"><strong>500 Internal Server Error</strong></td>
              <td className="p-3">Server error</td>
              <td className="p-3">Retry with backoff</td>
            </tr>
            <tr>
              <td className="p-3"><strong>502 Bad Gateway</strong></td>
              <td className="p-3">Upstream error</td>
              <td className="p-3">Retry with backoff</td>
            </tr>
            <tr>
              <td className="p-3"><strong>503 Service Unavailable</strong></td>
              <td className="p-3">Service overloaded or down</td>
              <td className="p-3">Retry with backoff, check Retry-After</td>
            </tr>
            <tr>
              <td className="p-3"><strong>504 Gateway Timeout</strong></td>
              <td className="p-3">Upstream timeout</td>
              <td className="p-3">Retry with backoff</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consistent Error Response Format</h3>
        <p>
          All errors should follow a consistent schema:
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          {`{
  "error": {
    "code": "validation_failed",
    "message": "The request contains invalid data",
    "request_id": "req_abc123",
    "details": [
      {
        "field": "email",
        "code": "invalid_format",
        "message": "Email must be a valid email address"
      }
    ]
  }
}`}
        </pre>
        <p>
          <strong>Fields:</strong>
        </p>
        <ul>
          <li><strong>code:</strong> Machine-readable error code (stable across versions).</li>
          <li><strong>message:</strong> Human-readable explanation (can change).</li>
          <li><strong>request_id:</strong> Unique identifier for debugging (correlate with logs).</li>
          <li><strong>details:</strong> Field-level errors (for validation failures).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Code Taxonomy</h3>
        <p>
          Define a stable set of error codes:
        </p>
        <ul>
          <li><strong>validation_failed:</strong> Input validation error.</li>
          <li><strong>authentication_required:</strong> Missing or invalid auth.</li>
          <li><strong>permission_denied:</strong> User lacks permission.</li>
          <li><strong>resource_not_found:</strong> Resource doesn&apos;t exist.</li>
          <li><strong>resource_conflict:</strong> Conflict with existing resource.</li>
          <li><strong>rate_limit_exceeded:</strong> Too many requests.</li>
          <li><strong>internal_error:</strong> Server error (retry).</li>
          <li><strong>service_unavailable:</strong> Service temporarily down.</li>
        </ul>
        <p>
          <strong>Why codes matter:</strong> Clients can handle errors programmatically. <code>rate_limit_exceeded</code> → wait and retry. <code>permission_denied</code> → prompt user for different credentials.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Error Handling Pitfalls</h3>
        <ul>
          <li><strong>Returning 200 for errors:</strong> Don&apos;t return HTTP 200 with <code>{`{ "success": false }`}</code>. Use appropriate status codes.</li>
          <li><strong>Inconsistent error formats:</strong> Different endpoints return different error shapes. Standardize across all endpoints.</li>
          <li><strong>Leaking internal details:</strong> Don&apos;t expose stack traces, SQL errors, or internal state in production errors.</li>
          <li><strong>Missing request_id:</strong> Without request IDs, debugging production issues is nearly impossible.</li>
        </ul>
      </section>

      <section>
        <h2>Versioning and Backward Compatibility</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Prefer Additive Changes</h3>
        <p>
          The safest API change is additive—adding new fields or endpoints without modifying existing behavior:
        </p>
        <ul>
          <li><strong>Safe:</strong> Adding a new field to a response.</li>
          <li><strong>Safe:</strong> Adding a new optional query parameter.</li>
          <li><strong>Safe:</strong> Adding a new endpoint.</li>
          <li><strong>Breaking:</strong> Removing a field.</li>
          <li><strong>Breaking:</strong> Changing a field&apos;s type.</li>
          <li><strong>Breaking:</strong> Changing default behavior.</li>
        </ul>
        <p>
          <strong>Rule:</strong> Clients should ignore unknown fields. This enables additive evolution without versioning.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When Versioning Is Necessary</h3>
        <p>
          Versioning is required for breaking changes:
        </p>
        <ul>
          <li>Removing or renaming fields.</li>
          <li>Changing field types (string → integer).</li>
          <li>Changing authentication mechanism.</li>
          <li>Changing error formats.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Versioning Strategies</h3>

        <h4 className="mt-4 mb-2 font-semibold">URL Versioning (Most Common)</h4>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          GET /v1/users
          GET /v2/users
        </pre>
        <p>
          <strong>Advantages:</strong> Simple, explicit, easy to route, cacheable.</p>
        <p>
          <strong>Disadvantages:</strong> Clutters URLs, encourages version proliferation.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Header Versioning</h4>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          GET /users
          Accept-Version: v2
        </pre>
        <p>
          <strong>Advantages:</strong> Clean URLs, version is explicit.</p>
        <p>
          <strong>Disadvantages:</strong> Harder to test in browser, less cacheable.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Media Type Versioning</h4>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          GET /users
          Accept: application/vnd.myapi.v2+json
        </pre>
        <p>
          <strong>Advantages:</strong> RESTful, content negotiation.</p>
        <p>
          <strong>Disadvantages:</strong> Complex, hard to implement correctly.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Deprecation Strategy</h3>
        <p>
          When deprecating old versions:
        </p>
        <ol className="space-y-2">
          <li><strong>Announce deprecation:</strong> Email developers, update docs, add deprecation headers.</li>
          <li><strong>Provide migration guide:</strong> Document changes and migration steps.</li>
          <li><strong>Set timeline:</strong> Give 6-12 months for migration.</li>
          <li><strong>Monitor usage:</strong> Track API version usage, identify holdouts.</li>
          <li><strong>Sunset:</strong> After timeline, return 410 Gone for old version.</li>
        </ol>
        <p>
          <strong>Deprecation headers:</strong>
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          Deprecation: true
          Sunset: Sat, 31 Dec 2026 23:59:59 GMT
          Link: &lt;https://docs.example.com/migration&gt;; rel="deprecation"
        </pre>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Backward Compatibility Checklist</h3>
        <ul>
          <li>Clients can ignore unknown fields.</li>
          <li>Optional fields are truly optional (have defaults).</li>
          <li>Required fields are never added to existing endpoints.</li>
          <li>Field types never change (use new fields instead).</li>
          <li>Default behavior is preserved.</li>
          <li>Deprecation is announced with sufficient lead time.</li>
        </ul>
      </section>

      <section>
        <h2>Rate Limiting and Quotas</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Why Rate Limiting Matters</h3>
        <ul>
          <li><strong>Protect backend:</strong> Prevent a single client from overwhelming services.</li>
          <li><strong>Fair usage:</strong> Ensure all clients get fair access.</li>
          <li><strong>Cost control:</strong> API calls have costs (compute, database, third-party).</li>
          <li><strong>Abuse prevention:</strong> Mitigate DDoS, scraping, credential stuffing.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rate Limiting Algorithms</h3>

        <h4 className="mt-4 mb-2 font-semibold">Token Bucket</h4>
        <p>
          Tokens are added at a fixed rate. Each request consumes a token. If no tokens available, request is rejected.
        </p>
        <p>
          <strong>Advantages:</strong> Allows bursting (up to bucket size), smooths traffic over time.
        </p>
        <p>
          <strong>Use when:</strong> You want to allow occasional bursts while maintaining average rate.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Leaky Bucket</h4>
        <p>
          Requests enter a queue (bucket) and are processed at a fixed rate. If queue is full, requests are rejected.
        </p>
        <p>
          <strong>Advantages:</strong> Smooths out bursts, constant output rate.
        </p>
        <p>
          <strong>Use when:</strong> Backend has fixed capacity and needs steady traffic.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Sliding Window</h4>
        <p>
          Count requests in a rolling time window (e.g., last 60 seconds). Reject if count exceeds limit.
        </p>
        <p>
          <strong>Advantages:</strong> No boundary issues (unlike fixed windows).
        </p>
        <p>
          <strong>Use when:</strong> You need precise rate limiting without window boundary spikes.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rate Limit Headers</h3>
        <p>
          Always expose rate limit status to clients:
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          X-RateLimit-Limit: 1000
          X-RateLimit-Remaining: 950
          X-RateLimit-Reset: 1640000000
          Retry-After: 60
        </pre>
        <p>
          <strong>Fields:</strong>
        </p>
        <ul>
          <li><strong>Limit:</strong> Total requests allowed in window.</li>
          <li><strong>Remaining:</strong> Requests remaining in current window.</li>
          <li><strong>Reset:</strong> Unix timestamp when window resets.</li>
          <li><strong>Retry-After:</strong> Seconds to wait before retrying (on 429).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Quota Tiers</h3>
        <p>
          Different clients may have different limits:
        </p>
        <ul>
          <li><strong>Free tier:</strong> 100 requests/hour.</li>
          <li><strong>Pro tier:</strong> 10,000 requests/hour.</li>
          <li><strong>Enterprise tier:</strong> Custom limits.</li>
        </ul>
        <p>
          <strong>Implementation:</strong> Look up client&apos;s tier from API key, apply appropriate limit.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rate Limiting Best Practices</h3>
        <ul>
          <li><strong>Per-client limits:</strong> Rate limit by API key, not IP (shared IPs).</li>
          <li><strong>Graceful degradation:</strong> Return 429 with Retry-After, don&apos;t drop connections.</li>
          <li><strong>Document limits:</strong> Publish rate limits in documentation.</li>
          <li><strong>Monitor limit usage:</strong> Alert when clients approach limits (proactive outreach).</li>
          <li><strong>Allow limit increases:</strong> Provide process for clients to request higher limits.</li>
        </ul>
      </section>

      <section>
        <h2>Idempotency and Safe Retries</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Why Idempotency Matters</h3>
        <p>
          Network timeouts are common. Clients retry timed-out requests. Without idempotency, retries cause duplicates:
        </p>
        <ul>
          <li>Double charges (payment APIs).</li>
          <li>Duplicate orders (e-commerce).</li>
          <li>Duplicate messages (messaging APIs).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Idempotency Keys</h3>
        <p>
          Clients generate a unique key (UUID) and include it in the request:
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          {`POST /charges
Idempotency-Key: abc123
{ "amount": 1000, "currency": "usd" }

→ 200 OK { "id": "ch_123", "amount": 1000 }

(Retry with same key)
POST /charges
Idempotency-Key: abc123

→ 200 OK { "id": "ch_123", "amount": 1000 }  (same response, no duplicate charge)`}
        </pre>
        <p>
          <strong>Implementation:</strong>
        </p>
        <ol className="space-y-2">
          <li>Store request hash + response keyed by idempotency key.</li>
          <li>On duplicate key, return stored response without re-executing.</li>
          <li>Set TTL on idempotency keys (24 hours to 7 days).</li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Which Methods Need Idempotency?</h3>
        <ul>
          <li><strong>GET, HEAD:</strong> Already safe (no side effects).</li>
          <li><strong>PUT, DELETE:</strong> Already idempotent by nature.</li>
          <li><strong>POST:</strong> NOT idempotent—requires idempotency keys for retries.</li>
          <li><strong>PATCH:</strong> Depends on implementation—document idempotency behavior.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Idempotency Best Practices</h3>
        <ul>
          <li><strong>Document key format:</strong> UUID, max length, allowed characters.</li>
          <li><strong>Document TTL:</strong> How long keys are retained.</li>
          <li><strong>Return same response:</strong> Duplicate requests return identical response (including generated IDs).</li>
          <li><strong>Include idempotency info:</strong> Response header <code>X-Idempotency-Key: abc123</code> confirms key was used.</li>
        </ul>
      </section>

      <section>
        <h2>Observability and Debugging</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Request IDs</h3>
        <p>
          Every request should have a unique ID for tracing:
        </p>
        <ul>
          <li><strong>Generate:</strong> Server generates request ID (or client provides one).</li>
          <li><strong>Return:</strong> Include in response header <code>X-Request-ID: req_abc123</code>.</li>
          <li><strong>Log:</strong> Include in all log entries for the request.</li>
          <li><strong>Propagate:</strong> Pass to downstream services.</li>
        </ul>
        <p>
          <strong>Why:</strong> When a client reports an issue, the request ID lets you find all logs, traces, and errors for that request.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Response Headers for Debugging</h3>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          X-Request-ID: req_abc123
          X-Response-Time: 45ms
          X-RateLimit-Remaining: 950
          Cache-Control: max-age=60
          ETag: "abc123"
        </pre>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Logging Best Practices</h3>
        <ul>
          <li><strong>Log request metadata:</strong> Method, path, status code, response time, request ID.</li>
          <li><strong>Log errors with context:</strong> Include request ID, user ID, relevant parameters.</li>
          <li><strong>Don&apos;t log sensitive data:</strong> Never log passwords, tokens, PII.</li>
          <li><strong>Structured logging:</strong> Use JSON format for easy parsing.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Metrics to Track</h3>
        <ul>
          <li><strong>Latency:</strong> p50, p95, p99 by endpoint.</li>
          <li><strong>Error rates:</strong> 4xx and 5xx by endpoint.</li>
          <li><strong>Request volume:</strong> Requests per second by endpoint.</li>
          <li><strong>Rate limiting:</strong> Number of 429 responses.</li>
          <li><strong>Cache hit rate:</strong> Percentage of requests served from cache.</li>
        </ul>
      </section>

      <section>
        <h2>Documentation and Developer Experience</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">API Documentation Essentials</h3>
        <ul>
          <li><strong>Endpoint reference:</strong> Method, path, parameters, request/response schemas.</li>
          <li><strong>Authentication:</strong> How to authenticate (API keys, OAuth, etc.).</li>
          <li><strong>Error codes:</strong> Complete list of error codes and meanings.</li>
          <li><strong>Rate limits:</strong> Published limits for each tier.</li>
          <li><strong>Examples:</strong> Request and example responses for each endpoint.</li>
          <li><strong>SDKs:</strong> Official client libraries in popular languages.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">OpenAPI/Swagger</h3>
        <p>
          Use OpenAPI (Swagger) for machine-readable API specs:
        </p>
        <ul>
          <li><strong>Auto-generated docs:</strong> Tools like Swagger UI render interactive docs.</li>
          <li><strong>Code generation:</strong> Generate client SDKs in multiple languages.</li>
          <li><strong>Contract testing:</strong> Validate implementation against spec.</li>
          <li><strong>Version control:</strong> Track API changes in git.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Interactive Documentation</h3>
        <p>
          Provide &quot;try it out&quot; functionality:
        </p>
        <ul>
          <li><strong>Stripe-style docs:</strong> Show code examples in multiple languages (curl, Python, JavaScript, etc.).</li>
          <li><strong>Live testing:</strong> Allow developers to test API calls directly in docs.</li>
          <li><strong>Sandbox environment:</strong> Provide test API keys and sandbox data.</li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Stripe Payment API (Idempotency Done Right)</h3>
        <p>
          <strong>Challenge:</strong> Payment APIs must prevent duplicate charges from network retries.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>Idempotency keys for all POST requests.</li>
          <li>Keys retained for 24 hours.</li>
          <li>Same response returned for duplicate keys (including charge ID).</li>
          <li>Clear documentation on idempotency behavior.</li>
        </ul>
        <p>
          <strong>Result:</strong> Developers can safely retry timed-out requests without fear of double-charging customers.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. GitHub API (Pagination at Scale)</h3>
        <p>
          <strong>Challenge:</strong> GitHub has billions of resources (repos, issues, commits). Efficient pagination is critical.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>Link headers for pagination (<code>Link: &lt;next&gt;, &lt;last&gt;</code>).</li>
          <li>Cursor-based pagination for large collections.</li>
          <li>Default limit of 30, max of 100.</li>
          <li>Clear documentation on pagination behavior.</li>
        </ul>
        <p>
          <strong>Result:</strong> Clients can efficiently iterate over large result sets without performance degradation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. Twilio API (Versioning Strategy)</h3>
        <p>
          <strong>Challenge:</strong> Twilio serves millions of developers. Breaking changes would be catastrophic.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>URL versioning (<code>/2010-04-01/...</code>).</li>
          <li>Long deprecation windows (12+ months).</li>
          <li>Deprecation headers in responses.</li>
          <li>Proactive outreach to developers using old versions.</li>
        </ul>
        <p>
          <strong>Result:</strong> Smooth migrations with minimal disruption to developers.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. Shopify API (Rate Limiting with Tiers)</h3>
        <p>
          <strong>Challenge:</strong> Shopify has free and paid plans. Rate limits must reflect pricing tiers.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>Leaky bucket algorithm.</li>
          <li>Different limits per plan (Basic, Shopify, Plus).</li>
          <li>Clear headers (<code>X-Shopify-Shop-Domain</code>, <code>X-RateLimit-Limit</code>).</li>
          <li>GraphQL cost-based limiting (complex queries cost more).</li>
        </ul>
        <p>
          <strong>Result:</strong> Fair usage across tiers, protection against abuse.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">5. Slack API (Error Handling Done Right)</h3>
        <p>
          <strong>Challenge:</strong> Slack API is used by millions of developers. Clear errors reduce support burden.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>Consistent error format (<code>{`{ "ok": false, "error": "invalid_auth" }`}</code>).</li>
          <li>Descriptive error codes.</li>
          <li>Documentation links for each error.</li>
          <li>Request IDs for debugging.</li>
        </ul>
        <p>
          <strong>Result:</strong> Developers can self-serve debug most issues without contacting support.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">6. Netflix API (Field Selection for Performance)</h3>
        <p>
          <strong>Challenge:</strong> Netflix serves billions of API calls daily. Payload size matters for mobile users.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>GraphQL for flexible field selection.</li>
          <li>Clients request only needed fields.</li>
          <li>Reduced payload size (50-80% smaller).</li>
          <li>Faster mobile load times.</li>
        </ul>
        <p>
          <strong>Result:</strong> Improved mobile performance, reduced bandwidth costs.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>

        <ul className="space-y-3">
          <li>
            <strong>Inconsistent naming:</strong> Some endpoints use <code>/users</code>, others use <code>/getUsers</code>. <strong>Solution:</strong> API style guide with linting in CI.
          </li>
          <li>
            <strong>Unpaginated endpoints:</strong> <code>GET /all-users</code> returns 100,000 rows. <strong>Solution:</strong> All collection endpoints MUST paginate. Enforce in code review.
          </li>
          <li>
            <strong>200 for errors:</strong> Returning HTTP 200 with <code>{`{ "success": false }`}</code>. <strong>Solution:</strong> Use appropriate status codes (400, 401, 403, 404, etc.).
          </li>
          <li>
            <strong>Breaking changes without versioning:</strong> Removing a field breaks clients. <strong>Solution:</strong> Additive changes only, or version the API with deprecation timeline.
          </li>
          <li>
            <strong>Missing rate limits:</strong> API can be abused. <strong>Solution:</strong> Implement rate limiting with clear headers and documentation.
          </li>
          <li>
            <strong>No idempotency for POST:</strong> Retries cause duplicates. <strong>Solution:</strong> Idempotency keys for all POST endpoints that create resources.
          </li>
          <li>
            <strong>Inconsistent error formats:</strong> Different endpoints return different error shapes. <strong>Solution:</strong> Standardize error format across all endpoints.
          </li>
          <li>
            <strong>Missing request IDs:</strong> Debugging production issues is impossible. <strong>Solution:</strong> Generate and return request ID for every request.
          </li>
          <li>
            <strong>Poor documentation:</strong> Developers can&apos;t self-serve. <strong>Solution:</strong> Invest in interactive docs with examples, SDKs, and clear error documentation.
          </li>
          <li>
            <strong>No field selection:</strong> Clients forced to fetch entire objects. <strong>Solution:</strong> Support <code>fields</code> parameter or GraphQL for sparse fieldsets.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: What&apos;s the difference between offset and cursor pagination? When would you use each?</p>
            <p className="mt-2 text-sm">
              A: Offset pagination uses <code>OFFSET N LIMIT M</code>—simple but performance degrades with depth (scans N+M rows). Results can shift under concurrent writes. Cursor pagination uses an opaque cursor pointing to a position—consistent performance (uses index), stable results under writes, but no random access. Use offset for small datasets (&lt;10K rows) or when random page access is needed. Use cursor for large datasets, frequently-updated data, or performance-critical APIs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: How do you design idempotency for a payment API?</p>
            <p className="mt-2 text-sm">
              A: Require clients to send an <code>Idempotency-Key</code> header (UUID). Server stores request hash + response keyed by this token. On duplicate key, return stored response without re-executing. Retain keys for 24 hours to 7 days. Return same response (including generated charge ID) for duplicates. Document key format, TTL, and behavior. This allows safe retries of timed-out requests without double-charging.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: What&apos;s your API versioning strategy? When do you version vs. make additive changes?</p>
            <p className="mt-2 text-sm">
              A: Prefer additive changes (add fields, don&apos;t remove). Clients should ignore unknown fields. Version only for breaking changes: removing fields, changing types, changing auth. Use URL versioning (<code>/v1/</code>, <code>/v2/</code>) for simplicity. Deprecation: announce 6-12 months ahead, add deprecation headers, provide migration guide, monitor usage, then sunset. Goal: minimize versioning while maintaining backward compatibility.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: How do you design rate limiting? What algorithm would you choose?</p>
            <p className="mt-2 text-sm">
              A: Rate limiting protects backend and ensures fair usage. Token bucket allows bursting while maintaining average rate—good for most APIs. Leaky bucket smooths traffic—good for fixed-capacity backends. Sliding window is precise but more complex. Expose limits via headers (<code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>). Return 429 with <code>Retry-After</code> when exceeded. Per-client limits (by API key, not IP). Document limits and provide process for increases.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: What makes a good error response?</p>
            <p className="mt-2 text-sm">
              A: Consistent format across all endpoints. Machine-readable error code (stable across versions). Human-readable message. Request ID for debugging. Field-level details for validation errors. Appropriate HTTP status code (400 for validation, 401 for auth, 403 for permission, 404 for not found, 429 for rate limit, 500 for server errors). Error codes should map to client actions (e.g., <code>rate_limit_exceeded</code> → wait and retry).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: How do you handle filtering, sorting, and field selection in APIs?</p>
            <p className="mt-2 text-sm">
              A: Filtering: query parameters (<code>?status=active&amp;role=admin</code>). Support operators (gte, lte, contains). Validate filter values. Sorting: <code>?sort=-created_at</code> for descending. Document default sort. Field selection: <code>?fields=id,name,email</code> to reduce payload. Always include ID. Expansions: <code>?expand=user,items</code> to include related resources (limit depth to prevent abuse). Document all supported options.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://stripe.com/docs/api" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Stripe API Documentation - Industry-leading API design
            </a>
          </li>
          <li>
            <a href="https://docs.github.com/en/rest" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub REST API Documentation - Pagination and versioning examples
            </a>
          </li>
          <li>
            <a href="https://swagger.io/specification/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OpenAPI Specification - Machine-readable API contracts
            </a>
          </li>
          <li>
            <a href="https://jsonapi.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              JSON:API Specification - Standardized API format
            </a>
          </li>
          <li>
            <a href="https://martinfowler.com/articles/richardsonMaturityModel.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Richardson Maturity Model - REST API maturity levels
            </a>
          </li>
          <li>
            <a href="https://www.twilio.com/docs/usage/api" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Twilio API Documentation - Versioning best practices
            </a>
          </li>
          <li>
            <strong>Books:</strong> &quot;API Design Patterns&quot; by JJ Geewax, &quot;Build APIs You Won&apos;t Hate&quot; by Phil Sturgeon
          </li>
          <li>
            <strong>Guides:</strong> Google API Design Guide, Microsoft REST API Guidelines, Zalando REST API Guidelines
          </li>
        </ul>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          API design is a critical skill for backend engineers. Well-designed APIs are predictable, maintainable, and performant. Key principles include: consistent resource naming (nouns, plurals, lowercase), proper pagination (cursor for scale), clear error handling (consistent format, appropriate status codes), backward compatibility (additive changes, versioning for breaking changes), rate limiting (protect backend, fair usage), idempotency (safe retries for POST), and excellent documentation (OpenAPI, examples, SDKs).
        </p>
        <p>
          For staff/principal engineer interviews, expect to discuss: pagination strategies (offset vs cursor), idempotency implementation, versioning approaches, rate limiting algorithms, error handling design, and real-world examples from APIs you&apos;ve designed. The key is demonstrating understanding of trade-offs and the ability to design APIs that scale while maintaining excellent developer experience.
        </p>
      </section>
    </ArticleLayout>
  );
}
