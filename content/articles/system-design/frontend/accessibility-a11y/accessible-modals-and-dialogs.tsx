"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-accessibility-a11y-accessible-modals-and-dialogs-extensive",
  title: "Accessible Modals & Dialogs",
  description:
    "Comprehensive guide to building accessible modal dialogs, covering focus trapping, focus restoration, ARIA dialog patterns, the native dialog element, inert attribute, scroll locking, and production-grade implementation strategies for staff and principal engineer interviews.",
  category: "frontend",
  subcategory: "accessibility-a11y",
  slug: "accessible-modals-and-dialogs",
  version: "extensive",
  wordCount: 7600,
  readingTime: 30,
  lastUpdated: "2026-03-21",
  tags: [
    "accessibility",
    "modals",
    "dialogs",
    "a11y",
    "focus-trap",
    "aria-modal",
    "dialog-element",
    "inert",
  ],
  relatedTopics: ["focus-management", "keyboard-navigation", "aria-attributes"],
};

export default function AccessibleModalsAndDialogsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ─── Section 1: Definition & Context ─── */}
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="important">
          <strong>Accessible modals and dialogs</strong> are overlay UI patterns that temporarily
          interrupt the user&apos;s workflow to demand attention or input, implemented in a way
          that works equally well for mouse, keyboard, touch, and assistive technology users. A
          modal dialog blocks interaction with the rest of the page until dismissed; a non-modal
          dialog allows continued interaction with background content.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Modals are one of the most accessibility-challenged patterns on the web. They require
          coordinating multiple accessibility concerns simultaneously: focus must be trapped inside
          the modal, background content must be hidden from screen readers, the Escape key must
          close the dialog, focus must be restored to the trigger when closed, and the modal must
          announce itself properly to assistive technology. Getting any one of these wrong creates a
          broken experience for keyboard and screen reader users.
        </HighlightBlock>
        <p>
          The WAI-ARIA Authoring Practices define two dialog patterns:
          <code>role=&quot;dialog&quot;</code> for general-purpose dialogs (confirmations, forms,
          settings) and <code>role=&quot;alertdialog&quot;</code> for dialogs that require immediate
          attention and have a specific message to convey (delete confirmations, error alerts). HTML5
          introduced the native <code>&lt;dialog&gt;</code> element, which provides built-in modal
          behavior via <code>showModal()</code>, including focus trapping, Escape handling, and top
          layer rendering.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Why accessible modals matter for staff/principal engineers:</strong> Modal patterns
          appear in almost every web application — login forms, confirmation dialogs, image galleries,
          settings panels, onboarding flows. A single inaccessible modal component propagates failures
          across the entire application. Technical leaders must decide between native
          <code>&lt;dialog&gt;</code>, custom implementations, and headless UI libraries, each with
          different trade-offs for accessibility, styling, and browser support. The architectural
          decision affects every team that uses modals.
        </HighlightBlock>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: The Native &lt;dialog&gt; Element Changes Everything</h3>
          <HighlightBlock as="p" tier="crucial">
            Before <code>&lt;dialog&gt;</code>, accessible modals required hundreds of lines of
            JavaScript for focus trapping, scroll locking, aria-hidden toggling, and stacking context
            management. The native <code>&lt;dialog&gt;</code> with <code>showModal()</code> handles
            focus trapping, Escape dismissal, top layer rendering (no z-index issues), and backdrop
            styling natively. While custom solutions are still needed for advanced cases (animations,
            nested modals), <code>&lt;dialog&gt;</code> should be the default starting point.
          </HighlightBlock>
        </div>
      </section>

      {/* ─── Section 2: Core Concepts ─── */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Modal vs. Non-Modal Dialog:</strong> A modal dialog blocks all interaction with
            the page behind it — the user must address it before continuing. A non-modal dialog
            (like a persistent search panel or floating toolbar) allows continued interaction with
            background content. Modal dialogs require focus trapping; non-modal dialogs do not.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>role=&quot;dialog&quot; and aria-modal=&quot;true&quot;:</strong> The
            <code>role=&quot;dialog&quot;</code> tells screen readers this is a dialog window.
            <code>aria-modal=&quot;true&quot;</code> tells screen readers that content outside the
            dialog is inert. Together they trigger proper dialog mode behavior in assistive
            technology. The dialog must also have <code>aria-labelledby</code> pointing to its
            title.
          </HighlightBlock>
          <li>
            <strong>role=&quot;alertdialog&quot;:</strong> A specialized dialog role for confirmations
            and critical alerts. Screen readers may announce it differently (more urgently) than
            <code>role=&quot;dialog&quot;</code>. Use for delete confirmations, unsaved changes
            warnings, and error notifications that require user action.
          </li>
          <li>
            <strong>Focus Trapping:</strong> Tab and Shift+Tab must cycle through focusable elements
            within the modal, never escaping to background content. When Tab reaches the last
            focusable element, it wraps to the first; when Shift+Tab reaches the first, it wraps to
            the last.
          </li>
          <li>
            <strong>Focus Restoration:</strong> When the modal opens, store a reference to the
            trigger element (<code>document.activeElement</code>). When the modal closes, call
            <code>focus()</code> on the stored reference. Without this, focus falls to
            <code>&lt;body&gt;</code> after the modal is removed from the DOM.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>The inert Attribute:</strong> Adding <code>inert</code> to all sibling content
            while a modal is open removes them from the tab order, hides them from screen readers,
            and prevents click events — all in one attribute. This replaces the complex pattern of
            manually managing <code>aria-hidden</code> and <code>tabindex</code> on multiple elements.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Native &lt;dialog&gt; Element:</strong> HTML5&apos;s <code>&lt;dialog&gt;</code>
            with <code>showModal()</code> provides built-in focus trapping, Escape key handling, top
            layer rendering (above all z-index contexts), and <code>::backdrop</code> pseudo-element
            for overlay styling. It auto-focuses the first focusable element (or the dialog itself
            if <code>autofocus</code> is specified).
          </HighlightBlock>
          <li>
            <strong>Scroll Locking:</strong> When a modal is open, background page scroll should be
            prevented. CSS <code>overflow: hidden</code> on <code>&lt;body&gt;</code> is the common
            approach. The native <code>&lt;dialog&gt;</code> handles this automatically. Custom
            implementations must manage scroll position to avoid the page jumping to the top.
          </li>
        </ul>
      </section>

      {/* ─── Section 3: Architecture & Flow ─── */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Modal Focus Trap Cycle</h3>
        <HighlightBlock as="p" tier="crucial">
          The focus trap ensures keyboard users remain within the modal until they explicitly
          dismiss it. Tab cycles forward through focusable elements; Shift+Tab cycles backward.
          The cycle wraps seamlessly between the first and last focusable elements.
        </HighlightBlock>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/accessible-modals-and-dialogs-diagram-1.svg"
          alt="Modal focus trap cycle showing Tab cycling through close button, form fields, and action buttons within the modal"
          caption="Focus trap cycle: Tab moves forward through all focusable elements in the modal, wrapping from last to first. Shift+Tab moves backward, wrapping from first to last."
          captionTier="important"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Native Dialog Implementation</h3>
        <HighlightBlock as="p" tier="important">
          For native dialog implementation using the dialog element, create a NativeDialog component with useRef and useEffect. Store dialog ref, and in useEffect check if isOpen and dialog not open, call showModal which handles focus trapping, Escape key, and top layer positioning. If not isOpen and dialog open, call close. Handle close event with useCallback for onClose prop. Handle backdrop click by checking if event target equals the dialog ref, then call onClose. Render dialog element with ref, onClose handler, onClick handler, and aria-labelledby. Inside render content div with h2 title, children, and close button with aria-label. For CSS, use dialog backdrop with rgba black background at 50 percent opacity, and dialog with no border, 8px border-radius, and 24px padding.
        </HighlightBlock>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Dialog ARIA Role Hierarchy</h3>
        <HighlightBlock as="p" tier="important">
          The ARIA dialog pattern defines a hierarchy of roles and attributes that screen readers
          use to understand the dialog&apos;s purpose and structure. The dialog must have a label,
          may have a description, and should communicate its modal nature.
        </HighlightBlock>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/accessible-modals-and-dialogs-diagram-2.svg"
          alt="Dialog ARIA role hierarchy showing dialog/alertdialog roles with aria-modal, aria-labelledby, and aria-describedby"
          caption="ARIA dialog hierarchy: role='dialog' or 'alertdialog' with aria-modal='true', labeled via aria-labelledby, and optionally described via aria-describedby."
          captionTier="important"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Custom Accessible Modal Pattern</h3>
        <HighlightBlock as="p" tier="important">
          For custom accessible modal with ARIA and focus management, create an AccessibleModal component using useEffect, useRef, useCallback, and createPortal. Store modalRef and triggerRef. For focus trapping, use useCallback to listen for Escape key to close, and Tab key to cycle focus. Query all focusable elements including links, buttons, inputs, selects, textareas, and tabindex elements. Get first and last focusable elements. If Shift+Tab on first element, prevent default and focus last. If Tab on last element, prevent default and focus first. In useEffect on isOpen, store trigger for focus restoration, set inert on app-root, prevent background scroll by setting body position fixed and adjusting top to negative scrollY, focus first focusable element using requestAnimationFrame. Cleanup removes inert, restores scroll position, and restores focus to trigger. Use createPortal to render modal-overlay div with onClick, inner div with ref, role dialog, aria-modal true, aria-labelledby, and aria-describedby if description exists.
        </HighlightBlock>
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
              <HighlightBlock
                as="tr"
                tier="crucial"
                className="border-b border-accent/10"
              >
                <td className="p-3 font-medium">Native &lt;dialog&gt; + showModal()</td>
                <td className="p-3">Built-in focus trap, Escape handling, top layer (no z-index issues), ::backdrop styling, minimal JavaScript</td>
                <td className="p-3">Limited animation support (no entry/exit transitions natively), focus restoration not automatic, backdrop click requires manual handling</td>
              </HighlightBlock>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">Custom ARIA Dialog</td>
                <td className="p-3">Full control over behavior, animations, and styling; can handle complex patterns (nested modals, custom transitions)</td>
                <td className="p-3">Must implement everything manually (focus trap, Escape, scroll lock, inert), high bug surface, maintenance burden</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">Headless UI Libraries (Radix, Headless UI)</td>
                <td className="p-3">Accessibility handled by the library, full styling control, well-tested, community maintained</td>
                <td className="p-3">External dependency, potential bundle size, API learning curve, may not cover all edge cases</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">React Portal-Based Modal</td>
                <td className="p-3">Renders outside parent DOM hierarchy avoiding CSS overflow issues, clean component tree</td>
                <td className="p-3">Still needs all accessibility features manually, event bubbling crosses portal boundary, SSR considerations</td>
              </tr>
              <HighlightBlock
                as="tr"
                tier="crucial"
                className="border-b border-accent/10"
              >
                <td className="p-3 font-medium">CSS-Only Modal (using :target or checkbox hack)</td>
                <td className="p-3">No JavaScript needed, progressive enhancement, simple</td>
                <td className="p-3">Cannot trap focus, no Escape handling, no screen reader announcements, no scroll locking — NOT accessible</td>
              </HighlightBlock>
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Section 5: Best Practices ─── */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Start with the native &lt;dialog&gt; element:</strong> Use
            <code>showModal()</code> for modal dialogs and <code>show()</code> for non-modal. This
            gives you focus trapping, Escape handling, and top layer rendering for free. Only build
            a custom solution if native dialog doesn&apos;t meet your requirements.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Always label the dialog:</strong> Use <code>aria-labelledby</code> pointing to
            the dialog&apos;s heading. Every dialog must have an accessible name. Optionally use
            <code>aria-describedby</code> for supplementary description text.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Trap focus inside the modal:</strong> Tab and Shift+Tab must cycle within the
            modal. Never allow focus to escape to background content while the modal is open. Use
            <code>inert</code> on background content for the most robust approach.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Restore focus to the trigger on close:</strong> Store
            <code>document.activeElement</code> when the modal opens. Call <code>focus()</code> on
            it when the modal closes. This prevents the &quot;focus lost to body&quot; problem.
          </HighlightBlock>
          <li>
            <strong>Close on Escape key:</strong> This is an expected convention that keyboard users
            rely on universally. The native <code>&lt;dialog&gt;</code> handles this automatically.
            Custom implementations must add an Escape keydown handler.
          </li>
          <li>
            <strong>Close on backdrop click (carefully):</strong> Clicking outside the modal should
            close it, but ensure the click handler distinguishes between the backdrop and the dialog
            content. Use <code>event.target === backdrop</code> to prevent accidental closes when
            clicking inside the dialog.
          </li>
          <li>
            <strong>Lock background scroll:</strong> Prevent the background page from scrolling
            while the modal is open. Restore the scroll position when the modal closes. The
            <code>overflow: hidden</code> on body approach is common but requires managing scroll
            position to avoid jump-to-top behavior.
          </li>
          <li>
            <strong>Use role=&quot;alertdialog&quot; for critical confirmations:</strong> Delete
            confirmations, unsaved changes warnings, and error alerts should use
            <code>role=&quot;alertdialog&quot;</code> instead of <code>role=&quot;dialog&quot;</code>
            to convey urgency to screen readers.
          </li>
        </ol>
      </section>

      {/* ─── Section 6: Common Pitfalls ─── */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>No focus trap — focus escapes to background:</strong> Without focus trapping,
            Tab moves focus to navigation links and other elements behind the modal overlay.
            Keyboard users interact with hidden content, screen readers navigate away from the
            dialog, and the modal becomes a confusing experience.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Focus not restored after close:</strong> When the modal is removed from the DOM,
            focus falls to <code>&lt;body&gt;</code>. The user must Tab through the entire page to
            find their place again. Always restore focus to the trigger element.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Missing aria-modal or aria-hidden on background:</strong> Without
            <code>aria-modal=&quot;true&quot;</code> or <code>inert</code> on background content,
            screen readers can navigate to elements behind the modal using browse mode shortcuts
            (heading jumps, landmark navigation) even though they&apos;re visually obscured.
          </HighlightBlock>
          <li>
            <strong>Auto-focusing the close button instead of meaningful content:</strong> While
            focus should move into the modal, focusing the close button first means screen readers
            announce &quot;Close, button&quot; instead of the dialog title. Consider focusing the
            heading or the first form field instead.
          </li>
          <li>
            <strong>Z-index stacking context issues:</strong> Custom modals often fight with other
            high z-index elements (tooltips, dropdowns, sticky headers). The native
            <code>&lt;dialog&gt;</code> renders in the top layer, avoiding these issues entirely.
          </li>
          <li>
            <strong>Nested modals with broken focus restoration:</strong> When Modal A opens Modal
            B, closing Modal B should restore focus to Modal A&apos;s trigger (inside Modal A), not
            to the original page trigger. Each modal must maintain its own trigger reference.
          </li>
          <li>
            <strong>No Escape key handler:</strong> Users universally expect Escape to close modals.
            Forgetting this handler traps keyboard users — they must find and activate the close
            button, which may be difficult to locate.
          </li>
        </ul>
      </section>

      {/* ─── Section 7: Real-World Use Cases ─── */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Radix UI Dialog:</strong> Headless, accessible dialog primitive for React.
            Provides focus trapping, focus restoration, Escape handling, and portal rendering out
            of the box. Supports animations via <code>data-state</code> attributes. Used by
            Vercel, Linear, and many other companies.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Headless UI (Tailwind Labs):</strong> Provides an accessible Dialog component
            for React and Vue. Uses the <code>inert</code> attribute for background isolation and
            manages focus automatically. Designed to work with Tailwind CSS.
          </HighlightBlock>
          <li>
            <strong>Adobe React Spectrum:</strong> Their Dialog and AlertDialog components implement
            the full WAI-ARIA dialog pattern including auto-focus management, focus containment,
            and focus restoration. Supports nested dialogs via a dialog stack.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>GitHub:</strong> Uses accessible modals for code review comments, issue creation,
            settings panels, and file viewing. Their modals properly trap focus, support Escape,
            and restore focus — essential given the keyboard-heavy workflow of developers.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Shopify Polaris:</strong> Their Modal component enforces accessibility by default
            — developers can&apos;t create a modal without a title (used for aria-labelledby), focus
            trapping is built in, and Escape handling is automatic. The component API makes the
            accessible path the easiest path.
          </HighlightBlock>
        </ul>
      </section>

      {/* ─── Section 8: Common Interview Questions ─── */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What are the accessibility requirements for a modal dialog?</h3>
          <HighlightBlock as="p" tier="crucial">
            Six requirements: (1) <strong>Focus trap:</strong> Tab/Shift+Tab must cycle within the
            modal, never escaping to background content. (2) <strong>Focus placement:</strong> When
            the modal opens, focus moves to the first focusable element or the dialog title. (3)
            <strong>Focus restoration:</strong> When the modal closes, focus returns to the trigger
            element. (4) <strong>Escape key:</strong> Pressing Escape closes the dialog. (5)
            <strong>ARIA attributes:</strong> <code>role=&quot;dialog&quot;</code>,
            <code>aria-modal=&quot;true&quot;</code>, and <code>aria-labelledby</code> pointing to the
            title. (6) <strong>Background isolation:</strong> Background content must be hidden from
            screen readers (via <code>inert</code> or <code>aria-hidden</code>).
          </HighlightBlock>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What is the difference between the native &lt;dialog&gt; element and a custom ARIA dialog?</h3>
          <p>
            The native <code>&lt;dialog&gt;</code> with <code>showModal()</code> provides built-in
            focus trapping, Escape key handling, top layer rendering (no z-index conflicts), and a
            <code>::backdrop</code> pseudo-element. A custom ARIA dialog using
            <code>role=&quot;dialog&quot;</code> on a <code>&lt;div&gt;</code> requires implementing
            all of these features manually in JavaScript. The native element is simpler and more
            robust but offers less control over animations, custom close behavior, and edge cases
            like nested dialogs. Modern best practice: use native <code>&lt;dialog&gt;</code> as the
            baseline and enhance with JavaScript only when needed.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How does the inert attribute improve modal accessibility?</h3>
          <HighlightBlock as="p" tier="important">
            The <code>inert</code> attribute makes an element and all its descendants completely
            non-interactive: removed from the tab order, hidden from screen readers, and unclickable.
            For modals, adding <code>inert</code> to the main content container solves three
            problems at once: (1) Focus can&apos;t Tab to background elements (focus trap
            reinforcement). (2) Screen readers can&apos;t navigate to background content using browse
            mode shortcuts (heading jumps, landmark navigation). (3) Click events on background
            elements are blocked. Previously, this required manually setting
            <code>aria-hidden=&quot;true&quot;</code> and <code>tabindex=&quot;-1&quot;</code> on
            every interactive background element — <code>inert</code> replaces all of that with a
            single attribute on the container.
          </HighlightBlock>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: When should you use role=&quot;alertdialog&quot; vs. role=&quot;dialog&quot;?</h3>
          <p>
            <code>role=&quot;dialog&quot;</code> is for general-purpose dialogs: forms, settings,
            information panels, image viewers. <code>role=&quot;alertdialog&quot;</code> is for
            dialogs that communicate an important message requiring immediate attention and user
            response: delete confirmations (&quot;Are you sure you want to delete this item?&quot;),
            unsaved changes warnings, session timeout warnings, and error notifications that block
            progress. Screen readers may announce <code>alertdialog</code> differently — with more
            urgency or by interrupting current speech. The key distinction: if the dialog is
            primarily informational or requires user input, use <code>dialog</code>. If it&apos;s
            primarily a warning or confirmation that requires a decision, use <code>alertdialog</code>.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How do you handle scroll locking when a modal is open?</h3>
          <p>
            The goal is to prevent background page scrolling while the modal is open, without losing
            the user&apos;s scroll position. Native <code>&lt;dialog&gt;</code> with
            <code>showModal()</code> handles this automatically. For custom modals: (1) Store the
            current <code>window.scrollY</code> before opening. (2) Set <code>body</code> to
            <code>position: fixed; top: -{`scrollY`}px; width: 100%;</code>. This freezes the
            background at the current scroll position. (3) On close, remove the fixed positioning
            and call <code>window.scrollTo(0, scrollY)</code> to restore position. Avoid the simpler
            <code>overflow: hidden</code> approach alone, as it can cause the page to jump to the
            top and change the layout width (due to scrollbar disappearing).
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How would you implement an accessible confirmation dialog in React?</h3>
          <p>
            Use <code>role=&quot;alertdialog&quot;</code> with <code>aria-modal=&quot;true&quot;</code>,
            <code>aria-labelledby</code> pointing to the title, and <code>aria-describedby</code>
            pointing to the confirmation message. Focus should move to the least destructive action
            button (e.g., &quot;Cancel&quot; rather than &quot;Delete&quot;) to prevent accidental
            confirmation via Enter. Trap focus between the two action buttons. Handle Escape by
            invoking the cancel/dismiss action. Add <code>inert</code> to background content. On
            close, restore focus to the trigger. For the native approach, use
            <code>&lt;dialog&gt;</code> with <code>showModal()</code> and the <code>returnValue</code>
            property to communicate which button was pressed.
          </p>
        </div>
      </section>

      {/* ─── Section 9: References & Further Reading ─── */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              WAI-ARIA APG: Dialog (Modal) Pattern
            </a>{" "}
            — Official ARIA pattern for modal dialogs.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              MDN: The &lt;dialog&gt; Element
            </a>{" "}
            — Native HTML dialog element documentation.
          </HighlightBlock>
          <li>
            <a href="https://www.radix-ui.com/primitives/docs/components/dialog" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Radix UI: Dialog Component
            </a>{" "}
            — Headless, accessible dialog primitive for React.
          </li>
          <li>
            <a href="https://github.com/focus-trap/focus-trap-react" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              focus-trap-react
            </a>{" "}
            — React wrapper for the focus-trap library.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              MDN: The inert Attribute
            </a>{" "}
            — Native method for making background content non-interactive.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
