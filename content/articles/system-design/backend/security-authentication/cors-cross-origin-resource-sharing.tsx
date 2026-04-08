"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-cors-extensive",
  title: "CORS (Cross-Origin Resource Sharing)",
  description:
    "Staff-level deep dive into same-origin policy, CORS preflight mechanics, misconfiguration vulnerabilities, credential handling, and the operational practice of configuring CORS at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "cors-cross-origin-resource-sharing",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "cors", "browser", "web-security"],
  relatedTopics: ["csrf-protection", "xss-prevention", "security-headers", "api-security"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition and Context
          ============================================================ */}
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>CORS (Cross-Origin Resource Sharing)</strong> is a browser security mechanism that controls how
          web pages from one origin can request resources from a different origin. It is built on top of the
          same-origin policy — the foundational security model of the web that prevents a page from one origin
          (protocol, domain, and port) from reading resources from another origin. CORS provides a controlled
          exception to the same-origin policy, allowing servers to selectively permit cross-origin requests through
          HTTP headers.
        </p>
        <p>
          The same-origin policy exists to prevent malicious websites from reading sensitive data from other
          websites — without it, a malicious page could make requests to your bank&apos;s API and read your account
          balance, because the browser would automatically include your session cookies with the request. CORS allows
          legitimate cross-origin requests (e.g., a frontend app on app.example.com calling an API on
          api.example.com) while blocking malicious ones.
        </p>
        <p>
          CORS is often misunderstood as a server-side security feature — it is not. CORS is enforced by the
          browser, not the server. The server sends CORS headers to indicate which origins are allowed, but the
          browser is what actually enforces the policy. A malicious client (curl, Postman, a custom script) can
          bypass CORS entirely because it does not implement the same-origin policy. CORS protects users from
          malicious websites — it does not protect servers from malicious requests.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">What Defines an Origin</h3>
          <p className="text-muted mb-3">
            An origin is defined by the tuple (protocol, domain, port). Two URLs have the same origin if and only if they share the same protocol, domain, and port. For example:
          </p>
          <p className="mb-3">
            <strong>Same origin:</strong> https://example.com/page and https://example.com/api (same protocol, domain, and default port 443).
          </p>
          <p className="mb-3">
            <strong>Different origins:</strong> https://example.com and http://example.com (different protocol). https://example.com and https://api.example.com (different domain). https://example.com:443 and https://example.com:8443 (different port).
          </p>
          <p>
            <strong>Key insight:</strong> Subdomains are different origins. https://app.example.com and https://api.example.com are different origins, even though they share the same parent domain. This is intentional — a compromised subdomain should not be able to access resources from other subdomains.
          </p>
        </div>
        <p>
          CORS misconfigurations are a leading cause of data exposure vulnerabilities. Common mistakes include
          reflecting the Origin header without validation (allowing any origin), using wildcard origins with
          credentials (which browsers reject but misconfigured servers may still expose data), and trusting
          subdomain wildcards (*.example.com) that include attacker-controlled subdomains. Understanding CORS
          mechanics is essential for both frontend developers (who encounter CORS errors) and backend developers
          (who configure CORS policies).
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          CORS works by adding HTTP headers to requests and responses that indicate which origins are allowed to
          access the resource. When a browser makes a cross-origin request, it includes an Origin header indicating
          the requesting page&apos;s origin. The server responds with Access-Control-Allow-Origin indicating which
          origins are allowed to read the response. If the Origin matches an allowed origin, the browser allows the
          JavaScript to read the response. If not, the browser blocks the response and logs a CORS error to the
          console.
        </p>
        <p>
          There are two types of cross-origin requests: simple requests and preflighted requests. Simple requests
          are GET, HEAD, or POST requests with &quot;simple&quot; headers (Accept, Accept-Language, Content-Language,
          Content-Type with values application/x-www-form-urlencoded, multipart/form-data, or text/plain). Simple
          requests are sent directly — the browser checks the response&apos;s Access-Control-Allow-Origin header and
          allows or blocks the response accordingly.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/cors-cross-origin-resource-sharing-diagram-1.svg"
          alt="CORS architecture showing same-origin policy vs cross-origin requests with preflight flow"
          caption="CORS: same-origin requests (same protocol, domain, port) are allowed by default. Cross-origin requests are blocked unless the server sends appropriate CORS headers. Preflight requests (OPTIONS) are sent before non-simple requests."
        />
        <p>
          Preflighted requests are all other requests — PUT, DELETE, PATCH, requests with custom headers
          (Authorization, X-Custom-Header), or requests with non-standard Content-Types (application/json). Before
          sending the actual request, the browser sends a preflight OPTIONS request to the server, asking whether
          the actual request is allowed. The preflight request includes Access-Control-Request-Method (the method
          of the actual request) and Access-Control-Request-Headers (the headers of the actual request). The server
          responds with Access-Control-Allow-Methods and Access-Control-Allow-Headers indicating which methods and
          headers are allowed. If the preflight is approved, the browser sends the actual request.
        </p>
        <p>
          The preflight response can be cached using Access-Control-Max-Age, which specifies the number of seconds
          the browser should cache the preflight result. During the cache period, the browser does not send another
          preflight request for the same origin and method combination. The default max age is 5 seconds (in
          Chromium), but it can be set up to 86400 seconds (24 hours). Caching preflight results reduces latency
          — without caching, every non-simple request requires two round-trips (preflight + actual request).
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/cors-cross-origin-resource-sharing-diagram-2.svg"
          alt="CORS preflight flow showing OPTIONS request, preflight response headers, and actual request/response"
          caption="Preflight flow: browser sends OPTIONS request with Access-Control-Request-Method and Access-Control-Request-Headers. Server responds with allowed methods, headers, origin, and max-age. If approved, browser sends the actual request."
        />
        <p>
          Credentials (cookies, HTTP authentication, TLS client certificates) are handled differently in CORS. By
          default, cross-origin requests do not include credentials — the browser omits cookies and authentication
          headers. To include credentials, the JavaScript must set credentials: &apos;include&apos; (fetch API) or
          withCredentials: true (XMLHttpRequest), and the server must respond with
          Access-Control-Allow-Credentials: true. Importantly, if credentials are enabled, the server cannot use
          Access-Control-Allow-Origin: * — it must specify an explicit origin. This is a security requirement —
          wildcard origins with credentials would allow any website to read authenticated resources.
        </p>
        <p>
          CORS is not a substitute for server-side authentication and authorization. CORS controls which origins
          can read the response in the browser, but it does not prevent the request from reaching the server. A
          malicious client can bypass CORS entirely and send requests directly to the server. Therefore, servers
          must implement proper authentication (verifying the user&apos;s identity) and authorization (verifying the
          user&apos;s permissions) regardless of CORS configuration.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The CORS architecture consists of the browser (which enforces the same-origin policy and CORS headers),
          the client-side JavaScript (which makes cross-origin requests), and the server (which sends CORS headers
          to indicate which origins are allowed). The browser intercepts all cross-origin requests, checks the
          server&apos;s CORS headers, and allows or blocks the response accordingly. The server&apos;s role is to send the
          appropriate CORS headers — it does not enforce CORS, it merely informs the browser of its policy.
        </p>
        <p>
          The simple request flow begins with the browser sending the cross-origin request with an Origin header
          (indicating the requesting page&apos;s origin). The server processes the request and responds with the
          Access-Control-Allow-Origin header (indicating which origins are allowed to read the response). The browser
          checks whether the requesting origin matches the allowed origin — if yes, the JavaScript can read the
          response; if not, the browser blocks the response and logs a CORS error.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/cors-cross-origin-resource-sharing-diagram-3.svg"
          alt="CORS misconfigurations showing insecure vs secure CORS configurations"
          caption="CORS misconfigurations: wildcard origins with credentials, reflecting Origin without validation, allowing null origin, and subdomain wildcards. Secure configuration uses explicit origin whitelists, minimal methods/headers, and credentials only when required."
        />
        <p>
          The preflighted request flow begins with the browser sending an OPTIONS request to the server with
          Access-Control-Request-Method (the method of the actual request) and
          Access-Control-Request-Headers (the headers of the actual request). The server responds with
          Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers, and optionally
          Access-Control-Max-Age. If the preflight is approved, the browser sends the actual request with the same
          Origin header. The server processes the actual request and responds with Access-Control-Allow-Origin.
          The browser checks the response and allows or blocks it accordingly.
        </p>
        <p>
          CORS configuration on the server is typically implemented as middleware that intercepts all requests and
          adds the appropriate CORS headers. The middleware maintains a whitelist of allowed origins, methods, and
          headers, and it adds the CORS headers based on the request&apos;s Origin. For preflight requests (OPTIONS),
          the middleware responds immediately with the CORS headers without processing the request further. For
          actual requests, the middleware adds the CORS headers to the response after the request is processed.
        </p>
        <p>
          Origin validation is critical for CORS security — the server must validate the Origin header against a
          whitelist of allowed origins. The whitelist should contain explicit origins (https://app.example.com),
          not wildcards (*). If the Origin is not in the whitelist, the server should not send the
          Access-Control-Allow-Origin header (or send a 403 response). Reflecting the Origin header without
          validation is a common misconfiguration — it allows any origin to access the resource, defeating the
          purpose of CORS.
        </p>
        <p>
          Vary: Origin header is essential for caching — it tells intermediate caches (CDNs, proxies) that the
          response varies based on the Origin. Without Vary: Origin, a CDN may cache the response for one origin
          and serve it to a different origin, potentially exposing data to unauthorized origins. The server should
          always include Vary: Origin when sending CORS headers.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          Wildcard origin (*) versus explicit origin whitelist is the primary trade-off in CORS configuration.
          Wildcard origin allows any website to make cross-origin requests and read the response — it is the
          simplest configuration but provides no access control. Explicit origin whitelists allow only specific
          origins to access the resource — more secure but requires maintaining the whitelist as new frontends are
          added. For public APIs (where any website should be able to read the data), wildcard origin is
          appropriate. For authenticated APIs (where data is user-specific), explicit origin whitelists are
          required.
        </p>
        <p>
          Preflight caching (Access-Control-Max-Age) versus no caching is a trade-off between performance and
          flexibility. Caching preflight results reduces latency — the browser does not need to send an OPTIONS
          request before every non-simple request. However, caching means that changes to the CORS policy (adding
          a new origin, removing a method) are not reflected until the cache expires. The recommended approach is
          to set a moderate max-age (e.g., 86400 seconds = 24 hours) — this provides performance benefits while
          ensuring that policy changes take effect within a reasonable time.
        </p>
        <p>
          Credentials enabled versus credentials disabled is a trade-off between functionality and security. With
          credentials enabled (Access-Control-Allow-Credentials: true), cross-origin requests include cookies and
          authentication headers, enabling authenticated cross-origin requests. However, credentials require
          explicit origin whitelists (wildcard origins are not allowed), and they increase the risk of CSRF attacks
          (the browser automatically includes cookies with cross-origin requests). For APIs that require
          authentication, credentials are necessary. For public APIs, credentials should be disabled.
        </p>
        <p>
          CORS versus JSONP is a historical comparison — JSONP was the original workaround for cross-origin
          requests before CORS was widely supported. JSONP works by injecting a &lt;script&gt; tag (which is not subject
          to the same-origin policy) that calls a callback function with the response data. JSONP only supports GET
          requests, is vulnerable to XSS attacks (the response is executed as JavaScript), and provides no error
          handling. CORS is the modern, secure alternative — it supports all HTTP methods, provides proper error
          handling, and is enforced by the browser. JSONP should never be used in new systems.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use explicit origin whitelists — never use wildcard origins (*) for authenticated APIs. Maintain a
          whitelist of allowed origins and validate the request&apos;s Origin against the whitelist. If the Origin is
          not in the whitelist, do not send the Access-Control-Allow-Origin header. Explicit whitelists ensure that
          only trusted origins can access the resource.
        </p>
        <p>
          Never reflect the Origin header without validation — a common CORS misconfiguration is to reflect the
          request&apos;s Origin header in the Access-Control-Allow-Origin response header without checking whether the
          origin is trusted. This allows any website to access the resource, defeating the purpose of CORS. Always
          validate the Origin against a whitelist before reflecting it.
        </p>
        <p>
          Minimize allowed methods and headers — only include methods (GET, POST, PUT, DELETE) and headers
          (Authorization, Content-Type) that the API actually needs. Overly permissive methods and headers increase
          the attack surface — for example, allowing DELETE methods enables cross-origin deletion requests, which
          may be unexpected by the frontend.
        </p>
        <p>
          Set Access-Control-Max-Age to cache preflight results — this reduces latency by eliminating the need for
          OPTIONS requests before every non-simple request. Set the max-age to a reasonable value (e.g., 86400
          seconds = 24 hours) — long enough to provide performance benefits, but short enough that policy changes
          take effect within a reasonable time.
        </p>
        <p>
          Include Vary: Origin in all CORS responses — this tells intermediate caches (CDNs, proxies) that the
          response varies based on the Origin. Without Vary: Origin, a CDN may cache the response for one origin
          and serve it to a different origin, potentially exposing data to unauthorized origins.
        </p>
        <p>
          Disable credentials unless required — if the API does not need cookies or authentication headers for
          cross-origin requests, do not set Access-Control-Allow-Credentials: true. Disabling credentials reduces
          the risk of CSRF attacks and allows wildcard origins for public APIs.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Reflecting the Origin header without validation is the most common CORS misconfiguration. Servers that
          dynamically set Access-Control-Allow-Origin to the request&apos;s Origin without checking a whitelist allow
          any website to access the resource. This is equivalent to having no CORS policy at all. The fix is to
          validate the Origin against a whitelist before setting Access-Control-Allow-Origin.
        </p>
        <p>
          Using wildcard origin (*) with credentials is a misconfiguration that browsers reject, but misconfigured
          servers may still expose data. The combination of Access-Control-Allow-Origin: * and
          Access-Control-Allow-Credentials: true is explicitly forbidden by the CORS specification — browsers will
          block the response. However, some servers misconfigure CORS in a way that exposes data despite the
          browser&apos;s rejection. The fix is to use explicit origin whitelists when credentials are enabled.
        </p>
        <p>
          Allowing null origin is a common oversight. The null origin is used in specific contexts (sandboxed
          iframes, local file access, redirects from HTTPS to HTTP). Allowing null origin in
          Access-Control-Allow-Origin enables sandboxed iframes to read the response, which may bypass the
          same-origin policy. The fix is to not include null in the allowed origins unless it is explicitly
          required.
        </p>
        <p>
          Not including Vary: Origin causes caching issues — intermediate caches (CDNs, proxies) may cache the
          response for one origin and serve it to a different origin. This exposes data to unauthorized origins.
          The fix is to always include Vary: Origin when sending CORS headers.
        </p>
        <p>
          Assuming CORS protects the server from malicious requests is a common misconception. CORS is enforced by
          the browser — it prevents malicious websites from reading cross-origin responses. It does not prevent
          malicious clients (curl, Postman, custom scripts) from sending requests directly to the server. Servers
          must implement proper authentication and authorization regardless of CORS configuration.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses explicit origin whitelists for its API — the frontend app
          (https://app.example.com) is allowed to make cross-origin requests to the API
          (https://api.example.com), and the admin dashboard (https://admin.example.com) is allowed to make
          cross-origin requests to the admin API. The platform maintains a whitelist of allowed origins and
          validates the Origin header against the whitelist. The platform sets Access-Control-Max-Age to 86400
          seconds (24 hours) to cache preflight results and includes Vary: Origin in all CORS responses.
        </p>
        <p>
          A SaaS platform uses CORS for its public API — the API allows any origin to make GET requests
          (Access-Control-Allow-Origin: *) for public data, but requires explicit origin whitelists for
          authenticated requests (POST, PUT, DELETE) that include credentials. The platform implements CORS
          middleware that checks the request method — for GET requests, it returns wildcard origin; for other
          methods, it validates the Origin against a whitelist and includes credentials only for whitelisted
          origins.
        </p>
        <p>
          A financial services company uses strict CORS policies for its banking API — only the official banking
          app (https://bank.example.com) is allowed to make cross-origin requests. The company validates the Origin
          header against a single-element whitelist (https://bank.example.com) and includes
          Access-Control-Allow-Credentials: true for authenticated requests. The company monitors CORS errors and
          alerts on unexpected origins (which may indicate phishing attempts or misconfigured frontends).
        </p>
        <p>
          A technology company uses CORS for its microservices architecture — the API gateway handles CORS for all
          backend services, adding the appropriate CORS headers based on the request&apos;s Origin. The gateway
          maintains a centralized whitelist of allowed origins and propagates the CORS headers to all backend
          services. This ensures consistent CORS configuration across all services and simplifies backend service
          configuration (backend services do not need to handle CORS themselves).
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is the same-origin policy, and how does CORS relate to it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The same-origin policy is the foundational security model of the web — it prevents a web page from one origin (protocol, domain, port) from reading resources from another origin. Without it, a malicious website could make requests to your bank&apos;s API and read your account balance, because the browser would automatically include your session cookies.
            </p>
            <p>
              CORS is a controlled exception to the same-origin policy — it allows servers to selectively permit cross-origin requests through HTTP headers. The server sends Access-Control-Allow-Origin to indicate which origins are allowed, and the browser enforces the policy. CORS does not replace the same-origin policy — it provides a mechanism for servers to opt in to cross-origin access.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is a CORS preflight request, and when is it sent?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              A CORS preflight request is an OPTIONS request that the browser sends before the actual cross-origin request, asking the server whether the actual request is allowed. The preflight request includes Access-Control-Request-Method (the method of the actual request) and Access-Control-Request-Headers (the headers of the actual request).
            </p>
            <p>
              Preflight requests are sent for non-simple requests — any request that is not GET, HEAD, or POST with simple headers (Accept, Accept-Language, Content-Language, Content-Type with standard values). PUT, DELETE, PATCH, requests with custom headers (Authorization, X-Custom-Header), and requests with non-standard Content-Types (application/json) all require preflight. The server responds with Access-Control-Allow-Methods and Access-Control-Allow-Headers indicating which methods and headers are allowed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is the most common CORS misconfiguration, and how do you fix it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The most common CORS misconfiguration is reflecting the Origin header without validation — dynamically setting Access-Control-Allow-Origin to the request&apos;s Origin without checking whether the origin is trusted. This allows any website to access the resource, defeating the purpose of CORS.
            </p>
            <p>
              The fix is to validate the Origin against a whitelist of trusted origins before setting Access-Control-Allow-Origin. If the Origin is in the whitelist, set Access-Control-Allow-Origin to the Origin. If not, do not set the header (or return a 403 response). Never use wildcard origins (*) for authenticated APIs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: Why can&apos;t you use wildcard origin (*) with credentials?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The CORS specification explicitly forbids the combination of Access-Control-Allow-Origin: * and Access-Control-Allow-Credentials: true. If a server sends both, the browser will block the response. This is a security requirement — wildcard origins with credentials would allow any website to make authenticated cross-origin requests and read the response, effectively disabling authentication.
            </p>
            <p>
              If credentials are required, the server must use explicit origin whitelists — setting Access-Control-Allow-Origin to the specific origin (e.g., https://app.example.com) rather than *. This ensures that only trusted origins can make authenticated cross-origin requests.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: Does CORS protect the server from malicious requests?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              No. CORS is enforced by the browser — it prevents malicious websites from reading cross-origin responses. It does not prevent malicious clients (curl, Postman, custom scripts) from sending requests directly to the server, because these clients do not implement the same-origin policy and do not check CORS headers.
            </p>
            <p>
              Servers must implement proper authentication (verifying the user&apos;s identity) and authorization (verifying the user&apos;s permissions) regardless of CORS configuration. CORS is a browser security feature that protects users from malicious websites — it is not a server-side security feature.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://fetch.spec.whatwg.org/#http-cors-protocol" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WHATWG Fetch Standard: CORS Protocol
            </a> — The authoritative CORS specification.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: Cross-Origin Resource Sharing (CORS)
            </a> — Comprehensive CORS documentation with examples.
          </li>
          <li>
            <a href="https://portswigger.net/web-security/cors" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PortSwigger: CORS Vulnerabilities
            </a> — CORS misconfiguration attacks and defenses.
          </li>
          <li>
            <a href="https://web.dev/cross-origin-resource-policy/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev: Cross-Origin Resource Sharing
            </a> — Practical guide to CORS configuration.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#cross-origin-resource-sharing" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP: CORS Security
            </a> — CORS best practices for security.
          </li>
          <li>
            <a href="https://www.w3.org/TR/cors/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              W3C CORS Recommendation
            </a> — Original CORS specification.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}