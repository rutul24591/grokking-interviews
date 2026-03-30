"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-third-party-integration-script-loading-strategies",
  title: "Script Loading Strategies",
  description: "Staff-level guide to third-party script loading: critical path control, security hardening with CSP and SRI, performance budgets, failure isolation, and operational guardrails for large SPAs.",
  category: "frontend",
  subcategory: "third-party-integration",
  slug: "script-loading-strategies",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "third-party", "scripts", "performance", "security", "csp", "sri", "observability"],
  relatedTopics: ["widget-embedding", "analytics-tools-integration", "performance-budgets", "web-vitals"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Script loading strategy</strong> is the set of architectural and operational decisions that determine <strong>when</strong>, <strong>how</strong>, and <strong>under what constraints</strong> JavaScript is fetched and executed in the browser—especially <strong>third-party scripts</strong> such as analytics tags, A/B testing frameworks, chat widgets, payments, identity providers, and embedded content SDKs.
        </p>
        <p>
          Third-party scripts are unique because they introduce a new trust boundary and a new failure domain into your application. They run in your origin context by default, which means they can access DOM, cookies, storage, and in-memory data. They also compete for the most scarce resource in a frontend system: <strong>main-thread time</strong> on a heterogeneous fleet of devices (mid-range phones, low-memory tablets, slow networks).
        </p>
        <p>
          The business impact of poor script loading decisions is significant and often underestimated:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Performance Degradation:</strong> Each third-party script adds 100-500ms to page load time. Multiple scripts compound this effect, leading to 2-5 second delays on mobile devices.
          </li>
          <li>
            <strong>Security Vulnerabilities:</strong> Compromised third-party scripts can steal user data, inject malware, or redirect users to phishing sites. Supply chain attacks through third-party scripts have increased 300% since 2020.
          </li>
          <li>
            <strong>Reliability Risks:</strong> If a third-party CDN goes down or returns errors, your application may break entirely. Single points of failure multiply with each script dependency.
          </li>
          <li>
            <strong>Privacy Compliance:</strong> Scripts that track users without proper consent violate GDPR, CCPA, and other regulations. Fines can reach 4% of global revenue under GDPR.
          </li>
        </ul>
        <p>
          For staff/principal engineers, script loading is not just a technical implementation detail—it&apos;s a <strong>system design problem</strong> that requires balancing performance, security, reliability, and compliance. The goal is to extract business value from third-party capabilities while minimizing their blast radius.
        </p>
        <p>
          In system design interviews, script loading strategy demonstrates understanding of the browser loading pipeline, security boundaries, performance optimization, and operational risk management. It shows you think about production realities, not just development convenience.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/script-loading-timeline.svg"
          alt="Script loading timeline showing HTML parse, script fetch, script execute, DOM ready, and page interactive stages with different script strategies"
          caption="Script loading timeline — defer and async allow parallel downloads, reducing total page load time compared to blocking scripts"
        />

        <h3>Script Loading Attributes</h3>
        <p>
          HTML provides three primary ways to load scripts, each with different blocking behavior:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>&lt;script&gt; (blocking):</strong> The browser stops HTML parsing, fetches the script, executes it, then resumes parsing. This is the default behavior and the most harmful to performance. Use only for critical scripts that must run before DOM is available.
          </li>
          <li>
            <strong>&lt;script defer&gt;:</strong> The browser fetches the script in parallel while continuing to parse HTML. Execution is deferred until after HTML parsing completes, but before DOMContentLoaded. Scripts execute in order. Best for app scripts that need DOM access.
          </li>
          <li>
            <strong>&lt;script async&gt;:</strong> The browser fetches the script in parallel. Execution happens as soon as the script is downloaded, potentially interrupting HTML parsing. Scripts execute in arbitrary order. Best for independent scripts like analytics that don&apos;t depend on DOM or other scripts.
          </li>
        </ul>
        <p>
          The choice between defer and async depends on dependencies: if scripts depend on each other or need DOM access, use defer. If scripts are independent and fire-and-forget, use async.
        </p>

        <h3>Critical Rendering Path</h3>
        <p>
          The critical rendering path is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels. Scripts block this path by default:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Parser-Blocking:</strong> Synchronous scripts stop HTML parsing. The browser cannot discover downstream resources (images, stylesheets) until parsing resumes.
          </li>
          <li>
            <strong>Render-Blocking:</strong> Scripts that manipulate DOM or CSSOM must execute before the browser can render. This delays First Contentful Paint (FCP) and Largest Contentful Paint (LCP).
          </li>
          <li>
            <strong>Main-Thread Blocking:</strong> Script execution happens on the main thread, competing with rendering, user input handling, and animation. Heavy scripts cause jank and input lag.
          </li>
        </ul>
        <p>
          The goal of script loading strategy is to <strong>minimize blocking</strong> while ensuring scripts execute at the right time for functionality.
        </p>

        <h3>Security: Content Security Policy (CSP)</h3>
        <p>
          Content Security Policy is an HTTP header that restricts which scripts can execute on your page. It&apos;s the primary defense against XSS attacks and compromised third-party scripts.
        </p>
        <p>
          CSP works by whitelisting trusted sources:
        </p>
        <ul className="space-y-2">
          <li>
            <code>script-src &apos;self&apos; https://cdn.example.com</code> — Only allow scripts from your origin and a specific CDN.
          </li>
          <li>
            <code>script-src &apos;self&apos; &apos;nonce-abc123&apos;</code> — Only allow inline scripts with a specific nonce value (generated per request).
          </li>
          <li>
            <code>script-src &apos;self&apos; &apos;strict-dynamic&apos;</code> — Allow scripts loaded by trusted scripts, even if they&apos;re from non-whitelisted sources.
          </li>
        </ul>
        <p>
          CSP should be deployed in <strong>report-only mode</strong> first (<code>Content-Security-Policy-Report-Only</code>) to identify violations without breaking functionality. Once confident, switch to enforcing mode.
        </p>

        <h3>Security: Subresource Integrity (SRI)</h3>
        <p>
          Subresource Integrity allows you to verify that a script hasn&apos;t been tampered with by specifying a cryptographic hash:
        </p>
        <pre className="my-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`&lt;script 
  src="https://cdn.example.com/analytics.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"&gt;&lt;/script&gt;`}</code>
        </pre>
        <p>
          The browser calculates the hash of the downloaded script and compares it to the specified hash. If they don&apos;t match, the script is not executed. This protects against CDN compromises or man-in-the-middle attacks.
        </p>
        <p>
          Generate SRI hashes using tools like <code>https://www.srihash.org/</code> or build plugins (webpack-subresource-integrity). Update hashes whenever scripts change.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/csp-sri-security-flow.svg"
          alt="CSP and SRI security flow showing browser validation of script sources and integrity hashes"
          caption="CSP controls WHERE scripts load from; SRI ensures WHAT loads is untampered — both are needed for defense in depth"
        />

        <h3>Performance Impact Measurement</h3>
        <p>
          Third-party scripts impact multiple Core Web Vitals:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>LCP (Largest Contentful Paint):</strong> Scripts that block rendering delay LCP. Each blocking script can add 200-500ms.
          </li>
          <li>
            <strong>TTI (Time to Interactive):</strong> Scripts that execute during page load delay TTI. Heavy scripts can add 1-3 seconds on mobile.
          </li>
          <li>
            <strong>TBT (Total Blocking Time):</strong> Long script execution tasks block the main thread, increasing TBT and causing input lag.
          </li>
          <li>
            <strong>CLS (Cumulative Layout Shift):</strong> Scripts that inject content (ads, embeds) can cause layout shifts if not properly sized.
          </li>
        </ul>
        <p>
          Measure third-party impact using Chrome DevTools Performance panel, Lighthouse, or RUM tools. Identify scripts contributing most to blocking time and prioritize optimization.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/third-party-impact.svg"
          alt="Performance comparison showing page load timeline without optimization (2.8s FCP, 3.5s TTI) vs with optimization (0.8s FCP, 1.2s TTI)"
          caption="Third-party impact — unoptimized scripts block critical path; defer, async, and lazy loading reduce FCP by 71% and TTI by 66%"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A robust script loading architecture treats third-party scripts as <strong>untrusted dependencies</strong> that must be isolated, monitored, and controlled.
        </p>

        <h3>Decision Framework</h3>
        <p>
          Use this decision tree to determine the appropriate loading strategy for each script:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Is the script critical for initial render?</strong> If yes, load early with appropriate strategy. If no, defer or lazy load.
          </li>
          <li>
            <strong>Does the script depend on other scripts?</strong> If yes, use defer to preserve execution order. If no, async is safe.
          </li>
          <li>
            <strong>Does the script need DOM access?</strong> If yes, defer until after DOM is ready. If no, async is safe.
          </li>
          <li>
            <strong>Is the script from a trusted origin?</strong> If no, use CSP and SRI to restrict and verify.
          </li>
          <li>
            <strong>Can the script be user-triggered?</strong> If yes, lazy load on interaction (click, scroll, hover).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/script-loading-decision-tree.svg"
          alt="Decision tree for script loading strategy: critical → same origin? → inline or script; non-critical → order matters? → defer or async"
          caption="Script loading decision tree — systematic approach to choosing the right loading strategy based on criticality, dependencies, and origin"
        />

        <h3>Loading Patterns</h3>
        <p>
          Several patterns emerge from applying the decision framework:
        </p>

        <h4>Pattern 1: Critical Path Scripts</h4>
        <p>
          Scripts required for initial render (e.g., polyfills, critical analytics):
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Same origin:</strong> Inline small scripts (&lt;14KB) directly in HTML to avoid extra round-trip. For larger scripts, use normal &lt;script&gt; tag.
          </li>
          <li>
            <strong>Different origin:</strong> Use &lt;link rel="preconnect"&gt; to warm connection, then load with defer.
          </li>
        </ul>

        <h4>Pattern 2: Non-Critical Independent Scripts</h4>
        <p>
          Scripts that don&apos;t depend on DOM or other scripts (e.g., analytics, A/B testing):
        </p>
        <ul className="space-y-2">
          <li>
            Use &lt;script async&gt; to download in parallel and execute as soon as ready.
          </li>
          <li>
            Consider loading after page load event to avoid competing with critical resources.
          </li>
        </ul>

        <h4>Pattern 3: Non-Critical Dependent Scripts</h4>
        <p>
          Scripts that need DOM access or depend on other scripts (e.g., UI widgets):
        </p>
        <ul className="space-y-2">
          <li>
            Use &lt;script defer&gt; to ensure execution after DOM is ready and in correct order.
          </li>
          <li>
            Consider lazy loading on user interaction if not needed immediately.
          </li>
        </ul>

        <h4>Pattern 4: User-Triggered Scripts</h4>
        <p>
          Scripts for features users may or may not use (e.g., chat widgets, payment forms):
        </p>
        <ul className="space-y-2">
          <li>
            Lazy load on interaction (click, hover, scroll into view).
          </li>
          <li>
            Show loading state while script downloads.
          </li>
          <li>
            Cache loaded scripts to avoid re-downloading on subsequent interactions.
          </li>
        </ul>

        <h3>Special Cases</h3>
        <p>
          Some scenarios require special handling:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>type="module":</strong> ES modules are always deferred by default. Use for modern script loading with import/export.
          </li>
          <li>
            <strong>Dynamic import():</strong> Load scripts programmatically with import() for fine-grained control. Returns a Promise for error handling.
          </li>
          <li>
            <strong>JSONP:</strong> Legacy pattern for cross-origin scripts. Avoid in new code; use CORS and proper APIs instead.
          </li>
          <li>
            <strong>&lt;noscript&gt; fallback:</strong> Provide alternative content for users with JavaScript disabled.
          </li>
        </ul>

        <h3>Failure Isolation</h3>
        <p>
          Third-party scripts can fail silently or catastrophically. Design for failure:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Timeouts:</strong> Set timeouts for script loading. If a script takes &gt;5 seconds, abort and log the failure.
          </li>
          <li>
            <strong>Error Boundaries:</strong> Wrap third-party integrations in error boundaries to prevent cascading failures.
          </li>
          <li>
            <strong>Fallbacks:</strong> Provide degraded functionality when scripts fail (e.g., static form instead of chat widget).
          </li>
          <li>
            <strong>Monitoring:</strong> Track script load failures in your error tracking system. Alert on elevated failure rates.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Script loading strategies involve trade-offs between performance, complexity, and reliability.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Strategy</th>
              <th className="p-3 text-left">Performance</th>
              <th className="p-3 text-left">Complexity</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Inline Critical Scripts</td>
              <td className="p-3">Best (no extra request)</td>
              <td className="p-3">Low</td>
              <td className="p-3">Small scripts (&lt;14KB) needed immediately</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Defer</td>
              <td className="p-3">Good (parallel download)</td>
              <td className="p-3">Low</td>
              <td className="p-3">Scripts needing DOM, preserving order</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Async</td>
              <td className="p-3">Good (parallel download)</td>
              <td className="p-3">Low</td>
              <td className="p-3">Independent, fire-and-forget scripts</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Lazy Load</td>
              <td className="p-3">Best (only if needed)</td>
              <td className="p-3">Medium</td>
              <td className="p-3">User-triggered features</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Dynamic Import</td>
              <td className="p-3">Best (on-demand)</td>
              <td className="p-3">High</td>
              <td className="p-3">Code splitting, conditional loading</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that <strong>no single strategy fits all scripts</strong>. Each third-party script should be evaluated individually based on its criticality, dependencies, and trust level.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Audit Third-Party Scripts Regularly:</strong> Quarterly review of all third-party scripts. Remove unused scripts, consolidate duplicates, and negotiate better terms with vendors.
          </li>
          <li>
            <strong>Set Performance Budgets:</strong> Define maximum third-party script budget (e.g., 300KB total, 5 scripts max). Enforce in CI/CD with tools like Lighthouse CI.
          </li>
          <li>
            <strong>Self-Host Critical Scripts:</strong> For critical scripts (analytics, A/B testing), consider self-hosting to control caching and reduce DNS lookups.
          </li>
          <li>
            <strong>Use a Tag Manager Wisely:</strong> Tag managers (GTM, Tealium) centralize script management but add their own overhead. Use only if you need non-technical team members to manage tags.
          </li>
          <li>
            <strong>Implement CSP with Nonce:</strong> Use nonce-based CSP for inline scripts. Generate a new nonce per request to prevent XSS even if attacker injects script.
          </li>
          <li>
            <strong>Add SRI to All External Scripts:</strong> Generate and include SRI hashes for all external scripts. Automate hash updates in your build pipeline.
          </li>
          <li>
            <strong>Monitor Script Load Failures:</strong> Track script load failures in your error tracking system. Set up alerts for elevated failure rates.
          </li>
          <li>
            <strong>Test on Slow Networks:</strong> Test script loading on 3G/slow 4G networks. Scripts that load instantly on broadband may take 5-10 seconds on mobile.
          </li>
          <li>
            <strong>Document Script Purposes:</strong> Maintain a registry of all third-party scripts with their purpose, owner, and loading strategy. Review during security audits.
          </li>
          <li>
            <strong>Have a Kill Switch:</strong> Implement a remote kill switch to disable third-party scripts if they cause issues in production.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Loading All Scripts Upfront:</strong> Loading every third-party script on page load wastes bandwidth and delays interactivity. Lazy load scripts for features users may not use.
          </li>
          <li>
            <strong>Using Blocking Scripts:</strong> Default &lt;script&gt; tags block HTML parsing. Use defer or async unless the script must run before DOM is available.
          </li>
          <li>
            <strong>No CSP or SRI:</strong> Loading scripts without CSP or SRI exposes your application to supply chain attacks. Always verify script integrity and restrict sources.
          </li>
          <li>
            <strong>Too Many Third-Party Scripts:</strong> Each script adds latency and risk. Challenge every script: is it essential? Can it be replaced with first-party code?
          </li>
          <li>
            <strong>Not Monitoring Script Performance:</strong> Third-party scripts can degrade over time as vendors add features. Monitor load times and set up alerts for regressions.
          </li>
          <li>
            <strong>Ignoring Consent Requirements:</strong> Loading tracking scripts before user consent violates GDPR and CCPA. Implement consent gating before initializing scripts.
          </li>
          <li>
            <strong>No Fallback for Script Failures:</strong> If a critical script fails to load, your application may break. Implement fallbacks and error handling.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Site: Reducing Third-Party Impact</h3>
        <p>
          <strong>Problem:</strong> E-commerce site had 15 third-party scripts (analytics, A/B testing, chat, payments, ads). Page load time was 6+ seconds on mobile, conversion rate suffering.
        </p>
        <p>
          <strong>Solution:</strong> Audited all scripts, removed 5 unused scripts. Deferred non-critical scripts. Lazy loaded chat widget on user click. Implemented CSP and SRI.
        </p>
        <p>
          <strong>Results:</strong> Page load time reduced from 6.2s to 2.8s on mobile. Conversion rate increased 18%. Security posture improved with CSP/SRI.
        </p>

        <h3>SaaS Dashboard: Script Loading Strategy</h3>
        <p>
          <strong>Problem:</strong> SaaS dashboard loaded all analytics and monitoring scripts upfront, causing slow initial render for logged-in users.
        </p>
        <p>
          <strong>Solution:</strong> Moved analytics to async loading after page load. Deferred monitoring scripts. Used dynamic import() for feature-specific scripts.
        </p>
        <p>
          <strong>Results:</strong> Time to Interactive improved from 4.5s to 1.8s. User engagement increased due to faster dashboard availability.
        </p>

        <h3>Media Site: Consent-Compliant Loading</h3>
        <p>
          <strong>Problem:</strong> Media site was loading tracking scripts before user consent, risking GDPR violations.
        </p>
        <p>
          <strong>Solution:</strong> Implemented consent banner that blocks script loading until user accepts. Used Google Consent Mode for graceful degradation.
        </p>
        <p>
          <strong>Results:</strong> Achieved GDPR compliance. 65% of users accepted tracking. Implemented fallback analytics for non-consenting users.
        </p>

        <h3>Financial Services: Security Hardening</h3>
        <p>
          <strong>Problem:</strong> Financial services company needed to ensure third-party scripts couldn&apos;t access sensitive user data.
        </p>
        <p>
          <strong>Solution:</strong> Implemented strict CSP with nonce for inline scripts. Added SRI to all external scripts. Isolated third-party widgets in iframes with sandbox attribute.
        </p>
        <p>
          <strong>Results:</strong> Passed security audit with zero findings. Reduced XSS attack surface significantly. Third-party scripts cannot access sensitive data.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is the difference between async and defer attributes on script tags?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Both async and defer allow scripts to download in parallel without blocking HTML parsing, but they differ in execution timing:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>async:</strong> Script executes as soon as it&apos;s downloaded, potentially interrupting HTML parsing. Scripts execute in arbitrary order (whoever downloads first runs first).
              </li>
              <li>
                <strong>defer:</strong> Script executes after HTML parsing completes, before DOMContentLoaded. Scripts execute in order they appear in HTML.
              </li>
            </ul>
            <p>
              Use async for independent scripts like analytics that don&apos;t depend on DOM or other scripts. Use defer for scripts that need DOM access or depend on other scripts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you secure third-party scripts against supply chain attacks?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Content Security Policy (CSP):</strong> Restrict which origins can load scripts. Use nonce-based CSP for inline scripts.
              </li>
              <li>
                <strong>Subresource Integrity (SRI):</strong> Specify cryptographic hash of expected script content. Browser refuses to execute if hash doesn&apos;t match.
              </li>
              <li>
                <strong>Self-Hosting:</strong> Host critical scripts yourself instead of relying on third-party CDNs.
              </li>
              <li>
                <strong>Regular Audits:</strong> Review third-party scripts quarterly. Remove unused scripts, verify vendor security practices.
              </li>
              <li>
                <strong>Isolation:</strong> Run untrusted scripts in iframes with sandbox attribute to limit their access.
              </li>
            </ul>
            <p>
              Defense in depth is key: use both CSP and SRI together, not either alone.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How would you optimize loading of 10+ third-party scripts on a content site?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              I would apply a systematic approach:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Audit:</strong> Identify all scripts, their purposes, and whether they&apos;re still needed. Remove unused scripts.
              </li>
              <li>
                <strong>Categorize:</strong> Classify scripts as critical (needed for initial render), non-critical (needed eventually), or optional (user-triggered).
              </li>
              <li>
                <strong>Load Strategy:</strong> Critical scripts → inline or defer. Non-critical → defer or async. Optional → lazy load on interaction.
              </li>
              <li>
                <strong>Security:</strong> Add CSP and SRI to all external scripts.
              </li>
              <li>
                <strong>Monitor:</strong> Track script load times and failures. Set up alerts for regressions.
              </li>
            </ul>
            <p>
              The goal is to minimize blocking scripts while ensuring functionality works correctly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What is the critical rendering path and how do scripts affect it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The critical rendering path is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>HTML Parsing:</strong> Browser parses HTML into DOM tree.
              </li>
              <li>
                <strong>CSS Parsing:</strong> Browser parses CSS into CSSOM tree.
              </li>
              <li>
                <strong>Render Tree:</strong> Browser combines DOM and CSSOM into render tree.
              </li>
              <li>
                <strong>Layout:</strong> Browser calculates positions and sizes of all elements.
              </li>
              <li>
                <strong>Paint:</strong> Browser paints pixels to screen.
              </li>
            </ul>
            <p className="mb-3">
              Scripts affect the critical rendering path in several ways:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Parser-Blocking:</strong> Synchronous scripts stop HTML parsing, delaying discovery of downstream resources.
              </li>
              <li>
                <strong>Render-Blocking:</strong> Scripts that manipulate DOM/CSSOM must execute before rendering can proceed.
              </li>
              <li>
                <strong>Main-Thread Blocking:</strong> Script execution competes with rendering and input handling on the main thread.
              </li>
            </ul>
            <p>
              Optimization strategies: defer non-critical scripts, minimize script size, split large scripts, and use web workers for heavy computation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you handle GDPR/CCPA compliance for third-party tracking scripts?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Consent Before Loading:</strong> Do not load tracking scripts until user explicitly consents. Use a consent management platform (CMP) or build your own consent banner.
              </li>
              <li>
                <strong>Granular Consent:</strong> Allow users to consent to different categories (analytics, advertising, functional) separately.
              </li>
              <li>
                <strong>Consent Storage:</strong> Store consent choices in localStorage. Check consent before initializing each script.
              </li>
              <li>
                <strong>Withdrawal Mechanism:</strong> Provide easy way for users to withdraw consent. Immediately disable tracking scripts when consent is withdrawn.
              </li>
              <li>
                <strong>Google Consent Mode:</strong> For Google services, implement Consent Mode to gracefully degrade functionality when consent is denied.
              </li>
              <li>
                <strong>Documentation:</strong> Document all third-party scripts and their data collection practices in your privacy policy.
              </li>
            </ul>
            <p>
              Non-compliance can result in fines up to 4% of global revenue under GDPR, so this is a critical requirement.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What is a script loading kill switch and why is it important?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              A kill switch is a mechanism to remotely disable third-party scripts in production without deploying new code.
            </p>
            <p className="mb-3">
              Implementation approaches:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Feature Flag:</strong> Wrap script loading in a feature flag. Toggle flag to disable script.
              </li>
              <li>
                <strong>Remote Config:</strong> Fetch script configuration from remote config service. Include enabled/disabled flags for each script.
              </li>
              <li>
                <strong>Consent Override:</strong> Use consent system to globally disable all third-party scripts in case of emergency.
              </li>
            </ul>
            <p>
              Kill switches are important because third-party scripts can cause production incidents: security vulnerabilities, performance regressions, or functionality breaks. A kill switch allows you to quickly mitigate impact while investigating the root cause.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: &lt;script&gt; Element
            </a> — Documentation on script loading attributes (async, defer, type).
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: Content Security Policy
            </a> — Comprehensive CSP documentation.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: Subresource Integrity
            </a> — SRI documentation and examples.
          </li>
          <li>
            <a href="https://web.dev/third-party-facades/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev: Third-Party Facades
            </a> — Pattern for lazy loading third-party embeds.
          </li>
          <li>
            <a href="https://pagespeed.web.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PageSpeed Insights
            </a> — Measure third-party script impact on performance.
          </li>
          <li>
            <a href="https://github.com/HTTPArchive/almanac.httparchive.org" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Web Almanac: Third-Party Chapter
            </a> — Annual report on third-party script usage across the web.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
