"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-security-xss-prevention-extensive",
  title: "XSS Prevention",
  description: "Comprehensive guide to Cross-Site Scripting (XSS) attacks, injection vectors, defense-in-depth strategies, and production-ready prevention techniques for staff/principal engineer interviews.",
  category: "frontend",
  subcategory: "security",
  slug: "xss-prevention",
  version: "extensive",
  wordCount: 8500,
  readingTime: 34,
  lastUpdated: "2026-03-19",
  tags: ["security", "xss", "frontend", "web-security", "input-validation", "output-encoding", "csp"],
  relatedTopics: ["content-security-policy", "input-validation-sanitization", "csrf-protection"],
};

export default function XSSPreventionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Cross-Site Scripting (XSS)</strong> is a code injection attack where malicious scripts are
          injected into trusted websites or applications. The attacker exploits vulnerabilities in the web
          application to deliver malicious JavaScript code to end users&apos; browsers. When the victim&apos;s
          browser executes this malicious code, the attacker can steal session cookies, capture credentials,
          redirect users to phishing sites, perform actions on behalf of the user, or exfiltrate sensitive data.
        </p>
        <p>
          XSS consistently ranks in the OWASP Top 10 web application security risks (currently OWASP Top 10 #3
          in 2021, previously #7 in 2017). Despite being a well-understood vulnerability, XSS remains pervasive
          because modern web applications are increasingly dynamic, accepting and rendering user-generated content
          from multiple sources: form inputs, URL parameters, API responses, third-party widgets, and
          user-uploaded files.
        </p>
        <p>
          The fundamental issue XSS exploits is the browser&apos;s inability to distinguish between legitimate
          application code and attacker-injected code. Browsers execute any JavaScript they receive from a
          domain, trusting it completely. XSS attacks trick the browser into treating attacker-controlled data
          as executable code by injecting it into contexts where JavaScript is expected: inline event handlers,
          script tags, javascript: URLs, or dynamically evaluated code.
        </p>
        <p>
          <strong>Why XSS matters for staff/principal engineers:</strong> As a technical leader, you&apos;re
          responsible for establishing security architecture, defining secure coding standards, and making
          trade-off decisions between functionality and security. XSS prevention requires a defense-in-depth
          approach spanning multiple layers: input validation, output encoding, Content Security Policy, secure
          framework usage, and security monitoring. Understanding XSS at a deep level enables you to design
          systems that are secure by default rather than bolt-on secure.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: XSS Is About Context, Not Just Input</h3>
          <p>
            XSS isn&apos;t simply &quot;bad input&quot;—it&apos;s about data being interpreted in the wrong
            context. The same payload (&lt;script&gt;alert(1)&lt;/script&gt;) is harmless in a JSON response
            but devastating when rendered as HTML. Prevention requires understanding the target context (HTML,
            attribute, URL, JavaScript, CSS) and applying appropriate encoding for that specific context.
          </p>
        </div>
      </section>

      <section>
        <h2>XSS Attack Types</h2>
        <p>
          XSS attacks are categorized based on how the malicious payload reaches the victim&apos;s browser.
          Understanding these categories is essential for designing appropriate defenses.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Reflected XSS (Non-Persistent)</h3>
        <p>
          In reflected XSS, the malicious payload is part of the request sent to the server and immediately
          &quot;reflected&quot; back in the response without permanent storage. The attack requires social
          engineering—the victim must click a crafted link or submit a malicious form.
        </p>
        <p>
          <strong>Attack Flow:</strong>
        </p>
        <ol className="space-y-2">
          <li>Attacker crafts a malicious URL: <code className="text-sm">https://example.com/search?q=&lt;script&gt;stealCookie()&lt;/script&gt;</code></li>
          <li>Victim clicks the link (via phishing email, social media, etc.)</li>
          <li>Server reflects the query parameter in the HTML response</li>
          <li>Victim&apos;s browser executes the injected script</li>
        </ol>
        <p>
          <strong>Common vectors:</strong> Search query parameters, error messages, form validation feedback,
          redirect URLs, API error responses.
        </p>
        <p>
          <strong>Real-world example:</strong> A search results page displays <code className="text-sm">Results for: {'{userInput}'}</code>
          without encoding. An attacker sends a link with JavaScript in the query parameter, and when the victim
          visits, the script executes in the context of the legitimate domain.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stored XSS (Persistent)</h3>
        <p>
          Stored XSS is more severe because the malicious payload is permanently stored on the target server
          (database, file system, comment system, forum posts, user profiles). Every user who views the
          compromised content becomes a victim—no social engineering required.
        </p>
        <p>
          <strong>Attack Flow:</strong>
        </p>
        <ol className="space-y-2">
          <li>Attacker submits malicious content via a form (comment, profile bio, product review)</li>
          <li>Application stores the payload without sanitization</li>
          <li>Victim views the page containing the stored payload</li>
          <li>Script executes automatically in the victim&apos;s browser</li>
        </ol>
        <p>
          <strong>Common vectors:</strong> Comment sections, forum posts, user profiles, product reviews,
          support tickets, chat messages, file upload metadata.
        </p>
        <p>
          <strong>Real-world example:</strong> A social media platform allows users to post status updates.
          An attacker posts &quot;&lt;script&gt;exfiltrateData()&lt;/script&gt;&quot;. Every user who views
          that post has the script execute in their browser, potentially stealing their session tokens.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DOM-based XSS</h3>
        <p>
          DOM-based XSS occurs entirely on the client side. The server never sees the malicious payload—it&apos;s
          injected via client-side JavaScript that unsafely manipulates the DOM using attacker-controlled data.
          This type is particularly insidious because server-side defenses (input validation, output encoding)
          are ineffective.
        </p>
        <p>
          <strong>Attack Flow:</strong>
        </p>
        <ol className="space-y-2">
          <li>Attacker crafts a URL with payload in the fragment: <code className="text-sm">#&lt;img src=x onerror=alert(1)&gt;</code></li>
          <li>Victim visits the URL</li>
          <li>Client-side JavaScript reads <code className="text-sm">window.location.hash</code> and writes it to the DOM using <code className="text-sm">innerHTML</code></li>
          <li>Browser parses and executes the injected script</li>
        </ol>
        <p>
          <strong>Common sources (data entry points):</strong> <code className="text-sm">window.location.hash</code>,
          <code className="text-sm">window.location.search</code>, <code className="text-sm">document.URL</code>,
          <code className="text-sm">document.referrer</code>, <code className="text-sm">messageEvent.data</code> (postMessage).
        </p>
        <p>
          <strong>Common sinks (dangerous operations):</strong> <code className="text-sm">element.innerHTML</code>,
          <code className="text-sm">element.outerHTML</code>, <code className="text-sm">document.write()</code>,
          <code className="text-sm">eval()</code>, <code className="text-sm">setTimeout()</code> with string arguments,
          <code className="text-sm">element.setAttribute('onclick', ...)</code>.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/xss-attack-types.svg"
          alt="XSS Attack Types comparison showing Reflected, Stored, and DOM-based XSS flows"
          caption="XSS Attack Types: Reflected XSS requires social engineering, Stored XSS affects all viewers, DOM-based XSS bypasses server-side defenses entirely."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Advanced XSS Variants</h3>
        <ul className="space-y-3">
          <li>
            <strong>Mutation XSS (mXSS):</strong> Exploits differences between browser HTML parsers and
            server-side sanitizers. The browser &quot;fixes&quot; malformed HTML in unexpected ways, creating
            executable scripts from seemingly safe input. Example: <code className="text-sm">&lt;svg&gt;&lt;foreignObject&gt;&lt;/svg&gt;&lt;img src=x onerror=alert(1)&gt;</code>
          </li>
          <li>
            <strong>Self-XSS:</strong> Users are tricked into running malicious code themselves (often via
            &quot;console paste attacks&quot; on social media). While not technically an XSS vulnerability,
            it can be combined with other attacks for impact.
          </li>
          <li>
            <strong>Universal XSS (UXSS):</strong> Exploits browser vulnerabilities or misconfigurations to
            execute scripts on any origin, breaking the same-origin policy entirely.
          </li>
          <li>
            <strong>Server-Side XSS:</strong> Occurs when server-side template engines (Jinja2, Twig, EJS)
            render untrusted data without proper escaping, allowing server-side code execution.
          </li>
        </ul>
      </section>

      <section>
        <h2>XSS Impact & Attack Scenarios</h2>
        <p>
          Understanding the potential impact of XSS is crucial for prioritizing security investments and
          communicating risk to stakeholders.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Hijacking</h3>
        <p>
          The most common XSS attack goal is stealing session cookies. If cookies lack the <code className="text-sm">HttpOnly</code> flag,
          JavaScript can access them via <code className="text-sm">document.cookie</code> and exfiltrate them to an attacker-controlled server.
          An attacker&apos;s payload might read the cookie and send it to their server using a fetch request with the cookie data encoded in the URL.
        </p>
        <p>
          With the session cookie, the attacker can impersonate the victim, access their account, perform
          transactions, or escalate privileges.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Credential Harvesting</h3>
        <p>
          XSS can inject fake login forms that overlay the legitimate UI. When users enter credentials,
          they&apos;re sent to the attacker. An attacker might inject a full-screen overlay with a convincing
          login form that submits to their collection server instead of the legitimate authentication endpoint.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Defacement & Phishing</h3>
        <p>
          Attackers can modify page content to display false information, damage brand reputation, or redirect
          users to phishing sites. This is particularly damaging for financial institutions, e-commerce, and
          news sites.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Keylogging & User Surveillance</h3>
        <p>
          Injected scripts can capture all user input, mouse movements, and clipboard data. Combined with
          geolocation API abuse, attackers can build detailed profiles of user behavior. An attacker might add
          a keydown event listener that logs every keystroke and the current URL to their server.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cryptomining & Resource Abuse</h3>
        <p>
          Attackers can inject cryptocurrency miners (e.g., Coinhive) that consume victim CPU resources.
          While less common now, this demonstrates how XSS can monetize attacks beyond data theft.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Supply Chain Attacks</h3>
        <p>
          Compromising a third-party script (analytics, ads, widgets) via XSS can affect all sites using that
          script. The 2018 British Airways Magecart attack injected skimming code via a compromised third-party
          script, stealing 380,000 payment cards.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: XSS Is Often a Stepping Stone</h3>
          <p>
            Rarely is XSS the end goal—it&apos;s a means to an end. Attackers use XSS to escalate privileges,
            pivot to other systems, or establish persistence. A &quot;simple&quot; alert() XSS can become a
            full account takeover with the right payload. Never dismiss XSS as &quot;just informational&quot;.
          </p>
        </div>
      </section>

      <section>
        <h2>Defense-in-Depth Strategy</h2>
        <p>
          No single defense prevents all XSS attacks. A robust security posture requires multiple overlapping
          layers, each addressing different attack vectors and providing fallback protection if another layer
          fails.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/xss-defense-layers.svg"
          alt="XSS Defense-in-Depth layers showing Input Validation, Output Encoding, CSP, and Security Headers"
          caption="XSS Defense-in-Depth: Multiple overlapping layers ensure that if one defense fails, others provide protection."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer 1: Input Validation</h3>
        <p>
          Validate and sanitize all untrusted data at the entry point. While input validation alone doesn&apos;t
          prevent XSS, it reduces attack surface and catches obvious malicious payloads early.
        </p>
        <p>
          <strong>Validation strategies:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Allowlist validation:</strong> Define what&apos;s allowed (e.g., alphanumeric only, specific
            patterns) and reject everything else. This is more secure than blocklist approaches.
          </li>
          <li>
            <strong>Type validation:</strong> Ensure numbers are numbers, emails match email patterns, dates
            are valid dates.
          </li>
          <li>
            <strong>Length limits:</strong> Enforce reasonable maximum lengths to prevent buffer overflows and
            reduce payload complexity.
          </li>
          <li>
            <strong>Pattern matching:</strong> Use regex to detect common XSS patterns (<code className="text-sm">&lt;script</code>,
            <code className="text-sm">javascript:</code>, <code className="text-sm">onerror=</code>), but don&apos;t rely solely on this.
          </li>
        </ul>
        <p>
          <strong>Important:</strong> Input validation should happen on both client and server. Client-side
          validation improves UX; server-side validation is mandatory for security.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer 2: Output Encoding (Context-Aware)</h3>
        <p>
          Output encoding is the most critical XSS defense. It transforms untrusted data so the browser
          interprets it as data, not code. The encoding method depends on where the data appears in the HTML.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">HTML Entity Encoding (for HTML Body Content)</h4>
        <p>
          When inserting data into HTML element content, encode special characters to HTML entities:
        </p>
        <ul className="space-y-2">
          <li><code className="text-sm">&lt;</code> → <code className="text-sm">&amp;lt;</code></li>
          <li><code className="text-sm">&gt;</code> → <code className="text-sm">&amp;gt;</code></li>
          <li><code className="text-sm">&amp;</code> → <code className="text-sm">&amp;amp;</code></li>
          <li><code className="text-sm">&quot;</code> → <code className="text-sm">&amp;quot;</code></li>
          <li><code className="text-sm">&apos;</code> → <code className="text-sm">&amp;#39;</code></li>
        </ul>
        <p>
          <strong>Example:</strong> User input <code className="text-sm">&lt;script&gt;alert(1)&lt;/script&gt;</code> becomes
          <code className="text-sm">&amp;lt;script&amp;gt;alert(1)&amp;lt;/script&amp;gt;</code>, which renders as text, not executable code.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Attribute Encoding</h4>
        <p>
          When inserting data into HTML attributes, encode quotes and other special characters. Always wrap
          attribute values in quotes (single or double).
        </p>
        <ul className="space-y-2">
          <li><code className="text-sm">&quot;</code> → <code className="text-sm">&amp;quot;</code></li>
          <li><code className="text-sm">&apos;</code> → <code className="text-sm">&amp;#39;</code></li>
          <li><code className="text-sm">&lt;</code> → <code className="text-sm">&amp;lt;</code></li>
          <li><code className="text-sm">&gt;</code> → <code className="text-sm">&amp;gt;</code></li>
          <li><code className="text-sm">&amp;</code> → <code className="text-sm">&amp;amp;</code></li>
        </ul>
        <p>
          <strong>Example:</strong> <code className="text-sm">&lt;img src=&quot;{`{userInput}`}&quot;&gt;</code> where
          <code className="text-sm">userInput = '&quot; onerror=&quot;alert(1)' </code>
          becomes <code className="text-sm">&lt;img src=&quot;&amp;quot; onerror=&quot;alert(1)&quot;&gt;</code>
        </p>

        <h4 className="mt-4 mb-2 font-semibold">JavaScript Encoding</h4>
        <p>
          When inserting data into JavaScript strings or variables, use Unicode escaping (\uXXXX) or backslash
          escaping for special characters.
        </p>
        <ul className="space-y-2">
          <li>Escape quotes: <code className="text-sm">&quot;</code> → <code className="text-sm">\&quot;</code>, <code className="text-sm">&apos;</code> → <code className="text-sm">\\&apos;</code></li>
          <li>Escape backslash: <code className="text-sm">\\</code> → <code className="text-sm">\\\\</code></li>
          <li>Escape line terminators: <code className="text-sm">\n</code>, <code className="text-sm">\r</code>, <code className="text-sm">\u2028</code>, <code className="text-sm">\u2029</code></li>
          <li>Escape &lt; and &gt; to prevent script tag injection: <code className="text-sm">\u003C</code>, <code className="text-sm">\u003E</code></li>
        </ul>
        <p>
          <strong>Best practice:</strong> Avoid inserting untrusted data directly into JavaScript. Use data
          attributes or JSON script tags instead.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">URL Encoding</h4>
        <p>
          When inserting data into URL parameters, use percent-encoding. Validate that URLs start with safe
          protocols (http, https) and block javascript: and data: URLs.
        </p>
        <ul className="space-y-2">
          <li>Use <code className="text-sm">encodeURIComponent()</code> for parameter values</li>
          <li>Validate URL protocol whitelist</li>
          <li>Block <code className="text-sm">javascript:</code>, <code className="text-sm">data:</code>, <code className="text-sm">vbscript:</code> protocols</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">CSS Encoding</h4>
        <p>
          When inserting data into CSS (e.g., style attributes), use CSS escaping. Avoid allowing untrusted
          data in CSS when possible—it&apos;s easy to bypass filters.
        </p>
        <ul className="space-y-2">
          <li>Escape special characters: <code className="text-sm">\\</code>, <code className="text-sm">&quot;</code>, <code className="text-sm">&apos;</code>, <code className="text-sm">&lt;</code>, <code className="text-sm">&gt;</code></li>
          <li>Block <code className="text-sm">expression()</code>, <code className="text-sm">url()</code>, <code className="text-sm">behavior</code>, <code className="text-sm">-moz-binding</code></li>
          <li>Validate color values, sizes, and other expected formats</li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/xss-context-aware-encoding.svg"
          alt="Context-Aware Encoding matrix showing different encoding methods for HTML, Attribute, JavaScript, URL, and CSS contexts"
          caption="Context-Aware Encoding: Different contexts require different encoding strategies. Using the wrong encoding leaves vulnerabilities."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer 3: Content Security Policy (CSP)</h3>
        <p>
          CSP is an HTTP header that provides a powerful additional layer of protection. It tells the browser
          which sources of content are trusted and which are not. Even if an attacker injects a script, CSP
          can prevent its execution.
        </p>
        <p>
          <strong>Key CSP directives:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <code className="text-sm">default-src</code>: Default policy for all resource types if not overridden
          </li>
          <li>
            <code className="text-sm">script-src</code>: Allowed JavaScript sources. Use <code className="text-sm">&apos;self&apos;</code> to allow only same-origin scripts.
          </li>
          <li>
            <code className="text-sm">style-src</code>: Allowed CSS sources
          </li>
          <li>
            <code className="text-sm">img-src</code>: Allowed image sources
          </li>
          <li>
            <code className="text-sm">connect-src</code>: Allowed fetch/XHR/WebSocket destinations
          </li>
          <li>
            <code className="text-sm">frame-ancestors</code>: Prevents clickjacking by controlling who can embed your site
          </li>
        </ul>
        <p>
          <strong>Example CSP header:</strong> A typical policy might set <code className="text-sm">default-src 'self'</code> to restrict all resources to same-origin by default,
          then allow scripts from same-origin and a trusted CDN with <code className="text-sm">script-src 'self' https://trusted-cdn.com</code>,
          allow styles from same-origin with inline styles permitted via <code className="text-sm">style-src 'self' 'unsafe-inline'</code>,
          allow images from same-origin, data URIs, and HTTPS sources with <code className="text-sm">img-src 'self' data: https:</code>,
          restrict API calls to your backend with <code className="text-sm">connect-src 'self' https://api.example.com</code>,
          and prevent all framing with <code className="text-sm">frame-ancestors 'none'</code>.
        </p>
        <p>
          <strong>CSP best practices:</strong>
        </p>
        <ul className="space-y-2">
          <li>Start with <code className="text-sm">Content-Security-Policy-Report-Only</code> to test without breaking functionality</li>
          <li>Avoid <code className="text-sm">&apos;unsafe-inline&apos;</code> and <code className="text-sm">&apos;unsafe-eval&apos;</code>—they defeat CSP&apos;s purpose</li>
          <li>Use nonces or hashes for necessary inline scripts</li>
          <li>Implement strict CSP gradually—don&apos;t enable full enforcement immediately</li>
          <li>Monitor CSP violation reports to detect attack attempts</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer 4: Secure Framework Usage</h3>
        <p>
          Modern frontend frameworks (React, Vue, Angular) provide built-in XSS protection by default. They
          automatically escape data when rendering, making it harder to introduce XSS vulnerabilities.
        </p>
        <p>
          <strong>React:</strong>
        </p>
        <ul className="space-y-2">
          <li>JSX expressions <code className="text-sm">{'{variable}'}</code> are automatically escaped</li>
          <li>Avoid <code className="text-sm">dangerouslySetInnerHTML</code>—only use with sanitized content</li>
          <li>Be cautious with <code className="text-sm">href</code> attributes—validate URLs to prevent javascript: injection</li>
        </ul>
        <p>
          <strong>Vue:</strong>
        </p>
        <ul className="space-y-2">
          <li>Mustache interpolation <code className="text-sm">{`{{ variable }}`}</code> escapes content</li>
          <li>Avoid <code className="text-sm">v-html</code> directive unless content is sanitized</li>
          <li>Use <code className="text-sm">v-bind</code> for dynamic attributes</li>
        </ul>
        <p>
          <strong>Angular:</strong>
        </p>
        <ul className="space-y-2">
          <li>Interpolation <code className="text-sm">{`{{ value }}`}</code> sanitizes content</li>
          <li>Avoid <code className="text-sm">bypassSecurityTrust*</code> methods unless absolutely necessary</li>
          <li>Angular&apos;s DomSanitizer provides built-in sanitization</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer 5: Security Headers</h3>
        <p>
          Beyond CSP, several HTTP headers provide additional XSS protection:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>X-Content-Type-Options: nosniff</strong> - Prevents browsers from MIME-sniffing responses,
            which can lead to script execution
          </li>
          <li>
            <strong>X-XSS-Protection: 1; mode=block</strong> - Legacy header (deprecated but still useful for
            older browsers) that enables browser XSS filters
          </li>
          <li>
            <strong>X-Frame-Options: DENY</strong> or <strong>SAMEORIGIN</strong> - Prevents clickjacking by
            controlling who can embed your site in frames
          </li>
          <li>
            <strong>Referrer-Policy: strict-origin-when-cross-origin</strong> - Limits referrer information
            leakage
          </li>
          <li>
            <strong>Permissions-Policy</strong> - Controls which browser features (geolocation, camera, etc.)
            can be used
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer 6: Cookie Security</h3>
        <p>
          Even with XSS, you can limit damage by securing cookies:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>HttpOnly:</strong> Prevents JavaScript access via <code className="text-sm">document.cookie</code>. Session
            cookies should always be HttpOnly.
          </li>
          <li>
            <strong>Secure:</strong> Cookies only sent over HTTPS, preventing interception on insecure networks
          </li>
          <li>
            <strong>SameSite:</strong> Controls when cookies are sent with cross-site requests. Use
            <code className="text-sm">SameSite=Strict</code> or <code className="text-sm">SameSite=Lax</code> to prevent CSRF and limit XSS impact
          </li>
        </ul>
      </section>

      <section>
        <h2>Sanitization Libraries</h2>
        <p>
          When you must allow HTML content (rich text editors, comments with formatting, user-generated
          content), use battle-tested sanitization libraries rather than building your own.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DOMPurify</h3>
        <p>
          DOMPurify is the gold standard for HTML sanitization. It&apos;s fast, configurable, and actively
          maintained. It handles mutation XSS and browser quirks that custom sanitizers miss.
        </p>
        <p>
          <strong>Usage:</strong> Import DOMPurify and call the <code className="text-sm">sanitize()</code> method on your HTML content. For basic sanitization, simply pass the HTML string. For stricter control, configure allowed tags (such as <code className="text-sm">b</code>, <code className="text-sm">i</code>, <code className="text-sm">em</code>, <code className="text-sm">strong</code>, <code className="text-sm">a</code>, <code className="text-sm">p</code>, <code className="text-sm">br</code>), allowed attributes (such as <code className="text-sm">href</code>, <code className="text-sm">target</code>, <code className="text-sm">rel</code>), and a URI regex pattern that only allows safe protocols like HTTP, HTTPS, and mailto. DOMPurify also supports context-specific sanitization profiles for SVG and MathML content.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Other Sanitizers</h3>
        <ul className="space-y-2">
          <li>
            <strong>sanitize-html (Node.js):</strong> Server-side HTML sanitization with configurable rules
          </li>
          <li>
            <strong>js-xss:</strong> XSS filter for Node.js and browser, supports custom whitelists
          </li>
          <li>
            <strong>DOMPurify with Trusted Types:</strong> For browsers supporting Trusted Types API,
            provides even stronger guarantees
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Sanitize on Both Client and Server</h3>
          <p>
            Client-side sanitization improves UX by providing immediate feedback. Server-side sanitization
            is mandatory for security—never trust client-side validation alone. An attacker can bypass your
            frontend and send malicious payloads directly to your API.
          </p>
        </div>
      </section>

      <section>
        <h2>Trade-offs & Considerations</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Defense Layer</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Input Validation</strong></td>
              <td className="p-3">
                • Catches obvious attacks early<br/>
                • Reduces attack surface<br/>
                • Improves data quality
              </td>
              <td className="p-3">
                • Doesn&apos;t prevent all XSS<br/>
                • Can be bypassed with encoding<br/>
                • May reject legitimate input
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Output Encoding</strong></td>
              <td className="p-3">
                • Most effective single defense<br/>
                • Context-aware protection<br/>
                • Framework-built in many cases
              </td>
              <td className="p-3">
                • Easy to forget in edge cases<br/>
                • Different encoding per context<br/>
                • Can break functionality if wrong
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Content Security Policy</strong></td>
              <td className="p-3">
                • Prevents inline script execution<br/>
                • Restricts external script sources<br/>
                • Provides violation reporting
              </td>
              <td className="p-3">
                • Complex to configure correctly<br/>
                • Can break legitimate functionality<br/>
                • Browser support varies
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Sanitization Libraries</strong></td>
              <td className="p-3">
                • Allows safe HTML when needed<br/>
                • Battle-tested implementations<br/>
                • Handles edge cases and mXSS
              </td>
              <td className="p-3">
                • Performance overhead<br/>
                • Configuration complexity<br/>
                • Must stay updated with new attacks
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Secure Frameworks</strong></td>
              <td className="p-3">
                • Automatic escaping by default<br/>
                • Reduces developer burden<br/>
                • Well-tested implementations
              </td>
              <td className="p-3">
                • Escape hatches can be misused<br/>
                • False sense of security<br/>
                • Framework-specific knowledge needed
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/xss-defense-comparison.svg"
          alt="XSS Defense Mechanisms comparison matrix showing effectiveness, complexity, and coverage"
          caption="XSS Defense Comparison: Each layer has different effectiveness against attack types. Layered defense provides comprehensive protection."
        />
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Architectural</h3>
        <ul className="space-y-2">
          <li>
            <strong>Defense in depth:</strong> Never rely on a single defense layer. Combine input validation,
            output encoding, CSP, and secure headers.
          </li>
          <li>
            <strong>Secure by default:</strong> Frameworks and libraries should escape by default. Opt-in to
            dangerous behavior (e.g., <code className="text-sm">dangerouslySetInnerHTML</code>) with explicit, documented decisions.
          </li>
          <li>
            <strong>Separation of concerns:</strong> Keep data and code separate. Use JSON for data transfer,
            not inline JavaScript in HTML.
          </li>
          <li>
            <strong>Principle of least privilege:</strong> Only allow the minimum necessary functionality.
            If you don&apos;t need user-generated HTML, don&apos;t accept it.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Development Practices</h3>
        <ul className="space-y-2">
          <li>
            <strong>Use framework defaults:</strong> React JSX, Vue interpolation, and Angular templates
            escape by default. Don&apos;t use escape hatches unless necessary.
          </li>
          <li>
            <strong>Validate URLs in href/src:</strong> Attackers can inject <code className="text-sm">javascript:</code> URLs.
            Validate that URLs start with <code className="text-sm">http:</code>, <code className="text-sm">https:</code>, or <code className="text-sm">/</code> for relative paths.
          </li>
          <li>
            <strong>Avoid dangerous APIs:</strong> Minimize use of <code className="text-sm">innerHTML</code>, <code className="text-sm">outerHTML</code>,
            <code className="text-sm">document.write()</code>, <code className="text-sm">eval()</code>, <code className="text-sm">setTimeout()</code> with strings.
          </li>
          <li>
            <strong>Use template literals safely:</strong> When building HTML strings, escape interpolated
            values or use DOM APIs instead.
          </li>
          <li>
            <strong>Sanitize rich text:</strong> For WYSIWYG editors, sanitize on both client and server.
            Configure allowed tags/attributes explicitly.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Content Security Policy</h3>
        <ul className="space-y-2">
          <li>
            <strong>Start with Report-Only:</strong> Deploy <code className="text-sm">Content-Security-Policy-Report-Only</code> first
            to identify breaking changes without affecting users.
          </li>
          <li>
            <strong>Avoid unsafe directives:</strong> Never use <code className="text-sm">&apos;unsafe-inline&apos;</code> or
            <code className="text-sm">&apos;unsafe-eval&apos;</code> in production. Use nonces or hashes for necessary inline scripts.
          </li>
          <li>
            <strong>Use strict CSP:</strong> Aim for <code className="text-sm">script-src 'self'</code> with no wildcards.
            Consider strict-dynamic for modern browsers.
          </li>
          <li>
            <strong>Monitor violations:</strong> Set up <code className="text-sm">report-uri</code> or <code className="text-sm">report-to</code> to
            collect CSP violation reports and detect attack attempts.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cookie Security</h3>
        <ul className="space-y-2">
          <li>
            <strong>Always use HttpOnly:</strong> Session cookies should never be accessible to JavaScript.
          </li>
          <li>
            <strong>Use Secure flag:</strong> Cookies should only transmit over HTTPS.
          </li>
          <li>
            <strong>Set SameSite:</strong> Use <code className="text-sm">SameSite=Strict</code> or <code className="text-sm">SameSite=Lax</code> to
            prevent CSRF and limit XSS impact.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing & Monitoring</h3>
        <ul className="space-y-2">
          <li>
            <strong>Automated scanning:</strong> Use tools like OWASP ZAP, Burp Suite, or Snyk to
            automatically detect XSS vulnerabilities.
          </li>
          <li>
            <strong>Manual testing:</strong> Test with XSS payload lists (OWASP XSS Cheat Sheet,
            PortSwigger XSS payloads).
          </li>
          <li>
            <strong>Security unit tests:</strong> Write tests that verify sanitization and encoding work
            correctly for known payloads.
          </li>
          <li>
            <strong>Monitor for attacks:</strong> Log and alert on CSP violations, unusual input patterns,
            and WAF blocks.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: XSS Prevention Is Ongoing</h3>
          <p>
            XSS prevention isn&apos;t a one-time implementation—it requires continuous vigilance. New attack
            techniques emerge, browsers change behavior, and new features introduce new risks. Regular security
            audits, dependency updates, and developer training are essential.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Relying solely on input validation:</strong> Input validation catches obvious attacks but
            misses encoded payloads and context-specific injections. Always combine with output encoding.
          </li>
          <li>
            <strong>Using blocklists instead of allowlists:</strong> Blocklists (trying to catch all bad
            patterns) always fail—attackers find bypasses. Use allowlists (only allowing known-good patterns).
          </li>
          <li>
            <strong>Double-encoding bugs:</strong> Encoding already-encoded data results in double encoding,
            which can sometimes be exploited. Encode once, at the right layer.
          </li>
          <li>
            <strong>Trusting client-side validation:</strong> Client-side validation is for UX, not security.
            Always validate and sanitize on the server.
          </li>
          <li>
            <strong>Misusing dangerouslySetInnerHTML:</strong> React&apos;s <code className="text-sm">dangerouslySetInnerHTML</code> bypasses
            all protections. Only use with sanitized content from trusted sources.
          </li>
          <li>
            <strong>Forgetting attribute context:</strong> HTML entity encoding isn&apos;t enough for
            JavaScript or URL contexts. Use context-appropriate encoding.
          </li>
          <li>
            <strong>Weak CSP:</strong> A CSP with <code className="text-sm">&apos;unsafe-inline&apos;</code> or wildcards provides
            minimal protection. Implement strict CSP incrementally.
          </li>
          <li>
            <strong>Ignoring DOM-based XSS:</strong> Server-side defenses don&apos;t protect against DOM-based
            XSS. Audit client-side JavaScript for unsafe DOM manipulation.
          </li>
          <li>
            <strong>Not sanitizing rich text:</strong> Allowing HTML without sanitization is an open
            invitation for XSS. Use DOMPurify or similar libraries.
          </li>
          <li>
            <strong>Forgetting about mutation XSS:</strong> Browser HTML parsers can &quot;fix&quot; malformed
            HTML in ways that create executable scripts. Use sanitizers that handle mXSS.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture at Scale: XSS Defense in Enterprise Systems</h2>
        <p>
          Implementing XSS prevention at enterprise scale requires architectural decisions that make security the default, not an afterthought. In microservices architectures, each service must independently validate and encode output, as there is no central security layer. API gateways can enforce Content Security Policy headers across all services, while service meshes can inject security headers at the proxy level.
        </p>
        <p>
          <strong>Design System Integration:</strong> Component libraries should enforce XSS-safe patterns by default. React components should never expose <code className="text-sm">dangerouslySetInnerHTML</code> without explicit sanitization. Template systems should auto-escape by default (Twig, Jinja2, EJS). Build pipelines should include automated CSP generation based on actual resource usage.
        </p>
        <p>
          <strong>CDN Security:</strong> When serving static assets through CDNs, implement Subresource Integrity (SRI) hashes to prevent CDN compromise from becoming XSS vectors. Use CDN-managed CSP reporting to detect violations across all edge locations. Consider using CDN WAF rules that block common XSS patterns at the edge before requests reach origin servers.
        </p>
        <p>
          <strong>Third-Party Script Management:</strong> Modern applications load dozens of third-party scripts (analytics, ads, widgets). Each represents a potential XSS vector if compromised. Implement strict CSP with nonces for first-party scripts only. Use <code className="text-sm">trusted-types</code> CSP policy to require explicit sanitization before DOM insertion. Consider using sandboxed iframes for third-party widgets to contain potential compromises.
        </p>
      </section>

      <section>
        <h2>Testing Strategies: Automated XSS Detection</h2>
        <p>
          Comprehensive XSS testing requires multiple layers of automated and manual testing integrated into CI/CD pipelines.
        </p>
        <p>
          <strong>Static Analysis (SAST):</strong> Tools like Semgrep, CodeQL, and ESLint security plugins can detect unsafe patterns: <code className="text-sm">innerHTML</code> assignments, <code className="text-sm">eval()</code> calls, <code className="text-sm">document.write()</code>, and unsanitized template literals. Configure these tools to fail builds on high-severity findings. Run SAST on every pull request with results posted as comments.
        </p>
        <p>
          <strong>Dynamic Analysis (DAST):</strong> OWASP ZAP, Burp Suite, and commercial scanners can automatically probe for XSS vulnerabilities by injecting payloads and analyzing responses. Configure DAST scans to run against staging environments after each deployment. Use authenticated scans to test logged-in functionality. Integrate DAST results with issue tracking for automatic ticket creation.
        </p>
        <p>
          <strong>Interactive Analysis (IAST):</strong> Tools like Contrast Security and HCL AppScan instrument running applications to detect XSS during functional testing. IAST provides better accuracy than DAST with fewer false positives. Run IAST agents in staging and production (read-only mode) for continuous monitoring.
        </p>
        <p>
          <strong>Penetration Testing:</strong> Quarterly manual penetration tests by security professionals catch complex XSS chains that automated tools miss. Provide pentesters with test accounts covering all user roles. Require remediation of all high/critical findings before production deployment. Track mean-time-to-remediation as a security metric.
        </p>
        <p>
          <strong>CSP Reporting:</strong> Implement CSP with <code className="text-sm">report-uri</code> or <code className="text-sm">report-to</code> directives to collect violation reports. Use services like Report URI or CSP Evaluator to analyze reports and identify potential XSS attempts. Monitor for sudden spikes in violations that may indicate active attacks.
        </p>
      </section>

      <section>
        <h2>Compliance & Legal Context</h2>
        <p>
          XSS vulnerabilities have significant compliance and legal implications beyond technical risk.
        </p>
        <p>
          <strong>OWASP Top 10:</strong> XSS consistently ranks in OWASP Top 10 (currently #3 in 2021). Many compliance frameworks reference OWASP Top 10 as a baseline requirement. Regular XSS testing demonstrates due diligence in security practices.
        </p>
        <p>
          <strong>GDPR Implications:</strong> XSS that leads to personal data exfiltration constitutes a data breach under GDPR Article 33, requiring notification within 72 hours. Fines can reach 4% of annual global revenue or €20 million. Document XSS prevention measures as part of Article 32 &quot;security of processing&quot; requirements.
        </p>
        <p>
          <strong>PCI-DSS Requirements:</strong> PCI-DSS Requirement 6.5.7 explicitly requires protection against XSS for payment processing systems. Annual penetration testing (Requirement 11.3) must include XSS testing. Non-compliance can result in fines up to $500,000 per incident and loss of payment processing capabilities.
        </p>
        <p>
          <strong>SOC 2 Controls:</strong> XSS prevention maps to SOC 2 Common Criteria CC6.1 (logical access controls) and CC7.2 (system monitoring). Document XSS testing procedures and results for annual SOC 2 audits. Track XSS vulnerability metrics as part of security monitoring.
        </p>
        <p>
          <strong>Industry-Specific Regulations:</strong> Healthcare (HIPAA), finance (GLBA), and education (FERPA) sectors have additional requirements for protecting user data from XSS-based exfiltration. Consult legal counsel for industry-specific compliance requirements.
        </p>
      </section>

      <section>
        <h2>Performance Trade-offs: Security vs. Latency</h2>
        <p>
          XSS prevention measures introduce latency that must be balanced against security requirements.
        </p>
        <p>
          <strong>Output Encoding Overhead:</strong> HTML entity encoding adds minimal latency (&lt;1ms per response) but is essential for security. Use streaming encoders for large responses to avoid buffering entire responses in memory. Pre-compute encoded versions of static content during build time.
        </p>
        <p>
          <strong>CSP Evaluation:</strong> Browser CSP evaluation adds 5-50ms depending on policy complexity. Keep CSP policies simple: avoid excessive <code className="text-sm">script-src</code> entries, use nonces instead of hashes for dynamic scripts, and leverage browser CSP caching. Test CSP impact using Chrome DevTools Performance panel.
        </p>
        <p>
          <strong>Sanitization Costs:</strong> DOMPurify sanitization of user HTML takes 10-100ms depending on input size. Cache sanitized versions of frequently-accessed content. Use Web Workers for sanitization to avoid blocking main thread. Consider server-side sanitization with CDN caching to amortize costs across users.
        </p>
        <p>
          <strong>WAF Latency:</strong> Cloud WAFs (Cloudflare, AWS WAF) add 10-100ms round-trip latency but provide edge-based XSS protection. Configure WAF rules to be less aggressive for authenticated API endpoints to reduce false positives. Use WAF logging to tune rules based on actual traffic patterns.
        </p>
        <p>
          <strong>Monitoring Overhead:</strong> CSP reporting and security monitoring add minimal latency when implemented asynchronously. Use <code className="text-sm">navigator.sendBeacon()</code> for violation reports to avoid blocking page unload. Batch security events for periodic transmission rather than real-time streaming.
        </p>
      </section>

      <section>
        <h2>Browser & Platform Compatibility</h2>
        <p>
          XSS prevention effectiveness varies across browsers and platforms.
        </p>
        <p>
          <strong>CSP Support:</strong> CSP Level 3 (nonce, strict-dynamic) supported in Chrome 63+, Firefox 67+, Safari 12.1+, Edge 79+. For older browsers, implement CSP Level 2 with <code className="text-sm">unsafe-inline</code> fallback (less secure). Use <code className="text-sm">Content-Security-Policy-Report-Only</code> header to test policies before enforcement.
        </p>
        <p>
          <strong>Trusted Types:</strong> Chrome 83+, Edge 83+ support Trusted Types API for DOM XSS prevention. Firefox and Safari have not implemented. Use as progressive enhancement: <code className="text-sm">if (window.trustedTypes)</code> to enable stricter policies for supporting browsers.
        </p>
        <p>
          <strong>Mobile Considerations:</strong> Mobile browsers often have stricter resource limits. CSP evaluation and sanitization can impact battery life. Test XSS prevention on low-end devices (2GB RAM, quad-core CPU) to ensure acceptable performance. Consider reducing sanitization complexity for mobile user agents.
        </p>
        <p>
          <strong>WebView Security:</strong> In-app WebViews (iOS WKWebView, Android WebView) may have different XSS characteristics than mobile browsers. Test XSS prevention in actual app WebViews, not just mobile browsers. Consider disabling JavaScript entirely for read-only content in WebViews.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Social Media Platform</h3>
        <p>
          <strong>Challenge:</strong> Users post status updates, comments, and messages with formatting.
          Attackers try to inject scripts to steal sessions or spread malware.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Allow limited HTML tags (b, i, em, strong, a) with sanitized attributes</li>
          <li>DOMPurify on both client and server with strict allowlists</li>
          <li>CSP with <code className="text-sm">script-src 'self'</code> and nonce-based inline scripts</li>
          <li>All user content rendered in sandboxed iframes for additional isolation</li>
          <li>HttpOnly + Secure + SameSite cookies to limit session hijacking impact</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-Commerce Platform</h3>
        <p>
          <strong>Challenge:</strong> Product reviews, Q&A sections, and seller descriptions allow user-generated
          content. Payment processing makes XSS particularly dangerous.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>No HTML allowed in reviews—plain text only with HTML entity encoding</li>
          <li>Rich text for seller descriptions sanitized with strict allowlist</li>
          <li>Strict CSP with reporting enabled</li>
          <li>WAF rules to detect and block common XSS payloads</li>
          <li>Regular penetration testing and bug bounty program</li>
          <li>Payment pages on separate subdomain with even stricter CSP</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SaaS Dashboard Application</h3>
        <p>
          <strong>Challenge:</strong> Internal dashboard with user-customizable widgets. Users can embed
          external data sources and custom JavaScript.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Custom JavaScript runs in sandboxed Web Workers with restricted APIs</li>
          <li>External data sources validated and sanitized before rendering</li>
          <li>Widget isolation using Shadow DOM to prevent cross-widget attacks</li>
          <li>CSP per-widget with individual nonces</li>
          <li>All user actions logged and audited for anomaly detection</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Content Management System</h3>
        <p>
          <strong>Challenge:</strong> Authors need to publish articles with rich formatting, embedded media,
          and third-party widgets. Each feature introduces XSS risk.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>WYSIWYG editor with DOMPurify integration</li>
          <li>Third-party embeds (YouTube, Twitter) use official oEmbed APIs with sanitization</li>
          <li>Custom components for common embeds instead of raw HTML</li>
          <li>Preview mode renders in sandboxed iframe</li>
          <li>Publication workflow includes automated security scanning</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: What&apos;s the difference between Reflected, Stored, and DOM-based XSS?</p>
            <p className="mt-2 text-sm">
              A: <strong>Reflected XSS</strong> requires the malicious payload to be part of the request and
              immediately reflected in the response—no server-side storage. It requires social engineering
              (victim clicks a crafted link). <strong>Stored XSS</strong> persists the payload on the server
              (database, file system), affecting all users who view the compromised content—no social engineering
              needed. <strong>DOM-based XSS</strong> occurs entirely client-side when JavaScript unsafely
              manipulates the DOM using attacker-controlled data. Server-side defenses are ineffective against
              DOM-based XSS because the payload never touches the server.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: Why is output encoding more important than input validation for XSS prevention?</p>
            <p className="mt-2 text-sm">
              A: Input validation checks data at the entry point, but it can&apos;t account for all possible
              injection contexts. The same payload might be harmless in one context (JSON) but devastating in
              another (HTML). Output encoding transforms data specifically for the target context (HTML body,
              attribute, JavaScript, URL, CSS), ensuring the browser interprets it as data, not code. Input
              validation is still valuable for catching obvious attacks and improving data quality, but encoding
              at the point of output is the definitive defense.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: How does Content Security Policy (CSP) prevent XSS, and what are its limitations?</p>
            <p className="mt-2 text-sm">
              A: CSP prevents XSS by declaring which sources of content are trusted. A strict CSP with
              <code className="text-sm">script-src 'self'</code> blocks inline scripts and scripts from untrusted CDNs, even if an
              attacker successfully injects them. CSP can also block <code className="text-sm">eval()</code>, <code className="text-sm">javascript:</code> URLs,
              and unsafe DOM operations. Limitations: CSP can&apos;t prevent XSS from trusted sources (compromised
              first-party scripts), requires careful configuration to avoid breaking functionality, browser
              support varies, and <code className="text-sm">&apos;unsafe-inline&apos;</code> or wildcards defeat its purpose. CSP is a
              defense-in-depth layer, not a silver bullet.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: You need to allow users to post formatted comments with links and bold text. How do you prevent XSS?</p>
            <p className="mt-2 text-sm">
              A: Use a layered approach: (1) Client-side WYSIWYG editor with built-in sanitization for UX.
              (2) Server-side sanitization using DOMPurify with a strict allowlist: <code className="text-sm">ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a']</code>,
              <code className="text-sm">ALLOWED_ATTR: ['href']</code>. (3) Validate URLs to block <code className="text-sm">javascript:</code> and <code className="text-sm">data:</code> protocols.
              (4) Apply HTML entity encoding when rendering. (5) Implement CSP to block inline scripts.
              (6) Set HttpOnly + Secure + SameSite cookies to limit session hijacking impact. Never build
              your own sanitizer—use battle-tested libraries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: What is Mutation XSS (mXSS), and how do you defend against it?</p>
            <p className="mt-2 text-sm">
              A: Mutation XSS exploits differences between browser HTML parsers and server-side sanitizers.
              When malformed HTML is inserted into the DOM, browsers &quot;fix&quot; it in unexpected ways that
              can create executable scripts from seemingly safe input. For example, <code className="text-sm">&lt;svg&gt;&lt;foreignObject&gt;&lt;/svg&gt;&lt;img src=x onerror=alert(1)&gt;</code>
              might be restructured by the browser to execute the script. Defense: Use sanitizers like DOMPurify
              that specifically handle mXSS by parsing HTML the same way browsers do. Always sanitize on the
              client before inserting into the DOM, not just on the server.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: How would you design a secure rich text editor for a blogging platform?</p>
            <p className="mt-2 text-sm">
              A: Architecture: (1) Use a modern editor (Draft.js, ProseMirror, TipTap) that produces structured
              data, not raw HTML. (2) Client-side sanitization with DOMPurify before preview. (3) Server-side
              sanitization with identical rules—never trust client-side validation. (4) Strict allowlist of
              tags (p, h1-h6, b, i, em, strong, a, img, ul, ol, li, blockquote, code) and attributes
              (href with protocol validation, src for images, alt text). (5) CSP with <code className="text-sm">script-src 'self'</code> and
              nonce-based inline scripts. (6) Images served from separate domain with no cookies. (7) Preview
              in sandboxed iframe. (8) Audit logs for all content changes. (9) Automated security scanning
              before publication.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://owasp.org/www-community/attacks/xss/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP XSS Attack Documentation
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP XSS Prevention Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP DOM-based XSS Prevention Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://content-security-policy.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Content Security Policy Guide
            </a>
          </li>
          <li>
            <a href="https://github.com/cure53/DOMPurify" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              DOMPurify GitHub Repository
            </a>
          </li>
          <li>
            <a href="https://portswigger.net/web-security/cross-site-scripting" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PortSwigger XSS Vulnerabilities
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks#cross-site_scripting_xss" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Security: XSS
            </a>
          </li>
          <li>
            <a href="https://www.google.com/about/appsecurity/learning-center/xss/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google App Security: XSS
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
