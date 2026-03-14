"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-apache-kafka-extensive",
  title: "Apache Kafka",
  description:
    "A practical guide to Kafka's log-based model, partitioning, durability, and the operational decisions that determine correctness and cost.",
  category: "backend",
  subcategory: "data-processing-analytics",
  slug: "apache-kafka",
  wordCount: 1342,
  readingTime: 6,
  lastUpdated: "2026-03-14",
  tags: ["backend", "data", "streaming", "kafka", "messaging"],
  relatedTopics: ["stream-processing", "message-ordering", "exactly-once-semantics"],
};

export default function ApacheKafkaConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Why Teams Choose Kafka</h2>
        <p>
          <strong>Apache Kafka</strong> is a distributed event streaming platform built around a simple idea: treat events
          as an append-only log and scale that log by partitioning and replication. Producers append records to a topic.
          Consumers read records by offset and can replay the log to rebuild downstream state.
        </p>
        <p>
          Teams choose Kafka when they need a durable backbone for high-throughput pipelines, event-driven architectures,
          and streaming analytics. The practical advantage is replayability and decoupling: producers do not need to know
          who consumes their data, and consumers can reprocess history when requirements change.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Kafka Is a Fit When You Need</h3>
          <ul className="space-y-2">
            <li>High-throughput ingestion with durability and replication.</li>
            <li>Multiple consumers with different processing needs and independent pace.</li>
            <li>Replay for backfills, bug fixes, and rebuilding derived views.</li>
            <li>Ordering within a key or partition for correctness.</li>
            <li>Operational control over retention and compaction policies.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>The Log Model: Topics, Partitions, Offsets</h2>
        <p>
          Kafka organizes data into <strong>topics</strong>. A topic is divided into <strong>partitions</strong>, each of
          which is an ordered, append-only sequence. Producers choose a partition (often via a partition key). Consumers
          read sequentially and track progress as an <strong>offset</strong>.
        </p>
        <p>
          The most important correctness rule is simple: Kafka provides ordering <em>within a partition</em>, not across
          a topic. If your correctness depends on ordering, your partitioning strategy becomes part of your application
          logic.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/apache-kafka-diagram-1.svg"
          alt="Kafka topic partition and consumer group diagram"
          caption="Kafka's core model: topics are partitioned logs; consumer groups scale reads by partition assignment."
        />
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Partition key:</strong> determines ordering scope and load distribution.
          </li>
          <li>
            <strong>Offsets:</strong> enable at-least-once processing and replay; committing offsets is a correctness step.
          </li>
          <li>
            <strong>Consumer groups:</strong> one partition is read by at most one consumer in a group at a time.
          </li>
        </ul>
      </section>

      <section>
        <h2>Durability and Availability: Replication, Leaders, and ISR</h2>
        <p>
          Kafka achieves durability by replicating partitions across brokers. Each partition has a leader that accepts
          writes and one or more followers. Replication is not just “copy data.” It affects latency, failure tolerance,
          and what happens when brokers fail.
        </p>
        <p>
          The operational contract is defined by producer acknowledgments and replica quorum settings. Stronger settings
          reduce data loss risk but can increase write latency and reduce availability during failures.
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/apache-kafka-diagram-2.svg"
          alt="Kafka replication and in-sync replicas diagram"
          caption="Replication: leaders accept writes; in-sync replicas determine how safe it is to acknowledge a record."
        />
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Durability Knobs (Conceptually)</h3>
          <ul className="space-y-2">
            <li>
              <strong>Replication factor:</strong> how many copies exist.
            </li>
            <li>
              <strong>Min in-sync replicas:</strong> how many replicas must be current to accept writes safely.
            </li>
            <li>
              <strong>Acknowledgment level:</strong> when a producer considers a write committed.
            </li>
          </ul>
        </div>
        <p>
          Misconfiguration here produces painful outcomes: either you lose data in failure scenarios (too weak) or you
          turn routine broker maintenance into a write outage (too strict without enough healthy replicas).
        </p>
      </section>

      <section>
        <h2>Partitioning Strategy: Correctness and Throughput at the Same Time</h2>
        <p>
          Partitioning determines both scalability and semantics. Too few partitions limit throughput and parallelism.
          Too many partitions increase overhead (metadata, leader elections, rebalances) and can degrade performance.
          The best partition count is workload-specific and should be treated as a capacity planning decision.
        </p>
        <p>
          Key choice is more subtle. If you partition by user id, you preserve per-user ordering but may create hot users
          that dominate one partition. If you partition by tenant, you preserve tenant ordering but risk uneven load if one
          tenant is huge. If you partition randomly, you maximize throughput but lose ordering guarantees.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Correctness first:</strong> define what must be ordered and partition around that requirement.
          </li>
          <li>
            <strong>Hot partition detection:</strong> monitor per-partition throughput and lag, not just topic totals.
          </li>
          <li>
            <strong>Future growth:</strong> increasing partitions later is possible but often disruptive for downstream consumers.
          </li>
        </ul>
      </section>

      <section>
        <h2>Retention, Compaction, and Reprocessing</h2>
        <p>
          Kafka is a log, but it is not necessarily infinite. Retention controls how far back you can replay. If retention
          is too short, downstream backfills and incident recovery become impossible. If retention is too long, storage
          cost grows and operational complexity increases.
        </p>
        <p>
          Kafka also supports <strong>log compaction</strong>, which keeps the latest record per key. Compaction is useful
          for topics that represent “current state” (like user profile snapshots) rather than event history. Compacted
          topics behave more like a persistent key/value changelog.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Time-based retention:</strong> keep events for N hours/days for replay.
          </li>
          <li>
            <strong>Size-based retention:</strong> cap disk usage at the cost of shorter replay windows.
          </li>
          <li>
            <strong>Compaction:</strong> keep latest by key, enabling snapshot rebuilds and stream-table patterns.
          </li>
        </ul>
        <p className="mt-4">
          Retention policy is a product decision as much as a technical one: it defines how far back you can correct data
          and how resilient you are to downstream pipeline outages.
        </p>
      </section>

      <section>
        <h2>Consumer Groups, Lag, and Backpressure</h2>
        <p>
          Kafka decouples producers and consumers, which is powerful but introduces lag as a first-class operational
          concept. <strong>Consumer lag</strong> measures how far behind consumers are relative to the head of the log.
          Lag is not always bad. It is a buffer. But sustained lag means your system is falling behind and recovery may
          become impossible within retention windows.
        </p>
        <p>
          Rebalances are another operational reality. When consumer group membership changes, partitions are reassigned,
          which can pause consumption and create throughput hiccups. Frequent rebalances indicate instability (crashing
          consumers, misconfigured timeouts, or overloaded instances).
        </p>
        <ArticleImage
          src="/diagrams/backend/data-processing-analytics/apache-kafka-diagram-3.svg"
          alt="Consumer lag and backpressure diagram"
          caption="Operational reality: lag is your buffer, but sustained lag plus rebalances can turn into missed freshness and retention risk."
        />
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Lag Triage Signals</h3>
          <ul className="space-y-2">
            <li>Lag growth rate (is it increasing faster than you can process?).</li>
            <li>Partition skew (one partition far behind indicates hot key or uneven load).</li>
            <li>Rebalance frequency (too frequent means instability and processing pauses).</li>
            <li>End-to-end freshness (lag translated into user-facing delay, not just offsets).</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Operational Failure Modes</h2>
        <p>
          Kafka failures are often “brownouts”: the cluster is up but throughput drops, latency increases, and lag grows.
          The fastest way to keep Kafka reliable is to understand how failures present and to have safe mitigations that
          protect durability and prevent load amplification.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Under-replicated partitions:</strong> durability risk and reduced availability for safe writes.
          </li>
          <li>
            <strong>Disk pressure:</strong> log segments cannot be written; retention policies may start deleting aggressively.
          </li>
          <li>
            <strong>Controller or metadata instability:</strong> frequent leadership changes and client errors.
          </li>
          <li>
            <strong>Hot partitions:</strong> one partition dominates load and throttles the topic.
          </li>
          <li>
            <strong>Consumer lag runaway:</strong> backlog grows beyond retention; downstream correctness breaks.
          </li>
          <li>
            <strong>Schema drift:</strong> consumers fail or produce incorrect results due to incompatible event shapes.
          </li>
        </ul>
        <p className="mt-4">
          Many incidents are self-amplified: retries increase load, which increases latency, which triggers more retries.
          Rate limiting and backpressure in producers and consumers are key to keeping Kafka stable under stress.
        </p>
      </section>

      <section>
        <h2>Design Decisions and Trade-offs</h2>
        <p>
          Kafka’s power comes with meaningful trade-offs. Most production problems are not “Kafka is broken.” They are
          “we made a design choice that doesn’t match our workload”: partition key mismatch, retention mismatch, or
          durability settings that conflict with availability needs.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Throughput vs ordering:</strong> stronger ordering often means less parallelism.
          </li>
          <li>
            <strong>Durability vs availability:</strong> stricter quorum settings can reject writes during partial failures.
          </li>
          <li>
            <strong>Retention vs cost:</strong> longer replay windows cost storage but reduce recovery risk.
          </li>
          <li>
            <strong>Operational simplicity vs flexibility:</strong> many small topics and consumer groups increase surface area.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough</h2>
        <p>
          A product analytics pipeline ingests clickstream events. The team partitions by user id to preserve per-user
          ordering for session reconstruction. Over time, a small number of power users become hot keys and one partition
          dominates throughput. Consumer lag grows for that partition only.
        </p>
        <p>
          The mitigation is to change the key strategy: partition by a hash that spreads load while preserving ordering
          within a smaller scope (for example, user id plus a time bucket). The team also adds a “top partitions by lag”
          dashboard and sets retention long enough to support backfills after consumer outages.
        </p>
        <p>
          After the incident, governance is improved: topic ownership is documented, retention policies are reviewed, and
          schema compatibility rules are enforced to prevent silent consumer breakage.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use this checklist when adopting Kafka for a new workload.</p>
        <ul className="mt-4 space-y-2">
          <li>Define ordering requirements first, then choose a partition key that matches correctness.</li>
          <li>Choose partition count for throughput and growth, and monitor per-partition skew and lag.</li>
          <li>Set durability knobs intentionally (replication, quorum) and test failure scenarios.</li>
          <li>Set retention/compaction based on replay and state rebuild needs, not defaults.</li>
          <li>Monitor cluster health: under-replicated partitions, disk usage, controller stability, consumer lag.</li>
          <li>Enforce schema compatibility and topic lifecycle governance to prevent sprawl.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>Describe Kafka in terms of semantics and operational behavior, not just components.</p>
        <ul className="mt-4 space-y-2">
          <li>What guarantees does Kafka provide about ordering, and what determines the ordering scope?</li>
          <li>How do partitioning choices affect throughput, lag, and correctness?</li>
          <li>What durability settings reduce data loss risk, and what do they trade off?</li>
          <li>How do you monitor and troubleshoot consumer lag and rebalance storms?</li>
          <li>How do retention and compaction affect replay and state rebuild strategies?</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

