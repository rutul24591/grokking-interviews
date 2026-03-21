"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-accessibility-a11y-focus-management-extensive",
  title: "Focus Management",
  description:
    "Comprehensive guide to focus management in accessible web applications, covering focus traps, focus restoration, route change strategies, focus-visible CSS, programmatic focus with React, and production-grade patterns for staff and principal engineer interviews.",
  category: "frontend",
  subcategory: "accessibility-a11y",
  slug: "focus-management",
  version: "extensive",
  wordCount: 7200,
  readingTime: 29,
  lastUpdated: "2026-03-21",
  tags: [
    "accessibility",
    "focus",
    "a11y",
    "focus-trap",
    "focus-visible",
    "focus-restoration",
    "inert",
  ],
  relatedTopics: ["keyboard-navigation", "accessible-modals-and-dialogs", "skip-links"],
};

export default function FocusManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ─── Section 1: Definition & Context ─── */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Focus management</strong> is the practice of programmatically controlling which
          element receives keyboard focus during user interactions, ensuring that keyboard and screen
          reader users always know where they are on the page and can efficiently navigate through
          dynamic content changes. It encompasses focus trapping (confining focus within a region),
          focus restoration (returning focus after a transient interaction), and focus routing
          (directing focus to new content after navigation or state changes).
        </p>
        <p>
          In static web pages, focus management is largely handled by the browser — users tab through
          links and form controls in DOM order. But modern web applications introduce dynamic
          patterns that break this natural flow: modals that overlay content, SPA route changes that
          replace page content without a full reload, toast notifications that appear and disappear,
          accordion panels that expand to reveal new interactive elements, and infinite scroll that
          appends content below the viewport.
        </p>
        <p>
          WCAG addresses focus management through several success criteria:
          <strong> 2.4.3 Focus Order</strong> (Level A) requires a meaningful and operable focus
          sequence; <strong>2.4.7 Focus Visible</strong> (Level AA) mandates visible focus indicators;
          <strong>3.2.1 On Focus</strong> (Level A) prevents unexpected context changes when an
          element receives focus. WCAG 2.2 added <strong>2.4.11 Focus Not Obscured (Minimum)</strong>
          (Level AA) requiring that focused elements are at least partially visible, and
          <strong>2.4.12 Focus Not Obscured (Enhanced)</strong> (Level AAA) requiring full visibility.
        </p>
        <p>
          <strong>Why focus management matters for staff/principal engineers:</strong> Poor focus
          management is one of the most common accessibility failures in SPAs and is notoriously
          difficult to retrofit. Architectural decisions about routing, component lifecycle, overlay
          patterns, and state management all impact focus behavior. Technical leaders must establish
          focus management patterns at the component library level to prevent individual teams from
          implementing inconsistent or broken focus behavior.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Focus Is the Keyboard User&apos;s Cursor</h3>
          <p>
            For mouse users, the cursor provides constant visual feedback about position. For
            keyboard users, focus serves the same role. When focus is lost (moved to the body element
            or to an invisible element), keyboard users are stranded — they have no idea where they
            are on the page and must tab through the entire page to reorient. Every dynamic content
            change must answer the question: &quot;Where should focus go?&quot;
          </p>
        </div>
      </section>

      {/* ─── Section 2: Core Concepts ─── */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Programmatic Focus (element.focus()):</strong> JavaScript can move focus to any
            element with <code>tabindex=&quot;-1&quot;</code> or any natively focusable element using
            <code>element.focus()</code>. In React, this is typically done via <code>useRef</code>
            combined with <code>useEffect</code>. The <code>preventScroll</code> option prevents
            the browser from scrolling the element into view when focus moves.
          </li>
          <li>
            <strong>Focus Trap:</strong> A pattern that confines Tab/Shift+Tab cycling to a subset
            of the page — typically a modal dialog or flyout panel. Focus wraps from the last
            focusable element back to the first (and vice versa). The <code>inert</code> HTML
            attribute can disable all interactions on background content, providing a native
            alternative to JavaScript-based focus traps.
          </li>
          <li>
            <strong>Focus Restoration:</strong> When a transient UI element (modal, tooltip, dropdown)
            closes, focus should return to the element that triggered it. This prevents the
            &quot;focus lost to body&quot; problem where keyboard users are stranded after closing
            an overlay.
          </li>
          <li>
            <strong>:focus-visible Pseudo-class:</strong> Applies focus styles only when the browser
            determines the user is navigating via keyboard (not mouse or touch). This solves the
            long-standing tension between designers (who want clean UIs without focus rings on click)
            and accessibility (which requires visible focus indicators).
          </li>
          <li>
            <strong>:focus-within Pseudo-class:</strong> Applies when any descendant of the element
            has focus. Useful for styling parent containers (e.g., highlighting a form group when
            any field within it is focused) and for keeping dropdown menus visible while focus is
            inside them.
          </li>
          <li>
            <strong>The inert Attribute:</strong> A boolean HTML attribute that marks an element and
            all its descendants as non-interactive. Elements with <code>inert</code> are removed from
            the tab order, ignored by screen readers, and unclickable. This is the correct way to
            make background content inaccessible when a modal is open, replacing complex
            <code>aria-hidden</code> + <code>tabindex=&quot;-1&quot;</code> juggling.
          </li>
          <li>
            <strong>SPA Route Change Focus:</strong> When a SPA navigates to a new &quot;page,&quot;
            screen readers don&apos;t receive the page load event they rely on. Focus must be
            explicitly moved — typically to the new page&apos;s <code>&lt;h1&gt;</code>, a skip
            link target, or a visually hidden route announcement element.
          </li>
        </ul>
      </section>

      {/* ─── Section 3: Architecture & Flow ─── */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Focus Trap in Modal Lifecycle</h3>
        <p>
          The focus trap lifecycle has four phases: activation (focus moves into the trap), cycling
          (Tab/Shift+Tab wrap within the trap), interaction (user works within the confined area),
          and deactivation (focus returns to the trigger element). Getting each phase right is
          critical for a seamless keyboard experience.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/focus-management-diagram-1.svg"
          alt="Focus trap lifecycle in a modal showing activation, cycling, interaction, and deactivation phases"
          caption="Focus trap lifecycle: Open triggers focus movement into the modal, Tab/Shift+Tab cycle within, Escape deactivates and restores focus to the original trigger."
        />

        <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          <code>{`// Complete focus trap with inert and focus restoration
import { useEffect, useRef, useCallback } from 'react';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store trigger element for focus restoration
    triggerRef.current = document.activeElement;

    // Make background content inert
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.setAttribute('inert', '');

    // Move focus to modal
    const firstFocusable = modalRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    return () => {
      // Remove inert from background
      if (mainContent) mainContent.removeAttribute('inert');
      // Restore focus to trigger
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}`}</code>
        </pre>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Route Change Focus Strategy</h3>
        <p>
          When a SPA navigates between routes, the page content changes but the browser doesn&apos;t
          fire a traditional page load event. Without explicit focus management, keyboard and screen
          reader users are left at their previous position in a page that no longer exists — they
          must tab through the entire new page to find the content.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/focus-management-diagram-2.svg"
          alt="Route change focus strategy showing focus moving to the main heading after SPA navigation"
          caption="After SPA route change, focus should move to the new page's main heading (h1) or a designated focus target, and the document title should update."
        />

        <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          <code>{`// SPA route change focus management (React Router / Next.js pattern)
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function RouteAnnouncer() {
  const pathname = usePathname();
  const headingRef = useRef(null);
  const announcerRef = useRef(null);

  useEffect(() => {
    // Strategy 1: Focus the main heading
    const mainHeading = document.querySelector('h1');
    if (mainHeading) {
      // Ensure the heading is focusable
      if (!mainHeading.hasAttribute('tabindex')) {
        mainHeading.setAttribute('tabindex', '-1');
      }
      mainHeading.focus({ preventScroll: false });
    }

    // Strategy 2: Announce via live region
    if (announcerRef.current) {
      const pageTitle = document.title;
      announcerRef.current.textContent = \`Navigated to \${pageTitle}\`;
    }
  }, [pathname]);

  return (
    <div
      ref={announcerRef}
      role="status"
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    />
  );
}`}</code>
        </pre>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Focus Ring Visibility States</h3>
        <p>
          The <code>:focus</code>, <code>:focus-visible</code>, and <code>:focus-within</code>
          pseudo-classes provide different levels of focus styling control. Understanding when each
          applies is essential for balancing visual design with accessibility requirements.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/focus-management-diagram-3.svg"
          alt="Focus ring visibility states showing :focus, :focus-visible, and :focus-within pseudo-classes"
          caption=":focus applies on all focus events; :focus-visible applies only on keyboard focus; :focus-within applies when any descendant is focused."
        />

        <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          <code>{`/* Focus visibility CSS patterns */

/* Remove default outline, add custom focus-visible ring */
button:focus {
  outline: none;
}

button:focus-visible {
  outline: 2px solid #6d5bd0;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Focus-within for form groups */
.form-group:focus-within {
  border-color: #6d5bd0;
  box-shadow: 0 0 0 3px rgba(109, 91, 208, 0.2);
}

/* High-contrast focus indicator (WCAG 2.4.11 compliant) */
:focus-visible {
  outline: 3px solid #6d5bd0;
  outline-offset: 2px;
  /* Ensure focus indicator is visible against any background */
  box-shadow:
    0 0 0 2px #ffffff,
    0 0 0 5px #6d5bd0;
}

/* Skip focus ring for mouse users but keep for keyboard */
.interactive:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
}`}</code>
        </pre>
      </section>

      {/* ─── Section 4: Trade-offs & Comparisons ─── */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-accent/30">
                <th className="p-3 text-left font-semibold">Aspect</th>
                <th className="p-3 text-left font-semibold">Advantages</th>
                <th className="p-3 text-left font-semibold">Disadvantages</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">JavaScript Focus Trap</td>
                <td className="p-3">Full control over trap behavior, works in all browsers, can handle edge cases (dynamically added elements)</td>
                <td className="p-3">Complex to implement correctly, must handle edge cases manually, can break with third-party content</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">inert Attribute</td>
                <td className="p-3">Native browser support, handles focus, click, and screen reader access in one attribute, simpler code</td>
                <td className="p-3">Requires polyfill for older browsers, all-or-nothing (can&apos;t partially inert), less granular control</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">Native &lt;dialog&gt; Element</td>
                <td className="p-3">Built-in focus trap via showModal(), Escape handling, backdrop, top layer rendering</td>
                <td className="p-3">Limited styling options for backdrop, inconsistent browser behavior for focus restoration, animation constraints</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">Focus to H1 on Route Change</td>
                <td className="p-3">Clear landmark for screen readers, consistent pattern, natural reading flow</td>
                <td className="p-3">H1 needs tabindex=&quot;-1&quot; (not naturally focusable), some screen readers may not announce non-interactive elements on focus</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">Live Region Route Announcement</td>
                <td className="p-3">Non-disruptive, doesn&apos;t move focus, works with any page structure</td>
                <td className="p-3">User must manually navigate to new content, may miss the announcement, requires maintaining announcement text</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Section 5: Best Practices ─── */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-2">
          <li>
            <strong>Always restore focus after transient interactions:</strong> When a modal, popover,
            dropdown, or tooltip closes, return focus to the trigger element. Store a reference to
            <code>document.activeElement</code> when the overlay opens and call <code>.focus()</code>
            on it when the overlay closes.
          </li>
          <li>
            <strong>Use the inert attribute for background content:</strong> When a modal is open,
            add <code>inert</code> to all sibling content containers. This is more robust than
            manually setting <code>aria-hidden</code> and <code>tabindex=&quot;-1&quot;</code> on
            every interactive element.
          </li>
          <li>
            <strong>Move focus on SPA route changes:</strong> After navigation, focus the new
            page&apos;s H1 heading (with <code>tabindex=&quot;-1&quot;</code>) or use a visually
            hidden route announcer with <code>aria-live</code>. Both strategies work; combining them
            provides the best experience.
          </li>
          <li>
            <strong>Use :focus-visible for focus indicators:</strong> Apply custom focus styles on
            <code>:focus-visible</code> rather than <code>:focus</code> to avoid showing focus rings
            on mouse clicks while maintaining keyboard visibility.
          </li>
          <li>
            <strong>Ensure focus indicators meet WCAG 2.4.11 contrast requirements:</strong> Focus
            indicators need at least 3:1 contrast against adjacent colors and must have a minimum
            area of 2px on the shortest side. Double-ring patterns (white inner ring + colored outer
            ring) work against any background.
          </li>
          <li>
            <strong>Test focus behavior after every state change:</strong> Ask &quot;where is focus
            now?&quot; after every dynamic change: content loading, item deletion, form submission,
            accordion expansion, tab switch, error display. If the answer is unclear, you have a
            focus management bug.
          </li>
          <li>
            <strong>Prefer native &lt;dialog&gt; for modal dialogs:</strong> The native
            <code>&lt;dialog&gt;</code> element with <code>showModal()</code> provides built-in focus
            trapping, Escape handling, top layer rendering, and backdrop. It reduces the amount of
            custom JavaScript needed for accessible modals.
          </li>
        </ol>
      </section>

      {/* ─── Section 6: Common Pitfalls ─── */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Focus lost to document body:</strong> When a focused element is removed from the
            DOM (e.g., deleting a list item, closing a panel), focus falls to the body element.
            Keyboard users must Tab through the entire page to reorient. Always move focus to a
            logical next element before removing the currently focused one.
          </li>
          <li>
            <strong>Focus moving to invisible or off-screen elements:</strong> Programmatic focus
            on an element that&apos;s hidden via CSS (opacity: 0, visibility: hidden, or
            positioned off-screen) confuses users because the focus indicator isn&apos;t visible.
            Ensure the target is visible before focusing.
          </li>
          <li>
            <strong>Multiple focus traps without proper nesting:</strong> Stacked modals (modal
            opening another modal) create nested focus traps. The inner trap must deactivate before
            the outer one resumes. Libraries like focus-trap handle this; custom implementations
            often don&apos;t.
          </li>
          <li>
            <strong>Auto-focusing on page load without user action:</strong> Moving focus
            automatically on page load (e.g., to a search input) can disorient screen reader users
            who expect to start reading from the top. Only auto-focus when the page&apos;s primary
            purpose is the focused element (e.g., a login form, a search page).
          </li>
          <li>
            <strong>Using outline: none without replacement:</strong> Removing focus outlines
            globally (<code>{`*:focus { outline: none }`}</code>) without providing alternative
            focus indicators makes the application completely unusable for keyboard users. Always
            pair outline removal with <code>:focus-visible</code> styling.
          </li>
          <li>
            <strong>Forgetting to handle Escape key in overlays:</strong> Users expect Escape to
            close modals, popovers, and dropdowns. Failing to handle this key leaves keyboard users
            trapped in overlays with no way to dismiss them.
          </li>
        </ul>
      </section>

      {/* ─── Section 7: Real-World Use Cases ─── */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-2">
          <li>
            <strong>Radix UI Primitives:</strong> Provides unstyled, accessible components with
            built-in focus trapping, focus restoration, and <code>inert</code> support. Their Dialog
            component automatically traps focus, restores it on close, and marks background content
            as inert.
          </li>
          <li>
            <strong>Next.js Route Announcer:</strong> Next.js includes a built-in route announcer
            component that uses an aria-live region to announce page navigations for screen reader
            users, solving the SPA route change problem at the framework level.
          </li>
          <li>
            <strong>Google Workspace:</strong> Gmail, Google Docs, and Google Sheets implement
            complex focus management for multi-panel layouts, inline editing, collaboration cursors,
            and nested dialogs within dialogs.
          </li>
          <li>
            <strong>Shopify Polaris:</strong> Their design system components handle focus management
            for complex patterns like resource lists (focus management when items are selected,
            deleted, or filtered) and multi-step wizards (focus moves to the new step on transition).
          </li>
          <li>
            <strong>Adobe React Spectrum:</strong> Uses the FocusScope component to manage focus
            containment, auto-focus, and focus restoration across all interactive components, with
            comprehensive support for virtual focus via <code>aria-activedescendant</code>.
          </li>
        </ul>
      </section>

      {/* ─── Section 8: References & Further Reading ─── */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Understanding WCAG 2.4.7: Focus Visible
            </a>{" "}
            — Requirements for visible focus indicators.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Understanding WCAG 2.4.11: Focus Not Obscured
            </a>{" "}
            — WCAG 2.2 requirements for focus indicator visibility.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              MDN: The inert attribute
            </a>{" "}
            — Native HTML attribute for disabling interaction with background content.
          </li>
          <li>
            <a href="https://github.com/focus-trap/focus-trap" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              focus-trap Library
            </a>{" "}
            — Production-grade JavaScript focus trapping library.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              MDN: :focus-visible
            </a>{" "}
            — CSS pseudo-class for keyboard-only focus styles.
          </li>
        </ul>
      </section>

      {/* ─── Section 9: Common Interview Questions ─── */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How do you implement a focus trap for a modal dialog?</h3>
          <p>
            A focus trap confines Tab/Shift+Tab cycling within the modal. Implementation: (1) Store
            <code>document.activeElement</code> as the trigger reference when the modal opens.
            (2) Query all focusable elements inside the modal. (3) On Tab at the last element,
            prevent default and focus the first element. On Shift+Tab at the first element, focus
            the last. (4) Handle Escape to close. (5) Add <code>inert</code> to background content.
            (6) On close, remove <code>inert</code> and restore focus to the stored trigger.
            Alternatively, use the native <code>&lt;dialog&gt;</code> element with
            <code>showModal()</code> which handles most of this automatically.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What is the inert attribute and how does it improve accessibility?</h3>
          <p>
            The <code>inert</code> HTML attribute makes an element and all its descendants
            non-interactive: they&apos;re removed from the tab order, ignored by screen readers,
            and unclickable. It replaces the complex pattern of manually setting
            <code>aria-hidden=&quot;true&quot;</code>, <code>tabindex=&quot;-1&quot;</code> on every
            interactive element, and preventing click events. For modals, adding <code>inert</code>
            to the main content container while the modal is open ensures background content is
            completely inaccessible, solving both focus trapping and screen reader isolation in one
            attribute.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How should focus be managed during SPA route changes?</h3>
          <p>
            Three complementary strategies: (1) <strong>Focus the main heading:</strong> After
            navigation, set <code>tabindex=&quot;-1&quot;</code> on the new page&apos;s H1 and call
            <code>.focus()</code>. This orients screen readers to the new content. (2)
            <strong>Live region announcement:</strong> Update an <code>aria-live</code> region with
            &quot;Navigated to [page title]&quot; to inform screen readers without moving focus.
            (3) <strong>Update document title:</strong> Change <code>document.title</code> so screen
            readers announce the new page title. Next.js handles this with a built-in route
            announcer. Custom SPAs need explicit implementation.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What is the difference between :focus, :focus-visible, and :focus-within?</h3>
          <p>
            <code>:focus</code> matches whenever an element has focus, regardless of input method.
            <code>:focus-visible</code> matches only when the browser detects keyboard navigation
            (heuristic: keyboard interaction, not mouse/touch). <code>:focus-within</code> matches
            when the element itself or any descendant has focus. Common pattern: use
            <code>:focus-visible</code> for buttons and links to show focus rings only for keyboard
            users, <code>:focus-within</code> to highlight form groups when any child input is
            focused. Remove default <code>:focus</code> outlines only when providing
            <code>:focus-visible</code> replacements.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What happens when a focused element is removed from the DOM?</h3>
          <p>
            When the currently focused element is removed, focus falls back to the
            <code>&lt;body&gt;</code> element. This is called &quot;focus loss&quot; and is a serious
            usability problem for keyboard users — they lose their place and must tab through the
            entire page. Solutions: (1) Before removing the element, move focus to a logical
            neighbor (the next item in a list, the parent container, or a heading). (2) Use a
            ref to track what should receive focus after removal. (3) For list item deletion,
            focus the previous item, or the next item if the first was deleted, or the list
            heading if the list is now empty.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How do you handle focus management in nested modals?</h3>
          <p>
            Nested modals (a modal opening another modal) create a stack of focus traps. The
            approach: (1) Each modal stores its own trigger reference independently. (2) When the
            inner modal opens, the inner trap activates and the outer trap pauses. (3) The inner
            modal adds <code>inert</code> to the outer modal (in addition to the background). (4)
            When the inner modal closes, focus returns to its trigger (inside the outer modal), and
            the outer trap reactivates. Libraries like focus-trap support this via a
            &quot;trap stack&quot; pattern. The native <code>&lt;dialog&gt;</code> handles this
            through the top layer rendering order.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
