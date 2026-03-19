"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-frontend-observability-rum",
  title: "Frontend Observability (RUM)",
  description:
    "Comprehensive guide to Real User Monitoring: performance metrics, error tracking, user session analysis, and production observability for frontend applications.",
  category: "frontend",
  subcategory: "nfr",
  slug: "frontend-observability-rum",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-15",
  tags: [
    "frontend",
    "nfr",
    "observability",
    "rum",
    "monitoring",
    "performance",
    "errors",
  ],
  relatedTopics: ["page-load-performance", "error-ux-recovery", "analytics"],
};

export default function FrontendObservabilityRUMArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Frontend Observability</strong> provides visibility into how
          applications perform and behave in production from the user&apos;s
          perspective. Real User Monitoring (RUM) collects actual user
          experience data — page load times, JavaScript errors, user flows, and
          conversion funnels — enabling data-driven performance optimization and
          rapid issue detection.
        </p>
        <p>
          For staff engineers, observability is critical for maintaining
          production quality. Lab testing (Lighthouse) shows potential
          performance; RUM shows actual user experience across devices,
          networks, and geographies. Observability enables proactive issue
          detection, performance budget enforcement, and correlation between
          technical metrics and business outcomes.
        </p>
        <p>
          <strong>Observability pillars:</strong>
        </p>
        <ul>
          <li>
            <strong>Performance metrics:</strong> Core Web Vitals, page load
            times, resource timing
          </li>
          <li>
            <strong>Error tracking:</strong> JavaScript errors, API failures,
            rejected promises
          </li>
          <li>
            <strong>User sessions:</strong> Page views, clicks, navigation
            paths, conversions
          </li>
          <li>
            <strong>Infrastructure:</strong> CDN performance, API latency,
            third-party impact
          </li>
        </ul>
      </section>

      <section>
        <h2>Core Web Vitals Monitoring</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Key Metrics</h3>
        <ul className="space-y-2">
          <li>
            <strong>LCP (Largest Contentful Paint):</strong> Loading
            performance. Target: &lt;2.5s
          </li>
          <li>
            <strong>INP (Interaction to Next Paint):</strong> Interactivity.
            Target: &lt;200ms
          </li>
          <li>
            <strong>CLS (Cumulative Layout Shift):</strong> Visual stability.
            Target: &lt;0.1
          </li>
          <li>
            <strong>FCP (First Contentful Paint):</strong> Initial rendering.
            Target: &lt;1.8s
          </li>
          <li>
            <strong>TTFB (Time to First Byte):</strong> Server responsiveness.
            Target: &lt;800ms
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Measurement with web-vitals
        </h3>
        <ul className="space-y-2">
          <li>
            Install <code>web-vitals</code> package from Google
          </li>
          <li>Import metric observers (onLCP, onINP, onCLS, etc.)</li>
          <li>Send metrics to analytics endpoint via sendBeacon</li>
          <li>Include context: URL, device, network, geography</li>
          <li>Track percentiles (p50, p75, p95) not just averages</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Reporting Strategy</h3>
        <ul className="space-y-2">
          <li>Sample data (1-10% of users) to reduce volume</li>
          <li>Batch multiple metrics in single request</li>
          <li>Use navigator.sendBeacon for reliability</li>
          <li>Send on visibilitychange or pagehide</li>
          <li>Include navigation type (navigate, reload, back-forward)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Threshold Alerting</h3>
        <ul className="space-y-2">
          <li>Define good/needs-improvement/poor thresholds</li>
          <li>Track percentage of &quot;good&quot; experiences</li>
          <li>Alert when p75 crosses threshold</li>
          <li>Segment by device class, network, geography</li>
          <li>Correlate with business metrics (conversion, bounce)</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/rum-metrics-flow.svg"
          alt="RUM Metrics Flow"
          caption="Real User Monitoring flow — metric collection, batching, sampling, and reporting to analytics pipeline"
        />
      </section>

      <section>
        <h2>Error Tracking</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Sources</h3>
        <ul className="space-y-2">
          <li>
            <strong>JavaScript errors:</strong> Uncaught exceptions, rejected
            promises
          </li>
          <li>
            <strong>Resource errors:</strong> Failed image, CSS, script loads
          </li>
          <li>
            <strong>API errors:</strong> Failed fetch/XHR requests
          </li>
          <li>
            <strong>Console errors:</strong> Errors logged to console
          </li>
          <li>
            <strong>Third-party errors:</strong> Errors from external scripts
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Capture</h3>
        <ul className="space-y-2">
          <li>
            <code>window.onerror</code> for uncaught errors
          </li>
          <li>
            <code>window.onunhandledrejection</code> for promise rejections
          </li>
          <li>Error boundaries for React component errors</li>
          <li>Interceptors for API errors (axios, fetch)</li>
          <li>Resource error listeners for failed loads</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Context</h3>
        <ul className="space-y-2">
          <li>Error message and stack trace</li>
          <li>User ID (anonymized), session ID</li>
          <li>Page URL, referrer</li>
          <li>Browser, OS, device information</li>
          <li>Network status, connection type</li>
          <li>Recent user actions (for reproduction)</li>
          <li>Application state (Redux/Zustand snapshot)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Grouping</h3>
        <ul className="space-y-2">
          <li>Group by error type and message</li>
          <li>Ignore known/benign errors (network timeouts)</li>
          <li>Track error frequency and affected users</li>
          <li>Identify error trends over time</li>
          <li>Alert on new error types or spike in frequency</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Error Tracking Tools
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Sentry:</strong> Popular, good React integration, session
            replay
          </li>
          <li>
            <strong>LogRocket:</strong> Session recording, network logs, Redux
            devtools
          </li>
          <li>
            <strong>DataDog RUM:</strong> Integrated with infrastructure
            monitoring
          </li>
          <li>
            <strong>New Relic:</strong> Full-stack observability
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/error-tracking-flow.svg"
          alt="Error Tracking Flow"
          caption="Error tracking pipeline — error capture, context enrichment, grouping, and alerting"
        />
      </section>

      <section>
        <h2>Session Replay and User Analytics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Replay</h3>
        <ul className="space-y-2">
          <li>Record user interactions (clicks, scrolls, inputs)</li>
          <li>Reconstruct DOM changes over time</li>
          <li>Replay sessions for debugging</li>
          <li>Redact sensitive fields (passwords, credit cards)</li>
          <li>Sample sessions (1-5%) to reduce storage</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Privacy Considerations
        </h3>
        <ul className="space-y-2">
          <li>Mask sensitive input fields by default</li>
          <li>Respect user consent (GDPR, CCPA)</li>
          <li>Allow users to opt-out</li>
          <li>Anonymize user identifiers</li>
          <li>Don&apos;t record on sensitive pages (checkout, settings)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Flow Analysis</h3>
        <ul className="space-y-2">
          <li>Track page views and navigation paths</li>
          <li>Identify common user journeys</li>
          <li>Detect drop-off points in funnels</li>
          <li>Correlate performance with conversion</li>
          <li>A/B test analysis (variant performance)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Rage Clicks and Frustration Signals
        </h3>
        <ul className="space-y-2">
          <li>Detect rapid repeated clicks (rage clicks)</li>
          <li>Track error toast dismissals</li>
          <li>Monitor back button usage (navigation frustration)</li>
          <li>Identify dead clicks (clicks with no response)</li>
          <li>Use signals to identify UX issues</li>
        </ul>
      </section>

      <section>
        <h2>Performance Monitoring Architecture</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Collection</h3>
        <ul className="space-y-2">
          <li>Performance API (performance.getEntriesByType)</li>
          <li>Navigation Timing API for page load metrics</li>
          <li>Resource Timing API for asset load times</li>
          <li>web-vitals library for Core Web Vitals</li>
          <li>Custom timers for application-specific metrics</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Pipeline</h3>
        <ul className="space-y-2">
          <li>Client-side batching and sampling</li>
          <li>Send to ingestion endpoint (beacon or fetch)</li>
          <li>Process and enrich server-side</li>
          <li>Store in time-series database</li>
          <li>Aggregate for dashboards and alerts</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Dashboards</h3>
        <ul className="space-y-2">
          <li>Executive dashboard (p75 Core Web Vitals trends)</li>
          <li>Engineering dashboard (detailed metrics, errors)</li>
          <li>Product dashboard (conversion funnels, user flows)</li>
          <li>Release dashboard (performance by version)</li>
          <li>Geography dashboard (performance by region)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Alerting</h3>
        <ul className="space-y-2">
          <li>Alert on p75 threshold breaches</li>
          <li>Error rate spikes (new release issues)</li>
          <li>Third-party degradation</li>
          <li>Geography-specific issues</li>
          <li>Use PagerDuty, Slack, email for notifications</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/observability-architecture.svg"
          alt="Observability Architecture"
          caption="Frontend observability architecture — data collection, pipeline, storage, dashboards, and alerting"
        />
      </section>

      <section>
        <h2>Chrome UX Report (CrUX)</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What is CrUX</h3>
        <ul className="space-y-2">
          <li>Aggregated, anonymized data from Chrome users</li>
          <li>Free field data from Google</li>
          <li>
            Available via PageSpeed Insights API, Search Console, BigQuery
          </li>
          <li>Limited to Chrome users and popular sites</li>
          <li>Good benchmark for SEO (Google uses for ranking)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Using CrUX Data</h3>
        <ul className="space-y-2">
          <li>PageSpeed Insights for individual URLs</li>
          <li>Search Console for site-wide Core Web Vitals</li>
          <li>BigQuery for custom analysis (historical data)</li>
          <li>Compare your RUM data with CrUX benchmarks</li>
          <li>Track improvement over time</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CrUX vs Custom RUM</h3>
        <ul className="space-y-2">
          <li>
            <strong>CrUX:</strong> Free, Chrome-only, popular sites, no
            user-level data
          </li>
          <li>
            <strong>Custom RUM:</strong> All browsers, any site size, user-level
            analysis, costs money
          </li>
          <li>
            Use both: CrUX for SEO benchmark, custom RUM for detailed analysis
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Start with Core Web Vitals:</strong> LCP, INP, CLS are
            Google ranking factors.
          </li>
          <li>
            <strong>Sample appropriately:</strong> 1-10% for high-traffic sites,
            100% for low-traffic.
          </li>
          <li>
            <strong>Track percentiles:</strong> p75 is Google&apos;s standard,
            also track p95 for power users.
          </li>
          <li>
            <strong>Segment data:</strong> By device, network, geography, new vs
            returning users.
          </li>
          <li>
            <strong>Correlate with business:</strong> Connect performance to
            conversion, bounce, retention.
          </li>
          <li>
            <strong>Set performance budgets:</strong> Alert when metrics exceed
            thresholds.
          </li>
          <li>
            <strong>Monitor third-party impact:</strong> Track analytics, ads,
            widget performance.
          </li>
          <li>
            <strong>Respect privacy:</strong> GDPR/CCPA compliance, anonymize
            data, allow opt-out.
          </li>
          <li>
            <strong>Act on data:</strong> Observability without action is
            voyeurism. Fix issues found.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight for Interviews</h3>
          <p>
            In staff engineer interviews, demonstrate understanding that lab
            data (Lighthouse) and field data (RUM) serve different purposes. Lab
            for debugging and CI gates, field for real user experience and SEO.
            Discuss sampling strategies, percentiles vs averages, and
            correlation with business metrics. Show awareness of privacy
            requirements (GDPR, CCPA) for user data collection.
          </p>
        </div>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s the difference between lab data and field data?
            </p>
            <p className="mt-2 text-sm">
              A: Lab data (Lighthouse, WebPageTest) is synthetic — controlled
              environment, reproducible, good for debugging and CI. Field data
              (RUM, CrUX) is from real users — varies by device, network,
              geography, reflects actual experience. Use lab for development and
              debugging, field for monitoring and SEO. Both are needed for
              complete performance picture.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement Core Web Vitals monitoring?
            </p>
            <p className="mt-2 text-sm">
              A: Use web-vitals library from Google. Import onLCP, onINP, onCLS
              observers. Send metrics to analytics endpoint via
              navigator.sendBeacon (reliable, works on unload). Include context:
              URL, device, network, geography. Track percentiles (p75 is Google
              standard). Sample data for high-traffic sites. Alert when p75
              crosses thresholds.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you track JavaScript errors in production?
            </p>
            <p className="mt-2 text-sm">
              A: Use window.onerror for uncaught errors, onunhandledrejection
              for promise rejections. Error boundaries for React errors.
              Interceptors for API errors. Capture error message, stack trace,
              and context (URL, user agent, user ID anonymized). Use tools like
              Sentry or LogRocket for aggregation and alerting. Group similar
              errors, track frequency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you alert on?</p>
            <p className="mt-2 text-sm">
              A: Core Web Vitals p75 (LCP &gt;2.5s, INP &gt;200ms, CLS &gt;0.1).
              Error rate spikes (new release issues). Third-party degradation
              (analytics, ads slow). Geography-specific issues (CDN problems).
              Conversion funnel drop-offs. New error types. Use percentiles, not
              averages — p95 matters for power users.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you balance observability with privacy?
            </p>
            <p className="mt-2 text-sm">
              A: Anonymize user identifiers (hash user IDs). Respect consent
              (GDPR, CCPA) — don&apos;t track without consent. Allow opt-out.
              Mask sensitive fields in session replay (passwords, credit cards).
              Don&apos;t record on sensitive pages. Sample data to reduce
              exposure. Be transparent about data collection in privacy policy.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/user-centric-performance-metrics/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — User-Centric Performance Metrics
            </a>
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
          </li>
          <li>
            <a
              href="https://developers.google.com/web/tools/chrome-user-experience-report"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome UX Report (CrUX)
            </a>
          </li>
          <li>
            <a
              href="https://sentry.io/welcome/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sentry — Error Tracking
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
