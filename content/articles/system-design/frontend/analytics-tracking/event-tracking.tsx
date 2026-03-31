"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-analytics-tracking-event-tracking",
  title: "Event Tracking",
  description: "Staff-level event tracking: event taxonomy design, batching strategies, data quality, real-time vs batch processing, and operational monitoring for analytics at scale.",
  category: "frontend",
  subcategory: "analytics-tracking",
  slug: "event-tracking",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "analytics", "event-tracking", "taxonomy", "batching", "data-quality", "real-time"],
  relatedTopics: ["page-view-tracking", "user-journey-tracking", "analytics-tools-integration", "conversion-funnels"],
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
          <strong>Event tracking</strong> is the systematic capture of user interactions beyond page views: button clicks, form submissions, video plays, file downloads, search queries, scroll depth, and custom actions. While page views answer "where did users go?", event tracking answers "what did users do?"—enabling deeper analysis of engagement, conversion, and user behavior.
        </p>
        <p>
          Event tracking is deceptively simple to start ("track a click") but complex to scale. Without governance, teams accumulate hundreds of inconsistently-named events, missing properties, duplicate events, and unqueryable data. At scale, event tracking requires standardized taxonomy, batching for performance, data quality monitoring, and privacy compliance.
        </p>
        <p>
          For staff/principal engineers, event tracking requires balancing four competing concerns. <strong>Data Quality</strong> means events must be accurate, consistent, and complete—poor data quality leads to wrong decisions. <strong>Performance</strong> means event tracking must not impact user experience—batching and async sending are critical. <strong>Flexibility</strong> means the schema must accommodate new events without breaking existing analysis. <strong>Privacy</strong> means events must not capture PII without consent—GDPR/CCPA compliance is mandatory.
        </p>
        <p>
          The business impact of event tracking decisions is significant and multifaceted. Event data identifies friction points in funnels, and fixing friction increases conversion 10-30%. Tracking which features users engage with informs product roadmap decisions. Event patterns predict churn, and early intervention reduces churn 15-25%. Events are the basis for A/B test analysis, and poor event data leads to wrong conclusions.
        </p>
        <p>
          In system design interviews, event tracking demonstrates understanding of event-driven architecture, data modeling, distributed systems, and the trade-offs between flexibility and governance. It shows you think about production realities, not just feature implementation.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/event-taxonomy.svg"
          alt="Event taxonomy hierarchy showing three categories (User Events, Content Events, Commerce Events) with specific events under each category"
          caption="Event taxonomy hierarchy — organize events by domain (user, content, commerce) with consistent naming convention [object]_[action] in snake_case"
        />

        <h3>Event Taxonomy</h3>
        <p>
          Event taxonomy is the standardized system for naming and structuring events. Without taxonomy, you get inconsistent event names, missing properties, and unqueryable data. A well-designed taxonomy makes events queryable, analyzable, and maintainable.
        </p>
        <p>
          For naming conventions, use a consistent format like <code>[object]_[action]</code>—for example, <code>button_clicked</code>, <code>form_submitted</code>, <code>video_played</code>. Group events by domain namespace like <code>checkout_</code>, <code>search_</code>, <code>user_</code>. Use consistent verbs like clicked, viewed, submitted, started, completed, failed. Use snake_case for event names, which is the industry standard.
        </p>
        <p>
          Event properties fall into two categories. <strong>Common properties</strong> are included on all events: user_id, session_id, timestamp, page_url, and device_type. <strong>Event-specific properties</strong> are properties specific to event type, like product_id for product_viewed or form_name for form_submitted. Enforce data types (string, number, boolean) and don't mix types for the same property.
        </p>
        <p>
          Event documentation is critical for maintainability. Maintain a registry of all events with descriptions, properties, and examples. Assign an owner (team or individual) for each event. Include version in event schema for backward compatibility. The key principle is to treat events like API contracts—changes require review and versioning.
        </p>

        <h3>Event Batching</h3>
        <p>
          Sending every event immediately is inefficient. Batching collects multiple events and sends them together. Collect events in a memory queue. Send the batch when the queue reaches N events (e.g., 10) or T seconds (e.g., 30s) pass. Flush the queue on page unload using <code>navigator.sendBeacon()</code>. Retry failed batches with exponential backoff.
        </p>
        <p>
          Batching provides multiple benefits. It reduces requests for better performance, improves reliability because sendBeacon ensures delivery, and lowers cost with fewer API calls.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/batching-architecture.svg"
          alt="Event batching architecture showing events flowing into client-side queue, flush triggers (count, timer, unload), send mechanism (sendBeacon/fetch), and analytics backend processing"
          caption="Event batching architecture — collect events in queue, flush on count threshold (10 events), timer (30s), or page unload (sendBeacon); reduces requests 10x"
        />

        <h3>Real-Time vs. Batch Processing</h3>
        <p>
          Events can be processed in real-time or batch, each with different use cases and trade-offs. Real-time processing handles events within seconds. It's used for personalization, real-time dashboards, fraud detection, and trigger-based notifications. Implementation uses stream processing like Kafka Streams, Flink, or Kinesis. The cost is higher infrastructure complexity.
        </p>
        <p>
          Batch processing handles events hourly or daily. It's used for historical analysis, reporting, and ML model training. Implementation uses data warehouse ETL like BigQuery, Snowflake, or Redshift. The cost is lower infrastructure complexity but higher latency.
        </p>
        <p>
          The hybrid approach processes critical events like conversion and errors in real-time, while processing engagement events like page views and clicks in batch. This balances the need for immediate action on critical events with the cost efficiency of batch processing for high-volume engagement data.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/realtime-vs-batch.svg"
          alt="Comparison of real-time processing (event → stream processor → real-time actions in <1 second) versus batch processing (events collected → hourly/daily batch job → aggregate & store)"
          caption="Real-time vs batch processing — use real-time for critical events (conversion, fraud) and batch for engagement events (page views, clicks)"
        />

        <h3>Data Quality</h3>
        <p>
          Event data quality depends on completeness, accuracy, consistency, and validity. <strong>Completeness</strong> asks whether all events are captured—script errors, network failures, and ad blockers cause gaps. <strong>Accuracy</strong> asks whether events are counted correctly—duplicates and bot traffic cause inflation. <strong>Consistency</strong> asks whether tracking is consistent across events and time—implementation changes cause breaks in trends. <strong>Validity</strong> asks whether events conform to schema—invalid events are unqueryable.
        </p>
        <p>
          Monitoring is essential for maintaining data quality. Track event volume over time and alert on sudden drops which indicate tracking failure or sudden spikes which indicate duplicates or bot traffic.
        </p>

        <h3>Sampling</h3>
        <p>
          For high-volume events, sampling reduces data volume. Scroll, mousemove, and impression events can generate millions per day. Send only a percentage of events like 10% or 1%. Use consistent hashing (hash user_id or session_id) to ensure the same user is always sampled the same way. Multiply sampled metrics by 1/sample_rate for accurate totals.
        </p>
        <p>
          For example, with 10% sample rate for scroll events, if you see 1,000 scroll events in the sample, actual volume is 10,000. Engagement metrics remain accurate. Sampling reduces cost while maintaining statistical accuracy for high-volume events where exact count isn't critical.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A robust event tracking architecture treats events as a first-class data pipeline with proper validation, batching, and monitoring.
        </p>

        <h3>Event Collection Architecture</h3>
        <p>
          Implement event collection by creating a tracking utility that abstracts the analytics provider. Call <code>track(eventName, properties)</code> instead of calling the analytics SDK directly. This abstraction makes it easy to switch providers later. Validate event schema before sending and reject invalid events. Add common properties (user_id, session_id, timestamp, page_url) automatically. Add validated events to a queue for batching. Send the batch when threshold is reached or timer expires. Retry failed batches with exponential backoff.
        </p>

        <h3>Event Batching Architecture</h3>
        <p>
          Implement batching with multiple flush triggers. Flush when queue reaches N events (e.g., 10). Flush every T seconds (e.g., 30s) regardless of queue size. Flush on page unload using <code>navigator.sendBeacon()</code>. Flush on visibility change like tab switch or minimize.
        </p>
        <p>
          Use <code>sendBeacon()</code> for unload because it's queued by browser and sent even after page closes. Use <code>fetch()</code> with <code>keepalive: true</code> as fallback when sendBeacon is unavailable.
        </p>

        <h3>Error Handling</h3>
        <p>
          Event tracking should never break the application. Wrap all tracking calls in try-catch blocks. Set a timeout for tracking requests (e.g., 2 seconds). If tracking fails, don't retry excessively. Log tracking errors separately for monitoring.
        </p>

        <h3>Monitoring Architecture</h3>
        <p>
          Monitor event tracking health by tracking event volume per event type over time and alerting on sudden drops or spikes. Track delivery rate as events sent divided by events triggered, and alert if rate drops below threshold like 95%. Track tracking errors and alert on elevated error rates. Track validation failures and alert on high rejection rate.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Event tracking involves trade-offs between data completeness, performance, and cost. Tracking everything provides the best data completeness but poor performance with many requests and the highest cost. This is only suitable for low-traffic sites. Batched tracking provides good data completeness with good performance from fewer requests and medium cost. This works for most sites. Sampled tracking provides fair statistical data completeness with best performance and low cost. This is best for high-traffic sites.
        </p>
        <p>
          The staff-level insight is that batched tracking with selective sampling is the default choice. Batch all events, and sample only high-volume events.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Define an event taxonomy with naming conventions and property standards. Document all events. Use batching to reduce requests—flush on timer, threshold, or page unload. Validate events before sending and reject invalid events. Abstract tracking by not calling the analytics SDK directly—use an abstraction for flexibility.
        </p>
        <p>
          Sample high-volume events like scroll, mousemove, and impressions to reduce volume. Monitor data quality by tracking event delivery rate and alerting on drops or spikes. Wrap tracking in try-catch—never let tracking break core functionality. Avoid PII by never sending raw email, name, or other PII without consent—use hashed identifiers. Test events in staging before deploying and verify events appear correctly. Conduct quarterly audits of all events, remove unused events, and update documentation.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is having no event taxonomy, which leads to inconsistent event names and properties that result in unqueryable data. Sending PII like raw email, name, or other personal data without consent violates GDPR/CCPA. Not batching events and sending every event immediately wastes bandwidth and increases failure rate.
        </p>
        <p>
          Not validating events allows invalid events to pollute the data warehouse, which is hard to clean up later. Not monitoring means you won't know when tracking breaks. Without governance, event count grows unmanageable—this is event sprawl. Tracking the same event multiple times inflates metrics—this is duplicate events.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce: Conversion Funnel Tracking</h3>
        <p>
          An e-commerce site needed to track conversion funnel but had inconsistent event tracking. The solution was defining event taxonomy for funnel events like product_viewed, cart_added, checkout_started, and purchase_completed. Batching was implemented, and validation and monitoring were added. Data quality improved, funnel analysis became reliable, and they identified a 15% drop-off at checkout. After fixing the friction, conversion increased 12%.
        </p>

        <h3>SaaS: Feature Adoption Tracking</h3>
        <p>
          A SaaS company didn't know which features users engaged with. The solution was implementing event tracking for all feature interactions with consistent taxonomy and batching events for performance. They identified underused features and focused product improvements on high-engagement features. User engagement increased 25%.
        </p>

        <h3>Media Site: High-Volume Event Sampling</h3>
        <p>
          A media site had millions of scroll and impression events daily, and analytics costs were prohibitive. The solution was implementing 10% sampling for high-volume events while tracking 100% of conversion events. Analysis was adjusted for sample rate. Analytics costs were reduced 80% while maintaining statistical accuracy for high-volume events.
        </p>

        <h3>Mobile App: Offline Event Queue</h3>
        <p>
          A mobile app's users were often offline, and events were lost when offline. The solution was implementing a persistent event queue using localStorage or IndexedDB. Events are queued when offline and sent when online, with deduplication on the server. Event delivery rate increased from 70% to 95%, and offline user behavior became visible.
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
              Event taxonomy is a standardized system for naming and structuring analytics events. It includes a naming convention with consistent format like [object]_[action] such as button_clicked, property standards with consistent property names and types across events, and documentation with a registry of all events with descriptions and expected properties.
            </p>
            <p>
              Importance: Consistent events are queryable and analyzable. Without taxonomy, you get inconsistent data that's impossible to analyze reliably. Maintainability improves because new team members can understand existing events. Governance prevents event sprawl and duplication.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is event batching and why is it important?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Event batching is collecting multiple events and sending them together instead of sending each event immediately. Collect events in a memory queue. Send when queue reaches N events or T seconds pass. Flush on page unload using navigator.sendBeacon(). Retry failed batches with backoff.
            </p>
            <p>
              Benefits include fewer requests for better performance, better reliability because sendBeacon ensures delivery, and lower cost from fewer API calls. Batching is industry standard for analytics implementation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you ensure event data quality?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Validate event schema before sending and reject invalid events. Monitor event volume over time and alert on sudden drops or spikes. Test events in staging before deploying. Document all events with descriptions and expected properties.
            </p>
            <p>
              Poor data quality leads to wrong decisions. Monitoring ensures data remains reliable over time.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What is the difference between real-time and batch event processing?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Real-time processing handles events within seconds. It's used for personalization, fraud detection, real-time dashboards, and trigger notifications. Cost is higher infrastructure complexity. Batch processing handles events hourly or daily. It's used for historical analysis, reporting, and ML training. Cost is lower infrastructure complexity.
            </p>
            <p>
              Hybrid approach: Process critical events (conversion, errors) in real-time. Process engagement events (page views, clicks) in batch.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: When should you sample events?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Sample high-volume events like scroll, mousemove, and impression events that can generate millions per day. Send only a percentage of events like 10% or 1%. Use consistent hashing to ensure same user always sampled same way. Multiply sampled metrics by 1/sample_rate for accurate totals.
            </p>
            <p>
              Sampling reduces cost while maintaining statistical accuracy. Use for high-volume events where exact count isn't critical.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do you handle PII in event tracking?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Avoid raw PII by never sending raw email, name, or other PII without consent. Use hashed identifiers like hashed user_id instead of raw identifiers. Only send PII if user has explicitly consented. Practice data minimization by only sending data necessary for analysis.
            </p>
            <p>
              GDPR/CCPA violations can result in fines up to 4% of global revenue. PII handling is critical.
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
            </a> — Comprehensive guide to event tracking implementation.
          </li>
          <li>
            <a href="https://developers.google.com/analytics/devguides/collection/ga4/events" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google Analytics 4: Events
            </a> — GA4 event tracking documentation.
          </li>
          <li>
            <a href="https://mixpanel.com/docs/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Mixpanel Documentation
            </a> — Event tracking and user analytics.
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
          <li>
            <a href="https://www.measurementprotocol.google.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google Analytics Measurement Protocol
            </a> — Server-side event tracking specification.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
