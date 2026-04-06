"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-toast-notification-system",
  title: "Design a Toast / Notification System",
  description:
    "Complete LLD solution for a production-grade toast notification system with queueing, stacking, dismissal, persistence, auto-dismiss, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "toast-notification-system",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "toast",
    "notification",
    "queueing",
    "stacking",
    "state-management",
    "accessibility",
    "animation",
  ],
  relatedTopics: [
    "modal-component",
    "notification-center",
    "animation-queuing",
    "state-management",
  ],
};

export default function ToastNotificationSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable toast/notification system for a large-scale
          React application. The system must display transient messages to users
          confirming actions, alerting them to errors, or providing informational
          updates. These toasts should appear at a designated screen position,
          stack intelligently when multiple notifications arrive, auto-dismiss after
          a configurable duration, and support manual dismissal. The system must be
          globally accessible — any component in the application should be able to
          trigger a toast without prop drilling or component tree coupling.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>React 19+ SPA with concurrent features support.</li>
          <li>Multiple toasts can trigger in rapid succession (e.g., bulk operations).</li>
          <li>Toast types: success, error, warning, info, and custom.</li>
          <li>Must support accessibility (screen readers, keyboard navigation, focus management).</li>
          <li>Maximum visible toasts configurable (default: 3-5).</li>
          <li>Application may run in both light and dark mode.</li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Toast Creation:</strong> Any component can call a global API
            (e.g., <code>toast.success()</code>, <code>toast.error()</code>) to
            create and display a toast notification.
          </li>
          <li>
            <strong>Auto-dismiss:</strong> Each toast automatically dismisses after a
            configurable duration (default: 5 seconds for info/success, 10 seconds
            for error/warning).
          </li>
          <li>
            <strong>Manual Dismissal:</strong> Each toast has a close button for manual
            dismissal.
          </li>
          <li>
            <strong>Stacking:</strong> When more toasts exist than the visible limit,
            excess toasts queue and appear only when visible toasts dismiss.
          </li>
          <li>
            <strong>Queue Management:</strong> The system maintains a FIFO queue. When
            a visible toast dismisses, the next queued toast enters the viewport.
          </li>
          <li>
            <strong>Pause on Hover:</strong> Auto-dismiss timer pauses when the user
            hovers over a toast and resumes on mouse leave.
          </li>
          <li>
            <strong>Persistent Toasts:</strong> Some toasts (critical errors) should not
            auto-dismiss and require explicit user action.
          </li>
          <li>
            <strong>Custom Content:</strong> Support custom React nodes as toast content
            (e.g., action buttons, links).
          </li>
          <li>
            <strong>Dismiss All:</strong> API to dismiss all visible toasts at once.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Adding/dismissing a toast should not cause
            visible jank. Animations must run at 60fps using GPU-accelerated properties
            (transform, opacity).
          </li>
          <li>
            <strong>Scalability:</strong> The system should handle 50+ toasts queued
            without memory leaks or performance degradation.
          </li>
          <li>
            <strong>Reliability:</strong> Toasts must not be lost if the user navigates
            between routes. The toast container persists across route changes.
          </li>
          <li>
            <strong>Accessibility:</strong> Toasts must be announced to screen readers
            via ARIA live regions. Keyboard users must be able to dismiss toasts.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for toast options,
            types, and custom content.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Rapid-fire toast creation (e.g., 20 toasts triggered in 1 second from a
            batch API response).
          </li>
          <li>
            Toast triggered during route transition — should it appear on the old route
            or the new route?
          </li>
          <li>
            User hovers over a toast just before auto-dismiss — timer must pause
            reliably.
          </li>
          <li>
            Multiple tabs open — should toasts appear in all tabs or only the
            triggering tab? (Assumption: only the triggering tab.)
          </li>
          <li>
            Toast with extremely long content — must wrap gracefully and not overflow
            the viewport.
          </li>
          <li>
            Server-side rendering — the toast container must not render toasts during
            SSR (they are inherently client-side interactions).
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate the <strong>toast state management</strong> from
          the <strong>toast rendering</strong> using a global store (Zustand) and a
          portal-based rendering strategy. The store manages the toast queue, handles
          auto-dismiss timers, and exposes actions (add, dismiss, dismissAll). The
          rendering layer subscribes to the store, renders visible toasts with entrance/
          exit animations, and manages the stacking layout.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Context API + useReducer:</strong> Viable but requires wrapping the
            app in a Provider and consumes context in every toast-triggering component.
            Adds coupling to the component tree. Zustand provides the same functionality
            with less boilerplate and better performance (selectors prevent unnecessary
            re-renders).
          </li>
          <li>
            <strong>Redux:</strong> Overkill for this use case. Requires boilerplate
            (actions, reducers, middleware for timers) and introduces global state that
            is unnecessary for a transient UI pattern.
          </li>
          <li>
            <strong>Event Emitter (pub/sub):</strong> Lightweight but lacks reactivity.
            Components would need to manually subscribe/unsubscribe and manage local
            state for visibility. More error-prone.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + Portal is optimal:</strong> Zustand provides a
          lightweight, selector-based global store with zero boilerplate. The toast
          container renders via React Portal to a DOM node outside the application tree,
          ensuring toasts are always on top (z-index isolation) and unaffected by parent
          component CSS (overflow: hidden, position: relative). This pattern is used by
          production libraries like Sonner and react-hot-toast.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of four modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Toast Store (<code>toast-store.ts</code>)</h4>
          <p>
            Manages the global toast state using Zustand. Exposes actions for adding,
            dismissing, and clearing toasts. Handles auto-dismiss timer logic via
            <code>setTimeout</code> with cleanup on unmount.
          </p>
          <p className="mt-3">
            <strong>State shape:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>toasts: Toast[]</code> — ordered array of toast objects
            </li>
            <li>
              <code>visibleLimit: number</code> — max toasts rendered at once (default: 3)
            </li>
            <li>
              <code>timers: Map&lt;string, number&gt;</code> — active setTimeout IDs keyed by toast ID
            </li>
          </ul>
          <p className="mt-3">
            <strong>Actions:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>addToast(toast: Partial&lt;Toast&gt;)</code> — creates toast with defaults, starts timer
            </li>
            <li>
              <code>dismissToast(id: string)</code> — removes toast, clears timer
            </li>
            <li>
              <code>dismissAll()</code> — clears all toasts and timers
            </li>
            <li>
              <code>pauseTimer(id: string)</code> — pauses auto-dismiss for a toast
            </li>
            <li>
              <code>resumeTimer(id: string)</code> — resumes auto-dismiss with remaining time
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Toast Types &amp; Interfaces (<code>toast-types.ts</code>)</h4>
          <p>
            Defines the <code>ToastType</code> union (<code>success | error | warning | info | custom</code>),
            the <code>Toast</code> interface with fields for id, type, title, message, duration, action,
            onDismiss callback, and createdAt. The <code>ToastOptions</code> interface allows callers to
            customize duration, position, and persistent flag. See the Example tab for the complete type definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Toast Container (<code>toast-container.tsx</code>)</h4>
          <p>
            Renders toasts in a stacked layout using a fixed-position container. Subscribes
            to the Zustand store via selectors to get visible toasts only. Renders each
            toast with entrance/exit animations (Framer Motion or CSS transitions). Handles
            hover pause/resume via mouse event listeners.
          </p>
          <p className="mt-3">
            <strong>Component tree:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <code>ToastContainer</code> — portal wrapper, subscribes to store
            </li>
            <li>
              <code>ToastStack</code> — renders visible toasts in vertical stack
            </li>
            <li>
              <code>ToastItem</code> — individual toast with type-based styling, close button
            </li>
            <li>
              <code>ToastIcon</code> — renders type-specific icon (checkmark, X, warning triangle)
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Toast API (<code>toast-api.ts</code>)</h4>
          <p>
            Convenience functions that wrap store actions. Exported as a singleton so any
            module can call <code>toast.success(&quot;Saved!&quot;)</code> without importing React
            or hooks. See the Example tab for the complete singleton API implementation.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store is the single source of truth for toast state. Toasts are
          appended to the array in insertion order. The container computes which toasts
          are visible by slicing the first <code>visibleLimit</code> items. Queue
          management is implicit — toasts beyond the visible limit simply are not
          rendered until earlier toasts are dismissed.
        </p>
        <p>
          Timer management is the most complex part. Each toast with a duration gets a
          <code>setTimeout</code> stored in a Map. When the timer fires, it calls
          <code>dismissToast(id)</code>. If the user pauses (hover), the timer is
          cleared and the remaining time is stored on the toast object. On resume, a new
          <code>setTimeout</code> is created with the remaining time. This prevents
          toasts from disappearing immediately after hover ends.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Architecture</h3>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/toast-notification-architecture.svg"
          alt="Toast notification system architecture showing API, Store, Container, and Item interactions"
          caption="Toast architecture: API → Zustand Store → ToastContainer (Portal) → ToastItems"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Component calls <code>toast.success(&quot;Order placed&quot;)</code>.
          </li>
          <li>
            <code>toast.success</code> calls <code>useToastStore.getState().addToast()</code>.
          </li>
          <li>
            Store creates toast object with unique ID, pushes to array, starts auto-dismiss
            timer.
          </li>
          <li>
            Zustand notifies subscribers. ToastContainer re-renders with new visible toast.
          </li>
          <li>
            ToastItem renders with entrance animation (slide-in from right + fade).
          </li>
          <li>
            User hovers over toast: onMouseEnter pauses timer, onMouseLeave resumes it.
          </li>
          <li>
            Timer fires or user clicks close: store calls dismissToast(id), removes toast
            from array, clears timer.
          </li>
          <li>
            ToastItem renders exit animation (slide-out + fade), then unmounts.
          </li>
          <li>
            Next queued toast (if any) becomes visible and renders.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional data flow pattern. All state
          mutations flow through the Zustand store, and all rendering flows from store
          subscriptions. This ensures predictable behavior and makes the system testable
          in isolation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Rapid-fire creation:</strong> Each call to <code>addToast</code> is
            synchronous and appends to the array. Only the first N (visibleLimit) render.
            The rest queue without performance impact. Store operations are O(1) amortized.
          </li>
          <li>
            <strong>Route transitions:</strong> The ToastContainer is rendered at the app
            root (e.g., in layout.tsx), so it persists across route changes. Toasts remain
            visible during navigation.
          </li>
          <li>
            <strong>Hover near dismiss:</strong> The remaining time is calculated as
            <code>duration - (Date.now() - createdAt - pausedTime)</code>. This ensures
            accurate remaining time even after multiple pause/resume cycles.
          </li>
          <li>
            <strong>SSR safety:</strong> The ToastContainer uses a useEffect to mount the
            portal, ensuring it only renders on the client. During SSR, the container
            returns null.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 7 files:
            Zustand store with timer management, Portal-based container, ToastItem with
            ARIA and animations, ToastIcon, type definitions, singleton API, and a full
            EXPLANATION.md walkthrough. Click the <strong>Example</strong> toggle at the
            top of the article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Zustand Store (toast-store.ts)</h3>
        <p>
          The store manages the toast queue, auto-dismiss timers, and queue management.
          Key design decisions include: using <code>crypto.randomUUID()</code> for stable
          IDs, storing timer references in a <code>Map</code> for O(1) lookup and cleanup,
          and computing remaining time dynamically for accurate pause/resume behavior.
          Default durations vary by type (5s for info/success, 10s for error, 8s for warning).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Toast Types (toast-types.ts)</h3>
        <p>
          Defines the <code>Toast</code> interface with optional title, message (string or
          ReactNode), duration, action button, onDismiss callback, and createdAt timestamp.
          The <code>ToastOptions</code> interface allows callers to customize duration,
          position, and persistent flag.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Toast Container (toast-container.tsx)</h3>
        <p>
          Renders via React Portal to <code>document.body</code>, ensuring z-index isolation.
          Uses <code>useState</code> + <code>useEffect</code> for SSR-safe mounting. Subscribes
          to the store via selector to get only visible toasts (slice of first N items). The
          container is fixed-position (e.g., <code>fixed top-4 right-4 z-50</code>) with a
          flex column layout and gap between toasts.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Toast Item (toast-item.tsx)</h3>
        <p>
          Individual toast component with type-based color styling, close button, hover
          pause/resume lifecycle, entrance/exit animations (CSS transitions on transform
          and opacity for GPU compositing), and ARIA attributes for accessibility. Manages
          its own mount/unmount animation state to avoid layout thrashing.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Toast Icon (toast-icon.tsx)</h3>
        <p>
          Renders type-specific SVG icons: green checkmark for success, red X for error,
          yellow warning triangle for warning, blue info circle for info. Uses inline SVG
          to avoid external asset dependencies.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Toast API (toast-api.ts)</h3>
        <p>
          Singleton convenience functions wrapping store actions. Exports <code>toast</code>
          object with <code>success()</code>, <code>error()</code>, <code>warning()</code>,
          <code>info()</code>, <code>custom()</code>, <code>dismiss()</code>, and
          <code>dismissAll()</code> methods. Can be called from any module without React
          imports: <code>{"import { toast } from '@/lib/toast-api'"}</code>.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">addToast</td>
                <td className="p-2">O(1) — array push</td>
                <td className="p-2">O(n) — stores n toasts</td>
              </tr>
              <tr>
                <td className="p-2">dismissToast</td>
                <td className="p-2">O(n) — array filter</td>
                <td className="p-2">O(1) — removes one entry</td>
              </tr>
              <tr>
                <td className="p-2">getVisibleToasts</td>
                <td className="p-2">O(k) — slice first k</td>
                <td className="p-2">O(k) — k visible toasts</td>
              </tr>
              <tr>
                <td className="p-2">Timer operations</td>
                <td className="p-2">O(1) — Map lookup</td>
                <td className="p-2">O(n) — n active timers</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is total toasts in queue and <code>k</code> is the visible
          limit (typically 3-5). For 50 queued toasts, operations remain sub-millisecond.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Array filter on dismiss:</strong> O(n) operation on every dismiss.
            For extremely large queues (500+ toasts), this could degrade. Mitigation: use
            a linked list or Set for O(1) removal. In practice, n is small enough that
            filter is faster than the overhead of alternative structures.
          </li>
          <li>
            <strong>Re-render cascades:</strong> If the store subscriber selects the
            entire toast array, every add/dismiss triggers a re-render of all ToastItems.
            Mitigation: use Zustand selectors to subscribe to individual toasts by ID, so
            only the affected ToastItem re-renders.
          </li>
          <li>
            <strong>Animation jank:</strong> Animating layout properties (top, height)
            triggers expensive layout recalculations. Mitigation: animate only transform
            (translateY) and opacity, which are GPU-composited.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Stable IDs:</strong> Use <code>crypto.randomUUID()</code> for stable,
            unique IDs. Avoid array index as key (causes animation bugs on removal).
          </li>
          <li>
            <strong>Selector-based subscriptions:</strong> Each ToastItem subscribes to
            its own toast by ID. Adding a new toast only re-renders the container, not
            existing items.
          </li>
          <li>
            <strong>will-change hint:</strong> Apply <code>will-change: transform, opacity</code>
            to ToastItem during animation to promote to its own compositor layer.
          </li>
          <li>
            <strong>Batch rapid toasts:</strong> If 10+ toasts arrive within 100ms, batch
            them into a single grouped notification (e.g., &quot;15 items processed&quot;)
            rather than rendering individually.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          Toast messages may contain user-generated content (e.g., server error messages,
          validation feedback). If rendered as React nodes via <code>dangerouslySetInnerHTML</code>
          or custom content, they are XSS vectors. Always sanitize HTML content before
          rendering. Prefer rendering strings as text content (React&apos;s default
          escaping) and only allow React nodes from trusted sources (internal components).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              Each toast is focusable via <code>tabindex=&quot;0&quot;</code>.
            </li>
            <li>
              The close button is a native <code>&lt;button&gt;</code> element,
              automatically keyboard-accessible.
            </li>
            <li>
              Pressing <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Escape</kbd>
              dismisses the most recent toast (global hotkey, configurable).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              The toast container includes an <code>aria-live=&quot;polite&quot;</code> region
              for non-critical toasts (info, success) and <code>aria-live=&quot;assertive&quot;</code>
              for critical toasts (error, warning).
            </li>
            <li>
              Each toast has <code>role=&quot;status&quot;</code> for status messages or
              <code>role=&quot;alert&quot;</code> for error/warning toasts.
            </li>
            <li>
              Screen readers announce the toast message when it appears. The auto-dismiss
              does not interrupt ongoing screen reader speech (polite region).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Roles and Semantics</h4>
          <p>
            Toasts use <code>role=&quot;status&quot;</code> for informational messages and
            <code>role=&quot;alert&quot;</code> for errors, wrapped in
            <code>aria-live</code> regions (<code>polite</code> for info,
            <code>assertive</code> for errors). The close button has
            <code>aria-label=&quot;Dismiss notification&quot;</code>. See the Example tab
            for the exact markup.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li>
            <strong>Rate limiting:</strong> Cap toast creation at 10 per second to prevent
            accidental or malicious flooding (e.g., a buggy loop calling toast.error in
            a useEffect without dependency array).
          </li>
          <li>
            <strong>Deduplication:</strong> If an identical toast (same message + type) is
            already visible, increment a counter on it rather than creating a duplicate.
            This prevents spam from repeated API retries.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Store actions:</strong> Test addToast creates toast with correct defaults,
            dismissToast removes it and clears timer, dismissAll clears everything,
            pauseTimer/resumeTimer correctly adjusts remaining time.
          </li>
          <li>
            <strong>Timer behavior:</strong> Mock <code>setTimeout</code> and verify that
            auto-dismiss fires after the correct duration. Test that pause/resume adjusts
            the timer correctly.
          </li>
          <li>
            <strong>Queue management:</strong> Verify that only visibleLimit toasts are
            returned by the selector. Test that dismissing a visible toast makes the next
            queued toast visible.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Toast rendering lifecycle:</strong> Render ToastContainer, call
            <code>toast.success()</code>, assert toast appears in DOM. Wait for duration,
            assert toast is removed. Test manual dismiss via close button.
          </li>
          <li>
            <strong>Hover pause:</strong> Render toast, fire mouseEnter, advance timers
            beyond duration, assert toast is still present. Fire mouseLeave, advance timers
            for remaining time, assert toast is removed.
          </li>
          <li>
            <strong>Multiple toasts:</strong> Create 5 toasts rapidly, assert only 3 render
            (with visibleLimit=3). Dismiss first, assert 4th appears.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            SSR rendering: verify ToastContainer returns null during SSR and mounts
            correctly on hydration.
          </li>
          <li>
            Toast with extremely long message: verify text wraps, container does not
            overflow viewport.
          </li>
          <li>
            Rapid-fire 50 toasts: verify no memory leaks, all timers cleaned up, final
            state is empty after all dismiss.
          </li>
          <li>
            Accessibility: run axe-core automated checks on rendered toasts, verify
            aria-live regions, role attributes, and keyboard dismiss.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Using local state instead of global state:</strong> Candidates often
            implement toasts as local component state, requiring prop drilling or context
            consumption in every component that needs to show a toast. Interviewers expect
            a global, decoupled mechanism (store, event bus, or imperative API).
          </li>
          <li>
            <strong>Forgetting timer cleanup:</strong> Not clearing setTimeout on unmount
            or on manual dismiss causes memory leaks and stale closures. Always store
            timer IDs and clear them in cleanup functions.
          </li>
          <li>
            <strong>Animating expensive properties:</strong> Animating <code>height</code>,
            <code>margin</code>, or <code>top</code> triggers layout recalculations.
            Interviewers look for candidates who know to animate only <code>transform</code>
            and <code>opacity</code> for 60fps animations.
          </li>
          <li>
            <strong>Ignoring accessibility:</strong> Rendering toasts without ARIA live
            regions means screen reader users never hear the messages. This is a critical
            oversight in production systems.
          </li>
          <li>
            <strong>Not handling queue overflow:</strong> Without a visible limit, 50
            toasts stack and push content off-screen. Interviewers expect candidates to
            discuss queue management and stacking strategies.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Zustand vs Context API</h4>
          <p>
            Context API causes re-renders of all consumers when the context value changes,
            unless you split context into granular pieces. Zustand uses selectors under the
            hood, so only components whose selected state changes re-render. For a toast
            system where every ToastItem should only re-render when its own toast changes,
            Zustand is a better fit. However, for simpler applications, Context API is
            perfectly acceptable and avoids an external dependency.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Portal vs Inline Rendering</h4>
          <p>
            Rendering toasts inline (inside the component tree) means they are subject to
            parent CSS (overflow: hidden, z-index stacking contexts). Portals escape these
            constraints by rendering directly into document.body. The trade-off is that
            portal-rendered components are outside the normal React tree, making context
            consumption trickier (though React 18+ handles this well). For toasts, portals
            are the right choice because z-index isolation is non-negotiable.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">FIFO vs Priority Queue</h4>
          <p>
            A simple FIFO queue works for most cases. But in enterprise applications, an
            error toast (e.g., &quot;Payment failed&quot;) should take priority over an
            info toast (e.g., &quot;File synced&quot;). A priority queue ensures critical
            messages surface first. The trade-off is implementation complexity — you need
            to compare priorities on insertion and potentially reorder the queue. For
            most applications, FIFO is sufficient; priority queues are justified for
            high-noise environments (monitoring dashboards, trading platforms).
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add toast grouping (e.g., &quot;3 new messages&quot; instead
              of 3 individual toasts)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>group</code> field to the Toast interface. When a new toast
              arrives, check if a toast with the same group is already visible. If yes,
              increment a counter on that toast and update its message (e.g., &quot;Order
              placed (3)&quot;). If no, create a new toast. The counter renders as a badge.
              On dismiss, all grouped toasts dismiss together.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you persist toasts across page refreshes?
            </p>
            <p className="mt-2 text-sm">
              A: Serialize the toast array to localStorage or IndexedDB before unloading
              (beforeunload event). On mount, deserialize and re-add them to the store.
              Only persistent toasts (marked by the caller) should be saved. Auto-dismiss
              timers need adjustment — recalculate remaining time based on
              <code>Date.now() - toast.createdAt</code>.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you test toast animations in CI?
            </p>
            <p className="mt-2 text-sm">
              A: Use Playwright with <code>toHaveCSS</code> assertions on animated
              properties at specific time intervals. Alternatively, use visual regression
              testing (Percy, Chromatic) to capture snapshots at animation milestones
              (0ms, 150ms, 300ms). For unit tests, mock the animation library and assert
              that the correct animation classes/keyframes are applied.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What if the toast message contains sensitive data (e.g., PII)?
            </p>
            <p className="mt-2 text-sm">
              A: Avoid rendering PII in toasts. If unavoidable, add a
              <code>sensitive</code> flag that renders the toast with a
              <code>user-select: none</code> style and disables text copying. For screen
              readers, use <code>aria-hidden=&quot;true&quot;</code> on the message and
              provide a generic announcement (e.g., &quot;Action completed&quot;). In
              high-security environments, toasts should only contain generic status
              messages, with details available in a secure audit log.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle concurrent React (React 18+)?
            </p>
            <p className="mt-2 text-sm">
              A: The Zustand store is synchronous and external to React&apos;s rendering
              cycle, so it works correctly with concurrent features. The ToastContainer
              uses useSyncExternalStore for subscription synchronization. Toast rendering
              is wrapped in <code>startTransition</code> to avoid blocking urgent updates
              (user input). Animations use CSS transitions, which run on the compositor
              thread independent of React&apos;s scheduler.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add sound alerts for critical toasts?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>sound</code> field to the Toast interface. When rendering a
              toast with <code>sound: true</code>, play an audio file using the Web Audio
              API or an <code>&lt;audio&gt;</code> element. Preload the sound file at app
              startup to avoid network latency. Respect the user&apos;s system preferences
              — check <code>prefers-reduced-motion</code> and provide a mute toggle in
              app settings. Sound should only play for assertive toasts (error, critical
              alerts), not for info or success.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://sonner.emilkowal.ski/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sonner — Toast Component Used as Reference Architecture
            </a>
          </li>
          <li>
            <a
              href="https://react-hot-toast.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Hot Toast — Lightweight Toast Library
            </a>
          </li>
          <li>
            <a
              href="https://zustand-demo.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Library Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/alert/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Alert Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/notifications"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Notification UX Patterns and Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/wai-aria/#aria-live"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA — aria-live Region Specification
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
