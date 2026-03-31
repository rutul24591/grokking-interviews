"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-analytics-tracking-custom-dimensions-metrics",
  title: "Custom Dimensions & Metrics",
  description: "Staff-level guide to custom dimensions and metrics: data modeling, schema design, aggregation strategies, query optimization, and governance for analytics at scale.",
  category: "frontend",
  subcategory: "analytics-tracking",
  slug: "custom-dimensions-metrics",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "analytics", "custom-dimensions", "custom-metrics", "data-modeling", "schema-design", "governance"],
  relatedTopics: ["event-tracking", "analytics-tools-integration", "data-warehousing", "business-intelligence"],
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
          <strong>Custom dimensions and metrics</strong> extend standard analytics with business-specific data. While standard analytics captures generic data like page views, sessions, and bounce rate, custom dimensions and metrics capture what matters to your business: user tier, content category, product price, subscription plan, feature usage, and domain-specific attributes.
        </p>
        <p>
          Custom dimensions are qualitative attributes (strings, categories) that segment data: user_tier equals premium, content_category equals tutorial, subscription_plan equals enterprise. Custom metrics are quantitative values (numbers) that can be aggregated: cart_value equals 99.99, video_watch_time equals 180, search_results_count equals 25.
        </p>
        <p>
          For staff/principal engineers, custom dimensions and metrics require balancing four competing concerns. <strong>Flexibility</strong> means capturing any business attribute needed for analysis. <strong>Governance</strong> means preventing dimension and metric sprawl that makes data unmanageable. <strong>Performance</strong> means custom data increases storage and query costs. <strong>Privacy</strong> means custom data must not include PII without consent.
        </p>
        <p>
          The business impact of custom dimensions and metrics is significant and multifaceted. Standard analytics can't answer "Do premium users convert better?" but custom dimensions can. Custom metrics measure business value like revenue and LTV, not just engagement. Custom dimensions enable powerful segmentation by plan, tier, and cohort. Custom metrics track feature adoption, usage depth, and power user behavior.
        </p>
        <p>
          In system design interviews, custom dimensions and metrics demonstrates understanding of data modeling, schema design, aggregation, and the trade-offs between flexibility and governance. It shows you think about business requirements, not just technical implementation.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/event-taxonomy.svg"
          alt="Event taxonomy hierarchy showing custom dimensions organized by category (user, content, commerce) with specific dimensions under each"
          caption="Custom dimension taxonomy — organize by domain with consistent naming; enforce data types and allowed values"
        />

        <h3>Dimensions vs. Metrics</h3>
        <p>
          Understanding the distinction is fundamental. <strong>Dimensions</strong> are qualitative attributes used for segmentation and grouping. Examples include user_tier, content_category, and traffic_source. Dimensions cannot be summed or averaged. <strong>Metrics</strong> are quantitative values that can be aggregated. Examples include revenue, watch_time, and items_in_cart. Metrics can be summed, averaged, and counted.
        </p>
        <p>
          For example, "Average revenue by user tier" — user_tier is the dimension (grouping), revenue is the metric (aggregated).
        </p>

        <h3>Dimension Scope</h3>
        <p>
          Dimensions have different scopes. <strong>Hit-level</strong> applies to a single interaction like a page view or event. Examples include page_category and button_color. <strong>Session-level</strong> applies to an entire session. Examples include session_device and traffic_source. <strong>User-level</strong> applies to a user across sessions. Examples include user_tier, subscription_plan, and registration_date. <strong>Product-level</strong> applies to a specific product. Examples include product_category and product_brand.
        </p>
        <p>
          Scope determines when a dimension value is set and how long it persists. User-level dimensions require user identification.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/dimension-scope.svg"
          alt="Dimension scope hierarchy showing hit-level (single event), session-level (entire session), and user-level (across all sessions) with examples and lifetime for each scope"
          caption="Dimension scope — hit-level applies to single event, session-level to entire session, user-level persists across all sessions with user identification"
        />

        <h3>Metric Types</h3>
        <p>
          Different metric types require different aggregation. <strong>Count</strong> is the number of occurrences. Sum across dimensions. Examples include page_views and clicks. <strong>Sum</strong> is the sum of values. Examples include revenue and watch_time. <strong>Average</strong> is the mean of values. Examples include avg_order_value and avg_session_duration. <strong>Ratio</strong> is the division of two metrics. Examples include conversion_rate equals conversions divided by sessions. <strong>Distinct count</strong> is the count of unique values. Examples include unique_users and unique_products.
        </p>
        <p>
          Important: Averages and ratios cannot be aggregated directly. You must aggregate numerator and denominator separately, then calculate the ratio.
        </p>

        <h3>Schema Design</h3>
        <p>
          Design custom dimension and metric schema for flexibility and governance. Use consistent naming with snake_case and prefix by domain, like user_tier, product_category, and content_author. Enforce data types including string, number, boolean, and timestamp. For categorical dimensions, define allowed values (enum). Document each dimension and metric with description, owner, and examples.
        </p>
        <p>
          Best practice: Treat schema like API contracts. Changes require review and versioning.
        </p>

        <h3>Aggregation Strategies</h3>
        <p>
          Custom metrics require proper aggregation. <strong>Real-time aggregation</strong> aggregates as events arrive. Use stream processing like Kafka Streams or Flink. <strong>Batch aggregation</strong> aggregates periodically (hourly, daily). Use data warehouse. <strong>Pre-aggregation</strong> pre-computes common aggregations for fast queries. <strong>On-demand aggregation</strong> aggregates at query time. This is flexible but slower.
        </p>
        <p>
          Trade-off: Real-time is faster but less flexible. Batch is slower but more flexible. Hybrid approach: real-time for key metrics, batch for exploratory analysis.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/aggregation-strategies.svg"
          alt="Comparison of real-time aggregation (stream processing with <1 second latency) versus batch aggregation (hourly/daily ETL to data warehouse)"
          caption="Aggregation strategies — real-time for critical metrics (fraud, alerts) with <1s latency; batch for engagement metrics with hourly/daily latency"
        />

        <h3>Cardinality</h3>
        <p>
          Dimension cardinality (number of unique values) impacts performance. <strong>Low cardinality</strong> has less than 100 unique values. Example: user_tier (free, pro, enterprise). This has fast grouping. <strong>Medium cardinality</strong> has 100 to 10,000 unique values. Example: content_category. This has acceptable performance. <strong>High cardinality</strong> has greater than 10,000 unique values. Example: user_id and page_url. This has slow grouping and high storage.
        </p>
        <p>
          Best practice: Avoid high-cardinality dimensions for grouping. Use for filtering only. Aggregate high-cardinality data before storage.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A robust custom dimensions and metrics architecture treats custom data as first-class schema with proper validation, storage, and querying.
        </p>

        <h3>Custom Data Collection Architecture</h3>
        <p>
          Implement custom data collection by maintaining a schema registry of all custom dimensions and metrics with types, allowed values, and owners. Validate custom data against the schema before sending and reject invalid data. Define default values for optional dimensions. Include schema version with data for backward compatibility.
        </p>
        <p>
          Create a tracking utility that validates custom data against schema before sending to analytics.
        </p>

        <h3>Storage Architecture</h3>
        <p>
          Store custom data for efficient querying. <strong>Wide table</strong> stores all dimensions and metrics in a single table. This is simple but sparse. <strong>Entity-Attribute-Value (EAV)</strong> is flexible but has complex queries. <strong>JSONB</strong> stores custom data as JSON. This is flexible and good for ad-hoc queries. <strong>Columnar</strong> stores each dimension and metric as a column. This is best for analytics queries.
        </p>
        <p>
          Recommendation: Use columnar storage like BigQuery or Snowflake for analytics. Use JSONB for flexibility during exploration.
        </p>

        <h3>Query Optimization</h3>
        <p>
          Optimize queries on custom data. Partition by date for time-range queries. Cluster by frequently filtered dimensions. Pre-compute common aggregations with materialized views. Index frequently filtered dimensions.
        </p>
        <p>
          Best practice: Profile slow queries. Add partitions, clustering, or materialized views based on query patterns.
        </p>

        <h3>Governance Architecture</h3>
        <p>
          Implement governance for custom data. Require registration before adding a new dimension or metric. Assign an owner for each dimension and metric. Create a process for deprecating unused dimensions and metrics. Conduct regular audits of dimension and metric usage.
        </p>
        <p>
          Goal: Prevent dimension and metric sprawl while maintaining flexibility.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Custom dimensions and metrics involves trade-offs between flexibility, governance, and cost. Open schema provides the best flexibility but poor governance and high cost from sprawl. This is best for early-stage exploration. Registered schema provides good flexibility and good governance with medium cost. This is best for most organizations. Strict schema provides poor flexibility but the best governance and low cost. This is best for regulated industries.
        </p>
        <p>
          The staff-level insight is that registered schema with lightweight governance works best for most organizations. Require registration, but make it easy.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Define a naming convention using consistent naming with snake_case and prefix by domain. Document everything by documenting each dimension and metric with description, owner, and examples. Validate data by validating custom data against schema before sending.
        </p>
        <p>
          Monitor cardinality and alert on high-cardinality dimensions. Audit regularly with quarterly audits of dimension and metric usage. Deprecate unused dimensions and metrics. Avoid PII by never including PII in custom dimensions without consent. Use defaults by defining default values for optional dimensions. Pre-aggregate common aggregations for fast queries.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Dimension sprawl with hundreds of unused dimensions makes it hard to find what matters. No documentation means nobody knows what dimensions mean or who owns them. High cardinality dimensions used for grouping cause performance issues.
        </p>
        <p>
          Including PII without consent violates regulations. Averaging averages or summing ratios leads to wrong aggregation. No validation allows invalid data to pollute analytics.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>SaaS: User Tier Analysis</h3>
        <p>
          A SaaS company couldn't analyze behavior by subscription tier in standard analytics. The solution was adding user_tier (free, pro, enterprise) as a user-level dimension and adding mrr (monthly recurring revenue) as a metric. They discovered pro users had 3x higher engagement than free, and enterprise had 5x LTV. After focusing product development on pro features, revenue increased 30%.
        </p>

        <h3>E-Commerce: Product Attribution</h3>
        <p>
          An e-commerce site couldn't analyze sales by product attributes. The solution was adding product-level dimensions: product_category, product_brand, and product_margin_tier. They added revenue and margin as metrics. They discovered high-margin products had low visibility. After adjusting recommendations, margin increased 15%.
        </p>

        <h3>Media: Content Performance</h3>
        <p>
          A media site couldn't analyze content performance by author, category, or format. The solution was adding content dimensions: content_author, content_category, and content_format (article, video, podcast). They added read_time and completion_rate as metrics. They discovered video had 2x engagement but lower production. After investing in video, overall engagement increased 40%.
        </p>

        <h3>Marketplace: Geographic Analysis</h3>
        <p>
          A marketplace couldn't analyze performance by geography. The solution was adding user_country, user_city, and listing_region as dimensions. They added gmv (gross merchandise value) as a metric. They discovered 3 cities drove 50% of GMV. After focusing marketing on high-value cities, GMV increased 25%.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is the difference between custom dimensions and custom metrics?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Dimensions are qualitative attributes for segmentation. Examples include user_tier and content_category. Dimensions cannot be summed or averaged. Metrics are quantitative values for aggregation. Examples include revenue and watch_time. Metrics can be summed, averaged, and counted.
            </p>
            <p>
              Example query: "Average revenue by user tier" — user_tier is dimension (grouping), revenue is metric (aggregated).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What are the different dimension scopes?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Hit-level applies to a single interaction. Example: page_category. Session-level applies to an entire session. Example: traffic_source. User-level applies to a user across sessions. Example: user_tier. Product-level applies to a specific product. Example: product_category.
            </p>
            <p>
              Scope determines when dimension value is set and how long it persists. User-level requires user identification.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you handle high-cardinality dimensions?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Avoid high-cardinality dimensions for grouping because they're slow for GROUP BY queries. High-cardinality is fine for WHERE clauses (filtering). Aggregate high-cardinality data before storage. Sample high-cardinality data for exploration.
            </p>
            <p>
              Example: user_id is high-cardinality. Don't group by user_id directly. Aggregate to user-level metrics first.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you govern custom dimensions and metrics?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Require registration before adding a new dimension or metric. Document description, owner, and allowed values. Conduct regular audits of usage and deprecate unused items. Validate data against schema.
            </p>
            <p>
              Goal: Prevent sprawl while maintaining flexibility. Make registration lightweight but required.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you aggregate ratios and averages correctly?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Don't average averages—the average of averages is wrong unless denominators are equal. Aggregate components by summing numerators and denominators separately, then divide. For example, conversion rate equals SUM(conversions) divided by SUM(sessions), not AVG(conversion_rate).
            </p>
            <p>
              Example: Day 1: 10/100 = 10%. Day 2: 90/900 = 10%. Average of averages = 10%. Correct: (10+90)/(100+900) = 10%. Same in this case, but differs when rates differ.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What are privacy considerations for custom dimensions?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Never include raw PII (email, name, phone) without consent. Use hashed user_id instead of raw identifiers. Practice data minimization by only including data necessary for analysis. Delete or anonymize after the retention period.
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
            <a href="https://support.google.com/analytics/answer/2709828" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google Analytics: Custom Dimensions & Metrics
            </a> — GA4 custom data documentation.
          </li>
          <li>
            <a href="https://mixpanel.com/guide/custom-properties/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Mixpanel: Custom Properties
            </a> — Custom data implementation guide.
          </li>
          <li>
            <a href="https://www.datanami.com/2023/01/10/data-modeling-best-practices/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Data Modeling Best Practices
            </a> — Schema design principles.
          </li>
          <li>
            <a href="https://segment.com/academy/collecting-data/best-practices-for-custom-dimensions/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Segment: Custom Dimensions Best Practices
            </a> — Governance and implementation.
          </li>
          <li>
            <a href="https://gdpr.eu/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GDPR.eu
            </a> — GDPR compliance guide.
          </li>
          <li>
            <a href="https://kafka.apache.org/documentation/streams/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Kafka Streams
            </a> — Real-time aggregation with stream processing.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
