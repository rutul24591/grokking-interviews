"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-consistency-model-extensive",
  title: "Consistency Model",
  description: "Comprehensive guide to consistency models in distributed systems, covering strong/eventual/causal consistency, CAP theorem, conflict resolution, and consistency trade-offs for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "consistency-model",
  version: "extensive",
  wordCount: 11000,
  readingTime: 44,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "consistency", "cap-theorem", "distributed-systems", "eventual-consistency", "strong-consistency"],
  relatedTopics: ["high-availability", "latency-slas", "fault-tolerance-resilience", "database-selection"],
};

export default function ConsistencyModelArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          A <strong>consistency model</strong> defines the guarantees a system provides about how and when
          updates to data become visible to clients. It is a contract between the system and its users about
          the behavior of reads and writes in a distributed environment.
        </p>
        <p>
          In single-node systems, consistency is trivial — reads always see the most recent write. In
          distributed systems with replication, consistency becomes complex: when multiple copies of data
          exist, which copy does a read return? What happens when two clients write to different replicas
          simultaneously?
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Consistency is a Spectrum</h3>
          <p>
            Consistency is not binary (consistent vs inconsistent). It is a spectrum from <strong>strong
            consistency</strong> (all reads see the most recent write) to <strong>weak consistency</strong>
            (no guarantees about what reads return).
          </p>
          <p className="mt-3">
            <strong>There is no &quot;best&quot; consistency model</strong> — only the right model for your
            use case. Choosing a consistency model is a trade-off between correctness, availability, and latency.
          </p>
        </div>

        <p>
          <strong>Why consistency matters in interviews:</strong>
        </p>
        <ul>
          <li>
            <strong>Business impact:</strong> Wrong consistency choices cause real problems (overselling inventory,
            double-spending, incorrect balances).
          </li>
          <li>
            <strong>Architecture driver:</strong> Consistency requirements dictate database choice, replication
            strategy, and system design.
          </li>
          <li>
            <strong>Trade-off articulation:</strong> Discussing consistency shows you understand distributed
            systems fundamentals.
          </li>
        </ul>

        <p>
          This article covers the full spectrum of consistency models, the CAP theorem, conflict resolution
          strategies, and how to choose the right model for your use case.
        </p>
      </section>

      <section>
        <h2>Consistency Models Spectrum</h2>
        <p>
          Consistency models range from strongest (most guarantees) to weakest (fewest guarantees). Stronger
          consistency provides more intuitive behavior but costs more in latency and availability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/consistency-models-spectrum.svg"
          alt="Consistency Models Spectrum"
          caption="Consistency Models Spectrum — showing the range from strong consistency (linearizable) to weak consistency, with CAP theorem trade-offs"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Strong Consistency (Linearizability)</h3>
        <p>
          <strong>Strong consistency</strong> (also called <strong>linearizability</strong>) guarantees that
          once a write completes, all subsequent reads (from any node) return that value or a later value.
          The system appears as a single, atomic data store.
        </p>
        <p>
          <strong>Formal definition:</strong> There exists a total order of all operations such that:
        </p>
        <ul>
          <li>Operations appear to execute atomically at some point between invocation and response.</li>
          <li>The order respects real-time causality (if operation A completes before B starts, A appears before B).</li>
        </ul>
        <p>
          <strong>Example:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Client A writes x = 5 (completes at t=100ms)</li>
          <li>Client B reads x at t=150ms → must return 5 (or later value)</li>
          <li>Client C reads x at t=200ms → must return 5 (or later value)</li>
        </ol>
        <p>
          <strong>Use cases:</strong>
        </p>
        <ul>
          <li>Financial transactions (bank transfers, payments)</li>
          <li>Inventory management (prevent overselling)</li>
          <li>Authentication/authorization (token validation)</li>
          <li>Lock services (distributed coordination)</li>
        </ul>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Intuitive behavior — easiest to reason about</li>
          <li>✓ Prevents anomalies (no stale reads, no conflicts)</li>
          <li>✗ Higher latency — requires synchronous replication or consensus</li>
          <li>✗ Reduced availability — may reject requests during partitions</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sequential Consistency</h3>
        <p>
          <strong>Sequential consistency</strong> guarantees that all clients see the same order of operations,
          but that order may not reflect real-time ordering.
        </p>
        <p>
          <strong>Formal definition:</strong> There exists a total order of all operations such that:
        </p>
        <ul>
          <li>Operations from each client appear in program order.</li>
          <li>All clients see the same total order.</li>
        </ul>
        <p>
          <strong>Key difference from linearizability:</strong> Sequential consistency does not require
          real-time ordering. If Client A writes at t=100ms and Client B writes at t=150ms, the system may
          order B&apos;s write before A&apos;s — as long as all clients agree on the order.
        </p>
        <p>
          <strong>Use cases:</strong> Distributed shared memory, some database isolation levels.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Causal Consistency</h3>
        <p>
          <strong>Causal consistency</strong> guarantees that causally related operations are seen in order,
          but concurrent operations may be seen in different orders by different clients.
        </p>
        <p>
          <strong>Causality definition:</strong> Operation A <em>happens-before</em> operation B if:
        </p>
        <ul>
          <li>A and B are from the same client, and A was issued before B.</li>
          <li>A is a write, B is a read that returns A&apos;s value (read-follows-write).</li>
          <li>There exists a chain of happens-before relationships from A to B (transitivity).</li>
        </ul>
        <p>
          <strong>Example:</strong>
        </p>
        <ul>
          <li>Client A posts a status update (write x = &quot;Hello&quot;)</li>
          <li>Client B reads the post and comments (read x, then write comment)</li>
          <li>Causal consistency ensures anyone who sees the comment also sees the post</li>
        </ul>
        <p>
          <strong>Use cases:</strong>
        </p>
        <ul>
          <li>Social media feeds (comments must appear after posts)</li>
          <li>Collaborative editing (replies reference original content)</li>
          <li>Messaging systems (replies reference original messages)</li>
        </ul>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Preserves intuitive causality without full strong consistency</li>
          <li>✓ Better availability and latency than strong consistency</li>
          <li>✗ More complex to implement (must track causality)</li>
          <li>✗ Concurrent operations may still appear in different orders</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Eventual Consistency</h3>
        <p>
          <strong>Eventual consistency</strong> guarantees that if no new updates are made, all reads will
          eventually return the same value. During the convergence period, reads may return stale data.
        </p>
        <p>
          <strong>Formal definition:</strong> Given a period with no writes, after sufficient time, all reads
          return the same value.
        </p>
        <p>
          <strong>Example:</strong>
        </p>
        <ul>
          <li>Client A writes x = 5 to Node 1</li>
          <li>Replication to Node 2 takes 5 seconds</li>
          <li>During those 5 seconds, reads from Node 2 may return old value</li>
          <li>After 5 seconds, all reads return 5</li>
        </ul>
        <p>
          <strong>Use cases:</strong>
        </p>
        <ul>
          <li>Social media likes, shares, follower counts</li>
          <li>Product reviews and ratings</li>
          <li>Analytics and metrics</li>
          <li>DNS propagation</li>
        </ul>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Highest availability — reads/writes always accepted</li>
          <li>✓ Lowest latency — no coordination required</li>
          <li>✗ Reads may return stale data (unbounded staleness)</li>
          <li>✗ Conflicts possible (concurrent writes to same key)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Read Your Writes</h3>
        <p>
          <strong>Read your writes</strong> (also called <strong>read-after-write consistency</strong>)
          guarantees that a client always sees its own writes, even if other clients may see stale data.
        </p>
        <p>
          <strong>Implementation:</strong> Route reads from a client to the same node that handled their writes,
          or track which nodes have received the client&apos;s writes.
        </p>
        <p>
          <strong>Use cases:</strong>
        </p>
        <ul>
          <li>User profile updates (user should see their own changes immediately)</li>
          <li>Content creation (author sees their post immediately)</li>
          <li>Shopping cart updates</li>
        </ul>
      </section>

      <section>
        <h2>CAP Theorem</h2>
        <p>
          The <strong>CAP theorem</strong> (Brewer&apos;s theorem) states that a distributed system can only
          guarantee two of three properties simultaneously:
        </p>
        <ul>
          <li>
            <strong>Consistency (C):</strong> All nodes see the same data at the same time.
          </li>
          <li>
            <strong>Availability (A):</strong> Every request receives a response (success or failure).
          </li>
          <li>
            <strong>Partition Tolerance (P):</strong> System continues operating despite network partitions.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/cap-theorem-tradeoffs.svg"
          alt="CAP Theorem Trade-offs"
          caption="CAP Theorem — showing that during network partitions, systems must choose between consistency (CP) and availability (AP)"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Understanding CAP</h3>
        <p>
          <strong>Important clarification:</strong> CAP is often misunderstood. The theorem specifically
          addresses behavior <em>during network partitions</em>. When the network is healthy, you can have
          both consistency and availability.
        </p>
        <p>
          <strong>During a partition:</strong>
        </p>
        <ul>
          <li>
            <strong>CP systems:</strong> Choose consistency over availability. If a node cannot communicate
            with the majority, it rejects requests rather than risk returning stale data.
          </li>
          <li>
            <strong>AP systems:</strong> Choose availability over consistency. Nodes continue accepting reads
            and writes even if they cannot synchronize with each other.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CP Systems (Consistency + Partition Tolerance)</h3>
        <p>
          <strong>Behavior during partition:</strong> Reject writes (or reads) that cannot be synchronized
          across the partition.
        </p>
        <p>
          <strong>Examples:</strong>
        </p>
        <ul>
          <li>MongoDB (with strong write concern)</li>
          <li>HBase</li>
          <li>Redis (single leader)</li>
          <li>PostgreSQL (single leader with sync replication)</li>
          <li>ZooKeeper, etcd (consensus-based)</li>
        </ul>
        <p>
          <strong>Use when:</strong>
        </p>
        <ul>
          <li>Data correctness is critical (financial data, inventory)</li>
          <li>You can tolerate temporary unavailability</li>
          <li>Partitions are rare in your deployment</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">AP Systems (Availability + Partition Tolerance)</h3>
        <p>
          <strong>Behavior during partition:</strong> Continue accepting reads and writes on both sides of
          the partition. Data may diverge and must be reconciled later.
        </p>
        <p>
          <strong>Examples:</strong>
        </p>
        <ul>
          <li>Cassandra</li>
          <li>DynamoDB (default configuration)</li>
          <li>Riak</li>
          <li>CouchDB</li>
          <li>Eureka (service discovery)</li>
        </ul>
        <p>
          <strong>Use when:</strong>
        </p>
        <ul>
          <li>Availability is critical (always serve requests)</li>
          <li>Eventual consistency is acceptable</li>
          <li>You have conflict resolution strategies</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CA Systems (Theoretical)</h3>
        <p>
          <strong>CA systems</strong> guarantee consistency and availability but cannot tolerate partitions.
          In practice, true CA systems do not exist in distributed environments — networks will eventually
          partition.
        </p>
        <p>
          <strong>Examples (single-node or non-distributed):</strong>
        </p>
        <ul>
          <li>Traditional RDBMS on a single server</li>
          <li>In-memory databases without replication</li>
        </ul>
        <p>
          <strong>Interview insight:</strong> When discussing CAP, clarify that &quot;choosing CA&quot; is
          not realistic for distributed systems. The real choice is CP vs AP during partitions.
        </p>
      </section>

      <section>
        <h2>Conflict Resolution</h2>
        <p>
          In eventually consistent systems, concurrent writes to the same data can cause <strong>conflicts</strong>.
          The system must have a strategy to resolve these conflicts.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/conflict-resolution-strategies.svg"
          alt="Conflict Resolution Strategies"
          caption="Conflict Resolution — showing write conflict scenarios and resolution strategies (LWW, vector clocks, CRDTs, application-level)"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Last Write Wins (LWW)</h3>
        <p>
          The simplest conflict resolution: use timestamps to determine which write &quot;wins.&quot;
        </p>
        <p>
          <strong>Implementation:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Each write includes a timestamp (client or server-generated).</li>
          <li>When conflicts are detected, keep the value with the latest timestamp.</li>
          <li>Discard all other values.</li>
        </ol>
        <p>
          <strong>Problems:</strong>
        </p>
        <ul>
          <li>
            <strong>Clock skew:</strong> If clocks are not synchronized, &quot;last&quot; may be wrong.
          </li>
          <li>
            <strong>Data loss:</strong> Earlier writes are silently discarded, even if they contain unique data.
          </li>
          <li>
            <strong>Non-intuitive:</strong> A write that &quot;happened&quot; later in real time may have an
            earlier timestamp.
          </li>
        </ul>
        <p>
          <strong>Use when:</strong> Simplicity is paramount and occasional data loss is acceptable.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Vector Clocks</h3>
        <p>
          <strong>Vector clocks</strong> track causality by maintaining a vector of logical timestamps, one
          per node.
        </p>
        <p>
          <strong>How they work:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Each node maintains a vector: [node1_count, node2_count, ...]</li>
          <li>On write, increment own count: [1, 0, 0] → [2, 0, 0]</li>
          <li>On replication, merge vectors: max([2,0,0], [1,3,0]) = [2,3,0]</li>
          <li>Compare vectors to detect conflicts:</li>
          <ul>
            <li>If all elements of A ≤ B, then A happened-before B</li>
            <li>If neither dominates, they are concurrent (conflict)</li>
          </ul>
        </ol>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>Detects true concurrency (not just timestamp ordering)</li>
          <li>Preserves causality without synchronized clocks</li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>Vector size grows with number of nodes</li>
          <li>Still requires application to resolve detected conflicts</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CRDTs (Conflict-Free Replicated Data Types)</h3>
        <p>
          <strong>CRDTs</strong> are data structures with mathematical properties that guarantee automatic
          conflict resolution.
        </p>
        <p>
          <strong>Key property:</strong> All operations commute — applying them in any order produces the
          same result.
        </p>
        <p>
          <strong>Examples:</strong>
        </p>
        <ul>
          <li>
            <strong>G-Counter (Grow-only Counter):</strong> Each node has its own counter. Total = sum of all
            counters. Increments are local and commutative.
          </li>
          <li>
            <strong>PN-Counter (Positive-Negative Counter):</strong> Two G-Counters (increments and decrements).
            Value = increments - decrements.
          </li>
          <li>
            <strong>LWW-Register:</strong> Last-write-wins register with vector clock timestamps.
          </li>
          <li>
            <strong>OR-Set (Observed-Remove Set):</strong> Set where adds and removes are tracked with vector
            clocks.
          </li>
        </ul>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>Automatic conflict resolution — no application logic needed</li>
          <li>Always converges to same state</li>
          <li>Works with network partitions</li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>Not all data types have CRDT implementations</li>
          <li>Some CRDTs have high memory overhead</li>
          <li>Cannot express all business logic (e.g., &quot;unique username&quot;)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Application-Level Resolution</h3>
        <p>
          For complex conflicts, the application must resolve them based on business logic.
        </p>
        <p>
          <strong>Patterns:</strong>
        </p>
        <ul>
          <li>
            <strong>Merge functions:</strong> Define how to combine conflicting values (e.g., merge two cart
            updates by unioning items).
          </li>
          <li>
            <strong>Manual resolution:</strong> Flag conflicts for human review (e.g., collaborative document
            editing with conflicting changes).
          </li>
          <li>
            <strong>Business rules:</strong> Apply domain-specific logic (e.g., &quot;higher bid wins&quot; in
            an auction).
          </li>
        </ul>
        <p>
          <strong>Example: Shopping Cart Merge</strong>
        </p>
        <ul>
          <li>Client A adds item X to cart</li>
          <li>Client B adds item Y to cart (concurrently)</li>
          <li>Merge: Cart contains both X and Y (union)</li>
        </ul>
      </section>

      <section>
        <h2>Choosing a Consistency Model</h2>
        <p>
          Selecting the right consistency model requires understanding your use case, user expectations, and
          business requirements.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Decision Framework</h3>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>What happens if a user sees stale data?</strong>
            <ul>
              <li>Catastrophic (wrong balance, oversold inventory) → Strong consistency</li>
              <li>Confusing but recoverable → Causal or eventual</li>
              <li>Unnoticed or acceptable → Eventual</li>
            </ul>
          </li>
          <li>
            <strong>What is the cost of conflicts?</strong>
            <ul>
              <li>High (data corruption, financial loss) → Strong consistency</li>
              <li>Medium (user frustration) → Causal with conflict resolution</li>
              <li>Low (temporary inconsistency) → Eventual</li>
            </ul>
          </li>
          <li>
            <strong>What are the latency requirements?</strong>
            <ul>
              <li>Sub-100ms globally → Eventual (strong consistency adds 100ms+ for cross-region)</li>
              <li>Regional is acceptable → Strong consistency within region</li>
            </ul>
          </li>
          <li>
            <strong>Can you tolerate unavailability?</strong>
            <ul>
              <li>No (must always serve requests) → AP / eventual</li>
              <li>Yes (brief unavailability acceptable) → CP / strong</li>
            </ul>
          </li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Use Case Recommendations</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Use Case</th>
              <th className="p-3 text-left">Recommended Model</th>
              <th className="p-3 text-left">Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Bank transfers</td>
              <td className="p-3">Strong (linearizable)</td>
              <td className="p-3">Cannot tolerate incorrect balances</td>
            </tr>
            <tr>
              <td className="p-3">Inventory management</td>
              <td className="p-3">Strong (or causal with reservation)</td>
              <td className="p-3">Prevent overselling</td>
            </tr>
            <tr>
              <td className="p-3">Authentication tokens</td>
              <td className="p-3">Strong</td>
              <td className="p-3">Invalid tokens must be rejected</td>
            </tr>
            <tr>
              <td className="p-3">Social media feed</td>
              <td className="p-3">Causal</td>
              <td className="p-3">Comments must appear after posts</td>
            </tr>
            <tr>
              <td className="p-3">Like counters</td>
              <td className="p-3">Eventual</td>
              <td className="p-3">Temporary inaccuracy acceptable</td>
            </tr>
            <tr>
              <td className="p-3">Shopping cart</td>
              <td className="p-3">Read-your-writes + eventual</td>
              <td className="p-3">User must see own updates</td>
            </tr>
            <tr>
              <td className="p-3">Collaborative editing</td>
              <td className="p-3">Causal or CRDTs</td>
              <td className="p-3">Preserve edit causality</td>
            </tr>
            <tr>
              <td className="p-3">Analytics dashboards</td>
              <td className="p-3">Eventual</td>
              <td className="p-3">Stale data acceptable for insights</td>
            </tr>
          </tbody>
        </table>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Interview Framework: Consistency Discussion</h3>
          <ol className="space-y-2">
            <li>1. Identify data types and their consistency needs</li>
            <li>2. Classify by criticality (critical → strong, nice-to-have → eventual)</li>
            <li>3. Discuss CAP trade-offs for each data type</li>
            <li>4. Propose conflict resolution for eventual data</li>
            <li>5. Consider hybrid approaches (strong for critical, eventual for rest)</li>
          </ol>
        </div>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a globally distributed e-commerce platform. What consistency model do you choose for inventory, shopping cart, and product reviews? Justify each choice.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Inventory:</strong> Strong consistency required. Prevent overselling (two users buying last item). Use synchronous replication within region.</li>
                <li><strong>Shopping cart:</strong> Read-your-writes consistency. User must see their own cart updates immediately. Use session-based routing to same replica.</li>
                <li><strong>Product reviews:</strong> Eventual consistency acceptable. Temporary staleness (5-10 seconds) OK for review counts and ratings.</li>
                <li><strong>Recommendations:</strong> Eventual consistency. Personalization can be stale (hours) without impacting user experience.</li>
                <li><strong>Implementation:</strong> Primary database per region with read replicas. Route inventory/cart writes to primary. Serve reviews from replicas.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Explain the CAP theorem. During a network partition, when would you choose CP over AP? Give concrete examples.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>CAP theorem:</strong> During network partition (P), must choose between consistency (C) and availability (A). Only applies during partitions.</li>
                <li><strong>Choose CP when:</strong> (1) Financial transactions (bank transfers, payments). (2) Inventory management (prevent overselling). (3) Authentication/authorization (prevent unauthorized access).</li>
                <li><strong>Choose AP when:</strong> (1) Social media feeds (stale posts OK). (2) Product reviews (stale ratings OK). (3) Analytics dashboards (approximate data OK).</li>
                <li><strong>Examples:</strong> Banking system = CP (better unavailable than wrong balance). Twitter feed = AP (better show stale tweets than error page).</li>
                <li><strong>Trade-off:</strong> CP systems reject requests during partition. AP systems serve potentially stale data. Choose based on business requirements.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Two users edit the same document simultaneously in a collaborative editor. How do you handle conflicts? Compare CRDTs vs operational transformation.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>CRDTs (Conflict-Free Replicated Data Types):</strong> Mathematical structures that merge automatically. ✓ Automatic conflict resolution, no central coordination. ✗ Limited to specific data types.</li>
                <li><strong>Operational Transformation (OT):</strong> Transform operations to preserve intent. ✓ Works for complex text editing. ✗ Requires central server, complex algorithms.</li>
                <li><strong>Recommendation:</strong> Use CRDTs for simple data (counters, sets). Use OT for rich text editing (Google Docs uses OT).</li>
                <li><strong>Implementation:</strong> For collaborative text: Use OT with operation transformation rules. For collaborative counters/votes: Use G-Counter CRDT. For collaborative checklists: Use OR-Set CRDT.</li>
                <li><strong>Example:</strong> Two users insert text at same position. OT transforms operations to preserve both insertions. CRDT uses unique character IDs for deterministic merge.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Your social media platform shows stale follower counts. Users are complaining. How do you diagnose and fix this? What consistency model should you use?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Diagnosis:</strong> (1) Check replication lag between primary and read replicas. (2) Verify cache TTL settings. (3) Check if follower count is computed on-the-fly or cached.</li>
                <li><strong>Root cause:</strong> Likely eventual consistency from async replication or long cache TTL. Follower count updated on primary, served from stale replica/cache.</li>
                <li><strong>Fix:</strong> (1) Use read-your-writes consistency for user&apos;s own profile. (2) Reduce cache TTL for follower counts. (3) Use write-through cache for critical counts.</li>
                <li><strong>Consistency model:</strong> Read-your-writes for user&apos;s own data. Eventual consistency for other users&apos; data (they won&apos;t notice 5-second staleness).</li>
                <li><strong>Implementation:</strong> Route user&apos;s profile requests to primary or use session affinity. Use Redis for real-time counts with write-through caching.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Design a distributed counter for a &quot;like&quot; button that must be accurate within 1% and available globally with {'<'} 100ms latency.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Requirements:</strong> 1% accuracy (eventual consistency OK), {'<'} 100ms latency (local writes), global availability.</li>
                <li><strong>Solution:</strong> Use G-Counter CRDT with per-region counters. Each region increments its local counter. Total = sum of all regional counters.</li>
                <li><strong>Write path:</strong> User likes → increment local region counter (Redis, {'<'} 10ms). Async replication to other regions.</li>
                <li><strong>Read path:</strong> Sum all regional counters (cached, refreshed every 5 seconds). Accuracy within 1% if updates propagate within 5 seconds.</li>
                <li><strong>Trade-offs:</strong> Eventual consistency (counts may differ by region temporarily). Bounded staleness (5-second window). Meets 1% accuracy requirement.</li>
                <li><strong>Example:</strong> 1M likes across 10 regions. Each region has ~100K. Max staleness = 100K / 1M = 10% initially, drops to {'<'} 1% after replication.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How does causal consistency differ from eventual consistency? Give an example where causal is necessary but eventual is insufficient.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Eventual consistency:</strong> All replicas converge eventually. No ordering guarantees. Concurrent updates may appear in different order on different replicas.</li>
                <li><strong>Causal consistency:</strong> Causally related operations appear in order. If A caused B, all replicas see A before B. Concurrent operations can be in any order.</li>
                <li><strong>Example where causal is necessary:</strong> Comment thread. User posts comment (A), then replies to their own comment (B). Reply (B) must appear after original comment (A) on all devices.</li>
                <li><strong>With eventual:</strong> Reply might appear before original comment on some devices (confusing UX).</li>
                <li><strong>With causal:</strong> Reply always appears after original. Use vector clocks or session guarantees to enforce causality.</li>
                <li><strong>Implementation:</strong> Track dependencies (reply depends on comment). Wait for comment to propagate before serving reply. Or use session-based routing.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Consistency Patterns in Practice</h2>
        <p>
          Real-world systems often use multiple consistency models for different data types.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Hybrid Approaches</h3>
        <p>
          <strong>Example: E-commerce Platform</strong>
        </p>
        <ul>
          <li>
            <strong>Inventory:</strong> Strong consistency (prevent overselling)
          </li>
          <li>
            <strong>Shopping cart:</strong> Read-your-writes (user sees own changes)
          </li>
          <li>
            <strong>Product reviews:</strong> Eventual (temporary staleness acceptable)
          </li>
          <li>
            <strong>Recommendations:</strong> Eventual (personalization can be stale)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consistency Tuning</h3>
        <p>
          Many databases allow tuning consistency per-operation:
        </p>
        <ul>
          <li>
            <strong>DynamoDB:</strong> Strongly consistent vs eventually consistent reads
          </li>
          <li>
            <strong>Cassandra:</strong> Consistency level per query (ONE, QUORUM, ALL)
          </li>
          <li>
            <strong>MongoDB:</strong> Write concern (acknowledged, journaled, majority)
          </li>
          <li>
            <strong>Redis:</strong> WAIT command for synchronous replication
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Quorum-Based Consistency</h3>
        <p>
          <strong>Quorum reads/writes</strong> provide tunable consistency between strong and eventual:
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6 text-center">
          <p className="text-lg font-semibold">
            For N replicas, choose W writes and R reads such that:
          </p>
          <p className="mt-2 text-xl font-bold">W + R {'>'} N</p>
          <p className="mt-2 text-sm text-muted">Guarantees read sees at least one updated replica</p>
        </div>
        <p>
          <strong>Examples:</strong>
        </p>
        <ul>
          <li>N=3, W=2, R=2 → Strong consistency (majority)</li>
          <li>N=3, W=1, R=1 → Eventual consistency</li>
          <li>N=5, W=3, R=3 → Strong consistency with higher fault tolerance</li>
        </ul>
      </section>

      <section>
        <h2>Consistency Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Identified data types and their consistency requirements</li>
          <li>✓ Chosen appropriate consistency model per data type</li>
          <li>✓ Understood CAP trade-offs for your deployment</li>
          <li>✓ Defined conflict resolution strategy for eventual data</li>
          <li>✓ Implemented read-your-writes for user-facing operations</li>
          <li>✓ Configured quorum settings (if using tunable consistency)</li>
          <li>✓ Monitored consistency lag (time to convergence)</li>
          <li>✓ Tested behavior during network partitions</li>
          <li>✓ Documented consistency guarantees for API consumers</li>
          <li>✓ Established SLOs for consistency (e.g., convergence time)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
