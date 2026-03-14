"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-database-monitoring-extensive",
  title: "Database Monitoring",
  description:
    "Observe database health and performance with the signals, dashboards, and runbooks that prevent app-level incidents.",
  category: "backend",
  subcategory: "monitoring-operations",
  slug: "database-monitoring",
  wordCount: 1232,
  readingTime: 5,
  lastUpdated: "2026-03-14",
  tags: ["backend", "monitoring", "database", "performance", "operations"],
  relatedTopics: ["metrics", "dashboards", "alerting", "capacity-planning"],
};

export default function DatabaseMonitoringConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Why It Matters</h2>
        <p>
          <strong>Database monitoring</strong> is the practice of measuring database behavior so you can keep application
          latency and correctness within objectives as load, data size, and query patterns evolve. Databases sit on the
          critical path for many systems: when the database slows down, the whole product often slows down. When the
          database fails, the blast radius can be total.
        </p>
        <p>
          Monitoring a database is different from monitoring a stateless service. The database has state, contention,
          and background work (compaction, vacuuming, checkpointing, replication). Many incidents are not “hard down”
          failures; they are progressive degradations: rising lock wait, growing replication lag, slowly increasing disk
          usage, or a small query regression that pushes p99 over the edge.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">What You Want to Prevent</h3>
          <ul className="space-y-2">
            <li>Connection exhaustion that cascades into timeouts across services.</li>
            <li>Lock contention and long transactions that cause tail-latency spikes.</li>
            <li>Disk full or IOPS saturation that turns a busy system into a failing system.</li>
            <li>Replication lag that causes stale reads, failed failovers, or data-loss risk.</li>
            <li>Slow query regressions introduced by schema changes or releases.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Monitoring Scope: Two Views of the Same System</h2>
        <p>
          A useful database monitoring program has two complementary views. The first is the <strong>inside-out</strong>{" "}
          view: what the database sees (queries, locks, buffers, I/O, replication). The second is the{" "}
          <strong>outside-in</strong> view: what applications experience (request latency, error rate, pool wait time).
          Incidents often look different depending on the viewpoint.
        </p>
        <p>
          A classic example: application p99 latency climbs, but database CPU looks normal. Inside-out metrics might show
          lock wait or connection pool queueing instead. If you only watch CPU, you miss the real bottleneck.
        </p>
        <ArticleImage
          src="/diagrams/backend/monitoring-operations/database-monitoring-diagram-1.svg"
          alt="Database monitoring overview: app symptoms and database internals"
          caption="Two views: app-level symptoms and database internals (locks, I/O, replication, query behavior)."
        />
      </section>

      <section>
        <h2>Golden Signals for Databases</h2>
        <p>
          Database “golden signals” map to how databases fail: queueing, contention, and storage pressure. These signals
          should be tracked over time and segmented where it helps decisions (by role: primary vs replica; by workload:
          read vs write).
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Query latency distribution:</strong> p95/p99 by query class, not just averages.
          </li>
          <li>
            <strong>Throughput:</strong> transactions per second, reads/writes, and queue depth when applicable.
          </li>
          <li>
            <strong>Errors:</strong> timeouts, deadlocks, serialization failures, and constraint violations.
          </li>
          <li>
            <strong>Contention:</strong> lock wait time, blocked queries, long-running transactions.
          </li>
          <li>
            <strong>Resources:</strong> CPU, memory, buffer/cache hit ratio, disk usage, and IOPS/latency.
          </li>
          <li>
            <strong>Replication health:</strong> lag, replay delay, and replication slot pressure where applicable.
          </li>
        </ul>
        <p className="mt-4">
          Treat these as a system. For example, high throughput with increasing latency and stable CPU often indicates
          queueing, lock contention, or storage issues. High CPU with stable latency can be fine. The “shape” of signals
          matters more than any single chart.
        </p>
      </section>

      <section>
        <h2>Query-Centric Observability</h2>
        <p>
          Many database incidents are query incidents. A new query plan, a missing index, or a schema migration can turn
          a small workload change into a large tail-latency impact. That’s why query-centric monitoring is essential:
          know which query classes dominate time and which queries changed recently.
        </p>
        <p>
          Strong programs track “top queries by total time” and “top queries by p99 latency,” with enough fingerprinting
          to avoid cardinality explosions. They also connect query changes to deployments and migrations so teams can
          quickly answer “what introduced this regression.”
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">What to Capture (Conceptually)</h3>
          <ul className="space-y-2">
            <li>Query fingerprints (normalized form) and their latency percentiles.</li>
            <li>Rows scanned/returned and error rates by fingerprint.</li>
            <li>Plan changes or plan cache churn indicators where available.</li>
            <li>Slow query sampling to correlate with app traces and releases.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Contention, Locks, and Long Transactions</h2>
        <p>
          Locking and contention are common root causes of database tail-latency spikes. A single long transaction can
          block many short ones, turning a healthy system into a queueing system. Monitoring should surface both the
          symptom (lock wait time rising) and the culprit (which transaction/query is holding locks).
        </p>
        <p>
          The key operational principle is to keep transactions short and predictable. Monitoring supports this by
          highlighting long-running queries, long open transactions, and the most frequent deadlock patterns.
        </p>
        <ArticleImage
          src="/diagrams/backend/monitoring-operations/database-monitoring-diagram-2.svg"
          alt="Lock contention and long transaction diagram"
          caption="Contention model: long transactions and lock waits amplify tail latency for unrelated requests."
        />
      </section>

      <section>
        <h2>Replication and High Availability Signals</h2>
        <p>
          Replication health is both a correctness and availability concern. Lag can cause stale reads, violate business
          expectations, and complicate failovers. Monitoring should distinguish between “small, expected lag” and “lag
          that threatens recovery objectives.”
        </p>
        <p>
          HA monitoring also includes failover readiness: can replicas take over, are they caught up, and is the system
          configured so a failover does not create a second incident (connection storms, cache misses, warm-up delays)?
        </p>
        <ul className="mt-4 space-y-2">
          <li>Lag and replay delay by replica; watch for sustained drift under peak.</li>
          <li>Replication bandwidth and write amplification during spikes.</li>
          <li>Health of read routing policies (are reads going where you expect?).</li>
          <li>Failover signals: primary health, replica readiness, and client reconnection patterns.</li>
        </ul>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <p>
          Database incidents are often fast-moving because many services share the same dependency. A playbook should
          favor safe stabilizations first and avoid changes that amplify load (such as increasing client concurrency).
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Triage Steps</h3>
          <ol className="space-y-2">
            <li>
              <strong>Confirm impact:</strong> app latency/errors and connection pool wait time indicate DB involvement.
            </li>
            <li>
              <strong>Identify the bottleneck:</strong> locks vs CPU vs I/O vs connection exhaustion vs replication lag.
            </li>
            <li>
              <strong>Stabilize:</strong> shed load, reduce fanout, or apply rate limits to protect the database.
            </li>
            <li>
              <strong>Isolate:</strong> find top query fingerprints and long transactions; correlate with recent changes.
            </li>
            <li>
              <strong>Mitigate:</strong> rollback a migration, kill a runaway query, shift reads to replicas, or add
              capacity if appropriate.
            </li>
            <li>
              <strong>Verify:</strong> watch tail latency and lock wait recover; ensure replication catches up.
            </li>
          </ol>
        </div>
        <p>
          A recurring incident pattern is “connection storms.” When latency rises, clients retry and open more
          connections, which increases contention and makes recovery harder. The safest mitigations typically involve
          reducing demand (admission control, backoff) and protecting the database from retry amplification.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Governance</h2>
        <p>
          Databases concentrate risk. Governance reduces that risk by making changes safer: migration review, index
          strategy, query budgets, and capacity reviews. Monitoring is the feedback loop that tells you whether governance
          works.
        </p>
        <ArticleImage
          src="/diagrams/backend/monitoring-operations/database-monitoring-diagram-3.svg"
          alt="Database monitoring governance and failover diagram"
          caption="Governance: change control, query budgets, and failover readiness prevent predictable database incidents."
        />
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Change control:</strong> schema changes and migrations must be observable and reversible.
          </li>
          <li>
            <strong>Query budgets:</strong> enforce constraints on query cost per request for critical flows.
          </li>
          <li>
            <strong>Capacity targets:</strong> define headroom and verify it with tests and production signals.
          </li>
          <li>
            <strong>Reliability over heroics:</strong> runbooks and safe levers beat ad-hoc tuning during incidents.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough</h2>
        <p>
          A release introduces a query regression on a critical endpoint. App dashboards show p99 latency rising and
          timeouts increasing. Database monitoring shows lock wait time increasing and a surge in a specific query
          fingerprint’s latency.
        </p>
        <p>
          Responders stabilize by rate limiting the endpoint and rolling back the release. Then they confirm recovery: lock
          wait returns to baseline and replication lag stabilizes. In follow-up, the team adds a panel for “top queries by
          total time,” sets a statement timeout for the risky query class, and updates the release checklist to include
          query plan validation for that route.
        </p>
        <p>
          The long-term fix is to make the system resistant to similar regressions: query budgets, safer migrations, and
          a faster rollback path.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use this checklist to keep database monitoring actionable.</p>
        <ul className="mt-4 space-y-2">
          <li>Track query latency distributions, not just averages; surface top queries by time and by p99.</li>
          <li>Monitor contention: lock wait time, long transactions, deadlocks.</li>
          <li>Watch resource pressure: disk usage, I/O latency, buffer/cache effectiveness.</li>
          <li>Monitor replication: lag, replay delay, and failover readiness signals.</li>
          <li>Link app symptoms (pool wait, timeouts) to DB internals with consistent correlation identifiers.</li>
          <li>Maintain safe runbooks: stabilize first, then isolate, then fix permanently.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>Emphasize how you connect app impact to database internals and safe mitigations.</p>
        <ul className="mt-4 space-y-2">
          <li>What are the most important database signals for latency and correctness?</li>
          <li>How do you detect and resolve lock contention incidents?</li>
          <li>How do you monitor replication health and decide alert thresholds?</li>
          <li>Why can increasing connection pools make incidents worse?</li>
          <li>Describe a database incident and how you stabilized and diagnosed it.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

