"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-performance-budgets",
  title: "Performance Budgets",
  description: "Comprehensive guide to setting, enforcing, and maintaining measurable limits for frontend performance metrics including bundle size, Core Web Vitals, and resource budgets.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "performance-budgets",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "performance-budgets", "bundle-size", "CI/CD", "Lighthouse", "web-vitals", "monitoring"],
  relatedTopics: ["web-vitals", "bundle-size-optimization", "code-splitting", "monitoring-observability"],
};

export default function PerformanceBudgetsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          A <strong>performance budget</strong> is a set of{" "}
          <Highlight tier="important">measurable, enforceable limits</Highlight> on metrics that 
          directly impact user experience — including JavaScript bundle size, CSS payload, image weight, 
          Core Web Vitals thresholds (LCP, INP, CLS), and overall page load time. When any metric exceeds 
          its budget, the violation is treated like a{" "}
          <Highlight tier="important">failing test</Highlight>: the CI build fails, the pull request 
          is blocked, or an alert fires to notify the team.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Performance budgets address a fundamental problem in software development: <strong>performance 
          regression is invisible until it&apos;s catastrophic</strong>. Each feature adds &quot;just a 
          few kilobytes&quot; of JavaScript. Each new library seems &quot;worth the trade-off.&quot; Each 
          design iteration adds &quot;only a couple images.&quot; Individually, these decisions seem 
          reasonable. Collectively, they compound into a 5-megabyte page that takes 15 seconds to load on 
          mobile — and by then, it&apos;s too late to fix without major rework.
        </HighlightBlock>
        <p>
          Performance budgets make this invisible creep visible and enforceable. They shift the conversation 
          from subjective debates (&quot;is this fast enough?&quot;) to objective decisions (&quot;does this 
          exceed our agreed limit?&quot;). A budget of 200KB for initial JavaScript means that a PR adding 
          a 15KB dependency when you&apos;re at 195KB will fail CI. The team must then make an explicit 
          choice: optimize existing code, remove something else, or grant a documented exception.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/performance-budgets-types.svg"
          alt="Diagram showing different types of performance budgets: quantity-based (bundle size, image weight), timing-based (LCP, FCP, TBT), and rule-based (Lighthouse score)"
          caption="Performance budgets span three categories: quantity limits, timing thresholds, and quality scores"
          captionTier="important"
        />

        <p>
          The business case for performance budgets is well-documented through industry research:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Amazon:</strong> Every 100ms of latency cost them 1% in sales. This finding led to 
            strict performance budgets across all customer-facing surfaces.
          </li>
          <li>
            <strong>Google:</strong> A 500ms increase in search result display time reduced traffic by 20%. 
            Google now enforces budgets through automated monitoring and alerting.
          </li>
          <li>
            <strong>Pinterest:</strong> Reducing perceived wait times by 40% (through budget enforcement) 
            increased search engine traffic by 15%.
          </li>
          <li>
            <strong>COOK:</strong> Reducing load time by 0.85 seconds through budget-driven optimization 
            increased conversions by 7%.
          </li>
          <li>
            <strong>Vodafone:</strong> Improving LCP by 31% (via budget enforcement) increased sales by 8%.
          </li>
        </ul>

        <HighlightBlock as="p" tier="important">
          Performance budgets are not aspirational goals — they are <strong>hard limits</strong> backed by 
          business metrics. An aspirational goal says &quot;we&apos;d like LCP under 2.5 seconds.&quot; A 
          budget says &quot;LCP must be under 2.5 seconds for 75% of users, and violations block deployment.&quot; 
          The distinction matters because budgets require accountability.
        </HighlightBlock>

        <p>
          In system design interviews, performance budgets demonstrate understanding of measurable quality 
          attributes, the connection between technical metrics and business outcomes, and the operational 
          practices required to maintain performance at scale. They show you think about performance as a 
          system property, not an afterthought.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Core concept: budgets are constraints you enforce continuously. A senior approach defines budgets by
          surface (mobile vs desktop), ties them to business outcomes, and makes violations actionable.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Budgets should cover both &quot;bytes&quot; (JS/CSS/images) and &quot;experience&quot; (LCP/INP/CLS at p75).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Without an exception process, teams either bypass budgets or slow down entirely. Senior ownership defines the process.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/performance-budgets-ci-pipeline.svg"
          alt="CI/CD pipeline diagram showing performance budget checks at build time, PR validation, and production monitoring stages"
          caption="Performance budget enforcement spans the entire development lifecycle: build, PR, deploy, and monitor"
        />

        <h3>Types of Performance Budgets</h3>
        <p>
          Performance budgets fall into three categories, each serving different purposes and enforced at 
          different stages of development:
        </p>

        <h4>Quantity-Based Budgets</h4>
        <p>
          Quantity budgets set limits on the raw size or count of resources delivered to the browser. They 
          are the simplest to measure and enforce because they don&apos;t require running a full page load 
          test — just analyzing build output.
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Total JavaScript (compressed):</strong> Target: ≤ 200KB for initial load, ≤ 500KB total. 
            JavaScript is the most expensive byte-for-byte asset because it must be parsed, compiled, and 
            executed — not just downloaded.
          </HighlightBlock>
          <li>
            <strong>Total CSS:</strong> Target: ≤ 50KB. CSS is render-blocking; large stylesheets delay 
            First Contentful Paint (FCP).
          </li>
          <li>
            <strong>Total image weight:</strong> Target: ≤ 500KB for above-the-fold images, ≤ 1MB total for 
            initial page load. Images dominate page weight on most sites (50-70%).
          </li>
          <li>
            <strong>Total page weight:</strong> Target: ≤ 1MB total. Users on slow or metered connections 
            feel every extra kilobyte.
          </li>
          <li>
            <strong>Number of HTTP requests:</strong> Target: ≤ 50 total requests. Each request has overhead 
            (DNS lookup, TCP handshake, TLS negotiation), especially on HTTP/1.1.
          </li>
          <li>
            <strong>Number of third-party scripts:</strong> Target: ≤ 10 third-party scripts. Third-party 
            scripts are the leading cause of performance regression because they&apos;re outside your 
            direct control.
          </li>
        </ul>

        <h4>Timing-Based Budgets</h4>
        <p>
          Timing budgets set limits on user-facing performance metrics measured during a real or simulated 
          page load. These require tools like Lighthouse, WebPageTest, or Real User Monitoring (RUM) to measure.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Largest Contentful Paint (LCP):</strong> Target: ≤ 2.5 seconds for 75th percentile of 
            users. LCP measures when the largest content element renders — typically the hero image or main 
            heading.
          </li>
          <li>
            <strong>First Contentful Paint (FCP):</strong> Target: ≤ 1.8 seconds. FCP measures when the 
            browser first renders any text or image.
          </li>
          <li>
            <strong>Total Blocking Time (TBT):</strong> Target: ≤ 200ms. TBT measures how long the main 
            thread is blocked by long tasks (tasks &gt; 50ms) between FCP and Time to Interactive.
          </li>
          <li>
            <strong>Time to Interactive (TTI):</strong> Target: ≤ 3.8 seconds. TTI measures when the page 
            becomes fully interactive (responds to input within 50ms).
          </li>
          <li>
            <strong>Cumulative Layout Shift (CLS):</strong> Target: ≤ 0.1. CLS measures visual stability — 
            how much content jumps around during load.
          </li>
          <li>
            <strong>Interaction to Next Paint (INP):</strong> Target: ≤ 200ms. INP measures the latency of 
            the worst interaction throughout the page&apos;s lifetime.
          </li>
        </ul>

        <h4>Rule-Based Budgets</h4>
        <p>
          Rule-based budgets use composite scores from auditing tools as the threshold. The most common is 
          a minimum Lighthouse performance score.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Lighthouse Performance Score:</strong> Target: ≥ 90. Lighthouse aggregates multiple 
            metrics into a single 0-100 score. Easy to communicate to stakeholders but less precise than 
            individual metric budgets.
          </li>
          <li>
            <strong>Accessibility Score:</strong> Target: ≥ 90. Ensures performance optimization doesn&apos;t 
            come at the cost of accessibility.
          </li>
          <li>
            <strong>Best Practices Score:</strong> Target: ≥ 90. Catches issues like deprecated APIs, 
            security vulnerabilities, and anti-patterns.
          </li>
        </ul>

        <h3>Budget Thresholds: The 75th Percentile Rule</h3>
        <p>
          Google uses the <strong>75th percentile</strong> of page loads across all users as the threshold 
          for Core Web Vitals. This means 75% of users should have a &quot;Good&quot; experience. The 75th 
          percentile rule has important implications:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Optimizing for average isn&apos;t sufficient.</strong> If your average LCP is 2.0s but 
            your 75th percentile is 3.5s, you&apos;re failing the budget.
          </li>
          <li>
            <strong>Focus on the worst 25% of experiences.</strong> The 75th percentile rule forces teams 
            to improve performance for users on slow devices and networks — not just optimize for 
            high-end development machines.
          </li>
          <li>
            <strong>Segment by device and network.</strong> Mobile users on 3G will have vastly different 
            performance than desktop users on fiber. Budgets should be segmented accordingly.
          </li>
        </ul>

        <h3>Lab Data vs. Field Data</h3>
        <p>
          Performance budgets can be enforced using two complementary data sources:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Lab Data (Synthetic):</strong> Controlled tests run in tools like Lighthouse, 
            WebPageTest, or Chrome DevTools. Lab data is reproducible (same conditions = same result), 
            debuggable (easy to identify specific issues), and suitable for CI/CD gates. However, it may 
            not reflect real user conditions and cannot measure INP (which needs real interactions).
          </li>
          <li>
            <strong>Field Data (Real User Monitoring):</strong> Data collected from actual users visiting 
            your site via the Chrome UX Report (CrUX), the web-vitals JavaScript library, or commercial 
            RUM providers. Field data reflects real-world conditions (actual devices, networks, user 
            behavior) and is what Google uses for SEO ranking. However, it&apos;s variable (results vary 
            by user) and harder to debug.
          </li>
        </ul>
        <p>
          Effective performance budgets use <strong>both</strong>: lab data for development and CI/CD 
          gates, field data for monitoring and SEO validation.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          The workflow is: define metrics → collect lab + field → enforce in CI → monitor in prod → run an
          exception process. Interviewers want the operational loop, not just the definition.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Make enforcement automated: PR comments, failing checks, and dashboards. Manual policing doesn&apos;t scale.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Segment architecture by device and geography; the budget that passes on desktop can fail badly on mobile.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/performance-budgets-monitoring.svg"
          alt="Monitoring architecture showing performance budget tracking from CI/CD through production RUM with alerting feedback loop"
          caption="Performance budget monitoring spans development, deployment, and production with automated alerting"
        />

        <h3>Setting Performance Budgets</h3>
        <p>
          Setting effective budgets requires a systematic approach. Start with measurement, then iterate 
          toward increasingly strict limits.
        </p>

        <h4>Step 1: Establish Baseline</h4>
        <p>
          Run comprehensive performance audits on your key pages (homepage, product pages, checkout flow, 
          etc.) to understand current performance:
        </p>
        <ul className="space-y-2">
          <li>
            Run 3-5 Lighthouse audits per page on different network conditions (simulated 3G, 4G, fast 
            broadband). Take the median result.
          </li>
          <li>
            Record compressed bundle sizes from your build output. Use tools like webpack-bundle-analyzer 
            or source-map-explorer to understand composition.
          </li>
          <li>
            Pull Core Web Vitals data from CrUX or your RUM provider. Note the 75th percentile values for 
            mobile and desktop separately.
          </li>
          <li>
            Document third-party scripts and their impact. Tools like RequestMap or Chrome DevTools 
            Coverage tab can help.
          </li>
        </ul>

        <h4>Step 2: Benchmark Competitors</h4>
        <p>
          Test 2-3 competing sites on WebPageTest with identical settings. Your budgets should aim to 
          match or beat them — users compare experiences subconsciously. If your competitor&apos;s 
          product page loads in 2.1s and yours takes 4.5s, users will perceive your site as &quot;slow&quot; 
          regardless of absolute metrics.
        </p>

        <h4>Step 3: Set Initial Budget</h4>
        <p>
          Your initial budget should be at or slightly below your current baseline — the first goal is to 
          <strong>stop regression</strong>, not achieve perfection overnight.
        </p>
        <ul className="space-y-2">
          <li>
            If your JavaScript bundle is 250KB, set the budget at 200KB. This forces optimization before 
            new features can land.
          </li>
          <li>
            If your LCP is 3.2s, set the budget at 2.8s initially, then tighten to 2.5s over subsequent 
            quarters.
          </li>
          <li>
            Create per-route budgets for critical paths. The homepage, product page, and checkout page 
            likely have different budgets. A one-size-fits-all budget is less effective.
          </li>
        </ul>

        <h4>Step 4: Revisit Quarterly</h4>
        <p>
          Budgets should tighten over time as you optimize, not loosen as features accumulate. Schedule 
          quarterly budget reviews to:
        </p>
        <ul className="space-y-2">
          <li>Review current performance against budgets</li>
          <li>Tighten budgets by 10-20% if targets are consistently met</li>
          <li>Add new budget categories as needed (e.g., third-party script limits)</li>
          <li>Document exceptions and create follow-up tickets</li>
        </ul>

        <h3>Enforcing Budgets in CI/CD</h3>
        <p>
          Budgets without enforcement are merely suggestions. Effective teams integrate budget checks at 
          multiple stages of the development workflow.
        </p>

        <h4>Build-Time Checks</h4>
        <p>
          Bundle size budgets can be enforced at build time using tools like size-limit or webpack&apos;s 
          performance hints. These checks are fast (no page load required) and catch regressions early.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>size-limit:</strong> A npm package that checks JavaScript size limits. Supports 
            per-file budgets, import-specific budgets, and integrates with GitHub Actions.
          </li>
          <li>
            <strong>webpack performance hints:</strong> Built-in webpack configuration that warns or 
            errors when assets exceed size thresholds.
          </li>
          <li>
            <strong>bundlesize:</strong> Similar to size-limit, with support for gzip/brotli compression 
            estimates.
          </li>
        </ul>

        <h4>Pull Request Checks</h4>
        <p>
          Lighthouse CI runs automated performance audits on every PR, comparing results against budgets 
          and posting comments with before/after metrics.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Lighthouse CI:</strong> Runs Lighthouse audits in CI, compares against budgets, and 
            posts PR comments showing regressions in red.
          </li>
          <li>
            <strong>size-limit-action:</strong> GitHub Action that posts bundle size diffs as PR comments.
          </li>
          <li>
            <strong>Calibre:</strong> Commercial service that runs synthetic tests on PRs and posts 
            performance comparisons.
          </li>
        </ul>

        <h4>Production Monitoring</h4>
        <p>
          Field data monitoring catches regressions that slip through CI (e.g., performance degradation 
          on specific devices or networks).
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Chrome UX Report (CrUX):</strong> Google&apos;s public dataset of real user performance 
            data. Updated monthly, powers Search Console&apos;s Core Web Vitals report.
          </li>
          <li>
            <strong>web-vitals library:</strong> Google&apos;s JavaScript library for measuring Core Web 
            Vitals in production. Send data to your analytics platform for custom dashboards.
          </li>
          <li>
            <strong>Commercial RUM providers:</strong> Datadog RUM, New Relic Browser, SpeedCurve, and 
            others provide real-time performance monitoring with alerting.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <HighlightBlock as="p" tier="crucial">
          Budgets are a governance mechanism. The real trade-off is{" "}
          <Highlight tier="important">product velocity vs performance debt</Highlight>. Staff-level ownership
          means picking budgets that are enforceable, segmented (mobile vs desktop), and paired with an
          explicit exception process.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Budgets should be scoped to where users feel pain: initial route (LCP/INP), key flows (checkout),
          and slowest cohorts (mid-tier mobile). A single global budget invites gaming; segmented budgets
          (device, route, geography) keep the system honest.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Lab budgets are great for catching regressions early, but success is field p75. Strong answers
          describe a loop: enforce in CI (synthetic), then validate with RUM/CrUX (real users) before tightening thresholds.
        </HighlightBlock>

        <h3>Budget Strictness Trade-offs</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Budget Level</th>
                <th className="p-3 text-left">Pros</th>
                <th className="p-3 text-left">Cons</th>
                <th className="p-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Aggressive</td>
                <td className="p-3">Best UX, strong performance culture</td>
                <td className="p-3">
                  <Highlight tier="important">Slower feature velocity, frequent violations</Highlight>
                </td>
                <td className="p-3">Consumer-facing sites, e-commerce</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Moderate</td>
                <td className="p-3">Balanced UX and velocity</td>
                <td className="p-3">May not differentiate on performance</td>
                <td className="p-3">SaaS applications, B2B products</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Lenient</td>
                <td className="p-3">Fast feature development</td>
                <td className="p-3">Performance debt accumulates</td>
                <td className="p-3">Internal tools, early-stage products</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Enforcement Tool Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Tool</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Speed</th>
                <th className="p-3 text-left">Accuracy</th>
                <th className="p-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">size-limit</td>
                <td className="p-3">Bundle size</td>
                <td className="p-3">Fast (&lt;10s)</td>
                <td className="p-3">High for size</td>
                <td className="p-3">JavaScript/CSS size budgets</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Lighthouse CI</td>
                <td className="p-3">Synthetic audit</td>
                <td className="p-3">Medium (30-60s)</td>
                <td className="p-3">High for lab data</td>
                <td className="p-3">Core Web Vitals, Lighthouse scores</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">web-vitals (RUM)</td>
                <td className="p-3">Field data</td>
                <td className="p-3">Real-time</td>
                <td className="p-3">High for real users</td>
                <td className="p-3">Production monitoring, SEO</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">webpack hints</td>
                <td className="p-3">Build-time</td>
                <td className="p-3">Fast (build time)</td>
                <td className="p-3">Medium</td>
                <td className="p-3">Quick size checks during build</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>When Budgets Aren&apos;t Worth It</h3>
        <ul className="space-y-2">
          <li>
            <strong>Small Applications:</strong> If your total bundle is already &lt;200KB and LCP is 
            under 2s, aggressive budget enforcement may not be worth the engineering overhead.
          </li>
          <li>
            <strong>Internal Tools:</strong> For dashboards used on corporate networks with fast 
            connections, load time may not impact business metrics significantly.
          </li>
          <li>
            <strong>Early Stage Products:</strong> In the validation phase, development speed often 
            matters more than optimal performance. Budgets can be introduced post-product-market fit.
          </li>
          <li>
            <strong>Diminishing Returns:</strong> Going from 2MB to 500KB has huge impact. Going from 
            500KB to 400KB may not be noticeable to users. Focus budgets where they matter.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Best practices: start with baseline, tighten gradually, segment budgets, and make budget failures
          visible in PRs so performance doesn&apos;t become invisible debt.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Use budgets as guardrails, not goals: they should block regressions and force explicit trade-off discussions.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Validate with field data. Passing Lighthouse while failing real-user p75 is not success.
        </HighlightBlock>

        <h3>Start with Quantity Budgets</h3>
        <p>
          Quantity budgets (bundle size, image weight) are the easiest to enforce and provide immediate 
          feedback. Start here before moving to timing budgets.
        </p>
        <ul className="space-y-1">
          <li>• Set JavaScript budget at 200KB for initial load</li>
          <li>• Set total page weight budget at 1MB</li>
          <li>• Set image budget at 500KB for above-the-fold</li>
          <li>• Limit third-party scripts to 10 maximum</li>
        </ul>

        <h3>Enforce in CI/CD, Not Just Production</h3>
        <p>
          Catching regressions in production is too late. Integrate budget checks at multiple stages:
        </p>
        <ul className="space-y-1">
          <li>• Build-time: size-limit for bundle sizes</li>
          <li>• PR-time: Lighthouse CI for Core Web Vitals</li>
          <li>• Pre-deploy: Synthetic tests on staging environment</li>
          <li>• Production: RUM monitoring with alerting</li>
        </ul>

        <h3>Set Per-Route Budgets</h3>
        <p>
          Different pages have different performance characteristics and business importance:
        </p>
        <ul className="space-y-1">
          <li>• Homepage: Strictest budgets (first impression)</li>
          <li>• Product/Landing pages: Strict budgets (conversion impact)</li>
          <li>• Checkout flow: Strict budgets (direct revenue impact)</li>
          <li>• Internal/admin pages: Lenient budgets (user tolerance higher)</li>
        </ul>

        <h3>Document Exceptions</h3>
        <p>
          When a budget must be exceeded, require:
        </p>
        <ul className="space-y-1">
          <li>• Written justification explaining the business value</li>
          <li>• Approval from tech lead or performance champion</li>
          <li>• Follow-up ticket to address the regression later</li>
          <li>• Budget adjustment only for the specific route/metric</li>
        </ul>

        <h3>Monitor the 75th Percentile</h3>
        <p>
          Don&apos;t optimize for average — optimize for the 75th percentile:
        </p>
        <ul className="space-y-1">
          <li>• Segment data by device (mobile, tablet, desktop)</li>
          <li>• Segment by network (3G, 4G, WiFi)</li>
          <li>• Segment by geography (different infrastructure quality)</li>
          <li>• Focus improvement efforts on the worst 25% of experiences</li>
        </ul>

        <h3>Review Budgets Quarterly</h3>
        <p>
          Performance budgets should evolve:
        </p>
        <ul className="space-y-1">
          <li>• Tighten budgets by 10-20% if consistently met</li>
          <li>• Add new budget categories as needed</li>
          <li>• Remove budgets that aren&apos;t providing value</li>
          <li>• Update based on industry benchmarks and competitor analysis</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Setting Unrealistic Budgets</h3>
        <HighlightBlock as="p" tier="crucial">
          Setting a 100KB JavaScript budget for a complex React application sets the team up for failure. 
          Unrealistic budgets get ignored or disabled.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Start at your current baseline or 20% below. Tighten gradually over 
          quarters as optimization wins accumulate.
        </p>

        <h3>Enforcing Only in Production</h3>
        <HighlightBlock as="p" tier="important">
          Catching budget violations after deployment means users experienced the regression. By then, 
          it&apos;s harder to roll back.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Integrate budget checks in CI/CD. Block PRs that violate budgets. 
          Use production monitoring as a safety net, not the primary enforcement mechanism.
        </p>

        <h3>Ignoring Third-Party Scripts</h3>
        <HighlightBlock as="p" tier="important">
          Third-party scripts (analytics, ads, chat widgets, A/B testing) often account for 30-50% of 
          JavaScript payload but receive less scrutiny than first-party code.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Set explicit third-party script budgets. Require performance review 
          before adding new third-party scripts. Use tools like RequestMap to visualize third-party impact.
        </p>

        <h3>Not Segmenting by Device</h3>
        <p>
          A budget that passes on desktop may fail catastrophically on mobile. Mobile devices have slower 
          CPUs, less memory, and often slower networks.
        </p>
        <p>
          <strong>Solution:</strong> Set separate budgets for mobile and desktop. Test on real mobile 
          devices, not just desktop simulation.
        </p>

        <h3>Budget Fatigue</h3>
        <p>
          Teams can become desensitized to budget violations if they occur frequently. &quot;Oh, the build 
          failed again? Just bump the budget.&quot;
        </p>
        <p>
          <strong>Solution:</strong> Make budget violations visible (PR comments, Slack alerts). Require 
          explicit exception approval. Celebrate when budgets are met.
        </p>

        <h3>Focusing Only on Lab Data</h3>
        <p>
          A page can score 100 on Lighthouse but fail Core Web Vitals in the field. Lab data is controlled; 
          real users have varying devices and networks.
        </p>
        <p>
          <strong>Solution:</strong> Always validate optimizations with field data (CrUX, RUM). Use lab 
          data for debugging, field data for success criteria.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Use cases should show enforcement working: catching regressions pre-deploy, preventing third-party
          bloat, and keeping mobile INP/LCP within agreed SLOs.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Use cases should include what happened culturally: budgets changed behavior (dependency choices, review discipline, performance ownership).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Include the exception story: what required an exception, how it was approved, and how you paid it down later.
        </HighlightBlock>

        <h3>E-Commerce Site: Budget-Driven Optimization</h3>
        <p>
          An e-commerce site implemented strict performance budgets after noticing mobile conversion rates 
          lagging behind desktop.
        </p>
        <p>
          <strong>Budgets set:</strong>
        </p>
        <ul className="space-y-1">
          <li>• Initial JavaScript: ≤ 170KB</li>
          <li>• LCP: ≤ 2.0s for 75th percentile mobile users</li>
          <li>• CLS: ≤ 0.05</li>
          <li>• Lighthouse score: ≥ 90</li>
        </ul>
        <p>
          <strong>Optimization actions:</strong>
        </p>
        <ul className="space-y-1">
          <li>• Replaced moment.js with date-fns (300KB → 15KB)</li>
          <li>• Implemented route-based code splitting</li>
          <li>• Lazy-loaded below-the-fold images with blur-up placeholders</li>
          <li>• Inlined critical CSS, deferred non-critical styles</li>
        </ul>
        <p>
          <strong>Results:</strong> Mobile conversion rate increased 22%. Organic search traffic increased 
          18% after Core Web Vitals improvement.
        </p>

        <h3>SaaS Dashboard: Third-Party Script Budget</h3>
        <p>
          A B2B SaaS dashboard had 25 third-party scripts (analytics, heatmaps, chat, A/B testing, etc.) 
          totaling 800KB.
        </p>
        <p>
          <strong>Budget set:</strong> Maximum 10 third-party scripts, 300KB total.
        </p>
        <p>
          <strong>Optimization actions:</strong>
        </p>
        <ul className="space-y-1">
          <li>• Audited all third-party scripts for usage and business value</li>
          <li>• Removed 10 unused or low-value scripts</li>
          <li>• Consolidated analytics (Google Analytics + Hotjar → GA4 with custom events)</li>
          <li>• Lazy-loaded chat widget (only loads after user interaction)</li>
        </ul>
        <p>
          <strong>Results:</strong> Third-party JavaScript reduced from 800KB to 250KB. Time to Interactive 
          improved from 6.2s to 2.8s on 3G.
        </p>

        <h3>News Publisher: CI/CD Budget Enforcement</h3>
        <p>
          A news publisher implemented Lighthouse CI with strict budgets after noticing performance 
          regression over time.
        </p>
        <p>
          <strong>Budgets set:</strong>
        </p>
        <ul className="space-y-1">
          <li>• Lighthouse Performance: ≥ 90</li>
          <li>• LCP: ≤ 2.5s</li>
          <li>• TBT: ≤ 200ms</li>
          <li>• CLS: ≤ 0.1</li>
        </ul>
        <p>
          <strong>Implementation:</strong> Lighthouse CI integrated with GitHub Actions. Every PR runs 
          audits on staging. PR comments show before/after metrics. Builds fail if budgets exceeded.
        </p>
        <p>
          <strong>Results:</strong> Performance stabilized at &quot;Good&quot; levels across all Core Web 
          Vitals. Bounce rate decreased by 12%. Articles per session increased by 8%.
        </p>

        <h3>Marketing Site: Aggressive Budgets for SEO</h3>
        <p>
          A marketing site implemented aggressive budgets to improve SEO ranking.
        </p>
        <p>
          <strong>Budgets set:</strong>
        </p>
        <ul className="space-y-1">
          <li>• Total page weight: ≤ 500KB</li>
          <li>• LCP: ≤ 1.5s</li>
          <li>• Lighthouse: ≥ 95</li>
        </ul>
        <p>
          <strong>Optimization actions:</strong>
        </p>
        <ul className="space-y-1">
          <li>• Static site generation (no client-side JavaScript for content pages)</li>
          <li>• Inline critical CSS, preload fonts</li>
          <li>• AVIF images with responsive srcset</li>
          <li>• Removed all non-essential third-party scripts</li>
        </ul>
        <p>
          <strong>Results:</strong> Organic search ranking improved from page 2 to page 1 for target 
          keywords. Organic traffic increased 45% over 6 months.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview bar: define budgets, show how you enforce them in CI and monitor in prod, and explain how you keep teams productive (baselines + exceptions).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Strong answers mention segmentation (mobile/desktop), p75 targets, and an automated feedback loop.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Bring up third-party scripts explicitly; they often dominate regressions in real products.
        </HighlightBlock>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is a performance budget and why is it important?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <HighlightBlock as="p" tier="important" className="mb-3">
              A performance budget is a set of measurable, enforceable limits on metrics that impact user 
              experience — including bundle size (JavaScript, CSS, images), Core Web Vitals (LCP, INP, CLS), 
              and page load time. When any metric exceeds its budget, the violation triggers a failure: the 
              CI build fails, the PR is blocked, or an alert fires.
            </HighlightBlock>
            <HighlightBlock as="p" tier="crucial" className="mb-3">
              Performance budgets are important because <strong>performance regression is invisible until 
              it&apos;s catastrophic</strong>. Each feature adds &quot;just a few kilobytes,&quot; each 
              library seems &quot;worth the trade-off,&quot; and collectively they compound into a 
              5-megabyte page. Budgets make this invisible creep visible and enforceable. They shift 
              conversations from subjective (&quot;is this fast enough?&quot;) to objective (&quot;does 
              this exceed our limit?&quot;).
            </HighlightBlock>
            <p>
              Industry research shows direct business impact: Amazon found every 100ms of latency cost 1% 
              in sales; Google found a 500ms delay reduced traffic by 20%. Budgets protect against these 
              losses by enforcing performance as a non-negotiable quality attribute.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What are the different types of performance budgets?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">There are three main types of performance budgets:</p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Quantity-Based Budgets:</strong> Limits on resource sizes — JavaScript (≤200KB 
                initial), CSS (≤50KB), images (≤500KB above-the-fold), total page weight (≤1MB), HTTP 
                requests (≤50), third-party scripts (≤10). These are easiest to enforce at build time.
              </li>
              <li>
                <strong>Timing-Based Budgets:</strong> Limits on user-facing metrics — LCP (≤2.5s), FCP 
                (≤1.8s), TBT (≤200ms), TTI (≤3.8s), CLS (≤0.1), INP (≤200ms). These require synthetic 
                testing or RUM to measure.
              </li>
              <li>
                <strong>Rule-Based Budgets:</strong> Composite scores like Lighthouse Performance (≥90), 
                Accessibility (≥90), Best Practices (≥90). Easy to communicate but less precise than 
                individual metrics.
              </li>
            </ul>
            <p>
              Effective teams use a mix of all three types, enforced at different stages of development.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you enforce performance budgets in CI/CD?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">Performance budgets should be enforced at multiple stages:</p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Build-Time:</strong> Use tools like size-limit or webpack performance hints to 
                check bundle sizes. These are fast (&lt;10s) and catch regressions early. Example: 
                size-limit configured to fail if JavaScript exceeds 200KB.
              </li>
              <li>
                <strong>Pull Request:</strong> Use Lighthouse CI to run synthetic audits on every PR. 
                Lighthouse CI compares results against budgets and posts PR comments showing before/after 
                metrics with regressions highlighted in red.
              </li>
              <li>
                <strong>Pre-Deploy:</strong> Run synthetic tests on staging environment before deployment. 
                Tools like WebPageTest or Calibre can test on real devices and networks.
              </li>
              <li>
                <strong>Production:</strong> Use Real User Monitoring (RUM) with the web-vitals library 
                or commercial providers (Datadog, New Relic) to monitor field data. Set up alerts when 
                75th percentile metrics exceed budgets.
              </li>
            </ul>
            <p>
              The key is catching regressions as early as possible — ideally before code is merged, not 
              after users are affected.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What do you do when a budget is exceeded?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">When a budget is exceeded, the team has four options:</p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Optimize:</strong> Can you reduce the impact? Tree-shake unused exports, 
                code-split the new feature, compress images further, or replace a heavy library with a 
                lighter alternative. Example: Replace lodash (70KB) with lodash-es (2KB per function).
              </li>
              <li>
                <strong>Remove:</strong> Is there dead code, an unused dependency, or a feature with low 
                usage that can be dropped to make room? Regular dependency audits often find 10-20% of 
                libraries are unused.
              </li>
              <li>
                <strong>Defer:</strong> Can the feature be lazy-loaded so it doesn&apos;t affect the 
                critical path? Moving code behind a dynamic import often keeps the initial budget intact.
              </li>
              <li>
                <strong>Exception:</strong> If the feature is high-value and cannot be optimized further, 
                document the exception with written justification, require approval from tech lead, and 
                create a follow-up ticket to address the regression later.
              </li>
            </ul>
            <p>
              The worst response is to disable the check or raise budgets silently. This erodes the culture 
              around performance and makes budgets meaningless within weeks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What is the 75th percentile rule and why does it matter?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Google uses the <strong>75th percentile</strong> of page loads across all users as the 
              threshold for Core Web Vitals. This means 75% of users should have a &quot;Good&quot; 
              experience — not just the average user.
            </p>
            <p className="mb-3">
              The 75th percentile rule matters because <strong>optimizing for average isn&apos;t 
              sufficient</strong>. If your average LCP is 2.0s but your 75th percentile is 3.5s, 
              you&apos;re failing the budget. The rule forces teams to improve performance for users on 
              slow devices and networks — not just optimize for high-end development machines.
            </p>
            <p>
              In practice, this means segmenting performance data by device (mobile, tablet, desktop), 
              network (3G, 4G, WiFi), and geography. Focus improvement efforts on the worst 25% of 
              experiences, not the average.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do you handle third-party scripts in performance budgets?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Third-party scripts (analytics, ads, chat widgets, A/B testing) often account for 30-50% of 
              JavaScript payload but receive less scrutiny than first-party code. They should be explicitly 
              budgeted:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Set explicit limits:</strong> Maximum 10 third-party scripts, 300KB total. Enforce 
                in CI/CD like first-party code.
              </li>
              <li>
                <strong>Require performance review:</strong> Before adding any third-party script, evaluate 
                its business value vs. performance cost. Ask: &quot;What happens if we don&apos;t add this?&quot;
              </li>
              <li>
                <strong>Lazy-load when possible:</strong> Chat widgets, heatmaps, and non-critical analytics 
                can load after user interaction or on idle.
              </li>
              <li>
                <strong>Audit regularly:</strong> Quarterly reviews often find 10-20% of third-party scripts 
                are unused or low-value. Remove them.
              </li>
            </ul>
            <p>
              Tools like RequestMap visualize third-party script impact, making it easier to communicate 
              trade-offs to stakeholders.
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
            <a href="https://web.dev/performance-budgets-101/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Performance Budgets 101
            </a> — Comprehensive introduction to performance budget concepts and implementation.
          </li>
          <li>
            <a href="https://web.dev/your-first-performance-budget/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Your First Performance Budget
            </a> — Step-by-step guide for setting initial budgets.
          </li>
          <li>
            <a href="https://github.com/ai/size-limit" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub — size-limit
            </a> — Tool for enforcing JavaScript size budgets.
          </li>
          <li>
            <a href="https://github.com/GoogleChrome/lighthouse-ci" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub — Lighthouse CI
            </a> — Tool for running Lighthouse audits in CI/CD.
          </li>
          <li>
            <a href="https://webpack.js.org/configuration/performance/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Webpack — Performance Configuration
            </a> — Built-in webpack performance hints.
          </li>
          <li>
            <a href="https://timkadlec.com/remembers/2019-03-07-performance-budgets-that-stick/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Tim Kadlec — Performance Budgets That Stick
            </a> — Best practices for maintaining budget discipline.
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/crux/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chrome UX Report (CrUX) Documentation
            </a> — Google&apos;s field data dataset for Core Web Vitals.
          </li>
          <li>
            <a href="https://web.dev/vitals/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Core Web Vitals
            </a> — Official documentation on Core Web Vitals metrics and thresholds.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
