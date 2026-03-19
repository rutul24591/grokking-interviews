"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-backpressure-handling-extensive",
  title: "Backpressure Handling",
  description: "Comprehensive guide to backpressure in distributed systems, covering flow control, queue management, load shedding, and reactive patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "backpressure-handling",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "backpressure", "flow-control", "queues", "load-shedding", "resilience"],
  relatedTopics: ["fault-tolerance-resilience", "throughput-capacity", "rate-limiting-abuse-protection", "scalability-strategy"],
};

export default function BackpressureHandlingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Backpressure</strong> is a flow control mechanism where downstream components signal
          upstream components to slow down when they cannot keep up. It prevents system overload and
          cascading failures.
        </p>
        <p>
          Without backpressure: fast producers overwhelm slow consumers → queues fill → memory exhausts →
          system crashes → cascading failures.
        </p>
        <p>
          With backpressure: slow consumers signal producers → producers slow down → system remains stable
          under load.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Backpressure is System Immunity</h3>
          <p>
            Backpressure is how systems say &quot;I&apos;m at capacity.&quot; Ignoring this signal leads to
            collapse. Embracing it enables graceful degradation and recovery.
          </p>
        </div>
      </section>

      <section>
        <h2>Backpressure Patterns</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/backpressure-handling.svg"
          alt="Backpressure Handling Patterns"
          caption="Backpressure — showing backpressure signal flow, bounded queue pattern, load shedding strategies, and circuit breaker pattern"
        />
        <p>
          Several patterns implement backpressure:
        </p>
      </section>

      <section>
        <h2>Backpressure &amp; Flow Control Deep Dive</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/backpressure-deep-dive.svg"
          alt="Backpressure Deep Dive"
          caption="Backpressure Deep Dive — showing backpressure propagation, reactive streams backpressure, load shedding strategies"
        />
        <p>
          Advanced backpressure concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Bounded Queues</h3>
        <p>
          Use fixed-size queues instead of unbounded. When queue is full, producers block or fail fast.
        </p>
        <p>
          <strong>Implementation:</strong>
        </p>
        <ul>
          <li>ArrayBlockingQueue (Java), bounded channel (Go), asyncio.Queue with maxsize (Python).</li>
          <li>Queue size = throughput × acceptable latency.</li>
        </ul>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Prevents memory exhaustion.</li>
          <li>✓ Natural backpressure signal.</li>
          <li>✗ Producers must handle blocking/rejection.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Load Shedding</h3>
        <p>
          Reject requests when system is at capacity. Better to fail fast than fail slow.
        </p>
        <p>
          <strong>Implementation:</strong>
        </p>
        <ul>
          <li>Return 503 Service Unavailable with Retry-After header.</li>
          <li>Shed low-priority requests first.</li>
          <li>Use circuit breaker pattern.</li>
        </ul>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Protects system from overload.</li>
          <li>✓ Fast failure (better than timeout).</li>
          <li>✗ Some requests fail (but would have timed out anyway).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rate Limiting</h3>
        <p>
          Limit request rate at system boundaries. Prevents overload before it reaches internal components.
        </p>
        <p>
          <strong>See:</strong> Rate Limiting & Abuse Protection article for detailed patterns.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Reactive Streams</h3>
        <p>
          Pull-based model: consumers request N items, producers send exactly N.
        </p>
        <p>
          <strong>Examples:</strong> Reactive Streams (Java), RxJS, Project Reactor.
        </p>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Precise flow control.</li>
          <li>✓ No buffering needed.</li>
          <li>✗ Requires reactive programming model.</li>
        </ul>
      </section>

      <section>
        <h2>Backpressure in Practice</h2>
        <p>
          Implementing backpressure across system layers:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Database Connection Pools</h3>
        <p>
          Limit concurrent database connections. When pool exhausted, requests wait or fail.
        </p>
        <p>
          <strong>Configuration:</strong>
        </p>
        <ul>
          <li>Pool size = (core_count × 2) + 1 for CPU-bound.</li>
          <li>Pool size = concurrent_users × avg_queries for I/O-bound.</li>
          <li>Set connection timeout (fail fast if pool exhausted).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Message Queue Backpressure</h3>
        <p>
          Queues naturally provide backpressure when bounded:
        </p>
        <ul>
          <li>Set queue depth limits.</li>
          <li>Monitor queue depth, alert at 80% capacity.</li>
          <li>Auto-scale consumers when queue depth exceeds threshold.</li>
          <li>Dead letter queue for messages that can&apos;t be processed.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HTTP Server Backpressure</h3>
        <p>
          Limit concurrent requests at server level:
        </p>
        <ul>
          <li>Set max concurrent connections.</li>
          <li>Configure request timeouts.</li>
          <li>Use load balancer with health checks (remove overloaded instances).</li>
          <li>Implement request queuing with timeout.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Your service is receiving 10× normal traffic. How do you implement backpressure to prevent collapse?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Immediate (rate limiting):</strong> Enable rate limiting at API gateway. Return 429 for excess requests. Protect downstream services.</li>
                <li><strong>Bounded queues:</strong> Ensure all queues have limits. Reject new requests when queue full. Prevents memory exhaustion.</li>
                <li><strong>Load shedding:</strong> Drop non-critical requests. Prioritize critical paths (login, checkout over recommendations).</li>
                <li><strong>Timeouts:</strong> Ensure all downstream calls have timeouts. Prevent thread pool exhaustion from hanging calls.</li>
                <li><strong>Circuit breakers:</strong> Open circuits for failing dependencies. Fail fast instead of waiting for timeouts.</li>
                <li><strong>Auto-scaling:</strong> Trigger auto-scaling if not already at max. Add capacity to handle load.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Explain bounded queues vs unbounded queues. When would you use each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Bounded queues:</strong> Fixed maximum size. ✓ Prevents memory exhaustion, provides backpressure. ✗ Can reject requests when full.</li>
                <li><strong>Unbounded queues:</strong> No maximum size. ✓ Never rejects requests. ✗ Can exhaust memory, crash system.</li>
                <li><strong>Use bounded when:</strong> Production systems, memory-constrained environments, need backpressure.</li>
                <li><strong>Use unbounded when:</strong> Testing, batch processing with known input size, external flow control exists.</li>
                <li><strong>Best practice:</strong> Always use bounded queues in production. Size based on memory budget and acceptable latency.</li>
                <li><strong>Example:</strong> Queue size = 1000 items. At 100 items/sec processing rate = 10 seconds max wait. Reject after that.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Design a message processing pipeline with backpressure. How do you handle slow consumers?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Bounded queues:</strong> Each stage has bounded queue between producer and consumer.</li>
                <li><strong>Slow consumer detection:</strong> Monitor queue depth. Alert when queue &gt; 80% full.</li>
                <li><strong>Handling slow consumers:</strong> (1) Scale up consumer instances. (2) Reduce producer rate (backpressure). (3) Drop low-priority messages.</li>
                <li><strong>Dead letter queue:</strong> Move failed messages to DLQ after N retries. Prevents poison pills blocking queue.</li>
                <li><strong>Flow control:</strong> Producer waits when queue full (blocking) or gets rejection (non-blocking).</li>
                <li><strong>Example:</strong> Kafka with consumer groups. Auto-scale consumers based on lag. Backpressure via Kafka&apos;s built-in flow control.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Your database connection pool is exhausted. What are your options for handling this?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Immediate:</strong> Return 503 for new requests. Don&apos;t wait for connection (would timeout anyway).</li>
                <li><strong>Increase pool size:</strong> Temporary fix. Only works if database has capacity.</li>
                <li><strong>Optimize queries:</strong> Find slow queries holding connections. Optimize or kill them.</li>
                <li><strong>Add read replicas:</strong> Offload read traffic. Reduces pressure on primary connection pool.</li>
                <li><strong>Connection pooling:</strong> Use PgBouncer/ProxySQL for connection multiplexing. More efficient connection usage.</li>
                <li><strong>Prevention:</strong> Set connection timeout (fail fast). Monitor pool utilization. Alert at 80%.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Compare load shedding vs queuing for backpressure. What are the trade-offs?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Queuing:</strong> Buffer excess requests. ✓ Smooths traffic spikes, no rejected requests. ✗ Increased latency, memory usage, eventual overflow.</li>
                <li><strong>Load shedding:</strong> Reject excess requests. ✓ Protects system, predictable latency. ✗ Some requests fail, need retry logic.</li>
                <li><strong>Trade-off:</strong> Queuing trades latency for throughput. Load shedding trades throughput for latency.</li>
                <li><strong>When to queue:</strong> Short spikes (&lt; 1 min), latency-tolerant workloads (batch processing).</li>
                <li><strong>When to shed:</strong> Long spikes, latency-sensitive workloads (APIs), when queue would overflow anyway.</li>
                <li><strong>Best practice:</strong> Small bounded queue + load shedding. Buffer brief spikes, shed sustained overload.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you implement backpressure in a reactive streaming system?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Reactive Streams:</strong> Publisher-Subscriber pattern with backpressure. Subscriber requests N items, Publisher sends N items.</li>
                <li><strong>Request(n):</strong> Subscriber explicitly requests how many items it can handle. Controls flow.</li>
                <li><strong>Implementation:</strong> Project Reactor (Java), RxJS (JavaScript), Akka Streams (Scala).</li>
                <li><strong>Strategies:</strong> (1) Buffer (queue items). (2) Drop (drop new items). (3) Latest (drop old items). (4) Error (signal error).</li>
                <li><strong>Example:</strong> Stream processing 1M events/sec. Subscriber processes 100K/sec. Requests 100K at a time. Publisher waits for next request.</li>
                <li><strong>Best practice:</strong> Use reactive frameworks for streaming workloads. Built-in backpressure support.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Backpressure Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Bounded queues at all system boundaries</li>
          <li>✓ Connection pools configured with limits</li>
          <li>✓ Load shedding implemented (503 on overload)</li>
          <li>✓ Rate limiting at API boundaries</li>
          <li>✓ Queue depth monitoring and alerting</li>
          <li>✓ Circuit breakers for downstream dependencies</li>
          <li>✓ Request timeouts configured</li>
          <li>✓ Auto-scaling based on queue depth</li>
          <li>✓ Dead letter queues for failed messages</li>
          <li>✓ Graceful degradation under load</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
