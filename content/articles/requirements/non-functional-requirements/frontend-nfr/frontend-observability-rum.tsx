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
        <h2>Advanced Observability Architecture</h2>
        <p>
          RUM data pipeline architecture must handle the unique challenges of collecting, processing, and storing high-volume, high-velocity telemetry data from millions of diverse browser environments. The pipeline begins with client-side data collection — the web-vitals library and custom instrumentation code capture metrics at specific lifecycle events (page load, navigation, user interaction, error occurrence). These metrics are batched client-side (grouping multiple metrics into a single payload to reduce HTTP overhead) and sent to an ingestion endpoint via navigator.sendBeacon, which ensures delivery even when the page is being unloaded (unlike fetch or XMLHttpRequest, which may be cancelled on page unload). The ingestion endpoint receives the batched payloads, validates the schema, enriches them with server-side context (application version, feature flag state, deployment timestamp), and writes them to a message queue (Apache Kafka, AWS Kinesis, or Google Pub/Sub) for asynchronous processing. The message queue decouples ingestion from processing, allowing the ingestion service to remain responsive even when the downstream processing pipeline experiences back-pressure. The processing service consumes messages from the queue, aggregates metrics by time window (1-minute, 5-minute, 1-hour buckets), computes percentiles (p50, p75, p95, p99) for each metric, and writes the aggregated data to a time-series database (InfluxDB, TimescaleDB, or a cloud-native solution like Google BigQuery or AWS Timestream). The aggregation reduces the data volume by 100-1000x compared to storing individual metric events, making long-term trend analysis and dashboard queries feasible. The pipeline must handle out-of-order data (metrics arriving late due to network delays or sendBeacon batching), duplicate data (the same metric sent multiple times due to retry logic), and data loss (metrics lost due to browser crashes or network failures) — the processing service deduplicates based on metric identifiers and uses approximate aggregation algorithms (t-digest, HyperLogLog) that are resilient to missing data points.
        </p>
        <p>
          Sampling strategies for RUM data balance the need for comprehensive visibility against the cost of storing and processing massive data volumes. For a site with 10 million daily active users, collecting every Core Web Vital metric (LCP, INP, CLS, FCP, TTFB) plus custom timing data and error events generates 50-100 million metric events per day, which translates to terabytes of data per month. Uniform random sampling (collecting data from a fixed percentage of users, e.g., 10%) reduces the data volume proportionally but risks missing rare issues that affect small user segments (a bug that affects only 0.1% of users would be missed entirely at 10% sampling). Stratified sampling provides better coverage — it divides users into strata based on device class (mobile, tablet, desktop), network type (4G, 3G, WiFi), geography (North America, Europe, Asia), and application version, then samples a fixed percentage from each stratum. This ensures that every segment is represented in the collected data, even if some segments are small. Error-triggered sampling is the most efficient approach for error visibility — collect performance data from 100% of users who experience errors (every error matters) and 10% of users who do not experience errors (for baseline performance trends). This ensures comprehensive error visibility while controlling the cost of performance data collection. Session replay sampling is even more aggressive (1-5% of sessions) because replays are expensive to store and process — the sampling should prioritize sessions with errors, sessions with poor performance (p95+ metrics), and sessions from key user segments (new users, high-value customers).
        </p>
        <p>
          Privacy-preserving analytics addresses the tension between collecting detailed user behavior data for observability and respecting user privacy expectations and regulatory requirements (GDPR, CCPA). The fundamental principle is data minimization — collect only the data needed for performance monitoring and error tracking, and avoid collecting data that can identify individual users or reveal sensitive information. User identifiers should be anonymized — instead of storing the user&apos;s email or user ID, store a hashed identifier (SHA-256 hash of the user ID with a salt known only to the analytics system) that allows correlating metrics across sessions without exposing the user&apos;s identity. IP addresses should be truncated (removing the last octet for IPv4) or not stored at all, as full IP addresses are considered personal data under GDPR. URL paths should be sanitized to remove dynamic segments that may contain PII (user IDs, email addresses, order numbers) — the URL /users/12345/profile should be normalized to /users/:id/profile before storage. Form input values should never be captured in session replays or analytics events — input fields should be masked by default, and the masking should be applied client-side before data is transmitted to the analytics server. Consent management integration ensures that RUM data collection respects the user&apos;s consent choices — if the user has not consented to analytics tracking, the RUM instrumentation should not collect or transmit data. The consent state should be checked on every page load, and the RUM data collection should be enabled or disabled accordingly.
        </p>
        <p>
          Performance anomaly detection uses statistical methods to automatically identify when performance metrics deviate from their expected baseline, enabling proactive issue detection before users are significantly impacted. The baseline is established from historical data — for each metric (LCP, INP, CLS, API response time, error rate), the system computes the rolling median and interquartile range (IQR) over a lookback window (typically 7-14 days to capture weekly patterns). An anomaly is detected when the current metric value exceeds the baseline by more than a configurable threshold (e.g., the current p75 LCP exceeds the baseline p75 plus 2x the IQR). The detection should account for temporal patterns — performance naturally varies by time of day (peak traffic hours may have slower response times), day of week (weekend traffic patterns differ from weekdays), and geographic region (users in different regions have different network conditions). The anomaly detection algorithm should compare the current metric to the baseline for the same time window (comparing Tuesday 2pm to previous Tuesdays at 2pm, not to Sunday 3am). When an anomaly is detected, the system automatically investigates potential causes — it correlates the anomaly with recent deployments (was a new version deployed in the last hour?), third-party script changes (did a vendor update their script?), traffic pattern changes (is there a traffic spike from a marketing campaign?), and infrastructure changes (was a CDN configuration changed?). The root cause analysis ranks potential causes by their temporal proximity and known impact, providing the on-call engineer with a prioritized list of investigation starting points.
        </p>
        <p>
          Business metric correlation connects technical performance metrics to business outcomes, making observability data actionable for stakeholders beyond the engineering team. The correlation analysis uses statistical methods (correlation coefficients, regression analysis, A/B testing) to quantify the relationship between performance metrics and business metrics. For e-commerce, the analysis correlates LCP with conversion rate — does a 500ms improvement in LCP increase the checkout completion rate? For content sites, the analysis correlates INP with engagement metrics — does reducing INP from 300ms to 150ms increase the average session duration and pages per session? For SaaS applications, the analysis correlates error rate with customer churn — does a spike in JavaScript errors increase the likelihood that a customer cancels their subscription? The correlation analysis should control for confounding variables — seasonal traffic patterns, marketing campaigns, product changes — to isolate the causal effect of performance on business outcomes. The results are presented in executive dashboards that translate technical metrics into business impact — &quot;Improving LCP from 3.5s to 2.0s is projected to increase conversion rate by 8%, generating an additional $2.4M in annual revenue&quot; — making the case for performance investment in terms that resonate with business stakeholders. The correlation analysis should be refreshed quarterly to account for changes in user behavior, competitive landscape, and product evolution.
        </p>
        <p>
          Session replay privacy implementation requires careful balancing of debugging value against user privacy risk. Session replay tools (LogRocket, FullStory, Hotjar) record the user&apos;s screen interactions (mouse movements, clicks, scrolls, form inputs, page navigations) and replay them as a video-like experience for debugging and UX analysis. The privacy risk is that session replays capture everything the user sees and does — including form inputs (passwords, credit card numbers, personal information), sensitive data displayed on screen (account balances, health records, private messages), and user behavior patterns that reveal personal information. The implementation must mask sensitive content client-side before it is transmitted to the replay service — input fields should be replaced with placeholder text (asterisks or &quot;[masked]&quot;), sensitive pages (checkout, settings, health data) should be excluded from recording entirely, and dynamic content that may contain PII should be detected and masked using CSS selectors or DOM traversal rules. The masking must be applied to the replay data at the source (in the browser) — masking at the replay service level is insufficient because the unmasked data has already been transmitted. The replay service should provide role-based access control — only authorized team members (engineers debugging specific issues, UX researchers analyzing user behavior) can view replays, and access is logged for audit purposes. The replay data should have a defined retention period (30-90 days) after which it is automatically deleted, and users should be informed about session replay collection in the privacy policy with an opt-out mechanism.
        </p>
        <p>
          Observability cost management addresses the financial reality that comprehensive RUM data collection, session replay storage, and alerting infrastructure can become a significant operational expense, particularly for high-traffic applications. The cost drivers are data volume (number of metric events, session replays, error traces stored), query complexity (dashboards with multiple metric aggregations, ad-hoc queries that scan large datasets), and alerting frequency (alerts that trigger on common conditions generate notification overhead). Cost optimization strategies include implementing tiered storage — hot storage (SSD-backed, fast queries) for recent data (last 7 days), warm storage (HDD-backed, moderate query speed) for medium-term data (7-90 days), and cold storage (object storage, slow queries) for long-term data (90+ days). This ensures that frequently accessed recent data is queryable with low latency, while historical data is retained for compliance and trend analysis at lower cost. Data retention policies should be enforced automatically — raw metric events are deleted after 30 days, aggregated data (daily percentiles) is retained for 1 year, and trend data (monthly summaries) is retained indefinitely. Query optimization reduces the cost of dashboard and ad-hoc queries — pre-computing common aggregations (daily p75 LCP by device class) avoids scanning raw data for every dashboard load, and query result caching avoids redundant computation for repeated queries. The observability budget should be set as a percentage of infrastructure costs (typically 5-10% of total cloud spend) and monitored monthly to detect cost overruns that indicate either increased data volume (more users, more instrumentation) or inefficient data management (overly granular sampling, excessive replay storage).
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
