"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-third-party-script-safety",
  title: "Third-Party Script Safety",
  description: "Comprehensive guide to safely integrating third-party scripts: analytics, ads, widgets, tag managers, security risks, and performance impact mitigation.",
  category: "frontend",
  subcategory: "nfr",
  slug: "third-party-script-safety",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "security", "third-party", "analytics", "performance", "csp"],
  relatedTopics: ["xss-injection-protection", "performance-optimization", "privacy-consent"],
};

export default function ThirdPartyScriptSafetyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Third-Party Script Safety</strong> encompasses strategies for integrating external
          scripts (analytics, ads, chat widgets, A/B testing, payment processors) while minimizing
          security risks, performance impact, and privacy concerns. Third-party scripts run with full
          access to your page — they can read cookies, capture keystrokes, modify content, and exfiltrate data.
        </p>
        <p>
          For staff engineers, third-party script management is a risk balancing act. Marketing teams
          want analytics and tracking. Support wants chat widgets. Revenue depends on ads. But each
          script increases attack surface, slows page load, and creates dependencies on external providers.
        </p>
        <p>
          <strong>Common third-party scripts:</strong>
        </p>
        <ul>
          <li><strong>Analytics:</strong> Google Analytics, Adobe Analytics, Mixpanel</li>
          <li><strong>Ads:</strong> Google AdSense, Facebook Audience Network</li>
          <li><strong>Chat widgets:</strong> Intercom, Drift, Zendesk</li>
          <li><strong>A/B testing:</strong> Optimizely, VWO, Google Optimize</li>
          <li><strong>Payment:</strong> Stripe, PayPal, Braintree</li>
          <li><strong>Social:</strong> Facebook Pixel, Twitter widgets, LinkedIn Insight</li>
          <li><strong>Tag managers:</strong> Google Tag Manager, Tealium</li>
        </ul>
      </section>

      <section>
        <h2>Security Risks</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Supply Chain Attacks</h3>
        <ul className="space-y-2">
          <li>Compromised third-party script can steal all user data</li>
          <li>Attack via third-party&apos;s build system or CDN</li>
          <li>Examples: British Airways Magecart attack (2018), Ticketmaster (2018)</li>
          <li>Thousands of sites affected by single compromised script</li>
          <li>Hard to detect — script comes from trusted domain</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Exfiltration</h3>
        <ul className="space-y-2">
          <li>Third-party can read form inputs (including passwords)</li>
          <li>Can access cookies (unless HttpOnly)</li>
          <li>Can capture keystrokes (keyloggers)</li>
          <li>Can read page content (PII, credit cards)</li>
          <li>Can send data to any server</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DOM Manipulation</h3>
        <ul className="space-y-2">
          <li>Can modify page content (defacement)</li>
          <li>Can inject malicious forms (credential harvesting)</li>
          <li>Can redirect users to phishing sites</li>
          <li>Can display unwanted ads or popups</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Privacy Concerns</h3>
        <ul className="space-y-2">
          <li>Cross-site tracking (cookies, fingerprinting)</li>
          <li>GDPR/CCPA compliance requirements</li>
          <li>User consent requirements</li>
          <li>Data sharing with unknown third-parties</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/third-party-risk-vectors.svg"
          alt="Third-Party Risk Vectors"
          caption="Third-party script risk vectors — supply chain attacks, data exfiltration, DOM manipulation, and privacy concerns"
        />
      </section>

      <section>
        <h2>Performance Impact</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Performance Issues</h3>
        <ul className="space-y-2">
          <li><strong>Network overhead:</strong> Each script is an additional HTTP request</li>
          <li><strong>JavaScript execution:</strong> Third-party JS blocks main thread</li>
          <li><strong>Render blocking:</strong> Scripts in head delay page render</li>
          <li><strong>Layout shift:</strong> Widgets loading can cause CLS</li>
          <li><strong>Long tasks:</strong> Third-party code can cause 500ms+ tasks</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Performance Statistics</h3>
        <ul className="space-y-2">
          <li>Average page has 70+ third-party requests</li>
          <li>Third-party JS accounts for 30-50% of total JS</li>
          <li>Each additional script increases failure probability</li>
          <li>Third-party scripts are leading cause of performance regressions</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Mitigation Strategies</h3>
        <ul className="space-y-2">
          <li>Load third-party scripts asynchronously</li>
          <li>Use requestIdleCallback for non-critical scripts</li>
          <li>Implement resource hints (preconnect, dns-prefetch)</li>
          <li>Set performance budgets for third-party impact</li>
          <li>Monitor third-party performance continuously</li>
          <li>Consider self-hosting critical third-party scripts</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/third-party-performance-impact.svg"
          alt="Third-Party Performance Impact"
          caption="Third-party script performance impact — network requests, JavaScript execution, and main thread blocking"
        />
      </section>

      <section>
        <h2>Security Controls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Content Security Policy (CSP)</h3>
        <p>
          CSP restricts which scripts can execute on your page.
        </p>
        <ul className="space-y-2">
          <li><code>script-src</code>: Specify allowed script sources</li>
          <li>Use nonces or hashes for inline scripts</li>
          <li>Avoid <code>unsafe-inline</code> and <code>unsafe-eval</code></li>
          <li>Report violations with <code>report-uri</code> or <code>report-to</code></li>
          <li>Start with report-only mode to test</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Subresource Integrity (SRI)</h3>
        <p>
          SRI ensures third-party scripts haven&apos;t been tampered with.
        </p>
        <ul className="space-y-2">
          <li>Add integrity hash to script tags</li>
          <li>Browser verifies hash before executing</li>
          <li>Prevents compromised CDN serving malicious code</li>
          <li>Generate hashes with tools (srihash.org)</li>
          <li>Update hashes when third-party updates script</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sandboxed Iframes</h3>
        <p>
          Isolate third-party widgets in sandboxed iframes.
        </p>
        <ul className="space-y-2">
          <li><code>sandbox</code> attribute restricts iframe capabilities</li>
          <li>Prevents access to parent page DOM</li>
          <li>Blocks form submission, popups, scripts as needed</li>
          <li>Use for ads, embeds, untrusted widgets</li>
          <li>Communicate via postMessage API</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Trusted Types</h3>
        <p>
          Modern API to prevent DOM XSS from third-party scripts.
        </p>
        <ul className="space-y-2">
          <li>Restrict dangerous DOM APIs (innerHTML, eval)</li>
          <li>Require trusted values from trusted sources</li>
          <li>Browser support: Chrome, Edge (90%+)</li>
          <li>Policy-based enforcement</li>
        </ul>
      </section>

      <section>
        <h2>Integration Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Script Loading Strategies</h3>
        <ul className="space-y-2">
          <li><strong>Async:</strong> <code>&lt;script async src=&quot;...&quot;&gt;</code> — Download and execute ASAP</li>
          <li><strong>Defer:</strong> <code>&lt;script defer src=&quot;...&quot;&gt;</code> — Execute after HTML parsed</li>
          <li><strong>Dynamic:</strong> Create script element programmatically</li>
          <li><strong>Lazy:</strong> Load on user interaction or visibility</li>
          <li><strong>Web Worker:</strong> Run in worker thread (if supported)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tag Management</h3>
        <ul className="space-y-2">
          <li><strong>Google Tag Manager:</strong> Central management for marketing tags</li>
          <li><strong>Tealium:</strong> Enterprise tag management</li>
          <li><strong>Segment:</strong> Customer data platform with tag routing</li>
          <li><strong>Benefits:</strong> Single integration, marketing team control, versioning</li>
          <li><strong>Risks:</strong> Single point of failure, additional overhead, less visibility</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consent Management</h3>
        <ul className="space-y-2">
          <li>Block scripts until user consents (GDPR, CCPA)</li>
          <li>Use consent management platforms (OneTrust, Cookiebot)</li>
          <li>Respect Global Privacy Control (GPC) signal</li>
          <li>Log consent decisions for compliance</li>
          <li>Allow users to withdraw consent</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/script-loading-strategies.svg"
          alt="Script Loading Strategies"
          caption="Third-party script loading patterns — async, defer, dynamic, lazy loading, and consent-based loading"
        />
      </section>

      <section>
        <h2>Vendor Management</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Vendor Assessment</h3>
        <ul className="space-y-2">
          <li>Review vendor security practices (SOC2, ISO 27001)</li>
          <li>Understand data collection and sharing</li>
          <li>Review privacy policy and terms</li>
          <li>Check vendor reputation and history</li>
          <li>Understand SLA and support options</li>
          <li>Plan for vendor failure (backup options)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Contractual Protections</h3>
        <ul className="space-y-2">
          <li>Data processing agreements (GDPR)</li>
          <li>Security requirements in contract</li>
          <li>Breach notification requirements</li>
          <li>Audit rights</li>
          <li>Liability and indemnification</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Ongoing Monitoring</h3>
        <ul className="space-y-2">
          <li>Monitor script changes (version tracking)</li>
          <li>Track performance impact over time</li>
          <li>Review vendor security updates</li>
          <li>Periodic security audits</li>
          <li>Stay informed about third-party incidents</li>
        </ul>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Minimize third-party scripts:</strong> Every script is a risk. Question each one.
          </li>
          <li>
            <strong>Use CSP:</strong> Restrict script sources to known domains.
          </li>
          <li>
            <strong>Implement SRI:</strong> For static third-party scripts.
          </li>
          <li>
            <strong>Load asynchronously:</strong> Don&apos;t block page render.
          </li>
          <li>
            <strong>Sandbox untrusted content:</strong> Use sandboxed iframes for ads, widgets.
          </li>
          <li>
            <strong>Monitor continuously:</strong> Track performance and security impact.
          </li>
          <li>
            <strong>Respect consent:</strong> Block scripts until user consents (GDPR/CCPA).
          </li>
          <li>
            <strong>Have fallback plans:</strong> What if third-party fails or is compromised?
          </li>
          <li>
            <strong>Document all third-parties:</strong> Maintain inventory with purpose and risk level.
          </li>
          <li>
            <strong>Regular audits:</strong> Quarterly review of all third-party scripts.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight for Interviews</h3>
          <p>
            In staff engineer interviews, demonstrate understanding that third-party scripts are a
            security and performance risk, not just a convenience. Discuss CSP, SRI, async loading,
            and consent management. Show awareness of supply chain attacks (Magecart). Emphasize
            minimizing third-party dependencies and having contingency plans for vendor failures.
          </p>
        </div>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the security risks of third-party scripts?</p>
            <p className="mt-2 text-sm">
              A: Supply chain attacks (compromised vendor serves malicious code), data exfiltration
              (stealing cookies, keystrokes, form data), DOM manipulation (defacement, phishing
              forms), and privacy violations (cross-site tracking). Examples: British Airways and
              Ticketmaster Magecart attacks where thousands of sites were affected by single
              compromised script.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you protect against third-party script risks?</p>
            <p className="mt-2 text-sm">
              A: Content Security Policy (restrict script sources), Subresource Integrity (verify
              script hasn&apos;t been tampered), sandboxed iframes for untrusted widgets, Trusted
              Types API, async/defer loading to prevent render blocking, consent management for
              GDPR/CCPA, and regular vendor security assessments.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do third-party scripts impact performance?</p>
            <p className="mt-2 text-sm">
              A: Network overhead (each script is additional HTTP request), JavaScript execution
              blocking main thread, render-blocking if not async/defer, layout shift from widgets
              loading, long tasks causing jank. Average page has 70+ third-party requests accounting
              for 30-50% of total JS. Mitigate with async loading, lazy loading, and performance
              budgets.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is Subresource Integrity and when would you use it?</p>
            <p className="mt-2 text-sm">
              A: SRI adds integrity hash to script tags. Browser verifies hash before executing,
              preventing compromised CDN from serving malicious code. Use for static third-party
              scripts (CDN-hosted libraries). Generate hash with srihash.org. Update hash when
              vendor updates script. Doesn&apos;t protect against dynamic scripts that change frequently.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle GDPR/CCPA compliance for third-party scripts?</p>
            <p className="mt-2 text-sm">
              A: Block non-essential scripts until user consents. Use consent management platform
              (OneTrust, Cookiebot). Respect Global Privacy Control signal. Log consent decisions.
              Allow users to withdraw consent. Categorize scripts (essential, analytics, marketing).
              Only load scripts for categories user has consented to.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Content Security Policy
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Subresource Integrity
            </a>
          </li>
          <li>
            <a href="https://web.dev/third-party-facades/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Third-Party Facades
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP — Third-Party JavaScript Management
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
