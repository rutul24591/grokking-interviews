"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-message-ordering-guarantees-extensive",
  title: "Message Ordering Guarantees",
  description: "Comprehensive guide to message ordering in distributed systems, covering partition ordering, causal ordering, sequence numbers, and reordering patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "message-ordering-guarantees",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "message-ordering", "kafka", "partitions", "distributed-systems", "messaging"],
  relatedTopics: ["consistency-model", "event-replayability", "multi-region-replication", "backpressure-handling"],
};

export default function MessageOrderingGuaranteesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Message Ordering</strong> defines the guarantees a messaging system provides about
          the order in which messages are delivered to consumers. Different ordering guarantees have
          different performance and scalability characteristics.
        </p>
        <p>
          Ordering levels (weakest to strongest):
        </p>
        <ul>
          <li>
            <strong>No ordering:</strong> Messages may arrive in any order.
          </li>
          <li>
            <strong>Partition ordering:</strong> Ordered within partition, not across partitions.
          </li>
          <li>
            <strong>Causal ordering:</strong> Cause before effect, concurrent messages unordered.
          </li>
          <li>
            <strong>Global ordering:</strong> Total order across all messages.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Ordering Has a Cost</h3>
          <p>
            Stronger ordering guarantees require more coordination, which reduces throughput and
            increases latency. Choose the weakest ordering that meets your requirements.
          </p>
        </div>
      </section>

      <section>
        <h2>Ordering Levels</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/message-ordering.svg"
          alt="Message Ordering Guarantees"
          caption="Message Ordering — showing partition-based ordering, ordering levels, and consumer-side reordering"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">No Ordering</h3>
        <p>
          Messages may be delivered in any order:
        </p>
        <ul>
          <li>Fastest, most scalable.</li>
          <li>Consumer must handle reordering if needed.</li>
          <li>Use when order doesn&apos;t matter (logs, metrics).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Partition Ordering</h3>
        <p>
          Messages within a partition are ordered:
        </p>
        <ul>
          <li>Messages with same partition key go to same partition.</li>
          <li>Ordered within partition (by sequence number).</li>
          <li>No ordering across partitions.</li>
          <li>Use when related messages share partition key.</li>
        </ul>
        <p>
          <strong>Example:</strong> Kafka, Kinesis.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Causal Ordering</h3>
        <p>
          Causally related messages are ordered:
        </p>
        <ul>
          <li>If A caused B, A is delivered before B.</li>
          <li>Concurrent (unrelated) messages may be unordered.</li>
          <li>Use vector clocks or similar mechanisms.</li>
          <li>Use when causality matters (chat, collaborative editing).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Global Ordering</h3>
        <p>
          All messages have a total order:
        </p>
        <ul>
          <li>Single partition or centralized sequencer.</li>
          <li>Strongest guarantee, lowest scalability.</li>
          <li>Use when all messages must be ordered (ledger, audit log).</li>
        </ul>
        <p>
          <strong>Example:</strong> Single-partition Kafka topic, ZooKeeper.
        </p>
      </section>

      <section>
        <h2>Partition Key Design</h2>
        <p>
          Partition key determines ordering:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Same Key = Same Partition = Ordered</h3>
        <p>
          Messages with the same partition key are guaranteed ordered:
        </p>
        <ul>
          <li>User events: partition by user_id.</li>
          <li>Order events: partition by order_id.</li>
          <li>Device events: partition by device_id.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Different Keys = Different Partitions = Unordered</h3>
        <p>
          Messages with different keys may be unordered:
        </p>
        <ul>
          <li>User A&apos;s events and User B&apos;s events are unordered relative to each other.</li>
          <li>This is usually acceptable (users are independent).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Partition Key Trade-offs</h3>
        <p>
          Key design affects both ordering and load distribution:
        </p>
        <ul>
          <li>
            <strong>Too granular:</strong> Many partitions, good distribution, less ordering.
          </li>
          <li>
            <strong>Too coarse:</strong> Few partitions, more ordering, potential hotspots.
          </li>
          <li>
            <strong>Balance:</strong> Order only what needs ordering, distribute the rest.
          </li>
        </ul>
      </section>

      <section>
        <h2>Sequence Numbers</h2>
        <p>
          Track message order with sequence numbers:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Per-Partition Sequence</h3>
        <p>
          Each partition maintains its own sequence:
        </p>
        <ul>
          <li>Messages within partition have sequential offsets (0, 1, 2...)</li>
          <li>Consumer tracks last processed offset per partition</li>
          <li>Example: Partition 0 has messages A(offset 0) → C(offset 1) → E(offset 2)</li>
          <li>Consumer offsets tracked per partition (partition_0: 2, partition_1: 1, partition_2: 0)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consumer-Side Reordering</h3>
        <p>
          Buffer and reorder at consumer:
        </p>
        <ul>
          <li>Buffer out-of-order messages.</li>
          <li>Wait for missing sequence numbers.</li>
          <li>Process in order when complete.</li>
          <li>Timeout for missing messages.</li>
        </ul>
        <p>
          <strong>Trade-off:</strong> Latency vs ordering guarantee.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a messaging system for a chat application where messages must be ordered per conversation.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Partition key:</strong> Use conversation_id as partition key. All messages in same conversation go to same partition.</li>
                <li><strong>Ordering guarantee:</strong> Partition-level ordering (Kafka, Kinesis). Messages in same partition are ordered.</li>
                <li><strong>Sequence numbers:</strong> Each message gets sequence number within partition. Consumer tracks last processed sequence number.</li>
                <li><strong>Out-of-order handling:</strong> Buffer messages, wait for missing sequence numbers. Timeout for missing messages.</li>
                <li><strong>Scaling:</strong> One partition per conversation (hot conversations). Multiple conversations per partition (cold conversations).</li>
                <li><strong>Example:</strong> WhatsApp/Telegram use similar pattern. Messages ordered per chat, not globally.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Compare partition ordering vs global ordering. When would you use each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Partition ordering:</strong> Ordered within partition, unordered across partitions. ✓ Scales horizontally, low latency. ✗ No global order.</li>
                <li><strong>Global ordering:</strong> All messages totally ordered. ✓ Simple mental model. ✗ Doesn&apos;t scale, single bottleneck.</li>
                <li><strong>Use partition ordering when:</strong> High throughput needed, related messages share partition key (user events, conversation messages).</li>
                <li><strong>Use global ordering when:</strong> Low throughput, strict ordering required across all messages (financial transactions, audit logs).</li>
                <li><strong>Best practice:</strong> Partition ordering for most use cases. Global ordering only when absolutely necessary.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. How do you handle out-of-order messages in a stream processing system?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Buffering:</strong> Buffer messages, wait for missing sequence numbers. Process when complete.</li>
                <li><strong>Watermarks:</strong> Track progress per partition. Process messages up to watermark.</li>
                <li><strong>Timeout:</strong> Wait N seconds for missing messages. Process what you have after timeout.</li>
                <li><strong>Idempotent processing:</strong> Design handlers to be idempotent. Safe to process duplicates if late message arrives.</li>
                <li><strong>Tools:</strong> Apache Flink, Kafka Streams have built-in out-of-order handling with watermarks.</li>
                <li><strong>Trade-off:</strong> More buffering = better ordering, higher latency. Less buffering = lower latency, more out-of-order.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Your partition is a hotspot (receiving disproportionate traffic). How do you fix this?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Problem:</strong> One partition key has much more traffic (celebrity account, popular product).</li>
                <li><strong>Solution 1:</strong> Add salt to partition key (user_id + random_suffix). Spreads traffic across partitions.</li>
                <li><strong>Solution 2:</strong> Pre-partition hot keys (celebrity_1, celebrity_2, celebrity_3). Merge results at read time.</li>
                <li><strong>Solution 3:</strong> Separate hot data to dedicated partition/topic. Scale independently.</li>
                <li><strong>Monitoring:</strong> Alert on partition imbalance. Rebalance when one partition &gt; 2× average.</li>
                <li><strong>Example:</strong> Twitter handles celebrity accounts by pre-partitioning. Taylor Swift tweets go to multiple partitions.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. How do you implement causal ordering in a distributed system?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Causal ordering:</strong> If A caused B, all observers see A before B. Concurrent events can be in any order.</li>
                <li><strong>Vector clocks:</strong> Track causality with vector of logical timestamps. Compare vectors to determine causality.</li>
                <li><strong>Implementation:</strong> (1) Each node has vector clock. (2) Include clock in message. (3) Receiver updates clock. (4) Buffer out-of-order messages.</li>
                <li><strong>Session guarantees:</strong> Read-your-writes, monotonic reads. Easier than full causal ordering.</li>
                <li><strong>Use cases:</strong> Comment threads (reply must appear after parent), collaborative editing.</li>
                <li><strong>Trade-off:</strong> Causal ordering adds complexity. Only use when causality matters.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. Design partition key strategy for an IoT platform with millions of devices.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Requirements:</strong> Messages from same device must be ordered. High throughput (millions of devices).</li>
                <li><strong>Partition key:</strong> device_id. All messages from same device go to same partition. Ordered per device.</li>
                <li><strong>Scaling:</strong> Many devices per partition (1000s). Partitions = devices / 1000.</li>
                <li><strong>Hot devices:</strong> Some devices send more data. Add salt for hot devices (device_id + suffix).</li>
                <li><strong>Time-based partitioning:</strong> Partition by (device_id, date). Old data archived separately.</li>
                <li><strong>Example:</strong> AWS IoT Core uses similar pattern. Messages ordered per device, scaled across partitions.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Message Ordering Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Ordering requirements documented per message type</li>
          <li>✓ Partition key design ensures related messages are ordered</li>
          <li>✓ Sequence numbers tracked per partition</li>
          <li>✓ Consumer handles out-of-order messages</li>
          <li>✓ Partition distribution monitored (no hotspots)</li>
          <li>✓ Reordering buffer configured with timeout</li>
          <li>✓ Idempotent message processing</li>
          <li>✓ Duplicate detection implemented</li>
          <li>✓ Ordering guarantees tested</li>
          <li>✓ Documentation for partition key strategy</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
