"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-data-modeling-in-nosql-complete",
  title: "Data Modeling in NoSQL",
  description:
    "Comprehensive guide to NoSQL data modeling: query-first design, denormalization strategies, embedding vs referencing, and selecting the right database for your access patterns.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "data-modeling-in-nosql",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "nosql", "data-modeling", "database-design"],
  relatedTopics: [
    "document-databases",
    "key-value-stores",
    "graph-databases",
    "column-family-stores",
    "time-series-databases",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Data Modeling in NoSQL</h1>
        <p className="lead">
          NoSQL data modeling is fundamentally different from relational modeling. Instead of
          normalizing data to eliminate redundancy, NoSQL modeling embraces denormalization—duplicating
          data to optimize for specific query patterns. Instead of modeling entities and relationships,
          you model access patterns: what queries will you run, and how can you structure data to
          answer them efficiently? This query-first approach requires a mindset shift, but enables
          the performance and scalability that NoSQL databases provide.
        </p>

        <p>
          Consider an e-commerce order system. In a relational database, you normalize: separate
          tables for customers, orders, order_items, and products. To display an order, you join
          four tables. In a document database, you denormalize: embed order items within the order
          document, include product names and prices directly. To display an order, you fetch one
          document. The trade-off: updating a product name requires updating all order documents
          that reference it. But orders are immutable historical records—product names don't change
          after purchase. This trade-off is acceptable.
        </p>

        <p>
          NoSQL data modeling requires understanding your access patterns deeply. What queries will
          you run? What are the latency requirements? What data is read together? What data changes
          independently? Answering these questions shapes your data model. Unlike relational databases
          where one normalized schema serves all queries, NoSQL often requires multiple data models
          (denormalized copies) for different query patterns.
        </p>

        <p>
          This article provides a comprehensive examination of NoSQL data modeling: query-first
          design principles, denormalization strategies (embedding, referencing, duplication),
          aggregation patterns (computed summaries, materialized views, bucket pattern), and a
          framework for selecting the right NoSQL database for your access patterns. We'll explore
          patterns across document, key-value, graph, column-family, and time-series databases,
          with real-world examples from production systems.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/nosql-modeling-principles.svg`}
          caption="Figure 1: NoSQL Data Modeling Principles showing query-first design approach. Step 1: Identify query patterns (what queries, access patterns, latency requirements). Step 2: Design for queries (model data to match queries, denormalize for read performance). Don't model after entities (relational thinking). Denormalization strategies: Embedding (one-to-few, store related data together, single query retrieves all, example: order with line items), Referencing (one-to-many, store IDs and fetch separately, for unbounded collections, example: user with orders), Duplication (read optimization, copy data for different queries, trade write cost for read speed). Aggregation patterns: Computed summaries (pre-aggregated counts), Materialized views (pre-computed query results), Bucket pattern (group items into buckets), Approximation (HyperLogLog). Key principles: query-first design, embrace denormalization, model for access patterns, accept eventual consistency."
          alt="NoSQL data modeling principles"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Query-First Design</h2>

        <h3>The Relational vs NoSQL Mindset</h3>
        <p>
          Relational modeling starts with entities and relationships. You identify entities
          (Customer, Order, Product), define their attributes, then normalize to eliminate
          redundancy. The goal: one source of truth, no update anomalies. Queries are an
          afterthought—the schema works for all queries via joins.
        </p>

        <p>
          NoSQL modeling starts with queries. You identify access patterns (get order by ID,
          list orders by customer, get orders by date), then design data structures optimized
          for each pattern. The goal: efficient queries, minimal joins. Redundancy is acceptable—
          you trade write cost for read performance. This is <strong>query-first design</strong>.
        </p>

        <p>
          The mindset shift: <strong>Relational: Normalize → Query</strong> vs
          <strong>NoSQL: Query → Denormalize</strong>. In relational, you ask "What are the
          entities and how do they relate?" In NoSQL, you ask "What queries will I run and how
          can I structure data to answer them efficiently?"
        </p>

        <h3>Embedding vs Referencing</h3>
        <p>
          The fundamental decision in NoSQL modeling is whether to embed related data or reference
          it. <strong>Embedding</strong> stores related data within a single document/row. An
          order document embeds order items. A user document embeds preferences. Embedding enables
          single-query reads—the entire data structure is retrieved in one operation. This is
          ideal for one-to-few relationships where data is always accessed together.
        </p>

        <p>
          <strong>Referencing</strong> stores related data separately and links via IDs. A user
          document references order IDs; orders are stored separately. Referencing keeps documents
          small and allows independent access patterns. But retrieving related data requires
          multiple queries or application-side joins. Use referencing for one-to-many relationships,
          unbounded collections, or data accessed independently.
        </p>

        <p>
          Decision framework: <strong>Embed when</strong> you have one-to-few, data is always
          accessed together, and document size is bounded. <strong>Reference when</strong> you
          have one-to-many, data is accessed independently, or growth is unbounded. Many systems
          use hybrid approaches: embed recent orders (frequently accessed), reference historical
          orders (rarely accessed).
        </p>

        <h3>Denormalization Strategies</h3>
        <p>
          Denormalization is intentional redundancy for read optimization. Common strategies:
          <strong>Duplication</strong> copies data for different query patterns. A product name
          appears in the product document and embedded in order documents. Updating the name
          requires updating both, but reads are fast. <strong>Computed summaries</strong> store
          pre-aggregated values. A user document stores order_count, total_spent—updated on each
          order. Queries for "top customers" use pre-computed values, not real-time aggregation.
        </p>

        <p>
          <strong>Materialized views</strong> are pre-computed query results stored as separate
          documents. A "recent orders" view is maintained as orders are added/updated. Queries
          read the view directly, not the base data. <strong>Bucket pattern</strong> groups
          related items into fixed-size documents. Instead of embedding unlimited comments in a
          post document, group comments into buckets of 50. This bounds document size while
          keeping related data together.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/nosql-selection-framework.svg`}
          caption="Figure 2: NoSQL Database Selection Framework showing decision tree based on primary access pattern. Simple key lookup (GET/SET by key, microsecond latency, caching/sessions) → Key-Value Store. Time-ordered data (metrics, events, time-range queries, downsampling needed) → Time Series DB. Relationship queries (deep traversals 3+ hops, pattern matching, social/fraud/recommendations) → Graph Database. Hierarchical data (nested documents, flexible schema, content/profiles) → Document Database. Write-heavy wide rows (high write throughput, sparse columns, logs/messaging) → Column-Family Store. Complex queries + ACID (joins, aggregations, ACID transactions, financial/reporting) → Relational Database. Key considerations beyond access pattern: Consistency (strong vs eventual), Scalability (horizontal vs vertical), Latency (read vs write requirements), Operations (managed vs self-hosted), Ecosystem (tools, integrations)."
          alt="NoSQL database selection framework"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Patterns by Database Type</h2>

        <h3>Document Database Patterns</h3>
        <p>
          Document databases (MongoDB, Cosmos DB) excel at hierarchical data. Common patterns:
          <strong>Embedded documents</strong> for one-to-few (order with items, post with comments).
          <strong>Referenced documents</strong> for one-to-many (user with orders, author with
          books). <strong>Polymorphic patterns</strong> for varying schemas (products with
          category-specific fields: books have ISBN, shirts have size). <strong>Tree structures</strong>
          for hierarchies (categories, org charts) using parent references or materialized paths.
        </p>

        <p>
          Indexing is critical. Create indexes on fields used in queries (filter fields, sort
          fields). Compound indexes cover multi-field queries. Use index analysis tools to verify
          index usage and identify slow queries. Monitor index size—indexes have write overhead.
        </p>

        <h3>Key-Value Store Patterns</h3>
        <p>
          Key-value stores (Redis, DynamoDB) excel at simple lookups. Common patterns:
          <strong>Key design</strong> determines access patterns. Use prefixes for namespacing
          (user:123:profile, user:123:settings). <strong>Composite keys</strong> enable range
          queries (session:user:123:*, where * is a range). <strong>Data structures</strong>
          beyond strings: lists (queues), sets (unique items), sorted sets (leaderboards), hashes
          (object-like structures).
        </p>

        <p>
          <strong>TTL (time-to-live)</strong> enables automatic expiration. Sessions expire after
          inactivity, cache entries expire and refresh, rate limit counters reset. <strong>Atomic
          operations</strong> (INCR, LPUSH, ZADD) enable counters, queues, and leaderboards without
          locking.
        </p>

        <h3>Graph Database Patterns</h3>
        <p>
          Graph databases (Neo4j, Neptune) excel at relationship queries. Common patterns:
          <strong>Node labels</strong> for types (Person, Company, Product).
          <strong>Relationship types</strong> for semantics (KNOWS, WORKS_AT, PURCHASED).
          <strong>Properties</strong> on nodes and relationships (person.name, KNOWS.since).
          <strong>Traversal patterns</strong> for queries: friend-of-friend (2-hop), path finding
          (shortest path), community detection (clusters).
        </p>

        <p>
          Index nodes by properties used as traversal starting points (user IDs, names). Limit
          traversal depth to prevent runaway queries (most useful patterns are 2-4 hops). Cache
          hot subgraphs for frequently accessed patterns.
        </p>

        <h3>Column-Family Store Patterns</h3>
        <p>
          Column-family stores (Cassandra, HBase) excel at write-heavy workloads. Common patterns:
          <strong>Wide rows</strong> for time-series data (one row per sensor, columns as
          timestamps). <strong>Column families</strong> for related data (profile, posts, comments
          in separate families). <strong>Time-based partitioning</strong> for efficient range
          queries (one row per day). <strong>Denormalization</strong> for query optimization
          (multiple tables for different query patterns).
        </p>

        <p>
          Row key design is critical. Row keys determine data distribution—poor design causes hot
          spots. Use hashing or salting to distribute writes evenly. Design for your queries: row
          keys should support range scans for common query patterns.
        </p>

        <h3>Time Series Database Patterns</h3>
        <p>
          Time series databases (InfluxDB, TimescaleDB) excel at metrics and events. Common
          patterns: <strong>Measurement + tags + fields</strong> data model (measurement = metric
          name, tags = indexed metadata, fields = values). <strong>Downsampling</strong> for
          long-term storage (raw → 1-minute → 1-hour aggregates). <strong>Retention policies</strong>
          for automatic expiration (raw 7 days, aggregates 1 year). <strong>Continuous queries</strong>
          for automatic aggregation.
        </p>

        <p>
          Avoid high cardinality (many unique tag combinations). Don't use unique IDs as tags
          (user_id, session_id)—use fields instead. Monitor series count and alert when exceeding
          thresholds.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/nosql-tradeoffs-summary.svg`}
          caption="Figure 3: NoSQL Trade-offs Summary comparison matrix. Key-Value: best for simple lookups/caching/sessions, strengths are microsecond latency and simple API, limitations are no queries and no relationships (Redis, DynamoDB). Document: best for hierarchical data/flexible schema, strengths are schema flexibility and single-query reads, limitations are no joins and denormalization required (MongoDB, Cosmos). Graph: best for relationship queries/deep traversals, strengths are O(1) per hop and pattern matching, limitations are hard to shard and not for aggregations (Neo4j, Neptune). Column-Family: best for write-heavy/wide rows/sparse data, strengths are high write throughput and horizontal scaling, limitations are complex queries difficult and schema design critical (Cassandra, HBase). Time Series: best for time-ordered data/metrics/IoT, strengths are time aggregations and downsampling/retention, limitations are time-focused only and high cardinality issues (InfluxDB, Timescale). Relational: best for complex queries/ACID transactions, strengths are ACID guarantees and complex joins, limitations are joins get slow at scale and schema rigid (PostgreSQL, MySQL). Polyglot persistence: use multiple databases for different workloads (Key-Value for sessions/cache, Document for user profiles, Relational for transactions, Time Series for metrics). Final guidance: start with query patterns, embrace trade-offs, consider polyglot persistence—there is no best database, only the best database for your specific use case."
          alt="NoSQL trade-offs summary"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Selecting the Right Database</h2>

        <p>
          NoSQL databases occupy different niches. Understanding the trade-offs helps you select
          the right database for your access patterns. There is no universally best database—only
          the best database for your specific use case.
        </p>

        <h3>Key-Value Stores</h3>
        <p>
          <strong>Best for:</strong> Simple key-based lookups, caching, sessions, feature flags,
          rate limiting. <strong>Strengths:</strong> Microsecond latency, simple API, horizontal
          scaling. <strong>Limitations:</strong> No complex queries, no relationships, data model
          constrained by key design. <strong>Examples:</strong> Redis, DynamoDB, Memcached.
        </p>

        <h3>Document Databases</h3>
        <p>
          <strong>Best for:</strong> Hierarchical data, flexible schemas, content management,
          user profiles, product catalogs. <strong>Strengths:</strong> Schema flexibility,
          single-query reads, horizontal scaling. <strong>Limitations:</strong> No joins,
          denormalization required, complex queries difficult. <strong>Examples:</strong>
          MongoDB, Cosmos DB, Couchbase.
        </p>

        <h3>Graph Databases</h3>
        <p>
          <strong>Best for:</strong> Relationship-heavy data, deep traversals (3+ hops), pattern
          matching, social networks, fraud detection, recommendations. <strong>Strengths:</strong>
          O(1) per hop traversal, pattern matching queries, relationship-first modeling.
          <strong>Limitations:</strong> Hard to shard, not for aggregations, specialized use case.
          <strong>Examples:</strong> Neo4j, Amazon Neptune, JanusGraph.
        </p>

        <h3>Column-Family Stores</h3>
        <p>
          <strong>Best for:</strong> Write-heavy workloads, wide rows, sparse data, time-series
          data, messaging, event logs. <strong>Strengths:</strong> High write throughput,
          horizontal scaling, flexible column structure. <strong>Limitations:</strong> Complex
          queries difficult, schema design critical, no ACID transactions. <strong>Examples:</strong>
          Cassandra, HBase, ScyllaDB.
        </p>

        <h3>Time Series Databases</h3>
        <p>
          <strong>Best for:</strong> Time-ordered data, metrics, IoT sensor data, financial data,
          event tracking. <strong>Strengths:</strong> Time-based aggregations, downsampling,
          retention policies, compression. <strong>Limitations:</strong> Time-focused only, high
          cardinality issues, not for general-purpose queries. <strong>Examples:</strong> InfluxDB,
          TimescaleDB, Prometheus.
        </p>

        <h3>Polyglot Persistence</h3>
        <p>
          Modern applications often use multiple databases—each optimized for specific workloads.
          This is <strong>polyglot persistence</strong>. Example: Key-value store for sessions
          (Redis), document database for user profiles (MongoDB), relational database for
          transactions (PostgreSQL), time series database for metrics (InfluxDB). Each database
          does what it does best.
        </p>

        <p>
          The trade-off: operational complexity. Multiple databases mean multiple systems to
          monitor, backup, and scale. But the benefit: each workload uses the optimal database.
          This is often worth the complexity for large-scale applications.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for NoSQL Data Modeling</h2>

        <p>
          <strong>Start with query patterns.</strong> List all queries your application will run.
          For each query, identify: what data is accessed, what filters are applied, what latency
          is required. Design data models optimized for these queries. Don't start with entities—
          start with queries.
        </p>

        <p>
          <strong>Embrace denormalization.</strong> Accept that data will be duplicated. This is
          a feature, not a bug. Denormalization enables single-query reads, which is the goal.
          Plan for update propagation: when duplicated data changes, how will you update all
          copies? For immutable data (orders, events), this isn't a problem.
        </p>

        <p>
          <strong>Model for access patterns, not entities.</strong> A user entity might need
          multiple data models: one for profile lookups (embedded preferences), one for order
          history (referenced orders), one for activity feed (denormalized activity events).
          This is normal in NoSQL.
        </p>

        <p>
          <strong>Use appropriate consistency models.</strong> Not all data needs strong
          consistency. User profiles can be eventually consistent. Order totals must be strongly
          consistent. Use the weakest consistency that meets requirements—this improves performance
          and availability.
        </p>

        <p>
          <strong>Plan for scale from day one.</strong> Design row keys, partition keys, and
          indexes with scale in mind. Avoid hot spots (concentrated writes on one partition).
          Use hashing or salting to distribute writes. Monitor cardinality and partition sizes.
        </p>

        <p>
          <strong>Test with production-like data.</strong> NoSQL performance depends on data
          distribution and access patterns. Test with realistic data volumes and query patterns.
          What works at 1,000 documents may fail at 1,000,000 documents.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Modeling after relational schemas.</strong> The most common mistake is
          translating relational schemas directly to NoSQL. This loses the benefits of NoSQL
          (single-query reads, horizontal scaling). Solution: Start fresh with query-first
          design. Don't think in tables and joins—think in documents and access patterns.
        </p>

        <p>
          <strong>Unbounded growth.</strong> Embedding unbounded arrays (comments, events) causes
          document size explosions. Solution: Use the bucket pattern (group into fixed-size
          documents), reference in separate collections, or use time-based partitioning.
        </p>

        <p>
          <strong>High cardinality in time series.</strong> Using unique IDs as tags creates one
          series per ID, overwhelming the database. Solution: Use unique IDs as fields (not
          indexed), aggregate before writing, or use lower-cardinality tags.
        </p>

        <p>
          <strong>Ignoring update patterns.</strong> Denormalization requires update propagation.
          If you duplicate data that changes frequently, update cost is high. Solution: Denormalize
          immutable or slowly-changing data. For frequently-changing data, use references instead.
        </p>

        <p>
          <strong>No indexing strategy.</strong> NoSQL databases need indexes too. Without indexes,
          queries scan all data. Solution: Create indexes on filter and sort fields. Monitor index
          usage and remove unused indexes. Understand index overhead on writes.
        </p>

        <p>
          <strong>Choosing NoSQL for wrong reasons.</strong> NoSQL isn't inherently better than
          relational. If you need complex queries, ACID transactions, or ad-hoc reporting,
          relational databases are often better. Solution: Choose based on access patterns, not
          trends.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce (Amazon, Shopify)</h3>
        <p>
          E-commerce platforms use polyglot persistence. Product catalogs use document databases
          (flexible schemas for varying product attributes). Shopping carts use key-value stores
          (fast lookups, TTL expiration). Orders use relational databases (ACID transactions for
          payment and inventory). User activity uses time series databases (clickstream analytics).
          Recommendations use graph databases (users who bought X also bought Y).
        </p>

        <p>
          Data modeling: Product documents embed variants (size, color), categories, and reviews.
          Order documents embed line items (denormalized product names and prices at purchase time).
          User profiles reference order IDs (unbounded collection). This hybrid approach optimizes
          for each query pattern.
        </p>

        <h3>Social Media (Facebook, Twitter)</h3>
        <p>
          Social media platforms use graph databases for social graphs (friend/follower relationships).
          Posts use document databases (nested comments, varying content types). Feeds use
          column-family stores (wide rows, time-ordered, high write throughput). Analytics use
          time series databases (engagement metrics, DAU/MAU).
        </p>

        <p>
          Data modeling: User documents embed profile data and reference posts. Feed documents
          are pre-computed (fan-out on write): each user has a feed document with recent post
          IDs. Graph traversals find friends-of-friends for recommendations. This optimizes for
          feed reads (most common operation).
        </p>

        <h3>IoT Platform (AWS IoT, Azure IoT)</h3>
        <p>
          IoT platforms use time series databases for sensor data (high write throughput,
          time-range queries). Device metadata uses document databases (flexible schemas for
          varying device types). Command/control uses key-value stores (fast lookups, TTL for
          pending commands).
        </p>

        <p>
          Data modeling: Each sensor has a time series (measurement = metric, tags = device_id,
          sensor_type, location). Downsampling reduces storage (raw → 1-minute → 1-hour aggregates).
          Retention policies manage costs (raw 30 days, aggregates 2 years). Device documents
          embed metadata and reference recent readings.
        </p>

        <h3>Financial Trading (Bloomberg, Robinhood)</h3>
        <p>
          Trading platforms use time series databases for market data (stock prices, order book
          updates). Orders use relational databases (ACID transactions for trades). User portfolios
          use document databases (nested holdings, calculated values). Analytics use column-family
          stores (high-volume trade logs).
        </p>

        <p>
          Data modeling: Price data is time series (measurement = stock symbol, tags = exchange,
          currency). Order documents embed execution details (denormalized for audit). Portfolio
          documents embed holdings with current values (computed summaries). This optimizes for
          real-time pricing and audit requirements.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: How does NoSQL data modeling differ from relational modeling? Give a concrete
              example.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Relational modeling starts with entities and relationships,
              normalizes to eliminate redundancy, then queries via joins. NoSQL modeling starts
              with queries, denormalizes for read performance, and uses single-query reads.
              Example: E-commerce order. Relational: separate tables for customers, orders,
              order_items, products—join four tables to display an order. NoSQL: embed order
              items within order document, include product names and prices directly—fetch one
              document. Trade-off: updating product name requires updating all order documents,
              but orders are immutable historical records so this is acceptable. Relational:
              Normalize → Query. NoSQL: Query → Denormalize.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When would you not denormalize? Answer: When data
              changes frequently and is referenced in many places. Example: User email address
              changes often—store once in user document, reference by ID elsewhere. Denormalizing
              would require updating many documents on each change.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: When would you embed vs reference related data? Give examples of each.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Embed when: one-to-few relationship, data always accessed
              together, bounded document size. Example: Order with line items—items are few
              (typically &lt;50), always accessed with order, bounded size. Reference when:
              one-to-many, data accessed independently, unbounded growth. Example: User with
              orders—users can have unlimited orders, orders are accessed independently (order
              history, order status), unbounded growth. Hybrid approach: embed recent orders
              (frequently accessed), reference historical orders (rarely accessed).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if embedded data grows unbounded? Answer: Use the
              bucket pattern—group items into fixed-size documents (comments_0, comments_1, etc.
              with 50 comments each). Or reference in separate collection and fetch via multiple
              queries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: How do you select the right NoSQL database for your use case?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Start with access patterns. Simple key lookups → Key-Value
              Store (Redis, DynamoDB). Time-ordered data with time-range queries → Time Series DB
              (InfluxDB, TimescaleDB). Relationship queries with deep traversals → Graph Database
              (Neo4j, Neptune). Hierarchical data with flexible schema → Document Database
              (MongoDB, Cosmos). Write-heavy with wide rows → Column-Family Store (Cassandra,
              HBase). Complex queries + ACID → Relational Database (PostgreSQL, MySQL). Also
              consider: consistency requirements (strong vs eventual), scalability needs
              (horizontal vs vertical), latency requirements, operational complexity (managed vs
              self-hosted), and ecosystem (tools, integrations).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Can you use multiple databases together? Answer: Yes—
              polyglot persistence is common. Use each database for what it does best: Key-Value
              for sessions/cache, Document for user profiles, Relational for transactions, Time
              Series for metrics. Trade-off: operational complexity of multiple systems.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: Design a social media feed system. How do you model the data?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Use polyglot persistence. Graph database for social graph
              (users, follow relationships—efficient friend-of-friend traversals). Document
              database for posts (nested comments, varying content types—text, images, videos).
              Column-family store for feeds (wide rows, time-ordered, high write throughput).
              Data modeling: User documents embed profile data, reference posts. Feed documents
              are pre-computed (fan-out on write): when user posts, add post ID to all followers'
              feed documents. Feed queries read one document (fast). Graph traversals find
              friends-of-friends for recommendations. This optimizes for feed reads (most common
              operation).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you handle celebrities with millions of followers?
              Answer: Fan-out on write is expensive for celebrities. Use hybrid approach: for
              regular users, fan-out on write. For celebrities, fan-out on read (fetch celebrity
              posts at read time). Or use a separate celebrity feed that users subscribe to.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: What is high cardinality in time series databases? Why is it a problem and how
              do you avoid it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Cardinality is the number of unique series (measurement +
              tag combinations). High cardinality (millions of unique series) causes performance
              issues: index overhead, slow queries, memory pressure. Common causes: unique IDs as
              tags (user_id, session_id—each creates a new series), high-cardinality tags (IP
              addresses, URLs), unbounded tag values (free-form text). Avoid by: using unique IDs
              as fields (not indexed, just stored), using low-cardinality tags (host, region,
              environment—enumerated values), aggregating at ingestion (pre-aggregate high-cardinality
              data before writing), monitoring cardinality (alert when series count exceeds
              thresholds).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Give a real-world example. Answer: Company tagged
              metrics with user_id for per-user tracking. With millions of users, series count
              exploded, causing query failures. Fix: Changed user_id from tag to field (not
              indexed), aggregated to per-minute counts before writing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: What is polyglot persistence? When would you use it and what are the trade-offs?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Polyglot persistence is using multiple databases in one
              application, each optimized for specific workloads. Example: E-commerce platform
              uses Redis for sessions (fast lookups, TTL), MongoDB for product catalogs (flexible
              schemas), PostgreSQL for orders (ACID transactions), InfluxDB for metrics (time
              series). Use when: different workloads have different requirements (transactions
              vs analytics vs caching), no single database excels at all workloads, scale requires
              specialization. Trade-offs: Benefit—each workload uses optimal database. Cost—
              operational complexity (multiple systems to monitor, backup, scale), data consistency
              across databases (eventual consistency), increased development complexity (multiple
              APIs, data models).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you maintain consistency across databases?
              Answer: Use event-driven architecture. When data changes in one database, publish
              an event. Other databases subscribe and update their copies. Accept eventual
              consistency (copies may be temporarily out of sync). Use idempotent consumers to
              handle duplicate events.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O'Reilly, 2017.
            Chapters 2-6.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O'Reilly, 2019. Chapters 13-14.
          </li>
          <li>
            Vaughn Vernon, <em>Implementing Domain-Driven Design</em>, Addison-Wesley, 2013.
          </li>
          <li>
            MongoDB Documentation, "Data Modeling,"
            https://www.mongodb.com/docs/manual/data-modeling/
          </li>
          <li>
            Amazon DynamoDB Documentation, "Best Practices,"
            https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html
          </li>
          <li>
            Neo4j Documentation, "Data Modeling,"
            https://neo4j.com/docs/
          </li>
          <li>
            DataStax, "Cassandra Data Modeling Best Practices,"
            https://www.datastax.com/resources/cassandra-data-modeling-best-practices
          </li>
          <li>
            InfluxDB Documentation, "Schema and Data Organization,"
            https://docs.influxdata.com/
          </li>
          <li>
            Martin Fowler, "Polyglot Persistence,"
            https://martinfowler.com/bliki/PolyglotPersistence.html
          </li>
          <li>
            Greg Young, "CQRS and Event Sourcing,"
            https://www.youtube.com/watch?v=JHGkaShoyNs
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
