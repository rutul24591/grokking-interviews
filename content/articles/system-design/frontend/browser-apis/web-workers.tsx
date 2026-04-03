"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-web-workers",
  title: "Web Workers",
  description:
    "Comprehensive guide to Web Workers covering background threads, message passing, performance optimization, Transferable objects, and production-scale implementation patterns.",
  category: "frontend",
  subcategory: "browser-apis",
  slug: "web-workers",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "browser API",
    "web workers",
    "threads",
    "performance",
    "concurrency",
  ],
  relatedTopics: [
    "service-workers",
    "shared-workers",
    "mobile-performance-optimization",
  ],
};

export default function WebWorkersArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Web Workers</strong> enable JavaScript to run in background threads, separate from the main UI thread. This allows CPU-intensive tasks (data processing, image manipulation, complex calculations, encryption, machine learning inference) to run without blocking the main thread, which is responsible for UI rendering, user input handling, and event processing. Workers communicate with the main thread via message passing (postMessage/onmessage), with data transferred via structured cloning (copy) or Transferable objects (transfer ownership, zero-copy).
        </p>
        <p>
          For staff-level engineers, Web Workers represent a shift from single-threaded JavaScript to multi-threaded architecture. Before Workers, long-running JavaScript blocked the main thread, causing UI freezes, dropped frames, and poor user experience. The main thread is responsible for UI rendering, user input handling, and event processing — any task that takes more than 50 milliseconds on the main thread can cause visible jank. Workers run in separate threads with their own event loop, memory space, and execution context — no shared memory with main thread (communication via structured cloning or Transferable objects).
        </p>
        <p>
          Web Workers involve several technical considerations. Types include Dedicated Workers (one-to-one with creator, most common type) and Shared Workers (multiple contexts can connect, less common). Communication via postMessage for sending, onmessage for receiving, data transferred via structured cloning (copy) or Transferable objects (transfer ownership, zero-copy). Limitations include no DOM access (workers cannot manipulate the DOM), limited APIs (no window, document, but have access to fetch, XMLHttpRequest, setTimeout, setInterval, importScripts), separate memory space (data must be transferred, not shared). Termination is essential — must terminate workers when done to free resources (worker.terminate() from main thread, close() from worker self).
        </p>
        <p>
          The business case for Web Workers is responsive UI during heavy computation. Image/video processing (Figma, Canva), data analysis (analytics dashboards), encryption (security libraries), complex calculations (scientific computation, machine learning inference) — all can run in Workers without freezing UI. Users can continue interacting with app while background work completes. For data-heavy applications, Workers are essential for maintaining 60fps UI while processing data. Without Workers, heavy computation blocks the main thread, causing UI freezes and poor user experience.
        </p>
        <p>
          However, Workers add complexity (message passing, worker lifecycle management, error handling) and overhead (worker creation, message passing, memory duplication). Workers are not a silver bullet — use them only when CPU-intensive work would block the main thread for more than 50 milliseconds. For quick tasks (&lt; 50 milliseconds), the overhead of message passing outweighs the benefit of offloading to a worker.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Dedicated Worker:</strong> One-to-one relationship with creator. Created with new Worker(&apos;worker.js&apos;). Communicates via postMessage/onmessage. Terminated with worker.terminate() from main thread or close() from worker self. Most common type, used for most background tasks. Each dedicated worker has its own thread, event loop, and memory space.
          </li>
          <li>
            <strong>Shared Worker:</strong> Multiple contexts can connect (tabs, iframes, other workers). Created with new SharedWorker(&apos;worker.js&apos;). Communicates via port (worker.port.postMessage). Shared state across contexts. Less common than dedicated workers, used for cross-tab communication and shared background tasks. Shared workers have less browser support (not supported in Safari).
          </li>
          <li>
            <strong>Message Passing:</strong> Workers communicate via postMessage (send) and onmessage (receive). Data is structured cloned (copied), not shared. Structured cloning supports most JavaScript types (objects, arrays, strings, numbers, booleans, null, undefined, Date, RegExp, Blob, File, ImageBitmap, ArrayBuffer, TypedArray), but not functions, DOM nodes, or error objects. For large data, use Transferable objects (transfer ownership, not copy).
          </li>
          <li>
            <strong>Transferable Objects:</strong> ArrayBuffer, MessagePort, ImageBitmap can be transferred (not copied). Syntax: postMessage(data, [transferable]). Transferred objects are neutered in sender context — ownership transfers to receiver, sender can no longer access the transferred object. For large data (1MB+), transfer is 10-100x faster than copy. Use transfer for large ArrayBuffer, ImageBitmap, TypedArray.
          </li>
          <li>
            <strong>Worker Scope:</strong> Workers have no DOM access (no window, document). Available APIs: fetch, XMLHttpRequest, setTimeout, setInterval, importScripts, atob, btoa, console, IndexedDB, Cache API, WebSockets. For DOM manipulation, message back to main thread (main thread handles DOM updates). Workers have access to most JavaScript language features (ES6+, async/await, classes, modules), but not browser-specific APIs (window, document, DOM).
          </li>
          <li>
            <strong>Termination:</strong> Main thread: worker.terminate() (immediate, worker is terminated immediately, any pending messages are lost). Worker self: close() (graceful, worker finishes current task and then closes). Always terminate workers when done — they consume resources even when idle (memory, thread). Common bug: create worker on component mount, forget to terminate on component unmount (worker continues running, consuming resources).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/web-workers-architecture.svg"
          alt="Web Workers Architecture showing main thread, worker threads, and message passing communication"
          caption="Web Workers architecture — main thread runs UI, worker threads run background tasks, communication via postMessage/onmessage with structured cloning"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Web Workers architecture consists of main thread (UI, DOM), worker threads (background computation), and message passing (communication). The architecture must handle worker lifecycle (create, communicate, terminate), error handling (worker errors don&apos;t crash main thread, listen to worker.onerror for error handling), and data transfer (structured cloning vs. Transferable objects).
        </p>
        <p>
          The main thread creates workers, sends messages with data, and receives results. Workers receive messages, process data, and send results back. The main thread updates UI with results. Workers run in separate threads, so they do not block the main thread. The main thread remains continue processing user input and rendering UI while workers process data in background.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/worker-message-flow.svg"
          alt="Worker Message Flow showing postMessage from main to worker and response back with results"
          caption="Worker message flow — main thread posts message with data, worker processes in background, posts result back, main thread updates UI"
          width={900}
          height={500}
        />

        <h3>Common Use Cases</h3>
        <p>
          <strong>Data Processing:</strong> Parse large JSON (e.g., 10MB+ JSON files), filter/sort large arrays (e.g., 100,000+ items), aggregate data (e.g., calculate statistics, group by, pivot tables). Main thread stays responsive while worker processes. Post progress updates for user feedback (e.g., &quot;Processing 50%&quot;). This pattern is essential for data-heavy applications (analytics dashboards, data tables, data visualization) where processing large datasets would block the main thread.
        </p>
        <p>
          <strong>Image/Video Processing:</strong> Image filters (e.g., blur, sharpen, color correction), resizing (e.g., resize images for upload), format conversion (e.g., convert PNG to JPEG, convert video formats), video encoding (e.g., encode video for upload). Heavy CPU work offloaded to worker. Use Transferable Objects (ImageBitmap, ArrayBuffer) for efficient data transfer. This pattern is essential for image/video editing apps (Figma, Canva, Adobe Express) where processing images would block the main thread.
        </p>
        <p>
          <strong>Complex Calculations:</strong> Encryption (e.g., encrypt/decrypt data, hash passwords), hashing (e.g., calculate SHA-256 hash of files), scientific computation (e.g., numerical simulations, matrix operations), machine learning inference (e.g., run ML models in browser, TensorFlow.js uses workers for inference). CPU-intensive tasks that would block UI. Worker handles computation, posts result when done. This pattern is essential for security-sensitive apps (encryption, hashing) and ML apps (inference) where computation would block the main thread.
        </p>
        <p>
          <strong>Polling/Background Tasks:</strong> Periodic data fetching (e.g., poll API for updates every 30 seconds), keeping connection alive (e.g., send heartbeat to server every 10 seconds), background sync (e.g., sync data when online). Worker runs independently, posts updates to main thread. Shared Worker can serve multiple tabs (single worker for all tabs, more efficient than each tab running own background task). This pattern is essential for real-time apps (chat, collaboration) where background tasks would block the main thread.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/worker-use-cases.svg"
          alt="Worker Use Cases showing data processing, image processing, complex calculations, and background polling"
          caption="Worker use cases — data processing (parse/filter), image/video processing, complex calculations (encryption, ML), background polling"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Web Workers involve trade-offs between performance, complexity, memory usage, and browser support. Understanding these trade-offs is essential for making informed decisions about when to use Workers and when to use alternative approaches.
        </p>

        <h3>Workers vs. Main Thread</h3>
        <p>
          <strong>Main Thread:</strong> Has DOM access, all browser APIs. Advantages: simple (no message passing, no worker lifecycle management), direct DOM manipulation (can update UI directly). Limitations: single-threaded (only one task at a time), heavy computation blocks UI (causes jank, dropped frames, poor user experience). Best for: UI updates, DOM manipulation, user interaction, quick tasks (&lt; 50 milliseconds).
        </p>
        <p>
          <strong>Worker Thread:</strong> No DOM access, limited APIs. Advantages: does not block UI (runs in separate thread), parallel execution (worker runs while main thread handles UI). Limitations: message passing overhead (data must be transferred, not shared), no DOM access (must message back to main thread for DOM updates), worker lifecycle management (create, communicate, terminate). Best for: CPU-intensive tasks exceeding fifty milliseconds, background processing, data-heavy computation.
        </p>
        <p>
          <strong>Hybrid Approach:</strong> Use Workers for CPU-intensive tasks, main thread for UI updates. For example, use Worker to process data, main thread to render charts. Use Worker to encrypt data, main thread to show progress indicator. Use Worker to parse JSON, main thread to update data table. This provides the best of both worlds: responsive UI with main thread, heavy computation with Workers.
        </p>

        <h3>Dedicated vs. Shared Workers</h3>
        <p>
          <strong>Dedicated Worker:</strong> One-to-one with creator. Advantages: simple (no port communication, no shared state management), isolated state (no race conditions, no synchronization issues), full browser support (supported in all modern browsers). Limitations: one worker per context (each tab has its own worker, no sharing). Best for: most use cases, task-specific workers (data processing, image processing, encryption).
        </p>
        <p>
          <strong>Shared Worker:</strong> Multiple contexts connect. Advantages: shared state (single worker for all tabs, more efficient), cross-tab communication (tabs can communicate via shared worker). Limitations: more complex (port communication, shared state management, synchronization), less browser support (not supported in Safari). Best for: cross-tab communication (e.g., sync state across tabs), shared background tasks (e.g., single WebSocket connection for all tabs).
        </p>

        <h3>Structured Cloning vs. Transferable</h3>
        <p>
          <strong>Structured Cloning:</strong> Data is copied (deep clone). Advantages: simple (no transfer syntax, no neutering), sender retains data (can use data after sending). Limitations: copy overhead for large data (copying 10MB ArrayBuffer takes time and memory). Best for: small/medium data (&lt; 1MB), data that sender needs to retain.
        </p>
        <p>
          <strong>Transferable:</strong> Data ownership transfers (zero-copy). Advantages: zero-copy for large data, efficient (no memory duplication). Limitations: sender loses access (neutered, can no longer use transferred data), transfer syntax required. Best for: large ArrayBuffer, ImageBitmap, TypedArray exceeding one megabyte, data that sender no longer needs.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/worker-use-cases.svg"
          alt="Worker Trade-offs showing main thread vs worker, dedicated vs shared, structured cloning vs transferable"
          caption="Worker trade-offs — main thread (simple, blocks UI) vs worker (complex, responsive), dedicated (simple) vs shared (complex), structured cloning (copy) vs transferable (zero-copy)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Terminate Workers:</strong> Always call terminate() when worker no longer needed. Workers consume resources even when idle (memory for worker thread, memory for worker code, memory for worker data). Common bug: create worker on component mount, forget to terminate on component unmount (worker continues running, consuming resources). In React, call terminate in the useEffect cleanup function. In other frameworks, call terminate in the appropriate lifecycle hook (e.g., componentWillUnmount in class components).
          </li>
          <li>
            <strong>Use Transferable for Large Data:</strong> For ArrayBuffer, ImageBitmap, TypedArray over 1MB, use transfer (not copy). Syntax: postMessage(data, [data.buffer]). This transfers ownership (zero-copy), not copies data. Sender&apos;s buffer is neutered (unusable) after transfer. For 10MB+ data, transfer is 10-100x faster than copy. Always use transfer for large ArrayBuffer, ImageBitmap, TypedArray. Example: worker.postMessage(arrayBuffer, [arrayBuffer]); (transfers arrayBuffer to worker, main thread can no longer use arrayBuffer).
          </li>
          <li>
            <strong>Handle Worker Errors:</strong> Worker errors do not crash main thread since the worker runs in a separate thread and errors are isolated. Listen to worker.onerror for error handling to log errors, retry if appropriate, and notify user if critical. In the worker, use try-catch blocks and post error messages to the main thread with an error type and message. This pattern ensures that worker errors are handled gracefully and do not crash the app.
          </li>
          <li>
            <strong>Send Progress Updates:</strong> For long-running tasks, post progress messages with a type identifier and percentage value. The main thread can show a progress indicator such as a progress bar displaying the processing percentage. This pattern provides user feedback during long-running tasks, improving user experience. For example, when processing 1000 items, post progress every 100 items with the calculated percentage.
          </li>
          <li>
            <strong>Pool Workers:</strong> For multiple concurrent tasks, use worker pool by creating a fixed number of workers and queuing tasks. Prevents creating too many workers since each worker consumes resources including memory for the worker thread, worker code, and worker data. Reuse workers for multiple tasks by sending multiple messages to the same worker rather than creating a new worker for each task. Typical configuration is 2-4 workers for CPU-bound tasks, one worker per CPU core to avoid oversubscription. This pattern ensures that workers are used efficiently and do not consume excessive resources.
          </li>
          <li>
            <strong>Inline Workers for Small Tasks:</strong> For simple workers, use Blob URL or data URL to inline worker code, avoiding a separate file for small workers such as a worker that does simple data transformation. Create a Blob with the worker code as JavaScript content, generate an object URL, and create the Worker with that URL. This pattern is useful for small workers that do not warrant a separate file.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Not Terminating:</strong> Workers continue running after component unmounts (worker thread continues running, consuming memory and CPU). Memory leak (worker holds references to data, preventing garbage collection), resource waste (worker thread consumes CPU even when idle). Always terminate in cleanup (useEffect return in React, componentWillUnmount in class components). Common bug: create worker on component mount, forget to terminate on component unmount.
          </li>
          <li>
            <strong>Copying Large Data:</strong> Sending large ArrayBuffer without transfer copies data (slow, memory intensive). Copying 10MB ArrayBuffer takes time and memory (doubles memory usage — original data in main thread, copy in worker). Use Transferable: postMessage(data, [data.buffer]). This transfers ownership (zero-copy), not copies data. For 10MB+ data, transfer is 10-100x faster than copy.
          </li>
          <li>
            <strong>Expecting DOM Access:</strong> Workers have no DOM access (no window, document, querySelector, getElementById, etc.). Can&apos;t manipulate DOM from worker. For DOM updates, message back to main thread (main thread handles DOM updates). Common mistake: try to access document or window from worker (throws error).
          </li>
          <li>
            <strong>Ignoring Worker Errors:</strong> Worker errors are silent unless handled (worker runs in separate thread, errors do not crash main thread). Listen to onerror (worker.onerror = (e) calls console.error with error message). Log errors, handle gracefully (retry, notify user, fallback). Common mistake: do not handle worker errors (errors are silent, user sees no feedback).
          </li>
          <li>
            <strong>Creating Too Many Workers:</strong> Each worker consumes resources (memory for worker thread, memory for worker code, memory for worker data). Don&apos;t create worker per task — use worker pool (create N workers, queue tasks). Typical: 2-4 workers for CPU-bound tasks (one worker per CPU core, to avoid oversubscription). Creating too many workers causes memory issues (each worker consumes memory) and CPU issues (too many threads compete for CPU time).
          </li>
          <li>
            <strong>Blocking Worker:</strong> Worker can still block its own thread (worker runs in single thread, long-running task blocks worker thread). For very heavy tasks, use multiple workers (split task across workers) or break into chunks (process 1000 items at a time, post progress between chunks). Common mistake: process 1,000,000 items in single worker (blocks worker thread, no progress updates).
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Image Processing</h3>
        <p>
          Photo editing apps (Figma, Canva, Adobe Express) use workers for image filters, resizing, format conversion. Main thread handles UI (sliders, previews, toolbars), worker processes image (applies filter, resizes image, converts format). Transferable ImageBitmap for efficient transfer (transfer ImageBitmap from main thread to worker, worker processes ImageBitmap, transfers result back to main thread). UI stays responsive during processing (user can continue interacting with app while image is processed). This pattern is essential for image editing apps where processing images would block the main thread.
        </p>

        <h3>Data Analysis</h3>
        <p>
          Analytics dashboards (Google Analytics, Mixpanel, custom analytics) use workers for data aggregation, filtering, sorting large datasets. Parse JSON (e.g., 10MB+ JSON files), calculate statistics (e.g., mean, median, standard deviation), generate charts data (e.g., group by, pivot tables) in worker. Main thread renders charts (e.g., Chart.js, D3), handles interaction (e.g., tooltips, filters). Worker prevents UI freeze during data processing (user can continue interacting with app while data is processed). This pattern is essential for analytics dashboards where processing large datasets would block the main thread.
        </p>

        <h3>Encryption/Hashing</h3>
        <p>
          Security libraries (Web Crypto API wrappers, custom encryption libraries) use workers for encryption, hashing, key derivation. CPU-intensive crypto operations (e.g., AES encryption, SHA-256 hashing, RSA key generation) run in worker. Main thread handles UI (password input, progress indicator, result display). Worker posts result when done (e.g., encrypted data, hash, key). This pattern is essential for security-sensitive apps where encryption would block the main thread.
        </p>

        <h3>Background Sync</h3>
        <p>
          Shared Workers for cross-tab background tasks. Keep WebSocket connection alive (single WebSocket connection for all tabs, more efficient than each tab running own WebSocket), poll for updates (single poll for all tabs, more efficient than each tab polling), sync data across tabs (e.g., sync state when user switches tabs). Single shared worker serves all tabs (one worker for all tabs, more efficient than each tab running own worker). More efficient than each tab running own background task (reduces network requests, reduces CPU usage). This pattern is essential for real-time apps (chat, collaboration) where background tasks would block the main thread.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do Web Workers work and why are they useful?
            </p>
            <p className="mt-2 text-sm">
              A: Web Workers run JavaScript in background threads, separate from main UI thread. Created with new Worker(&apos;worker.js&apos;), communicate via postMessage/onmessage. Useful because: CPU-intensive tasks don&apos;t block UI — user can continue interacting with app while worker processes data. Parallel execution — worker runs while main thread handles UI (user input, rendering, events). Better responsiveness — no UI freezes during heavy computation (main thread stays responsive). Main limitation: no DOM access in workers (workers cannot manipulate DOM, must message back to main thread for DOM updates). Workers are essential for maintaining 60fps UI while processing data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you transfer large data to/from workers efficiently?
            </p>
            <p className="mt-2 text-sm">
              A: For large data (ArrayBuffer, ImageBitmap, TypedArray), use Transferable objects instead of structured cloning. Syntax: worker.postMessage(data, [data.buffer]). This transfers ownership (zero-copy), not copies data. Sender&apos;s buffer is neutered (unusable) after transfer (main thread can no longer use arrayBuffer after transfer). For 10MB+ data, transfer is 10-100x faster than copy (copying 10MB ArrayBuffer takes time and memory, transferring is instant). Always use transfer for large ArrayBuffer, ImageBitmap, TypedArray. Example: worker.postMessage(arrayBuffer, [arrayBuffer]); (transfers arrayBuffer to worker, main thread can no longer use arrayBuffer).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle worker lifecycle in React?
            </p>
            <p className="mt-2 text-sm">
              A: Create worker in useEffect, terminate in cleanup: useEffect with worker creation and cleanup. Store worker reference (useRef for stable reference, do not store in state). Handle messages in useEffect or separate handler (worker.onmessage equals message handler). Never create worker without termination — causes memory leak (worker continues running after component unmounts, consuming resources). For multiple workers, use worker pool (create N workers, queue tasks, terminate all on cleanup).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s the difference between Dedicated and Shared Workers?
            </p>
            <p className="mt-2 text-sm">
              A: Dedicated Worker: one-to-one with creator, simple postMessage/onmessage, isolated state (no shared state, no race conditions), full browser support (supported in all modern browsers). Shared Worker: multiple contexts can connect (tabs, iframes, other workers), uses port communication (worker.port.postMessage), shared state across contexts (single worker for all tabs, more efficient), less browser support (not supported in Safari). Dedicated for most cases (data processing, image processing, encryption). Shared for cross-tab communication (sync state across tabs), shared background tasks (single WebSocket connection for all tabs).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle errors in Web Workers?
            </p>
            <p className="mt-2 text-sm">
              A: Worker errors do not crash main thread since the worker runs in a separate thread and errors are isolated. Listen to worker.onerror for error handling to log the error. The error event contains the error message, filename which is the worker script URL, and line number. Log errors, retry if appropriate such as retrying a failed request, and notify the user if critical. In the worker, use try-catch blocks and post error messages to the main thread with an error type and message. This pattern ensures that worker errors are handled gracefully.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When should you NOT use Web Workers?
            </p>
            <p className="mt-2 text-sm">
              A: Avoid Workers when: (1) Task is quick (&lt; 50 milliseconds) — overhead outweighs benefit (message passing, worker creation, memory duplication). (2) Need DOM access — workers can&apos;t manipulate DOM (must message back to main thread for DOM updates). (3) Data is small — message passing overhead not worth it (copying small data is fast). (4) Simple async operation — use async/await, requestIdleCallback instead (no need for worker). Workers add complexity (message passing, worker lifecycle management, error handling) — use only when CPU-intensive work would block main thread for more than 50 milliseconds.
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
              href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Web Workers API
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/off-main-thread/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Off-Main-Thread Patterns
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/workers/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C — Web Workers Specification
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Transferable"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Transferable Objects
            </a>
          </li>
          <li>
            <a
              href="https://caniuse.com/webworkers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Can I Use — Web Workers Browser Support
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );

}
