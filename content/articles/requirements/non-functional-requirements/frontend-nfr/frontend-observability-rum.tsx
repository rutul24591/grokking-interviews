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
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
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
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Frontend Observability</strong> provides visibility into how
          web applications perform and behave in production from the actual
          user&apos;s perspective. Real User Monitoring (RUM) collects data from
          real user sessions — page load times, JavaScript errors, user
          interaction patterns, conversion funnels, and network request
          performance — enabling engineering teams to understand application
          health, detect issues proactively, and make data-driven optimization
          decisions. Unlike synthetic monitoring (Lighthouse, WebPageTest) which
          tests from controlled environments, RUM captures the variability of
          real-world conditions: diverse devices, network qualities, geographic
          locations, and user behavior patterns.
        </p>
        <p>
          For staff engineers, observability is the foundation of production
          quality assurance. You cannot improve what you cannot measure, and
          frontend performance directly impacts business outcomes — every 100ms
          improvement in load time correlates with measurable increases in
          conversion rates, user engagement, and revenue. Observability enables
          proactive issue detection (identifying performance regressions before
          users complain), performance budget enforcement (alerting when metrics
          cross defined thresholds), and correlation between technical metrics
          and business outcomes (how does LCP affect checkout completion rate).
        </p>
        <p>
          Modern frontend observability spans four pillars: performance metrics
          (Core Web Vitals, custom timing data, resource timing), error tracking
          (JavaScript exceptions, rejected promises, API failures, resource
          loading errors), user session analysis (page views, navigation paths,
          session replays, rage click detection), and infrastructure correlation
          (CDN performance, API latency, third-party script impact). Integrating
          these pillars provides a complete picture of frontend health that
          isolated monitoring tools cannot achieve.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Core Web Vitals are the industry-standard performance metrics defined
          by Google, focusing on three dimensions of user experience. Largest
          Contentful Paint (LCP) measures loading performance — the time from
          navigation start until the largest image or text block visible in the
          viewport is rendered. The target is under 2.5 seconds. Interaction to
          Next Paint (INP) measures interactivity and responsiveness — the
          longest interaction delay observed during the page lifecycle,
          replacing First Input Delay (FID) in March 2024. The target is under
          200 milliseconds. Cumulative Layout Shift (CLS) measures visual
          stability — the sum of all unexpected layout shifts during the page
          lifecycle, where a layout shift occurs when a visible element changes
          position between frames. The target is under 0.1.
        </p>
        <p>
          Supplemental performance metrics provide additional context. First
          Contentful Paint (FCP) measures when the first text or image is
          rendered, indicating that the page is loading (target under 1.8
          seconds). Time to First Byte (TTFB) measures server responsiveness —
          the time from navigation until the first byte of the HTML response
          arrives (target under 800 milliseconds). First Paint (FP) measures
          when any pixel is rendered, often just the background color. These
          metrics form a hierarchy — TTFB affects FCP, which affects LCP, which
          affects user perception of page speed.
        </p>
        <p>
          Measurement strategy involves the web-vitals library from Google,
          which provides observers for each Core Web Vital metric. The library
          reports metrics when they become available — LCP is reported when the
          largest content element is painted, INP is reported continuously
          throughout the page lifecycle, and CLS is reported when the page is
          hidden or unloaded. Metrics are sent to an analytics endpoint via{" "}
          <code>navigator.sendBeacon</code>, which ensures delivery even when
          the page is being unloaded. The data should include context: current
          URL, device class (mobile, tablet, desktop), network type (4G, 3G,
          WiFi), geography, and navigation type (navigate, reload, back-forward).
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/rum-metrics-flow.svg"
          alt="RUM Metrics Flow"
          caption="Real User Monitoring data flow — metric collection via web-vitals library, batching, sampling, context enrichment, and reporting to analytics pipeline via sendBeacon"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The RUM data collection architecture operates at the browser level,
          using the Performance API to capture high-resolution timing data for
          navigation, resources, and user interactions. The Navigation Timing
          API provides timestamps for key events (navigation start, DNS lookup,
          TCP connection, TLS negotiation, request sent, response received, DOM
          loading, page load complete). The Resource Timing API captures the same
          detail for every resource loaded by the page (JavaScript bundles, CSS
          files, images, fonts, API calls). The web-vitals library builds on
          these APIs to compute user-centric metrics (LCP, INP, CLS) that
          correlate with perceived performance.
        </p>
        <p>
          The data pipeline processes collected metrics through several stages.
          Client-side batching groups multiple metrics into a single request to
          reduce network overhead. Sampling reduces data volume — for high
          traffic sites, collecting data from 1-10% of users provides
          statistically significant insights while controlling costs. The data
          is sent to an ingestion endpoint (via sendBeacon for reliability) that
          processes and enriches it with additional context (user segment,
          experiment variant, application version). The enriched data is stored
          in a time-series database and aggregated for dashboards, alerts, and
          trend analysis.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/observability-architecture.svg"
          alt="Observability Architecture"
          caption="Frontend observability architecture — browser data collection (Performance API, web-vitals), batching and sampling, ingestion pipeline, time-series storage, dashboards, and alerting"
        />

        <p>
          Error tracking captures JavaScript errors, rejected promises, resource
          loading failures, and API failures from real user sessions. Errors are
          captured via <code>window.onerror</code> for uncaught exceptions,
          <code>window.onunhandledrejection</code> for Promise rejections, error
          boundaries for React component errors, and HTTP interceptors for API
          failures. Each error is enriched with context — the error message and
          stack trace (mapped back to source code via source maps uploaded to
          the tracking service), user identifier (anonymized), session ID, page
          URL, browser and OS information, network status, and recent user
          actions for reproduction.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/error-tracking-flow.svg"
          alt="Error Tracking Flow"
          caption="Error tracking pipeline — error capture (onerror, onunhandledrejection, error boundaries, API interceptors), context enrichment, grouping by similarity, trend analysis, and alerting"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Sampling rate selection involves balancing data fidelity against cost
          and privacy. Collecting data from 100% of users provides the most
          complete picture but generates massive data volumes, increases costs
          for RUM platforms, and raises privacy concerns. Collecting from 1% of
          users minimizes cost but may miss rare issues that affect small user
          segments. The pragmatic approach is stratified sampling — collect from
          100% of users who experience errors (every error matters), 10-20% of
          users for performance metrics (statistically significant for trend
          detection), and 1-5% for session replays (expensive storage, used for
          debugging specific issues). This ensures comprehensive error visibility
          while controlling performance data costs.
        </p>
        <p>
          Lab data (Lighthouse, WebPageTest) versus field data (RUM, Chrome UX
          Report) serve different purposes and both are necessary. Lab data
          provides controlled, reproducible measurements in a consistent
          environment — ideal for debugging performance issues, comparing
          optimization impact, and gating deployments with performance budgets.
          Field data reflects actual user experience across the diversity of
          real devices, networks, and conditions — ideal for monitoring
          production health, understanding geographic and device-specific
          performance, and correlating technical metrics with business outcomes.
          The trade-off is not either/or — use lab data for development and CI
          gates, and field data for production monitoring and SEO reporting.
        </p>
        <p>
          Session replay provides invaluable debugging context — seeing exactly
          what the user saw, how they interacted, and where they encountered
          errors — but raises significant privacy concerns. Recording user
          sessions captures form inputs, personal information, and potentially
          sensitive data displayed on screen. The trade-off is debugging power
          versus user privacy. Mitigation strategies include masking input
          fields by default, excluding sensitive pages (checkout, settings,
          health data) from recording, respecting user consent (GDPR, CCPA
          requirements), providing opt-out mechanisms, and sampling replays
          aggressively (1-5% of sessions).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Start observability implementation with Core Web Vitals as the
          foundation. These metrics (LCP, INP, CLS) are Google ranking factors,
          correlate with user experience, and have well-defined thresholds for
          good, needs-improvement, and poor experiences. Instrument the
          web-vitals library in your application, send metrics to your analytics
          platform with appropriate context, and build dashboards that show
          trends over time. Track percentiles (p50, p75, p95) rather than
          averages — the p75 is Google&apos;s standard for Core Web Vitals
          assessment, meaning 75% of users experience the metric at or below
          this value. Also track p95 for power users who may have slower
          devices or networks.
        </p>
        <p>
          Segment performance data by device class, network type, geography, and
          user type (new versus returning). Aggregate metrics hide important
          variations — your p75 LCP might be 2.2 seconds globally, but 4.5
          seconds for users on 3G networks in emerging markets. Segment-specific
          dashboards reveal these disparities and guide optimization efforts
          toward the user segments that need the most improvement. Track
          performance by application version to identify which deployments
          introduced regressions.
        </p>
        <p>
          Correlate technical performance metrics with business outcomes to
          make observability data actionable for stakeholders. Connect LCP
          improvements to conversion rate increases, INP improvements to task
          completion rates, and error rate reductions to customer support ticket
          decreases. Build executive dashboards that show business-relevant
          metrics (conversion rate by performance quartile, revenue impact of
          slow pages) alongside technical metrics. This alignment ensures that
          performance optimization receives sustained organizational investment
          because its business impact is visible and quantifiable.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Observing without acting is the most wasteful observability pitfall.
          Collecting terabytes of performance data, building beautiful
          dashboards, and setting up alerts is pointless if the data does not
          drive action. Teams that invest in observability must also invest in
          performance optimization based on what the data reveals. Set
          performance budgets that trigger alerts when metrics degrade, assign
          ownership for each metric category, and include performance
          improvement work in sprint planning. Observability without action is
          voyeurism — interesting to watch but producing no value.
        </p>
        <p>
          Over-collecting data without a retention and analysis strategy creates
          a data swamp — vast amounts of information that are expensive to store
          and impossible to query effectively. Define a data retention policy
          (raw data for 30 days, aggregated data for 1 year, trend data
          indefinitely), implement automated data lifecycle management, and
          ensure your analysis tools can query the data volume you collect.
          Regular data cleanup and aggregation prevents the observability
          platform from becoming a cost center that provides diminishing returns.
        </p>
        <p>
          Ignoring third-party script impact in performance monitoring is a
          common blind spot. Analytics scripts, ad networks, chat widgets, and
          A/B testing tools collectively account for 30-50% of total JavaScript
          on many pages, and their performance directly affects Core Web Vitals.
          Monitor third-party script load times, main thread execution time, and
          their contribution to INP. When a third-party script degrades
          performance, you need data to hold the vendor accountable and make
          informed decisions about whether the script&apos;s business value
          justifies its performance cost.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          E-commerce platforms use RUM data to optimize the checkout funnel —
          the sequence of pages from cart to order confirmation. By correlating
          LCP and INP with checkout abandonment rates, teams identify that pages
          with LCP above 3 seconds have 40% higher abandonment than pages under
          2 seconds. This data drives targeted optimization: image optimization
          for product images in the cart, JavaScript code splitting to reduce
          the payment page bundle, and server-side rendering for the order
          confirmation page. The result is measurable improvement in checkout
          completion rate, directly attributable to performance improvements.
        </p>
        <p>
          Media and publishing companies use RUM to understand how performance
          affects content consumption. The Washington Post and The New York
          Times correlate page load speed with article completion rate and time
          spent reading. They discovered that articles loading in under 2
          seconds have 25% higher completion rates than articles taking 4+
          seconds. This insight drives their performance optimization strategy:
          inline critical CSS for above-the-fold content, lazy-load below-the
          fold images and ads, and defer analytics scripts until after the
          content is rendered.
        </p>
        <p>
          SaaS companies use observability for proactive incident detection.
          Rather than waiting for users to report issues, they monitor error
          rate trends, performance degradation patterns, and user frustration
          signals (rage clicks, error toast dismissals, rapid page refreshes).
          When the error rate for a specific component increases by 20% compared
          to the 24-hour baseline, an alert is triggered before users notice.
          Session replays of affected users provide immediate debugging context,
          enabling the team to identify and resolve the root cause within
          minutes rather than hours.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between lab data and field data?
            </p>
            <p className="mt-2 text-sm">
              A: Lab data (Lighthouse, WebPageTest) is synthetic testing in a
              controlled, reproducible environment — consistent device, network,
              and location. It is ideal for debugging, comparing optimization
              impact, and CI gates. Field data (RUM, Chrome UX Report) comes
              from real users across diverse devices, networks, geographies, and
              conditions — it reflects actual user experience. Use lab data for
              development and debugging, field data for production monitoring
              and SEO. Both are needed for a complete performance strategy.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement Core Web Vitals monitoring?
            </p>
            <p className="mt-2 text-sm">
              A: Install the web-vitals library from Google. Import metric
              observers (onLCP, onINP, onCLS) and register callbacks that send
              metrics to your analytics endpoint via navigator.sendBeacon for
              reliable delivery even on page unload. Include context: URL,
              device class, network type, geography, navigation type. Track
              percentiles (p75 is Google&apos;s standard, p95 for power users).
              Sample data for high-traffic sites (10-20%). Alert when p75
              crosses good-to-needs-improvement thresholds.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you track JavaScript errors in production?
            </p>
            <p className="mt-2 text-sm">
              A: Use window.onerror for uncaught exceptions,
              onunhandledrejection for Promise rejections, React Error Boundaries
              for component errors, and HTTP interceptors for API failures.
              Capture the error message, stack trace, and context (URL, user
              agent, anonymized user ID, session ID). Upload source maps to your
              error tracking service (Sentry, LogRocket) for source-level stack
              traces. Group similar errors to identify trends. Alert on new
              error types or frequency spikes, ignore known benign errors.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you alert on?</p>
            <p className="mt-2 text-sm">
              A: Core Web Vitals p75 — LCP above 2.5s, INP above 200ms, CLS
              above 0.1. Error rate spikes — new error types or 20%+ increase in
              existing error frequency. Third-party degradation — analytics or
              ad scripts exceeding performance budgets. Geography-specific
              issues — CDN problems affecting specific regions. Conversion
              funnel drop-offs correlated with performance degradation. Use
              percentiles, not averages — averages hide the experience of the
              slowest 25% of users.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you balance observability with user privacy?
            </p>
            <p className="mt-2 text-sm">
              A: Anonymize user identifiers — hash user IDs rather than storing
              them raw. Respect consent requirements (GDPR, CCPA) — do not track
              without user consent where required. Allow opt-out mechanisms. Mask
              sensitive input fields in session replays by default. Exclude
              sensitive pages (checkout, settings, health data) from recording.
              Sample data to reduce exposure. Be transparent about data
              collection in your privacy policy. Store data with defined
              retention periods and automated cleanup.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/articles/user-centric-performance-metrics"
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
              web-vitals Library — Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/web/tools/chrome-user-experience-report"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome UX Report (CrUX) — Field Data
            </a>
          </li>
          <li>
            <a
              href="https://sentry.io/welcome/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sentry — Error Tracking and Performance Monitoring
            </a>
          </li>
          <li>
            <a
              href="https://httparchive.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              HTTP Archive — Web Performance Benchmarks
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
