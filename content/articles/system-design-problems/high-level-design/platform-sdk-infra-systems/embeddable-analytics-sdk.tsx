"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-embeddable-analytics-sdk",
  title: "Design an Embeddable Analytics SDK",
  description:
    "Architecture for a client-side analytics SDK: event collection, batching, privacy compliance, delivery guarantees, and performance impact on host pages.",
  category: "high-level-design",
  subcategory: "platform-sdk-infra-systems",
  slug: "embeddable-analytics-sdk",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "analytics", "sdk", "tracking", "privacy", "batching"],
  relatedTopics: ["frontend-sdk-for-third-party-developers", "frontend-observability-dashboard-rum-like-datadog"],
};

export default function EmbeddableAnalyticsSdkArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>An embeddable analytics SDK is a JavaScript library that third-party websites include to track user behavior—page views, clicks, custom events, funnel steps, session recordings—and transmit that data to a central analytics platform. The SDK operates inside a host page it does not control, meaning it must be a well-behaved guest: minimal performance impact, no interference with the host page's functionality, no unhandled errors that could crash the host, and compliance with privacy regulations (GDPR, CCPA) that may restrict what data can be collected from users in different jurisdictions.</p>
        <p>The defining engineering tension is reliability versus performance. To ensure no events are lost (even on page unload), the SDK must queue events durably and use delivery mechanisms that survive navigation. But a heavyweight SDK that adds 200ms to page load or causes layout thrash will be removed by host developers regardless of its reliability. The SDK must be invisible in normal operation and resilient at the edge cases (page unload, network loss, consent changes mid-session).</p>
        <p><strong>Explicit assumptions:</strong> The SDK is a self-contained JavaScript bundle loaded via a script tag or npm package. It supports web only (not mobile native). Events are structured: name (string), properties (JSON-serializable object), timestamp (ISO 8601), sessionId, userId (or anonymousId for non-identified users). The analytics platform backend is owned by the same organization as the SDK. The SDK must support GDPR opt-in/opt-out at any point during the session. The host page may navigate or close at any time; events must not be silently lost on unload.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Event tracking:</strong> The SDK exposes a simple API (analytics.track(name, properties)) for custom events. It automatically tracks page views on route changes (including SPA hash/history navigation).</li>
          <li><strong>Identity management:</strong> analytics.identify(userId, traits) links events to a user. Anonymous events (pre-identify) are retrospectively associated when identify is called.</li>
          <li><strong>Batching and delivery:</strong> Events are batched and sent to the analytics ingestion endpoint in bulk to minimize network requests. Events are delivered at-least-once.</li>
          <li><strong>Unload resilience:</strong> Events queued at the time of page navigation or close are not lost.</li>
          <li><strong>Privacy controls:</strong> The SDK respects user consent: if the user has not consented (GDPR opt-in not given), no events are collected or transmitted. If consent is withdrawn mid-session, queued events are discarded and future events are suppressed.</li>
          <li><strong>Session management:</strong> A session is a continuous period of user activity. Sessions time out after 30 minutes of inactivity and restart on the next user interaction.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Bundle size:</strong> The SDK bundle must be under 15KB gzipped. Each kilobyte of third-party script added to a page has real user impact; the SDK must earn its weight.</li>
          <li><strong>Performance:</strong> The SDK must not block the main thread for more than 5ms during event processing. All network requests are non-blocking and do not affect page rendering.</li>
          <li><strong>Throughput:</strong> The ingestion backend must handle 100,000 events per second across all customers at peak.</li>
          <li><strong>Data accuracy:</strong> Event loss rate under 0.1% in normal network conditions (excluding user-initiated page closes with no connectivity).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The SDK has four internal modules: the Event Collector (public API, event validation, session management, identity tracking), the Event Queue (in-memory queue with localStorage persistence, consent gating, batching logic), the Delivery Manager (batch transmission via fetch with sendBeacon fallback on unload, retry with exponential backoff), and the Privacy Manager (consent state machine, PII scrubbing, data minimization). The SDK initializes asynchronously (does not block page rendering) and processes events on the main thread using a microtask queue to avoid blocking user interactions.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/embeddable-analytics-sdk-architecture.svg"
          alt="Embeddable analytics SDK architecture showing Event Collector (public API: track, identify, page), Privacy Manager (consent state, PII scrubbing), Event Queue (in-memory buffer + localStorage persistence, batching by count/time), Delivery Manager (fetch batches, sendBeacon on unload, exponential backoff retry), and backend Ingestion Service (Kafka, deduplication, S3 archival). Session management with 30-minute inactivity timeout."
          caption="SDK architecture: Event Collector → Privacy Manager → Event Queue → Delivery Manager → Ingestion Service, with localStorage persistence and sendBeacon unload resilience"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Event Collection and Session Management</h3>
        <p>The public API surface is minimal: analytics.load(writeKey, options), analytics.track(event, properties), analytics.identify(userId, traits), analytics.page(name, properties), and analytics.reset() (for logout). The writeKey identifies the customer's analytics workspace and is validated by the ingestion backend. Events have a client-generated eventId (UUID v4) used for server-side deduplication, a sessionId (persisted in sessionStorage, reset on 30-minute inactivity or browser session end), and a context object automatically populated with: page URL, referrer, user agent, viewport dimensions, and timezone.</p>
        <p>Session management: the SDK listens for user interaction events (mousemove, keydown, scroll, touchstart) to detect activity. The session timer is reset on each interaction. If 30 minutes pass without any interaction, the session ends. The next interaction starts a new session with a new sessionId. The sessionId is stored in sessionStorage (so it does not persist across browser restarts, aligning with the analytics industry's session definition). The session start event is automatically tracked on each new session.</p>
        <p>SPA navigation tracking: single-page applications change routes without triggering browser page loads. The SDK intercepts history.pushState and history.replaceState (by monkey-patching—wrapping the original functions to fire an event before delegating to the originals) and listens to the popstate event. On each navigation, analytics.page() is called automatically with the new URL. This automatic page tracking can be disabled via the options object for SPAs that prefer manual page tracking.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Event Queue and Batching</h3>
        <p>Events are placed in an in-memory queue immediately after validation and consent checking. The Delivery Manager drains the queue in batches: a batch is sent when either 20 events have accumulated or 5 seconds have elapsed since the last batch (whichever comes first). This batching strategy reduces network requests by up to 20× compared to per-event delivery while keeping event delivery latency under 5 seconds in normal conditions. The batch size (20 events) and flush interval (5 seconds) are configurable via the SDK options.</p>
        <p>The event queue is mirrored to localStorage as a persistence layer: every event pushed to the in-memory queue is also written to localStorage under a namespace key (e.g., analytics_queue_&#123;writeKey&#125;). When the SDK initializes (on the next page load), it reads any events from localStorage that were not delivered in the previous session and adds them to the head of the in-memory queue for immediate delivery. This persistence layer handles the case where the previous page was closed before a batch could be sent. The localStorage queue is bounded (max 500 events / 500KB) to prevent unbounded storage growth; when the bound is reached, the oldest events are evicted (they are less valuable than recent events).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Unload Resilience with sendBeacon</h3>
        <p>When the user navigates away from the page or closes the browser tab, the SDK has a very short window (approximately 100ms) to flush any queued events. A standard fetch request started during the unload event is often cancelled by the browser (the page context is being torn down). navigator.sendBeacon() is the correct solution: it is a fire-and-forget API that queues the data for delivery even after the page is closed, using a background task that the browser guarantees will be attempted even if the page is gone.</p>
        <p>The SDK listens to the pagehide event (preferred over beforeunload, which prevents back-forward cache optimization) and visibilitychange (when visibilityState becomes hidden—this fires even on mobile when the user switches apps, before the browser kills the tab). On these events, the SDK flushes the current in-memory queue via sendBeacon, encoding the batch as a Blob with the application/json MIME type. sendBeacon has a payload limit (typically 64KB across browsers); if the queue exceeds this limit, the events are split into multiple sendBeacon calls (each under 64KB). Events already persisted to localStorage will be retried on the next page load if sendBeacon fails (which can happen when the user is offline).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Privacy and Consent Management</h3>
        <p>The Privacy Manager implements a consent state machine: unknown (no consent decision recorded), granted (user has opted in), denied (user has opted out). The initial state is determined by reading a consent cookie or localStorage entry set by the host's consent management platform (CMP). The SDK provides a hook (analytics.setConsent(granted: boolean)) for the CMP to call when the user makes a consent decision.</p>
        <p>When consent is denied or unknown, all analytics.track() and analytics.page() calls are silently dropped—no events are queued, no network requests are made, no data touches localStorage. When consent is granted, the SDK resumes normal operation. Consent state transitions mid-session: if consent transitions from granted to denied (user withdraws consent), the SDK immediately clears the in-memory queue and localStorage queue (all buffered events are discarded), and suppresses all future events for the remainder of the session. If consent transitions from denied/unknown to granted, the SDK initializes the session and begins collecting events from that point forward (it does not retroactively collect events from before consent was given).</p>
        <p>PII scrubbing: the SDK automatically scrubs known PII patterns from event properties before queuing them. The scrubbing rules: email addresses (matched by regex) are replaced with [email], credit card numbers (Luhn check) are replaced with [card], and any property key in a configurable denylist (e.g., password, ssn, creditCard) is replaced with [redacted]. The scrubbing runs synchronously in the Event Collector before the event is handed to the queue, ensuring PII never reaches localStorage or the network.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Delivery and Retry</h3>
        <p>Batch delivery uses the Fetch API with a 10-second timeout. The ingestion endpoint returns 200 OK with a body containing the count of accepted events, or a 4xx error for validation failures (malformed events), or a 5xx for server errors. On a 5xx or network timeout, the batch is retried with exponential backoff: 1s, 2s, 4s, 8s, up to a maximum of 5 retries (total retry window: approximately 30 seconds). After 5 failed retries, the batch is discarded (to avoid storing stale data indefinitely) and a warning is logged to the console in development mode.</p>
        <p>The ingestion backend deduplicates events by eventId to handle the at-least-once delivery guarantee: if a batch is retried after a partial failure (the server received and persisted the batch but the 200 OK response was lost), the retry produces duplicate eventIds. The deduplication store (a Redis set with a 24-hour TTL per eventId) ensures duplicates are dropped before the events reach the Kafka topic. This gives exactly-once semantics at the analysis layer while allowing the SDK to retry freely.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Bundle Size and Loading Strategy</h3>
        <p>The 15KB gzipped budget requires careful feature selection. The SDK core (event collection, batching, delivery, session management) is approximately 8KB gzipped. Privacy management adds 2KB. The remaining 5KB is available for optional features (session recording, A/B test integration, feature flags). Optional features are loaded as separate chunks on demand (dynamic import()) rather than bundled in the core, keeping the initial load lean.</p>
        <p>The recommended loading pattern uses the async pattern with a minimal stub: a short inline script (approximately 200 bytes) defines the analytics object with a stub queue (so calls before the SDK loads are queued), then loads the full SDK bundle asynchronously. This pattern (identical to how Segment and Amplitude load their SDKs) ensures that the full SDK bundle load does not block page rendering, and no analytics calls are lost during the async load window because they are queued by the stub.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/embeddable-analytics-sdk-delivery-flow.svg"
          alt="Analytics SDK delivery flow showing event lifecycle: track() call → consent check (drop if denied) → PII scrub → sessionId assignment → eventId (UUID) → in-memory queue → localStorage mirror → batch flush (20 events or 5s) → fetch POST to ingestion endpoint → 200 OK (clear from localStorage) → 5xx (exponential backoff retry up to 5×) → pagehide/visibilitychange → sendBeacon flush. Server-side deduplication by eventId (Redis TTL 24h)."
          caption="Event delivery lifecycle: consent gate → PII scrub → queue → batch flush via fetch → sendBeacon on unload → server deduplication"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>localStorage versus IndexedDB for event persistence: localStorage is synchronous, which means writing to it on every event adds a small synchronous cost to each track() call. IndexedDB is asynchronous (no blocking) but significantly more complex to implement correctly. For a 15KB budget SDK, the complexity of IndexedDB is not justified by the marginal performance benefit of async writes—localStorage writes for individual events are typically under 0.1ms and are not user-visible. IndexedDB is the right choice for session recording (which generates megabytes of data) but overkill for an event queue that rarely exceeds a few dozen entries.</p>
        <p>First-party versus third-party context: browsers increasingly restrict third-party cookies and storage access (Safari ITP, Firefox ETP, Chrome's Privacy Sandbox). If the SDK is loaded from a third-party domain (the analytics platform's CDN), it may not have access to the host page's cookies, and its localStorage is partitioned (separate from the host page's localStorage, limited to the CDN origin). The recommended mitigation: provide a first-party proxy option, where customers serve the SDK from their own domain (via a CNAME or edge function reverse proxy). This ensures the SDK operates in a first-party context with full cookie and storage access. The SDK should be designed to work without cookies as a fallback (using only in-memory session IDs), for environments where cookies are blocked.</p>
        <p>Ad blocker impact: many ad blockers (uBlock Origin, Brave Shields) block analytics scripts by matching known analytics SDK URLs and network request destinations. The first-party proxy approach also mitigates ad blocking, since the script is served from and sends data to the customer's own domain rather than a known analytics endpoint. Customers who care about data completeness (e-commerce conversion tracking, A/B test measurement) should deploy the first-party proxy; customers who only need approximate traffic metrics can use the CDN-hosted version and accept 20–30% event loss from ad blockers.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>An embeddable analytics SDK is a lightweight JavaScript library (under 15KB gzipped) that collects structured events via a minimal public API (track, identify, page), enforces consent before queuing any data, scrubs PII synchronously before events reach storage, and delivers events in batches via fetch with sendBeacon fallback on page unload. Event persistence in localStorage provides at-least-once delivery across page loads; server-side deduplication by UUID eventId provides exactly-once semantics at the analysis layer. Session management uses a 30-minute inactivity timeout with sessionStorage persistence. SPA navigation is tracked by intercepting history.pushState and listening to visibilitychange. Consent state changes clear the queue immediately (withdrawal) or initialize the session (grant). The loading pattern uses an async stub to prevent SDK load time from affecting page rendering. First-party proxy deployment mitigates ad-blocker and browser privacy restrictions. The defining constraints are the 15KB bundle budget (which drives every feature scoping decision) and the unload resilience requirement (which drives the sendBeacon + localStorage persistence design).</p>
      </section>
    </ArticleLayout>
  );
}
