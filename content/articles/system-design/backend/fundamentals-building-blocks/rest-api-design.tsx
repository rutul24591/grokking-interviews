"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-rest-api-design-extensive",
  title: "REST API Design",
  description: "Comprehensive guide to REST API design covering resource modeling, HTTP semantics, status codes, pagination, versioning, caching, security, and production trade-offs.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "rest-api-design",
  version: "extensive",
  wordCount: 7000,
  readingTime: 28,
  lastUpdated: "2026-03-19",
  tags: ["backend", "api", "rest", "http", "design", "architecture", "best-practices"],
  relatedTopics: ["http-https-protocol", "api-design-best-practices", "request-response-lifecycle", "stateless-vs-stateful-services"],
};

export default function RestApiDesignArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>REST (Representational State Transfer)</strong> is an architectural style for designing networked applications, introduced by Roy Fielding in his 2000 doctoral dissertation. REST defines a set of constraints for building scalable, reliable, and maintainable APIs: uniform interface, stateless interactions, cacheability, layered systems, and code-on-demand (optional).
        </p>
        <p>
          In practice, a &quot;RESTful&quot; API is one where:
        </p>
        <ul>
          <li><strong>URLs identify resources</strong> (users, orders, products)—not actions.</li>
          <li><strong>HTTP methods communicate intent</strong> (GET = read, POST = create, PUT = replace, DELETE = remove).</li>
          <li><strong>Status codes communicate outcomes</strong> (200 = success, 404 = not found, 500 = server error).</li>
          <li><strong>Responses are self-descriptive</strong> (include links, metadata, and clear error messages).</li>
        </ul>
        <p>
          <strong>Why REST matters:</strong>
        </p>
        <ul>
          <li>
            <strong>Predictability:</strong> Developers familiar with REST conventions can integrate with your API quickly—no need to learn custom patterns.
          </li>
          <li>
            <strong>Scalability:</strong> Stateless requests enable horizontal scaling. Any server can handle any request.
          </li>
          <li>
            <strong>Cachability:</strong> REST leverages HTTP caching (Cache-Control, ETag) to reduce load and improve latency.
          </li>
          <li>
            <strong>Interoperability:</strong> REST works across languages, platforms, and frameworks. Any HTTP client can consume a REST API.
          </li>
        </ul>
        <p>
          <strong>REST vs. RPC vs. GraphQL:</strong>
        </p>
        <ul>
          <li><strong>REST:</strong> Resource-oriented, uses HTTP semantics, cacheable, mature tooling. Best for CRUD operations, public APIs.</li>
          <li><strong>RPC (gRPC, JSON-RPC):</strong> Action-oriented, efficient binary protocols (gRPC/Protobuf), streaming support. Best for internal service-to-service communication.</li>
          <li><strong>GraphQL:</strong> Query language, client specifies fields, single endpoint. Best for complex queries, mobile optimization, aggregating multiple data sources.</li>
        </ul>
        <p>
          This article focuses on REST API design—the most widely adopted approach for public and internal APIs.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: REST Is About Constraints, Not Features</h3>
          <p>
            REST is not a protocol or technology—it&apos;s a set of architectural constraints. An API is not &quot;RESTful&quot; because it uses JSON over HTTP. It&apos;s RESTful because it adheres to constraints: uniform interface (resources, standard methods, self-descriptive messages), stateless interactions, cacheability, and layered architecture. Violating these constraints (e.g., using POST for everything, embedding actions in URLs) creates an RPC-style API that lacks REST benefits.
          </p>
        </div>
      </section>

      <section>
        <h2>REST Architectural Constraints</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Uniform Interface</h3>
        <p>
          All resources are accessed using a consistent, standard interface:
        </p>
        <ul>
          <li><strong>Resource identification:</strong> Each resource has a unique URI (<code>/users/123</code>).</li>
          <li><strong>Resource manipulation through representations:</strong> Clients interact with resource representations (JSON, XML), not the resource directly.</li>
          <li><strong>Self-descriptive messages:</strong> Each request/response contains enough information to understand how to process it (method, status code, headers, body).</li>
          <li><strong>HATEOAS (Hypermedia as the Engine of Application State):</strong> Responses include links to related actions (optional in practice).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. Stateless Interactions</h3>
        <p>
          Each request contains all information needed to process it. The server does not store client context between requests:
        </p>
        <ul>
          <li><strong>Session state on client:</strong> Authentication tokens, pagination cursors are sent with each request.</li>
          <li><strong>Server benefits:</strong> Any server can handle any request, enabling horizontal scaling and simple failover.</li>
          <li><strong>Trade-off:</strong> Larger request payloads (client must send auth, context with each request).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. Cacheability</h3>
        <p>
          Responses must define themselves as cacheable or not:
        </p>
        <ul>
          <li><strong>Cache-Control headers:</strong> Define freshness (max-age), revalidation (ETag), and scope (public/private).</li>
          <li><strong>Benefits:</strong> Reduced server load, lower latency for clients, improved scalability.</li>
          <li><strong>Challenge:</strong> Determining what can be cached (public resources yes, user-specific data no).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. Layered System</h3>
        <p>
          Clients cannot tell whether they&apos;re connected to the end server or an intermediary:
        </p>
        <ul>
          <li><strong>Intermediaries:</strong> Load balancers, proxies, CDNs, API gateways.</li>
          <li><strong>Benefits:</strong> Security (hide internal structure), caching, load distribution.</li>
          <li><strong>Consideration:</strong> Intermediaries may modify requests/responses (headers, compression).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">5. Code on Demand (Optional)</h3>
        <p>
          Servers can send executable code to clients (JavaScript, applets). Rarely used in modern APIs.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/web-api-diagram.svg"
          alt="REST API Architecture showing clients, intermediaries, and servers"
          caption="REST Architecture: Uniform interface, stateless interactions, caching, and layered system enable scalable, maintainable APIs."
        />
      </section>

      <section>
        <h2>Resource Modeling</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What Is a Resource?</h3>
        <p>
          A resource is any concept, object, or entity that your API manages:
        </p>
        <ul>
          <li><strong>Concrete resources:</strong> Users, products, orders, invoices.</li>
          <li><strong>Abstract resources:</strong> Search results, reports, analytics.</li>
          <li><strong>Relationships:</strong> User&apos;s orders, product&apos;s reviews.</li>
        </ul>
        <p>
          <strong>Key principle:</strong> Resources should reflect business concepts, not database tables. A &quot;User&quot; resource may aggregate data from multiple tables (users, profiles, preferences).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/rest-api-crud-operations.svg"
          alt="REST API CRUD Operations"
          caption="CRUD operations mapped to HTTP methods: POST for Create, GET for Read, PUT/PATCH for Update, DELETE for Delete"
        />
      </section>

      <section>
        <h2>Resource Modeling</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">URL Design Best Practices</h3>

        <h4 className="mt-4 mb-2 font-semibold">Use Nouns, Not Verbs</h4>
        <p>
          RESTful APIs use nouns for resources and HTTP methods for actions. Good examples include GET for listing users, POST for creating users, GET for retrieving a specific user, PUT for updating, and DELETE for removing. Bad examples use verb-based URLs like getUsers, createUser, updateUser, or deleteUser because HTTP methods already convey the action.
        </p>
        <p>
          <strong>Why:</strong> HTTP methods already convey the action. Adding verbs to URLs is redundant and breaks REST conventions.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Use Plural Nouns for Collections</h4>
        <p>
          Use plural nouns for collection endpoints such as users for a collection of users, users/123 for a single user, and users/123/orders for orders belonging to a user.
        </p>
        <p>
          <strong>Why:</strong> Plurals clearly distinguish collection endpoints from single-resource endpoints.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Use Nested Resources for Ownership</h4>
        <p>
          Use nested paths to show ownership relationships such as users/123/orders for orders belonging to a user, orders/456/items for items in an order, and products/789/reviews for reviews for a product.
        </p>
        <p>
          <strong>Guideline:</strong> Limit nesting to 2 levels. Deep nesting is hard to read and suggests poor resource modeling.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Use Lowercase with Hyphens</h4>
        <p>
          URLs should be lowercase with hyphens for readability. Good examples include user-profiles and order-items. Bad examples include CamelCase, camelCase, or snake_case which are less common in URLs.
        </p>
        <p>
          <strong>Why:</strong> URLs are case-sensitive on some servers. Hyphens are more readable and SEO-friendly.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Use Opaque, Prefixed IDs</h4>
        <p>
          Use opaque, prefixed IDs such as users/usr_abc123 or orders/ord_xyz789. Avoid auto-increment integers which reveal business metrics, or raw UUIDs which are hard to read and lack context.
        </p>
        <p>
          <strong>Why:</strong> Opaque IDs hide implementation details. Prefixes make logs and debugging easier.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Resource Relationships</h3>
        <p>
          Model relationships explicitly:
        </p>
        <ul>
          <li><strong>One-to-many:</strong> <code>/users/123/orders</code> — Orders belonging to a user.</li>
          <li><strong>Many-to-many:</strong> <code>/users/123/roles</code> — Roles assigned to a user.</li>
          <li><strong>One-to-one:</strong> <code>/users/123/profile</code> — Profile for a user.</li>
        </ul>
        <p>
          <strong>Alternative:</strong> Use query parameters for relationships (<code>/orders?user_id=123</code>) when nesting is too deep or when the relationship is optional.
        </p>
      </section>

      <section>
        <h2>HTTP Methods and Semantics</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Purpose</th>
              <th className="p-3 text-left">Safe</th>
              <th className="p-3 text-left">Idempotent</th>
              <th className="p-3 text-left">Cacheable</th>
              <th className="p-3 text-left">Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>GET</strong></td>
              <td className="p-3">Retrieve resource</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Read operations</td>
            </tr>
            <tr>
              <td className="p-3"><strong>HEAD</strong></td>
              <td className="p-3">Get metadata only</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Check if resource exists, get headers</td>
            </tr>
            <tr>
              <td className="p-3"><strong>POST</strong></td>
              <td className="p-3">Create resource / trigger action</td>
              <td className="p-3">No</td>
              <td className="p-3">No</td>
              <td className="p-3">No</td>
              <td className="p-3">Create, submit form, trigger workflow</td>
            </tr>
            <tr>
              <td className="p-3"><strong>PUT</strong></td>
              <td className="p-3">Replace resource</td>
              <td className="p-3">No</td>
              <td className="p-3">Yes</td>
              <td className="p-3">No</td>
              <td className="p-3">Full update (replace entire resource)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>PATCH</strong></td>
              <td className="p-3">Partial update</td>
              <td className="p-3">No</td>
              <td className="p-3">Depends</td>
              <td className="p-3">No</td>
              <td className="p-3">Partial update (modify specific fields)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>DELETE</strong></td>
              <td className="p-3">Remove resource</td>
              <td className="p-3">No</td>
              <td className="p-3">Yes</td>
              <td className="p-3">No</td>
              <td className="p-3">Delete resource</td>
            </tr>
            <tr>
              <td className="p-3"><strong>OPTIONS</strong></td>
              <td className="p-3">Get supported methods</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Yes</td>
              <td className="p-3">CORS preflight, discover capabilities</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Safe Methods</h3>
        <p>
          Safe methods do not modify server state. They can be cached, prefetched, and retried without side effects:
        </p>
        <ul>
          <li><strong>GET:</strong> Retrieve data. Safe.</li>
          <li><strong>HEAD:</strong> Like GET, but headers only. Safe.</li>
          <li><strong>OPTIONS:</strong> Get supported methods. Safe.</li>
        </ul>
        <p>
          <strong>Why it matters:</strong> Browsers, proxies, and CDNs may prefetch or cache safe requests. Never use GET for actions that modify state (e.g., <code>GET /delete-user?id=123</code> is dangerous).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Idempotent Methods</h3>
        <p>
          Idempotent methods produce the same result regardless of how many times they&apos;re executed:
        </p>
        <ul>
          <li><strong>GET, HEAD, OPTIONS:</strong> Safe, so idempotent.</li>
          <li><strong>PUT:</strong> Replacing a resource with the same value twice has the same effect as once. Idempotent.</li>
          <li><strong>DELETE:</strong> Deleting an already-deleted resource has no additional effect. Idempotent.</li>
          <li><strong>PATCH:</strong> Depends on implementation. If patch is &quot;set field X to Y,&quot; idempotent. If patch is &quot;increment field X,&quot; not idempotent.</li>
          <li><strong>POST:</strong> Creating a resource twice may create two resources. NOT idempotent by default.</li>
        </ul>
        <p>
          <strong>Why it matters:</strong> Idempotent methods can be safely retried after timeouts. Non-idempotent methods (POST) require idempotency keys for safe retries.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Idempotency Keys for POST</h3>
        <p>
          For non-idempotent operations, use idempotency keys. Clients generate a unique key (UUID) and include it in the request header. The server stores the request hash and response keyed by idempotency key, then returns the stored response for duplicates. Keys should be retained for 24 hours to 7 days.
        </p>
      </section>

      <section>
        <h2>Status Codes and Error Handling</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Status Code Guidelines</h3>
        <p>
          Use status codes to communicate outcomes clearly:
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Status Code</th>
              <th className="p-3 text-left">Meaning</th>
              <th className="p-3 text-left">When to Use</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>200 OK</strong></td>
              <td className="p-3">Success</td>
              <td className="p-3">GET, PUT, PATCH succeeded</td>
            </tr>
            <tr>
              <td className="p-3"><strong>201 Created</strong></td>
              <td className="p-3">Resource created</td>
              <td className="p-3">POST succeeded (include Location header)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>204 No Content</strong></td>
              <td className="p-3">Success, no body</td>
              <td className="p-3">DELETE succeeded, or update with no response body</td>
            </tr>
            <tr>
              <td className="p-3"><strong>301 Moved Permanently</strong></td>
              <td className="p-3">Permanent redirect</td>
              <td className="p-3">Resource has new URL (cacheable)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>304 Not Modified</strong></td>
              <td className="p-3">Cache valid</td>
              <td className="p-3">Conditional GET with ETag/If-None-Match</td>
            </tr>
            <tr>
              <td className="p-3"><strong>400 Bad Request</strong></td>
              <td className="p-3">Invalid request</td>
              <td className="p-3">Validation errors, malformed syntax</td>
            </tr>
            <tr>
              <td className="p-3"><strong>401 Unauthorized</strong></td>
              <td className="p-3">Authentication required</td>
              <td className="p-3">Missing or invalid credentials</td>
            </tr>
            <tr>
              <td className="p-3"><strong>403 Forbidden</strong></td>
              <td className="p-3">Not authorized</td>
              <td className="p-3">Authenticated but lacks permission</td>
            </tr>
            <tr>
              <td className="p-3"><strong>404 Not Found</strong></td>
              <td className="p-3">Resource not found</td>
              <td className="p-3">Resource doesn&apos;t exist (or user lacks permission to know it exists)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>409 Conflict</strong></td>
              <td className="p-3">Conflict</td>
              <td className="p-3">Version mismatch, duplicate resource</td>
            </tr>
            <tr>
              <td className="p-3"><strong>422 Unprocessable Entity</strong></td>
              <td className="p-3">Validation error</td>
              <td className="p-3">Valid syntax but semantic errors (common in Rails APIs)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>429 Too Many Requests</strong></td>
              <td className="p-3">Rate limited</td>
              <td className="p-3">Exceeded rate limit (include Retry-After)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>500 Internal Server Error</strong></td>
              <td className="p-3">Server error</td>
              <td className="p-3">Unexpected error (retry with backoff)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>502 Bad Gateway</strong></td>
              <td className="p-3">Upstream error</td>
              <td className="p-3">Dependency returned invalid response</td>
            </tr>
            <tr>
              <td className="p-3"><strong>503 Service Unavailable</strong></td>
              <td className="p-3">Service down</td>
              <td className="p-3">Overloaded or maintenance (include Retry-After)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>504 Gateway Timeout</strong></td>
              <td className="p-3">Upstream timeout</td>
              <td className="p-3">Dependency didn&apos;t respond in time</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Status Code Mistakes</h3>
        <ul>
          <li><strong>Returning 200 for errors:</strong> Don&apos;t return <code>{`{ "success": false }`}</code> with HTTP 200. Use 4xx/5xx status codes.</li>
          <li><strong>Using 400 for auth errors:</strong> Use 401 (not authenticated) or 403 (not authorized), not 400.</li>
          <li><strong>Using 404 for auth errors:</strong> Don&apos;t return 404 for unauthorized access (reveals resource exists). Use 403 or 404 consistently.</li>
          <li><strong>Not using 201 for creates:</strong> POST that creates a resource should return 201 with Location header.</li>
          <li><strong>Using 500 for client errors:</strong> 500 means server bug. Use 4xx for client errors.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Response Format</h3>
        <p>
          Use a consistent error format across all endpoints with a nested error object containing machine-readable codes, human-readable messages, request IDs for debugging, and field-level details for validation failures.
        </p>
      </section>

      <section>
        <h2>Pagination, Filtering, and Sorting</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pagination Strategies</h3>

        <h4 className="mt-4 mb-2 font-semibold">Offset Pagination</h4>
        <p>
          Offset pagination uses offset and limit parameters to skip records and return a fixed-size page. It is simple and supports random access to any page. However, performance degrades with depth because large offsets require scanning many rows, and results can be inconsistent under concurrent writes.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Cursor Pagination</h4>
        <p>
          Cursor pagination uses an opaque cursor pointing to a position in the result set. The client receives a cursor with each response and uses it to fetch the next page. This approach provides consistent performance because it uses an index, and stable results under writes. However, it does not support random access and requires iterating from the start.
        </p>
        <p>
          <strong>Recommendation:</strong> Use cursor pagination for large datasets (over 10,000 rows) or frequently-updated data.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Filtering</h3>
        <p>
          Support filtering with query parameters for status, role, date ranges, and price ranges. Use consistent operators like gte, lte, min, and max. Document filterable fields, validate filter values (return 400 for invalid), and index filtered fields for performance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sorting</h3>
        <p>
          Support sorting with a sort parameter. Clients can sort by any field, with descending order indicated by a minus prefix or desc parameter. Multi-field sorting is also supported. Document default sort order, limit sortable fields (not all fields should be sortable), and always sort by a stable key for pagination consistency.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Field Selection</h3>
        <p>
          Allow clients to request specific fields using a fields parameter. This reduces payload size, improves performance, and enhances privacy by preventing clients from accessing sensitive fields. Always include ID, validate field names, and document available fields.
        </p>
      </section>

      <section>
        <h2>Versioning and Backward Compatibility</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Prefer Additive Changes</h3>
        <p>
          The safest API change is additive:
        </p>
        <ul>
          <li><strong>Safe:</strong> Adding new fields, endpoints, or optional parameters.</li>
          <li><strong>Breaking:</strong> Removing fields, changing types, changing default behavior.</li>
        </ul>
        <p>
          <strong>Rule:</strong> Clients should ignore unknown fields. This enables additive evolution without versioning.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Versioning Strategies</h3>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Strategy</th>
              <th className="p-3 text-left">Example</th>
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>URL Versioning</strong></td>
              <td className="p-3"><code>/v1/users</code>, <code>/v2/users</code></td>
              <td className="p-3">Simple, explicit, cacheable</td>
              <td className="p-3">Clutters URLs</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Header Versioning</strong></td>
              <td className="p-3"><code>Accept-Version: v2</code></td>
              <td className="p-3">Clean URLs</td>
              <td className="p-3">Harder to test, less cacheable</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Media Type Versioning</strong></td>
              <td className="p-3"><code>Accept: application/vnd.myapi.v2+json</code></td>
              <td className="p-3">RESTful, content negotiation</td>
              <td className="p-3">Complex, hard to implement</td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>Recommendation:</strong> URL versioning for simplicity and explicitness.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/api-versioning-strategies.svg"
          alt="API Versioning Strategies"
          caption="Three versioning approaches: URL versioning (simple, explicit), Header versioning (clean URLs), Media Type versioning (most RESTful)"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Deprecation Strategy</h3>
        <ol className="space-y-2">
          <li><strong>Announce:</strong> Email developers, update docs, add deprecation headers.</li>
          <li><strong>Timeline:</strong> Give 6-12 months for migration.</li>
          <li><strong>Monitor:</strong> Track API version usage.</li>
          <li><strong>Sunset:</strong> Return 410 Gone after timeline.</li>
        </ol>
        <p>
          Use standard deprecation headers to communicate the sunset timeline and provide a link to migration documentation.
        </p>
      </section>

      <section>
        <h2>Caching Strategies</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HTTP Caching Headers</h3>
        <ul>
          <li><strong>Cache-Control:</strong> <code>max-age=3600</code> (cache for 1 hour), <code>no-store</code> (don&apos;t cache), <code>private</code> (browser only).</li>
          <li><strong>ETag:</strong> Entity tag for validation (<code>&quot;abc123&quot;</code>).</li>
          <li><strong>Last-Modified:</strong> Timestamp for validation.</li>
          <li><strong>Vary:</strong> Headers that affect cache key (<code>Vary: Accept-Encoding</code>).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Caching by Content Type</h3>
        <ul>
          <li><strong>Static assets:</strong> <code>Cache-Control: public, max-age=31536000, immutable</code> (1 year).</li>
          <li><strong>HTML pages:</strong> <code>Cache-Control: no-cache</code> or <code>max-age=60</code>.</li>
          <li><strong>API responses (public):</strong> <code>Cache-Control: public, max-age=60, stale-while-revalidate=300</code>.</li>
          <li><strong>API responses (authenticated):</strong> <code>Cache-Control: private, no-store</code>.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Conditional Requests</h3>
        <p>
          Conditional requests use If-None-Match headers with ETag values. If the resource hasn't changed, the server returns 304 Not Modified with no body. This saves bandwidth and reduces server load.
        </p>
      </section>

      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Authentication</h3>
        <ul>
          <li><strong>Bearer Tokens:</strong> <code>Authorization: Bearer &lt;token&gt;</code>.</li>
          <li><strong>API Keys:</strong> <code>X-API-Key: &lt;key&gt;</code>.</li>
          <li><strong>OAuth 2.0:</strong> For delegated authorization.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Authorization</h3>
        <ul>
          <li><strong>Resource-level:</strong> Check ownership (<code>user_id == current_user.id</code>).</li>
          <li><strong>Role-based:</strong> Check roles/scopes (<code>user.has_role('admin')</code>).</li>
          <li><strong>Tenant isolation:</strong> Enforce tenant filter in every query.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rate Limiting</h3>
        <ul>
          <li><strong>Headers:</strong> <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, <code>Retry-After</code>.</li>
          <li><strong>Response:</strong> 429 Too Many Requests.</li>
          <li><strong>Strategy:</strong> Token bucket, sliding window.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Input Validation</h3>
        <ul>
          <li><strong>Validate all input:</strong> Query params, path params, body.</li>
          <li><strong>Return 400 for invalid input:</strong> Include field-level errors.</li>
          <li><strong>Sanitize output:</strong> Prevent XSS, injection attacks.</li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Stripe Payment API (Idempotency)</h3>
        <p>
          <strong>Challenge:</strong> Prevent duplicate charges from network retries.
        </p>
        <p>
          <strong>Solution:</strong> Idempotency keys for all POST requests. Keys retained for 24 hours. Same response returned for duplicates.
        </p>
        <p>
          <strong>Result:</strong> Safe retries, no duplicate charges.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. GitHub API (Pagination)</h3>
        <p>
          <strong>Challenge:</strong> Billions of resources (repos, issues, commits).
        </p>
        <p>
          <strong>Solution:</strong> Link headers for pagination, cursor-based for large collections, default limit 30, max 100.
        </p>
        <p>
          <strong>Result:</strong> Efficient iteration over large result sets.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. Twilio API (Versioning)</h3>
        <p>
          <strong>Challenge:</strong> Millions of developers, breaking changes catastrophic.
        </p>
        <p>
          <strong>Solution:</strong> URL versioning (<code>/2010-04-01/...</code>), 12+ month deprecation windows, proactive outreach.
        </p>
        <p>
          <strong>Result:</strong> Smooth migrations with minimal disruption.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. Shopify API (Rate Limiting)</h3>
        <p>
          <strong>Challenge:</strong> Free and paid plans, fair usage.
        </p>
        <p>
          <strong>Solution:</strong> Leaky bucket algorithm, different limits per plan, clear headers, GraphQL cost-based limiting.
        </p>
        <p>
          <strong>Result:</strong> Fair usage, abuse prevention.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">5. Slack API (Error Handling)</h3>
        <p>
          <strong>Challenge:</strong> Millions of developers, reduce support burden.
        </p>
        <p>
          <strong>Solution:</strong> Consistent error format, descriptive codes, documentation links, request IDs.
        </p>
        <p>
          <strong>Result:</strong> Self-serve debugging, reduced support tickets.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">6. Netflix API (Field Selection)</h3>
        <p>
          <strong>Challenge:</strong> Billions of API calls daily, payload size matters.
        </p>
        <p>
          <strong>Solution:</strong> GraphQL for flexible field selection, clients request only needed fields.
        </p>
        <p>
          <strong>Result:</strong> 50-80% smaller payloads, faster mobile load times.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>

        <ul className="space-y-3">
          <li>
            <strong>Verb-based URLs:</strong> <code>/createUser</code> instead of <code>POST /users</code>. <strong>Solution:</strong> Use nouns, HTTP methods for actions.
          </li>
          <li>
            <strong>Unbounded list endpoints:</strong> <code>GET /all-users</code> returns 100,000 rows. <strong>Solution:</strong> All collections MUST paginate.
          </li>
          <li>
            <strong>200 for errors:</strong> Returning <code>{`{ "success": false }`}</code> with HTTP 200. <strong>Solution:</strong> Use appropriate 4xx/5xx status codes.
          </li>
          <li>
            <strong>Inconsistent error formats:</strong> Different endpoints return different error shapes. <strong>Solution:</strong> Standardize across all endpoints.
          </li>
          <li>
            <strong>Ignoring idempotency:</strong> POST without idempotency keys causes duplicates on retry. <strong>Solution:</strong> Idempotency keys for all create operations.
          </li>
          <li>
            <strong>Breaking changes without versioning:</strong> Removing fields breaks clients. <strong>Solution:</strong> Additive changes only, or version with deprecation timeline.
          </li>
          <li>
            <strong>Missing request IDs:</strong> Debugging production issues is impossible. <strong>Solution:</strong> Generate and return request ID for every request.
          </li>
          <li>
            <strong>No authorization at boundary:</strong> Authorization checked after query instead of in query. <strong>Solution:</strong> Enforce tenant/user filters in every query.
          </li>
          <li>
            <strong>Not using caching:</strong> Every request hits database. <strong>Solution:</strong> Use Cache-Control, ETag for cacheable resources.
          </li>
          <li>
            <strong>Poor documentation:</strong> Developers can&apos;t self-serve. <strong>Solution:</strong> Invest in interactive docs with examples, SDKs.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: What are the REST architectural constraints? Why do they matter?</p>
            <p className="mt-2 text-sm">
              A: REST constraints: (1) Uniform interface (resources, standard methods, self-descriptive messages), (2) Stateless interactions (no server-side session), (3) Cacheability (responses define cacheability), (4) Layered system (intermediaries), (5) Code on demand (optional). These constraints enable scalability (stateless = horizontal scaling), reliability (cacheability = reduced load), and maintainability (uniform interface = predictable APIs).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: What&apos;s the difference between PUT and PATCH? When would you use each?</p>
            <p className="mt-2 text-sm">
              A: PUT replaces the entire resource (client sends full resource representation). PATCH partially updates (client sends only changed fields). Use PUT when you want to replace the entire resource (idempotent, full update). Use PATCH when you want to modify specific fields (more efficient, but idempotency depends on implementation). Example: PUT /users/123 with full user object vs PATCH /users/123 with <code>{`{ "name": "New Name" }`}</code>.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: How do you design pagination for a large dataset (millions of rows)?</p>
            <p className="mt-2 text-sm">
              A: Use cursor pagination, not offset. Cursor pagination uses an opaque cursor pointing to a position (e.g., last seen ID). Query: <code>WHERE id &gt; last_seen_id ORDER BY id ASC LIMIT 21</code>. If 21 rows returned, has_more=true. Benefits: consistent performance (uses index, no OFFSET scan), stable results under concurrent writes. Include next_cursor and has_more in response. Document cursor format and expiration.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: How do you handle API versioning? What&apos;s your deprecation strategy?</p>
            <p className="mt-2 text-sm">
              A: Prefer additive changes (add fields, don&apos;t remove). Version only for breaking changes. Use URL versioning (<code>/v1/</code>, <code>/v2/</code>) for simplicity. Deprecation: announce 6-12 months ahead, add deprecation headers (<code>Deprecation: true</code>, <code>Sunset: ...</code>), provide migration guide, monitor usage, then return 410 Gone. Goal: minimize versioning while maintaining backward compatibility.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: What status codes would you use for: validation error, auth error, not found, rate limit, server error?</p>
            <p className="mt-2 text-sm">
              A: Validation error: 400 Bad Request or 422 Unprocessable Entity. Auth error: 401 Unauthorized (not authenticated) or 403 Forbidden (authenticated but not authorized). Not found: 404 Not Found. Rate limit: 429 Too Many Requests (include Retry-After header). Server error: 500 Internal Server Error (for bugs), 503 Service Unavailable (for overload/maintenance). Key: status codes should guide client behavior (retry vs don&apos;t retry).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: How do you ensure API security in a multi-tenant system?</p>
            <p className="mt-2 text-sm">
              A: (1) Authentication: verify identity (Bearer tokens, API keys). (2) Authorization: check permissions at resource boundary (user owns this resource? has required role?). (3) Tenant isolation: enforce tenant filter in EVERY query (WHERE tenant_id = current_tenant). Common bug: filter applied in one code path but not another → data leak. (4) Rate limiting: per-tenant limits to prevent noisy neighbors. (5) Input validation: sanitize all input, prevent injection attacks. (6) Audit logging: log all access for compliance.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Roy Fielding&apos;s Dissertation: REST Architectural Style - Original REST definition
            </a>
          </li>
          <li>
            <a href="https://stripe.com/docs/api" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Stripe API Documentation - Industry-leading REST API design
            </a>
          </li>
          <li>
            <a href="https://docs.github.com/en/rest" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub REST API Documentation - Pagination and versioning examples
            </a>
          </li>
          <li>
            <a href="https://jsonapi.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              JSON:API Specification - Standardized REST API format
            </a>
          </li>
          <li>
            <a href="https://martinfowler.com/articles/richardsonMaturityModel.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Richardson Maturity Model - REST API maturity levels
            </a>
          </li>
          <li>
            <a href="https://zalando.github.io/restful-api-guidelines/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Zalando REST API Guidelines - Comprehensive API design guide
            </a>
          </li>
          <li>
            <strong>Books:</strong> &quot;REST API Design Rulebook&quot; by Mark Masse, &quot;Build APIs You Won&apos;t Hate&quot; by Phil Sturgeon
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
