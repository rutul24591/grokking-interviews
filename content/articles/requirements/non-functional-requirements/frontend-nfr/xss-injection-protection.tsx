"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-xss-injection-protection",
  title: "XSS & Injection Protection",
  description:
    "Comprehensive guide to cross-site scripting (XSS) attacks, injection vulnerabilities, Content Security Policy, sanitization, and frontend security best practices.",
  category: "frontend",
  subcategory: "nfr",
  slug: "xss-injection-protection",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: [
    "frontend",
    "nfr",
    "security",
    "xss",
    "injection",
    "csp",
    "sanitization",
  ],
  relatedTopics: [
    "secure-client-storage",
    "authentication-ux",
    "third-party-script-safety",
  ],
};

export default function XSSInjectionProtectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Cross-Site Scripting (XSS)</strong> is a code injection
          attack where malicious scripts are injected into trusted websites.
          When users visit the compromised page, the malicious script executes
          in their browser within the context of the trusted site, potentially
          stealing cookies and session tokens, capturing keystrokes and
          credentials, redirecting to phishing sites, modifying page content,
          and performing actions on behalf of the victim user. XSS consistently
          ranks in the OWASP Top 10 web application security risks and is
          particularly relevant for frontend engineers because modern
          applications — with server-side rendering, dangerouslySetInnerHTML,
          third-party integrations, and user-generated content — create numerous
          XSS vectors.
        </p>
        <p>
          XSS attacks are classified by how the malicious script is delivered
          and executed. Reflected XSS reflects the malicious script off the web
          server — the attacker crafts a URL with a malicious script in a query
          parameter, the victim clicks the link, and the server reflects the
          input in the response without proper encoding. Stored XSS persists the
          malicious script on the server (database, comment field, profile) —
          victims view the infected content through normal browsing, making it
          more severe because no user action (clicking a link) is required.
          DOM-based XSS exists entirely in client-side code — the attack
          payload is delivered via URL fragment or query parameter, read by
          client-side JavaScript from the DOM (location.hash, location.search),
          and written back to the DOM using innerHTML or similar. DOM-based XSS
          is particularly dangerous because server-side defenses (WAF, input
          validation) cannot detect it — the payload never reaches the server.
        </p>
        <p>
          For staff and principal engineer interviews, XSS questions test
          security awareness, understanding of browser security models, and
          ability to design secure systems. The key principles are defense in
          depth (multiple layers of protection that work together), output
          encoding as the primary defense (converting special characters to HTML
          entities), input validation as a supplementary defense (not sufficient
          alone), Content Security Policy as a safety net (restricting which
          scripts can execute), and sanitization when HTML input is required
          (rich text editors, comments with formatting).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Output encoding (escaping) is the primary defense against XSS. It
          converts special characters to their HTML entity equivalents before
          rendering user input — ampersand to <code>&amp;amp;</code>, less-than
          to <code>&amp;lt;</code>, greater-than to <code>&amp;gt;</code>,
          double quote to <code>&amp;quot;</code>, and single quote to{" "}
          <code>&amp;#x27;</code>. Encoding must be context-aware — the
          encoding rules differ for HTML body content, HTML attributes,
          JavaScript context, CSS context, and URL context. Modern frameworks
          (React, Vue, Angular) automatically encode interpolated values —{" "}
          <code>{"{userInput}"}</code> in React JSX is automatically escaped.
          The danger arises when this protection is bypassed —{" "}
          <code>dangerouslySetInnerHTML</code> in React, <code>v-html</code> in
          Vue, or <code>innerHTML</code> in vanilla JavaScript — which render
          raw HTML without encoding.
        </p>
        <p>
          Input validation supplements output encoding by ensuring that user
          input conforms to expected formats and ranges. Validate type (numbers
          should be numbers, emails should match email pattern), length (enforce
          maximum lengths), format (use regex patterns for expected formats like
          phone numbers), and range (numbers within expected min/max values).
          Use allowlists (what is allowed) rather than blocklists (what is
          blocked) — blocklists are always incomplete because attackers find
          new bypass techniques. Importantly, input validation alone does not
          prevent XSS — it is a supplementary defense. A determined attacker
          can craft input that passes validation but still executes as script
          when rendered without encoding.
        </p>
        <p>
          Content Security Policy (CSP) provides an additional layer of
          protection by specifying which sources of content are allowed to load
          and execute. The <code>script-src</code> directive controls which
          JavaScript sources can execute — restricting it to{" "}
          <code>&apos;self&apos;</code> and specific trusted domains prevents
          unauthorized scripts from running. Nonces (single-use tokens) allow
          specific inline scripts to execute while blocking all others. The{" "}
          <code>&apos;unsafe-inline&apos;</code> and{" "}
          <code>&apos;unsafe-eval&apos;</code> keywords weaken CSP significantly
          and should be avoided. Start with{" "}
          <code>Content-Security-Policy-Report-Only</code> to test policies
          without blocking, monitor violation reports to identify legitimate
          scripts that need to be allowed, then enforce with{" "}
          <code>Content-Security-Policy</code>.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/xss-types-comparison.svg"
          alt="XSS Types Comparison"
          caption="Comparison of Reflected XSS (malicious URL, server reflects input), Stored XSS (persistent in database, automatic execution), and DOM-based XSS (client-side only, payload never reaches server)"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The XSS defense architecture follows a defense-in-depth model with
          four layers. Layer 1 is output encoding — every user input is encoded
          for its rendering context before being inserted into the DOM.
          Framework auto-encoding (React JSX escaping) handles the common case,
          and manual encoding (DOMPurify, encode functions) handles exceptions
          like dangerouslySetInnerHTML. Layer 2 is input validation — all user
          input is validated on both client and server against expected formats,
          types, lengths, and ranges using allowlists. Layer 3 is Content
          Security Policy — the HTTP header restricts which scripts can execute,
          blocking any script not from an approved source. Layer 4 is
          sanitization — when HTML input is required (rich text editors,
          comments with formatting), sanitization libraries (DOMPurify,
          sanitize-html) strip dangerous elements and attributes while
          preserving safe formatting.
        </p>
        <p>
          Framework-specific XSS prevention leverages each framework&apos;s
          built-in protections while avoiding patterns that bypass them. React
          automatically escapes JSX interpolations — <code>user input in braces</code>
          is safe. The danger is <code>dangerouslySetInnerHTML</code> — only
          use it with content sanitized by DOMPurify. URLs in href/src
          attributes must be validated to block <code>javascript:</code> URLs.
          Vue automatically escapes text interpolations — <code>template text binding</code> is safe. The danger is <code>v-html</code> — sanitize
          first. Angular has built-in XSS protection through its templating
          system and DomSanitizer service — the danger is
          bypassSecurityTrust* methods that disable sanitization.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/xss-defense-layers.svg"
          alt="XSS Defense Layers"
          caption="Defense in depth for XSS prevention — output encoding (primary), input validation (supplementary), Content Security Policy (safety net), and sanitization (for HTML input) working together"
        />

        <p>
          Server-Side Rendering introduces additional XSS vectors because
          content is rendered on the server and sent as HTML to the browser.
          User input must be sanitized before storing in the database, encoded
          when rendering on the server, and carefully handled in{" "}
          <code>getServerSideProps</code> or <code>asyncData</code> that
          includes user input. CSP should be implemented at the edge (CDN) or
          server level, not just in the application code. The SSR context means
          that XSS vulnerabilities affect all users who receive the rendered
          HTML, not just users who interact with specific client-side code —
          making server-side XSS prevention even more critical.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          CSP strictness versus developer convenience is a fundamental
          trade-off. A strict CSP (no <code>&apos;unsafe-inline&apos;</code>,
          no <code>&apos;unsafe-eval&apos;</code>, specific domain allowlist)
          provides maximum protection but requires refactoring inline scripts,
          eliminating eval-based patterns, and managing nonces for legitimate
          inline scripts. A lenient CSP (allowing <code>&apos;unsafe-inline&apos;</code>)
          is easier to implement but provides minimal protection — any injected
          inline script can execute. The recommended approach is to start with
          Report-Only mode, identify all inline scripts and eval usage, refactor
          them to use external scripts with nonces, then enforce the strict
          policy. The refactoring effort is significant but provides meaningful
          XSS protection.
        </p>
        <p>
          Sanitization library selection involves trade-offs between strictness
          and flexibility. DOMPurify is fast, widely-used, and
          framework-agnostic — it is the recommended default for most use cases.
          It strips dangerous elements (script, iframe, object, embed), event
          handlers (onclick, onerror, onload), javascript: URLs, and CSS
          expressions while preserving safe HTML formatting. sanitize-html is a
          Node.js library for server-side sanitization with configurable
          allowlists — useful when you need fine-grained control over which
          tags and attributes are allowed. js-xss offers another configurable
          option. The trade-off is that overly strict sanitization removes
          legitimate formatting (users cannot bold or italicize text), while
          overly lenient sanitization may miss dangerous patterns — the
          allowlist must be carefully curated and regularly updated.
        </p>
        <p>
          Framework auto-encoding versus manual sanitization depends on the
          input type. For plain text input (names, emails, comments), framework
          auto-encoding is sufficient — the framework escapes all special
          characters, preventing script execution. For rich text input (formatted
          comments, blog posts with formatting, email bodies), manual
          sanitization is required because the HTML tags must be preserved while
          dangerous elements are stripped. The key insight is that sanitization
          is only needed when you want to allow some HTML — if you do not need
          HTML formatting, framework auto-encoding is simpler and more reliable.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Use framework auto-encoding as the default defense — never bypass it
          without a compelling reason. In React, use JSX interpolation
          (<code>{"{userInput}"}</code>) instead of{" "}
          <code>dangerouslySetInnerHTML</code>. When dangerouslySetInnerHTML is
          unavoidable (rendering rich text content from a CMS), always sanitize
          the content with DOMPurify first:{" "}
          <code>{`dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}`}</code>.
          Validate URLs before using them in href/src attributes — block
          <code>javascript:</code>, <code>data:</code>, and{" "}
          <code>vbscript:</code> URL schemes, allowing only http:, https:, and
          relative URLs.
        </p>
        <p>
          Implement Content Security Policy as a safety net that catches any
          XSS that bypasses encoding and sanitization. Configure script-src to
          allow only your own origin and specific trusted third-party domains.
          Use nonces for legitimate inline scripts instead of{" "}
          <code>&apos;unsafe-inline&apos;</code>. Avoid{" "}
          <code>&apos;unsafe-eval&apos;</code> — it allows any eval()-like
          function, which is a common XSS vector. Implement CSP violation
          reporting to a monitoring endpoint so you are alerted when legitimate
          scripts are blocked (indicating incomplete CSP configuration) or when
          unauthorized scripts attempt to execute (indicating a potential attack).
        </p>
        <p>
          Avoid dangerous JavaScript patterns that enable XSS. Never use{" "}
          <code>eval()</code>, <code>Function()</code> constructor, or{" "}
          <code>setTimeout/setInterval</code> with string arguments — these
          execute arbitrary code and are XSS vectors if any part of the string
          comes from user input. Never build HTML strings with user input
          concatenation and insert them with innerHTML — use DOM APIs
          (createElement, textContent) or framework templating instead. Never
          use user input as part of a CSS url() value — CSS can execute
          JavaScript through <code>expression()</code> in older IE and{" "}
          <code>url(javascript:...)</code> in some contexts.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Using dangerouslySetInnerHTML with unsanitized content is the most
          common React XSS vulnerability. Developers use it to render HTML
          content from a CMS, WYSIWYG editor, or API response without realizing
          that the content may contain malicious scripts. Even if the CMS is
          trusted, a compromised CMS account or a vulnerable editor can inject
          malicious HTML. The fix is to always sanitize with DOMPurify before
          passing HTML to dangerouslySetInnerHTML, and to configure DOMPurify
          with a strict allowlist of allowed tags and attributes.
        </p>
        <p>
          Prototype pollution is a JavaScript-specific injection vulnerability
          where attackers modify Object.prototype through unsanified merge or
          clone operations on user-controlled objects. When an object is merged
          with user-controlled keys, setting <code>__proto__</code> or{" "}
          <code>constructor.prototype</code> modifies Object.prototype, causing
          all objects to inherit the malicious properties. This can lead to
          remote code execution if the polluted properties affect security
          checks or code paths. Prevention: use Object.create(null) for maps,
          avoid recursive merge with user input, and use libraries that patch
          prototype pollution (lodash 4.17.21+).
        </p>
        <p>
          Relying solely on client-side input validation for security is a
          fundamental error. Client-side validation (HTML5 form validation,
          JavaScript regex checks) is for user experience — it provides
          immediate feedback to users before submitting the form. It provides
          zero security because attackers can bypass client-side validation
          entirely (using curl, Postman, or browser DevTools to modify requests
          directly). All input validation for security must be performed on the
          server side, where the attacker cannot bypass it. Client-side
          validation is a convenience feature, not a security control.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Social media platforms face the highest XSS risk because they render
          user-generated content (posts, comments, profiles, messages) to other
          users. Twitter, Facebook, and Reddit use a combination of framework
          auto-encoding for plain text, DOMPurify sanitization for posts with
          formatting, strict CSP with nonce-based inline scripts, and
          server-side encoding for SSR-rendered content. They also implement
          automated content scanning for known XSS patterns and manually review
          reported content. The constant arms race between attackers finding
          new XSS vectors and platforms patching them has led to increasingly
          strict CSP policies and comprehensive sanitization allowlists.
        </p>
        <p>
          Content management systems (WordPress, Contentful, Sanity) must
          balance rich text editing capabilities with XSS prevention. They
          sanitize all HTML content on the server side before storage using
          configurable allowlists (allowing safe tags like p, strong, em, a,
          img with sanitized attributes, while blocking script, iframe, object,
          embed, and event handlers). The sanitization configuration is
          customizable per tenant — enterprise customers can restrict the
          allowlist further, while personal blogs may allow more formatting
          options. The CMS also encodes output on the server side when rendering
          pages, providing defense in depth even if sanitization misses
          something.
        </p>
        <p>
          Financial applications implement the strictest XSS prevention because
          successful XSS in a banking application enables session hijacking,
          unauthorized transactions, and credential theft. They use strict CSP
          (no unsafe-inline, no unsafe-eval, specific domain allowlist),
          comprehensive input validation and encoding on both client and server,
          DOMPurify sanitization for any HTML content, Trusted Types API to
          prevent DOM XSS from dangerous API usage, and regular security audits
          with automated XSS scanning in CI/CD. The defense-in-depth approach
          ensures that even if one layer fails, other layers provide protection.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the three types of XSS and how do they differ?
            </p>
            <p className="mt-2 text-sm">
              A: Reflected XSS reflects malicious input off the server via URLs
              — the victim must click a malicious link. Stored XSS persists
              malicious content on the server (comments, profiles) — victims
              see it through normal browsing, no click required, making it more
              severe. DOM-based XSS executes entirely client-side — the payload
              is read from the DOM (location.hash) and written back via
              innerHTML, never reaching the server, so server-side defenses
              cannot detect it. Stored XSS is most severe, DOM XSS is hardest
              to detect server-side.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does React protect against XSS? When is it vulnerable?
            </p>
            <p className="mt-2 text-sm">
              A: React automatically escapes values in JSX interpolations,
              converting special characters to HTML entities. It is vulnerable
              when using dangerouslySetInnerHTML with unsanitized content, when
              building HTML strings with user input concatenation, when using
              user input in href/src attributes without validating URL schemes
              (blocking javascript: URLs), and when using eval(), Function(), or
              setTimeout with strings containing user input. Always sanitize
              with DOMPurify before dangerouslySetInnerHTML.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is Content Security Policy and how does it prevent XSS?
            </p>
            <p className="mt-2 text-sm">
              A: CSP is an HTTP header that specifies which content sources are
              allowed. script-src restricts which JavaScript sources can
              execute — setting it to &apos;self&apos; and specific trusted
              domains blocks unauthorized scripts. Nonces allow specific inline
              scripts while blocking all others. Avoid unsafe-inline and
              unsafe-eval. Start with Report-Only mode to test, then enforce.
              CSP catches XSS that bypasses encoding and sanitization — it is
              a safety net, not the primary defense.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is prototype pollution and how do you prevent it?
            </p>
            <p className="mt-2 text-sm">
              A: Prototype pollution occurs when user-controlled keys are merged
              into objects unsafely, allowing attackers to set __proto__ or
              constructor.prototype, modifying Object.prototype. All objects
              then inherit the malicious properties, which can bypass security
              checks or cause unexpected behavior. Prevention: use
              Object.create(null) for maps, avoid recursive merge with user
              input, use libraries that patch prototype pollution (lodash
              4.17.21+), and validate object keys before merge operations.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the security headers for XSS prevention?
            </p>
            <p className="mt-2 text-sm">
              A: Content-Security-Policy (primary — restrict script sources,
              use nonces, avoid unsafe-inline/eval). X-Content-Type-Options:
              nosniff (prevent MIME sniffing attacks). X-Frame-Options: DENY
              or SAMEORIGIN (prevent clickjacking via iframes). Referrer-Policy:
              strict-origin-when-cross-origin (control referrer information).
              Permissions-Policy: disable unnecessary browser features
              (geolocation, microphone). Implement all headers for defense in
              depth — no single header provides complete protection.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://owasp.org/www-community/attacks/xss/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP — Cross-Site Scripting (XSS)
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Content Security Policy
            </a>
          </li>
          <li>
            <a
              href="https://github.com/cure53/DOMPurify"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DOMPurify — HTML Sanitization Library
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP — XSS Prevention Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Documentation — dangerouslySetInnerHTML
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
