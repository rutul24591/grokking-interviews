"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-error-handling-architecture",
  title: "Error Handling Architecture",
  description:
    "Production-grade frontend error handling covering error taxonomy, React Error Boundaries with granular placement, API error handling and retry strategy, idempotency, Sentry integration with PII scrubbing, and graceful degradation patterns.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "error-handling-architecture",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  tags: ["error-handling", "error-boundary", "sentry", "retry", "resilience", "lld"],
};

export default function ErrorHandlingArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        Every production application encounters errors. The difference between a well-engineered application and a
        fragile one is not whether errors occur — it is how thoughtfully they are classified, handled, recovered from,
        and reported. Staff-level interviews test whether you understand error taxonomy, know the React Error Boundary
        limitations, can design a retry strategy that won't cause duplicate mutations, and can integrate error monitoring
        without leaking PII.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/error-handling-architecture.svg"
        alt="Error handling architecture diagram"
        caption="Error taxonomy, React Error Boundaries, API retry strategy, and observability with Sentry"
      />

      <h2>Error Taxonomy</h2>
      <p>
        The first question when encountering an error is: what type is this? Different types require different responses.
        Getting this wrong — retrying a 400, showing a raw error to the user, silently ignoring a critical failure —
        is the mark of a brittle system.
      </p>

      <h3>Network Errors</h3>
      <p>
        Network errors include: device is offline (<code>navigator.onLine === false</code>), DNS resolution failure,
        TCP connection refused, TLS handshake failure, and request timeout. The unifying characteristic: the request
        never reached the server (or the server's response never reached the client).
      </p>
      <p>
        Response strategy: these are retry-eligible. The underlying cause is transient — network conditions change,
        devices reconnect. Retry with exponential backoff. Show a connectivity indicator if the user is offline.
      </p>

      <h3>Server Errors (5xx)</h3>
      <p>
        The request reached the server but the server failed to process it. Types:
      </p>
      <ul>
        <li><strong>500 Internal Server Error:</strong> Bug in the server code. Retry-eligible (the deployment
        may fix it), but with a backoff.</li>
        <li><strong>502 Bad Gateway / 503 Service Unavailable:</strong> The server or upstream dependency is
        down. Retry with backoff. The server may include a <code>Retry-After</code> header.</li>
        <li><strong>504 Gateway Timeout:</strong> The request timed out at the gateway. Retry-eligible, but
        for mutating operations, check idempotency first.</li>
        <li><strong>429 Too Many Requests:</strong> The client has been rate limited. Respect the
        <code>Retry-After</code> header — do not retry before that time.</li>
      </ul>

      <h3>Client Errors (4xx)</h3>
      <p>
        The client sent an invalid request. These are generally not retry-eligible:
      </p>
      <ul>
        <li><strong>400 Bad Request:</strong> The request body or parameters are invalid. Show a validation error.
        Retrying the same request will get the same result.</li>
        <li><strong>401 Unauthorized:</strong> The access token is missing or expired. Attempt a token refresh, then
        retry the original request. If refresh fails, redirect to login.</li>
        <li><strong>403 Forbidden:</strong> The user is authenticated but lacks permission. Show a permission-denied
        message. Retrying won't help — this is a business rule, not a transient error.</li>
        <li><strong>404 Not Found:</strong> The resource doesn't exist. Show an empty state, not an error. "No results
        found" is a valid response, not a failure.</li>
        <li><strong>409 Conflict:</strong> Optimistic concurrency violation (e.g., editing a stale version). Show
        a conflict message with the option to merge or override.</li>
      </ul>

      <h3>Business Errors</h3>
      <p>
        Business errors are domain-level violations returned in the response body with a 200 HTTP status code. The
        HTTP layer succeeded; the business operation failed. Examples: "payment declined", "coupon code expired",
        "username already taken". These should be returned as structured error objects in the response body:
      </p>
      <p>
        The frontend reads the error code and maps it to a user-facing message. Business errors are never retried
        automatically — they require user action.
      </p>

      <h3>Render Errors</h3>
      <p>
        Errors thrown during React rendering (in render functions, lifecycle methods, or hooks) cause the component
        tree to unmount unless caught by an Error Boundary. These are typically application bugs — null reference
        errors, type errors from unexpected data shapes, assertion failures.
      </p>

      <HighlightBlock as="p" tier="crucial">
        Classify every error before deciding how to handle it. The same HTTP fetch failure can be a network error
        (should retry) or a 403 (should never retry and should show a permission message). Never apply the same
        handling to all errors.
      </HighlightBlock>

      <h2>React Error Boundaries</h2>
      <p>
        Error Boundaries are React class components that implement <code>componentDidCatch</code> and
        <code>getDerivedStateFromError</code>. They catch errors thrown in the component subtree during rendering,
        lifecycle methods, and constructors — but not in event handlers or asynchronous code.
      </p>

      <h3>Placement Strategy</h3>
      <p>
        The most common mistake: a single Error Boundary at the application root. When any component throws, the
        entire application is replaced by the fallback UI. This is the worst possible user experience for errors
        in non-critical parts of the page.
      </p>
      <p>
        The correct approach: granular Error Boundaries around each independent section of the UI. If the
        recommendations widget throws, the sidebar should show a fallback; the rest of the page should continue
        to function normally.
      </p>
      <p>
        Boundaries to consider:
      </p>
      <ul>
        <li><strong>Page-level boundary:</strong> Catches catastrophic failures in page components. Shows a
        "Something went wrong" page with a reload option.</li>
        <li><strong>Widget/panel boundary:</strong> Wraps each independent section (sidebar, feed, chart, table).
        Shows a contained error state within the section.</li>
        <li><strong>Third-party library boundary:</strong> Wrap any third-party component that may throw (rich
        text editors, chart libraries, maps). Their errors should not cascade to the rest of the application.</li>
      </ul>

      <h3>Error Boundary Implementation</h3>
      <p>
        The <code>getDerivedStateFromError</code> static method is called during rendering when a descendant throws.
        It receives the error and returns a new state. This is where you set the flag that switches the component
        to render the fallback UI.
      </p>
      <p>
        The <code>componentDidCatch</code> method is called after the error has been caught, with the error and
        a component stack trace in <code>errorInfo</code>. This is where you report to Sentry and log to your
        monitoring system. It runs after rendering, not during — so you can call side effects here.
      </p>

      <h3>Reset and Recovery</h3>
      <p>
        An Error Boundary can be reset — cleared of its error state — to give the user a chance to retry. The
        <code>react-error-boundary</code> library exposes a <code>resetKeys</code> prop: when the value of any
        key changes, the boundary resets automatically. Use this with a retry counter or a route key:
      </p>
      <ul>
        <li>User clicks "Retry" → increment a counter → pass as <code>resetKeys={'{'}[retryCount]{'}'}</code>
        → boundary resets and re-renders the subtree.</li>
        <li>User navigates to another route and back → the route key changes → boundary resets automatically.</li>
      </ul>

      <h3>What Error Boundaries Do Not Catch</h3>
      <p>
        This is a critical distinction that interviewers test:
      </p>
      <ul>
        <li><strong>Event handlers:</strong> Errors in onClick, onChange, onSubmit handlers. Use try/catch inside
        the handler and set error state manually.</li>
        <li><strong>Asynchronous code:</strong> Errors in <code>setTimeout</code>, <code>Promise.catch</code>,
        and async/await. These don't propagate through the React call stack. Use try/catch in async functions and
        set error state.</li>
        <li><strong>Server Components (Next.js):</strong> In App Router, use <code>error.tsx</code> segments —
        a different mechanism from client-side Error Boundaries.</li>
        <li><strong>The Error Boundary itself:</strong> An error thrown in an Error Boundary's render method
        propagates to the parent Error Boundary.</li>
      </ul>

      <HighlightBlock as="p" tier="important">
        Always add try/catch in async event handlers. Error Boundaries do not help for: button click throws in an
        async function, useEffect throws asynchronously, Promise rejects without a catch. Handle these manually
        by catching and setting error state in the component.
      </HighlightBlock>

      <h2>API Error Handling</h2>

      <h3>Centralized Error Interceptor</h3>
      <p>
        Instead of handling 401s, network errors, and 500s in every API call, centralize the logic in an
        interceptor (Axios request/response interceptors, or a fetch wrapper):
      </p>
      <ul>
        <li><strong>401 handler:</strong> Attempt a token refresh. Queue all in-flight requests while the refresh
        is in progress (a boolean flag prevents multiple concurrent refreshes). After a successful refresh, replay
        all queued requests with the new token. If refresh fails, redirect to login.</li>
        <li><strong>5xx handler:</strong> Log to Sentry. Decide whether to surface the error to the component
        (for blocking operations) or silently retry (for background operations).</li>
        <li><strong>Network error handler:</strong> Check <code>navigator.onLine</code>. If offline, enqueue for
        retry when back online. If online but connection failed, treat as a transient error and retry.</li>
      </ul>

      <h3>Retry with Exponential Backoff</h3>
      <p>
        Retry-eligible errors: network errors, 429, 502, 503, 504. Configuration:
      </p>
      <ul>
        <li><strong>Max retries:</strong> 3 for most requests; 0 for time-sensitive UI interactions.</li>
        <li><strong>Base delay:</strong> 1 second. Doubles each retry: 1s, 2s, 4s.</li>
        <li><strong>Jitter:</strong> Add ±20% random jitter to prevent thundering herd.</li>
        <li><strong>Total timeout:</strong> Cap total retry time at a budget (e.g., 30 seconds). Even with
        backoff, don't retry indefinitely.</li>
        <li><strong>429 handling:</strong> Use the Retry-After header value as the delay, not the backoff formula.</li>
      </ul>

      <h3>Idempotency for Mutating Requests</h3>
      <p>
        Retrying a POST request that creates a resource can create duplicates. The solution: idempotency keys.
      </p>
      <p>
        Before sending a POST request, generate a UUID. Include it as an <code>Idempotency-Key</code> header.
        The server stores the key with the result of the first successful operation. If it receives a duplicate
        request with the same key (within a TTL, typically 24 hours), it returns the stored result without
        re-executing the operation.
      </p>
      <p>
        This is essential for payment mutations, order creation, and any operation where duplicate execution has
        side effects. The client persists the idempotency key locally (memory is sufficient for session-scoped
        operations) so retries always use the same key.
      </p>

      <h2>Error Monitoring with Sentry</h2>

      <h3>Initialization</h3>
      <p>
        Initialize Sentry in the application entry point before any application code runs. Critical configuration:
      </p>
      <ul>
        <li><strong>dsn:</strong> Project-specific endpoint for sending events.</li>
        <li><strong>environment:</strong> "production", "staging", "development". Filter noise from non-production
        environments.</li>
        <li><strong>release:</strong> The deployment version (git commit SHA or semantic version). Sentry uses
        this to correlate errors with releases and to resolve source maps.</li>
        <li><strong>tracesSampleRate:</strong> 0.1 in production (sample 10% of transactions for performance
        monitoring). Error capture is always 100% — sampling only applies to performance tracing.</li>
        <li><strong>beforeSend:</strong> A hook that fires before every event is sent. Use it to scrub PII.</li>
      </ul>

      <h3>PII Scrubbing</h3>
      <p>
        Sentry captures request/response data, user context, local variables, and breadcrumbs — all of which may
        contain Personally Identifiable Information. GDPR and CCPA require protecting this data.
      </p>
      <p>
        The <code>beforeSend</code> hook receives the event before it's transmitted. Scrub sensitive fields:
        remove or mask email addresses, phone numbers, payment card data, passwords, and any custom fields that
        contain user-identifying information. Replace with placeholder strings like "[Filtered]".
      </p>
      <p>
        Also configure Sentry's built-in data scrubbing: <code>denyUrls</code> (don't send events from
        browser extensions or third-party scripts), <code>ignoreErrors</code> (suppress known noise like
        "ResizeObserver loop limit exceeded").
      </p>

      <h3>Source Maps</h3>
      <p>
        Production JavaScript is minified — stack traces show minified code that is unreadable. Source maps map
        minified positions back to original TypeScript/JSX source. Upload source maps to Sentry during the CI/CD
        pipeline using the Sentry CLI or webpack plugin.
      </p>
      <p>
        Never serve source maps publicly — they expose the original source code. Upload to Sentry's private store
        and set the web server to return 404 for <code>*.map</code> requests from public clients. The source maps
        are only used by Sentry's internal processing.
      </p>

      <h3>Breadcrumbs</h3>
      <p>
        Sentry automatically captures breadcrumbs: XHR/fetch calls, console.log calls, browser navigation events,
        and UI click events. These create a timeline of what happened before the error, making debugging dramatically
        faster.
      </p>
      <p>
        Add custom breadcrumbs for important application events: user opened a dialog, reached checkout step 3,
        initiated a payment. These domain-specific breadcrumbs provide context that generic browser events lack.
      </p>

      <h3>Error Grouping and Alerting</h3>
      <p>
        Sentry groups similar errors into "issues" using fingerprinting — by default, the error type and stack trace.
        For errors where the stack trace varies (e.g., a generic "Network Error" thrown from many different
        call sites), customize the fingerprint to group meaningfully.
      </p>
      <p>
        Configure alerts for: new issues (notify immediately), issue regression (a previously resolved issue
        reappears after a deploy), and error rate spike (more than 2× baseline error rate for 5 consecutive minutes).
        Alert to Slack and PagerDuty as appropriate by severity.
      </p>

      <h2>Graceful Degradation Patterns</h2>

      <h3>Partial Page Failure</h3>
      <p>
        A dashboard with five widgets — analytics, recent orders, notifications, recommendations, and account summary
        — should degrade gracefully when one widget's data fails to load. Each widget is wrapped in its own Error
        Boundary and its own Suspense boundary. If recommendations fail to load:
      </p>
      <ul>
        <li>The recommendations widget shows a skeleton or a "Could not load recommendations" message.</li>
        <li>The rest of the dashboard renders normally with real data.</li>
        <li>The error is logged to Sentry with context (which widget, which user, the error details).</li>
        <li>A "Retry" button in the widget allows the user to re-fetch recommendations without a full page reload.</li>
      </ul>

      <h3>Stale Data Fallback</h3>
      <p>
        When a refetch fails, show the previously loaded data rather than an error state. This is the
        stale-while-revalidate pattern: the user can continue working with slightly outdated data rather than
        seeing an error. React Query implements this — on refetch failure, the cache retains the last successful
        data and the <code>isError</code> flag is set (but the data is still available).
      </p>
      <p>
        Show a subtle indicator: "Last updated 3 minutes ago — could not refresh." This communicates the
        data freshness without blocking the user.
      </p>

      <h3>Feature-Level Degradation</h3>
      <p>
        Some features have an obvious fallback if they fail. A rich text editor that fails to load can degrade
        to a plain textarea. A map widget that fails to load can degrade to an address text field. A real-time
        chat that loses its WebSocket can degrade to a polling-based chat with a slight latency increase.
      </p>
      <p>
        Design features with explicit degradation modes. When the enhanced feature fails, activate the degraded
        mode programmatically. The user experiences reduced functionality, not a broken page.
      </p>

      <h2>User-Facing Error Messages</h2>
      <p>
        The error message the user sees has as much impact as the technical error handling. Guidelines:
      </p>
      <ul>
        <li>
          <strong>Never show technical error messages to users:</strong> "TypeError: Cannot read properties of undefined"
          or stack traces are meaningless and alarming to non-technical users. Always show a human-readable message.
        </li>
        <li>
          <strong>Provide an error reference ID:</strong> "Something went wrong. Reference: ERR-29X7K" lets users
          cite the ID when contacting support, and lets your team look up the exact error in Sentry immediately.
          The ID can be the Sentry event ID.
        </li>
        <li>
          <strong>Tell the user what to do:</strong> "Please try again", "Refresh the page", "Go to home" — always
          give an escape. Never leave the user with a dead end.
        </li>
        <li>
          <strong>Match message to severity:</strong> A failed autocomplete suggestion doesn't need a red error banner.
          A failed payment confirmation does. Use toast notifications for transient non-blocking errors; inline
          messages for form validation; full-page error states for catastrophic failures.
        </li>
      </ul>

      <h2>Interview Q&A</h2>

      <h3>Q: A user clicks "Submit Order" and the request fails with a 503. How do you handle it?</h3>
      <p>
        First: classify. 503 is a server unavailability error — retry-eligible. But this is a mutating operation
        (order creation). Before retrying, check: was an idempotency key sent with the request? If yes, retry safely
        — the server will return the same result if the first request actually succeeded. If no idempotency key was
        sent, do not retry automatically — a duplicate order could be created.
      </p>
      <p>
        Handling: with idempotency key — retry up to 3 times with exponential backoff. Show a "Processing..." state
        to the user. If all retries fail, show an error with "Your order may have been placed. Check your Orders page
        or try again." If retry succeeds, show confirmation.
      </p>
      <p>
        Without idempotency key (legacy API): do not retry automatically. Show "Something went wrong. Check your
        Orders page to see if your order was placed before trying again." This prevents duplicate orders at the cost
        of worse UX — the real fix is adding idempotency key support to the API.
      </p>

      <h3>Q: How do you handle an error in a useEffect that fetches data?</h3>
      <p>
        Errors in async functions inside useEffect do not propagate to Error Boundaries. The Error Boundary only
        catches errors thrown synchronously during rendering. Handle async errors explicitly:
      </p>
      <ul>
        <li>Wrap the async function body in try/catch.</li>
        <li>On catch, set an <code>error</code> state variable in the component.</li>
        <li>In the render, if <code>error</code> is set, render an error UI (inline message or throw the error
        to let an Error Boundary catch it via the <code>useErrorBoundary</code> hook from react-error-boundary).</li>
        <li>Report the error to Sentry from the catch block.</li>
      </ul>
      <p>
        The <code>useErrorBoundary</code> hook from react-error-boundary provides a <code>showBoundary(error)</code>
        function — call it from async error handlers to delegate the error to the nearest Error Boundary, keeping
        async errors and sync errors handled by the same mechanism.
      </p>

      <h3>Q: Sentry is capturing too many errors, making it hard to find real issues. How do you reduce noise?</h3>
      <p>
        Noise sources and fixes:
      </p>
      <ul>
        <li>
          <strong>Third-party script errors:</strong> Browser extensions, ad scripts, and CDN failures throw errors
          that land in your Sentry. Use <code>denyUrls</code> to filter errors from external scripts: any error
          whose stack trace originates from a URL not matching your domain is filtered out.
        </li>
        <li>
          <strong>Known benign errors:</strong> "ResizeObserver loop limit exceeded", "Non-Error promise rejection
          captured" — these are browser bugs or third-party issues. Add them to <code>ignoreErrors</code>.
        </li>
        <li>
          <strong>Network errors from offline users:</strong> Users going offline generate many "Failed to fetch"
          errors. Check <code>navigator.onLine</code> in <code>beforeSend</code> and filter out events generated
          while the user is offline.
        </li>
        <li>
          <strong>Rate limiting in development:</strong> Set <code>environment: "development"</code> and configure
          Sentry to only alert on production environment events. Or don't initialize Sentry at all in development.
        </li>
        <li>
          <strong>Group related errors:</strong> If 10 variants of the same underlying bug create 10 separate Sentry
          issues, customize fingerprinting to group them. One issue is easier to track and resolve than 10.
        </li>
      </ul>
    </ArticleLayout>
  );
}
