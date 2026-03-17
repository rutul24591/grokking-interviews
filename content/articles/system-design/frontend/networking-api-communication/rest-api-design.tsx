"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-rest-api-design-concise",
  title: "REST API Design",
  description: "Comprehensive guide to RESTful API design from the frontend perspective covering resource modeling, HTTP methods, status codes, HATEOAS, pagination, versioning, and API consumption patterns.",
  category: "frontend",
  subcategory: "networking-api-communication",
  slug: "rest-api-design",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: ["frontend", "REST", "API", "HTTP", "HATEOAS", "pagination", "versioning"],
  relatedTopics: ["graphql", "request-batching", "cors-handling", "api-rate-limiting"],
};

export default function RestApiDesignConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>REST (Representational State Transfer)</strong> is an architectural style for designing networked
          applications, defined by Roy Fielding in his 2000 doctoral dissertation. REST is not a protocol or standard
          but a set of constraints that, when applied to the design of a system, create a scalable, performant, and
          maintainable distributed architecture. It has become the dominant paradigm for web API design, powering the
          vast majority of public and internal APIs consumed by frontend applications today.
        </p>
        <p>
          REST defines six architectural constraints. First, <strong>client-server separation</strong> mandates that the
          user interface concerns are decoupled from data storage concerns, allowing each to evolve independently. Second,
          <strong>statelessness</strong> requires that each request from client to server must contain all the information
          necessary to understand and process the request; the server holds no session state between calls. Third,
          <strong>cacheability</strong> demands that responses explicitly label themselves as cacheable or non-cacheable,
          enabling clients and intermediaries to reuse responses and reduce latency. Fourth, a <strong>uniform interface</strong>
          {" "}simplifies the architecture by applying four sub-constraints: identification of resources via URIs, manipulation
          of resources through representations, self-descriptive messages, and hypermedia as the engine of application
          state (HATEOAS). Fifth, a <strong>layered system</strong> allows intermediaries (proxies, gateways, CDNs) to be
          inserted between client and server without the client needing to know. Sixth, <strong>code-on-demand</strong>
          {" "}(optional) allows servers to extend client functionality by transferring executable code, such as JavaScript.
        </p>
        <p>
          At a staff or principal engineer level, it is important to understand the <strong>Richardson Maturity Model</strong>,
          which classifies APIs into four levels. Level 0 uses HTTP as a transport tunnel with a single URI and POST method
          for everything (RPC-style). Level 1 introduces individual resources with distinct URIs but still uses a single HTTP
          method. Level 2 adds correct use of HTTP verbs (GET, POST, PUT, DELETE) with proper status codes, and this is where
          the vast majority of production APIs land. Level 3 adds HATEOAS, where responses include hyperlinks that guide the
          client through valid state transitions. Virtually no public API reaches true Level 3. The persistent debate around
          whether an API is truly "RESTful" versus merely "REST-like" or "HTTP-based" stems from the fact that most APIs claiming
          to be RESTful only satisfy Levels 1 and 2. Fielding himself has argued that an API without HATEOAS should not be called
          REST, but pragmatism has won: the industry broadly uses "REST" to mean HTTP-based APIs with resource-oriented URLs
          and proper use of HTTP methods, regardless of HATEOAS compliance.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>Six foundational concepts underpin effective REST API design and consumption from the frontend:</p>
        <ul>
          <li>
            <strong>Resource-Oriented Design:</strong> Resources are the fundamental abstraction in REST. URIs identify
            resources using nouns, never verbs. The endpoint should be /users, not /getUsers or /createUser. Collections
            use plural nouns (/users), individual resources use identifiers (/users/42), and nested resources express
            relationships (/users/42/orders). This noun-based approach means the same URI supports multiple operations
            differentiated by HTTP method, keeping the API surface predictable and discoverable. At scale, resource
            naming conventions become a governance concern; teams need an API style guide to prevent inconsistencies
            like mixing /user-profiles with /userAccounts across services.
          </li>
          <li>
            <strong>HTTP Methods and Idempotency:</strong> GET retrieves a resource without side effects and is both safe
            and idempotent. POST creates a new resource and is neither safe nor idempotent; calling it twice creates two
            resources. PUT replaces a resource entirely and is idempotent; calling it multiple times with the same payload
            produces the same result. PATCH partially updates a resource and, depending on implementation, may or may not
            be idempotent. DELETE removes a resource and is idempotent; deleting the same resource twice results in the
            same final state. Understanding idempotency is critical for frontend retry logic: safe to retry GET, PUT, and
            DELETE on network failure, but retrying POST requires an idempotency key to prevent duplicate creation.
          </li>
          <li>
            <strong>Status Codes:</strong> HTTP status codes provide machine-readable semantics for responses. The 2xx
            family signals success: 200 OK for general success, 201 Created for resource creation (with a Location header
            pointing to the new resource), 204 No Content for successful deletion with no response body. The 3xx family
            handles redirection: 301 Moved Permanently, 304 Not Modified for conditional requests. The 4xx family indicates
            client errors: 400 Bad Request for malformed input, 401 Unauthorized for missing authentication, 403 Forbidden
            for insufficient permissions, 404 Not Found, 409 Conflict for state conflicts, 422 Unprocessable Entity for
            validation failures, and 429 Too Many Requests for rate limiting. The 5xx family signals server errors: 500
            Internal Server Error and 503 Service Unavailable. Frontend code should route error handling based on status
            code families, not individual codes, for resilience.
          </li>
          <li>
            <strong>Content Negotiation:</strong> The Accept header tells the server what response format the client
            prefers (application/json, application/xml, text/html). The Content-Type header describes the format of the
            request body. JSON has become the de facto standard for REST APIs, but content negotiation allows APIs to
            support multiple formats without changing URIs. Advanced negotiation includes Accept-Language for
            internationalization and Accept-Encoding for compression (gzip, br). From the frontend, always set explicit
            Accept and Content-Type headers rather than relying on server defaults to avoid subtle bugs when API gateway
            configurations change.
          </li>
          <li>
            <strong>HATEOAS (Hypermedia as the Engine of Application State):</strong> In a truly RESTful API, responses
            include links that describe what actions the client can take next. For example, a response for an order might
            include links to cancel, pay, or view the associated user. The client does not hardcode URI patterns but
            follows links dynamically. In practice, very few APIs implement full HATEOAS. Notable exceptions include the
            GitHub API, which includes pagination links and resource relationship URLs. For frontend developers, even
            partial adoption of HATEOAS (using Link headers for pagination, for instance) reduces coupling between client
            and server by allowing the server to change URI structures without breaking clients.
          </li>
          <li>
            <strong>Statelessness:</strong> Every request must carry all necessary context: authentication tokens (in
            Authorization headers, not cookies if possible), pagination cursors, filter parameters, and desired
            representations. The server maintains no session between requests. This constraint is what makes REST APIs
            horizontally scalable: any server instance can handle any request because there is no session affinity
            requirement. For the frontend, statelessness means the client is responsible for managing its own state,
            tracking auth tokens, maintaining pagination cursors, and reconstructing full request context on every call.
            This pushes complexity to the client but unlocks server-side scalability and simplifies caching at every layer.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          The REST request lifecycle from a frontend application follows a well-defined sequence. The client first
          constructs a URL by combining the base API URL with the resource path and any query parameters for filtering,
          sorting, or pagination. Next, the client sets request headers: Authorization for authentication (typically a
          Bearer token), Content-Type to describe the request body format, Accept to specify the desired response format,
          and optionally If-None-Match or If-Modified-Since for conditional requests that leverage caching. The client
          then selects the appropriate HTTP method based on the intended operation, attaches a request body for POST, PUT,
          or PATCH operations, and sends the request.
        </p>
        <p>
          On receiving the response, the frontend first inspects the status code to determine the broad outcome: success
          (2xx), redirection (3xx), client error (4xx), or server error (5xx). For success responses, it extracts the
          response body (typically JSON), parses it, and normalizes the data into the client-side state shape. For error
          responses, it parses the error body to extract machine-readable error codes and human-readable messages, then
          routes to appropriate error handling: retry for 429 (respecting Retry-After header), re-authenticate for 401,
          show validation errors for 422, or display generic error UI for 500. Response headers are also important:
          ETag and Last-Modified for subsequent conditional requests, Link for pagination URLs, X-RateLimit-Remaining
          for proactive rate limit management, and Cache-Control for client-side caching decisions.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/rest-request-flow.svg"
          alt="REST Request Lifecycle from Frontend to API"
          caption="REST Request Lifecycle - Complete flow from URL construction through response handling in a frontend application"
        />

        <p>
          <strong>Pagination</strong> is one of the most consequential API design decisions for frontend performance.
          Three dominant patterns exist. <strong>Offset-based pagination</strong> (page=2&amp;limit=20) is the simplest:
          the server skips offset rows and returns limit rows. It supports random access (jump to page 5) but suffers
          from data drift (items shifting between pages as new data is inserted) and degrades at high offsets because
          the database must scan and discard all preceding rows. <strong>Cursor-based pagination</strong> (after=abc123)
          uses an opaque cursor (often a base64-encoded identifier) to mark the position in the dataset. It is
          consistent under concurrent writes, performant at any depth, and is the standard for social feeds and
          real-time data. However, it does not support random page access. <strong>Keyset pagination</strong>
          {" "}(where id &gt; 100 order by id limit 20) is similar to cursor-based but uses actual column values rather
          than opaque tokens. It is the most performant approach when the sort key is indexed but requires the client
          to track the last-seen sort value. For frontend engineers, cursor-based pagination is generally the best
          default: it handles real-time data gracefully, prevents duplicate items in infinite scroll, and the opaque
          cursor hides implementation details from the client.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/rest-pagination-patterns.svg"
          alt="Comparison of REST Pagination Strategies"
          caption="Three pagination strategies compared: offset-based, cursor-based, and keyset pagination with their respective trade-offs"
        />

        <p>
          <strong>API versioning</strong> determines how breaking changes are introduced. URL path versioning (/v1/users,
          /v2/users) is the most common and most visible approach; it is simple to implement, easy to route, and obvious
          in documentation, but it duplicates endpoints. Header versioning (Accept: application/vnd.api+json;version=2)
          keeps URLs clean but is harder to test and less visible. Query parameter versioning (?version=2) is a middle
          ground. Stripe popularized date-based versioning where clients pin to an API version date and the server
          handles compatibility transformations internally; this is arguably the most client-friendly approach because
          it decouples deployment cadence from breaking changes, but it requires sophisticated server-side version
          management.
        </p>
      </section>

      <section>
        <h2>Implementation Examples</h2>
        <p>Frontend REST API consumption patterns and best practices:</p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">REST Client with Interceptors and Error Handling</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Cursor-Based Pagination Hook</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>
        </div>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
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
              <td className="p-3"><strong>Simplicity</strong></td>
              <td className="p-3">
                • Uses existing HTTP infrastructure natively<br/>
                • Well-understood by all developers<br/>
                • Minimal tooling required to get started
              </td>
              <td className="p-3">
                • No formal specification (unlike GraphQL SDL)<br/>
                • Inconsistencies across different teams and APIs<br/>
                • Requires organizational API governance
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Caching</strong></td>
              <td className="p-3">
                • Leverages HTTP caching natively (ETags, Cache-Control)<br/>
                • CDN-friendly with deterministic URLs<br/>
                • Browser cache works out of the box for GET
              </td>
              <td className="p-3">
                • POST/PUT/PATCH bypass caching entirely<br/>
                • Cache invalidation for related resources is complex<br/>
                • Over-caching stale data if headers misconfigured
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Over/Under-fetching</strong></td>
              <td className="p-3">
                • Sparse fieldsets (?fields=id,name) reduce payload<br/>
                • Resource embedding (?include=author) reduces round trips<br/>
                • Predictable response shapes per endpoint
              </td>
              <td className="p-3">
                • Fixed response shapes cause over-fetching by default<br/>
                • Multiple endpoints needed for different views<br/>
                • Under-fetching requires N+1 requests for related data
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Real-time</strong></td>
              <td className="p-3">
                • Simple polling with conditional GET (304 responses)<br/>
                • Long-polling works within HTTP semantics<br/>
                • Server-Sent Events for one-way streaming
              </td>
              <td className="p-3">
                • No built-in subscription model<br/>
                • Polling is wasteful for high-frequency updates<br/>
                • WebSockets needed for true bidirectional real-time
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Tooling</strong></td>
              <td className="p-3">
                • Massive ecosystem (Postman, Swagger, OpenAPI)<br/>
                • Auto-generated client SDKs from OpenAPI specs<br/>
                • Universal debugging with browser DevTools
              </td>
              <td className="p-3">
                • No intrinsic type system (unlike GraphQL schema)<br/>
                • Documentation can drift from implementation<br/>
                • No built-in query language for complex filtering
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/rest-vs-graphql.svg"
          alt="REST vs GraphQL Architecture Comparison"
          caption="REST uses multiple endpoints with fixed responses while GraphQL uses a single endpoint with flexible client-specified queries"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>Eight practices that distinguish senior frontend engineers in REST API consumption and design advocacy:</p>
        <ol className="space-y-3">
          <li>
            <strong>Use Proper HTTP Methods:</strong> Map CRUD operations to GET, POST, PUT/PATCH, DELETE consistently.
            Never use POST for idempotent operations. Leverage HEAD for existence checks and OPTIONS for CORS preflight
            understanding. The HTTP method communicates intent to every layer in the stack: CDNs cache GET responses,
            proxies log mutation methods differently, and browsers handle preflight only for non-simple methods.
          </li>
          <li>
            <strong>Implement Cursor-Based Pagination for Large Datasets:</strong> Default to cursor-based pagination
            for any dataset that grows over time. Use offset pagination only for small, static datasets where users need
            random page access (paginated admin tables). Always return pagination metadata (hasNextPage, cursor, total
            count if affordable to compute) in a consistent envelope so the frontend can render pagination UI and prefetch
            next pages.
          </li>
          <li>
            <strong>Version APIs in URL Path for Simplicity:</strong> While header-based versioning is technically purer,
            URL path versioning (/v1/users) is easier to test, document, route, and cache. It makes API version visible
            in logs and debugging tools. Reserve header or date-based versioning for platform APIs where backward
            compatibility windows are measured in years (Stripe model).
          </li>
          <li>
            <strong>Use ETags for Conditional Requests:</strong> Implement If-None-Match headers to avoid re-downloading
            unchanged data. This reduces bandwidth, speeds up repeat fetches (304 responses carry no body), and is
            especially impactful for list endpoints fetched on polling intervals. On the frontend, store ETags alongside
            cached responses and attach them automatically via request interceptors.
          </li>
          <li>
            <strong>Normalize API Responses on the Client:</strong> Flatten nested API responses into a normalized
            shape keyed by entity ID. This prevents data duplication across different views, simplifies cache updates
            when a single entity changes, and enables efficient lookups. Libraries like normalizr or manual
            normalization functions integrated into the API client layer make this systematic.
          </li>
          <li>
            <strong>Implement Request/Response Interceptors:</strong> Use interceptors (Axios interceptors, fetch
            wrappers) for cross-cutting concerns: attaching auth tokens, refreshing expired tokens with a mutex to
            prevent thundering herd, logging request timing, normalizing error shapes, and injecting correlation IDs.
            This keeps individual API calls clean and ensures consistent behavior across the application.
          </li>
          <li>
            <strong>Use OpenAPI/Swagger for Contract-First Design:</strong> Define the API contract in OpenAPI spec
            before implementation begins. Generate TypeScript types from the spec to ensure frontend and backend agree
            on shapes. Use tools like openapi-typescript or orval to auto-generate typed API clients. This eliminates
            an entire class of runtime type errors and makes API changes visible in code review diffs.
          </li>
          <li>
            <strong>Handle Partial Failures in Batch Endpoints:</strong> When consuming batch or bulk endpoints, design
            for partial success. The server may return 207 Multi-Status or a success response with per-item error
            details. The frontend must process each item individually, showing success for items that succeeded and
            retry options for items that failed. Never treat batch operations as all-or-nothing unless the API
            guarantees transactional semantics.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>Mistakes that reveal inexperience with REST API consumption at scale:</p>
        <ul className="space-y-3">
          <li>
            <strong>Using POST for Everything:</strong> Treating REST as RPC by using POST /api/getUsers instead of
            GET /api/users. This breaks HTTP caching (CDNs and browsers do not cache POST), prevents meaningful status
            code usage, and makes the API opaque to intermediaries. It is a sign of Level 0 on the Richardson Maturity
            Model and should be challenged in design reviews.
          </li>
          <li>
            <strong>Ignoring Idempotency:</strong> Retrying failed POST requests without idempotency keys causes
            duplicate resource creation: double charges, duplicate orders, repeated emails. The frontend must generate
            a unique idempotency key (UUID) per user action and include it in a header (Idempotency-Key) so the server
            can deduplicate. This is a payment-critical concern that is frequently overlooked until it causes real
            financial damage.
          </li>
          <li>
            <strong>Not Handling 429 (Rate Limit):</strong> Ignoring rate limit responses leads to cascading failures.
            The frontend must respect the Retry-After header, implement exponential backoff with jitter, and proactively
            track X-RateLimit-Remaining headers to throttle requests before hitting the limit. User-facing applications
            should queue and batch requests when approaching rate limits rather than failing.
          </li>
          <li>
            <strong>Over-fetching and the N+1 Problem:</strong> Fetching a list of resources and then making individual
            requests for each item to get related data (fetching 50 users, then 50 requests for their profiles). Solve
            this by requesting embedded resources (?include=profile), using batch endpoints (/users?ids=1,2,3), or
            switching to GraphQL for screens that aggregate data from multiple resource types.
          </li>
          <li>
            <strong>Inconsistent Error Response Formats:</strong> When different API endpoints return errors in different
            shapes (some with {"{"}&quot;error&quot;: &quot;message&quot;{"}"}, others with {"{"}&quot;errors&quot;: [...]{"}"}, others with
            {"{"}&quot;detail&quot;: &quot;...&quot;{"}"}), the frontend cannot write generic error handling. Advocate for a standard error
            envelope (RFC 7807 Problem Details is a good starting point) across all endpoints and normalize errors in the
            API client interceptor layer if the backend is inconsistent.
          </li>
          <li>
            <strong>Not Using Conditional Requests:</strong> Re-fetching unchanged data on every poll or navigation wastes
            bandwidth and server resources. ETags and Last-Modified headers enable 304 Not Modified responses that carry no
            body. For mobile-first applications, this saves significant data and latency. Implement conditional request
            logic in the API client layer so all GET requests benefit automatically.
          </li>
          <li>
            <strong>Tight Coupling to API Structure:</strong> Spreading API URL patterns, response parsing, and error
            handling across components creates fragile code. A change to the API response shape requires changes across
            dozens of files. Instead, centralize API calls in a service layer that maps API responses to client-side
            domain models. Components should never directly manipulate API response objects.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>Exemplary REST APIs and the design lessons they teach:</p>
        <ul className="space-y-3">
          <li>
            <strong>GitHub API:</strong> One of the most well-designed public REST APIs. It uses Level 2+ REST with
            consistent resource naming, proper status codes, link headers for pagination (partial HATEOAS), conditional
            requests with ETags, and extensive rate limiting with clear headers. The GitHub API demonstrates how
            pagination links in response headers decouple the client from URL structure changes.
          </li>
          <li>
            <strong>Stripe API:</strong> The gold standard for API versioning. Stripe uses date-based versioning
            (Stripe-Version: 2024-06-20) where each API key is pinned to a default version, and clients can override
            per-request. The server internally transforms between versions, allowing years of backward compatibility.
            Stripe also demonstrates excellent error response design with structured error objects containing type, code,
            message, and param fields.
          </li>
          <li>
            <strong>Twitter API v2:</strong> Demonstrates field-level control with ?fields=id,text,created_at and
            ?expansions=author_id,referenced_tweets.id to combat over-fetching. Their cursor-based pagination with
            next_token handles the immense scale of social feeds. The migration from v1.1 to v2 also illustrates the
            challenges of evolving a REST API used by millions of developers.
          </li>
          <li>
            <strong>Shopify API:</strong> Uniquely offers both REST and GraphQL for the same data, allowing developers
            to choose the right tool per use case. Their REST API uses cursor-based pagination (page_info parameter)
            after deprecating offset-based pagination at scale, illustrating the practical limits of offset pagination
            for large merchant catalogs.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use REST</h3>
          <p>REST is a poor fit for:</p>
          <ul className="mt-2 space-y-2">
            <li>• <strong>Real-time bidirectional communication:</strong> Chat, collaborative editing, and live gaming
              require WebSockets or WebTransport, not request-response.</li>
            <li>• <strong>Highly relational data graphs:</strong> When a single screen needs data from 5+ related resources
              with varying field requirements, GraphQL eliminates the N+1 problem that REST creates.</li>
            <li>• <strong>Mobile apps with bandwidth constraints:</strong> Fixed REST response shapes waste bytes on
              fields the mobile client does not display. GraphQL or sparse fieldset REST extensions are better.</li>
            <li>• <strong>Server-to-server streaming pipelines:</strong> gRPC with Protocol Buffers offers binary encoding,
              streaming, and code generation that REST/JSON cannot match for internal microservice communication.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Roy Fielding - Architectural Styles and the Design of Network-based Software Architectures (Chapter 5)
            </a>
          </li>
          <li>
            <a href="https://martinfowler.com/articles/richardsonMaturityModel.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler - Richardson Maturity Model
            </a>
          </li>
          <li>
            <a href="https://docs.github.com/en/rest" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub REST API Documentation - Exemplary REST Design
            </a>
          </li>
          <li>
            <a href="https://stripe.com/docs/api/versioning" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Stripe API Versioning - Date-Based Version Management
            </a>
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc7807" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 7807 - Problem Details for HTTP APIs
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What makes an API truly RESTful vs REST-like?</p>
            <p className="mt-2 text-sm">
              A: A truly RESTful API satisfies all six of Fielding&apos;s constraints, critically including HATEOAS
              (Level 3 on the Richardson Maturity Model). The API responses must contain hypermedia links that guide
              the client through valid state transitions, so the client discovers available actions dynamically rather
              than hardcoding URL patterns. In practice, almost no production API reaches Level 3. Most APIs described
              as &quot;RESTful&quot; are actually Level 2: they use resource-oriented URLs, proper HTTP methods, and
              meaningful status codes, but responses are static data without navigational links. The distinction matters
              architecturally because true HATEOAS decouples clients from server URL structures, allowing the server
              to evolve without breaking clients. However, the industry has pragmatically accepted Level 2 as
              &quot;REST&quot; because the cost of implementing and consuming full HATEOAS rarely justifies the
              benefits for most applications.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you design pagination for a feed with millions of items?</p>
            <p className="mt-2 text-sm">
              A: Cursor-based pagination is the only viable approach at this scale. Offset-based pagination breaks
              down because the database must scan all rows up to the offset before returning results, making deep
              pages increasingly expensive. With cursor-based pagination, each response includes an opaque cursor
              (typically the encoded ID or timestamp of the last item) and the client passes it as an &quot;after&quot;
              parameter for the next page. The server uses the cursor as a WHERE clause (WHERE created_at &lt;
              cursor_timestamp) with an indexed column, making every page equally fast regardless of depth. For
              real-time feeds where new items are inserted continuously, cursor-based pagination also prevents the
              &quot;shifting window&quot; problem where items appear on multiple pages. The response should include
              hasNextPage, endCursor, and optionally totalCount (only if computable without a full table scan). On
              the frontend, implement infinite scroll by fetching the next page when the user scrolls near the bottom,
              and merge new pages into a normalized cache keyed by item ID to prevent duplicates.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: REST vs GraphQL - how do you choose?</p>
            <p className="mt-2 text-sm">
              A: The decision is driven by the data access pattern, not personal preference. Choose REST when
              resources have well-defined, stable shapes consumed by few clients, when HTTP caching is critical
              (CDN layer, browser cache), when the team values simplicity and convention over flexibility, or when
              the API is public-facing and must be universally accessible. Choose GraphQL when the frontend needs
              to aggregate data from multiple resources in a single request, when different clients (web, mobile,
              TV) need different fields from the same data, when the data model is highly relational with deep nesting,
              or when rapid frontend iteration matters more than caching simplicity. In practice, many organizations
              use both: REST for simple CRUD microservices and public APIs, GraphQL as a BFF (Backend for Frontend)
              that aggregates multiple REST services into a single flexible endpoint. The worst choice is picking
              GraphQL for a simple CRUD app (unnecessary complexity) or sticking with REST when every page requires
              5+ waterfall requests to assemble its data (performance penalty).
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
