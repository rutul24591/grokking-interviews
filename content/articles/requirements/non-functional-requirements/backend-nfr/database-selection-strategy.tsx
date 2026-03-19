"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-database-selection-extensive",
  title: "Database Selection Strategy",
  description: "Comprehensive guide to database selection, covering SQL vs NoSQL, consistency requirements, access patterns, polyglot persistence, and operational considerations for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "database-selection-strategy",
  version: "extensive",
  wordCount: 11000,
  readingTime: 44,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "database", "sql", "nosql", "data-modeling", "architecture"],
  relatedTopics: ["consistency-model", "scalability-strategy", "durability-guarantees", "caching-strategies"],
};

export default function DatabaseSelectionStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Database Selection</strong> is the process of choosing the right data storage technology
          for your application&apos;s requirements. The choice impacts scalability, consistency, development
          velocity, and operational complexity for years.
        </p>
        <p>
          There is no &quot;best&quot; database — only the right database for your specific use case.
          Modern systems often use multiple databases (<strong>polyglot persistence</strong>) to match
          different data types with appropriate storage technologies.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Requirements Drive Selection</h3>
          <p>
            Start with requirements, not technology preferences. Ask: What consistency model is needed?
            What are the read/write patterns? What scale is expected? What operations team capabilities exist?
          </p>
        </div>
      </section>

      <section>
        <h2>SQL vs NoSQL Decision</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/database-selection-strategy.svg"
          alt="Database Selection Decision Tree"
          caption="Database Selection — showing decision tree for SQL vs NoSQL and database types (Relational, Document, Key-Value, Column-Family, Graph, Time-Series)"
        />
        <p>
          The first major decision is relational (SQL) vs non-relational (NoSQL).
        </p>
      </section>

      <section>
        <h2>Database Selection Framework</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/database-selection-framework.svg"
          alt="Database Selection Framework"
          caption="Database Selection Framework — showing decision tree, database types comparison grid"
        />
        <p>
          Comprehensive database selection framework:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When to Choose SQL</h3>
        <p>
          <strong>Choose SQL when:</strong>
        </p>
        <ul>
          <li>
            <strong>Complex queries:</strong> Need joins, aggregations, ad-hoc queries.
          </li>
          <li>
            <strong>Strong consistency:</strong> ACID transactions are required (payments, inventory).
          </li>
          <li>
            <strong>Structured data:</strong> Schema is well-defined and stable.
          </li>
          <li>
            <strong>Referential integrity:</strong> Foreign key constraints are important.
          </li>
          <li>
            <strong>Mature tooling:</strong> Need ORM support, reporting tools, BI integration.
          </li>
        </ul>
        <p>
          <strong>Examples:</strong> PostgreSQL, MySQL, Oracle, SQL Server.
        </p>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Strong consistency, ACID transactions.</li>
          <li>✓ Powerful query language (SQL).</li>
          <li>✓ Mature ecosystem and tooling.</li>
          <li>✗ Horizontal scaling is complex (sharding).</li>
          <li>✗ Schema changes can be disruptive.</li>
          <li>✗ May not handle extreme scale well.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When to Choose NoSQL</h3>
        <p>
          <strong>Choose NoSQL when:</strong>
        </p>
        <ul>
          <li>
            <strong>Massive scale:</strong> Need horizontal scaling from day one.
          </li>
          <li>
            <strong>Flexible schema:</strong> Data structure evolves rapidly.
          </li>
          <li>
            <strong>Simple access patterns:</strong> Mostly key-value lookups or document retrieval.
          </li>
          <li>
            <strong>High write throughput:</strong> Need to handle millions of writes per second.
          </li>
          <li>
            <strong>Eventual consistency acceptable:</strong> Can tolerate temporary inconsistencies.
          </li>
        </ul>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">NoSQL Database Types</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Best For</th>
                <th className="p-2 text-left">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Document</td>
                <td className="p-2">Content, catalogs, user profiles</td>
                <td className="p-2">MongoDB, CouchDB</td>
              </tr>
              <tr>
                <td className="p-2">Key-Value</td>
                <td className="p-2">Sessions, caching, simple lookups</td>
                <td className="p-2">Redis, DynamoDB, Riak</td>
              </tr>
              <tr>
                <td className="p-2">Column-Family</td>
                <td className="p-2">Time-series, analytics, wide tables</td>
                <td className="p-2">Cassandra, HBase, ScyllaDB</td>
              </tr>
              <tr>
                <td className="p-2">Graph</td>
                <td className="p-2">Social networks, recommendations, fraud detection</td>
                <td className="p-2">Neo4j, Amazon Neptune</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Selection Framework</h2>
        <p>
          Use this framework to evaluate database options:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Data Model Requirements</h3>
        <ul>
          <li>What is the data structure? (relational, document, graph, time-series)</li>
          <li>How will data be queried? (point lookups, range queries, joins, aggregations)</li>
          <li>What are the write patterns? (single writes, bulk loads, streams)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. Consistency Requirements</h3>
        <ul>
          <li>Strong consistency required? → SQL or CP NoSQL</li>
          <li>Eventual consistency acceptable? → AP NoSQL</li>
          <li>Transactional integrity needed? → ACID-compliant database</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. Scale Requirements</h3>
        <ul>
          <li>Data volume: GB, TB, PB?</li>
          <li>Throughput: RPS, QPS requirements?</li>
          <li>Growth rate: How fast will data grow?</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. Operational Considerations</h3>
        <ul>
          <li>Team expertise with technology?</li>
          <li>Managed service available?</li>
          <li>Backup and recovery requirements?</li>
          <li>Monitoring and alerting capabilities?</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a database schema for a ride-sharing platform. Would you use SQL or NoSQL? Justify your choice.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>SQL (PostgreSQL) for core data:</strong> Users, drivers, trips, payments. Need ACID transactions for payments, complex queries for trip history.</li>
                <li><strong>NoSQL (Redis) for real-time:</strong> Driver location tracking, ride matching. Need sub-millisecond latency, high write throughput.</li>
                <li><strong>Geospatial:</strong> PostgreSQL with PostGIS extension for location queries (nearby drivers, route calculation).</li>
                <li><strong>Partitioning:</strong> Partition trips table by date for scalability. Archive old trips to cold storage.</li>
                <li><strong>Scaling:</strong> Read replicas for trip history queries. Redis Cluster for location tracking. Kafka for trip event streaming.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. When would you choose Cassandra over PostgreSQL? What are the trade-offs?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Choose Cassandra when:</strong> (1) Massive write throughput needed (100K+ writes/sec). (2) Linear horizontal scaling required. (3) Eventual consistency acceptable.</li>
                <li><strong>Choose PostgreSQL when:</strong> (1) ACID transactions required. (2) Complex queries/joins needed. (3) Strong consistency required.</li>
                <li><strong>Cassandra trade-offs:</strong> ✓ Infinite scale, high availability. ✗ Eventual consistency, limited query patterns, no joins.</li>
                <li><strong>PostgreSQL trade-offs:</strong> ✓ ACID, complex queries, strong consistency. ✗ Vertical scaling limits, sharding complexity.</li>
                <li><strong>Use cases:</strong> Cassandra for time-series data, clickstream, IoT. PostgreSQL for financial data, user accounts, orders.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Explain polyglot persistence. Give an example of a system that would benefit from using multiple databases.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Polyglot persistence:</strong> Using multiple database technologies for different workloads within same system.</li>
                <li><strong>E-commerce example:</strong> (1) PostgreSQL for orders/payments (ACID required). (2) MongoDB for product catalog (flexible schema). (3) Redis for shopping cart/sessions (fast, ephemeral). (4) Elasticsearch for product search (full-text search).</li>
                <li><strong>Benefits:</strong> Each database optimized for specific workload. Better performance, scalability, developer productivity.</li>
                <li><strong>Trade-offs:</strong> Increased operational complexity (multiple systems to manage). Data synchronization challenges. Need for distributed transactions.</li>
                <li><strong>Best practice:</strong> Start simple (single database). Add databases as scale demands. Don&apos;t over-engineer initially.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Your startup is building a social media app. What database do you choose for the MVP? How does your choice change at 10M users?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>MVP (0-100K users):</strong> PostgreSQL. Simple, ACID-compliant, handles moderate scale. Single instance with backups.</li>
                <li><strong>Growth (100K-1M users):</strong> PostgreSQL with read replicas. Add Redis for caching frequently accessed data (user profiles, feeds).</li>
                <li><strong>Scale (1M-10M users):</strong> PostgreSQL sharding by user_id. Cassandra for activity feeds (high write throughput). Redis Cluster for sessions/caching.</li>
                <li><strong>10M+ users:</strong> Polyglot persistence. PostgreSQL for core data, Cassandra for feeds, Redis for caching, Elasticsearch for search, S3 for media storage.</li>
                <li><strong>Key insight:</strong> Architecture evolves with scale. Start simple, add complexity as needed. Don&apos;t premature optimize.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Compare Redis and PostgreSQL for storing user sessions. When would you use each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Redis for sessions:</strong> ✓ Sub-millisecond latency. ✓ Built-in TTL (auto-expiry). ✓ Simple key-value access. ✗ Data loss on restart (unless AOF enabled).</li>
                <li><strong>PostgreSQL for sessions:</strong> ✓ Durability (WAL). ✓ Complex queries (list all user sessions). ✗ Higher latency. ✗ Manual cleanup of expired sessions.</li>
                <li><strong>Use Redis when:</strong> Performance critical, sessions ephemeral, simple access patterns. Most common choice for web sessions.</li>
                <li><strong>Use PostgreSQL when:</strong> Need to query sessions (admin dashboard), audit trail required, durability critical.</li>
                <li><strong>Hybrid:</strong> Redis for active sessions, PostgreSQL for audit log of session creation/termination.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you migrate from a monolithic database to microservices with database-per-service? What are the challenges?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Strategy:</strong> Strangler fig pattern. Gradually extract tables into service-specific databases.</li>
                <li><strong>Migration steps:</strong> (1) Identify service boundaries. (2) Create new database for service. (3) Dual write to both databases. (4) Migrate reads to new database. (5) Remove old table access.</li>
                <li><strong>Challenges:</strong> (1) Distributed transactions (use saga pattern). (2) Data consistency (eventual consistency). (3) Query complexity (API composition). (4) Rollback complexity.</li>
                <li><strong>Data sync:</strong> Use CDC (Change Data Capture) to keep databases in sync during transition. Tools: Debezium, Kafka Connect.</li>
                <li><strong>Rollback:</strong> Keep old database schema during transition. Can rollback if migration issues arise.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Database Selection Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Documented data model and access patterns</li>
          <li>✓ Defined consistency requirements</li>
          <li>✓ Estimated scale (data volume, throughput)</li>
          <li>✓ Evaluated SQL and NoSQL options</li>
          <li>✓ Considered operational capabilities</li>
          <li>✓ Planned for growth and migration</li>
          <li>✓ Tested with realistic workloads</li>
          <li>✓ Documented backup and recovery procedures</li>
          <li>✓ Established monitoring and alerting</li>
          <li>✓ Created rollback plan if choice proves wrong</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
