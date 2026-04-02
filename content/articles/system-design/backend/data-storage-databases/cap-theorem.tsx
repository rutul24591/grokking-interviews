"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-cap-theorem-complete",
  title: "CAP Theorem",
  description:
    "Comprehensive guide to the CAP theorem: Consistency, Availability, Partition Tolerance. Learn when to choose CP vs AP with real-world examples and trade-off analysis.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "cap-theorem",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "distributed-systems", "consistency"],
  relatedTopics: [
    "acid-properties",
    "base-properties",
    "consistency-models",
    "replication-in-nosql",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>CAP Theorem</h1>
        <p className="lead">
          The CAP theorem—also known as Brewer's theorem—states that a distributed system cannot
          simultaneously guarantee all three of Consistency, Availability, and Partition Tolerance.
          During a network partition, you must choose between Consistency (all nodes see the same
          data) and Availability (every request gets a response). This fundamental constraint shapes
          every distributed system architecture decision.
        </p>

        <p>
          Understanding CAP is essential because it forces explicit trade-off decisions. You cannot
          design a distributed system that "has it all." When the network fails—and it will fail—your
          system must either block requests (preserving consistency) or continue operating (risking
          inconsistency). There is no third option.
        </p>

        <p>
          The theorem was conjectured by Eric Brewer in 2000 and proven by Gilbert and Lynch in 2002.
          Despite its simplicity, CAP is widely misunderstood. Many engineers believe you "pick 2 of 3"
          properties permanently. This is wrong. CAP only applies during network partitions. During
          normal operation, well-designed systems can provide all three properties. The choice is
          forced only when the network fails.
        </p>

        <p>
          This article provides a comprehensive examination of the CAP theorem: what each property
          means, why the trade-off exists, how real systems navigate it, and common misconceptions.
          We'll explore when to choose CP (consistency over availability) versus AP (availability
          over consistency), and how modern systems offer tunable consistency that lets you choose
          per operation rather than per system.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/cap-theorem-triangle.svg`}
          caption="Figure 1: CAP Theorem Triangle showing the three properties: Consistency (all nodes see the same data), Availability (every request gets a response), and Partition Tolerance (system works despite network failures). During normal operation, systems can achieve all three. During network partition, you must choose between C and A. Note: In distributed systems, P is NOT optional—networks will fail, so the real choice is between CP and AP."
          alt="CAP theorem triangle diagram"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: The Three Properties</h2>

        <h3>Consistency: Linearizability</h3>
        <p>
          In CAP terminology, Consistency means linearizability: every read returns the most recent
          write, and all nodes see the same data at the same time. This is a strong guarantee—if you
          write a value to the system, any subsequent read (even from a different node) must return
          that value or a newer one. There is a single, global ordering of operations.
        </p>

        <p>
          Linearizability is what users expect from a single-machine database. When you update your
          profile picture on a website, you expect to see it immediately—not just on your session,
          but for anyone viewing your profile. This expectation comes from single-node systems where
          consistency is free. In distributed systems, consistency requires coordination, and
          coordination requires communication. When communication fails (network partition),
          consistency becomes impossible without sacrificing availability.
        </p>

        <p>
          It's critical to distinguish CAP Consistency from ACID Consistency. ACID Consistency means
          database invariants are preserved (e.g., account balance never goes negative). CAP
          Consistency means all nodes see the same data. A system can be ACID-consistent but
          CAP-inconsistent (e.g., a single-node ACID database replicated asynchronously to a standby).
          The terms share a name but mean different things.
        </p>

        <h3>Availability: Every Request Gets a Response</h3>
        <p>
          Availability means every request to a non-failing node receives a response—success or
          failure—within a bounded time. The system never hangs, never times out, never says "try
          again later." Even if the response is "I don't have the latest data," the system responds.
          This is crucial for user experience: a slow error is better than no response.
        </p>

        <p>
          Availability is measured as uptime percentage—"five nines" (99.999%) availability means
          about 5 minutes of downtime per year. High availability requires redundancy: if one node
          fails, others can serve requests. But redundancy introduces the consistency problem: how
          do you keep replicas in sync when they can't communicate?
        </p>

        <p>
          Note that CAP Availability is a narrow definition. It doesn't guarantee fast responses,
          only that responses eventually arrive. A system that responds in 10 seconds is "available"
          under CAP, even if users consider it unusable. Real-world availability SLAs include latency
          bounds (e.g., "99.9% of requests complete within 200ms"), which CAP doesn't capture.
        </p>

        <h3>Partition Tolerance: Networks Will Fail</h3>
        <p>
          Partition Tolerance means the system continues operating despite network partitions—situations
          where messages between nodes are lost or delayed. In a partition, the network splits into
          isolated islands. Nodes in one island can't communicate with nodes in another. This isn't
          hypothetical: data center outages, fiber cuts, router failures, and even software bugs
          regularly cause partitions.
        </p>

        <p>
          Partition tolerance is not optional in distributed systems. If your system requires all
          nodes to communicate for every operation, it's not partition-tolerant—it's partition-intolerant,
          and it will fail when the network fails. The only way to avoid partitions is to not build
          distributed systems (use a single node), which defeats the purpose of scaling and redundancy.
        </p>

        <p>
          Because P is mandatory, the CAP theorem reduces to a binary choice: during a partition,
          do you choose Consistency or Availability? This is the only choice CAP forces. During
          normal operation (no partitions), you can—and should—provide both consistency and
          availability.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/cap-cp-vs-ap.svg`}
          caption="Figure 2: CP vs AP behavior during network partition. CP systems (left) block writes during partition to maintain consistency—both nodes reject writes, preserving the invariant that all reads return the same value. AP systems (right) accept writes on both sides of the partition—Node A writes X=10, Node B writes X=15. Both respond successfully, but replicas diverge. After partition heals, conflict resolution is required. The trade-off summary shows CP examples (PostgreSQL, MongoDB with majority writes, Spanner) and AP examples (Cassandra, DynamoDB, DNS, CDN)."
          alt="CP vs AP comparison during partition"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: CP vs AP Systems</h2>

        <h3>CP Systems: Consistency Over Availability</h3>
        <p>
          CP systems prioritize consistency during partitions. When a partition occurs, the system
          blocks writes (and sometimes reads) on one or both sides of the partition to prevent
          divergence. The system remains "correct" but becomes partially unavailable. This is the
          right choice when inconsistency would cause catastrophic failures.
        </p>

        <p>
          Implementation patterns for CP include: quorum-based writes (require majority acknowledgment),
          leader election with fencing (only one leader can write at a time), and synchronous
          replication (wait for all replicas before acknowledging). These mechanisms ensure that
          even during partitions, no two nodes can accept conflicting writes.
        </p>

        <p>
          Example: A CP database with three nodes (A, B, C) requires 2-of-3 acknowledgment for
          writes. If the network partitions into node A alone and nodes B+C together, the B+C
          partition can continue writing (they have majority), but node A cannot (it's minority).
          This prevents split-brain where both partitions accept writes independently. The trade-off:
          node A becomes unavailable for writes during the partition.
        </p>

        <h3>AP Systems: Availability Over Consistency</h3>
        <p>
          AP systems prioritize availability during partitions. When a partition occurs, all nodes
          continue accepting reads and writes. The system remains fully operational but replicas
          diverge—different nodes may have different values for the same key. After the partition
          heals, the system must reconcile divergent values through conflict resolution.
        </p>

        <p>
          Implementation patterns for AP include: multi-leader replication (each node accepts writes),
          version vectors (track causality to detect conflicts), and eventual consistency (replicas
          converge asynchronously). These mechanisms ensure the system never blocks, but applications
          must handle stale reads and write conflicts.
        </p>

        <p>
          Example: An AP database with three nodes (A, B, C) allows writes to any node. During a
          partition where node A is isolated from nodes B and C, node A accepts write X=10, while
          node B accepts write X=15. Both succeed. After the partition heals, the system detects
          the conflict and resolves it (e.g., last-write-wins, vector clock comparison, or
          application-specific merge). The trade-off: during the partition, reads may return stale
          or conflicting values.
        </p>

        <h3>Tunable Consistency: The Middle Ground</h3>
        <p>
          Modern distributed databases don't force a permanent CP or AP choice. Instead, they offer
          tunable consistency: each operation specifies its consistency level. This lets you choose
          CP for critical operations and AP for non-critical ones, optimizing both correctness and
          availability.
        </p>

        <p>
          Cassandra and DynamoDB exemplify this approach. For reads and writes, you specify a
          consistency level: ONE (any replica), QUORUM (majority), or ALL (all replicas). With
          QUORUM reads and QUORUM writes (Q + Q &gt; N), you get strong consistency. With ONE, you
          get high availability but eventual consistency. This flexibility lets applications optimize
          per use case.
        </p>

        <p>
          Example: An e-commerce platform uses Cassandra with tunable consistency. Inventory updates
          use QUORUM (CP—prevent overselling). Product reviews use ONE (AP—stale reviews are
          acceptable). Shopping cart updates use QUORUM for checkout (CP) but ONE for adding items
          (AP). This hybrid approach provides correctness where needed and availability where
          possible.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Real-World CAP Decisions</h2>

        <p>
          The CAP trade-off isn't abstract—it shapes real system design. The right choice depends
          on your business requirements: what's the cost of inconsistency versus the cost of
          unavailability? Let's examine concrete scenarios.
        </p>

        <h3>Financial Systems: CP (Consistency Critical)</h3>
        <p>
          Banking, payments, and trading systems must choose CP. Consider a money transfer: debit
          account A, credit account B. If the network partitions and both sides accept withdrawals,
          the same money could be spent twice—catastrophic fraud. CP systems block withdrawals
          during partitions, preventing double-spend. Users see "service temporarily unavailable"
          rather than "your balance is negative."
        </p>

        <p>
          The trade-off is explicit: during outages, users can't access their money. This is
          unacceptable for consumer apps but necessary for correctness. Banks accept this because
          the cost of inconsistency (fraud, regulatory violations, lost trust) far exceeds the
          cost of temporary unavailability.
        </p>

        <h3>Social Media: AP (Availability Critical)</h3>
        <p>
          Twitter, Facebook, and Instagram choose AP. During a partition, they continue accepting
          posts, likes, and comments—even if this means some users see stale feeds temporarily.
          The alternative (blocking posts during outages) would be catastrophic: imagine Twitter
          going read-only during the Super Bowl or a major news event. Users would flee to
          competitors.
        </p>

        <p>
          The trade-off: like counts might be off by a few for a few seconds. Some users might
          see a post before their friend's reply (temporal inconsistency). These are acceptable
          anomalies for social media. The cost of inconsistency is low; the cost of unavailability
          is existential.
        </p>

        <h3>E-commerce: Hybrid (Per-Operation Choice)</h3>
        <p>
          E-commerce platforms use both CP and AP for different operations. Inventory management
          is CP: if you have one item left and two customers try to buy it simultaneously, only
          one should succeed. Overselling leads to canceled orders, refunds, and angry customers.
          Payment processing is also CP: double-charging is unacceptable.
        </p>

        <p>
          But product reviews, recommendations, and browsing history are AP: stale reviews don't
          cause business harm, and availability improves engagement. Shopping carts are often AP
          with conflict resolution: if you add items on mobile and web simultaneously, both items
          appear (union merge). The cart is eventually consistent, but users can always add items.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/cap-real-world-decisions.svg`}
          caption="Figure 3: Real-World CAP Decisions by Use Case showing six scenarios: Financial Systems (CP—double-spend is catastrophic), Social Media (AP—unavailable feed is worse than stale), Inventory (CP—overselling destroys trust), Shopping Cart (AP—union merge is safe), Reviews & Comments (AP—stale count is acceptable), and Friend Relationships (CP—relationship state must be consistent). The decision framework at bottom asks: 'What's the cost of inconsistency?' vs 'What's the cost of unavailability?'"
          alt="Real-world CAP decision examples"
        />

        <h3>Content Delivery: AP (Latency Over Consistency)</h3>
        <p>
          CDNs and DNS are inherently AP systems. When you update a website, the change propagates
          to edge caches over time (hours for DNS, minutes for CDN). During propagation, different
          users see different versions. This is acceptable because content updates are infrequent
          compared to reads, and the alternative (blocking reads until all caches update) would
          make CDNs useless.
        </p>

        <p>
          CDNs use TTL (time-to-live) to bound staleness. A TTL of 300 seconds means "this content
          may be stale for up to 5 minutes." This is an explicit consistency SLA—clients know the
          maximum staleness window. For critical updates (security patches, emergency takedowns),
          CDNs offer purge APIs to force immediate invalidation.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for CAP-Aware Design</h2>

        <p>
          <strong>Design for the partition case, not the happy path.</strong> Any distributed
          system will experience partitions. Design your failure modes explicitly: will you block
          or diverge? Document this choice and ensure stakeholders understand the trade-off.
        </p>

        <p>
          <strong>Use tunable consistency when available.</strong> Don't choose CP or AP globally.
          Use strong consistency for critical operations (payments, inventory) and eventual
          consistency for non-critical ones (feeds, analytics). This optimizes both correctness
          and availability.
        </p>

        <p>
          <strong>Make inconsistency visible to users.</strong> Don't hide eventual consistency.
          Show "updated 2 minutes ago" timestamps, use "syncing..." indicators, or display
          potentially stale data with a disclaimer. Users tolerate inconsistency when they
          understand it's temporary.
        </p>

        <p>
          <strong>Implement conflict resolution before you need it.</strong> If you choose AP,
          conflicts are inevitable. Decide on conflict resolution strategy (LWW, vector clocks,
          CRDTs, application-specific merge) before launching. Test conflict scenarios—don't wait
          for production to discover you're losing data.
        </p>

        <p>
          <strong>Monitor partition detection and recovery.</strong> Track how quickly your system
          detects partitions and how long recovery takes. Long detection times mean extended periods
          of incorrect behavior. Slow recovery means prolonged inconsistency or unavailability.
        </p>

        <p>
          <strong>Test with chaos engineering.</strong> Simulate partitions in staging and
          production (with safeguards). Verify that your system behaves as designed: CP systems
          should block appropriately, AP systems should continue operating and converge after
          healing. Netflix's Chaos Monkey pioneered this approach.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and Misconceptions</h2>

        <p>
          <strong>Misconception: "Pick 2 of 3."</strong> This is the most common misunderstanding.
          CAP doesn't mean you permanently sacrifice one property. During normal operation (no
          partitions), you can have all three. The choice is only forced during partitions. A
          well-designed system provides C, A, and P most of the time—it just degrades gracefully
          when partitions occur.
        </p>

        <p>
          <strong>Misconception: "P is optional."</strong> Some believe you can choose CA and
          ignore partitions. This is wrong for distributed systems. Networks will fail—fiber gets
          cut, routers crash, data centers lose power. If your system can't tolerate partitions,
          it will fail catastrophically when they occur. The only way to avoid P is to use a
          single node, which isn't distributed.
        </p>

        <p>
          <strong>Misconception: "ACID = CAP Consistency."</strong> ACID Consistency (invariants
          preserved) is different from CAP Consistency (all nodes see same data). A single-node
          ACID database is CAP-consistent trivially. A distributed ACID database must handle CAP
          trade-offs. Don't confuse the terms.
        </p>

        <p>
          <strong>Misconception: "AP means no consistency."</strong> AP systems aren't
          consistency-free—they provide eventual consistency. Given no new writes, all replicas
          will converge. This is a real guarantee, not "anything goes." BASE systems include
          repair mechanisms (read repair, anti-entropy) that actively achieve convergence.
        </p>

        <p>
          <strong>Pitfall: Ignoring latency in availability.</strong> CAP Availability doesn't
          bound latency. A system that responds in 10 seconds is "available" under CAP. Real
          systems need latency SLAs (e.g., "99% of requests under 200ms"). A CP system that
          blocks for 30 seconds during partition is technically "available" (eventually responds)
          but practically useless.
        </p>

        <p>
          <strong>Pitfall: Not planning for partition recovery.</strong> Many systems handle
          partitions correctly but fail during recovery. CP systems must reconcile blocked
          operations; AP systems must resolve conflicts. Test recovery scenarios—don't assume
          healing is automatic.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/cap-misconceptions.svg`}
          caption="Figure 4: CAP Misconceptions vs Reality showing four common misunderstandings: (1) 'Pick 2 of 3' is wrong—choice is only during partition, (2) 'P is Optional' is wrong—networks will fail in distributed systems, (3) 'ACID = CAP C' is wrong—different definitions of consistency, (4) 'AP = No Consistency' is wrong—AP provides eventual consistency. The spectrum at bottom shows modern systems offer tunable consistency from Strong CP (Spanner) through Hybrid (Cassandra) to Strong AP (DNS, CDN)."
          alt="CAP theorem misconceptions diagram"
        />
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Google Spanner: CP with Global Scale</h3>
        <p>
          Google Spanner is a globally distributed SQL database that provides external consistency
          (stronger than linearizability) across continents. It achieves CP through synchronous
          replication with two-phase commit and TrueTime (atomic clocks + GPS for synchronized
          timestamps). During partitions, Spanner blocks writes on the minority side, preserving
          consistency.
        </p>

        <p>
          The trade-off: latency is bounded by speed of light. A write spanning US and Europe
          takes ~150ms minimum. Spanner accepts this latency cost to provide CP semantics at
          global scale. Use case: Google Ads billing, where correctness is non-negotiable.
        </p>

        <h3>Amazon DynamoDB: AP with Tunable Consistency</h3>
        <p>
          DynamoDB is a managed NoSQL database that defaults to AP but offers tunable consistency.
          Reads can specify "strongly consistent" (CP) or "eventually consistent" (AP). Writes
          replicate asynchronously to multiple availability zones. During AZ failures, eventually
          consistent reads may return stale data, but the system remains available.
        </p>

        <p>
          Use case: Amazon's shopping cart uses eventual consistency for adding items (AP) but
          strong consistency for checkout (CP). This hybrid approach provides availability for
          browsing and correctness for purchases.
        </p>

        <h3>Netflix: AP for Streaming, CP for Billing</h3>
        <p>
          Netflix's architecture is famously AP for video streaming. During AWS outages, users
          can continue watching content even if some metadata is stale. The cost of inconsistency
          (your watch history is a few minutes behind) is low; the cost of unavailability (can't
          stream during Super Bowl) is existential.
        </p>

        <p>
          But Netflix's billing system is CP. Subscription charges, payment updates, and account
          status require strong consistency. Netflix uses different data stores for different
          consistency domains: Cassandra (AP) for streaming metadata, PostgreSQL (CP) for billing.
        </p>

        <h3>GitHub: From MySQL to Vitess (CP to Tunable)</h3>
        <p>
          GitHub originally used a single MySQL database (CP). As scale grew, they migrated to
          Vitess (MySQL sharding with tunable consistency). Repository metadata uses strong
          consistency (can't have conflicting file versions). But activity feeds, notifications,
          and search use eventual consistency (stale feed is acceptable).
        </p>

        <p>
          The migration required careful data modeling to separate consistency domains. GitHub
          engineers documented which operations required CP vs AP, then designed schemas and
          queries accordingly. The result: improved availability without sacrificing correctness
          for critical operations.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: Explain the CAP theorem. During normal operation (no partitions), can a system
              provide all three properties?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> The CAP theorem states that during a network partition, a
              distributed system must choose between Consistency (all nodes see the same data)
              and Availability (every request gets a response). Partition Tolerance is mandatory
              in distributed systems—networks will fail. During normal operation (no partitions),
              a well-designed system can and should provide all three properties: consistency,
              availability, and partition tolerance. The CAP choice is only forced when the
              network actually partitions. This is a common misconception—CAP doesn't mean you
              permanently sacrifice one property.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Why is Partition Tolerance not optional? Answer: In
              distributed systems, nodes communicate over networks. Networks fail—fiber cuts,
              router crashes, data center outages. If your system can't tolerate partitions, it
              will fail catastrophically when they occur. The only way to avoid P is single-node
              deployment, which isn't distributed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: Your payment system is deployed across two data centers. A network partition
              occurs. Should you choose CP or AP? Justify your answer.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Choose CP. Payment systems must prevent double-spend and
              maintain accurate balances. If you choose AP during partition, both data centers
              could accept withdrawals from the same account, leading to negative balances and
              fraud. The cost of inconsistency (financial loss, regulatory violations, lost trust)
              far exceeds the cost of temporary unavailability. During the partition, block
              transactions on one side (or require manual intervention). Show users "service
              temporarily unavailable" rather than process potentially fraudulent transactions.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you minimize the impact of choosing CP? Answer:
              Use multi-region deployment with fast failover, implement local caching for read-only
              operations (show recent balance but block writes), communicate clearly to users
              ("restoring service, expected 5 minutes"), and have manual override procedures for
              critical transactions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What's the difference between strong consistency, eventual consistency, and
              causal consistency? When would you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Strong consistency (linearizability) means all reads return
              the most recent write, with a single global ordering. Eventual consistency means
              replicas will converge if no new writes occur, but reads may return stale data
              temporarily. Causal consistency is a middle ground: causally related operations
              are seen in order by all nodes, but concurrent operations can be seen in any order.
              Use strong consistency for payments, inventory, access control. Use eventual
              consistency for social feeds, analytics, caching. Use causal consistency for
              comment threads (replies must appear after parent), chat messages (responses after
              original), and collaborative editing (changes build on each other).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Give an example where causal consistency is sufficient
              but strong consistency is overkill. Answer: A chat application. If Alice sends
              "Hello" and Bob replies "Hi," all users should see "Hello" before "Hi" (causal
              order). But if Alice and Bob send messages simultaneously (no causal relationship),
              different users can see them in different orders. Causal consistency preserves
              conversation flow without the latency cost of strong consistency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: Your social media app's like count shows different values to different users
              during high traffic. Is this a CAP violation? How do you fix it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> This isn't a CAP violation—it's expected behavior in an
              AP system. The app chose availability (likes always work) over consistency (exact
              count). During high traffic, replication lag causes temporary divergence. Whether
              this needs "fixing" depends on requirements. If exact counts matter (e.g., influencer
              payments tied to like thresholds), switch to CP for like counts (use Redis INCR with
              synchronous replication). If approximate counts are acceptable (typical social media),
              keep AP but make staleness visible ("1.2K likes" instead of "1234 likes") and ensure
              convergence happens quickly (monitor replication lag, implement read repair).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you implement approximate counts that converge?
              Answer: Use a hybrid approach—store exact counts in a CP store (Redis) for small
              numbers, switch to probabilistic data structures (HyperLogLog) for large counts.
              Or use periodic aggregation—cache likes in AP store, batch-update exact count every
              few seconds.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: Design a globally distributed inventory system for an e-commerce site. How do
              you handle CAP trade-offs?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Inventory is CP—overselling is catastrophic. Design: (1)
              Partition inventory by warehouse/region—each region manages its own stock (reduces
              cross-region coordination). (2) Use strong consistency within region (Redis or
              PostgreSQL with synchronous replication). (3) For cross-region purchases, use
              distributed locking or two-phase commit (slow but correct). (4) Implement safety
              stock—keep buffer inventory to absorb demand during partitions. (5) Show "limited
              stock" instead of exact counts to users (reduces pressure on consistency). (6)
              During partitions, block sales in minority partition rather than risk overselling.
              Trade-off: some regions can't sell during outages, but no overselling.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you handle flash sales (10,000 users, 100 items)?
              Answer: Pre-allocate inventory to a queue (Redis List), users dequeue to purchase.
              This serializes access, preventing race conditions. Or use a lottery system—users
              enter a pool, 100 winners are selected, others get refunds. Avoids the CAP problem
              by removing concurrency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: A colleague says "Our system is CA—we don't need to worry about partitions."
              How do you respond?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> This is a dangerous misconception. In distributed systems,
              P is NOT optional—networks will fail. Claiming CA means your system will fail
              catastrophically when partitions occur (and they will). Respond: "CA is only possible
              in single-node systems. In distributed systems, you must handle partitions. The
              question isn't whether to support P, but how: will you choose CP (block during
              partition) or AP (continue with potential inconsistency)? Let's design the failure
              mode explicitly rather than hoping partitions don't happen." Then discuss actual
              partition scenarios (data center outage, fiber cut) and how the system should behave.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When is CA actually valid? Answer: Single-node databases,
              or systems where all nodes are in the same failure domain (same rack, same data
              center with shared network). But this isn't truly distributed—it's centralized with
              redundancy. Real distributed systems span failure domains, making P mandatory.
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
              href="https://en.wikipedia.org/wiki/CAP_theorem"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CAP Theorem — Wikipedia
            </a>
          </li>
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
              href="https://etcd.io/docs/latest/op-guide/failures/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              etcd Documentation — Failure Modes and Recovery
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
        </ul>
      </section>
    </ArticleLayout>
  );
}
