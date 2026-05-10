"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-telemetry-analytics-pipeline",
  title: "Design Telemetry/Analytics Pipeline",
  description:
    "Production-grade analytics with event collection, batching, sampling, privacy compliance, and real-time dashboards.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "telemetry-analytics-pipeline",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-06",
  tags: ["lld", "analytics", "telemetry", "event-tracking", "privacy"],
  relatedTopics: ["feature-flag-system", "feature-rollout-system"],
};

export default function TelemetryAnalyticsPipelineArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Frontend telemetry is the mechanism by which product teams understand what users actually do—which features are used, where users drop off, how long flows take, and what errors users encounter. Without telemetry, product decisions are based on opinions. With well-designed telemetry, they are based on evidence. The design challenge is collecting this data efficiently (events must not impact application performance), correctly (events must be attributed to the right user actions), and responsibly (privacy regulations like GDPR and CCPA require consent, data minimization, and the right to deletion).</p>
        <p>The frontend SDK is responsible for event capture, local batching, network delivery, and sampling. If the SDK blocks the main thread (large JSON serialization, synchronous network calls), it degrades the product it is measuring. If it sends every event immediately, it creates a flood of small network requests. If it doesn't survive page unloads, events from the most critical moments (just before checkout abandon, final step before signup drop-off) are lost. Each of these constraints has a specific technical solution.</p>
        <p><strong>Explicit assumptions:</strong> The analytics SDK runs in the browser. Events are user-action driven (not synthetic). The backend is an ingestion API that writes events to a data warehouse (BigQuery, Snowflake) and a streaming system (Kafka) for real-time dashboards. GDPR/CCPA compliance requires consent before collecting PII; PII in events must be hashed or excluded. The SDK integrates with the application's consent management platform.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Event tracking:</strong> SDK exposes track(eventName, properties) and page(pageName, properties) APIs. Events are captured synchronously in JavaScript, delivered asynchronously.</li>
          <li><strong>Automatic instrumentation:</strong> Track page views, clicks on instrumented elements (data-analytics-id attributes), and JavaScript errors automatically without manual track() calls.</li>
          <li><strong>Batching:</strong> Accumulate events locally and send in batches (up to 20 events or 5 seconds, whichever comes first) to reduce network overhead.</li>
          <li><strong>Sampling:</strong> For high-volume events (scroll, page_view), apply configurable sampling rates (e.g., 10% of scroll events) to reduce data volume without losing statistical significance.</li>
          <li><strong>Session and user identity:</strong> Assign a session ID (per session) and anonymous device ID (persistent across sessions). Associate events with userId when authenticated.</li>
          <li><strong>Unload persistence:</strong> Use navigator.sendBeacon() to deliver pending events before page unload.</li>
          <li><strong>Privacy compliance:</strong> Respect consent signals. When consent is denied, stop event collection. Hash or exclude PII fields from all events.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> SDK initialization under 50ms. Event capture under 1ms (synchronous portion). No main thread blocking during batch delivery.</li>
          <li><strong>Reliability:</strong> Events must not be lost on page close (sendBeacon) or network failure (retry with exponential backoff).</li>
          <li><strong>Privacy:</strong> No PII in events without explicit consent. Events attributable to specific users must be deletable upon GDPR right-to-erasure requests.</li>
          <li><strong>Scalability:</strong> SDK handles up to 1000 events per minute per user without degrading collection performance.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The analytics SDK is a singleton initialized once on application startup. It maintains an in-memory event queue and a batch timer. When track() is called, the event is pushed to the queue synchronously. The batch timer flushes the queue every 5 seconds; a capacity check flushes immediately if the queue reaches 20 events. On page unload, navigator.sendBeacon() delivers any remaining events without blocking navigation.</p>
        <p>The event envelope (the outer wrapper around each event) contains: eventId (UUID), timestamp (ISO 8601 with millisecond precision), sessionId, deviceId, userId (null if unauthenticated), sdkVersion, appVersion, page URL (path only, no query parameters by default to avoid capturing PII in URLs), and viewport size. User-defined properties from the track() call are nested in a properties object. This separation allows the ingestion system to index envelope fields and store properties as opaque JSON.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/telemetry-analytics-pipeline.svg"
          alt="Telemetry analytics pipeline showing event SDK collection with batching, sampling for high-volume events, beacon delivery on page unload, ingestion API to Kafka and data warehouse, privacy PII hashing, and real-time dashboard feed"
          caption="Telemetry analytics pipeline showing event SDK collection with batching, sampling for high-volume events, beacon delivery on page unload, ingestion API to Kafka and data warehouse, privacy PII hashing, and real-time dashboard feed"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Event Batching and Flush Strategy</h3>
        <p>The batch queue is a simple in-memory array. When track() is called, the event is appended. The flush function serializes the batch to JSON and sends it to the ingestion endpoint. Serialization of 20 events is typically under 10KB—well within the limits of a single HTTP request. The flush function runs in two cases: timer-based (every 5 seconds via setInterval) and capacity-based (immediately when the queue reaches 20 events). Both cases call the same flush implementation.</p>
        <p>During flush, the queue is drained (moved to a sending buffer). If the flush fails (network error), the sending buffer is moved back to the queue for retry. A retry counter prevents infinite retry loops; after 3 failed flushes, the events are discarded and an internal error metric is incremented (tracking delivery failures is itself important telemetry). The retry uses exponential backoff (5s, 10s, 20s) to avoid hammering a recovering server.</p>
        <p>The page unload handler (beforeunload + pagehide for better mobile support) calls navigator.sendBeacon() with the current queue contents. sendBeacon() is fire-and-forget—it doesn't provide a success callback or retry capability. This is acceptable for unload events: the alternative (waiting for a fetch to complete in beforeunload) would delay navigation, which browsers progressively restrict. For the unload case, best-effort delivery is the right trade-off: losing the occasional unload batch is preferable to blocking navigation.</p>

	        <h3 className="mt-6 mb-3 text-lg font-semibuild">Sampling Strategy</h3>
	        <p>High-volume events (scroll depth, mousemove, video play progress) generate orders of magnitude more events than discrete user actions (button clicks, form submits). Sending every scroll event for every user would overwhelm the ingestion pipeline and produce data with no additional insight (knowing that 10% of users scroll past 50% on a page is statistically equivalent to knowing that 100% of users scroll past 50%—just measured on a sample).</p>
	        <p>The SDK applies per-event-type sampling rates configured by the analytics team. For example, scroll depth might be sampled while page views, button clicks, and purchases are retained fully. Sampling is implemented at the SDK level using a consistent hash of the device identifier so the same device is deterministically included or excluded for a given event type. This preserves user-level analysis for the sampled population and avoids noisy randomness across events. The decision rule is a simple bucket assignment based on the hash, compared against the configured sampling threshold, and events that are not selected are dropped before they reach the queue.</p>
        <p>Sampling must be transparent to the downstream analysis: sampled events are tagged with the sample rate (sampleRate: 0.1 for 10% sampled events). The data warehouse can then apply inverse weighting (divide by sample rate) to project sampled metrics to population-level estimates. Without this tag, the analysis team would compute incorrect totals by treating sampled scroll counts as absolute counts.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Identity Management and Session Tracking</h3>
        <p>Device ID is a UUID stored in localStorage under a dedicated key. It is generated on first visit and persists across sessions and page refreshes. It is the anonymous identity anchor: all events from the same browser instance (regardless of authentication state) share the same deviceId. Cross-device identity (user on phone and desktop) requires the authenticated userId for linkage.</p>
        <p>Session ID is a UUID generated at SDK initialization and held in memory (not persisted). It resets on page load and expires after 30 minutes of inactivity (the timer resets on each event). Session boundaries define "visits" for analytics purposes: a session encompasses all events between entry and 30 minutes of idle. Keeping sessionId in memory (not localStorage) means that opening two tabs creates two sessions with different sessionIds—this correctly models the user having two independent browsing contexts.</p>
        <p>Identity resolution on login: when a user authenticates, the SDK is called with identify(userId). From that point, all subsequent events include userId. The SDK also sends a special "identify" event linking the current deviceId (and all previous anonymous events from this device) to the userId. The analytics backend processes identify events to merge the anonymous event history with the authenticated user's profile—enabling funnel analysis that spans pre-login and post-login behavior (e.g., "how many users who viewed the pricing page as anonymous visitors eventually converted to paying customers?").</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Privacy and Consent Compliance</h3>
        <p>GDPR (EU) and CCPA (California) require informed user consent before collecting analytics data. The SDK integrates with the application's Consent Management Platform (CMP): on initialization, the SDK checks the current consent state. If analytics consent is not granted, the SDK enters a passive mode: track() calls are no-ops and no events are queued or delivered. When the user grants consent (via the cookie banner), the CMP fires a consent-granted event, the SDK enables itself, and begins collecting from that point (not retroactively).</p>
        <p>PII must not appear in event properties without explicit data-sensitive consent. The most common PII risks: email addresses in page URLs (email confirmation links, password reset links), names in page titles, user-generated content in click text properties (the text of a button the user clicked might be their own input). The SDK should strip known PII patterns from automatically captured properties (URL query parameters, click text) using a configurable blocklist. For custom properties in track() calls, the analytics team is responsible for not passing PII directly; a schema validation layer at ingestion can flag properties that match PII patterns.</p>
        <p>GDPR right-to-erasure requests require deleting all events attributable to a specific userId from the data warehouse. This is implemented via a pseudonymization strategy: the userId stored in events is not the raw application userId but a hashed version (SHA-256(userId + salt)). When an erasure request arrives, the salt is rotated for that userId—all historical hashes become unresolvable, effectively anonymizing the historical events without physical deletion (which is expensive in columnar data warehouses). New events for that userId use the new salt and are disconnected from the old events.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Automatic Instrumentation</h3>
        <p>Requiring developers to add track() calls for every user action is tedious and results in incomplete coverage (actions are forgotten, renamed, or removed without updating the analytics calls). Automatic instrumentation reduces the instrumentation burden: the SDK listens for click events at the document level (event delegation) and automatically tracks clicks on elements with a data-analytics-id attribute. The event includes the analytics ID, element type, and page context. This requires the design/development process to include analytics IDs as part of component creation—no different from adding accessibility labels.</p>
        <p>JavaScript error tracking is another high-value automatic instrumentation: the SDK listens on window.onerror and window.onunhandledrejection, captures the error message, stack trace (truncated to avoid PII in stack frames), component context (if using a React Error Boundary that reports to the SDK), and occurrence count. These error events are sent with higher priority than user-action events (they don't participate in the batch timer's 5-second delay; they flush immediately).</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>SDK-managed batching versus beacon-based delivery: some teams send every event immediately using sendBeacon() (no batching, always fire-and-forget). This eliminates the batch complexity and the risk of losing events if the user closes the tab between batch flushes. The downside is one HTTP request per event—expensive at scale (100 user actions per session × 100,000 DAU = 10M requests per day just for analytics). Batching is the right choice for any application at moderate scale.</p>
        <p>Client-side sampling versus server-side sampling: client-side sampling (the SDK decides what to send) reduces network and processing load. Server-side sampling (the SDK sends everything; the ingestion pipeline samples on write) provides full fidelity for debugging and allows changing sampling rates without a client deploy. The trade-off is network cost: high-volume events (scroll, video progress) generate enough traffic that server-side sampling defeats its purpose. Hybrid: client-side sample high-volume events, server-side sample everything else.</p>
        <p>First-party versus third-party analytics: using a third-party SDK (Segment, Mixpanel, Amplitude's browser SDK) is faster to implement but introduces a dependency on an external script that can be blocked by ad blockers, adds third-party cookies to the consent scope, and creates potential data-sharing concerns. First-party analytics (custom SDK sending to first-party ingestion endpoint) is more resilient to ad blockers, gives full control over data handling, and simplifies compliance. The trade-off is the engineering investment to build and maintain the pipeline.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A production analytics SDK batches events (up to 20 events or 5 seconds) to reduce network overhead, applies per-event-type sampling rates using consistent hashing (so the same device is consistently in or out of the sample), and uses navigator.sendBeacon() for reliable delivery on page unload. Identity management uses a persistent deviceId and in-memory sessionId; the identify() call links anonymous sessions to authenticated users. Privacy compliance requires consent gating (SDK is passive until consent is granted), PII stripping from automatic property capture, and pseudonymization via hashed userIds for right-to-erasure without physical deletion. Automatic instrumentation (data-analytics-id click delegation, window.onerror capture) reduces manual instrumentation burden. The ingestion backend writes events to Kafka for real-time dashboards and to a data warehouse for historical analysis. Sampled events are tagged with their sample rate for correct inverse-weighting in analysis.</p>
      </section>
    </ArticleLayout>
  );
}
