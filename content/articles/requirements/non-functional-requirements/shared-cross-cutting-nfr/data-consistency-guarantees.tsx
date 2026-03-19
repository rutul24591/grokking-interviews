"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-data-consistency-guarantees-extensive",
  title: "Data Consistency Guarantees",
  description: "Comprehensive guide to data consistency guarantees in distributed systems, covering ACID vs BASE, transaction isolation levels, distributed transactions, and consistency patterns for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "data-consistency-guarantees",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "consistency", "transactions", "acid", "base", "distributed-systems"],
  relatedTopics: ["consistency-model", "caching-consistency", "database-selection"],
};

export default function DataConsistencyGuaranteesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Data Consistency Guarantees</strong> define what users can expect when reading and
          writing data in a system. In single-node databases, consistency is straightforward — reads return
          the most recent write. In distributed systems with replication, consistency becomes a design
          choice with significant implications for availability, latency, and complexity.
        </p>
        <p>
          The fundamental trade-off is captured by the CAP theorem: you can have at most two of Consistency,
          Availability, and Partition tolerance. Different systems make different choices based on their
          requirements.
        </p>
        <p>
          <strong>Key concepts:</strong>
        </p>
        <ul>
          <li><strong>ACID:</strong> Atomicity, Consistency, Isolation, Durability (traditional databases).</li>
          <li><strong>BASE:</strong> Basically Available, Soft state, Eventual consistency (distributed systems).</li>
          <li><strong>Isolation Levels:</strong> Read committed, repeatable read, serializable.</li>
          <li><strong>Distributed Transactions:</strong> Two-phase commit, saga pattern.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Consistency Is a Spectrum</h3>
          <p>
            Consistency isn&apos;t binary. It ranges from strong (linearizable) to weak (eventual). The
            right choice depends on use case: financial transactions need strong consistency; social media
            feeds can tolerate eventual consistency.
          </p>
        </div>
      </section>

      <section>
        <h2>ACID vs BASE</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">ACID Properties</h3>
        <ul>
          <li><strong>Atomicity:</strong> All or nothing — transaction succeeds completely or fails completely.</li>
          <li><strong>Consistency:</strong> Database moves from one valid state to another.</li>
          <li><strong>Isolation:</strong> Concurrent transactions don&apos;t interfere with each other.</li>
          <li><strong>Durability:</strong> Committed data persists even after system failure.</li>
        </ul>
        <p><strong>Use Case:</strong> Financial systems, inventory management, order processing.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">BASE Properties</h3>
        <ul>
          <li><strong>Basically Available:</strong> System available even with failures (may return stale data).</li>
          <li><strong>Soft State:</strong> State may change over time without input (due to eventual consistency).</li>
          <li><strong>Eventual Consistency:</strong> System will become consistent eventually if no new updates.</li>
        </ul>
        <p><strong>Use Case:</strong> Social media, caching layers, activity feeds, analytics.</p>
      </section>

      <section>
        <h2>Transaction Isolation Levels</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Level</th>
                <th className="p-2 text-left">Dirty Read</th>
                <th className="p-2 text-left">Non-Repeatable</th>
                <th className="p-2 text-left">Phantom</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Read Uncommitted</td>
                <td className="p-2">✓ Possible</td>
                <td className="p-2">✓ Possible</td>
                <td className="p-2">✓ Possible</td>
              </tr>
              <tr>
                <td className="p-2">Read Committed</td>
                <td className="p-2">✗ Prevented</td>
                <td className="p-2">✓ Possible</td>
                <td className="p-2">✓ Possible</td>
              </tr>
              <tr>
                <td className="p-2">Repeatable Read</td>
                <td className="p-2">✗ Prevented</td>
                <td className="p-2">✗ Prevented</td>
                <td className="p-2">✓ Possible</td>
              </tr>
              <tr>
                <td className="p-2">Serializable</td>
                <td className="p-2">✗ Prevented</td>
                <td className="p-2">✗ Prevented</td>
                <td className="p-2">✗ Prevented</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Distributed Transactions</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Two-Phase Commit (2PC)</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Prepare Phase:</strong> Coordinator asks all participants to prepare.</li>
          <li><strong>Commit Phase:</strong> If all prepare successfully, coordinator sends commit.</li>
        </ol>
        <p><strong>Pros:</strong> Strong consistency across services. <strong>Cons:</strong> Blocking, single point of failure, poor performance.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Saga Pattern</h3>
        <p>Long-running transaction as sequence of local transactions with compensating actions:</p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
{`1. Create Order
2. Reserve Inventory → If fails: Cancel Order
3. Process Payment → If fails: Release Inventory, Cancel Order
4. Ship Order → If fails: Refund Payment, Release Inventory, Cancel Order`}
        </pre>
        <p><strong>Pros:</strong> Non-blocking, works across services. <strong>Cons:</strong> Complex, no isolation.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Eventual Consistency Patterns</h3>
        <ul>
          <li><strong>Write-Ahead Log:</strong> Log writes, replay for consistency.</li>
          <li><strong>Conflict-Free Replicated Data Types (CRDTs):</strong> Mathematically guaranteed convergence.</li>
          <li><strong>Vector Clocks:</strong> Track causality, detect conflicts.</li>
          <li><strong>Quorum Reads/Writes:</strong> Read/write from multiple nodes (R + W {'>'} N).</li>
        </ul>
      </section>

      <section>
        <h2>Choosing Consistency Model</h2>
        <p>Decision framework:</p>
        <ul>
          <li><strong>Financial transactions?</strong> → Strong consistency (ACID).</li>
          <li><strong>Inventory management?</strong> → Strong consistency or careful eventual consistency.</li>
          <li><strong>Social feed?</strong> → Eventual consistency acceptable.</li>
          <li><strong>Shopping cart?</strong> → Read-your-writes consistency minimum.</li>
          <li><strong>Global distribution?</strong> → Consider eventual consistency with conflict resolution.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the CAP theorem?</p>
            <p className="mt-2 text-sm">
              A: In distributed systems, you can have at most two of: Consistency (all nodes see same data),
              Availability (every request gets response), Partition tolerance (system works despite network
              partitions). During partition, choose CP (consistency) or AP (availability).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you use saga pattern vs 2PC?</p>
            <p className="mt-2 text-sm">
              A: Use saga for long-running transactions across microservices — non-blocking, better availability.
              Use 2PC for short transactions requiring strong consistency across databases — but accept
              blocking and performance cost. Saga is preferred in microservices architecture.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What isolation level would you choose for e-commerce?</p>
            <p className="mt-2 text-sm">
              A: Read Committed for most operations (product browsing, user profiles). Repeatable Read or
              Serializable for inventory updates and order creation to prevent overselling. Use optimistic
              locking for concurrent cart updates.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle conflicts in eventual consistency?</p>
            <p className="mt-2 text-sm">
              A: Last-write-wins (simple but may lose data), vector clocks (detect conflicts), CRDTs
              (mathematical merge), application-level merge (business logic), or manual resolution for
              critical conflicts.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
