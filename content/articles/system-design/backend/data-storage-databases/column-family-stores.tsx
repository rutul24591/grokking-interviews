"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-column-family-stores-complete",
  title: "Column-Family Stores",
  description:
    "Comprehensive guide to column-family stores: wide row data model, SSTable architecture, compaction strategies, and when to use column-family databases like Cassandra and HBase.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "column-family-stores",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "nosql", "column-family", "cassandra"],
  relatedTopics: [
    "time-series-databases",
    "document-databases",
    "database-partitioning",
    "data-modeling-in-nosql",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Column-Family Stores</h1>
        <p className="lead">
          Column-family stores are NoSQL databases optimized for write-heavy workloads with sparse,
          wide-row data. Unlike relational databases that store all columns of a row together,
          column-family stores group data by column families—each family stored separately on disk.
          This design enables efficient writes (sequential I/O), flexible schemas (columns vary per
          row), and targeted reads (fetch only needed column families). For time-series data, event
          logs, and messaging systems, column-family stores outperform relational databases by
          orders of magnitude.
        </p>

        <p>
          Consider an IoT sensor network. Each sensor reports temperature, humidity, pressure, and
          battery level every minute. In a relational database, every reading inserts a row with
          all columns—even if some sensors don't report all metrics. In a column-family store,
          each metric is a separate column, rows can have varying columns, and writes are appended
          sequentially. Querying "temperature readings for sensor 123 last hour" reads only the
          temperature column family, not unrelated columns.
        </p>

        <p>
          Column-family stores (Cassandra, HBase, ScyllaDB) power massive-scale systems: Facebook
          Messenger (inbox storage), Netflix (viewing history), Apple (iMessage), and Craigslist
          (listings). These workloads share characteristics: high write throughput, time-ordered
          data, sparse columns, and range queries by row key. Column-family stores excel at these
          patterns while relational databases struggle.
        </p>

        <p>
          This article provides a comprehensive examination of column-family stores: the wide-row
          data model, SSTable architecture, compaction strategies, and real-world use cases. We'll
          explore when column-family stores excel (write-heavy, time-series, sparse data) and when
          they struggle (complex queries, transactions, random access). By the end, you'll have a
          clear framework for deciding when to use column-family stores and how to model data
          effectively.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/column-family-data-model.svg`}
          caption="Figure 1: Column-Family Data Model showing wide row structure. Row keys (user:123, user:456) are sorted identifiers. Column families (profile, posts, comments) group related columns. Each column contains: column name (key), value, timestamp, and optional TTL. Unlike relational tables with fixed schema, column-family stores allow flexible schema per row—different rows can have different columns. Comparison: relational tables have fixed schema with all columns stored together; column-family stores have flexible schema with column families stored separately. Key characteristics: wide rows, column families, sparse data, write-optimized, sorted by row key."
          alt="Column-family database data model"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Wide Rows &amp; Column Families</h2>

        <h3>The Wide Row Data Model</h3>
        <p>
          Column-family stores organize data as a map of maps: <code className="inline-code">Map&lt;RowKey, Map&lt;ColumnFamily, Map&lt;ColumnKey, Value&gt;&gt;&gt;</code>.
          Row keys are sorted (lexicographically or by custom comparator), enabling efficient range
          queries. Column families group related columns—each family stored separately on disk.
          Columns within a family are key-value pairs with timestamps (for conflict resolution) and
          optional TTL (time-to-live for automatic expiration).
        </p>

        <p>
          This model enables <strong>sparse data</strong>: rows can have different columns without
          wasting storage. A user profile might have 50 possible columns, but each user only has
          10-20 populated. In a relational database, NULL values still consume space. In a
          column-family store, missing columns simply don't exist—no storage cost.
        </p>

        <p>
          <strong>Wide rows</strong> can have millions of columns. A messaging inbox might have one
          row per user with columns for each message (column key = timestamp, value = message data).
          Querying "last 50 messages" is a range scan within the row—efficient because columns are
          sorted. This pattern (one row per entity, columns as time-ordered events) is common in
          column-family stores.
        </p>

        <h3>SSTable Architecture</h3>
        <p>
          Column-family stores use <strong>SSTables (Sorted String Tables)</strong> for persistent
          storage. An SSTable is an immutable file containing sorted key-value pairs. Writes go to
          an in-memory <strong>MemTable</strong> first, then flush to SSTable when full. This
          design converts random writes (slow) into sequential writes (fast)—the key optimization
          for write-heavy workloads.
        </p>

        <p>
          Each SSTable contains: <strong>Data blocks</strong> (sorted key-value pairs),
          <strong>Index blocks</strong> (key to data offset mapping), <strong>Bloom filters</strong>
          (probabilistic membership test to avoid disk reads), and <strong>Summary blocks</strong>
          (metadata and statistics). Bloom filters are critical—they answer "is this key possibly
          in this SSTable?" with no false negatives and few false positives, avoiding unnecessary
          disk reads.
        </p>

        <p>
          Reads check the MemTable first (in-memory, fastest), then use Bloom filters to identify
          which SSTables might contain the key, then read from those SSTables. Multiple versions
          of the same key (from updates) are merged, with the latest timestamp winning. This
          <strong>merge-on-read</strong> approach defers work until query time.
        </p>

        <h3>Compaction</h3>
        <p>
          As writes accumulate, many SSTables accumulate on disk. <strong>Compaction</strong> merges
          SSTables in the background: combining data, removing duplicate keys (keeping latest
          version), and reclaiming space from deleted/expired data. Without compaction, reads would
          need to check hundreds of SSTables, degrading performance.
        </p>

        <p>
          <strong>Size-Tiered Compaction (STCS)</strong> groups SSTables by size and compacts
          similar-sized SSTables together. This minimizes write amplification (data rewritten
          during compaction) but can leave many SSTables, increasing read amplification (number of
          SSTables to check). Best for write-heavy workloads.
        </p>

        <p>
          <strong>Leveled Compaction (LCS)</strong> organizes SSTables into levels (L0, L1, L2...),
          each 10x larger than the previous. SSTables within a level don't overlap (key ranges are
          disjoint). This reduces read amplification (fewer SSTables to check) but increases write
          amplification (more compaction work). Best for read-heavy workloads.
        </p>

        <p>
          <strong>Date-Tiered Compaction (DTCS)</strong> groups SSTables by time window. Recent
          data stays in separate SSTables (frequently accessed), while old data is compacted
          aggressively. This optimizes time-range queries ("last hour" vs "last year") and enables
          automatic data expiration. Best for time-series data.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/column-family-architecture.svg`}
          caption="Figure 2: Column-Family Store Architecture (Cassandra/HBase) showing write and read paths. Write path: Client write → CommitLog (durability) → MemTable (in-memory) → Acknowledge to client → MemTable flushes to SSTable (async). Read path: Check MemTable (in-memory, fastest) → Check Bloom filters (avoid disk reads) → Read from SSTables (if needed) → Merge results (latest timestamp wins). SSTable structure: Data block (sorted key-value pairs), Index block (key to offset), Bloom filter (probabilistic membership), Summary block (metadata). Key characteristics: append-only writes, sequential I/O, bloom filters, merge-on-read."
          alt="Column-family store architecture"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Scaling &amp; Compaction</h2>

        <h3>Write-Optimized Design</h3>
        <p>
          Column-family stores are fundamentally write-optimized. Writes are <strong>append-only</strong>:
          new data is appended to the MemTable, then flushed sequentially to SSTables. There are
          no in-place updates—updates create new versions with newer timestamps. Deletes create
          <strong>tombstones</strong> (markers indicating deleted keys) that are removed during
          compaction.
        </p>

        <p>
          This design has implications: <strong>Write throughput</strong> is high because writes
          are sequential (disk heads don't seek). <strong>Read latency</strong> can be higher than
          random-access databases because reads may check multiple SSTables. <strong>Storage
          overhead</strong> exists because multiple versions of keys coexist until compaction.
          <strong>Delete latency</strong> exists because tombstones persist until compaction.
        </p>

        <h3>Compaction Strategies in Practice</h3>
        <p>
          Choosing the right compaction strategy is critical for performance. <strong>Size-Tiered
          Compaction</strong> is the default in Cassandra for good reason: it minimizes write
          amplification, making it ideal for write-heavy workloads. However, as SSTables accumulate,
          read performance degrades. Monitor the number of SSTables per row—if it exceeds 50,
          consider switching to Leveled Compaction.
        </p>

        <p>
          <strong>Leveled Compaction</strong> is better for read-heavy workloads but comes with
          costs. Write amplification is 10x or higher (each write is rewritten multiple times as
          it moves through levels). This increases disk I/O and can saturate write bandwidth. Use
          LCS when reads significantly outnumber writes (10:1 or higher).
        </p>

        <p>
          <strong>Date-Tiered Compaction</strong> is specialized for time-series data. It keeps
          recent data in separate SSTables (fast access) while compacting old data aggressively.
          Configure time windows based on query patterns: if you frequently query "last hour,"
          use 1-hour windows. DTCS also enables automatic data expiration—set a retention period
          and old data is automatically removed during compaction.
        </p>

        <h3>Handling Tombstones</h3>
        <p>
          Tombstones (delete markers) are a common source of performance issues. When you delete
          a row or column, a tombstone is written. Reads must check tombstones to know if a key
          was deleted. If tombstones accumulate (e.g., deleting large amounts of data), reads
          slow down because they must scan through tombstones.
        </p>

        <p>
          Mitigation strategies: <strong>Run compaction more frequently</strong> to remove
          tombstones. <strong>Avoid large deletes</strong>—delete in batches. <strong>Use TTL</strong>
          instead of explicit deletes where possible (TTL expiration is more efficient).
          <strong>Monitor tombstone density</strong>—alert when tombstones exceed 10% of data.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/column-family-compaction.svg`}
          caption="Figure 3: Compaction Strategies showing what compaction does (merge SSTables, remove duplicates, reclaim space). Size-Tiered Compaction (STCS): groups SSTables by size, compacts similar-sized SSTables, creates larger SSTables over time. Write-optimized (low write amplification) but read-amplification (many SSTables). Leveled Compaction (LCS): organizes SSTables into levels (L0, L1, L2), each level 10x larger, SSTables within level don't overlap. Read-optimized (low read-amplification) but higher write amplification. Date-Tiered Compaction (DTCS): groups SSTables by time window, recent data separate, old data compacted aggressively. Time-series optimized with efficient time-range queries and automatic data expiration. Choosing strategy: STCS for write-heavy, LCS for read-heavy, DTCS for time-series."
          alt="Compaction strategies comparison"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Column-Family vs Other Stores</h2>

        <p>
          Column-family stores occupy a specific niche: write-heavy workloads with sparse,
          time-ordered data. Understanding the trade-offs helps you choose the right tool for
          each workload.
        </p>

        <h3>Column-Family Strengths</h3>
        <p>
          <strong>Write throughput</strong> is the primary advantage. Sequential writes enable
          hundreds of thousands of writes per second per node. This is essential for high-volume
          ingestion (IoT sensors, clickstreams, logs). Relational databases struggle with
          write-heavy workloads due to random I/O and index updates.
        </p>

        <p>
          <strong>Sparse data</strong> is handled efficiently. Rows can have varying columns
          without wasting storage. This is ideal for entities with many optional attributes
          (user profiles, product catalogs with varying specs). Relational databases waste space
          on NULL values.
        </p>

        <p>
          <strong>Time-series queries</strong> are natural. Store timestamps as column keys, and
          range queries ("last hour of data") are efficient scans within a row. TTL enables
          automatic expiration. This pattern is common in monitoring, metrics, and event logging.
        </p>

        <p>
          <strong>Horizontal scaling</strong> is built-in. Column-family stores partition data
          by row key across nodes. Adding nodes automatically redistributes load. This enables
          linear throughput growth—10 nodes handle 10x the writes of 1 node.
        </p>

        <h3>Column-Family Limitations</h3>
        <p>
          <strong>Complex queries</strong> are inefficient. Filtering by non-key columns requires
          scanning all rows (slow) or maintaining secondary indexes (complex). Aggregations
          (COUNT, SUM, AVG) require scanning data. Use a separate analytics system (Spark,
          Presto) for complex queries.
        </p>

        <p>
          <strong>Transactions</strong> are limited. Column-family stores don't support ACID
          transactions across rows. Some (like Cassandra) support lightweight transactions
          (compare-and-set) but with performance costs. For multi-row atomicity, use a
          relational database.
        </p>

        <p>
          <strong>Random access</strong> is slower than key-value stores. Reads may check multiple
          SSTables, and merge-on-read adds overhead. For simple key-value lookups, Redis or
          DynamoDB are faster.
        </p>

        <p>
          <strong>Schema design is critical</strong> and hard to change. Your row key and column
          family design determines query patterns. Changing the schema later requires data
          migration. Plan carefully upfront.
        </p>

        <h3>When to Use Column-Family Stores</h3>
        <p>
          Use column-family stores for: <strong>Time-series data</strong> (metrics, sensor data,
          stock prices), <strong>Event logs</strong> (clickstreams, audit logs, application logs),
          <strong>Messaging</strong> (inboxes, activity feeds, chat history), <strong>High-write
          workloads</strong> (write-heavy applications, sequential write patterns).
        </p>

        <p>
          Avoid column-family stores for: <strong>Complex queries</strong> (multi-field filtering,
          aggregations), <strong>Transactional workloads</strong> (ACID transactions, multi-row
          atomicity), <strong>Random access</strong> (unpredictable query patterns),
          <strong>Frequent schema changes</strong> (schema design is critical and hard to change).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/column-family-use-cases.svg`}
          caption="Figure 4: Column-Family Stores Use Cases & Trade-offs. Ideal use cases: Time-Series Data (metrics, monitoring, IoT sensors, stock prices), Event Logs (clickstream, audit logs, application logs), Messaging (inboxes, activity feeds, chat history), High-Write Workloads (write-heavy applications, sequential writes). Anti-patterns to avoid: Complex Queries (multi-field filtering, aggregations, joins), Transactional Workloads (ACID transactions, multi-row atomicity, strong consistency), Random Access (unpredictable patterns, no clear access pattern). Comparison: Column-Family (write-optimized, wide rows) vs Document DB (flexible schema, nested data) vs Relational DB (ACID, complex queries) vs Time-Series DB (specialized for time data). Decision checklist: write-heavy, time-series data, sequential access, sparse columns."
          alt="Column-family store use cases and trade-offs"
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Column-Family Stores</h2>

        <p>
          <strong>Design row keys carefully.</strong> Row keys determine data distribution and
          query patterns. Use prefixes for grouping (user:123, user:456) to enable range queries.
          Avoid hot spots (row keys that concentrate writes on one node). Use hashing or salting
          if needed to distribute writes evenly.
        </p>

        <p>
          <strong>Model for your queries.</strong> Design column families based on how you'll
          query data. If you frequently query "messages for user X," use user ID as row key and
          timestamps as column keys. Don't design for entities—design for access patterns. You
          may need multiple column families for different query patterns (denormalization).
        </p>

        <p>
          <strong>Use TTL for automatic expiration.</strong> Instead of explicit deletes, set TTL
          on columns or column families. This is more efficient (no tombstones) and ensures data
          doesn't accumulate indefinitely. Common for logs, sessions, and temporary data.
        </p>

        <p>
          <strong>Monitor compaction.</strong> Track compaction queue size, compaction rate, and
          SSTable count per row. Alert when compaction falls behind (queue growing) or SSTable
          count exceeds thresholds (50+ for STCS, 10+ for LCS). Compaction issues cause read
          latency spikes.
        </p>

        <p>
          <strong>Batch writes.</strong> Group multiple writes into batches to reduce overhead.
          Batches are atomic within a partition (all succeed or all fail). But don't overuse
          batches—very large batches can cause memory pressure. Keep batches under 1000 writes.
        </p>

        <p>
          <strong>Use appropriate consistency levels.</strong> Column-family stores offer tunable
          consistency. For writes, use QUORUM for durability or ONE for speed. For reads, use
          QUORUM for consistency or ONE for latency. Understand the trade-offs: higher consistency
          means higher latency.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Poor row key design.</strong> Using sequential row keys (timestamps, auto-increment
          IDs) causes hot spots—all writes go to one node. Solution: hash the row key, add salt
          prefixes, or use UUIDs. Monitor write distribution across nodes.
        </p>

        <p>
          <strong>Unbounded row growth.</strong> Wide rows with millions of columns can cause
          performance issues. Reads must scan many columns, and compaction becomes expensive.
          Solution: limit row size (e.g., one row per day, not one row forever), use time-based
          partitioning, or archive old data.
        </p>

        <p>
          <strong>Ignoring tombstones.</strong> Large deletes create many tombstones that slow
          down reads. Solution: delete in batches, use TTL instead of deletes, run compaction
          more frequently, monitor tombstone density.
        </p>

        <p>
          <strong>Wrong compaction strategy.</strong> Using Size-Tiered for read-heavy workloads
          causes read latency spikes. Using Leveled for write-heavy workloads saturates disk I/O.
          Solution: choose based on read/write ratio, monitor performance, be prepared to change
          strategies.
        </p>

        <p>
          <strong>Querying by non-key columns.</strong> Column-family stores don't support
          efficient filtering by non-key columns. Solution: maintain secondary indexes (with
          caveats), use materialized views, or denormalize data into query-optimized column
          families.
        </p>

        <p>
          <strong>No backup strategy.</strong> Column-family stores need backups like any other
          database. Use built-in backup tools (nodetool snapshot for Cassandra), test restore
          procedures, and maintain point-in-time recovery capabilities.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Time-Series Metrics (Netflix, Monitoring Systems)</h3>
        <p>
          Netflix uses Cassandra for time-series metrics: server CPU, memory, latency, error rates.
          Each metric is a row key (server_id:metric_name), timestamps are column keys, values are
          metric values. Querying "CPU usage for server X last hour" is a range scan within a row.
          TTL automatically expires old data (30-day retention).
        </p>

        <p>
          This pattern scales to billions of data points per day. Writes are sequential (fast),
          reads are time-range queries (efficient), and TTL manages storage automatically.
          Relational databases would struggle with the write volume and storage costs.
        </p>

        <h3>Messaging Inboxes (Facebook Messenger, Craigslist)</h3>
        <p>
          Facebook Messenger uses HBase for inbox storage. Each user has a row, messages are
          columns (column key = timestamp, value = message data). Querying "last 50 messages"
          is a range scan within the row. This pattern scales to billions of users and trillions
          of messages.
        </p>

        <p>
          Craigslist uses Cassandra for listing storage. Each category has rows, listings are
          columns. Querying "listings in category X" is a range scan. The wide row model handles
          varying listing attributes (cars have mileage, houses have square footage) without
          schema changes.
        </p>

        <h3>Activity Feeds (Twitter, Instagram)</h3>
        <p>
          Twitter uses Cassandra for activity feeds (tweets, likes, retweets). Each user has a
          row, activities are columns sorted by timestamp. Querying "user's timeline" is a range
          scan. Pre-computed feeds (fan-out on write) are stored in separate column families for
          fast reads.
        </p>

        <p>
          This pattern handles high write throughput (millions of tweets per minute) and fast
          reads (timeline fetch under 100ms). The column-family model enables both: writes are
          sequential, reads are range scans within rows.
        </p>

        <h3>IoT Sensor Data (Industrial Monitoring, Smart Devices)</h3>
        <p>
          Industrial IoT systems use column-family stores for sensor data. Each sensor has a row,
          readings are columns (timestamp → value). Querying "temperature readings for sensor X
          last hour" is efficient. TTL automatically expires old data. Aggregations (hourly
          averages) are computed in batch (Spark) and stored separately.
        </p>

        <p>
          This pattern scales to millions of sensors reporting every second. Writes are
          high-throughput, reads are time-range queries, and storage costs are managed via TTL
          and compaction.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you choose a column-family store over a relational or document
              database? Give a concrete example.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Choose column-family stores for write-heavy workloads with
              sparse, time-ordered data. Example: IoT sensor network reporting metrics every minute.
              In a relational database, every reading inserts a row with all columns—even if some
              sensors don't report all metrics. NULL values waste space. In a column-family store,
              each metric is a separate column, rows have varying columns (no wasted space), and
              writes are appended sequentially (fast). Querying "temperature readings for sensor X
              last hour" is a range scan within a row—efficient. Choose relational for: transactions,
              complex queries. Choose document for: flexible schema, nested data. Choose column-family
              for: write-heavy, time-series, sparse data.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if you need to query by sensor type, not sensor ID?
              Answer: Maintain a secondary index (separate column family mapping sensor_type →
              sensor_ids), or denormalize data into a query-optimized column family. Column-family
              stores don't support efficient filtering by non-key columns.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: Explain how SSTables and compaction work. Why is compaction necessary?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> SSTables (Sorted String Tables) are immutable files containing
              sorted key-value pairs. Writes go to MemTable (in-memory), then flush to SSTable when
              full. This converts random writes to sequential writes (fast). Over time, many SSTables
              accumulate. Compaction merges SSTables in the background: combining data, removing
              duplicate keys (keeping latest version), and reclaiming space from deleted/expired
              data. Without compaction, reads would need to check hundreds of SSTables, degrading
              performance. Compaction strategies: Size-Tiered (write-optimized), Leveled
              (read-optimized), Date-Tiered (time-series optimized).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is write amplification? Answer: Write amplification
              is the ratio of data written to disk vs data written by the application. Compaction
              rewrites data, causing write amplification. Size-Tiered has low write amplification
              (good for write-heavy), Leveled has high write amplification (good for read-heavy).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What are tombstones? How do they impact performance and how do you mitigate them?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Tombstones are delete markers. When you delete a row or
              column, a tombstone is written (not immediate removal). Reads must check tombstones
              to know if a key was deleted. If tombstones accumulate (e.g., deleting large amounts
              of data), reads slow down because they scan through tombstones. Mitigation: (1) Run
              compaction more frequently to remove tombstones. (2) Avoid large deletes—delete in
              batches. (3) Use TTL instead of explicit deletes (TTL expiration is more efficient).
              (4) Monitor tombstone density—alert when tombstones exceed 10% of data.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Why not just delete data immediately? Answer: Because
              other nodes may have older data. Tombstones ensure deletes propagate to all replicas.
              Immediate deletion could cause deleted data to reappear from older replicas.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: Design a messaging inbox system using a column-family store. How do you model
              the data?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Use one row per user. Row key: user_id. Column family:
              inbox. Column keys: timestamps (for sorting). Column values: message data (sender,
              subject, body, read status). Querying "last 50 messages" is a range scan within the
              row (efficient). For sent messages, use a separate column family or table. For
              multi-user queries ("messages between user A and B"), maintain a separate column
              family with composite row keys (userA:userB). Use TTL for automatic expiration of
              old messages. Consider denormalization: store sender name in the message to avoid
              joins.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you handle message deletion? Answer: Use tombstones
              for individual message deletion. For bulk deletion (delete all messages older than X),
              use TTL or drop old SSTables (if time-partitioned). Monitor tombstone density to
              avoid read performance issues.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: Compare Size-Tiered and Leveled compaction. When would you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Size-Tiered Compaction (STCS) groups SSTables by size and
              compacts similar-sized SSTables together. Pros: low write amplification (efficient
              for writes), simple. Cons: can accumulate many SSTables (read amplification). Best
              for: write-heavy workloads (10:1 write:read ratio or higher). Leveled Compaction
              (LCS) organizes SSTables into levels, each 10x larger. Pros: few SSTables per row
              (low read amplification). Cons: high write amplification (10x or more). Best for:
              read-heavy workloads (10:1 read:write ratio or higher). Monitor and adjust based on
              actual read/write patterns.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is Date-Tiered Compaction? Answer: DTCS groups
              SSTables by time window. Recent data stays separate (frequently accessed), old data
              is compacted aggressively. Optimized for time-range queries ("last hour" vs "last
              year") and enables automatic data expiration via TTL. Best for: time-series data,
              metrics, event logs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your column-family store is experiencing slow reads. How do you diagnose and
              fix this?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check SSTable count per row—high count indicates
              compaction lag. (2) Check compaction queue—if growing, compaction can't keep up.
              (3) Check tombstone density—high density slows reads. (4) Check read latency by
              operation type—are range scans slow or point lookups? (5) Check disk I/O—is disk
              saturated? Fix: (1) Increase compaction throughput (more threads, larger heap).
              (2) Switch compaction strategy (STCS to LCS if read-heavy). (3) Run manual compaction
              to clear backlog. (4) Reduce tombstones (run gc_grace_seconds, then nodetool compact).
              (5) Add read replicas to distribute read load. (6) Optimize queries (use proper
              indexes, reduce scan range).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you prevent this in the future? Answer: Monitor
              compaction metrics (queue size, SSTable count, tombstone density). Set up alerts for
              thresholds. Tune compaction strategy based on workload. Plan capacity (disk I/O,
              heap size) for peak load.
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
              href="https://cassandra.apache.org/doc/latest/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Cassandra Documentation
            </a>
          </li>
          <li>
            <a
              href="https://hbase.apache.org/book.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache HBase Documentation
            </a>
          </li>
          <li>
            <a
              href="https://cloud.google.com/bigtable/docs/overview"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Cloud Bigtable Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.datastax.com/blog/cassandra-data-modeling-best-practices"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DataStax — Cassandra Data Modeling Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/watch?v=H2-TOp2YdRc"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google — Bigtable: High-Performance Storage
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
