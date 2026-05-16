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

export default function StepperProgressTrackerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
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

      <h2>Clarifying the Requirements</h2>
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

      <h2>The Step State Machine</h2>
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

      <h2>Backward Navigation Rules</h2>
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

      <h2>Async Validation Gate Implementation</h2>
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

      <h2>Conditional and Dynamic Step Graphs</h2>
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

      <h2>Unsaved Change Guard</h2>
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

      <h2>URL Synchronization and Progress Persistence</h2>
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

      <h2>Step Indicator Component Design</h2>
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

      <h2>Accessibility Model</h2>
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

      <h2>Testing Strategy</h2>
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
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: How do you prevent double-submission when the user clicks Next rapidly?</h3>
      <p>
        Maintain a "validating" boolean in the stepper's reducer state. Set it to true
        when VALIDATE_START is dispatched; clear it when VALIDATE_SUCCESS or VALIDATE_FAIL
        is dispatched. In the Next button's click handler, check this flag before
        starting validation — if already validating, return early. Also set the Next
        button to disabled when validating. This prevents both the UI click and any
        programmatic invocations from triggering duplicate validation calls. For the
        async validation function itself, use a request ID and ignore stale responses
        (responses whose ID does not match the most recently dispatched request ID).
      </p>

      <h3>Q: How do conditional steps interact with the completed/invalid status of steps that depended on the now-removed step?</h3>
      <p>
        This is an edge case that requires a decision about data coupling. If Step 3
        was completed and depended on data from Step 2, and Step 2 is later conditionally
        removed (because the user changed an answer in Step 1), Step 3's data may now
        be invalid even though it shows as "completed." The safest approach: when a
        step is removed, mark all subsequent steps as "pending" and clear their
        completion status (but preserve their form data in case the user re-enables
        the step). Show a toast notification: "Your progress on later steps may need
        review since step 2 was removed." This keeps the user informed and prevents
        submitting an inconsistent form.
      </p>

      <h3>Q: How do you design the stepper to support server-side rendering for the initial step?</h3>
      <p>
        Server-render the first step's content as the default state. The URL-based
        step parameter drives which step is rendered server-side. For a logged-in user
        with a saved draft, the server reads the draft from the session and renders
        the appropriate step's initial form state into the HTML. React hydrates the
        server-rendered HTML; the stepper reads the step parameter from the URL and
        the initial state from the server-rendered data attributes (or a script tag
        with JSON). This avoids the flash of the wrong step on load and ensures that
        users with slow JavaScript execution (or JS disabled) see the correct step.
        Without SSR, all users see a loading spinner until JavaScript initializes the
        stepper, which increases perceived latency.
      </p>

      <h3>Q: How does the step validation architecture scale to a 20-step wizard?</h3>
      <p>
        At 20 steps, a few practices become critical. First, lazy-load step content
        components — import each step component with dynamic import so only the current
        step's code is in the JavaScript bundle loaded on mount. This keeps the initial
        bundle small. Second, use a centralized form state store (Zustand or a context)
        so step components can be unmounted and remounted without losing their data.
        Third, batch the validation calls: for server-round-trip validations, batch
        the data from multiple completed steps into a single API call at the end rather
        than one call per step — this reduces latency and backend load. Fourth, add
        autosave: after each step's validation success, silently POST the step data
        to a draft endpoint so progress is never lost even if the user's session expires.
      </p>

      <h3>Q: How would you handle a step whose validation depends on a previous step's data?</h3>
      <p>
        Cross-step validation dependencies mean the validation function for Step N
        needs access to Step M's data. Model this by storing all form data in a shared
        context accessible to all step validators, not in each step's local state.
        The validate function for Step N receives the entire form state as an argument
        (or reads it from the context). This is a pure function: given the full form
        state, it returns a ValidationResult. The stepper calls this function with the
        current snapshot of form state on each validation attempt. Keeping validators
        as pure functions (no side effects, no direct DOM reads) makes them testable
        in isolation.
      </p>
    </ArticleLayout>
  );
}
