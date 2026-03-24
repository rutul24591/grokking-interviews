"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-security-sri-extensive",
  title: "Subresource Integrity (SRI)",
  description: "Comprehensive guide to Subresource Integrity (SRI), hash-based resource verification, CDN security, and implementation strategies for staff/principal engineer interviews.",
  category: "frontend",
  subcategory: "security",
  slug: "subresource-integrity",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-19",
  tags: ["security", "sri", "subresource-integrity", "frontend", "web-security", "cdn", "integrity-check"],
  relatedTopics: ["content-security-policy", "xss-prevention", "https-tls"],
};

export default function SubresourceIntegrityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Subresource Integrity (SRI)</strong> is a security feature that enables browsers to verify
          that resources they fetch (typically from CDNs) are delivered without unexpected manipulation. It
          works by allowing you to provide a cryptographic hash that a fetched resource must match.
        </p>
        <p>
          SRI addresses a critical security concern: when you load JavaScript or CSS from third-party CDNs,
          you&apos;re trusting that the CDN won&apos;t serve malicious content. If the CDN is compromised,
          attacked, or misconfigured, your users could receive malicious scripts. SRI provides a safety net
          by ensuring the resource matches what you expect.
        </p>
        <p>
          <strong>How SRI works:</strong>
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Generate hash:</strong> Create a cryptographic hash (SHA-256, SHA-384, or SHA-512) of the
            resource file
          </li>
          <li>
            <strong>Add to HTML:</strong> Include the hash in the <code className="text-sm">integrity</code>
            attribute of <code className="text-sm">&lt;script&gt;</code> or <code className="text-sm">&lt;link&gt;</code>
            tags
          </li>
          <li>
            <strong>Browser verification:</strong> When the browser fetches the resource, it computes the hash
            and compares it to the provided value
          </li>
          <li>
            <strong>Block on mismatch:</strong> If hashes don&apos;t match, the browser blocks the resource
            from loading
          </li>
        </ol>
        <p>
          SRI is defined in the W3C Subresource Integrity specification and is supported by all modern browsers
          (Chrome 45+, Firefox 43+, Safari 15+, Edge 79+). It&apos;s recommended by OWASP and security best
          practices for any application loading third-party resources.
        </p>
        <p>
          <strong>Why SRI matters for staff/principal engineers:</strong> As a technical leader, you&apos;re
          responsible for supply chain security. Third-party script compromises (Magecart attacks, CDN
          hijacking) are increasingly common. SRI provides defense-in-depth against these attacks. Understanding
          SRI enables you to make informed decisions about CDN usage, build pipeline integration, and security
          hardening.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: SRI Is Supply Chain Security</h3>
          <p>
            SRI protects against compromised or manipulated third-party resources. It&apos;s a critical component
            of web supply chain security, ensuring that the JavaScript and CSS you load is exactly what you
            expect—not a tampered version.
          </p>
        </div>
      </section>

      <section>
        <h2>SRI Implementation</h2>
        <p>
          Implementing SRI requires generating hashes for your resources and including them in your HTML.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Basic SRI Syntax</h3>
        <p>
          Scripts and stylesheets include the <code className="text-sm">integrity</code> attribute with a hash value and <code className="text-sm">crossorigin="anonymous"</code>. For example, a script tag might have <code className="text-sm">integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"</code>. Multiple hash algorithms can be specified space-separated (sha256, sha384, sha512) and the browser uses the strongest supported.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SRI Attribute Format</h3>
        <p>
          The integrity attribute format is <code className="text-sm">integrity="sha384-hash"</code>. Supported algorithms include <code className="text-sm">sha256-</code> (32 bytes, 256 bits), <code className="text-sm">sha384-</code> (48 bytes, 384 bits, recommended), and <code className="text-sm">sha512-</code> (64 bytes, 512 bits). Multiple hashes can be space-separated and the browser uses the strongest algorithm it supports.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Crossorigin Attribute</h3>
        <p>
          The <code className="text-sm">crossorigin</code> attribute is required for SRI when loading cross-origin resources. Use <code className="text-sm">crossorigin="anonymous"</code> to send no credentials (most common) or <code className="text-sm">crossorigin="use-credentials"</code> to send credentials (cookies, auth).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/sri-verification-flow.svg"
          alt="SRI Verification Flow showing browser fetching resource, computing hash, comparing with integrity attribute"
          caption="SRI Verification: Browser fetches resource, computes hash, compares with integrity attribute. Blocks if mismatch."
        />
      </section>

      <section>
        <h2>Generating SRI Hashes</h2>
        <p>
          You need to generate cryptographic hashes for your resources. There are several approaches.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/sri-workflow.svg"
          alt="Subresource Integrity Workflow showing Build Process, CDN, Browser Verification, and Outcomes"
          caption="SRI Workflow: Build generates hash, CDN serves resource, browser verifies hash, allows or blocks based on match."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Online Tools</h3>
        <p>
          Online tools like SRIGen (srihash.org) allow you to paste your resource URL or content and get the integrity attribute back. For example, a script tag with integrity <code className="text-sm">sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC</code> and <code className="text-sm">crossorigin="anonymous"</code>. <strong>Warning:</strong> Only use online tools for public resources. Never paste private or sensitive code into online generators.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Command Line (OpenSSL)</h3>
        <p>
          Generate SHA-384 hash using <code className="text-sm">cat library.js | openssl dgst -sha384 -binary | openssl base64 -A</code>. The output is a base64-encoded hash like <code className="text-sm">oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC</code>. The full integrity attribute is <code className="text-sm">integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"</code>.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Build Tool Integration</h3>
        <p>
          For Webpack, use the webpack-subresource-integrity plugin. Configure <code className="text-sm">crossOriginLoading: 'anonymous'</code> in output settings and add the SubresourceIntegrityPlugin with <code className="text-sm">hashFuncNames: ['sha384']</code> to the plugins array.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CI/CD Pipeline Integration</h3>
        <p>
          In GitHub Actions, loop through dist files and generate hashes using openssl, appending to an sri-manifest.txt file. Then run a script like <code className="text-sm">node scripts/update-sri.js</code> to update HTML with SRI hashes.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Automate Hash Generation</h3>
          <p>
            Manual hash generation is error-prone and doesn&apos;t scale. Integrate SRI hash generation into
            your build pipeline. Update hashes automatically when resources change. Treat SRI like any other
            build artifact.
          </p>
        </div>
      </section>

      <section>
        <h2>SRI Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CDN-Hosted Libraries</h3>
        <p>
          The most common SRI use case is verifying third-party libraries from CDNs. For example, Bootstrap CSS from cdn.jsdelivr.net with integrity <code className="text-sm">sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM</code>, jQuery from code.jquery.com with integrity <code className="text-sm">sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=</code>, or React from unpkg.com (development only).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Analytics and Tracking Scripts</h3>
        <p>
          Analytics scripts have high trust requirements—they run on every page with full access. Google Analytics scripts from googletagmanager.com should include SRI with the appropriate integrity hash and <code className="text-sm">crossorigin="anonymous"</code>. Note: Analytics providers should publish SRI hashes; if they don't, consider hosting analytics scripts yourself.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Third-Party Widgets</h3>
        <p>
          Embedded widgets (chat, payment, social) are common attack vectors. Stripe.js from js.stripe.com and Intercom widgets from widget.intercom.io should include SRI hashes to verify integrity.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Self-Hosted Resources</h3>
        <p>
          SRI can also protect against server compromise or deployment issues for your own resources. Your own bundled JS (like <code className="text-sm">/assets/app.a1b2c3d4.js</code>) can include an integrity hash for additional verification.
        </p>
      </section>

      <section>
        <h2>SRI and CSP</h2>
        <p>
          SRI works alongside Content Security Policy (CSP) to provide layered security.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CSP require-sri-for Directive</h3>
        <p>
          CSP Level 3 introduced <code className="text-sm">require-sri-for</code> directive. Use <code className="text-sm">require-sri-for script</code> to require SRI for scripts, <code className="text-sm">require-sri-for style</code> for styles, or <code className="text-sm">require-sri-for script style</code> for both. The browser blocks scripts/styles without valid SRI even if they're from allowed sources.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Combined Defense</h3>
        <p>
          CSP allows scripts from specific domains (like <code className="text-sm">script-src 'self' https://cdn.example.com</code>), while SRI ensures the script from that domain is the expected version by verifying the integrity hash. This provides defense in depth: CSP restricts WHERE resources can load from, SRI verifies WHAT content is loaded.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/sri-csp-layered-defense.svg"
          alt="SRI and CSP Layered Defense showing how CSP restricts sources and SRI verifies content"
          caption="Layered Defense: CSP restricts WHERE resources can load from. SRI verifies WHAT content is loaded."
        />
      </section>

      <section>
        <h2>Limitations and Considerations</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SRI Doesn&apos;t Protect Against</h3>
        <ul className="space-y-2">
          <li>
            <strong>First-party compromises:</strong> If your server is compromised, attackers can update
            both the resource and the hash
          </li>
          <li>
            <strong>Dynamic resources:</strong> Resources that change frequently (A/B tests, feature flags)
            require hash updates
          </li>
          <li>
            <strong>CORS misconfiguration:</strong> If CDN doesn&apos;t send proper CORS headers, SRI
            verification fails
          </li>
          <li>
            <strong>Browser support gaps:</strong> Older browsers ignore SRI (use CSP as fallback)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Operational Considerations</h3>
        <ul className="space-y-2">
          <li>
            <strong>Hash updates:</strong> When resources change, hashes must be updated. Automate this
            process.
          </li>
          <li>
            <strong>CDN caching:</strong> CDN-cached resources might have different hashes than origin.
            Generate hashes from CDN URLs.
          </li>
          <li>
            <strong>Version pinning:</strong> Pin to specific versions, not floating tags (use
            <code className="text-sm">@5.3.0</code> not <code className="text-sm">@latest</code>)
          </li>
          <li>
            <strong>Fallback strategy:</strong> Have a plan for when SRI blocks resources (monitoring,
            alerts, rollback)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When NOT to Use SRI</h3>
        <ul className="space-y-2">
          <li>
            <strong>Dynamic third-party scripts:</strong> Scripts that change frequently without versioning
          </li>
          <li>
            <strong>Resources requiring authentication:</strong> SRI doesn&apos;t work well with
            authenticated resources
          </li>
          <li>
            <strong>Development environments:</strong> SRI adds overhead; use in production only
          </li>
          <li>
            <strong>Resources you can&apos;t version:</strong> If you can&apos;t pin to specific versions,
            SRI is impractical
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: SRI Is One Layer</h3>
          <p>
            SRI protects against compromised third-party resources, but it&apos;s not a complete security
            solution. Combine SRI with CSP, HTTPS, and secure development practices for comprehensive
            protection.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implementation</h3>
        <ul className="space-y-2">
          <li>
            <strong>Use SHA-384:</strong> Best balance of security and performance (SHA-256 is acceptable,
            SHA-512 is overkill)
          </li>
          <li>
            <strong>Always include crossorigin:</strong> Required for SRI verification
          </li>
          <li>
            <strong>Pin to specific versions:</strong> Never use <code className="text-sm">@latest</code> or
            floating tags
          </li>
          <li>
            <strong>Automate hash generation:</strong> Integrate into build pipeline, don&apos;t generate
            manually
          </li>
          <li>
            <strong>Monitor SRI failures:</strong> Set up alerts for CSP violation reports related to SRI
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CDN Selection</h3>
        <ul className="space-y-2">
          <li>
            <strong>Choose reputable CDNs:</strong> Use well-established providers (jsDelivr, unpkg,
            Cloudflare, AWS CloudFront)
          </li>
          <li>
            <strong>Verify CORS support:</strong> CDN must send proper CORS headers for SRI to work
          </li>
          <li>
            <strong>Check SRI hash availability:</strong> Some providers publish SRI hashes for their
            resources
          </li>
          <li>
            <strong>Consider hosting yourself:</strong> For critical resources, host them yourself with
            full control
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Build Pipeline</h3>
        <ul className="space-y-2">
          <li>
            <strong>Generate hashes at build time:</strong> Don&apos;t generate at runtime or deploy time
          </li>
          <li>
            <strong>Update HTML automatically:</strong> Use build tools to inject integrity attributes
          </li>
          <li>
            <strong>Version your resources:</strong> Use content-based hashing for cache busting
          </li>
          <li>
            <strong>Test SRI in staging:</strong> Verify SRI works before deploying to production
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <ul className="space-y-2">
          <li>
            <strong>Log SRI failures:</strong> Track when resources are blocked due to hash mismatch
          </li>
          <li>
            <strong>Alert on patterns:</strong> Multiple SRI failures might indicate an attack
          </li>
          <li>
            <strong>Use CSP reporting:</strong> Combine SRI with CSP <code className="text-sm">report-uri</code>
            for visibility
          </li>
          <li>
            <strong>Monitor CDN health:</strong> CDN issues can cause SRI failures
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Missing crossorigin attribute:</strong> SRI fails silently without
            <code className="text-sm">crossorigin="anonymous"</code> for cross-origin resources.
          </li>
          <li>
            <strong>Using @latest versions:</strong> Resource changes, hash becomes invalid, breaks your
            site. Always pin versions.
          </li>
          <li>
            <strong>Generating hash from wrong source:</strong> Hash must be generated from the exact bytes
            served by CDN, not your local copy (minification, whitespace differences).
          </li>
          <li>
            <strong>Not updating hashes on deploy:</strong> Build process changes resources, old hashes
            invalid. Automate hash updates.
          </li>
          <li>
            <strong>Ignoring browser support:</strong> Older browsers ignore SRI. Use CSP as fallback
            protection.
          </li>
          <li>
            <strong>Using SRI for dynamic content:</strong> Resources that change (A/B tests, feature flags)
            aren&apos;t suitable for SRI.
          </li>
          <li>
            <strong>Forgetting about CORS:</strong> CDN must send proper CORS headers. Test before deploying.
          </li>
          <li>
            <strong>No monitoring:</strong> SRI failures silently block resources. Set up monitoring and
            alerts.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-Commerce Platform</h3>
        <p>
          <strong>Challenge:</strong> Load payment widgets, analytics, and UI libraries from CDNs while
          preventing Magecart-style attacks.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>SRI for all third-party scripts (payment, analytics, chat)</li>
          <li>CSP with <code className="text-sm">require-sri-for script</code> directive</li>
          <li>Automated hash generation in CI/CD pipeline</li>
          <li>Monitoring for SRI failures with alerts</li>
          <li>Version-pinned CDN resources (no @latest)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SaaS Dashboard</h3>
        <p>
          <strong>Challenge:</strong> Heavy use of CDN-hosted libraries (React, D3, Bootstrap) with security
          requirements.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Webpack plugin for automatic SRI hash generation</li>
          <li>Self-host critical libraries (React, D3) instead of CDN</li>
          <li>SRI for self-hosted bundles (protects against server compromise)</li>
          <li>CSP + SRI layered defense</li>
          <li>Automated testing for SRI in staging environment</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Content Publishing Platform</h3>
        <p>
          <strong>Challenge:</strong> Third-party embeds (ads, social widgets, comments) from multiple
          providers.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>SRI for all first-party and critical third-party scripts</li>
          <li>Sandboxed iframes for untrusted embeds (ads, comments)</li>
          <li>CSP to restrict embed sources</li>
          <li>Subresource Integrity for widget libraries</li>
          <li>Regular audit of third-party scripts</li>
        </ul>
      </section>

      <section>
        <h2>Architecture at Scale: SRI in Enterprise Systems</h2>
        <p>
          Enterprise-scale SRI implementation requires coordinated hash management, consistent integrity policies, and centralized monitoring across multiple applications, build pipelines, and CDN configurations. In microservices architectures, each service must implement SRI consistently for all external resources.
        </p>
        <p>
          <strong>Centralized Hash Management:</strong> Implement a centralized SRI hash registry that tracks all resource hashes across applications. Use infrastructure-as-code to manage SRI attributes consistently across all services. Document SRI policies in security standards.
        </p>
        <p>
          <strong>Build Pipeline Integration:</strong> Integrate SRI hash generation into CI/CD pipelines. Use webpack-subresource-integrity or vite-plugin-sri for automatic hash generation. Implement hash verification as part of build process. Document SRI build configuration.
        </p>
        <p>
          <strong>CDN Integration:</strong> Configure CDN (Cloudflare, AWS CloudFront, Fastly) to serve resources with proper CORS headers for SRI verification. Implement CDN cache invalidation that updates SRI hashes. Document CDN SRI configuration.
        </p>
        <p>
          <strong>Multi-Environment Strategy:</strong> Use environment-specific SRI hashes for staging vs production. Implement SRI hash rotation for security updates. Document SRI deployment procedures.
        </p>
      </section>

      <section>
        <h2>Testing Strategies: SRI Validation</h2>
        <p>
          Comprehensive SRI testing requires automated validation, manual verification, and penetration testing integrated into security operations.
        </p>
        <p>
          <strong>Automated Hash Verification:</strong> Use build tools to verify SRI hashes match resource content. Configure CI/CD pipelines to fail builds on hash mismatches. Set up automated alerts for: missing integrity attributes, hash mismatches, CORS configuration issues.
        </p>
        <p>
          <strong>Browser Testing:</strong> Test SRI enforcement across browsers: (1) Verify resources load with correct hashes, (2) Verify resources are blocked with incorrect hashes, (3) Test fallback behavior for unsupported browsers. Use BrowserStack for cross-browser testing.
        </p>
        <p>
          <strong>CDN Testing:</strong> Test SRI with CDN: (1) Verify CORS headers are set correctly, (2) Test cache invalidation updates hashes, (3) Test CDN failover with SRI. Document CDN SRI test results.
        </p>
        <p>
          <strong>Penetration Testing:</strong> Include SRI in quarterly penetration tests. Specific test cases: (1) Resource manipulation attacks, (2) CDN compromise simulation, (3) Hash collision attempts, (4) CORS bypass attempts. Require remediation of all SRI-related findings before production deployment.
        </p>
      </section>

      <section>
        <h2>Compliance and Legal Context</h2>
        <p>
          SRI implementation has significant compliance implications, particularly for applications handling financial transactions, healthcare data, or operating in regulated industries.
        </p>
        <p>
          <strong>PCI-DSS Requirements:</strong> PCI-DSS Requirement 6.4.3 recommends integrity verification for third-party scripts. SRI demonstrates due diligence in supply chain security. Document SRI implementation in ROC (Report on Compliance).
        </p>
        <p>
          <strong>HIPAA Requirements:</strong> HIPAA Security Rule 45 CFR 164.312(c)(1) requires integrity controls for ePHI. SRI helps ensure third-party scripts don&apos;t compromise data integrity. Document SRI as part of integrity controls.
        </p>
        <p>
          <strong>GDPR Implications:</strong> GDPR Article 32 requires appropriate security for personal data protection. SRI helps prevent unauthorized script injection that could exfiltrate personal data. Document SRI measures as part of security of processing.
        </p>
        <p>
          <strong>SOC 2 Controls:</strong> SRI implementation maps to SOC 2 Common Criteria CC6.1 (logical access controls). Document SRI policies, hash management procedures, and monitoring for annual SOC 2 audits.
        </p>
        <p>
          <strong>Supply Chain Security:</strong> Executive Order 14028 (US) requires software supply chain security measures. SRI is a key control for web application supply chain security. Document SRI as part of supply chain security program.
        </p>
      </section>

      <section>
        <h2>Performance Trade-offs: Security vs. Latency</h2>
        <p>
          SRI implementation introduces minimal performance overhead but requires careful hash management.
        </p>
        <p>
          <strong>Hash Verification Overhead:</strong> Browser hash verification adds 5-20ms per resource depending on size. This is negligible compared to network latency. Use build-time hash generation to avoid runtime overhead.
        </p>
        <p>
          <strong>CORS Preflight:</strong> Cross-origin resources with SRI may trigger CORS preflight (OPTIONS) requests. This adds 100-500ms round-trip latency. Use same-origin resources where possible. Implement CORS preflight caching (Access-Control-Max-Age).
        </p>
        <p>
          <strong>Cache Invalidation:</strong> SRI requires hash updates when resources change. This can complicate cache invalidation strategies. Use content-based filenames (file.hash.js) for cache busting. Implement gradual hash rotation for critical resources.
        </p>
        <p>
          <strong>Build Time Impact:</strong> SRI hash generation adds 100-500ms to build time depending on number of resources. Parallelize hash generation for large projects. Cache hashes for unchanged resources.
        </p>
        <p>
          <strong>Fallback Overhead:</strong> For browsers that don&apos;t support SRI (IE11, old Safari), implement feature detection and graceful degradation. Test fallback behavior thoroughly.
        </p>
      </section>

      <section>
        <h2>Browser and Platform Compatibility</h2>
        <p>
          SRI support varies across browsers, requiring careful compatibility planning.
        </p>
        <p>
          <strong>SRI Support:</strong> Supported in Chrome 45+, Firefox 43+, Safari 11+, Edge 79+. Not supported in IE11. For legacy browser support, implement feature detection and graceful degradation. Document SRI support in browser compatibility matrix.
        </p>
        <p>
          <strong>CORS Requirements:</strong> SRI requires CORS support from CDN. Verify CDN sets proper CORS headers (Access-Control-Allow-Origin). Test CORS configuration across browsers.
        </p>
        <p>
          <strong>Mobile Browser Considerations:</strong> Mobile Chrome/Firefox match desktop SRI support. iOS Safari 11+ has full support. Some older Android browsers have partial support. Test SRI on actual mobile devices.
        </p>
        <p>
          <strong>WebView Considerations:</strong> iOS WKWebView and Android WebView have separate SRI behavior. Test SRI in actual app WebViews. Consider user-agent detection for WebView-specific policies.
        </p>
        <p>
          <strong>CSP Integration:</strong> CSP Level 3 <code className="text-sm">require-sri-for</code> directive supported in Chrome 79+, Edge 79+. Not yet supported in Firefox, Safari. Use CSP reporting to monitor SRI enforcement.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>E-Commerce Platform:</strong> SRI on all third-party scripts (analytics, payment widgets, chat). webpack-subresource-integrity plugin for automatic hash generation. CSP require-sri-for directive. Monitor SRI failures via CSP reporting.
          </li>
          <li>
            <strong>Financial Services:</strong> SRI on all external resources. Pin all CDN resources to specific versions. Hash verification in CI/CD pipeline. Quarterly SRI audits as part of security compliance.
          </li>
          <li>
            <strong>Healthcare Portal:</strong> SRI on all third-party scripts handling ePHI. Build-time hash generation. CDN CORS configuration for SRI. HIPAA compliance documentation includes SRI controls.
          </li>
          <li>
            <strong>Government Website:</strong> SRI mandated by security policy. All external scripts require SRI hashes. Automated SRI verification in deployment pipeline. Executive Order 14028 compliance documentation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions and Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: What is Subresource Integrity and why is it important?</p>
            <p className="mt-2 text-sm">
              A: SRI is a security feature that allows browsers to verify that fetched resources (scripts,
              stylesheets) match expected cryptographic hashes. It&apos;s important because it protects against
              compromised or manipulated third-party resources. If a CDN is hacked or misconfigured, SRI prevents
              malicious scripts from loading. It&apos;s a critical component of web supply chain security.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: How do you generate SRI hashes?</p>
            <p className="mt-2 text-sm">
              A: Generate SHA-384 hash of the resource file, base64-encode it, and prefix with
              <code className="text-sm">sha384-</code>. Command:
              <code className="text-sm">cat file.js | openssl dgst -sha384 -binary | openssl base64 -A</code>.
              Or use build tool plugins (webpack-subresource-integrity, vite-plugin-sri) for automation. Never
              generate manually in production—automate in CI/CD.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: What attributes are required for SRI?</p>
            <p className="mt-2 text-sm">
              A: <code className="text-sm">integrity</code> attribute with hash (e.g.,
              <code className="text-sm">integrity="sha384-..."</code>) and
              <code className="text-sm">crossorigin="anonymous"</code> for cross-origin resources. The
              crossorigin attribute is required because SRI uses CORS to fetch the resource. Without it, SRI
              verification fails silently.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: How does SRI work with CSP?</p>
            <p className="mt-2 text-sm">
              A: SRI and CSP are complementary. CSP restricts WHERE resources can load from (allowed domains).
              SRI verifies WHAT content is loaded (hash matching). CSP Level 3 adds
              <code className="text-sm">require-sri-for</code> directive to mandate SRI for scripts/styles.
              Together they provide layered defense: CSP blocks unauthorized sources, SRI blocks unauthorized
              content from authorized sources.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: What are the limitations of SRI?</p>
            <p className="mt-2 text-sm">
              A: SRI doesn&apos;t protect against first-party compromises (if your server is hacked, attackers
              update both resource and hash). Doesn&apos;t work well with dynamic resources (A/B tests, feature
              flags). Requires CORS support from CDN. Older browsers ignore SRI. Resources must be version-pinned
              (can&apos;t use @latest). Despite limitations, it&apos;s valuable defense-in-depth when used
              correctly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: How would you implement SRI in a production application?</p>
            <p className="mt-2 text-sm">
              A: (1) Use build tool plugin (webpack, Vite) for automatic hash generation. (2) Pin all CDN
              resources to specific versions (no @latest). (3) Add <code className="text-sm">integrity</code>
              and <code className="text-sm">crossorigin</code> attributes to all script/link tags. (4) Combine
              with CSP <code className="text-sm">require-sri-for</code> directive. (5) Monitor SRI failures
              via CSP reporting. (6) Test in staging before production. (7) Have rollback plan for hash
              mismatches.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References and Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs: Subresource Integrity
            </a>
          </li>
          <li>
            <a href="https://w3c.github.io/webappsec-subresource-integrity/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              W3C Subresource Integrity Specification
            </a>
          </li>
          <li>
            <a href="https://www.srihash.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              SRI Hash Generator (srihash.org)
            </a>
          </li>
          <li>
            <a href="https://github.com/webpack-contrib/webpack-subresource-integrity" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              webpack-subresource-integrity Plugin
            </a>
          </li>
          <li>
            <a href="https://web.dev/subresource-integrity/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev: Subresource Integrity
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
