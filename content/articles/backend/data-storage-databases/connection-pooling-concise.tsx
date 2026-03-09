"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-connection-pooling-concise",
  title: "Connection Pooling",
  description:
    "Concise guide to database connection pooling, sizing, and troubleshooting for backend interviews.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "connection-pooling",
  version: "concise",
  wordCount: 1900,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "performance", "pooling"],
  relatedTopics: [
    "sql-queries-optimization",
    "concurrency-control",
    "read-replicas",
  ],
};

export default function ConnectionPoolingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Connection pooling</strong> keeps a reusable set of database
          connections open so application requests can borrow them instead of
          creating a new connection every time. This reduces connection overhead,
          improves latency, and prevents a database from being overwhelmed by
          too many concurrent connections.
        </p>
        <p>
          Without pooling, applications often open and close connections per
          request, which is expensive and causes connection storms under load.
          Pooling makes database access predictable and protects the database
          by enforcing a maximum number of open connections.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Pool size:</strong> Maximum active connections; should match
            DB capacity and workload.
          </li>
          <li>
            <strong>Idle connections:</strong> Kept open for reuse but closed
            after a timeout.
          </li>
          <li>
            <strong>Borrow/return:</strong> Requests acquire a connection and
            release it back to the pool.
          </li>
          <li>
            <strong>Queueing:</strong> When pool is exhausted, requests wait or fail.
          </li>
          <li>
            <strong>Timeouts:</strong> Prevent slow queries from holding connections too long.
          </li>
          <li>
            <strong>Leak detection:</strong> Identifies connections not returned to the pool.
          </li>
        </ul>
        <p className="mt-4">
          A good pool size balances throughput with database limits. Too small
          causes queues; too large causes DB contention and memory pressure.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Node + pg pooling
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function getUser(id) {
  const result = await pool.query(
    "SELECT id, email FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                ✓ Lower connection overhead<br />
                ✓ Stable latency under load<br />
                ✓ Protects DB from connection storms<br />
                ✓ Predictable resource usage
              </td>
              <td className="p-3">
                ✗ Mis-sized pools cause queues or contention<br />
                ✗ Requires monitoring and tuning<br />
                ✗ Leaks can exhaust the pool<br />
                ✗ Harder to debug long waits
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use connection pooling when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Multiple app instances share a single database</li>
          <li>• Request traffic is bursty or unpredictable</li>
          <li>• You need to cap concurrent DB connections</li>
        </ul>
        <p><strong>Be cautious when:</strong></p>
        <ul className="space-y-1">
          <li>• Each request runs long queries and holds connections</li>
          <li>• The DB has a very small max connection limit</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain why per-request connections are expensive.</li>
          <li>Discuss how to pick a pool size relative to DB capacity.</li>
          <li>Highlight timeouts and leak detection as safety tools.</li>
          <li>Distinguish between app-level pooling and external proxies.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What happens when the pool is exhausted?</p>
            <p className="mt-2 text-sm">
              A: Requests queue or fail. Latency rises and you may see timeout
              errors if queries hold connections too long.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you choose the pool size?</p>
            <p className="mt-2 text-sm">
              A: Start with DB max connections minus background usage, then
              divide across app instances. Tune based on latency and queueing.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why not set pool size to a huge number?</p>
            <p className="mt-2 text-sm">
              A: Too many connections increase DB contention, memory usage, and
              context switching, often making performance worse.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a connection leak?</p>
            <p className="mt-2 text-sm">
              A: A connection that is borrowed and never returned, eventually
              exhausting the pool.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
