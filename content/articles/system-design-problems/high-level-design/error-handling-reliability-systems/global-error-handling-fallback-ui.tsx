"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-global-error-handling-fallback-ui",
  title: "Design a Global Error Handling & Fallback UI System",
  description:
    "Architecture for a production-grade global error handling system: React Error Boundaries with hierarchical scope, error classification (network / chunk-load / render / permission), stale-cache and skeleton fallbacks, Sentry enrichment with session replay and build SHA, stack-fingerprint deduplication, exponential backoff retry, chunk-load hard reload, localStorage draft recovery, and spike-based PagerDuty alerting.",
  category: "high-level-design",
  subcategory: "error-handling-reliability-systems",
  slug: "global-error-handling-fallback-ui",
  wordCount: 4800,
  readingTime: 27,
  lastUpdated: "2026-05-14",
  tags: ["hld", "error-handling", "error-boundary", "fallback-ui", "sentry", "reliability", "graceful-degradation"],
  relatedTopics: ["retry-failure-recovery-ux", "incident-debugging-dashboard"],
};

export default function GlobalErrorHandlingFallbackUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          Every production frontend encounters errors: API timeouts, JavaScript
          exceptions, failed dynamic imports, permission denials, and edge-case
          render crashes. The default browser behaviour—a white screen or an
          unhandled-rejection console warning—is unacceptable for production. A
          global error handling system must intercept every class of error, present
          a recoverable or informative UI, report the error with enough context for
          diagnosis, and restore the user&rsquo;s session where possible.
        </HighlightBlock>
        <p>Key questions to clarify before designing:</p>
        <ul>
          <li>
            <strong>Error scope:</strong> Component-level crashes vs. page-level vs.
            full-app failures each warrant different fallback UIs.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Error types:</strong> Network failures (retryable) vs. render
            errors (non-retryable) vs. chunk-load failures (recoverable with hard
            reload) vs. permission errors (non-recoverable without re-auth).
          </HighlightBlock>
          <li>
            <strong>User data recovery:</strong> Should unsaved form input survive
            a crash? How?
          </li>
          <li>
            <strong>Reporting volume:</strong> At what sampling rate do errors get
            sent to the reporting service? Full volume on errors, sampled on
            warnings?
          </li>
          <li>
            <strong>Alerting threshold:</strong> What error rate triggers an
            on-call page?
          </li>
        </ul>
        <HighlightBlock as="p" tier="important">
          For this design: multi-level React Error Boundaries for component / page /
          app scope; error classification into five types; stale-cache fallback for
          network errors, skeleton for transient, hard-error page for fatal; 100%
          error sampling to Sentry with enrichment; exponential backoff retry;
          localStorage draft save for form recovery; and rate-based PagerDuty
          alerting.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3>Functional</h3>
        <ul>
          <li>
            All JavaScript exceptions (synchronous and asynchronous) and React
            render errors are intercepted globally before reaching the user as a
            white screen.
          </li>
          <li>
            Errors are classified by type and scope; the appropriate fallback UI is
            selected and rendered in place of the failed component, page, or app.
          </li>
          <HighlightBlock as="li" tier="important">
            Users see actionable recovery options: retry button, reload page, return
            to home, contact support.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            Unsaved form state is preserved in localStorage before a crash so it
            can be restored after retry or reload.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            Every error is reported to the error tracking service with: stack trace,
            component tree, breadcrumbs, session replay URL, feature flags, and
            build SHA.
          </HighlightBlock>
          <li>
            A spike in error rate triggers an automated on-call alert within 60
            seconds.
          </li>
        </ul>
        <h3>Non-functional</h3>
        <ul>
          <HighlightBlock as="li" tier="important">
            <strong>Performance:</strong> Error boundary overhead is negligible
            (&lt;1 ms per render); the reporting SDK is async and non-blocking.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Reliability:</strong> The error handling system itself must
            never crash; fallback components must be statically imported (no dynamic
            imports that could chunk-load-fail).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Privacy:</strong> PII must be scrubbed from error reports before
            transmission; session replays must exclude password fields and sensitive
            inputs.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Design</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/error-handling-reliability-systems/global-error-handling-fallback-ui.svg"
          alt="Global Error Handling and Fallback UI system sequence diagram"
          caption="Catch → classify → select fallback → report with enrichment → alert on spike → retry with backoff"
        />
        <p>The system has four stages:</p>
        <ol>
          <li>
            <strong>Catch:</strong> React Error Boundaries intercept render errors
            per component subtree; <code>window.onerror</code> and{" "}
            <code>window.onunhandledrejection</code> catch everything else.
          </li>
          <li>
            <strong>Classify &amp; fallback:</strong> An error classifier maps each
            error to a type and scope, selects the fallback strategy, and renders
            the appropriate recovery UI.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Report:</strong> The error is enriched and sent asynchronously
            to Sentry / LogRocket with deduplication by stack fingerprint.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Alert &amp; recover:</strong> The reporting service fires alerts
            on rate spikes; the client retries with exponential backoff or queues
            for offline replay.
          </HighlightBlock>
        </ol>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3>Error Boundary Hierarchy</h3>
        <p>
          React&rsquo;s <code>componentDidCatch</code> lifecycle method is the only
          mechanism that can catch render-phase errors in React component trees.
          It does not catch:
        </p>
        <ul>
          <li>Errors in event handlers (use try/catch or <code>window.onerror</code>).</li>
          <li>Errors in async code (use <code>onunhandledrejection</code>).</li>
          <li>Errors in server components (handled server-side).</li>
        </ul>
        <p>
          The boundary hierarchy should mirror the UI structure:
        </p>
        <ul>
          <li>
            <strong>App-level boundary:</strong> Wraps the entire application tree.
            Catches fatal errors that nothing else caught. Renders a full-page error
            screen with a &ldquo;Reload&rdquo; CTA.
          </li>
          <li>
            <strong>Page-level boundary:</strong> Wraps each route&rsquo;s content area.
            Catches route-specific render failures while leaving the navigation
            header and sidebar intact (the user can navigate away).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Widget-level boundary:</strong> Wraps high-risk widgets (charts,
            data tables, third-party embeds). A failing chart replaces itself with a
            skeleton or a &ldquo;Could not load chart — retry&rdquo; inline message, leaving
            the rest of the page functional.
          </HighlightBlock>
        </ul>
        <p>
          Each boundary accepts a <code>fallback</code> prop (a render function
          receiving the error and a reset function) and a <code>scope</code> prop
          (<code>app | page | widget</code>) used by the reporter to classify
          severity.
        </p>

        <h3>Global Handler Registration</h3>
        <p>
          Non-render errors are caught by two global handlers registered at app
          bootstrap:
        </p>
        <ul>
          <li>
            <code>window.addEventListener(&apos;error&apos;, handler)</code> — catches
            synchronous throws and failed resource loads (images, scripts).
            Distinguishes script errors from resource errors via{" "}
            <code>event.target instanceof Element</code>.
          </li>
          <li>
            <code>window.addEventListener(&apos;unhandledrejection&apos;, handler)</code> —
            catches unhandled Promise rejections from API calls, async/await
            chains, and dynamic imports.
          </li>
        </ul>
        <p>
          Both handlers call the same error classification pipeline, ensuring
          consistent treatment regardless of how the error originated.
        </p>

        <h3>Error Classification</h3>
        <p>
          The classifier assigns each error to one of five types based on the error
          message, status code (if available), and stack origin:
        </p>
        <ul>
          <HighlightBlock as="li" tier="important">
            <strong>Network error</strong> — <code>TypeError: Failed to fetch</code>,
            HTTP 5xx, HTTP 408/429. Strategy: serve stale cache if available, show
            &ldquo;Connection issue — using saved data&rdquo; banner, retry automatically.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Chunk-load error</strong> — dynamic <code>import()</code>
            failure, typically after a new deployment invalidates the chunk hash.
            Strategy: hard-reload once (<code>location.reload(true)</code>); if
            reload fails, show &ldquo;Please refresh to load the latest version&rdquo;.
          </HighlightBlock>
          <li>
            <strong>Render error</strong> — JavaScript exception inside a React
            component. Strategy: replace the failed subtree with the nearest boundary&rsquo;s
            fallback; log the full component tree from{" "}
            <code>componentInfo.componentStack</code>.
          </li>
          <li>
            <strong>Permission error</strong> — HTTP 401 / 403. Strategy: for 401,
            redirect to login preserving the current URL as the{" "}
            <code>returnTo</code> param; for 403, show an inline &ldquo;You don&rsquo;t have
            access&rdquo; message without removing the surrounding page.
          </li>
          <li>
            <strong>Unknown error</strong> — anything that does not match the above.
            Strategy: page-level error boundary fallback with &ldquo;Something went wrong&rdquo;
            and a request ID for support.
          </li>
        </ul>

        <h3>Fallback UI Design</h3>
        <p>
          Fallback UIs are statically imported components that have zero external
          dependencies (no API calls, no dynamic imports, no context that could
          itself be broken):
        </p>
        <ul>
          <li>
            <strong>Skeleton fallback:</strong> Used for transient widget errors and
            network retries in progress. Shows the same layout as the content area
            with animated shimmer, reducing perceived disruption.
          </li>
          <li>
            <strong>Inline error chip:</strong> Used for widget-scope errors after
            retries are exhausted. A compact error message with a manual &ldquo;Retry&rdquo;
            button. Preserves the rest of the page layout.
          </li>
          <li>
            <strong>Page error card:</strong> Used for page-scope render errors.
            Centered card with error title, description, request ID (for support
            lookup), and three action buttons: &ldquo;Try Again&rdquo;, &ldquo;Go Home&rdquo;,
            &ldquo;Report Issue&rdquo;.
          </li>
          <li>
            <strong>Full-screen error page:</strong> Used for app-scope fatal errors.
            Branded error page with a single &ldquo;Reload Application&rdquo; CTA. Includes
            a countdown timer that auto-reloads after 10 seconds (cancellable).
          </li>
        </ul>
        <HighlightBlock as="p" tier="important">
          User-facing error messages never expose stack traces, internal service
          names, or database identifiers. They provide a request ID (generated
          server-side) that support agents can look up internally.
        </HighlightBlock>

        <h3>Draft State Preservation</h3>
        <p>
          Before rendering a fallback, the error handler checks if the failing
          component subtree contains a registered draft store. Draft stores are
          plain objects keyed by a form ID, persisted to localStorage on every
          change via a debounced effect. On recovery (successful retry or reload),
          the form component reads from localStorage and pre-fills its state.
        </p>
        <p>
          Draft registration is opt-in: components call{" "}
          <code>useDraftStore(formId)</code>, which returns a{" "}
          <code>[value, setValue]</code> pair that transparently persists to
          localStorage. The draft is cleared on successful form submission to avoid
          stale pre-fills.
        </p>

        <h3>Error Enrichment and Reporting</h3>
        <p>
          Every caught error is enriched before sending to the reporting service:
        </p>
        <ul>
          <HighlightBlock as="li" tier="important">
            <strong>Session replay URL:</strong> If LogRocket or FullStory is
            active, the SDK provides a URL to the session replay timestamped at the
            moment of the error.
          </HighlightBlock>
          <li>
            <strong>Breadcrumbs:</strong> The last 50 UI events (clicks, navigations,
            API calls) recorded by the SDK since page load, providing a
            before-the-crash trail.
          </li>
          <li>
            <strong>Feature flags:</strong> The current flag evaluation snapshot from
            the feature flag SDK, enabling correlation between flag rollouts and
            error spikes.
          </li>
          <li>
            <strong>Build SHA:</strong> Injected at build time via an environment
            variable. Enables instant identification of which deployment introduced
            the error.
          </li>
          <li>
            <strong>Component stack:</strong> React&rsquo;s{" "}
            <code>componentInfo.componentStack</code> from{" "}
            <code>componentDidCatch</code>, showing the exact component path that
            crashed.
          </li>
        </ul>
        <p>
          Sampling policy: 100% of errors (severity &gt;= error) are sent; 10% of
          warnings are sampled. This balances completeness for real issues against
          reporting volume from noisy third-party libraries.
        </p>

        <h3>Stack Fingerprint Deduplication</h3>
        <HighlightBlock as="p" tier="important">
          The reporting service groups errors by a fingerprint derived from: the
          error message pattern (with dynamic values stripped), the top 3 stack
          frames (file + line), and the error type. This ensures that thousands of
          identical errors from the same bug are grouped into a single issue rather
          than flooding the issue list. Fingerprinting logic:
        </HighlightBlock>
        <ol>
          <li>
            Strip variable content from the message:{" "}
            <code>&quot;User 12345 not found&quot;</code> →{" "}
            <code>&quot;User [id] not found&quot;</code>.
          </li>
          <li>
            Normalise stack frames: remove query strings from file URLs (chunk
            hashes change per deploy).
          </li>
          <li>
            Hash the normalised string to produce a stable 64-bit fingerprint.
          </li>
        </ol>

        <h3>Auto-Retry with Exponential Backoff</h3>
        <p>
          For retryable error types (network, transient 5xx), the retry manager
          schedules attempts using truncated exponential backoff with full jitter:
        </p>
        <ul>
          <li>Attempt 1: wait <code>random(0, 1000) ms</code></li>
          <li>Attempt 2: wait <code>random(0, 2000) ms</code></li>
          <li>Attempt 3: wait <code>random(0, 4000) ms</code></li>
          <HighlightBlock as="li" tier="important">
            After 3 failed attempts: surface manual &ldquo;Retry&rdquo; button; stop
            auto-retrying to avoid hammering a degraded service.
          </HighlightBlock>
        </ul>
        <p>
          Full jitter (random between 0 and the cap) is preferable to additive
          jitter because it spreads retry storms across the full window, preventing
          thundering herd when many clients fail simultaneously.
        </p>

        <h3>Rate-Based Alerting</h3>
        <p>
          The error reporting service aggregates error events by 1-minute windows.
          Alert thresholds:
        </p>
        <ul>
          <li>
            <strong>Warning:</strong> Error rate &gt; 0.5% of active sessions in a
            1-minute window → Slack notification with error group link.
          </li>
          <li>
            <strong>Critical:</strong> Error rate &gt; 2% of active sessions, or any
            single error group with &gt;100 unique users affected → PagerDuty page
            with session count, affected route, and build SHA.
          </li>
        </ul>
        <p>
          The 2% threshold is deliberately higher than the 0.5% warning to avoid
          alert fatigue from background noise. Thresholds are configurable per
          project because a 2% error rate is critical for a payments flow but
          acceptable noise for a non-critical analytics widget.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Alternatives</h2>
        <h3>Single Global Error Handler vs. Layered Boundaries</h3>
        <HighlightBlock as="p" tier="important">
          A single <code>window.onerror</code> handler is the simplest
          implementation but catches errors only after they have already crashed the
          component tree—the white screen has already appeared. Layered Error
          Boundaries intercept at the component level, keeping the rest of the app
          functional and reducing the disruption radius. The trade-off: each
          boundary requires a fallback component and is more verbose to set up.
          For production apps the layered approach is mandatory.
        </HighlightBlock>

        <h3>Stale Cache vs. Empty State for Network Errors</h3>
        <HighlightBlock as="p" tier="important">
          Serving stale cache data during a network error maintains the appearance
          of functionality but may show outdated information. The alternative—an
          explicit empty/skeleton state with &ldquo;Could not load data&rdquo;—is more
          honest but more disruptive. The correct choice depends on the data&rsquo;s
          staleness tolerance: financial balances must never be served stale;
          news feeds or product catalogues can tolerate minutes of staleness.
        </HighlightBlock>

        <h3>Client-Side vs. Server-Side Error Pages</h3>
        <p>
          Server-rendered error pages (Next.js <code>error.tsx</code>, custom 500
          page) are displayed for SSR failures before the client JS bundle loads.
          Client-side Error Boundaries handle post-hydration runtime errors. A
          production app needs both: server error pages for SSR crashes, and client
          boundaries for runtime failures. Neglecting server error pages means SSR
          failures produce the default hosting platform&rsquo;s error page, which
          leaks infrastructure details.
        </p>

        <h3>Sentry vs. Custom Error Pipeline</h3>
        <HighlightBlock as="p" tier="crucial">
          Sentry provides fingerprinting, session replay integration, release
          tracking, and alerting out of the box. Building an equivalent custom
          pipeline requires: a collection endpoint, a storage backend, a
          fingerprinting algorithm, a grouping UI, and alert routing—typically
          6–12 months of engineering for a small team. For most organisations Sentry
          (or a competitor like Datadog RUM / Rollbar) is the correct choice. The
          only justification for a custom pipeline is regulatory requirements
          prohibiting third-party data processors.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">
          A global error handling system is the reliability foundation of any
          production frontend. The key design decisions are: layered Error
          Boundaries scoped to app / page / widget to minimise disruption radius;
          error classification to drive appropriate fallback strategies (stale
          cache for network, hard-reload for chunk-load, recovery page for render);
          async enriched reporting with session replay, feature flags, and build SHA
          for diagnosis; exponential backoff with full jitter for retries; and
          localStorage draft recovery to avoid losing user work. At staff level,
          the insight is that the error handling system must itself be hardened
          against failure—fallback components must have zero dynamic dependencies,
          the reporting SDK must be fully async, and the boundary hierarchy must
          be tested with intentional fault injection in staging.
        </HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
