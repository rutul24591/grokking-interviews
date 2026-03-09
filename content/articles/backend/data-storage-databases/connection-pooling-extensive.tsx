"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-connection-pooling-extensive",
  title: "Connection Pooling",
  description:
    "Deep guide to connection pooling mechanics, sizing, failure modes, and operational tuning.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "connection-pooling",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "performance", "pooling"],
  relatedTopics: [
    "sql-queries-optimization",
    "concurrency-control",
    "read-replicas",
  ],
};

export default function ConnectionPoolingExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Connection pooling</strong> is the practice of maintaining a
          set of open database connections that can be reused across requests.
          It reduces the cost of connection setup (authentication, TLS, session
          initialization) and limits how many concurrent connections reach the
          database.
        </p>
        <p>
          On busy systems, opening a new connection per request is expensive
          and unstable. Pooling smooths traffic spikes, keeps latency more
          predictable, and prevents connection storms that can crash the DB.
        </p>
        <p>
          Pooling is not just an optimization; it is often a requirement to
          keep databases healthy as application concurrency grows.
        </p>
      </section>

      <section>
        <h2>How a Pool Works</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/pooling-architecture.svg"
          alt="Connection pool architecture"
          caption="Applications borrow connections from a shared pool"
        />
        <p>
          A pool holds a fixed or bounded number of connections. When a request
          arrives, it borrows a connection. When the request finishes, the
          connection is returned to the pool for reuse.
        </p>
        <p>
          If all connections are in use, the pool queues requests until a
          connection is released or a timeout occurs. This backpressure is
          critical: it prevents the database from being overloaded.
        </p>
      </section>

      <section>
        <h2>Connection Lifecycle</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/connection-lifecycle.svg"
          alt="Connection lifecycle"
          caption="Borrow, use, return, and recycle connections"
        />
        <p>
          Most pools track connection states: idle, active, and in error.
          Connections are created up to a maximum size, then recycled.
        </p>
        <p>
          Idle connections can be closed after a timeout to avoid holding
          resources unnecessarily. When a connection fails, pools drop and
          replace it to keep capacity stable.
        </p>
      </section>

      <section>
        <h2>Pool Sizing Strategy</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/pool-sizing.svg"
          alt="Pool sizing"
          caption="Pool size must fit within DB limits across all app instances"
        />
        <p>
          Pool sizing is the most important tuning decision. A good starting
          point is:
        </p>
        <ul className="space-y-2">
          <li>Find the DB max connections (e.g., 500).</li>
          <li>Reserve capacity for admin, migrations, and background jobs.</li>
          <li>Divide remaining connections across app instances.</li>
        </ul>
        <p className="mt-4">
          Example: If the DB allows 500 connections and you run 20 app servers,
          each should use a pool size around 20 to 22, leaving headroom.
        </p>
        <p>
          Too small a pool causes queueing and high latency. Too large a pool
          causes DB contention, memory pressure, and worse performance.
        </p>
      </section>

      <section>
        <h2>Timeouts and Backpressure</h2>
        <p>
          Pools should enforce timeouts for connection acquisition and query
          execution. This prevents slow queries from monopolizing connections
          and blocking the entire app.
        </p>
        <p>
          Backpressure is a feature: if the pool is saturated, requests should
          wait or fail quickly so the system can shed load gracefully instead
          of collapsing.
        </p>
      </section>

      <section>
        <h2>Pooling Modes</h2>
        <p>
          Some systems use external pooling proxies (like PgBouncer) which offer
          different pooling modes:
        </p>
        <ul className="space-y-2">
          <li><strong>Session pooling:</strong> One connection per client session.</li>
          <li><strong>Transaction pooling:</strong> Connections are reused per transaction.</li>
          <li><strong>Statement pooling:</strong> Connections reused per statement.</li>
        </ul>
        <p className="mt-4">
          Transaction pooling is common for high concurrency, but it can break
          session-level features (temporary tables, session variables).
        </p>
      </section>

      <section>
        <h2>Example: Node Pool Configuration</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 25,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  statement_timeout: 5000,
});

async function query(sql, params) {
  return pool.query(sql, params);
}`}</code>
        </pre>
        <p>
          Keep queries short and avoid long-running transactions that hold
          connections. A small pool with fast queries beats a large pool with
          slow queries.
        </p>
      </section>

      <section>
        <h2>Common Failure Modes</h2>
        <ul className="space-y-2">
          <li><strong>Connection leaks:</strong> Requests never return connections.</li>
          <li><strong>Queue buildup:</strong> Slow queries cause acquisition delays.</li>
          <li><strong>Thundering herd:</strong> Many clients reconnect after a DB restart.</li>
          <li><strong>Over-pooling:</strong> Aggregate pool size exceeds DB capacity.</li>
        </ul>
        <p className="mt-4">
          Monitoring acquisition time, queue length, and query latency is the
          fastest way to detect these issues early.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Set pool sizes based on DB limits and number of app instances.</li>
          <li>Configure idle and acquisition timeouts.</li>
          <li>Track pool usage, wait times, and error rates.</li>
          <li>Use query timeouts to prevent long-held connections.</li>
          <li>Load test to validate pool behavior under peak traffic.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
