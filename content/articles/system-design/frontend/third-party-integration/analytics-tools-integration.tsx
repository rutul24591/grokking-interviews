"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-third-party-integration-analytics-tools-integration",
  title: "Analytics Tools Integration",
  description: "Staff-level analytics integration: event taxonomy, consent gating, batching and sampling, identity stitching, data quality, and operational guardrails for third-party analytics SDKs.",
  category: "frontend",
  subcategory: "third-party-integration",
  slug: "analytics-tools-integration",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "analytics", "third-party", "privacy", "observability", "performance", "governance", "consent"],
  relatedTopics: ["script-loading-strategies", "widget-embedding", "social-media-integration", "performance-budgets"],
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
          <strong>Analytics tools integration</strong> is the system design work required to capture user behavior, product events, and performance signals in a way that is accurate, privacy-compliant, and operationally safe. In practice, many teams integrate third-party analytics SDKs, tag managers, and experimentation tools that run in the browser.
        </p>
        <p>
          Analytics is deceptively risky: it is easy to ship a tracking SDK, but difficult to maintain data quality and performance over time. Analytics integrations often become ungoverned: dozens of event names, inconsistent properties, duplicate beacons, and privacy regressions. At scale, analytics must be treated like an API: versioned, reviewed, and budgeted.
        </p>
        <p>
          For staff/principal engineers, analytics integration requires balancing four competing concerns:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Data Quality:</strong> Events must be accurate and consistent. Poor data quality leads to wrong decisions.
          </li>
          <li>
            <strong>Performance:</strong> Analytics scripts compete for main-thread time. Heavy analytics slow page load.
          </li>
          <li>
            <strong>Privacy:</strong> Analytics track users. GDPR/CCPA require consent before tracking. Non-compliance risks fines.
          </li>
          <li>
            <strong>Operational Safety:</strong> Analytics failures shouldn't break core functionality. Implement error boundaries and fallbacks.
          </li>
        </ul>
        <p>
          The business impact of analytics integration decisions is significant:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Decision Quality:</strong> Poor analytics data leads to wrong product decisions. Bad data is worse than no data.
          </li>
          <li>
            <strong>Performance:</strong> Heavy analytics scripts can add 1-3 seconds to page load. Each second costs 7% conversion.
          </li>
          <li>
            <strong>Compliance:</strong> Tracking without consent violates GDPR/CCPA. Fines can reach 4% of global revenue.
          </li>
          <li>
            <strong>Trust:</strong> Users are increasingly aware of tracking. Transparent tracking builds trust; hidden tracking destroys it.
          </li>
        </ul>
        <p>
          In system design interviews, analytics integration demonstrates understanding of event-driven architecture, privacy compliance, performance optimization, and data governance. It shows you think about production realities, not just feature implementation.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/analytics-tracking-flow.svg"
          alt="Analytics event tracking flow showing user action, event queue with batching, consent gate, analytics backend, and dashboards"
          caption="Analytics flow — events are queued, batched, consent-gated, then sent to backend for processing and dashboard display"
        />

        <h3>Event Taxonomy</h3>
        <p>
          A well-designed event taxonomy is critical for data quality. Without taxonomy, you get inconsistent event names, missing properties, and unqueryable data:
        </p>

        <h4>Event Naming Convention</h4>
        <ul className="space-y-2">
          <li>
            <strong>Format:</strong> Use consistent format (e.g., `[object]_[action]` like `button_clicked`, `page_viewed`).
          </li>
          <li>
            <strong>Namespace:</strong> Group events by domain (e.g., `checkout_`, `search_`, `user_`).
          </li>
          <li>
            <strong>Versioning:</strong> Include version in event schema for backward compatibility.
          </li>
        </ul>

        <h4>Event Properties</h4>
        <ul className="space-y-2">
          <li>
            <strong>Common Properties:</strong> Include common properties on all events (user_id, session_id, timestamp, page_url).
          </li>
          <li>
            <strong>Event-Specific Properties:</strong> Include properties specific to event (e.g., `product_id` for `product_viewed`).
          </li>
          <li>
            <strong>Data Types:</strong> Enforce data types (string, number, boolean). Don't mix types for same property.
          </li>
        </ul>

        <h4>Event Documentation</h4>
        <ul className="space-y-2">
          <li>
            <strong>Event Registry:</strong> Maintain registry of all events with descriptions and properties.
          </li>
          <li>
            <strong>Ownership:</strong> Assign owner for each event (team or individual).
          </li>
          <li>
            <strong>Review Process:</strong> Require review before adding new events. Prevent event sprawl.
          </li>
        </ul>
        <p>
          <strong>Key principle:</strong> Treat events like API contracts. Changes require review and versioning.
        </p>

        <h3>Consent Gating</h3>
        <p>
          GDPR and CCPA require consent before tracking users. Implement consent gating:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Check Consent:</strong> Before sending any event, check if user has consented to analytics tracking.
          </li>
          <li>
            <strong>Queue Events:</strong> If consent not yet given, queue events. Send when consent is given.
          </li>
          <li>
            <strong>Respect Withdrawal:</strong> If user withdraws consent, stop tracking immediately. Delete stored data.
          </li>
          <li>
            <strong>Granular Consent:</strong> Allow users to consent to different categories (analytics, advertising, functional) separately.
          </li>
        </ul>
        <p>
          <strong>Implementation:</strong> Use Consent Management Platform (CMP) or build your own consent banner. Store consent in localStorage. Check before initializing analytics.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/consent-gating.svg"
          alt="Consent gating flow showing page load, consent check, consent banner if no consent, tracking blocked until consent given"
          caption="Consent gating — no tracking until user consents; queue events during consent decision; respect withdrawal immediately"
        />

        <h3>Batching and Sampling</h3>
        <p>
          Sending every event immediately is inefficient. Use batching and sampling:
        </p>

        <h4>Batching</h4>
        <ul className="space-y-2">
          <li>
            <strong>Queue Events:</strong> Collect events in memory queue.
          </li>
          <li>
            <strong>Flush Triggers:</strong> Send batch when queue reaches N events (e.g., 10) or T seconds (e.g., 30s) pass.
          </li>
          <li>
            <strong>Page Unload:</strong> Flush queue on page unload using `navigator.sendBeacon()`.
          </li>
          <li>
            <strong>Retry:</strong> Retry failed batches with exponential backoff.
          </li>
        </ul>

        <h4>Sampling</h4>
        <ul className="space-y-2">
          <li>
            <strong>High-Volume Events:</strong> For high-volume events (e.g., `scroll`, `mousemove`), sample to reduce volume.
          </li>
          <li>
            <strong>Sample Rate:</strong> Send only X% of events (e.g., 10% for scroll events).
          </li>
          <li>
            <strong>Consistent Sampling:</strong> Use consistent hashing (e.g., hash user_id) to ensure same user always sampled same way.
          </li>
          <li>
            <strong>Weighting:</strong> Adjust analysis for sample rate (multiply by 10 for 10% sample).
          </li>
        </ul>
        <p>
          <strong>Benefit:</strong> Batching reduces requests (better performance). Sampling reduces volume (lower cost).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/batching-architecture.svg"
          alt="Event batching architecture showing event sources, client-side queue with batch triggers, send mechanism (beacon/fetch), and analytics backend"
          caption="Batching architecture — events queued client-side, sent in batches on timer/threshold/unload; reduces requests and improves reliability"
        />

        <h3>Identity Stitching</h3>
        <p>
          Users interact across devices and sessions. Identity stitching connects these interactions:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Anonymous ID:</strong> Generate anonymous ID on first visit. Store in cookie/localStorage.
          </li>
          <li>
            <strong>User ID:</strong> When user logs in, associate anonymous ID with user ID.
          </li>
          <li>
            <strong>Session ID:</strong> Generate session ID on each visit. Group events by session.
          </li>
          <li>
            <strong>Cross-Device:</strong> Use email hash or other PII-safe identifier to connect devices.
          </li>
        </ul>
        <p>
          <strong>Privacy:</strong> Never send raw PII (email, name) to analytics. Use hashed/encrypted identifiers.
        </p>

        <h3>Data Quality</h3>
        <p>
          Poor data quality leads to wrong decisions. Implement data quality checks:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Validation:</strong> Validate event schema before sending. Reject invalid events.
          </li>
          <li>
            <strong>Monitoring:</strong> Monitor event volume. Alert on sudden drops/spikes.
          </li>
          <li>
            <strong>Testing:</strong> Test events in staging before deploying. Verify events appear correctly in analytics.
          </li>
          <li>
            <strong>Documentation:</strong> Document all events with descriptions and expected properties.
          </li>
        </ul>
        <p>
          <strong>Key metric:</strong> Track event delivery rate (events sent / events expected). Alert if rate drops below threshold.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A robust analytics architecture treats analytics as a <strong>first-class system</strong> with proper governance, monitoring, and error handling.
        </p>

        <h3>Analytics Layer Architecture</h3>
        <p>
          Implement an analytics abstraction layer between your app and analytics SDKs:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Abstraction:</strong> Your app calls `analytics.track()`, not `gtag()` or `mixpanel.track()`.
          </li>
          <li>
            <strong>Multiple Providers:</strong> Abstraction allows multiple providers (Google Analytics, Mixpanel, Amplitude) without code changes.
          </li>
          <li>
            <strong>Testing:</strong> Mock analytics layer in tests. Don't send real events in test environments.
          </li>
          <li>
            <strong>Vendor Switching:</strong> Easy to switch providers if needed.
          </li>
        </ul>

        <h3>Event Flow</h3>
        <p>
          The complete event flow:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Event Triggered:</strong> User action triggers event (click, page view, purchase).
          </li>
          <li>
            <strong>Validation:</strong> Validate event schema. Reject invalid events.
          </li>
          <li>
            <strong>Consent Check:</strong> Check if user consented to analytics. If no, queue event.
          </li>
          <li>
            <strong>Enrichment:</strong> Add common properties (user_id, session_id, timestamp, page_url).
          </li>
          <li>
            <strong>Queue:</strong> Add event to queue for batching.
          </li>
          <li>
            <strong>Flush:</strong> Send batch when threshold reached or timer expires.
          </li>
          <li>
            <strong>Retry:</strong> Retry failed batches with backoff.
          </li>
        </ul>

        <h3>Error Handling</h3>
        <p>
          Analytics should never break core functionality:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Try-Catch:</strong> Wrap all analytics calls in try-catch. Log errors, don't throw.
          </li>
          <li>
            <strong>Timeout:</strong> Set timeout for analytics requests. Don't let analytics block page load.
          </li>
          <li>
            <strong>Fallback:</strong> If analytics fails, continue without tracking. Core functionality must work.
          </li>
          <li>
            <strong>Monitoring:</strong> Track analytics errors separately. Alert on elevated error rates.
          </li>
        </ul>

        <h3>Performance Isolation</h3>
        <p>
          Analytics should not impact core performance:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Async Loading:</strong> Load analytics scripts asynchronously. Don't block page load.
          </li>
          <li>
            <strong>Lazy Loading:</strong> Load analytics only after core functionality is ready.
          </li>
          <li>
            <strong>Web Worker:</strong> For heavy analytics processing, use web worker to avoid blocking main thread.
          </li>
          <li>
            <strong>Request Priority:</strong> Use `fetchPriority: 'low'` for analytics requests.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Analytics integration involves trade-offs between data completeness, performance, and privacy.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Approach</th>
              <th className="p-3 text-left">Data Completeness</th>
              <th className="p-3 text-left">Performance</th>
              <th className="p-3 text-left">Privacy</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Track Everything</td>
              <td className="p-3">Best</td>
              <td className="p-3">Poor</td>
              <td className="p-3">Poor</td>
              <td className="p-3">Avoid</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Track Key Events</td>
              <td className="p-3">Good</td>
              <td className="p-3">Good</td>
              <td className="p-3">Fair</td>
              <td className="p-3">Most sites</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Sampled Tracking</td>
              <td className="p-3">Fair (statistical)</td>
              <td className="p-3">Best</td>
              <td className="p-3">Good</td>
              <td className="p-3">High-traffic sites</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Privacy-First</td>
              <td className="p-3">Fair (consent-gated)</td>
              <td className="p-3">Good</td>
              <td className="p-3">Best</td>
              <td className="p-3">Privacy-focused sites</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that <strong>tracking key events with consent gating</strong> is the default choice. Track everything is rarely justified given performance and privacy costs.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Define Event Taxonomy:</strong> Establish naming conventions and property standards. Document all events.
          </li>
          <li>
            <strong>Implement Consent Gating:</strong> Don't track until user consents. Queue events during consent decision.
          </li>
          <li>
            <strong>Use Batching:</strong> Batch events to reduce requests. Flush on timer, threshold, or page unload.
          </li>
          <li>
            <strong>Sample High-Volume Events:</strong> For scroll, mousemove, etc., sample to reduce volume.
          </li>
          <li>
            <strong>Abstract Analytics Layer:</strong> Don't call SDK directly. Use abstraction for flexibility.
          </li>
          <li>
            <strong>Validate Events:</strong> Validate event schema before sending. Reject invalid events.
          </li>
          <li>
            <strong>Monitor Data Quality:</strong> Track event delivery rate. Alert on drops/spikes.
          </li>
          <li>
            <strong>Error Handling:</strong> Wrap analytics in try-catch. Never let analytics break core functionality.
          </li>
          <li>
            <strong>Async Loading:</strong> Load analytics scripts asynchronously. Don't block page load.
          </li>
          <li>
            <strong>Test in Staging:</strong> Test events in staging before deploying. Verify events appear correctly.
          </li>
          <li>
            <strong>Regular Audits:</strong> Quarterly audit of all events. Remove unused events. Update documentation.
          </li>
          <li>
            <strong>Respect Do Not Track:</strong> Honor browser DNT settings. Don't track users who opt out.
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
            <strong>No Event Taxonomy:</strong> Inconsistent event names and properties lead to unqueryable data.
          </li>
          <li>
            <strong>Tracking Without Consent:</strong> Violates GDPR/CCPA. Risk of fines.
          </li>
          <li>
            <strong>Sending PII:</strong> Never send raw email, name, or other PII to analytics.
          </li>
          <li>
            <strong>No Batching:</strong> Sending every event immediately wastes bandwidth and increases failure rate.
          </li>
          <li>
            <strong>Blocking Page Load:</strong> Loading analytics synchronously blocks page load.
          </li>
          <li>
            <strong>No Error Handling:</strong> Analytics errors can break core functionality.
          </li>
          <li>
            <strong>No Monitoring:</strong> Without monitoring, you won't know when tracking breaks.
          </li>
          <li>
            <strong>Event Sprawl:</strong> Without governance, event count grows unmanageable.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce: Conversion Funnel Tracking</h3>
        <p>
          <strong>Problem:</strong> E-commerce site needed to track conversion funnel but had inconsistent event tracking.
        </p>
        <p>
          <strong>Solution:</strong> Defined event taxonomy for funnel events (`product_viewed`, `cart_added`, `checkout_started`, `purchase_completed`). Implemented analytics abstraction layer. Added validation and monitoring.
        </p>
        <p>
          <strong>Results:</strong> Data quality improved. Funnel analysis became reliable. Identified 15% drop-off at checkout, fixed, increased conversion 12%.
        </p>

        <h3>SaaS: Privacy-Compliant Analytics</h3>
        <p>
          <strong>Problem:</strong> SaaS company needed analytics but had GDPR/CCPA compliance requirements.
        </p>
        <p>
          <strong>Solution:</strong> Implemented consent gating. Queue events until consent given. Use privacy-friendly analytics (Plausible/Fathom) instead of Google Analytics. Hash user identifiers.
        </p>
        <p>
          <strong>Results:</strong> Achieved GDPR/CCPA compliance. 65% of users consented to analytics. Zero compliance incidents.
        </p>

        <h3>Media Site: High-Volume Event Sampling</h3>
        <p>
          <strong>Problem:</strong> Media site had millions of page views daily. Analytics costs were prohibitive.
        </p>
        <p>
          <strong>Solution:</strong> Implemented sampling for high-volume events. Track 10% of page views, 100% of conversion events. Adjust analysis for sample rate.
        </p>
        <p>
          <strong>Results:</strong> Analytics costs reduced 80%. Statistical accuracy maintained for high-volume events. Conversion events still tracked at 100%.
        </p>

        <h3>Mobile App: Offline Event Queue</h3>
        <p>
          <strong>Problem:</strong> Mobile app users often offline. Events were lost when offline.
        </p>
        <p>
          <strong>Solution:</strong> Implemented persistent event queue (localStorage/IndexedDB). Queue events when offline. Send when online. Deduplicate on server.
        </p>
        <p>
          <strong>Results:</strong> Event delivery rate increased from 70% to 95%. Offline user behavior now visible.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is an event taxonomy and why is it important?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Event taxonomy is a standardized system for naming and structuring analytics events:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Naming Convention:</strong> Consistent format (e.g., `[object]_[action]` like `button_clicked`).
              </li>
              <li>
                <strong>Property Standards:</strong> Consistent property names and types across events.
              </li>
              <li>
                <strong>Documentation:</strong> Registry of all events with descriptions and expected properties.
              </li>
            </ul>
            <p>
              Importance:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Data Quality:</strong> Consistent events are queryable and analyzable.
              </li>
              <li>
                <strong>Maintainability:</strong> New team members can understand existing events.
              </li>
              <li>
                <strong>Governance:</strong> Prevents event sprawl and duplication.
              </li>
            </ul>
            <p>
              Without taxonomy, you get inconsistent data that's impossible to analyze reliably.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you implement GDPR/CCPA-compliant analytics?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Consent Before Tracking:</strong> Don't initialize analytics until user consents. Show consent banner first.
              </li>
              <li>
                <strong>Queue Events:</strong> If user hasn't consented yet, queue events. Send when consent is given.
              </li>
              <li>
                <strong>Respect Withdrawal:</strong> If user withdraws consent, stop tracking immediately. Delete stored data.
              </li>
              <li>
                <strong>No PII:</strong> Never send raw PII (email, name) to analytics. Use hashed identifiers.
              </li>
              <li>
                <strong>Granular Consent:</strong> Allow users to consent to different categories separately.
              </li>
              <li>
                <strong>Do Not Track:</strong> Honor browser DNT settings.
              </li>
            </ul>
            <p>
              Non-compliance can result in fines up to 4% of global revenue under GDPR. Consent gating is critical.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is event batching and why is it important?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Event batching is collecting multiple events and sending them together instead of sending each event immediately:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Queue:</strong> Collect events in memory queue.
              </li>
              <li>
                <strong>Flush Triggers:</strong> Send when queue reaches N events (e.g., 10) or T seconds (e.g., 30s) pass.
              </li>
              <li>
                <strong>Page Unload:</strong> Flush on page unload using `navigator.sendBeacon()`.
              </li>
              <li>
                <strong>Retry:</strong> Retry failed batches with backoff.
              </li>
            </ul>
            <p className="mb-3">
              Benefits:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Fewer Requests:</strong> 10 events in 1 request instead of 10 requests.
              </li>
              <li>
                <strong>Better Reliability:</strong> `sendBeacon()` ensures delivery on page unload.
              </li>
              <li>
                <strong>Lower Cost:</strong> Fewer API calls to analytics provider.
              </li>
            </ul>
            <p>
              Batching is industry standard for analytics implementation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you ensure analytics doesn't impact page performance?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Async Loading:</strong> Load analytics scripts asynchronously. Don't block page load.
              </li>
              <li>
                <strong>Lazy Loading:</strong> Load analytics after core functionality is ready.
              </li>
              <li>
                <strong>Batching:</strong> Batch events to reduce number of requests.
              </li>
              <li>
                <strong>Low Priority:</strong> Use `fetchPriority: 'low'` for analytics requests.
              </li>
              <li>
                <strong>Web Worker:</strong> For heavy processing, use web worker to avoid blocking main thread.
              </li>
              <li>
                <strong>Timeout:</strong> Set timeout for analytics requests. Don't let analytics hang.
              </li>
              <li>
                <strong>Error Handling:</strong> Wrap analytics in try-catch. Never let analytics break core functionality.
              </li>
            </ul>
            <p>
              Analytics should be invisible to users. If analytics slows page load, you're doing it wrong.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you monitor analytics data quality?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Event Volume:</strong> Monitor event volume over time. Alert on sudden drops/spikes.
              </li>
              <li>
                <strong>Delivery Rate:</strong> Track events sent / events expected. Alert if rate drops below threshold.
              </li>
              <li>
                <strong>Error Rate:</strong> Track analytics errors. Alert on elevated error rates.
              </li>
              <li>
                <strong>Schema Validation:</strong> Validate event schema. Reject invalid events. Track rejection rate.
              </li>
              <li>
                <strong>Staging Tests:</strong> Test events in staging before deploying. Verify events appear correctly.
              </li>
              <li>
                <strong>Regular Audits:</strong> Quarterly audit of all events. Remove unused events. Update documentation.
              </li>
            </ul>
            <p>
              Poor data quality leads to wrong decisions. Monitoring ensures data remains reliable over time.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What is identity stitching and how do you implement it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Anonymous ID:</strong> Generate anonymous ID on first visit. Store in cookie/localStorage.
              </li>
              <li>
                <strong>User ID:</strong> When user logs in, associate anonymous ID with user ID.
              </li>
              <li>
                <strong>Session ID:</strong> Generate session ID on each visit. Group events by session.
              </li>
              <li>
                <strong>Cross-Device:</strong> Use email hash or other PII-safe identifier to connect devices.
              </li>
            </ul>
            <p className="mb-3">
              Privacy considerations:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                Never send raw PII (email, name) to analytics.
              </li>
              <li>
                Use hashed/encrypted identifiers.
              </li>
              <li>
                Respect consent and deletion requests.
              </li>
            </ul>
            <p>
              Identity stitching enables cross-session and cross-device analysis while respecting privacy.
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
            <a href="https://segment.com/academy/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Segment: Analytics Academy
            </a> — Comprehensive guide to analytics implementation.
          </li>
          <li>
            <a href="https://developers.google.com/analytics/devguides/collection/ga4" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google Analytics 4 Documentation
            </a> — GA4 implementation guide.
          </li>
          <li>
            <a href="https://mixpanel.com/docs/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Mixpanel Documentation
            </a> — Event tracking and user analytics.
          </li>
          <li>
            <a href="https://plausible.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Plausible Analytics
            </a> — Privacy-friendly, lightweight analytics alternative.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: sendBeacon()
            </a> — Reliable event sending on page unload.
          </li>
          <li>
            <a href="https://gdpr.eu/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GDPR.eu
            </a> — GDPR compliance guide for businesses.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
