"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-consistency-models-complete",
  title: "Consistency Models",
  description:
    "Comprehensive guide to consistency models: linearizable, sequential, causal, eventual consistency, CAP theorem, and choosing consistency levels for distributed systems.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "consistency-models",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "consistency", "distributed-systems", "cap-theorem"],
  relatedTopics: [
    "replication-in-nosql",
    "conflict-resolution",
    "read-replicas",
    "sharding-strategies",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Consistency Models</h1>
        <p className="lead">
          Consistency models define guarantees about how data appears to clients in distributed
          systems. <strong>Strong consistency</strong> (linearizable): all clients see same data
          at same time (real-time guarantee). <strong>Weak consistency</strong> (eventual):
          clients may see different data temporarily, converge eventually. Spectrum:
          <strong>Linearizable</strong> (strongest) → <strong>Sequential</strong> (per-client
          order) → <strong>Causal</strong> (cause-effect preserved) → <strong>Eventual</strong>
          (weakest, converge eventually). CAP theorem: can't have Consistency, Availability, and
          Partition tolerance simultaneously. Choose based on requirements: financial systems
          need strong consistency, social media can use eventual.
        </p>

        <p>
          Consider a bank transfer. Strong consistency: after transfer, all clients see updated
          balance immediately (no overdrafts). Eventual consistency: some clients see old balance
          temporarily (may allow overdrafts). For banking: strong consistency required (can't
          allow overdrafts). For social media likes: eventual consistency OK (seeing 99 vs 100
          likes temporarily is acceptable).
        </p>

        <p>
          Consistency models involve trade-offs: <strong>Strong consistency</strong> = high
          latency (wait for all nodes), low availability (fail if node unreachable).
          <strong>Weak consistency</strong> = low latency (respond immediately), high
          availability (always respond). CAP theorem: during network partition, choose
          consistency (return error) or availability (return possibly stale data).
        </p>

        <p>
          This article provides a comprehensive examination of consistency models: consistency
          spectrum (linearizable, sequential, causal, eventual), CAP theorem (consistency vs
          availability vs partition tolerance), and real-world use cases (financial systems,
          social media, distributed databases). We'll explore when each model excels (strong
          for critical data, eventual for scale) and trade-offs (latency vs availability vs
          consistency). We'll also cover best practices (choose per operation, document
          consistency level) and common pitfalls (strong for everything, eventual for critical).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/consistency-spectrum.svg`}
          caption="Figure 1: Consistency Models Spectrum showing Consistency Spectrum (Strong → Weak): Linearizable (Strongest, real-time guarantee), Sequential (Per-client order), Causal (Cause-effect preserved), Eventual (Weakest, converge eventually). Strong: High latency, low availability. Weak: Low latency, high availability. CAP Theorem (Choose 2 of 3): Consistency (All nodes same data), Availability (Every request gets response), Partition Tolerance (System works despite network failures). Key characteristics: Linearizable (strongest, real-time), Sequential (per-client order), Causal (cause-effect), Eventual (converge eventually)."
          alt="Consistency models spectrum"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Consistency Levels</h2>

        <h3>Linearizable Consistency (Strongest)</h3>
        <p>
          <strong>Linearizable consistency</strong> (strongest): operations appear to execute
          atomically at some instant between invocation and response. All clients see same
          order of operations (real-time guarantee). Example: Client A writes
          <code className="inline-code">x = 5</code>, Client B reads <code className="inline-code">
          x</code>. If B's read starts after A's write completes, B must read 5 (not old value).
        </p>

        <p>
          Benefits: <strong>Simplest to reason about</strong> (looks like single system),
          <strong>No stale reads</strong> (always see latest), <strong>Real-time guarantee</strong>
          (writes visible immediately). Trade-offs: <strong>High latency</strong> (wait for all
          nodes), <strong>Low availability</strong> (fail if node unreachable),
          <strong>Doesn't scale</strong> (coordination overhead).
        </p>

        <p>
          Use for: Financial transactions (can't allow overdrafts), distributed locks (must be
          exclusive), leader election (single leader), critical data (inventory, balances).
        </p>

        <h3>Sequential Consistency</h3>
        <p>
          <strong>Sequential consistency</strong>: operations appear to execute in some
          sequential order, same for all clients. Per-client order preserved (Client A's
          operations appear in order), but no real-time guarantee (Client B may see A's
          operations delayed).
        </p>

        <p>
          Benefits: <strong>Easier to reason about</strong> (sequential order),
          <strong>Per-client guarantees</strong> (your operations in order). Trade-offs:
          <strong>Still high latency</strong> (coordinate order), <strong>No real-time
          guarantee</strong> (may see delayed writes).
        </p>

        <p>
          Use for: Systems needing per-client order (chat messages in order), but can tolerate
          some delay across clients.
        </p>

        <h3>Causal Consistency</h3>
        <p>
          <strong>Causal consistency</strong>: causally related operations appear in order,
          concurrent operations may appear in any order. Example: Post A → Reply to A (causally
          related - must see post before reply). Post B (concurrent - may see before or after
          Post A).
        </p>

        <p>
          Benefits: <strong>Preserves cause-effect</strong> (reply after post),
          <strong>Better availability</strong> (only coordinate causally related),
          <strong>Good for social</strong> (conversations make sense). Trade-offs:
          <strong>Complex to implement</strong> (track causality), <strong>May see
          concurrent out of order</strong> (unrelated posts).
        </p>

        <p>
          Use for: Social media (reply after post), messaging apps (message thread in order),
          collaborative editing (edits in order).
        </p>

        <h3>Eventual Consistency (Weakest)</h3>
        <p>
          <strong>Eventual consistency</strong>: if no new updates, all reads eventually return
          same value. No timing guarantee (may take seconds, minutes, hours). Example: DNS
          updates propagate eventually (may take hours), S3 replication (eventually consistent).
        </p>

        <p>
          Benefits: <strong>Lowest latency</strong> (respond immediately),
          <strong>Highest availability</strong> (always respond), <strong>Scales well</strong>
          (no coordination). Trade-offs: <strong>May see stale data</strong> (old values),
          <strong>No ordering guarantee</strong> (concurrent writes may resolve arbitrarily),
          <strong>Hard to reason about</strong> (what value will I see?).
        </p>

        <p>
          Use for: Social media likes (99 vs 100 OK temporarily), DNS (propagation delay OK),
          CDN caching (stale content OK), analytics counters (approximate OK).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/consistency-models-comparison.svg`}
          caption="Figure 2: Consistency Models Comparison comparing Linearizable (Real-time guarantee, Single system image, Highest latency, Lowest availability, Example: ZooKeeper), Causal (Cause-effect preserved, Reply after post, Medium latency, Medium availability, Example: Facebook), Eventual (No timing guarantee, Converge eventually, Lowest latency, Highest availability, Example: DNS, S3). Consistency vs Latency vs Availability: Strong Consistency (High latency, low availability), Weak Consistency (Low latency, high availability), Choose Based On (Application requirements). Key takeaway: Stronger consistency = higher latency, lower availability. Weaker consistency = lower latency, higher availability. Choose based on application needs (financial = strong, social = weak)."
          alt="Consistency models comparison"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: CAP Theorem &amp; Trade-offs</h2>

        <h3>CAP Theorem</h3>
        <p>
          <strong>CAP theorem</strong>: distributed system can't simultaneously provide more
          than two of: <strong>Consistency</strong> (all nodes see same data at same time),
          <strong>Availability</strong> (every request gets response), <strong>Partition
          tolerance</strong> (system works despite network failures).
        </p>

        <p>
          During network partition (nodes can't communicate): <strong>Choose Consistency</strong>
          (CP): return error (don't return stale data). Example: banking (reject transaction
          if can't verify balance). <strong>Choose Availability</strong> (AP): return response
          (may be stale). Example: social media (show cached feed, may be stale).
        </p>

        <p>
          Note: Partition tolerance is mandatory (networks fail). Real choice: Consistency vs
          Availability during partition. Modern systems: mix consistency levels (strong for
          critical, eventual for non-critical).
        </p>

        <h3>Consistency vs Latency vs Availability</h3>
        <p>
          <strong>Strong consistency</strong>: High latency (wait for all nodes to acknowledge),
          low availability (fail if node unreachable). Example: linearizable write (wait for
          quorum, then all replicas).
        </p>

        <p>
          <strong>Weak consistency</strong>: Low latency (respond immediately), high availability
          (always respond). Example: eventual consistency write (acknowledge immediately,
          replicate asynchronously).
        </p>

        <p>
          Trade-off: consistency vs performance. Stronger consistency = slower, less available.
          Weaker consistency = faster, more available. Choose based on application needs
          (financial = strong, social = weak).
        </p>

        <h3>Mixed Consistency Levels</h3>
        <p>
          Modern systems use <strong>mixed consistency</strong>: different consistency levels
          for different operations/data types. Example: e-commerce application:
        </p>

        <p>
          <strong>Strong consistency</strong>: Inventory (can't oversell), Payment (can't
          charge twice). <strong>Causal consistency</strong>: Reviews (reply after review),
          Recommendations (based on viewed items). <strong>Eventual consistency</strong>:
          Product views (approximate count OK), Likes (99 vs 100 OK temporarily).
        </p>

        <p>
          Benefits: best of both (strong for critical, eventual for scale). Trade-offs:
          complexity (manage multiple consistency levels), team coordination (document which
          level for which operation).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/consistency-models-use-cases.svg`}
          caption="Figure 3: Consistency Models Use Cases and Best Practices. Primary Use Cases: Strong Consistency (Financial transactions, Inventory management, Distributed locks, Leader election, Example: Banking), Causal Consistency (Social media feeds, Comment threads, Messaging apps, Collaborative editing, Example: Facebook), Eventual Consistency (DNS resolution, CDN caching, Social media likes, Analytics counters, Example: S3, DNS). Best Practices: Strong for Critical (Financial, inventory), Causal for Social (Preserve conversations), Eventual for Scale (Likes, views, counters), Mix Levels (Per operation). Anti-patterns: Strong consistency for everything (poor performance), eventual for critical data (data corruption), ignoring CAP (impossible requirements), not documenting consistency level (team confusion), assuming single consistency level (mix per operation)."
          alt="Consistency models use cases and best practices"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Choosing Consistency Level</h2>

        <p>
          Different consistency levels have trade-offs. Understanding them helps you choose
          the right level for each use case.
        </p>

        <h3>Linearizable Consistency</h3>
        <p>
          <strong>Strengths</strong>: Simplest to reason about (looks like single system), no
          stale reads (always see latest), real-time guarantee (writes visible immediately).
        </p>

        <p>
          <strong>Limitations</strong>: High latency (wait for all nodes), low availability
          (fail if node unreachable), doesn't scale (coordination overhead).
        </p>

        <p>
          <strong>Use for</strong>: Financial transactions (can't allow overdrafts), distributed
          locks (must be exclusive), leader election (single leader), critical data (inventory,
          balances).
        </p>

        <h3>Sequential Consistency</h3>
        <p>
          <strong>Strengths</strong>: Easier to reason about (sequential order), per-client
          guarantees (your operations in order).
        </p>

        <p>
          <strong>Limitations</strong>: Still high latency (coordinate order), no real-time
          guarantee (may see delayed writes).
        </p>

        <p>
          <strong>Use for</strong>: Systems needing per-client order (chat messages in order),
          but can tolerate some delay across clients.
        </p>

        <h3>Causal Consistency</h3>
        <p>
          <strong>Strengths</strong>: Preserves cause-effect (reply after post), better
          availability (only coordinate causally related), good for social (conversations
          make sense).
        </p>

        <p>
          <strong>Limitations</strong>: Complex to implement (track causality), may see
          concurrent out of order (unrelated posts).
        </p>

        <p>
          <strong>Use for</strong>: Social media (reply after post), messaging apps (message
          thread in order), collaborative editing (edits in order).
        </p>

        <h3>Eventual Consistency</h3>
        <p>
          <strong>Strengths</strong>: Lowest latency (respond immediately), highest availability
          (always respond), scales well (no coordination).
        </p>

        <p>
          <strong>Limitations</strong>: May see stale data (old values), no ordering guarantee
          (concurrent writes may resolve arbitrarily), hard to reason about (what value will
          I see?).
        </p>

        <p>
          <strong>Use for</strong>: Social media likes (99 vs 100 OK temporarily), DNS
          (propagation delay OK), CDN caching (stale content OK), analytics counters
          (approximate OK).
        </p>

        <h3>Choosing Consistency Level</h3>
        <p>
          Choose based on: <strong>Data criticality</strong> (financial = strong, social =
          weak), <strong>Performance requirements</strong> (low latency = weak, correctness
          = strong), <strong>Availability requirements</strong> (always available = weak,
          can tolerate errors = strong).
        </p>

        <p>
          Questions to ask: What happens if client sees stale data? (Financial: overdraft =
          bad. Social: wrong like count = OK). What happens if write is delayed? (Financial:
          double-charge = bad. Social: delayed post = OK).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Consistency Models</h2>

        <p>
          <strong>Choose per operation.</strong> Not one-size-fits-all. Strong for critical
          (payment, inventory), eventual for non-critical (likes, views). Benefits: appropriate
          consistency per use case.
        </p>

        <p>
          <strong>Document consistency level.</strong> Document which consistency level for
          which operation, why chosen, guarantees provided. Benefits: team understanding
          (consistent implementation), easier debugging (know expected behavior).
        </p>

        <p>
          <strong>Test consistency guarantees.</strong> Simulate network partitions, verify
          consistency level maintained. Test: strong (no stale reads), eventual (converge
          eventually). Benefits: catch bugs before production.
        </p>

        <p>
          <strong>Use quorum for strong consistency.</strong> Quorum reads/writes (W + R &gt;
          N) ensure strong consistency. Benefits: consistency guarantee, fault tolerance.
          Trade-offs: higher latency (wait for quorum).
        </p>

        <p>
          <strong>Monitor consistency lag.</strong> For eventual consistency, monitor lag
          (time to converge). Alert if lag exceeds threshold. Benefits: detect issues early,
          ensure convergence.
        </p>

        <p>
          <strong>Handle stale reads gracefully.</strong> For eventual consistency, design
          UI to handle stale data (show "may be stale" indicator, allow manual refresh).
          Benefits: user awareness (know data may be stale), better UX.
        </p>

        <p>
          <strong>Consider causal consistency for social.</strong> Social media: causal
          consistency (reply after post) is often sufficient (better availability than
          strong). Benefits: conversations make sense, better availability.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Strong consistency for everything.</strong> Using strong consistency for
          non-critical data (likes, views). Causes: poor performance (high latency), low
          availability (fail on network issues). Solution: use eventual consistency for
          non-critical data.
        </p>

        <p>
          <strong>Eventual consistency for critical data.</strong> Using eventual consistency
          for critical data (financial transactions, inventory). Causes: data corruption
          (overdrafts, overselling). Solution: use strong consistency for critical data.
        </p>

        <p>
          <strong>Ignoring CAP theorem.</strong> Assuming can have consistency, availability,
          and partition tolerance simultaneously. Causes: impossible requirements, system
          fails during partition. Solution: choose consistency vs availability during partition.
        </p>

        <p>
          <strong>Not documenting consistency level.</strong> Team doesn't know which
          consistency level for which operation. Causes: confusion, inconsistent implementation.
          Solution: document consistency level per operation (API docs, architecture docs).
        </p>

        <p>
          <strong>Assuming single consistency level.</strong> Assuming entire system uses
          same consistency level. Causes: over-engineering (strong for everything) or
          under-engineering (eventual for critical). Solution: mix consistency levels per
          operation/data type.
        </p>

        <p>
          <strong>Not testing consistency guarantees.</strong> Assuming consistency works
          without testing. Causes: bugs in production (stale reads, lost writes). Solution:
          test consistency scenarios (network partitions, concurrent writes).
        </p>

        <p>
          <strong>Ignoring consistency lag.</strong> Not monitoring eventual consistency
          lag. Causes: stale data for extended periods, user complaints. Solution: monitor
          lag, alert if exceeds threshold.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Financial Systems (Strong Consistency)</h3>
        <p>
          Banking uses strong consistency (linearizable). Transfer: debit account A, credit
          account B. All clients see updated balances immediately. Benefits: no overdrafts
          (can't spend money not there), no double-spending (can't spend same money twice).
          Trade-offs: higher latency (wait for confirmation), lower availability (reject if
          can't verify).
        </p>

        <h3>Social Media (Causal/Eventual Consistency)</h3>
        <p>
          Facebook uses causal consistency for posts/replies (reply after post), eventual
          consistency for likes (99 vs 100 OK temporarily). Benefits: conversations make
          sense (causal), high availability (eventual for likes). Trade-offs: may see
          stale like count (acceptable).
        </p>

        <h3>DNS (Eventual Consistency)</h3>
        <p>
          DNS uses eventual consistency. DNS updates propagate eventually (may take hours).
          Benefits: high availability (always respond with cached value), low latency
          (cached response). Trade-offs: stale DNS records (acceptable - propagation delay
          expected).
        </p>

        <h3>E-Commerce (Mixed Consistency)</h3>
        <p>
          E-commerce uses mixed consistency: strong for inventory (can't oversell), payment
          (can't charge twice), eventual for product views (approximate OK), likes (99 vs
          100 OK). Benefits: critical data correct (inventory, payment), non-critical scales
          (views, likes). Trade-offs: complexity (manage multiple consistency levels).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: What are the common consistency models? Compare linearizable, causal, and
              eventual.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Linearizable (strongest): operations appear atomic at
              some instant, all clients see same order (real-time guarantee). No stale reads,
              but high latency, low availability. Causal: causally related operations in
              order (reply after post), concurrent may be out of order. Medium latency,
              medium availability. Eventual (weakest): if no new updates, all reads eventually
              return same value. No timing guarantee, but lowest latency, highest availability.
              Choose: linearizable for critical (financial), causal for social (conversations),
              eventual for scale (likes, views).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is sequential consistency? Answer: Operations
              appear in some sequential order, same for all clients. Per-client order
              preserved, but no real-time guarantee. Between linearizable and causal in
              strength.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: What is the CAP theorem? How does it relate to consistency?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> CAP theorem: distributed system can't simultaneously
              provide more than two of: Consistency (all nodes same data), Availability
              (every request gets response), Partition tolerance (works despite network
              failures). During partition: choose Consistency (CP - return error, don't
              return stale) or Availability (AP - return response, may be stale). Partition
              tolerance is mandatory (networks fail). Real choice: consistency vs availability
              during partition. Example: banking (CP - reject if can't verify), social media
              (AP - show cached feed).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Can you have all three? Answer: No, impossible.
              During partition, must choose: consistency (reject requests) or availability
              (return possibly stale data). Modern systems: mix consistency levels (strong
              for critical, eventual for non-critical).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: When would you choose strong vs eventual consistency?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Strong consistency: financial transactions (can't
              allow overdrafts), inventory management (can't oversell), distributed locks
              (must be exclusive), leader election (single leader). Eventual consistency:
              social media likes (99 vs 100 OK), DNS (propagation delay OK), CDN caching
              (stale content OK), analytics counters (approximate OK). Choose based on:
              data criticality (financial = strong, social = weak), performance requirements
              (low latency = weak, correctness = strong), availability requirements (always
              available = weak, can tolerate errors = strong).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What about causal consistency? Answer: Middle
              ground. Use for: social media (reply after post), messaging apps (message
              thread in order), collaborative editing (edits in order). Better availability
              than strong, preserves cause-effect.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: How do you implement strong consistency in a distributed system?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Implement strong consistency: (1) Quorum reads/writes
              (W + R &gt; N - ensures read sees latest write), (2) Two-phase commit
              (coordinate all nodes before commit), (3) Consensus protocols (Paxos, Raft -
              agree on value before commit), (4) Linearizable CAS (compare-and-swap with
              fencing). Trade-offs: higher latency (wait for quorum/commit), lower
              availability (fail if node unreachable). Example: ZooKeeper (linearizable
              via Zab protocol), etcd (linearizable via Raft).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is quorum? Answer: Majority of nodes. Quorum
              write: write to majority (W &gt; N/2). Quorum read: read from majority (R &gt;
              N/2). Ensures: read sees latest write (W + R &gt; N). Example: 5 nodes, W=3,
              R=3 (3+3 &gt; 5 - guaranteed overlap).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: Your system has eventual consistency. Users complain about stale data.
              How do you address?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Address stale data complaints: (1) Monitor consistency
              lag (time to converge), alert if exceeds threshold, (2) Reduce replication lag
              (faster network, more bandwidth), (3) Use read-your-writes consistency (user
              sees their own writes immediately), (4) Show "may be stale" indicator (user
              awareness), (5) Allow manual refresh (user can force fresh read), (6) Consider
              stronger consistency for complained-about data (eventual → causal/strong).
              Trade-offs: stronger consistency = higher latency, lower availability.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is read-your-writes consistency? Answer:
              User sees their own writes immediately (even if others see stale). Implement:
              route user's reads to same node as writes, or wait for write to propagate
              before returning. Benefits: user doesn't see their own stale data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: How do you choose consistency level for a new feature?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Choose consistency level: (1) Identify data criticality
              (financial = strong, social = weak), (2) Identify performance requirements
              (low latency = weak, correctness = strong), (3) Identify availability
              requirements (always available = weak, can tolerate errors = strong), (4)
              Ask: what happens if client sees stale data? (Financial: overdraft = bad.
              Social: wrong like count = OK), (5) Ask: what happens if write is delayed?
              (Financial: double-charge = bad. Social: delayed post = OK), (6) Document
              chosen level (API docs, architecture docs). Example: new "like" feature →
              eventual (stale like count OK, low latency important).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if requirements change? Answer: Re-evaluate
              consistency level. If data becomes critical (like → payment), upgrade
              consistency (eventual → strong). If performance becomes critical (strong →
              low latency), downgrade consistency (strong → eventual). Document changes,
              test thoroughly.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://martin.kleppmann.com/2016/02/08/isolation-eventual-consistency.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Kleppmann — Isolation and Eventual Consistency
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS DynamoDB Documentation — Read Consistency
            </a>
          </li>
          <li>
            <a
              href="https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cassandra Documentation — Consistency Configuration
            </a>
          </li>
          <li>
            <a
              href="https://cloud.google.com/spanner/docs/external-consistency"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Spanner — External Consistency Documentation
            </a>
          </li>
          <li>
            <a
              href="https://crdt.tech/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CRDT.tech — Conflict-Free Replicated Data Types
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
