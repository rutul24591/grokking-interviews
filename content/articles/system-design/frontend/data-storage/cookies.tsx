"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-cookies-concise",
  title: "Cookies",
  description: "Deep dive into HTTP cookies covering Set-Cookie attributes, security flags, SameSite policy, third-party cookies, GDPR, and modern cookie management.",
  category: "frontend",
  subcategory: "data-storage",
  slug: "cookies",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: ["frontend", "storage", "cookies", "HTTP", "SameSite", "security", "authentication"],
  relatedTopics: ["localstorage", "sessionstorage", "storage-quotas-and-eviction"],
};

export default function CookiesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          An <strong>HTTP cookie</strong> is a small piece of data (up to ~4 KB) that a server sends to a
          user&rsquo;s browser via the <code>Set-Cookie</code> response header. The browser stores it and
          automatically attaches it to every subsequent request to the same origin via the <code>Cookie</code>{" "}
          request header. Cookies were invented by Lou Montulli at Netscape in 1994 to solve a fundamental
          problem of the stateless HTTP protocol: how does a server remember who you are between requests?
        </p>
        <p>
          The formal specification is <strong>RFC 6265</strong> (HTTP State Management Mechanism, 2011),
          which superseded the original Netscape cookie spec and RFC 2965. Cookies remain the{" "}
          <em>only</em> browser storage mechanism that is automatically sent with every HTTP request --
          this is both their superpower and their primary performance concern. Unlike{" "}
          <code>localStorage</code>, <code>sessionStorage</code>, or IndexedDB, cookies are inherently
          server-readable without any client-side JavaScript intervention.
        </p>
        <p>
          Cookies are the original web storage mechanism. Before the Web Storage API (2009) and IndexedDB
          (2015), cookies were the sole option for persisting client-side state. Today, they remain
          indispensable for authentication (session IDs, JWTs), CSRF protection, server-side personalization,
          and any scenario where the server needs to read client state on every request. However, the
          landscape has shifted dramatically: third-party cookie deprecation, SameSite enforcement, CHIPS
          (Cookies Having Independent Partitioned State), and privacy regulations like GDPR and ePrivacy
          have fundamentally changed how cookies are used in modern applications.
        </p>
        <p>
          In system design interviews, cookies surface in discussions about authentication architecture,
          cross-origin security, session management, and the trade-offs between server-readable state
          (cookies) and client-only state (Web Storage). Understanding cookie attributes at depth -- not
          just that they exist, but <em>why</em> each flag matters -- distinguishes staff-level candidates.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <h3>Set-Cookie Header Attributes</h3>
        <p>
          When a server wants to set a cookie, it sends a <code>Set-Cookie</code> header in the HTTP
          response. Each attribute controls a different dimension of the cookie&rsquo;s behavior:
        </p>
        <ul>
          <li>
            <strong>Domain:</strong> Specifies which hosts the cookie is sent to. If set to{" "}
            <code>Domain=example.com</code>, the cookie is sent to <code>example.com</code> and all
            subdomains (<code>api.example.com</code>, <code>app.example.com</code>). If omitted, the
            cookie is only sent to the exact host that set it -- no subdomains. Omitting <code>Domain</code>{" "}
            is more restrictive and generally preferred for security-sensitive cookies.
          </li>
          <li>
            <strong>Path:</strong> Restricts the cookie to requests whose URL path starts with the given
            value. <code>Path=/api</code> means the cookie is only sent on requests to <code>/api/*</code>.
            Defaults to the path of the URL that set the cookie. Note: <code>Path</code> is not a
            security mechanism -- JavaScript on the same origin can still read cookies with different
            paths via <code>document.cookie</code> (unless <code>HttpOnly</code> is set).
          </li>
          <li>
            <strong>Expires / Max-Age:</strong> Controls the cookie&rsquo;s lifetime. <code>Expires</code>{" "}
            sets an absolute UTC date; <code>Max-Age</code> sets a relative duration in seconds.{" "}
            <code>Max-Age</code> takes precedence if both are present. If neither is set, the cookie is a{" "}
            <em>session cookie</em> that is deleted when the browser closes (though modern browsers with
            session restore may persist them). Setting <code>Max-Age=0</code> immediately deletes the cookie.
          </li>
          <li>
            <strong>Secure:</strong> The cookie is only sent over HTTPS connections. This prevents
            man-in-the-middle attacks on unsecured networks from sniffing session tokens. All
            authentication cookies must use this flag. As of 2024, Chrome requires <code>Secure</code>{" "}
            for any cookie with <code>SameSite=None</code>.
          </li>
          <li>
            <strong>HttpOnly:</strong> The cookie is inaccessible to JavaScript via{" "}
            <code>document.cookie</code>, <code>XMLHttpRequest</code>, and the Fetch API. This is the
            primary defense against XSS-based session hijacking. If an attacker injects a script, they
            cannot exfiltrate <code>HttpOnly</code> cookies. This flag should be set on all session and
            authentication cookies.
          </li>
          <li>
            <strong>SameSite:</strong> Controls whether the cookie is sent on cross-site requests. Three
            values exist: <code>Strict</code> (never sent cross-site), <code>Lax</code> (sent only on
            top-level navigations like clicking a link), and <code>None</code> (always sent, but requires{" "}
            <code>Secure</code>). Since Chrome 80 (2020), the default is <code>Lax</code> when no
            SameSite attribute is specified.
          </li>
        </ul>

        <h3>Cookie Prefixes</h3>
        <p>
          Cookie prefixes are a defense-in-depth mechanism that constrains how cookies can be set,
          preventing subdomain or path attacks:
        </p>
        <ul>
          <li>
            <strong>__Host-:</strong> The strictest prefix. Cookies with this prefix must be set with{" "}
            <code>Secure</code>, must not have a <code>Domain</code> attribute (locked to the exact host),
            and must have <code>Path=/</code>. This prevents a compromised subdomain from overwriting the
            parent domain&rsquo;s session cookie. Example:{" "}
            <code>Set-Cookie: __Host-session=abc123; Secure; Path=/; HttpOnly</code>.
          </li>
          <li>
            <strong>__Secure-:</strong> A lighter constraint. The cookie must be set with the{" "}
            <code>Secure</code> flag but can have a <code>Domain</code> attribute. This ensures the cookie
            was set over HTTPS but allows subdomain sharing.
          </li>
        </ul>

        <h3>Partitioned Cookies (CHIPS)</h3>
        <p>
          <strong>Cookies Having Independent Partitioned State (CHIPS)</strong> is a relatively new
          mechanism (Chrome 114+, 2023) designed to preserve legitimate third-party cookie use cases
          while preventing cross-site tracking. A partitioned cookie is keyed by the{" "}
          <em>top-level site</em> in addition to the cookie&rsquo;s domain. This means a third-party
          widget embedded on <code>site-a.com</code> and <code>site-b.com</code> gets separate cookie
          jars for each top-level site -- the widget cannot correlate users across sites.
        </p>
        <p>
          To opt in, the server sets: <code>Set-Cookie: __Host-id=xyz; Secure; Path=/; SameSite=None; Partitioned</code>.
          This is critical for embedded services like payment providers, customer support widgets, and
          federated login that legitimately need cookies in a third-party context but should not track
          users across the web.
        </p>

        <h3>The document.cookie API</h3>
        <p>
          Client-side JavaScript can read and write cookies (unless <code>HttpOnly</code> is set) via the{" "}
          <code>document.cookie</code> property. This API is notoriously awkward: reading returns all
          non-HttpOnly cookies as a single semicolon-delimited string (<code>&quot;name=val; other=val2&quot;</code>),
          and writing requires constructing the full <code>Set-Cookie</code> string manually. There is no
          built-in method to read a single cookie by name, parse expiration dates, or enumerate cookies.
          The <strong>Cookie Store API</strong> (Chrome 87+, not yet in Firefox/Safari as of early 2026)
          provides a modern Promise-based alternative with <code>cookieStore.get()</code>,{" "}
          <code>cookieStore.set()</code>, and a <code>change</code> event.
        </p>

        <h3>Cookie Jar Limits</h3>
        <p>
          Browsers impose limits on cookie storage. RFC 6265 recommends at least 50 cookies per domain
          and 4096 bytes per cookie (including name, value, and attributes). In practice, modern browsers
          allow approximately 180 cookies per domain (Chrome, Firefox) with 4 KB per individual cookie.
          Total storage across all domains is typically capped at around 3200 cookies. When limits are
          exceeded, browsers evict older or least-recently-used cookies silently -- there is no error or
          callback to the application.
        </p>

        <h3>First-Party vs. Third-Party Cookies</h3>
        <p>
          A <strong>first-party cookie</strong> is set by the domain in the browser&rsquo;s address bar.
          A <strong>third-party cookie</strong> is set by a different domain, typically via an embedded
          resource (script, iframe, image) from that domain. Third-party cookies have been the backbone
          of cross-site tracking and ad targeting for decades. Chrome&rsquo;s Privacy Sandbox initiative
          has been working to deprecate third-party cookies entirely, replacing them with purpose-built
          APIs (Topics API, Attribution Reporting, CHIPS). Safari (ITP) and Firefox (ETP) already block
          third-party cookies by default. Architects must design authentication and analytics systems
          that function without relying on third-party cookies.
        </p>

        <h3>Cookie Consent & GDPR</h3>
        <p>
          Under the EU&rsquo;s General Data Protection Regulation (GDPR) and the ePrivacy Directive,
          setting non-essential cookies without explicit user consent is illegal. &ldquo;Essential&rdquo;
          cookies (authentication, security, cart state) are exempt, but analytics, advertising, and
          personalization cookies require opt-in consent. This affects architecture: consent state must
          be checked <em>before</em> setting cookies, cookie banners must be implemented, and consent
          preferences themselves are typically stored in a first-party cookie (which is itself exempt as
          essential). The California Consumer Privacy Act (CCPA) has similar but distinct requirements,
          using an opt-out rather than opt-in model.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          The cookie lifecycle involves a continuous exchange between browser and server. On the initial
          request, the browser has no cookies for the domain. The server&rsquo;s response includes one or
          more <code>Set-Cookie</code> headers. The browser validates each cookie against its attributes
          (domain, secure, SameSite) and stores valid cookies in its cookie jar. On every subsequent request
          to the same domain (and matching path), the browser automatically attaches all applicable cookies
          in the <code>Cookie</code> header -- the developer writes no code to make this happen.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-storage/cookie-request-flow.svg"
          alt="Cookie Request-Response Flow Diagram"
        />

        <p>
          The <code>SameSite</code> attribute introduces conditional behavior based on the request context.
          When a user clicks a link from <code>external-site.com</code> to <code>your-site.com</code>,
          that is a top-level cross-site navigation. <code>SameSite=Lax</code> cookies are sent because
          it is a safe (GET) top-level navigation. However, if <code>external-site.com</code> embeds an
          iframe pointing to <code>your-site.com</code>, or makes a <code>fetch</code> call to your API,{" "}
          <code>Lax</code> cookies are <em>not</em> sent. <code>Strict</code> cookies are not sent in
          either cross-site scenario. <code>None</code> cookies are sent in all scenarios, provided the
          connection is HTTPS.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-storage/cookie-samesite.svg"
          alt="SameSite Cookie Policy Comparison Diagram"
        />

        <p>
          Understanding this flow is crucial for debugging authentication failures. A common production
          issue: a developer deploys a new subdomain (<code>app.example.com</code> to{" "}
          <code>new.example.com</code>) and wonders why session cookies are not sent. The answer is usually
          that the cookie was set without a <code>Domain</code> attribute (locked to the original host) or
          the <code>SameSite</code> attribute is blocking the cross-site context.
        </p>
      </section>

      <section>
        <h2>Trade-offs: Cookies vs. Other Storage Mechanisms</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left font-semibold">Dimension</th>
              <th className="p-3 text-left font-semibold">Cookies</th>
              <th className="p-3 text-left font-semibold">localStorage</th>
              <th className="p-3 text-left font-semibold">sessionStorage</th>
              <th className="p-3 text-left font-semibold">IndexedDB</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-medium">Capacity</td>
              <td className="p-3">~4 KB per cookie</td>
              <td className="p-3">5-10 MB</td>
              <td className="p-3">5-10 MB</td>
              <td className="p-3">Hundreds of MB+</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-medium">Sent with HTTP requests</td>
              <td className="p-3">Yes (automatic)</td>
              <td className="p-3">No</td>
              <td className="p-3">No</td>
              <td className="p-3">No</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-medium">Server-readable</td>
              <td className="p-3">Yes (every request)</td>
              <td className="p-3">No (JS only)</td>
              <td className="p-3">No (JS only)</td>
              <td className="p-3">No (JS only)</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-medium">Expiration control</td>
              <td className="p-3">Expires / Max-Age</td>
              <td className="p-3">Persistent (manual delete)</td>
              <td className="p-3">Tab lifetime</td>
              <td className="p-3">Persistent (manual delete)</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-medium">JS access control</td>
              <td className="p-3">HttpOnly blocks JS</td>
              <td className="p-3">Always accessible</td>
              <td className="p-3">Always accessible</td>
              <td className="p-3">Always accessible</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-medium">Cross-origin behavior</td>
              <td className="p-3">SameSite controls</td>
              <td className="p-3">Same-origin only</td>
              <td className="p-3">Same-origin only</td>
              <td className="p-3">Same-origin only</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-medium">API ergonomics</td>
              <td className="p-3">Poor (string-based)</td>
              <td className="p-3">Simple (key-value)</td>
              <td className="p-3">Simple (key-value)</td>
              <td className="p-3">Complex (async, transactional)</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-medium">Performance impact</td>
              <td className="p-3">Added to every request</td>
              <td className="p-3">None (client-only)</td>
              <td className="p-3">None (client-only)</td>
              <td className="p-3">None (client-only)</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-medium">Best for</td>
              <td className="p-3">Auth, server state</td>
              <td className="p-3">User preferences</td>
              <td className="p-3">Temporary form data</td>
              <td className="p-3">Large datasets, offline</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Always set HttpOnly on authentication cookies.</strong> Session tokens, JWTs stored as
            cookies, and CSRF tokens should never be accessible to JavaScript. This is the single most
            important defense against XSS-based session hijacking. If your framework exposes session cookies
            to <code>document.cookie</code>, it is misconfigured.
          </li>
          <li>
            <strong>Always set the Secure flag on cookies containing sensitive data.</strong> This prevents
            session tokens from being transmitted over unencrypted HTTP connections. In production, every
            cookie except localhost development cookies should be Secure.
          </li>
          <li>
            <strong>Default to SameSite=Lax.</strong> Browsers already enforce this as the default, but
            explicitly setting it documents your intent and prevents surprises if browser defaults ever
            change. Only use <code>SameSite=None</code> when you have a legitimate cross-site use case
            (embedded widgets, federated auth) and always pair it with <code>Secure</code> and consider{" "}
            <code>Partitioned</code>.
          </li>
          <li>
            <strong>Use __Host- prefix for session cookies.</strong> This prevents subdomain takeover
            attacks where a compromised subdomain overwrites the parent&rsquo;s session cookie. The prefix
            enforces <code>Secure</code>, <code>Path=/</code>, and no <code>Domain</code> attribute.
          </li>
          <li>
            <strong>Minimize cookie payload size.</strong> Every cookie is sent with every request to the
            matching domain. A 4 KB cookie on a domain that serves 50 resources per page load adds 200 KB
            of upload overhead. Store only opaque session identifiers in cookies -- keep the actual session
            data server-side (in Redis, a database, or a signed JWT where the server validates the signature).
          </li>
          <li>
            <strong>Use a separate cookieless domain for static assets.</strong> Serve images, CSS, and JS
            from a domain like <code>static.example.com</code> that has no cookies set. This avoids sending
            authentication cookies with every static resource request, reducing bandwidth and improving
            performance.
          </li>
          <li>
            <strong>Implement cookie consent management early.</strong> Do not bolt on GDPR compliance as
            an afterthought. Architect your cookie strategy with consent categories from the start:
            essential (no consent needed), functional (preference-based), analytics (requires consent),
            and advertising (requires consent). Use a consent management platform (CMP) that integrates
            with your tag manager.
          </li>
          <li>
            <strong>Plan for a third-party-cookie-free world.</strong> Even if Chrome&rsquo;s full
            deprecation timeline has shifted, Safari and Firefox already block third-party cookies. Design
            authentication flows using first-party cookies with backend-for-frontend (BFF) patterns, and
            use CHIPS for legitimate embedded use cases.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Not setting HttpOnly on session cookies.</strong> This is the most common and dangerous
            cookie security mistake. A single XSS vulnerability allows an attacker to exfiltrate the session
            token via <code>document.cookie</code> and impersonate the user. The fix is a single attribute,
            yet it is frequently overlooked in custom authentication implementations.
          </li>
          <li>
            <strong>Oversized cookies inflating every request.</strong> Storing JSON blobs, user preferences,
            or analytics payloads in cookies adds that data to every HTTP request. On high-traffic pages
            with dozens of subresources, this creates a measurable bandwidth tax. A common symptom: CDN
            request logs show abnormally large request headers. The solution: move non-essential data to{" "}
            <code>localStorage</code> or <code>sessionStorage</code>, and keep cookies under 200 bytes.
          </li>
          <li>
            <strong>SameSite confusion breaking cross-origin auth.</strong> After Chrome 80 defaulted to{" "}
            <code>SameSite=Lax</code>, many applications with cross-origin API calls broke silently --
            cookies were no longer sent on fetch requests to a different domain. The fix depends on context:
            for same-site subdomains, ensure cookies use <code>Domain</code> attribute; for truly cross-site
            APIs, use <code>SameSite=None; Secure</code> or switch to bearer tokens in headers.
          </li>
          <li>
            <strong>Ignoring third-party cookie deprecation.</strong> Relying on third-party cookies for
            authentication in iframes (e.g., single sign-on widgets) will break in Safari, Firefox, and
            eventually Chrome. Teams that delay migration face emergency rewrites. Plan now: use{" "}
            <code>Partitioned</code> cookies (CHIPS) for embedded widgets, the FedCM API for federated
            login, or redirect-based flows that establish first-party cookies.
          </li>
          <li>
            <strong>Setting Domain too broadly.</strong> Setting <code>Domain=example.com</code> on a
            sensitive cookie means every subdomain -- including that forgotten staging environment at{" "}
            <code>staging.example.com</code> or a user-content domain at <code>uploads.example.com</code>{" "}
            -- receives the cookie. If any subdomain is compromised, the attacker gains the session token.
            Omit the <code>Domain</code> attribute or use <code>__Host-</code> prefix to lock cookies to
            the exact host.
          </li>
          <li>
            <strong>Forgetting to set cookie expiration on logout.</strong> Deleting a session from the
            server side is not sufficient. The cookie persists in the browser until it expires or is
            explicitly deleted. Always clear authentication cookies on logout by setting{" "}
            <code>Max-Age=0</code> with the same <code>Domain</code>, <code>Path</code>, and{" "}
            <code>Secure</code> attributes as the original cookie.
          </li>
          <li>
            <strong>Using cookies where Web Storage is more appropriate.</strong> UI preferences (theme,
            language, sidebar state) do not need to be sent to the server on every request. Storing them
            in cookies wastes bandwidth and slows down requests. Use <code>localStorage</code> for
            persistent client-side preferences and reserve cookies exclusively for server-readable state.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Authentication Sessions:</strong> The most fundamental use case. The server issues a
            session ID cookie after login (<code>__Host-session=abc; Secure; HttpOnly; SameSite=Lax; Path=/</code>).
            On each request, the server looks up the session in Redis or a database. This pattern scales
            horizontally because any server can validate the session against the shared store. JWTs stored
            in <code>HttpOnly</code> cookies are a stateless alternative, though they introduce revocation
            complexity.
          </li>
          <li>
            <strong>CSRF Token Delivery:</strong> The double-submit cookie pattern sets a random token in
            both a cookie and a hidden form field (or custom header). The server verifies that both match.
            Because an attacker on a different origin cannot read the cookie value (same-origin policy),
            they cannot forge the matching header. The cookie is <em>not</em>{" "}
            <code>HttpOnly</code> in this case, because JavaScript needs to read it to set the header.
          </li>
          <li>
            <strong>A/B Testing & Feature Flags:</strong> Assigning users to experiment cohorts via cookies
            ensures consistent experiences across requests. The cookie value (e.g.,{" "}
            <code>experiment_checkout=variant_b</code>) is sent to the server, which renders the
            appropriate variant. CDNs can also branch on cookie values for edge-level A/B testing, though
            this fragments the cache.
          </li>
          <li>
            <strong>Analytics & Attribution:</strong> First-party analytics cookies (like Google Analytics&rsquo;{" "}
            <code>_ga</code> cookie) assign a persistent client ID to track returning visitors. With
            third-party cookie deprecation, analytics platforms have shifted entirely to first-party cookies
            set via server-side tagging or JavaScript on the first-party domain.
          </li>
          <li>
            <strong>Server-Side Personalization:</strong> Language preferences, region settings, and
            currency selections stored in cookies allow the server to render personalized content on the
            first paint -- before any JavaScript executes. This eliminates the flash of incorrect content
            that occurs when personalization relies on client-side JavaScript reading{" "}
            <code>localStorage</code> after hydration.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use Cookies</h3>
          <p>Cookies are the wrong choice when:</p>
          <ul className="mt-2 space-y-2">
            <li>
              <strong>Storing large data:</strong> Anything over a few hundred bytes should go in{" "}
              <code>localStorage</code>, <code>sessionStorage</code>, or IndexedDB. Cookies are sent with
              every request -- large cookies create a per-request bandwidth tax.
            </li>
            <li>
              <strong>Client-only state:</strong> UI theme, sidebar collapse state, scroll positions, and
              draft content are never needed by the server. Storing them in cookies is wasteful and a
              potential privacy concern.
            </li>
            <li>
              <strong>Structured or queryable data:</strong> If you need to store complex objects, perform
              lookups by key, or manage transactional data, use IndexedDB. Cookies have no query
              capability and are limited to string key-value pairs.
            </li>
            <li>
              <strong>High-frequency writes:</strong> Updating cookies triggers header changes on every
              subsequent request. For rapidly changing state (cursor position, real-time collaboration
              data), use in-memory state or WebSocket channels.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you design a secure authentication system using cookies? Walk through the attributes you would set and why.
            </p>
            <p className="mt-2 text-sm">
              A: I would store an opaque session ID (not the user data itself) in a cookie with the following
              attributes: __Host-session={"<"}random_id{">"}; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400.
              The __Host- prefix locks the cookie to the exact host (no subdomain leakage) and enforces Secure
              and Path=/. HttpOnly prevents XSS from stealing the token. SameSite=Lax prevents CSRF on
              state-changing requests while allowing the cookie on top-level navigations (so login redirects work).
              Secure ensures HTTPS-only transmission. The session ID maps to server-side state in Redis (with TTL
              matching Max-Age), enabling instant revocation on logout or suspicious activity. For additional CSRF
              protection on non-GET requests, I would implement a double-submit cookie pattern with a separate
              non-HttpOnly CSRF token cookie, validated against a custom header.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Explain the difference between SameSite Strict, Lax, and None. When would you use each?
            </p>
            <p className="mt-2 text-sm">
              A: Strict never sends the cookie on any cross-site request, including top-level navigations. If a
              user clicks a link from an email to your banking site, the session cookie is not sent -- the user
              appears logged out until they navigate within the site. This provides maximum CSRF protection but
              harms UX. Use it for highly sensitive actions (banking, admin panels) where the logout-on-arrival
              trade-off is acceptable. Lax sends the cookie on safe top-level navigations (GET requests from
              cross-site links) but blocks it on cross-site subrequests (iframes, fetch, form POST). This is the
              best default for most applications: users stay logged in when clicking links from external sources,
              but CSRF via POST forms from other sites is blocked. None sends the cookie in all contexts,
              including iframes, cross-origin fetch, and embedded widgets. It requires Secure. Use it only when
              your service is legitimately embedded in third-party sites (payment widgets, federated login
              iframes, embedded SaaS tools) and pair it with Partitioned to prevent cross-site tracking.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: A web application's cookies are 3 KB total. The page loads 40 subresources from the same domain.
              What is the performance impact and how would you fix it?
            </p>
            <p className="mt-2 text-sm">
              A: Every one of those 40 requests includes the 3 KB cookie payload in the Cookie request header,
              adding 120 KB of upload overhead per page load. On mobile connections with limited uplink bandwidth
              (often 1-5 Mbps), this can add 200-500ms of latency. Three fixes, in order of impact: (1) Move static
              assets to a separate cookieless domain (static.example.com) with no cookies set. This eliminates the
              overhead for images, CSS, and JS. (2) Audit and reduce cookie size -- replace verbose JSON with opaque
              session IDs, remove analytics cookies that can use localStorage, and delete expired experiment cookies.
              (3) Use HTTP/2 header compression (HPACK), which compresses repeated headers across requests on the
              same connection. The Cookie header, being identical across requests, compresses very efficiently -- but
              this only helps on the wire, not on the server's header parsing cost. The cookieless domain approach
              is the most effective and is standard practice at scale.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the security implications of setting Secure, HttpOnly, and SameSite attributes? When might
              each be insufficient?
            </p>
            <p className="mt-2 text-sm">
              A: Secure ensures cookies are only sent over HTTPS, preventing network eavesdropping. However, it does
              nothing against XSS or MITM at the TLS layer (e.g., compromised CA). HttpOnly prevents JavaScript access,
              blocking XSS-based cookie theft. However, it does not prevent CSRF attacks or XSS that exfiltrates data
              via other means (e.g., reading DOM content). SameSite restricts cross-site sending, mitigating CSRF.
              However, SameSite=Lax still allows cookies on top-level navigations (some CSRF vectors remain), and
              SameSite=None is explicitly for cross-site use. None of these attributes protect against server-side
              vulnerabilities like session fixation or weak session ID generation. Defense in depth requires combining
              these attributes with CSRF tokens, Content Security Policy, and secure session management on the server.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: References & Further Reading */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc6265" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 6265 - HTTP State Management Mechanism
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN - Using HTTP Cookies
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/privacy-sandbox/chips/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chrome Developers - Cookies Having Independent Partitioned State (CHIPS)
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/samesite-cookies-explained" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev - SameSite Cookies Explained
            </a>
          </li>
          <li>
            <a href="https://owasp.org/www-community/controls/SecureCookieAttribute" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP - Secure Cookie Attribute
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
