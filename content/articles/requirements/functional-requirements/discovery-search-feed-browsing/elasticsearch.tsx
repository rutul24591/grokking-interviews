"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-other-elasticsearch",
  title: "Elasticsearch",
  description:
    "Comprehensive guide to Elasticsearch covering cluster architecture, index design, query optimization, scaling strategies, and production best practices.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "elasticsearch",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "elasticsearch",
    "search",
    "infrastructure",
    "distributed-systems",
  ],
  relatedTopics: ["search-indexing", "query-processing", "search-ranking", "distributed-search"],
};

export default function ElasticsearchArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Elasticsearch</strong> is a distributed, RESTful search and analytics
          engine built on Apache Lucene. It is the industry-standard for full-text search,
          powering use cases from application search (e-commerce, content discovery) to
          log analytics (ELK stack) to observability (metrics, APM). Elasticsearch handles
          schema-free JSON documents, scales horizontally across clusters, and provides
          near-real-time search capabilities.
        </p>
        <p>
          Major companies rely on Elasticsearch: Netflix uses it for content discovery
          across 200M+ subscribers, Uber uses it for real-time trip search and analytics,
          Slack uses it for message search across billions of messages. The engine's
          strength lies in its inverted index (fast full-text search), distributed
          architecture (automatic sharding and replication), and rich query DSL (domain
          specific language).
        </p>
        <p>
          For staff-level engineers, Elasticsearch expertise involves cluster architecture
          (node roles, shard allocation), index design (mappings, analyzers, templates),
          query optimization (filter context, aggregations), and operational excellence
          (monitoring, backup/restore, upgrades). Understanding when to use Elasticsearch
          vs alternatives (OpenSearch, Solr, managed services like Algolia) is equally
          important.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Cluster Architecture</h3>
        <p>
          Elasticsearch cluster is a collection of nodes working together:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Master Node:</strong> Manages cluster state (indices, shards, nodes).
            Handles metadata operations (create/delete index). Does NOT handle search
            traffic. Run dedicated master nodes (3 for HA) in production.
          </li>
          <li>
            <strong>Data Node:</strong> Stores shards, executes search/index operations.
            Heavy CPU, memory, disk I/O. Scale horizontally by adding data nodes.
          </li>
          <li>
            <strong>Ingest Node:</strong> Pre-processes documents before indexing
            (transform, enrich, extract). Pipeline processors for data transformation.
          </li>
          <li>
            <strong>Coordinating Node:</strong> Routes requests, merges results. Every
            node can be coordinating. Dedicated coordinating nodes for heavy aggregation
            workloads.
          </li>
        </ul>

        <h3 className="mt-6">Shards and Replicas</h3>
        <p>
          Elasticsearch distributes data across shards for horizontal scaling:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Primary Shard:</strong> Stores subset of documents. Number of primary
            shards fixed at index creation. Cannot change later (requires reindex).
            Target 10-50GB per shard.
          </li>
          <li>
            <strong>Replica Shard:</strong> Copy of primary shard. Provides high
            availability (failover if primary fails) and read scaling (searches can hit
            replicas). Can change dynamically.
          </li>
          <li>
            <strong>Shard Allocation:</strong> Elasticsearch automatically distributes
            shards across nodes. Balances by disk usage, shard count. Configure awareness
            (rack, zone) for fault tolerance.
          </li>
        </ul>

        <h3 className="mt-6">Index Design</h3>
        <p>
          Index is a collection of documents with similar structure:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Mapping:</strong> Schema definition for index. Defines field types
            (text, keyword, date, numeric), analyzers, indexing options. Explicit mappings
            prevent field explosion.
          </li>
          <li>
            <strong>Analyzer:</strong> Processes text during indexing and search.
            Built-in (standard, simple, keyword) or custom (tokenizer + filters).
            Critical for search relevance.
          </li>
          <li>
            <strong>Index Template:</strong> Applies settings/mappings to indices matching
            pattern. Essential for time-series data (logs-*, metrics-*). Ensures consistency.
          </li>
          <li>
            <strong>Alias:</strong> Abstract pointer to index/indices. Enables zero-downtime
            reindexing (switch alias from old to new index). Query against alias, not index
            name.
          </li>
        </ul>

        <h3 className="mt-6">Query DSL</h3>
        <p>
          Elasticsearch Query DSL (Domain Specific Language) is JSON-based:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Match Query:</strong> Full-text search. Analyzes query text, matches
            against inverted index. Supports operators (AND, OR), fuzziness, boosting.
          </li>
          <li>
            <strong>Term Query:</strong> Exact match on keyword/numeric fields. No
            analysis. Use for IDs, categories, exact values.
          </li>
          <li>
            <strong>Bool Query:</strong> Combine queries with MUST (AND), SHOULD (OR),
            MUST_NOT (NOT). Foundation for complex queries.
          </li>
          <li>
            <strong>Aggregations:</strong> Compute metrics (count, sum, avg), buckets
            (group by field), nested aggs. Used for facets, analytics, dashboards.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Production Elasticsearch deployment involves multiple components working together
          for scalable, reliable search.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/elasticsearch/cluster-architecture.svg"
          alt="Elasticsearch Cluster Architecture"
          caption="Figure 1: Cluster Architecture — Master, data, ingest nodes with shard distribution and replica allocation"
          width={1000}
          height={500}
        />

        <h3>Cluster Setup</h3>
        <ul className="space-y-3">
          <li>
            <strong>Master Nodes (3 nodes):</strong> Dedicated master-eligible nodes.
            Prevent split-brain with minimum_master_nodes = 2. Do NOT handle search
            traffic.
          </li>
          <li>
            <strong>Data Nodes (N nodes):</strong> Store data, execute queries. Scale
            horizontally. Use SSDs for performance. Heap size: 50% RAM, max 31GB.
          </li>
          <li>
            <strong>Ingest Nodes (2+ nodes):</strong> Pre-process documents. Run
            pipelines for transformation. Can combine with data nodes for small clusters.
          </li>
          <li>
            <strong>Coordinating Nodes:</strong> Every node can coordinate. For heavy
            aggregations, use dedicated coordinating nodes.
          </li>
          <li>
            <strong>Client Connection:</strong> Connect via HTTP (9200) or transport
            client. Use load balancer (nginx, HAProxy) for high availability.
          </li>
        </ul>

        <h3 className="mt-6">Index Lifecycle</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Index Creation:</strong> Apply template (if matches pattern). Create
            primary shards, allocate to nodes. Create replicas if configured.
          </li>
          <li>
            <strong>Document Indexing:</strong> Route document to shard (hash based on ID
            or routing key). Index on primary, replicate to replicas synchronously or
            asynchronously.
          </li>
          <li>
            <strong>Refresh:</strong> Make documents searchable (default: 1 second).
            Creates new segment. Near-real-time search.
          </li>
          <li>
            <strong>Flush:</strong> Commit translog to disk. Clears translog. Happens
            automatically every 30 minutes or when translog grows.
          </li>
          <li>
            <strong>Merge:</strong> Background process combines small segments into
            larger ones. Removes deleted documents. Optimizes search performance.
          </li>
          <li>
            <strong>Rollover:</strong> When index reaches size/doc count threshold,
            create new index. Alias points to write index. Old indices become read-only.
          </li>
          <li>
            <strong>Delete:</strong> Delete old indices based on retention policy.
            Frees disk space. Use ILM (Index Lifecycle Management) for automation.
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/elasticsearch/query-execution-flow.svg"
          alt="Query Execution Flow"
          caption="Figure 2: Query Execution Flow — Coordinating node routes query to shards, merges results, returns to client"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Query Execution Flow</h3>
        <p>
          Understanding how Elasticsearch executes queries is critical for optimization:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Phase</th>
                <th className="text-left p-2 font-semibold">Description</th>
                <th className="text-left p-2 font-semibold">Optimization</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Query</td>
                <td className="p-2">Send query to all relevant shards</td>
                <td className="p-2">Use routing to target specific shards</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Scatter</td>
                <td className="p-2">Each shard executes query locally</td>
                <td className="p-2">Filter context for caching</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Gather</td>
                <td className="p-2">Coordinating node merges results</td>
                <td className="p-2">Limit results (size parameter)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Fetch</td>
                <td className="p-2">Fetch full documents for top hits</td>
                <td className="p-2">Use _source filtering</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6">Scaling Strategies</h3>
        <p>
          Elasticsearch scales horizontally with proper planning:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Horizontal Scaling:</strong> Add data nodes to cluster. Shards
            automatically rebalance. No downtime.
          </li>
          <li>
            <strong>Index Sharding:</strong> More primary shards = more parallelism.
            But too many shards causes overhead. Plan for growth (estimate 1-2 years).
          </li>
          <li>
            <strong>Read Scaling:</strong> Add replicas for read-heavy workloads.
            Searches distribute across primaries + replicas.
          </li>
          <li>
            <strong>Write Scaling:</strong> Replicas don't help writes (must write to
            all). Add more primary shards or use bulk indexing.
          </li>
          <li>
            <strong>Hot-Warm-Cold Architecture:</strong> Hot nodes (SSD, recent data),
            warm nodes (HDD, older data), cold nodes (archive). Use ILM to move indices.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Elasticsearch design involves balancing performance, cost, and operational
          complexity.
        </p>

        <h3>Replica Count Trade-offs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Replicas</th>
                <th className="text-left p-2 font-semibold">Read Throughput</th>
                <th className="text-left p-2 font-semibold">Write Throughput</th>
                <th className="text-left p-2 font-semibold">Storage</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">0</td>
                <td className="p-2">Low (primaries only)</td>
                <td className="p-2">Highest</td>
                <td className="p-2">1x</td>
                <td className="p-2">Dev/test, non-critical</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">1</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Medium</td>
                <td className="p-2">2x</td>
                <td className="p-2">Production (minimum)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">2+</td>
                <td className="p-2">High</td>
                <td className="p-2">Lower</td>
                <td className="p-2">3x+</td>
                <td className="p-2">Read-heavy, HA critical</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/elasticsearch/query-optimization-strategies.svg"
          alt="Query Optimization Strategies"
          caption="Figure 3: Query Optimization — Filter vs query context, caching strategies, and performance comparison"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Filter Context vs Query Context</h3>
        <p>
          <strong>Query Context:</strong> Computes relevance score (_score). Results
          ordered by relevance. NOT cached. Use for full-text search where ranking
          matters.
        </p>
        <p>
          <strong>Filter Context:</strong> Binary match (yes/no). No scoring. Results
          NOT ordered. CACHED automatically. Use for structured data (category, date
          range, status). 10x faster than query context.
        </p>
        <p>
          <strong>Best Practice:</strong> Use bool query with filter clause for
          structured filters. Example:
        </p>
        <div className="my-4 rounded-lg bg-muted p-4 font-mono text-sm overflow-x-auto">
          <pre>{`{
  "query": {
    "bool": {
      "must": { "match": { "title": "running shoes" } },
      "filter": [
        { "term": { "brand": "nike" } },
        { "range": { "price": { "gte": 50, "lte": 100 } } }
      ]
    }
  }
}`}</pre>
        </div>

        <h3 className="mt-6">Elasticsearch vs Alternatives</h3>
        <p>
          <strong>Elasticsearch:</strong> Full-featured, distributed, self-managed.
          Best for: complex search, analytics, logging. Complexity: high. Cost:
          infrastructure + operations.
        </p>
        <p>
          <strong>Algolia:</strong> Managed search-as-a-service. Best for: application
          search, typo tolerance, personalization. Complexity: low. Cost: per-operation
          pricing (expensive at scale).
        </p>
        <p>
          <strong>OpenSearch:</strong> AWS fork of Elasticsearch (Apache 2.0 license).
          Best for: AWS environments, avoiding license restrictions. Feature parity
          with ES 7.10.
        </p>
        <p>
          <strong>Solr:</strong> Mature, stable, Apache license. Best for: established
          deployments, simpler use cases. Less active development than ES.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Dedicated Master Nodes:</strong> 3 master-eligible nodes for
            production. Prevents split-brain. Do NOT handle search traffic on masters.
          </li>
          <li>
            <strong>Plan Shard Count:</strong> Target 10-50GB per shard. Estimate growth
            for 1-2 years. Cannot reduce primary shards without reindex.
          </li>
          <li>
            <strong>Use Index Templates:</strong> Define mappings, settings, analyzers
            in templates. Apply to index patterns (logs-*, products-*).
          </li>
          <li>
            <strong>Use Aliases:</strong> Query against aliases, not index names. Enables
            zero-downtime reindexing (switch alias atomically).
          </li>
          <li>
            <strong>Filter Context for Filters:</strong> Use bool filter clause for
            structured data. Automatically cached. 10x faster than query context.
          </li>
          <li>
            <strong>Limit Result Size:</strong> Use size parameter to limit results.
            Deep pagination (from + size &gt; 10000) is expensive. Use search_after
            for deep pagination.
          </li>
          <li>
            <strong>Use _source Filtering:</strong> Return only needed fields. Reduces
            network transfer. Example: _source: [title, price].
          </li>
          <li>
            <strong>Monitor Cluster Health:</strong> Watch cluster status (green/yellow/red),
            shard allocation, heap usage, GC pressure. Set up alerts.
          </li>
          <li>
            <strong>Backup Regularly:</strong> Use snapshot/restore for backups. Store
            snapshots in S3, GCS, or shared filesystem. Test restore procedure.
          </li>
          <li>
            <strong>Use ILM:</strong> Index Lifecycle Management automates rollover,
            shrink, delete. Essential for time-series data (logs, metrics).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Too Many Shards:</strong> Each shard consumes memory/file handles.
            1000+ shards causes cluster instability. Solution: Plan shard count, use
            rollover with appropriate thresholds.
          </li>
          <li>
            <strong>Deep Pagination:</strong> from + size &gt; 10000 causes memory
            issues. Solution: Use search_after for deep pagination, limit to first
            100 pages.
          </li>
          <li>
            <strong>Wildcard Queries:</strong> Leading wildcard (*term) forces full
            index scan. Solution: Use ngram analyzer for prefix search, avoid leading
            wildcards.
          </li>
          <li>
            <strong>Field Explosion:</strong> Dynamic mapping creates field per unique
            key. Solution: Disable dynamic mapping, define explicit mappings.
          </li>
          <li>
            <strong>Large Documents:</strong> Documents &gt; 100KB cause memory pressure.
            Solution: Split large documents, store large fields separately.
          </li>
          <li>
            <strong>No Refresh Interval Tuning:</strong> Default 1s refresh is too
            frequent for bulk indexing. Solution: Increase to 30s during bulk, reset
            afterward.
          </li>
          <li>
            <strong>Ignoring Heap Pressure:</strong> Heap &gt; 75% triggers GC pressure.
            Solution: Monitor heap, add nodes, optimize queries, increase heap (max 31GB).
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Netflix Content Search</h3>
        <p>
          Netflix uses Elasticsearch for content discovery across 200M+ subscribers.
          Searches titles, descriptions, cast, genres. Personalizes results based on
          viewing history. Handles 1B+ searches per day.
        </p>
        <p>
          <strong>Key Innovation:</strong> Custom analyzers for title matching (handles
          accents, special characters). Per-user boosting based on viewing preferences.
        </p>

        <h3 className="mt-6">Uber Real-Time Trip Search</h3>
        <p>
          Uber uses Elasticsearch for real-time trip search and analytics. Indexes
          millions of trips per hour. Searches by location, time, driver, rider.
          Powers driver/rider apps and internal tools.
        </p>
        <p>
          <strong>Key Innovation:</strong> Geo-spatial queries for location-based
          search. Time-based indices with ILM for automatic rollover.
        </p>

        <h3 className="mt-6">Slack Message Search</h3>
        <p>
          Slack uses Elasticsearch for message search across billions of messages.
          Per-workspace indices for data isolation. Searches text, files, channels.
          Supports real-time indexing (messages searchable immediately).
        </p>
        <p>
          <strong>Key Innovation:</strong> Channel-based routing for permissions.
          Search respects channel access controls.
        </p>

        <h3 className="mt-6">GitHub Code Search</h3>
        <p>
          GitHub uses Elasticsearch for code search across billions of lines of code.
          Custom analyzers for code tokenization (split camelCase, snake_case). Searches
          symbols, function names, comments.
        </p>
        <p>
          <strong>Key Innovation:</strong> Custom tokenizer handles programming language
          syntax. Indexes code structure (AST) for semantic search.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize Elasticsearch queries?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use filter context for structured data (automatically
              cached). Limit returned fields with _source filtering. Use size parameter
              to limit results. Avoid leading wildcards (*term). Use routing to target
              specific shards. For aggregations, use composite aggregation for pagination.
              Monitor slow query log to identify problematic queries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle index growth?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use Index Lifecycle Management (ILM) with rollover
              policy. Create new index when size/doc count threshold reached. Old indices
              become read-only, eventually deleted. Use hot-warm-cold architecture for
              cost optimization. Monitor disk usage, plan capacity for 1-2 years growth.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you achieve zero-downtime reindexing?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use aliases. Create new index with updated mapping.
              Reindex from old to new index using reindex API (batch processing). When
              complete, switch alias atomically to point to new index. Keep old index
              for rollback. Delete old index after validation period.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cluster scaling?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Horizontal scaling: add data nodes, shards rebalance
              automatically. For read-heavy: add replicas. For write-heavy: add more
              primary shards (requires reindex). Use dedicated master nodes (3) for
              stability. Monitor shard allocation, heap usage, GC pressure during scaling.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle backup and restore?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use snapshot/restore API. Register snapshot repository
              (S3, GCS, shared filesystem). Create snapshots periodically (daily/hourly).
              Snapshots are incremental (only changed data). Test restore procedure
              regularly. For disaster recovery, replicate snapshots to different region.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you monitor cluster health?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Monitor cluster status (green/yellow/red), shard
              allocation, node heap usage, GC pressure, query latency, indexing rate.
              Use Elasticsearch monitoring APIs (_cluster/health, _nodes/stats). Set up
              alerts for yellow/red status, heap &gt; 75%, slow queries. Use Kibana
              monitoring dashboards or external tools (Prometheus, Datadog).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Elasticsearch — Official Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.elastic.co/guide/en/elasticsearch/reference/current/setup.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Elasticsearch — Cluster Setup Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.elastic.co/guide/en/elasticsearch/reference/current/index-lifecycle-management.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Elasticsearch — Index Lifecycle Management
            </a>
          </li>
          <li>
            <a
              href="https://netflixtechblog.com/tagged/elasticsearch"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netflix Tech Blog — Elasticsearch Articles
            </a>
          </li>
          <li>
            <a
              href="https://eng.uber.com/tag/elasticsearch/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Uber Engineering — Elasticsearch Articles
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
