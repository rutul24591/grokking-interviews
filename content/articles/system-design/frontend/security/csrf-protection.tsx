"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-security-csrf-protection-extensive",
  title: "CSRF Protection",
  description: "Comprehensive guide to Cross-Site Request Forgery (CSRF) attacks, token-based defenses, SameSite cookies, and production-ready protection strategies for staff/principal engineer interviews.",
  category: "frontend",
  subcategory: "security",
  slug: "csrf-protection",
  version: "extensive",
  wordCount: 7800,
  readingTime: 31,
  lastUpdated: "2026-03-19",
  tags: ["security", "csrf", "xsrf", "frontend", "web-security", "csrf-token", "samesite-cookies"],
  relatedTopics: ["xss-prevention", "secure-cookie-attributes", "authentication-patterns"],
};

export default function CSRFProtectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Cross-Site Request Forgery (CSRF or XSRF)</strong> is an attack that tricks an authenticated
          user&apos;s browser into performing unintended actions on a trusted website where they&apos;re logged in.
          The attacker exploits the browser&apos;s automatic inclusion of credentials (cookies, HTTP authentication,
          client certificates) with every request to a domain, regardless of which site initiated the request.
        </p>
        <p>
          Unlike XSS, which injects malicious code into a trusted site, CSRF abuses the trust relationship between
          a user&apos;s browser and a website. The attacker doesn&apos;t steal credentials or session tokens—they
          simply trick the browser into sending legitimate requests with the user&apos;s existing authentication.
        </p>
        <p>
          <strong>How CSRF works:</strong> When you log into a website (e.g., your bank), the server sets a session
          cookie in your browser. For subsequent requests to that domain, the browser automatically includes the cookie.
          If you visit a malicious site while logged in, that site can craft requests to your bank&apos;s endpoints,
          and your browser will happily include the session cookie—making the request appear legitimate to the server.
        </p>
        <p>
          CSRF consistently appears in the OWASP Top 10 (currently OWASP Top 10 2021 #1: Broken Access Control,
          which includes CSRF). While modern frameworks and browsers have improved defenses, CSRF remains relevant
          because:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Legacy applications:</strong> Many production systems lack proper CSRF protection
          </li>
          <li>
            <strong>API vulnerabilities:</strong> REST and GraphQL APIs often overlook CSRF when using cookie-based
            authentication
          </li>
          <li>
            <strong>Mobile/web hybrid apps:</strong> WebView-based mobile apps can be vulnerable to CSRF if not
            properly configured
          </li>
          <li>
            <strong>State-changing GET requests:</strong> Poorly designed APIs that use GET for mutations are
            inherently CSRF-vulnerable
          </li>
        </ul>
        <p>
          <strong>Why CSRF matters for staff/principal engineers:</strong> As a technical leader, you&apos;re
          responsible for authentication architecture, session management strategies, and API design patterns.
          CSRF protection requires understanding the interplay between cookies, same-origin policy, CORS, and
          token-based defenses. You must make architectural decisions about authentication (cookie-based vs.
          token-based), design secure APIs, and establish security standards that protect against both known
          and emerging attack vectors.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: CSRF Exploits Browser Behavior, Not Vulnerabilities</h3>
          <p>
            CSRF doesn&apos;t exploit a bug—it exploits expected browser behavior. Browsers are designed to send
            cookies automatically with requests to the cookie&apos;s domain. This is a feature, not a bug, but
            attackers weaponize it. Defense requires breaking this automatic behavior for state-changing requests.
          </p>
        </div>
      </section>

      <section>
        <h2>CSRF Attack Mechanics</h2>
        <p>
          Understanding CSRF requires grasping how browsers handle credentials and how attackers exploit this
          behavior.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">The Browser&apos;s Credential Behavior</h3>
        <p>
          Browsers automatically include credentials with cross-origin requests in these scenarios:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Cookies:</strong> All cookies matching the request domain are included (unless SameSite
            attribute restricts this)
          </li>
          <li>
            <strong>HTTP Authentication:</strong> Basic auth, digest auth credentials are automatically sent
          </li>
          <li>
            <strong>Client Certificates:</strong> TLS client certificates are automatically presented
          </li>
        </ul>
        <p>
          This automatic credential inclusion is what makes CSRF possible. The attacker doesn&apos;t need to
          steal your session—they just need your browser to send requests with the session already attached.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CSRF Attack Requirements</h3>
        <p>
          For a CSRF attack to succeed, three conditions must be met:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Relevant action:</strong> The application performs state-changing actions (transfer money,
            change email, delete account, update password) via HTTP requests.
          </li>
          <li>
            <strong>Cookie-based authentication:</strong> The application relies solely on cookies for
            authentication without additional verification.
          </li>
          <li>
            <strong>Predictable request structure:</strong> The attacker can predict or determine the request
            parameters needed to perform the action.
          </li>
        </ol>
        <p>
          If any of these conditions is broken, CSRF becomes impossible or impractical.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CSRF Attack Vectors</h3>

        <h4 className="mt-4 mb-2 font-semibold">GET-based CSRF</h4>
        <p>
          If state-changing actions use GET requests (a violation of REST principles), CSRF is trivial:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Attacker's malicious page -->
<img src="https://bank.com/transfer?to=attacker&amount=1000" width="0" height="0">`}</code>
        </pre>
        <p>
          When the victim visits the attacker&apos;s page, the browser loads the image—which is actually a
          GET request to the bank&apos;s transfer endpoint. The browser automatically includes the session
          cookie, and the transfer executes.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">POST-based CSRF (Form-based)</h4>
        <p>
          For POST requests, attackers use auto-submitting forms:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Attacker's malicious page -->
<form id="csrf-form" action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker-account">
  <input type="hidden" name="amount" value="1000">
</form>
<script>document.getElementById('csrf-form').submit();</script>`}</code>
        </pre>
        <p>
          The form auto-submits when the page loads, sending a POST request with the victim&apos;s session
          cookie to the bank&apos;s transfer endpoint.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">AJAX/Fetch-based CSRF</h4>
        <p>
          Modern attacks use fetch or XMLHttpRequest:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Attacker's malicious JavaScript
fetch('https://bank.com/api/transfer', {
  method: 'POST',
  credentials: 'include', // Include cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: 'attacker', amount: 1000 })
});`}</code>
        </pre>
        <p>
          Note: CORS restrictions may block this attack unless the server allows cross-origin requests with
          <code className="text-sm">Access-Control-Allow-Credentials: true</code>. However, simple POST requests
          (without custom headers) can still succeed via form-based attacks.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/csrf-attack-flow.svg"
          alt="CSRF Attack Flow showing attacker tricking victim's browser into sending authenticated requests"
          caption="CSRF Attack Flow: The attacker exploits the browser's automatic credential inclusion to perform unauthorized actions on behalf of the authenticated victim."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Real-World CSRF Impact</h3>
        <ul className="space-y-2">
          <li>
            <strong>Financial theft:</strong> Unauthorized money transfers, cryptocurrency withdrawals, payment
            method changes
          </li>
          <li>
            <strong>Account takeover:</strong> Email/password changes, 2FA disablement, recovery option updates
          </li>
          <li>
            <strong>Data manipulation:</strong> Profile changes, preference updates, content modification
          </li>
          <li>
            <strong>Destructive actions:</strong> Account deletion, data erasure, service cancellation
          </li>
          <li>
            <strong>Privilege escalation:</strong> Role changes, permission grants, admin creation
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: CSRF Targets State-Changing Operations</h3>
          <p>
            CSRF only affects requests that change server state. Read-only GET requests (fetching data, viewing
            profiles) are not CSRF targets because they don&apos;t cause side effects. However, GET requests that
            perform mutations are critically vulnerable.
          </p>
        </div>
      </section>

      <section>
        <h2>CSRF Defense Strategies</h2>
        <p>
          Effective CSRF protection requires multiple layers of defense. No single technique is perfect, but
          combining approaches provides robust protection.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/csrf-defense-layers.svg"
          alt="CSRF Defense-in-Depth showing CSRF Tokens, SameSite Cookies, Origin/Referer Validation, and Custom Headers"
          caption="CSRF Defense-in-Depth: Multiple overlapping layers ensure protection even if one defense fails."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Defense 1: CSRF Tokens (Synchronizer Token Pattern)</h3>
        <p>
          CSRF tokens are the gold standard for CSRF prevention. The server generates a unique, unpredictable
          token per user session (or per request) and requires it with every state-changing request.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">How CSRF Tokens Work</h4>
        <ol className="space-y-2">
          <li>
            <strong>Token generation:</strong> Server creates a cryptographically random token tied to the user&apos;s
            session
          </li>
          <li>
            <strong>Token delivery:</strong> Token is embedded in forms (hidden field) or provided via API for
            client-side inclusion
          </li>
          <li>
            <strong>Token submission:</strong> Client includes token with every state-changing request (form field,
            header, or request body)
          </li>
          <li>
            <strong>Token validation:</strong> Server verifies the token matches the session before processing
          </li>
        </ol>
        <p>
          <strong>Why this works:</strong> The attacker cannot predict or retrieve the token (same-origin policy
          prevents reading the response). Without the token, forged requests fail validation.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Token Storage Strategies</h4>
        <ul className="space-y-2">
          <li>
            <strong>Session-based tokens:</strong> Token stored in server session, sent to client in hidden form
            field or meta tag. Most secure but requires server-side state.
          </li>
          <li>
            <strong>Cookie + header (Double Submit Cookie):</strong> Token stored in cookie (readable by JavaScript)
            and must match a custom header. Stateless but requires careful implementation.
          </li>
          <li>
            <strong>JWT-embedded tokens:</strong> Token embedded in JWT claims. Useful for token-based auth but
            requires JWT on every request.
          </li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Token Implementation Patterns</h4>
        <p>
          <strong>Form-based (traditional):</strong>
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Server renders form with hidden CSRF token -->
<form action="/transfer" method="POST">
  <input type="hidden" name="_csrf" value="abc123xyz789">
  <input name="amount" value="100">
  <button type="submit">Transfer</button>
</form>`}</code>
        </pre>

        <p>
          <strong>Header-based (SPA/API):</strong>
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Client reads token from meta tag or cookie
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

// Include in fetch requests
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify({ amount: 100 })
});`}</code>
        </pre>

        <h4 className="mt-4 mb-2 font-semibold">Token Best Practices</h4>
        <ul className="space-y-2">
          <li>
            <strong>Cryptographically random:</strong> Use secure random generation (crypto.randomBytes,
            window.crypto.getRandomValues)
          </li>
          <li>
            <strong>Unique per session:</strong> Regenerate tokens on session creation and rotation
          </li>
          <li>
            <strong>Constant-time comparison:</strong> Prevent timing attacks when validating tokens
          </li>
          <li>
            <strong>Fail closed:</strong> Reject requests missing tokens or with invalid tokens
          </li>
          <li>
            <strong>Exclude safe methods:</strong> Don&apos;t require tokens for GET, HEAD, OPTIONS (idempotent
            methods)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Defense 2: SameSite Cookies</h3>
        <p>
          The <code className="text-sm">SameSite</code> cookie attribute tells browsers when to send cookies
          with cross-origin requests. This is a modern, browser-enforced CSRF defense.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">SameSite Values</h4>
        <ul className="space-y-2">
          <li>
            <strong>SameSite=Strict:</strong> Cookies never sent with cross-origin requests. Maximum protection
            but breaks legitimate cross-origin flows (e.g., clicking a link from email).
          </li>
          <li>
            <strong>SameSite=Lax:</strong> Cookies sent with top-level navigations (link clicks) but not with
            subrequests (images, forms, fetch). Default in modern browsers. Good balance of security and UX.
          </li>
          <li>
            <strong>SameSite=None:</strong> Cookies sent with all cross-origin requests. Requires
            <code className="text-sm">Secure</code> attribute (HTTPS only). Use only when cross-origin cookie
            sharing is required.
          </li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">SameSite Implementation</h4>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Server-side cookie setting
Set-Cookie: sessionId=abc123; SameSite=Lax; Secure; HttpOnly

// Or in Express.js
res.cookie('sessionId', 'abc123', {
  sameSite: 'lax',
  secure: true,
  httpOnly: true
});`}</code>
        </pre>

        <h4 className="mt-4 mb-2 font-semibold">SameSite Limitations</h4>
        <ul className="space-y-2">
          <li>
            <strong>Browser support:</strong> Not supported in older browsers (IE, old Safari)
          </li>
          <li>
            <strong>Not comprehensive:</strong> SameSite=Lax still allows cookies with GET requests and
            top-level navigations
          </li>
          <li>
            <strong>POST form bypass:</strong> Some edge cases allow cross-origin POST with SameSite=Lax
          </li>
          <li>
            <strong>Not a silver bullet:</strong> Should be combined with CSRF tokens for defense in depth
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Defense 3: Origin/Referer Header Validation</h3>
        <p>
          Browsers automatically send <code className="text-sm">Origin</code> and <code className="text-sm">Referer</code>
          headers with requests. Servers can validate these headers to ensure requests originate from trusted domains.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Header Differences</h4>
        <ul className="space-y-2">
          <li>
            <strong>Origin header:</strong> Contains scheme, host, and port (e.g., <code className="text-sm">https://example.com</code>).
            Sent with CORS requests and POST requests. More privacy-friendly.
          </li>
          <li>
            <strong>Referer header:</strong> Contains full URL including path (e.g., <code className="text-sm">https://example.com/page</code>).
            Sent with most requests but can be stripped by privacy settings or referrer policies.
          </li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Validation Logic</h4>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Server-side validation (Node.js example)
function validateOrigin(req) {
  const origin = req.headers.origin || req.headers.referer;
  
  if (!origin) {
    return false; // Missing headers - suspicious
  }
  
  const allowedOrigins = ['https://example.com', 'https://app.example.com'];
  const originUrl = new URL(origin);
  
  return allowedOrigins.includes(originUrl.origin);
}`}</code>
        </pre>

        <h4 className="mt-4 mb-2 font-semibold">Limitations</h4>
        <ul className="space-y-2">
          <li>
            <strong>Not always present:</strong> Referer can be stripped by privacy settings, referrer-policy,
            or HTTPS→HTTP transitions
          </li>
          <li>
            <strong>Can be spoofed:</strong> Attackers can forge headers in non-browser contexts (though this
            doesn&apos;t help with CSRF specifically)
          </li>
          <li>
            <strong>Secondary defense:</strong> Should complement CSRF tokens, not replace them
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Defense 4: Custom Request Headers</h3>
        <p>
          Requiring custom headers (e.g., <code className="text-sm">X-Requested-With: XMLHttpRequest</code>)
          for state-changing requests provides CSRF protection because:
        </p>
        <ul className="space-y-2">
          <li>
            Cross-origin requests with custom headers trigger CORS preflight (OPTIONS request)
          </li>
          <li>
            Server can reject preflight by not including <code className="text-sm">Access-Control-Allow-Headers</code>
          </li>
          <li>
            Without CORS approval, the browser blocks the actual request
          </li>
        </ul>
        <p>
          <strong>Limitation:</strong> Only protects AJAX/fetch requests. Simple form-based CSRF attacks don&apos;t
          include custom headers and bypass this defense.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Defense 5: User Interaction Requirements</h3>
        <p>
          Requiring explicit user interaction for sensitive actions provides inherent CSRF protection:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Re-authentication:</strong> Require password entry for critical actions (password change,
            2FA setup, large transfers)
          </li>
          <li>
            <strong>CAPTCHA:</strong> Challenge-response tests that bots can&apos;t solve
          </li>
          <li>
            <strong>Multi-step confirmation:</strong> Require multiple clicks or form submissions
          </li>
          <li>
            <strong>Time-based delays:</strong> Force waiting period before executing sensitive actions
          </li>
        </ul>
        <p>
          These techniques add friction but are appropriate for high-risk operations.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Layer CSRF Defenses</h3>
          <p>
            No single CSRF defense is perfect. SameSite cookies provide excellent baseline protection but have
            browser support gaps. CSRF tokens are robust but require implementation effort. Origin validation is
            useful but headers can be missing. Combine all three for defense in depth.
          </p>
        </div>
      </section>

      <section>
        <h2>CSRF in Modern Architectures</h2>
        <p>
          CSRF protection varies based on authentication architecture. Understanding these differences is
          critical for designing secure systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cookie-Based Authentication (Traditional)</h3>
        <p>
          Session cookies are the classic CSRF target. Defense requires:
        </p>
        <ul className="space-y-2">
          <li>CSRF tokens (synchronizer token pattern or double-submit cookie)</li>
          <li>SameSite=Lax or SameSite=Strict cookies</li>
          <li>Origin/Referer validation as secondary check</li>
          <li>HttpOnly + Secure cookie flags (limit XSS impact)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token-Based Authentication (JWT, OAuth)</h3>
        <p>
          When using bearer tokens (JWT, OAuth access tokens) stored in localStorage or sessionStorage:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Not vulnerable to CSRF:</strong> Tokens aren&apos;t automatically sent with requests.
            Attacker can&apos;t forge requests without the token.
          </li>
          <li>
            <strong>Vulnerable to XSS:</strong> localStorage is accessible to JavaScript. XSS can steal tokens.
          </li>
          <li>
            <strong>Best practice:</strong> Store tokens in memory (React state, Redux) rather than
            localStorage when possible.
          </li>
        </ul>
        <p>
          <strong>Hybrid approach (recommended):</strong> Store tokens in HttpOnly cookies (not accessible to
          JavaScript) and use CSRF tokens. This protects against both XSS (can&apos;t read cookie) and CSRF
          (need token).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">API/REST Services</h3>
        <p>
          REST APIs face unique CSRF challenges:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Stateless design:</strong> Session-based CSRF tokens conflict with stateless principles
          </li>
          <li>
            <strong>CORS configuration:</strong> Proper CORS can prevent cross-origin requests but requires
            careful setup
          </li>
          <li>
            <strong>Content-Type enforcement:</strong> Require <code className="text-sm">application/json</code>
            and reject form-encoded requests from unknown origins
          </li>
        </ul>
        <p>
          <strong>Recommended:</strong> Use JWT in HttpOnly cookies + CSRF tokens, or require Authorization
          header (which triggers CORS preflight).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">GraphQL APIs</h3>
        <p>
          GraphQL endpoints are CSRF targets if they accept mutations via POST:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>CSRF tokens:</strong> Include token in GraphQL operation context or headers
          </li>
          <li>
            <strong>CORS:</strong> Strict CORS configuration with explicit allowed origins
          </li>
          <li>
            <strong>Content-Type:</strong> Require <code className="text-sm">application/json</code> and reject
            other content types
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/csrf-authentication-comparison.svg"
          alt="CSRF Vulnerability by Authentication Method comparing Cookie-based, Token-based, and Hybrid approaches"
          caption="CSRF Vulnerability by Authentication Method: Cookie-based auth requires CSRF tokens, token-based auth is immune to CSRF but vulnerable to XSS, hybrid provides best protection."
        />
      </section>

      <section>
        <h2>Trade-offs & Considerations</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Defense</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>CSRF Tokens</strong></td>
              <td className="p-3">
                • Gold standard protection<br/>
                • Works across all browsers<br/>
                • Stateless options available
              </td>
              <td className="p-3">
                • Implementation complexity<br/>
                • Token management overhead<br/>
                • SPA integration challenges
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>SameSite Cookies</strong></td>
              <td className="p-3">
                • Browser-enforced (no code changes)<br/>
                • Default in modern browsers<br/>
                • Simple to implement
              </td>
              <td className="p-3">
                • Limited older browser support<br/>
                • SameSite=Lax has edge cases<br/>
                • Breaks some cross-origin flows
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Origin/Referer Validation</strong></td>
              <td className="p-3">
                • No client-side changes<br/>
                • Stateless validation<br/>
                • Good secondary defense
              </td>
              <td className="p-3">
                • Headers not always present<br/>
                • Privacy settings can strip<br/>
                • Not reliable as primary defense
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Custom Headers</strong></td>
              <td className="p-3">
                • Simple for AJAX apps<br/>
                • CORS preflight enforcement<br/>
                • No server-side state
              </td>
              <td className="p-3">
                • Doesn&apos;t stop form-based CSRF<br/>
                • Requires JavaScript<br/>
                • CORS complexity
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Re-authentication</strong></td>
              <td className="p-3">
                • Strong user verification<br/>
                • Prevents automated attacks<br/>
                • Good for high-risk actions
              </td>
              <td className="p-3">
                • User friction<br/>
                • Not suitable for all actions<br/>
                • Implementation overhead
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Architectural</h3>
        <ul className="space-y-2">
          <li>
            <strong>Use POST/PUT/DELETE for mutations:</strong> Never use GET for state-changing operations.
            GET requests should be idempotent and side-effect free.
          </li>
          <li>
            <strong>Implement defense in depth:</strong> Combine CSRF tokens + SameSite cookies + Origin validation.
            Don&apos;t rely on a single defense.
          </li>
          <li>
            <strong>Choose authentication wisely:</strong> HttpOnly cookie + CSRF token provides better security
            than localStorage JWT (protects against both XSS and CSRF).
          </li>
          <li>
            <strong>Design secure APIs:</strong> Require specific Content-Type, use CORS properly, validate
            Origin/Referer headers.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CSRF Token Implementation</h3>
        <ul className="space-y-2">
          <li>
            <strong>Generate securely:</strong> Use cryptographically secure random generation (minimum 128 bits
            of entropy)
          </li>
          <li>
            <strong>Validate properly:</strong> Use constant-time comparison to prevent timing attacks
          </li>
          <li>
            <strong>Rotate appropriately:</strong> Regenerate on session creation, consider per-request tokens
            for high-security apps
          </li>
          <li>
            <strong>Exclude safe methods:</strong> Don&apos;t validate tokens for GET, HEAD, OPTIONS
          </li>
          <li>
            <strong>Fail securely:</strong> Reject requests with missing or invalid tokens (403 Forbidden)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cookie Configuration</h3>
        <ul className="space-y-2">
          <li>
            <strong>SameSite=Lax minimum:</strong> Use Lax as baseline, Strict for high-security apps
          </li>
          <li>
            <strong>Always use Secure:</strong> Cookies only over HTTPS
          </li>
          <li>
            <strong>Use HttpOnly:</strong> Prevent JavaScript access (limits XSS impact)
          </li>
          <li>
            <strong>Set appropriate expiration:</strong> Short-lived session cookies reduce attack window
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CORS Configuration</h3>
        <ul className="space-y-2">
          <li>
            <strong>Explicit allowed origins:</strong> Never use <code className="text-sm">*</code> with
            <code className="text-sm">Access-Control-Allow-Credentials</code>
          </li>
          <li>
            <strong>Restrict methods:</strong> Only allow necessary HTTP methods
          </li>
          <li>
            <strong>Limit headers:</strong> Explicitly list allowed headers, don&apos;t wildcard
          </li>
          <li>
            <strong>Preflight caching:</strong> Use <code className="text-sm">Access-Control-Max-Age</code> to
            reduce OPTIONS requests
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing & Monitoring</h3>
        <ul className="space-y-2">
          <li>
            <strong>Automated CSRF testing:</strong> Use tools like OWASP ZAP, Burp Suite to test CSRF protection
          </li>
          <li>
            <strong>Log CSRF failures:</strong> Monitor and alert on requests with invalid/missing tokens
          </li>
          <li>
            <strong>Penetration testing:</strong> Include CSRF in security testing scope
          </li>
          <li>
            <strong>Dependency updates:</strong> Keep frameworks updated for latest CSRF protections
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: CSRF Protection Is Framework-Dependent</h3>
          <p>
            Modern frameworks (Express with csurf, Django, Rails, Spring Security, ASP.NET) include built-in CSRF
            protection. Use framework defaults when possible, but understand the underlying mechanisms to configure
            them correctly and debug issues.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Relying solely on SameSite:</strong> SameSite cookies are excellent but not comprehensive.
            Older browsers don&apos;t support them, and SameSite=Lax has edge cases. Always combine with CSRF
            tokens.
          </li>
          <li>
            <strong>Using GET for mutations:</strong> GET requests should never change state. Using GET for
            mutations makes CSRF trivial (just an image tag or link).
          </li>
          <li>
            <strong>Validating tokens with timing-vulnerable comparison:</strong> Using <code className="text-sm">==</code> or
            <code className="text-sm">===</code> for token comparison allows timing attacks. Use constant-time
            comparison functions.
          </li>
          <li>
            <strong>Storing tokens in localStorage without XSS protection:</strong> If your site has XSS
            vulnerabilities, attackers can read CSRF tokens from localStorage. Use HttpOnly cookies or
            server-side sessions.
          </li>
          <li>
            <strong>Not protecting subdomains:</strong> CSRF tokens should be validated across all subdomains.
            Attackers can host malicious pages on unprotected subdomains.
          </li>
          <li>
            <strong>Ignoring CORS misconfiguration:</strong> <code className="text-sm">Access-Control-Allow-Origin: *</code>
            with credentials allows any site to make authenticated requests. Never combine wildcard origin with
            credentials.
          </li>
          <li>
            <strong>Forgetting about mobile/WebViews:</strong> Mobile apps using WebViews can be CSRF targets.
            Ensure WebView configurations don&apos;t allow cross-origin requests without proper authentication.
          </li>
          <li>
            <strong>Token reuse across sessions:</strong> CSRF tokens should be tied to user sessions. Reusing
            tokens across sessions allows session fixation attacks.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-Commerce Platform</h3>
        <p>
          <strong>Challenge:</strong> Users add items to cart, update shipping addresses, and complete purchases.
          Attackers could CSRF users into changing shipping addresses or making unauthorized purchases.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>CSRF tokens on all checkout and account modification forms</li>
          <li>SameSite=Lax on session cookies</li>
          <li>Re-authentication required for payment method changes</li>
          <li>Order confirmation emails for all purchases (detect unauthorized orders)</li>
          <li>CORS configured to only allow requests from trusted domains</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application</h3>
        <p>
          <strong>Challenge:</strong> High-risk financial transactions (money transfers, bill payments) are
          prime CSRF targets. Attackers could drain accounts via forged requests.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Per-request CSRF tokens (not session-based) for all transactions</li>
          <li>SameSite=Strict on all authentication cookies</li>
          <li>Mandatory re-authentication for transfers above threshold</li>
          <li>Transaction confirmation via separate channel (SMS, email, push notification)</li>
          <li>Origin/Referer validation as secondary check</li>
          <li>Real-time fraud monitoring for unusual transfer patterns</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SaaS Dashboard</h3>
        <p>
          <strong>Challenge:</strong> B2B SaaS with team management, billing updates, and API key generation.
          CSRF could allow attackers to modify team permissions or regenerate API keys.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Double-submit cookie pattern for SPA (token in cookie + header)</li>
          <li>SameSite=Lax for session cookies</li>
          <li>GraphQL mutations require CSRF token in operation context</li>
          <li>Audit logging for all sensitive actions (permission changes, key regeneration)</li>
          <li>Email notifications for security-sensitive changes</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Social Media Platform</h3>
        <p>
          <strong>Challenge:</strong> Users post content, follow accounts, and manage privacy settings. CSRF
          could force unwanted follows, posts, or privacy changes.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>CSRF tokens embedded in meta tags for SPA to read</li>
          <li>SameSite=Lax as baseline protection</li>
          <li>Rate limiting on follow/unfollow actions (also prevents abuse)</li>
          <li>Privacy setting changes require confirmation dialog</li>
          <li>Content posting requires valid Origin header</li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://owasp.org/www-community/attacks/csrf" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP CSRF Attack Documentation
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP CSRF Prevention Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: SameSite Cookie Attribute
            </a>
          </li>
          <li>
            <a href="https://portswigger.net/web-security/csrf" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PortSwigger CSRF Vulnerabilities
            </a>
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc6265" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 6265: HTTP State Management Mechanism (Cookies)
            </a>
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc6797" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 6797: HTTP Strict Transport Security (HSTS)
            </a>
          </li>
          <li>
            <a href="https://web.dev/samesite-cookies-explained/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev: SameSite Cookies Explained
            </a>
          </li>
          <li>
            <a href="https://github.com/expressjs/csurf" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Express CSRF Middleware (csurf)
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: What is CSRF and how does it differ from XSS?</p>
            <p className="mt-2 text-sm">
              A: <strong>CSRF (Cross-Site Request Forgery)</strong> tricks an authenticated user&apos;s browser
              into performing unintended actions on a trusted website by exploiting automatic credential inclusion
              (cookies). The attacker doesn&apos;t steal credentials—they abuse the trust relationship between
              browser and server. <strong>XSS (Cross-Site Scripting)</strong> injects malicious scripts into a
              trusted website, which execute in victims&apos; browsers. XSS steals data or sessions; CSRF performs
              actions on behalf of the user. XSS exploits trust in the website; CSRF exploits trust in the user.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: How do CSRF tokens prevent CSRF attacks?</p>
            <p className="mt-2 text-sm">
              A: CSRF tokens are unique, unpredictable values generated by the server and required with every
              state-changing request. The token is embedded in forms or provided via API, and the server validates
              it before processing. This works because of the same-origin policy: the attacker can&apos;t read
              the token from the legitimate site (no XSS), so they can&apos;t include it in forged requests.
              Without the correct token, the server rejects the request.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: What is the SameSite cookie attribute and how does it protect against CSRF?</p>
            <p className="mt-2 text-sm">
              A: <strong>SameSite</strong> tells browsers when to send cookies with cross-origin requests.
              <code className="text-sm">SameSite=Strict</code> never sends cookies cross-origin (maximum
              protection). <code className="text-sm">SameSite=Lax</code> sends cookies with top-level navigations
              (link clicks) but not subrequests (forms, images, fetch)—this blocks most CSRF attacks while
              preserving UX. <code className="text-sm">SameSite=None</code> allows all cross-origin requests
              (requires Secure flag). SameSite=Lax is the default in modern browsers, providing baseline CSRF
              protection without code changes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: You&apos;re building a REST API with cookie-based authentication. How do you prevent CSRF?</p>
            <p className="mt-2 text-sm">
              A: Layered approach: (1) CSRF tokens required for all POST/PUT/DELETE/PATCH requests, sent in
              custom header (X-CSRF-Token). (2) SameSite=Lax on session cookies. (3) Strict CORS configuration
              with explicit allowed origins, never wildcard with credentials. (4) Require
              <code className="text-sm">Content-Type: application/json</code> and reject form-encoded requests
              from unknown origins. (5) Origin/Referer header validation as secondary check. (6) Consider JWT in
              HttpOnly cookies instead of localStorage for better XSS+CSRF protection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: Why is using GET for state-changing operations a CSRF risk?</p>
            <p className="mt-2 text-sm">
              A: GET requests are trivially forgeable—an attacker just needs an image tag
              (<code className="text-sm">&lt;img src=&quot;https://site.com/action?param=value&quot;&gt;</code>)
              or a link. The browser automatically sends GET requests with cookies when loading the image or when
              a user clicks the link. If that GET request performs a state-changing action (transfer money, delete
              account), the attack succeeds. REST principles dictate GET should be idempotent and side-effect free.
              Always use POST/PUT/DELETE for mutations—they require forms or JavaScript to forge, adding friction
              for attackers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: What&apos;s the difference between session-based CSRF tokens and double-submit cookie pattern?</p>
            <p className="mt-2 text-sm">
              A: <strong>Session-based tokens:</strong> Server generates token, stores it in session, sends to
              client in hidden form field or meta tag. Client submits token; server compares with session value.
              Pros: Most secure. Cons: Requires server-side state. <strong>Double-submit cookie:</strong> Server
              sets token in cookie (readable by JavaScript). Client reads cookie and sends token in custom header.
              Server verifies cookie and header match. Pros: Stateless. Cons: Vulnerable if subdomain is
              compromised (can set cookies), requires careful implementation. Session-based is preferred for
              high-security apps; double-submit works for stateless APIs.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
