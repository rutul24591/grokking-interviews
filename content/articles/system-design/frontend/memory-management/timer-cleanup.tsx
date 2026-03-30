"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-memory-management-timer-cleanup",
  title: "Timer Cleanup",
  description: "Comprehensive guide to timer cleanup in React/Next.js SPAs: ownership patterns, cancellation strategies, backoff/jitter for reliability, and preventing background work accumulation.",
  category: "frontend",
  subcategory: "memory-management",
  slug: "timer-cleanup",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "memory", "timers", "polling", "performance", "reliability", "spa", "memory-leaks"],
  relatedTopics: ["memory-leaks-prevention", "event-listener-cleanup", "garbage-collection-understanding", "request-deduplication"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Timer cleanup</strong> is the practice of ensuring that time-based work (timeouts, intervals, animation frames, idle callbacks, retry loops, and polling loops) is cancelled when it is no longer needed. In SPAs, forgotten timers are a common source of both memory retention and background CPU activity: the timer keeps callbacks reachable, callbacks keep closures reachable, and periodic execution keeps allocating and doing work long after the user navigated away.
        </p>
        <p>
          Unlike obvious leaks, timer problems can be subtle: the app works, but background loops continue to run, causing elevated CPU, increased battery usage on mobile, and a slow increase in memory churn that manifests as GC-driven jank. In extreme cases, multiple overlapping polling loops and retries produce load spikes on both client and backend.
        </p>
        <p>
          Staff/principal engineers should treat timers as a concurrency model and a resource: they require <strong>ownership</strong>, <strong>cancellation</strong>, and <strong>budgets</strong> just like network requests and subscriptions.
        </p>
        <p>
          The business impact of timer leaks:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Battery Drain:</strong> Background timers prevent devices from entering low-power states. Mobile users experience reduced battery life.
          </li>
          <li>
            <strong>CPU Overhead:</strong> Overlapping timers cause redundant work. A polling loop that should run once per second might run 10 times per second with leaked timers.
          </li>
          <li>
            <strong>Backend Load:</strong> Leaked polling timers send requests to backend services even when no user is actively viewing the page.
          </li>
          <li>
            <strong>Memory Churn:</strong> Each timer callback allocates memory. Forgotten timers cause continuous allocation and GC pressure.
          </li>
        </ul>
        <p>
          In system design interviews, timer cleanup demonstrates understanding of concurrency, lifecycle management, backpressure, and the trade-offs between freshness and resource efficiency. It shows you think about application behavior over time, not just initial state.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/memory-management/timer-cleanup-lifecycle.svg"
          alt="Timer lifecycle diagram showing create, wait, execute, and cleanup/repeat stages"
          caption="Timer lifecycle — scheduled callbacks remain reachable until explicitly cancelled. Without cleanup, view-specific timers become session-lifetime retention."
        />

        <h3>Timers Are Reachability Roots in Practice</h3>
        <p>
          When a timeout or interval is scheduled, the runtime holds a reference to the callback until it fires (or until it is cancelled). If the timer is periodic, that reference can persist for the entire session. The callback often references application state, caches, and sometimes DOM references. This is why "just a polling loop" can retain large graphs.
        </p>
        <p>
          The retention chain:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Timer Queue:</strong> Browser/runtime internal queue holding scheduled timers.
          </li>
          <li>
            <strong>Callback Function:</strong> The function to execute when timer fires.
          </li>
          <li>
            <strong>Closure Scope:</strong> Variables captured when callback was created — state, props, DOM refs.
          </li>
        </ul>
        <p>
          Cancelling the timer (clearTimeout/clearInterval) breaks the first link, allowing GC to collect the callback and its closure (assuming no other references exist).
        </p>

        <h3>Intervals vs. Recursive Scheduling</h3>
        <p>
          Periodic work is commonly implemented as fixed intervals or as recursive scheduling (schedule next run after the previous completes). The trade-off is consistency vs. backpressure:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Fixed Intervals (setInterval):</strong> Fires at fixed intervals regardless of execution time. Can overlap if work takes longer than interval. Simpler but risk of accumulation.
          </li>
          <li>
            <strong>Recursive Scheduling (setTimeout in callback):</strong> Schedule next run after current completes. Naturally applies backpressure — if work is slow, next run is delayed. More resilient but can drift.
          </li>
        </ul>
        <p>
          Regardless of pattern, both require reliable cancellation at lifecycle boundaries. Recursive scheduling is generally preferred for polling because it prevents overlapping executions.
        </p>

        <h3>Backoff and Jitter Are Reliability Tools</h3>
        <p>
          Timers are often used for retries and polling. Without backoff and jitter, synchronized timers across clients can create thundering herds on backend services and can increase client CPU/memory churn during incidents. Even on the frontend, retry storms can degrade user experience and increase failure amplification.
        </p>
        <p>
          Backoff strategies:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Linear Backoff:</strong> Delay increases linearly (1s, 2s, 3s...). Simple but can still overwhelm.
          </li>
          <li>
            <strong>Exponential Backoff:</strong> Delay doubles each retry (1s, 2s, 4s, 8s...). Reduces load quickly during outages.
          </li>
          <li>
            <strong>Exponential Backoff with Jitter:</strong> Add randomness to prevent synchronization (1s±0.5s, 2s±1s...). Best for distributed systems.
          </li>
          <li>
            <strong>Max Delay Cap:</strong> Always cap maximum delay (e.g., 30s) to prevent excessive wait times.
          </li>
        </ul>

        <h3>Visibility and Throttling</h3>
        <p>
          Browsers throttle timers in background tabs and under certain power conditions. If your architecture assumes timers fire precisely, you can get bursty behavior when the tab becomes visible again. This can cause a sudden spike in allocations, network requests, and UI updates. A robust design treats visibility changes as lifecycle boundaries.
        </p>
        <p>
          Best practices for visibility-aware timers:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Pause on Hidden:</strong> Stop polling/timers when document.hidden is true.
          </li>
          <li>
            <strong>Resume on Visible:</strong> Restart timers when tab becomes visible again.
          </li>
          <li>
            <strong>Catch Up Logic:</strong> On resume, check if data is stale and fetch immediately.
          </li>
          <li>
            <strong>Use Visibility API:</strong> Listen to visibilitychange event for lifecycle management.
          </li>
        </ul>

        <h3>Timer Types and Their Characteristics</h3>
        <p>
          Different timer APIs have different behaviors:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>setTimeout:</strong> Fires once after delay. Must be manually cleared if component unmounts before firing.
          </li>
          <li>
            <strong>setInterval:</strong> Fires repeatedly at fixed interval. Must be cleared to stop. High leak risk.
          </li>
          <li>
            <strong>requestAnimationFrame:</strong> Fires before next paint. Automatically pauses in background tabs. Must be cancelled with cancelAnimationFrame.
          </li>
          <li>
            <strong>requestIdleCallback:</strong> Fires during idle periods. Good for non-urgent work. Browser cancels automatically when needed.
          </li>
          <li>
            <strong>IntersectionObserver:</strong> Fires when elements enter viewport. Must be disconnected to stop.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A safe timer architecture makes time-based work explicit, owned, and cancellable.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/memory-management/timer-cleanup-polling.svg"
          alt="Comparison of polling patterns: naive polling, proper cleanup, exponential backoff, and request-based strategies"
          caption="Polling patterns — naive polling accumulates timers; proper cleanup prevents overlap; backoff reduces load; request-based (SWR) is often best."
        />

        <h3>1) Define Ownership and Scope</h3>
        <p>
          Decide whether the timer is view-scoped (lives only while a page is active), feature-scoped (only while a feature is enabled), or session-scoped (rare). View-scoped timers should start on activation and stop on deactivation or unmount.
        </p>
        <p>
          In React, this maps to:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Component-scoped:</strong> useEffect with cleanup return.
          </li>
          <li>
            <strong>Route-scoped:</strong> Timer starts on route enter, stops on route leave.
          </li>
          <li>
            <strong>Feature-scoped:</strong> Timer starts when feature flag enables, stops when feature disables.
          </li>
        </ul>
        <p>
          Session-scoped timers should be rare and require explicit justification. If a timer must live for the session, it should be bounded (max delay, max retries) and visibility-aware.
        </p>

        <h3>2) Ensure Cancellation Is Reliable</h3>
        <p>
          Cancellation must happen on unmount, route transitions, and session resets. This includes canceling in-flight retries, polling loops, and animation loops. The reliability risk is missing a cancellation path during abnormal flows: errors, aborted navigations, or conditional rendering.
        </p>
        <p>
          Cancellation checklist:
        </p>
        <ul className="space-y-2">
          <li>
            Store timer IDs in refs for cleanup access.
          </li>
          <li>
            Clear all timers in useEffect cleanup.
          </li>
          <li>
            Cancel pending animations with cancelAnimationFrame.
          </li>
          <li>
            Disconnect observers with observer.disconnect().
          </li>
          <li>
            Abort pending fetches with AbortController.
          </li>
        </ul>

        <h3>3) Apply Backpressure and Budgets</h3>
        <p>
          Time-based work should respect budgets: maximum frequency, maximum concurrent loops, maximum buffer sizes, and safe behavior during offline states. Without budgets, the system can degrade into a background-work machine even when the user is idle.
        </p>
        <p>
          Budget examples:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Max Frequency:</strong> Poll no more often than once per 5 seconds.
          </li>
          <li>
            <strong>Max Concurrent:</strong> Only one polling loop per feature at a time.
          </li>
          <li>
            <strong>Max Retries:</strong> Give up after 5 failed retries.
          </li>
          <li>
            <strong>Max Delay:</strong> Cap backoff at 30 seconds.
          </li>
          <li>
            <strong>Offline Pause:</strong> Stop polling when navigator.onLine is false.
          </li>
        </ul>

        <h3>4) Handle Overlapping Timers</h3>
        <p>
          A common bug is creating new timers without clearing old ones, leading to overlapping execution. This happens when:
        </p>
        <ul className="space-y-2">
          <li>
            Component re-renders and creates new timer without clearing previous.
          </li>
          <li>
            Retry logic creates new timer without tracking pending retries.
          </li>
          <li>
            Multiple components each create their own polling loop for the same data.
          </li>
        </ul>
        <p>
          Prevention:
        </p>
        <ul className="space-y-2">
          <li>
            Always clear existing timer before creating new one.
          </li>
          <li>
            Use refs to track timer state across renders.
          </li>
          <li>
            Centralize polling logic to prevent duplication.
          </li>
          <li>
            Use libraries like React Query/SWR that handle deduplication automatically.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/memory-management/timer-cleanup-overlap.svg"
          alt="Timer overlap problem and solution: without cleanup, multiple timers accumulate; with cleanup, only one timer runs at a time"
          caption="Timer overlap — without cleanup, re-renders create overlapping timers. With proper cleanup, only one timer runs at a time."
        />

        <p>
          From a system-design perspective, timers are often a proxy for an architectural choice: periodic polling vs. event-driven updates. The optimal choice depends on freshness requirements, backend capability, client constraints (mobile), and operational cost. Regardless, the frontend must prevent timer accumulation and overlapping loops.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Approach</th>
              <th className="p-3 text-left">Strengths</th>
              <th className="p-3 text-left">Weaknesses</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Fixed Interval Polling</td>
              <td className="p-3">Simple to implement; predictable timing</td>
              <td className="p-3">Can overlap if work is slow; no backpressure</td>
              <td className="p-3">Simple dashboards, low-frequency updates</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Recursive Scheduling</td>
              <td className="p-3">Natural backpressure; no overlap</td>
              <td className="p-3">Timing can drift; more complex</td>
              <td className="p-3">API polling, retry logic</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Exponential Backoff</td>
              <td className="p-3">Reduces load during failures; resilient</td>
              <td className="p-3">Slower recovery; can feel unresponsive</td>
              <td className="p-3">Retry logic, error recovery</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Server-Sent Events</td>
              <td className="p-3">Real-time without polling; efficient</td>
              <td className="p-3">Requires server support; connection management</td>
              <td className="p-3">Live feeds, notifications</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">React Query / SWR</td>
              <td className="p-3">Built-in dedup, caching, retry, cleanup</td>
              <td className="p-3">Library dependency; learning curve</td>
              <td className="p-3">Most data fetching scenarios</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level bias is to prefer library-managed timers (React Query, SWR) over manual timers when possible. These libraries handle cleanup, deduplication, and retry logic automatically.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Always Store Timer IDs:</strong> Keep timer IDs in refs so they can be cleared in cleanup.
          </li>
          <li>
            <strong>Clear in useEffect Cleanup:</strong> Return cleanup function that clears all timers.
          </li>
          <li>
            <strong>Prefer Recursive Scheduling:</strong> Use setTimeout recursively instead of setInterval for polling.
          </li>
          <li>
            <strong>Implement Backoff:</strong> Use exponential backoff with jitter for retries.
          </li>
          <li>
            <strong>Respect Visibility:</strong> Pause timers when tab is hidden, resume when visible.
          </li>
          <li>
            <strong>Set Maximum Retries:</strong> Give up after N failures to prevent infinite loops.
          </li>
          <li>
            <strong>Use Libraries When Possible:</strong> React Query, SWR, or similar for data fetching with built-in timer management.
          </li>
          <li>
            <strong>Cancel Animation Frames:</strong> Use cancelAnimationFrame in cleanup for any requestAnimationFrame calls.
          </li>
          <li>
            <strong>Disconnect Observers:</strong> Call disconnect() on IntersectionObserver, ResizeObserver, etc. in cleanup.
          </li>
          <li>
            <strong>Abort Pending Fetches:</strong> Use AbortController to cancel in-flight requests on unmount.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Creating Timers in Render:</strong> Timers created during render fire even if component never mounts. Always create timers in useEffect.
          </li>
          <li>
            <strong>Not Clearing on Unmount:</strong> Forgetting to clear timers in useEffect cleanup causes leaks.
          </li>
          <li>
            <strong>Overlapping Intervals:</strong> Creating new intervals without clearing old ones causes accumulation.
          </li>
          <li>
            <strong>Ignoring Visibility:</strong> Polling continues in background tabs, wasting battery and bandwidth.
          </li>
          <li>
            <strong>No Max Retries:</strong> Infinite retry loops continue forever even when backend is down.
          </li>
          <li>
            <strong>Closure Capture of Stale State:</strong> Timer callbacks capture stale state. Use refs or functional updates.
          </li>
          <li>
            <strong>Animation Without Cancellation:</strong> requestAnimationFrame continues after component unmounts.
          </li>
          <li>
            <strong>Observer Without Disconnect:</strong> IntersectionObserver/ResizeObserver continue firing after cleanup.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Real-Time Dashboard</h3>
        <p>
          <strong>Problem:</strong> Dashboard polls API every 5 seconds for live data. Memory grows over time, CPU usage increases.
        </p>
        <p>
          <strong>Root Cause:</strong> Polling continues after navigation away from dashboard. Multiple dashboard visits create overlapping polling loops.
        </p>
        <p>
          <strong>Solution:</strong> Start polling on dashboard mount, stop on unmount. Use recursive scheduling with AbortController for cancellable fetches. Add visibility pause.
        </p>

        <h3>File Upload with Retry</h3>
        <p>
          <strong>Problem:</strong> Failed uploads retry indefinitely. Multiple retry timers accumulate.
        </p>
        <p>
          <strong>Root Cause:</strong> Retry logic creates new timers without tracking or limiting retries.
        </p>
        <p>
          <strong>Solution:</strong> Implement exponential backoff with max 5 retries. Track retry count in ref. Cancel pending retries on component unmount.
        </p>

        <h3>Animation Loop</h3>
        <p>
          <strong>Problem:</strong> Animation continues after component unmounts. Console errors from state updates on unmounted component.
        </p>
        <p>
          <strong>Root Cause:</strong> requestAnimationFrame not cancelled in cleanup.
        </p>
        <p>
          <strong>Solution:</strong> Store animation frame ID in ref. Call cancelAnimationFrame in useEffect cleanup. Check mounted ref before state updates.
        </p>

        <h3>Autosave Feature</h3>
        <p>
          <strong>Problem:</strong> Autosave triggers after user navigates away, causing errors and unwanted saves.
        </p>
        <p>
          <strong>Root Cause:</strong> Debounced save timer not cleared on unmount.
        </p>
        <p>
          <strong>Solution:</strong> Clear pending save timer in cleanup. Flush pending saves before navigation if needed.
        </p>

        <h3>Infinite Scroll with Loading</h3>
        <p>
          <strong>Problem:</strong> Multiple loading triggers fire simultaneously. Duplicate API calls.
        </p>
        <p>
          <strong>Root Cause:</strong> IntersectionObserver triggers multiple times without debouncing.
        </p>
        <p>
          <strong>Solution:</strong> Use IntersectionObserver with threshold. Track loading state to prevent duplicate triggers. Disconnect observer on unmount.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: Why do timers cause memory leaks in SPAs?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Timers keep callbacks reachable until they fire or are cancelled. The callback keeps its closure reachable, which can include large application state or DOM references. If a timer is not cleared when a component unmounts, it continues to hold references to view-specific state indefinitely.
            </p>
            <p className="mb-3">
              For periodic timers (setInterval), the problem compounds: the timer keeps firing, executing callbacks, and potentially allocating new memory — all after the user has navigated away.
            </p>
            <p>
              The fix is explicit cancellation: store timer IDs and clear them in cleanup functions (useEffect return, componentWillUnmount).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is the difference between setInterval and recursive setTimeout?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>setInterval:</strong> Fires at fixed intervals regardless of execution time. If the callback takes longer than the interval, callbacks can overlap. No built-in backpressure.
              </li>
              <li>
                <strong>Recursive setTimeout:</strong> Schedule next execution after current completes. Naturally prevents overlap — if work is slow, next run is delayed. Provides backpressure.
              </li>
            </ul>
            <p>
              For polling, recursive setTimeout is generally safer because it prevents overlapping executions. However, both require explicit cancellation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How would you implement retry logic with exponential backoff?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Exponential backoff increases delay between retries exponentially:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>First retry:</strong> 1 second delay
              </li>
              <li>
                <strong>Second retry:</strong> 2 seconds
              </li>
              <li>
                <strong>Third retry:</strong> 4 seconds
              </li>
              <li>
                <strong>Fourth retry:</strong> 8 seconds
              </li>
              <li>
                <strong>Cap at maximum:</strong> e.g., 30 seconds
              </li>
            </ul>
            <p className="mb-3">
              Add jitter (randomness) to prevent synchronization when many clients retry simultaneously.
            </p>
            <p>
              Implementation: Use recursive setTimeout with calculated delay. Track retry count in ref. Stop after max retries. Clear timer on unmount.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you handle timers when the tab goes to background?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Detect Visibility:</strong> Use document.hidden and visibilitychange event.
              </li>
              <li>
                <strong>Pause on Hidden:</strong> Stop polling/timers when tab is hidden to save battery and bandwidth.
              </li>
              <li>
                <strong>Resume on Visible:</strong> Restart timers when tab becomes visible. Optionally fetch immediately if data is stale.
              </li>
              <li>
                <strong>Handle Throttling:</strong> Browsers throttle timers in background tabs. Don&apos;t assume precise timing.
              </li>
            </ul>
            <p>
              This is especially important for mobile users where battery and data usage matter.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What are the alternatives to polling for real-time updates?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>WebSockets:</strong> Full-duplex connection for real-time bidirectional communication. Best for frequent updates.
              </li>
              <li>
                <strong>Server-Sent Events (SSE):</strong> Server pushes updates to client over HTTP. Simpler than WebSockets, unidirectional.
              </li>
              <li>
                <strong>GraphQL Subscriptions:</strong> Real-time updates via GraphQL. Built on WebSockets typically.
              </li>
              <li>
                <strong>Long Polling:</strong> Client requests, server holds until data available. Less efficient than WebSockets/SSE.
              </li>
            </ul>
            <p>
              Polling is simplest but least efficient. Use push-based approaches when real-time is critical and infrastructure supports it.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How would you prevent overlapping polling loops?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Track Timer State:</strong> Store timer ID in ref. Clear existing timer before creating new one.
              </li>
              <li>
                <strong>Single Source of Truth:</strong> Centralize polling logic (e.g., in a custom hook or store) to prevent multiple components from creating independent loops.
              </li>
              <li>
                <strong>Use Libraries:</strong> React Query, SWR handle deduplication automatically — only one fetch runs even if multiple components request same data.
              </li>
              <li>
                <strong>Guard with Flags:</strong> Track &quot;isPolling&quot; state. Don&apos;t start new poll if already polling.
              </li>
            </ul>
            <p>
              The key insight: overlapping timers are a state management problem. Track timer state explicitly and enforce invariants.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/setTimeout" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: setTimeout
            </a> — Documentation for setTimeout and clearTimeout.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/setInterval" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: setInterval
            </a> — Documentation for setInterval and clearInterval.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: Page Visibility API
            </a> — Detect when tab is visible/hidden.
          </li>
          <li>
            <a href="https://tanstack.com/query/latest" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Query
            </a> — Data fetching library with built-in caching, retries, and cleanup.
          </li>
          <li>
            <a href="https://swr.vercel.app/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              SWR
            </a> — React Hooks library for data fetching with automatic revalidation.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
