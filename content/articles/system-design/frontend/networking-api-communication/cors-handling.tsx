"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-cors-handling",
  title: "CORS Handling",
  description:
    "Deep dive into Cross-Origin Resource Sharing (CORS) covering same-origin policy, preflight requests, credentials, wildcard policies, and building frontend applications that safely interact with cross-origin APIs.",
  category: "frontend",
  subcategory: "networking-api-communication",
  slug: "cors-handling",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "frontend",
    "CORS",
    "security",
    "same-origin",
    "preflight",
    "credentials",
    "cross-origin",
  ],
  relatedTopics: [
    "rest-api-design",
    "security",
    "request-cancellation",
    "api-rate-limiting",
  ],
};

export default function CorsHandlingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="important">
          <strong>Cross-Origin Resource Sharing (CORS)</strong> is a security
          mechanism that relaxes the Same-Origin Policy (SOP), allowing web
          applications to request resources from domains different from the one
          that served the web page. The Same-Origin Policy, introduced in
          Netscape Navigator 2.0 (1995) and still fundamental to web security
          today, prevents a malicious site from reading data from a
          user's session on another site (e.g., preventing evil.com from reading
          your Gmail inbox). CORS provides a controlled, opt-in mechanism for
          servers to declare which origins are permitted to access their
          resources, enabling legitimate cross-origin API consumption while
          maintaining security boundaries.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          CORS works through a system of HTTP headers exchanged between browser
          and server. When a frontend application makes a cross-origin request,
          the browser automatically adds an <strong>Origin</strong> header
          identifying the requesting domain. The server responds with{" "}
          <strong>Access-Control-Allow-Origin</strong> (specifying which origins
          can access the resource), optionally accompanied by headers like{" "}
          <strong>Access-Control-Allow-Methods</strong> (permitted HTTP
          methods), <strong>Access-Control-Allow-Headers</strong> (permitted
          request headers), and <strong>Access-Control-Allow-Credentials</strong>{" "}
          (whether cookies/auth headers can be sent). The browser enforces these
          policies -- if the server's response does not include the requesting
          origin in Access-Control-Allow-Origin, the browser blocks the response
          from reaching the application JavaScript, even though the request
          itself succeeded.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          At a staff or principal engineer level, understanding CORS requires
          distinguishing between the security model (what CORS protects against)
          and the operational challenges (how CORS impacts frontend
          architecture). CORS does not protect against CSRF (Cross-Site Request
          Forgery) -- it protects against unauthorized cross-origin{" "}
          <strong>reads</strong>. A malicious site can still make POST requests
          to your API (CSRF), but without proper CORS headers, it cannot read
          the response. This distinction is critical: CORS is about data
          exfiltration prevention, not mutation prevention. For mutations, you
          need CSRF tokens, SameSite cookies, and other defenses.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The operational impact of CORS on frontend applications is substantial.
          Misconfigured CORS headers are a leading cause of production
          incidents: APIs that work in Postman fail in the browser, development
          environments that work locally break in production, and proxy
          configurations that work for same-origin requests fail for CDN-hosted
          assets. A deep understanding of CORS -- including the distinction
          between simple and preflighted requests, credential handling, wildcard
          policies, and Vary headers -- is essential for any engineer building
          production frontend applications.
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="important">
          CORS is built on six foundational concepts that govern how cross-origin
          requests are evaluated, permitted, or blocked:
        </HighlightBlock>
        <ul>
          <HighlightBlock as="li" tier="crucial">
            <strong>Origin and Same-Origin Policy:</strong> An origin is defined
            by the tuple of protocol (http/https), domain (example.com), and
            port (80/443/3000). Two URLs share the same origin only if all three
            components match: <code>https://example.com</code> and{" "}
            <code>https://api.example.com</code> are{" "}
            <strong>different origins</strong> (different domains), as are{" "}
            <code>https://example.com:80</code> and{" "}
            <code>https://example.com:443</code> (different ports), and{" "}
            <code>http://example.com</code> and{" "}
            <code>https://example.com</code> (different protocols). The
            Same-Origin Policy prevents JavaScript from reading responses from
            different origins. CORS provides the opt-in mechanism: servers
            explicitly declare which origins can access their resources via the
            Access-Control-Allow-Origin header. Note that the SOP applies to{" "}
            <strong>reading responses</strong>, not making requests -- a
            malicious site can still submit forms or POST data to your API, but
            it cannot read the response without CORS permission.
          </HighlightBlock>
          <li>
            <strong>Simple vs Preflight Requests:</strong> CORS distinguishes
            between "simple" requests that can be sent directly and "preflight"
            requests that require a preliminary OPTIONS request. A request is
            simple if it uses GET, POST, or HEAD; has no custom headers beyond
            Accept, Accept-Language, Content-Language, Content-Type (with
            restrictions), and Range; and has Content-Type of
            application/x-www-form-urlencoded, multipart/form-data, or
            text/plain. Simple requests are sent directly with the Origin header
            -- the browser checks the response's Access-Control-Allow-Origin and
            either exposes the response to JavaScript or blocks it. Non-simple
            requests (using PUT, DELETE, custom headers, or application/json
            Content-Type) trigger a preflight: the browser first sends an OPTIONS
            request with Access-Control-Request-Method and
            Access-Control-Request-Headers headers, asking "can I send this
            request?" The server responds with Access-Control-Allow-Methods and
            Access-Control-Allow-Headers. Only if the preflight succeeds does
            the browser send the actual request.
          </li>
          <li>
            <strong>Credentials and Cookies:</strong> By default, cross-origin
            requests do not include credentials (cookies, HTTP authentication,
            client certificates). To send credentials, the frontend must set{" "}
            <code>withCredentials: true</code> (XHR) or{" "}
            <code>credentials: 'include'</code> (fetch), and the server must
            respond with <code>Access-Control-Allow-Credentials: true</code>.
            Critically, when credentials are used, Access-Control-Allow-Origin{" "}
            <strong>cannot be a wildcard (*)</strong> -- it must be the specific
            origin. This is a security requirement: allowing wildcard origins
            with credentials would let any site read authenticated data from
            your API. Additionally, the server should send{" "}
            <code>Vary: Origin</code> to ensure CDNs and caches do not serve a
            response with one origin's Access-Control-Allow-Origin to a
            different origin.
          </li>
          <li>
            <strong>Preflight Caching:</strong> To avoid the latency of a
            preflight OPTIONS request before every non-simple request, browsers
            cache preflight responses. The cache duration is controlled by the{" "}
            <strong>Access-Control-Max-Age</strong> header (in seconds). Without
            this header, browsers use a default cache duration (typically 5
            seconds in Chrome, though this varies). Setting Access-Control-Max-Age
            to a high value (e.g., 86400 for one day) means subsequent requests
            within that window skip the preflight, reducing latency by one round
            trip. However, the cache is per-origin, per-method, per-header
            combination -- changing the request headers or method triggers a new
            preflight. Also note that preflight cache behavior varies across
            browsers, so do not rely on it for correctness -- only for
            optimization.
          </li>
          <li>
            <strong>Wildcard Policies and Their Limitations:</strong> The{" "}
            <code>Access-Control-Allow-Origin: *</code> header allows any origin
            to access the resource. This is appropriate for public APIs that
            serve unauthenticated data (CDNs, public datasets, open APIs).
            However, wildcards have critical limitations: they cannot be used
            with <code>Access-Control-Allow-Credentials: true</code> (as
            mentioned above), and they do not work for requests with certain
            headers or methods that always trigger preflight. Additionally,
            wildcard policies do not mean "any request is allowed" -- the server
            still controls which methods and headers are permitted via
            Access-Control-Allow-Methods and Access-Control-Allow-Headers. For
            authenticated APIs, never use wildcard -- always echo back the
            specific requesting origin.
          </li>
          <li>
            <strong>Vary Header and CDN Caching:</strong> When a server returns
            different Access-Control-Allow-Origin values based on the requesting
            origin (e.g., dynamically echoing back the Origin header), it must
            include <code>Vary: Origin</code> in the response. This tells CDNs
            and intermediate caches that the response varies based on the Origin
            request header, preventing a response intended for
            https://app.example.com from being cached and served to
            https://evil.com. Without the Vary header, CDNs may cache the first
            response (with Access-Control-Allow-Origin: https://app.example.com)
            and serve it to all subsequent requests, including those from
            unauthorized origins. This is a subtle but critical configuration
            detail that is frequently missed in production deployments.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
      <p>
          The CORS request lifecycle differs significantly between simple and
          preflighted requests. Understanding both flows is essential for
          debugging CORS errors and designing APIs that minimize preflight
          overhead.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Simple Request Flow
          </h3>
          <ol className="space-y-3">
            <li>
              <strong>1. Browser Sends Request:</strong> JavaScript makes a
              cross-origin GET/POST/HEAD request with simple headers. Browser
              adds Origin: https://app.example.com
            </li>
            <li>
              <strong>2. Server Responds:</strong> Server includes
              Access-Control-Allow-Origin: https://app.example.com (or *)
            </li>
            <li>
              <strong>3. Browser Checks:</strong> Browser compares request
              origin with Access-Control-Allow-Origin value
            </li>
            <li>
              <strong>4a. Match:</strong> If origin matches (or header is *),
              browser exposes response to JavaScript
            </li>
            <li>
              <strong>4b. No Match:</strong> If origin does not match, browser
              blocks response -- JavaScript sees a network error
            </li>
          </ol>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Preflight Request Flow
          </h3>
          <ol className="space-y-3">
            <li>
              <strong>1. Browser Sends OPTIONS:</strong> Before the actual
              request, browser sends OPTIONS with Access-Control-Request-Method:
              PUT and Access-Control-Request-Headers: X-Custom-Header
            </li>
            <li>
              <strong>2. Server Responds to Preflight:</strong> Server returns
              Access-Control-Allow-Methods: PUT, POST, Access-Control-Allow-Headers:
              X-Custom-Header, Content-Type, and optionally
              Access-Control-Max-Age: 86400
            </li>
            <li>
              <strong>3. Browser Validates:</strong> Browser checks if requested
              method and headers are in allowed lists
            </li>
            <li>
              <strong>4a. Valid:</strong> Browser caches preflight response (if
              Max-Age set), then sends actual PUT request
            </li>
            <li>
              <strong>4b. Invalid:</strong> Browser blocks request -- JavaScript
              sees a CORS error
            </li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/cors-preflight-flow.svg"
          alt="CORS Preflight Request Flow Diagram"
          caption="CORS Preflight Flow: Browser sends OPTIONS preflight request, server responds with allowed methods/headers, then browser sends actual request if preflight succeeds"
          captionTier="crucial"
        />

        <HighlightBlock as="p" tier="important">
          The preflight flow introduces an additional round trip that impacts
          latency, especially on high-latency mobile networks. A typical
          preflight adds 50-200ms to request latency depending on network
          conditions. This is why minimizing preflight requests is a
          performance optimization: using simple requests where possible,
          caching preflight responses with Max-Age, and designing APIs that do
          not require custom headers all reduce CORS-related latency.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/cors-simple-vs-preflight.svg"
          alt="Simple vs Preflight CORS Request Comparison"
          caption="Simple requests (GET/POST/HEAD with simple headers) go directly, while non-simple requests (PUT/DELETE/custom headers) require a preflight OPTIONS request first"
          captionTier="important"
        />

        <HighlightBlock as="p" tier="crucial">
          For credentials-based authentication, the flow is more complex. When{" "}
          <code>credentials: 'include'</code> is set, the browser includes
          cookies with the cross-origin request. The server must respond with
          both <code>Access-Control-Allow-Credentials: true</code> and a
          specific origin (not wildcard). If the server returns wildcard with
          credentials, the browser blocks the response. Additionally, the
          frontend origin must be explicitly whitelisted on the server -- the
          server cannot use wildcard and must dynamically echo back the Origin
          header or maintain a whitelist of allowed origins.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/cors-decision-tree.svg"
          alt="CORS Decision Tree Diagram"
          caption="CORS Decision Tree: Is request simple? If yes, send directly. If no, send preflight. Check credentials? If yes, require specific origin (no wildcard). Validate headers and methods at each step."
          captionTier="crucial"
        />

        <HighlightBlock as="p" tier="important">
          From an architecture perspective, CORS configuration should be
          centralized in an API gateway or reverse proxy layer rather than
          implemented in each backend service. This ensures consistent CORS
          policies across all endpoints, simplifies configuration management,
          and allows operations teams to adjust CORS settings without deploying
          application code. Common patterns include: maintaining a whitelist of
          allowed origins in environment variables, dynamically echoing the
          Origin header if it matches the whitelist, setting appropriate
          Access-Control-Max-Age values based on API stability, and including
          Vary: Origin on all CORS responses to ensure proper CDN caching
          behavior.
        </HighlightBlock>
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
            <HighlightBlock as="tr" tier="important">
              <td className="p-3">
                <strong>Wildcard Origin (*)</strong>
              </td>
              <td className="p-3">
                • Simplest configuration -- one header works for all origins
                <br />
                • Ideal for public APIs and CDNs
                <br />• No origin validation overhead
              </td>
              <td className="p-3">
                • Cannot be used with credentials/cookies
                <br />
                • Allows any site to consume your API
                <br />• No granular origin-based access control
              </td>
            </HighlightBlock>
            <HighlightBlock as="tr" tier="crucial">
              <td className="p-3">
                <strong>Specific Origin</strong>
              </td>
              <td className="p-3">
                • Works with credentials/authentication
                <br />
                • Granular control over which origins can access API
                <br />• Required for authenticated APIs
              </td>
              <td className="p-3">
                • Requires origin validation logic (whitelist or dynamic echo)
                <br />
                • Must maintain allowed origins list
                <br />• Vary: Origin required for proper CDN caching
              </td>
            </HighlightBlock>
            <HighlightBlock as="tr" tier="important">
              <td className="p-3">
                <strong>Preflight Caching</strong>
              </td>
              <td className="p-3">
                • Eliminates OPTIONS round trip for cached requests
                <br />
                • Reduces latency by 50-200ms per request
                <br />• Lower server load (fewer OPTIONS requests)
              </td>
              <td className="p-3">
                • Cache invalidation delay when CORS policy changes
                <br />
                • Varies by browser (inconsistent behavior)
                <br />• Per-method, per-header cache (limited benefit for diverse APIs)
              </td>
            </HighlightBlock>
            <HighlightBlock as="tr" tier="important">
              <td className="p-3">
                <strong>Dynamic Origin Echo</strong>
              </td>
              <td className="p-3">
                • Supports multiple allowed origins without hardcoding
                <br />
                • Works with credentials (unlike wildcard)
                <br />• Flexible for SaaS applications with customer domains
              </td>
              <td className="p-3">
                • Requires origin validation against whitelist
                <br />
                • Must set Vary: Origin to prevent cache poisoning
                <br />• Slightly more complex server configuration
              </td>
            </HighlightBlock>
          </tbody>
        </table>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">
            CORS vs JSONP vs Proxy: Cross-Origin Solutions Compared
          </h3>
          <p>
            Before CORS was widely supported (pre-2012),{" "}
            <strong>JSONP</strong> (JSON with Padding) was the primary technique
            for cross-origin data fetching. JSONP exploits the fact that{" "}
            <code>&lt;script&gt;</code> tags are not subject to SOP -- the
            server wraps JSON data in a callback function, and the client loads
            it as a script. JSONP only supports GET requests, has security risks
            (the server could return malicious JavaScript), and is now obsolete.
            Another approach is the <strong>server-side proxy</strong>: the
            frontend makes same-origin requests to your backend, which forwards
            them to the cross-origin API. This avoids CORS entirely but adds
            latency, complexity, and bandwidth costs (data flows through your
            server). CORS is the modern standard: it is secure, supports all
            HTTP methods, and has universal browser support. Use CORS for
            new implementations; avoid JSONP; use proxies only when the target
            API does not support CORS.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="important">
          These practices represent hard-won lessons from operating CORS-enabled
          frontend applications at scale:
        </HighlightBlock>
        <ol className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Use Specific Origins for Authenticated APIs:</strong> Never
            use <code>Access-Control-Allow-Origin: *</code> for APIs that
            require authentication or return sensitive data. Always validate the
            Origin header against a whitelist and echo back the specific
            matching origin. This prevents malicious sites from reading
            authenticated responses. For SaaS applications with customer
            domains, maintain a dynamic whitelist in your database and validate
            origins at runtime.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Always Include Vary: Origin:</strong> When using dynamic
            origin echo (different Access-Control-Allow-Origin values based on
            request), always include <code>Vary: Origin</code> in the response.
            This ensures CDNs and caches store separate responses per origin,
            preventing a response intended for your app from being served to a
            malicious site. This is critical even if you think your CDN is
            "smart" -- without Vary, cache behavior is undefined and may change
            with CDN configuration updates.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Set Access-Control-Max-Age for Stable APIs:</strong> For
            APIs with stable CORS policies (methods and headers do not change
            frequently), set <code>Access-Control-Max-Age: 86400</code> (24
            hours) to cache preflight responses. This eliminates the OPTIONS
            round trip for subsequent requests, reducing latency by 50-200ms.
            For APIs that change frequently, use a lower value (3600 for 1 hour)
            or omit the header to use browser defaults.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Minimize Custom Headers to Avoid Preflight:</strong> Design
            APIs to work with simple headers where possible. Custom headers
            trigger preflight requests, adding latency. If you must use custom
            headers, consider encoding data in the URL query string or request
            body (for POST) to keep the request "simple." For example, instead
            of <code>X-User-ID: 123</code>, use query parameter{" "}
            <code>?userId=123</code> for GET requests.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Handle OPTIONS Requests Efficiently:</strong> Preflight
            OPTIONS requests should be handled at the edge (API gateway, load
            balancer, reverse proxy) rather than reaching your application
            servers. Configure nginx, Cloudflare, or AWS ALB to respond to
            OPTIONS with appropriate CORS headers without proxying to backend
            services. This reduces backend load and latency for preflight
            requests.
          </HighlightBlock>
          <li>
            <strong>Test CORS in All Environments:</strong> CORS issues often
            surface only in production due to domain differences
            (localhost:3000 vs app.example.com). Test CORS configuration in
            development, staging, and production before launch. Use browser
            DevTools Network panel to verify Access-Control-Allow-Origin headers
            are present and correct. Test with credentials, custom headers, and
            non-simple methods to ensure preflight handling works.
          </li>
          <li>
            <strong>Document CORS Requirements for API Consumers:</strong> If
            you provide a public or partner API, document CORS requirements
            clearly: which origins are allowed, whether credentials are
            supported, which methods and headers are permitted, and preflight
            cache duration. This reduces support tickets and integration issues.
            Include example curl commands showing preflight requests and
            expected responses.
          </li>
          <li>
            <strong>Use CORS Middleware in Development:</strong> During local
            development, use CORS middleware (e.g., cors package for Express,
            django-cors-headers for Django) to automatically add permissive CORS
            headers. This allows frontend and backend to run on different ports
            (localhost:3000 and localhost:8000) without CORS errors. Never use
            development CORS settings in production -- always use explicit
            origin whitelists.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <HighlightBlock as="p" tier="important">
          These mistakes appear frequently even in production applications at
          well-funded companies:
        </HighlightBlock>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Using Wildcard with Credentials:</strong> Setting both{" "}
            <code>Access-Control-Allow-Origin: *</code> and{" "}
            <code>Access-Control-Allow-Credentials: true</code>. Browsers reject
            this combination -- the response is blocked even though both headers
            are present. The error message ("The value of the
            'Access-Control-Allow-Origin' header in the response must not be the
            wildcard '*' when the request's credentials mode is 'include'") is
            cryptic but the fix is simple: use specific origin echo instead of
            wildcard when credentials are needed.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Forgetting Vary: Origin:</strong> Returning dynamic
            Access-Control-Allow-Origin without <code>Vary: Origin</code>. CDNs
            cache the first response (e.g., with Access-Control-Allow-Origin:
            https://app.example.com) and serve it to all subsequent requests,
            including those from https://evil.com. The malicious site can then
            read responses it should not access. Always include Vary: Origin
            when origin values vary by request.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Not Handling OPTIONS Requests:</strong> Backend services
            that do not implement OPTIONS handlers, causing 404 or 405 responses
            to preflight requests. The browser sees the failed preflight and
            blocks the actual request. Ensure your framework or API gateway
            handles OPTIONS and returns 200 with appropriate CORS headers.
          </HighlightBlock>
          <li>
            <strong>CORS Errors Masking Real Issues:</strong> Assuming all
            cross-origin request failures are CORS issues. A 401 Unauthorized or
            500 Internal Server Error response without CORS headers will appear
            as a CORS error in the browser console ("No
            'Access-Control-Allow-Origin' header is present"). Check the Network
            tab to see the actual response status -- the real issue may be
            authentication or server errors, not CORS.
          </li>
          <li>
            <strong>Testing Only in Development:</strong> Development
            environments often use CORS middleware with permissive settings
            (allow all origins). Production uses strict whitelists. Testing only
            in development means CORS issues surface only after deployment.
            Always test with production-like CORS configuration in staging
            environments, including credential handling and preflight requests.
          </li>
          <li>
            <strong>Not Whitelisting All Required Methods:</strong> Returning{" "}
            <code>Access-Control-Allow-Methods: GET, POST</code> but the frontend
            needs PUT or DELETE. The preflight succeeds for GET/POST but fails
            for PUT/DELETE. Include all methods your API supports in
            Access-Control-Allow-Methods, even if some endpoints do not use all
            methods. A blanket "GET, POST, PUT, DELETE, PATCH, OPTIONS" is
            common and safe.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Ignoring Preflight Cache Invalidation:</strong> Setting a
            long Access-Control-Max-Age (e.g., 86400) and then changing CORS
            policies. Browsers that cached the old preflight response will
            continue using it for up to 24 hours, causing requests to fail with
            stale allowed methods/headers. For APIs with evolving CORS policies,
            use shorter Max-Age values or implement cache busting by changing
            the preflight request (e.g., adding a query parameter).
          </HighlightBlock>
          <li>
            <strong>Assuming CORS Applies to All Resources:</strong> CORS only
            applies to XMLHttpRequest and fetch API calls. It does not apply to{" "}
            <code>&lt;script&gt;</code> tags, <code>&lt;img&gt;</code> tags, or{" "}
            <code>&lt;link&gt;</code> stylesheets -- these can load cross-origin
            resources without CORS headers. However, JavaScript cannot read the
            content of these resources without CORS permission. This distinction
            is important: a malicious site can embed your images or scripts, but
            cannot read their content via JavaScript without CORS.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="important">
          CORS configuration is critical in these production scenarios:
        </HighlightBlock>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="important">
            <strong>Single-Page Application with Separate API Domain:</strong>{" "}
            A React app hosted on <code>https://app.example.com</code> consumes
            an API on <code>https://api.example.com</code>. Configuration: API
            server maintains whitelist [https://app.example.com,
            https://staging.example.com], validates Origin header against
            whitelist, echoes matching origin in Access-Control-Allow-Origin,
            includes <code>Vary: Origin</code>, sets Access-Control-Max-Age:
            86400, and allows methods GET, POST, PUT, DELETE, PATCH. For
            authenticated requests, also sets Access-Control-Allow-Credentials:
            true and frontend sets credentials: 'include'.
          </HighlightBlock>
          <li>
            <strong>SaaS Application with Customer Domains:</strong> A
            white-label SaaS product embedded on customer domains (customer1.com,
            customer2.com, etc.) needs to allow cross-origin API access from
            hundreds of customer domains. Configuration: maintain customer
            domains in database, validate Origin against database at runtime,
            echo matching origin in Access-Control-Allow-Origin, set Vary:
            Origin, and use moderate Access-Control-Max-Age (3600) to allow
            timely updates when customers change domains. For security, also
            validate Referer header as a secondary check.
          </li>
          <li>
            <strong>Public API with Wildcard CORS:</strong> A public API
            (e.g., weather data, cryptocurrency prices) that serves
            unauthenticated data wants to allow any website to consume it.
            Configuration: set <code>Access-Control-Allow-Origin: *</code>, no
            credentials allowed, allow GET and OPTIONS methods only, set
            Access-Control-Max-Age: 86400. This allows any website to fetch data
            via JavaScript without CORS errors. Authentication (if needed) is
            handled via API keys in query parameters, not cookies.
          </li>
          <li>
            <strong>Micro-Frontends Across Domains:</strong> A micro-frontend
            architecture where different teams own different UI fragments hosted
            on separate domains (team1.example.com, team2.example.com) that
            communicate with a shared API. Configuration: API allows all
            team-specific domains in whitelist, uses dynamic origin echo,
            enables credentials for shared authentication, and sets moderate
            Max-Age (7200) to balance performance with flexibility for adding
            new team domains.
          </li>
          <li>
            <strong>CDN-Hosted Static Assets:</strong> A CDN serves JavaScript,
            CSS, and font files that need to be loaded by cross-origin pages.
            Configuration: set <code>Access-Control-Allow-Origin: *</code> for
            fonts (required for @font-face to work cross-origin), enable CORS
            for JavaScript files (required for source maps and error tracking),
            and set long Max-Age (2592000 for 30 days) since CORS policies for
            static assets rarely change. For fonts, also ensure the CDN sends
            proper MIME types (font/woff2, application/font-woff).
          </li>
          <li>
            <strong>Third-Party Widget Integration:</strong> A company provides
            an embeddable widget (chat, analytics, payment form) that customers
            embed via <code>&lt;script&gt;</code> tag. The widget makes
            cross-origin API calls from the customer's domain. Configuration:
            maintain customer domain whitelist, validate Origin at runtime, echo
            specific origin, enable credentials if widget needs to maintain
            sessions, and document CORS requirements for customers. For added
            security, also implement CSP (Content Security Policy) to restrict
            where the widget can be embedded.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <HighlightBlock as="p" tier="crucial" className="font-semibold">
              Q1: Explain the difference between simple and preflight CORS
              requests. When is a preflight triggered?
            </HighlightBlock>
            <HighlightBlock as="p" tier="crucial" className="mt-2 text-sm">
              <strong>Answer:</strong> Simple requests use GET, POST, or HEAD
              methods, have no custom headers beyond a safe list (Accept,
              Accept-Language, Content-Language, Content-Type with restrictions,
              Range), and have Content-Type of
              application/x-www-form-urlencoded, multipart/form-data, or
              text/plain. Simple requests are sent directly -- the browser adds
              Origin and checks the response Access-Control-Allow-Origin.
              Preflight is triggered for: (1) Methods other than GET/POST/HEAD
              (PUT, DELETE, PATCH, etc.), (2) Custom headers not in the safe
              list (X-Custom-Header, Authorization, etc.), (3) Content-Type
              values other than the three allowed (e.g., application/json).
              Preflight sends an OPTIONS request first with
              Access-Control-Request-Method and Access-Control-Request-Headers,
              asking the server for permission before sending the actual
              request.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <HighlightBlock as="p" tier="crucial" className="font-semibold">
              Q2: Why can you not use Access-Control-Allow-Origin: * with
              credentials?
            </HighlightBlock>
            <HighlightBlock as="p" tier="crucial" className="mt-2 text-sm">
              <strong>Answer:</strong> This is a security requirement. If
              wildcard origins were allowed with credentials, any malicious site
              could make authenticated requests to your API and read the
              response. Imagine a user logged into bank.example.com with a
              session cookie. If bank.example.com returned Access-Control-Allow-Origin:
              * with Access-Control-Allow-Credentials: true, a malicious site
              evil.com could make a fetch request with credentials included and
              read the account data. By requiring specific origins with
              credentials, the browser ensures only trusted sites can read
              authenticated responses. The server must validate the Origin
              header and echo back the specific matching origin.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q3: Your frontend at https://app.example.com needs to call an API
              at https://api.example.com with cookies. What CORS headers are
              required?
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q4: How does CORS relate to CSRF? Does CORS protect against CSRF
              attacks?
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> CORS does not protect against CSRF. CORS
              protects against unauthorized cross-origin reads -- it prevents
              evil.com from reading data from your API. CSRF is about
              unauthorized cross-origin writes -- evil.com submitting a form or
              POST request to your API to perform an action. CORS does not
              prevent this: the malicious request still reaches your server, and
              your server processes it (if authentication is via cookies). CSRF
              protection requires: CSRF tokens (included in requests, validated
              by server), SameSite cookies (preventing cross-origin cookie
              sending), and origin/referrer validation. CORS and CSRF are
              complementary defenses addressing different attack vectors.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q5: What is the purpose of the Vary: Origin header in CORS
              responses?
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Vary: Origin tells CDNs and caches that
              the response varies based on the Origin request header. Without
              it, a CDN might cache a response with Access-Control-Allow-Origin:
              https://app.example.com and serve it to requests from
              https://evil.com, allowing evil.com to read data it should not
              access. With Vary: Origin, the CDN stores separate cache entries
              per origin, ensuring each origin receives the correct
              Access-Control-Allow-Origin value. This is critical when using
              dynamic origin echo (validating Origin against whitelist and
              echoing back the match). For static wildcard responses (*), Vary:
              Origin is not strictly required but is still good practice.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q6: How would you debug a CORS error that only occurs in
              production, not development?
            </p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> First, I would check the Network tab in
              browser DevTools to see the actual response headers -- is
              Access-Control-Allow-Origin present? Is it the correct origin? Is
              Vary: Origin present? Second, I would verify the production
              server CORS configuration differs from development (development
              often uses permissive middleware). Third, I would check if the
              request triggers preflight (custom headers, non-simple methods)
              and whether the OPTIONS request succeeds. Fourth, I would verify
              the Origin header sent by the browser matches what the server
              expects. Fifth, I would test with curl to isolate CORS from other
              issues (authentication, server errors). Common causes: production
              uses strict whitelist while development allows all, CDN strips
              CORS headers, load balancer does not forward OPTIONS to backend,
              or environment variables for allowed origins are misconfigured.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN Web Docs: Cross-Origin Resource Sharing (CORS)
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/cors/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C CORS Specification
            </a>
          </li>
          <li>
            <a
              href="https://fetch.spec.whatwg.org/#http-cors-protocol"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fetch Standard: CORS Protocol
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Cross-Origin Resource Sharing Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/web/updates/2020/03/cors"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Developers: Understanding CORS
            </a>
          </li>
          <li>
            <a
              href="https://www.akamai.com/blog/web-performance/cors-and-how-to-fix-them"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CORS Errors and How to Fix Them (Akamai)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
