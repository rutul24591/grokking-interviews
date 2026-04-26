"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-security-csp-extensive",
  title: "Content Security Policy (CSP)",
  description: "Comprehensive guide to Content Security Policy (CSP), directive configuration, nonce-based security, violation reporting, and production deployment strategies for staff/principal engineer interviews.",
  category: "frontend",
  subcategory: "security",
  slug: "content-security-policy",
  version: "extensive",
  wordCount: 8200,
  readingTime: 33,
  lastUpdated: "2026-03-19",
  tags: ["security", "csp", "content-security-policy", "frontend", "web-security", "xss-prevention", "security-headers"],
  relatedTopics: ["xss-prevention", "csrf-protection", "input-validation-sanitization"],
};

export default function ContentSecurityPolicyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Content Security Policy (CSP)</strong> is an HTTP response header (or meta tag) that provides
          an additional layer of defense against Cross-Site Scripting (XSS), clickjacking, and other code
          injection attacks. CSP works by declaring which sources of content the browser should trust and
          load for a given page—effectively creating a whitelist of approved origins for scripts, styles,
          images, fonts, frames, and other resources.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Unlike traditional security measures that try to detect and block malicious content, CSP takes a
          different approach: it assumes some content might be malicious and restricts what the browser can
          execute. Even if an attacker successfully injects a script tag, CSP can prevent its execution by
          blocking scripts from untrusted sources.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          CSP was first introduced in Firefox 4 (2011) and is now supported by all modern browsers. It&apos;s
          standardized by the W3C (CSP Level 1, 2, and 3) and continues to evolve with new directives and
          capabilities. CSP Level 3 (the current standard) introduced significant improvements including
          strict-dynamic, nonce-based security, and better reporting mechanisms.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Why CSP matters for staff/principal engineers:</strong> As a technical leader, you&apos;re
          responsible for establishing security architecture and defense-in-depth strategies. CSP is a critical
          component of modern web security posture—it&apos;s recommended by OWASP, required for certain
          compliance frameworks, and increasingly expected by security auditors. Understanding CSP enables you
          to design systems that can withstand XSS attacks even when other defenses fail.
        </HighlightBlock>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: CSP Is Defense-in-Depth, Not a Silver Bullet</h3>
          <HighlightBlock as="p" tier="crucial">
            CSP doesn&apos;t replace output encoding, input validation, or other XSS defenses. It provides an
            additional safety net that can block attacks that bypass primary defenses. Think of CSP as the last
            line of defense, not the only line of defense.
          </HighlightBlock>
        </div>
      </section>

      <section>
        <h2>How CSP Works</h2>
        <HighlightBlock as="p" tier="crucial">
          CSP operates on a simple principle: the server tells the browser which sources are trusted, and the
          browser enforces these restrictions by blocking resources from untrusted sources.
        </HighlightBlock>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CSP Enforcement Flow</h3>
        <ol className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Server sends CSP header:</strong> The HTTP response includes a
            <code className="text-sm">Content-Security-Policy</code> header with directives
          </HighlightBlock>
          <li>
            <strong>Browser parses directives:</strong> The browser reads and understands the policy
          </li>
          <li>
            <strong>Browser encounters resource:</strong> When loading a script, style, image, etc., the browser
            checks the CSP
          </li>
          <li>
            <strong>Browser validates source:</strong> The resource&apos;s origin is compared against allowed
            sources in the directive
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Browser allows or blocks:</strong> If the source matches the policy, the resource loads;
            otherwise, it&apos;s blocked
          </HighlightBlock>
        </ol>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/csp-enforcement-flow.svg"
          alt="CSP Enforcement Flow showing server sending policy, browser parsing, and blocking untrusted resources"
          caption="CSP Enforcement Flow: The server declares trusted sources, and the browser enforces these restrictions by blocking resources from untrusted origins."
          captionTier="important"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">CSP Header Format</h3>
        <HighlightBlock as="p" tier="important">
          CSP is sent as an HTTP response header with a policy string containing one or more directives.
          The format consists of directive names followed by allowed sources, with multiple directives
          separated by semicolons. For example, a basic policy might specify <code className="text-sm">directive1 source1 source2; directive2 source1 source2</code> where each directive controls a different resource type.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Example policy: A comprehensive CSP might set <code className="text-sm">default-src 'self'</code> to restrict all resources to same-origin by default,
          then allow scripts from same-origin and a specific CDN with <code className="text-sm">script-src 'self' https://cdn.example.com</code>,
          permit styles from same-origin and inline styles with <code className="text-sm">style-src 'self' 'unsafe-inline'</code>,
          and allow images from same-origin, data URIs, and any HTTPS source with <code className="text-sm">img-src 'self' data: https:</code>.
        </HighlightBlock>
        <p>
          Each directive controls a specific resource type. The policy above:
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <code className="text-sm">default-src 'self'</code>: By default, only allow resources from the
            same origin
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <code className="text-sm">script-src 'self' https://cdn.example.com</code>: Scripts can load from
            same origin or cdn.example.com
          </HighlightBlock>
          <li>
            <code className="text-sm">style-src 'self' 'unsafe-inline'</code>: Styles from same origin or
            inline styles
          </li>
          <li>
            <code className="text-sm">img-src 'self' data: https:</code>: Images from same origin, data URIs,
            or any HTTPS source
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CSP Delivery Methods</h3>
        <p>
          CSP can be delivered via:
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>HTTP Header (recommended):</strong> <code className="text-sm">Content-Security-Policy: ...</code>
            — Most reliable, works for all resources
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Meta tag:</strong> <code className="text-sm">&lt;meta http-equiv="Content-Security-Policy" content="..."&gt;</code>
            — Only works for HTML documents, can&apos;t use <code className="text-sm">frame-ancestors</code> or
            <code className="text-sm">report-uri</code>
          </HighlightBlock>
        </ul>
        <HighlightBlock as="p" tier="crucial">
          <strong>Best practice:</strong> Always use HTTP headers when possible. Meta tags are a fallback for
          environments where you can&apos;t configure headers.
        </HighlightBlock>
      </section>

      <section>
        <h2>CSP Directives Reference</h2>
        <HighlightBlock as="p" tier="important">
          CSP provides numerous directives to control different resource types. Understanding each directive
          is essential for crafting effective policies.
        </HighlightBlock>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Core Directives</h3>

        <h4 className="mt-4 mb-2 font-semibold">default-src</h4>
        <HighlightBlock as="p" tier="important">
          The fallback directive for all resource types that don&apos;t have their own directive. If
          <code className="text-sm">default-src</code> is missing, there&apos;s no default restriction (all
          sources allowed).
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Best practice:</strong> Always set <code className="text-sm">default-src</code> as a safety
          net. Start restrictive and relax specific directives as needed. For example, restrict everything to same origin by default using <code className="text-sm">default-src 'self'</code>.
        </HighlightBlock>

        <h4 className="mt-4 mb-2 font-semibold">script-src</h4>
        <HighlightBlock as="p" tier="crucial">
          Controls JavaScript execution. This is the most critical directive for XSS prevention.
          For example, allow scripts from same origin and a specific CDN using <code className="text-sm">script-src 'self' https://cdn.example.com</code> along with a nonce value like <code className="text-sm">'nonce-abc123'</code> for specific inline scripts.
        </HighlightBlock>
        <p>
          <strong>Key sources:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <code className="text-sm">'self'</code>: Same origin only
          </li>
          <HighlightBlock as="li" tier="crucial">
            <code className="text-sm">'unsafe-inline'</code>: Allow inline scripts (defeats CSP purpose)
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <code className="text-sm">'unsafe-eval'</code>: Allow <code className="text-sm">eval()</code> and
            similar (defeats CSP purpose)
          </HighlightBlock>
          <li>
            <code className="text-sm">{'nonce-{value}'}</code>: Allow scripts with matching nonce attribute
          </li>
          <li>
            <code className="text-sm">'strict-dynamic'</code>: Trust scripts loaded by trusted scripts
            (CSP Level 3)
          </li>
          <li>
            <code className="text-sm">'none'</code>: Block all scripts
          </li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">style-src</h4>
        <p>
          Controls stylesheet loading and inline styles. For example, allow styles from same origin and permit inline styles (often required for frameworks) using <code className="text-sm">style-src 'self' 'unsafe-inline'</code>.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Note:</strong> Many frameworks require <code className="text-sm">'unsafe-inline'</code> for
          styles. This is generally acceptable since CSS injection is less critical than script injection, but
          still poses risks (data exfiltration via CSS selectors).
        </HighlightBlock>

        <h4 className="mt-4 mb-2 font-semibold">img-src</h4>
        <p>
          Controls image sources. For example, allow images from same origin, data URIs, and any HTTPS source using <code className="text-sm">img-src 'self' data: https:</code>.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">connect-src</h4>
        <HighlightBlock as="p" tier="important">
          Controls fetch, XMLHttpRequest, WebSocket, EventSource, and other programmatic connections.
          For example, allow API calls to same origin and a specific backend using <code className="text-sm">connect-src 'self' https://api.example.com</code>.
        </HighlightBlock>

        <h4 className="mt-4 mb-2 font-semibold">frame-ancestors</h4>
        <HighlightBlock as="p" tier="crucial">
          Controls which origins can embed this page in frames (clickjacking protection). Replaces
          <code className="text-sm">X-Frame-Options</code> header. Use <code className="text-sm">frame-ancestors 'none'</code> to prevent any framing, <code className="text-sm">frame-ancestors 'self'</code> to allow only same origin framing, or specify specific partner sites like <code className="text-sm">frame-ancestors 'self' https://partner1.com https://partner2.com</code>.
        </HighlightBlock>

        <h4 className="mt-4 mb-2 font-semibold">form-action</h4>
        <HighlightBlock as="p" tier="important">
          Controls where forms can submit data. Prevents attackers from changing form action to their server.
          For example, only allow form submissions to same origin using <code className="text-sm">form-action 'self'</code>.
        </HighlightBlock>

        <h4 className="mt-4 mb-2 font-semibold">base-uri</h4>
        <HighlightBlock as="p" tier="important">
          Controls the <code className="text-sm">&lt;base&gt;</code> element, preventing attackers from
          changing the base URL for relative links. Restrict base URI to same origin using <code className="text-sm">base-uri 'self'</code>.
        </HighlightBlock>

        <h4 className="mt-4 mb-2 font-semibold">object-src</h4>
        <p>
          Controls plugins like Flash, Silverlight, etc. Modern sites should block these entirely using <code className="text-sm">object-src 'none'</code>.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">upgrade-insecure-requests</h4>
        <p>
          Automatically upgrades HTTP URLs to HTTPS, helping migrate from HTTP to HTTPS. Simply include <code className="text-sm">upgrade-insecure-requests</code> in your policy.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/csp-directives-matrix.svg"
          alt="CSP Directives Matrix showing all major directives and their purposes"
          caption="CSP Directives Matrix: Each directive controls a specific resource type. Understanding these is essential for crafting effective policies."
          captionTier="important"
        />
      </section>

      <section>
        <h2>Source Values</h2>
        <HighlightBlock as="p" tier="important">
          CSP directives accept various source values that define what&apos;s allowed.
        </HighlightBlock>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Keyword Sources</h3>
        <ul className="space-y-2">
          <li>
            <code className="text-sm">'self'</code>: Only resources from the same origin (scheme, host, port)
          </li>
          <li>
            <code className="text-sm">'unsafe-inline'</code>: Allow inline resources (scripts, styles)
          </li>
          <li>
            <code className="text-sm">'unsafe-eval'</code>: Allow <code className="text-sm">eval()</code>,
            <code className="text-sm">new Function()</code>, and similar
          </li>
          <li>
            <code className="text-sm">'none'</code>: Block all sources
          </li>
          <li>
            <code className="text-sm">'strict-dynamic'</code>: Trust scripts loaded by trusted scripts
            (CSP Level 3)
          </li>
          <li>
            <code className="text-sm">'unsafe-hashes'</code>: Allow inline resources matching specified
            hashes (CSP Level 3)
          </li>
          <li>
            <code className="text-sm">'wasm-unsafe-eval'</code>: Allow WebAssembly evaluation (CSP Level 3)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Nonce Sources</h3>
        <HighlightBlock as="p" tier="important">
          Nonces (number used once) allow specific inline scripts while blocking others.
          Include a nonce in your CSP header like <code className="text-sm">script-src 'self' 'nonce-abc123xyz'</code>, then add the same nonce attribute to script tags in your HTML. Scripts with the matching nonce attribute will execute, while scripts without a nonce will be blocked.
        </HighlightBlock>
        <p>
          <strong>Nonce best practices:</strong>
        </p>
        <ul className="space-y-2">
          <li>Generate a new cryptographically random nonce for each request</li>
          <li>Never reuse nonces across requests</li>
          <li>Use at least 128 bits of entropy (16+ random bytes, base64-encoded)</li>
          <li>Store nonce in server-side template context, not in cookies or localStorage</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Hash Sources</h3>
        <p>
          Hashes allow specific inline scripts by their SHA-256, SHA-384, or SHA-512 hash.
          Include the hash in your CSP header like <code className="text-sm">script-src 'self' 'sha256-abc123...'</code>, and only scripts whose content exactly matches that hash will execute.
        </p>
        <p>
          <strong>Hash limitations:</strong>
        </p>
        <ul className="space-y-2">
          <li>Any change to the script (even whitespace) breaks the hash</li>
          <li>Impractical for dynamic content</li>
          <li>Best for small, static inline scripts</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">URL Sources</h3>
        <p>
          Specify allowed origins by URL:
        </p>
        <ul className="space-y-2">
          <li>
            <code className="text-sm">https://cdn.example.com</code>: Specific origin (HTTPS only)
          </li>
          <li>
            <code className="text-sm">https://*.example.com</code>: All subdomains of example.com
          </li>
          <li>
            <code className="text-sm">https:</code>: Any HTTPS origin (scheme-only, use sparingly)
          </li>
          <li>
            <code className="text-sm">data:</code>: Data URIs (security risk for scripts/images)
          </li>
          <li>
            <code className="text-sm">blob:</code>: Blob URLs
          </li>
        </ul>
        <HighlightBlock as="p" tier="crucial">
          <strong>Warning:</strong> Wildcard sources (<code className="text-sm">https:</code> or
          <code className="text-sm">https://*.cdn.com</code>) significantly weaken CSP. Use specific origins
          whenever possible.
        </HighlightBlock>
      </section>

      <section>
        <h2>CSP Implementation Strategies</h2>
        <HighlightBlock as="p" tier="important">
          There are multiple approaches to implementing CSP, each with trade-offs between security and
          compatibility.
        </HighlightBlock>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Strategy 1: Strict CSP (Recommended)</h3>
        <HighlightBlock as="p" tier="crucial">
          Maximum security with no <code className="text-sm">unsafe-inline</code> or <code className="text-sm">unsafe-eval</code>. Uses nonces for necessary inline scripts.
          A strict policy might set default-src to self, script-src to self with nonce, style-src to self, img-src to self and data, connect-src to self and API domain, frame-ancestors to none, base-uri to self, and form-action to self.
        </HighlightBlock>
        <p>
          <strong>Pros:</strong> Maximum XSS protection, blocks all inline scripts.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Cons:</strong> Requires refactoring to remove inline scripts, nonce management overhead.
        </HighlightBlock>
        <p>
          <strong>Best for:</strong> New applications, security-critical systems, organizations with mature
          security practices.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Strategy 2: Moderate CSP</h3>
        <HighlightBlock as="p" tier="important">
          Balanced approach allowing <code className="text-sm">'unsafe-inline'</code> for styles but not
          scripts. A moderate policy might set <code className="text-sm">default-src 'self'</code>, <code className="text-sm">script-src 'self' https://trusted-cdn.com</code>, <code className="text-sm">style-src 'self' 'unsafe-inline'</code>, <code className="text-sm">img-src 'self' https: data:</code>, <code className="text-sm">connect-src 'self'</code>, and <code className="text-sm">frame-ancestors 'self'</code>.
        </HighlightBlock>
        <p>
          <strong>Pros:</strong> Easier to implement, compatible with most frameworks.
        </p>
        <p>
          <strong>Cons:</strong> Weaker than strict CSP, inline styles can leak data via CSS selectors.
        </p>
        <p>
          <strong>Best for:</strong> Existing applications, teams transitioning to stricter CSP.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Strategy 3: CSP with strict-dynamic</h3>
        <HighlightBlock as="p" tier="crucial">
          CSP Level 3 feature that simplifies nonce management for complex applications.
          A policy with strict-dynamic might set default-src to self, script-src to self with nonce and strict-dynamic and https and http and unsafe-inline, and style-src to self and unsafe-inline.
        </HighlightBlock>
        <p>
          <strong>How strict-dynamic works:</strong>
        </p>
        <ol className="space-y-2">
          <li>Scripts with valid nonces are trusted</li>
          <li>Trusted scripts can dynamically load other scripts</li>
          <li>Dynamically loaded scripts inherit trust (don&apos;t need nonces)</li>
          <li>Parser-inserted scripts (without nonces) are still blocked</li>
        </ol>
        <p>
          <strong>Pros:</strong> Simplifies third-party script management, backward compatible.
        </p>
        <p>
          <strong>Cons:</strong> Browser support varies (Chrome 62+, Firefox 67+, Safari 15+).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Strategy 4: Monitoring-Only (Report-Only)</h3>
        <HighlightBlock as="p" tier="crucial">
          Use <code className="text-sm">Content-Security-Policy-Report-Only</code> header to test policies
          without enforcement. A report-only policy might include <code className="text-sm">default-src 'self'</code>, <code className="text-sm">script-src 'self'</code>, <code className="text-sm">report-uri /csp-report</code>, and <code className="text-sm">report-to csp-endpoint</code>.
        </HighlightBlock>
        <p>
          <strong>Use cases:</strong>
        </p>
        <ul className="space-y-2">
          <li>Testing new policies before enforcement</li>
          <li>Monitoring for violations without breaking functionality</li>
          <li>Detecting attack attempts</li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/csp-implementation-strategies.svg"
          alt="CSP Implementation Strategies comparison showing Strict, Moderate, strict-dynamic, and Report-Only approaches"
          caption="CSP Implementation Strategies: Choose based on your security requirements, existing codebase, and browser support needs."
          captionTier="important"
        />
      </section>

      <section>
        <h2>CSP Violation Reporting</h2>
        <HighlightBlock as="p" tier="important">
          CSP provides built-in reporting mechanisms to detect policy violations and potential attacks.
        </HighlightBlock>

        <h3 className="mt-8 mb-4 text-xl font-semibold">report-uri (Legacy)</h3>
        <p>
          Deprecated but widely supported. Sends violation reports to specified endpoint.
          For example, set <code className="text-sm">Content-Security-Policy: default-src 'self'; report-uri /csp-report</code> to send reports to the specified endpoint.
        </p>
        <p>
          <strong>Report format (POST request):</strong> Reports include fields like <code className="text-sm">document-uri</code>, <code className="text-sm">referrer</code>, <code className="text-sm">violated-directive</code>, <code className="text-sm">effective-directive</code>, <code className="text-sm">original-policy</code>, <code className="text-sm">disposition</code>, <code className="text-sm">blocked-uri</code>, <code className="text-sm">line-number</code>, <code className="text-sm">column-number</code>, <code className="text-sm">source-file</code>, <code className="text-sm">status-code</code>, and <code className="text-sm">script-sample</code>.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">report-to (Modern)</h3>
        <HighlightBlock as="p" tier="crucial">
          CSP Level 3 reporting with more flexibility. Requires separate <code className="text-sm">Report-To</code>
          header. Set the CSP header with <code className="text-sm">report-to csp-endpoint</code> and include a separate Report-To header with a JSON configuration specifying the endpoint URL and max age.
        </HighlightBlock>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Handling Violation Reports</h3>
        <p>
          Server-side endpoint should:
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            Parse and validate the JSON report
          </HighlightBlock>
          <li>Log violations for analysis</li>
          <HighlightBlock as="li" tier="crucial">
            Alert on suspicious patterns (repeated violations, known attack signatures)
          </HighlightBlock>
          <li>Aggregate reports to identify policy issues</li>
          <li>Rate-limit to prevent report flooding</li>
        </ul>
        <p>
          For example, in Express.js, create a POST endpoint at <code className="text-sm">/csp-report</code> that accepts JSON with content type <code className="text-sm">application/csp-report</code>, extracts the <code className="text-sm">csp-report</code> object from the request body, logs key fields like <code className="text-sm">blocked-uri</code>, <code className="text-sm">violated-directive</code>, <code className="text-sm">document-uri</code>, and <code className="text-sm">timestamp</code>, and sends security alerts for suspicious blocked URIs like malicious.com. Return a 204 No Content response.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What to Monitor</h3>
        <ul className="space-y-2">
          <li>
            <strong>Blocked URIs:</strong> External domains attempting to load resources
          </li>
          <li>
            <strong>Violated directives:</strong> Which CSP rules are being triggered
          </li>
          <li>
            <strong>Document URIs:</strong> Which pages have violations
          </li>
          <li>
            <strong>Referrers:</strong> Where violations originate from
          </li>
          <li>
            <strong>Script samples:</strong> Actual malicious code (for analysis)
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Violation Reports Are Security Telemetry</h3>
          <HighlightBlock as="p" tier="crucial">
            CSP violation reports provide real-time visibility into attack attempts and policy misconfigurations.
            Set up dashboards and alerts to detect patterns: sudden spikes in violations, new blocked domains,
            or repeated attempts from specific referrers.
          </HighlightBlock>
        </div>
      </section>

      <section>
        <h2>Trade-offs & Considerations</h2>
        <HighlightBlock as="p" tier="important">
          In interviews, your trade-off story should cover migration risk (Report-Only first), operational
          overhead (nonce generation + rollout discipline), and third-party scripts. The goal is to land on
          an enforceable policy that meaningfully reduces XSS blast radius.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          A practical staff-level position is: start with <strong>report-only</strong>, inventory the
          blocked sources, remove or isolate high-risk third parties, then move to nonce-based
          <code className="text-sm">script-src</code> with tight allowlists and violation monitoring.
        </HighlightBlock>
        <HighlightBlock tier="crucial" className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Approach</th>
                <th className="p-3 text-left">Advantages</th>
                <th className="p-3 text-left">Disadvantages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">
                  <strong>Strict CSP (Nonces)</strong>
                </td>
                <td className="p-3">
                  • Maximum XSS protection<br />
                  • Blocks all inline scripts<br />
                  • Industry best practice
                </td>
                <td className="p-3">
                  • Requires code refactoring<br />
                  • Nonce management overhead<br />
                  • Third-party script challenges
                </td>
              </tr>
              <tr>
                <td className="p-3">
                  <strong>Moderate CSP</strong>
                </td>
                <td className="p-3">
                  • Easier implementation<br />
                  • Framework compatible<br />
                  • Good baseline protection
                </td>
                <td className="p-3">
                  • Weaker than strict CSP<br />
                  • Inline styles can leak data<br />
                  • May not satisfy auditors
                </td>
              </tr>
              <tr>
                <td className="p-3">
                  <strong>strict-dynamic</strong>
                </td>
                <td className="p-3">
                  • Simplifies third-party scripts<br />
                  • Backward compatible<br />
                  • Reduces nonce management
                </td>
                <td className="p-3">
                  • Limited browser support<br />
                  • Still requires initial nonce<br />
                  • Complex to explain to teams
                </td>
              </tr>
              <tr>
                <td className="p-3">
                  <strong>Report-Only Mode</strong>
                </td>
                <td className="p-3">
                  • Zero risk testing<br />
                  • Visibility into violations<br />
                  • No user impact
                </td>
                <td className="p-3">
                  • No actual protection<br />
                  • Report volume can be high<br />
                  • Requires endpoint infrastructure
                </td>
              </tr>
            </tbody>
          </table>
        </HighlightBlock>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Policy Design</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Start with default-src:</strong> Always set a restrictive default, then relax specific
            directives
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Avoid unsafe keywords:</strong> Never use <code className="text-sm">'unsafe-inline'</code>
            or <code className="text-sm">'unsafe-eval'</code> in production for scripts
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Be specific with origins:</strong> Use exact origins, avoid wildcards
            (<code className="text-sm">https:</code> or <code className="text-sm">*.example.com</code>)
          </HighlightBlock>
          <li>
            <strong>Block plugins:</strong> Set <code className="text-sm">object-src 'none'</code> to block
            Flash and other plugins
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Prevent clickjacking:</strong> Use <code className="text-sm">frame-ancestors 'none'</code>
            or <code className="text-sm">frame-ancestors 'self'</code>
          </HighlightBlock>
          <li>
            <strong>Control form submissions:</strong> Use <code className="text-sm">form-action 'self'</code>
            to prevent form hijacking
          </li>
          <li>
            <strong>Restrict base URI:</strong> Use <code className="text-sm">base-uri 'self'</code> to
            prevent base tag injection
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implementation</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Use Report-Only first:</strong> Test policies with
            <code className="text-sm">Content-Security-Policy-Report-Only</code> before enforcement
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Generate nonces securely:</strong> Use crypto-safe random generation (128+ bits of entropy)
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Rotate nonces per request:</strong> Never reuse nonces across requests
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Set up violation reporting:</strong> Monitor <code className="text-sm">report-uri</code> or
            <code className="text-sm">report-to</code> endpoints
          </HighlightBlock>
          <li>
            <strong>Use HTTPS:</strong> CSP is most effective with HTTPS; consider
            <code className="text-sm">upgrade-insecure-requests</code>
          </li>
          <li>
            <strong>Combine with other headers:</strong> Use CSP alongside
            <code className="text-sm">X-Content-Type-Options</code>, <code className="text-sm">X-Frame-Options</code>,
            <code className="text-sm">Strict-Transport-Security</code>
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Third-Party Scripts</h3>
        <ul className="space-y-2">
          <li>
            <strong>Audit third-party scripts:</strong> Every external script is a potential attack vector
          </li>
          <li>
            <strong>Use Subresource Integrity (SRI):</strong> Verify script integrity with
            <code className="text-sm">integrity</code> attribute
          </li>
          <li>
            <strong>Host critical scripts locally:</strong> Download and serve critical third-party scripts
            from your own domain
          </li>
          <li>
            <strong>Limit external origins:</strong> Minimize the number of allowed external domains
          </li>
          <li>
            <strong>Monitor for changes:</strong> Third-party scripts can change; monitor for unexpected
            behavior
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Maintenance</h3>
        <ul className="space-y-2">
          <li>
            <strong>Review violation reports:</strong> Regularly analyze CSP violations for attacks and
            misconfigurations
          </li>
          <li>
            <strong>Update policies:</strong> Refine CSP as your application evolves
          </li>
          <li>
            <strong>Test before deploying:</strong> Use staging environments to test CSP changes
          </li>
          <li>
            <strong>Document your CSP:</strong> Maintain documentation explaining each directive and its purpose
          </li>
          <li>
            <strong>Educate developers:</strong> Ensure team understands CSP constraints and best practices
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: CSP Is Iterative</h3>
          <HighlightBlock as="p" tier="crucial">
            Don&apos;t aim for perfect CSP on day one. Start with a monitoring-only policy, analyze violations,
            fix issues, and gradually tighten restrictions. A gradually-improved CSP that&apos;s properly
            enforced is better than a perfect CSP that breaks your app and gets disabled.
          </HighlightBlock>
        </div>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Using 'unsafe-inline' for scripts:</strong> This defeats CSP&apos;s primary purpose. Use
            nonces or hashes instead.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Wildcard origins:</strong> <code className="text-sm">https:</code> or
            <code className="text-sm">https://*.cdn.com</code> allows any HTTPS source, severely weakening CSP.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Missing default-src:</strong> Without <code className="text-sm">default-src</code>, there&apos;s
            no fallback restriction. Always set a restrictive default.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Not testing before enforcement:</strong> Deploying strict CSP without testing breaks
            functionality. Always use Report-Only mode first.
          </HighlightBlock>
          <li>
            <strong>Reusing nonces:</strong> Nonces must be unique per request. Reusing nonces allows attackers
            to replay them.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Ignoring violation reports:</strong> CSP reports provide security telemetry. Not monitoring
            them misses attack detection opportunities.
          </HighlightBlock>
          <li>
            <strong>Forgetting frame-ancestors:</strong> CSP without <code className="text-sm">frame-ancestors</code>
            leaves you vulnerable to clickjacking.
          </li>
          <li>
            <strong>Meta tag limitations:</strong> CSP via meta tag can&apos;t use
            <code className="text-sm">frame-ancestors</code> or <code className="text-sm">report-uri</code>.
            Use HTTP headers.
          </li>
          <li>
            <strong>Not updating for third-party changes:</strong> Third-party scripts change. Monitor and
            update CSP when they add new domains.
          </li>
          <li>
            <strong>Overlooking connect-src:</strong> Forgetting <code className="text-sm">connect-src</code>
            can block legitimate API calls or allow data exfiltration.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-Commerce Platform</h3>
        <HighlightBlock as="p" tier="crucial">
          <strong>Challenge:</strong> Multiple third-party scripts (analytics, ads, payment widgets) make CSP
          implementation complex. Need to balance security with functionality.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            Start with Report-Only mode to identify all required sources
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            Use strict-dynamic to simplify third-party script management
          </HighlightBlock>
          <li>Host analytics scripts locally where possible</li>
          <HighlightBlock as="li" tier="important">
            Use SRI for all third-party scripts
          </HighlightBlock>
          <li>Implement <code className="text-sm">form-action 'self'</code> to prevent payment hijacking</li>
          <HighlightBlock as="li" tier="important">
            Set <code className="text-sm">frame-ancestors 'none'</code> to prevent clickjacking on checkout
          </HighlightBlock>
          <li>Monitor violation reports for attack detection</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SaaS Dashboard Application</h3>
        <p>
          <strong>Challenge:</strong> SPA with heavy JavaScript usage, dynamic script loading, and multiple
          widget integrations.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Implement nonce-based CSP for all inline scripts</li>
          <li>Use <code className="text-sm">strict-dynamic</code> for widget script loading</li>
          <li>Set <code className="text-sm">connect-src</code> to only allow API calls to known backends</li>
          <li>Block <code className="text-sm">eval()</code> by omitting <code className="text-sm">'unsafe-eval'</code></li>
          <li>Use <code className="text-sm">base-uri 'self'</code> to prevent base tag injection</li>
          <li>Implement violation reporting with alerting on suspicious patterns</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Content Publishing Platform</h3>
        <p>
          <strong>Challenge:</strong> User-generated content with rich text editing, embedded media, and
          third-party embeds (YouTube, Twitter, etc.).
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Strict CSP for the application shell (nonces for scripts)</li>
          <li>Sandboxed iframes for user-generated content</li>
          <li>Whitelist specific embed domains in <code className="text-sm">frame-src</code></li>
          <li>Use <code className="text-sm">img-src</code> with specific CDN origins, block data URIs in user content</li>
          <li>Implement <code className="text-sm">style-src</code> without <code className="text-sm">'unsafe-inline'</code>
            for user content</li>
          <li>Monitor and block attempts to inject scripts via user content</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Financial Services Application</h3>
        <p>
          <strong>Challenge:</strong> High-security requirements, regulatory compliance, sensitive transactions.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Maximum strict CSP with nonces, no <code className="text-sm">'unsafe-*'</code> keywords</li>
          <li>All scripts served from same origin (no third-party CDNs)</li>
          <li><code className="text-sm">frame-ancestors 'none'</code> to prevent any framing</li>
          <li><code className="text-sm">form-action</code> restricted to specific transaction endpoints</li>
          <li><code className="text-sm">navigate-to</code> to control where users can be redirected</li>
          <li>Real-time violation monitoring with immediate security team alerts</li>
          <li>Regular CSP audits as part of security compliance</li>
        </ul>
      </section>

      <section>
        <h2>Architecture at Scale: CSP in Enterprise Systems</h2>
        <HighlightBlock as="p" tier="crucial">
          Enterprise-scale CSP implementation requires coordinated policy management across multiple applications, teams, and deployment environments. In microservices architectures, each service may have different CSP requirements based on its functionality and third-party dependencies.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Centralized Policy Management:</strong> Implement a CSP policy registry that documents allowed sources for each directive across all applications. Use infrastructure-as-code (Terraform, CloudFormation) to manage CSP headers consistently across load balancers, API gateways, and CDN configurations. Version control CSP policies with change tracking and approval workflows.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Automated CSP Generation:</strong> Use build-time tools to analyze application dependencies and generate baseline CSP policies. Tools like CSP Evaluator, Mozilla Observatory, and custom webpack plugins can scan for external resources and generate initial script-src, style-src, and img-src directives. Integrate CSP generation into CI/CD pipelines to detect policy drift.
        </HighlightBlock>
        <p>
          <strong>Multi-Environment Strategy:</strong> Deploy CSP in Report-Only mode (Content-Security-Policy-Report-Only) in staging environments for 2-4 weeks before production enforcement. Collect violation reports to identify breaking changes. Use environment-specific policies: stricter in production, more permissive in development (with unsafe-eval for debugging tools).
        </p>
        <p>
          <strong>CDN Integration:</strong> Configure CDN (Cloudflare, AWS CloudFront, Fastly) to inject CSP headers at the edge. Use CDN Workers or Lambda@Edge to dynamically generate nonces per request. Implement CSP violation reporting aggregation at CDN level to reduce origin server load. Consider using CDN-managed CSP with automatic policy recommendations based on observed traffic.
        </p>
      </section>

      <section>
        <h2>Testing Strategies: CSP Validation and Monitoring</h2>
        <HighlightBlock as="p" tier="crucial">
          Comprehensive CSP testing requires automated validation, violation monitoring, and periodic security audits integrated into development workflows.
        </HighlightBlock>
        <p>
          <strong>Automated CSP Scanning:</strong> Use security scanners (OWASP ZAP, Burp Suite, Acunetix) to verify CSP headers are present and properly configured. Configure CI jobs to fail builds if CSP headers are missing from responses. Use custom scripts to parse CSP headers and validate syntax (balanced quotes, valid keywords, proper directive separation).
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Report-Only Testing:</strong> Before enforcing CSP, deploy with Content-Security-Policy-Report-Only header for 2-4 weeks. Collect violation reports to identify: (1) missing allowed sources, (2) inline scripts that need nonces, (3) third-party services not in whitelist. Use violation data to refine policies before switching to enforcement mode.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Violation Monitoring:</strong> Implement violation endpoint that receives JSON reports via POST. Store reports in time-series database (InfluxDB, TimescaleDB) for trend analysis. Set up alerts for: sudden spike in violations (greater than 100/hour), violations from new blocked-uris, violations involving sensitive directives (script-src, frame-ancestors). Use SIEM integration to correlate violations with other security events.
        </HighlightBlock>
        <p>
          <strong>Browser Testing Matrix:</strong> Test CSP implementation across browser/OS combinations: Chrome (latest 3 versions), Firefox (latest 3), Safari (latest 2), Edge (latest 2). Verify nonce support, strict-dynamic behavior, and fallback handling. Use BrowserStack or Sauce Labs for cross-browser testing. Document browser-specific CSP quirks in team wiki.
        </p>
        <p>
          <strong>Penetration Testing:</strong> Include CSP bypass testing in quarterly penetration tests. Specific test cases: (1) XSS with CSP enabled, (2) nonce prediction attempts, (3) JSONP endpoint abuse, (4) AngularJS CSP bypass (if applicable), (5) CSP header injection/override. Require remediation of all CSP bypass findings before production deployment.
        </p>
      </section>

      <section>
        <h2>Compliance and Legal Context</h2>
        <HighlightBlock as="p" tier="crucial">
          CSP implementation has significant compliance implications, particularly for applications handling financial transactions, healthcare data, or government services.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>OWASP Top 10:</strong> CSP is referenced in OWASP Top 10 2021 A03:Injection as a mitigation technique. OWASP recommends CSP as defense-in-depth layer against XSS. Many compliance auditors expect CSP implementation as evidence of security maturity. Document CSP policy and enforcement level for annual security assessments.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>PCI-DSS Requirements:</strong> PCI-DSS v4.0 Requirement 6.4.3 recommends CSP for payment pages. While not mandatory, CSP demonstrates due diligence in XSS prevention. Annual penetration testing (Requirement 11.3) should verify CSP effectiveness. Document CSP implementation in ROC (Report on Compliance) for annual assessments.
        </HighlightBlock>
        <p>
          <strong>GDPR Implications:</strong> CSP helps fulfill GDPR Article 32 security of processing by implementing appropriate technical measures against XSS-based data breaches. CSP violation logs can serve as evidence of security monitoring. However, violation reports containing user data (URLs, user-agents) must be handled per GDPR data retention policies.
        </p>
        <p>
          <strong>SOC 2 Controls:</strong> CSP implementation maps to SOC 2 Common Criteria CC6.1 (logical access controls) and CC7.2 (system monitoring). Document CSP policy management, violation monitoring procedures, and incident response for CSP bypass attempts. Track CSP-related security metrics for annual SOC 2 audits.
        </p>
        <p>
          <strong>Government Standards:</strong> NIST SP 800-53 SC-16 (Transmission Integrity) references CSP as implementation guidance. FedRAMP Moderate baseline recommends CSP for web applications. UK NCSC guidance recommends CSP with nonces for public sector websites. Document CSP compliance with applicable government standards.
        </p>
      </section>

      <section>
        <h2>Performance Trade-offs: Security vs. Latency</h2>
        <HighlightBlock as="p" tier="crucial">
          CSP implementation introduces measurable performance considerations that must be balanced against security requirements.
        </HighlightBlock>
        <p>
          <strong>Header Size Impact:</strong> Comprehensive CSP policies can add 500-2000 bytes to HTTP response headers. For high-traffic APIs, this increases bandwidth costs. Mitigate by: using short directive names, minimizing allowed sources, leveraging HTTP/2 header compression. Test header size impact using curl verbose mode or browser DevTools Network panel.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Nonce Generation Overhead:</strong> Cryptographically secure nonce generation (crypto.randomBytes) takes 0.1-0.5ms per request. For high-traffic applications (greater than 10K RPS), this adds measurable CPU load. Pre-generate nonce pools during idle periods. Use nonces only for script-src and style-src; use hashes for static resources.
        </HighlightBlock>
        <p>
          <strong>CSP Evaluation Latency:</strong> Browser CSP evaluation adds 5-50ms depending on policy complexity and number of resources. Complex policies with many sources take longer to evaluate. Optimize by: ordering sources by likelihood (most-used first), using wildcards sparingly, avoiding excessive data: or blob: schemes. Test CSP impact using Chrome DevTools Performance panel.
        </p>
        <p>
          <strong>Violation Reporting Overhead:</strong> CSP violation reports sent via report-uri add network requests. Use report-to (Reporting API) for batched reporting. Implement client-side rate limiting (max 10 reports/minute per user). Use navigator.sendBeacon() for non-blocking report transmission.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>CDN Caching Impact:</strong> Nonce-based CSP breaks CDN caching because each response has unique nonce. Solution: Use two-tier approach—static assets (JS, CSS) with hash-based CSP cached at CDN, dynamic HTML with nonce-based CSP served from origin. Or use strict-dynamic to allow CDN-cached scripts to load additional trusted scripts.
        </HighlightBlock>
      </section>

      <section>
        <h2>Browser and Platform Compatibility</h2>
        <HighlightBlock as="p" tier="important">
          CSP support varies significantly across browsers, requiring careful compatibility planning and fallback strategies.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>CSP Level Support:</strong> CSP Level 1 (basic directives) supported in all modern browsers. CSP Level 2 (nonces, hashes) supported in Chrome 40+, Firefox 45+, Safari 10+, Edge 15+. CSP Level 3 (strict-dynamic, navigate-to) supported in Chrome 63+, Firefox 67+, Safari 12.1+, Edge 79+. Check caniuse.com for current support matrix.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Browser-Specific Quirks:</strong> Chrome blocks eval() by default in extensions. Firefox requires unsafe-eval for WebAssembly compilation. Safari has stricter data: URI handling. Edge (Legacy) has partial CSP Level 2 support. Test CSP in target browsers before deployment.
        </HighlightBlock>
        <p>
          <strong>Mobile Browser Considerations:</strong> Mobile Chrome/Firefox generally match desktop CSP support. Samsung Internet has delayed CSP Level 3 support. iOS Safari lags behind desktop Safari by 1-2 versions. Test CSP on actual mobile devices, not just emulators. Consider reduced CSP strictness for mobile user agents if compatibility issues arise.
        </p>
        <p>
          <strong>WebView Compatibility:</strong> Android WebView CSP support matches Chrome version (Chrome 90+ on Android 10+). iOS WKWebView CSP support matches iOS Safari version. Some older Android devices have broken CSP implementations. Test CSP in actual app WebViews. Consider user-agent detection to serve different CSP policies to problematic WebViews.
        </p>
        <p>
          <strong>Legacy Browser Fallback:</strong> IE11 supports CSP Level 1 only (no nonces/hashes). For IE11 support, use hash-based CSP or accept unsafe-inline with other mitigations. Document legacy browser support decisions in security policy. Consider serving different CSP via user-agent detection for enterprise IE11 users.
        </p>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: What is Content Security Policy and how does it prevent XSS?</p>
            <HighlightBlock as="p" tier="crucial" className="mt-2 text-sm">
              A: CSP is an HTTP header that declares which sources of content (scripts, styles, images, etc.)
              the browser should trust. It prevents XSS by blocking scripts from untrusted sources—even if an
              attacker successfully injects a <code className="text-sm">&lt;script&gt;</code> tag, CSP blocks
              its execution if the source isn&apos;t whitelisted. CSP works as defense-in-depth: it doesn&apos;t
              replace output encoding but provides a safety net when other defenses fail.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: What&apos;s the difference between 'unsafe-inline', nonces, and hashes in CSP?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: <code className="text-sm">'unsafe-inline'</code> allows all inline scripts/styles—easy but
              defeats CSP&apos;s purpose. <strong>Nonces</strong> are random values generated per request; only
              scripts with matching <code className="text-sm">nonce</code> attributes execute.
              <strong>Hashes</strong> are SHA-256/384/512 hashes of specific script content; only scripts
              matching the hash execute. Nonces are better for dynamic content; hashes work for static scripts
              but break if content changes.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: How would you implement CSP for a React SPA with third-party analytics?</p>
            <p className="mt-2 text-sm">
              A: Use nonce-based CSP: (1) Generate cryptographically random nonce per request on the server.
              (2) Inject nonce into HTML for initial inline scripts. (3) Set CSP header:
              <code className="text-sm">script-src 'self' 'nonce-{'{'}value{'}'}' https://analytics.com</code>.
              (4) For React, use a library like <code className="text-sm">helmet</code> to set CSP headers.
              (5) Use <code className="text-sm">strict-dynamic</code> if supported to simplify third-party
              script loading. (6) Start with Report-Only mode to test before enforcement.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: What is strict-dynamic and when should you use it?</p>
            <p className="mt-2 text-sm">
              A: <code className="text-sm">strict-dynamic</code> is a CSP Level 3 feature that simplifies
              third-party script management. When a script with a valid nonce loads, any scripts it dynamically
              loads are also trusted (without needing nonces). This is useful for complex applications with
              many third-party scripts. Use it when: you have multiple third-party scripts, they dynamically
              load additional scripts, and you need backward compatibility (it falls back to nonce-based
              security in older browsers).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: How do you handle CSP violation reports and what do they tell you?</p>
            <p className="mt-2 text-sm">
              A: Set up a <code className="text-sm">report-uri</code> or <code className="text-sm">report-to</code>
              endpoint to receive JSON violation reports. Reports include: <code className="text-sm">blocked-uri</code>
              (what was blocked), <code className="text-sm">violated-directive</code> (which rule),
              <code className="text-sm">document-uri</code> (which page), <code className="text-sm">referrer</code>
              (where the request came from), and sometimes <code className="text-sm">script-sample</code>
              (actual malicious code). Monitor these for: attack attempts (blocked external scripts),
              misconfigurations (legitimate resources blocked), and new third-party domains needing whitelisting.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: What CSP directives are essential for clickjacking protection?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: <code className="text-sm">frame-ancestors</code> is the primary directive for clickjacking
              protection. Use <code className="text-sm">frame-ancestors 'none'</code> to prevent all framing,
              or <code className="text-sm">frame-ancestors 'self'</code> to allow only same-origin framing.
              This replaces the older <code className="text-sm">X-Frame-Options</code> header. Additionally,
              use <code className="text-sm">frame-src</code> to control which sources your page can embed
              (prevents embedding malicious content), and <code className="text-sm">form-action</code> to
              prevent form hijacking.
            </HighlightBlock>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs: Content Security Policy
            </a>
          </li>
          <li>
            <a href="https://content-security-policy.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Content Security Policy Guide
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP CSP Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/TR/CSP3/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              W3C CSP Level 3 Specification
            </a>
          </li>
          <li>
            <a href="https://web.dev/strict-csp/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev: Strict Content Security Policy
            </a>
          </li>
          <li>
            <a href="https://github.com/csp-evaluator/csp-evaluator" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              CSP Evaluator Tool (Google)
            </a>
          </li>
          <li>
            <a href="https://report-uri.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Report URI - CSP Reporting and Analysis
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/extensions/mv3/manifest/content_security_policy/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chrome Extensions CSP Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
