"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-csrf-protection-extensive",
  title: "CSRF Protection",
  description:
    "Staff-level deep dive into Cross-Site Request Forgery attacks, token-based defenses, SameSite cookies, double-submit pattern, and the operational practice of preventing CSRF at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "csrf-protection",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "csrf", "cookies", "web-security"],
  relatedTopics: ["cors-cross-origin-resource-sharing", "session-management", "xss-prevention", "security-headers"],
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
          <strong>CSRF (Cross-Site Request Forgery)</strong> is an attack where a malicious website tricks an
          authenticated user&apos;s browser into making an unwanted request to a different website where the user is
          authenticated. The attack exploits the fact that browsers automatically include cookies (session
          identifiers) with cross-origin requests — if the user is logged into their bank, and a malicious site
          submits a form to the bank&apos;s transfer endpoint, the browser will include the user&apos;s session cookie,
          making the request appear legitimate to the bank&apos;s server.
        </p>
        <p>
          CSRF is fundamentally different from XSS (Cross-Site Scripting). XSS exploits a vulnerability in the
          target website to inject malicious scripts — the attacker needs a vulnerability in the target site.
          CSRF does not require any vulnerability in the target site — it exploits the browser&apos;s automatic
          cookie inclusion behavior. A user can be victimized by CSRF even if the target site has no security
          vulnerabilities, as long as the site does not implement CSRF protections.
        </p>
        <p>
          The CSRF attack works in three steps: the user authenticates to the target site (bank.com) and receives
          a session cookie; the user visits a malicious site (evil.com) that contains a hidden form or script
          that submits a request to bank.com; the browser sends the request to bank.com with the session cookie
          automatically included, and bank.com processes the request as if the user intended it. The user may not
          even be aware that the request was made — the malicious form can be hidden in an invisible iframe or
          triggered automatically on page load.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">Why CSRF Works</h3>
          <p className="text-muted mb-3">
            <strong>Automatic cookie inclusion:</strong> Browsers automatically include cookies with cross-origin requests. If the user is authenticated to bank.com, any request to bank.com from any website will include the user&apos;s session cookie.
          </p>
          <p className="text-muted mb-3">
            <strong>No vulnerability needed:</strong> CSRF does not require any vulnerability in the target site. It exploits the browser&apos;s default behavior of including cookies with cross-origin requests.
          </p>
          <p>
            <strong>State-changing actions are the target:</strong> CSRF attacks target state-changing actions (transferring money, changing email, making purchases) — not data retrieval (GET requests). GET requests should be idempotent (no side effects), so CSRF against GET requests is less impactful (though still problematic if GET requests have side effects).
          </p>
        </div>
        <p>
          CSRF protections have evolved over time. Early defenses relied on checking the Referer header (which
          indicates the page that initiated the request) — but Referer can be spoofed or stripped by privacy
          tools. The synchronizer token pattern (CSRF tokens) became the standard defense — embedding an
          unpredictable token in forms and validating it server-side. More recently, the SameSite cookie
          attribute (Strict, Lax, None) has become the primary defense — it prevents cookies from being sent
          with cross-site requests, eliminating the root cause of CSRF. Modern best practices use defense-in-depth
          — SameSite cookies as the primary defense, with CSRF tokens as a fallback.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The synchronizer token pattern (CSRF tokens) is the most widely deployed CSRF defense. The server
          generates a unique, unpredictable token (using a CSPRNG) for each user session and embeds it in all
          HTML forms as a hidden input field. When the form is submitted, the server validates that the submitted
          token matches the token stored in the user&apos;s session. If the tokens match, the request is processed;
          if not, it is rejected with a 403 Forbidden response.
        </p>
        <p>
          CSRF tokens work because the attacker cannot read the token from the legitimate site (same-origin policy
          prevents cross-origin reading). The attacker can forge a request to the target site, but they cannot
          include the valid CSRF token — the token is embedded in the legitimate site&apos;s HTML, which the attacker
          cannot access. Without the valid token, the forged request is rejected by the server.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/csrf-protection-diagram-1.svg"
          alt="CSRF attack flow showing malicious site tricking authenticated user into making unwanted request to target site"
          caption="CSRF attack: user authenticated to target site visits malicious site, which auto-submits a form to the target site with the user&apos;s session cookie. The target site processes the request as legitimate because the cookie is valid."
        />
        <p>
          CSRF tokens must be unpredictable (generated by a CSPRNG), unique per user session (not global), and
          validated using constant-time comparison (to prevent timing attacks). The token should be one-time use
          (regenerated after each validation) for maximum security, though per-session tokens (same token for all
          requests within a session) are more common and provide adequate security for most applications.
        </p>
        <p>
          The SameSite cookie attribute is a modern defense against CSRF that prevents cookies from being sent
          with cross-site requests. SameSite has three modes: Strict (cookie is never sent with cross-site
          requests), Lax (cookie is sent with top-level GET requests, such as link clicks, but not with POST
          requests or API calls), and None (cookie is always sent with cross-site requests, requiring the Secure
          attribute). SameSite=Lax is the default in modern browsers, providing CSRF protection for POST requests
          while allowing GET navigation (such as OAuth redirects) to work correctly.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/csrf-protection-diagram-2.svg"
          alt="CSRF token validation flow showing token generation, embedding in forms, submission, and server-side validation"
          caption="CSRF token validation: server generates token, embeds it in forms, and validates it on submission. The attacker cannot read the token (same-origin policy), so forged requests are rejected."
        />
        <p>
          The double-submit cookie pattern is an alternative to server-side CSRF token storage. The server sets
          a cookie containing a random CSRF token, and the client includes the same token in a custom header
          (X-CSRF-Token) with each state-changing request. The server compares the cookie value to the header
          value — if they match, the request is processed. This pattern does not require server-side token storage
          (the token is stored in the cookie), making it simpler to implement in stateless APIs. However, it
          relies on the assumption that the attacker cannot set cookies for the target domain (which is true due
          to the same-origin policy).
        </p>
        <p>
          Custom request headers are another CSRF defense — browsers require a preflight OPTIONS request for
          cross-origin requests with custom headers (such as X-CSRF-Token or Authorization). Since the attacker
          cannot control the preflight response (the target server must explicitly allow the custom header via
          CORS), the actual request is never sent. This defense is effective for API-based applications that use
          fetch or XMLHttpRequest with custom headers, but it does not protect against form-based CSRF attacks
          (which do not use custom headers).
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The CSRF protection architecture consists of the token generator (which creates unpredictable CSRF
          tokens), the token embedder (which inserts tokens into forms and responses), the token validator (which
          validates tokens on state-changing requests), and the cookie manager (which sets SameSite attributes on
          cookies). The token generator uses a CSPRNG to generate tokens, the token embedder inserts tokens into
          HTML forms (as hidden inputs) and API responses (as headers or meta tags), the token validator compares
          submitted tokens to stored tokens (or cookie values for double-submit), and the cookie manager sets
          SameSite attributes on all session cookies.
        </p>
        <p>
          The CSRF token flow begins with the user requesting a page that contains a form. The server generates a
          CSRF token (or retrieves the existing token from the user&apos;s session), embeds it in the form as a hidden
          input, and renders the page. When the user submits the form, the browser sends the form data (including
          the CSRF token) and the session cookie to the server. The server validates the CSRF token (comparing it
          to the stored token or cookie value) and, if valid, processes the request; if not, it rejects the
          request with a 403 Forbidden response.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/csrf-protection-diagram-3.svg"
          alt="SameSite cookie attribute modes showing Strict, Lax, and None behavior for cross-site requests"
          caption="SameSite modes: Strict blocks all cross-site cookies (maximum CSRF protection but breaks OAuth), Lax allows top-level GET cookies (recommended default), None allows all cross-site cookies (requires Secure attribute and additional CSRF protection)."
        />
        <p>
          For API-based applications (SPAs, mobile apps), CSRF protection is implemented differently. SPAs
          typically use the double-submit cookie pattern — the server sets a CSRF token in a cookie, and the SPA
          reads the token from the cookie and includes it in a custom header (X-CSRF-Token) with each state-changing
          request. The server compares the cookie value to the header value — if they match, the request is
          processed. This pattern works because the attacker cannot set cookies for the target domain (same-origin
          policy), and the SPA can read the cookie (if it is not httpOnly) and include it in the header.
        </p>
        <p>
          SameSite cookie enforcement is implemented by setting the SameSite attribute on all session cookies.
          The recommended configuration is SameSite=Lax for most applications — it prevents cookies from being
          sent with cross-site POST requests (the most common CSRF vector) while allowing cookies to be sent with
          top-level GET requests (link clicks, OAuth redirects). For high-security applications (banking,
          healthcare), SameSite=Strict may be appropriate — it blocks all cross-site cookies, but it breaks
          OAuth flows and external link navigation.
        </p>
        <p>
          Referer and Origin header validation is a supplementary CSRF defense — the server checks that the
          Referer or Origin header matches the expected origin. If the request comes from an unexpected origin,
          it is rejected. This defense is not reliable on its own (Referer can be stripped by privacy tools or
          proxies, and Origin is only sent with cross-origin requests), but it provides an additional layer of
          defense-in-depth.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          CSRF tokens versus SameSite cookies is the primary trade-off in CSRF defense. CSRF tokens require
          server-side token generation, form embedding, and validation — they add complexity but are compatible
          with all browsers and all request types. SameSite cookies are simpler to implement (set a cookie
          attribute) and provide CSRF protection at the browser level, but they are not supported by older
          browsers (Internet Explorer, older mobile browsers) and do not protect against subdomain attacks
          (a compromised subdomain can still make cross-site requests with cookies).
        </p>
        <p>
          Synchronizer token pattern versus double-submit cookie is a trade-off between server-side state and
          simplicity. The synchronizer token pattern requires server-side token storage (in the session), which
          adds complexity for stateless APIs. The double-submit cookie pattern does not require server-side storage
          (the token is stored in the cookie), making it simpler to implement in stateless APIs. However, the
          double-submit pattern is vulnerable to subdomain attacks (a compromised subdomain can set cookies for
          the parent domain) and requires the cookie to be readable by JavaScript (not httpOnly).
        </p>
        <p>
          SameSite=Strict versus SameSite=Lax is a trade-off between security and compatibility. SameSite=Strict
          blocks all cross-site cookies, providing maximum CSRF protection but breaking OAuth flows, external link
          navigation, and embedded content. SameSite=Lax allows cookies with top-level GET requests, maintaining
          compatibility with OAuth and external links while still protecting against POST-based CSRF attacks. The
          recommended default is SameSite=Lax for most applications.
        </p>
        <p>
          Custom headers versus form-based CSRF defense is a trade-off between API-friendly and traditional web
          application protection. Custom headers (X-CSRF-Token) require a preflight OPTIONS request for cross-origin
          requests, which blocks forged requests from malicious sites. However, custom headers only work with
          JavaScript-based requests (fetch, XMLHttpRequest) — they do not protect against form-based CSRF attacks
          (which cannot set custom headers). For API-based applications, custom headers are sufficient. For
          traditional web applications with HTML forms, CSRF tokens or SameSite cookies are necessary.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use defense-in-depth — implement both SameSite cookies and CSRF tokens. SameSite cookies provide the
          primary defense (preventing cookies from being sent with cross-site requests), and CSRF tokens provide
          a fallback defense (validating that the request includes a valid token). This ensures that CSRF is
          prevented even if one defense fails (e.g., SameSite is not supported by the browser, or the CSRF token
          is inadvertently omitted).
        </p>
        <p>
          Set SameSite=Lax on all session cookies — this is the recommended default for most applications. It
          prevents cookies from being sent with cross-site POST requests (the most common CSRF vector) while
          allowing cookies to be sent with top-level GET requests (link clicks, OAuth redirects). For high-security
          applications, use SameSite=Strict.
        </p>
        <p>
          Generate CSRF tokens using a CSPRNG with at least 128 bits of entropy. Tokens must be unpredictable —
          if an attacker can guess or brute force the token, the defense is broken. Use a well-tested CSRF library
          (csurf for Express, Django CSRF middleware, Spring Security CSRF) — do not implement your own token
          generation, as it is easy to make mistakes (weak random number generation, predictable tokens).
        </p>
        <p>
          Validate CSRF tokens using constant-time comparison — the comparison should take the same amount of time
          regardless of where the first difference occurs, to prevent timing attacks. All well-tested CSRF
          libraries use constant-time comparison by default.
        </p>
        <p>
          Protect all state-changing requests (POST, PUT, DELETE, PATCH) — CSRF protection should be applied to
          all requests that modify state, not just form submissions. API endpoints, GraphQL mutations, and
          WebSocket messages should all be protected against CSRF. GET requests should be idempotent (no side
          effects) and do not require CSRF protection, but if GET requests have side effects, they should be
          protected.
        </p>
        <p>
          For SPAs and APIs, use the double-submit cookie pattern — set the CSRF token in a cookie (not httpOnly,
          so the SPA can read it), and require the SPA to include the token in a custom header (X-CSRF-Token) with
          each state-changing request. The server compares the cookie value to the header value — if they match,
          the request is processed.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Not protecting all state-changing endpoints is a common CSRF pitfall. Developers often protect HTML
          form submissions but forget to protect API endpoints, GraphQL mutations, or WebSocket messages. Any
          endpoint that modifies state (POST, PUT, DELETE, PATCH) must be protected against CSRF. The fix is to
          implement CSRF protection as middleware that applies to all state-changing requests, not just form
          submissions.
        </p>
        <p>
          Using predictable CSRF tokens is a critical vulnerability. If the token is generated using a weak random
          number generator (Math.random, timestamp-based), an attacker can guess or brute force the token,
          bypassing the CSRF defense. The fix is to use a CSPRNG (crypto.randomBytes, SecureRandom) with at least
          128 bits of entropy.
        </p>
        <p>
          Setting SameSite=None without Secure is a common misconfiguration. SameSite=None requires the Secure
          attribute (the cookie is only sent over HTTPS) — without Secure, browsers will reject the cookie. The
          fix is to always set Secure when setting SameSite=None.
        </p>
        <p>
          Relying solely on Referer header validation is a common oversight. Referer can be stripped by privacy
          tools, proxies, and browser settings, causing legitimate requests to be rejected. Additionally, Referer
          is not sent with all requests (e.g., HTTPS to HTTP transitions). The fix is to use Referer validation
          as a supplementary defense, not the primary defense.
        </p>
        <p>
          Not protecting GET requests with side effects is a common pitfall. If a GET request modifies state
          (e.g., GET /transfer?amount=100&to=attacker), it is vulnerable to CSRF — an attacker can embed the URL
          in an image tag or link, and the browser will execute the request when the user visits the malicious
          site. The fix is to make all GET requests idempotent (no side effects) and use POST, PUT, DELETE, or
          PATCH for state-changing operations.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses SameSite=Lax cookies and CSRF tokens for its web application — all
          session cookies are set with SameSite=Lax, and all HTML forms include CSRF tokens generated by the
          server. The platform&apos;s API endpoints are protected by the double-submit cookie pattern — the CSRF token
          is set in a cookie and required in a custom header (X-CSRF-Token) for all state-changing requests. The
          platform has had zero successful CSRF attacks since implementing these controls.
        </p>
        <p>
          A financial services company uses SameSite=Strict cookies for its banking application — all session
          cookies are set with SameSite=Strict, blocking all cross-site cookies. The company also implements CSRF
          tokens for all state-changing requests, with one-time-use tokens (regenerated after each validation).
          The company monitors CSRF validation failures and alerts on unusual patterns (which may indicate CSRF
          attack attempts).
        </p>
        <p>
          A SaaS platform uses the double-submit cookie pattern for its SPA — the server sets a CSRF token in a
          cookie (not httpOnly), and the SPA reads the token from the cookie and includes it in a custom header
          (X-CSRF-Token) with each state-changing request. The server compares the cookie value to the header
          value — if they match, the request is processed. The platform also sets SameSite=Lax on all session
          cookies as a supplementary defense.
        </p>
        <p>
          A healthcare organization uses CSRF tokens with Referer validation for its patient portal — all
          state-changing requests require a valid CSRF token, and the server also validates the Referer header
          to ensure the request comes from the expected origin. The organization uses SameSite=Lax cookies as the
          primary defense, with CSRF tokens and Referer validation as supplementary defenses. The organization
          monitors CSRF validation failures and Referer mismatches for anomalous patterns.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: How does CSRF work, and why can&apos;t the attacker read the CSRF token?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              CSRF works by exploiting the browser&apos;s automatic cookie inclusion behavior — when a user visits a malicious site, the site submits a request to the target site (where the user is authenticated), and the browser includes the user&apos;s session cookie automatically. The target site processes the request as legitimate because the cookie is valid.
            </p>
            <p>
              The attacker cannot read the CSRF token because of the same-origin policy — the CSRF token is embedded in the legitimate site&apos;s HTML, and the same-origin policy prevents the malicious site from reading the legitimate site&apos;s HTML. The attacker can forge a request to the target site, but they cannot include the valid CSRF token, so the request is rejected.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is the SameSite cookie attribute, and how does it prevent CSRF?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              SameSite is a cookie attribute that controls whether cookies are sent with cross-site requests. SameSite=Strict blocks all cross-site cookies, SameSite=Lax allows cookies with top-level GET requests (link clicks) but not with POST requests or API calls, and SameSite=None allows all cross-site cookies (requiring the Secure attribute).
            </p>
            <p>
              SameSite prevents CSRF by not sending the session cookie with cross-site requests — if the cookie is not sent, the target site cannot authenticate the request, and it is rejected. SameSite=Lax is the recommended default — it prevents POST-based CSRF attacks while allowing GET navigation (OAuth redirects, external links) to work correctly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is the double-submit cookie pattern, and when should you use it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The double-submit cookie pattern sets a CSRF token in a cookie and requires the client to include the same token in a custom header (X-CSRF-Token) with each state-changing request. The server compares the cookie value to the header value — if they match, the request is processed. This pattern does not require server-side token storage, making it simpler to implement in stateless APIs.
            </p>
            <p>
              The double-submit pattern should be used for SPAs and APIs where server-side session storage is not available (stateless authentication). It is vulnerable to subdomain attacks (a compromised subdomain can set cookies for the parent domain), so it should be combined with SameSite cookies for defense-in-depth.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: Why do custom headers prevent CSRF?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Custom headers (X-CSRF-Token, Authorization) require a preflight OPTIONS request for cross-origin requests. The browser sends an OPTIONS request to the target server, asking whether the custom header is allowed. The server must respond with Access-Control-Allow-Headers including the custom header. If the server does not allow the custom header, the actual request is never sent.
            </p>
            <p>
              This prevents CSRF because the attacker cannot control the preflight response — the target server must explicitly allow the custom header via CORS. Since the attacker&apos;s malicious site is not an allowed origin, the preflight fails, and the actual request is never sent. This defense is effective for API-based applications (SPAs, mobile apps) but does not protect against form-based CSRF attacks (which cannot set custom headers).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you protect GraphQL mutations against CSRF?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              GraphQL mutations are typically sent as POST requests, so they are vulnerable to CSRF. Protect them using the same CSRF defenses as REST APIs — SameSite cookies, CSRF tokens, or custom headers. For SPAs, use the double-submit cookie pattern (CSRF token in cookie + custom header). For server-rendered applications, use CSRF tokens embedded in the HTML.
            </p>
            <p>
              Additionally, require a custom Content-Type (application/json) for GraphQL requests — browsers require a preflight OPTIONS request for non-standard Content-Types, which blocks forged requests from malicious sites. However, this defense alone is not sufficient — it should be combined with SameSite cookies or CSRF tokens for defense-in-depth.
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
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP CSRF Prevention Cheat Sheet
            </a> — Comprehensive CSRF defense recommendations.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: SameSite Cookies
            </a> — SameSite attribute documentation and examples.
          </li>
          <li>
            <a href="https://portswigger.net/web-security/csrf" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PortSwigger: CSRF Vulnerabilities
            </a> — CSRF attack techniques and defenses.
          </li>
          <li>
            <a href="https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-05" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 6265bis: Cookie Prefixes and SameSite
            </a> — Cookie specification including SameSite.
          </li>
          <li>
            <a href="https://web.dev/samesite-cookies-explained/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev: SameSite Cookies Explained
            </a> — Practical guide to SameSite configuration.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP: Synchronizer Token Pattern
            </a> — Detailed CSRF token implementation guide.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}