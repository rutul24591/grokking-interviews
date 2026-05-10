"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-global-api-error-handling",
  title: "Design a Global API Error Handling Layer",
  description:
    "Production-grade centralized error handling for API responses with classification, retry logic, user-friendly messages, and observability.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "global-api-error-handling",
  wordCount: 6800,
  readingTime: 40,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "error-handling",
    "api-errors",
    "user-messages",
    "observability",
    "retry-logic",
  ],
  relatedTopics: [
    "data-fetching-hook",
    "retry-mechanism",
    "global-error-handling-fallback-ui",
  ],
};

export default function GlobalAPIErrorHandlingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          API calls fail. Timeout (network slow), 401 Unauthorized (token expired), 400 Bad Request (invalid input), 500 Internal Server Error (server bug), rate limit (too many requests). Without centralized handling, each component writes error logic: "if 401, redirect to login; if 5xx retry; if 400 show error message..." Duplicate code, inconsistent UX. Better: centralize error handling. All API calls go through single HTTP client. Client intercepts responses, classifies errors, decides action. 401 → redirect to login globally. 5xx → show "server error, try again" globally. 400 → show field errors to user.
        </p>
        <p>
          Error classification: (1) Network errors (timeout, no connection)—transient, retry. (2) 4xx (validation, not found, auth)—permanent, don't retry, user fix needed. (3) 5xx (server error)—transient, retry. (4) Rate limit (429)—transient with backoff. (5) Specific (401 token expired, 403 forbidden)—special handling.
        </p>
        <p>
          Global handler coordinates: (1) Error classification. (2) Decide retry/fallback. (3) Display user-facing message (toast, modal, inline error). (4) Log to observability system (Sentry, DataDog). (5) Update app state (logout on 401, mark network offline on network error).
        </p>
        <p>
          <strong>Explicit assumptions:</strong> Central HTTP client available. Error responses consistent schema. User-facing messages needed. Logging/observability system available. Some errors need global state updates (logout on 401).
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Error Classification:</strong> Categorize errors by type (network,
            timeout, 4xx, 5xx, auth).
          </li>
          <li>
            <strong>Retry Decision:</strong> Determine if error is retryable.
          </li>
          <li>
            <strong>User Message:</strong> Generate user-friendly error message.
          </li>
          <li>
            <strong>Error Recovery:</strong> Suggest recovery actions (retry,
            re-login, contact support).
          </li>
          <li>
            <strong>Error Logging:</strong> Log errors for monitoring and debugging.
          </li>
          <li>
            <strong>Global Error Listener:</strong> Components can register listeners
            for global errors.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Consistency:</strong> All API errors handled uniformly.
          </li>
          <li>
            <strong>Transparency:</strong> Debugging information available for
            developers.
          </li>
          <li>
            <strong>Performance:</strong> Error handling does not slow down app.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Network error mid-redirect → unclear state, need to resync.</li>
          <li>Multiple errors from multiple requests → consolidate or show all?</li>
          <li>Same error repeated → show once vs repeatedly?</li>
          <li>User dismisses error → remember dismissal or show again on retry?</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          All API calls routed through central HTTP client with error interceptor.
          Interceptor classifies error, determines retry strategy, generates user
          message, and logs. For retryable errors, automatically retry with backoff.
          For non-retryable, emit error event. Components register listeners to show
          error UI. Global error boundary catches unhandled errors.
        </p>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Classification</h3>
        <p>
          Categorize errors to determine handling strategy.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Network Error:</strong> No connection, DNS failure. Retryable.
          </li>
          <li>
            <strong>Timeout:</strong> Request exceeds timeout. Retryable.
          </li>
          <li>
            <strong>4xx Client Error:</strong> 400 bad request, 404 not found, 409
            conflict. Non-retryable (except 429).
          </li>
          <li>
            <strong>429 Too Many Requests:</strong> Rate limited. Retryable with
            backoff.
          </li>
          <li>
            <strong>5xx Server Error:</strong> 500, 502, 503. Retryable.
          </li>
          <li>
            <strong>Auth Error:</strong> 401 unauthorized, 403 forbidden. Non-retryable.
            Redirect to login.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">User-Friendly Messages</h3>
        <p>
          Display messages appropriate to user, not technical errors.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Network Error:</strong> &quot;Check your internet connection&quot;.
          </li>
          <li>
            <strong>Timeout:</strong> &quot;Request took too long. Please try
            again.&quot;
          </li>
          <li>
            <strong>Bad Request:</strong> Server returns specific message (e.g.,
            &quot;Email already in use&quot;).
          </li>
          <li>
            <strong>Server Error:</strong> &quot;Something went wrong. Our team has
            been notified.&quot;
          </li>
          <li>
            <strong>Rate Limit:</strong> &quot;Too many requests. Please wait a
            moment.&quot;
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Logging</h3>
        <p>
          Log errors for monitoring and debugging.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>What to Log:</strong> Error type, status code, URL, request
            method, user ID, timestamp.
          </li>
          <li>
            <strong>Sensitive Data:</strong> Don't log request/response bodies if
            contain PII.
          </li>
          <li>
            <strong>Log Level:</strong> 5xx = error, 4xx = warning, network =
            warning.
          </li>
          <li>
            <strong>Destination:</strong> Send to error tracking service (Sentry,
            Rollbar).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Recovery Suggestions</h3>
        <p>
          Suggest actions user can take.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Retryable:</strong> &quot;Retry&quot; button. Automatically retry
            on reconnect.
          </li>
          <li>
            <strong>Auth:</strong> &quot;Log in again&quot; link. Redirect to login on
            401.
          </li>
          <li>
            <strong>Validation:</strong> Show validation errors inline on form.
          </li>
          <li>
            <strong>Server Error:</strong> &quot;Contact support&quot; link or email.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Interceptor Pattern</h3>
        <p>
          Use HTTP client interceptors to handle errors centrally.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Request Interceptor:</strong> Add auth token, headers.
          </li>
          <li>
            <strong>Response Interceptor:</strong> Check response status, handle
            errors.
          </li>
          <li>
            <strong>Error Interceptor:</strong> Catch thrown errors, transform,
            rethrow or retry.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Event System</h3>
        <p>
          Components can listen to global errors.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Register Listener:</strong> onError(listener) to register
            callback.
          </li>
          <li>
            <strong>Emit Error:</strong> When error occurs, call all listeners.
          </li>
          <li>
            <strong>Unregister:</strong> On unmount, remove listener.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Duplicate Error Deduplication</h3>
        <p>
          Avoid showing same error multiple times.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Deduplication Key:</strong> Hash error message + type.
          </li>
          <li>
            <strong>Window:</strong> Suppress duplicate within 5s window.
          </li>
          <li>
            <strong>Increment Count:</strong> Show &quot;Error occurred 3 times&quot;.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Offline Detection</h3>
        <p>
          Detect network offline state and handle specially.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Detection:</strong> Listen to navigator.onoffline event.
          </li>
          <li>
            <strong>Message:</strong> Show &quot;No internet connection&quot; banner.
          </li>
          <li>
            <strong>Queue Requests:</strong> Queue API calls while offline. Replay
            when online.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Axios vs Fetch</h3>
        <p>
          Axios has built-in interceptors. Fetch requires wrapping.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Boundary</h3>
        <p>
          React Error Boundary catches component errors. Global error handler catches
          API errors. Both needed.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Sentry Integration</h3>
        <p>
          Send errors to Sentry for monitoring. Sentry provides dashboards and
          alerting.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing</h3>
        <p>
          Mock HTTP errors. Verify error messages, retry logic, and logging.
        </p>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Circuit Breaker Pattern Integration</h3>
        <p>
          When error rate exceeds threshold (50% of requests failing), open circuit:
          stop retrying temporarily. Return cached/stale response. This prevents
          cascading failures. Pair with global error handler: detect high error
          rates, emit events to open circuit.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Chaos Engineering & Error Injection</h3>
        <p>
          Systematically inject errors (timeout, 5xx, network failure) into
          production to test resilience. Verify error handling responds correctly.
          Chaos tests catch assumptions (e.g., "we always retry on 5xx"—but what
          if service unavailable for 2 hours?).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Context & Breadcrumbs</h3>
        <p>
          Capture context: which component triggered error, user state, API path,
          query params. Add breadcrumbs: recent user actions before error. Send to
          error tracking service (Sentry). Helps debugging—not just "500 error"
          but full context.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">User Communication & Error Messaging</h3>
        <p>
          Show meaningful messages, not technical errors. "Check internet" vs
          "Failed to fetch user/1". Consider internationalization (error messages
          in user's language). Provide recovery actions (retry, reload, logout).
          Silent failures worst—always communicate.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Duplicate Error Suppression</h3>
        <p>
          Same error repeated in quick succession is usually same underlying
          problem. Show once, increment count ("Error occurred 3 times"). After
          N occurrences, auto-collect logs/context for investigation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Fallback Strategies & Degradation</h3>
        <p>
          When API fails, can app degrade gracefully? Show cached data, limited
          functionality, offline mode? Plan fallbacks per critical API. Design
          app to work with degraded service (not crash).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Error Paths</h3>
        <p>
          Test every error path: network timeout, 4xx, 5xx, parsing errors. Verify
          error messages displayed. Verify no silent failures. Mock HTTP to inject
          errors deterministically. Use property-based testing to generate error
          sequences.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Integration with Observability</h3>
        <p>
          Errors flow to Sentry/DataDog. Separate error dashboard by type, severity.
          Alert on error rate spikes. Correlate with infrastructure metrics (CPU,
          memory, disk) to root cause. Good observability is force multiplier for
          incident response.
        </p>
      </section>

      <section>
        <h2>Error Handling Architecture</h2>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/global-error-handling.svg"
          alt="Global error handling: classification, routing, and interceptor chain pattern diagram"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Automatic Retry vs User Control</h3>
        <p>
          Automatic retry improves UX but user loses control. Provide manual retry
          option too.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Message Specificity</h3>
        <p>
          Generic messages are user-friendly but hide debugging info. Balance
          specificity with usability.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Centralization vs Flexibility</h3>
        <p>
          Centralized handling simplifies code but limits per-error customization.
          Allow per-request override.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          A global API error handling layer is essential for reliability and user
          experience. For staff/principal engineers, critical aspects include circuit
          breaker integration to prevent cascades, chaos engineering to test
          resilience, comprehensive error context and breadcrumbs for debugging,
          and observability integration with error tracking services like Sentry.
          Real-world systems must handle duplicate error suppression, graceful
          degradation with fallback strategies, and differentiated user messages
          (not technical errors). Testing must cover all error paths exhaustively.
          At 1M users, error rate spikes indicate systemic issues—correlate with
          infrastructure metrics. Silent failures are worse than loud errors—always
          communicate. Understanding error propagation through layers (client →
          hook → cache → request handling) is essential. Production systems require
          incident response playbooks for common error scenarios.
        </p>
      </section>
    </ArticleLayout>
  );
}
