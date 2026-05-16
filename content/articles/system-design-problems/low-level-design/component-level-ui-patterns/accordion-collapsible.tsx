"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-accordion-collapsible",
  title: "Design an Accordion / Collapsible Section",
  description:
    "Accordion system with exclusive vs independent expand, animated height transitions, accessibility, nested accordions, and URL hash sync.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "accordion-collapsible",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  tags: ["lld", "accordion", "collapsible", "animation", "accessibility", "transitions"],
  relatedTopics: ["tree-view-folder-explorer", "tooltip-system", "modal-component"],
};

export default function AccordionCollapsibleArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        Accordion components appear deceptively simple — a list of headers, each toggling
        a content panel. But an interview-grade accordion design reveals a constellation of
        non-trivial decisions: how do you animate from zero to an unknown content height
        without measuring the DOM synchronously? How does exclusive mode prevent layout
        thrashing when two panels transition simultaneously? How do you build a keyboard
        model that works for both flat and nested accordions without breaking screen reader
        virtual-cursor flow? This article works through every layer.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/accordion-collapsible-architecture.svg"
        alt="Accordion component architecture diagram"
        caption="Accordion architecture: state machine, animation engine, keyboard model, and URL sync"
      />

      <h2>Clarifying the Requirements</h2>
      <p>
        Before diving into implementation, frame the design space with the interviewer.
        The answers meaningfully shape the architecture.
      </p>
      <p>
        The first axis is <strong>open-state cardinality</strong>: exclusive mode (one
        panel open at a time — typical for FAQ pages and navigation menus) versus
        independent mode (any number open simultaneously — typical for settings pages and
        documentation). Some products need both modes coexisting in the same UI, which
        argues for a controlled vs uncontrolled duality rather than a hard-coded flag.
      </p>
      <p>
        The second axis is <strong>animation fidelity</strong>. A marketing FAQ can
        accept a simple CSS opacity fade. An admin settings panel with dozens of items
        benefits from smooth height animation. A design system component consumed by
        fifty teams must handle arbitrary content — images that load after mount,
        dynamically injected children, responsive content that reflows at different
        viewport widths. Each scenario demands a different animation strategy.
      </p>
      <p>
        The third axis is <strong>nesting depth</strong>. A flat accordion (one level)
        is straightforward. Nested accordions (a panel contains its own accordion) create
        keyboard navigation conflicts and ARIA ownership challenges that require deliberate
        solutions.
      </p>
      <p>
        Other questions worth asking: Does the URL need to reflect which panels are open?
        Can panels be programmatically controlled by parent components? Does the component
        need to support server-rendered initial state (for SEO, for LCP)? Must it work
        without JavaScript (progressive enhancement)? Each "yes" adds a constraint that
        shapes the state model.
      </p>

      <h2>The State Model</h2>
      <p>
        The core state is a set of open item IDs. Using a Set rather than an array gives
        O(1) membership checks during toggle. The accordion's mode (exclusive vs
        independent) is a constraint applied to state transitions, not a separate piece
        of state itself.
      </p>
      <p>
        In exclusive mode, the toggle reducer is: if the toggled ID is currently open,
        produce an empty Set (collapse it); otherwise produce a singleton Set containing
        only the toggled ID (opening it collapses all others implicitly by construction).
        In independent mode: if the toggled ID is in the Set, produce Set minus that ID;
        otherwise produce Set plus that ID.
      </p>
      <HighlightBlock as="p" tier="crucial">
        The transition from one exclusive panel to another should not produce a state where
        zero panels are visible during the transition — that causes jarring layout shifts.
        The correct approach is to start the new panel's open transition while the old
        panel's close transition is still running. This means the state machine must
        distinguish between "logically open" (state-set membership) and "visually
        animating" (a separate per-item animation phase).
      </HighlightBlock>
      <p>
        Each accordion item therefore carries its own animation state: idle-closed,
        opening, open, closing. The logical open state drives the target; the animation
        state drives the CSS. Transitions:
      </p>
      <p>
        idle-closed → opening (when item toggled open) → open (when transition ends) →
        closing (when item toggled closed or exclusive mode selects a different item) →
        idle-closed (when close transition ends).
      </p>
      <p>
        This four-state machine is small enough to maintain in a useReducer. The reducer
        takes an action — either a toggle action (with an item ID) or a transitionEnd
        action (with an item ID and the completed phase). The reducer never directly
        reads the DOM; all DOM measurement happens in effects that dispatch actions back
        into the reducer.
      </p>

      <h2>The Animated Height Problem</h2>
      <p>
        CSS transitions work beautifully when both the start and end values are known
        static lengths. The accordion height problem is that content panels have
        intrinsic height — they depend on their children, which may be dynamic. You
        cannot transition from height: 0 to height: auto using CSS transitions; the
        browser does not interpolate through auto.
      </p>
      <p>
        There are three canonical approaches, each with tradeoffs:
      </p>
      <p>
        <strong>Approach 1 — max-height hack.</strong> Set max-height: 0 on the closed
        panel and max-height: some-large-value (e.g., 2000px) on the open panel, with
        a CSS transition on max-height. The panel animates open from 0 to the content
        height. Problems: the animation duration is calculated against the max-height,
        not the actual content height, so a 200px panel with max-height: 2000px will
        appear to animate very quickly at first and then slow to a crawl as the remaining
        1800px of invisible space "transitions." The result is an easing curve that looks
        wrong. Also, the panel can't animate to its actual height — it always transitions
        from 0 to max-height. This approach is appropriate only for simple cases where
        visual fidelity is not critical.
      </p>
      <p>
        <strong>Approach 2 — JavaScript-measured height.</strong> On mount (and on
        content changes), measure the panel's scrollHeight using a ResizeObserver or by
        reading panel.scrollHeight in a layout effect. Store this as a CSS custom
        property. Transition from height: 0 to height: var(--panel-height). This
        produces accurate animation duration regardless of content size. The tradeoff:
        you must re-measure whenever content changes. A ResizeObserver on the panel's
        inner container handles this automatically; when the observed size changes,
        update the CSS custom property and re-run any in-progress transition.
      </p>
      <p>
        <strong>Approach 3 — Web Animations API (WAAPI).</strong> Use
        element.animate to keyframe from height 0 to the measured scrollHeight directly,
        bypassing CSS custom properties entirely. WAAPI gives you programmatic control
        over playback (pause, reverse, cancel, commitStyles). This is the best approach
        for complex scenarios: you can reverse a mid-transition animation without
        producing a visual jump by reading the current animated height and starting a
        new animation from there.
      </p>
      <HighlightBlock as="p" tier="important">
        The mid-transition reversal problem is commonly overlooked in interviews. If a
        user rapidly toggles an item while it is mid-transition, a naive implementation
        that simply sets height back to 0 will cause a visual jump. The correct fix:
        when a reversal is requested, capture the panel's current computed height
        (getComputedStyle(panel).height), then animate from that value to the target
        (either 0 or scrollHeight). WAAPI makes this trivial; the CSS custom property
        approach requires setting the property to the current computed height before
        changing the target.
      </HighlightBlock>

      <h2>The ResizeObserver Integration</h2>
      <p>
        Content inside accordion panels is often dynamic — images that load asynchronously,
        text that reflows at different viewport widths, child components that mount
        additional content. If the panel height was measured once at mount, it becomes
        stale as soon as any of these changes occur.
      </p>
      <p>
        The solution is to observe the panel's inner content wrapper with a ResizeObserver.
        The observer fires whenever the content's border-box size changes. In the callback,
        update the CSS custom property and — if the panel is currently open — do not
        animate; just set the height directly (since the content has already changed, the
        user should not see an animation from the old measured height to the new one).
        If the panel is currently closed, simply update the stored measurement for use in
        the next open transition.
      </p>
      <p>
        One subtlety: ResizeObserver fires during the panel's own height animation,
        because the panel element's height is changing. This creates an infinite loop:
        animate height → ResizeObserver fires → update height → ResizeObserver fires.
        The fix is to observe only the inner content wrapper (whose height is determined
        by its children, not by the outer panel's CSS), not the outer panel element.
        The inner wrapper is positioned with overflow: visible and height: auto, so
        its observed size reflects only the content, not the animation.
      </p>

      <h2>Controlled vs Uncontrolled API</h2>
      <p>
        A well-designed accordion component follows the controlled/uncontrolled duality
        familiar from form inputs. In uncontrolled mode, the component manages its own
        open state internally using useReducer; the caller optionally provides
        defaultOpenIds to set the initial state. In controlled mode, the caller provides
        openIds and an onToggle callback; the component dispatches changes but does not
        store state.
      </p>
      <p>
        This duality is implemented using a "value/defaultValue" convention (borrowed
        from HTML inputs): if openIds prop is provided, the component is controlled;
        otherwise it manages internal state. A custom hook — useControllableState —
        encapsulates this logic: if the external value is defined, it returns that value
        and the external setter; otherwise it returns the internal state and its setter.
      </p>
      <p>
        The practical importance: the controlled API enables parent-driven scenarios —
        a documentation sidebar that programmatically opens the section corresponding
        to the current anchor, or a wizard that collapses all completed steps when the
        user reaches the final step. Without the controlled API, callers must use
        imperative refs (calling expand(id) on a ref), which is an anti-pattern that
        breaks React's declarative data flow.
      </p>
      <HighlightBlock as="p" tier="crucial">
        The exclusive mode constraint does not belong in the open-state model when the
        accordion is controlled. The parent is already managing state; it knows whether
        to close other panels when one is opened. Passing exclusive={true} to a
        controlled accordion is a no-op — the parent's onToggle handler is responsible
        for enforcing the constraint. Document this clearly in the API contract to avoid
        confusion.
      </HighlightBlock>

      <h2>Keyboard Navigation Model</h2>
      <p>
        ARIA Authoring Practices Guide (APG) specifies the expected keyboard behavior for
        accordions. The trigger buttons (the clickable headers) are in the page tab order.
        Users navigate between them using Tab and Shift+Tab. Each trigger is a proper
        button element (or has role="button"), not a div with an onClick.
      </p>
      <p>
        Additionally, the APG recommends optional arrow key navigation between triggers.
        Arrow Down moves focus to the next trigger; Arrow Up moves to the previous.
        Home moves to the first trigger; End moves to the last. This is roving tabindex:
        only the currently focused trigger has tabindex="0"; all others have
        tabindex="-1". Arrow keys update both the focused element and which element has
        tabindex 0.
      </p>
      <p>
        The critical question is whether to implement roving tabindex or to keep all
        triggers in the natural tab order with arrow keys as optional supplemental
        navigation. For most accordions, keeping all triggers in the tab order (no
        roving tabindex) is simpler and equally accessible. Roving tabindex is valuable
        when the number of items is large (dozens of triggers would make tabbing through
        the entire accordion tedious) or when the accordion is embedded in a larger
        navigable widget (like a tree). For typical FAQ accordions with 5–15 items,
        natural tab order is preferred.
      </p>
      <p>
        The Space and Enter keys both toggle the focused trigger. This matches the
        button element's native behavior, which is another reason to use button rather
        than a custom element — you get Space and Enter for free, plus Shift+F10 for
        context menus, without custom event handling.
      </p>

      <h2>ARIA Attributes and Semantic Structure</h2>
      <p>
        Each accordion item requires a specific ARIA ownership relationship between the
        trigger and the panel it controls. The trigger button has aria-expanded="true"
        when the panel is open and aria-expanded="false" when closed. It has
        aria-controls set to the ID of the panel it controls. The panel has role="region"
        and aria-labelledby set to the ID of the trigger that controls it.
      </p>
      <p>
        The role="region" assignment is conditional: the APG recommends omitting
        region when there are more than six accordion items, because screen readers
        announce every region as a landmark, and a page with twenty region landmarks
        becomes unwieldy to navigate via landmark shortcuts. For large accordions, omit
        the role attribute entirely — the trigger's aria-controls relationship is
        sufficient for users who navigate by control associations.
      </p>
      <p>
        The panel should not use display: none when closed, because display: none
        removes the element from the accessibility tree and prevents the aria-controls
        relationship from being useful (the controlled element cannot be found by
        assistive technologies). Instead, use height: 0 combined with overflow: hidden
        and optionally visibility: hidden. The element remains in the DOM and the
        accessibility tree; the aria-expanded false on the trigger already signals to
        screen readers that the content is collapsed.
      </p>
      <HighlightBlock as="p" tier="important">
        Using visibility: hidden in addition to height: 0 is important for screen
        readers that follow focus into collapsed panels. Without visibility: hidden,
        a user who tabs into a collapsed panel's content (which can happen if the panel
        contains focusable elements) would find themselves interacting with invisible
        content. The visibility: hidden removes the panel's content from the tab order
        and ensures keyboard focus cannot enter a collapsed panel.
      </HighlightBlock>

      <h2>Nested Accordions</h2>
      <p>
        Nested accordions — an accordion item whose panel contains another accordion —
        are common in documentation sidebars and complex settings pages. They introduce
        two non-trivial problems: context propagation and keyboard model conflict.
      </p>
      <p>
        <strong>Context propagation.</strong> The outer accordion has its own open state
        and mode (exclusive or independent). The inner accordion has its own. These must
        not interfere. The solution is a React context per accordion instance, keyed
        by a stable accordion ID generated at mount. Each Accordion component provides
        its own context; child AccordionItem components consume the nearest ancestor
        accordion context. Nested accordions naturally find the correct context through
        React's component tree resolution.
      </p>
      <p>
        <strong>Keyboard conflict.</strong> If both the outer and inner accordions
        implement roving tabindex with arrow keys, pressing Arrow Down inside the inner
        accordion will first move to the next item in the inner accordion, but if the
        user is at the last inner item, what should happen? Should focus move to the
        outer accordion's next item, or stay in the inner? The answer depends on the
        UX intent. The safest default: Arrow keys navigate only within the current
        accordion level; Tab moves between levels. This matches the behavior of
        nested menus and trees where arrow keys navigate within the current level and
        Tab escapes the widget.
      </p>
      <p>
        Nested accordions also require attention to ARIA ownership. The inner accordion's
        panels, if given role="region", create nested landmarks. Some screen readers
        do not handle nested regions well. The same rule applies: omit role="region"
        for large or nested accordions, and rely on aria-controls for the control
        relationship.
      </p>

      <h2>URL Hash Synchronization</h2>
      <p>
        For documentation and FAQ pages, deep-linking to a specific accordion item
        improves usability significantly: a support agent can send a user a URL that
        directly opens the relevant FAQ entry. Implementing URL hash sync requires
        deciding what is stored in the URL and how state restoration works on load.
      </p>
      <p>
        The simplest model: the URL hash is the ID of the currently open item (in
        exclusive mode). On mount, read window.location.hash, strip the leading hash
        character, and open the matching item if it exists. On toggle, push or replace
        the hash using the History API — pushState for user-initiated toggles,
        replaceState for programmatic ones.
      </p>
      <p>
        For independent mode (multiple open panels), the URL must encode a list of open
        IDs. Using a hash like "sections=intro,pricing,faq" parsed from
        URLSearchParams is readable and shareable. The tradeoff: URL length grows with
        the number of open items; for accordions with dozens of items, this becomes
        impractical. In those cases, limit URL sync to a single "last opened" item.
      </p>
      <p>
        URL sync should handle the popstate event (browser back/forward buttons) to
        restore the accordion state when the user navigates the history stack. This
        requires the accordion to subscribe to popstate and update its state from the
        URL on each navigation event.
      </p>
      <HighlightBlock as="p" tier="crucial">
        On initial load with a hash, scroll the matched panel into view after it opens.
        Simply opening the panel is not enough — the panel may be far down a long page.
        After the opening transition completes, call panel.scrollIntoView with
        behavior: 'smooth' and block: 'start'. Do this in the transitionEnd handler
        (or WAAPI onfinish callback), not immediately on mount, because the panel's
        height is zero until the transition completes and scrollIntoView would target
        the wrong position.
      </HighlightBlock>

      <h2>Server-Rendered Initial State</h2>
      <p>
        For SEO-critical FAQ pages, the expanded content must be in the initial HTML
        response, not injected by JavaScript after hydration. This requires server-side
        rendering with the correct initial open state — panels are rendered with
        height: auto and aria-expanded="true" on the server, then hydrated by
        React on the client.
      </p>
      <p>
        The challenge: React's hydration expects the client-rendered VDOM to match the
        server HTML exactly. If the accordion uses a CSS animation that starts from
        height: 0, the server-rendered panel (at height: auto) will not match, causing
        a hydration mismatch warning and a visual jump.
      </p>
      <p>
        The solution: suppress the animation on the first render using a ref that tracks
        whether this is the initial mount. In the animation logic, check this ref and
        skip the animated transition if true; just apply the target styles directly.
        After the first render cycle, set the ref to false. This allows server-rendered
        panels to appear in their final open state without an opening animation,
        while subsequent user-triggered toggles animate normally.
      </p>

      <h2>Performance Considerations</h2>
      <p>
        For accordions with many items (50+ in a settings page), the performance
        footprint matters. Each AccordionItem mounts a ResizeObserver and an event
        listener on its trigger. For 50 items, this is 100 observers/listeners — still
        negligible for modern browsers, but worth noting. Event delegation on the
        accordion root (a single click listener that identifies which trigger was clicked
        by its data-item-id attribute) reduces the listener count to one per accordion,
        at the cost of slightly more complex event handling.
      </p>
      <p>
        The more impactful optimization is lazy rendering of panel content. If panel
        content includes heavy components (charts, editors, rich media), mounting all
        50 panels on initial render even though 49 are collapsed is wasteful. Lazy
        rendering defers the mount of panel content until the panel is first opened.
        Once opened, the content remains mounted (to preserve component state such as
        form inputs) even when the panel is closed again. This is the same strategy
        used by tab components.
      </p>
      <p>
        The implementation: each item has a mounted flag in its state, initially false
        for closed items and true for initially open items. When an item transitions
        to opening for the first time, set mounted to true. Once true, it never becomes
        false again. In the render, the panel's inner wrapper renders null if mounted
        is false, or the panel content if true. This prevents an empty DOM node from
        taking up space during the collapsed state.
      </p>

      <h2>Integration with Form Validation</h2>
      <p>
        A common real-world pattern: a multi-section form where each section is an
        accordion item. When the user submits the form and validation fails, the sections
        containing errors should automatically open to reveal the error messages. Sections
        without errors may optionally close (in exclusive mode) or remain as-is (in
        independent mode).
      </p>
      <p>
        This requires the controlled accordion pattern: the parent form component holds
        the open state, runs validation on submit, determines which sections have errors,
        and updates the open state to include those sections. The accordion renders the
        new state. The controlled API makes this straightforward; an uncontrolled
        accordion would require an imperative ref to call an expand method.
      </p>
      <p>
        After the parent opens the error sections, focus should move to the first error
        field within the first opened section. This requires coordination between the
        accordion's transitionEnd event and the form's focus management. A pattern: the
        accordion exposes an onTransitionEnd callback; the parent uses it to focus the
        first error field after the panel finishes opening.
      </p>

      <h2>Design System Component API</h2>
      <p>
        A design system accordion component needs a clear, ergonomic API that is both
        composable and predictable. The common pattern is a compound component structure:
        an Accordion root, AccordionItem, AccordionTrigger, and AccordionContent.
        This mirrors the structure of Radix UI's and HeadlessUI's accordion
        implementations.
      </p>
      <p>
        The Accordion root accepts: mode ('exclusive' or 'independent'), defaultOpenIds
        (uncontrolled initial state), openIds (controlled state), onToggle (controlled
        state change handler), and optional animation configuration (duration in ms,
        easing function).
      </p>
      <p>
        AccordionItem accepts a unique id and an optional disabled flag. It provides
        its id and disabled state to child components via a local context.
        AccordionTrigger renders a button, reads the item's id from context, and wires
        up the click handler, aria-expanded, and aria-controls attributes automatically.
        AccordionContent renders the animated panel, reads the item's id from context,
        and manages the height animation and aria-hidden states.
      </p>
      <HighlightBlock as="p" tier="important">
        Avoid the pattern of accepting a "renderHeader" render prop on AccordionItem.
        It couples the accordion's layout to the caller's render function, making it
        impossible to add icons, badges, or supplementary controls to the header without
        changing the component's API. The compound component pattern (separate
        AccordionTrigger) gives callers full compositional control over header content
        while keeping the accordion's accessibility wiring internal.
      </HighlightBlock>

      <h2>Testing Strategy</h2>
      <p>
        An accordion's correctness is best verified by integration tests that exercise
        the full interaction cycle rather than unit tests on the state reducer. Use
        React Testing Library to render the accordion with real children and assert on
        the aria attributes and DOM state.
      </p>
      <p>
        Key test cases: (1) Clicking a closed trigger opens its panel (aria-expanded
        becomes true, panel becomes visible). (2) In exclusive mode, opening item B
        when item A is open closes item A. (3) In independent mode, opening item B
        when item A is open leaves both open. (4) Clicking an open trigger closes it.
        (5) A disabled trigger cannot be toggled. (6) Keyboard: Space and Enter toggle
        the focused trigger. (7) Arrow keys navigate between triggers when roving
        tabindex is enabled.
      </p>
      <p>
        Animation testing requires mocking transitions. Use fake timers (jest.useFakeTimers)
        and advance the clock past the animation duration to trigger transitionend events.
        Alternatively, configure the animation duration to 0 in test mode and assert on
        final state only. Testing the mid-transition reversal behavior specifically
        requires a careful sequence: trigger open, advance clock to 50% of duration,
        trigger close, advance to completion, assert panel is closed and at height 0.
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: Why not use the HTML details and summary elements instead of a custom accordion?</h3>
      <p>
        The details/summary elements provide built-in expand/collapse with no JavaScript
        and solid accessibility out of the box. They are the right choice for simple
        single-item disclosures or when progressive enhancement is paramount. However,
        they have significant limitations for design system use: they cannot be
        animated without JavaScript (the browser's native toggle has no CSS transition
        hook), they do not support exclusive mode (closing others when one opens) without
        JavaScript, their visual appearance is difficult to customize consistently
        across browsers, and they do not support the compound component compositional
        pattern needed for complex header content. For a design system component that
        needs animation, exclusive mode, and full styling control, a custom implementation
        is necessary. The details element can serve as the HTML fallback in a progressive
        enhancement approach.
      </p>

      <h3>Q: How do you handle a panel whose content changes height after it is open — for example, an image that loads after the panel opens?</h3>
      <p>
        A ResizeObserver on the panel's inner content wrapper handles this automatically.
        When the image loads, the content wrapper's height changes; the ResizeObserver
        callback fires and updates the panel's height CSS custom property (or re-runs
        the WAAPI animation from the new current height to the new target). Since the
        panel is already open, no animation is needed — just update the height directly.
        The key is observing the inner content wrapper (not the outer animated panel),
        because the outer panel's height is controlled by the animation and would trigger
        the observer on every frame if observed directly.
      </p>

      <h3>Q: How does exclusive mode work correctly when the user rapidly toggles items?</h3>
      <p>
        Naive exclusive mode (close item A, then open item B) produces a visible layout
        collapse between the two states: the page height drops as A closes, then grows
        as B opens. The correct approach is concurrent transitions: begin B's opening
        animation at the same time A's closing animation starts. This requires the
        animation state to be per-item (each item knows whether it is opening or closing
        independently) rather than shared. The layout impact is reduced because A's
        height decreases at the same rate that B's height increases, so the total page
        height remains approximately stable throughout the transition.
      </p>

      <h3>Q: What is the performance impact of mounting a ResizeObserver on every accordion item?</h3>
      <p>
        A ResizeObserver is extremely lightweight — it uses a single shared background
        thread for all observations in the browser, not a per-observer thread. Mounting
        50 ResizeObserver instances on 50 accordion items is typically measured in
        microseconds of overhead. The practical concern is not the observer cost but the
        JavaScript callback cost when many panels resize simultaneously (such as on a
        viewport resize event). Using ResizeObserver.observe with a debounced callback,
        or batching updates in a requestAnimationFrame, mitigates this. In practice, for
        accordion items whose content does not resize independently (static text), the
        ResizeObserver never fires after initial mount, making the overhead negligible.
      </p>

      <h3>Q: How would you implement an accordion that works without JavaScript for SEO and accessibility?</h3>
      <p>
        The progressive enhancement approach: render the accordion using details/summary
        elements, which work natively in all modern browsers without JavaScript. This
        gives you free expand/collapse, keyboard accessibility, and correct aria semantics
        from the browser's shadow DOM. On the client, React hydrates over the existing
        HTML and enhances it: wrapping the details elements with the custom state model,
        adding animations, and wiring up exclusive mode. The detail elements become
        controlled (JavaScript prevents the native toggle and handles state manually).
        This approach requires careful hydration — the client-rendered VDOM must match
        the server-rendered HTML structure of the details/summary elements exactly.
      </p>

      <h3>Q: How do you test keyboard navigation without a real browser?</h3>
      <p>
        React Testing Library's userEvent module simulates realistic keyboard interactions
        including tabbing and key presses. userEvent.tab() advances focus through the
        DOM in tab order; userEvent.keyboard('[ArrowDown]') dispatches keyboard events
        on the focused element. These simulate the interactions at the event level, so
        they exercise the actual keyboard handlers without needing a real browser. For
        focus trap and roving tabindex scenarios, assert on document.activeElement after
        each interaction. For screen reader behavior (whether aria-expanded is
        announced), use an accessibility tree audit library such as jest-axe combined
        with manual testing in NVDA/VoiceOver — automated tests verify the correct
        ARIA attributes but cannot verify how screen readers verbalize them.
      </p>
    </ArticleLayout>
  );
}
