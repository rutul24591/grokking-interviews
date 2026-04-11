"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-third-party-script-safety",
  title: "Third-Party Script Safety",
  description:
    "Comprehensive guide to safely integrating third-party scripts: analytics, ads, widgets, tag managers, security risks, and performance impact mitigation.",
  category: "frontend",
  subcategory: "nfr",
  slug: "third-party-script-safety",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: [
    "frontend",
    "nfr",
    "security",
    "third-party",
    "analytics",
    "performance",
    "csp",
  ],
  relatedTopics: [
    "xss-injection-protection",
    "performance-optimization",
    "privacy-consent",
  ],
};

export default function ThirdPartyScriptSafetyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Third-Party Script Safety</strong> encompasses strategies for
          integrating external scripts — analytics, advertisements, chat
          widgets, A/B testing tools, payment processors, social media embeds,
          and tag managers — while minimizing security risks, performance
          impact, and privacy concerns. Third-party scripts run with full access
          to the page DOM, can read cookies, capture keystrokes, modify content,
          and exfiltrate data to any server. The Magecart attacks on British
          Airways (2018) and Ticketmaster (2018) demonstrated the severity of
          this risk — a single compromised third-party script stole payment
          card data from millions of users across thousands of websites.
        </p>
        <p>
          For staff engineers, third-party script management is a risk balancing
          act. Marketing teams demand analytics and tracking for attribution and
          optimization. Support teams want chat widgets for customer service.
          Revenue depends on advertising scripts. But each script increases the
          attack surface, slows page load, and creates a dependency on an
          external provider&apos;s availability and security practices. The
          average page has 70+ third-party requests accounting for 30-50% of
          total JavaScript, making third-party scripts the leading cause of
          performance regressions and a significant security concern.
        </p>
        <p>
          Third-party script safety spans three dimensions: security (protecting
          against supply chain attacks, data exfiltration, and DOM manipulation),
          performance (minimizing network overhead, JavaScript execution time,
          and layout shift), and privacy (ensuring compliance with GDPR, CCPA,
          and user consent requirements). Effective management requires a
          combination of technical controls (CSP, SRI, sandboxed iframes),
          process controls (vendor assessment, contract requirements, ongoing
          monitoring), and architectural patterns (async loading, lazy loading,
          facades).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Supply chain attacks occur when a third-party script&apos;s source is
          compromised — the attacker modifies the script on the vendor&apos;s
          server or CDN, and every website loading that script receives the
          malicious version. The British Airways attack injected a skimmer into
          a third-party payment form script that captured credit card details
          during checkout. The attack went undetected for months because the
          script came from a trusted domain. Prevention strategies include
          Subresource Integrity (SRI) — adding an integrity hash to the script
          tag so the browser verifies the script has not been tampered with —
          Content Security Policy (CSP) — restricting which domains can execute
          scripts — and regular auditing of third-party scripts to detect
          unauthorized changes.
        </p>
        <p>
          Performance impact from third-party scripts occurs through multiple
          mechanisms. Each script is an additional HTTP request, adding network
          overhead. JavaScript execution blocks the main thread, causing jank
          and delaying Time to Interactive. Scripts in the head delay page
          rendering. Widgets loading asynchronously can cause Cumulative Layout
          Shift (CLS) when they inject content into the page. Long tasks
          (500ms+ synchronous JavaScript execution) from third-party code cause
          visible stuttering. The impact is compounded — each additional script
          increases the probability of a performance issue, and third-party
          scripts are the leading cause of unpredictable performance
          regressions because they can change without the application
          team&apos;s knowledge.
        </p>
        <p>
          Privacy concerns arise because third-party scripts collect user data
          — browsing behavior, device information, IP addresses, and sometimes
          form inputs — often without the user&apos;s knowledge or consent.
          GDPR and CCPA require explicit consent for analytics and marketing
          scripts, and users must be informed about what data is collected and
          shared. Cross-site tracking (scripts that identify users across
          multiple websites) raises additional privacy concerns. Global Privacy
          Control (GPC) provides a browser-level opt-out signal that
          applications must honor.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/third-party-risk-vectors.svg"
          alt="Third-Party Risk Vectors"
          caption="Third-party script risk vectors — supply chain attacks (compromised vendor scripts), data exfiltration (keystroke capture, cookie theft), DOM manipulation (defacement, phishing forms), and privacy violations (cross-site tracking)"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The security controls architecture provides technical protection
          against third-party script risks. Content Security Policy (CSP)
          restricts which script sources can execute on the page through the
          script-src directive. Using nonces or hashes for inline scripts
          eliminates the need for &apos;unsafe-inline&apos;, and avoiding
          &apos;unsafe-eval&apos; prevents dynamic code execution. CSP
          violations are reported to a monitoring endpoint for detection of
          unauthorized script loading. Subresource Integrity (SRI) adds an
          integrity hash to script tags for static third-party scripts — the
          browser verifies the hash before executing and blocks the script if
          it does not match. Sandboxed iframes isolate untrusted third-party
          widgets (ads, embeds) from the main page, preventing access to the
          parent page DOM and restricting capabilities (form submission,
          popups, scripts) through the sandbox attribute.
        </p>
        <p>
          The script loading architecture minimizes performance impact. Async
          scripts download and execute as soon as available, without blocking
          HTML parsing — appropriate for scripts that do not depend on DOM
          readiness. Defer scripts download in parallel but execute after HTML
          parsing completes — appropriate for scripts that need DOM access but
          do not need to run immediately. Dynamic scripts are created
          programmatically (document.createElement) and inserted when needed —
          appropriate for scripts loaded on user interaction or when a specific
          component mounts. Lazy scripts load only when the user interacts with
          a feature or when the component enters the viewport — appropriate for
          chat widgets, embedded videos, and social media embeds.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/third-party-performance-impact.svg"
          alt="Third-Party Performance Impact"
          caption="Third-party script performance impact — additional HTTP requests, main thread JavaScript execution blocking, render-blocking scripts in head, and layout shift from async widget injection"
        />

        <p>
          The consent management architecture ensures compliance with privacy
          regulations. Non-essential scripts (analytics, marketing, advertising)
          are blocked until the user provides consent. A consent management
          platform (OneTrust, Cookiebot) manages the consent banner, captures
          user choices, and triggers script loading for consented categories.
          The Global Privacy Control signal is checked on page load and
          automatically disables marketing and analytics tracking when detected.
          Consent decisions are logged with timestamp and version for
          compliance records.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/script-loading-strategies.svg"
          alt="Script Loading Strategies"
          caption="Third-party script loading patterns — async (execute ASAP), defer (execute after HTML parse), dynamic (programmatic insertion), lazy (on interaction or visibility), and consent-based (after user approval)"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Tag management versus direct script integration involves trade-offs
          between marketing team autonomy and engineering control. Google Tag
          Manager, Tealium, and Segment allow marketing teams to add and
          configure third-party scripts without engineering involvement — a
          single GTM integration replaces dozens of individual script tags. The
          trade-off is that GTM itself is a single point of failure (if GTM is
          blocked or fails, all marketing scripts fail), adds its own overhead
          (the GTM container script is 30-50KB), and reduces engineering
          visibility into what scripts are running on the page. The recommended
          approach is to use a tag manager for marketing scripts (analytics,
          pixels, A/B testing) that change frequently, but load critical
          scripts (payment processors, security scripts) directly with SRI and
          CSP controls.
        </p>
        <p>
          Sandboxed iframes versus direct script integration provides stronger
          security isolation but limits functionality. Sandboxed iframes prevent
          the third-party content from accessing the parent page DOM, cookies,
          or JavaScript context — eliminating the risk of data exfiltration and
          DOM manipulation. The trade-off is that sandboxed iframes cannot
          communicate with the parent page except through postMessage, limiting
          integration depth. For ads and untrusted embeds, sandboxed iframes
          are the recommended approach. For trusted vendors with deep
          integration needs (payment processors like Stripe Elements), direct
          script integration with CSP and SRI is appropriate.
        </p>
        <p>
          Self-hosting third-party scripts versus loading from vendor CDNs
          involves trade-offs between control and freshness. Self-hosting
          (downloading the script and serving it from your own CDN) eliminates
          the dependency on the vendor&apos;s CDN availability, allows SRI
          enforcement, and enables performance optimization (combining with
          other scripts, controlling cache headers). The trade-off is that
          self-hosted scripts do not receive automatic updates — security
          patches and feature updates must be manually downloaded and deployed.
          For stable, rarely-updated scripts (jQuery, analytics snippets),
          self-hosting is practical. For frequently-updated scripts (ad tags,
          chat widgets), loading from the vendor CDN with CSP controls is more
          maintainable.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Minimize third-party scripts aggressively. Question every script
          addition — does this script provide measurable business value that
          justifies its security risk and performance cost? Audit existing
          scripts quarterly and remove unused ones. Many organizations have
          scripts from abandoned projects, duplicate analytics implementations,
          and testing tools for completed experiments still running. Set a
          performance budget for third-party impact — third-party scripts should
          not exceed 30% of total JavaScript or add more than 500ms to Time to
          Interactive.
        </p>
        <p>
          Implement Content Security Policy as the primary defense against
          unauthorized script execution. Configure script-src to allow only
          known, approved domains — your own origin and specific third-party
          domains. Use nonces for legitimate inline scripts instead of
          &apos;unsafe-inline&apos;. Report violations to a monitoring endpoint
          to detect unauthorized script loading attempts. Start with
          Content-Security-Policy-Report-Only to test the policy without
          blocking, then enforce once confident the allowed domains are
          comprehensive.
        </p>
        <p>
          Load third-party scripts asynchronously to prevent render blocking.
          Use defer for scripts that need DOM access, async for independent
          scripts, and dynamic/lazy loading for non-critical scripts. Implement
          facades for heavy third-party widgets — show a lightweight placeholder
          (a styled button or image) and load the actual widget only when the
          user clicks. This is particularly effective for embedded YouTube
          videos (which can add 1-2MB of JavaScript), Google Maps embeds, and
          social media widgets. The facade approach reduces initial page weight
          by 50-80% for pages with embedded third-party content.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Loading third-party scripts synchronously in the head is the most
          damaging performance mistake. A synchronous script in the head blocks
          HTML parsing until it downloads and executes — if the third-party
          server is slow or unreachable, the entire page is blocked. The fix is
          to use async or defer attributes, or load scripts dynamically after
          the page has rendered. Never place third-party scripts in the head
          without async or defer — the risk of blocking the entire page load is
          too severe.
        </p>
        <p>
          Not monitoring third-party script changes means you may not know when
          a vendor updates their script with new functionality, performance
          regressions, or (in the worst case) malicious code. Third-party
          scripts can change at any time without notification — the vendor
          deploys a new version to their CDN and all websites loading that
          script receive the update. Implement automated monitoring that hashes
          third-party scripts periodically and alerts on changes. Include
          third-party script changes in your performance monitoring — track
          Core Web Vitals trends and correlate degradation with third-party
          script additions or updates.
        </p>
        <p>
          Failing to plan for third-party failure creates brittle applications.
          If a chat widget&apos;s CDN goes down, does your page break? If an
          analytics script fails to load, does it throw uncaught errors? If a
          payment processor&apos;s script is blocked by an ad blocker, does the
          checkout flow handle it gracefully? The fix is to wrap third-party
          script interactions in try/catch, provide fallback UI when scripts
          fail to load, and test your application with third-party scripts
          blocked (using browser DevTools or a network interceptor) to verify
          graceful degradation.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          E-commerce platforms face the highest third-party script risk because
          they handle payment processing and personal data while running
          numerous marketing and analytics scripts. The recommended architecture
          uses CSP with strict script-src (only approved domains), SRI for
          static scripts (payment SDKs, analytics snippets), sandboxed iframes
          for ads and product review widgets, async/defer loading for all
          scripts, consent-based loading for analytics and marketing (blocked
          until user consent), and facades for embedded content (product videos,
          social proof widgets). Payment scripts (Stripe, PayPal) are loaded
          directly with SRI, not through a tag manager, because they are
          security-critical.
        </p>
        <p>
          News websites balance advertising revenue with performance and
          security. They load ad scripts through Google Tag Manager with consent
          blocking (ads do not load until the user consents), use sandboxed
          iframes for ad content (preventing ads from accessing the page DOM),
          implement facades for social media embeds and video content (loading
          only on user interaction), and monitor ad script performance impact
          continuously. When a particular ad network causes performance
          degradation, they can disable it through the tag manager without
          engineering involvement.
        </p>
        <p>
          SaaS companies manage third-party scripts for analytics (Mixpanel,
          Amplitude), chat support (Intercom, Drift), A/B testing (Optimizely,
          VWO), and documentation search (Algolia). Each script is evaluated
          for security (vendor SOC2 certification, data handling practices),
          performance (bundle size, load time, main thread impact), and privacy
          (data collection scope, consent requirements). Scripts are loaded
          with defer or async, chat widgets use facades (show a button, load
          the full widget on click), and A/B testing scripts are removed when
          experiments conclude. The third-party script inventory is reviewed
          quarterly with security and performance assessments.
        </p>
      </section>

      <section>
        <h2>Advanced Third-Party Security Architecture</h2>
        <p>
          Supply chain attack prevention strategies must address the growing threat of compromised third-party scripts that can exfiltrate user data, inject malicious content, or redirect users to phishing sites. Subresource Integrity (SRI) provides cryptographic verification that a script has not been modified — the integrity attribute on the script tag contains a SHA-256, SHA-384, or SHA-512 hash of the expected script content, and the browser refuses to execute the script if the hash does not match. SRI is effective for static scripts with known versions (CDN-hosted libraries, payment SDKs, analytics snippets) but is impractical for dynamic scripts that change frequently (ad tags, A/B testing variants) because the hash must be updated with each script change. For dynamic scripts, Trusted Types provide a complementary defense — Trusted Types is a CSP feature that prevents DOM XSS by restricting which values can be passed to XSS-sensitive sinks (innerHTML, eval, script creation). When Trusted Types are enforced, third-party scripts cannot inject arbitrary HTML or execute dynamically generated code, significantly reducing the attack surface even if the script is compromised. The implementation requires creating a Trusted Type policy that validates and sanitizes all values before they reach DOM sinks, and configuring the CSP header with Content-Security-Policy: require-trusted-types-for &apos;script&apos;. Trusted Types has growing browser support (Chrome, Edge, Opera) and should be enabled for applications that load untrusted third-party scripts.
        </p>
        <p>
          Tag manager security architecture addresses the unique risk that tag managers introduce — a single compromised tag manager account can inject malicious scripts across thousands of websites. Google Tag Manager, Tealium, and Adobe Launch provide powerful script management capabilities but also create a concentrated attack surface. The security architecture for tag managers includes access control — restricting who can create, edit, and publish tags (using role-based access with approval workflows, requiring dual authorization for production changes), environment separation — using separate tag manager containers for development, staging, and production, with production changes requiring a deployment pipeline rather than direct UI edits, and audit logging — recording every tag change, who made it, and when, with automated alerts for unauthorized modifications. The tag manager&apos;s preview mode should be used to test tags before publishing, and the published container version should be tracked in version control with diff analysis to detect unexpected changes. For high-security applications, critical scripts (payment processors, authentication) should be loaded directly with SRI rather than through the tag manager, reserving the tag manager for marketing and analytics scripts where the business impact of temporary unavailability is lower.
        </p>
        <p>
          Third-party performance monitoring is essential because third-party scripts are the leading cause of unpredictable performance regressions — they can change without notice, adding new functionality that impacts load time, main thread execution, and layout stability. The monitoring architecture uses automated performance regression detection that runs on every deployment and periodically in production. The Lighthouse CI pipeline measures Core Web Vitals (LCP, INP, CLS) and third-party impact metrics (third-party JavaScript bytes, third-party main thread time, third-party transfer size) and fails the build if metrics exceed defined thresholds. In production, Real User Monitoring (RUM) data is segmented by third-party script presence — comparing performance for users who have ad blockers (third-party scripts blocked) versus users who do not, quantifying the performance impact of each third-party script. When a particular third-party script is identified as a performance bottleneck, the engineering team has data to make informed decisions: negotiate with the vendor to optimize their script, replace the vendor with a lighter-weight alternative, implement a facade to defer loading, or remove the script if its business value does not justify its performance cost. The monitoring should also track third-party script availability — if a script&apos;s CDN is frequently unreachable, it causes JavaScript errors and broken functionality, which is both a performance and reliability issue.
        </p>
        <p>
          Consent enforcement automation ensures that non-essential third-party scripts are blocked until the user provides explicit consent, and that consent decisions are consistently enforced across all script loading mechanisms. The enforcement architecture uses a consent manager that intercepts script loading requests and evaluates the user&apos;s consent state before allowing the script to load. For tag managers, the consent manager integrates with the tag manager&apos;s consent API (Google Tag Manager&apos;s consent mode, Tealium&apos;s consent management) to gate tag execution based on consent categories. For directly-loaded scripts, the consent manager replaces the script tag with a consent-gated wrapper that checks consent before creating the actual script element. The enforcement must be tested rigorously — using browser DevTools to verify that non-essential scripts do not make network requests before consent is given, and that scripts are properly loaded after consent is granted. Consent decisions must be logged with timestamp, version (corresponding to the privacy policy version at the time of consent), user identifier (anonymized), and the specific categories consented to, creating an auditable record for regulatory compliance. When the privacy policy is updated, the consent manager detects the version mismatch on the user&apos;s next visit and prompts for re-consent, ensuring that users are informed of material changes to data collection practices.
        </p>
        <p>
          Vendor risk assessment framework provides a systematic process for evaluating third-party scripts before they are integrated into the application. The assessment covers security practices (does the vendor have a security team, do they conduct regular penetration testing, do they have a bug bounty program, what is their incident response process), data handling (what data does the script collect, where is it sent, is it shared with sub-processors, does the vendor comply with GDPR and CCPA), operational reliability (what is the vendor&apos;s uptime SLA, do they have redundant infrastructure, what is their incident history, do they provide status pages), and performance impact (what is the script&apos;s bundle size, how long does it take to load and execute, does it cause layout shift, does it block the main thread). The assessment should be documented and reviewed by the security team, legal team (for privacy compliance), and engineering team (for performance impact). High-risk vendors (scripts that process payment data, handle PII, or have broad page access) require a more thorough assessment including a review of the vendor&apos;s SOC 2 report, data processing agreement, and security architecture documentation. The assessment should be repeated annually or when the vendor undergoes significant changes (acquisition, security incident, major product update).
        </p>
        <p>
          Incident response for compromised third-party scripts must be planned and tested before an incident occurs, because the response time directly determines the scope of user impact. The incident response plan includes detection mechanisms (automated monitoring that detects anomalous script behavior — unexpected network requests, unusual DOM modifications, or CSP violation reports indicating unauthorized script loading), containment procedures (immediately blocking the compromised script by updating the CSP to remove the vendor&apos;s domain from script-src, or using the tag manager to disable the tag), impact assessment (determining which users were affected, what data was potentially exposed, and how long the compromise was active), notification obligations (regulatory requirements for breach notification — GDPR requires notification within 72 hours, CCPA requires notification to affected California residents), and remediation steps (restoring the script from a known-good version, enhancing monitoring to detect similar compromises, reviewing the vendor&apos;s security practices, and updating the risk assessment). The incident response should be tested through tabletop exercises that simulate a compromised third-party script, involving the engineering team (to practice containment), the security team (to assess impact), the legal team (to evaluate notification obligations), and the communications team (to prepare user-facing notifications). Post-incident, a blameless post-mortem identifies what detection gaps existed, how the containment could be faster, and what preventive measures should be implemented to reduce the likelihood of recurrence.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the security risks of third-party scripts?
            </p>
            <p className="mt-2 text-sm">
              A: Supply chain attacks — a compromised vendor serves malicious
              code to all websites loading their script (British Airways
              Magecart attack stole payment data from millions). Data
              exfiltration — third-party scripts can read cookies, capture
              keystrokes, read form data, and send it to any server. DOM
              manipulation — scripts can modify page content, inject phishing
              forms, or redirect users. Privacy violations — cross-site
              tracking, fingerprinting, collecting data without consent. Each
              third-party script is a potential attack vector.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you protect against third-party script risks?
            </p>
            <p className="mt-2 text-sm">
              A: Content Security Policy (restrict script sources to approved
              domains). Subresource Integrity (verify script hasn&apos;t been
              tampered with via integrity hash). Sandboxed iframes for
              untrusted widgets (ads, embeds). Async/defer loading to prevent
              render blocking. Consent management for GDPR/CCPA compliance.
              Facades for heavy widgets (load on interaction, not on page load).
              Regular vendor security assessments. Monitor script changes and
              performance impact continuously.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do third-party scripts impact performance?
            </p>
            <p className="mt-2 text-sm">
              A: Network overhead — each script is an additional HTTP request.
              JavaScript execution blocking the main thread, causing jank and
              delaying Time to Interactive. Render-blocking if not async/defer.
              Layout shift from widgets loading asynchronously. Long tasks
              (500ms+) causing visible stuttering. Average page has 70+
              third-party requests accounting for 30-50% of total JS. Mitigate
              with async loading, lazy loading, facades, and performance
              budgets for third-party impact.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is Subresource Integrity and when would you use it?
            </p>
            <p className="mt-2 text-sm">
              A: SRI adds an integrity hash to script tags. The browser
              verifies the hash before executing and blocks the script if it
              doesn&apos;t match — preventing compromised CDNs from serving
              malicious code. Use for static third-party scripts (CDN-hosted
              libraries, payment SDKs). Generate hash with srihash.org. Update
              hash when the vendor updates the script. Does not protect against
              dynamic scripts that change frequently (ad tags, analytics)
              because the hash would change with each update.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle GDPR/CCPA compliance for third-party scripts?
            </p>
            <p className="mt-2 text-sm">
              A: Block non-essential scripts (analytics, marketing,
              advertising) until user provides consent. Use a consent management
              platform (OneTrust, Cookiebot). Respect Global Privacy Control
              signal for automatic opt-out. Log consent decisions with timestamp
              and version. Allow users to withdraw consent and disable scripts
              accordingly. Categorize scripts (essential, analytics, marketing)
              and only load scripts for categories the user has consented to.
              Test that scripts are truly blocked — verify with DevTools Network
              tab.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
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
              href="https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Subresource Integrity
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/third-party-facades/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Third-Party Facades
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP — Third-Party JavaScript Management
            </a>
          </li>
          <li>
            <a
              href="https://www.publicconnectivity.org/blog/2019/02/the-magecart-attack-on-british-airways/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Magecart Attack on British Airways — Case Study
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
