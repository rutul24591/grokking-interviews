"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-content-storage",
  title: "Content Storage",
  description:
    "Comprehensive guide to implementing content storage covering database design (relational vs NoSQL), object storage (S3, GCS), content indexing strategies, partitioning/sharding, replication (leader-follower, multi-leader), backup/recovery strategies, data lifecycle management, and scalability patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-storage",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "content",
    "storage",
    "database",
    "backend",
    "scalability",
  ],
  relatedTopics: ["crud-apis", "media-processing", "search-indexing"],
};

export default function ContentStorageArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Content Storage</strong> encompasses the database schemas, object storage, and
          indexing strategies for persisting and retrieving content efficiently at scale. Content
          storage is the foundation of any content management system — without proper storage
          architecture, content retrieval is slow, scaling is impossible, and data durability is at
          risk. Storage architecture must handle structured metadata (title, author, status,
          timestamps), unstructured content body (text, HTML, markdown), and media files (images,
          videos, attachments).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/storage-architecture.svg"
          alt="Content Storage Architecture"
          caption="Storage Architecture — showing metadata database (PostgreSQL), content storage (TEXT column or document store), object storage (S3 for media), and search index (Elasticsearch)"
        />

        <p>
          For staff and principal engineers, implementing content storage requires deep
          understanding of database design (relational vs NoSQL — PostgreSQL/MySQL for structured
          metadata, MongoDB/DynamoDB for flexible schemas), storage architecture (metadata database,
          content storage, object storage separation), indexing strategies (B-tree for exact match,
          inverted index for full-text search, GIN/GiST for JSON), partitioning/sharding (range
          partitioning by date, hash partitioning by user_id, consistent hashing for distribution),
          replication (leader-follower for read scaling, multi-leader for multi-region,
          leaderless/Dynamo-style for availability), backup/recovery (point-in-time recovery,
          continuous backup, cross-region replication), data lifecycle management (tiered storage,
          archival policies, deletion strategies), and scalability patterns (read replicas,
          connection pooling, caching layers). The implementation must balance query performance
          (fast reads) with storage costs (efficient compression, tiered storage) and data
          durability (replication, backup).
        </p>
        <p>
          Modern content storage has evolved from monolithic databases to distributed, multi-tier
          architectures. Platforms like Medium, WordPress VIP, and Contentful use hybrid storage —
          relational database for metadata (PostgreSQL with read replicas), object storage for
          media (S3 with CDN), search index for discovery (Elasticsearch). This separation enables
          independent scaling — database scales for metadata queries, S3 scales for media storage,
          Elasticsearch scales for search.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Content storage is built on fundamental concepts that determine how content is persisted,
          indexed, and retrieved. Understanding these concepts is essential for designing effective
          storage systems.
        </p>
        <p>
          <strong>Metadata Database:</strong> Store structured content metadata (title, author,
          status, category, tags, created_at, updated_at). Technology: PostgreSQL, MySQL for
          relational data (ACID transactions, complex queries, referential integrity). Schema:
          content_id (UUID), title (VARCHAR), author_id (FK), status (ENUM: draft/published/
          archived), category_id (FK), created_at (TIMESTAMP), updated_at (TIMESTAMP). Benefits:
          ACID transactions (atomic updates), complex queries (JOINs, aggregations), referential
          integrity (foreign keys). Considerations: scaling writes (single leader bottleneck),
          connection pooling (limit concurrent connections), indexing (B-tree for exact match,
          composite indexes for multi-column queries).
        </p>
        <p>
          <strong>Content Storage:</strong> Store actual content body (text, HTML, markdown).
          Options: TEXT column in metadata table (simple, but bloats metadata table), separate
          content table (content_id, body, version — keeps metadata lean), document store (MongoDB,
          DynamoDB — flexible schema, horizontal scaling). Large content: external storage (S3, GCS
          — store content as object, reference in database via URL). Compression: gzip compression
          for storage efficiency (50-80% reduction for text content). Considerations: query
          patterns (do you need to query content body?), content size (small TEXT column, large
          external storage), access frequency (hot content cached, cold content archived).
        </p>
        <p>
          <strong>Object Storage:</strong> Store media files (images, videos, attachments).
          Technology: S3, GCS, Azure Blob Storage (scalable, durable, cost-effective for large
          files). Benefits: infinite scale (petabytes), high durability (11 9s — 99.999999999%),
          cost-effective (cheaper than database storage), CDN integration (fast global delivery).
          Key structure: s3://bucket/user_id/content_id/image.jpg (hierarchical keys for
          organization). Versioning: enable versioning for media (recover from accidental deletion/
          overwrite). Lifecycle policies: transition to Glacier (archive old media), expire
          uploads (delete incomplete multipart uploads).
        </p>
        <p>
          <strong>Search Index:</strong> Enable fast content discovery (full-text search, faceted
          search, relevance ranking). Technology: Elasticsearch, Algolia, Meilisearch (inverted
          index for full-text, aggregations for faceted search). Index structure: content_id,
          title (boosted), body (stemmed, analyzed), tags (keyword), author (keyword), created_at
          (date). Analyzers: standard analyzer (tokenization, stemming, lowercase), custom
          analyzers (synonyms, stop words). Query types: match query (full-text), term query
          (exact match), range query (date range), bool query (combine queries).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Content storage architecture separates metadata, content, media, and search — enabling
          independent scaling and optimization. This architecture is critical for performance and
          scalability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/database-partitioning.svg"
          alt="Database Partitioning"
          caption="Database Partitioning — showing range partitioning by date, hash partitioning by user_id, and read replicas for read scaling"
        />

        <p>
          Storage flow: User creates content. Frontend sends content (title, body, metadata).
          Backend validates input. Backend writes to metadata database (INSERT INTO content
          (title, author_id, status) VALUES (...) RETURNING content_id). Backend writes content
          body (separate content table or document store — INSERT INTO content_body (content_id,
          body) VALUES (...)). Backend uploads media to object storage (S3 PUT object —
          s3://bucket/user_id/content_id/image.jpg). Backend indexes content for search
          (Elasticsearch index — {'{'}content_id, title, body, tags{'}'}). User queries content. Backend
          reads from metadata database (SELECT * FROM content WHERE content_id = ...). Backend
          reads content body (separate table or document store). Backend generates media URLs
          (S3 pre-signed URLs or CDN URLs). Backend returns content (metadata + body + media URLs).
        </p>
        <p>
          Partitioning architecture includes: range partitioning (partition by date —
          content_created_at, each partition holds 1 month/year of data — efficient for time-series
          queries), hash partitioning (partition by user_id hash — distributes users evenly across
          partitions, efficient for user-specific queries), consistent hashing (for distributed
          partitioning — minimizes data movement when adding/removing nodes). This architecture
          enables horizontal scaling — each partition handles subset of data, queries routed to
          correct partition.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/replication-strategies.svg"
          alt="Replication Strategies"
          caption="Replication Strategies — showing leader-follower replication (read replicas), multi-leader replication (multi-region), and leaderless replication (Dynamo-style)"
        />

        <p>
          Replication architecture includes: leader-follower (single leader accepts writes,
          followers replicate via WAL — read queries distributed to followers for read scaling),
          multi-leader (multiple leaders accept writes — multi-region, conflict resolution via
          vector clocks or last-write-wins), leaderless/Dynamo-style (any node accepts writes,
          quorum reads/writes for consistency — high availability, eventual consistency). This
          architecture enables availability (replicas survive node failures), read scaling (read
          replicas handle read traffic), multi-region (multi-leader for low-latency writes).
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing content storage involves trade-offs between consistency, availability,
          performance, and cost. Understanding these trade-offs is essential for making informed
          architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Relational vs NoSQL for Metadata</h3>
          <ul className="space-y-3">
            <li>
              <strong>Relational (PostgreSQL, MySQL):</strong> ACID transactions (atomic updates),
              complex queries (JOINs, aggregations), referential integrity (foreign keys).
              Limitation: scaling writes (single leader bottleneck), schema rigidity (migrations
              required for schema changes).
            </li>
            <li>
              <strong>NoSQL (MongoDB, DynamoDB):</strong> Horizontal scaling (sharding built-in),
              flexible schema (add fields without migrations), high write throughput. Limitation:
              limited transactions (single-document only in MongoDB), no JOINs (denormalize data),
              eventual consistency (reads may return stale data).
            </li>
            <li>
              <strong>Recommendation:</strong> Relational for most content systems (ACID, complex
              queries valuable). NoSQL for massive scale (100M+ documents, high write throughput).
              Hybrid: relational for metadata, NoSQL for content body.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Store Content in Database vs Object Storage</h3>
          <ul className="space-y-3">
            <li>
              <strong>Database (TEXT column):</strong> ACID transactions (content + metadata
              atomic), simple architecture (single storage). Limitation: database bloat (large
              content slows queries), expensive storage (database storage costs more than S3).
            </li>
            <li>
              <strong>Object Storage (S3):</strong> Cheap storage (S3 cheaper than database),
              infinite scale (petabytes), CDN integration (fast delivery). Limitation: eventual
              consistency (S3 eventual consistency for new objects), separate from metadata (two
              storage systems to manage).
            </li>
            <li>
              <strong>Recommendation:</strong> Small content (&lt;1MB) in database (TEXT column).
              Large content (&gt;1MB) in object storage (S3 with URL reference). Hybrid approach
              balances simplicity with cost.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Single-Region vs Multi-Region Replication</h3>
          <ul className="space-y-3">
            <li>
              <strong>Single-Region:</strong> Simple architecture (one region to manage), low
              latency within region, no conflict resolution. Limitation: region outage = downtime,
              high latency for global users.
            </li>
            <li>
              <strong>Multi-Region:</strong> High availability (survive region outage), low
              latency globally (users connect to nearest region). Limitation: complex architecture
              (multi-leader replication), conflict resolution (vector clocks, last-write-wins),
              higher cost (data transfer between regions).
            </li>
            <li>
              <strong>Recommendation:</strong> Single-region for most systems (simpler, cheaper).
              Multi-region for global systems (99.99%+ availability required, global user base).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing content storage requires following established best practices to ensure
          performance, durability, and scalability.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Database Design</h3>
        <p>
          Normalize metadata (separate tables for authors, categories, tags — avoid duplication).
          Use appropriate data types (UUID for content_id, TIMESTAMP WITH TIMEZONE for timestamps,
          ENUM for status). Index frequently queried columns (author_id, status, created_at —
          composite indexes for multi-column queries). Use connection pooling (PgBouncer for
          PostgreSQL — limit concurrent connections). Partition large tables (range partitioning by
          date — each partition holds 1 month/year).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Object Storage</h3>
        <p>
          Use hierarchical key structure (s3://bucket/user_id/content_id/image.jpg — organization,
          access control). Enable versioning (recover from accidental deletion/overwrite).
          Configure lifecycle policies (transition to Glacier after 90 days — archive old media,
          expire incomplete multipart uploads). Use pre-signed URLs (temporary access — expire
          after 1 hour). Enable CDN (CloudFront for S3 — fast global delivery, reduced S3 costs).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Search Indexing</h3>
        <p>
          Index asynchronously (don't block content creation — use message queue to index after
          write). Use appropriate analyzers (standard analyzer for English, custom analyzers for
          other languages). Boost important fields (title boosted 2x vs body — title matches more
          relevant). Configure synonyms (laptop = notebook — expand queries). Monitor index health
          (indexing lag, query latency — alert on degradation).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Backup &amp; Recovery</h3>
        <p>
          Enable point-in-time recovery (PostgreSQL WAL archiving — recover to any point in time).
          Continuous backup (automated backups every 5 minutes — minimal data loss). Cross-region
          replication (replicate backups to different region — survive region outage). Test recovery
          regularly (quarterly recovery drills — ensure backups work, measure recovery time).
          Document recovery procedures (runbook for recovery — who, what, how, estimated time).
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing content storage to ensure performance,
          durability, and scalability.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Storing all content in one table:</strong> Metadata and large content bloat
            table, slow queries. <strong>Fix:</strong> Separate metadata table from content body.
            Store large content in object storage.
          </li>
          <li>
            <strong>No indexing:</strong> Slow queries, table scans. <strong>Fix:</strong> Index
            frequently queried columns (author_id, status, created_at). Use composite indexes for
            multi-column queries.
          </li>
          <li>
            <strong>No connection pooling:</strong> Database connection exhaustion, slow queries.{" "}
            <strong>Fix:</strong> Use connection pooler (PgBouncer for PostgreSQL). Limit max
            connections.
          </li>
          <li>
            <strong>No backup strategy:</strong> Data loss on failure. <strong>Fix:</strong> Enable
            point-in-time recovery. Continuous backup (every 5 minutes). Cross-region replication.
            Test recovery regularly.
          </li>
          <li>
            <strong>No partitioning:</strong> Large tables slow queries, slow backups.{" "}
            <strong>Fix:</strong> Partition by date (range partitioning — each partition holds 1
            month/year). Partition by user_id (hash partitioning — distribute users evenly).
          </li>
          <li>
            <strong>Storing media in database:</strong> Database bloat, expensive storage.{" "}
            <strong>Fix:</strong> Store media in object storage (S3). Reference via URL in
            database.
          </li>
          <li>
            <strong>Synchronous search indexing:</strong> Slow content creation (wait for index).{" "}
            <strong>Fix:</strong> Index asynchronously (message queue — index after write).
          </li>
          <li>
            <strong>No CDN for media:</strong> Slow media delivery, high S3 costs.{" "}
            <strong>Fix:</strong> Enable CDN (CloudFront for S3). Cache media at edge.
          </li>
          <li>
            <strong>No lifecycle policies:</strong> Old media accumulates, high storage costs.{" "}
            <strong>Fix:</strong> Configure lifecycle policies (transition to Glacier after 90
            days). Expire incomplete uploads.
          </li>
          <li>
            <strong>Single region:</strong> Region outage = downtime. <strong>Fix:</strong>
            Multi-region replication for critical systems. Cross-region backup for all systems.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Content storage is critical for content management. Here are real-world implementations
          from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Blogging Platform (Medium)</h3>
        <p>
          <strong>Challenge:</strong> Millions of articles. Fast reads (article views). Full-text
          search. Media storage (images in articles).
        </p>
        <p>
          <strong>Solution:</strong> PostgreSQL for metadata (title, author, status — read replicas
          for read scaling). Cassandra for content body (horizontal scaling, high write throughput).
          S3 for media (images — CDN delivery via CloudFront). Elasticsearch for search (full-text,
          relevance ranking).
        </p>
        <p>
          <strong>Result:</strong> Article reads &lt;100ms. Search results &lt;200ms. Media delivery
          fast globally. Horizontal scaling for growth.
        </p>
        <p>
          <strong>Architecture:</strong> PostgreSQL (metadata), Cassandra (content), S3 (media),
          Elasticsearch (search).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CMS Platform (Contentful)</h3>
        <p>
          <strong>Challenge:</strong> Multi-tenant (thousands of customers). Content isolation.
          Global delivery. API-first (content via API).
        </p>
        <p>
          <strong>Solution:</strong> PostgreSQL per tenant (content isolation — separate schema per
          customer). S3 for media (tenant-specific buckets). Elasticsearch per tenant (search
          isolation). CDN for API responses (cache API responses at edge — fast global delivery).
        </p>
        <p>
          <strong>Result:</strong> Tenant isolation (no cross-tenant data access). API responses
          &lt;50ms (CDN cached). Media delivery fast globally.
        </p>
        <p>
          <strong>Architecture:</strong> PostgreSQL per tenant, S3 (media), Elasticsearch per
          tenant, CDN (API caching).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">News Website (WordPress VIP)</h3>
        <p>
          <strong>Challenge:</strong> High traffic (millions of pageviews/day). Fast page loads.
          Media-heavy (images, videos). Editorial workflow (draft → published).
        </p>
        <p>
          <strong>Solution:</strong> MySQL for metadata (WordPress schema — read replicas for read
          scaling). S3 for media (offload media from database — CDN delivery). Varnish caching
          (cache full pages — reduce database load). Elasticsearch for search (replace WordPress
          search — better relevance).
        </p>
        <p>
          <strong>Result:</strong> Page loads &lt;1s. Database load reduced 90% (Varnish caching).
          Media delivery fast (S3 + CDN). Search quality improved.
        </p>
        <p>
          <strong>Architecture:</strong> MySQL (metadata), S3 (media), Varnish (page cache),
          Elasticsearch (search).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Documentation Platform (GitBook)</h3>
        <p>
          <strong>Challenge:</strong> Versioned content (multiple versions per document).
          Collaborative editing. Fast search across documentation.
        </p>
        <p>
          <strong>Solution:</strong> PostgreSQL for metadata (document_id, version_id, author —
          support multiple versions). S3 for content snapshots (store each version as S3 object —
          cheap, durable). Elasticsearch for search (index all versions — search across versions).
          Operational transforms for collaboration (real-time editing).
        </p>
        <p>
          <strong>Result:</strong> Version management seamless. Collaborative editing real-time.
          Search across all versions fast.
        </p>
        <p>
          <strong>Architecture:</strong> PostgreSQL (metadata, versions), S3 (content snapshots),
          Elasticsearch (search), OT (collaboration).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Platform (Shopify)</h3>
        <p>
          <strong>Challenge:</strong> Millions of products. Product variants (size, color — complex
          metadata). Media-heavy (product images). Fast product lookup.
        </p>
        <p>
          <strong>Solution:</strong> MySQL for metadata (products, variants — sharded by shop_id —
          each shop's data on specific shard). S3 for product images (CDN delivery). Elasticsearch
          for product search (faceted search — filter by size, color, price). Redis for caching
          (cache hot products — reduce database load).
        </p>
        <p>
          <strong>Result:</strong> Product lookup &lt;50ms. Search with facets &lt;100ms. Images
          delivered fast globally. Horizontal scaling via sharding.
        </p>
        <p>
          <strong>Architecture:</strong> MySQL sharded (metadata), S3 (images), Elasticsearch
          (search), Redis (caching).
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of content storage design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design database schema for content?</p>
            <p className="mt-2 text-sm">
              A: Separate metadata from content body. Metadata table (content_id UUID PRIMARY KEY,
              title VARCHAR(255), author_id FK, status ENUM, created_at TIMESTAMP, updated_at
              TIMESTAMP). Content body table (content_id FK, body TEXT, version INT — keeps metadata
              lean). Indexes on author_id, status, created_at (composite index for common queries).
              Foreign keys for referential integrity (author_id → users table).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle large content?</p>
            <p className="mt-2 text-sm">
              A: Small content (&lt;1MB) in database TEXT column (atomic with metadata). Large
              content (&gt;1MB) in object storage (S3 — store as object, reference via URL in
              database). Hybrid approach: store excerpt in database (for listing pages), full
              content in S3 (for detail pages). This balances query performance with storage costs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you partition content database?</p>
            <p className="mt-2 text-sm">
              A: Range partitioning by date (content_created_at — each partition holds 1 month/year
              of data — efficient for time-series queries like "get last 30 days"). Hash
              partitioning by user_id (distributes users evenly across partitions — efficient for
              user-specific queries like "get user's content"). Consistent hashing for distributed
              partitioning (minimizes data movement when adding/removing nodes).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you replicate content database?</p>
            <p className="mt-2 text-sm">
              A: Leader-follower replication (single leader accepts writes, followers replicate via
              WAL — read queries distributed to followers for read scaling). Multi-leader for
              multi-region (multiple leaders accept writes — conflict resolution via last-write-wins
              or vector clocks). Leaderless/Dynamo-style for high availability (any node accepts
              writes, quorum reads/writes for consistency).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you backup content database?</p>
            <p className="mt-2 text-sm">
              A: Point-in-time recovery (PostgreSQL WAL archiving — recover to any point in time).
              Continuous backup (automated backups every 5 minutes — minimal data loss). Cross-region
              replication (replicate backups to different region — survive region outage). Test
              recovery regularly (quarterly recovery drills — ensure backups work, measure recovery
              time). Document recovery procedures (runbook for recovery — who, what, how, estimated
              time).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you index content for search?</p>
            <p className="mt-2 text-sm">
              A: Elasticsearch for full-text search. Index structure: content_id, title (boosted
              2x), body (stemmed, analyzed), tags (keyword), author (keyword), created_at (date).
              Index asynchronously (message queue — don't block content creation). Use appropriate
              analyzers (standard for English, custom for other languages). Monitor index health
              (indexing lag, query latency — alert on degradation).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you store media files?</p>
            <p className="mt-2 text-sm">
              A: Object storage (S3, GCS — not database). Hierarchical key structure (s3://bucket/
              user_id/content_id/image.jpg — organization, access control). Enable versioning
              (recover from accidental deletion). Configure lifecycle policies (transition to
              Glacier after 90 days — archive old media). Use pre-signed URLs (temporary access —
              expire after 1 hour). Enable CDN (CloudFront for S3 — fast global delivery).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you scale content database?</p>
            <p className="mt-2 text-sm">
              A: Read scaling: read replicas (distribute read queries to followers), caching (Redis
              for hot content — reduce database load). Write scaling: partitioning (range/hash
              partitioning — distribute writes), sharding (horizontal partitioning — each shard
              holds subset of data). Connection pooling (PgBouncer — limit concurrent connections).
              Archive old data (move old content to cold storage — reduce active dataset size).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle content versioning?</p>
            <p className="mt-2 text-sm">
              A: Version table (content_id, version_number, body, created_at, author_id — each edit
              creates new version). Store snapshots in S3 (each version as S3 object — cheap,
              durable). Query latest version by default (SELECT * FROM content_versions WHERE
              content_id = ... ORDER BY version_number DESC LIMIT 1). Allow querying specific
              version (for audit, rollback).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.postgresql.org/docs/current/partitioning.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL Partitioning Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.postgresql.org/docs/current/warm-standby.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL Replication Documentation
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/s3/storage-classes/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS S3 Storage Classes
            </a>
          </li>
          <li>
            <a
              href="https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Elasticsearch Documentation
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Database Security Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OAuth 2.1 Security Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Security"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Web Security
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authorization Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Input Validation Cheat Sheet
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
