"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-modal-component",
  title: "Design a Modal / Dialog Component",
  description:
    "Complete LLD solution for a production-grade modal component supporting multiple types (confirm, alert, custom), global control, focus trapping, z-index stacking, ARIA dialog pattern, and SSR-safe portal rendering.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "modal-component",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "modal",
    "dialog",
    "focus-trap",
    "accessibility",
    "portal",
    "state-management",
    "z-index",
  ],
  relatedTopics: [
    "toast-notification-system",
    "drawer-component",
    "popover-component",
    "state-management",
  ],
};

export default function ModalComponentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable Modal (dialog) component for a large-scale
          React application. The modal must support multiple types — confirmation
          dialogs (yes/no), alerts (OK only), and custom content modals (arbitrary
          React nodes) — and must be openable or closable from anywhere in the
          application via a global API, without prop drilling or component tree
          coupling. The modal must trap keyboard focus within its boundaries,
          render above all other content via proper z-index stacking, dismiss on
          backdrop click and Escape key, lock body scroll while open, and follow
          the WAI-ARIA dialog pattern for screen-reader accessibility. The
          component must be SSR-safe, support entrance/exit animations, and clean
          up all side effects on unmount.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <li>
            Only one modal is visible at a time, but the architecture should support
            z-index stacking for future multi-modal scenarios.
          </li>
          <li>
            Modal types include: confirm (title, message, yes/no actions), alert
            (title, message, OK only), and custom (arbitrary React content with
            optional header/footer).
          </li>
          <li>
            The system must support full accessibility: focus trap, Escape dismissal,
            ARIA dialog semantics, and screen-reader announcements.
          </li>
          <li>
            The modal must render via a React Portal to <code>document.body</code> to
            escape parent CSS constraints.
          </li>
          <li>
            Body scroll must be locked when the modal is open (prevent background
            scrolling while modal content scrolls independently).
          </li>
          <li>
            The application may run in both light and dark mode.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Modal Creation:</strong> Any component can call a global API
            (e.g., <code>modal.confirm()</code>, <code>modal.alert()</code>,
            <code>modal.open()</code>) to open a modal from anywhere in the app.
          </li>
          <li>
            <strong>Modal Types:</strong> The system supports three modal types:
            <em>confirm</em> (title, message, Yes/No buttons, returns boolean
            promise), <em>alert</em> (title, message, OK button), and
            <em>custom</em> (arbitrary React node content with optional header
            and footer).
          </li>
          <li>
            <strong>Dismissal:</strong> Modals dismiss on: backdrop click, Escape
            key press, explicit close button click, or programmatic API call.
          </li>
          <li>
            <strong>Focus Trap:</strong> While the modal is open, Tab and
            Shift+Tab must cycle focus only among focusable elements within the
            modal. Focus must return to the previously focused element on close.
          </li>
          <li>
            <strong>Scroll Lock:</strong> The body element must have
            <code>overflow: hidden</code> applied while the modal is open to
            prevent background scrolling. The modal content area must scroll
            independently if content overflows.
          </li>
          <li>
            <strong>Promise-based Result:</strong> Confirm modals return a
            <code>Promise&lt;boolean&gt;</code> that resolves to <code>true</code>
            (yes) or <code>false</code> (no), enabling <code>async/await</code>
            call-site ergonomics.
          </li>
          <li>
            <strong>Z-index Stacking:</strong> Each modal opens at a progressively
            higher z-index, ensuring new modals always appear above existing ones.
          </li>
          <li>
            <strong>Animation:</strong> Backdrop fades in/out; modal content scales
            in/out with a subtle translateY transition.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Opening/closing a modal must not cause
            visible jank. Animations must run at 60fps using GPU-accelerated
            properties (transform, opacity).
          </li>
          <li>
            <strong>Accessibility:</strong> Full WAI-ARIA dialog pattern compliance:
            <code>role=&quot;dialog&quot;</code>, <code>aria-modal=&quot;true&quot;</code>,
            <code>aria-labelledby</code> pointing to the title, focus trap, Escape
            dismissal, focus restoration on close.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for modal options,
            types, custom content, and promise-based results.
          </li>
          <li>
            <strong>SSR Safety:</strong> The modal container must not render during
            SSR (modals are inherently client-side interactions). No hydration
            mismatches.
          </li>
          <li>
            <strong>Memory Cleanup:</strong> All event listeners, timers, and
            side effects must be cleaned up on unmount to prevent memory leaks.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Modal triggered during route transition — should it appear on the old
            route or the new route? (Assumption: the modal is route-agnostic since
            it renders at app root via portal.)
          </li>
          <li>
            User clicks backdrop while modal content is animating in — dismissal
            should be deferred until animation completes.
          </li>
          <li>
            Modal with content taller than the viewport — modal content area must
            scroll independently, header and footer remain sticky.
          </li>
          <li>
            No focusable elements inside the modal — the modal container itself
            must be focusable to satisfy the focus-trap requirement.
          </li>
          <li>
            Multiple rapid modal open calls — only the last one should render (or
            queue them if multi-modal support is desired).
          </li>
          <li>
            Server-side rendering — the modal container must not render during SSR
            and must mount cleanly on hydration without mismatches.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate the <strong>modal state management</strong> from
          the <strong>modal rendering</strong> using a global store (Zustand) and a
          portal-based rendering strategy. The store manages the current modal state
          (type, content, options), exposes actions (open, close, confirm, cancel),
          and resolves promise-based results for confirm modals. The rendering layer
          subscribes to the store, renders the appropriate modal type with
          entrance/exit animations, manages the focus trap, and handles backdrop
          dismissal.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Context API + useReducer:</strong> Viable but requires wrapping
            the app in a Provider and consuming context in every modal-triggering
            component. Zustand provides the same functionality with less boilerplate
            and better performance (selectors prevent unnecessary re-renders).
          </li>
          <li>
            <strong>Imperative ref-based modal:</strong> Exposing an imperative handle
            via <code>useImperativeHandle</code> and managing modal state in a parent
            component. This creates tight coupling between the modal and its parent,
            making it difficult to trigger modals from deeply nested components or
            non-React code (e.g., API interceptors).
          </li>
          <li>
            <strong>Third-party libraries (e.g., Radix Dialog, Headless UI):</strong>
            Production-ready and accessible, but interviewers expect candidates to
            understand the underlying mechanics (focus trap, portal, ARIA attributes,
            scroll lock) rather than delegating to a library.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + Portal is optimal:</strong> Zustand provides a
          lightweight, selector-based global store with zero boilerplate. The modal
          container renders via React Portal to a DOM node outside the application
          tree, ensuring the modal is always on top (z-index isolation) and unaffected
          by parent component CSS (overflow: hidden, position: relative). This pattern
          is used by production libraries like Radix UI and Headless UI.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of six modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Modal Types &amp; Interfaces (<code>modal-types.ts</code>)</h4>
          <p>
            Defines the <code>ModalType</code> union (<code>confirm | alert | custom</code>),
            the base <code>ModalOptions</code> interface with fields for id, type, title,
            message, content (ReactNode for custom modals), onConfirm/onCancel callbacks,
            closeOnBackdropClick, closeOnEscape, and zIndex. The <code>ModalResult</code>
            type represents the outcome of a confirm modal (<code>true | false | null</code>).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Modal Store (<code>modal-store.ts</code>)</h4>
          <p>
            Manages the global modal state using Zustand. Exposes actions for opening
            each modal type, closing, confirming, and cancelling. For confirm modals,
            it manages a <code>Promise</code> with resolve/reject functions stored in a
            ref, enabling <code>async/await</code> call-site ergonomics. Also manages
            z-index stacking via an auto-incrementing counter.
          </p>
          <p className="mt-3">
            <strong>State shape:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>currentModal: ModalOptions | null</code> — active modal config
            </li>
            <li>
              <code>zIndex: number</code> — current z-index for the modal
            </li>
            <li>
              <code>isOpen: boolean</code> — whether any modal is visible
            </li>
          </ul>
          <p className="mt-3">
            <strong>Actions:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>openConfirm(options)</code> — opens confirm modal, returns Promise
            </li>
            <li>
              <code>openAlert(options)</code> — opens alert modal
            </li>
            <li>
              <code>openCustom(options)</code> — opens custom content modal
            </li>
            <li>
              <code>close()</code> — closes current modal, resolves promise if confirm
            </li>
            <li>
              <code>confirm()</code> — resolves promise with true, closes modal
            </li>
            <li>
              <code>cancel()</code> — resolves promise with false, closes modal
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Focus Trap Hook (<code>use-focus-trap.ts</code>)</h4>
          <p>
            Custom React hook that implements keyboard focus trapping within a modal
            container. Uses <code>useEffect</code> to attach a <code>keydown</code> listener
            that intercepts Tab/Shift+Tab and cycles focus among all focusable elements
            within the container. Stores the previously focused element and restores
            focus on cleanup. See the Example tab for the complete implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Backdrop Component (<code>modal-backdrop.tsx</code>)</h4>
          <p>
            Semi-transparent overlay covering the entire viewport. Renders behind the
            modal content, dims the background, and dismisses the modal on click (if
            <code>closeOnBackdropClick</code> is enabled). Uses CSS animations for
            fade-in/fade-out. See the Example tab for the complete implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Modal Component (<code>modal-component.tsx</code>)</h4>
          <p>
            The modal panel itself. Renders the appropriate UI based on modal type
            (confirm: title + message + Yes/No buttons; alert: title + message + OK
            button; custom: arbitrary content with optional header/footer). Manages
            entrance/exit animations, calls the focus trap hook, and sets ARIA
            attributes. See the Example tab for the complete implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Modal Container (<code>modal-container.tsx</code>)</h4>
          <p>
            Portal-based wrapper that subscribes to the Zustand store. Renders the
            backdrop and modal component when <code>isOpen</code> is true. Handles
            scroll lock on the body element, Escape key dismissal, and cleanup on
            unmount. See the Example tab for the complete implementation.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store is the single source of truth for modal state. Only one
          modal is visible at a time (stored as <code>currentModal | null</code>). When
          a new modal opens, it replaces the current one. For confirm modals, the store
          creates a <code>Promise</code> and stores its <code>resolve</code> function.
          When the user clicks Yes or No, the store calls <code>resolve(true)</code> or
          <code>resolve(false)</code> respectively, then clears the modal state. This
          enables the caller to <code>await modal.confirm()</code> and get the result
          directly.
        </p>
        <p>
          Z-index management uses a simple auto-incrementing counter starting at 1000.
          Each new modal gets <code>zIndex = BASE_Z_INDEX + stackDepth</code>. When a
          modal closes, the counter decrements. This ensures that if multi-modal support
          is added later, newer modals always appear above older ones.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Focus Trap Mechanics</h3>
        <p>
          The focus trap is the most complex part of the modal. On open, it stores a
          reference to the currently focused element (the &quot;trigger&quot; element).
          It then identifies all focusable elements within the modal (buttons, inputs,
          links, elements with <code>tabIndex</code>). When the user presses Tab, the
          listener checks if the next element in tab order is outside the modal — if
          so, it wraps focus to the first focusable element inside. Shift+Tab does the
          reverse, wrapping to the last focusable element. On close, focus is restored
          to the trigger element.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/modal-component-architecture.svg"
          alt="Modal Component Architecture"
          caption="Architecture of the modal component system showing Zustand store, portal rendering, and focus trap"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Component calls <code>const result = await modal.confirm(&quot;Delete?&quot;)</code>.
          </li>
          <li>
            <code>modal.confirm</code> calls <code>useModalStore.getState().openConfirm()</code>,
            which creates the modal config, creates a Promise, stores its resolve function,
            and sets <code>isOpen = true</code>.
          </li>
          <li>
            Zustand notifies subscribers. ModalContainer re-renders with backdrop and
            modal panel.
          </li>
          <li>
            ModalContainer applies scroll lock to body, mounts via portal.
          </li>
          <li>
            ModalPanel renders with entrance animation (scale + fade), focus trap hook
            activates, focus moves to first focusable element.
          </li>
          <li>
            User clicks &quot;Yes&quot;: store calls <code>confirm()</code>, resolves
            Promise with <code>true</code>, sets <code>isOpen = false</code>.
          </li>
          <li>
            ModalPanel renders exit animation, unmounts. ModalContainer removes scroll
            lock, restores focus to trigger element.
          </li>
          <li>
            The original <code>await</code> call resolves with <code>true</code>.
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
            <strong>Rapid open/close:</strong> If <code>modal.confirm()</code> is called
            and immediately followed by <code>modal.close()</code>, the Promise still
            resolves (with <code>null</code>, indicating dismissal without explicit
            choice). The store handles this by always resolving the pending Promise on
            close, regardless of the dismissal reason.
          </li>
          <li>
            <strong>Route transitions:</strong> The ModalContainer is rendered at the app
            root (e.g., in layout.tsx), so it persists across route changes. Any open
            modal remains visible during navigation.
          </li>
          <li>
            <strong>No focusable elements:</strong> If the modal content has no focusable
            elements, the focus trap sets <code>{`tabIndex={-1}`}</code> on the modal
            container itself, ensuring the container receives focus and the trap logic
            has a valid target.
          </li>
          <li>
            <strong>SSR safety:</strong> The ModalContainer uses a useEffect to mount the
            portal, ensuring it only renders on the client. During SSR, the container
            returns null.
          </li>
          <li>
            <strong>Backdrop click during animation:</strong> A flag (<code>isAnimating</code>)
            prevents backdrop dismissal during entrance/exit animations. The flag is set
            to <code>true</code> on open and reset to <code>false</code> after the
            animation duration elapses (via <code>setTimeout</code>).
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
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 7 files:
            TypeScript type definitions, Zustand store with promise-based confirm API,
            focus-trap custom hook, portal-based container, backdrop component,
            modal panel with type-specific rendering, and a full EXPLANATION.md
            walkthrough. Click the <strong>Example</strong> toggle at the
            top of the article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Modal Types (modal-types.ts)</h3>
        <p>
          Defines the <code>ModalType</code> union (<code>confirm | alert | custom</code>),
          the <code>ModalOptions</code> interface with optional title, message, content
          (ReactNode), onConfirm/onCancel callbacks, closeOnBackdropClick, closeOnEscape,
          and zIndex. The <code>ModalResult</code> type is
          <code>true | false | null</code>, where <code>null</code> indicates dismissal
          without explicit user choice (e.g., backdrop click, Escape key).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Zustand Store (modal-store.ts)</h3>
        <p>
          The store manages the modal state, z-index stacking, and promise-based confirm
          results. Key design decisions include: storing the Promise resolver in a ref
          (not in Zustand state, since it is not reactive), auto-incrementing z-index
          for stacking support, and always resolving the pending Promise on close to
          prevent unhandled Promise rejections.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Focus Trap Hook (use-focus-trap.ts)</h3>
        <p>
          Custom hook accepting a ref to the modal container. On mount, stores the
          currently active element. On Tab/Shift+Tab, intercepts the event and cycles
          focus among all focusable elements within the container using
          <code>querySelectorAll</code> with a focusable selector
          (<code>button, [href], input, select, textarea, [tabindex]:not([tabindex=&quot;-1&quot;])</code>).
          On cleanup, restores focus to the stored element.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Backdrop (modal-backdrop.tsx)</h3>
        <p>
          Renders a full-viewport semi-transparent overlay with CSS fade animation.
          Accepts <code>onDismiss</code> callback and <code>zIndex</code> props. Uses
          <code>position: fixed</code> with <code>inset: 0</code> to cover the entire
          viewport. Background color uses CSS variable for dark-mode support.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Modal Panel (modal-component.tsx)</h3>
        <p>
          Renders the modal panel with type-specific UI. For confirm modals: title,
          message, Yes/No buttons. For alert modals: title, message, OK button. For
          custom modals: arbitrary content with optional header (title + close button)
          and footer. Manages entrance/exit animations via CSS classes and
          <code>requestAnimationFrame</code> for timing. Calls the focus trap hook
          with a ref to the panel.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Modal Container (modal-container.tsx)</h3>
        <p>
          Renders via React Portal to <code>document.body</code>, ensuring z-index
          isolation. Uses <code>useState</code> + <code>useEffect</code> for SSR-safe
          mounting. Subscribes to the store to get the current modal config and open
          state. Applies scroll lock to the body element on mount and removes it on
          unmount. Listens for Escape key to dismiss the modal.
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
                <td className="p-2">openModal</td>
                <td className="p-2">O(1) — set state</td>
                <td className="p-2">O(1) — single modal</td>
              </tr>
              <tr>
                <td className="p-2">closeModal</td>
                <td className="p-2">O(1) — clear state</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Focus trap setup</td>
                <td className="p-2">O(n) — query focusable elements</td>
                <td className="p-2">O(n) — store NodeList</td>
              </tr>
              <tr>
                <td className="p-2">Tab key handling</td>
                <td className="p-2">O(1) — array index math</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Scroll lock</td>
                <td className="p-2">O(1) — set body style</td>
                <td className="p-2">O(1) — store overflow value</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is the number of focusable elements within the modal.
          For typical modals (5-15 focusable elements), focus trap operations are
          sub-millisecond.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Focus trap querySelectorAll:</strong> O(n) scan of the DOM on every
            Tab key press. For very large modals (100+ focusable elements), this could
            become noticeable. Mitigation: cache the focusable elements list and
            invalidate only when the modal content changes (e.g., via MutationObserver).
          </li>
          <li>
            <strong>Animation jank:</strong> Animating layout properties (width, height,
            top) triggers expensive layout recalculations. Mitigation: animate only
            transform (scale, translateY) and opacity, which are GPU-composited.
          </li>
          <li>
            <strong>Re-render cascades:</strong> If the store subscriber selects the
            entire modal state, every property change triggers a re-render. Mitigation:
            use Zustand selectors to subscribe only to <code>isOpen</code> and
            <code>currentModal</code>, so only the container re-renders on state changes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>will-change hint:</strong> Apply <code>will-change: transform, opacity</code>
            to the modal panel during animation to promote it to its own compositor layer.
            Remove the hint after animation completes to free GPU memory.
          </li>
          <li>
            <strong>Lazy content rendering:</strong> For custom modals with heavy content
            (e.g., large forms, data tables), defer rendering until the modal is fully
            mounted using <code>requestIdleCallback</code> or a short
            <code>setTimeout</code>. This prevents blocking the entrance animation.
          </li>
          <li>
            <strong>Body scroll lock via class:</strong> Instead of directly manipulating
            <code>document.body.style</code>, toggle a CSS class (<code>modal-open</code>)
            that sets <code>overflow: hidden</code>. This allows the class to be shared
            with other components that may also need scroll lock (e.g., drawers, full-screen
            menus).
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          Modal titles and messages may contain user-generated content (e.g.,
          confirmation messages with entity names, error descriptions). If rendered as
          HTML, they are XSS vectors. Always sanitize HTML content before rendering.
          Prefer rendering strings as text content (React&apos;s default escaping) and
          only allow React nodes from trusted sources (internal components).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">WAI-ARIA Dialog Pattern</h4>
          <ul className="space-y-2">
            <li>
              The modal container has <code>role=&quot;dialog&quot;</code> and
              <code>aria-modal=&quot;true&quot;</code>, signaling to assistive
              technologies that this is a modal dialog that traps interaction.
            </li>
            <li>
              <code>aria-labelledby</code> points to the modal title element&apos;s ID,
              providing a label for screen readers.
            </li>
            <li>
              <code>aria-describedby</code> points to the modal message element&apos;s
              ID, providing the modal&apos;s content description.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Tab</kbd> and
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Shift+Tab</kbd>
              cycle focus within the modal only.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Escape</kbd>
              dismisses the modal and returns focus to the trigger element.
            </li>
            <li>
              The close button is a native <code>&lt;button&gt;</code> element,
              automatically keyboard-accessible.
            </li>
            <li>
              Focus is restored to the trigger element on close, ensuring users do not
              lose their place in the application.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <p>
            The modal uses <code>role=&quot;dialog&quot;</code> with
            <code>aria-modal=&quot;true&quot;</code>, which causes screen readers to
            announce the modal as a distinct context. The <code>aria-labelledby</code>
            attribute ensures the modal title is announced first. Content behind the
            backdrop is marked with <code>aria-hidden=&quot;true&quot;</code> to prevent
            screen readers from navigating to background content. See the Example tab
            for the exact markup.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li>
            <strong>Single modal constraint:</strong> The store only supports one
            visible modal at a time. If a new modal is opened while one is already
            visible, the previous modal is closed first. This prevents modal stacking
            abuse and keeps the UX clean.
          </li>
          <li>
            <strong>Promise timeout:</strong> For confirm modals, if the caller never
            awaits the result (e.g., forgets <code>await</code>), the Promise remains
            pending indefinitely. The store mitigates this by auto-resolving the Promise
            with <code>null</code> after a configurable timeout (default: 30 seconds).
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Store actions:</strong> Test openConfirm creates modal with correct
            config and returns a Promise, openAlert creates alert modal, close() clears
            state and resolves Promise, confirm() resolves with true, cancel() resolves
            with false.
          </li>
          <li>
            <strong>Promise resolution:</strong> Verify that <code>await modal.confirm()</code>
            resolves to <code>true</code> when the user clicks Yes, and
            <code>false</code> when the user clicks No. Test that Promise timeout
            resolves with <code>null</code> after 30 seconds.
          </li>
          <li>
            <strong>Z-index stacking:</strong> Verify that each new modal gets a
            higher z-index than the previous one.
          </li>
          <li>
            <strong>Focus trap:</strong> Test that Tab cycles through focusable elements
            in order, Shift+Tab reverses, and focus wraps from last to first element.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Modal rendering lifecycle:</strong> Render ModalContainer, call
            <code>modal.confirm(&quot;Delete?&quot;)</code>, assert modal appears in DOM
            with correct title and buttons. Click Yes, assert modal is removed and
            Promise resolves.
          </li>
          <li>
            <strong>Backdrop dismissal:</strong> Open modal, click on backdrop element,
            assert modal dismisses. Test with <code>closeOnBackdropClick: false</code>,
            assert backdrop click does nothing.
          </li>
          <li>
            <strong>Escape key:</strong> Open modal, fire Escape keydown event, assert
            modal dismisses and focus returns to trigger element.
          </li>
          <li>
            <strong>Scroll lock:</strong> Open modal, assert body has
            <code>overflow: hidden</code>. Close modal, assert body overflow is
            restored.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            SSR rendering: verify ModalContainer returns null during SSR and mounts
            correctly on hydration.
          </li>
          <li>
            Modal with no focusable elements: verify focus trap sets tabIndex on
            container itself.
          </li>
          <li>
            Modal with content taller than viewport: verify modal content area scrolls
            independently, header and footer remain visible.
          </li>
          <li>
            Accessibility: run axe-core automated checks on rendered modal, verify
            role=&quot;dialog&quot;, aria-modal, aria-labelledby, focus trap, and
            keyboard dismissal.
          </li>
          <li>
            Rapid open/close: open modal and immediately close it, verify no unhandled
            Promise rejection.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Not implementing focus trap:</strong> Candidates often render the
            modal visually but forget to trap keyboard focus. This is a critical
            accessibility failure — tabbing out of the modal into background content
            is disorienting for screen-reader users. Interviewers expect candidates to
            implement at least a basic Tab/Shift+Tab cycle.
          </li>
          <li>
            <strong>Forgetting focus restoration:</strong> When the modal closes, focus
            should return to the element that triggered the modal. Without this, focus
            jumps to the document body or the next focusable element, confusing keyboard
            users.
          </li>
          <li>
            <strong>Not locking body scroll:</strong> Without <code>overflow: hidden</code>
            on the body, users can scroll the background content while the modal is open,
            creating a broken UX. This is a common oversight.
          </li>
          <li>
            <strong>Inline rendering instead of portal:</strong> Rendering the modal
            inside the component tree means it is subject to parent CSS constraints
            (overflow: hidden, z-index stacking contexts). Interviewers look for
            candidates who know to use React Portal for z-index isolation.
          </li>
          <li>
            <strong>Missing ARIA attributes:</strong> Rendering a modal without
            <code>role=&quot;dialog&quot;</code>, <code>aria-modal=&quot;true&quot;</code>,
            and <code>aria-labelledby</code> means screen readers do not announce the
            modal as a distinct context. This is a critical accessibility failure.
          </li>
          <li>
            <strong>Animating expensive properties:</strong> Animating
            <code>width</code>, <code>height</code>, or <code>top</code> triggers layout
            recalculations. Interviewers look for candidates who know to animate only
            <code>transform</code> and <code>opacity</code> for 60fps animations.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Single Modal vs Multi-Modal Stack</h4>
          <p>
            Most applications need only one modal at a time. A single-modal design is
            simpler and prevents UX confusion (users should not have to dismiss three
            stacked modals to return to their task). However, enterprise applications
            sometimes need nested modals (e.g., a confirmation within a settings modal).
            The trade-off is complexity — you need z-index stacking, focus trap
            management per modal, and a stack data structure instead of a single
            <code>currentModal</code> field. For interviews, start with single-modal
            and discuss multi-modal as a follow-up.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Promise-based vs Callback-based API</h4>
          <p>
            A callback-based API (<code>onConfirm</code>, <code>onCancel</code>) is
            straightforward but leads to callback nesting when modals trigger other
            modals. A Promise-based API (<code>const result = await modal.confirm()</code>)
            enables clean <code>async/await</code> call-site ergonomics and easier
            error handling. The trade-off is implementation complexity — you need to
            manage Promise resolvers in the store and handle timeout scenarios. For
            interviews, the Promise-based approach demonstrates deeper understanding
            of modern JavaScript patterns.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">CSS Transitions vs Framer Motion</h4>
          <p>
            CSS transitions on <code>transform</code> and <code>opacity</code> are
            lightweight, require no external dependencies, and run at 60fps on the
            compositor thread. Framer Motion provides a richer animation API (spring
            physics, layout animations, gesture-based animations) but adds ~30KB to
            the bundle. For simple fade/scale animations, CSS transitions are sufficient.
            Use Framer Motion only if the modal requires complex animations (e.g.,
            shared-element transitions, drag-to-dismiss).
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support multiple modals stacked on top of each other?
            </p>
            <p className="mt-2 text-sm">
              A: Replace the single <code>currentModal</code> field with a
              <code>modalStack: ModalOptions[]</code> array. Each new modal pushes to
              the stack with an incremented z-index. Closing a modal pops from the stack.
              The focus trap needs to track focus per modal level (each modal stores its
              own trigger element). The rendering layer maps the stack to an array of
              ModalPanel components, each with its own z-index.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle a modal that needs to load async content (e.g.,
              fetch data from an API)?
            </p>
            <p className="mt-2 text-sm">
              A: The custom modal type accepts a React node as content, so the caller
              can render a component that fetches data via <code>useEffect</code> or
              React Query. The modal renders a loading skeleton while data loads.
              Alternatively, the store could accept a <code>contentLoader</code> function
              that returns a Promise, and the ModalPanel suspends (using React Suspense)
              until the content resolves.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you test the focus trap in an automated test?
            </p>
            <p className="mt-2 text-sm">
              A: Use Playwright with keyboard event dispatches. Open the modal, dispatch
              Tab keydown events, and assert <code>document.activeElement</code> cycles
              through focusable elements in the correct order. For the wrap-around test,
              Tab from the last element and assert focus moves to the first element. For
              focus restoration, record the trigger element before opening, close the
              modal, and assert the trigger element is focused again.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you prevent the modal from being dismissed accidentally (e.g.,
              user has unsaved changes in a form inside the modal)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>preventDismiss</code> flag to the modal options. When
              <code>true</code>, the backdrop click handler and Escape key handler are
              disabled. The close button can also be hidden. The caller is responsible
              for providing an explicit dismiss mechanism (e.g., a &quot;Discard changes&quot;
              button inside the modal that triggers a nested confirm dialog).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle concurrent React (React 18+)?
            </p>
            <p className="mt-2 text-sm">
              A: The Zustand store is synchronous and external to React&apos;s rendering
              cycle, so it works correctly with concurrent features. The ModalContainer
              uses useSyncExternalStore for subscription synchronization. Modal rendering
              is wrapped in <code>startTransition</code> to avoid blocking urgent updates
              (user input). Animations use CSS transitions, which run on the compositor
              thread independent of React&apos;s scheduler.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add drag-to-dismiss for the modal (e.g., swipe down to close)?
            </p>
            <p className="mt-2 text-sm">
              A: Use pointer events (<code>onPointerDown</code>, <code>onPointerMove</code>,
              <code>onPointerUp</code>) on the modal panel. Track the vertical delta. If
              the drag exceeds a threshold (e.g., 100px downward), trigger the dismiss
              animation. During the drag, apply a <code>translateY</code> transform
              matching the drag distance. On release below threshold, spring the modal
              back to its original position. This pattern is common in mobile modals
              and bottom sheets.
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
              href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Dialog Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://www.radix-ui.com/primitives/docs/components/dialog"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Radix UI Dialog — Production-Ready Reference Implementation
            </a>
          </li>
          <li>
            <a
              href="https://ui.shadcn.com/docs/components/dialog"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              shadcn/ui Dialog — Component Implementation
            </a>
          </li>
          <li>
            <a
              href="https://headlessui.com/react/dialog"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Headless UI Dialog — Unstyled Accessible Components
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — ARIA dialog Role Documentation
            </a>
          </li>
          <li>
            <a
              href="https://hidde.blog/using-jquery-to-move-focus/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Focus Management Best Practices — Hidde de Vries
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
