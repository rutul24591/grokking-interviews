"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-debouncing-throttling",
  title: "Debouncing and Throttling",
  description: "Comprehensive guide to debouncing and throttling techniques for controlling event frequency in frontend applications, with implementation patterns and use cases.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "debouncing-and-throttling",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "debounce", "throttle", "events", "optimization", "rate-limiting"],
  relatedTopics: ["memoization-and-react-memo", "request-deduplication", "web-vitals", "virtualization-windowing"],
};

export default function DebouncingThrottlingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Debouncing</strong> and <strong>throttling</strong> are rate-limiting techniques that 
          control how often a function executes in response to frequent events. Without them, events like 
          scrolling (fires 60+ times/second), typing (fires on every keystroke), or window resizing (fires 
          continuously) can trigger expensive operations hundreds of times per second — causing jank, 
          excessive API calls, and wasted computation.
        </p>
        <p>
          These techniques are essential for frontend performance because modern web applications respond 
          to user input in real-time. Every keystroke might trigger a search API call. Every scroll event 
          might recalculate layout. Every mouse move might update a tooltip position. Without rate limiting, 
          the browser&apos;s main thread becomes overwhelmed, resulting in dropped frames, unresponsive UI, 
          and poor user experience.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/debounce-vs-throttle.svg"
          alt="Timeline comparison showing debounce (executes after quiet period) vs throttle (executes at regular intervals) for the same event stream"
          caption="Debounce waits for activity to stop; throttle executes at regular intervals during activity"
        />

        <p>
          The key distinction between the two techniques:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Debounce:</strong> Wait until the event <em>stops firing</em> for a specified delay, 
            then execute once. Like an elevator door — it waits for people to stop entering before closing. 
            The function executes <strong>once</strong> after the last event.
          </li>
          <li>
            <strong>Throttle:</strong> Execute at most once per specified interval, no matter how often 
            the event fires. Like a train schedule — it runs at fixed intervals regardless of passengers 
            arriving. The function executes <strong>repeatedly</strong> at regular intervals.
          </li>
        </ul>

        <p>
          The performance impact of proper rate limiting is significant:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Reduced Function Calls:</strong> A scroll handler that fires 60 times/second can be 
            reduced to 10 times/second with 100ms throttle — 83% reduction in executions.
          </li>
          <li>
            <strong>Fewer API Calls:</strong> A search input that would trigger 20 API calls during typing 
            becomes 1 API call after typing stops with 300ms debounce.
          </li>
          <li>
            <strong>Smoother Interactions:</strong> By spreading expensive operations over time, the main 
            thread stays responsive, maintaining 60fps scroll and animation performance.
          </li>
        </ul>

        <p>
          In system design interviews, debouncing and throttling demonstrate understanding of event-driven 
          architecture, rate limiting strategies, and the trade-offs between responsiveness and resource 
          efficiency. These concepts also apply beyond frontend — API rate limiting, message queue 
          backpressure, and database query batching use similar principles.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/debounce-timeline.svg"
          alt="Timeline diagram showing debounce behavior with timer reset on each event and final execution after delay period"
          caption="Debounce timeline: each event resets the timer, execution happens only after the delay period with no events"
        />

        <h3>How Debouncing Works</h3>
        <p>
          Debounce delays execution until the event stops firing for a specified period. Each new event 
          resets the timer. The function only executes once — after the &quot;quiet period.&quot;
        </p>
        <p>
          Implementation mechanism:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Timer Storage:</strong> Maintain a reference to a timeout ID (using closure, ref, or 
            instance variable).
          </li>
          <li>
            <strong>Clear on New Event:</strong> When the event fires, clear the existing timeout 
            (canceling the pending execution).
          </li>
          <li>
            <strong>Set New Timer:</strong> Start a new timeout for the specified delay.
          </li>
          <li>
            <strong>Execute on Completion:</strong> If no new events fire during the delay, the timeout 
            completes and the function executes.
          </li>
        </ol>
        <p>
          There are two debounce variants:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Trailing Edge (default):</strong> Executes after the last event. Most common use case 
            — search inputs, auto-save, resize handlers.
          </li>
          <li>
            <strong>Leading Edge:</strong> Executes immediately on the first event, then ignores subsequent 
            events until the delay passes. Useful when you want immediate feedback but rate-limited 
            follow-ups.
          </li>
        </ul>

        <h3>How Throttling Works</h3>
        <p>
          Throttle ensures a function executes at most once per specified interval. Unlike debounce, it 
          fires at regular intervals during continuous events — so the user gets feedback while 
          they&apos;re interacting.
        </p>
        <p>
          Implementation mechanism:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Track Last Execution:</strong> Store the timestamp of the last function execution.
          </li>
          <li>
            <strong>Check Time Elapsed:</strong> When the event fires, calculate time since last execution.
          </li>
          <li>
            <strong>Execute if Interval Passed:</strong> If enough time has elapsed, execute the function 
            and update the timestamp.
          </li>
          <li>
            <strong>Skip if Too Soon:</strong> If not enough time has passed, skip execution.
          </li>
        </ol>
        <p>
          There are two throttle variants:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Delay-Based:</strong> Track last execution time, execute when interval has passed. 
            Simpler, more common.
          </li>
          <li>
            <strong>Timeout-Based:</strong> Use setTimeout to schedule the next execution. Guarantees 
            execution after the interval, even if events stop.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/throttle-timeline.svg"
          alt="Timeline diagram showing throttle behavior with fixed interval executions regardless of event frequency"
          caption="Throttle timeline: function executes at most once per interval, providing regular updates during continuous events"
        />

        <h3>Key Differences</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Aspect</th>
                <th className="p-3 text-left">Debounce</th>
                <th className="p-3 text-left">Throttle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Execution Timing</td>
                <td className="p-3">After last event + delay</td>
                <td className="p-3">At most once per interval</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Execution Count</td>
                <td className="p-3">Once per burst</td>
                <td className="p-3">Multiple times during burst</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">User Feedback</td>
                <td className="p-3">Delayed (waits for quiet)</td>
                <td className="p-3">Continuous (regular updates)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Implementation</td>
                <td className="p-3">setTimeout + clearTimeout</td>
                <td className="p-3">Timestamp comparison or timeout</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Best For</td>
                <td className="p-3">Search, auto-save, resize</td>
                <td className="p-3">Scroll, mouse move, analytics</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>

        <h3>Implementation Patterns</h3>
        <p>
          Both debouncing and throttling can be implemented as standalone functions, React hooks, or 
          using utility libraries.
        </p>

        <h4>Standalone Function Implementation</h4>
        <p>
          The classic approach uses closures to maintain timer/timestamp state:
        </p>
        <p>
          For debounce:
        </p>
        <ul className="space-y-1">
          <li>• Create a function that returns a wrapped function</li>
          <li>• Maintain timeoutId in closure</li>
          <li>• On each call, clearTimeout and set new timeout</li>
          <li>• Execute original function when timeout completes</li>
        </ul>
        <p>
          For throttle:
        </p>
        <ul className="space-y-1">
          <li>• Create a function that returns a wrapped function</li>
          <li>• Maintain lastCallTime in closure</li>
          <li>• On each call, check if enough time has passed</li>
          <li>• Execute if interval passed, update timestamp</li>
        </ul>

        <h4>React Hook Implementation</h4>
        <p>
          In React, debouncing and throttling are commonly implemented as custom hooks that handle 
          cleanup automatically:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>useDebounce:</strong> Takes a value and delay, returns debounced value. Uses 
            useState + useEffect with cleanup.
          </li>
          <li>
            <strong>useThrottle:</strong> Takes a value and interval, returns throttled value. Uses 
            useState + useRef for timestamp tracking.
          </li>
          <li>
            <strong>useDebouncedCallback:</strong> Takes a callback and delay, returns debounced 
            callback. Uses useRef for timeout + useCallback for stable reference.
          </li>
          <li>
            <strong>useThrottledCallback:</strong> Takes a callback and interval, returns throttled 
            callback. Uses useRef for timestamp + useCallback.
          </li>
        </ul>

        <h3>Event Flow with Rate Limiting</h3>
        <p>
          The event flow with debouncing:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Event Fires:</strong> User types, scrolls, or triggers the event.
          </li>
          <li>
            <strong>Timer Reset:</strong> Existing timeout is cleared (if any).
          </li>
          <li>
            <strong>New Timer Set:</strong> New timeout starts for the specified delay.
          </li>
          <li>
            <strong>Repeat:</strong> Steps 1-3 repeat for each event in the burst.
          </li>
          <li>
            <strong>Execution:</strong> After the last event + delay, the function executes.
          </li>
        </ol>

        <p>
          The event flow with throttling:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Event Fires:</strong> User types, scrolls, or triggers the event.
          </li>
          <li>
            <strong>Time Check:</strong> Calculate time since last execution.
          </li>
          <li>
            <strong>Decision:</strong> If interval passed, execute and update timestamp. If not, skip.
          </li>
          <li>
            <strong>Repeat:</strong> Steps 1-3 repeat for each event, but execution happens at most 
            once per interval.
          </li>
        </ol>

        <h3>Library Options</h3>
        <p>
          Several libraries provide production-ready debouncing and throttling:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Lodash:</strong> Provides <code>_.debounce</code> and <code>_.throttle</code> with 
            extensive options (leading, trailing, maxWait). Most feature-rich.
          </li>
          <li>
            <strong>Lodash-es:</strong> ES module version of lodash for tree-shaking. Import only what 
            you need.
          </li>
          <li>
            <strong>RxJS:</strong> Provides <code>debounceTime</code> and <code>throttleTime</code> 
            operators for observable streams. More powerful but steeper learning curve.
          </li>
          <li>
            <strong>use-debounce:</strong> React-specific hooks for debouncing values and callbacks. 
            Lightweight, no lodash dependency.
          </li>
          <li>
            <strong>@react-hook/throttle:</strong> React hook for throttling. Similar to use-debounce 
            but for throttling.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <h3>When to Use Debounce vs. Throttle</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Scenario</th>
                <th className="p-3 text-left">Debounce</th>
                <th className="p-3 text-left">Throttle</th>
                <th className="p-3 text-left">Neither</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Search Input</td>
                <td className="p-3 text-green-600">✅ Wait for typing to stop</td>
                <td className="p-3">—</td>
                <td className="p-3">—</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Window Resize</td>
                <td className="p-3 text-green-600">✅ Recalculate after resize stops</td>
                <td className="p-3">—</td>
                <td className="p-3">—</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Auto-save Form</td>
                <td className="p-3 text-green-600">✅ Save after editing stops</td>
                <td className="p-3">—</td>
                <td className="p-3">—</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Scroll Position</td>
                <td className="p-3">—</td>
                <td className="p-3 text-green-600">✅ Regular updates while scrolling</td>
                <td className="p-3">—</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Mouse Move Tracking</td>
                <td className="p-3">—</td>
                <td className="p-3 text-green-600">✅ Smooth updates during movement</td>
                <td className="p-3">—</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Button Click (prevent double)</td>
                <td className="p-3">—</td>
                <td className="p-3 text-green-600">✅ Allow one click per interval</td>
                <td className="p-3">—</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Analytics Events</td>
                <td className="p-3">—</td>
                <td className="p-3 text-green-600">✅ Rate-limit event batching</td>
                <td className="p-3">—</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Simple Click Handler</td>
                <td className="p-3">—</td>
                <td className="p-3">—</td>
                <td className="p-3 text-green-600">✅ No rate limiting needed</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Delay/Interval Selection</h3>
        <p>
          Choosing the right delay is critical for user experience:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Search Debounce:</strong> 150-300ms. Shorter feels responsive, longer reduces API 
            calls. 250ms is a good default.
          </li>
          <li>
            <strong>Auto-save Debounce:</strong> 500-1000ms. Longer to avoid saving incomplete input, 
            but not so long that users worry about data loss.
          </li>
          <li>
            <strong>Resize Debounce:</strong> 100-250ms. Layout recalculation is expensive, but users 
            expect quick response.
          </li>
          <li>
            <strong>Scroll Throttle:</strong> 50-100ms (10-20 updates/second). Smooth enough for 
            progress bars, not so frequent as to cause jank.
          </li>
          <li>
            <strong>Mouse Move Throttle:</strong> 50-100ms. Similar to scroll — frequent enough for 
            smooth tracking, not excessive.
          </li>
          <li>
            <strong>Click Throttle:</strong> 300-500ms. Prevents double-clicks without making the UI 
            feel unresponsive.
          </li>
        </ul>

        <h3>Performance Impact Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Metric</th>
                <th className="p-3 text-left">No Rate Limit</th>
                <th className="p-3 text-left">Debounce (300ms)</th>
                <th className="p-3 text-left">Throttle (100ms)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Search API Calls</td>
                <td className="p-3">20 calls per query</td>
                <td className="p-3">1 call per query</td>
                <td className="p-3">3-5 calls per query</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Scroll Handler</td>
                <td className="p-3">60 calls/second</td>
                <td className="p-3">1 call after scroll stops</td>
                <td className="p-3">10 calls/second</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Main Thread Load</td>
                <td className="p-3">High (blocked frequently)</td>
                <td className="p-3">Low (batched execution)</td>
                <td className="p-3">Medium (spread over time)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">User Feedback</td>
                <td className="p-3">Immediate but janky</td>
                <td className="p-3">Delayed but smooth</td>
                <td className="p-3">Continuous and smooth</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>

        <h3>Use React Hooks for Cleanup</h3>
        <p>
          In React, always use custom hooks that handle cleanup on unmount:
        </p>
        <ul className="space-y-1">
          <li>• Clear timeouts in useEffect cleanup function</li>
          <li>• Use refs to maintain stable timer references</li>
          <li>• Avoid creating new debounced functions each render</li>
          <li>• Use useCallback to stabilize debounced callbacks</li>
        </ul>

        <h3>Choose Appropriate Delays</h3>
        <p>
          Delay selection depends on use case:
        </p>
        <ul className="space-y-1">
          <li>• Search: 150-300ms (balance responsiveness vs. API calls)</li>
          <li>• Auto-save: 500-1000ms (avoid saving incomplete input)</li>
          <li>• Resize: 100-250ms (layout is expensive)</li>
          <li>• Scroll: 50-100ms throttle (smooth tracking)</li>
        </ul>

        <h3>Consider Leading Edge for Immediate Feedback</h3>
        <p>
          For some use cases, you want immediate feedback on the first event:
        </p>
        <ul className="space-y-1">
          <li>• Use leading-edge debounce for button clicks (immediate response, prevent double-clicks)</li>
          <li>• Use throttle (which naturally fires on leading edge) for scroll handlers</li>
          <li>• Consider leading + trailing for search (immediate first result, then debounce follow-ups)</li>
        </ul>

        <h3>Handle Edge Cases</h3>
        <p>
          Production implementations should handle:
        </p>
        <ul className="space-y-1">
          <li>• <strong>Component Unmount:</strong> Clear pending timeouts to prevent state updates on 
            unmounted components</li>
          <li>• <strong>Function Context:</strong> Preserve <code>this</code> context if using in class 
            components</li>
          <li>• <strong>Arguments:</strong> Pass arguments through to the debounced/throttled function</li>
          <li>• <strong>Return Values:</strong> Handle return values appropriately (may be undefined for 
            trailing debounce)</li>
        </ul>

        <h3>Use Passive Event Listeners for Scroll/Touch</h3>
        <p>
          When attaching scroll or touch handlers:
        </p>
        <ul className="space-y-1">
          <li>• Use <code>{'{ passive: true }'}</code> option when adding event listeners</li>
          <li>• This tells the browser the handler won&apos;t call preventDefault()</li>
          <li>• Allows the browser to optimize scrolling performance</li>
          <li>• Especially important for mobile scroll performance</li>
        </ul>

        <h3>Test on Real Devices</h3>
        <p>
          Rate limiting behavior varies by device:
        </p>
        <ul className="space-y-1">
          <li>• Test on low-end mobile devices (not just high-end dev machines)</li>
          <li>• Measure actual execution frequency with console logging</li>
          <li>• Verify user experience feels responsive, not laggy</li>
          <li>• Adjust delays based on real-world testing</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Creating New Debounced Functions Each Render</h3>
        <p>
          Defining the debounced function inside the component body creates a new instance every render, 
          losing the timer state:
        </p>
        <p>
          <strong>Problem:</strong> <code>const debouncedFn = debounce(fn, 300)</code> inside component 
          creates new debounced function each render. Timer resets immediately.
        </p>
        <p>
          <strong>Solution:</strong> Use useRef to maintain stable reference: 
          <code>const fnRef = useRef(debounce(fn, 300))</code>
        </p>

        <h3>Too Long a Delay</h3>
        <p>
          A 1000ms debounce on search feels unresponsive. Users expect feedback within 200-300ms.
        </p>
        <p>
          <strong>Solution:</strong> Use 150-300ms for search, 500-1000ms for auto-save. Test with real 
          users to find the right balance.
        </p>

        <h3>Not Canceling on Unmount</h3>
        <p>
          Debounced timers can fire after the component unmounts, causing state updates on unmounted 
          components:
        </p>
        <p>
          <strong>Problem:</strong> Memory leak warnings, potential crashes.
        </p>
        <p>
          <strong>Solution:</strong> Always clear timeouts in useEffect cleanup function or componentWillUnmount.
        </p>

        <h3>Using Debounce Where Throttle is Needed</h3>
        <p>
          Debouncing a scroll handler means no updates while scrolling — the user sees nothing until 
          they stop:
        </p>
        <p>
          <strong>Problem:</strong> Progress bar doesn&apos;t update during scroll, tooltip lags behind 
          mouse.
        </p>
        <p>
          <strong>Solution:</strong> Use throttle for continuous feedback scenarios (scroll, mouse move, 
          drag operations).
        </p>

        <h3>Not Using Passive Event Listeners</h3>
        <p>
          Scroll and touch handlers without <code>{'{ passive: true }'}</code> can block scrolling:
        </p>
        <p>
          <strong>Problem:</strong> Janky scroll performance, especially on mobile.
        </p>
        <p>
          <strong>Solution:</strong> Always use passive: true for scroll/touch handlers that don&apos;t 
          need to call preventDefault().
        </p>

        <h3>Ignoring maxWait Option</h3>
        <p>
          With pure trailing-edge debounce, if events keep firing, the function may never execute:
        </p>
        <p>
          <strong>Problem:</strong> User types continuously for 10 seconds, search never triggers.
        </p>
        <p>
          <strong>Solution:</strong> Use maxWait option (available in lodash) to guarantee execution 
          after a maximum wait time, even if events continue.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce: Search Autocomplete</h3>
        <p>
          An e-commerce site&apos;s search autocomplete was triggering 10-20 API calls per query as 
          users typed. This overloaded the search service and caused rate limiting.
        </p>
        <p>
          <strong>Solution:</strong> Implemented 250ms trailing-edge debounce on search input.
        </p>
        <p>
          <strong>Results:</strong> API calls reduced by 95% (20 → 1 per query). Search service load 
          decreased significantly. User experience improved (no lag from excessive API calls).
        </p>

        <h3>SaaS Dashboard: Scroll Progress Indicator</h3>
        <p>
          A SaaS dashboard displayed a scroll progress bar that updated on every scroll event. The 
          progress bar calculation was expensive (measuring container heights), causing scroll jank.
        </p>
        <p>
          <strong>Solution:</strong> Implemented 100ms throttle on scroll handler.
        </p>
        <p>
          <strong>Results:</strong> Scroll handler executions reduced from 60/second to 10/second 
          (83% reduction). Scroll performance improved from 30fps to 60fps. Progress bar still felt 
          responsive.
        </p>

        <h3>Form Builder: Auto-Save</h3>
        <p>
          A form builder application auto-saved on every field change. This caused excessive saves 
          and occasional data conflicts when users typed quickly.
        </p>
        <p>
          <strong>Solution:</strong> Implemented 1000ms debounce on form state changes.
        </p>
        <p>
          <strong>Results:</strong> Save operations reduced by 90%. Data conflicts eliminated. Users 
          still felt confident their work was being saved (visible &quot;Saving...&quot; indicator 
          helped).
        </p>

        <h3>Analytics: Event Tracking</h3>
        <p>
          A media site tracked scroll depth for analytics. Sending an event on every scroll event 
          generated millions of unnecessary events daily.
        </p>
        <p>
          <strong>Solution:</strong> Implemented 500ms throttle on scroll depth tracking. Only sent 
          events when scroll depth crossed thresholds (25%, 50%, 75%, 100%).
        </p>
        <p>
          <strong>Results:</strong> Analytics events reduced by 99%. Cost savings on analytics 
          platform. Data quality improved (cleaner signal, less noise).
        </p>

        <h3>Drag-and-Drop: Position Updates</h3>
        <p>
          A drag-and-drop interface updated element positions on every mouse move. Complex layouts 
          caused noticeable lag during drag operations.
        </p>
        <p>
          <strong>Solution:</strong> Implemented 16ms throttle (60fps cap) on mouse move handler.
        </p>
        <p>
          <strong>Results:</strong> Drag performance improved significantly. Visual updates capped 
          at 60fps (matching display refresh rate). CPU usage reduced during drag operations.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What's the difference between debouncing and throttling?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Debouncing and throttling are both rate-limiting techniques, but they work differently:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Debounce:</strong> Waits until the event <em>stops firing</em> for a specified 
                delay, then executes once. Like an elevator door waiting for people to stop entering. 
                Executes <strong>once per burst</strong> after the last event.
              </li>
              <li>
                <strong>Throttle:</strong> Executes at most once per specified interval, regardless of 
                how often the event fires. Like a train schedule running at fixed times. Executes 
                <strong>repeatedly</strong> at regular intervals during continuous events.
              </li>
            </ul>
            <p>
              Use debounce for search inputs, auto-save, and resize handlers. Use throttle for scroll 
              handlers, mouse tracking, and analytics events.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How would you implement debounce from scratch?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">Debounce implementation:</p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Store Timer:</strong> Maintain a timeout ID reference (closure, ref, or instance 
                variable).
              </li>
              <li>
                <strong>Return Wrapped Function:</strong> Return a function that clears existing timeout 
                and sets a new one.
              </li>
              <li>
                <strong>Clear on New Event:</strong> Call clearTimeout to cancel pending execution.
              </li>
              <li>
                <strong>Set New Timer:</strong> Call setTimeout with the specified delay.
              </li>
              <li>
                <strong>Execute on Completion:</strong> When timeout completes, call the original function.
              </li>
            </ul>
            <p>
              Key considerations: preserve function context (this), pass arguments through, handle 
              cleanup on unmount (in React), and optionally support leading edge execution.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: When would you use debounce vs. throttle for a search input?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              For search inputs, <strong>debounce</strong> is almost always the right choice:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Debounce (250-300ms):</strong> Wait for user to finish typing, then trigger 
                search. Reduces API calls from 20+ to 1 per query. User sees results after they stop 
                typing.
              </li>
              <li>
                <strong>Throttle:</strong> Would trigger search every 250ms during typing. User might 
                see intermediate results that change rapidly. More API calls than debounce.
              </li>
            </ul>
            <p>
              Exception: If you want to show &quot;searching...&quot; feedback immediately, use 
              leading-edge debounce or combine with a separate loading state trigger.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you handle cleanup for debounced functions in React?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>useEffect Cleanup:</strong> Return a cleanup function from useEffect that calls 
                clearTimeout on the timeout ID.
              </li>
              <li>
                <strong>useRef for Stability:</strong> Store the debounced function in a ref to prevent 
                recreation on every render.
              </li>
              <li>
                <strong>Custom Hooks:</strong> Use libraries like use-debounce that handle cleanup 
                automatically.
              </li>
              <li>
                <strong>Cancel Method:</strong> Some implementations (lodash) provide a .cancel() method 
                to cancel pending execution.
              </li>
            </ul>
            <p>
              Without cleanup, debounced functions can fire after component unmount, causing state 
              updates on unmounted components and memory leaks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What delay would you choose for different use cases?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Search Input:</strong> 150-300ms. Balance between responsiveness (shorter) and 
                reducing API calls (longer). 250ms is a good default.
              </li>
              <li>
                <strong>Auto-Save:</strong> 500-1000ms. Long enough to avoid saving incomplete input, 
                short enough that users don&apos;t worry about data loss.
              </li>
              <li>
                <strong>Window Resize:</strong> 100-250ms. Layout recalculation is expensive, but users 
                expect quick response.
              </li>
              <li>
                <strong>Scroll Handler:</strong> 50-100ms throttle. Smooth enough for progress bars and 
                parallax, not so frequent as to cause jank.
              </li>
              <li>
                <strong>Button Click:</strong> 300-500ms throttle. Prevents double-clicks without making 
                the UI feel unresponsive.
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What is the maxWait option in lodash debounce?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The maxWait option guarantees execution after a maximum wait time, even if events keep 
              firing:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Problem:</strong> With pure trailing-edge debounce, if events keep firing 
                indefinitely, the function may never execute.
              </li>
              <li>
                <strong>Solution:</strong> maxWait sets an upper bound. After maxWait milliseconds, the 
                function executes regardless of whether events are still firing.
              </li>
              <li>
                <strong>Example:</strong> debounce(fn, 300, {'{'} maxWait: 1000 {'}'}) — normally waits 
                300ms after last event, but guarantees execution within 1000ms even if events continue.
              </li>
            </ul>
            <p>
              Useful for search inputs where users might type continuously — you want to show results 
              even if they haven&apos;t stopped typing.
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
            <a href="https://lodash.com/docs/#debounce" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Lodash — debounce
            </a> — Lodash debounce documentation with maxWait and leading/trailing options.
          </li>
          <li>
            <a href="https://lodash.com/docs/#throttle" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Lodash — throttle
            </a> — Lodash throttle documentation.
          </li>
          <li>
            <a href="https://www.npmjs.com/package/use-debounce" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              use-debounce npm package
            </a> — React hooks for debouncing values and callbacks.
          </li>
          <li>
            <a href="https://rxjs.dev/api/operators/debounceTime" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RxJS — debounceTime
            </a> — RxJS operator for debouncing observable streams.
          </li>
          <li>
            <a href="https://web.dev/optimize-long-tasks/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Optimize Long Tasks
            </a> — Guide on keeping the main thread responsive.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Passive Event Listeners
            </a> — How passive listeners improve scroll performance.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
