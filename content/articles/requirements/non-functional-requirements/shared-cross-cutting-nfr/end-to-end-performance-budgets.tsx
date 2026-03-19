"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-end-to-end-performance-budgets-extensive",
  title: "End-to-End Performance Budgets",
  description: "Comprehensive guide to end-to-end performance budgets, covering budget definition, allocation across layers, monitoring, and enforcement strategies for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "end-to-end-performance-budgets",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "performance", "budgets", "monitoring", "optimization", "sre"],
  relatedTopics: ["latency-slas", "page-load-performance", "scalability-strategy"],
};

export default function EndToEndPerformanceBudgetsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>End-to-End Performance Budgets</strong> are quantitative limits on performance metrics
          that span the entire system — from user interaction to backend processing and back. Unlike
          component-level budgets (frontend bundle size, API latency), end-to-end budgets define the
          total acceptable latency, resource consumption, or error rate for complete user journeys.
        </p>
        <p>
          Performance budgets answer critical questions: How long should a page take to load? What&apos;s
          the maximum acceptable latency for a search query? How much data can we transfer before the
          user experience degrades? By setting and enforcing these budgets, teams ensure consistent user
          experience and prevent performance regressions.
        </p>
        <p>
          <strong>Key characteristics of end-to-end budgets:</strong>
        </p>
        <ul>
          <li>
            <strong>User-centric:</strong> Based on user-perceived metrics (Time to Interactive, First
            Contentful Paint) rather than technical metrics alone.
          </li>
          <li>
            <strong>Cross-functional:</strong> Span frontend, backend, network, and infrastructure — all
            teams share responsibility.
          </li>
          <li>
            <strong>Enforceable:</strong> Integrated into CI/CD, with automated checks and alerts.
          </li>
          <li>
            <strong>Progressive:</strong> Different budgets for different conditions (3G vs WiFi, mobile
            vs desktop, first visit vs returning).
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Budgets Enable Trade-off Decisions</h3>
          <p>
            Performance budgets provide objective criteria for architectural decisions. When considering
            a new feature, you can ask: &quot;Does this fit within our performance budget?&quot; If not,
            you must either optimize elsewhere, increase the budget (with justification), or reconsider
            the feature.
          </p>
          <p className="mt-3">
            <strong>Without budgets:</strong> Performance degrades gradually, death by a thousand cuts.
            <strong>With budgets:</strong> Every change is evaluated against clear criteria, preventing
            incremental degradation.
          </p>
        </div>

        <p>
          This article covers performance budget definition, allocation strategies across system layers,
          monitoring and enforcement, and organizational practices for maintaining performance discipline.
        </p>
      </section>

      <section>
        <h2>Performance Budget Categories</h2>
        <p>
          Different types of budgets address different aspects of performance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Time-Based Budgets</h3>
        <p>
          Limits on latency and timing metrics:
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">Budget</th>
                <th className="p-2 text-left">User Perception</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Time to First Byte (TTFB)</td>
                <td className="p-2">{'<'} 200ms</td>
                <td className="p-2">Server responsiveness</td>
              </tr>
              <tr>
                <td className="p-2">First Contentful Paint (FCP)</td>
                <td className="p-2">{'<'} 1.5s</td>
                <td className="p-2">&quot;Something is happening&quot;</td>
              </tr>
              <tr>
                <td className="p-2">Largest Contentful Paint (LCP)</td>
                <td className="p-2">{'<'} 2.5s</td>
                <td className="p-2">&quot;Page is loaded&quot;</td>
              </tr>
              <tr>
                <td className="p-2">Time to Interactive (TTI)</td>
                <td className="p-2">{'<'} 3.5s</td>
                <td className="p-2">&quot;Page is usable&quot;</td>
              </tr>
              <tr>
                <td className="p-2">API Response Time (P95)</td>
                <td className="p-2">{'<'} 300ms</td>
                <td className="p-2">Responsive interactions</td>
              </tr>
              <tr>
                <td className="p-2">Total Page Load</td>
                <td className="p-2">{'<'} 5s</td>
                <td className="p-2">Complete loading experience</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Resource-Based Budgets</h3>
        <p>
          Limits on data transfer and resource consumption:
        </p>
        <ul>
          <li>
            <strong>Total Page Weight:</strong> Maximum total bytes transferred (e.g., {'<'} 1.5MB for
            desktop, {'<'} 500KB for mobile).
          </li>
          <li>
            <strong>JavaScript Budget:</strong> Maximum JS bytes (e.g., {'<'} 200KB gzipped for initial
            load).
          </li>
          <li>
            <strong>CSS Budget:</strong> Maximum CSS bytes (e.g., {'<'} 50KB gzipped).
          </li>
          <li>
            <strong>Image Budget:</strong> Maximum image bytes per page (e.g., {'<'} 500KB).
          </li>
          <li>
            <strong>Font Budget:</strong> Maximum font bytes (e.g., {'<'} 100KB with subset).
          </li>
          <li>
            <strong>Request Count:</strong> Maximum number of HTTP requests (e.g., {'<'} 50 requests).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Quality Budgets</h3>
        <p>
          Limits on error rates and quality metrics:
        </p>
        <ul>
          <li>
            <strong>Error Rate:</strong> Maximum acceptable error percentage (e.g., {'<'} 0.1% for
            critical paths).
          </li>
          <li>
            <strong>Core Web Vitals:</strong> Percentage of users meeting CWV thresholds (e.g., 75%
            &quot;good&quot; ratings).
          </li>
          <li>
            <strong>Frame Rate:</strong> Minimum FPS for animations (e.g., {'>'} 55 FPS for 60Hz
            displays).
          </li>
          <li>
            <strong>Cumulative Layout Shift:</strong> Maximum layout shift score (e.g., CLS {'<'} 0.1).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/performance-budget-categories.svg"
          alt="Performance Budget Categories"
          caption="Performance Budget Categories — showing time-based, resource-based, and quality budgets with example thresholds"
        />
      </section>

      <section>
        <h2>Budget Allocation Across Layers</h2>
        <p>
          End-to-end budgets must be decomposed into component budgets for each system layer.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Example: Page Load Budget Breakdown</h3>
        <p>
          For a 3-second TTI budget:
        </p>
        <ul>
          <li>
            <strong>Network (DNS + TCP + TLS):</strong> 200ms
          </li>
          <li>
            <strong>Backend Processing:</strong> 300ms
          </li>
          <li>
            <strong>HTML Download:</strong> 100ms
          </li>
          <li>
            <strong>CSS Download + Parse:</strong> 200ms
          </li>
          <li>
            <strong>JavaScript Download + Parse:</strong> 500ms
          </li>
          <li>
            <strong>JavaScript Execution:</strong> 800ms
          </li>
          <li>
            <strong>Layout + Paint:</strong> 300ms
          </li>
          <li>
            <strong>Buffer/Margin:</strong> 600ms
          </li>
        </ul>
        <p>
          <strong>Total:</strong> 3,000ms (3 seconds)
        </p>
        <p>
          Each team owns their portion: backend team owns &quot;Backend Processing,&quot; frontend team
          owns &quot;JavaScript Download + Execution,&quot; infrastructure team owns &quot;Network.&quot;
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Example: API Request Budget Breakdown</h3>
        <p>
          For a 200ms P95 API latency budget:
        </p>
        <ul>
          <li>
            <strong>Network (client to server):</strong> 30ms
          </li>
          <li>
            <strong>Load Balancer:</strong> 5ms
          </li>
          <li>
            <strong>Authentication/Authorization:</strong> 15ms
          </li>
          <li>
            <strong>Business Logic:</strong> 100ms
          </li>
          <li>
            <strong>Database Query:</strong> 40ms
          </li>
          <li>
            <strong>Response Serialization:</strong> 5ms
          </li>
          <li>
            <strong>Network (server to client):</strong> 30ms
          </li>
          <li>
            <strong>Buffer/Margin:</strong> 25ms
          </li>
        </ul>
        <p>
          <strong>Total:</strong> 250ms (with 50ms buffer for P95 variance)
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Budget Contention</h3>
        <p>
          When multiple components compete for the same budget:
        </p>
        <ul>
          <li>
            <strong>Prioritize:</strong> Critical path gets priority (e.g., above-the-fold content before
            analytics).
          </li>
          <li>
            <strong>Defer:</strong> Non-critical resources load after essential content (lazy loading).
          </li>
          <li>
            <strong>Optimize:</strong> Reduce budget consumption through optimization (compression,
            caching).
          </li>
          <li>
            <strong>Reallocate:</strong> Shift budget from over-performing components to under-performing
            ones.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/budget-allocation-layers.svg"
          alt="Budget Allocation Across Layers"
          caption="Budget Allocation — showing how end-to-end budgets decompose into frontend, backend, network, and infrastructure budgets"
        />
      </section>

      <section>
        <h2>Setting Realistic Budgets</h2>
        <p>
          Budget-setting requires balancing user expectations with technical feasibility.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Research-Driven Budgets</h3>
        <p>
          Base budgets on user perception research:
        </p>
        <ul>
          <li>
            <strong>0-100ms:</strong> Instant response — users perceive no delay.
          </li>
          <li>
            <strong>100-300ms:</strong> Noticeable but acceptable — feels responsive.
          </li>
          <li>
            <strong>300-1000ms:</strong> Clearly visible delay — users notice waiting.
          </li>
          <li>
            <strong>{'>'} 1000ms:</strong> Frustrating — users may abandon.
          </li>
        </ul>
        <p>
          <strong>Industry benchmarks:</strong> Google research shows 53% of mobile users abandon pages
          that take {'>'} 3 seconds to load. Use this as a starting point for LCP budget.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data-Driven Budgets</h3>
        <p>
          Use historical performance data:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Collect baseline:</strong> Measure current performance across user segments.
          </li>
          <li>
            <strong>Identify percentiles:</strong> P50 (median), P75, P95, P99.
          </li>
          <li>
            <strong>Set initial budget:</strong> Start at P75 or P90 — achievable but requires effort.
          </li>
          <li>
            <strong>Iterate:</strong> Gradually tighten budgets as performance improves.
          </li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Competitive Budgets</h3>
        <p>
          Benchmark against competitors:
        </p>
        <ul>
          <li>
            <strong>Measure competitors:</strong> Use tools like WebPageTest, Lighthouse to measure
            competitor performance.
          </li>
          <li>
            <strong>Set relative targets:</strong> Aim to be 10-20% faster than key competitors.
          </li>
          <li>
            <strong>Monitor:</strong> Track competitor performance over time.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Progressive Budgets</h3>
        <p>
          Different budgets for different conditions:
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Condition</th>
                <th className="p-2 text-left">LCP Budget</th>
                <th className="p-2 text-left">TTI Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Desktop + WiFi</td>
                <td className="p-2">{'<'} 2.0s</td>
                <td className="p-2">{'<'} 3.0s</td>
              </tr>
              <tr>
                <td className="p-2">Mobile + 4G</td>
                <td className="p-2">{'<'} 2.5s</td>
                <td className="p-2">{'<'} 3.5s</td>
              </tr>
              <tr>
                <td className="p-2">Mobile + 3G</td>
                <td className="p-2">{'<'} 4.0s</td>
                <td className="p-2">{'<'} 6.0s</td>
              </tr>
              <tr>
                <td className="p-2">First Visit</td>
                <td className="p-2">{'<'} 3.0s</td>
                <td className="p-2">{'<'} 4.5s</td>
              </tr>
              <tr>
                <td className="p-2">Returning (cached)</td>
                <td className="p-2">{'<'} 1.5s</td>
                <td className="p-2">{'<'} 2.0s</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Monitoring and Enforcement</h2>
        <p>
          Budgets without monitoring and enforcement are just documentation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CI/CD Integration</h3>
        <p>
          Catch regressions before deployment:
        </p>
        <ul>
          <li>
            <strong>Lighthouse CI:</strong> Run Lighthouse on every PR, fail if budgets exceeded.
          </li>
          <li>
            <strong>Webpack Bundle Analyzer:</strong> Fail builds if bundle size exceeds budget.
          </li>
          <li>
            <strong>Performance Tests:</strong> Synthetic tests in staging environment.
          </li>
          <li>
            <strong>Budget Gates:</strong> Block deployment if critical budgets violated.
          </li>
        </ul>
        <p>
          <strong>Example configuration (Lighthouse CI):</strong>
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
{`extends: lighthouse:recommended
assertions:
  first-contentful-paint: ["warn", { "maxNumericValue": 1500 }]
  largest-contentful-paint: ["error", { "maxNumericValue": 2500 }]
  total-byte-weight: ["warn", { "maxNumericValue": 1500000 }]`}
        </pre>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Real User Monitoring (RUM)</h3>
        <p>
          Track actual user experience:
        </p>
        <ul>
          <li>
            <strong>Collect metrics:</strong> Use Performance API, Navigation Timing API.
          </li>
          <li>
            <strong>Aggregate data:</strong> Calculate percentiles across user segments.
          </li>
          <li>
            <strong>Alert on violations:</strong> Page when budget violation rate exceeds threshold.
          </li>
          <li>
            <strong>Trend analysis:</strong> Track budget adherence over time.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Alerting Strategy</h3>
        <p>
          Tiered alerting based on severity:
        </p>
        <ul>
          <li>
            <strong>Warning:</strong> Budget exceeded for {'>'} 5% of users. Ticket for review.
          </li>
          <li>
            <strong>Critical:</strong> Budget exceeded for {'>'} 20% of users. Page on-call.
          </li>
          <li>
            <strong>Emergency:</strong> Budget exceeded for {'>'} 50% of users. Immediate response.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/performance-budget-monitoring.svg"
          alt="Performance Budget Monitoring"
          caption="Budget Monitoring — showing CI/CD integration, RUM data collection, alerting thresholds, and feedback loops"
        />
      </section>

      <section>
        <h2>Organizational Practices</h2>
        <p>
          Sustaining performance requires culture and process, not just tools.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Performance Champions</h3>
        <p>
          Designate performance advocates in each team:
        </p>
        <ul>
          <li>
            <strong>Role:</strong> First point of contact for performance questions.
          </li>
          <li>
            <strong>Responsibilities:</strong> Review PRs for performance impact, educate team members.
          </li>
          <li>
            <strong>Training:</strong> Advanced training in performance optimization techniques.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Performance Reviews</h3>
        <p>
          Regular performance review cadence:
        </p>
        <ul>
          <li>
            <strong>Weekly:</strong> Review RUM dashboards, discuss trends.
          </li>
          <li>
            <strong>Sprint:</strong> Include performance tasks in sprint planning.
          </li>
          <li>
            <strong>Quarterly:</strong> Deep dive on performance metrics, adjust budgets.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Performance Culture</h3>
        <p>
          Build a culture that values performance:
        </p>
        <ul>
          <li>
            <strong>Education:</strong> Regular training sessions on performance best practices.
          </li>
          <li>
            <strong>Visibility:</strong> Public dashboards showing performance metrics.
          </li>
          <li>
            <strong>Accountability:</strong> Teams own their portion of the budget.
          </li>
          <li>
            <strong>Celebration:</strong> Recognize performance improvements and wins.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Pitfalls</h3>
        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">Setting Unrealistic Budgets</h3>
          <p>
            Budgets that are too strict will be ignored; too loose provide no value. Start achievable,
            tighten gradually.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">Focusing Only on Averages</h3>
          <p>
            P50 (median) hides poor experiences. Always track P75, P95, P99 percentiles.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">Desktop-Only Budgets</h3>
          <p>
            Mobile users often have worse network and devices. Set separate (stricter relative) budgets
            for mobile.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">No Enforcement</h3>
          <p>
            Budgets without CI/CD gates and alerts become suggestions. Integrate enforcement into
            development workflow.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a performance budget and why is it important?</p>
            <p className="mt-2 text-sm">
              A: A performance budget defines quantitative limits on performance metrics (latency, bundle
              size, etc.). Important because: (1) Prevents incremental degradation, (2) Enables objective
              trade-off decisions, (3) Aligns teams on performance goals, (4) Catches regressions early.
              Without budgets, performance dies by a thousand cuts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you allocate a 3-second TTI budget across system layers?</p>
            <p className="mt-2 text-sm">
              A: Example breakdown: Network (DNS+TCP+TLS) 200ms, Backend Processing 300ms, HTML Download
              100ms, CSS Download+Parse 200ms, JS Download+Parse 500ms, JS Execution 800ms, Layout+Paint
              300ms, Buffer 600ms. Each team owns their portion. Adjust based on your architecture.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you enforce performance budgets in CI/CD?</p>
            <p className="mt-2 text-sm">
              A: Integrate tools like Lighthouse CI, webpack-bundle-analyzer, and synthetic performance
              tests. Configure thresholds that fail builds when exceeded. Run on every PR before merge.
              Combine with RUM for production monitoring. Alert when budget violation rate exceeds
              threshold.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics would you include in a performance budget?</p>
            <p className="mt-2 text-sm">
              A: Time-based: TTFB, FCP, LCP, TTI, API latency. Resource-based: Total page weight, JS
              bundle size, image size, request count. Quality: Error rate, Core Web Vitals pass rate,
              CLS score. Choose metrics that reflect user experience for your specific use case.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle budget violations?</p>
            <p className="mt-2 text-sm">
              A: Tiered response: (1) Warning (5%+ users affected) — ticket for review, (2) Critical
              (20%+ users) — page on-call, (3) Emergency (50%+ users) — immediate response. Investigate
              root cause, fix or rollback, document learnings. Track violation trends to identify
              systemic issues.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you set performance budgets for a new product?</p>
            <p className="mt-2 text-sm">
              A: Start with industry benchmarks (LCP {'<'} 2.5s, TTI {'<'} 3.5s). Measure competitor
              performance. Collect baseline data if possible. Set initial budgets at P75-P90 of expected
              performance. Tighten gradually as you optimize. Adjust for target markets (mobile vs
              desktop, geographic regions).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/performance-budgets-101/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Performance Budgets 101
            </a>
          </li>
          <li>
            <a href="https://developers.google.com/web/tools/lighthouse" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Lighthouse — Performance Auditing
            </a>
          </li>
          <li>
            <a href="https://speedcurve.com/blog/performance-budgets/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              SpeedCurve — Performance Budgets Guide
            </a>
          </li>
          <li>
            <a href="https://calendar.perfplanet.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Performance Calendar
            </a>
          </li>
          <li>
            <a href="https://www.smashingmagazine.com/2020/02/performance-budgets-tooling/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Smashing Magazine — Performance Budget Tooling
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
