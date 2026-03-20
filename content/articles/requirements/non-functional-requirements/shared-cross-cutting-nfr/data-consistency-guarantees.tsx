"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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
          writing data in a system. In single-node databases, consistency is straightforward—reads return
          the most recent write. In distributed systems with replication, consistency becomes a design
          choice with significant implications for availability, latency, and complexity. For staff and
          principal engineers, understanding these trade-offs is essential for designing systems that meet
          business requirements while scaling effectively.
        </p>
        <p>
          The fundamental trade-off is captured by the CAP theorem: you can have at most two of Consistency,
          Availability, and Partition tolerance. Different systems make different choices based on their
          requirements. The key is choosing the right consistency model for your specific use case—not all
          data requires strong consistency.
        </p>
        <p>
          <strong>Key concepts:</strong>
        </p>
        <ul>
          <li><strong>ACID:</strong> Atomicity, Consistency, Isolation, Durability (traditional databases).</li>
          <li><strong>BASE:</strong> Basically Available, Soft state, Eventual consistency (distributed systems).</li>
          <li><strong>Isolation Levels:</strong> Read committed, repeatable read, serializable.</li>
          <li><strong>Distributed Transactions:</strong> Two-phase commit, saga pattern.</li>
          <li><strong>Consistency Models:</strong> Linearizable, sequential, causal, eventual.</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/consistency-models-comparison.svg"
          alt="Consistency Models comparison showing different guarantees"
          caption="Consistency Models Spectrum: From strong (linearizable) to weak (eventual) consistency with their guarantees, latency implications, and use cases."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Consistency Is a Spectrum</h3>
          <p>
            Consistency isn&apos;t binary. It ranges from strong (linearizable) to weak (eventual). The
            right choice depends on use case: financial transactions need strong consistency; social media
            feeds can tolerate eventual consistency. Choose the weakest consistency that meets requirements
            for maximum availability and performance.
          </p>
        </div>
      </section>

      <section>
        <h2>ACID vs BASE</h2>
        <p>
          These represent two fundamentally different approaches to data consistency, each suited to
          different use cases.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">ACID Properties</h3>
        <p>
          ACID guarantees strong consistency and is the foundation of traditional relational databases.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Atomicity</h4>
        <p>
          All operations in a transaction succeed or all fail—no partial completion. If any part of the
          transaction fails, the entire transaction is rolled back.
        </p>
        <p><strong>Example:</strong> Bank transfer—debit from account A and credit to account B either
        both happen or neither happens.</p>

        <h4 className="mt-4 mb-2 font-semibold">Consistency</h4>
        <p>
          Database moves from one valid state to another. All constraints, triggers, and rules are
          enforced. Invalid transactions are rejected.
        </p>
        <p><strong>Example:</strong> Foreign key constraints prevent orphaned records; check constraints
        prevent invalid values.</p>

        <h4 className="mt-4 mb-2 font-semibold">Isolation</h4>
        <p>
          Concurrent transactions don&apos;t interfere with each other. Each transaction appears to execute
          in isolation, even when running concurrently.
        </p>
        <p><strong>Example:</strong> Two users updating the same record simultaneously don&apos;t see
        each other&apos;s intermediate states.</p>

        <h4 className="mt-4 mb-2 font-semibold">Durability</h4>
        <p>
          Once a transaction commits, the data persists even after system failure. Committed data is
          written to durable storage (disk, replicated).
        </p>
        <p><strong>Example:</strong> After order confirmation, order persists even if server crashes
        immediately.</p>

        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Financial systems (banking, payments, trading)</li>
          <li>Inventory management (prevent overselling)</li>
          <li>Order processing</li>
          <li>Booking systems (flights, hotels)</li>
          <li>Any system where data correctness is critical</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">BASE Properties</h3>
        <p>
          BASE sacrifices strong consistency for availability and partition tolerance. Common in
          distributed NoSQL databases.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Basically Available</h4>
        <p>
          System remains available even during failures. May return stale data rather than failing.
          Prioritizes availability over consistency.
        </p>
        <p><strong>Example:</strong> Social media feed shows slightly stale data but is always available.</p>

        <h4 className="mt-4 mb-2 font-semibold">Soft State</h4>
        <p>
          State may change over time without new input, due to eventual consistency processes. No
          guarantee that state is stable at any moment.
        </p>
        <p><strong>Example:</strong> Replica may have different data than primary until replication completes.</p>

        <h4 className="mt-4 mb-2 font-semibold">Eventual Consistency</h4>
        <p>
          System will become consistent eventually if no new updates are made. Convergence time depends
          on replication lag, conflict resolution.
        </p>
        <p><strong>Example:</strong> DNS propagation—changes take time to reach all servers.</p>

        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Social media feeds</li>
          <li>Caching layers</li>
          <li>Activity feeds and notifications</li>
          <li>Analytics and reporting</li>
          <li>Content management (blogs, comments)</li>
          <li>Shopping carts (with read-your-writes)</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/distributed-transactions.svg"
          alt="Distributed Transaction Patterns comparison"
          caption="Distributed Transactions: Comparing 2PC (strong consistency, blocking) vs Saga (eventual consistency, non-blocking) patterns."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Hybrid Approaches</h3>
          <p>
            Real systems often combine ACID and BASE. Use ACID for critical operations (payments, inventory)
            and BASE for non-critical (feeds, analytics). Microservices may use ACID within services and
            eventual consistency between services.
          </p>
        </div>
      </section>

      <section>
        <h2>Transaction Isolation Levels</h2>
        <p>
          Isolation levels define how concurrent transactions interact. Higher isolation prevents more
          anomalies but reduces concurrency and performance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Concurrency Anomalies</h3>
        <h4 className="mt-4 mb-2 font-semibold">Dirty Read</h4>
        <p>
          Reading uncommitted data from another transaction. If that transaction rolls back, you&apos;ve
          read data that never existed.
        </p>
        <p><strong>Example:</strong> Transaction A reads value X=100. Transaction B updates X to 200 but
        hasn&apos;t committed. Transaction A reads X=200. Transaction B rolls back. Transaction A has
        read &quot;dirty&quot; data.</p>

        <h4 className="mt-4 mb-2 font-semibold">Non-Repeatable Read</h4>
        <p>
          Reading different values for the same row in the same transaction. Another transaction modified
          the row between reads.
        </p>
        <p><strong>Example:</strong> Transaction A reads X=100. Transaction B updates X to 200 and commits.
        Transaction A reads X again, gets 200. Same query, different results.</p>

        <h4 className="mt-4 mb-2 font-semibold">Phantom Read</h4>
        <p>
          Getting different number of rows for the same query. Another transaction inserted or deleted
          matching rows.
        </p>
        <p><strong>Example:</strong> Transaction A queries &quot;SELECT * FROM orders WHERE status=&apos;pending&apos;&quot;
        and gets 10 rows. Transaction B inserts a new pending order and commits. Transaction A runs same
        query, gets 11 rows—a &quot;phantom&quot; row appeared.</p>

        <h4 className="mt-4 mb-2 font-semibold">Lost Update</h4>
        <p>
          Two transactions read same value, both update, one update is lost.
        </p>
        <p><strong>Example:</strong> Transaction A reads X=100. Transaction B reads X=100. Transaction A
        updates X to 150. Transaction B updates X to 120. Transaction A&apos;s update is lost.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SQL Isolation Levels</h3>
        <h4 className="mt-4 mb-2 font-semibold">Read Uncommitted</h4>
        <p>Lowest isolation. Allows dirty reads, non-repeatable reads, and phantom reads.</p>
        <p><strong>Use:</strong> Rarely used. Maybe for approximate analytics where accuracy doesn&apos;t matter.</p>

        <h4 className="mt-4 mb-2 font-semibold">Read Committed</h4>
        <p>
          Default in most databases (PostgreSQL, Oracle, SQL Server). Prevents dirty reads. Allows
          non-repeatable reads and phantom reads.
        </p>
        <p><strong>Use:</strong> Most OLTP workloads. Product browsing, user profiles, general queries.</p>

        <h4 className="mt-4 mb-2 font-semibold">Repeatable Read</h4>
        <p>
          Default in MySQL. Prevents dirty reads and non-repeatable reads. Phantom reads may still occur
          (though MySQL InnoDB prevents them with gap locking).
        </p>
        <p><strong>Use:</strong> When you need consistent reads within a transaction. Reporting, batch
        processing.</p>

        <h4 className="mt-4 mb-2 font-semibold">Serializable</h4>
        <p>
          Highest isolation. Prevents all anomalies. Transactions execute as if serial (one at a time).
          Significant performance cost.
        </p>
        <p><strong>Use:</strong> Critical financial operations, inventory management, when correctness
        is paramount.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Database-Specific Behavior</h3>
        <p>
          Isolation level implementation varies by database:
        </p>
        <ul>
          <li><strong>PostgreSQL:</strong> Read Committed (default), Repeatable Read, Serializable.</li>
          <li><strong>MySQL:</strong> Read Committed, Repeatable Read (default), Serializable.</li>
          <li><strong>Oracle:</strong> Read Committed (default), Serializable, Read Only.</li>
          <li><strong>SQL Server:</strong> Read Uncommitted, Read Committed (default), Repeatable Read,
          Serializable, Snapshot.</li>
          <li><strong>CockroachDB:</strong> Serializable only (always serializable).</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Choose Minimum Required Isolation</h3>
          <p>
            Higher isolation means more locking, less concurrency, higher latency. Choose the minimum
            isolation that prevents the anomalies your use case cares about. Read Committed is sufficient
            for most workloads.
          </p>
        </div>
      </section>

      <section>
        <h2>Distributed Transactions</h2>
        <p>
          When data spans multiple services or databases, maintaining consistency requires distributed
          transaction patterns.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Two-Phase Commit (2PC)</h3>
        <p>
          Coordinator-based protocol for atomic commits across multiple participants.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Phase 1: Prepare</h4>
        <ol>
          <li>Coordinator sends &quot;prepare&quot; to all participants</li>
          <li>Each participant prepares transaction (acquires locks, writes to log)</li>
          <li>Participant responds &quot;ready&quot; or &quot;abort&quot;</li>
        </ol>
        <h4 className="mt-4 mb-2 font-semibold">Phase 2: Commit</h4>
        <ol>
          <li>If all participants ready, coordinator sends &quot;commit&quot;</li>
          <li>If any participant aborts, coordinator sends &quot;abort&quot;</li>
          <li>Participants complete transaction, release locks</li>
          <li>Participants acknowledge completion</li>
        </ol>
        <h4 className="mt-4 mb-2 font-semibold">Pros</h4>
        <ul>
          <li>Strong consistency across participants</li>
          <li>Atomic—either all commit or all abort</li>
          <li>Well-understood, standardized protocol</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Cons</h4>
        <ul>
          <li>Blocking—participants hold locks during entire protocol</li>
          <li>Single point of failure (coordinator)</li>
          <li>Poor performance (multiple round trips)</li>
          <li>Doesn&apos;t scale to many participants</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Cross-database transactions in same datacenter</li>
          <li>When strong consistency is required</li>
          <li>Short transactions with few participants</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Saga Pattern</h3>
        <p>
          Long-running transaction as sequence of local transactions with compensating actions for rollback.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Choreography Approach</h4>
        <p>
          Each service publishes events. Other services listen and react. No central coordinator.
        </p>
        <p><strong>Flow:</strong> Order Service creates order → Inventory Service reserves inventory →
        Payment Service processes payment → Shipping Service ships order. If payment fails, Inventory
        Service receives failure event and releases reservation.</p>

        <h4 className="mt-4 mb-2 font-semibold">Orchestration Approach</h4>
        <p>
          Central orchestrator coordinates all steps. More control, easier to understand flow.
        </p>
        <p><strong>Flow:</strong> Orchestrator tells Order Service to create order → tells Inventory
        Service to reserve → tells Payment Service to process → tells Shipping Service to ship. On
        failure, orchestrator executes compensating actions in reverse order.</p>

        <h4 className="mt-4 mb-2 font-semibold">Compensating Actions</h4>
        <p>
          Each step has a compensating action that undoes it:
        </p>
        <ul>
          <li>Create Order → Cancel Order</li>
          <li>Reserve Inventory → Release Inventory</li>
          <li>Process Payment → Refund Payment</li>
          <li>Ship Order → Initiate Return</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Pros</h4>
        <ul>
          <li>Non-blocking—no distributed locks</li>
          <li>Works across microservices</li>
          <li>Better availability than 2PC</li>
          <li>Scales to many participants</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Cons</h4>
        <ul>
          <li>Eventual consistency (not atomic)</li>
          <li>Complex—must design compensating actions</li>
          <li>No isolation (concurrent sagas may interfere)</li>
          <li>Debugging is harder</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>E-commerce order fulfillment</li>
          <li>Travel booking (flight + hotel + car)</li>
          <li>Multi-service workflows</li>
          <li>Long-running business processes</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Eventual Consistency Patterns</h3>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/slo-error-budget-policy.svg"
          alt="SLO Error Budget Policy showing consistency vs availability trade-offs"
          caption="SLO Error Budget Policy: Balancing consistency requirements with availability targets through error budget management."
        />

        <h4 className="mt-4 mb-2 font-semibold">Write-Ahead Log (WAL)</h4>
        <p>
          Log all writes before applying. Replicas replay log to achieve consistency.
        </p>
        <p><strong>Use:</strong> Database replication, change data capture.</p>

        <h4 className="mt-4 mb-2 font-semibold">Conflict-Free Replicated Data Types (CRDTs)</h4>
        <p>
          Data structures designed to converge automatically. Mathematical guarantees of eventual
          consistency without coordination.
        </p>
        <p><strong>Types:</strong> Counters (G-Counter, PN-Counter), Sets (G-Set, 2P-Set), Registers
        (LWW-Register), Maps.</p>
        <p><strong>Use:</strong> Collaborative editing, distributed counters, shopping carts.</p>

        <h4 className="mt-4 mb-2 font-semibold">Vector Clocks</h4>
        <p>
          Track causality between events. Detect concurrent updates and conflicts.
        </p>
        <p><strong>Use:</strong> DynamoDB (internally), Riak, conflict detection.</p>

        <h4 className="mt-4 mb-2 font-semibold">Quorum Reads/Writes</h4>
        <p>
          Read from R nodes, write to W nodes, total N replicas. Consistency when R + W &gt; N.
        </p>
        <p><strong>Example:</strong> N=3, W=2, R=2. Write to 2 of 3, read from 2 of 3. At least one
        node has latest value.</p>
        <p><strong>Use:</strong> Dynamo-style databases, Cassandra, configurable consistency.</p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Saga Is the Microservices Pattern</h3>
          <p>
            For microservices, saga is the practical choice for distributed transactions. 2PC couples
            services too tightly. Saga accepts eventual consistency but provides atomicity through
            compensating actions. Design compensating actions carefully—they&apos;re your rollback plan.
          </p>
        </div>
      </section>

      <section>
        <h2>Choosing Consistency Model</h2>
        <p>
          Consistency decisions should be driven by business requirements, not technology preferences.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Decision Framework</h3>
        <h4 className="mt-4 mb-2 font-semibold">Questions to Ask</h4>
        <ul>
          <li>What happens if a user reads stale data?</li>
          <li>Can two users safely make conflicting updates?</li>
          <li>Is availability more important than consistency?</li>
          <li>What are the business costs of inconsistency?</li>
          <li>What are the business costs of unavailability?</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Strong Consistency When</h4>
        <ul>
          <li>Financial transactions (payments, transfers)</li>
          <li>Inventory management (prevent overselling)</li>
          <li>Booking systems (seats, rooms—can&apos;t double-book)</li>
          <li>Identity and access control</li>
          <li>Legal/regulatory requirements</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Eventual Consistency When</h4>
        <ul>
          <li>Social media feeds (slightly stale is acceptable)</li>
          <li>Analytics and reporting (approximate is fine)</li>
          <li>Caching layers (stale cache is better than no cache)</li>
          <li>Activity feeds and notifications</li>
          <li>Content management (blogs, comments, wiki)</li>
          <li>Product catalogs (price changes can propagate)</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Read-Your-Writes When</h4>
        <ul>
          <li>User settings and preferences</li>
          <li>Shopping carts</li>
          <li>Draft content (documents, posts)</li>
          <li>Any user-facing feature where users expect to see their changes</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Document Consistency Choices</h3>
          <p>
            Document which data uses which consistency model. This helps engineers make correct decisions
            when adding features. &quot;Inventory uses strong consistency—don&apos;t cache without
            invalidation.&quot; &quot;Product reviews use eventual consistency—stale reads acceptable.&quot;
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <h3 className="mt-8 mb-4 text-xl font-semibold">Design</h3>
        <ul>
          <li>Choose consistency per data type, not one-size-fits-all</li>
          <li>Document consistency requirements clearly</li>
          <li>Design for the weakest consistency that works</li>
          <li>Consider read-your-writes for user-facing features</li>
          <li>Plan for conflicts in eventual consistency systems</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implementation</h3>
        <ul>
          <li>Use optimistic locking for concurrent updates</li>
          <li>Implement idempotent operations for retries</li>
          <li>Design compensating actions for sagas</li>
          <li>Use version vectors for conflict detection</li>
          <li>Test concurrent scenarios thoroughly</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <ul>
          <li>Monitor replication lag</li>
          <li>Track consistency violations</li>
          <li>Alert on transaction failures</li>
          <li>Track saga completion rates</li>
          <li>Monitor recovery time</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing</h3>
        <ul>
          <li>Test concurrent transactions</li>
          <li>Test failure scenarios (network partitions, node failures)</li>
          <li>Test saga compensating actions</li>
          <li>Test conflict resolution</li>
          <li>Chaos engineering for distributed consistency</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>
            <strong>Over-engineering consistency:</strong> Using strong consistency when eventual is
            fine. Fix: Choose weakest consistency that meets requirements.
          </li>
          <li>
            <strong>Under-engineering consistency:</strong> Using eventual when strong is needed. Fix:
            Understand business requirements, document consistency needs.
          </li>
          <li>
            <strong>Ignoring conflicts:</strong> Assuming conflicts won&apos;t happen. Fix: Plan conflict
            detection and resolution.
          </li>
          <li>
            <strong>No compensating actions:</strong> Sagas without rollback plan. Fix: Design compensating
            actions for every step.
          </li>
          <li>
            <strong>Wrong isolation level:</strong> Using default when different level is needed. Fix:
            Choose isolation per use case.
          </li>
          <li>
            <strong>Not testing concurrency:</strong> Only testing single-threaded. Fix: Test concurrent
            scenarios, use chaos engineering.
          </li>
          <li>
            <strong>Assuming 2PC works for microservices:</strong> 2PC couples services too tightly. Fix:
            Use saga pattern for microservices.
          </li>
          <li>
            <strong>Ignoring replication lag:</strong> Assuming replicas are always current. Fix: Monitor
            lag, design for stale reads.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the CAP theorem?</p>
            <p className="mt-2 text-sm">
              A: In distributed systems, you can have at most two of: Consistency (all nodes see same data
              at same time), Availability (every request gets response), Partition tolerance (system works
              despite network partitions). During network partition, must choose CP (consistency—reject
              requests) or AP (availability—may return stale data).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you use saga pattern vs 2PC?</p>
            <p className="mt-2 text-sm">
              A: Use saga for long-running transactions across microservices—non-blocking, better availability,
              works across service boundaries. Use 2PC for short transactions requiring strong consistency
              across databases in same datacenter—but accept blocking and performance cost. Saga is preferred
              in microservices architecture.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What isolation level would you choose for e-commerce?</p>
            <p className="mt-2 text-sm">
              A: Read Committed for most operations (product browsing, user profiles). Repeatable Read or
              Serializable for inventory updates and order creation to prevent overselling. Use optimistic
              locking for concurrent cart updates. Choose minimum isolation that prevents anomalies you
              care about.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle conflicts in eventual consistency?</p>
            <p className="mt-2 text-sm">
              A: Last-write-wins with timestamps (simple but may lose data). Vector clocks to detect
              conflicts. CRDTs for mathematical merge guarantees. Application-level merge using business
              logic. Manual resolution for critical conflicts. Choose based on data criticality and
              conflict frequency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure read-your-writes consistency?</p>
            <p className="mt-2 text-sm">
              A: Include version token in cache key, increment on write. Use sticky sessions to same cache
              server. Read from master database for short window after write. Or use user-specific cache
              keys. Choose based on complexity tolerance and performance requirements.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a quorum read/write?</p>
            <p className="mt-2 text-sm">
              A: Read from R nodes, write to W nodes, total N replicas. Consistency guaranteed when
              R + W &gt; N. Example: N=3, W=2, R=2. Write to 2 of 3, read from 2 of 3—guaranteed overlap.
              Allows tuning consistency vs availability. Used in Dynamo, Cassandra.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>&quot;Designing Data-Intensive Applications&quot; by Martin Kleppmann</li>
          <li>Google Spanner Paper: Globally distributed, externally consistent database</li>
          <li>Amazon Dynamo Paper: Eventual consistency, quorum reads/writes</li>
          <li>&quot;Data on the Outside vs Data on the Inside&quot; by Pat Helland</li>
          <li>Saga Pattern: Microservices transaction pattern</li>
          <li>CRDTs: Conflict-Free Replicated Data Types</li>
          <li>CAP Theorem: Original paper by Eric Brewer</li>
          <li>Database Isolation Levels: ANSI SQL standard</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
