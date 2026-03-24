"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-security-clickjacking-extensive",
  title: "Clickjacking Prevention",
  description: "Comprehensive guide to clickjacking attacks, X-Frame-Options, frame-ancestors CSP, frame busting techniques, and prevention strategies for staff/principal engineer interviews.",
  category: "frontend",
  subcategory: "security",
  slug: "clickjacking-prevention",
  version: "extensive",
  wordCount: 6800,
  readingTime: 27,
  lastUpdated: "2026-03-19",
  tags: ["security", "clickjacking", "x-frame-options", "csp", "frame-ancestors", "frontend", "web-security"],
  relatedTopics: ["content-security-policy", "secure-cookie-attributes", "authentication-patterns"],
};

export default function ClickjackingPreventionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Clickjacking</strong> (also known as &quot;UI redressing&quot;) is an attack where an
          attacker tricks a user into clicking on something different from what the user perceives they
          are clicking on. The attacker achieves this by loading the target website in a hidden or
          transparent iframe, overlaid with a decoy interface that appears legitimate to the user.
        </p>
        <p>
          <strong>How clickjacking works:</strong>
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Attacker creates malicious page:</strong> Page with decoy interface (e.g., &quot;Click
            to win a prize!&quot;)
          </li>
          <li>
            <strong>Target site loaded in iframe:</strong> Attacker loads victim&apos;s site (e.g., bank,
            social media) in a transparent iframe positioned over the decoy
          </li>
          <li>
            <strong>User clicks decoy:</strong> User thinks they&apos;re clicking the decoy button
          </li>
          <li>
            <strong>Click goes to target site:</strong> The click actually goes to the hidden iframe,
            performing an action on the target site (e.g., transferring money, liking a post, changing
            settings)
          </li>
        </ol>
        <p>
          Clickjacking was first publicly demonstrated in 2008 by Robert Hansen and Jeremiah Grossman.
          It exploits the fundamental web capability of embedding content in frames—a feature essential
          for many legitimate use cases (embedded videos, maps, widgets) but dangerous when misused.
        </p>
        <p>
          <strong>Why clickjacking matters for staff/principal engineers:</strong> As a technical leader,
          you&apos;re responsible for protecting users from UI-level attacks. Clickjacking can lead to
          unauthorized actions, data theft, privilege escalation, and reputation damage. Understanding
          clickjacking enables you to implement appropriate defenses (X-Frame-Options, CSP frame-ancestors)
          and make informed decisions about when framing should be allowed.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Clickjacking Exploits User Trust</h3>
          <p>
            Clickjacking doesn&apos;t exploit technical vulnerabilities—it exploits the user&apos;s trust
            in what they see on screen. The user willingly clicks, but they&apos;re clicking in the wrong
            context. Defense requires preventing your site from being embedded in untrusted frames.
          </p>
        </div>
      </section>

      <section>
        <h2>Clickjacking Attack Mechanics</h2>
        <p>
          Understanding how clickjacking attacks work is essential for implementing effective defenses.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Basic Clickjacking Attack</h3>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/clickjacking-attack-diagram.svg"
          alt="Clickjacking Attack Diagram showing decoy page with hidden iframe overlaid"
          caption="Clickjacking Attack: Attacker overlays transparent iframe of target site over decoy button. User clicks decoy, click goes to hidden iframe."
        />

        <p>
          An attacker creates a malicious page with a decoy button styled to appear clickable (fixed position, green background, white text, large padding) and a hidden iframe positioned exactly over the decoy (same top/left coordinates, nearly invisible with 0.01 opacity, higher z-index). The page displays "Click to Win!" but when the user clicks, the click goes to the hidden iframe which loads the target site (like a bank transfer page).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Clickjacking Attack Variants</h3>

        <h4 className="mt-4 mb-2 font-semibold">Likejacking</h4>
        <p>
          Tricking users into liking/following content on social media without their knowledge. The user thinks they're closing a popup but is actually clicking "Like" on a hidden Facebook page. Real-world impact includes artificial engagement inflation, spam distribution, and reputation manipulation.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Cursorjacking</h4>
        <p>
          Manipulating the perceived cursor position to trick users into clicking different locations. A fake cursor is shown while the real cursor is offset, so when the user clicks where the fake cursor appears to be, the real cursor clicks elsewhere on a hidden iframe. Real-world impact includes downloading malware, granting permissions, and enabling webcam/microphone.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Filejacking</h4>
        <p>
          Tricking users into granting file system access, then exfiltrating files. The user clicks "Upload" on a decoy site but is actually clicking a file picker on a hidden site, giving the attacker access to selected files. Real-world impact includes document theft, credential harvesting, and corporate espionage.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Password Manager Attacks</h4>
        <p>
          Tricking password managers into auto-filling credentials on attacker's domain. An invisible iframe is positioned over a login form, causing the password manager to auto-fill credentials in the hidden iframe, which the attacker then captures. Real-world impact includes credential theft, account takeover, and identity theft.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What Makes a Site Vulnerable</h3>
        <ul className="space-y-2">
          <li>
            <strong>No framing restrictions:</strong> Site doesn&apos;t set X-Frame-Options or
            frame-ancestors CSP
          </li>
          <li>
            <strong>State-changing actions via GET:</strong> Actions performed via GET requests can be
            triggered by iframe src
          </li>
          <li>
            <strong>Persistent authentication:</strong> User stays logged in, iframe inherits session
          </li>
          <li>
            <strong>No re-authentication for sensitive actions:</strong> Critical actions don&apos;t
            require password confirmation
          </li>
        </ul>
      </section>

      <section>
        <h2>Prevention: X-Frame-Options Header</h2>
        <p>
          X-Frame-Options is an HTTP response header that controls whether a page can be displayed in a
          frame. It&apos;s the original clickjacking defense, supported by all major browsers.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">X-Frame-Options Directives</h3>

        <h4 className="mt-4 mb-2 font-semibold">DENY</h4>
        <p>
          The page cannot be displayed in any frame. Use case includes pages that should never be framed such as login pages, transaction confirmation pages, admin panels, and most modern web apps.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">SAMEORIGIN</h4>
        <p>
          Page can only be displayed in frames from the same origin. Use case includes sites with internal framing needs like legacy apps with frame-based navigation, sites with internal widget embedding, and intranet applications.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">ALLOW-FROM (Deprecated)</h4>
        <p>
          Page can be displayed in frames from specified origin. <strong>Deprecated</strong>—not supported in modern browsers (Chrome, Safari). Use CSP frame-ancestors instead. For example, <code className="text-sm">X-Frame-Options: ALLOW-FROM https://trusted-partner.com</code> is deprecated; use <code className="text-sm">Content-Security-Policy: frame-ancestors https://trusted-partner.com</code> instead.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Setting X-Frame-Options</h3>
        <p>
          Set X-Frame-Options header on your server: Apache uses <code className="text-sm">Header always set X-Frame-Options "DENY"</code>, Nginx uses <code className="text-sm">add_header X-Frame-Options "SAMEORIGIN" always</code>, Express.js uses middleware to set <code className="text-sm">X-Frame-Options</code> to DENY, Node.js native http module uses <code className="text-sm">res.setHeader('X-Frame-Options', 'DENY')</code>, PHP uses <code className="text-sm">header('X-Frame-Options: DENY')</code>, and ASP.NET configures it in web.config under system.webServer/httpProtocol/customHeaders.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">X-Frame-Options Limitations</h3>
        <ul className="space-y-2">
          <li>
            <strong>Deprecated ALLOW-FROM:</strong> Can&apos;t specify multiple allowed origins
          </li>
          <li>
            <strong>No granular control:</strong> All-or-nothing approach (DENY or SAMEORIGIN)
          </li>
          <li>
            <strong>Being superseded by CSP:</strong> frame-ancestors is more flexible and is the
            recommended approach
          </li>
          <li>
            <strong>Still widely supported:</strong> Good fallback for older browsers that don&apos;t
            support CSP
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Use Both X-Frame-Options and CSP</h3>
          <p>
            X-Frame-Options is deprecated but widely supported. CSP frame-ancestors is modern and flexible.
            Use both for defense in depth: CSP for modern browsers, X-Frame-Options as fallback for older
            browsers.
          </p>
        </div>
      </section>

      <section>
        <h2>Prevention: CSP frame-ancestors Directive</h2>
        <p>
          The <code className="text-sm">frame-ancestors</code> directive in Content Security Policy is the
          modern replacement for X-Frame-Options. It provides more granular control over which origins can
          embed your pages.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">frame-ancestors Syntax</h3>
        <p>
          The frame-ancestors directive supports several values: <code className="text-sm">frame-ancestors 'none'</code> blocks all framing, <code className="text-sm">frame-ancestors 'self'</code> allows same origin only, <code className="text-sm">frame-ancestors https://trusted-partner.com</code> allows a specific origin, <code className="text-sm">frame-ancestors 'self' https://partner1.com https://partner2.com</code> allows multiple origins, and <code className="text-sm">frame-ancestors *</code> allows any origin (NOT recommended as it defeats the protection).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">frame-ancestors vs X-Frame-Options</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Feature</th>
              <th className="p-3 text-left">X-Frame-Options</th>
              <th className="p-3 text-left">CSP frame-ancestors</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Multiple origins</strong></td>
              <td className="p-3">✗ No (ALLOW-FROM deprecated)</td>
              <td className="p-3">✓ Yes</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Wildcard support</strong></td>
              <td className="p-3">✗ No</td>
              <td className="p-3">✓ Yes (https://*.example.com)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Browser support</strong></td>
              <td className="p-3">IE8+, all modern</td>
              <td className="p-3">Chrome 39+, Firefox 50+, Safari 12.1+</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Standardization</strong></td>
              <td className="p-3">Deprecated (RFC 7034)</td>
              <td className="p-3">W3C Recommendation (CSP Level 2)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Recommendation</strong></td>
              <td className="p-3">Use as fallback</td>
              <td className="p-3">Primary defense</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Setting CSP frame-ancestors</h3>
        <p>
          Set CSP frame-ancestors header on your server: Nginx uses <code className="text-sm">add_header Content-Security-Policy "frame-ancestors 'self' https://trusted-partner.com" always</code>, Apache uses <code className="text-sm">Header set Content-Security-Policy "frame-ancestors 'self' https://trusted-partner.com"</code>, Express.js uses middleware to set the header with <code className="text-sm">frame-ancestors 'self'</code>, and it can be combined with other CSP directives like default-src and script-src.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/frame-ancestors-protection.svg"
          alt="CSP frame-ancestors Protection showing allowed vs blocked framing attempts"
          caption="frame-ancestors Protection: Browser checks if framing origin is in allowed list. Blocks if not allowed."
        />
      </section>

      <section>
        <h2>Additional Defense: Frame Busting</h2>
        <p>
          Frame busting (or &quot;frame killing&quot;) uses JavaScript to prevent a page from being framed.
          While not as reliable as HTTP headers, it provides defense in depth.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/clickjacking-prevention.svg"
          alt="Clickjacking Prevention Techniques showing X-Frame-Options, CSP frame-ancestors, and JavaScript Frame Busting with defense layers"
          caption="Clickjacking Prevention: Use CSP frame-ancestors as primary, X-Frame-Options as fallback, frame busting as client-side backup."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">JavaScript Frame Busting</h3>
        <p>
          Basic frame busting checks if <code className="text-sm">window.top !== window.self</code> and redirects to <code className="text-sm">window.self.location</code>. A more robust approach handles multiple frame levels with a try-catch block that clears the body and shows an alert if it can't access the top window (cross-origin). Modern approach combines frame busting with CSP frame-ancestors for best protection.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Limitations of Frame Busting</h3>
        <ul className="space-y-2">
          <li>
            <strong>Can be bypassed:</strong> Attackers can use sandbox attributes, disable JavaScript,
            or use proxy pages
          </li>
          <li>
            <strong>Breaks legitimate framing:</strong> If you need to allow framing from trusted origins,
            frame busting prevents it
          </li>
          <li>
            <strong>Not a replacement for headers:</strong> Always use X-Frame-Options or CSP
            frame-ancestors as primary defense
          </li>
          <li>
            <strong>Defense in depth only:</strong> Use frame busting as additional layer, not sole
            protection
          </li>
        </ul>
      </section>

      <section>
        <h2>Secure Framing Patterns</h2>
        <p>
          Sometimes you need to allow legitimate framing (embedded widgets, partner integrations). Here&apos;s
          how to do it securely.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Allowlisting Trusted Origins</h3>
        <p>
          Use CSP to allow specific partners with <code className="text-sm">frame-ancestors 'self' https://partner1.com https://partner2.com https://embed.trusted-site.com</code>. Additionally verify the framing origin server-side by checking the Origin header against an allowlist of trusted origins and returning 403 Forbidden if the origin is not allowed.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">PostMessage Communication</h3>
        <p>
          For legitimate cross-origin iframe communication, use postMessage instead of allowing unrestricted framing. The parent page creates an iframe with sandbox attributes (<code className="text-sm">allow-scripts allow-same-origin</code>), sends messages using <code className="text-sm">postMessage()</code> with the target origin, and the iframe receives messages via <code className="text-sm">message</code> event listener, verifying the event origin matches the trusted partner before processing.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sandbox Attribute</h3>
        <p>
          When you must embed untrusted content, use the sandbox attribute to restrict iframe capabilities. A restrictive sandbox (<code className="text-sm">sandbox</code> with no values) allows nothing. Selective permissions like <code className="text-sm">sandbox="allow-scripts allow-same-origin"</code> allow scripts and same-origin access. Avoid <code className="text-sm">allow-top-navigation</code> as it allows the iframe to navigate the parent page.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Default Deny Framing</h3>
        <ul className="space-y-2">
          <li>
            <strong>Start with DENY:</strong> Default to <code className="text-sm">X-Frame-Options: DENY</code>
            and <code className="text-sm">frame-ancestors 'none'</code>
          </li>
          <li>
            <strong>Allow selectively:</strong> Only allow framing where there&apos;s a specific business
            requirement
          </li>
          <li>
            <strong>Document exceptions:</strong> Keep a list of pages that allow framing and why
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer Defenses</h3>
        <ul className="space-y-2">
          <li>
            <strong>Use both headers:</strong> CSP frame-ancestors + X-Frame-Options for maximum browser
            coverage
          </li>
          <li>
            <strong>Add frame busting:</strong> JavaScript defense as additional layer
          </li>
          <li>
            <strong>Verify server-side:</strong> Check Origin/Referer headers for sensitive operations
          </li>
          <li>
            <strong>Re-authenticate:</strong> Require password confirmation for sensitive actions
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Secure Application Design</h3>
        <ul className="space-y-2">
          <li>
            <strong>Use POST for state changes:</strong> Don&apos;t perform actions via GET requests
          </li>
          <li>
            <strong>CSRF tokens:</strong> Always use CSRF protection (also helps against clickjacking)
          </li>
          <li>
            <strong>SameSite cookies:</strong> Use <code className="text-sm">SameSite=Lax</code> or
            <code className="text-sm">Strict</code> to limit cookie sending in cross-origin frames
          </li>
          <li>
            <strong>Session timeouts:</strong> Short session durations reduce clickjacking window
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing</h3>
        <ul className="space-y-2">
          <li>
            <strong>Test framing:</strong> Try to load your pages in iframes from different origins
          </li>
          <li>
            <strong>Verify headers:</strong> Use browser dev tools to confirm X-Frame-Options and CSP
            are set
          </li>
          <li>
            <strong>Security scanners:</strong> Use OWASP ZAP, Burp Suite to detect clickjacking
            vulnerabilities
          </li>
          <li>
            <strong>Manual testing:</strong> Create test pages that attempt to frame your site
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Defense in Depth</h3>
          <p>
            No single clickjacking defense is perfect. Combine CSP frame-ancestors, X-Frame-Options, CSRF
            tokens, SameSite cookies, and secure application design. Each layer provides protection if
            others fail.
          </p>
        </div>
      </section>

      <section>
        <h2>Architecture at Scale: Clickjacking Defense in Enterprise Systems</h2>
        <p>
          Enterprise-scale clickjacking defense requires coordinated header management, consistent framing policies, and centralized monitoring across multiple applications, business units, and geographic regions. In microservices architectures, each service must enforce framing protection consistently.
        </p>
        <p>
          <strong>Centralized Header Management:</strong> Implement header injection at the API gateway or load balancer level. Use infrastructure-as-code (Terraform, CloudFormation) to enforce X-Frame-Options and CSP frame-ancestors consistently across all services. Document framing policies in security standards.
        </p>
        <p>
          <strong>Multi-Tenant Framing Policies:</strong> For SaaS applications with embedded widgets, implement tenant-specific framing allowlists. Use CSP frame-ancestors with tenant-specific origins. Implement framing policy management UI for tenant administrators. Document multi-tenant framing architecture.
        </p>
        <p>
          <strong>CDN Integration:</strong> Configure CDN (Cloudflare, AWS CloudFront, Fastly) to inject clickjacking headers at the edge. Use CDN Workers or Lambda@Edge to dynamically set frame-ancestors based on request context. Implement header stripping for legacy browser compatibility. Document CDN header configuration.
        </p>
        <p>
          <strong>Third-Party Integration:</strong> For legitimate third-party embedding (partners, integrations), implement secure embedding protocols. Use postMessage for cross-origin communication. Implement embedding request workflow with security review. Document third-party embedding guidelines.
        </p>
      </section>

      <section>
        <h2>Testing Strategies: Clickjacking Validation</h2>
        <p>
          Comprehensive clickjacking testing requires automated scanning, manual verification, and penetration testing integrated into security operations.
        </p>
        <p>
          <strong>Automated Header Scanning:</strong> Use OWASP ZAP, Burp Suite, or custom scripts to verify X-Frame-Options and CSP frame-ancestors headers. Configure CI/CD pipelines to scan headers after each deployment. Set up automated alerts for: missing X-Frame-Options, missing frame-ancestors, overly permissive framing policies.
        </p>
        <p>
          <strong>Framing Tests:</strong> Test framing protection: (1) Attempt to load pages in cross-origin iframes, (2) Verify pages are blocked or rendered unusable, (3) Test with different SameSite cookie values, (4) Test frame busting JavaScript effectiveness. Use tools like Burp Intruder for automated framing tests.
        </p>
        <p>
          <strong>Cursorjacking Tests:</strong> Test for cursorjacking vulnerabilities: (1) Check for custom cursor implementations, (2) Verify click handlers match visual elements, (3) Test for hidden clickable elements. Document cursorjacking test results.
        </p>
        <p>
          <strong>Penetration Testing:</strong> Include clickjacking in quarterly penetration tests. Specific test cases: (1) Classic clickjacking with transparent iframe, (2) Likejacking attacks, (3) Cursorjacking attacks, (4) Filejacking attacks, (5) Password manager auto-fill attacks. Require remediation of all clickjacking findings before production deployment.
        </p>
      </section>

      <section>
        <h2>Compliance and Legal Context</h2>
        <p>
          Clickjacking prevention has significant compliance implications, particularly for applications handling financial transactions, healthcare data, or operating in regulated industries.
        </p>
        <p>
          <strong>PCI-DSS Requirements:</strong> PCI-DSS Requirement 6.5.9 requires protection against clickjacking for payment pages. Implement X-Frame-Options or CSP frame-ancestors for all payment-related pages. Document clickjacking controls in ROC (Report on Compliance). Annual penetration testing must include clickjacking testing.
        </p>
        <p>
          <strong>HIPAA Requirements:</strong> HIPAA Security Rule 45 CFR 164.312(a)(1) requires access controls to prevent unauthorized access. Clickjacking can lead to unauthorized actions on ePHI. Document clickjacking prevention in security policies. Implement audit logging for actions that could be clickjacking targets.
        </p>
        <p>
          <strong>GDPR Implications:</strong> GDPR Article 32 requires appropriate security for personal data protection. Clickjacking that leads to unauthorized data access or modification violates GDPR. Document clickjacking prevention measures as part of security of processing.
        </p>
        <p>
          <strong>SOC 2 Controls:</strong> Clickjacking prevention maps to SOC 2 Common Criteria CC6.1 (logical access controls). Document clickjacking policies, header configuration, and testing for annual SOC 2 audits. Track clickjacking-related security incidents.
        </p>
        <p>
          <strong>Industry Regulations:</strong> FFIEC requires clickjacking protection for online banking. PSD2 requires strong customer authentication which includes clickjacking prevention. Document compliance with applicable industry regulations.
        </p>
      </section>

      <section>
        <h2>Performance Trade-offs: Security vs. User Experience</h2>
        <p>
          Clickjacking prevention measures introduce minimal performance overhead but may impact legitimate use cases.
        </p>
        <p>
          <strong>Header Overhead:</strong> X-Frame-Options and CSP headers add negligible overhead (less than 100 bytes per response). No measurable latency impact. Include headers in all responses, not just HTML (protects against MIME-type confusion attacks).
        </p>
        <p>
          <strong>Frame Busting JavaScript:</strong> JavaScript frame busting adds minimal overhead (less than 1ms). However, it can interfere with legitimate framing scenarios. Test frame busting thoroughly before deployment. Consider user-agent detection to disable frame busting for known-good embedders.
        </p>
        <p>
          <strong>Legitimate Embedding Impact:</strong> Strict framing policies block legitimate embedding (partner integrations, embedded widgets). Implement allowlisting for trusted origins. Use CSP frame-ancestors with specific origins instead of wildcard. Document legitimate embedding requirements.
        </p>
        <p>
          <strong>CSRF Token Overhead:</strong> CSRF tokens add minimal overhead (token generation less than 1ms, validation less than 5ms). Use stateless CSRF tokens (HMAC-based) to eliminate server-side storage. Cache CSRF tokens per session. Monitor CSRF validation latency.
        </p>
        <p>
          <strong>SameSite Cookie Impact:</strong> SameSite cookies have zero performance impact (browser-enforced). However, SameSite=Strict breaks legitimate cross-origin flows (SSO, payment gateways). Test cross-origin flows thoroughly. Use SameSite=Lax as default with Strict for high-risk operations.
        </p>
      </section>

      <section>
        <h2>Browser and Platform Compatibility</h2>
        <p>
          Clickjacking protection support varies across browsers, requiring careful compatibility planning.
        </p>
        <p>
          <strong>X-Frame-Options Support:</strong> Supported in all modern browsers (IE8+, all current versions). Deprecated but still enforced. Chrome 91+ shows deprecation warnings but continues to enforce. Use as fallback for older browsers.
        </p>
        <p>
          <strong>CSP frame-ancestors Support:</strong> Supported in Chrome 39+, Firefox 50+, Safari 12.1+, Edge 79+. Not supported in IE11. Use both X-Frame-Options and CSP for maximum coverage. Test frame-ancestors across target browsers.
        </p>
        <p>
          <strong>Sandbox Attribute Support:</strong> Supported in all modern browsers (IE10+, all current versions). Some older mobile browsers have partial sandbox support. Test sandbox effectiveness using browser DevTools. Document sandbox support in browser compatibility matrix.
        </p>
        <p>
          <strong>Mobile Browser Considerations:</strong> Mobile Chrome/Firefox match desktop support. iOS Safari has full support. Some older Android browsers have partial support. Test clickjacking protection on actual mobile devices.
        </p>
        <p>
          <strong>WebView Considerations:</strong> iOS WKWebView and Android WebView have separate framing behavior. Some apps intentionally embed web content in WebViews. Test clickjacking protection in actual app WebViews. Consider user-agent detection for WebView-specific policies.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Banking Application:</strong> X-Frame-Options: DENY on all pages. CSP frame-ancestors 'none'. SameSite=Strict on session cookies. CSRF tokens on all transactions. Re-authentication for transfers. No legitimate embedding needed—maximum protection.
          </li>
          <li>
            <strong>Social Media Platform:</strong> X-Frame-Options: SAMEORIGIN. CSP frame-ancestors 'self' for most pages. Allow specific partners for embedded posts (Twitter cards, Facebook posts). postMessage for cross-origin widget communication. Likejacking prevention critical.
          </li>
          <li>
            <strong>E-Commerce Platform:</strong> X-Frame-Options: DENY on checkout pages. CSP frame-ancestors 'self' for product pages. Allow payment processor embedding (Stripe, PayPal) via specific origins. CSRF tokens on cart modifications. Clickjacking prevention for "Buy Now" buttons.
          </li>
          <li>
            <strong>Enterprise SaaS:</strong> X-Frame-Options: SAMEORIGIN. CSP frame-ancestors with customer domains for embedded widgets. Tenant-specific framing allowlists. postMessage for secure cross-origin communication. Customer-controlled embedding settings.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No framing protection:</strong> Not setting X-Frame-Options or frame-ancestors leaves
            site vulnerable.
          </li>
          <li>
            <strong>Using ALLOW-FROM:</strong> Deprecated and not supported in modern browsers. Use CSP
            frame-ancestors instead.
          </li>
          <li>
            <strong>Relying only on frame busting:</strong> JavaScript can be bypassed. Always use HTTP
            headers as primary defense.
          </li>
          <li>
            <strong>Allowing wildcard framing:</strong> <code className="text-sm">frame-ancestors *</code>
            defeats the purpose. Only allow specific trusted origins.
          </li>
          <li>
            <strong>GET requests for state changes:</strong> Actions like transfers, deletes via GET can
            be triggered by iframe src.
          </li>
          <li>
            <strong>No CSRF protection:</strong> CSRF tokens provide additional protection against
            clickjacking-induced actions.
          </li>
          <li>
            <strong>Long session durations:</strong> Persistent sessions increase clickjacking attack
            window.
          </li>
          <li>
            <strong>Inconsistent headers:</strong> Setting headers on some pages but not others creates
            gaps in protection.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions and Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: What is clickjacking and how does it work?</p>
            <p className="mt-2 text-sm">
              A: Clickjacking is an attack where users are tricked into clicking on something different from
              what they perceive. Attacker loads target site in a transparent iframe overlaid with a decoy
              interface. User clicks decoy, but click goes to hidden iframe, performing unintended actions
              (transferring money, liking posts, changing settings). Defense: X-Frame-Options, CSP
              frame-ancestors.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: What&apos;s the difference between X-Frame-Options and CSP frame-ancestors?</p>
            <p className="mt-2 text-sm">
              A: <strong>X-Frame-Options</strong> is older, simpler (DENY, SAMEORIGIN, or deprecated ALLOW-FROM).
              <strong>CSP frame-ancestors</strong> is modern, more flexible (multiple origins, wildcards).
              X-Frame-Options is deprecated but widely supported. CSP frame-ancestors is the recommended
              approach. Use both for defense in depth: CSP for modern browsers, X-Frame-Options as fallback.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: How would you protect a site from clickjacking?</p>
            <p className="mt-2 text-sm">
              A: Layered approach: (1) Set <code className="text-sm">X-Frame-Options: DENY</code> header.
              (2) Set CSP <code className="text-sm">frame-ancestors 'none'</code> (or allow specific origins).
              (3) Use SameSite cookies to limit cookie sending in frames. (4) Implement CSRF tokens for
              state-changing actions. (5) Require re-authentication for sensitive operations. (6) Use POST
              (not GET) for state changes. (7) Optional: JavaScript frame busting as additional layer.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: When might you need to allow framing, and how do you do it securely?</p>
            <p className="mt-2 text-sm">
              A: Legitimate framing needs: embedded widgets, partner integrations, internal dashboards. Secure
              approach: (1) Use CSP <code className="text-sm">frame-ancestors</code> with specific allowed
              origins (not wildcard). (2) Verify Origin header server-side. (3) Use postMessage for
              cross-origin communication. (4) Apply sandbox attribute to embedded content. (5) Limit what
              framed pages can do (read-only, no state changes).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: Why is frame busting not sufficient on its own?</p>
            <p className="mt-2 text-sm">
              A: JavaScript frame busting can be bypassed: attackers can use sandbox attributes to disable
              scripts, use proxy pages, or modify the JavaScript. It&apos;s client-side code that attackers
              control once they&apos;ve framed the page. HTTP headers (X-Frame-Options, CSP) are enforced by
              the browser before the page loads—much more reliable. Use frame busting only as defense in
              depth, never as sole protection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: How does SameSite cookies help prevent clickjacking?</p>
            <p className="mt-2 text-sm">
              A: <code className="text-sm">SameSite=Lax</code> or <code className="text-sm">Strict</code>
              prevents cookies from being sent with cross-origin requests, including requests from iframes.
              If the user&apos;s session cookie isn&apos;t sent in the framed request, the framed page loads
              unauthenticated, making clickjacking ineffective. However, SameSite alone isn&apos;t sufficient—use
              with X-Frame-Options and CSP for comprehensive protection.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References and Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://owasp.org/www-community/attacks/Clickjacking" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Clickjacking Documentation
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Clickjacking Defense Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs: X-Frame-Options
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs: CSP frame-ancestors
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/TR/html52/browsers.html#the-iframe-element" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              HTML5.2 Specification: iframe sandbox
            </a>
          </li>
          <li>
            <a href="https://portswigger.net/web-security/clickjacking" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PortSwigger: Clickjacking Vulnerabilities
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
