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
          that span the entire system—from user interaction to backend processing and back. Unlike
          component-level budgets such as frontend bundle size or API latency, end-to-end budgets define
          the total acceptable latency, resource consumption, or error rate for complete user journeys.
        </p>
        <p>
          Performance budgets answer critical questions: How long should a page take to load? What is
          the maximum acceptable latency for a search query? How much data can we transfer before the
          user experience degrades? By setting and enforcing these budgets, teams ensure consistent user
          experience and prevent performance regressions. Performance budgets provide objective criteria
          for architectural decisions—when considering a new feature, you can ask whether it fits within
          the performance budget, and if not, you must either optimize elsewhere, increase the budget
          with justification, or reconsider the feature. Without budgets, performance degrades gradually
          through death by a thousand cuts; with budgets, every change is evaluated against clear
          criteria, preventing incremental degradation.
        </p>
        <p>
          End-to-end budgets are user-centric, based on user-perceived metrics like Time to Interactive
          and First Contentful Paint rather than technical metrics alone. They are cross-functional,
          spanning frontend, backend, network, and infrastructure with all teams sharing responsibility.
          They must be enforceable through integration into CI/CD with automated checks and alerts.
          They are progressive, with different budgets for different conditions such as 3G versus WiFi,
          mobile versus desktop, and first visit versus returning visit.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/performance-budget-categories.svg"
          alt="Performance Budget Categories"
          caption="Performance Budget Categories — showing time-based, resource-based, and quality budgets with example thresholds"
        />
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Performance budgets fall into three categories: time-based, resource-based, and quality
          budgets. Time-based budgets set limits on latency and timing metrics. Time to First Byte
          (TTFB) should be under 200ms to indicate server responsiveness. First Contentful Paint (FCP)
          should be under 1.5 seconds so users perceive that something is happening. Largest Contentful
          Paint (LCP) should be under 2.5 seconds so users perceive the page as loaded. Time to
          Interactive (TTI) should be under 3.5 seconds so users perceive the page as usable. API
          Response Time at P95 should be under 300ms for responsive interactions. Total Page Load should
          be under 5 seconds for the complete loading experience.
        </p>
        <p>
          Resource-based budgets limit data transfer and resource consumption. Total page weight might
          be capped at under 1.5MB for desktop and under 500KB for mobile. JavaScript budgets might
          limit initial load to under 200KB gzipped. CSS budgets might cap at under 50KB gzipped. Image
          budgets might limit total image bytes per page to under 500KB. Font budgets might cap at under
          100KB with subsetting. Request count budgets might limit total HTTP requests to under 50.
          Quality budgets limit error rates and quality metrics, including maximum acceptable error
          percentage (under 0.1% for critical paths), Core Web Vitals pass rate (75% good ratings),
          minimum frame rate for animations (above 55 FPS for 60Hz displays), and maximum cumulative
          layout shift score (under 0.1).
        </p>
        <p>
          Setting realistic budgets requires balancing user expectations with technical feasibility.
          User perception research shows that 0-100ms feels like an instant response with no perceived
          delay, 100-300ms is noticeable but acceptable and feels responsive, 300-1000ms is a clearly
          visible delay where users notice they are waiting, and over 1000ms is frustrating and users
          may abandon. Industry benchmarks from Google research show that 53% of mobile users abandon
          pages that take over 3 seconds to load, which serves as a starting point for LCP budgets.
          Data-driven budgets use historical performance data by collecting baseline measurements across
          user segments, identifying percentiles (P50, P75, P95, P99), setting initial budgets at P75
          or P90 which are achievable but require effort, and gradually tightening budgets as performance
          improves. Competitive benchmarking involves measuring competitor performance using tools like
          WebPageTest and Lighthouse, setting relative targets to be 10-20% faster than key competitors,
          and tracking competitor performance over time.
        </p>
        <p>
          Progressive budgets set different limits for different conditions. Desktop with WiFi might
          have an LCP budget under 2.0 seconds and TTI under 3.0 seconds, while mobile with 4G might
          allow LCP under 2.5 seconds and TTI under 3.5 seconds. Mobile with 3G might permit LCP under
          4.0 seconds and TTI under 6.0 seconds. First visits might allow LCP under 3.0 seconds and
          TTI under 4.5 seconds, while returning visits with cached resources should achieve LCP under
          1.5 seconds and TTI under 2.0 seconds.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/budget-allocation-layers.svg"
          alt="Budget Allocation Across Layers"
          caption="Budget Allocation — showing how end-to-end budgets decompose into frontend, backend, network, and infrastructure budgets"
        />
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Performance budget enforcement relies on an interconnected architecture of CI/CD integration,
          real user monitoring, budget evaluation engines, and alerting systems. Understanding this
          architecture enables staff and principal engineers to design effective enforcement strategies
          that catch regressions before they reach production and monitor actual user experience
          continuously.
        </p>
        <p>
          The CI/CD integration pipeline catches performance regressions before deployment. Lighthouse
          CI runs Lighthouse audits on every pull request and fails the build if budgets are exceeded,
          with configurable thresholds for blocking versus advisory budgets. Webpack Bundle Analyzer
          and similar tools fail builds if bundle sizes exceed budget limits. Synthetic performance
          tests run in staging environments to measure page load times, API latencies, and interaction
          responsiveness under controlled conditions. Budget gates can block deployment entirely if
          critical budgets are violated or allow deployment with warnings for advisory budget breaches.
          The pipeline integrates with code review workflows so that performance regressions are visible
          to reviewers before merge, enabling teams to address issues proactively rather than reactively.
        </p>
        <p>
          Real User Monitoring (RUM) data collection tracks actual user experience in production. The
          Performance API and Navigation Timing API in browsers collect metrics like TTFB, FCP, LCP,
          and TTI from real user sessions. This data is aggregated by calculating percentiles across
          user segments (by device type, network condition, geographic region, user cohort). The RUM
          data flows through a collection SDK embedded in the frontend application, which batches and
          sends telemetry to a backend aggregation service. The aggregation service computes percentiles,
          tracks trends over time, and evaluates budgets against configured thresholds. RUM data provides
          the ground truth of user experience that synthetic testing cannot replicate, capturing the
          variability of real-world network conditions, device capabilities, and user behavior patterns.
        </p>
        <p>
          The budget evaluation engine compares measured performance against defined budgets and
          determines pass/fail status for each metric. In CI/CD, the evaluation engine runs on every
          build with synthetic test results, producing a budget report that shows which budgets passed,
          which failed, and by how much. In production, the evaluation engine runs continuously on RUM
          data, calculating the percentage of users experiencing budget violations. The engine supports
          different enforcement modes: strict mode fails builds or pages on-call when budgets are
          exceeded, advisory mode generates warnings without blocking deployment, and trend mode tracks
          budget adherence over time for review. Budget allocation across system layers decomposes
          end-to-end budgets into component budgets for each layer—for a 3-second TTI budget, network
          might get 200ms, backend processing 300ms, HTML download 100ms, CSS download and parse 200ms,
          JavaScript download and parse 500ms, JavaScript execution 800ms, layout and paint 300ms, with
          600ms buffer for margin.
        </p>
        <p>
          The alerting and feedback loop notifies teams of budget violations and drives corrective
          action. Tiered alerting is based on severity: warnings when budgets are exceeded for over
          5% of users generate tickets for review, critical alerts when over 20% of users are affected
          page the on-call engineer, and emergency alerts when over 50% of users are affected require
          immediate response. Feedback loops connect budget violations back to the responsible teams
          through dashboards, sprint reviews, and post-incident reviews. Performance trends are reviewed
          weekly to identify gradual degradation, included in sprint planning to ensure performance work
          is prioritized, and analyzed quarterly in deep-dive sessions to adjust budgets and identify
          systemic issues.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/performance-budget-monitoring.svg"
          alt="Performance Budget Monitoring"
          caption="Budget Monitoring — showing CI/CD integration, RUM data collection, alerting thresholds, and feedback loops"
        />
      </section>

      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Performance budget enforcement decisions involve significant trade-offs across monitoring
          approaches, enforcement strictness, and evaluation granularity. Understanding these trade-offs
          enables teams to choose the right approach for their maturity level, traffic patterns, and
          organizational constraints.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Synthetic vs RUM Monitoring</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Dimension</th>
                <th className="p-2 text-left">Synthetic</th>
                <th className="p-2 text-left">Real User Monitoring</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Environment</td>
                <td className="p-2">Controlled, repeatable</td>
                <td className="p-2">Real-world, variable</td>
              </tr>
              <tr>
                <td className="p-2">Coverage</td>
                <td className="p-2">Predefined scenarios only</td>
                <td className="p-2">All user journeys</td>
              </tr>
              <tr>
                <td className="p-2">Detection Speed</td>
                <td className="p-2">Immediate (on every run)</td>
                <td className="p-2">Delayed (need sufficient data)</td>
              </tr>
              <tr>
                <td className="p-2">Best Use</td>
                <td className="p-2">CI/CD regression detection</td>
                <td className="p-2">Production experience tracking</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Strict Enforcement vs Advisory Budgets</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Dimension</th>
                <th className="p-2 text-left">Strict (Blocking)</th>
                <th className="p-2 text-left">Advisory (Warning)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Deployment Impact</td>
                <td className="p-2">Blocks deployment on violation</td>
                <td className="p-2">Allows deployment with warning</td>
              </tr>
              <tr>
                <td className="p-2">Team Velocity</td>
                <td className="p-2">May slow down (must fix first)</td>
                <td className="p-2">Unimpeded (track and address)</td>
              </tr>
              <tr>
                <td className="p-2">Performance Discipline</td>
                <td className="p-2">Strong (forced compliance)</td>
                <td className="p-2">Variable (may ignore warnings)</td>
              </tr>
              <tr>
                <td className="p-2">Best For</td>
                <td className="p-2">Mature teams, critical budgets</td>
                <td className="p-2">Building performance culture</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CI/CD Blocking vs Post-Merge Alerts</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Dimension</th>
                <th className="p-2 text-left">CI/CD Blocking</th>
                <th className="p-2 text-left">Post-Merge Alerts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Regression Prevention</td>
                <td className="p-2">Prevents regression from merging</td>
                <td className="p-2">Detects after merge, must fix</td>
              </tr>
              <tr>
                <td className="p-2">Developer Experience</td>
                <td className="p-2">Friction (must fix before merge)</td>
                <td className="p-2">Smoother (merge, then fix)</td>
              </tr>
              <tr>
                <td className="p-2">Fix Cost</td>
                <td className="p-2">Lower (fix in PR context)</td>
                <td className="p-2">Higher (revert or hotfix)</td>
              </tr>
              <tr>
                <td className="p-2">False Positive Impact</td>
                <td className="p-2">High (blocks on false alarms)</td>
                <td className="p-2">Low (investigate before acting)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Aggregate vs Per-User-Segment Budgets</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Dimension</th>
                <th className="p-2 text-left">Aggregate</th>
                <th className="p-2 text-left">Per-User-Segment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Fairness</td>
                <td className="p-2">May hide poor segments</td>
                <td className="p-2">Exposes worst-affected users</td>
              </tr>
              <tr>
                <td className="p-2">Complexity</td>
                <td className="p-2">Low (single threshold)</td>
                <td className="p-2">High (multiple thresholds)</td>
              </tr>
              <tr>
                <td className="p-2">User Impact</td>
                <td className="p-2">Average experience</td>
                <td className="p-2">Protects vulnerable segments</td>
              </tr>
              <tr>
                <td className="p-2">Best For</td>
                <td className="p-2">Homogeneous user base</td>
                <td className="p-2">Diverse devices and networks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Designate performance champions or advocates in each team who serve as the first point of
          contact for performance questions, review pull requests for performance impact, and educate
          team members on performance best practices. These champions should receive advanced training
          in performance optimization techniques and act as liaisons between teams on performance
          matters. Establish a regular performance review cadence with weekly reviews of RUM dashboards
          to discuss trends, inclusion of performance tasks in sprint planning, and quarterly deep dives
          into performance metrics with budget adjustments based on findings.
        </p>
        <p>
          Build a performance culture through regular training sessions on performance best practices,
          public dashboards showing performance metrics for visibility, team ownership of their portion
          of the budget, and recognition of performance improvements and wins. Include documentation
          in the definition of done so that API changes are documented, architecture decisions are
          recorded, runbooks are updated for operational impact, and changelog entries are created.
          Treat performance requirements as first-class user stories: &quot;As a user, I need the page
          to load in under 3 seconds so I can start my workflow quickly.&quot;
        </p>
        <p>
          Integrate performance tools into CI/CD with Lighthouse CI running on every pull request,
          webpack-bundle-analyzer failing builds when bundle size exceeds budget, and synthetic
          performance tests running in staging environments. Configure thresholds that fail builds when
          exceeded, running on every PR before merge, and combine with RUM for production monitoring.
          Alert when budget violation rates exceed thresholds using a tiered approach where warnings
          affect over 5% of users and generate tickets, critical alerts affect over 20% and page
          on-call, and emergencies affect over 50% and require immediate response.
        </p>
        <p>
          Decompose end-to-end budgets into component budgets for each system layer so that each team
          owns their portion. The backend team owns backend processing time, the frontend team owns
          JavaScript download and execution time, and the infrastructure team owns network time. When
          budget contention occurs between competing components, prioritize critical paths so that
          above-the-fold content loads before analytics, defer non-critical resources through lazy
          loading, optimize through compression and caching, and reallocate budget from over-performing
          components to under-performing ones.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Setting unrealistic budgets that are too strict leads to them being ignored, while budgets
          that are too loose provide no value. The fix is to start with achievable budgets and tighten
          them gradually as performance improves. Focusing only on averages (P50 or median) hides poor
          experiences for a significant portion of users. Always track P75, P95, and P99 percentiles
          to understand the full distribution of user experiences.
        </p>
        <p>
          Setting desktop-only budgets ignores mobile users who often have worse network conditions
          and devices. Set separate budgets for mobile that account for slower networks and less
          powerful processors. Budgets without CI/CD gates and alerts become mere suggestions that
          teams ignore. Integrate enforcement into the development workflow with automated checks on
          every pull request and production monitoring for ongoing compliance.
        </p>
        <p>
          Treating performance as a one-time effort rather than an ongoing commitment leads to gradual
          degradation over time. Performance requires continuous monitoring, regular budget reviews,
          and a culture that values performance as a feature. Not accounting for geographic variation
          means users in distant regions experience significantly worse performance than budgets suggest.
          Include geographic segmentation in RUM data and set region-aware budgets. Finally, optimizing
          for synthetic benchmarks at the expense of real user experience creates a false sense of
          performance. Always validate improvements with RUM data to ensure they translate to actual
          user experience improvements.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Google&apos;s Core Web Vitals represent the most influential performance budget framework in
          the industry. Google defined three key metrics—Largest Contentful Paint (LCP) under 2.5s,
          First Input Delay (FID) under 100ms, and Cumulative Layout Shift (CLS) under 0.1—as part of
          their page experience signals that directly impact search rankings. This created a powerful
          incentive for the entire web ecosystem to adopt these budgets. Google Search Console provides
          a Core Web Vitals report showing how pages perform against these budgets, and Lighthouse
          integrates these budgets into its auditing. Google&apos;s approach demonstrates how combining
          performance budgets with business incentives (search ranking) drives industry-wide adoption.
        </p>
        <p>
          Amazon found that every 100ms of latency cost them 1% in sales, a finding that has become
          one of the most cited performance statistics in the industry. Amazon enforces strict
          performance budgets across their platform with automated monitoring of page load times,
          API latencies, and checkout flow performance. Their performance engineering team uses
          progressive budgets that vary by device type, network condition, and geographic region.
          Amazon&apos;s performance culture includes performance reviews in every sprint, dedicated
          performance engineers embedded in teams, and executive-level accountability for performance
          metrics. Their approach demonstrates the direct business impact of performance budgets and
          the organizational commitment required to maintain them at scale.
        </p>
        <p>
          Walmart measured the impact of performance on conversion rates and found that for every 1
          second improvement in page load time, conversions increased by 2%. Walmart invested in
          performance budgets for their e-commerce platform, focusing on mobile performance given that
          the majority of their traffic comes from mobile devices. They use Lighthouse CI in their
          CI/CD pipeline, RUM for production monitoring, and synthetic testing for competitive
          benchmarking. Walmart&apos;s performance team publishes weekly performance reports, holds
          monthly performance reviews, and includes performance metrics in team OKRs.
        </p>
        <p>
          Shopify enforces performance budgets across their platform serving millions of merchants,
          with particular focus on checkout performance since every millisecond of latency directly
          impacts revenue. Shopify uses a combination of Lighthouse CI for pull request gating,
          synthetic monitoring for key user journeys, and RUM for production visibility. Their
          performance budgets are progressive, with different targets for desktop and mobile, and
          they use per-user-segment budgets to ensure that merchants in emerging markets with slower
          networks still receive acceptable performance. Shopify open-sourced their performance
          monitoring tooling and contributes to the Lighthouse project, demonstrating how performance
          budgets can be enforced at platform scale.
        </p>
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
              A: Start with industry benchmarks (Google CWV, Nielsen research). Collect baseline
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
          <li>
            <a href="https://web.dev/vitals/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Core Web Vitals
            </a>
          </li>
          <li>
            <a href="https://httparchive.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              HTTP Archive — Web Performance Statistics
            </a>
          </li>
          <li>
            <a href="https://www.calibreapp.com/blog/performance-budgets" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Calibre — Making Performance Budgets Work
            </a>
          </li>
          <li>
            &quot;Using a Performance Budget to Manage a Site&apos;s Impact&quot; by Tim Kadlec
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
