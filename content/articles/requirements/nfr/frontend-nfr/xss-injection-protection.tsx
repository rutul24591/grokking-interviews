"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-xss-injection-protection",
  title: "XSS & Injection Protection",
  description: "Comprehensive guide to cross-site scripting (XSS) attacks, injection vulnerabilities, Content Security Policy, sanitization, and frontend security best practices.",
  category: "frontend",
  subcategory: "nfr",
  slug: "xss-injection-protection",
  version: "extensive",
  wordCount: 12000,
  readingTime: 48,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "security", "xss", "injection", "csp", "sanitization"],
  relatedTopics: ["secure-client-storage", "authentication-ux", "third-party-script-safety"],
};

export default function XSSInjectionProtectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Cross-Site Scripting (XSS)</strong> is a code injection attack where malicious scripts
          are injected into trusted websites. When users visit the compromised page, the malicious script
          executes in their browser, potentially stealing cookies, session tokens, credentials, or
          redirecting to phishing sites.
        </p>
        <p>
          XSS consistently ranks in the OWASP Top 10 web application security risks. For staff engineers,
          understanding XSS is critical because frontend frameworks, while providing some protection,
          cannot prevent all XSS vectors — especially with modern patterns like server-side rendering,
          dangerouslySetInnerHTML, and third-party integrations.
        </p>
        <p>
          <strong>Impact of XSS:</strong>
        </p>
        <ul>
          <li><strong>Session hijacking:</strong> Steal authentication cookies and tokens</li>
          <li><strong>Credential theft:</strong> Capture keystrokes, fake login forms</li>
          <li><strong>Defacement:</strong> Modify page content, display false information</li>
          <li><strong>Malware distribution:</strong> Redirect to malware sites, drive-by downloads</li>
          <li><strong>Account takeover:</strong> Perform actions as the victim user</li>
          <li><strong>Data exfiltration:</strong> Read and transmit sensitive page data</li>
        </ul>
        <p>
          For staff/principal engineer interviews, XSS questions test security awareness, understanding
          of browser security models, and ability to design secure systems. This guide covers XSS types,
          prevention strategies, Content Security Policy, and secure coding patterns.
        </p>
      </section>

      <section>
        <h2>XSS Attack Types</h2>
        <p>
          XSS attacks are categorized by how the malicious script is delivered and executed.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Reflected XSS (Non-Persistent)</h3>
        <p>
          The malicious script is reflected off the web server in an error message, search result, or
          any response that includes user input. The attack payload is delivered via a malicious link
          that the victim clicks.
        </p>
        <p>
          <strong>Attack flow:</strong>
        </p>
        <ul className="space-y-2">
          <li>Attacker crafts URL with malicious script in query parameter</li>
          <li>Victim clicks the link (via email, social media, etc.)</li>
          <li>Server reflects the input in the response without proper encoding</li>
          <li>Script executes in victim&apos;s browser in the context of the trusted site</li>
        </ul>
        <p>
          <strong>Example:</strong> Search page that displays &quot;Results for: [user input]&quot;
          without HTML encoding. Attacker submits <code>&lt;script&gt;stealCookies()&lt;/script&gt;</code>
          as the search query.
        </p>
        <p>
          <strong>Common vectors:</strong> Search forms, error messages, URL parameters, form validation
          messages.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stored XSS (Persistent)</h3>
        <p>
          The malicious script is permanently stored on the target server (database, message forum,
          comment field, visitor log). Victims view the infected content through normal browsing.
        </p>
        <p>
          <strong>Attack flow:</strong>
        </p>
        <ul className="space-y-2">
          <li>Attacker submits malicious script via input form (comment, profile, etc.)</li>
          <li>Server stores the input without sanitization</li>
          <li>Victim views the page containing the stored script</li>
          <li>Script executes in victim&apos;s browser when page loads</li>
        </ul>
        <p>
          <strong>Example:</strong> Comment section that stores and displays user comments without
          sanitization. Attacker posts a comment containing malicious JavaScript.
        </p>
        <p>
          <strong>Impact:</strong> More severe than reflected XSS because victims don&apos;t need to
          click a malicious link — any user viewing the infected page is affected.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DOM-based XSS</h3>
        <p>
          The vulnerability exists in client-side code rather than server-side code. The attack payload
          is executed by modifying the DOM in the victim&apos;s browser.
        </p>
        <p>
          <strong>Attack flow:</strong>
        </p>
        <ul className="space-y-2">
          <li>Attacker crafts URL with malicious payload in fragment or query</li>
          <li>Victim visits the URL</li>
          <li>Client-side JavaScript reads the untrusted data from DOM (location.hash, location.search)</li>
          <li>JavaScript writes the data back to the DOM using innerHTML or similar</li>
          <li>Script executes without ever being sent to the server</li>
        </ul>
        <p>
          <strong>Example:</strong> Single-page app that reads <code>window.location.hash</code> and
          writes it to <code>element.innerHTML</code> for dynamic content rendering.
        </p>
        <p>
          <strong>Why it&apos;s dangerous:</strong> Server-side defenses (WAF, input validation) cannot
          detect or prevent DOM XSS because the malicious payload never reaches the server.
        </p>

        <ArticleImage
          src="/diagrams/frontend-nfr/xss-types-comparison.svg"
          alt="XSS Types Comparison"
          caption="Comparison of Reflected, Stored, and DOM-based XSS attack flows showing where the malicious script originates and executes"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">XSS Comparison</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Payload Location</th>
              <th className="p-3 text-left">Requires User Action</th>
              <th className="p-3 text-left">Server-Side Detectable</th>
              <th className="p-3 text-left">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Reflected</td>
              <td className="p-3">URL/query parameter</td>
              <td className="p-3">Yes (click link)</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Medium-High</td>
            </tr>
            <tr>
              <td className="p-3">Stored</td>
              <td className="p-3">Database/server storage</td>
              <td className="p-3">No (automatic)</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Critical</td>
            </tr>
            <tr>
              <td className="p-3">DOM-based</td>
              <td className="p-3">Client-side DOM</td>
              <td className="p-3">Yes (visit URL)</td>
              <td className="p-3">No</td>
              <td className="p-3">High</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>XSS Prevention Strategies</h2>
        <p>
          Preventing XSS requires defense in depth — multiple layers of protection that work together.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Output Encoding / Escaping</h3>
        <p>
          The primary defense against XSS. Convert special characters to their HTML entity equivalents
          before rendering user input.
        </p>
        <p>
          <strong>Context-aware encoding:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>HTML body:</strong> Encode <code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code>,
            <code>&quot;</code>, <code>&apos;</code>
          </li>
          <li>
            <strong>HTML attributes:</strong> Encode attributes and use single or double quotes consistently
          </li>
          <li>
            <strong>JavaScript:</strong> Use JSON.stringify for data, avoid inserting user data into script tags
          </li>
          <li>
            <strong>CSS:</strong> Validate and sanitize CSS values, avoid user-controlled CSS
          </li>
          <li>
            <strong>URLs:</strong> Encode URL parameters, validate URL schemes (block javascript:)
          </li>
        </ul>
        <p>
          <strong>Framework protection:</strong> React, Vue, and Angular automatically escape interpolated
          values. <code>{'{userInput}'}</code> is safe; <code>dangerouslySetInnerHTML</code> bypasses protection.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. Input Validation</h3>
        <p>
          Validate and sanitize all user input on both client and server. Use allowlists (what&apos;s allowed)
          rather than blocklists (what&apos;s blocked).
        </p>
        <ul className="space-y-2">
          <li><strong>Validate type:</strong> Numbers should be numbers, emails should match email pattern</li>
          <li><strong>Validate length:</strong> Enforce maximum lengths to prevent buffer-related issues</li>
          <li><strong>Validate format:</strong> Use regex patterns for expected formats (phone, SSN, etc.)</li>
          <li><strong>Validate range:</strong> Numbers should be within expected min/max values</li>
          <li><strong>Allowlist characters:</strong> For free text, consider allowing only safe characters</li>
        </ul>
        <p>
          <strong>Important:</strong> Input validation alone does NOT prevent XSS. It&apos;s a supplementary
          defense. Output encoding is the primary control.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. Content Security Policy (CSP)</h3>
        <p>
          CSP is an HTTP header that provides an additional layer of protection by specifying which sources
          of content are allowed to load and execute.
        </p>
        <p>
          <strong>Key CSP directives:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <code>default-src</code>: Default policy for all resource types
          </li>
          <li>
            <code>script-src</code>: Allowed JavaScript sources
          </li>
          <li>
            <code>style-src</code>: Allowed CSS sources
          </li>
          <li>
            <code>img-src</code>: Allowed image sources
          </li>
          <li>
            <code>connect-src</code>: Allowed XHR/fetch/WebSocket destinations
          </li>
          <li>
            <code>frame-ancestors</code>: Clickjacking protection (replaces X-Frame-Options)
          </li>
        </ul>
        <p>
          <strong>Example CSP header:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <code>Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;</code>
          </li>
        </ul>
        <p>
          <strong>CSP keywords:</strong>
        </p>
        <ul className="space-y-2">
          <li><code>'self'</code>: Allow from same origin</li>
          <li><code>'unsafe-inline'</code>: Allow inline scripts/styles (weakens CSP)</li>
          <li><code>'unsafe-eval'</code>: Allow eval() and similar (weakens CSP)</li>
          <li><code>'nonce-[value]'</code>: Allow scripts with matching nonce attribute</li>
          <li><code>'strict-dynamic'</code>: Trust scripts loaded by trusted scripts</li>
          <li><code>'report-uri'</code> or <code>'report-to'</code>: Where to send violation reports</li>
        </ul>
        <p>
          <strong>Best practice:</strong> Start with <code>Content-Security-Policy-Report-Only</code> header
          to test policies without blocking. Monitor violation reports, then enforce with
          <code>Content-Security-Policy</code>.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. Sanitization Libraries</h3>
        <p>
          When you must allow HTML input (rich text editors, comments with formatting), use sanitization
          libraries to strip dangerous elements and attributes.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>DOMPurify:</strong> Fast, widely-used, framework-agnostic. Recommended for React, Vue, Angular.
          </li>
          <li>
            <strong>sanitize-html:</strong> Node.js library for server-side sanitization.
          </li>
          <li>
            <strong>js-xss:</strong> Another option with configurable allowlists.
          </li>
        </ul>
        <p>
          <strong>What sanitizers remove:</strong>
        </p>
        <ul className="space-y-2">
          <li>Script tags and event handlers (onclick, onerror, onload)</li>
          <li>javascript: and data: URLs</li>
          <li>Dangerous tags (script, iframe, object, embed)</li>
          <li>CSS expressions and behaviors</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/xss-defense-layers.svg"
          alt="XSS Defense Layers"
          caption="Defense in depth for XSS prevention — encoding, validation, CSP, and sanitization working together"
        />
      </section>

      <section>
        <h2>Framework-Specific XSS Prevention</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">React</h3>
        <p>
          React automatically escapes values in JSX, providing protection against most XSS attacks.
        </p>
        <ul className="space-y-2">
          <li><strong>Safe:</strong> <code>{'{userInput}'}</code> in JSX is automatically escaped</li>
          <li><strong>Unsafe:</strong> <code>dangerouslySetInnerHTML</code> bypasses escaping — only use with sanitized content</li>
          <li><strong>Unsafe:</strong> Building HTML strings with concatenation and using dangerouslySetInnerHTML</li>
          <li><strong>Unsafe:</strong> Using user input in href attributes without validation (javascript: URLs)</li>
        </ul>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul className="space-y-2">
          <li>Use DOMPurify before passing HTML to dangerouslySetInnerHTML</li>
          <li>Validate URLs before using in href/src attributes</li>
          <li>Avoid eval(), Function constructor, setTimeout with strings</li>
          <li>Use CSP with nonce or strict-dynamic for additional protection</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Vue.js</h3>
        <p>
          Vue automatically escapes text interpolations but provides v-html for raw HTML.
        </p>
        <ul className="space-y-2">
          <li><strong>Safe:</strong> <code>{'{ { message } }'}</code> text interpolation</li>
          <li><strong>Unsafe:</strong> <code>v-html</code> directive renders raw HTML — sanitize first</li>
          <li><strong>Unsafe:</strong> Dynamic component names from user input</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Angular</h3>
        <p>
          Angular has built-in XSS protection through its templating system and DomSanitizer service.
        </p>
        <ul className="space-y-2">
          <li><strong>Safe:</strong> Standard interpolations and bindings are sanitized</li>
          <li><strong>Unsafe:</strong> BypassSecurityTrust* methods disable sanitization — avoid unless necessary</li>
          <li><strong>Unsafe:</strong> innerHTML bindings without sanitization</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Server-Side Rendering (Next.js, Nuxt)</h3>
        <p>
          SSR introduces additional XSS vectors because content is rendered on the server.
        </p>
        <ul className="space-y-2">
          <li>Sanitize user input before storing in database</li>
          <li>Encode output when rendering on server</li>
          <li>Be careful with getServerSideProps / asyncData that includes user input</li>
          <li>Implement CSP at the edge (CDN) or server level</li>
        </ul>
      </section>

      <section>
        <h2>Other Injection Attacks</h2>
        <p>
          XSS is one type of injection attack. Frontend engineers should also be aware of:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SQL Injection (via API)</h3>
        <p>
          While SQL injection is a backend vulnerability, frontend engineers should:
        </p>
        <ul className="space-y-2">
          <li>Never construct SQL queries on the client (e.g., in client-side databases)</li>
          <li>Use parameterized queries in any server-side code you write</li>
          <li>Validate input format before sending to API</li>
          <li>Understand that input validation on client is for UX, not security</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Prototype Pollution</h3>
        <p>
          A JavaScript-specific vulnerability where attackers modify Object.prototype.
        </p>
        <ul className="space-y-2">
          <li><strong>Cause:</strong> Unvalidated merge/clone operations on user-controlled objects</li>
          <li><strong>Impact:</strong> All objects inherit malicious properties, potential RCE</li>
          <li><strong>Prevention:</strong> Use Object.create(null) for maps, avoid recursive merge with user input, use libraries like lodash that patch prototype pollution</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Template Injection</h3>
        <p>
          When user input is interpreted as template code rather than data.
        </p>
        <ul className="space-y-2">
          <li><strong>Cause:</strong> Passing user input to template engines (Handlebars, Pug, etc.)</li>
          <li><strong>Impact:</strong> Arbitrary code execution, data exfiltration</li>
          <li><strong>Prevention:</strong> Never pass user input as template source, use sandboxed template execution</li>
        </ul>
      </section>

      <section>
        <h2>Security Headers for XSS Prevention</h2>
        <p>
          In addition to CSP, these headers provide defense in depth:
        </p>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Header</th>
              <th className="p-3 text-left">Purpose</th>
              <th className="p-3 text-left">Recommended Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><code>X-Content-Type-Options</code></td>
              <td className="p-3">Prevent MIME sniffing</td>
              <td className="p-3"><code>nosniff</code></td>
            </tr>
            <tr>
              <td className="p-3"><code>X-Frame-Options</code></td>
              <td className="p-3">Prevent clickjacking</td>
              <td className="p-3"><code>DENY</code> or <code>SAMEORIGIN</code></td>
            </tr>
            <tr>
              <td className="p-3"><code>X-XSS-Protection</code></td>
              <td className="p-3">Legacy browser XSS filter (deprecated)</td>
              <td className="p-3"><code>1; mode=block</code> (legacy only)</td>
            </tr>
            <tr>
              <td className="p-3"><code>Referrer-Policy</code></td>
              <td className="p-3">Control referrer information</td>
              <td className="p-3"><code>strict-origin-when-cross-origin</code></td>
            </tr>
            <tr>
              <td className="p-3"><code>Permissions-Policy</code></td>
              <td className="p-3">Disable browser features</td>
              <td className="p-3"><code>geolocation=(), microphone=()</code></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the three types of XSS and how do they differ?</p>
            <p className="mt-2 text-sm">
              A: Reflected XSS reflects malicious input off the server (via links). Stored XSS persists
              malicious content on the server (comments, profiles). DOM-based XSS executes entirely
              client-side without server involvement. Stored XSS is most severe because victims don&apos;t
              need to click anything. DOM XSS is hardest to detect because server-side defenses can&apos;t
              see the payload.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does React protect against XSS? When is it vulnerable?</p>
            <p className="mt-2 text-sm">
              A: React automatically escapes values in JSX interpolations, converting special characters
              to HTML entities. It&apos;s vulnerable when using dangerouslySetInnerHTML with unsanitized
              content, when building HTML strings via concatenation, or when using user input in href
              attributes without validating against javascript: URLs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is Content Security Policy and how does it prevent XSS?</p>
            <p className="mt-2 text-sm">
              A: CSP is an HTTP header that specifies allowed sources for scripts, styles, images, etc.
              It prevents XSS by blocking inline scripts (unless explicitly allowed with nonce or hash),
              restricting script sources to trusted domains, and preventing loading of malicious resources.
              A strict CSP like &quot;script-src 'self'&quot; blocks most XSS attacks even if injection
              occurs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you use a sanitization library vs output encoding?</p>
            <p className="mt-2 text-sm">
              A: Output encoding is the default defense — escape all user input before rendering. Use
              sanitization libraries only when you need to allow some HTML (rich text editors, formatted
              comments). Sanitization strips dangerous elements while preserving safe formatting. Never
              use raw HTML from users without sanitization, even with encoding, because some attacks
              bypass encoding via event handlers or javascript: URLs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement XSS protection in a new web application?</p>
            <p className="mt-2 text-sm">
              A: Defense in depth approach: (1) Use a modern framework (React, Vue, Angular) for automatic
              escaping. (2) Implement strict CSP with nonce or strict-dynamic. (3) Sanitize any HTML input
              with DOMPurify. (4) Validate all input format and type. (5) Set security headers
              (X-Content-Type-Options, X-Frame-Options). (6) Use automated security scanning in CI/CD.
              (7) Conduct regular security audits and penetration testing.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://owasp.org/www-community/attacks/xss/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP XSS Prevention Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Content Security Policy
            </a>
          </li>
          <li>
            <a href="https://github.com/cure53/DOMPurify" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              DOMPurify — XSS Sanitization Library
            </a>
          </li>
          <li>
            <a href="https://react.dev/reference/react-dom/components/common#dangerouslysetinnerhtml" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Documentation — dangerouslySetInnerHTML
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
