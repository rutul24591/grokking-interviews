"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-web-workers-threading",
  title: "Design Web Workers & Threading",
  description:
    "Production-grade Web Workers for background processing, parallel computation, and offloading heavy tasks from the main thread.",
  category: "low-level-design",
  subcategory: "web-platform-browser-apis",
  slug: "web-workers-threading",
  wordCount: 5700,
  readingTime: 35,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "web-workers",
    "threading",
    "concurrency",
    "performance",
    "parallel",
  ],
  relatedTopics: [
    "web-performance-optimization",
    "rendering-strategies",
    "async-state-handling",
  ],
};

export default function WebWorkersThreadingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">JavaScript executes on a single main thread. When heavy computation runs on the main thread (parsing large JSON files, cryptographic hashing, image processing), that thread is blocked. The UI can't respond to user input (clicks, scrolling, typing) until the computation completes. The user perceives the app as frozen: buttons don't react, scrolling stutters, input lags. This is a terrible user experience.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Example: a user uploads a 100MB JSON file. The app parses it to validate structure. Parsing takes 2 seconds on modern devices. During those 2 seconds, the main thread is busy; the UI is completely frozen. User can't click buttons, scroll, or interact.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Web Workers solve this by providing true background threads. Heavy computation runs in a separate thread (Worker). The main thread remains free to respond to user input. The Worker and main thread communicate via message passing (asynchronous).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Key challenges: managing worker lifecycle (creation, termination), communicating data (structured clone for copying, or Transferable objects for zero-copy transfer), debugging in separate context, handling errors in workers, preventing memory leaks from orphaned workers, and coordinating multiple workers for parallelization.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Explicit assumptions:</strong> Heavy CPU-bound tasks exist that block the main thread for longer than about 100 ms. Workers can run independently without DOM access. Data can be serialized and sent between threads. Multiple workers can be created for parallelization. Message passing overhead is acceptable (typically under about 1 ms for most payloads).</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Worker creation and lifecycle:</strong> Spawn workers from separate files, manage their lifecycle from creation through termination, and handle graceful shutdown.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Message passing:</strong> Send data to workers and receive results via asynchronous message passing without blocking the main thread.</HighlightBlock>
          <li><strong>Error propagation:</strong> Catch errors thrown in workers and propagate them to the main thread with full context.</li>
          <li><strong>Worker pooling:</strong> Maintain a pool of reusable workers to amortize creation overhead and support parallelization across multiple workers.</li>
          <li><strong>Data transfer modes:</strong> Support both structured clone (for general data) and Transferable objects (zero-copy for large data like ArrayBuffers).</li>
          <li><strong>Task queuing:</strong> Queue tasks for workers when all pool workers are busy, dequeue and execute as workers become available.</li>
          <HighlightBlock as="li" tier="crucial"><strong>Timeout management:</strong> Detect hung or slow workers and timeout long-running tasks to prevent stalls.</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Responsiveness:</strong> Main thread remains responsive to user input during heavy worker computation (no UI jank or freezing).</li>
          <li><strong>Parallelization:</strong> Utilize multi-core systems; if N cores available, run N workers in parallel.</li>
          <HighlightBlock as="li" tier="important"><strong>Latency:</strong> Message passing overhead under 10ms. Worker startup under 50ms.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Memory:</strong> Each worker uses approximately 1-5MB overhead (depends on shared code size). Pool of 4-8 workers under 50MB total.</HighlightBlock>
          <li><strong>Throughput:</strong> Process thousands of tasks per second via worker pool without saturation.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">The system creates Worker instances from JavaScript files. The main thread sends a task to a worker via postMessage, passing data (which is structured-cloned to the worker). The worker processes the task in the background and sends the result back via postMessage. The main thread registers a message handler to receive the result and continues executing other code without waiting.</HighlightBlock>
        <HighlightBlock as="p" tier="important">For efficiency, rather than creating a new worker for each task, the system maintains a worker pool: a set of reusable workers managed by a task queue. When a task arrives, the scheduler checks if a worker is available. If yes, assigns the task immediately. If no, queues the task. As workers complete tasks, they're returned to the available pool. The next queued task is assigned to the now-available worker.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The pool size is tuned to the hardware: navigator.hardwareConcurrency gives CPU core count. A pool of 4-8 workers is typical; creating more workers than cores doesn't improve performance due to context switching overhead. Error handling is critical: if a worker throws an error, the error is propagated to the main thread, and the worker is restarted or returned to the pool (depending on error severity).</HighlightBlock>
      </section>

      <section>
                <h2>Diagram Walkthrough</h2>

<ArticleImage
          src="/diagrams/system-design-problems/low-level-design/web-platform-browser-apis/web-workers-threading.svg"
          alt="Web Workers threading system showing main thread vs worker thread communication, worker pool, transferable objects, and use cases"
          caption="Web Workers threading system showing main thread vs worker thread communication, worker pool, transferable objects, and use cases"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: the diagram captures the end-to-end flow for <strong>Design Web Workers &amp; Threading</strong>. You should be able to explain the happy path and the failure paths (retries, cancellation, backpressure), not just the API surface.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Look for the &ldquo;control points&rdquo; where correctness is enforced: idempotency keys, monotonic request/version tokens, single-flight coordination, and durable persistence boundaries.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          In interviews, call out observability and operability: what you log/measure (p95 latency, error rates, retries/queue depth) and how you keep degraded modes user-safe (read-only, queued, or cached fallbacks).
        </HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Worker Lifecycle</h3>
        <p>Worker lifecycle consists of creation, communication, and termination. Creation is synchronous: new Worker('worker.js') instantiates the worker and loads the script file. The script is loaded from the URL asynchronously; the Worker constructor returns immediately. The script begins executing in the worker context once loaded.</p>
        <p>Communication happens via postMessage: main thread calls worker.postMessage(data), which sends a copy of data to the worker. The worker receives it in its onmessage handler. Conversely, the worker calls postMessage(result) to send data back to the main thread. The main thread receives it in its worker.onmessage handler. This is bidirectional and asynchronous; no blocking occurs.</p>
        <p>Error handling: if the worker throws an uncaught exception, the onerror event fires on the Worker instance with error details (message, filename, line number). The main thread should register an onerror handler to catch and log worker errors. Graceful degradation is important: a worker error shouldn't crash the app; instead, log it, restart the worker, and retry the task.</p>
        <p>Termination: worker.terminate() immediately kills the worker, stopping all execution and freeing its memory. After termination, the worker cannot be reused; a new Worker must be created if needed. For worker pools, termination should be deferred until the pool is shut down (e.g., page unload) or the worker has been idle for an extended period.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Message Passing and Data Transfer</h3>
        <HighlightBlock as="p" tier="important">Data passed between the main thread and worker is structured-cloned by default. Structured clone creates a deep copy: the worker receives an independent copy of the data, not a reference. This is safe (no shared memory concurrency issues) but has overhead for large payloads (100MB+ data is slow to clone).</HighlightBlock>
        <p>Structured clone supports: objects, arrays, typed arrays, blobs, maps, sets, dates, etc. It does NOT support functions, DOM nodes, or circular references. If the data contains unsupported types, the postMessage call throws an error.</p>
        <p>For large data (100MB+ files, video frames), use Transferable objects. These allow zero-copy transfer: ownership of the data passes to the worker, and the original reference in the main thread becomes unusable. After transfer, the main thread cannot access the data; only the worker can. This is efficient but requires careful coordination (ensure the main thread doesn't try to reuse transferred data).</p>
        <p>Message format convention: use a structured format for correlation. For example, include a message type, a payload object, and a request id. The worker receives the message, processes it, and sends back a result message with the same request id. The main thread matches responses to requests, enabling multiple concurrent requests.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Worker Code and Scope</h3>
        <HighlightBlock as="p" tier="important">Worker code runs in a separate scope with limited access. The global object is WorkerGlobalScope (not window). Unavailable: DOM (no document, no element access), window object, parent/opener references. Available: setTimeout, setInterval, fetch, indexedDB, cache API, and importScripts for loading helper modules.</HighlightBlock>
        <p>Worker receives messages via a global onmessage handler. To send data back, the worker uses postMessage with a result payload. The worker can send multiple progress updates during task execution.</p>
        <p>For modular code, use importScripts('util.js') to load helper modules within the worker. This is a synchronous operation; the worker blocks until the script is loaded. Alternatively, use module workers (type: 'module') with ES6 import/export for cleaner organization.</p>
        <p>Worker cleanup: the worker can terminate itself via self.close(). This is useful for long-running workers that want to exit cleanly. After close(), no further messages are processed; the worker terminates immediately.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Worker Pool Pattern</h3>
        <p>Rather than creating a new worker for each task, maintain a reusable pool. The pool size should match the system's capability: navigator.hardwareConcurrency returns CPU core count. A pool of 4-8 workers is typical; exceeding core count causes context switching overhead without performance gain.</p>
        <p>The pool maintains two sets: available workers (idle, ready for tasks) and busy workers (executing tasks). When a task arrives, the scheduler checks the available set. If a worker is available, assign the task immediately. If all workers are busy, queue the task in a FIFO queue.</p>
        <p>When a worker completes a task and sends a result, the main thread moves the worker from busy to available. It immediately checks the queue; if tasks are pending, dequeue one and assign it to the now-available worker.</p>
        <p>Benefits: eliminates worker creation overhead (worker creation is ~50ms, expensive if done for each task). Reusing workers amortizes creation cost across many tasks. For 1000 tasks with a pool of 4 workers, workers are created once and reused 250 times each, eliminating ~49.5 seconds of overhead.</p>
        <HighlightBlock as="p" tier="crucial"><strong>Task Queuing and Backpressure Handling:</strong> Implement a bounded queue to prevent memory issues. If the queue grows beyond a threshold (e.g., 10k pending tasks), apply backpressure: reject new tasks with a "queue full" error until the queue drains. Additionally, implement task priorities: critical tasks (user-initiated) go to the front of the queue; background tasks (prefetching, cleanup) go to the back. This ensures user-facing operations complete faster even if many background tasks are queued. Additionally, monitor queue depth and alert if it grows uncontrollably (workers are slower than task arrival rate).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Handling and Robustness</h3>
        <p>Worker errors should be caught and handled gracefully. When a worker throws an uncaught exception, the onerror event fires on the Worker instance with error details (message, line number, filename). Register an onerror handler to capture this and take action: log the error, notify monitoring systems, and decide whether to restart the worker or move on.</p>
        <HighlightBlock as="p" tier="important">Timeout handling is critical for long-running tasks. Set a timeout for each task (e.g., 30 seconds). If the worker doesn't respond within the timeout, reject the task promise and possibly restart the worker (it might be hung). On timeout, move the task to a failed state and notify the caller.</HighlightBlock>
        <p>Worker creation can fail if the worker file has syntax errors or is unreachable. Wrap the new Worker() call in try-catch. If creation fails, handle gracefully: log error, fallback to main thread processing if possible, or queue the task for retry once the worker is fixed.</p>
        <HighlightBlock as="p" tier="important">Recovery strategy: on worker error or timeout, terminate the worker and create a new one. This is safer than trying to reuse a potentially corrupted worker. For critical tasks, implement retry logic: after a worker error, retry the task with a fresh worker (up to N retries). Idempotency is essential: tasks must be safe to retry without duplicate side effects.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Shared Memory (Advanced Pattern)</h3>
        <p>For extremely performance-sensitive scenarios (audio/video processing, real-time rendering), SharedArrayBuffer provides shared memory: both the main thread and worker can access the same underlying memory buffer. This eliminates the copy overhead of structured cloning. Reads and writes happen directly in shared memory.</p>
        <p>However, shared memory introduces concurrency issues: both threads can write simultaneously, causing race conditions. Synchronize access via Atomics API: Atomics.load() and Atomics.store() provide atomic reads/writes. Atomics.wait() allows a worker to block until another thread modifies memory (for synchronization).</p>
        <p>SharedArrayBuffer is powerful but complex and requires careful discipline. It's disabled by default in most browsers for security (Spectre/Meltdown vulnerabilities). To enable, the server must send COOP (Cross-Origin-Opener-Policy) and COEP (Cross-Origin-Embedder-Policy) headers. Most applications should avoid it and stick to message passing, which is simpler and safer.</p>
        <p>Reserve SharedArrayBuffer for specialized use cases where performance is critical and the team has expertise in concurrent programming. For typical apps, message passing is sufficient and recommended.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Common Use Cases</h3>
        <p>Workers excel at CPU-intensive tasks that block the main thread. Heavy computation (cryptographic hashing of large files, AES encryption, data compression) is a prime use case. A 10MB file hash computation takes 500ms on the main thread, freezing the UI. In a worker, it runs in background while the UI remains responsive.</p>
        <p>Data processing with large datasets: parsing 50MB JSON files, image resizing/filtering, PDF rendering. These tasks are CPU-bound and benefit from parallelization. A worker pool can process multiple files concurrently on multi-core systems.</p>
        <p>Background tasks that don't strictly require the main thread but benefit from parallel execution: chunking large file uploads, processing chunks for format conversion, computing checksums, or periodic polling (though Service Workers are better for continuous polling).</p>
        <p>Avoid workers for quick tasks (for example under about 10 ms execution time). The overhead of message passing (around 1 ms) and worker context switching negates the benefit. Quick async operations (setTimeout) are better handled on the main thread.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring and Observability</h3>
        <p>Production worker systems require monitoring to detect issues early. Track metrics: average task execution time per worker, percentage of tasks timing out, queue depth over time (indicates saturation), error rate (% of tasks failing due to worker errors), and total memory used by all workers in the pool.</p>
        <p>Alerts should fire if queue depth grows unbounded (workers are not keeping pace with task arrival) or if error rate spikes (workers are crashing). These indicate problems: tasks are too heavy, worker pool is too small, or there's a bug causing worker crashes.</p>
        <p>Profile before and after: measure main thread responsiveness (FID, interaction latency) with and without workers. Successful worker adoption should reduce main thread latency by 30-50% for apps with heavy computation.</p>
      </section>

      <section>
        <h2>Implementation Considerations</h2>
        <HighlightBlock as="p" tier="important">Browser support for Web Workers is excellent in modern browsers (Chrome 4+, Firefox 3.5+, IE 10+). Check typeof(Worker) !== 'undefined' before using workers; provide fallback to main thread execution in older browsers.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Debugging workers is straightforward in Chrome DevTools: workers appear as separate contexts in the Sources tab. Set breakpoints in worker code just like main thread code. Console.log in workers outputs to the main DevTools console. Firefox DevTools also supports worker debugging.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Testing workers: unit tests should mock the worker to avoid spawning real workers (slow, unreliable in test environments). Use a mock that simulates postMessage and onmessage. Integration tests should use real workers to test actual message passing and error scenarios. Keep worker tests isolated; avoid testing both worker and main thread logic in the same test.</HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>
        <HighlightBlock as="p" tier="important">Several libraries simplify worker management. Comlink provides RPC-like communication: call worker functions as if they were local async functions, hiding message passing complexity. Piscina is a sophisticated worker pool library with built-in timeout handling, queue management, and error recovery. For critical production systems, these libraries eliminate boilerplate.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Blob workers allow creating workers from inline code (no separate file needed). This is useful for bundled applications where worker code is embedded in the main bundle as a string/blob. Avoid in development (harder to debug); prefer separate files for development clarity.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Module workers use ES6 import/export syntax (type: 'module'). This is cleaner than importScripts and allows proper module loading within workers. Browser support is modern (Chrome 91+, Firefox 78+). Prefer module workers for new code.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Common pitfall: forgetting to terminate workers → memory leak. Solution: maintain a registry of all created workers and terminate on shutdown or idle timeout. Another pitfall: sending non-cloneable data (functions, DOM nodes). Solution: validate data before sending or explicitly convert to transferable format.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Incident response: if the UI is still janky despite using workers, check if the CPU-bound code actually moved to workers (not still on main thread). Profile with DevTools to verify. If workers crash frequently, check error logs and restart the pool with fresh workers.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Complexity vs responsiveness: workers add complexity (separate files, message passing protocol, debugging in separate context). However, they're essential for apps with heavy computation that blocks the UI. Rule of thumb: use workers for tasks expected to take longer than about 100 ms on the main thread. Very quick tasks do not justify the overhead.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Memory vs parallelization: each worker uses 1-5MB memory overhead (varies by complexity of shared code). A pool of 8 workers uses ~40MB. For memory-constrained environments (mobile, embedded), this may be significant. However, parallelization on multi-core systems can provide 2-4x speedup, often justifying the memory cost.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Structured clone vs transferable objects: structured clone is safe (no concurrency issues) but slow for large data. Transferable objects are fast (zero-copy) but require careful ownership tracking (transferred data can't be reused). Use structured clone for safety unless performance profiling identifies it as a bottleneck.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Message passing vs shared memory: message passing is safe and simple. SharedArrayBuffer is fast but complex (race conditions, atomic operations required). For 99% of applications, message passing is the right choice. Reserve SharedArrayBuffer for extreme performance requirements (audio processing, video codecs) with expert concurrency programming.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">Web Workers are essential for maintaining UI responsiveness during CPU-intensive computation. By offloading heavy tasks to background threads, the main thread remains free to handle user interactions, ensuring perceived performance even during long operations. For staff and principal engineers designing production systems, the critical patterns are: worker lifecycle management (creation, communication via postMessage, graceful termination), message passing with structured clone for safety or Transferable objects for performance, worker pool pattern for amortizing creation overhead and enabling parallelization, robust error handling with timeouts and recovery, and task queuing to handle more tasks than available workers.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Advanced considerations include SharedArrayBuffer for extremely performance-sensitive scenarios (audio/video processing) with careful synchronization using Atomics. Monitoring is essential: track task execution times, queue depth, error rates, and worker memory usage to detect saturation or crashes. Testing should include both unit tests with mocked workers and integration tests with real workers.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Common production use cases: cryptographic operations (hashing, encryption) on large files, data processing (JSON parsing, image manipulation), background sync, and real-time rendering. Real-world systems (Google Maps, Figma, video editors) use worker pools (Piscina, Comlink libraries) with careful error handling to prevent memory leaks. For best results, measure main thread latency before and after worker adoption (should improve 30-50%), use pool size matching CPU cores, set task timeouts at 30-60 seconds, and always terminate workers on page unload to prevent orphaned processes.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
