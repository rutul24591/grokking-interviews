"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-security-headers-extensive",
  title: "Security Headers",
  description:
    "Staff-level deep dive into HTTP security headers, Content Security Policy, HSTS, X-Content-Type-Options, X-Frame-Options, and the operational practice of configuring security headers at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "security-headers",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "headers", "csp", "hsts", "web-security"],
  relatedTopics: ["xss-prevention", "csrf-protection", "cors-cross-origin-resource-sharing", "tls-ssl"],
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
          <strong>Security headers</strong> are HTTP response headers that instruct the browser to enforce specific
          security controls — they are the first line of defense against web attacks (XSS, clickjacking, MIME
          sniffing, protocol downgrade). Security headers are sent by the server with every HTTP response and
          enforced by the browser — they do not require any client-side code or server-side processing beyond
          setting the header value.
        </p>
        <p>
          Security headers are essential for any web application — without them, the browser&apos;s default behavior
          may allow attacks that security headers would prevent. For example, without Content-Security-Policy,
          the browser will execute any inline script (including injected XSS payloads); without
          Strict-Transport-Security, the browser may allow HTTP connections (enabling SSL stripping attacks);
          without X-Content-Type-Options, the browser may sniff MIME types (executing a file as JavaScript that
          was served as text/plain).
        </p>
        <p>
          The evolution of security headers has been shaped by increasingly sophisticated attacks. Early headers
          (X-Frame-Options, X-XSS-Protection) were browser-specific and limited in scope. Modern headers
          (Content-Security-Policy, Permissions-Policy) are standardized, expressive, and widely supported.
          CSP is the most powerful security header — it can prevent XSS, data injection, clickjacking, and
          other attacks by controlling which resources the browser can load and execute.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">Essential Security Headers</h3>
          <p className="text-muted mb-3">
            <strong>Strict-Transport-Security:</strong> Forces HTTPS for all future requests. Prevents SSL stripping and protocol downgrade attacks.
          </p>
          <p className="text-muted mb-3">
            <strong>Content-Security-Policy:</strong> Controls which resources the browser can load and execute. Prevents XSS, data injection, and clickjacking.
          </p>
          <p className="text-muted mb-3">
            <strong>X-Content-Type-Options: nosniff:</strong> Prevents MIME type sniffing. Prevents drive-by downloads and XSS via MIME type confusion.
          </p>
          <p className="text-muted mb-3">
            <strong>X-Frame-Options: DENY:</strong> Prevents embedding the page in iframes. Prevents clickjacking and UI redressing attacks.
          </p>
          <p className="text-muted mb-3">
            <strong>Referrer-Policy:</strong> Controls the Referrer header sent with requests. Prevents URL leakage and tracking via referrer.
          </p>
          <p>
            <strong>Permissions-Policy:</strong> Restricts browser API access (camera, microphone, geolocation). Prevents unauthorized access to sensitive browser features.
          </p>
        </div>
        <p>
          Security header configuration is typically implemented at the web server level (Nginx, Apache, Caddy)
          or CDN level (Cloudflare, Fastly, AWS CloudFront) — this ensures that headers are sent with every
          response (including static files, error pages, and redirects). Application-level headers (set by the
          application framework) only cover application responses — they do not cover static files, error pages,
          or redirects handled by the web server.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Content-Security-Policy (CSP) is the most powerful security header — it controls which resources the
          browser can load and execute. CSP directives include script-src (controls script sources), style-src
          (controls style sources), img-src (controls image sources), frame-ancestors (controls iframe
          embedding), default-src (fallback for unspecified directives), and many others. A strict CSP
          (default-src &apos;self&apos;; script-src &apos;self&apos;) allows only same-origin resources, blocking all external and inline
          scripts — this prevents XSS because injected scripts cannot load or execute.
        </p>
        <p>
          CSP has two modes: enforcing mode (Content-Security-Policy) blocks resources that violate the policy,
          and report-only mode (Content-Security-Policy-Report-Only) reports violations without blocking.
          Report-only mode is used to test new CSP policies before enforcing them — the browser sends violation
          reports to a specified endpoint (report-uri or report-to), allowing developers to identify and fix
          policy violations before enforcement.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/security-headers-diagram-1.svg"
          alt="HTTP security headers showing HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy"
          caption="Security headers: each header instructs the browser to enforce a specific security control — HSTS forces HTTPS, CSP blocks unauthorized scripts, X-Content-Type-Options prevents MIME sniffing, X-Frame-Options prevents iframe embedding."
        />
        <p>
          Strict-Transport-Security (HSTS) forces the browser to use HTTPS for all future requests to the
          domain — even if the user types &quot;http://&quot; or clicks an HTTP link. HSTS is configured with a max-age
          (how long the browser should remember the directive, typically 31536000 seconds = 1 year) and
          includeSubDomains (whether to apply the directive to all subdomains). HSTS preload is the practice of
          submitting the domain to the browser&apos;s HSTS preload list — this ensures that the browser enforces HTTPS
          even on the first visit (before receiving the HSTS header).
        </p>
        <p>
          X-Content-Type-Options: nosniff prevents the browser from MIME type sniffing — the browser will use
          the Content-Type header as-is, without attempting to detect the actual content type. MIME type sniffing
          can be exploited — an attacker can upload a file with a benign Content-Type (text/plain) that contains
          malicious JavaScript, and the browser may execute it as JavaScript if it sniffs the content type.
          nosniff prevents this by forcing the browser to use the declared Content-Type.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/security-headers-diagram-2.svg"
          alt="CSP directives showing how Content-Security-Policy controls script, style, image, and frame loading"
          caption="CSP directives: script-src controls scripts, style-src controls styles, img-src controls images, frame-ancestors controls iframe embedding. Each directive specifies allowed sources for that resource type."
        />
        <p>
          X-Frame-Options prevents the page from being embedded in an iframe — it has two values: DENY (the page
          cannot be embedded in any iframe) and SAMEORIGIN (the page can only be embedded in an iframe from the
          same origin). X-Frame-Options prevents clickjacking — an attacker cannot embed the page in a hidden
          iframe and trick the user into clicking on it. X-Frame-Options is a legacy header — it has been
          superseded by CSP&apos;s frame-ancestors directive, which is more flexible (allows specifying specific
          origins that can embed the page). However, X-Frame-Options is still widely used for compatibility with
          older browsers.
        </p>
        <p>
          Referrer-Policy controls the Referrer header sent with requests — it can be set to no-referrer (never
          send the Referrer header), strict-origin-when-cross-origin (send full URL for same-origin requests,
          origin-only for cross-origin requests), or unsafe-url (always send full URL). Referrer-Policy prevents
          URL leakage (sensitive data in the URL path or query parameters) and tracking (the Referrer header can
          be used to track user behavior across sites). The recommended value is strict-origin-when-cross-origin
          — it provides privacy for cross-origin requests while maintaining functionality for same-origin requests.
        </p>
        <p>
          Permissions-Policy restricts browser API access — it can disable camera, microphone, geolocation,
          payment, and other sensitive APIs. Permissions-Policy prevents unauthorized access to sensitive browser
          features — for example, a malicious script cannot access the camera or microphone if the Permissions-Policy
          header disables them. Permissions-Policy replaces the deprecated Feature-Policy header and is supported
          by all modern browsers.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          Security headers are set at the web server level (Nginx, Apache, Caddy) or CDN level (Cloudflare,
          Fastly, AWS CloudFront) — this ensures that headers are sent with every response, including static
          files, error pages, and redirects. The web server configuration includes add_header directives (Nginx)
          or Header set directives (Apache) that add the security headers to every response. The CDN configuration
          includes Transform Rules (Cloudflare) or Response Headers (CloudFront) that add the security headers
          before the response reaches the client.
        </p>
        <p>
          The security header flow begins with the client sending a request to the server. The server processes
          the request and generates the response. Before sending the response, the web server adds the security
          headers (Strict-Transport-Security, Content-Security-Policy, X-Content-Type-Options, X-Frame-Options,
          Referrer-Policy, Permissions-Policy). The client receives the response with the security headers, and
          the browser enforces the security controls — it blocks resources that violate CSP, forces HTTPS for
          future requests (HSTS), prevents MIME type sniffing (X-Content-Type-Options), prevents iframe embedding
          (X-Frame-Options), controls the Referrer header (Referrer-Policy), and restricts browser API access
          (Permissions-Policy).
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/security-headers-diagram-3.svg"
          alt="Security header implementation guide showing application, web server, and CDN levels, and security rating impact"
          caption="Security headers can be set at the application level (framework middleware), web server level (Nginx, Apache), or CDN level (Cloudflare, CloudFront). Web server or CDN level is recommended for comprehensive coverage."
        />
        <p>
          CSP violation reporting is the practice of monitoring CSP violations — when the browser blocks a
          resource that violates the CSP, it sends a violation report to the specified endpoint (report-uri or
          report-to). The violation report includes the blocked resource URL, the violated directive, and the
          page URL where the violation occurred. Violation reports enable developers to identify and fix CSP
          policy issues (legitimate resources being blocked) and detect potential attacks (injected scripts being
          blocked).
        </p>
        <p>
          HSTS preload is the practice of submitting the domain to the browser&apos;s HSTS preload list — this ensures
          that the browser enforces HTTPS even on the first visit (before receiving the HSTS header). HSTS
          preload requires the domain to meet specific requirements (valid HTTPS certificate, redirect HTTP to
          HTTPS, serve HSTS header with max-age of at least 31536000 and includeSubDomains). HSTS preload is
          essential for high-security domains (banking, healthcare, government) where the first visit must be
          secure.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          Strict CSP versus relaxed CSP is a trade-off between security and compatibility. A strict CSP
          (default-src &apos;self&apos;; script-src &apos;self&apos;) blocks all external and inline scripts — this provides maximum XSS
          protection but may break legitimate functionality (third-party widgets, analytics scripts, inline
          scripts). A relaxed CSP (allowing &apos;unsafe-inline&apos;, &apos;unsafe-eval&apos;, or specific external domains) maintains
          compatibility but provides less XSS protection. The recommended approach is to use a strict CSP with
          nonce-based allowances for specific inline scripts — this provides strong XSS protection while allowing
          legitimate inline scripts.
        </p>
        <p>
          Application-level versus web server-level security headers is a trade-off between convenience and
          comprehensiveness. Application-level headers (set by the application framework) are convenient — they
          are set in the application code and version-controlled with the application. However, they only cover
          application responses — they do not cover static files, error pages, or redirects handled by the web
          server. Web server-level headers are comprehensive — they cover all responses (application responses,
          static files, error pages, redirects). The recommended approach is web server-level headers for
          comprehensive coverage, with application-level headers as a fallback.
        </p>
        <p>
          HSTS preload versus standard HSTS is a trade-off between first-visit security and irreversibility.
          HSTS preload ensures that the browser enforces HTTPS even on the first visit (before receiving the
          HSTS header) — this provides maximum security for high-security domains. However, HSTS preload is
          irreversible — once the domain is in the preload list, it cannot be removed without waiting for the
          preload list to be updated (which can take months). Standard HSTS (without preload) is reversible —
          the domain can be removed from the HSTS cache by clearing the browser&apos;s HSTS cache. The recommended
          approach is HSTS preload for high-security domains (banking, healthcare, government) and standard HSTS
          for most domains.
        </p>
        <p>
          CSP report-only versus enforcing mode is a trade-off between testing and protection. Report-only mode
          reports violations without blocking — it is used to test new CSP policies before enforcing them.
          Enforcing mode blocks violations — it provides protection but may break legitimate functionality if
          the policy is misconfigured. The recommended approach is to use report-only mode to test new CSP
          policies, monitor violation reports to identify and fix issues, and then switch to enforcing mode once
          the policy is validated.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Set security headers at the web server or CDN level — this ensures that headers are sent with every
          response, including static files, error pages, and redirects. Use Nginx add_header directives, Apache
          Header set directives, or CDN Transform Rules to add the headers. Do not rely on application-level
          headers alone — they do not cover static files, error pages, or redirects.
        </p>
        <p>
          Use a strict Content-Security-Policy — set default-src &apos;self&apos; to block all external resources by default,
          and explicitly allow only trusted sources (script-src &apos;self&apos;, style-src &apos;self&apos; &apos;unsafe-inline&apos;, img-src
          &apos;self&apos; https: data:). Avoid &apos;unsafe-inline&apos; and &apos;unsafe-eval&apos; — they allow inline scripts and eval(), which
          enable XSS. Use nonce-based allowances for specific inline scripts (script-src &apos;nonce-abc123&apos;) instead
          of &apos;unsafe-inline&apos;.
        </p>
        <p>
          Enable HSTS with a max-age of at least 31536000 (1 year) and includeSubDomains — this forces the
          browser to use HTTPS for all future requests to the domain and its subdomains. Submit the domain to
          the HSTS preload list for first-visit security. Ensure the domain meets the HSTS preload requirements
          (valid HTTPS certificate, redirect HTTP to HTTPS, serve HSTS header with max-age and includeSubDomains)
          before submitting.
        </p>
        <p>
          Monitor CSP violation reports — set up a report-uri or report-to endpoint to receive violation reports,
          and monitor the reports for legitimate resources being blocked (policy misconfiguration) and potential
          attacks (injected scripts being blocked). Use violation reports to tune the CSP policy — allow legitimate
          resources and block malicious ones.
        </p>
        <p>
          Test security headers regularly — use tools like Mozilla Observatory (observatory.mozilla.org) and
          Security Headers (securityheaders.com) to scan the domain and verify that all security headers are
          present and correctly configured. Aim for an A+ rating — this requires all essential security headers
          (Strict-Transport-Security, Content-Security-Policy, X-Content-Type-Options, X-Frame-Options,
          Referrer-Policy, Permissions-Policy) to be present and correctly configured.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Using &apos;unsafe-inline&apos; in CSP is a common pitfall — it allows inline scripts, which enables XSS. Attackers
          can inject inline scripts into the page, and the browser will execute them because &apos;unsafe-inline&apos;
          allows all inline scripts. The fix is to remove &apos;unsafe-inline&apos; and use nonce-based allowances for
          specific inline scripts (script-src &apos;nonce-abc123&apos;). If inline scripts cannot be avoided (legacy code),
          use CSP report-only mode to identify and migrate inline scripts to external files.
        </p>
        <p>
          Not setting HSTS is a common pitfall — without HSTS, the browser may allow HTTP connections, enabling
          SSL stripping attacks (where an attacker intercepts the initial HTTP request and prevents the upgrade
          to HTTPS). The fix is to set Strict-Transport-Security with a max-age of at least 31536000 and
          includeSubDomains. Additionally, redirect all HTTP requests to HTTPS to ensure that users always
          connect over HTTPS.
        </p>
        <p>
          Setting security headers only at the application level is a common pitfall — application-level headers
          only cover application responses, not static files, error pages, or redirects handled by the web
          server. An attacker can exploit this by accessing a static file (which does not have security headers)
          and performing attacks that security headers would prevent. The fix is to set security headers at the
          web server or CDN level — this ensures that headers are sent with every response.
        </p>
        <p>
          Not monitoring CSP violation reports is a common operational pitfall — without monitoring, CSP
          violations go undetected, and legitimate resources may be blocked (breaking functionality) or
          malicious resources may be blocked (indicating an attack). The fix is to set up a report-uri or
          report-to endpoint and monitor violation reports regularly. Use violation reports to tune the CSP
          policy and detect potential attacks.
        </p>
        <p>
          Using overly permissive CSP (allowing all external sources) is a common pitfall — a CSP that allows
          all external sources (default-src *) provides no protection. The fix is to use a strict CSP
          (default-src &apos;self&apos;) and explicitly allow only trusted sources. If external sources are needed, allow
          only specific domains (script-src &apos;self&apos; https://trusted-cdn.com) — do not use wildcards.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses strict security headers for its web application — Strict-Transport-Security
          (max-age=31536000; includeSubDomains; preload), Content-Security-Policy (default-src &apos;self&apos;; script-src
          &apos;self&apos; &apos;nonce-abc123&apos;; style-src &apos;self&apos; &apos;unsafe-inline&apos;; img-src &apos;self&apos; https: data:),
          X-Content-Type-Options (nosniff), X-Frame-Options (DENY), Referrer-Policy (strict-origin-when-cross-origin),
          and Permissions-Policy (camera=(), microphone=(), geolocation=()). The platform sets headers at the
          Nginx level (for comprehensive coverage) and monitors CSP violation reports. The platform achieves an
          A+ rating on Mozilla Observatory and Security Headers.
        </p>
        <p>
          A financial services company uses HSTS preload for its banking application — the domain is submitted
          to the HSTS preload list, ensuring that the browser enforces HTTPS even on the first visit. The company
          uses a strict CSP (default-src &apos;self&apos;; script-src &apos;self&apos;) and monitors CSP violation reports for
          potential XSS attempts. The company logs all CSP violations and alerts on anomalous patterns (multiple
          violations from the same IP, violations indicating injected scripts). The company achieves PCI-DSS
          compliance in part due to its security header controls.
        </p>
        <p>
          A healthcare organization uses security headers for its patient portal — the organization sets headers
          at the Cloudflare level (for comprehensive coverage, including static files and error pages). The
          organization uses CSP report-only mode to test new policies before enforcing them — violation reports
          are sent to a SIEM system for monitoring and alerting. The organization audits security headers quarterly
          and alerts on missing or misconfigured headers. The organization achieves HIPAA compliance in part due
          to its security header controls.
        </p>
        <p>
          A SaaS platform uses security headers for its multi-tenant application — the platform sets headers at
          the web server level (Nginx) and uses a strict CSP (default-src &apos;self&apos;; script-src &apos;self&apos; &apos;nonce-abc123&apos;)
          with nonce-based allowances for specific inline scripts. The platform monitors CSP violation reports
          and uses them to tune the CSP policy — allowing legitimate resources (third-party analytics scripts)
          and blocking malicious ones (injected scripts). The platform achieves SOC 2 compliance in part due to
          its security header controls.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is Content-Security-Policy, and how does it prevent XSS?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              CSP controls which resources the browser can load and execute — it uses directives (script-src, style-src, img-src) to specify allowed sources for each resource type. A strict CSP (default-src &apos;self&apos;; script-src &apos;self&apos;) allows only same-origin resources, blocking all external and inline scripts.
            </p>
            <p>
              CSP prevents XSS because injected scripts cannot load or execute — the browser blocks any script that is not from an allowed source. Even if an attacker injects a script into the page, the browser will not execute it because the script is not from an allowed source (it is inline or from an external domain).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is HSTS preload, and when should you use it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              HSTS preload is the practice of submitting the domain to the browser&apos;s HSTS preload list — this ensures that the browser enforces HTTPS even on the first visit (before receiving the HSTS header). HSTS preload requires the domain to meet specific requirements (valid HTTPS certificate, redirect HTTP to HTTPS, serve HSTS header with max-age of at least 31536000 and includeSubDomains).
            </p>
            <p>
              Use HSTS preload for high-security domains (banking, healthcare, government) where the first visit must be secure. Do not use HSTS preload for domains that may need to serve HTTP in the future — HSTS preload is irreversible (removing the domain from the preload list can take months).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you test a new CSP policy without breaking functionality?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use CSP report-only mode (Content-Security-Policy-Report-Only) — it reports violations without blocking resources. Set up a report-uri or report-to endpoint to receive violation reports, and monitor the reports to identify legitimate resources being blocked. Allow legitimate resources in the policy, and then switch to enforcing mode (Content-Security-Policy) once the policy is validated.
            </p>
            <p>
              Additionally, use a staging environment to test the CSP policy — deploy the policy to staging, test all functionality, and fix any issues before deploying to production. Use automated testing to verify that all pages load correctly with the CSP policy.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: Why should security headers be set at the web server level rather than the application level?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Web server-level headers cover all responses — application responses, static files, error pages, and redirects. Application-level headers only cover application responses — they do not cover static files, error pages, or redirects handled by the web server. An attacker can exploit this by accessing a static file (which does not have security headers) and performing attacks that security headers would prevent.
            </p>
            <p>
              Setting headers at the web server level (Nginx, Apache) or CDN level (Cloudflare, CloudFront) ensures comprehensive coverage — headers are sent with every response, regardless of whether it is an application response, static file, error page, or redirect.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What is the difference between X-Frame-Options and CSP frame-ancestors?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              X-Frame-Options has two values: DENY (the page cannot be embedded in any iframe) and SAMEORIGIN (the page can only be embedded in an iframe from the same origin). X-Frame-Options is a legacy header — it is supported by all browsers but is limited in scope (only two values).
            </p>
            <p>
              CSP frame-ancestors is more flexible — it allows specifying specific origins that can embed the page (frame-ancestors &apos;self&apos; https://trusted-partner.com). CSP frame-ancestors supersedes X-Frame-Options and is supported by all modern browsers. The recommended approach is to use CSP frame-ancestors for flexibility, with X-Frame-Options as a fallback for older browsers.
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
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: Content-Security-Policy
            </a> — Comprehensive CSP documentation.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP HTTP Headers Cheat Sheet
            </a> — Security headers best practices.
          </li>
          <li>
            <a href="https://securityheaders.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Security Headers
            </a> — Free security header scanning tool.
          </li>
          <li>
            <a href="https://observatory.mozilla.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Mozilla Observatory
            </a> — Free security header scanning and rating.
          </li>
          <li>
            <a href="https://hstspreload.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              HSTS Preload List Submission
            </a> — Submit domain to HSTS preload list.
          </li>
          <li>
            <a href="https://scotthelme.co.uk/security-headers/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Scott Helme: Security Headers
            </a> — Comprehensive guide to security headers.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}