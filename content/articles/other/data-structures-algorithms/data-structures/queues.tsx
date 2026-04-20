"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "queues",
  title: "Queues",
  description:
    "Staff-level deep dive into queues — FIFO semantics, circular buffers, bounded vs unbounded designs, concurrent and lock-free variants, backpressure, and the role of queues in message brokers and schedulers.",
  category: "other",
  subcategory: "data-structures",
  slug: "queues",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-17",
  tags: [
    "queues",
    "fifo",
    "circular-buffer",
    "concurrency",
    "backpressure",
    "data-structures",
  ],
  relatedTopics: [
    "stacks",
    "arrays",
    "singly-linked-lists",
    "heaps-priority-queues",
  ],
};

export default function QueuesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* SECTION 1 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p>
          A <strong>queue</strong> is a collection with first-in, first-out
          (FIFO) access semantics: elements are enqueued at the tail and
          dequeued from the head, in the order they arrived. The interface
          is minimal — <code>enqueue</code>, <code>dequeue</code>,{" "}
          <code>peek</code>, <code>size</code> — but the structure sits at
          the throat of every request pipeline, every scheduler, every
          message bus, and every backpressure-aware stream in production
          software.
        </p>
        <p>
          The FIFO discipline matches fairness: whoever arrived first is
          served first. It matches temporal ordering: processing in enqueue
          order preserves causal sequence. It matches decoupling: producer
          rate and consumer rate can differ, and the queue absorbs the
          imbalance up to its capacity. These three properties combined are
          why queues are the universal connector between asynchronous
          components — from hardware interrupt handlers to browser event
          loops to distributed task pipelines.
        </p>
        <p>
          Implementations fall into a handful of canonical shapes.{" "}
          <strong>Circular buffers (ring buffers)</strong> over arrays give
          O(1) enqueue and dequeue with cache-friendly memory. Linked
          queues with head and tail pointers trade memory density for
          worst-case O(1) enqueue. Concurrent variants — Michael-Scott
          queue, LMAX Disruptor, SPSC/MPMC lock-free queues — layer atomic
          CAS or hazard pointers on top. Persistent functional queues
          (banker&apos;s queue, Okasaki&apos;s real-time queue) use two
          stacks for amortized O(1) with immutable structure.
        </p>
        <p>
          At staff level, queue decisions are less about the textbook shape
          and more about bounded vs unbounded capacity, blocking vs
          non-blocking on full/empty, single-producer vs multi-producer,
          and memory ordering guarantees under concurrent access. The
          wrong answer in any of those dimensions produces the classic
          incidents — queue buildup during upstream slowdowns, lost
          messages during failure, latency spikes during contention — that
          every senior engineer has debugged in production.
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          FIFO ordering invariant
        </h3>
        <p>
          Elements must leave in enqueue order. Two concurrent consumers
          pulling from the same queue still each see a contiguous
          subsequence of the arrival order — no concurrent queue reorders
          messages visible to a given consumer. This invariant is what
          makes the queue a substitute for direct synchronous messaging:
          the reader can trust the sequence.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Circular buffer layout
        </h3>
        <p>
          A ring buffer uses a fixed-size array plus head and tail indices
          that wrap modulo the capacity. Enqueue writes at tail and advances;
          dequeue reads at head and advances. The &quot;full&quot; and
          &quot;empty&quot; conditions must be distinguishable — the two
          canonical solutions are to keep one slot reserved (empty when
          head == tail, full when (tail + 1) % capacity == head) or to
          maintain an explicit count. Ring buffers are the implementation
          behind <code>std::deque</code> in C++, Go channels,{" "}
          <code>java.util.ArrayDeque</code>, Rust&apos;s <code>VecDeque</code>,
          and most hardware-interface queues (PCIe queues, network driver
          ring descriptors).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Bounded vs unbounded
        </h3>
        <p>
          A <strong>bounded queue</strong> rejects or blocks on enqueue when
          full, bounding memory usage and exposing backpressure upstream. An
          <strong> unbounded queue</strong> accepts enqueues unconditionally
          and can only fail by running out of memory. Every production
          message system defaults to bounded: Kafka topics have retention
          limits, Go channels are often created with capacity, AWS SQS has
          per-queue message caps. Unbounded queues in long-running services
          are latent OOM bugs — an upstream slowdown produces a memory
          monotonically-increasing graph until the process dies.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/queues-diagram-1.svg"
          alt="FIFO queue enqueue at tail and dequeue at head showing insertion order preserved through the structure"
          caption="Figure 1: FIFO enqueue/dequeue — elements leave in arrival order; the queue absorbs producer-consumer rate mismatch."
        />
      </section>

      {/* SECTION 3 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Circular buffer mechanics
        </h3>
        <p>
          The ring is two monotonically increasing counters modulo the
          capacity. On enqueue: check not-full, write{" "}
          <code>buf[tail % cap]</code>, increment tail. On dequeue: check
          not-empty, read <code>buf[head % cap]</code>, increment head.
          When <code>cap</code> is a power of two, the modulo becomes a
          bitmask — a single AND instruction — which is why production
          concurrent ring buffers (LMAX Disruptor, every DPDK data-plane)
          insist on power-of-two capacities.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Two-stack queue (amortized)
        </h3>
        <p>
          An elegant design derivable from scratch in an interview: one
          stack for enqueues, another for dequeues. Enqueue pushes on the
          in-stack. Dequeue pops from the out-stack; when empty, transfer
          all elements from in to out in bulk, reversing order. Each
          element moves at most twice across both stacks, so amortized O(1)
          per operation. The worst-case single dequeue is O(n) during a
          transfer — which disqualifies this design for latency-sensitive
          workloads despite its amortized elegance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Concurrent queues
        </h3>
        <p>
          The Michael-Scott queue is the canonical unbounded concurrent
          queue: a linked structure with atomic head and tail pointers,
          using CAS on tail.next for enqueue and CAS on head for dequeue.
          It guarantees linearizability, wait-freedom for dequeue, and
          lock-freedom for enqueue. The LMAX Disruptor, built on a ring
          buffer with memory-barrier-controlled sequence numbers, achieves
          tens of millions of messages per second per core in
          single-producer configurations by avoiding all allocation and
          aligning hot fields to cache lines. Both are studied examples;
          the right choice depends on whether an unbounded linked structure
          or a bounded pre-allocated ring fits the workload.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/queues-diagram-2.svg"
          alt="Circular buffer ring showing head and tail indices wrapping around a fixed-size array"
          caption="Figure 2: Circular buffer — head and tail indices advance and wrap modulo the capacity; power-of-two sizes enable bitmask modulo."
        />
      </section>

      {/* SECTION 4 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          Trade-offs &amp; Comparisons
        </h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Operation complexity
        </h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Enqueue</strong>: O(1) amortized (ring buffer, linked
            queue); O(1) worst-case with linked implementation.
          </li>
          <li>
            <strong>Dequeue</strong>: O(1) for all implementations.
          </li>
          <li>
            <strong>Peek</strong>: O(1).
          </li>
          <li>
            <strong>Size</strong>: O(1) with maintained counter; O(n) if
            derived from head/tail differencing without counter.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Ring buffer vs linked queue
        </h3>
        <p>
          Ring buffers win on cache behavior, memory density, allocator
          avoidance, and predictable latency (no resize spikes, no heap
          alloc per enqueue). They lose when capacity is truly unknown or
          when the workload needs unbounded growth — though the staff-level
          critique of that need is usually &quot;you need backpressure, not
          an unbounded queue.&quot; Linked queues win for lock-free
          Michael-Scott designs and when the capacity estimate could vary
          by orders of magnitude.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Queue vs priority queue
        </h3>
        <p>
          A priority queue relaxes FIFO to ordered-by-priority retrieval.
          Implementations are typically heaps, not queues. If the workload
          demands priority scheduling (OS runqueues with nice values, task
          schedulers with deadlines, Dijkstra&apos;s shortest path), reach
          for a heap. A priority queue is not a queue in the FIFO sense;
          the shared name is occasionally a source of confusion.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Single-producer vs multi-producer concurrency
        </h3>
        <p>
          The single-producer single-consumer (SPSC) queue is the simplest
          concurrent case — one writer, one reader, no contention on
          either index. It compiles to two memory barriers and an index
          update per operation, hitting hundreds of millions of operations
          per second. Multi-producer (MPSC or MPMC) variants pay for
          atomic updates on the tail index and are an order of magnitude
          slower under contention. Design intent matters: if the workload
          is truly SPSC, using an MPMC queue wastes performance; if the
          workload has multiple producers, using an SPSC queue corrupts
          silently.
        </p>
      </section>

      {/* SECTION 5 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Bound your queues.</strong> Set an explicit capacity
            with a documented overflow policy (block, drop-oldest, drop-
            newest, reject with error). Unbounded queues in production are
            latent OOMs waiting for an upstream slow-down.
          </li>
          <li>
            <strong>Use power-of-two capacities for ring buffers.</strong>{" "}
            Replaces modulo with a single AND, simplifies overflow
            detection, and aligns naturally with cache-line-aware index
            layouts.
          </li>
          <li>
            <strong>Match concurrency model to workload.</strong> SPSC,
            MPSC, SPMC, MPMC all have different optimal data structures.
            Pick the least-general that fits; reach for MPMC only when
            truly needed.
          </li>
          <li>
            <strong>Instrument queue depth.</strong> Track p50/p99 queue
            depth in production. Rising depth is the earliest
            leading indicator of downstream slowdown.
          </li>
          <li>
            <strong>Pair with backpressure.</strong> Signal upstream when
            the queue is full rather than allowing arbitrary growth.
            Reactive streams, tokio channels, and Go channels with
            capacity all embody this principle.
          </li>
          <li>
            <strong>Prefer bulk operations.</strong> Batching enqueues
            (<code>offerAll</code>) and dequeues amortizes per-operation
            overhead and enables SIMD-friendly work.
          </li>
          <li>
            <strong>Align concurrent indices to separate cache lines.</strong>{" "}
            False sharing between the head and tail indices can cost 10×
            in a hot MPMC queue. Pad each atomic to its own 64-byte cache
            line.
          </li>
        </ul>
      </section>

      {/* SECTION 6 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Unbounded queue under outage.</strong> Classic pattern:
            queue grows for minutes until process OOMs, taking the service
            down. The incident report invariably reads &quot;upstream
            slowed down but queue was unbounded&quot;.
          </li>
          <li>
            <strong>Off-by-one in full/empty distinction.</strong> A ring
            buffer where head == tail can mean either empty (cap slots
            free) or full (0 slots free). Pick one convention (reserved
            slot or count) and test at both boundaries.
          </li>
          <li>
            <strong>Memory reordering in lock-free queues.</strong> On
            ARM and POWER, writes can be observed out of order across
            cores. A lock-free queue without explicit release/acquire
            fences works on x86 and corrupts on ARM. Always use
            <code> std::atomic</code>/<code>AtomicUsize</code> with correct
            orderings.
          </li>
          <li>
            <strong>Head/tail contention under multi-producer.</strong>{" "}
            All producers CAS the same tail pointer, serializing effective
            throughput. Sharded queues (a pool of queues with hash-based
            routing) or dedicated producer-local buffers are the scale-
            out answer.
          </li>
          <li>
            <strong>Dropped items silently.</strong> A non-blocking
            <code> offer</code> that returns false on full is fine only
            when callers check the return value. Ignoring the failure
            means messages disappear without any log trace.
          </li>
          <li>
            <strong>Head-of-line blocking.</strong> A single slow message
            at the head blocks every subsequent consumer in strict-FIFO
            configurations. HTTP/1.1 pipelining, hot partitions in Kafka,
            and blocking scheduler queues all suffer this. Multi-queue
            fan-out or priority lanes address it.
          </li>
          <li>
            <strong>Forgetting to release references on dequeue.</strong>{" "}
            Ring buffer slots retain references until overwritten; for
            reference-heavy payloads in managed languages, explicitly
            null the dequeued slot to let GC reclaim.
          </li>
        </ul>
      </section>

      {/* SECTION 7 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Event loop queues in browsers and Node
        </h3>
        <p>
          Every JavaScript runtime maintains at least two queues — the
          macrotask queue (events, timers, I/O callbacks) and the
          microtask queue (promise resolutions, queueMicrotask). Each
          iteration of the event loop drains microtasks between macrotasks.
          The FIFO ordering between each type is what makes async code
          predictable — two setTimeouts with the same delay run in
          insertion order. The actual implementation inside V8 and SpiderMonkey
          is a ring buffer with careful memory barriers.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Message brokers (Kafka, RabbitMQ, SQS)
        </h3>
        <p>
          Kafka partitions are append-only logs with consumer offsets
          tracking per-consumer read position — FIFO queue semantics
          distributed across a cluster with durability guarantees.
          RabbitMQ queues are linked lists with prefetch-based flow
          control. AWS SQS offers standard (at-least-once, best-effort
          ordering) and FIFO (strict ordering, deduplication, per-group
          ordering) queue flavors. All three expose the same FIFO abstraction
          at vastly different scale, durability, and ordering-strength
          points.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          LMAX Disruptor and hot-path trading
        </h3>
        <p>
          The LMAX Disruptor is a specialized ring buffer designed for
          low-latency trading systems. It avoids allocation, aligns fields
          to cache lines to prevent false sharing, and uses sequence
          numbers with memory barriers instead of locks. It publicly
          benchmarks at 25M messages/sec per core with sub-microsecond
          latency — an order of magnitude better than lock-based
          alternatives. The design is now widely replicated in trading,
          gaming, and low-latency RPC frameworks.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          OS process scheduler
        </h3>
        <p>
          Linux&apos;s CFS (Completely Fair Scheduler) tracks runnable
          processes in per-CPU queues using red-black trees (for O(log n)
          priority-ordered selection), while the per-CPU runqueues for
          quick enqueue/dequeue of &quot;current&quot; tasks use linked
          lists. The boundary between FIFO queues and priority-ordered
          heaps shows up repeatedly in kernel scheduling: fairness
          demands queues; priority demands heaps; real systems blend
          both.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/queues-diagram-3.svg"
          alt="Bounded versus unbounded queue behavior under upstream slowdown with backpressure signaling"
          caption="Figure 3: Bounded vs unbounded — a bounded queue applies backpressure; an unbounded one grows until OOM under sustained producer surges."
        />
      </section>

      {/* SECTION 8 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Implement a queue using two stacks.
            </p>
            <p className="mt-2 text-sm">
              A: Maintain an <code>in</code> stack for enqueues and an{" "}
              <code>out</code> stack for dequeues. Enqueue pushes to{" "}
              <code>in</code>. Dequeue pops from <code>out</code>; if empty,
              move everything from <code>in</code> to <code>out</code> in
              bulk (reversing order), then pop. Each element moves at most
              twice — amortized O(1), worst-case O(n) on the transfer step.
              Good for immutable-data systems where allocations are cheap;
              poor for latency-critical workloads where tail-latency
              predictability is the priority.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Implement a thread-safe bounded blocking queue.
            </p>
            <p className="mt-2 text-sm">
              A: A ring buffer plus a lock and two condition variables —{" "}
              <code>notFull</code> and <code>notEmpty</code>. Enqueue:
              acquire lock, while full wait on notFull, write at tail,
              advance tail, signal notEmpty, release lock. Dequeue is
              symmetric. This is the textbook design; Java&apos;s{" "}
              <code>ArrayBlockingQueue</code> is essentially this. For
              higher throughput under contention, lock-free MPMC queues
              like Vyukov&apos;s bounded queue use CAS on per-slot
              sequence numbers, but the condition-variable version is
              usually sufficient.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: In a circular buffer with head and tail indices, how do
              you distinguish full from empty?
            </p>
            <p className="mt-2 text-sm">
              A: Two options. (1) Reserve one slot: the buffer is full
              when <code>(tail + 1) % cap == head</code> and empty when
              <code> head == tail</code>; usable capacity is cap − 1. (2)
              Keep an explicit count or use monotonically-increasing (non-
              wrapping) indices and compare their difference to cap —
              full when <code>tail - head == cap</code>, empty when equal.
              The LMAX Disruptor uses monotonic sequences and relies on 64-
              bit counters never wrapping during the process lifetime.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is backpressure and why do unbounded queues
              break it?
            </p>
            <p className="mt-2 text-sm">
              A: Backpressure is the explicit signal from a slow consumer
              to a fast producer saying &quot;slow down.&quot; A bounded
              queue provides backpressure automatically: when the queue
              fills, enqueues block or fail, which back-propagates to the
              producer. An unbounded queue accepts unconditionally,
              hiding the mismatch and converting the temporary producer-
              consumer imbalance into monotonically growing memory until
              the process dies. Reactive Streams, the Node streams API,
              Go channels, and tokio all model backpressure as a first-
              class protocol rather than relying on bounded storage alone.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does the LMAX Disruptor achieve lock-free enqueue and
              dequeue?
            </p>
            <p className="mt-2 text-sm">
              A: Each producer and each consumer maintains a monotonically
              increasing sequence number, padded to its own cache line.
              Enqueue: claim the next sequence, write to{" "}
              <code>buf[seq % cap]</code>, publish by writing the sequence
              to a producer cursor with a release barrier. Consumer: read
              the producer cursor with an acquire barrier, process any
              sequence up to that point. No CAS in the single-producer
              case — just ordered writes with memory barriers. This is the
              same pattern underneath Vyukov&apos;s bounded queues and
              many high-performance trading systems.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When would you pick a linked queue over a ring buffer?
            </p>
            <p className="mt-2 text-sm">
              A: When capacity is truly unknown and could span orders of
              magnitude, when lock-free enqueue under multi-producer is
              needed (Michael-Scott), when the workload can tolerate
              per-enqueue allocation cost, or in persistent functional
              languages where immutable structural sharing is required.
              In almost every other case — game loops, hardware drivers,
              most application backpressure — a bounded ring buffer is
              the right choice.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          References &amp; Further Reading
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Knuth, D.E. — <em>The Art of Computer Programming, Volume 1:
            Fundamental Algorithms</em>, Section 2.2.2 (Sequential Allocation)
            for circular queue analysis.
          </li>
          <li>
            Michael, M., Scott, M. — <em>Simple, Fast, and Practical
            Non-Blocking and Blocking Concurrent Queue Algorithms</em>,
            PODC 1996: foundational paper on lock-free linked queues.
          </li>
          <li>
            Thompson, M., Farley, D. et al. — <em>LMAX Disruptor: High
            Performance Alternative to Bounded Queues</em>, LMAX white paper,
            2011: the canonical reference on cache-line-aware concurrent
            ring buffers.
          </li>
          <li>
            Vyukov, D. — <em>Bounded MPMC queue</em> (1024cores.net): the
            widely-studied lock-free multi-producer multi-consumer ring
            buffer with per-slot sequence numbers.
          </li>
          <li>
            Okasaki, C. — <em>Purely Functional Data Structures</em>,
            Cambridge University Press, 1998: the banker&apos;s queue and
            real-time queue as amortized two-stack designs adapted for
            immutable structure.
          </li>
          <li>
            Herlihy, M., Shavit, N. — <em>The Art of Multiprocessor
            Programming</em>, Revised Edition, Morgan Kaufmann, Chapter 10
            on concurrent queues and linearizability.
          </li>
          <li>
            Reactive Streams specification (reactive-streams.org) and its
            JDK9 Flow API: the canonical asynchronous backpressure
            protocol.
          </li>
          <li>
            Confluent Kafka documentation — <em>Topic partitions, consumer
            groups, and ordering guarantees</em>: production-scale FIFO
            semantics in distributed settings.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
