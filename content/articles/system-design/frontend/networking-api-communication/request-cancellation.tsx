"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-request-cancellation",
  title: "Request Cancellation (AbortController)",
  description:
    "Comprehensive guide to request cancellation using AbortController covering signal propagation, race condition prevention, cleanup patterns, and building responsive frontend applications that cancel obsolete requests.",
  category: "frontend",
  subcategory: "networking-api-communication",
  slug: "request-cancellation",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "frontend",
    "abortcontroller",
    "cancellation",
    "race-conditions",
    "cleanup",
    "signals",
  ],
  relatedTopics: [
    "request-queuing",
    "retry-logic-and-exponential-backoff",
    "circuit-breaker-pattern",
    "react-query",
  ],
};

export default function RequestCancellationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="important">
          <strong>Request Cancellation</strong> is the practice of terminating
          in-flight HTTP requests that are no longer needed, preventing wasted
          bandwidth, avoiding state updates on unmounted components, and
          eliminating race conditions where stale responses overwrite newer data.
          The <strong>AbortController API</strong>, standardized in the DOM
          specification and implemented in all modern browsers (Chrome 66+,
          Firefox 57+, Safari 11.1+, Edge 79+), provides a unified mechanism for
          canceling DOM operations including fetch requests, event listeners,
          and any API that supports abort signals.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Before AbortController, canceling requests was notoriously difficult.
          XMLHttpRequest had an abort() method, but it was not composable and
          did not propagate to nested operations. There was no standard way to
          cancel fetch requests (introduced in 2015) until AbortController was
          added in 2017. Developers resorted to workarounds: ignoring responses
          from obsolete requests (wasting bandwidth), using flags to track
          whether a component was mounted (error-prone), or wrapping XHR in
          Promise libraries with custom cancellation (non-standard).
          AbortController solved this by introducing a signal-based pattern: the
          controller creates a signal, the signal is passed to the operation, and
          calling controller.abort() signals all listening operations to
          terminate.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          At a staff or principal engineer level, request cancellation is not
          just about calling abort() -- it is about designing systems that
          gracefully handle cancellation at every layer. This includes:
          propagating signals through multiple abstraction layers (from UI
          components to API clients to fetch wrappers), handling abort errors
          without surfacing them to users (since cancellation is expected, not
          an error condition), coordinating cancellation with retry logic (do
          not retry canceled requests), and integrating with React's concurrent
          rendering features (where cancellation is implicit in the rendering
          model). The most sophisticated implementations treat cancellation as a
          first-class concern, designing APIs and components that are
          cancellation-aware from the ground up.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The business case for proper request cancellation is compelling.
          Applications that do not cancel requests waste bandwidth on responses
          that are never used (impacting mobile data costs and performance),
          trigger React warnings about state updates on unmounted components
          (indicating memory leaks), and exhibit race conditions where slow
          responses overwrite newer data (corrupting UI state). Proper
          cancellation eliminates these issues, resulting in faster perceived
          performance, cleaner error logs, and more predictable application
          behavior.
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="important">
          Request cancellation with AbortController is built on six foundational
          concepts that govern how signals are created, propagated, and handled:
        </HighlightBlock>
        <ul>
          <HighlightBlock as="li" tier="crucial">
            <strong>AbortController and AbortSignal:</strong> AbortController is
            a class that creates and controls an AbortSignal instance. The
            controller has two properties: <code>signal</code> (the AbortSignal
            object) and <code>abort()</code> (a method that triggers the
            signal). The signal has properties: <code>aborted</code> (boolean,
            true after abort() is called), <code>reason</code> (the value passed
            to abort(), default is AbortError), and an <code>abort</code> event
            that fires when abort() is called. The pattern is: create
            controller, pass controller.signal to the operation, call
            controller.abort() to cancel. The operation listens to the signal's
            abort event and terminates when triggered. Multiple operations can
            listen to the same signal, enabling coordinated cancellation.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Signal Propagation:</strong> In real applications, requests
            flow through multiple layers: UI component → data-fetching hook →
            API client → fetch wrapper → native fetch. Each layer must propagate
            the signal downward. The UI component creates the controller and
            passes the signal to the hook. The hook passes it to the API client.
            The API client passes it to fetch. If any layer fails to propagate
            the signal, cancellation will not reach the network layer and the
            request will complete even after the component unmounts. This is a
            common source of memory leaks: developers add AbortController at the
            component level but forget to thread the signal through
            intermediate layers.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>AbortError Handling:</strong> When a request is aborted, the
            Promise rejects with a DOMException named "AbortError". This is not
            an error condition -- it is expected behavior when canceling
            requests. Applications must distinguish AbortError from genuine
            errors (network failures, server errors) and handle them
            differently: AbortError should be silently ignored (or logged at
            debug level), while genuine errors should be surfaced to users and
            trigger error UI. The check is:{" "}
            <code>if (error.name === 'AbortError') return</code>. React Query
            and SWR handle this automatically, but custom fetch wrappers must
            implement it explicitly.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Cleanup on Unmount:</strong> The most common use case for
            cancellation is cleaning up in-flight requests when a component
            unmounts. In React, this is done in useEffect cleanup functions or
            componentWillUnmount. The pattern is: create AbortController in the
            effect, pass signal to the request, return a cleanup function that
            calls controller.abort(). This ensures that when the component
            unmounts (or the effect re-runs with new dependencies), any
            in-flight requests are canceled. Without this cleanup, responses
            arrive after unmount and attempt to update state on an unmounted
            component, causing memory leaks and React warnings.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Race Condition Prevention:</strong> Race conditions occur
            when multiple requests for the same data are in flight and responses
            arrive out of order. For example, a user types "a", then "ab", then
            "abc" in a search box, triggering three requests. If the "a" request
            is slowest, its response may arrive after "abc", overwriting the
            correct results with stale data. Cancellation solves this by
            aborting the previous request before starting a new one. Each new
            search creates a new AbortController and aborts the previous
            controller, ensuring only the latest request's response is
            processed. This is the canonical use case for AbortController in
            search-as-you-type interfaces.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Timeout-Based Cancellation:</strong> AbortController
            supports timeout-based cancellation via setTimeout. The pattern is:
            create controller, set a timeout that calls controller.abort() after
            N milliseconds, pass signal to the request. If the request completes
            before the timeout, clear the timeout. If the timeout fires first,
            the request is aborted. This is useful for enforcing request
            deadlines: "if this data fetch takes more than 5 seconds, give up
            and show cached data." AbortController also supports
            AbortSignal.timeout(ms) (newer API) that creates a signal that
            auto-aborts after a specified duration, simplifying timeout
            implementation.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="important">
          The request cancellation architecture consists of several layers
          working together: signal creation at the UI layer, signal propagation
          through intermediate layers, abort handling at the network layer, and
          error handling at the response layer.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Cancellation Lifecycle
          </h3>
          <ol className="space-y-3">
            <HighlightBlock as="li" tier="crucial">
              <strong>1. Controller Creation:</strong> Component creates
              AbortController, stores reference for cleanup
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>2. Signal Propagation:</strong> Component passes
              controller.signal to hook, hook passes to API client, client
              passes to fetch
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>3. Request Initiation:</strong> fetch() receives signal,
              begins network request, listens for abort event
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>4a. Normal Completion:</strong> Response arrives before
              abort, Promise resolves, signal listener removed
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>4b. Cancellation:</strong> controller.abort() called,
              signal fires abort event, fetch terminates connection, Promise
              rejects with AbortError
            </HighlightBlock>
            <HighlightBlock as="li" tier="crucial">
              <strong>5. Error Handling:</strong> Catch block checks
              error.name === 'AbortError', silently ignores if true, handles
              genuine errors otherwise
            </HighlightBlock>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/abort-controller-flow.svg"
          alt="AbortController Flow Diagram"
          caption="AbortController Flow: Controller creates signal, signal propagates through layers to fetch, abort() triggers cancellation, AbortError is caught and handled"
          captionTier="important"
        />

        <HighlightBlock as="p" tier="crucial">
          The signal propagation pattern is critical for cancellation to work
          end-to-end. Consider a typical React application: a SearchComponent
          creates an AbortController and passes the signal to useSearch hook.
          The hook passes the signal to searchApi function. The searchApi
          function passes the signal to fetch(). If any layer fails to propagate
          the signal, cancellation breaks. For example, if useSearch does not
          pass the signal to searchApi, calling abort() in the component will
          not cancel the actual network request. This is why libraries like
          React Query and SWR are valuable: they handle signal propagation
          internally, so developers do not need to thread signals through
          multiple layers manually.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/signal-propagation.svg"
          alt="AbortController Signal Propagation Diagram"
          caption="Signal Propagation: AbortController signal flows from Component through Hook to API Client to fetch(). Each layer must forward the signal. abort() call from component cancels the fetch request."
          captionTier="important"
        />

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/abort-race-condition.svg"
          alt="Race Condition Prevention with AbortController"
          caption="Race Condition Prevention: User types 'a', 'ab', 'abc' triggering three requests. Each new request aborts the previous one, ensuring only the latest response is processed"
          captionTier="important"
        />

        <HighlightBlock as="p" tier="important">
          The race condition diagram illustrates the canonical use case:
          search-as-you-type. Without cancellation, three requests are in flight
          simultaneously, and responses may arrive out of order. With
          cancellation, each keystroke aborts the previous request, ensuring
          only the latest request completes. This reduces bandwidth (only one
          response is downloaded instead of three) and prevents stale data from
          overwriting fresh data. The pattern is: store controller reference in a
          ref, on new search term, call ref.current?.abort() to cancel previous
          request, create new controller, pass signal to fetch.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          For timeout-based cancellation, the flow is similar but with an
          automatic abort trigger. The component creates a controller, sets a
          timeout to call abort() after N milliseconds, and passes the signal to
          fetch. If fetch completes before the timeout, the timeout is cleared.
          If the timeout fires first, fetch is aborted. AbortSignal.timeout(ms)
          simplifies this: instead of manually creating controller and timeout,
          call AbortSignal.timeout(5000) to get a signal that auto-aborts after
          5 seconds. This is supported in modern browsers (Chrome 100+, Firefox
          99+, Safari 15.4+) and is the preferred approach for timeout-based
          cancellation.
        </HighlightBlock>

        <HighlightBlock as="p" tier="crucial">
          From an architecture perspective, cancellation should be centralized
          in a request management layer rather than implemented ad-hoc in each
          component. This layer handles: creating and tracking controllers per
          request, propagating signals to fetch, handling AbortError uniformly,
          integrating with retry logic (do not retry canceled requests), and
          exposing a simple API to components (e.g., fetchWithCancellation(url,
          options, signal)). Libraries like Axios have built-in cancellation
          support (axios.CancelToken in older versions, AbortSignal in newer),
          while fetch requires manual AbortController integration.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Approach</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <HighlightBlock as="tr" tier="crucial">
              <td className="p-3">
                <strong>AbortController</strong>
              </td>
              <td className="p-3">
                • Standard browser API with universal support
                <br />
                • Composable with any signal-aware API
                <br />• Supports timeout via AbortSignal.timeout()
              </td>
              <td className="p-3">
                • Requires manual signal propagation through layers
                <br />
                • Must handle AbortError explicitly
                <br />• Not available in Node.js &lt; 15 (requires polyfill)
              </td>
            </HighlightBlock>
            <HighlightBlock as="tr" tier="important">
              <td className="p-3">
                <strong>React Query / SWR</strong>
              </td>
              <td className="p-3">
                • Automatic cancellation on unmount
                <br />
                • Built-in AbortError handling
                <br />• No manual signal propagation needed
              </td>
              <td className="p-3">
                • Adds library dependency
                <br />
                • Less control over cancellation timing
                <br />• May not cancel in all scenarios (e.g., window blur)
              </td>
            </HighlightBlock>
            <HighlightBlock as="tr" tier="important">
              <td className="p-3">
                <strong>Mounted Flag</strong>
              </td>
              <td className="p-3">
                • Simple to implement (isMounted ref)
                <br />
                • No browser API dependencies
                <br />• Works with any async operation
              </td>
              <td className="p-3">
                • Does not cancel actual network request
                <br />
                • Wastes bandwidth on unused responses
                <br />• Does not prevent race conditions
              </td>
            </HighlightBlock>
            <HighlightBlock as="tr" tier="important">
              <td className="p-3">
                <strong>Ignoring Responses</strong>
              </td>
              <td className="p-3">
                • Simplest approach (no cleanup)
                <br />
                • No code changes needed
                <br />• Works for non-critical requests
              </td>
              <td className="p-3">
                • Wastes bandwidth and server resources
                <br />
                • Does not prevent race conditions
                <br />• Can cause state updates on unmounted components
              </td>
            </HighlightBlock>
          </tbody>
        </table>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">
            Cancellation vs. Ignoring: Why Abort Matters
          </h3>
          <HighlightBlock as="p" tier="crucial">
            A common misconception is that cancellation is unnecessary if you
            simply ignore the response (e.g., using a mounted flag to skip
            setState after unmount). This is incorrect for three reasons. First,
            <strong>bandwidth waste</strong>: the response is still downloaded,
            consuming mobile data and network capacity. Second,{" "}
            <strong>server resource waste</strong>: the server still processes
            the request and sends a response, consuming CPU and memory. Third,{" "}
            <strong>race conditions</strong>: ignoring the response does not
            prevent it from arriving and being processed if the mounted check is
            not atomic. AbortController cancels the request at the network
            layer, preventing all three issues. Use mounted flags only as a
            backup defense, not as the primary cancellation strategy.
          </HighlightBlock>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="important">
          These practices represent hard-won lessons from operating
          cancellation-aware frontend applications at scale:
        </HighlightBlock>
        <ol className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Always Cancel in Cleanup Functions:</strong> In React
            useEffect, always return a cleanup function that calls
            controller.abort(). This ensures requests are canceled when the
            component unmounts or the effect re-runs. The pattern is to create
            a controller, pass the signal to fetch in the effect, and return a
            cleanup function that calls abort. This is the single most important
            cancellation practice -- it prevents memory leaks, React warnings,
            and race conditions.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Handle AbortError Silently:</strong> In catch blocks, check
            if the error name is AbortError and return early without surfacing
            an error to users. Cancellation is expected behavior, not an error
            condition. Log AbortError at debug level for observability, but do
            not show error UI or trigger error boundaries. The pattern is to
            check the error name in the catch block and return early if it is
            an abort error, otherwise handle it as a genuine error.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Propagate Signals Through All Layers:</strong> Ensure the
            signal reaches the actual fetch call. If you have intermediate
            layers (hooks, API clients, fetch wrappers), each must accept and
            forward the signal. Document this requirement for your team: "All
            data-fetching functions must accept an optional signal parameter and
            pass it to fetch." Consider using TypeScript to enforce this with an
            interface that includes an optional signal property.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Cancel Previous Request on New Request:</strong> For
            search-as-you-type or filter-as-you-type, cancel the previous
            request before starting a new one. Store the controller in a ref,
            call ref.current abort on new input, create new controller. This
            ensures only the latest request completes, preventing race
            conditions and reducing bandwidth. The pattern is to store the
            controller in a ref, abort the current controller on new search,
            create a new controller, and pass the signal to fetch.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Use AbortSignal.timeout for Deadlines:</strong> For requests
            that should not exceed a certain duration, use
            AbortSignal.timeout instead of manual setTimeout. This creates a
            signal that auto-aborts after the specified duration. Combine with
            manual abort for unmount cleanup by using AbortSignal.any to
            combine multiple signals.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Do Not Retry Canceled Requests:</strong> When integrating
            cancellation with retry logic, ensure retries are not attempted for
            aborted requests. Check if the error name is AbortError before
            triggering retry. Retrying a canceled request defeats the purpose of
            cancellation and wastes resources. The pattern is to check the error
            name and return early if it is an abort error, otherwise proceed
            with retry logic.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Use Libraries for Automatic Cancellation:</strong> For new
            projects, consider using React Query or SWR which handle
            cancellation automatically. These libraries abort in-flight requests
            when components unmount or queries are no longer needed, without
            manual AbortController management. This reduces boilerplate and
            eliminates common mistakes (forgetting cleanup, not propagating
            signals). For existing projects with custom fetch logic, gradually
            migrate to these libraries or extract cancellation logic into
            reusable hooks.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Test Cancellation Behavior:</strong> Write tests that verify
            requests are canceled on unmount. Use mocking to simulate slow
            requests, render and unmount component quickly, and assert that
            abort() was called. Test race condition scenarios: trigger multiple
            rapid requests, verify only the latest completes. Test AbortError
            handling: abort a request, verify no error UI is shown. Testing
            cancellation is often overlooked but critical for reliability.
          </HighlightBlock>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <HighlightBlock as="p" tier="important">
          These mistakes appear frequently even in production applications at
          well-funded companies:
        </HighlightBlock>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Not Propagating Signals:</strong> Creating AbortController
            in the component but not passing the signal through intermediate
            layers to fetch. The controller.abort() is called on unmount, but
            the actual network request is not canceled because fetch never
            received the signal. Always thread the signal through every layer:
            component → hook → API client → fetch wrapper → fetch.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Treating AbortError as Failure:</strong> Surfacing
            AbortError to users as an error message or triggering error
            boundaries. This creates confusing UX: the user navigates away from
            a page and sees an error toast for a request they no longer care
            about. AbortError should be silently ignored or logged at debug
            level. Only genuine errors (network failures, server errors) should
            surface to users.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Not Canceling on Re-render:</strong> Only canceling on
            unmount but not when the effect re-runs with new dependencies. For
            example, a search component that creates a new AbortController on
            every render but does not abort the previous controller. Each new
            search term should abort the previous request. Pattern: store
            controller in useRef, abort ref.current on new search, create new
            controller.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Creating Controller in Render:</strong> Creating
            AbortController directly in the component body (not in useEffect)
            means a new controller is created on every render, and the previous
            controller is lost (cannot be aborted). Always create the
            controller inside useEffect or store it in a ref so it persists
            across renders and can be aborted in cleanup.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Forgetting to Clear Timeout:</strong> When using
            setTimeout for timeout-based cancellation, forgetting to clear the
            timeout if the request completes successfully. This causes the
            timeout to fire after completion, potentially triggering cleanup
            logic or causing memory leaks. Always clear the timeout in both
            success and error handlers: const timeoutId = setTimeout(abort,
            5000); fetch().then(() =&gt; clearTimeout(timeoutId)).catch(() =&gt;
            clearTimeout(timeoutId)).
          </HighlightBlock>
          <li>
            <strong>Not Handling Abort in Event Listeners:</strong>
            AbortController can also cancel event listeners since addEventListener
            accepts a signal option, but developers often forget to use this. For
            example, adding scroll or resize listeners without a signal means
            they persist after component unmount. The pattern is to create a
            controller, pass the signal to addEventListener in the options
            object, and return a cleanup function that calls abort. This
            automatically removes the listener on abort.
          </li>
          <li>
            <strong>Using Mounted Flag Instead of Cancellation:</strong> Relying
            solely on isMounted ref to skip setState after unmount, without
            actually canceling the request. This wastes bandwidth (response is
            still downloaded), wastes server resources (request is still
            processed), and does not prevent race conditions (response may still
            be processed if mounted check is not atomic). Use AbortController
            for actual cancellation, mounted flag as backup.
          </li>
          <li>
            <strong>Not Testing Cancellation:</strong> Assuming cancellation
            works without testing. Common failure modes: signal not propagated,
            AbortError not handled, cleanup not called on unmount. Write tests
            that render component, trigger request, unmount quickly, and assert
            abort was called. Use mocking to simulate slow requests and verify
            cancellation behavior.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="important">
          Request cancellation is essential in these production scenarios:
        </HighlightBlock>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Search-as-You-Type:</strong> Search boxes that trigger
            API requests on every keystroke (e.g., GitHub's repository search,
            Algolia instant search). Without cancellation, typing "react"
            triggers four requests ("r", "re", "rea", "react"), and if the "r"
            request is slowest, its response may overwrite the "react" results.
            Implementation: store AbortController in ref, on each keystroke call
            ref.current?.abort(), create new controller, pass signal to search
            API. This ensures only the latest search completes, preventing race
            conditions and reducing bandwidth by 75% (one response instead of
            four).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Route Transitions:</strong> Single-page applications where
            navigating to a new route should cancel pending data fetches for the
            previous route. For example, navigating from a slow-loading user
            profile to a different page should cancel the profile fetch.
            Implementation: in route component's useEffect, create controller,
            pass signal to data fetches, return cleanup that aborts. When the
            route changes, the component unmounts, cleanup runs, and requests
            are canceled. This prevents "Can't perform a React state update on
            an unmounted component" warnings.
          </HighlightBlock>
          <li>
            <strong>Tab Switching:</strong> Applications with multiple tabs
            where switching tabs should cancel pending requests for the
            previously active tab. For example, a dashboard with "Overview",
            "Analytics", and "Settings" tabs -- switching from Analytics to
            Settings should cancel pending analytics fetches. Implementation:
            each tab component creates controller on mount, aborts on unmount
            (when tab is switched). Alternatively, use React Query which
            automatically cancels queries when they are no longer observed (tab
            becomes inactive).
          </li>
          <li>
            <strong>Filter and Sort Operations:</strong> Data tables where
            changing filters or sort order triggers new API requests. Rapid
            filter changes should cancel previous requests to avoid showing
            stale data. For example, filtering a product list by category, then
            price, then rating -- each change should cancel the previous filter
            request. Implementation: same pattern as search-as-you-type -- store
            controller in ref, abort on filter change, create new controller.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>File Upload with Progress:</strong> Large file uploads where
            users may cancel mid-upload. AbortController allows graceful
            cancellation: user clicks "Cancel", controller.abort() is called,
            upload stops, server can clean up partial upload. Implementation:
            create controller, pass signal to fetch with upload body, on cancel
            button click call abort(). Handle AbortError to show "Upload
            canceled" instead of "Upload failed". Server should detect
            disconnected client and clean up partial files.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Polling with Early Termination:</strong> Polling endpoints
            (short polling, long polling) where polling should stop when
            component unmounts or user navigates away. For example, polling for
            job status every 5 seconds -- when the user leaves the page, polling
            should stop. Implementation: create controller in useEffect, pass
            signal to each poll request, return cleanup that aborts. This stops
            both the current in-flight request and prevents future polls.
          </HighlightBlock>
          <li>
            <strong>Concurrent Data Fetches:</strong> Dashboards that fetch
            multiple data sources in parallel, where some fetches should be
            canceled if others fail or take too long. For example, fetching user
            data, orders, and recommendations -- if user data fails, cancel
            orders and recommendations fetches since they depend on user ID.
            Implementation: create single controller, pass same signal to all
            fetches, if user data fetch fails call controller.abort() to cancel
            remaining fetches. This prevents wasted requests for dependent data.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: How do you prevent race conditions in search-as-you-type
              implementations?</p>
            <HighlightBlock as="p" tier="crucial" className="mt-2 text-sm">
              <strong>Answer:</strong> I use AbortController to cancel previous
              requests when a new search term is entered. I store the
              AbortController in a useRef so it persists across renders. On each
              keystroke, I call ref.current?.abort() to cancel the previous
              request, create a new AbortController, and pass its signal to the
              fetch request. This ensures only the latest request completes --
              if the user types "react", the requests for "r", "re", and "rea"
              are canceled, and only the "react" request's response is
              processed. This prevents stale results from overwriting fresh
              results and reduces bandwidth by not downloading unused responses.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: How do you handle AbortError in catch blocks?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              <strong>Answer:</strong> I check if the error name is AbortError and
              return early without surfacing an error to users. Cancellation is
              expected behavior, not an error condition. I might log it at debug
              level for observability, but I do not show error UI, trigger error
              boundaries, or retry the request. The pattern is to catch the error,
              check if it is an abort error, return early if it is, and handle
              other errors normally. This ensures users do not see confusing error
              messages when they navigate away from a page or cancel an operation.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: Where should AbortController be created and cleaned up in a
              React component?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              <strong>Answer:</strong> Create the AbortController inside
              useEffect (not in the component body) and return a cleanup
              function that calls abort(). Creating it in the component body
              means a new controller is created on every render, and the
              previous controller is lost (cannot be aborted). Creating it in
              useEffect ensures it persists for the lifetime of the effect.
              The pattern is to create the controller inside useEffect, pass
              the signal to fetch, and return a cleanup function that calls
              abort(). The cleanup function runs when the component unmounts or
              the effect re-runs, canceling any in-flight requests.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: How do you implement timeout-based request cancellation?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              <strong>Answer:</strong> I use AbortSignal.timeout(ms) if
              available (modern browsers), which creates a signal that
              auto-aborts after the specified duration. The pattern is to call
              AbortSignal.timeout with the timeout value and pass the signal to
              fetch. For older browsers or more control, I use manual
              setTimeout: create a controller, set a timeout to call abort after
              the specified duration, pass the signal to fetch, and clear the
              timeout in both success and error handlers. The timeout is cleared
              if the request completes successfully, ensuring the timeout does
              not fire unnecessarily.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: How do you propagate AbortController signals through multiple
              layers (component → hook → API client → fetch)?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              <strong>Answer:</strong> Each layer must accept an optional signal
              parameter and pass it to the next layer. The component creates the
              controller and passes signal to the hook. The hook passes signal
              to the API client. The API client passes signal to fetch. The
              pattern is: component creates controller and passes signal to a
              hook, the hook accepts signal and passes it to the API client, and
              the API client accepts signal and passes it to fetch. If any layer
              fails to propagate the signal, cancellation will not reach fetch
              and the request will not be canceled. I use TypeScript to enforce
              this by defining an interface with an optional signal property.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: What are the consequences of not canceling requests on
              component unmount?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Three main issues: (1) Memory leaks --
              the response arrives after unmount and attempts to update state on
              an unmounted component, causing React warnings and preventing
              garbage collection. (2) Wasted bandwidth -- the response is
              downloaded even though it is never used, impacting mobile data
              costs and performance. (3) Race conditions -- if the component
              remounts before the old response arrives, the stale response may
              overwrite fresh data. For example, navigating to a user profile,
              then back, then the old profile's response arrives and overwrites
              the new profile's data. AbortController prevents all three issues
              by canceling the request at the network layer.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            MDN Web Docs: <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AbortController 
            </a>
          </li>
          <li>
            MDN Web Docs: <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AbortSignal 
            </a>
          </li>
          <li>
            DOM Specification: <a
              href="https://dom.spec.whatwg.org/#interface-abortsignal"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AbortSignal 
            </a>
          </li>
          <li>
            Fetch Specification: <a
              href="https://fetch.spec.whatwg.org/#aborting-fetch"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Aborting Fetch 
            </a>
          </li>
          <li>
            React Documentation: <a
              href="https://react.dev/learn/synchronizing-with-effects#fetching-data"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cleanup in useEffect 
            </a>
          </li>
          <li>
            web.dev: <a
              href="https://web.dev/articles/abortcontroller"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Patterns for AbortController 
            </a>
          </li>
          <li>
            <a
              href="https://github.com/whatwg/dom/issues/985"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AbortSignal.timeout() Proposal 
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
