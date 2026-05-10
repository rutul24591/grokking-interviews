"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-async-state-handling",
  title: "Design Async State Handling",
  description:
    "Production-grade async patterns with loading/error/success states, cancellation, retries, race condition handling, and request deduplication.",
  category: "low-level-design",
  subcategory: "state-interaction-modeling",
  slug: "async-state-handling",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "async",
    "loading-states",
    "error-handling",
    "api-calls",
    "race-conditions",
  ],
  relatedTopics: [
    "state-management-patterns",
    "error-state-management",
    "optimistic-ui-updates",
  ],
};

export default function AsyncStateHandlingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          Async operations (API calls) have states: pending, success, error.
          Key challenges: managing multiple async ops (which succeeded?), race
          conditions (request B response arrives before A), cancellation
          (component unmounts, abort fetch), and retries (network flaky). Naive
          approach: dispatch action on success/error. Breaks with race
          conditions.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>Multiple async operations (fetch users, comments, likes).</li>
          <li>Operations take 100ms-5s (non-trivial latency).</li>
          <li>
            User may interact while loading (scroll, click, change filters).
          </li>
          <li>Network may fail, retry needed.</li>
          <li>Component may unmount before response arrives.</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Status Tracking:</strong> idle, loading, success, error per
            operation.
          </li>
          <li>
            <strong>Data Storage:</strong> Store response data when success.
          </li>
          <li>
            <strong>Error Storage:</strong> Store error message when failed.
          </li>
          <li>
            <strong>Retry:</strong> Allow user to retry failed operation.
          </li>
          <li>
            <strong>Cancellation:</strong> Abort operation if component
            unmounts.
          </li>
          <li>
            <strong>Race Condition Prevention:</strong> Latest response wins
            (not out-of-order).
          </li>
          <li>
            <strong>Request Deduplication:</strong> Don't fetch twice
            simultaneously.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Memory:</strong> No memory leaks (cleanup on unmount).
          </li>
          <li>
            <strong>Performance:</strong> Dispatch pending state instantly
            (&lt;10ms).
          </li>
          <li>
            <strong>Resilience:</strong> Retry with exponential backoff.
          </li>
          <li>
            <strong>User Experience:</strong> Show loading spinner, error
            message.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            User triggers operation A, then B quickly. B completes first. A
            then completes—show A's data (wrong order)?
          </li>
          <li>
            Component unmounts while request pending—abort and cleanup.
          </li>
          <li>
            Same operation dispatched twice (duplicate request, user double-clicked).
          </li>
          <li>
            Request times out (hangs, no response ever).
          </li>
          <li>
            Server error (500): retry or show error?
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          Track async operation status: idle, loading, success, error. On
          dispatch, set loading. On response, set success + data OR error. Use
          request ID to prevent race conditions (ignore older responses). Abort
          fetch on component unmount. Retry with exponential backoff on
          failure.
        </p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/state-interaction-modeling/async-state-handling.svg"
          alt="Async state handling showing standard async state shape, multi-step workflow steps, race condition prevention with AbortController, and optimistic updates pattern"
          caption="Async state handling showing standard async state shape, multi-step workflow steps, race condition prevention with AbortController, and optimistic updates pattern"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Async State Structure</h3>
        <p>Track async operation state.</p>
        <ul className="space-y-2">
          <li>
            <strong>Status:</strong> idle | loading | success | error.
          </li>
          <li>
            <strong>Data:</strong> Response data (null if not loaded).
          </li>
          <li>
            <strong>Error:</strong> Error message (null if no error).
          </li>
          <li>
            <strong>Timestamp:</strong> When response arrived (detect stale).
          </li>
          <li>
            <strong>Request ID:</strong> Unique per request (prevent race
            conditions).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Thunk Pattern (Redux)</h3>
        <p>Dispatch async operations as thunks.</p>
        <ul className="space-y-2">
          <li>
            <strong>Thunk:</strong> Function (dispatch, getState) → async
            operation.
          </li>
          <li>
            <strong>Dispatch Pending:</strong> Thunk dispatches
            FETCH_USERS_PENDING.
          </li>
          <li>
            <strong>Dispatch Fulfilled:</strong> On response, dispatch
            FETCH_USERS_FULFILLED + data.
          </li>
          <li>
            <strong>Dispatch Rejected:</strong> On error, dispatch
            FETCH_USERS_REJECTED + error.
          </li>
          <li>
            <strong>Reducer:</strong> Handles each action, updates status +
            data/error.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request Lifecycle</h3>
        <p>Stages of async request.</p>
        <ul className="space-y-2">
          <li>
            <strong>Idle:</strong> No request in progress.
          </li>
          <li>
            <strong>Loading:</strong> Request sent, waiting for response.
          </li>
          <li>
            <strong>Success:</strong> Response received, data extracted.
          </li>
          <li>
            <strong>Error:</strong> Request failed, error message extracted.
          </li>
          <li>
            <strong>Cleanup:</strong> Component unmounts, abort in-progress
            request.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Race Condition Prevention</h3>
        <p>Handle out-of-order responses.</p>
        <ul className="space-y-2">
          <li>
            <strong>Request ID:</strong> Unique identifier per request (UUID or
            counter).
          </li>
          <li>
            <strong>Compare IDs:</strong> On response, compare to current
            request ID. Ignore if mismatch.
          </li>
          <li>
            <strong>Timestamp:</strong> Store request timestamp, ignore older
            responses.
          </li>
          <li>
            <strong>Latest Wins:</strong> Only apply response if it's newer
            than current.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cancellation & Cleanup</h3>
        <p>Abort operations on unmount.</p>
        <ul className="space-y-2">
          <li>
            <strong>AbortController:</strong> Browser API to cancel fetch.
          </li>
          <li>
            <strong>Unmount Cleanup:</strong> useEffect cleanup function aborts
            fetch.
          </li>
          <li>
            <strong>Memory Leak Prevention:</strong> Don't update unmounted
            component state.
          </li>
          <li>
            <strong>Error Handling:</strong> AbortError on cancel (expected,
            not error).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Retry Strategy</h3>
        <p>Retry failed operations.</p>
        <ul className="space-y-2">
          <li>
            <strong>Exponential Backoff:</strong> 1s, 2s, 4s, 8s retry
            intervals.
          </li>
          <li>
            <strong>Jitter:</strong> Add randomness (±10%) prevent thundering
            herd.
          </li>
          <li>
            <strong>Max Retries:</strong> Stop after 5 retries (give up).
          </li>
          <li>
            <strong>Retriable Errors:</strong> Retry on network errors, 5xx. Not
            4xx (client error).
          </li>
          <li>
            <strong>User Trigger:</strong> Allow manual retry (button).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request Deduplication</h3>
        <p>Prevent duplicate simultaneous requests.</p>
        <ul className="space-y-2">
          <li>
            <strong>In-Flight Map:</strong> Track currently in-flight requests
            (URL → Promise).
          </li>
          <li>
            <strong>Check Before Dispatch:</strong> If same request in-flight,
            return existing Promise.
          </li>
          <li>
            <strong>Benefit:</strong> Prevent double-fetch (user double-clicks
            button).
          </li>
          <li>
            <strong>TTL:</strong> Clean up completed requests from map.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Loading & Error States</h3>
        <p>Display to user.</p>
        <ul className="space-y-2">
          <li>
            <strong>Loading:</strong> Show spinner while loading (prevents
            blank).
          </li>
          <li>
            <strong>Error:</strong> Show error message + retry button.
          </li>
          <li>
            <strong>Empty:</strong> Show "no data" if success but empty result.
          </li>
          <li>
            <strong>Skeleton:</strong> Show placeholder shape while loading
            (perceived speed).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring & Observability</h3>
        <p>Track async operation health.</p>
        <ul className="space-y-2">
          <li>
            <strong>Success Rate:</strong> % of requests succeeding (low =
            server issue).
          </li>
          <li>
            <strong>Latency:</strong> P50, P95, P99 request latency.
          </li>
          <li>
            <strong>Retry Rate:</strong> % of requests retried (high = network
            issue).
          </li>
          <li>
            <strong>Timeout Rate:</strong> % of requests timing out.
          </li>
          <li>
            <strong>Race Condition Incidents:</strong> Alert if wrong response
            applied.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">RTK Query</h3>
        <p>
          Redux Toolkit Query builtin async handling. Generates thunks, hooks,
          caching. Reduces boilerplate significantly.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">SWR / React Query</h3>
        <p>
          Libraries for data fetching + caching. SWR minimal, React Query
          powerful. Cleaner than thunks.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Async</h3>
        <p>
          Mock fetch/API. Dispatch thunk, wait for fulfilled/rejected action.
          Assert state. Test race condition: dispatch two requests, verify
          latest wins.
        </p>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Stale-While-Revalidate</h3>
        <p>
          Show stale data immediately, fetch fresh in background, update when
          ready. Better UX.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request Coalescing</h3>
        <p>
          Multiple components request same data. Coalesce into single request,
          share response. Reduce network overhead.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Exponential Backoff with Jitter</h3>
        <p>
          Implement exponential backoff + random jitter. Prevent thundering herd
          on server restart.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Timeout Handling</h3>
        <p>
          If request takes &gt;30s, abort and show error. Prevent hanging
          indefinitely.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing at Scale</h3>
        <p>
          Load test: 1000 concurrent async operations. Verify no race
          conditions, memory leaks. Chaos: timeout 50% of requests.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <p>
          Common: update state after unmount (memory leak). Solution: check
          mounted before setState. Another: race condition (old response
          overwrites new). Solution: request ID.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incident Response</h3>
        <p>
          High error rate: check server health. Race conditions: verify request
          ID logic. Memory leaks: check unmount cleanup.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Deduplication vs Flexibility</h3>
        <p>
          Deduplication prevents double-fetch but reduces flexibility (can't
          force refresh). Allow manual refresh button.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Retry Count vs User Experience</h3>
        <p>
          More retries increase success but delay error feedback. Balance:
          ~3-5 retries.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Library vs Manual</h3>
        <p>
          RTK Query / React Query eliminate boilerplate but add dependency.
          Manual more control. Use library for simplicity.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          Async state handling critical for data-fetching apps. For
          staff/principal engineers, essential aspects include status tracking
          (idle/loading/success/error), request IDs for race condition
          prevention, AbortController for cancellation, and exponential backoff
          retries. Request deduplication prevents double-fetch. RTK Query
          recommended for Redux apps. At scale, async operations with high
          concurrency require careful race condition handling and memory leak
          prevention. Testing must cover race conditions, cancellation,
          timeouts, retries. Monitoring success rate and latency distribution.
          Real-world systems use RTK Query for automatic handling, SWR/React
          Query for simpler solutions.
        </p>
      </section>
    </ArticleLayout>
  );
}
