"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-accessibility-a11y-keyboard-navigation-extensive",
  title: "Keyboard Navigation",
  description:
    "Comprehensive guide to keyboard navigation patterns for accessible web applications, covering tab order, roving tabindex, keyboard traps, WCAG compliance, focus management strategies, and production-grade implementation patterns for staff and principal engineer interviews.",
  category: "frontend",
  subcategory: "accessibility-a11y",
  slug: "keyboard-navigation",
  version: "extensive",
  wordCount: 7400,
  readingTime: 30,
  lastUpdated: "2026-03-21",
  tags: [
    "accessibility",
    "keyboard",
    "a11y",
    "focus",
    "tabindex",
    "navigation",
    "roving-tabindex",
    "keyboard-trap",
    "wcag",
  ],
  relatedTopics: ["focus-management", "accessible-modals-and-dialogs", "skip-links"],
};

export default function KeyboardNavigationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ─── Section 1: Definition & Context ─── */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Keyboard navigation</strong> refers to the ability of users to interact with every
          part of a web application using only a keyboard — without requiring a mouse, trackpad, or
          touch screen. This is not merely a convenience feature; it is a fundamental requirement for
          users with motor disabilities, vision impairments (who rely on screen readers that are
          keyboard-driven), temporary injuries, and power users who prefer keyboard workflows.
        </p>
        <p>
          The Web Content Accessibility Guidelines (WCAG) dedicate several success criteria to
          keyboard accessibility: <strong>2.1.1 Keyboard</strong> (Level A) requires all
          functionality to be available via keyboard; <strong>2.1.2 No Keyboard Trap</strong> (Level
          A) ensures users can always navigate away from any component; <strong>2.4.3 Focus
          Order</strong> (Level A) mandates a logical and meaningful tab sequence;
          and <strong>2.4.7 Focus Visible</strong> (Level AA) requires a visible focus indicator.
        </p>
        <p>
          Historically, web pages were simple document structures where Tab naturally moved through
          links and form controls. As SPAs and complex widget libraries became standard, keyboard
          navigation broke down — custom dropdowns, modals, tab panels, and drag-and-drop interfaces
          routinely trapped or confused keyboard users. The WAI-ARIA Authoring Practices guide
          emerged to codify keyboard interaction patterns for common widget types, establishing
          conventions like arrow-key navigation within composite widgets and Enter/Space activation.
        </p>
        <p>
          <strong>Why keyboard navigation matters for staff/principal engineers:</strong> At the
          architecture level, keyboard support influences component API design, focus management
          strategies, event delegation patterns, and the choice between native HTML elements and
          custom ARIA widgets. A poorly designed component library can make keyboard accessibility
          nearly impossible to retrofit. Technical leaders must establish keyboard interaction
          standards, audit tooling, and CI integration to prevent regressions across large codebases.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: The Tab Key Is Not the Only Keyboard Control</h3>
          <p>
            A common misconception is that keyboard accessibility means &quot;everything should be
            reachable with Tab.&quot; In reality, ARIA patterns prescribe arrow keys for navigation
            within composite widgets (toolbars, menus, tab lists, grids), Tab/Shift+Tab for moving
            between widget groups, Enter/Space for activation, and Escape for dismissal. Over-reliance
            on tabindex creates unusably long tab sequences.
          </p>
        </div>
      </section>

      {/* ─── Section 2: Core Concepts ─── */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Tab Order (Sequential Navigation):</strong> The order in which interactive
            elements receive focus when the user presses Tab. By default, this follows the DOM order.
            Elements with <code>tabindex=&quot;0&quot;</code> are inserted into the natural tab order;
            elements with <code>tabindex=&quot;-1&quot;</code> are removed from it but can receive
            programmatic focus; positive tabindex values override natural order (and should almost
            never be used).
          </li>
          <li>
            <strong>Roving Tabindex:</strong> A pattern for composite widgets (toolbars, tab lists,
            menus) where only one item in the group has <code>tabindex=&quot;0&quot;</code> while all
            others have <code>tabindex=&quot;-1&quot;</code>. Arrow keys move focus within the group,
            and Tab moves to the next group entirely. This prevents bloating the tab sequence.
          </li>
          <li>
            <strong>aria-activedescendant:</strong> An alternative to roving tabindex where the
            container retains DOM focus and the currently &quot;active&quot; descendant is communicated
            to assistive technology via the <code>aria-activedescendant</code> attribute pointing to
            the active item&apos;s ID. Used in listboxes, comboboxes, and grids.
          </li>
          <li>
            <strong>Focus Indicators:</strong> Visual cues (typically outlines or rings) that show
            which element currently has keyboard focus. CSS <code>:focus-visible</code> applies focus
            styles only for keyboard navigation, avoiding focus rings on mouse clicks. WCAG 2.4.7
            requires visible focus indicators; WCAG 2.4.11 (AA in 2.2) specifies minimum contrast
            and area requirements for focus indicators.
          </li>
          <li>
            <strong>Keyboard Traps:</strong> A keyboard trap occurs when a user can navigate into a
            component but cannot navigate out using standard keyboard interactions. Intentional traps
            (modals) are acceptable if Escape provides an exit; unintentional traps violate WCAG
            2.1.2.
          </li>
          <li>
            <strong>Key Event Handling:</strong> Use <code>onKeyDown</code> rather than
            <code>onKeyPress</code> (deprecated) or <code>onKeyUp</code> for keyboard interactions.
            Always check <code>event.key</code> (not <code>event.keyCode</code>) for key
            identification. Prevent default browser behavior only when the component handles the key.
          </li>
          <li>
            <strong>Interactive Element Semantics:</strong> Native HTML elements (
            <code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;input&gt;</code>,
            <code>&lt;select&gt;</code>) are keyboard-accessible by default. Custom elements (
            <code>&lt;div onClick&gt;</code>) require <code>role</code>, <code>tabindex</code>, and
            keyboard event handlers to achieve equivalent accessibility.
          </li>
        </ul>
      </section>

      {/* ─── Section 3: Architecture & Flow ─── */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Understanding keyboard navigation requires visualizing how focus moves through a page,
          how composite widgets manage internal navigation, and how intentional keyboard traps work
          in modal dialogs.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tab Order and Focus Flow</h3>
        <p>
          The sequential tab order follows the DOM source order by default. Interactive elements —
          links, buttons, form controls — are naturally tabbable. The diagram below shows how Tab
          moves through a typical page layout, highlighting the importance of DOM order matching
          visual order.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/keyboard-navigation-diagram-1.svg"
          alt="Tab order and focus flow through a page layout showing sequential navigation through header, navigation, main content, sidebar, and footer"
          caption="Sequential tab order follows DOM order. Interactive elements receive focus in the order they appear in the source, making DOM order critical for logical navigation."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Roving Tabindex Pattern</h3>
        <p>
          In composite widgets like toolbars, tab panels, and menu bars, having every item in the
          tab sequence creates an unmanageable number of tab stops. The roving tabindex pattern
          solves this by making the composite widget a single tab stop, with arrow keys handling
          internal navigation.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/keyboard-navigation-diagram-2.svg"
          alt="Roving tabindex pattern showing arrow key navigation within a toolbar group while Tab moves between groups"
          caption="Roving tabindex: Only one item per group has tabindex='0'. Arrow keys move focus within the group; Tab/Shift+Tab moves between groups."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Roving Tabindex Implementation</h3>
        <p>
          For roving tabindex implementation in React, create a Toolbar component that accepts items array. Use useState for activeIndex (default 0) and useRef for itemRefs array. In handleKeyDown with useCallback, handle ArrowRight to increment index with modulo wrap, ArrowLeft to decrement with wrap, Home to go to index 0, and End to go to last index. Call preventDefault for handled keys, set new activeIndex, and focus the new element. Render div with role toolbar, aria-label, and onKeyDown handler. Map over items to create buttons with ref callback storing in itemRefs, tabIndex 0 for active item and -1 for others, aria-pressed for active state, onClick for toggle, and label text.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Keyboard Trap in Modal Dialog</h3>
        <p>
          Modal dialogs intentionally trap focus to prevent users from interacting with background
          content. The focus cycles through focusable elements within the modal, and pressing Escape
          closes the dialog and returns focus to the trigger element.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/keyboard-navigation-diagram-3.svg"
          alt="Keyboard trap in modal dialog showing focus cycling through modal elements with Tab and Shift+Tab"
          caption="Intentional focus trap in a modal: Tab cycles forward through focusable elements, Shift+Tab cycles backward, and Escape exits the modal."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Focus Trap Hook Implementation</h3>
        <p>
          For focus trap hook for modal dialogs, create useFocusTrap function accepting isOpen. Use containerRef and previousFocusRef. Create getFocusableElements callback that queries container for links, buttons, inputs, selects, textareas, and tabindex elements. In useEffect on isOpen, store previous focus, get focusable elements, focus first element. Add keydown listener for Tab key that gets first and last focusable elements, prevents default and focuses last on Shift+Tab at first, prevents default and focuses first on Tab at last. Cleanup removes listener and restores focus to previous focus element. Return containerRef.
        </p>
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
                <td className="p-3 font-medium">Native HTML Elements</td>
                <td className="p-3">Keyboard accessible by default, built-in focus management, no ARIA needed, consistent across browsers</td>
                <td className="p-3">Limited styling options, restricted interaction patterns, may not match design requirements</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">Custom ARIA Widgets</td>
                <td className="p-3">Full design control, complex interaction patterns possible, matches any UI specification</td>
                <td className="p-3">Must implement all keyboard handling manually, higher bug risk, requires extensive testing, increased maintenance burden</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">Roving Tabindex</td>
                <td className="p-3">Actual DOM focus moves, works with all screen readers, simpler mental model</td>
                <td className="p-3">Must manage tabindex on each item, DOM updates on every arrow press, harder in virtualized lists</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">aria-activedescendant</td>
                <td className="p-3">Container retains focus, fewer DOM updates, works well with virtualized lists</td>
                <td className="p-3">Inconsistent screen reader support, scrolling must be managed manually, more complex to implement</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">Positive tabindex Values</td>
                <td className="p-3">Can override natural tab order when DOM restructuring isn&apos;t possible</td>
                <td className="p-3">Creates maintenance nightmare, confusing for users, breaks when elements are added/removed, anti-pattern in all guidelines</td>
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
            <strong>Prefer native HTML elements:</strong> Use <code>&lt;button&gt;</code> instead
            of <code>&lt;div onClick&gt;</code>, <code>&lt;a href&gt;</code> for navigation,
            and <code>&lt;input&gt;</code> for form controls. Native elements provide keyboard
            behavior, focus management, and screen reader semantics for free.
          </li>
          <li>
            <strong>Ensure DOM order matches visual order:</strong> Use CSS for visual positioning
            (flexbox order, grid placement) but keep the DOM in a logical reading sequence. Screen
            readers and keyboard navigation follow DOM order, not visual order.
          </li>
          <li>
            <strong>Implement roving tabindex for composite widgets:</strong> Toolbars, tab lists,
            menus, and tree views should be single tab stops with arrow key navigation inside. Follow
            the WAI-ARIA Authoring Practices for each widget type.
          </li>
          <li>
            <strong>Always provide visible focus indicators:</strong> Use <code>:focus-visible</code>
            to show focus rings only for keyboard navigation. Ensure focus indicators have at least
            3:1 contrast ratio against adjacent colors (WCAG 2.4.11).
          </li>
          <li>
            <strong>Handle Escape key consistently:</strong> Menus, dialogs, popovers, and tooltips
            should close when Escape is pressed. This is an expected convention that keyboard users
            rely on across all applications.
          </li>
          <li>
            <strong>Test with Tab, Shift+Tab, arrow keys, Enter, Space, and Escape:</strong> These
            cover the vast majority of keyboard interaction patterns. Ensure every interactive
            element can be reached, activated, and exited using only these keys.
          </li>
          <li>
            <strong>Never use positive tabindex values:</strong> Values like <code>tabindex=&quot;1&quot;</code>
            or <code>tabindex=&quot;5&quot;</code> override natural tab order and create
            an unpredictable, unmaintainable navigation sequence. Use only <code>0</code> and
            <code>-1</code>.
          </li>
          <li>
            <strong>Prevent default only when handling a key:</strong> If your component handles
            ArrowDown in a menu, call <code>e.preventDefault()</code> to stop page scrolling. But
            don&apos;t prevent default for keys you don&apos;t handle — this blocks expected browser
            behavior like Ctrl+C for copy.
          </li>
        </ol>
      </section>

      {/* ─── Section 6: Common Pitfalls ─── */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Using div or span as interactive elements without keyboard support:</strong> A
            <code>&lt;div onClick&gt;</code> is not keyboard accessible. It needs
            <code>role=&quot;button&quot;</code>, <code>tabindex=&quot;0&quot;</code>, and an
            <code>onKeyDown</code> handler for Enter and Space. Better yet, use a real
            <code>&lt;button&gt;</code>.
          </li>
          <li>
            <strong>Removing focus outlines globally:</strong> The CSS rule
            <code>{`*:focus { outline: none }`}</code> is one of the most common accessibility
            violations. Replace it with <code>:focus-visible</code> styling or custom focus
            indicators.
          </li>
          <li>
            <strong>Creating unintentional keyboard traps:</strong> Custom widgets that capture
            keyboard events (e.g., rich text editors, code editors) can trap focus if they don&apos;t
            provide an escape mechanism. Always test that Tab can leave the component.
          </li>
          <li>
            <strong>Making non-interactive elements focusable:</strong> Adding
            <code>tabindex=&quot;0&quot;</code> to paragraphs, divs, or headings forces keyboard users
            to tab through content that provides no interactive value. Only interactive elements
            should be in the tab order.
          </li>
          <li>
            <strong>Inconsistent keyboard patterns across similar components:</strong> If one dropdown
            uses Enter to open and another uses Space, users can&apos;t build muscle memory. Follow
            WAI-ARIA Authoring Practices for consistent patterns.
          </li>
          <li>
            <strong>Forgetting Shift+Tab and arrow key navigation:</strong> Testing only forward Tab
            misses backward navigation and internal widget navigation. Users navigate in both
            directions and expect arrow keys in composite widgets.
          </li>
          <li>
            <strong>Breaking keyboard access with CSS display: none on focus:</strong> Some designs
            hide elements and reveal them on hover. If these elements aren&apos;t revealed on focus
            as well, keyboard users can never reach them.
          </li>
        </ul>
      </section>

      {/* ─── Section 7: Real-World Use Cases ─── */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-2">
          <li>
            <strong>Gmail:</strong> Implements comprehensive keyboard shortcuts (j/k for
            navigating emails, e for archive, r for reply) with a help dialog (?) showing all
            shortcuts. The compose window uses roving tabindex for the formatting toolbar.
          </li>
          <li>
            <strong>Slack:</strong> Supports keyboard navigation through channels (Alt+Up/Down),
            messages, and threads. The message composer handles Tab for mentions autocomplete
            without trapping focus.
          </li>
          <li>
            <strong>VS Code (Web):</strong> Full keyboard operability including command palette
            (Ctrl+Shift+P), sidebar navigation, editor tabs, and integrated terminal. Demonstrates
            how complex applications can be fully keyboard-driven.
          </li>
          <li>
            <strong>GitHub:</strong> Keyboard shortcuts for repository navigation (t for file
            finder, / for search), pull request review, and issue management. Focus management
            during inline code review comments.
          </li>
          <li>
            <strong>Adobe Spectrum (React Spectrum):</strong> Open-source component library that
            implements WAI-ARIA keyboard patterns correctly for all widgets, including virtualized
            lists with aria-activedescendant and complex grid navigation.
          </li>
        </ul>
      </section>

      {/* ─── Section 8: References & Further Reading ─── */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              WAI-ARIA Authoring Practices Guide (APG)
            </a>{" "}
            — Keyboard interaction patterns for every common widget type.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Understanding WCAG 2.1.1: Keyboard
            </a>{" "}
            — Official W3C guidance on keyboard accessibility requirements.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Understanding WCAG 2.4.7: Focus Visible
            </a>{" "}
            — Requirements for visible focus indicators.
          </li>
          <li>
            <a href="https://react-spectrum.adobe.com/react-aria/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              React Aria by Adobe
            </a>{" "}
            — Hooks library implementing WAI-ARIA keyboard patterns for React.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              MDN: Keyboard-navigable JavaScript widgets
            </a>{" "}
            — Practical guide to making custom widgets keyboard accessible.
          </li>
        </ul>
      </section>

      {/* ─── Section 9: Common Interview Questions ─── */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What is the difference between tabindex 0, -1, and positive values?</h3>
          <p>
            <code>tabindex=&quot;0&quot;</code> places an element in the natural tab order based on
            its DOM position. <code>tabindex=&quot;-1&quot;</code> removes it from the tab order but
            allows programmatic focus via <code>element.focus()</code> — essential for roving
            tabindex patterns and focus management. Positive values (1, 2, 3...) force elements to
            receive focus before all <code>tabindex=&quot;0&quot;</code> elements, creating an
            unpredictable order that becomes unmaintainable as the page grows. The WAI-ARIA Authoring
            Practices and every major accessibility guideline recommend never using positive tabindex.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What is roving tabindex and when would you use it?</h3>
          <p>
            Roving tabindex is a keyboard navigation pattern for composite widgets (toolbars, tab
            lists, menus, tree views) where only one item has <code>tabindex=&quot;0&quot;</code>
            while all siblings have <code>tabindex=&quot;-1&quot;</code>. Arrow keys move the
            <code>tabindex=&quot;0&quot;</code> designation and DOM focus from item to item. This
            makes the entire widget a single tab stop — users Tab into the widget, use arrows to
            navigate within it, then Tab out. Without roving tabindex, a toolbar with 15 buttons
            would require 15 tab presses to traverse, breaking the user&apos;s flow.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How would you make a custom dropdown menu keyboard accessible?</h3>
          <p>
            The menu button should be a <code>&lt;button&gt;</code> with <code>aria-haspopup=&quot;true&quot;</code>
            and <code>aria-expanded</code> toggled on activation. The menu itself uses
            <code>role=&quot;menu&quot;</code> with child <code>role=&quot;menuitem&quot;</code> elements.
            Enter or Space on the button opens the menu and moves focus to the first item. Arrow
            keys navigate between items (roving tabindex). Enter activates the focused item. Escape
            closes the menu and returns focus to the button. Tab also closes the menu. First-letter
            navigation optionally jumps to matching items. The entire menu is a single tab stop.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What is a keyboard trap and when is it acceptable?</h3>
          <p>
            A keyboard trap occurs when a user can Tab into a component but cannot Tab out. WCAG
            2.1.2 forbids unintentional keyboard traps. However, intentional traps are acceptable
            and even required in modal dialogs — focus must stay within the modal until the user
            explicitly dismisses it (via Escape, a close button, or a confirmation action). The key
            requirement is that an escape mechanism always exists. Rich text editors and embedded
            iframes can create tricky trap scenarios; these should provide a documented keyboard
            shortcut (like Ctrl+Shift+Escape) to exit.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How do you test keyboard accessibility?</h3>
          <p>
            Manual testing: unplug the mouse and navigate the entire application with Tab,
            Shift+Tab, arrows, Enter, Space, and Escape. Verify every interactive element is
            reachable, has a visible focus indicator, and can be activated. Automated: use axe-core
            or Lighthouse to detect missing tabindex, missing roles, and focus order issues — though
            automated tools catch only ~30% of keyboard issues. Integration tests: use Testing
            Library&apos;s <code>userEvent.tab()</code> and <code>userEvent.keyboard()</code> to
            simulate keyboard interactions and assert focus position. CI: run axe-core in headless
            browser tests to catch regressions. Real user testing with keyboard-only users provides
            the most valuable feedback.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What is the difference between :focus and :focus-visible?</h3>
          <p>
            <code>:focus</code> applies whenever an element has focus — whether from keyboard, mouse,
            or programmatic focus. <code>:focus-visible</code> applies only when the browser
            determines the user is navigating via keyboard (heuristic-based). This distinction lets
            designers show focus rings for keyboard users while hiding them for mouse users, solving
            the long-standing complaint that focus outlines are &quot;ugly&quot; without sacrificing
            accessibility. The common pattern is: <code>{`:focus { outline: none } :focus-visible { outline: 2px solid #6d5bd0 }`}</code>.
            All modern browsers support <code>:focus-visible</code>.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
