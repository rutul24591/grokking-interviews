"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-idle-task-scheduling",
  title: "Idle Task Scheduling System",
  description: "Scheduling non-critical work during browser idle time using requestIdleCallback",
  category: "low-level-design",
  subcategory: "web-platform-browser-apis",
  slug: "idle-task-scheduling",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-06",
  tags: ["lld", "performance", "scheduling", "request-idle-callback"],
  relatedTopics: ["visibility-based-rendering", "background-sync"],
};

export default function IdleTaskSchedulingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A page loads a framework, initializes state, renders UI, and starts a dozen background tasks: preloading fonts, parsing analytics, preprocessing images, uploading telemetry. The main thread is saturated, interactive latency suffers (buttons lag, form input stutters), and First Input Delay (FID) exceeds acceptable thresholds. User perception: the app feels sluggish and unresponsive.</p>
        <p>The issue: non-critical work is scheduled eagerly on the main thread, competing with user interactions (clicks, typing, scrolling). The browser frame budget is 16ms (60fps); critical work eats most of it, leaving no time for immediate user response.</p>
        <p>Better approach: Idle task scheduling. Defer non-critical work until the browser has idle time (no user input, no layout work, no critical tasks). requestIdleCallback schedules callbacks for when the browser is idle. The callback receives a deadline; the task yields before the deadline to allow the browser to resume responsiveness. Critical path (interaction → render → paint) remains fast.</p>
        <p>Key insight: the user doesn't perceive work happening in the background. Preloading fonts in the next 5 seconds is fine; it doesn't affect responsiveness. Parsing telemetry in 50ms idle slots is fine. What matters is that the main thread is available for immediate user response.</p>
        <p><strong>Explicit assumptions:</strong> requestIdleCallback API is available (with setTimeout fallback for older browsers). Tasks are preemptible and can be interrupted. Non-critical vs critical work can be clearly delineated. Tasks are deterministic and don't depend on specific timing.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Idle detection:</strong> Detect when the browser is idle (no scheduled tasks, no pending user input).</li>
          <li><strong>Task queuing:</strong> Queue non-critical tasks to be executed during idle time.</li>
          <li><strong>Deadline awareness:</strong> Each idle task is given a deadline. Tasks must complete before deadline or yield.</li>
          <li><strong>Priority levels:</strong> Support task priority; high-priority tasks execute before low-priority in the same idle window.</li>
          <li><strong>Cancellation:</strong> Allow cancelling queued or running tasks before execution.</li>
          <li><strong>Error handling:</strong> Catch task errors; don't crash the scheduler or block other tasks.</li>
          <li><strong>Timeout fallback:</strong> For browsers without requestIdleCallback, fall back to setTimeout with increased interval.</li>
          <li><strong>Visibility integration:</strong> Pause idle scheduling when the page is hidden (tab backgrounded); resume when visible.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Latency:</strong> Critical tasks start within 100ms of user interaction. Idle tasks start within 1-2 seconds when idle.</li>
          <li><strong>Responsiveness:</strong> Main thread remains responsive to user input; no jank even with many idle tasks queued.</li>
          <li><strong>Throughput:</strong> 10+ tasks per idle window; process significant work without starving user interaction.</li>
          <li><strong>Browser compatibility:</strong> Chrome 47+, Firefox 55+, Safari 15+ (requestIdleCallback). Fallback to setTimeout for older browsers.</li>
          <li><strong>Energy efficiency:</strong> Don't wake the CPU or GPU unnecessarily; idle scheduling preserves battery on mobile.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The scheduler maintains a queue of idle tasks, prioritized by importance. When the browser detects idle time (via requestIdleCallback), the scheduler dequeues high-priority tasks and executes them. Each task is given a deadline (typically 50ms); the task must yield before the deadline. If the task doesn't yield in time, the scheduler pauses it and resumes in the next idle window.</p>
        <p>Tasks are preemptible: a task can be interrupted mid-execution if a user input arrives. The scheduler immediately pauses the task, handles the user input, and resumes the task in the next idle window. This ensures input latency remains minimal.</p>
        <p>Visibility integration: when the page is hidden (user switched tabs), idle scheduling is paused. No CPU work when the user isn't watching. When the page becomes visible, scheduling resumes. This saves battery and reduces server load for backgrounded pages.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/web-platform-browser-apis/idle-task-scheduling.svg"
          alt="Idle task scheduling system showing 16ms frame budget, requestIdleCallback integration, priority queue, deadline awareness, and Safari fallback"
          caption="Idle task scheduling system showing 16ms frame budget, requestIdleCallback integration, priority queue, deadline awareness, and Safari fallback"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Task Queue and Prioritization</h3>
        <p>The scheduler maintains a priority queue: high-priority tasks (preload critical resources) execute before medium (preprocessing) before low (telemetry). Within each priority level, tasks are FIFO. Tasks are objects with: a callback function, priority, timeout (optional deadline), and a unique ID for cancellation.</p>
        <p>Example: preload fonts (high priority), parse analytics (medium), upload metrics (low). During idle time, the scheduler pulls from high priority first, executes as much as the deadline allows, then moves to medium priority, etc.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">requestIdleCallback Integration</h3>
        <p>requestIdleCallback(callback, options) calls the callback when the browser is idle. The browser determines "idle" as: no user input pending, no layout/paint work scheduled, and time until the next frame exceeds the idle threshold (typically 5ms). The callback receives an IdleDeadline with timeRemaining() (milliseconds until the deadline) and didTimeout (boolean).</p>
        <p>The scheduler's requestIdleCallback callback dequeues tasks and executes them, checking timeRemaining() frequently. If timeRemaining() drops below about 1 ms, the scheduler yields and re-requests idleCallback for the next idle window. This ensures the browser remains responsive.</p>
        <p><strong>Understanding Browser Idle Time:</strong> The browser is idle when (1) synchronous JavaScript has finished, (2) there are no pending timers or I/O tasks ready to run, (3) there are no pending microtasks, and (4) the next frame is not imminent (often several milliseconds away). At 60 frames per second, each frame budget is about 16.7ms. If rendering and input handling consume most of that budget, there may only be a couple of milliseconds available for idle work. The scheduler should prefer small, frequent slices so it does not create jank. If the page is continuously busy, the scheduler should still support a timeout-based guarantee so critical tasks run within a bounded time window, even if true idle time never appears.</p>
        <p><strong>Deadline and Budget Awareness:</strong> Idle callbacks receive a deadline object that reports how much time remains in the current idle window. Typical available time might be tens of milliseconds in the best case, but can drop to only a few milliseconds when the page is active. A well-behaved task checks remaining budget periodically and yields when the budget is almost exhausted. If it runs out of time, it saves progress and resumes during a later idle window. This requires tasks to be designed with checkpoints rather than assuming they can run to completion in one go.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Task Yielding and Resumption</h3>
        <p>A long task must yield periodically. A common pattern is to check the remaining idle budget after each logical sub-task (for example after processing one batch of items). When the remaining budget is nearly exhausted, the task stops and returns. The scheduler then resumes the task in the next idle window from where it left off.</p>
        <p>Explicit yielding: tasks can call scheduler.yield() to explicitly yield and let other tasks or user input happen. This is useful for tasks that don't easily measure progress (e.g., recursive algorithms).</p>
        <p><strong>Savepoint Pattern for Long Tasks:</strong> For tasks that cannot be easily divided (image processing, complex computation), use savepoints. After each chunk of work, save a small resumable state snapshot (for example the current index and partial result). On resumption, reload that state and continue. For example, when parsing a large JSON payload, checkpoint periodically and store the current position and accumulated result. This allows tasks to be preempted without losing progress.</p>
        <p><strong>Microoptimizations for Yielding Overhead:</strong> Checking the remaining idle budget too frequently can add overhead. A practical optimization is to check budget every N iterations or after each batch, rather than after every single item. The trade-off is a slightly higher risk of overrunning the budget in exchange for lower overhead. Some schedulers also align resumption with the browser’s next paint cycle to reduce visual disruption, while others resume as soon as possible to minimize end-to-end completion time.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Timeout and Fallback Behavior</h3>
        <p>Tasks can optionally specify a timeout (e.g., "this task must run within 10 seconds"). If the timeout expires before the task executes, the scheduler forces execution (even if not truly idle) to ensure tasks complete within their timeout.</p>
        <p>For browsers without requestIdleCallback (older Safari), fall back to setTimeout with a longer interval (e.g., 1 second). This mimics idle scheduling but is less precise; tasks may execute while the user is interacting. Mitigate by making tasks short and preemptible.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Handling and Resilience</h3>
        <p>If a task throws an error, catch it, log it, and move on to the next task. Don't crash the scheduler. Optionally allow tasks to define error handlers or retry logic. Provide telemetry on task failures for debugging.</p>
        <p>Memory safety: if many tasks are queued but not executing (browser is never idle), the queue grows. Implement a maximum queue size. If exceeded, drop low-priority tasks. Warn the developer that they're queueing too much work.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Page Visibility Integration</h3>
        <p>The scheduler listens to the Page Visibility API. When hidden=true, pause the idle callback (don't re-request after a task finishes). When hidden=false, resume. This prevents CPU activity on backgrounded tabs.</p>
        <p>On visibility change, the scheduler can optionally flush high-priority tasks immediately (e.g., save state before page unload) or defer until the page is visible again.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Task Cancellation and Cleanup</h3>
        <p>Each task receives a unique ID. Callers can cancel a queued or running task via scheduler.cancel(taskId). If the task is queued but hasn't started, it's removed. If it's running, it's marked for cancellation; the next yield point checks the flag and stops execution.</p>
        <p>On page unload, all remaining tasks are cleaned up. High-priority tasks can register unload handlers to save state (e.g., flush pending analytics) before the page closes.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Metrics and Monitoring</h3>
        <p>Track metrics: queue depth (number of pending tasks), task execution time, task completion rate, idle window frequency, and task errors. Use these to detect issues: if queue depth is always high, you're scheduling too much work. If idle window frequency is low, the main thread is saturated; reduce critical work.</p>
        <p>Profile: measure FID, FCP, and interaction response time before and after idle scheduling. Successful implementation reduces FID by 30-50% for apps with significant initialization work.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Precise idle detection vs compatibility: requestIdleCallback is precise but not available on older browsers. setTimeout fallback is universal but less precise and may execute during light user activity. Accept some imprecision or use both (requestIdleCallback where available, fall back to setTimeout).</p>
        <p>Task latency vs throughput: short deadline (20ms) ensures responsiveness but limits throughput (fewer tasks per idle window). Long deadline (100ms) increases throughput but may cause jank on slower devices. 50ms is typical sweet spot.</p>
        <p>Priority queues add complexity: simple FIFO is easier but doesn't handle urgent tasks well. Prioritization is worth the complexity for apps with diverse task types.</p>
        <p>Visibility pausing: pausing idle tasks when hidden saves battery but may delay important background work (periodic sync, telemetry). Allow per-task opt-in for visibility awareness; don't pause all tasks.</p>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 1: Simple requestIdleCallback Scheduler</h3>
        <p>Maintain a task queue. On requestIdleCallback, pop and execute tasks, checking deadline frequently. Return from callback when deadline approaches. Re-request idleCallback.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 2: Priority Queue with Timeouts</h3>
        <p>Use a binary heap for priority queue. Each task has priority and optional timeout. Before executing, check if timeout has passed; if so, force execution. Otherwise, respect idle deadline.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 3: Chunked Task Execution</h3>
        <p>For large tasks (e.g., process 10k items), split into chunks (process 100 items per idle slot). Each chunk yields before deadline. Useful for tasks that don't naturally support incremental progress.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Idle task scheduling defers non-critical work until the browser is idle, preserving responsiveness for user interactions and improving perceived performance. Essential patterns include requestIdleCallback integration with deadline awareness, priority-based task queuing, explicit task yielding before deadlines, error handling without scheduler crashes, and page visibility integration to pause when hidden. Trade-offs include precise idle detection (requestIdleCallback) versus compatibility (setTimeout fallback), deadline length (responsiveness versus throughput), and priority queue complexity. Real-world systems (Google Docs, Slack, Chrome) use idle scheduling for font preloading, analytics parsing, and background sync. For best results, measure FID before and after implementation, keep tasks short (100ms max per yield), set priorities based on user-facing impact, and use 50ms deadlines as default. Monitor queue depth to detect if you're scheduling too much work.</p>
      </section>
    </ArticleLayout>
  );
}
