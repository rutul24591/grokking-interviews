"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-retry-mechanism",
  title: "Design a Retry Mechanism",
  description:
    "Production-grade retry logic with exponential backoff, jitter, retry budgets, circuit breakers, and failure classification for resilient API communication.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "retry-mechanism",
  wordCount: 6800,
  readingTime: 40,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "retry",
    "exponential-backoff",
    "jitter",
    "circuit-breaker",
    "resilience",
  ],
  relatedTopics: [
    "data-fetching-hook",
    "global-api-error-handling",
    "rate-limited-autocomplete",
  ],
};

export default function RetryMechanismArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          API requests fail: network timeouts, server temporarily down, connection lost. Most failures are transient (server recovers, network stabilizes). Naive approach: don't retry, fail immediately. User refreshes manually. Bad UX. Better: automatically retry transient failures with backoff. When server temporarily overloaded (500 error), retrying immediately overwhelms it more. If 1000 clients all retry immediately, thundering herd—server crashes. Solution: exponential backoff (wait 1s, 2s, 4s, 8s) with jitter (randomize: 1-2s, 2-4s, 4-8s) to spread retries. Server recovers gradually. Error classification: 4xx (validation error, auth failure) don't retry (will never succeed). 5xx (server error) do retry. Network errors retry.
        </p>
        <p>
          Circuit breaker pattern: if server consistently returning 5xx, stop retrying. Return failure immediately instead of wasting 30s on exponential backoff. Server degrades gracefully. Fallback: return cached data, show offline message.
        </p>
        <p>
          Key challenges: (1) Error classification (which errors are retryable?), (2) Backoff calculation (exponential, linear, random?), (3) Jitter (spread retries), (4) Max retries (don't retry forever), (5) Circuit breaking (detect degradation), (6) Idempotency (safe to retry without side effects).
        </p>
        <p>
          <strong>Explicit assumptions:</strong> Network errors and 5xx are transient. 4xx are permanent. Server occasionally overloaded. Many clients retry simultaneously. Requests are idempotent (safe to retry). Retry state machine needed (backoff state, attempt count).
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Functional Requirements
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Transient Failure Detection:</strong> Classify errors as
            transient or permanent.
          </li>
          <li>
            <strong>Automatic Retry:</strong> Retry transient failures
            automatically.
          </li>
          <li>
            <strong>Exponential Backoff:</strong> Increase delay between retries
            exponentially.
          </li>
          <li>
            <strong>Jitter:</strong> Add randomness to backoff to prevent
            thundering herd.
          </li>
          <li>
            <strong>Max Retries:</strong> Limit retry attempts to prevent
            infinite loops.
          </li>
          <li>
            <strong>Circuit Breaker:</strong> Stop retrying when backend is
            degraded.
          </li>
          <li>
            <strong>Retry Budget:</strong> Limit total retry attempts per time
            window.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Non-Functional Requirements
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Latency:</strong> Retry delays can be seconds to minutes.
            User must wait.
          </li>
          <li>
            <strong>Fairness:</strong> Jitter ensures retries spread evenly
            across time.
          </li>
          <li>
            <strong>Resilience:</strong> Recover from transient failures without
            manual intervention.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            All retries exhausted → surface error to user with manual retry
            option.
          </li>
          <li>
            Circuit breaker opens → stop retrying for a while, then try again
            (reset).
          </li>
          <li>Retry during component unmount → cancel pending retry timers.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          On request failure, classify the error. If transient, schedule a retry
          with exponential backoff and jitter. Track retry attempt count. If max
          retries exceeded, fail. Implement a circuit breaker that stops
          retrying when error rate exceeds threshold, and periodically tries
          again to detect recovery. Implement a global retry budget to limit
          total retries across all requests in a time window.
        </p>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Error Classification
        </h3>
        <p>Determine whether an error is transient (retryable) or permanent.</p>
        <ul className="space-y-2">
          <li>
            <strong>Transient:</strong> Network timeout, connection refused, 5xx
            server error, 429 rate limit.
          </li>
          <li>
            <strong>Permanent:</strong> 400 bad request, 401 unauthorized, 403
            forbidden, 404 not found.
          </li>
          <li>
            <strong>Configurable:</strong> Some apps may retry 429 differently.
            Allow custom classification per error code.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Exponential Backoff
        </h3>
        <p>
          Retry delays increase exponentially to give server time to recover.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Formula:</strong> delay = baseDelay * 2^(attemptNumber) =
            100ms * 2^n.
          </li>
          <li>
            <strong>Sequence:</strong> 100ms, 200ms, 400ms, 800ms, 1.6s, 3.2s,
            6.4s, 12.8s.
          </li>
          <li>
            <strong>Max Backoff:</strong> Cap delay at 32s to avoid excessive
            waits.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Jitter</h3>
        <p>
          Add randomness to backoff to prevent synchronized retries from many
          clients.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Equal Jitter:</strong> delay = baseDelay * 2^n * random(0,
            1).
          </li>
          <li>
            <strong>Full Jitter:</strong> delay = random(0, baseDelay * 2^n).
          </li>
          <li>
            <strong>Decorrelated Jitter:</strong> Combines exponential and
            random for balance.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Max Retries</h3>
        <p>Limit total retry attempts to prevent infinite loops.</p>
        <ul className="space-y-2">
          <li>
            <strong>Typical Max:</strong> 3-5 retries. Configurable per request
            type.
          </li>
          <li>
            <strong>Exceeding Max:</strong> Fail the request and surface error
            to user.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Circuit Breaker</h3>
        <p>
          Detect when backend is degraded and stop making requests to avoid
          cascading failures.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>States:</strong> Closed (requests allowed), Open (requests
            blocked), Half-open (testing recovery).
          </li>
          <li>
            <strong>Closed → Open:</strong> When error rate exceeds threshold
            (e.g., 50%) over time window.
          </li>
          <li>
            <strong>Open → Half-Open:</strong> After timeout (e.g., 30s), try
            single request.
          </li>
          <li>
            <strong>Half-Open → Closed:</strong> If request succeeds, assume
            recovered.
          </li>
          <li>
            <strong>Half-Open → Open:</strong> If request fails, backend still
            degraded.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Retry Budget</h3>
        <p>
          Limit total retry attempts globally to prevent overwhelming
          infrastructure.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Budget:</strong> Allow up to N retries per time window
            (e.g., 100 retries per minute).
          </li>
          <li>
            <strong>Tracking:</strong> Count retries. When budget exhausted,
            fail remaining requests.
          </li>
          <li>
            <strong>Reset:</strong> Budget resets every time window.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Idempotency</h3>
        <p>
          Retrying requests must be safe. Requests must be idempotent (same
          request twice = same result).
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Idempotent Requests:</strong> GET, PUT (with idempotency
            key), DELETE.
          </li>
          <li>
            <strong>Non-Idempotent:</strong> POST (creates new resource each
            time).
          </li>
          <li>
            <strong>Idempotency Key:</strong> Server-side deduplication via
            unique request ID.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring</h3>
        <p>Track retry behavior for observability.</p>
        <ul className="space-y-2">
          <li>
            <strong>Retry Count:</strong> How many requests retry, how many
            succeed on first try.
          </li>
          <li>
            <strong>Success Rate:</strong> % of retries that succeed vs fail.
          </li>
          <li>
            <strong>Circuit Breaker Status:</strong> When open, how long in open
            state.
          </li>
          <li>
            <strong>Retry Latency:</strong> Additional latency caused by
            retries.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Timeout Handling</h3>
        <p>
          Distinguish between timeout (no response after N seconds) and other
          network errors. Both are transient and retryable, but timeout
          indicates network latency.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Request Cancellation
        </h3>
        <p>
          If component unmounts while retry timer pending, cancel the timer to
          prevent memory leaks.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Adaptive Retry</h3>
        <p>
          Adjust backoff based on observed latency. Fast network → shorter
          backoff. Slow network → longer backoff.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">User Communication</h3>
        <p>
          Inform user that request is retrying. Show retry count or attempt
          number.
        </p>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Adaptive Backoff & System State
        </h3>
        <p>
          Monitor network quality (RTT) and backend health (error rates). Adjust
          backoff dynamically. Stable network → shorter backoff. Backend
          returning 5xx → increase exponentially. More sophisticated than fixed
          exponential.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Bulkhead Isolation & Resource Limits
        </h3>
        <p>
          Retries can overwhelm backend. Implement bulkheads: separate resource
          pools by priority. Auth requests get 100 slots; analytics gets 10. One
          slow endpoint doesn't starve critical paths. Essential at 1M user
          scale.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Retry Budget & Rate Limiting
        </h3>
        <p>
          Limit total retries per time window (e.g., 100 retries/min). Prevents
          cascading failures where retry storms overwhelm backend. When budget
          exhausted, fail immediately instead of retrying. Protects
          infrastructure.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Idempotency & Exactly-Once Semantics
        </h3>
        <p>
          Retries safe only if requests idempotent. POST creates resource each
          time → not idempotent. Use idempotency keys (server deduplicates).
          Critical for payments, orders, critical mutations.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Testing Retry Logic
        </h3>
        <p>
          Mock failures at different retry levels (fail attempt 1, succeed
          attempt 2). Test max retries exceeded. Test timeout during retry. Use
          fake timers to test backoff mathematically. Property-based testing
          finds retry edge cases.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Observability Metrics
        </h3>
        <p>
          Track: retry count by error type, success rate on first attempt,
          success rate after retries. If 80% first attempt, retry overhead low.
          If 20%, bad TTL or network issues. High retry rate (&gt;50%) indicates
          degradation. Alert.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cascade Prevention</h3>
        <p>
          Retries from 1M clients can cascade: A fails → retries → delays B → B
          fails → retries. Circuit breakers help. Also: randomized backoff +
          jitter spreads load temporally. Use bulkheads spatially.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Real-World Pitfalls
        </h3>
        <p>
          Common: retry storms from many clients simultaneously (no jitter).
          Another: retrying permanent errors (4xx). Another: retry without
          deduplication → duplicate effects. Another: unbounded retry causing
          latency explosion (user thinks app hung).
        </p>
      </section>

      <section>
        <h2>Backoff Strategies Visualization</h2>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/retry-mechanism-backoff.svg"
          alt="Retry mechanism exponential backoff strategies comparison diagram"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Latency vs Reliability
        </h3>
        <p>
          Retries improve reliability but increase latency (user waits longer
          for response).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Load on Backend</h3>
        <p>
          Retries add load to backend. Too aggressive retries overwhelm server.
          Jitter and backoff spread load.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Observability</h3>
        <p>
          Monitor retries to understand failure patterns. High retry rate
          indicates backend issues or network problems.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          Retry mechanisms are fundamental to resilient systems. For
          staff/principal engineers, critical aspects include adaptive backoff
          based on network/backend state, bulkhead isolation to prevent
          cascades, retry budgets to limit load, idempotency for safety, and
          comprehensive observability. Real-world systems face thundering herd
          problems, cascade failures, and must balance retrying transient
          failures without retrying permanent ones. Understanding these patterns
          prevents incidents at scale. Production systems require careful
          monitoring of retry rates and success percentages to detect
          degradation early. Jitter + exponential backoff remain gold standard,
          but modern systems add adaptive strategies and circuit breakers for
          sophistication.
        </p>
      </section>
    </ArticleLayout>
  );
}
