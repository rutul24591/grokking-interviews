"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-web-vitals",
  title: "Web Vitals (LCP, FID, CLS, TTFB, INP)",
  description: "Comprehensive guide to Core Web Vitals and key performance metrics for measuring and optimizing real user experience.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "web-vitals",
  wordCount: 6300,
  readingTime: 26,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "web-vitals", "LCP", "CLS", "INP", "TTFB", "Core Web Vitals", "metrics"],
  relatedTopics: ["image-optimization", "critical-css", "code-splitting", "performance-budgets"],
};

export default function WebVitalsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Web Vitals</strong> are a set of metrics defined by Google that quantify real-world user 
          experience on the web. The subset called <strong>Core Web Vitals</strong> — currently LCP, INP, 
          and CLS —{" "}
          <Highlight tier="important">directly affects Google search ranking</Highlight>{" "}
          and represents the three pillars of user 
          experience: loading, interactivity, and visual stability.
        </HighlightBlock>
        <p>
          These metrics replaced subjective performance assessments (&quot;is this page fast?&quot;) with 
          measurable, user-centric data. Instead of guessing, you can now measure exactly:
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            How long users wait to see meaningful content (LCP — Largest Contentful Paint)
          </HighlightBlock>
          <li>
            How responsive the page feels when clicked (INP — Interaction to Next Paint)
          </li>
          <li>
            How much the layout jumps around during load (CLS — Cumulative Layout Shift)
          </li>
        </ul>
        <p>
          The business impact of Web Vitals optimization is well-documented:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Google:</strong> Pages that pass Core Web Vitals have 24% lower bounce rates on average.
          </li>
          <li>
            <strong>BBC:</strong> For every additional second of load time, they lost 10% of users.
          </li>
          <li>
            <strong>Financial Times:</strong> Optimizing Web Vitals increased user satisfaction by 15%.
          </li>
          <li>
            <strong>Vodafone:</strong> Improving LCP by 31% increased sales by 8%.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/web-vitals-business-impact.svg"
          alt="Chart showing correlation between Web Vitals optimization and business metrics including bounce rate, conversion, and user satisfaction improvements"
          caption="Business impact: Web Vitals optimization correlates with significant improvements in key metrics"
          captionTier="important"
        />

        <HighlightBlock as="p" tier="important">
          Core Web Vitals became an official Google ranking signal in May 2021 (the &quot;Page Experience
          Update&quot;). While content quality remains the primary ranking factor, Web Vitals can be a
          tiebreaker between similar pages — and poor performance can noticeably impact organic traffic.
        </HighlightBlock>
        <p>
          In system design interviews, Web Vitals demonstrates understanding of user-centric performance 
          measurement, the browser rendering pipeline, and the connection between technical metrics and 
          business outcomes.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/web-vitals-overview.svg"
          alt="Diagram showing three Core Web Vitals cards: LCP for loading (≤2.5s good), INP for interactivity (≤200ms good), and CLS for visual stability (≤0.1 good)"
          caption="The three Core Web Vitals: LCP (loading), INP (interactivity), and CLS (visual stability) with their performance thresholds"
          captionTier="important"
        />

        <h3>The Three Core Web Vitals</h3>
        <HighlightBlock as="p" tier="crucial">
          As of 2024, the Core Web Vitals consist of three metrics:
        </HighlightBlock>

        <h4>LCP — Largest Contentful Paint</h4>
        <HighlightBlock as="p" tier="important">
          <strong>What it measures:</strong> The time from when the page starts loading to when the largest 
          content element in the viewport becomes visible.
        </HighlightBlock>
        <p>
          <strong>Thresholds:</strong>
        </p>
        <ul className="space-y-1">
          <HighlightBlock as="li" tier="crucial">
            • <strong>Good:</strong> ≤ 2.5 seconds
          </HighlightBlock>
          <li>• <strong>Needs Improvement:</strong> 2.5 – 4.0 seconds</li>
          <li>• <strong>Poor:</strong> &gt; 4.0 seconds</li>
        </ul>
        <p>
          <strong>Common LCP elements:</strong> Hero images, video thumbnails, large text headings, banner 
          images. The LCP element is typically the first meaningful content users care about.
        </p>

        <h4>INP — Interaction to Next Paint</h4>
        <HighlightBlock as="p" tier="important">
          <strong>What it measures:</strong> The latency of the worst interaction (click, tap, keyboard) 
          throughout the page&apos;s lifetime. INP replaced FID (First Input Delay) in March 2024 because 
          INP measures <em>all</em> interactions, not just the first.
        </HighlightBlock>
        <p>
          <strong>Thresholds:</strong>
        </p>
        <ul className="space-y-1">
          <HighlightBlock as="li" tier="crucial">
            • <strong>Good:</strong> ≤ 200 milliseconds
          </HighlightBlock>
          <li>• <strong>Needs Improvement:</strong> 200 – 500 milliseconds</li>
          <li>• <strong>Poor:</strong> &gt; 500 milliseconds</li>
        </ul>
        <p>
          <strong>What counts as an interaction:</strong> Clicks on buttons, taps on touchscreens, keyboard 
          input (typing, pressing Enter), and some touch gestures. Scrolling and pinch-zoom are excluded.
        </p>

        <h4>CLS — Cumulative Layout Shift</h4>
        <HighlightBlock as="p" tier="important">
          <strong>What it measures:</strong> The sum of all unexpected layout shift scores during the 
          page&apos;s lifetime. A layout shift occurs when a visible element moves position between two 
          frames without user interaction.
        </HighlightBlock>
        <p>
          <strong>Thresholds:</strong>
        </p>
        <ul className="space-y-1">
          <HighlightBlock as="li" tier="crucial">
            • <strong>Good:</strong> ≤ 0.1
          </HighlightBlock>
          <li>• <strong>Needs Improvement:</strong> 0.1 – 0.25</li>
          <li>• <strong>Poor:</strong> &gt; 0.25</li>
        </ul>
        <p>
          <strong>Common CLS causes:</strong> Images without dimensions, ads/embeds without reserved space, 
          dynamically injected content (banners, cookie notices), web fonts causing FOUT, late-loading CSS.
        </p>

        <h3>Additional Important Metrics</h3>
        <HighlightBlock as="p" tier="important">
          While not part of Core Web Vitals, these metrics are still important for comprehensive performance 
          analysis:
        </HighlightBlock>

        <h4>TTFB — Time to First Byte</h4>
        <HighlightBlock as="p" tier="important">
          Time from the browser&apos;s request until the first byte of the response arrives. Measures server 
          responsiveness plus network latency.
        </HighlightBlock>
        <ul className="space-y-1">
          <HighlightBlock as="li" tier="important">
            • <strong>Target:</strong> ≤ 800ms
          </HighlightBlock>
          <li>• <strong>Improve with:</strong> CDN, server-side caching, faster backends, HTTP/2, edge computing</li>
        </ul>

        <h4>FCP — First Contentful Paint</h4>
        <p>
          Time until the first text or image is painted. Measures how quickly the user sees <em>something</em>.
        </p>
        <ul className="space-y-1">
          <HighlightBlock as="li" tier="important">
            • <strong>Target:</strong> ≤ 1.8s
          </HighlightBlock>
          <li>• <strong>Improve with:</strong> Critical CSS, eliminate render-blocking resources, optimize LCP</li>
        </ul>

        <h4>TBT — Total Blocking Time</h4>
        <p>
          Sum of all &quot;blocking time&quot; from long tasks (tasks &gt; 50ms) between FCP and TTI. A long 
          task of 200ms contributes 150ms of blocking time.
        </p>
        <ul className="space-y-1">
          <HighlightBlock as="li" tier="important">
            • <strong>Target:</strong> ≤ 200ms
          </HighlightBlock>
          <li>• <strong>Improve with:</strong> Code splitting, reduce JavaScript, break up long tasks</li>
        </ul>

        <h4>TTI — Time to Interactive</h4>
        <p>
          Time until the page is fully interactive (responds to input within 50ms). No longer a Core Web 
          Vital but still useful for diagnosing JavaScript-heavy pages.
        </p>
        <ul className="space-y-1">
          <HighlightBlock as="li" tier="important">
            • <strong>Target:</strong> ≤ 3.8s
          </HighlightBlock>
          <li>• <strong>Improve with:</strong> Reduce JavaScript, code splitting, optimize execution time</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          Architecture: measure in production (RUM) for truth, use lab tooling for iteration, and build a feedback
          loop (dashboards, alerts, CI gates) so regressions are caught before they hit the p75 user experience.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The architecture view: instrument in the client (RUM) + validate with lab tools, segment by device
          and network, and build a feedback loop where regressions are caught before users feel them.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Always record context with the metric: route, device class, effective connection type, and whether the page
          was a cold start vs warm cache. Without segmentation, Web Vitals data becomes unactionable.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/web-vitals-optimization.svg"
          alt="Diagram showing specific optimization techniques for each Core Web Vital: LCP, INP, and CLS with four strategies each"
          caption="Optimization strategies: specific techniques for improving each Core Web Vital metric"
          captionTier="important"
        />

        <h3>How Web Vitals Are Measured</h3>
        <p>
          Web Vitals can be measured using two complementary approaches:
        </p>

        <h4>Lab Data (Synthetic Monitoring)</h4>
        <p>
          Lab data is collected in a controlled environment using tools like Lighthouse, WebPageTest, or 
          Chrome DevTools. The same test is run multiple times under consistent conditions.
        </p>
        <p>
          <strong>Characteristics:</strong>
        </p>
        <ul className="space-y-1">
          <li>• <strong>Reproducible:</strong> Same conditions = same result</li>
          <li>• <strong>Controlled:</strong> Simulated device, network, and location</li>
          <li>• <strong>Debuggable:</strong> Easy to identify specific issues</li>
          <li>• <strong>Limited:</strong> May not reflect real user conditions</li>
          <li>• <strong>INP limitation:</strong> Cannot measure INP (needs real interactions)</li>
        </ul>
        <p>
          <strong>Best for:</strong> Development, CI/CD gates, debugging, regression detection.
        </p>

        <h4>Field Data (Real User Monitoring)</h4>
        <p>
          Field data is collected from actual users visiting your site. Tools include the Chrome UX Report 
          (CrUX), the web-vitals JavaScript library, and commercial RUM providers.
        </p>
        <p>
          <strong>Characteristics:</strong>
        </p>
        <ul className="space-y-1">
          <li>• <strong>Real-world:</strong> Actual devices, networks, and user behavior</li>
          <li>• <strong>Variable:</strong> Results vary by user, device, network</li>
          <li>• <strong>Comprehensive:</strong> Covers all user journeys</li>
          <li>• <strong>Measures INP:</strong> Captures real interactions</li>
          <li>• <strong>SEO impact:</strong> Google uses field data for ranking</li>
        </ul>
        <p>
          <strong>Best for:</strong> SEO ranking, monitoring real-world performance, understanding user 
          experience across different conditions.
        </p>

        <h3>Measuring Web Vitals in Production</h3>
        <p>
          The <code>web-vitals</code> library (official Google package) provides a simple API for measuring 
          all Web Vitals:
        </p>
        <p>
          The typical implementation:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Install:</strong> <code>pnpm add web-vitals</code>
          </li>
          <li>
            <strong>Import metrics:</strong> <code>onLCP</code>, <code>onINP</code>, <code>onCLS</code>, etc.
          </li>
          <li>
            <strong>Send to analytics:</strong> Use <code>sendBeacon</code> for reliable delivery
          </li>
          <li>
            <strong>Segment data:</strong> Track by device, network, geography for insights
          </li>
        </ul>

        <h3>Chrome UX Report (CrUX)</h3>
        <p>
          The Chrome UX Report is Google&apos;s public dataset of real user performance data. It powers 
          PageSpeed Insights, Search Console&apos;s Core Web Vitals report, and is available via BigQuery 
          for custom analysis.
        </p>
        <p>
          <strong>Data coverage:</strong>
        </p>
        <ul className="space-y-1">
          <li>• Millions of real Chrome users</li>
          <li>• Aggregated by origin (domain) and URL</li>
          <li>• Segmented by device (phone, tablet, desktop) and connection (4G, 3G, etc.)</li>
          <li>• Updated monthly</li>
        </ul>
        <p>
          <strong>Access methods:</strong>
        </p>
        <ul className="space-y-1">
          <li>• <strong>PageSpeed Insights API:</strong> On-demand lookup for specific URLs</li>
          <li>• <strong>Search Console:</strong> Core Web Vitals report for your properties</li>
          <li>• <strong>BigQuery:</strong> Raw dataset for custom analysis (free tier available)</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <HighlightBlock as="p" tier="crucial">
          Web Vitals is a measurement system first, optimization system second. Senior-level guidance:
          <Highlight tier="important"> treat field data as the source of truth</Highlight> (what users
          experience), and use lab data to iterate quickly. Always reason in terms of the{" "}
          <Highlight tier="important">75th percentile</Highlight>, not averages.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The most common trade-off is metric shifting: improving LCP by shipping more JS can hurt INP; fixing CLS
          by deferring content can worsen LCP. Staff-level answers talk about guardrails and evaluating the full metric set.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Treat &quot;pass Core Web Vitals&quot; as an SLO, not a one-off project: set thresholds per key route and enforce
          through budgets, CI checks, and release criteria rather than ad-hoc optimizations.
        </HighlightBlock>

        <h3>Lab vs Field Data Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Aspect</th>
                <th className="p-3 text-left">Lab Data</th>
                <th className="p-3 text-left">Field Data (RUM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Source</td>
                <td className="p-3">Lighthouse, DevTools, WebPageTest</td>
                <td className="p-3">CrUX, web-vitals library, RUM providers</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Environment</td>
                <td className="p-3">Controlled (simulated)</td>
                <td className="p-3">Real users, real devices, real networks</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Reproducible</td>
                <td className="p-3">Yes</td>
                <td className="p-3">No (varies by user)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">INP Measurement</td>
                <td className="p-3">Not possible</td>
                <td className="p-3">
                  <Highlight tier="important">Yes (from real interactions)</Highlight>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium">SEO Impact</td>
                <td className="p-3">Indirect (debugging)</td>
                <td className="p-3">
                  <Highlight tier="important">Direct (Google uses this)</Highlight>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Best For</td>
                <td className="p-3">Development, CI/CD, debugging</td>
                <td className="p-3">Monitoring, SEO, real-world impact</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Optimization Strategies by Metric</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Metric</th>
                <th className="p-3 text-left">Primary Levers</th>
                <th className="p-3 text-left">Secondary Levers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">LCP</td>
                <td className="p-3">Optimize LCP image, SSR, CDN</td>
                <td className="p-3">Critical CSS, preload, reduce TTFB</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">
                  <Highlight tier="crucial">INP</Highlight>
                </td>
                <td className="p-3">
                  <Highlight tier="important">
                    Break up long tasks, reduce JS
                  </Highlight>
                </td>
                <td className="p-3">
                  <Highlight tier="important">
                    Web Workers, optimize event handlers
                  </Highlight>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium">
                  <Highlight tier="crucial">CLS</Highlight>
                </td>
                <td className="p-3">
                  <Highlight tier="important">
                    Set image dimensions, reserve space
                  </Highlight>
                </td>
                <td className="p-3">
                  <Highlight tier="important">
                    font-display: optional, avoid late CSS
                  </Highlight>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium">TTFB</td>
                <td className="p-3">
                  <Highlight tier="important">
                    CDN, server caching, edge computing
                  </Highlight>
                </td>
                <td className="p-3">Optimize backend, database queries</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">FCP</td>
                <td className="p-3">Critical CSS, eliminate render-blocking</td>
                <td className="p-3">Reduce bundle size, optimize LCP</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>

        <h3>Monitor Both Lab and Field Data</h3>
        <p>
          Use lab data for development and debugging, field data for monitoring and SEO. They complement 
          each other:
        </p>
        <ul className="space-y-1">
          <li>• Run Lighthouse in CI/CD to catch regressions before deployment</li>
          <li>• Track CrUX data in Search Console for SEO impact</li>
          <HighlightBlock as="li" tier="important">
            • Implement web-vitals library for granular production monitoring
          </HighlightBlock>
        </ul>

        <h3>Focus on the 75th Percentile</h3>
        <HighlightBlock as="p" tier="crucial">
          Google uses the 75th percentile of page loads across all users. This means:
        </HighlightBlock>
        <ul className="space-y-1">
          <HighlightBlock as="li" tier="crucial">
            • 75% of users should have a &quot;Good&quot; experience
          </HighlightBlock>
          <li>• Optimizing for average isn&apos;t sufficient</li>
          <li>• Focus on improving the worst 25% of experiences</li>
        </ul>

        <h3>Prioritize Mobile Performance</h3>
        <HighlightBlock as="p" tier="important">
          Mobile devices have slower CPUs and networks. Core Web Vitals are measured separately for mobile 
          and desktop, and mobile is often the ranking signal:
        </HighlightBlock>
        <ul className="space-y-1">
          <li>• Test on real mobile devices, not just desktop simulation</li>
          <li>• Prioritize mobile optimizations (smaller bundles, optimized images)</li>
          <li>• Consider 3G/4G network conditions in testing</li>
        </ul>

        <h3>Set Performance Budgets</h3>
        <HighlightBlock as="p" tier="important">
          Define thresholds for Web Vitals and enforce them:
        </HighlightBlock>
        <ul className="space-y-1">
          <HighlightBlock as="li" tier="important">
            • LCP: &lt; 2.5s for 75th percentile
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            • INP: &lt; 200ms for 75th percentile
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            • CLS: &lt; 0.1 for 75th percentile
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            • Fail CI/CD builds that exceed budgets
          </HighlightBlock>
        </ul>

        <h3>Segment Your Data</h3>
        <p>
          Web Vitals vary significantly by:
        </p>
        <ul className="space-y-1">
          <li>• <strong>Device:</strong> Mobile vs tablet vs desktop</li>
          <li>• <strong>Network:</strong> 4G vs 3G vs 2G</li>
          <li>• <strong>Geography:</strong> Different regions have different infrastructure</li>
          <li>• <strong>Page type:</strong> Homepage vs product page vs checkout</li>
        </ul>
        <p>
          Segment your analysis to identify specific improvement opportunities.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Optimizing Only for Lab Data</h3>
        <HighlightBlock as="p" tier="crucial">
          A page can score 100 on Lighthouse but fail Core Web Vitals in the field. Lab data is controlled; 
          real users have varying devices and networks.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Always validate optimizations with field data (CrUX, RUM). Use lab 
          data for debugging, field data for success criteria.
        </p>

        <h3>Ignoring the 75th Percentile</h3>
        <HighlightBlock as="p" tier="important">
          Optimizing for average or median performance isn&apos;t sufficient. Google uses the 75th percentile, 
          meaning 75% of users should have a &quot;Good&quot; experience.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Analyze the distribution of your metrics. Focus on improving the worst 
          25% of experiences.
        </p>

        <h3>Not Handling Dynamic Content</h3>
        <p>
          LCP can change based on what content is shown (personalized hero, A/B test variants). CLS can 
          occur when dynamic content loads and shifts layout.
        </p>
        <p>
          <strong>Solution:</strong> Reserve space for dynamic content. Use skeleton screens. Monitor LCP 
          across different page variants.
        </p>

        <h3>Over-Optimizing One Metric</h3>
        <HighlightBlock as="p" tier="important">
          Optimizing LCP by preloading everything can hurt INP (more JavaScript to parse). Reducing CLS by 
          deferring all images can hurt LCP.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Take a holistic approach. Measure the impact of changes on all Core 
          Web Vitals, not just one.
        </p>

        <h3>Not Monitoring Continuously</h3>
        <p>
          Web Vitals can regress over time as new features are added. A one-time optimization isn&apos;t 
          sufficient.
        </p>
        <p>
          <strong>Solution:</strong> Implement continuous monitoring with alerts. Set up dashboards. Review 
          Web Vitals in sprint retrospectives.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Real-world use cases should read like a postmortem: baseline (p75), root cause (waterfall/long tasks/layout shifts),
          targeted changes, and an outcome across <strong>all</strong> Core Web Vitals plus a business metric.
        </HighlightBlock>

        <h3>E-Commerce Site: LCP Optimization</h3>
        <p>
          An e-commerce site had an LCP of 4.2s on mobile (Poor). Analysis revealed the hero image was 
          1.2 MB and loaded late.
        </p>
        <p>
          Optimizations:
        </p>
        <ul className="space-y-1">
          <li>• Compressed hero image to 150 KB (WebP with JPEG fallback)</li>
          <li>• Added preload hint for hero image</li>
          <li>• Implemented SSR for product data</li>
          <li>• Used CDN with edge caching</li>
        </ul>
        <HighlightBlock as="p" tier="important">
          Results: LCP improved from 4.2s to 2.1s. Mobile organic traffic increased 18%.
        </HighlightBlock>

        <h3>SaaS Dashboard: INP Improvement</h3>
        <HighlightBlock as="p" tier="important">
          A SaaS dashboard had INP of 650ms (Poor). Users reported the interface felt &quot;laggy&quot; 
          when clicking buttons.
        </HighlightBlock>
        <p>
          Optimizations:
        </p>
        <ul className="space-y-1">
          <li>• Broke up long tasks using scheduler.yield()</li>
          <li>• Moved data processing to Web Workers</li>
          <li>• Used startTransition for non-urgent updates</li>
          <li>• Reduced JavaScript bundle by 40%</li>
        </ul>
        <HighlightBlock as="p" tier="important">
          Results: INP improved from 650ms to 180ms. User satisfaction scores increased 22%.
        </HighlightBlock>

        <h3>News Publisher: CLS Reduction</h3>
        <HighlightBlock as="p" tier="important">
          A news publisher had CLS of 0.35 (Poor). Users complained about content &quot;jumping&quot; 
          while reading.
        </HighlightBlock>
        <p>
          Optimizations:
        </p>
        <ul className="space-y-1">
          <li>• Added explicit dimensions to all images</li>
          <li>• Reserved space for ads with min-height</li>
          <li>• Used font-display: optional with size-adjust fallbacks</li>
          <li>• Loaded late CSS asynchronously</li>
        </ul>
        <HighlightBlock as="p" tier="important">
          Results: CLS improved from 0.35 to 0.08. Time on page increased 15%.
        </HighlightBlock>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What are Core Web Vitals and why do they matter?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <HighlightBlock as="p" tier="important" className="mb-3">
              Core Web Vitals are three metrics that measure real-world user experience:
            </HighlightBlock>
            <ul className="space-y-1">
              <HighlightBlock as="li" tier="crucial">
                • <strong>LCP (Largest Contentful Paint):</strong> Loading performance (≤2.5s good)
              </HighlightBlock>
              <HighlightBlock as="li" tier="crucial">
                • <strong>INP (Interaction to Next Paint):</strong> Interactivity responsiveness (≤200ms good)
              </HighlightBlock>
              <HighlightBlock as="li" tier="crucial">
                • <strong>CLS (Cumulative Layout Shift):</strong> Visual stability (≤0.1 good)
              </HighlightBlock>
            </ul>
            <p className="mb-3">
              They matter because:
            </p>
            <ul className="space-y-1">
              <li>• <strong>SEO:</strong> Google uses Core Web Vitals as a ranking signal since May 2021</li>
              <li>• <strong>User Experience:</strong> Better scores correlate with lower bounce rates and higher conversions</li>
              <li>• <strong>Business Impact:</strong> Companies report 8-24% improvements in key metrics after optimization</li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How would you improve LCP for a page with a large hero image?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <HighlightBlock as="p" tier="crucial" className="mb-3">
              I would implement these optimizations:
            </HighlightBlock>
            <ol className="space-y-2">
              <li>
                <strong>Optimize the image:</strong> Compress to WebP/AVIF format, serve responsive sizes 
                with srcset, target quality 75-85.
              </li>
              <li>
                <strong>Preload the image:</strong> Add <code>&lt;link rel=&quot;preload&quot; as=&quot;image&quot;&gt;</code> 
                in the head to start downloading early.
              </li>
              <li>
                <strong>Use fetchPriority=&quot;high&quot;:</strong> Tell the browser to prioritize this image.
              </li>
              <li>
                <strong>Implement SSR:</strong> Server-render the image tag so it&apos;s in the initial HTML.
              </li>
              <li>
                <strong>Use a CDN:</strong> Serve images from edge locations to reduce latency.
              </li>
              <li>
                <strong>Reduce TTFB:</strong> Optimize server response time with caching and edge computing.
              </li>
            </ol>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is the difference between lab data and field data?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              <strong>Lab data</strong> is collected in controlled environments:
            </p>
            <ul className="space-y-1">
              <li>• Tools: Lighthouse, WebPageTest, DevTools</li>
              <li>• Reproducible, debuggable</li>
              <HighlightBlock as="li" tier="important">
                • Cannot measure INP (needs real interactions)
              </HighlightBlock>
              <li>• Best for: Development, CI/CD, debugging</li>
            </ul>
            <p className="mb-3 mt-3">
              <strong>Field data</strong> is collected from real users:
            </p>
            <ul className="space-y-1">
              <li>• Sources: CrUX, web-vitals library, RUM providers</li>
              <li>• Real devices, networks, conditions</li>
              <HighlightBlock as="li" tier="important">
                • Measures all metrics including INP
              </HighlightBlock>
              <li>• Best for: SEO, monitoring, real-world impact</li>
            </ul>
            <HighlightBlock as="p" tier="crucial" className="mt-3">
              Google uses field data for ranking. Use both: lab for development, field for success criteria.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you reduce CLS on a content-heavy page?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Common CLS causes and solutions:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Images without dimensions:</strong> Always set width/height or use aspect-ratio</li>
              <li>• <strong>Ads/embeds:</strong> Reserve space with min-height containers</li>
              <li>• <strong>Dynamic content:</strong> Use skeleton screens, avoid injecting content above existing content</li>
              <li>• <strong>Web fonts:</strong> Use font-display: optional with size-adjust fallbacks</li>
              <li>• <strong>Late-loading CSS:</strong> Inline critical CSS, load non-critical asynchronously</li>
            </ul>
            <HighlightBlock as="p" tier="crucial" className="mt-3">
              Target CLS ≤ 0.1 for 75% of users.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: Why did Google replace FID with INP?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              FID (First Input Delay) measured only the <em>first</em> interaction. This had limitations:
            </p>
            <ul className="space-y-1">
              <li>• A page could pass FID but have slow subsequent interactions</li>
              <li>• FID didn&apos;t capture the full interaction experience</li>
              <li>• Pages with minimal initial interaction could score well despite poor overall responsiveness</li>
            </ul>
            <HighlightBlock as="p" tier="important" className="mb-3">
              INP (Interaction to Next Paint) measures the <em>worst</em> interaction latency throughout 
              the page&apos;s lifetime:
            </HighlightBlock>
            <ul className="space-y-1">
              <li>• Captures all clicks, taps, and keyboard interactions</li>
              <li>• Better reflects overall responsiveness</li>
              <li>• Encourages consistent performance, not just good initial performance</li>
            </ul>
            <HighlightBlock as="p" tier="important" className="mt-3">
              INP replaced FID as a Core Web Vital in March 2024.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do you monitor Web Vitals in production?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <HighlightBlock as="p" tier="important" className="mb-3">
              I would use a combination of approaches:
            </HighlightBlock>
            <ol className="space-y-2">
              <li>
                <strong>web-vitals library:</strong> Install Google&apos;s official package, send metrics 
                to analytics using sendBeacon for reliable delivery.
              </li>
              <li>
                <strong>Chrome UX Report (CrUX):</strong> Monitor via Search Console for SEO impact, or 
                query BigQuery for custom analysis.
              </li>
              <li>
                <strong>RUM provider:</strong> Use commercial tools (SpeedCurve, New Relic, Datadog) for 
                comprehensive monitoring.
              </li>
              <li>
                <strong>Segment data:</strong> Track by device, network, geography to identify specific 
                improvement opportunities.
              </li>
              <HighlightBlock as="li" tier="important">
                <strong>Set alerts:</strong> Notify when 75th percentile exceeds thresholds.
              </HighlightBlock>
            </ol>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References</h2>
        <ul className="space-y-3">
          <li>
            <a 
              href="https://web.dev/vitals/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              web.dev — Core Web Vitals
            </a>
            <p className="text-sm text-muted mt-1">
              Official Google documentation on Core Web Vitals metrics and optimization.
            </p>
          </li>
          <li>
            <a 
              href="https://github.com/GoogleChrome/web-vitals" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              web-vitals Library
            </a>
            <p className="text-sm text-muted mt-1">
              Official Google library for measuring Web Vitals in production.
            </p>
          </li>
          <li>
            <a 
              href="https://search.google.com/search-console/core-web-vitals" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Search Console — Core Web Vitals
            </a>
            <p className="text-sm text-muted mt-1">
              Google Search Console report showing your site&apos;s Core Web Vitals performance.
            </p>
          </li>
          <li>
            <a 
              href="https://developer.chrome.com/docs/crux/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Chrome UX Report Documentation
            </a>
            <p className="text-sm text-muted mt-1">
              Guide to accessing and analyzing the Chrome UX Report dataset.
            </p>
          </li>
          <li>
            <a 
              href="https://web.dev/inp/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              web.dev — Interaction to Next Paint (INP)
            </a>
            <p className="text-sm text-muted mt-1">
              Comprehensive guide to INP measurement and optimization.
            </p>
          </li>
          <li>
            <a 
              href="https://developers.google.com/search/docs/appearance/core-web-vitals" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Google Search — Core Web Vitals
            </a>
            <p className="text-sm text-muted mt-1">
              Google Search documentation on Core Web Vitals as a ranking signal.
            </p>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
