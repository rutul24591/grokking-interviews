"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-document-databases-complete",
  title: "Document Databases",
  description:
    "Comprehensive guide to document databases: data modeling, indexing strategies, sharding patterns, and when to use document stores over relational databases.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "document-databases",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "nosql", "document-db"],
  relatedTopics: [
    "data-modeling-in-nosql",
    "database-indexes",
    "database-partitioning",
    "key-value-stores",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Document Databases</h1>
        <p className="lead">
          Document databases store data as JSON-like documents with flexible schemas, optimized for
          hierarchical data and fast iteration. Unlike relational databases that enforce rigid table
          structures, document databases allow each document to have its own structure—fields can
          vary between documents, nested objects represent relationships, and arrays store collections
          inline. This flexibility makes document databases ideal for content management, user
          profiles, product catalogs, and any domain where schema evolves rapidly.
        </p>

        <p>
          Consider an e-commerce product catalog. A book has ISBN, author, and page count. A shirt
          has size, color, and material. A laptop has CPU, RAM, and screen size. In a relational
          database, you'd need separate tables or a sprawling EAV (Entity-Attribute-Value) schema.
          In a document database, each product is a single document with fields relevant to its
          category—no schema migrations, no complex joins, just natural data representation.
        </p>

        <p>
          The rise of document databases (MongoDB, CouchDB, Cosmos DB) reflects a shift in
          application development: rapid iteration, agile methodologies, and polyglot persistence.
          Developers want to store data as they use it in code—nested objects, arrays, varying
          structures—without the impedance mismatch of object-relational mapping. Document databases
          eliminate this friction by storing data in a format that mirrors application objects.
        </p>

        <p>
          This article provides a comprehensive examination of document databases: data modeling
          patterns (embedding vs referencing), indexing strategies, sharding approaches, and
          real-world use cases. We'll explore when document databases excel (hierarchical data,
          read-heavy workloads, schema flexibility) and when they struggle (complex joins,
          multi-document transactions, highly normalized data). By the end, you'll have a clear
          framework for deciding when to use document databases and how to model data effectively.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/document-db-modeling.svg`}
          caption="Figure 1: Document Database Data Modeling showing embedding vs referencing strategies. Embedding (left): User document with orders nested inline—fast single-query reads but large documents. Referencing (right): Users and Orders in separate collections linked by user_id—smaller documents but requires multiple queries or application-side joins. Decision framework: embed for one-to-few, data accessed together, bounded size; reference for one-to-many, independent access, unbounded growth. Common patterns include bucket pattern (group related items), computed summary (pre-aggregated counts), tree structure (hierarchical data), and polymorphic pattern (varying schemas)."
          alt="Document database embedding vs referencing"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Document Data Modeling</h2>

        <h3>Embedding vs Referencing</h3>
        <p>
          The fundamental design decision in document databases is whether to embed related data
          within a single document or reference it in separate documents. This choice shapes query
          performance, document size, update patterns, and overall system architecture.
        </p>

        <p>
          <strong>Embedding</strong> stores related data inline within a single document. A user
          document might contain an array of order documents, a blog post might embed comments, or
          a product might embed reviews. Embedding enables single-query reads—the entire data
          structure is retrieved in one operation. This is ideal for one-to-few relationships where
          the embedded data is always accessed with the parent and has bounded growth.
        </p>

        <p>
          However, embedding has limits. MongoDB has a 16MB document size limit; exceeding this
          causes write failures. Unbounded arrays (e.g., embedding years of event logs) will
          eventually hit this limit. Updates to embedded data require rewriting the entire document,
          which can cause write amplification and contention. If embedded data is accessed
          independently (e.g., querying orders without user data), embedding forces inefficient
          full-document scans.
        </p>

        <p>
          <strong>Referencing</strong> stores related data in separate documents and links them via
          IDs (similar to foreign keys). A user document references order IDs, and orders are stored
          in a separate collection. Referencing keeps documents small, allows independent access
          patterns, and supports unbounded growth (a user can have unlimited orders). However,
          retrieving related data requires multiple queries or application-side joins, adding
          latency and complexity.
        </p>

        <p>
          The decision framework is straightforward: <strong>embed when</strong> you have a
          one-to-few relationship, data is always accessed together, and document size is bounded.
          <strong>Reference when</strong> you have one-to-many or many-to-many relationships, data
          is accessed independently, or growth is unbounded. Many systems use a hybrid approach:
          embed recent orders (frequently accessed) and reference historical orders (rarely accessed).
        </p>

        <h3>Schema Flexibility</h3>
        <p>
          Document databases are schema-flexible, not schema-free. Each document can have different
          fields, but your application still needs conventions for data structure. Schema flexibility
          enables rapid iteration—add a field by writing it, no migration required. But without
          discipline, you'll end up with inconsistent data: some documents have <code className="inline-code">email</code>, others have <code className="inline-code">emailAddress</code>, and queries miss data.
        </p>

        <p>
          Best practice: use schema validation at the database level (MongoDB supports JSON Schema
          validation) or application-level validation (Mongoose schemas, custom validators). This
          provides guardrails without rigidity—new fields are allowed, but required fields and data
          types are enforced. Document your schema conventions and enforce them in code reviews.
        </p>

        <h3>Indexes and Query Patterns</h3>
        <p>
          Document databases support various index types to optimize queries. Single-field indexes
          speed up exact match and range queries on one field. Compound indexes cover multiple
          fields and can satisfy complex queries with filters and sorts. Multikey indexes handle
          array fields, creating index entries for each array element. Geospatial indexes enable
          location-based queries (find restaurants within 5 miles). Text indexes support full-text
          search with stemming and relevance scoring.
        </p>

        <p>
          Index selection follows the query pattern. For a query filtering by customer_id and status,
          then sorting by created_at, create a compound index in that order: customer_id first,
          status second, created_at third. The index satisfies equality filters first, then handles
          the sort. Use explain() to verify index usage and identify slow queries.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/document-db-indexing.svg`}
          caption="Figure 2: Document Database Indexing Strategies showing single-field, compound, and multikey indexes. Single-field index: B-tree on one field (email) for exact match and range queries. Compound index: multiple fields (customer_id, order_date) with field order following prefix rule—equality fields first, sort fields last. Multikey index: array field (tags) creates entries for each element. Index selection example shows optimal index for a query with filters and sort: equality fields first, then sort field in matching order. Best practices: analyze query patterns before creating indexes, use explain() to verify usage, monitor index size, remove unused indexes."
          alt="Document database indexing strategies"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Sharding &amp; Scaling</h2>

        <h3>Shard Key Selection</h3>
        <p>
          Sharding distributes data across multiple nodes to scale storage and throughput. The shard
          key determines how data is partitioned—choosing poorly leads to hot spots (one node
          overloaded) and inefficient queries. Good shard keys have high cardinality (many unique
          values), even distribution (no hot spots), and align with query patterns (most queries
          include the shard key).
        </p>

        <p>
          <strong>Bad shard keys</strong> include low-cardinality fields (status, type—few unique
          values cause uneven distribution), monotonically increasing fields (timestamp—new data
          always goes to the same shard), and rarely queried fields (if queries don't include the
          shard key, all shards must be scanned).
        </p>

        <p>
          <strong>Good shard keys</strong> include user_id (high cardinality, even distribution,
          frequently queried), region code (natural isolation, aligns with geo-queries), and hashed
          values (hash any field for even distribution, but loses range query efficiency).
        </p>

        <h3>Sharding Strategies</h3>
        <p>
          <strong>Range-based sharding</strong> partitions data by value ranges: shard A holds
          users A-G, shard B holds H-M. This enables efficient range queries (get all users) but
          risks uneven distribution (more users start with "M" than "X").
        </p>

        <p>
          <strong>Hash-based sharding</strong> computes <code className="inline-code">shard = hash(key) % N</code> to distribute data evenly. This eliminates hot spots but makes range queries inefficient (must scan all shards).
        </p>

        <p>
          <strong>Tag-based sharding</strong> groups data by natural categories: shard by tenant
          (multi-tenant SaaS), by region (geo-distributed apps), or by product line. This provides
          natural isolation but can imbalance if tags have skewed distribution.
        </p>

        <p>
          <strong>Geo-based sharding</strong> stores data near users: US users in US shards, EU
          users in EU shards. This reduces latency and satisfies data residency requirements but
          complicates cross-region queries.
        </p>

        <h3>Scaling Approaches</h3>
        <p>
          <strong>Horizontal scaling (sharding)</strong> adds more nodes to distribute load. This
          is the primary scaling mechanism for document databases, enabling linear throughput
          growth. The trade-off is operational complexity: managing shards, handling rebalancing,
          and routing queries correctly.
        </p>

        <p>
          <strong>Vertical scaling</strong> increases node resources (CPU, RAM, storage). This is
          simpler but has limits—eventually you hit hardware ceilings. Use vertical scaling for
          small-medium datasets, then transition to horizontal scaling.
        </p>

        <p>
          <strong>Read replicas</strong> replicate data to multiple nodes for read scaling. Writes
          go to the primary, reads are distributed across replicas. This is ideal for read-heavy
          workloads (content feeds, analytics) but doesn't help write throughput.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/document-db-sharding.svg`}
          caption="Figure 3: Document Database Sharding & Scaling showing shard key selection criteria and sharding strategies. Good shard keys: high cardinality, even distribution, aligned with queries. Bad shard keys: low cardinality, monotonic, rarely queried. Sharding strategies: range-based (A-G, H-M shards), hash-based (even distribution), tag-based (by tenant/region), geo-based (low latency). Scaling approaches: horizontal (add shards), vertical (increase resources), read replicas (distribute reads). Rebalancing considerations: plan for data migration, use consistent hashing, monitor shard size."
          alt="Document database sharding strategies"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Document DB vs Relational</h2>

        <p>
          Document databases and relational databases represent different design philosophies.
          Relational databases prioritize data integrity through schema enforcement, normalization,
          and ACID transactions. Document databases prioritize flexibility and performance through
          schema-less design, denormalization, and eventual consistency. Neither is universally
          better—the right choice depends on your requirements.
        </p>

        <h3>When Document Databases Excel</h3>
        <p>
          <strong>Schema flexibility</strong> is the primary advantage. Adding fields requires no
          migrations—just write the new field. This enables rapid iteration during development and
          accommodates evolving requirements. Content management systems, user profiles, and product
          catalogs benefit from this flexibility.
        </p>

        <p>
          <strong>Hierarchical data</strong> maps naturally to documents. A blog post with comments,
          tags, and metadata is a single document—not five joined tables. This simplifies queries
          and improves read performance (single query vs multiple joins).
        </p>

        <p>
          <strong>Read-heavy workloads</strong> benefit from embedding. If you frequently read
          entire data structures (user profile with preferences, order with line items), embedding
          eliminates joins and reduces latency. Write performance is also strong for document-local
          operations.
        </p>

        <p>
          <strong>Horizontal scaling</strong> is built-in. Document databases shard naturally by
          document ID or custom keys, enabling linear throughput growth. Relational databases can
          shard but require more effort (application-level routing, cross-shard join handling).
        </p>

        <h3>When Document Databases Struggle</h3>
        <p>
          <strong>Complex joins</strong> are inefficient. Document databases don't support SQL-style
          joins across collections. You must denormalize (duplicate data) or handle joins in
          application code (multiple queries). If your data is highly relational (many-to-many
          relationships, frequent cross-entity queries), a relational database is more appropriate.
        </p>

        <p>
          <strong>Multi-document transactions</strong> are limited. While MongoDB supports ACID
          transactions across documents, they have performance overhead and scalability limits. If
          your workload requires frequent cross-document atomicity (financial transfers, inventory
          updates), a relational database provides better guarantees.
        </p>

        <p>
          <strong>Highly normalized data</strong> doesn't fit the document model. If your data is
          naturally flat with many relationships (ERP systems, accounting software), forcing it
          into documents adds complexity without benefit.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/document-db-use-cases.svg`}
          caption="Figure 4: Document Databases Use Cases & Trade-offs showing ideal use cases (content management, user profiles, product catalogs) and anti-patterns (highly transactional data, complex joins, unbounded growth). Comparison with relational DB: document DB offers schema flexibility, hierarchical data, fast reads, horizontal scaling; relational DB offers schema enforcement, complex joins, ACID transactions, vertical scaling. Decision checklist: schema flexibility needed? Hierarchical data? Read-heavy? Horizontal scale required? If YES to most → Document DB; if NO → Consider Relational."
          alt="Document database use cases and trade-offs"
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Document Databases</h2>

        <p>
          <strong>Model for your queries.</strong> Don't model data based on entities—model based
          on how you'll query it. If you frequently query orders by customer and date, structure
          documents and indexes to support that. Denormalize strategically to avoid joins.
        </p>

        <p>
          <strong>Keep documents bounded.</strong> Avoid unbounded arrays (event logs, audit
          trails) that grow indefinitely. Use the bucket pattern: group related items into
          fixed-size buckets (e.g., 100 events per document), creating new buckets as needed.
          This prevents document size explosions.
        </p>

        <p>
          <strong>Use schema validation.</strong> Even in schema-flexible databases, enforce
          guardrails. Use database-level validation (MongoDB JSON Schema) or application-level
          validation (Mongoose). Document required fields, data types, and allowed values. This
          prevents data quality issues from schema drift.
        </p>

        <p>
          <strong>Index strategically.</strong> Don't index every field—indexes have write overhead
          and storage cost. Analyze query patterns, create compound indexes that cover common
          queries, and monitor index usage. Remove unused indexes to reduce write amplification.
        </p>

        <p>
          <strong>Plan for sharding early.</strong> Even if you start with a single node, design
          your shard key from day one. Changing shard keys later requires data migration. Choose
          a key with high cardinality, even distribution, and alignment with query patterns.
        </p>

        <p>
          <strong>Monitor document growth.</strong> Track average document size, collection sizes,
          and shard distribution. Alert on documents approaching size limits. Monitor query
          performance and index efficiency. Proactive monitoring prevents surprises at scale.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Unbounded arrays.</strong> Embedding an unbounded array (e.g., all user activity
          events) will eventually hit document size limits. Solution: use the bucket pattern (group
          events into fixed-size documents), reference events in a separate collection, or use a
          time-series database for event data.
        </p>

        <p>
          <strong>Over-embedding.</strong> Embedding too much data causes large documents, slow
          writes, and wasted I/O (fetching data you don't need). Solution: reference rarely
          accessed data, embed only frequently accessed subsets, and use projection queries to
          fetch specific fields.
        </p>

        <p>
          <strong>Ignoring index coverage.</strong> Queries that don't use indexes scan entire
          collections, causing latency spikes at scale. Solution: use <code className="inline-code">explain()</code> to verify index usage, create compound indexes that cover query patterns, and monitor slow query logs.
        </p>

        <p>
          <strong>Poor shard key choice.</strong> Choosing a low-cardinality shard key (status,
          type) causes hot spots—one shard handles most traffic. Solution: analyze query patterns,
          choose high-cardinality keys (user_id, hashed values), and monitor shard distribution.
        </p>

        <p>
          <strong>Treating it like a relational database.</strong> Trying to force relational
          patterns (many-to-many relationships, complex joins) into document databases leads to
          inefficient designs. Solution: embrace denormalization, embed related data, and accept
          that some queries require application-side logic.
        </p>

        <p>
          <strong>No backup strategy.</strong> Document databases need backups like any other
          database. Solution: use built-in backup tools (mongodump, managed service snapshots),
          test restore procedures, and maintain point-in-time recovery capabilities.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Content Management (Medium, WordPress)</h3>
        <p>
          Content management systems store articles, blog posts, and pages with varying structures.
          A blog post has title, body, author, tags, and comments. A video post has title,
          description, video URL, and transcripts. A poll has question, options, and votes. Document
          databases handle this polymorphism naturally—each content type is a document with relevant
          fields, no schema migrations needed.
        </p>

        <p>
          Medium uses MongoDB to store millions of articles with embedded comments, responses, and
          metadata. The flexible schema allows new content types (newsletters, podcasts) without
          database changes. Read performance is excellent—entire articles with comments load in
          single queries.
        </p>

        <h3>User Profiles (LinkedIn, Adobe)</h3>
        <p>
          User profiles have varying attributes: some users have premium features, some have
          connected social accounts, some have custom preferences. Document databases store each
          profile as a single document with nested preferences, settings, and activity history.
        </p>

        <p>
          LinkedIn uses document databases for member profiles, embedding skills, endorsements, and
          connections. The hierarchical structure maps naturally to JSON documents. Profile updates
          are document-local (no cross-table transactions), and profile reads are single-query
          operations.
        </p>

        <h3>Product Catalogs (Shopify, Wayfair)</h3>
        <p>
          E-commerce product catalogs have extreme variety: books have ISBN and author, clothing
          has size and color, electronics have specs and warranties. Document databases store each
          product as a document with category-specific fields. faceted search uses indexed fields
          for filtering.
        </p>

        <p>
          Shopify uses document databases for product data, embedding variants, images, and
          inventory counts. The flexible schema supports merchants adding custom fields without
          schema migrations. Product pages load quickly—entire product data in single queries.
        </p>

        <h3>IoT and Time-Series (MongoDB for IoT)</h3>
        <p>
          IoT applications ingest sensor data with varying structures: temperature sensors report
          degrees, motion sensors report events, GPS sensors report coordinates. Document databases
          store each reading as a document with sensor-specific fields. Time-based queries use
          indexed timestamps.
        </p>

        <p>
          Note: For high-volume time-series data, consider specialized time-series databases
          (InfluxDB, TimescaleDB) or use MongoDB's time-series collections (optimized for
          timestamped data).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you choose embedding over referencing in a document database? Give a
              concrete example.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Choose embedding when you have a one-to-few relationship,
              data is always accessed together, and document size is bounded. Example: A blog post
              with comments. Comments are tightly coupled to the post (always fetched together),
              there are typically fewer than 100 comments per post (bounded), and embedding enables
              single-query reads of the entire post with comments. Choose referencing for one-to-many
              relationships where the "many" side is unbounded or accessed independently. Example:
              User orders—reference orders in a separate collection because a user can have unlimited
              orders, and you might query orders independently (order history, order status).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if embedded comments grow too large? Answer: Use the
              bucket pattern—group comments into buckets of 50, store recent comments embedded,
              reference older comments in a separate collection. Or paginate: embed only first 10
              comments, load more via separate query.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: How do you design a shard key for a document database? What makes a good vs bad
              shard key?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Good shard keys have three properties: (1) High cardinality—
              many unique values to distribute data evenly. (2) Even distribution—no hot spots where
              one shard gets disproportionate traffic. (3) Aligned with query patterns—most queries
              include the shard key to avoid scatter-gather. Good examples: user_id (high cardinality,
              frequently queried), hashed values (even distribution). Bad examples: status (low
              cardinality—few statuses), timestamp (monotonically increasing—new data always goes to
              same shard), rarely queried fields (forces all-shard scans).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you handle shard key changes? Answer: You generally
              can't change shard keys for existing documents. Plan shard key selection carefully
              upfront. If you must change, migrate data to a new collection with the new shard key,
              then swap collections during maintenance window.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: Your document database queries are getting slower as data grows. How do you
              diagnose and fix this?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> First, use <code className="inline-code">explain()</code> to
              check if queries are using indexes. If not, create appropriate indexes (single-field
              for simple queries, compound for multi-field filters with sort). Check for collection
              scans (COLLSCAN in explain output)—these indicate missing indexes. Monitor slow query
              logs to identify problematic queries. Check shard distribution—if one shard is
              overloaded, reconsider shard key. Verify document sizes aren't growing unbounded
              (causing I/O overhead). Fix: add missing indexes, optimize queries, rebalance shards,
              archive old data, or add read replicas for read-heavy workloads.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you verify an index is being used? Answer: Run
              <code className="inline-code">db.collection.find(query).explain("executionStats")</code>
              and check <code className="inline-code">inputStage.indexName</code>—if it shows the
              index name, it's being used. Also check <code className="inline-code">executionStats.totalDocsExamined</code>—should be close to <code className="inline-code">nReturned</code> for efficient indexes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: Compare document databases with relational databases. When would you choose one
              over the other?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Document databases excel at schema flexibility (rapid
              iteration, evolving requirements), hierarchical data (nested objects, one-to-few
              relationships), read-heavy workloads (embedded data enables single-query reads), and
              horizontal scaling (built-in sharding). Relational databases excel at complex joins
              (many-to-many relationships, normalized data), ACID transactions (multi-row atomicity),
              and data integrity (foreign keys, constraints). Choose document DB for: content
              management, user profiles, product catalogs, rapid prototyping. Choose relational DB
              for: financial systems, inventory management, highly normalized data, complex reporting.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Can you use both? Answer: Yes—polyglot persistence is
              common. Use document DB for user profiles and content, relational DB for transactions
              and reporting. Sync data between them via events or CDC (Change Data Capture).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: Design a product catalog for an e-commerce site. How do you model products with
              varying attributes (books have ISBN, shirts have size/color)?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Use a document database with polymorphic documents. Each
              product is a document with common fields (name, price, description, category) and
              category-specific fields. Books have ISBN, author, pages. Shirts have size, color,
              material. Use a <code className="inline-code">category</code> field to distinguish
              types. Create indexes on common query fields (category, price, brand). For faceted
              search, index category-specific fields and use aggregation pipelines. Embed product
              variants (size/color combinations) within the product document for fast reads.
              Reference reviews in a separate collection (unbounded, queried independently).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you handle filtering across different product
              types? Answer: Use sparse indexes (index only documents with specific fields), or
              store normalized filter attributes in a common attributes array (e.g., name="size",
              value="M" pairs) and query that array.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: What is the bucket pattern? When would you use it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> The bucket pattern groups related items into fixed-size
              documents to avoid unbounded growth. Instead of embedding unlimited items (e.g., all
              user activity events) in one document, create "buckets" of N items each. Example:
              Store user events in documents with <code className="inline-code">user_id</code>, <code className="inline-code">bucket_id</code> (0, 1, 2...), and <code className="inline-code">events</code> array (max 100 events). Query recent events from bucket 0, older events from higher bucket IDs. Use when: embedding unbounded arrays (events, logs, comments), document size could exceed limits, need to paginate large collections. Benefits: bounded document size, efficient pagination, natural archival (archive old buckets).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you handle bucket overflow? Answer: When a bucket
              reaches capacity, create a new bucket (increment bucket_id). For time-series data,
              use time-based buckets (one document per hour/day). For event streams, use
              sequence-based buckets (events 1-100, 101-200, etc.).
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.mongodb.com/docs/manual/data-modeling/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MongoDB Documentation — Data Modeling
            </a>
          </li>
          <li>
            <a
              href="https://www.couchbase.com/resources/why-couchbase/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Couchbase Documentation — Why Couchbase
            </a>
          </li>
          <li>
            <a
              href="https://firebase.google.com/docs/firestore"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firebase Firestore Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.mongodb.com/developer/products/mongodb/schema-design-best-practices/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MongoDB — Schema Design Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MongoDB — Sharding Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
