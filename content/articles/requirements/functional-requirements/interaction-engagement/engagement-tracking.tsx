"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-backend-engagement-tracking",
  title: "Engagement Tracking",
  description:
    "Comprehensive guide to implementing engagement tracking covering event collection pipelines, metrics computation, engagement scoring algorithms, fraud detection, and real-time analytics for content performance measurement.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "engagement-tracking",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "interaction",
    "tracking",
    "analytics",
    "backend",
    "fraud-detection",
    "real-time",
  ],
  relatedTopics: ["engagement-storage", "analytics", "fraud-detection", "event-processing"],
};

export default function EngagementTrackingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Engagement Tracking</strong> collects and analyzes user interaction data to measure content performance, detect fraud, optimize recommendations, and inform creator strategy. It is the foundation for understanding how users interact with content—what they like, share, comment on, and save. This data drives critical business decisions: content ranking, creator monetization, ad targeting, and product development.
        </p>
        <p>
          Engagement tracking involves capturing events across the user journey: impressions (content displayed), clicks (content opened), interactions (likes, comments, shares), and conversions (sign-ups, purchases attributed to content). Each event provides a signal about user interest and content quality. Aggregated across millions of users, these signals form the basis for recommendation algorithms and content moderation systems.
        </p>
        <p>
          For staff and principal engineers, engagement tracking involves designing event collection pipelines that handle high velocity (millions of events per second), ensuring data accuracy (deduplication, validation), computing real-time metrics (trending content detection), and detecting fraud (bot activity, engagement manipulation). The architecture must balance completeness (capture all events) with performance (minimal latency impact on user experience).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Event Types</h3>
        <p>
          Engagement events fall into several categories:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Impression Events:</strong> Content displayed to user. Includes view duration, scroll depth, visibility percentage. Foundation for reach metrics. Fired when content enters viewport, tracked via Intersection Observer API.
          </li>
          <li>
            <strong>Interaction Events:</strong> Active user engagement—likes, comments, shares, saves, follows. High-intent signals indicating strong interest. Each interaction type has different weight in engagement scoring.
          </li>
          <li>
            <strong>Click Events:</strong> User clicked content to expand, visit link, or view details. Indicates interest beyond passive consumption. Tracked for CTR (click-through rate) calculations.
          </li>
          <li>
            <strong>Conversion Events:</strong> Desired actions attributed to content—sign-ups, purchases, subscriptions. Ultimate measure of content effectiveness for business goals. Requires attribution modeling.
          </li>
          <li>
            <strong>Negative Events:</strong> Hides, mutes, blocks, reports. Important for content quality assessment. High negative engagement indicates problematic content regardless of positive engagement.
          </li>
        </ul>

        <h3 className="mt-6">Event Schema</h3>
        <p>
          Standardized event structure for consistency:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Event ID:</strong> Unique identifier (UUID) for deduplication. Generated client-side before transmission.
          </li>
          <li>
            <strong>Event Type:</strong> Category of event (impression, like, comment, share). Determines processing pipeline.
          </li>
          <li>
            <strong>User ID:</strong> Authenticated user identifier or anonymous session ID. Enables user-level analytics.
          </li>
          <li>
            <strong>Content ID:</strong> Identifier for content being engaged with. Enables content-level analytics.
          </li>
          <li>
            <strong>Timestamp:</strong> When event occurred (client time and server time). Enables time-series analysis.
          </li>
          <li>
            <strong>Context Metadata:</strong> Device info, browser, OS, network type, location (country/region), referrer source. Enables segmentation.
          </li>
          <li>
            <strong>Session Data:</strong> Session ID, time in session, previous events. Enables session-level analysis.
          </li>
        </ul>

        <h3 className="mt-6">Engagement Scoring</h3>
        <p>
          Combining multiple signals into single score:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Weighted Sum:</strong> Each interaction type assigned weight (like=1, comment=3, share=5, save=2). Sum produces engagement score. Weights reflect interaction value.
          </li>
          <li>
            <strong>Time Decay:</strong> Recent interactions weighted more heavily than old ones. Enables trending detection. Decay factor typically exponential (half-life of 7 days).
          </li>
          <li>
            <strong>Normalization:</strong> Score normalized by reach (impressions) to produce engagement rate. Enables fair comparison between viral and niche content.
          </li>
          <li>
            <strong>Quality Adjustment:</strong> Downweight suspected fraudulent engagement. Upweight engagement from trusted users. Produces quality-adjusted score.
          </li>
        </ul>

        <h3 className="mt-6">Real-time vs Batch Processing</h3>
        <p>
          Two complementary processing modes:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Real-time Processing:</strong> Events processed within seconds. Enables trending detection, real-time analytics dashboards, immediate fraud detection. Higher infrastructure cost. Used for time-sensitive use cases.
          </li>
          <li>
            <strong>Batch Processing:</strong> Events aggregated hourly/daily. Enables comprehensive analytics, historical trends, ML model training. Lower cost. Used for non-time-sensitive use cases.
          </li>
          <li>
            <strong>Lambda Architecture:</strong> Combine both—real-time layer for immediate insights, batch layer for accuracy. Best of both worlds but higher complexity.
          </li>
        </ul>

        <h3 className="mt-6">Fraud Detection</h3>
        <p>
          Identifying fake engagement:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Velocity Checks:</strong> Unusual interaction rate (100 likes/minute from single user). Indicates bot activity. Threshold-based detection.
          </li>
          <li>
            <strong>Pattern Detection:</strong> Regular intervals (exactly every 5 seconds), identical sequences, copy-pasted comments. Indicates automation.
          </li>
          <li>
            <strong>Network Analysis:</strong> Clusters of accounts interacting only with each other. Indicates engagement pods or bot networks.
          </li>
          <li>
            <strong>ML Models:</strong> Trained on known fraud patterns. Features include timing, device fingerprints, IP addresses, historical behavior.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Engagement tracking architecture involves event collection, stream processing, and analytics storage.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/engagement-tracking/event-collection-pipeline.svg"
          alt="Event Collection Pipeline"
          caption="Figure 1: Event Collection Pipeline — Client SDK, ingestion API, message queue, and stream processing"
          width={1000}
          height={500}
        />

        <h3>Event Collection Pipeline</h3>
        <p>
          End-to-end event flow:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Client SDK:</strong> JavaScript/mobile SDK captures events. Batches events (up to 10 or 5 seconds) before transmission. Implements retry logic with exponential backoff. Handles offline queuing.
          </li>
          <li>
            <strong>Ingestion API:</strong> Receives event batches. Validates schema, authenticates source, rate limits clients. Returns 202 Accepted immediately (async processing).
          </li>
          <li>
            <strong>Message Queue:</strong> Kafka or Kinesis buffers events. Partitions by content_id or user_id for ordering. Retains events for replay (7 days typical).
          </li>
          <li>
            <strong>Stream Processor:</strong> Flink, Spark Streaming, or custom consumers. Processes events in real-time. Updates counters, detects trends, flags fraud.
          </li>
        </ul>

        <h3 className="mt-6">Metrics Computation</h3>
        <p>
          How engagement metrics are calculated:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Real-time Aggregation:</strong> Stream processor maintains running counts. Incremental updates on each event. Stored in Redis for fast access.
          </li>
          <li>
            <strong>Hourly Rollups:</strong> Aggregate events into hourly buckets. Compute sums, averages, percentiles. Stored in time-series database (ClickHouse, Druid).
          </li>
          <li>
            <strong>Daily Rollups:</strong> Aggregate hourly into daily. Long-term storage. Enables trend analysis over weeks/months.
          </li>
          <li>
            <strong>Engagement Rate:</strong> (Interactions / Impressions) × 100. Normalized metric for comparing content with different reach.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/engagement-tracking/engagement-scoring-algorithm.svg"
          alt="Engagement Scoring Algorithm"
          caption="Figure 2: Engagement Scoring Algorithm — Weighted interactions, time decay, normalization, and quality adjustment"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Trending Detection</h3>
        <p>
          Identifying viral content in real-time:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Velocity Threshold:</strong> Engagement rate exceeding threshold (1000 interactions/hour). Triggers trending flag.
          </li>
          <li>
            <strong>Acceleration Detection:</strong> Second derivative of engagement (rate of rate change). Rapid acceleration indicates viral potential.
          </li>
          <li>
            <strong>Geographic Spread:</strong> Engagement from multiple regions indicates organic virality. Single-region spike may indicate manipulation.
          </li>
          <li>
            <strong>Cool-down Period:</strong> Content can only trend once per time window (24 hours). Prevents repeated trending from same content.
          </li>
        </ul>

        <h3 className="mt-6">Fraud Detection Pipeline</h3>
        <p>
          Real-time fraud identification:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Rule-based Filters:</strong> First line of defense. Block obvious fraud (rate limits, known bad IPs, blacklisted devices).
          </li>
          <li>
            <strong>Anomaly Detection:</strong> Statistical outliers in engagement patterns. Z-score analysis, isolation forests.
          </li>
          <li>
            <strong>Graph Analysis:</strong> Detect engagement rings (groups of accounts that only interact with each other). Community detection algorithms.
          </li>
          <li>
            <strong>ML Scoring:</strong> Each engagement assigned fraud probability score. High-score engagements excluded from public counts.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Engagement tracking design involves balancing accuracy, latency, and cost.
        </p>

        <h3>Event Collection Strategies</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Strategy</th>
                <th className="text-left p-2 font-semibold">Accuracy</th>
                <th className="text-left p-2 font-semibold">Latency Impact</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Sync (beacon)</td>
                <td className="p-2">Highest</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Critical events (purchases)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Async (batched)</td>
                <td className="p-2">High</td>
                <td className="p-2">Low</td>
                <td className="p-2">Most interactions (recommended)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Sampled</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Lowest</td>
                <td className="p-2">High-volume events (impressions)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/engagement-tracking/fraud-detection-layers.svg"
          alt="Fraud Detection Layers"
          caption="Figure 3: Fraud Detection Layers — Rule-based filters, anomaly detection, graph analysis, and ML scoring"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Sampling Strategies</h3>
        <p>
          <strong>No Sampling:</strong> Capture all events. Best for accuracy. Highest cost. Required for: Billing, fraud detection, low-volume events.
        </p>
        <p>
          <strong>Uniform Sampling:</strong> Random subset (e.g., 10% of events). Reduces cost proportionally. Risk: May miss rare events. Good for: High-volume impression tracking.
        </p>
        <p>
          <strong>Stratified Sampling:</strong> Sample different event types at different rates. Sample impressions at 10%, interactions at 100%. Balances cost and accuracy.
        </p>
        <p>
          <strong>Adaptive Sampling:</strong> Increase sample rate for anomalous traffic. Normal traffic: 10%, suspected fraud: 100%. Optimizes cost while preserving critical data.
        </p>

        <h3 className="mt-6">Storage Options</h3>
        <p>
          <strong>Time-series Database:</strong> ClickHouse, Druid, InfluxDB. Optimized for time-range queries. High write throughput. Best for: Metrics storage, trend analysis.
        </p>
        <p>
          <strong>Data Warehouse:</strong> BigQuery, Snowflake, Redshift. SQL analytics, historical analysis. Higher latency. Best for: Batch analytics, ML training.
        </p>
        <p>
          <strong>Document Store:</strong> MongoDB, Elasticsearch. Flexible schema, full-text search. Best for: Event details, debugging, ad-hoc queries.
        </p>
        <p>
          <strong>Recommendation:</strong> Multi-store architecture—real-time metrics in time-series DB, historical data in warehouse, recent events in document store for debugging.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Batch client events:</strong> Send up to 10 events or every 5 seconds. Reduces network overhead. Implement flush on page unload (navigator.sendBeacon).
          </li>
          <li>
            <strong>Generate unique event IDs:</strong> Client-side UUID for deduplication. Critical for handling network retries.
          </li>
          <li>
            <strong>Validate at ingestion:</strong> Schema validation, required field checks. Reject malformed events early.
          </li>
          <li>
            <strong>Implement backpressure:</strong> Rate limit clients, queue excess events. Protect downstream systems from overload.
          </li>
          <li>
            <strong>Sample high-volume events:</strong> Impressions can be sampled (10-50%). Never sample interactions or conversions.
          </li>
          <li>
            <strong>Monitor data quality:</strong> Track event volume anomalies, schema drift, processing lag. Alert on significant deviations.
          </li>
          <li>
            <strong>Implement replay capability:</strong> Retain raw events (7+ days). Enables reprocessing for bug fixes or new metrics.
          </li>
          <li>
            <strong>Privacy by design:</strong> Anonymize PII, respect opt-out, implement data retention policies. GDPR/CCPA compliance.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Sync event sending:</strong> Blocking user interaction for event transmission. Solution: Use async batching with sendBeacon fallback.
          </li>
          <li>
            <strong>No deduplication:</strong> Counting same event multiple times on retry. Solution: Unique event IDs with idempotent processing.
          </li>
          <li>
            <strong>Ignoring clock skew:</strong> Using only client timestamps. Solution: Record both client and server timestamps, use server time for ordering.
          </li>
          <li>
            <strong>Sampling everything:</strong> Losing critical fraud signals. Solution: Never sample interactions or conversions, only impressions.
          </li>
          <li>
            <strong>No backpressure:</strong> Overwhelming downstream systems during traffic spikes. Solution: Implement rate limiting and queue-based buffering.
          </li>
          <li>
            <strong>Ignoring privacy:</strong> Collecting PII without consent. Solution: Implement consent management, anonymize data, respect opt-out.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Facebook EdgeRank</h3>
        <p>
          Facebook's News Feed ranking uses engagement tracking to determine content visibility. Each interaction (like, comment, share) has different weight. Time decay ensures fresh content. Affinity score weights engagement from close connections more heavily.
        </p>
        <p>
          <strong>Key Innovation:</strong> Affinity weighting—engagement from users you interact with frequently counts more than strangers, personalizing feed ranking.
        </p>

        <h3 className="mt-6">YouTube Watch Time</h3>
        <p>
          YouTube prioritizes watch time over views for ranking. Tracks seconds watched, percentage completed, re-watches. Engagement signals (likes, comments, shares) secondary to watch time. Fraud detection filters artificial view inflation.
        </p>
        <p>
          <strong>Key Innovation:</strong> Watch time as primary metric—rewards content that keeps viewers engaged, not just clickbait that gets clicks.
        </p>

        <h3 className="mt-6">Twitter Trending Topics</h3>
        <p>
          Twitter detects trending topics by analyzing tweet velocity, unique authors, and geographic spread. Requires engagement from diverse user base to prevent manipulation. Real-time detection within minutes of topic emerging.
        </p>
        <p>
          <strong>Key Innovation:</strong> Diversity requirement—trending requires engagement from multiple independent user clusters, preventing astroturfing.
        </p>

        <h3 className="mt-6">TikTok For You Algorithm</h3>
        <p>
          TikTok tracks detailed engagement: watch time, re-watches, shares, comments, follows after viewing. Uses engagement graph to find similar content. Rapid iteration—algorithm adjusts based on each interaction.
        </p>
        <p>
          <strong>Key Innovation:</strong> Implicit signals—watch time and completion rate weighted more heavily than explicit likes, capturing true interest.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track engagement at scale?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use async event collection with client-side batching (10 events or 5 seconds). Send to ingestion API, queue in Kafka for buffering. Stream processing (Flink/Spark) updates real-time counters. Batch processing for hourly/daily aggregates. Sample high-volume events (impressions) at 10-50%, never sample interactions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect engagement fraud?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Multi-layer approach: (1) Rule-based filters for obvious fraud (rate limits, blacklisted IPs). (2) Anomaly detection for statistical outliers (Z-score, isolation forests). (3) Graph analysis for engagement rings (community detection). (4) ML models trained on known fraud patterns. Exclude high-probability fraud from public counts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you calculate engagement rate?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Engagement Rate = (Total Interactions / Impressions) × 100. Weight interactions by type (like=1, comment=3, share=5). Apply time decay for trending (recent interactions weighted more). Normalize by reach for fair comparison. Quality-adjust by excluding suspected fraud.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect trending content?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Monitor engagement velocity (interactions/hour). Detect acceleration (rate of rate change). Require geographic diversity (multiple regions). Set threshold based on historical baseline (e.g., 10x normal rate). Implement cool-down period (24 hours) to prevent repeated trending.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle event deduplication?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Generate unique event ID client-side (UUID v4). Include in event payload. Store processed event IDs in Redis with TTL (24 hours). Check before processing—skip if ID exists. Idempotent processing ensures retries don't create duplicates.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure data privacy in tracking?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement consent management (GDPR/CCPA compliance). Anonymize PII (hash user IDs, truncate IPs). Respect opt-out signals (Global Privacy Control). Implement data retention policies (delete raw events after 90 days). Provide data export/deletion APIs. Audit data access.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://kafka.apache.org/documentation/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Kafka — Documentation
            </a>
          </li>
          <li>
            <a
              href="https://clickhouse.com/docs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ClickHouse — Time-Series Analytics Database
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/analytics/devguides/collection/ga4"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics 4 — Event Collection Guide
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — sendBeacon API for Reliable Event Transmission
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/tag/analytics/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smashing Magazine — Analytics Implementation Articles
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
