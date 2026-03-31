"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "global-error-handlers",
  title: "Global Error Handlers",
  description:
    "Comprehensive guide to implementing global error handling in frontend applications using window.onerror, unhandledrejection, and framework-specific error interceptors for robust error capture.",
  category: "frontend",
  subcategory: "error-handling-monitoring",
  slug: "global-error-handlers",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-31",
  tags: [
    "error-handling",
    "window.onerror",
    "unhandledrejection",
    "global-errors",
    "frontend-monitoring",
  ],
  relatedTopics: ["error-boundaries", "error-reporting", "logging-strategies"],
};

export default function GlobalErrorHandlersArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p>
          <strong>Global error handlers</strong> are the last line of defense in a frontend
          application&apos;s error management strategy. They are browser-level or framework-level
          hooks that intercept uncaught exceptions and unhandled promise rejections that have
          escaped all local error handling constructs such as <code>try-catch</code> blocks,{" "}
          <code>.catch()</code> chains, and component-level error boundaries. In production
          applications serving millions of users, these handlers are the difference between
          knowing about errors and being completely blind to entire categories of failures that
          users experience silently. The three primary browser APIs that form the foundation of
          global error capture are <code>window.onerror</code>,{" "}
          <code>window.addEventListener(&quot;error&quot;)</code>, and{" "}
          <code>window.addEventListener(&quot;unhandledrejection&quot;)</code>. Together, they
          cover synchronous runtime exceptions, resource loading failures, and asynchronous
          promise rejections respectively.
        </p>
        <p>
          The importance of global error handlers in production cannot be overstated. Research
          consistently shows that the vast majority of frontend errors go unreported by users.
          A user encountering a broken button, a failed API call that silently drops data, or a
          component that renders incorrectly is far more likely to abandon the application than
          to file a support ticket. Without global error capture, engineering teams operate with
          a dangerously incomplete picture of application health. The errors you hear about
          through support channels represent the tip of the iceberg; global handlers reveal the
          submerged mass beneath. At scale, companies like Google, Meta, and Netflix have found
          that systematic global error capture reduces mean time to detection (MTTD) by orders
          of magnitude compared to relying on user reports alone.
        </p>
        <p>
          A critical distinction exists between <strong>capturing</strong> errors and{" "}
          <strong>handling</strong> them gracefully. Global error handlers primarily serve the
          capture function: they intercept errors that have already escaped local handling and
          ensure they reach a monitoring system. They are not a substitute for thoughtful local
          error handling. A well-designed application handles expected failure modes close to
          where they occur (network failures near the fetch call, validation errors near the
          form, rendering errors near the component). Global handlers catch the unexpected:
          the null reference in a rarely-used code path, the third-party script that throws on
          an obscure browser version, the race condition that only manifests under specific
          timing. When a global handler fires, it signals that something slipped through the
          local error handling net, making these events valuable signals for identifying gaps
          in defensive coding practices.
        </p>
        <p>
          Global handlers complement local error handling by forming the outermost ring of a
          defense-in-depth strategy. The innermost layer consists of <code>try-catch</code>{" "}
          blocks around known risky operations. The middle layer consists of framework-specific
          constructs like React error boundaries. The outer layer is global handlers that catch
          everything else. Each layer serves a different purpose: local handlers enable
          graceful recovery, framework constructs enable graceful degradation of the UI, and
          global handlers ensure nothing escapes observation. In a system design interview,
          articulating this layered approach demonstrates sophisticated understanding of
          production reliability engineering.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          window.onerror vs addEventListener(&quot;error&quot;)
        </h3>
        <p>
          The <code>window.onerror</code> callback and{" "}
          <code>window.addEventListener(&quot;error&quot;, handler)</code> both intercept
          uncaught runtime exceptions, but they differ in meaningful ways that affect
          architectural decisions. The <code>window.onerror</code> handler receives five
          arguments directly: <code>message</code>, <code>source</code> (the script URL),{" "}
          <code>lineno</code>, <code>colno</code>, and <code>error</code> (the actual Error
          object). This decomposed signature makes it straightforward to extract structured
          data without additional parsing. In contrast,{" "}
          <code>addEventListener(&quot;error&quot;)</code> receives an{" "}
          <code>ErrorEvent</code> object with equivalent properties accessed via the event
          interface. The <code>addEventListener</code> approach is generally preferred in
          modern codebases because it supports multiple listeners (you can register several
          handlers without overwriting previous ones), integrates cleanly with the standard
          event model, and can capture resource loading errors when registered on the capture
          phase.
        </p>
        <p>
          A crucial behavioral difference involves resource loading errors. When an{" "}
          <code>&lt;img&gt;</code>, <code>&lt;script&gt;</code>, or{" "}
          <code>&lt;link&gt;</code> tag fails to load, the browser fires an{" "}
          <code>error</code> event on the element. This event does <strong>not</strong> bubble
          to the window and therefore does not trigger <code>window.onerror</code>. However,
          if you use{" "}
          <code>window.addEventListener(&quot;error&quot;, handler, true)</code> with the
          third argument set to <code>true</code> (capture phase), you can intercept these
          resource load failures. This is the only way to globally detect broken images,
          failed stylesheet loads, or script loading failures at the window level. For
          production monitoring, registering on the capture phase is essential for complete
          error visibility.
        </p>
        <p>
          Cross-origin script errors present a notorious challenge. When a script loaded from a
          different origin throws an error, browsers enforce a security policy that reduces the
          error information to a generic <code>&quot;Script error.&quot;</code> message with no
          filename, line number, or stack trace. This is a deliberate privacy measure to prevent
          a malicious page from extracting sensitive information from errors in third-party
          scripts. To receive full error details, two conditions must be met: the script tag
          must include the <code>crossorigin=&quot;anonymous&quot;</code> attribute, and the
          server hosting the script must respond with an{" "}
          <code>Access-Control-Allow-Origin</code> CORS header. Without both conditions
          satisfied, the global handler receives almost no actionable information.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Unhandled Promise Rejections
        </h3>
        <p>
          The <code>unhandledrejection</code> event fires when a Promise is rejected and no
          rejection handler is attached before the end of the current microtask queue turn.
          This event is critical because unhandled promise rejections are among the most common
          categories of silent failures in modern JavaScript applications. Prior to the
          introduction of this event, a rejected promise with no <code>.catch()</code> handler
          would simply vanish — the error would be swallowed entirely, leaving no trace in
          the console or any monitoring system. The event handler receives a{" "}
          <code>PromiseRejectionEvent</code> with a <code>reason</code> property containing
          the rejection value (which may or may not be an Error object) and a{" "}
          <code>promise</code> property referencing the rejected Promise.
        </p>
        <p>
          A subtle but important difference exists between browser and Node.js behavior. In
          browsers, an unhandled rejection logs a console warning but does not crash the page
          or halt execution. In Node.js (since version 15), unhandled rejections cause the
          process to exit with a non-zero code by default, treating them as fatal errors. This
          behavioral divergence means code that appears to work fine in the browser during
          development can crash a Node.js-based SSR server in production. Additionally, the
          browser provides a companion event called <code>rejectionhandled</code>, which fires
          when a previously unhandled rejection later gets a handler attached. This can occur
          with lazy error handling patterns and is useful for canceling false-positive reports.
        </p>
        <p>
          In modern <code>async/await</code> code, unhandled rejections commonly occur when an{" "}
          <code>async</code> function is called without <code>await</code> and without a{" "}
          <code>.catch()</code>. The calling code does not see the exception because it never
          awaits the returned promise. This pattern is especially treacherous in event handlers
          and lifecycle methods where the return value is discarded. A global{" "}
          <code>unhandledrejection</code> handler is the safety net that catches these
          overlooked failures.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Framework Error Interceptors
        </h3>
        <p>
          Modern frontend frameworks provide their own error interception mechanisms that sit
          between local <code>try-catch</code> and browser-level global handlers. React
          offers <strong>error boundaries</strong> — class components that implement{" "}
          <code>componentDidCatch</code> and <code>static getDerivedStateFromError</code>.
          These catch errors during rendering, in lifecycle methods, and in constructors of
          the component tree below them. However, error boundaries do <strong>not</strong>{" "}
          catch errors in event handlers, asynchronous code, or server-side rendering. This
          gap means global handlers remain necessary even in applications with comprehensive
          error boundary coverage. In Next.js, the App Router provides the{" "}
          <code>error.tsx</code> convention, which creates an error boundary automatically for
          each route segment, and a root <code>global-error.tsx</code> that wraps the entire
          application including the root layout.
        </p>
        <p>
          Vue.js uses <code>app.config.errorHandler</code> as a global hook that receives
          errors from component render functions, watchers, lifecycle hooks, and component
          event handlers. Unlike React&apos;s error boundaries, Vue&apos;s handler is
          configured once at the application level and catches a broader category of errors.
          Angular provides the <code>ErrorHandler</code> class, which can be overridden via
          dependency injection to create a custom global error handler. Angular&apos;s approach
          is particularly powerful because the DI system allows the error handler to access
          other application services (logging, analytics, user context) without tight coupling.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Cross-Origin Script Errors
        </h3>
        <p>
          The <code>&quot;Script error.&quot;</code> problem deserves dedicated attention
          because it is one of the most frustrating issues in production error monitoring. When
          your global error handler fires with just the message{" "}
          <code>&quot;Script error.&quot;</code> and null values for filename, line, and
          column, it means an error occurred in a script from a different origin, and the
          browser is withholding details for security reasons. This affects all third-party
          scripts: analytics libraries, ad networks, social media widgets, payment processors,
          and CDN-hosted dependencies. In a typical enterprise application, third-party scripts
          can account for 50-70% of all JavaScript loaded on the page, making this a
          significant blind spot.
        </p>
        <p>
          Resolving this requires coordination between the script host and the consuming page.
          The script tag must include <code>crossorigin=&quot;anonymous&quot;</code>, which
          instructs the browser to make a CORS request for the script. The hosting server must
          respond with <code>Access-Control-Allow-Origin: *</code> or a specific origin value.
          For scripts you control (hosted on your own CDN), this is straightforward
          configuration. For true third-party scripts where you cannot control the server
          headers, the error details remain inaccessible. In this case, a common strategy is
          to wrap third-party script invocations in local <code>try-catch</code> blocks at the
          integration boundary, capturing errors before they propagate to the global handler.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Error Serialization
        </h3>
        <p>
          Extracting useful information from error objects for transmission to a monitoring
          service is more complex than it appears. A standard <code>Error</code> object has{" "}
          <code>message</code>, <code>name</code>, and <code>stack</code> properties, but{" "}
          <code>stack</code> is not part of the ECMAScript specification and its format varies
          across browsers. Chrome, Firefox, and Safari produce different stack trace formats,
          requiring normalization for consistent analysis. Furthermore, JavaScript allows
          throwing any value — not just Error objects. You can throw strings, numbers, plain
          objects, or even <code>undefined</code>. A robust global handler must handle all
          these cases, extracting what information it can without assuming the caught value is
          an Error instance.
        </p>
        <p>
          Serialization also involves enriching the error with contextual metadata that is not
          part of the error itself: the current URL, user identifier, application version,
          browser and OS information, the state of relevant feature flags, and a session
          identifier for correlating multiple errors from the same user session. The{" "}
          <code>ErrorEvent</code> provides <code>filename</code>, <code>lineno</code>, and{" "}
          <code>colno</code> for synchronous errors, which in production correspond to
          positions in minified bundles. Meaningful analysis therefore requires source map
          integration in the monitoring service to map minified positions back to original
          source locations. Without source maps, a stack trace pointing to{" "}
          <code>main.a3f8b.js:1:48293</code> is nearly useless for debugging.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>
        <p>
          Global error handling is best understood as a layered architecture where each layer
          provides progressively broader coverage at the cost of decreasing context about the
          error&apos;s origin. The innermost layers have the most context (they know exactly
          which operation failed and can attempt recovery), while the outermost layers have
          the least context but ensure nothing escapes observation.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/error-handling-monitoring/global-error-handlers-diagram-1.svg"
          alt="Error capture hierarchy showing local try-catch, error boundaries, and global handlers as defense layers"
          caption="Figure 1: Defense-in-depth error capture hierarchy"
        />

        <p>
          The defense-in-depth hierarchy illustrated above shows how errors propagate outward
          through the layers. At the innermost level, a <code>try-catch</code> around a
          specific API call can retry the request, show a localized error message, or fall back
          to cached data. If the error escapes that layer (perhaps the catch block itself
          throws, or the error occurs outside any try-catch), it reaches the framework layer.
          A React error boundary at this level can replace the failed component subtree with a
          fallback UI, preventing the entire page from going blank. If the error occurs outside
          the component tree (in an event handler, a timer callback, or a standalone promise
          chain), it bypasses error boundaries entirely and reaches the global handler layer.
          Each layer should log the error to the monitoring system, but only the innermost
          layer that catches it should attempt user-facing recovery.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/error-handling-monitoring/global-error-handlers-diagram-2.svg"
          alt="Error event propagation showing synchronous errors vs promise rejections vs resource load failures"
          caption="Figure 2: Different error types and their capture mechanisms"
        />

        <p>
          The propagation paths for different error types diverge significantly, as shown
          above. Synchronous runtime errors (like accessing a property on{" "}
          <code>undefined</code>) propagate up the call stack, through any enclosing{" "}
          <code>try-catch</code> blocks, and ultimately to <code>window.onerror</code> or the
          window <code>error</code> event if uncaught. Promise rejections follow a completely
          separate path: they do not trigger <code>window.onerror</code> at all. Instead, they
          fire the <code>unhandledrejection</code> event. Resource loading failures fire an{" "}
          <code>error</code> event on the element that failed to load, which does not bubble
          and can only be intercepted by a capture-phase listener on window. Understanding
          these three distinct propagation paths is essential for designing a comprehensive
          error capture system, because missing any one of them creates a blind spot that can
          mask entire categories of production issues.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/error-handling-monitoring/global-error-handlers-diagram-3.svg"
          alt="Global error handler pipeline from capture through enrichment to reporting service"
          caption="Figure 3: Error processing pipeline from capture to reporting"
        />

        <p>
          Once an error is captured by a global handler, it enters a processing pipeline before
          being transmitted to the monitoring service. The first stage is{" "}
          <strong>normalization</strong>: converting the heterogeneous error formats (Error
          objects, strings, events, rejection reasons) into a consistent internal
          representation. The second stage is <strong>enrichment</strong>: attaching contextual
          metadata such as the current route, user identifier, application version, browser
          information, and any relevant application state. The third stage is{" "}
          <strong>deduplication</strong>: comparing the normalized error against a short-lived
          in-memory cache of recently reported errors to avoid flooding the monitoring service
          with identical reports when the same error fires in a tight loop. The fourth stage
          is <strong>rate limiting</strong>: enforcing a maximum number of error reports per
          time window to protect both the client (from performance degradation due to
          excessive network requests) and the server (from being overwhelmed by a single
          misbehaving client). Finally, the error is <strong>transmitted</strong> to the
          reporting service, typically via <code>navigator.sendBeacon</code> for reliability
          during page unload or a dedicated error reporting endpoint.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparisons
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs &amp; Comparisons</h2>
        <p>
          Each global error capture mechanism has distinct strengths and limitations. The
          following comparison helps architects choose the right combination for their
          monitoring strategy.
        </p>

        <div className="my-6 overflow-x-auto rounded-lg border border-theme">
          <table className="min-w-full text-sm">
            <thead className="bg-panel-soft">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Dimension</th>
                <th className="px-4 py-3 text-left font-semibold">window.onerror</th>
                <th className="px-4 py-3 text-left font-semibold">
                  addEventListener(&quot;error&quot;)
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  addEventListener(&quot;unhandledrejection&quot;)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="px-4 py-3 font-medium">Error Types Caught</td>
                <td className="px-4 py-3">
                  Synchronous runtime exceptions only
                </td>
                <td className="px-4 py-3">
                  Synchronous exceptions + resource load failures (capture phase)
                </td>
                <td className="px-4 py-3">
                  Promise rejections without .catch() handlers
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Information Available</td>
                <td className="px-4 py-3">
                  message, source, lineno, colno, error object (5 params)
                </td>
                <td className="px-4 py-3">
                  ErrorEvent object with message, filename, lineno, colno, error properties
                </td>
                <td className="px-4 py-3">
                  PromiseRejectionEvent with reason (may not be Error) and promise reference
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Cross-Origin Behavior</td>
                <td className="px-4 py-3">
                  Receives &quot;Script error.&quot; without CORS configuration
                </td>
                <td className="px-4 py-3">
                  Same limitation; &quot;Script error.&quot; without CORS
                </td>
                <td className="px-4 py-3">
                  Not affected by CORS (promise errors are same-origin by nature)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Multiple Handlers</td>
                <td className="px-4 py-3">
                  No — assignment overwrites previous handler
                </td>
                <td className="px-4 py-3">
                  Yes — multiple listeners coexist
                </td>
                <td className="px-4 py-3">
                  Yes — multiple listeners coexist
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Cancellability</td>
                <td className="px-4 py-3">
                  Return true to suppress default console error
                </td>
                <td className="px-4 py-3">
                  Call event.preventDefault() to suppress
                </td>
                <td className="px-4 py-3">
                  Call event.preventDefault() to suppress console warning
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Browser Support</td>
                <td className="px-4 py-3">
                  Universal — supported since IE6
                </td>
                <td className="px-4 py-3">
                  All modern browsers; capture phase since IE9
                </td>
                <td className="px-4 py-3">
                  All modern browsers; Chrome 49+, Firefox 69+, Safari 11+
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Resource Load Errors</td>
                <td className="px-4 py-3">
                  Cannot detect
                </td>
                <td className="px-4 py-3">
                  Detectable via capture phase (third arg = true)
                </td>
                <td className="px-4 py-3">
                  Not applicable
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Recommended Use</td>
                <td className="px-4 py-3">
                  Legacy fallback; avoid in new code
                </td>
                <td className="px-4 py-3">
                  Primary handler for synchronous errors and resource failures
                </td>
                <td className="px-4 py-3">
                  Essential companion for async error capture
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The practical recommendation is to use all three mechanisms together.{" "}
          <code>addEventListener(&quot;error&quot;, handler, true)</code> on the capture phase
          covers synchronous exceptions and resource failures.{" "}
          <code>addEventListener(&quot;unhandledrejection&quot;, handler)</code> covers
          promise rejections. A <code>window.onerror</code> fallback provides coverage for
          extremely old browsers or environments where <code>addEventListener</code> may not
          behave as expected. Together, they provide the broadest possible error capture net.
          The trade-off is complexity: three different event shapes must be normalized into a
          single reporting format, and care must be taken to avoid double-reporting the same
          error when it triggers multiple handlers.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Install handlers as early as possible:</strong> Global error handlers
            should be registered in a script that loads before the main application bundle.
            Ideally, place a small inline script in the <code>&lt;head&gt;</code> that sets up{" "}
            <code>window.onerror</code>, the <code>error</code> event listener, and the{" "}
            <code>unhandledrejection</code> listener. Errors can occur during script parsing
            and execution of the main bundle itself, and if handlers are only installed after
            the bundle loads, those errors are lost. Some monitoring services (Sentry, Datadog
            RUM) provide lightweight loader scripts specifically designed for early
            installation.
          </li>
          <li>
            <strong>Enrich errors with contextual metadata:</strong> A bare error message and
            stack trace are often insufficient for diagnosis. Attach the current route or page
            URL, the authenticated user&apos;s identifier (anonymized if necessary), the
            application version or build hash, the deployment environment, active feature
            flags, and the browser/OS combination. This context transforms a generic error
            report into an actionable investigation starting point. Store this context in a
            module-level variable that the error handler can access synchronously, avoiding
            async lookups during error processing.
          </li>
          <li>
            <strong>Rate limit error reports:</strong> A single broken function in a{" "}
            <code>requestAnimationFrame</code> loop or a React component that re-renders in
            an infinite loop can generate thousands of identical errors per second. Without
            rate limiting, this floods both the network and the monitoring service. Implement
            a token bucket or sliding window limiter that caps reports to a reasonable
            threshold (e.g., 10 errors per minute). After the limit is reached, batch
            remaining errors or log a single &quot;rate limit exceeded&quot; event with a
            count.
          </li>
          <li>
            <strong>Deduplicate identical errors:</strong> Maintain a short-lived in-memory
            set (keyed by error message + stack trace hash) that tracks errors reported within
            a recent time window (e.g., 60 seconds). When the same error fires repeatedly,
            increment a counter on the first report rather than sending duplicates. This
            reduces noise in the monitoring dashboard and lowers network overhead. Reset the
            deduplication cache periodically to avoid unbounded memory growth.
          </li>
          <li>
            <strong>Handle &quot;Script error.&quot; gracefully:</strong> Rather than
            discarding these events or flooding your monitoring with useless reports, log them
            to a separate category. Track their frequency as a signal that CORS configuration
            is incomplete. For third-party scripts you control, add the{" "}
            <code>crossorigin</code> attribute and CORS headers. For scripts you do not
            control, consider wrapping integration points in local <code>try-catch</code>{" "}
            blocks to capture errors with full context before they reach the global handler.
          </li>
          <li>
            <strong>Protect the error handler from itself:</strong> An error handler that
            throws an exception creates a catastrophic failure mode — the very mechanism
            meant to capture errors becomes a source of silent data loss. Wrap the entire
            body of your global error handler in a <code>try-catch</code> with a minimal
            fallback (e.g., a simple <code>navigator.sendBeacon</code> call with just the
            error message). Test the handler with intentionally malformed inputs: null error
            objects, non-Error rejection values, circular references in error properties.
          </li>
          <li>
            <strong>Use <code>navigator.sendBeacon</code> for transmission:</strong> Regular{" "}
            <code>fetch</code> or <code>XMLHttpRequest</code> calls are canceled when the
            page unloads, which means errors that occur during navigation or page close are
            lost. <code>navigator.sendBeacon</code> is specifically designed to transmit data
            reliably during the page unload process. For non-unload scenarios, a regular
            fetch with keepalive or a queued approach works fine, but beacon should be the
            fallback for page lifecycle edge cases.
          </li>
          <li>
            <strong>Differentiate development and production behavior:</strong> In
            development, you want loud, visible errors with full stack traces in the console.
            In production, you want silent capture and transmission to the monitoring service
            without disrupting the user experience. Use environment variables or build-time
            flags to adjust handler behavior: development handlers can rethrow errors or show
            overlay notifications, while production handlers silently report and optionally
            suppress the default browser console output.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Swallowing errors silently:</strong> Returning <code>true</code> from{" "}
            <code>window.onerror</code> or calling <code>event.preventDefault()</code>{" "}
            suppresses the browser&apos;s default error logging. While this makes the console
            cleaner, it can hide errors during development and make debugging extremely
            difficult. Only suppress default behavior in production, and even then, ensure the
            error is captured by your monitoring system before suppression.
          </li>
          <li>
            <strong>Ignoring promise rejections entirely:</strong> Many applications install a{" "}
            <code>window.onerror</code> handler but neglect{" "}
            <code>unhandledrejection</code>. In modern codebases where async/await and
            Promises are ubiquitous, this creates a massive blind spot. Promise rejections
            from forgotten <code>await</code> statements, fire-and-forget async calls, and
            race conditions in concurrent operations all slip through silently. Always
            register both handlers.
          </li>
          <li>
            <strong>Missing cross-origin configuration:</strong> Teams deploy their
            JavaScript bundles to a CDN with a different origin than the main domain but
            forget to add <code>crossorigin=&quot;anonymous&quot;</code> to script tags and
            CORS headers to the CDN responses. The result is that all production errors from
            the main application bundle appear as{" "}
            <code>&quot;Script error.&quot;</code> — rendering the entire monitoring system
            useless for the most critical errors. This is surprisingly common and should be
            part of any deployment checklist.
          </li>
          <li>
            <strong>Error handlers that throw:</strong> Accessing properties on the error
            object without null checks, calling JSON.stringify on objects with circular
            references, or attempting to read <code>error.stack</code> when the caught value
            is a string rather than an Error instance can cause the handler itself to throw.
            This secondary error replaces the original in the console and is often more
            confusing, while the original error is permanently lost.
          </li>
          <li>
            <strong>Flooding the monitoring service with noise:</strong> Without
            deduplication and rate limiting, a single error in a hot code path can generate
            tens of thousands of reports in minutes. This overwhelms the monitoring service,
            spikes costs (most services bill by event volume), buries actionable errors under
            noise, and can even degrade client-side performance due to excessive network
            requests. Volume-based billing makes this an expensive oversight.
          </li>
          <li>
            <strong>Not testing error paths:</strong> Error handlers are rarely exercised
            during normal development and testing. Teams write them, deploy them, and assume
            they work — until a production incident reveals that the handler has been broken
            for weeks. Include error handler testing in your test suite: intentionally throw
            errors, reject promises, and load broken resources to verify the entire capture
            pipeline functions correctly. Consider synthetic error injection in staging
            environments.
          </li>
          <li>
            <strong>Assuming all thrown values are Error objects:</strong> Third-party
            libraries, legacy code, and minification artifacts can produce rejections with
            string messages, numeric codes, plain objects, or even <code>null</code>. A global
            handler that accesses <code>error.stack</code> without first checking{" "}
            <code>instanceof Error</code> will itself throw, creating a cascading failure.
            Always normalize the caught value before extracting properties.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          GitHub&apos;s Client-Side Error Monitoring
        </h3>
        <p>
          GitHub processes billions of page views monthly and has built a sophisticated
          client-side error monitoring pipeline. Their approach involves installing a
          lightweight error capture script as one of the first resources loaded on every page.
          This script registers global handlers for both synchronous errors and unhandled
          promise rejections. Errors are normalized into a consistent format, enriched with
          contextual metadata (the repository being viewed, the authenticated user&apos;s plan
          tier, the specific UI feature active at the time), and batched before transmission
          to their internal monitoring infrastructure. GitHub&apos;s team has shared that they
          use aggressive deduplication on the client side, hashing error messages and stack
          traces to reduce reporting volume by over 90% without losing unique error signal.
          Their system also distinguishes between first-party errors (in GitHub&apos;s own
          code) and third-party errors (from browser extensions or injected scripts), routing
          them to different dashboards with different alerting thresholds.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Slack&apos;s Error Aggregation Strategy
        </h3>
        <p>
          Slack&apos;s desktop and web clients face unique error handling challenges due to the
          long-lived nature of their sessions. A user may keep Slack open for days or weeks,
          accumulating state and encountering errors that only manifest after extended usage
          periods. Slack&apos;s global error handling strategy focuses heavily on session
          context: each error report includes the session duration, the number and types of
          workspaces loaded, memory usage at the time of the error, and a breadcrumb trail
          of recent user actions. This rich context allows their engineering team to reproduce
          errors that only occur under specific long-running conditions. Slack also implements
          a sophisticated client-side sampling strategy: instead of reporting every error from
          every user, they sample at a rate that provides statistically significant signal
          while keeping costs manageable. Critical error categories (authentication failures,
          message send failures, real-time connection drops) are sampled at 100%, while less
          critical categories (layout glitches, non-essential feature errors) are sampled at
          lower rates.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Netflix&apos;s Graceful Error Recovery in the Player
        </h3>
        <p>
          Netflix&apos;s video player is one of the most error-resilient frontend applications
          in production. The player operates in an environment where errors are not just
          likely but inevitable: network conditions fluctuate, DRM license servers have
          transient failures, media codecs behave differently across thousands of device types,
          and CDN edge nodes occasionally serve corrupt segments. Netflix&apos;s global error
          handling strategy in the player differentiates between recoverable and non-recoverable
          errors. Recoverable errors (a failed segment fetch, a temporary DRM token expiration)
          trigger automatic retry logic with exponential backoff. Non-recoverable errors (an
          unsupported codec, a permanently revoked license) trigger graceful degradation:
          the player displays a user-friendly error message, logs detailed diagnostic
          information, and offers actionable next steps. Their global handler pipeline feeds
          into a real-time anomaly detection system that can identify emerging issues (like a
          specific CDN region serving bad data) within minutes and automatically reroute
          traffic. This closed-loop system, where global error capture feeds directly into
          automated remediation, represents the state of the art in production error handling
          at scale.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Common Interview Questions
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between <code>window.onerror</code> and{" "}
              <code>window.addEventListener(&quot;error&quot;)</code>?
            </p>
            <p className="mt-2 text-sm">
              A: Both capture uncaught synchronous exceptions, but they differ in three key
              ways. First, <code>window.onerror</code> is a property assignment, so setting
              it overwrites any previous handler, while <code>addEventListener</code>{" "}
              supports multiple concurrent listeners. Second, only{" "}
              <code>addEventListener</code> with the capture phase (third argument{" "}
              <code>true</code>) can detect resource loading failures such as broken images
              or failed script loads, because those error events do not bubble to the window.
              Third, <code>onerror</code> receives five decomposed arguments (message,
              source, lineno, colno, error), while <code>addEventListener</code> receives a
              single <code>ErrorEvent</code> object. In modern applications, prefer{" "}
              <code>addEventListener</code> for its flexibility and broader coverage, but
              consider keeping <code>window.onerror</code> as a legacy fallback.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why does &quot;Script error.&quot; appear in my error monitoring, and how do
              I fix it?
            </p>
            <p className="mt-2 text-sm">
              A: &quot;Script error.&quot; is a browser security feature. When a script loaded
              from a different origin throws an error, the browser strips the error details
              (message, filename, line, column, stack) to prevent the host page from inferring
              sensitive information about the third-party script&apos;s logic. To receive full
              error details, two things must be in place: the{" "}
              <code>&lt;script&gt;</code> tag must include the{" "}
              <code>crossorigin=&quot;anonymous&quot;</code> attribute, and the server hosting
              the script must respond with an appropriate{" "}
              <code>Access-Control-Allow-Origin</code> CORS header. For scripts you host on
              your own CDN, this is a configuration task. For true third-party scripts where
              you cannot control the server, wrap the integration boundary in local{" "}
              <code>try-catch</code> blocks to capture errors with full context before they
              reach the global handler.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How should a production application handle unhandled promise rejections?
            </p>
            <p className="mt-2 text-sm">
              A: Register a global <code>unhandledrejection</code> event listener that
              captures the rejection reason, normalizes it (since the reason may be a string,
              an Error object, or any arbitrary value), enriches it with contextual metadata,
              and transmits it to the monitoring service. Importantly, also consider
              registering a <code>rejectionhandled</code> listener to detect cases where a
              previously unhandled rejection later receives a handler — this can be used to
              cancel or annotate the original report. In codebases using <code>async/await</code>,
              audit for common patterns that produce unhandled rejections: calling an async
              function without <code>await</code>, fire-and-forget patterns in event handlers,
              and Promise.all without wrapping individual promises in catch handlers. Static
              analysis tools and linting rules like <code>no-floating-promises</code> in
              TypeScript can prevent many of these at the code review stage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When should global error handlers be installed, and why does timing matter?
            </p>
            <p className="mt-2 text-sm">
              A: Global error handlers should be installed as early as possible in the page
              lifecycle — ideally in an inline <code>&lt;script&gt;</code> in the{" "}
              <code>&lt;head&gt;</code>, before any external scripts load. Timing matters
              because errors can occur during the parsing and execution of the main
              application bundle itself. If the error handler is defined inside the bundle,
              any error that occurs during the bundle&apos;s initial execution will be missed.
              Common early errors include syntax errors from transpilation issues, module
              resolution failures, and exceptions in top-level initialization code. Monitoring
              services like Sentry provide lightweight &quot;loader&quot; scripts specifically
              designed to be inlined early. The handler initially queues errors in memory,
              and once the full SDK loads, it drains the queue and switches to normal
              reporting.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How should error handling differ between development and production
              environments?
            </p>
            <p className="mt-2 text-sm">
              A: In development, the goal is maximum visibility and fast feedback.
              Errors should produce loud, visible signals: full stack traces in the console,
              development overlay notifications (like the React error overlay), and even
              breaking the UI visibly so the developer notices immediately. Suppressing
              default console output in development is counterproductive. In production, the
              goal is silent capture without disrupting the user. Errors should be transmitted
              to the monitoring service, default console output may be suppressed to avoid
              confusing users who open DevTools, and the application should attempt graceful
              degradation. Use build-time environment variables to toggle between these modes.
              Some teams also maintain a &quot;debug mode&quot; that can be activated in
              production (via a URL parameter or cookie) for on-call engineers investigating
              live issues, enabling verbose logging without redeploying.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What challenges arise when serializing errors for transmission to a
              monitoring service?
            </p>
            <p className="mt-2 text-sm">
              A: Several challenges make error serialization non-trivial. First, JavaScript
              allows throwing any value, not just Error objects — you may receive a string,
              number, plain object, or <code>null</code> as the caught value, so the handler
              must check <code>instanceof Error</code> before accessing properties like{" "}
              <code>stack</code>. Second, the <code>stack</code> property is
              non-standard and has different formats across Chrome, Firefox, and Safari,
              requiring normalization for consistent analysis. Third, errors may contain
              circular references or non-serializable values (DOM nodes, functions) that
              cause <code>JSON.stringify</code> to throw. Fourth, in production, stack traces
              reference minified code positions, requiring server-side source map resolution
              for meaningful debugging. Fifth, some Error subclasses add custom properties
              (like <code>cause</code> in ES2022 or <code>code</code> in Node.js errors)
              that standard serialization misses. A robust approach uses a custom serializer
              that handles all these edge cases with appropriate fallbacks.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References & Further Reading
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References &amp; Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            MDN Web Docs — GlobalEventHandlers.onerror: comprehensive documentation of the{" "}
            <code>window.onerror</code> handler signature, cross-origin behavior, and browser
            compatibility notes.
          </li>
          <li>
            MDN Web Docs — Window: unhandledrejection event: detailed explanation of the{" "}
            <code>PromiseRejectionEvent</code> interface, the <code>rejectionhandled</code>{" "}
            companion event, and behavioral differences across environments.
          </li>
          <li>
            Sentry Documentation — JavaScript Error Handling: best practices for integrating
            global error capture with Sentry&apos;s SDK, including early initialization,
            breadcrumb collection, and source map configuration.
          </li>
          <li>
            Web.dev — Monitor your web page&apos;s total memory usage with{" "}
            <code>measureUserAgentSpecificMemory()</code>: discusses advanced monitoring
            techniques that complement error capture for production observability.
          </li>
          <li>
            React Documentation — Error Boundaries: official guide to implementing error
            boundaries in React, including their limitations and the errors they do not catch.
          </li>
          <li>
            &quot;Robust Client-Side JavaScript&quot; by Mathias Schafer: a comprehensive
            resource covering defensive JavaScript programming patterns, including error
            handling strategies at every level of the application.
          </li>
          <li>
            WHATWG HTML Living Standard — Runtime Script Errors: the specification that
            defines the <code>error</code> event behavior, cross-origin information leakage
            prevention, and the <code>ErrorEvent</code> interface.
          </li>
          <li>
            Google Chrome Blog — &quot;Promise Rejection Events&quot;: the original
            announcement and rationale for the <code>unhandledrejection</code> and{" "}
            <code>rejectionhandled</code> events, including design decisions and usage
            patterns.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
