"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-stepper-progress-tracker",
  title: "Design a Stepper / Progress Tracker",
  description:
    "Stepper and progress tracker for multi-step async flows with async validation gates, backward navigation rules, unsaved guard, URL sync, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "stepper-progress-tracker",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  tags: ["lld", "stepper", "progress", "multi-step", "validation", "accessibility", "wizard"],
  relatedTopics: ["wizard-multi-step-form", "form-builder", "payment-checkout-ui"],
};

export default function ArticlePage(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Stepper Progress Tracker</h1><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Stepper / Progress Tracker around semantic DOM, accessibility, controlled state, focus ownership, lifecycle cleanup, and reusable API governance. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><p>Design a Stepper Progress Tracker is an implementation-heavy low-level design problem covering step state transitions, async gates, conditional branches, backward-navigation policy, URL synchronization, draft persistence, and accessibility. A principal-level answer must define state ownership, durable boundaries, lifecycle cleanup, degraded behavior, privacy, cost, and observability.</p><p>Treat the workflow as a directed state machine. The current step, completed steps, validation status, branch inputs, and navigation intent must remain separate. The core structures are step graph, current step id, completed set, branch context, validation generation, draft version, URL projection, dirty flag, and focus target.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/stepper-progress-tracker-runtime.svg" alt="Design a Stepper Progress Tracker runtime" caption="Topic-specific runtime stages from user intent through durable projection." /></section>
<section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: one committed semantic state must drive ARIA attributes, keyboard behavior, callbacks, visual state, and cleanup effects.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Stepper / Progress Tracker, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><p>
        A stepper component is the backbone of multi-step user flows — checkout funnels,
        onboarding wizards, tax filing forms, insurance applications. The visual
        indicator (numbered steps with connecting lines) seems simple, but the state
        model underneath is surprisingly rich. It must handle async validation that
        can fail after the user has already moved forward, non-linear navigation (jumping
        directly to a completed step), conditional steps that appear or disappear based
        on earlier answers, unsaved-change guards that warn before abandoning a step,
        and URL synchronization that lets users bookmark their progress. Getting these
        right is what distinguishes a production wizard from a tutorial demo.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/stepper-progress-tracker-architecture.svg"
        alt="Stepper progress tracker architecture diagram"
        caption="Stepper architecture: step state machine, async validation, navigation rules, URL sync and guard"
      />

      <h3>Clarifying the Requirements</h3>
      <p>
        Several dimensions need clarification before designing the architecture:
      </p>
      <p>
        <strong>Linear vs non-linear navigation.</strong> Linear steppers allow only
        Next and Back — the user cannot skip ahead or click a completed step's indicator
        to jump back to it. Non-linear steppers allow clicking any completed step's
        indicator to navigate directly to it. The state model differs: linear needs
        only a current step index; non-linear needs a visited/completed set to know
        which steps the user may jump to.
      </p>
      <p>
        <strong>Validation model.</strong> Client-side validation only? Or does each
        step validate against a server (e.g., a backend that checks coupon code
        validity, address verification, or email uniqueness)? Server validation
        means each Next button click triggers an async operation that may succeed or
        fail, and the UI must handle loading and error states.
      </p>
      <p>
        <strong>Persistence.</strong> Does progress survive a page refresh? A checkout
        where the user reaches step 3, refreshes by accident, and is returned to step 1
        is a conversion killer. Progress persistence (to sessionStorage or a server)
        is a high-business-value feature that requires explicit design.
      </p>
      <p>
        <strong>Conditional steps.</strong> Does the step sequence change based on
        earlier answers? For example, a "Do you have a promo code?" step only appears
        for certain users, or a business registration flow has different steps than
        a personal registration. Conditional steps require a dynamic step graph, not
        a fixed array.
      </p>

      <h3>The Step State Machine</h3>
      <p>
        Each step has an independent status: pending (not yet visited), active (currently
        shown), completed (visited and successfully validated), invalid (visited but
        failed validation), or skipped (bypassed by conditional logic). The stepper's
        overall state is the collection of all step statuses plus the current step index.
      </p>
      <p>
        The state machine for a step transitions as follows: pending → active (user
        navigates to this step). active → completed (user clicks Next and validation
        passes). active → invalid (user clicks Next and validation fails). completed →
        active (user navigates back or clicks the step indicator). invalid → active
        (user returns to fix errors). skipped → active (conditional logic re-includes
        the step on a later change).
      </p>
      <p>
        These transitions are modeled as a useReducer. Actions are: NAVIGATE_TO_STEP
        (with target index), VALIDATE_START (begins async validation for the current
        step), VALIDATE_SUCCESS (validation passed; advance to next step), VALIDATE_FAIL
        (validation failed; mark current step invalid), MARK_SKIPPED (conditional logic
        bypasses a step), and RESET (return to initial state).
      </p>
      <HighlightBlock as="p" tier="crucial">
        The validation gate — the logic that runs when the user clicks Next — must be
        asynchronous and idempotent. If the user clicks Next twice quickly, only one
        validation should run. Implement this by storing a "validating" flag in state
        and ignoring additional Next clicks while it is true. The flag is set by
        VALIDATE_START and cleared by VALIDATE_SUCCESS or VALIDATE_FAIL. Also generate
        a request ID for each validation; if a stale response arrives after the user
        navigated away, ignore it by comparing response request IDs.
      </HighlightBlock>

      <h3>Backward Navigation Rules</h3>
      <p>
        Backward navigation (clicking Back) seems straightforward but has important edge
        cases. The key question: should going back mark the current step as "pending"
        or leave it as "completed"? The answer depends on whether the current step's
        data affects the validity of earlier steps' data.
      </p>
      <p>
        The safest general rule: going back leaves the current step as completed (or
        invalid, whichever it was). The user can return to it later. Going back does
        not trigger validation — the current step's data is saved. This preserves the
        user's work and allows non-destructive backward navigation.
      </p>
      <p>
        A stricter rule, appropriate for tightly coupled flows (e.g., a tax form where
        Step 2 fields depend on Step 1 answers): going back to Step 1 and changing an
        answer invalidates Step 2 through Step N. Implement this by tracking a
        "dirty" flag per step. When the user changes an earlier step's data, mark all
        subsequent steps as pending and clear their validated status. Show a confirmation
        dialog before allowing this — "Going back and changing this answer will reset
        steps 3–5. Continue?"
      </p>
      <p>
        For flows that prevent backward navigation entirely (certain payment flows,
        security-sensitive forms), the Back button is disabled after the user passes
        a specific checkpoint step. Model this as a step-level flag: backAllowed: false.
        The stepper reads this flag and disables/hides the Back button for those steps.
      </p>

      <h3>Async Validation Gate Implementation</h3>
      <p>
        The async validation pattern: when the user clicks Next, the stepper calls the
        current step's validate function (provided by the step's content component via
        a ref or a registerValidator API). The validate function returns a Promise that
        resolves with a ValidationResult: either a valid result or an invalid result with
        an errors string array.
      </p>
      <p>
        The stepper shows a loading indicator on the Next button while validation is
        pending (spinner replacing the button label, button disabled to prevent double-submit).
        If validation resolves successfully, dispatch VALIDATE_SUCCESS: mark the step
        completed, advance the index. If validation rejects or returns invalid, dispatch
        VALIDATE_FAIL: mark the step invalid, keep the current index, show the error
        messages within the step's content.
      </p>
      <p>
        The step component provides its validation function to the stepper through a
        combination of React context and useImperativeHandle (or a simpler registration
        pattern using a ref callback). The stepper provides a context value with a
        registerValidator(stepIndex, validateFn) method; each step content component
        calls this on mount and deregisters on unmount. The stepper's Next handler
        reads the registered function for the current step and calls it.
      </p>
      <p>
        For client-side validation only (no server round-trip), the validate function
        is synchronous and wrapped to return a resolved Promise. The stepper code does
        not need to differentiate — it always awaits the Promise.
      </p>

      <h3>Conditional and Dynamic Step Graphs</h3>
      <p>
        Conditional steps are common in real-world flows. A registration wizard might
        show a "Business information" step only if the user selected "Business account"
        in step 1. A checkout might skip the shipping step for digital products.
      </p>
      <p>
        The step graph is computed from the current form state as a pure function:
        computeSteps(formData) returns an array of step definitions. This function is
        called on every render. When the result changes (a step is added or removed),
        the stepper reconciles the new step list with the current progress state: steps
        that existed and have completion data retain their status; newly added steps
        start as pending; removed steps' data is preserved in form state but the step
        is removed from the progress model.
      </p>
      <p>
        The reconciliation must not reset the current step index if the user is on a
        step that still exists in the new list. If the user is on step index 3 and
        a step is removed at index 1, the current step is now at a shifted position
        — adjust the current index to maintain focus on the same step definition
        (by ID, not index).
      </p>

      <h3>Unsaved Change Guard</h3>
      <p>
        Before allowing navigation away from a step with unsaved changes (either via
        Back, clicking a step indicator, or the browser's own navigation), the stepper
        should warn the user. This prevents accidental data loss — a common pain point
        in long forms.
      </p>
      <p>
        Each step content component reports its "dirty" status to the stepper via the
        same registration mechanism used for validation: registerDirtyCheck(stepIndex,
        isDirtyFn). The isDirtyFn returns a boolean indicating whether the step has
        unsaved changes relative to the last saved state.
      </p>
      <p>
        When navigation is requested, the stepper calls isDirtyFn for the current step.
        If dirty, show a confirmation dialog ("You have unsaved changes. Leave this step?
        Your changes will be lost."). If the user confirms, proceed with navigation. If
        the user cancels, abort navigation.
      </p>
      <HighlightBlock as="p" tier="important">
        The browser's native beforeunload event is a separate concern from the
        stepper's internal navigation guard. If the user navigates away using the
        browser's back button or closes the tab, the stepper's dialog will not appear.
        For critical flows (tax filing, payment), also register a beforeunload handler
        that triggers the browser's native "Leave site?" dialog. Remove this handler
        when the stepper reaches its final completed state, so it does not annoy users
        who have legitimately finished the flow.
      </HighlightBlock>

      <h3>URL Synchronization and Progress Persistence</h3>
      <p>
        URL synchronization serves two purposes: bookmarkability (the user can share or
        revisit a specific step URL) and browser history integration (the browser's back
        button navigates between steps). Implement URL sync by encoding the current step
        ID as a URL search parameter (e.g., ?step=shipping or ?step=3).
      </p>
      <p>
        On mount, read the URL parameter and initialize the stepper at the specified step —
        but only if the user has reached that step previously (check the progress state
        from sessionStorage). If the user has not reached that step, redirect to the
        first incomplete step. This prevents users from bookmarking a URL for a late
        step and then navigating there without completing earlier steps.
      </p>
      <p>
        Progress persistence uses sessionStorage (not localStorage, since wizard progress
        is session-scoped). On each step completion, serialize the progress state and
        form data to sessionStorage. On mount, restore from sessionStorage if available
        and a session key matches. Clear sessionStorage on final submission or
        intentional abandonment.
      </p>
      <p>
        For more durable persistence (e.g., a mortgage application the user might
        return to days later), server-side draft saving is appropriate. On each step
        completion, POST the step data to a draft endpoint. The draft is associated
        with the user's session or authentication token. On return visit, fetch the
        draft and restore it. Show a "Resume your application" prompt rather than
        silently restoring, to orient the user.
      </p>

      <h3>Step Indicator Component Design</h3>
      <p>
        The step indicator (the row of numbered circles with connecting lines) is a
        presentational component driven by the step status array. Each indicator shows:
        a number for pending steps, a check icon for completed steps, an X or exclamation
        icon for invalid steps, and a spinner for the active step while validating.
      </p>
      <p>
        The connecting line between steps changes color based on the completion state
        of the preceding step: gray for uncompleted, colored for completed. CSS handles
        this with data attributes or class names driven by the status.
      </p>
      <p>
        In a non-linear stepper, completed step indicators are clickable — they navigate
        directly to that step. They are button elements with an accessible label
        ("Go to step 2: Shipping information"). Pending and invalid steps may be
        non-interactive (just visual indicators) or may be clickable to allow jumping
        ahead with a confirmation.
      </p>

      <h3>Accessibility Model</h3>
      <p>
        The step indicator should use an ordered list (ol) with list items (li) for
        the step indicators. Each step is a list item containing either a button
        (for navigable steps) or a span (for non-interactive steps). The ol has an
        aria-label ("Progress: step 2 of 5") that updates dynamically.
      </p>
      <p>
        The current step content panel has role="region" with aria-label matching
        the current step name. When the step changes, move focus to the panel's heading
        or first interactive element so screen reader users receive an announcement of
        the new step. Use React's flushSync or a setTimeout to ensure focus is moved
        after the DOM has updated.
      </p>
      <p>
        For the validation state: when a step fails validation, move focus to the
        first error message within the step content. Use a visually hidden live region
        with aria-live="polite" and aria-atomic="true" to announce the number of
        errors ("3 validation errors found. Please review the highlighted fields.")
        before moving focus.
      </p>
      <p>
        The Next and Back buttons should have descriptive accessible names reflecting
        the navigation context: "Next: Review order" (the name of the next step) rather
        than just "Next." This helps screen reader users anticipate what pressing Next
        will do without having to read the entire step indicator.
      </p>

      <h3>Testing Strategy</h3>
      <p>
        Test the stepper's navigation state machine independently of its visual
        rendering. The reducer is a pure function and can be tested exhaustively:
        verify every valid action in every state combination. Test that invalid
        transitions are no-ops (calling VALIDATE_SUCCESS when not in a validating
        state does nothing).
      </p>
      <p>
        Integration tests using React Testing Library test the full flow: render the
        stepper with mock step content components, simulate clicking Next, await
        validation, assert the step indicator shows the correct status, and assert
        focus has moved to the new step. Test the unsaved guard by marking a step
        dirty and asserting the confirmation dialog appears on Back.
      </p>
      <p>
        URL sync testing: render with a router context (using MemoryRouter or a test
        router), simulate navigation, assert the URL parameter updates. Test restoration:
        render with an initial URL containing a step parameter and assert the stepper
        initializes at the correct step.
      </p></section>
<section><h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: controlled/uncontrolled ownership, keyboard model, focus return, timers, portals, layout measurement, and escape hatches.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock><p>Normalize input before applying typed transitions. Separate draft, preview, committed state, derived projection, integration effects, and bounded telemetry. Every timer, listener, observer, request, worker, and persisted preference needs an explicit owner and cleanup path.</p><p>Treat the workflow as a directed state machine. The current step, completed steps, validation status, branch inputs, and navigation intent must remain separate. Commit only after the current policy gate succeeds and retain enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/stepper-progress-tracker-recovery.svg" alt="Design a Stepper Progress Tracker recovery decisions" caption="Recovery flow: invalidate obsolete work, preserve recoverable state, and explain the outcome." /></section>
<section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock><p>A linear index is enough for fixed onboarding; a state graph is justified when branching, async gates, resumability, and auditability matter.</p><p>The workflow graph and durable draft are server-versioned when persistence matters. Local navigation is provisional until the active gate succeeds for the current draft generation. The scale risks are dynamic branches, async validation races, back navigation, resumed sessions, stale URLs, and steps removed after answers change. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic transitions only when rollback is deterministic and understandable. Keep authorization and conflict-sensitive truth server-side.</p></section>
<section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: interaction latency, focus failures, accessibility violations, render cost, cleanup count, and blocked transition count.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock><p>Use stable ids, typed events, explicit state unions, versioned persistence, generation guards, SSR-safe feature checks, semantic HTML, and idempotent cleanup. Test keyboard use, accessibility output, stale responses, retries, restoration, and constrained devices.</p><p>Measure transition latency, blocked actions, stale drops, rollbacks, cache pressure, retry exhaustion, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<h3>Principal defense: consistency, abuse, and lifecycle rollback</h3><p>For a reusable component, consistency means one committed semantic snapshot drives DOM attributes, focus behavior, and callbacks. Pointer movement, hover previews, timers, measurements, and async settlements are transient projections. Guard every delayed effect with ownership identity so stale work cannot reopen, overwrite, or announce a component after blur, disposal, navigation, or replacement. Rollback restores the last committed semantic state and performs idempotent cleanup.</p><p>Bound work even for small widgets: cap queued notices, cached failures, measured items, portal layers, suggestion rows, and animation updates. Validate externally supplied labels, URLs, markup, dimensions, and item ids before rendering or measuring. Avoid leaking private labels or raw payloads through telemetry. Track rejected transitions, timer drift, focus-return failures, layout shifts, cleanup counts, and degraded fallbacks.</p><h3>Trade-off and privacy boundary</h3><p>The component trade-off is richer behavior versus lifecycle complexity. Add measurement, portals, caching, animation, or background work only when the interaction benefit exceeds cleanup and stale-result risk. Privacy controls matter even for small widgets: do not expose private labels, URLs, document fragments, or user activity through analytics, announcements, cached previews, or cross-scope reuse.</p><section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: inaccessible clickable divs, stale callbacks, leaked timers, layout shifts, focus traps, and prop APIs that cannot evolve.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock><p>Common failures include mixing draft and commit, trusting arrival order, leaking resources, accepting obsolete async completion, and hiding rollback from the user.</p><p>For this topic, discard stale validation, recompute reachable steps after branch changes, redirect stale URLs, preserve recoverable drafts, and focus the first actionable error. Validate untrusted input, authorize durable mutations server-side, and bound resource usage.</p></section>
<section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock><p>This runtime applies to repeated workflows where browser, persistence, and policy boundaries can fail independently. Reuse the controller structure while injecting product-specific policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock><h3>How do you model state?</h3><p>Treat the workflow as a directed state machine. The current step, completed steps, validation status, branch inputs, and navigation intent must remain separate.</p><h3>What breaks at scale?</h3><p>dynamic branches, async validation races, back navigation, resumed sessions, stale URLs, and steps removed after answers change. I would bound expensive work and cancel obsolete effects.</p><h3>What consistency model applies?</h3><p>The workflow graph and durable draft are server-versioned when persistence matters. Local navigation is provisional until the active gate succeeds for the current draft generation.</p><h3>How do you recover?</h3><p>I would discard stale validation, recompute reachable steps after branch changes, redirect stale URLs, preserve recoverable drafts, and focus the first actionable error.</p><h3>Why this architecture?</h3><p>A linear index is enough for fixed onboarding; a state graph is justified when branching, async gates, resumability, and auditability matter.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li></ul></section>
</ArticleLayout>}
