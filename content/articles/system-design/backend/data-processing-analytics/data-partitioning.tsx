"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-data-partitioning-extensive",
  title: "Data Partitioning",
  description:
    "Partition data for scale and correctness: choose keys, manage skew, and design partitions that support backfills, windowing, and efficient scans.",
  category: "backend",
  subcategory: "data-processing-analytics",
  slug: "data-partitioning",
  wordCount: 5540,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "data", "partitioning", "scaling", "pipelines"],
  relatedTopics: ["apache-kafka", "aggregations", "batch-processing", "stream-processing"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>Data partitioning</strong> is the practice of dividing a dataset into independent subsets —
          partitions — that can be stored, processed, and queried separately. Partitioning is the primary mechanism by
          which data systems achieve horizontal scalability: instead of storing and processing the entire dataset on a
          single machine, the data is distributed across many machines, each handling its assigned partition.
          Partitioning also enables query optimization: when a query&apos;s filter conditions align with the partitioning
          scheme, the query engine can skip entire partitions (partition pruning), reading only the relevant data and
          dramatically reducing I/O cost.
        </p>
        <p>
          The choice of partitioning strategy — the function that assigns each record to a partition — is one of the
          most consequential architectural decisions in a data system. It affects query performance (does the partition
          scheme enable partition pruning for the most common queries?), data distribution (is data evenly spread
          across partitions, or do some partitions become hot spots?), operational cost (how much data does each query
          read?), and system evolution (can partitions be added or removed without rewriting the entire dataset?).
          Getting the partitioning wrong is difficult to fix: repartitioning a large dataset requires reading and
          rewriting every record, which is expensive and disruptive.
        </p>
        <p>
          Partitioning operates at multiple levels in a data platform. At the storage level, files are organized into
          partitioned directory structures (for example, S3 paths like s3://bucket/table/date=2024-01-01/), enabling
          query engines to skip irrelevant directories. At the processing level, records are routed to specific workers
          based on their partition key, enabling parallel processing. At the messaging level (Kafka topics), messages
          are assigned to partitions based on their key, enabling ordered consumption per key and parallel consumption
          across partition groups.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">The Partitioning Decision Framework</h3>
          <p className="mb-3">
            Three questions determine the correct partitioning strategy for any workload. First: what are the most
            common query patterns? If queries typically filter by date, partition by date. If queries typically look up
            records by a specific key, partition by that key. If queries typically scan ranges (for example, all records
            between two timestamps), use range partitioning. The partitioning scheme should align with the query
            patterns to enable partition pruning — the ability to skip irrelevant partitions.
          </p>
          <p className="mb-3">
            Second: what is the expected data distribution? If the data has a natural skew (for example, a small number
            of customers generate most of the traffic), a naive partition-by-key strategy will create hot partitions
            that bottleneck the system. The partitioning scheme should distribute data evenly across partitions, even
            when the underlying key distribution is skewed.
          </p>
          <p>
            Third: how will the data grow over time? A partitioning scheme that works for 1 GB of data may fail at 1 TB
            because individual partitions become too large to process efficiently. The scheme should support adding
            partitions as data grows without requiring a full repartitioning of existing data. This typically means
            choosing a partition key that naturally creates new partitions over time (such as date) or a hash-based
            scheme where the number of partitions can be increased by rehashing.
          </p>
        </div>
        <p>
          The evolution of partitioning strategies in modern data systems reflects a growing understanding of the
          trade-offs involved. Early systems used simple range partitioning (partition by alphabetical ranges of a
          key), which was easy to understand but prone to hot partitions when key distribution was non-uniform.
          Modern systems increasingly use hash partitioning (partition by hash of the key modulo the number of
          partitions), which provides even distribution but does not support range queries efficiently. The most
          sophisticated systems use hierarchical or composite partitioning — partitioning by multiple keys at different
          levels (for example, date at the top level, then hash of the business key within each date) — to support both
          query patterns and even distribution.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Hash partitioning assigns each record to a partition based on the hash of its partition key modulo the
          number of partitions: partition = hash(key) % N. This strategy provides even data distribution regardless of
          the key distribution — even if 90 percent of records have the same key, they will be distributed across all
          partitions (assuming a good hash function). Hash partitioning is the default strategy for most distributed
          processing systems (Spark shuffle, Kafka topic partitioning) because it prevents hot partitions and enables
          parallel processing.
        </p>
        <p>
          The trade-off with hash partitioning is that it does not support range queries. A query for all records
          where the key is between A and M must scan all partitions, because the hash function destroys the natural
          ordering of keys. This makes hash partitioning unsuitable for range-based queries (time-series queries,
          alphabetical range scans) where the query engine benefits from knowing that relevant records are co-located
          in specific partitions.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/data-partitioning-diagram-1.svg"
          alt="Four partitioning strategies compared: hash, range, list, and round-robin with their pros and cons"
          caption="Partitioning strategies: hash provides even distribution but no range support, range enables efficient range queries but risks hot partitions, list provides explicit control but requires manual rebalancing, and round-robin is simple but provides no key locality."
        />
        <p>
          Range partitioning assigns records to partitions based on the value range of the partition key. For example,
          records with keys A-F go to partition 0, G-M to partition 1, N-S to partition 2, and T-Z to partition 3.
          This strategy supports efficient range queries — a query for keys B through K needs to scan only partitions
          0 and 1 — and it preserves the natural ordering of keys within each partition, enabling sorted output
          without a global sort operation.
        </p>
        <p>
          The trade-off with range partitioning is that it is prone to hot partitions when the key distribution is
          non-uniform. If most keys start with the letter S (for example, in a system where customer names are the
          key), partition 2 (N-S) will receive most of the data and become a bottleneck. Range partitioning requires
          careful selection of partition boundaries based on the actual key distribution, and the boundaries may need
          to be adjusted as the distribution changes over time.
        </p>
        <p>
          List partitioning assigns records to partitions based on an explicit mapping from key values to partition
          IDs. For example, all records for the US and CA go to partition 0, EU and UK to partition 1, and APAC to
          partition 2. This strategy is useful when the partition key has a known, finite set of values (such as
          country codes, product categories, or tenant IDs) and when the mapping has operational significance (for
          example, geo-partitioning where each partition is stored in a specific region for compliance or latency
          reasons).
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/data-partitioning-diagram-2.svg"
          alt="Data skew problem showing one partition holding 80% of data, with salting as mitigation to distribute data evenly"
          caption="Data skew: a hot partition containing most of the data bottlenecks processing. Key salting distributes the hot key across multiple partitions, restoring balance."
        />
        <p>
          Round-robin partitioning assigns records to partitions in a cyclic order — record 1 to partition 0, record
          2 to partition 1, record 3 to partition 2, and so on, cycling back to partition 0 after the last partition.
          This strategy provides perfectly even data distribution (each partition receives approximately the same
          number of records) and requires no knowledge of the record&apos;s key. It is useful for bulk data loading and
          for workloads where records are accessed randomly and there is no benefit to co-locating records with the
          same key.
        </p>
        <p>
          The trade-off with round-robin partitioning is that it provides no key locality — records with the same key
          are scattered across all partitions, so any query that needs to find all records for a specific key must
          scan all partitions. This makes round-robin partitioning unsuitable for point lookups, joins, or any query
          that benefits from key co-location.
        </p>
        <p>
          Composite partitioning combines multiple partitioning strategies at different levels. For example, a data
          lake might partition by date at the top level (one directory per day) and then by hash of the customer ID
          within each day (one file per customer hash bucket). This strategy supports both date-range queries (scan
          only the relevant date directories) and customer lookups (within a date directory, jump directly to the
          relevant hash bucket). Composite partitioning is the most flexible strategy but also the most complex to
          implement and maintain.
        </p>
      </section>

      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The partitioning architecture in a data processing pipeline determines how records are routed from the
          ingestion stage through the processing stage to the output stage. At ingestion, records are assigned to
          partitions based on the partitioning strategy — a hash function, a range lookup, a list mapping, or a
          round-robin counter. The partition assignment determines which worker processes the record in the processing
          stage, which storage location holds the record in the output stage, and which partitions must be scanned to
          answer a query.
        </p>
        <p>
          In distributed processing frameworks (Spark, Flink), partitioning determines the shuffle strategy. When a
          transformation requires records with the same key to be processed together (such as group-by or join), the
          framework repartitions the data by the key, routing all records with the same key to the same worker. This
          repartitioning involves a shuffle — reading records from their current partitions, redistributing them by
          the new key, and writing them to the new partitions. The shuffle is the most expensive phase in distributed
          processing because it involves reading, network transfer, and writing for every record.
        </p>
        <p>
          In storage systems (data lakes, databases), partitioning determines the directory or file structure. A
          partitioned table in a data lake is organized as a directory hierarchy where each directory represents a
          partition value (for example, date=2024-01-01/). When a query filters on the partition column (WHERE
          date = &apos;2024-01-01&apos;), the query engine uses partition pruning to skip irrelevant directories, reading only
          the files in the matching directory. The effectiveness of partition pruning depends on the selectivity of
          the filter — a filter that matches one partition out of 365 (daily partitions for a year) reduces I/O by
          99.7 percent, while a filter that matches 300 partitions out of 365 reduces I/O by only 17.8 percent.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/data-partitioning-diagram-3.svg"
          alt="Partition evolution showing initial balanced partitioning, unbalanced growth creating hot partitions, and repartitioning to restore balance"
          caption="Partition evolution: as data grows, initial partitions become unbalanced. Repartitioning redistributes data but requires a full data rewrite, making initial partition count planning critical."
        />
        <p>
          In messaging systems (Kafka), partitioning determines message ordering and consumer parallelism. Messages
          with the same key go to the same partition, preserving their order within that partition. The number of
          partitions determines the maximum consumer parallelism — a topic with 12 partitions can be consumed by up
          to 12 consumers in parallel within a consumer group. Choosing the partition count is a critical capacity
          planning decision: too few partitions limit parallelism, and too many partitions increase broker overhead
          and metadata cost.
        </p>
        <p>
          Partition pruning is the primary performance benefit of partitioning. When a query&apos;s filter conditions
          match the partitioning scheme, the query engine can identify which partitions contain relevant data and skip
          the rest. For example, a query for &quot;sales in January 2024 for customer X&quot; on a table partitioned by date
          and then by customer hash can skip all date directories except January 2024, and within January 2024, can
          skip all customer hash buckets except the one for customer X. The query reads only a tiny fraction of the
          total data, making it fast and cost-efficient.
        </p>
        <p>
          Partition evolution — the process of changing the partitioning scheme as data grows — is one of the most
          expensive operations in a data platform. When the initial partition count becomes insufficient (partitions
          grow too large, or the key distribution changes, creating hot partitions), the data must be repartitioned:
          read every record, reassign it to a new partition based on the new scheme, and write it to the new location.
          For a 1 TB dataset, this means reading and writing 1 TB of data, which can take hours and requires
          significant compute and I/O resources. Partition evolution should be avoided by over-partitioning initially
          (creating more partitions than currently needed) and by choosing a partitioning scheme that scales
          gracefully (such as date partitioning, which naturally creates new partitions over time).
        </p>
      </section>

      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          The number of partitions is a trade-off between parallelism and overhead. More partitions enable more
          parallelism — more workers can process data simultaneously — but also increase overhead: more files to
          manage in storage, more metadata to track in the catalog, more scheduling decisions in the processing
          framework, and more connections to maintain in the messaging system. The recommended starting point for
          batch processing is to size partitions at 128 MB to 1 GB each — large enough to amortize file open/close
          overhead, small enough to enable fine-grained parallelism. For a 1 TB dataset, this means 1,000 to 8,000
          partitions.
        </p>
        <p>
          Hash versus range partitioning is a fundamental trade-off between data distribution and query efficiency.
          Hash partitioning provides even data distribution regardless of key distribution, preventing hot partitions
          and enabling consistent performance. But it does not support range queries — a query for a key range must
          scan all partitions. Range partitioning supports efficient range queries — the query engine can identify the
          specific partitions that contain the relevant key range — but it is prone to hot partitions when the key
          distribution is non-uniform. The choice depends on the query patterns: if range queries are common, use
          range partitioning and mitigate hot partitions with careful boundary selection. If point lookups and
          even distribution are more important, use hash partitioning.
        </p>
        <p>
          Static versus dynamic partitioning is a trade-off between simplicity and adaptability. Static partitioning
          uses a fixed number of partitions that does not change over time. It is simple to implement and reason
          about, but it does not adapt to changes in data volume or key distribution. Dynamic partitioning adjusts
          the number of partitions based on data volume or access patterns — splitting large partitions, merging small
          ones, or rebalancing data across partitions. It is more complex to implement (requiring a partition
          management layer that monitors partition sizes and triggers splits/merges) but it maintains optimal
          performance as the data grows and changes.
        </p>
        <p>
          Single-level versus hierarchical partitioning is a trade-off between simplicity and query flexibility.
          Single-level partitioning (partition by date only) is simple to implement and query but supports only one
          type of partition pruning. Hierarchical partitioning (partition by date, then by customer hash within each
          date) supports multiple types of partition pruning — date-range queries prune at the top level, customer
          lookups prune at the second level — but is more complex to implement and requires the query engine to
          understand the hierarchical structure.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Over-partition initially rather than under-partitioning. It is much easier to merge small partitions than
          to split large ones. When designing the partitioning scheme for a new dataset, estimate the data volume over
          the next 12-18 months and choose a partition count that keeps individual partitions in the 128 MB to 1 GB
          range at the projected volume. If the initial volume is small, the partitions will be small, but small
          partitions are not a performance problem — they just create slightly more metadata overhead. Large partitions,
          on the other hand, are a serious performance problem because they limit parallelism and increase the cost of
          repartitioning.
        </p>
        <p>
          Align the partitioning scheme with the most common query patterns. The primary purpose of partitioning is to
          enable partition pruning — skipping irrelevant data during queries. Identify the most common filter
          conditions in your query workload and choose a partition key that matches those conditions. If most queries
          filter by date, partition by date. If most queries filter by customer ID, partition by customer ID. If
          queries filter by both, use hierarchical partitioning with the more selective filter at the top level.
        </p>
        <p>
          Monitor partition sizes and alert on imbalance. Partition size should be tracked as a time-series metric,
          and alerts should fire when any partition exceeds 2x the average partition size. This detects hot partitions
          early, before they become performance bottlenecks. The alert should trigger an investigation into the root
          cause of the imbalance — a hot key, a skewed key distribution, or a change in query patterns that makes the
          current partitioning scheme suboptimal.
        </p>
        <p>
          Use key salting to mitigate hot partitions. When a single key value dominates the data distribution (for
          example, a large enterprise customer or a popular product), append a random suffix to the key before
          partitioning. This distributes the records for the hot key across multiple partitions, restoring balance.
          The salted key is used only for partitioning — the original key is preserved in the record for queries.
          When querying for the hot key, the query must scan all salted partitions and merge the results, but this is
          still faster than having a single partition that is 10x the size of the others.
        </p>
        <p>
          Use date partitioning for time-series data. For datasets that grow continuously over time (logs, events,
          transactions), partitioning by date (or hour, for very high-volume data) is the most natural scheme. It
          supports efficient time-range queries (scan only the relevant date directories), enables easy data lifecycle
          management (delete old date directories to purge historical data), and naturally creates new partitions over
          time without requiring repartitioning. Within each date partition, a secondary partition by a business key
          (customer ID, product ID) enables efficient point lookups within a date range.
        </p>
        <p>
          Avoid partitioning by high-cardinality keys that create too many small partitions. Partitioning by a key
          with millions of unique values (user ID, session ID, request ID) creates millions of tiny partitions, each
          containing a few records. This increases metadata overhead, slows query planning (the query engine must
          evaluate millions of partition paths), and wastes storage (each partition has a minimum file size due to
          file system block sizes). If a high-cardinality key is needed for queries, use it as a sort key within
          partitions rather than as the partition key itself.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Hot partitions from skewed key distribution creating processing bottlenecks is the most common partitioning
          failure. When one partition receives disproportionately more data than others — because a single key value
          is much more common than others, or because the range boundaries are poorly chosen — that partition becomes
          a bottleneck. All processing must wait for the hot partition to complete, negating the benefits of
          parallelism. The fix is to monitor partition sizes, detect the skew, and apply key salting or repartition
          with a different strategy.
        </p>
        <p>
          Too many small partitions increasing metadata overhead and query planning time is a common over-correction.
          After experiencing hot partitions, teams sometimes over-partition to ensure even distribution, creating
          thousands of tiny partitions that each contain only a few records. The metadata overhead of managing
          thousands of partitions (file listings, catalog entries, scheduling decisions) can exceed the cost of
          processing the data itself, and query planning can take longer than query execution. The fix is to target
          partitions of 128 MB to 1 GB, merging small partitions when they are below this threshold.
        </p>
        <p>
          Partitioning by a key that does not match query patterns, providing no partition pruning benefit, is a
          wasted optimization. If the data is partitioned by customer ID but most queries filter by date, every query
          must scan all partitions (one per customer) because the date filter does not align with the partitioning
          scheme. The partitioning provides no I/O benefit and only adds the overhead of managing many partitions. The
          fix is to identify the most common query patterns and repartition to align with those patterns.
        </p>
        <p>
          Repartitioning without planning causing extended downtime and data inconsistency is an operational failure.
          When a dataset needs to be repartitioned (due to growth, skew, or a change in query patterns), the
          repartitioning process reads and rewrites every record. If this is done without planning — without scheduling
          a maintenance window, without ensuring sufficient compute resources, and without coordinating with downstream
          consumers that depend on the partition structure — it can cause extended downtime and data inconsistency. The
          fix is to plan repartitioning as a formal project: estimate the data volume and compute cost, schedule the
          operation during a low-traffic window, and coordinate with downstream consumers to update their partition
          discovery logic.
        </p>
        <p>
          Partition key drift — the partition key values changing over time — causes data to be written to unexpected
          partitions, making it difficult to find and query. This occurs when the partition key is derived from data
          that can change (for example, partitioning by a customer&apos;s region, and the customer moves to a different
          region). New records for the customer go to the new region&apos;s partition, while old records remain in the old
          region&apos;s partition, splitting the customer&apos;s data across partitions. The fix is to partition by immutable
          or slowly-changing keys (customer ID, date) and to use mutable attributes (region, status) as filter columns
          within partitions rather than as partition keys.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform partitions its order history data lake by date (one directory per day) and then
          by hash of customer ID within each day (128 hash buckets per day). This hierarchical partitioning supports
          two primary query patterns: time-range queries (scan only the relevant date directories for orders in a
          specific period) and customer lookups (within a date range, jump directly to the customer&apos;s hash bucket).
          The platform chose hash partitioning within each date because the customer ID distribution is skewed — a
          small number of enterprise customers generate most of the orders — and hash partitioning distributes these
          orders evenly across buckets. The date partitioning at the top level supports efficient time-range queries
          and easy data lifecycle management (orders older than 7 years are purged by deleting the corresponding date
          directories).
        </p>
        <p>
          A financial services company uses range partitioning for its market data database, partitioning by timestamp
          with one partition per hour. The range partitioning supports efficient time-range queries (scan only the
          relevant hourly partitions for market data in a specific period) and preserves the chronological ordering of
          records within each partition, enabling efficient time-series analysis. The platform monitors partition sizes
          and adjusts the hourly boundaries when the data volume changes — during market open, when volume is 10x
          higher, the partitions are split into 15-minute intervals to prevent any single partition from becoming too
          large. During off-hours, the partitions are merged back to hourly intervals to reduce metadata overhead.
        </p>
        <p>
          A technology company uses list partitioning for its multi-tenant SaaS data warehouse, partitioning by tenant
          ID with one partition per tenant. This provides data isolation between tenants (each tenant&apos;s data is in a
          separate partition), enables tenant-level data lifecycle management (deleting a tenant&apos;s data is as simple
          as dropping their partition), and supports efficient tenant-scoped queries (queries for a specific tenant
          scan only that tenant&apos;s partition). The platform chose list partitioning over hash partitioning because the
          tenant ID has a known, finite set of values, and the mapping has operational significance (compliance
          requirements mandate that each tenant&apos;s data be stored separately).
        </p>
        <p>
          A social media platform uses hash partitioning for its activity feed data, partitioning by hash of user ID
          with 4,096 partitions. The hash partitioning ensures even distribution of activity data across partitions,
          despite the highly skewed user activity distribution (a small number of users generate most of the activity).
          The 4,096 partition count was chosen to support the platform&apos;s maximum consumer parallelism — each of the
          4,096 partitions is processed by a dedicated worker in the activity aggregation pipeline, enabling the
          platform to process billions of activities per day. The hash partitioning does not support range queries, but
          the platform&apos;s queries are primarily point lookups (fetch the activity feed for a specific user), which are
          efficient with hash partitioning because the query engine can compute the partition directly from the user
          ID&apos;s hash.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 1: How do you choose the right partitioning strategy for a new dataset?
          </h3>
          <p className="mb-3">
            The choice starts with analyzing the query workload. Identify the most common filter conditions in your
            queries and choose a partition key that matches those conditions. If most queries filter by date, partition
            by date. If most queries filter by a specific business key, partition by that key. If queries filter by
            multiple keys, use hierarchical partitioning with the most selective filter at the top level.
          </p>
          <p className="mb-3">
            The second factor is data distribution. Analyze the distribution of the candidate partition key to identify
          potential hot partitions. If the key distribution is highly skewed (one value accounts for more than 10
            percent of the data), consider hash partitioning or key salting to distribute the skewed values across
            multiple partitions. If the key distribution is uniform, range partitioning is a viable option that also
            supports range queries.
          </p>
          <p>
            The third factor is growth trajectory. Estimate the data volume over the next 12-18 months and choose a
            partition count that keeps individual partitions in the 128 MB to 1 GB range. Over-partition rather than
            under-partition — it is easier to merge small partitions than to split large ones. Choose a partitioning
            scheme that scales gracefully (date partitioning naturally creates new partitions over time; hash
            partitioning can be expanded by increasing the modulo).
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 2: How do you handle data skew when one partition receives significantly more data than others?
          </h3>
          <p className="mb-3">
            The first step is detection: monitor partition sizes as a time-series metric and alert when any partition
            exceeds 2x the average partition size. This detects hot partitions early, before they become performance
            bottlenecks. The alert should include the partition key value that is causing the skew, so that the root
            cause can be identified quickly.
          </p>
          <p className="mb-3">
            The most effective mitigation for a hot key is key salting: append a random suffix to the hot key before
            partitioning, so that records for the hot key are distributed across multiple partitions. For example, if
            user_123 is the hot key, append a random number from 0 to 99 to create user_123_0 through user_123_99,
            distributing the records across 100 partitions instead of one. The salted key is used only for
            partitioning — the original key is preserved in the record for queries.
          </p>
          <p>
            If the skew is caused by a range partitioning boundary that is poorly chosen (for example, the range A-M
            receives 80 percent of the data because most keys start with letters in the A-M range), the fix is to
            adjust the range boundaries based on the actual key distribution. This requires analyzing the key
            distribution and choosing boundaries that divide the data evenly. For dynamic key distributions, consider
            switching to hash partitioning, which automatically distributes data evenly regardless of the key
            distribution.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 3: When is repartitioning necessary, and how do you minimize its impact?
          </h3>
          <p className="mb-3">
            Repartitioning is necessary when the current partitioning scheme no longer serves the workload — because
            partitions have grown too large, because the key distribution has changed creating hot partitions, or
            because the query patterns have changed and the current scheme does not enable partition pruning for the
            new patterns. Repartitioning is expensive: it requires reading and rewriting every record in the dataset,
            which for a 1 TB dataset means 2 TB of I/O (1 TB read, 1 TB write).
          </p>
          <p className="mb-3">
            To minimize the impact of repartitioning: first, schedule it during a low-traffic window when query volume
            is lowest and compute resources are most available. Second, use incremental repartitioning if possible —
            repartition only the affected partitions rather than the entire dataset. For example, if only the most
            recent month&apos;s data has grown too large, repartition only that month&apos;s data. Third, run the repartitioning
            pipeline in parallel with the existing pipeline, writing the repartitioned data to a new location, and
            switch the query engine to the new location atomically once the repartitioning is complete. This minimizes
            downtime because the old partition structure remains available until the new one is ready.
          </p>
          <p>
            To avoid repartitioning altogether, over-partition initially and choose a partitioning scheme that scales
            gracefully. Date partitioning naturally creates new partitions over time without repartitioning. Hash
            partitioning with a large initial partition count (4,096 or more) provides enough headroom that
            repartitioning is rarely needed.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 4: How does partitioning affect query performance, and when can it hurt?
          </h3>
          <p className="mb-3">
            Partitioning improves query performance through partition pruning: when a query&apos;s filter conditions match
            the partitioning scheme, the query engine can skip irrelevant partitions, reading only the relevant data.
            For a dataset partitioned by date with 365 partitions, a query for a single day reads only 1/365th of the
            data, reducing I/O by 99.7 percent. This is the primary benefit of partitioning.
          </p>
          <p className="mb-3">
            However, partitioning can hurt query performance in two scenarios. First, when the partition key does not
            match the query&apos;s filter conditions — for example, a table partitioned by customer ID but queried by date.
            In this case, every query must scan all partitions, and the partitioning provides no I/O benefit while
            adding the overhead of managing many partitions (more file listings, more catalog entries, more scheduling
            decisions).
          </p>
          <p>
            Second, when there are too many small partitions, the overhead of managing the partitions can exceed the
            benefit of partition pruning. Each partition has a minimum file size (due to file system block sizes) and
            a metadata cost (catalog entry, file listing, scheduling decision). If a partition contains only a few
            records, the metadata cost may exceed the data processing cost. The fix is to merge small partitions into
            larger ones, targeting partitions of 128 MB to 1 GB.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 5: How do you design partitioning for a multi-tenant data platform?
          </h3>
          <p className="mb-3">
            Multi-tenant partitioning design depends on the tenant distribution and the query patterns. If tenants are
            roughly equal in size and queries are typically scoped to a single tenant, list partitioning by tenant ID
            is the simplest approach — each tenant gets its own partition, providing data isolation, tenant-level
            lifecycle management, and efficient tenant-scoped queries.
          </p>
          <p className="mb-3">
            If tenant sizes are highly skewed (a few large tenants generate most of the data), list partitioning by
            tenant ID creates hot partitions for the large tenants. In this case, a two-level partitioning scheme is
            appropriate: partition by tenant ID at the top level, and then by hash of the business key within each
            tenant. This distributes the large tenant&apos;s data across multiple sub-partitions while maintaining tenant
            isolation at the top level.
          </p>
          <p>
            If cross-tenant queries are common (for example, aggregating data across all tenants), the partitioning
            scheme should support efficient cross-tenant scans. Date partitioning at the top level (one partition per
            day) with tenant ID as a filter column within each date partition supports both tenant-scoped queries
            (scan the relevant date partitions and filter by tenant ID) and cross-tenant queries (scan the relevant
            date partitions without a tenant filter). The trade-off is that tenant-scoped queries are less efficient
            because they must filter within each date partition rather than jumping directly to the tenant&apos;s
            partition.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-3">
          <li>
            <strong>Stonebraker et al., &quot;The Case for Shared Nothing&quot;</strong> — Foundational paper on
            partitioned database architectures and the trade-offs of different partitioning strategies. IEEE Database
            Engineering Bulletin, 1986.
          </li>
          <li>
            <strong>Apache Parquet Documentation — Partitioning</strong> — Covers partitioned directory structures,
            partition discovery, and partition pruning in Parquet-based data lakes.{' '}
            <a
              href="https://parquet.apache.org/docs/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              parquet.apache.org/docs
            </a>
          </li>
          <li>
            <strong>Apache Kafka Documentation — Partitioning</strong> — Covers topic partitioning, partition key
            assignment, and the relationship between partition count and consumer parallelism.{' '}
            <a
              href="https://kafka.apache.org/documentation/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              kafka.apache.org/documentation
            </a>
          </li>
          <li>
            <strong>AWS — Amazon Redshift Distribution Styles</strong> — Practical guide to distribution styles
            (KEY, EVEN, ALL, AUTO) and their impact on query performance in a distributed data warehouse.{' '}
            <a
              href="https://docs.aws.amazon.com/redshift/latest/dg/t_Distributing_data.html"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              docs.aws.amazon.com/redshift/latest/dg/t_Distributing_data
            </a>
          </li>
          <li>
            <strong>Kleppmann, Designing Data-Intensive Applications</strong> — Chapter on partitioning covering
            partitioning of databases, rebalancing, and routing of requests to partitions. O&apos;Reilly Media, 2017.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}