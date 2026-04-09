"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-advanced-topics-geo-sharding",
  title: "Geo-Sharding",
  description:
    "Staff-level deep dive into geo-sharding: geographic data partitioning, data residency compliance, cross-region query patterns, routing strategies, and production-scale trade-offs.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "geo-sharding",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-08",
  tags: ["backend", "geo-sharding", "data-residency", "partitioning", "multi-region", "compliance"],
  relatedTopics: ["global-distribution", "hot-partitions", "multi-region-deployment", "replication-in-nosql"],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/advanced-topics";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Geo-sharding</strong> is the practice of partitioning data by geographic region,
          storing each partition in the region where the data originates or where the majority of
          its users are located. Unlike traditional sharding which partitions data by hash key or
          range, geo-sharding uses geographic attributes (user location, data origin, regulatory
          boundary) as the partition key. This provides data locality (low latency for local
          reads), regulatory compliance (data residency requirements), and operational isolation
          (regional failures do not cascade globally).
        </p>
        <p>
          Consider a global social media platform with users in the United States, European Union,
          and Asia-Pacific. Without geo-sharding, all user data might be stored in a single region
          (e.g., US East), resulting in high latency for European and Asian users (80-220ms RTT)
          and potential GDPR compliance violations (EU personal data stored outside the EU). With
          geo-sharding, US users&apos; data is stored in US regions, EU users&apos; data in EU
          regions, and APAC users&apos; data in APAC regions. Each user reads and writes to their
          local shard with single-digit millisecond latency, and data residency requirements are
          naturally satisfied.
        </p>
        <p>
          For staff/principal engineers, geo-sharding requires balancing three competing concerns.
          <strong>Latency</strong> means users should read and write to their local shard for
          minimal latency. <strong>Compliance</strong> means data must stay within regulatory
          boundaries (GDPR, CCPA, data sovereignty laws). <strong>Cross-region access</strong>
          means some queries need data from multiple regions (e.g., a US user viewing an EU
          user&apos;s public profile), which introduces cross-region latency and complexity.
        </p>
        <p>
          The business impact of geo-sharding decisions is significant. Correct geo-sharding
          reduces read latency by 50-80% for non-local users, ensures regulatory compliance
          (avoiding fines of up to 4% of global revenue under GDPR), and provides natural
          failure isolation (a regional outage affects only that region&apos;s users). Incorrect
          geo-sharding causes cross-region latency spikes, compliance violations, and complex
          cross-region query patterns that are difficult to optimize.
        </p>
        <p>
          In system design interviews, geo-sharding demonstrates understanding of data
          partitioning strategies, regulatory compliance, multi-region architecture, and the
          trade-offs between data locality and cross-region access patterns.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src={`${BASE_PATH}/geo-sharding-architecture.svg`}
          alt="Geo-sharding architecture showing users routed to regional shards (US, EU, APAC) based on geographic location, with local read/write paths and controlled cross-region access"
          caption="Geo-sharding architecture — users are routed to their regional shard based on location, providing data locality (single-digit ms latency), regulatory compliance (data stays within region), and natural failure isolation"
        />

        <h3>Geographic Partition Key Design</h3>
        <p>
          The partition key determines which shard a record belongs to. For geo-sharding, the
          partition key is typically derived from the user&apos;s geographic location (country,
          region, or data residency zone). The key design must be deterministic (the same user
          always maps to the same shard), stable (the user&apos;s shard does not change frequently),
          and coarse-grained enough to avoid excessive cross-shard queries.
        </p>
        <p>
          Common partition key strategies include: country code (each country has its own shard,
          simple but may create many small shards), region code (group countries into regions like
          EU, NA, APAC, balances shard count and compliance), and data residency zone (define
          shards based on legal boundaries like &quot;EU data stays in EU&quot;). The choice
          depends on the number of regions served, regulatory requirements, and expected traffic
          distribution across regions.
        </p>

        <h3>Data Residency and Compliance</h3>
        <p>
          Data residency laws require that certain types of data (personal data, financial records,
          health information) be stored within specific geographic boundaries. GDPR requires EU
          personal data to be stored within the EU (or in countries with adequacy decisions).
          CCPA requires California residents&apos; data to be handled with specific protections.
          India&apos;s data localization law requires certain financial data to be stored in
          India.
        </p>
        <p>
          Geo-sharding naturally satisfies data residency requirements because each region&apos;s
          data is stored in that region&apos;s shard. However, cross-region access patterns (e.g.,
          a US-based analytics job processing EU user data) must be carefully designed to comply
          with data transfer regulations. This typically involves data anonymization, explicit
          consent mechanisms, or approved transfer mechanisms (Standard Contractual Clauses under
          GDPR).
        </p>

        <h3>Cross-Region Query Patterns</h3>
        <p>
          When a query needs data from multiple regions, the system must coordinate across shards.
          The simplest approach is <strong>fan-out queries</strong>: the gateway sends the query
          to all relevant shards, collects responses, and merges them. This works for read queries
          but introduces high latency (the query is as slow as the slowest region). The
          <strong>home region redirect</strong> approach routes the entire query to the user&apos;s
          home region, which then fetches data from other regions as needed. This centralizes
          cross-region coordination but adds latency for the home region&apos;s database.
        </p>
        <p>
          For write queries that span multiple regions, <strong>distributed transactions</strong>
          (two-phase commit) ensure atomicity across shards but add significant latency and
          complexity. The alternative is <strong>eventual consistency across regions</strong>:
          writes are applied locally and replicated to other regions asynchronously, accepting
          temporary inconsistency in exchange for lower write latency.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/geo-sharding-data-locality.svg`}
          alt="Data residency compliance showing EU data stays in EU shard, US data in US shard, with regulatory boundaries and cross-region access controls"
          caption="Data residency compliance — EU personal data stays in EU shard, US data in US shard; cross-region access requires anonymization or approved transfer mechanisms"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Regional Shard Architecture</h3>
        <p>
          Each regional shard is a self-contained database cluster serving the users in that
          region. The shard includes a primary database (for writes), read replicas (for local
          read scaling), and a local cache (for frequently accessed data). The shard is isolated
          from other regions: it has its own network, storage, and compute resources. This
          isolation provides natural failure containment: if the EU shard experiences an outage,
          only EU users are affected.
        </p>
        <p>
          The application layer routes requests to the appropriate shard based on the user&apos;s
          geographic location. This routing can be implemented at multiple levels: DNS routing
          (resolve the database hostname to the nearest region&apos;s IP), application-level
          routing (the application determines the shard based on the user&apos;s country code),
          or proxy-level routing (a regional proxy forwards requests to the local shard).
        </p>

        <h3>Replication Across Regions</h3>
        <p>
          While geo-sharding partitions data by region, some data needs to be accessible
          cross-region. Public profiles, shared content, and global metadata may need to be
          visible to users in other regions. This is achieved through <strong>selective
          cross-region replication</strong>: only data that is explicitly marked as &quot;public&quot;
          or &quot;cross-region accessible&quot; is replicated to other regions&apos; read-only
          replicas.
        </p>
        <p>
          Cross-region replication is typically asynchronous to avoid the latency of synchronous
          writes across regions (80-220ms RTT). This means there is a replication lag (typically
          1-5 seconds) during which cross-region reads may return stale data. For public data
          like social media profiles, eventual consistency is acceptable. For sensitive data
          like financial transactions, synchronous replication or local-only access may be
          required.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/geo-sharding-vs-global.svg`}
          alt="Geo-sharding vs global replication comparison: geo-sharding partitions data by region (local reads, compliance, complex cross-region queries) vs global replication copies all data everywhere (simple queries, high replication cost, simpler consistency)"
          caption="Geo-sharding vs global replication — geo-sharding partitions data by region for compliance and locality (complex cross-region queries), while global replication copies all data everywhere (simple queries but high replication cost and compliance challenges)"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Geo-sharding involves trade-offs between data locality, cross-region access complexity,
          and operational overhead. Compared to a single global database, geo-sharding provides
          lower read latency for local users and natural compliance with data residency laws, but
          requires complex cross-region query coordination and data synchronization. Compared to
          full global replication (where all data is copied to every region), geo-sharding uses
          less storage and avoids compliance violations, but cannot answer cross-region queries
          without coordination.
        </p>
        <p>
          The staff-level insight is that geo-sharding is not a binary choice but a spectrum.
          Some data (personal data, financial records) must be geo-sharded for compliance. Some
          data (public content, global metadata) can be globally replicated for simpler access.
          The right approach is a hybrid: geo-shard compliance-sensitive data, globally replicate
          public data, and implement selective cross-region access patterns for data that falls
          in between.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Design partition keys based on regulatory boundaries rather than arbitrary geographic
          divisions. Use data residency zones (EU, US, APAC) as shard boundaries rather than
          individual countries, which creates too many small shards. Ensure the partition key is
          stable: a user&apos;s shard should not change when they travel, because their data&apos;s
          residency requirements are based on their account&apos;s registered location, not their
          current physical location.
        </p>
        <p>
          Implement cross-region access controls at the application layer: before a query crosses
          region boundaries, verify that the data transfer complies with applicable regulations.
          Log all cross-region access for audit purposes. Use data anonymization for cross-region
          analytics: strip personally identifiable information before replicating data to other
          regions for aggregate analysis.
        </p>
        <p>
          Monitor cross-region replication lag and alert when it exceeds acceptable thresholds.
          Implement read-your-writes consistency for cross-region reads: if a user writes to their
          home region and immediately reads from another region, ensure the read is routed to the
          home region until replication has caught up.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is designing geo-shards that are too granular (one shard per
          country). This creates many small shards, each with its own operational overhead
          (backups, monitoring, scaling), and makes cross-region queries extremely complex
          (coordinating across dozens of shards). The fix is to group countries into regions
          (EU, NA, APAC) that align with regulatory boundaries and traffic patterns, resulting
          in 5-10 manageable shards.
        </p>
        <p>
          Another common pitfall is ignoring cross-region query latency. A query that fans out
          to three regions (US, EU, APAC) is as slow as the slowest region&apos;s response. If
          the APAC region has 200ms RTT from the US, the query takes at least 200ms plus
          processing time. The fix is to minimize cross-region queries through data denormalization
          (replicate frequently-needed cross-region data locally) and query optimization (batch
          cross-region requests, use asynchronous fan-out with eventual consistency).
        </p>
        <p>
          Not planning for shard rebalancing is a critical pitfall. If one region&apos;s traffic
          grows significantly (e.g., APAC traffic doubles), that region&apos;s shard may become
          overloaded while other regions are underutilized. The fix is to design shards that can
          be split: if the APAC shard grows too large, split it into APAC-East and APAC-West
          shards, and update the routing logic to direct users to the appropriate sub-shard.
        </p>
        <p>
          Assuming geo-sharding eliminates all compliance risks is a legal pitfall. Even with
          geo-sharded storage, cross-region access patterns (analytics, support tools, backups)
          may transfer data across regulatory boundaries. The fix is to audit all data flows
          (not just primary storage) for compliance, including backup storage locations, disaster
          recovery replication, and third-party data processors.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>TikTok: Regional Data Isolation</h3>
        <p>
          TikTok implements geo-sharding to comply with data residency regulations across dozens
          of countries. User data is stored in the region where the user resides: EU users&apos;
          data in EU data centers, US users&apos; data in US data centers, and so on. Cross-region
          access is restricted: content moderation teams can only access data from their own
          region, and analytics data is anonymized before cross-region aggregation.
        </p>

        <h3>AWS: Regional Service Endpoints</h3>
        <p>
          AWS services are geo-sharded by design: each AWS region is an independent shard with
          its own database clusters, storage, and compute. DynamoDB tables are created per-region,
          and cross-region replication is an opt-in feature (DynamoDB Global Tables). This
          architecture gives customers control over where their data is stored, enabling compliance
          with data residency requirements while providing low-latency access to local users.
        </p>

        <h3>Stripe: Payment Data Localization</h3>
        <p>
          Stripe geo-shards payment data to comply with financial data localization laws in
          countries like India and Brazil. Payment transactions originating in these countries
          are stored in local shards and are not replicated to other regions without explicit
          customer consent. Cross-region queries (e.g., global revenue reporting) use anonymized
          aggregate data that does not contain personally identifiable information.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is geo-sharding and when should you use it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Geo-sharding partitions data by geographic region, storing each region&apos;s data in
              that region&apos;s database shard. It is used when: data residency laws require data
              to stay within specific boundaries (GDPR, India&apos;s data localization), read
              latency for local users is critical, and regional failure isolation is desired.
            </p>
            <p>
              Use geo-sharding when regulatory compliance or latency requirements justify the
              operational complexity of managing multiple regional shards. Avoid it for small-scale
              applications where a single global database is simpler and cheaper.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you handle cross-region queries in a geo-sharded system?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Cross-region queries are handled through fan-out queries (send to all relevant
              shards, merge responses) or home region redirect (route to user&apos;s home region
              which coordinates cross-region fetches). Fan-out is simple but slow (bounded by
              slowest region). Home region redirect centralizes coordination but adds load to the
              home region.
            </p>
            <p>
              Minimize cross-region queries through data denormalization (replicate frequently
              needed cross-region data locally) and asynchronous fan-out (accept eventual
              consistency for cross-region reads).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you ensure compliance with data residency laws in a geo-sharded system?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Store data in the region where it originates: EU data in EU shards, US data in US
              shards. Restrict cross-region access: only replicate data across regions with
              approved transfer mechanisms (anonymization, explicit consent, Standard Contractual
              Clauses). Log all cross-region access for audit purposes.
            </p>
            <p>
              Additionally, audit all data flows including backups, disaster recovery replication,
              and third-party processors. Data residency compliance extends beyond primary storage
              to every system that touches the data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What happens when a geo-shard becomes too large and needs to be split?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Split the shard by introducing sub-regions within the geographic boundary. For
              example, split the APAC shard into APAC-East and APAC-West shards. Update the
              routing logic to direct users to the appropriate sub-shard based on their more
              specific location.
            </p>
            <p>
              Perform the split online: run a dual-write period where writes go to both the old
              shard and the new shards, verify data consistency, then switch reads to the new
              shards and decommission the old shard. This minimizes downtime and data loss risk.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How does geo-sharding differ from multi-region replication?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Geo-sharding partitions data by region: each region stores only its own data.
              Multi-region replication copies all data to every region. Geo-sharding uses less
              storage and naturally satisfies data residency laws, but requires complex cross-region
              queries. Multi-region replication allows any region to answer any query, but uses
              more storage and may violate data residency laws.
            </p>
            <p>
              The choice depends on compliance requirements and query patterns. Use geo-sharding
              for compliance-sensitive data and multi-region replication for public data that
              needs low-latency access globally.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do you handle a regional outage in a geo-sharded system?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              A regional outage affects only users in that region — this is the natural failure
              isolation benefit of geo-sharding. The failover strategy depends on the data&apos;s
              residency requirements. If data can be served from another region (no residency
              restrictions), failover DNS to redirect traffic to a healthy region. If data cannot
              leave the region (strict residency), users in the affected region experience an
              outage until the region recovers.
            </p>
            <p>
              For regions with strict residency requirements, implement a warm standby in the
              same regulatory boundary (e.g., EU region 2 as standby for EU region 1) to provide
              failover within the same regulatory boundary.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://docs.aws.amazon.com/whitepapers/latest/aws-gdpr-data-processing-addendum/aws-gdpr-data-processing-addendum.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS: GDPR and Data Residency
            </a>{" "}
            — How AWS supports data residency compliance.
          </li>
          <li>
            <a
              href="https://cloud.google.com/architecture/data-residency"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Cloud: Data Residency Architecture
            </a>{" "}
            — Architectural patterns for data residency compliance.
          </li>
          <li>
            <a
              href="https://stripe.com/docs/global"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe: Global Payment Infrastructure
            </a>{" "}
            — How Stripe handles cross-border payment data.
          </li>
          <li>
            <a
              href="https://www.gdpr.eu/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GDPR.eu
            </a>{" "}
            — Comprehensive guide to GDPR data residency requirements.
          </li>
          <li>
            Martin Kleppmann,{" "}
            <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017. Chapter 5
            (Partitioning).
          </li>
          <li>
            <a
              href="https://netflixtechblog.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netflix Tech Blog: Multi-Region Data Architecture
            </a>{" "}
            — How Netflix manages data across regions.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
