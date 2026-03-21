"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-security-cookie-attributes-extensive",
  title: "Secure Cookie Attributes",
  description: "Comprehensive guide to HTTP cookie security attributes (HttpOnly, Secure, SameSite), cookie-based session management, and protection strategies for staff/principal engineer interviews.",
  category: "frontend",
  subcategory: "security",
  slug: "secure-cookie-attributes",
  version: "extensive",
  wordCount: 7200,
  readingTime: 29,
  lastUpdated: "2026-03-19",
  tags: ["security", "cookies", "httponly", "samesite", "secure", "frontend", "web-security", "session-management"],
  relatedTopics: ["csrf-protection", "https-tls", "authentication-patterns", "xss-prevention"],
};

export default function SecureCookieAttributesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>HTTP cookies</strong> are small pieces of data (up to 4KB) that servers send to browsers for
          storage and subsequent inclusion in requests. Cookies are fundamental to web session management,
          authentication, personalization, and tracking. However, cookies are also a primary attack vector
          for session hijacking, CSRF, and XSS attacks.
        </p>
        <p>
          <strong>Secure cookie attributes</strong> are flags that control how browsers handle cookies,
          providing critical security protections:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>HttpOnly:</strong> Prevents JavaScript access via <code className="text-sm">document.cookie</code>,
            mitigating XSS-based session theft.
          </li>
          <li>
            <strong>Secure:</strong> Ensures cookies are only sent over HTTPS, preventing interception on
            insecure networks.
          </li>
          <li>
            <strong>SameSite:</strong> Controls when cookies are sent with cross-origin requests, providing
            CSRF protection.
          </li>
        </ul>
        <p>
          Cookies have been part of the web since 1994 (Netscape specification). The security attributes
          were added incrementally: <code className="text-sm">Secure</code> (1997), <code className="text-sm">HttpOnly</code>
          (2002, Internet Explorer), <code className="text-sm">SameSite</code> (2016, Chrome). Understanding
          these attributes is essential because cookies remain the primary mechanism for web authentication,
          and misconfiguration is a leading cause of security breaches.
        </p>
        <p>
          <strong>Why secure cookie attributes matter for staff/principal engineers:</strong> As a technical
          leader, you&apos;re responsible for authentication architecture, session management strategies, and
          security hardening. Cookie security directly impacts:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Session security:</strong> Properly configured cookies prevent session hijacking
          </li>
          <li>
            <strong>Compliance:</strong> PCI-DSS, HIPAA, GDPR all require secure session management
          </li>
          <li>
            <strong>User trust:</strong> Cookie breaches lead to account takeaways and data exposure
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Cookies Are Trust Tokens</h3>
          <p>
            Treat cookies like cash—anyone who has them can spend them. A session cookie <strong>is</strong>
            the authentication. Protecting cookies with proper attributes is as important as protecting
            passwords. A stolen password can be changed; a stolen session cookie grants immediate access.
          </p>
        </div>
      </section>

      <section>
        <h2>Cookie Security Attributes Deep Dive</h2>
        <p>
          Each cookie attribute provides a specific security guarantee. Understanding when and how to use
          each is essential for secure implementation.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/cookie-attributes-overview.svg"
          alt="Cookie Security Attributes overview showing HttpOnly, Secure, SameSite, Domain, Path, and Expires"
          caption="Cookie Security Attributes: Each attribute provides specific protection. Combine all three (HttpOnly, Secure, SameSite) for maximum security."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">HttpOnly Attribute</h3>
        <p>
          The <code className="text-sm">HttpOnly</code> flag prevents client-side JavaScript from accessing
          the cookie via <code className="text-sm">document.cookie</code> API. This is the primary defense
          against XSS-based session theft.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">How HttpOnly Works</h4>
        <p>
          Without HttpOnly, a cookie like <code className="text-sm">sessionId=abc123</code> can be read by JavaScript via <code className="text-sm">document.cookie</code>, allowing an attacker's XSS payload to steal it by sending it to their server. With HttpOnly, the same cookie cannot be accessed by JavaScript—when <code className="text-sm">document.cookie</code> is called, the sessionId is not included, so an XSS payload cannot steal the session cookie.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">HttpOnly Protection Scope</h4>
        <ul className="space-y-2">
          <li>
            <strong>Protects against:</strong> XSS session theft, malicious script cookie access
          </li>
          <li>
            <strong>Does NOT protect against:</strong> CSRF (cookie is still sent automatically), network
            interception (use Secure flag), server-side vulnerabilities
          </li>
          <li>
            <strong>Browser support:</strong> Universal (all modern and legacy browsers)
          </li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">When to Use HttpOnly</h4>
        <p>
          <strong>Always use HttpOnly for:</strong>
        </p>
        <ul className="space-y-2">
          <li>Session cookies (authentication tokens)</li>
          <li>Remember-me tokens</li>
          <li>Any cookie containing sensitive data</li>
          <li>CSRF tokens (if stored in cookies)</li>
        </ul>
        <p>
          <strong>Do NOT use HttpOnly for:</strong>
        </p>
        <ul className="space-y-2">
          <li>Cookies that need to be read by JavaScript (e.g., user preferences, UI state)</li>
          <li>Analytics or tracking cookies that JavaScript needs to access</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Secure Attribute</h3>
        <p>
          The <code className="text-sm">Secure</code> flag ensures cookies are only sent over encrypted
          HTTPS connections, preventing interception on insecure networks.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">How Secure Works</h4>
        <p>
          Without Secure, a cookie is sent over both HTTP and HTTPS connections, meaning an attacker on the same WiFi can intercept it. With Secure, the cookie is ONLY sent over HTTPS connections where it's encrypted with TLS and cannot be intercepted. HTTP requests do not include the cookie at all—no Cookie header is sent.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Secure Attribute Requirements</h4>
        <ul className="space-y-2">
          <li>
            <strong>HTTPS mandatory:</strong> Server must serve content over HTTPS
          </li>
          <li>
            <strong>HSTS recommended:</strong> Use Strict-Transport-Security header to force HTTPS
          </li>
          <li>
            <strong>Cookie domain:</strong> Ensure all subdomains use HTTPS
          </li>
          <li>
            <strong>Development consideration:</strong> Secure cookies won&apos;t work on localhost HTTP
            (use HTTPS in development or omit Secure flag locally)
          </li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">When to Use Secure</h4>
        <p>
          <strong>Always use Secure for:</strong>
        </p>
        <ul className="space-y-2">
          <li>All cookies in production (not just session cookies)</li>
          <li>Authentication tokens</li>
          <li>Any cookie containing personal or sensitive data</li>
        </ul>
        <p>
          <strong>Exception:</strong> Development environments without HTTPS (but use HTTPS in development
          when possible).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SameSite Attribute</h3>
        <p>
          The <code className="text-sm">SameSite</code> attribute controls when cookies are sent with
          cross-origin requests, providing CSRF protection and limiting cross-site request capabilities.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">SameSite Values</h4>

        <h5 className="mt-3 mb-2 font-semibold">SameSite=Strict</h5>
        <p>
          Cookies are NEVER sent with cross-origin requests, including following links from external sites.
          When a user clicks a link from an external site to your site, the cookie is NOT sent so the user appears logged out. When a user types the URL directly or uses a bookmark, the cookie IS sent and the user is authenticated.
        </p>
        <p>
          <strong>Use case:</strong> Maximum security for highly sensitive applications (banking, healthcare)
          where CSRF risk outweighs UX impact.
        </p>

        <h5 className="mt-3 mb-2 font-semibold">SameSite=Lax (Default in Modern Browsers)</h5>
        <p>
          Cookies are sent with top-level navigations (link clicks) but NOT with subrequests (images, forms,
          fetch). When a user clicks a link from an external site, the cookie IS sent. However, when an external site tries to make a subrequest like an image tag or submit a form to your site, the cookie is NOT sent providing CSRF protection.
        </p>
        <p>
          <strong>Use case:</strong> Default for most applications. Good balance of security and UX.
        </p>

        <h5 className="mt-3 mb-2 font-semibold">SameSite=None</h5>
        <p>
          Cookies are sent with ALL cross-origin requests. Requires <code className="text-sm">Secure</code>
          flag in modern browsers. This is required for third-party cookies (ads, analytics), embedded widgets that need authentication, and cross-site API access.
        </p>
        <p>
          <strong>Use case:</strong> Only when cross-origin cookie sharing is explicitly required.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/samesite-comparison.svg"
          alt="SameSite Attribute Comparison showing Strict, Lax, and None behavior with different request types"
          caption="SameSite Comparison: Strict blocks all cross-origin, Lax allows top-level navigations, None allows all (requires Secure)."
        />

        <h4 className="mt-4 mb-2 font-semibold">SameSite Browser Support</h4>
        <ul className="space-y-2">
          <li>
            <strong>Chrome 80+:</strong> Enforces SameSite=Lax as default, requires Secure for SameSite=None
          </li>
          <li>
            <strong>Firefox 80+:</strong> Same behavior as Chrome
          </li>
          <li>
            <strong>Safari 13.1+:</strong> Supports SameSite attribute
          </li>
          <li>
            <strong>Edge 80+:</strong> Same behavior as Chrome (Chromium-based)
          </li>
          <li>
            <strong>Legacy browsers:</strong> Ignore SameSite (use CSRF tokens as backup)
          </li>
        </ul>
      </section>

      <section>
        <h2>Cookie-Based Session Management</h2>
        <p>
          Cookies are the primary mechanism for web session management. Understanding how to securely
          implement cookie-based sessions is essential.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Cookie Pattern</h3>
        <p>
          A secure session cookie configuration includes the session ID value with attributes like <code className="text-sm">Path=/</code>, <code className="text-sm">Domain=example.com</code>, an expiration date, <code className="text-sm">HttpOnly</code>, <code className="text-sm">Secure</code>, and <code className="text-sm">SameSite=Lax</code>. In Node.js/Express, you would use the <code className="text-sm">res.cookie()</code> method with options like <code className="text-sm">httpOnly: true</code>, <code className="text-sm">secure: true</code>, <code className="text-sm">sameSite: 'lax'</code>, <code className="text-sm">maxAge</code> set to 24 hours in milliseconds, <code className="text-sm">path: '/'</code>, and <code className="text-sm">domain: 'example.com'</code>.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Cookie Best Practices</h3>
        <ul className="space-y-2">
          <li>
            <strong>Use random session IDs:</strong> Generate with cryptographically secure random (minimum
            128 bits)
          </li>
          <li>
            <strong>Set appropriate expiration:</strong> Short-lived sessions (hours, not weeks) reduce
            attack window
          </li>
          <li>
            <strong>Implement session rotation:</strong> Generate new session ID on login, privilege changes
          </li>
          <li>
            <strong>Bind sessions to context:</strong> Validate IP, user agent (with caveats for mobile)
          </li>
          <li>
            <strong>Implement logout:</strong> Server-side session invalidation, not just cookie deletion
          </li>
          <li>
            <strong>Use secure cookie name:</strong> Avoid generic names like <code className="text-sm">session</code>
            or <code className="text-sm">auth</code>
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Remember-Me / Persistent Cookies</h3>
        <p>
          Remember-me functionality requires longer-lived cookies with additional security considerations. A remember-me cookie includes a token value with a longer expiration (such as 1 year), along with <code className="text-sm">HttpOnly</code>, <code className="text-sm">Secure</code>, and <code className="text-sm">SameSite=Lax</code> attributes. Server-side, you should store the token hash in the database (not the raw token), associate it with the user account, implement token rotation on use, and allow users to revoke all tokens.
        </p>
        <p>
          <strong>Security considerations:</strong>
        </p>
        <ul className="space-y-2">
          <li>Store hashed tokens server-side (like passwords)</li>
          <li>Implement token rotation—generate new token on each use</li>
          <li>Allow users to view and revoke active sessions</li>
          <li>Consider shorter expiration (30 days vs 1 year)</li>
          <li>Require re-authentication for sensitive actions</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">JWT in Cookies vs localStorage</h3>
        <p>
          When using JWT for authentication, storage location impacts security:
        </p>

        <h4 className="mt-4 mb-2 font-semibold">JWT in HttpOnly Cookie (Recommended)</h4>
        <ul className="space-y-2">
          <li>
            <strong>Pros:</strong> Protected from XSS (HttpOnly), automatic inclusion in requests,
            SameSite CSRF protection
          </li>
          <li>
            <strong>Cons:</strong> CSRF vulnerability (mitigated with SameSite), requires backend cookie
            handling
          </li>
          <li>
            <strong>Best for:</strong> Most applications, especially those with XSS risk
          </li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">JWT in localStorage</h4>
        <ul className="space-y-2">
          <li>
            <strong>Pros:</strong> No CSRF risk (not auto-sent), easy client-side access
          </li>
          <li>
            <strong>Cons:</strong> Vulnerable to XSS (any script can read localStorage), manual token
            management
          </li>
          <li>
            <strong>Best for:</strong> Applications with strong XSS controls, token-based API access
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/jwt-storage-comparison.svg"
          alt="JWT Storage Comparison showing HttpOnly Cookie vs localStorage security trade-offs"
          caption="JWT Storage: HttpOnly cookies protect against XSS but need CSRF protection. localStorage avoids CSRF but is vulnerable to XSS."
        />
      </section>

      <section>
        <h2>Trade-offs & Considerations</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Attribute</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>HttpOnly</strong></td>
              <td className="p-3">
                • Prevents XSS session theft<br/>
                • Universal browser support<br/>
                • No UX impact
              </td>
              <td className="p-3">
                • JavaScript cannot access cookie<br/>
                • Doesn&apos;t prevent CSRF<br/>
                • Doesn&apos;t prevent network interception
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Secure</strong></td>
              <td className="p-3">
                • Prevents network interception<br/>
                • Required for compliance<br/>
                • Works with HTTPS everywhere
              </td>
              <td className="p-3">
                • Requires HTTPS infrastructure<br/>
                • Won&apos;t work on HTTP localhost<br/>
                • Slight TLS overhead
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>SameSite=Strict</strong></td>
              <td className="p-3">
                • Maximum CSRF protection<br/>
                • Simple to implement<br/>
                • No additional tokens needed
              </td>
              <td className="p-3">
                • Breaks external link navigation<br/>
                • Users appear logged out from links<br/>
                • Poor UX for some flows
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>SameSite=Lax</strong></td>
              <td className="p-3">
                • Good CSRF protection<br/>
                • Allows link navigation<br/>
                • Browser default (Chrome 80+)
              </td>
              <td className="p-3">
                • POST forms from external sites blocked<br/>
                • Some edge cases with iframes<br/>
                • Legacy browser support varies
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>SameSite=None</strong></td>
              <td className="p-3">
                • Enables cross-site usage<br/>
                • Required for third-party cookies<br/>
                • Flexible for embedded scenarios
              </td>
              <td className="p-3">
                • No CSRF protection<br/>
                • Requires Secure flag<br/>
                • Privacy concerns (tracking)
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cookie Configuration</h3>
        <ul className="space-y-2">
          <li>
            <strong>Always use all three attributes:</strong> HttpOnly + Secure + SameSite=Lax (minimum)
          </li>
          <li>
            <strong>Set appropriate scope:</strong> Use specific Path and Domain, avoid wildcards
          </li>
          <li>
            <strong>Use short expiration:</strong> Session cookies (2-24 hours), remember-me (7-30 days max)
          </li>
          <li>
            <strong>Implement session rotation:</strong> New session ID on login, privilege changes, periodic
          </li>
          <li>
            <strong>Use secure random values:</strong> Minimum 128 bits of entropy for session IDs
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Management</h3>
        <ul className="space-y-2">
          <li>
            <strong>Invalidate on logout:</strong> Server-side session deletion, not just client cookie removal
          </li>
          <li>
            <strong>Implement idle timeout:</strong> Expire sessions after period of inactivity
          </li>
          <li>
            <strong>Provide session visibility:</strong> Allow users to view active sessions and revoke
          </li>
          <li>
            <strong>Bind to context:</strong> Validate IP, user agent (with flexibility for mobile)
          </li>
          <li>
            <strong>Rate limit sessions:</strong> Limit concurrent sessions per user
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CSRF Protection</h3>
        <ul className="space-y-2">
          <li>
            <strong>Use SameSite=Lax minimum:</strong> Provides baseline CSRF protection
          </li>
          <li>
            <strong>Implement CSRF tokens:</strong> For state-changing operations, especially with SameSite=None
          </li>
          <li>
            <strong>Validate Origin/Referer:</strong> Server-side check as additional layer
          </li>
          <li>
            <strong>Use double-submit cookie:</strong> For API-based CSRF protection
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Development & Testing</h3>
        <ul className="space-y-2">
          <li>
            <strong>Use HTTPS in development:</strong> Tools like mkcert for local HTTPS
          </li>
          <li>
            <strong>Test cookie configuration:</strong> Verify attributes are set correctly
          </li>
          <li>
            <strong>Scan for vulnerabilities:</strong> Use OWASP ZAP, Burp Suite for cookie security testing
          </li>
          <li>
            <strong>Monitor for leaks:</strong> Log and alert on unusual cookie patterns
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Defense in Depth for Cookies</h3>
          <p>
            Cookie security requires multiple layers: HttpOnly prevents XSS theft, Secure prevents interception,
            SameSite prevents CSRF. But also implement server-side session validation, rate limiting, and
            monitoring. No single attribute provides complete protection.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Missing HttpOnly:</strong> Session cookies accessible to JavaScript can be stolen via XSS.
            Always use HttpOnly for authentication cookies.
          </li>
          <li>
            <strong>Missing Secure:</strong> Cookies sent over HTTP can be intercepted on public WiFi. Always
            use Secure in production.
          </li>
          <li>
            <strong>SameSite=None without Secure:</strong> Modern browsers reject SameSite=None without Secure
            flag. Always pair them.
          </li>
          <li>
            <strong>Overly broad Domain:</strong> <code className="text-sm">Domain=.example.com</code> allows
            all subdomains to access cookie. Use specific subdomain when possible.
          </li>
          <li>
            <strong>Long expiration:</strong> Session cookies valid for months increase attack window. Use
            short expiration with refresh.
          </li>
          <li>
            <strong>Predictable session IDs:</strong> Sequential or timestamp-based session IDs can be guessed.
            Use cryptographically secure random.
          </li>
          <li>
            <strong>No session invalidation:</strong> Logout that only deletes client cookie leaves server-side
            session active. Invalidate on both sides.
          </li>
          <li>
            <strong>Storing sensitive data in cookies:</strong> Cookies are client-stored. Never store passwords,
            PII, or payment data in cookies.
          </li>
          <li>
            <strong>Ignoring legacy browser support:</strong> SameSite isn&apos;t supported in older browsers.
            Use CSRF tokens as backup.
          </li>
          <li>
            <strong>Not testing cookie security:</strong> Assuming default framework configuration is secure.
            Always verify and test.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-Commerce Platform</h3>
        <p>
          <strong>Challenge:</strong> Secure session management for authenticated users, shopping cart
          persistence, remember-me functionality.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Session cookie: HttpOnly + Secure + SameSite=Lax, 2-hour expiration</li>
          <li>Remember-me cookie: HttpOnly + Secure + SameSite=Lax, 30-day expiration, token rotation</li>
          <li>Shopping cart cookie (non-sensitive): SameSite=Lax, no HttpOnly (JavaScript access needed)</li>
          <li>CSRF tokens for checkout and account modifications</li>
          <li>Session invalidation on password change and logout</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application</h3>
        <p>
          <strong>Challenge:</strong> Maximum security for financial transactions, regulatory compliance
          (PCI-DSS, FFIEC).
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Session cookie: HttpOnly + Secure + SameSite=Strict, 15-minute idle timeout</li>
          <li>No remember-me functionality (security over convenience)</li>
          <li>Additional authentication for transactions (step-up auth)</li>
          <li>Session binding to IP and user agent</li>
          <li>Automatic logout on browser close (session cookie, no Expires)</li>
          <li>Server-side session validation on every request</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SaaS Platform with API</h3>
        <p>
          <strong>Challenge:</strong> Web application and API need authentication, third-party integrations
          require cross-origin access.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Web session: HttpOnly + Secure + SameSite=Lax cookie</li>
          <li>API access: JWT in HttpOnly cookie for web, Bearer token in Authorization header for API clients</li>
          <li>Third-party integrations: OAuth 2.0 with short-lived access tokens</li>
          <li>SameSite=None + Secure for embedded widget scenarios (with CSRF tokens)</li>
          <li>Session management dashboard for users to view/revoke active sessions</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Content Publishing Platform</h3>
        <p>
          <strong>Challenge:</strong> Mix of authenticated and anonymous users, personalization cookies,
          third-party advertising.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Auth session: HttpOnly + Secure + SameSite=Lax</li>
          <li>Personalization preferences: Non-HttpOnly (JavaScript access), SameSite=Lax</li>
          <li>Third-party ad cookies: SameSite=None + Secure (required for cross-site ads)</li>
          <li>Cookie consent management for GDPR/CCPA compliance</li>
          <li>Granular cookie categories (essential, functional, advertising)</li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs: HTTP Cookies
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs: Set-Cookie Header
            </a>
          </li>
          <li>
            <a href="https://owasp.org/www-community/controls/SecureCookieAttribute" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Secure Cookie Attribute
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Session Management Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc6265" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 6265: HTTP State Management Mechanism
            </a>
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis-03" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 6265bis (Draft): Updated Cookie Specification
            </a>
          </li>
          <li>
            <a href="https://web.dev/samesite-cookies-explained/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev: SameSite Cookies Explained
            </a>
          </li>
          <li>
            <a href="https://portswigger.net/web-security/session-management" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PortSwigger: Session Management Vulnerabilities
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: What are the three main cookie security attributes and what do they protect against?</p>
            <p className="mt-2 text-sm">
              A: <strong>HttpOnly</strong> prevents JavaScript access via <code className="text-sm">document.cookie</code>,
              protecting against XSS-based session theft. <strong>Secure</strong> ensures cookies are only sent
              over HTTPS, preventing network interception. <strong>SameSite</strong> controls when cookies are
              sent with cross-origin requests, providing CSRF protection. Together they form a defense-in-depth
              strategy for cookie security.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: What&apos;s the difference between SameSite=Strict, Lax, and None?</p>
            <p className="mt-2 text-sm">
              A: <strong>SameSite=Strict</strong> never sends cookies with cross-origin requests—even when
              following a link from an external site. Maximum security but breaks external link navigation.
              <strong>SameSite=Lax</strong> sends cookies with top-level navigations (link clicks) but not
              subrequests (images, forms, fetch). Good balance of security and UX. <strong>SameSite=None</strong>
              sends cookies with all cross-origin requests but requires the Secure flag. Use only when
              cross-origin cookie sharing is explicitly needed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: Should JWT tokens be stored in localStorage or cookies?</p>
            <p className="mt-2 text-sm">
              A: <strong>HttpOnly cookies</strong> are generally recommended. They protect against XSS (JavaScript
              can&apos;t read HttpOnly cookies) and provide built-in CSRF protection with SameSite.
              <strong>localStorage</strong> is vulnerable to XSS—any script can read it—but avoids CSRF since
              tokens aren&apos;t auto-sent. For most applications, HttpOnly cookies with SameSite=Lax provide
              better security. Use localStorage only if you have strong XSS controls and need token access in
              JavaScript.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: How do you securely implement remember-me functionality?</p>
            <p className="mt-2 text-sm">
              A: Use a separate long-lived cookie (not the session cookie) with: HttpOnly + Secure + SameSite=Lax.
              Store a random token (128+ bits) in the cookie, and store the hashed token server-side associated
              with the user account. Implement token rotation—generate a new token on each use. Allow users to
              view and revoke active remember-me sessions. Consider shorter expiration (30 days vs 1 year).
              Require re-authentication for sensitive actions even with remember-me.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: Why is HttpOnly important even if you have XSS protections?</p>
            <p className="mt-2 text-sm">
              A: XSS protections (input validation, output encoding, CSP) can fail. HttpOnly provides a safety
              net—even if an attacker injects JavaScript, they can&apos;t steal session cookies via
              <code className="text-sm">document.cookie</code>. It&apos;s defense in depth: your primary
              defenses should prevent XSS, but HttpOnly limits the impact if they fail. Think of it as a
              seatbelt: you plan to drive safely, but the seatbelt protects you if something goes wrong.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: What cookie configuration would you use for a high-security application?</p>
            <p className="mt-2 text-sm">
              A: For high-security (banking, healthcare): Session cookie with HttpOnly + Secure + SameSite=Strict.
              Short expiration (15-30 minutes) with idle timeout. No remember-me functionality. Session binding
              to IP and user agent. Server-side session validation on every request. Additional authentication
              (step-up) for sensitive actions. Automatic logout on browser close. Regular session rotation.
              Trade UX for security in this context.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
