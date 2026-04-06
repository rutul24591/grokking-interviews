"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-wizard-multi-step-form",
  title: "Design a Wizard / Multi-step Form",
  description:
    "Complete LLD solution for a production-grade wizard/multi-step form with step definition, validation gating, state preservation, conditional steps, draft saving, summary review, accessibility, and keyboard navigation.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "wizard-multi-step-form",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "wizard",
    "multi-step-form",
    "validation",
    "state-management",
    "accessibility",
    "draft-persistence",
    "conditional-steps",
  ],
  relatedTopics: [
    "form-builder",
    "data-table",
    "rich-text-editor",
    "modal-component",
  ],
};

export default function WizardMultiStepFormArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable wizard/multi-step form component for a
          large-scale React application. The wizard guides users through a complex
          data-entry workflow broken into discrete, manageable steps. Each step
          presents a subset of fields, validates user input before allowing
          progression, and preserves all entered data so users can navigate back
          and forth without losing work. The wizard must support conditional steps
          (skipping steps based on previous answers), draft auto-saving to
          <code>localStorage</code> or a remote API, a final summary review step
          showing all entered data before submission, and both linear (forced
          sequential) and non-linear (allowing jumps between completed steps)
          navigation modes.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with Zustand for state management.
          </li>
          <li>
            Each step is defined declaratively as an object with a title, field
            definitions, and validation rules.
          </li>
          <li>
            The wizard may contain 3-12 steps depending on the use case (e.g.,
            user onboarding, application submission, product configuration).
          </li>
          <li>
            Field values persist even when steps are skipped or revisited.
          </li>
          <li>
            Drafts are auto-saved periodically and restored on return.
          </li>
          <li>
            The system must support accessibility requirements (screen readers,
            keyboard navigation, focus management on step change).
          </li>
          <li>
            Conditional steps are determined by predicates evaluated against
            previously entered data.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Step Definition:</strong> Steps are defined as an array of
            step objects, each containing a title, an array of field definitions
            (type, label, required, validators), and optional metadata
            (description, icon).
          </li>
          <li>
            <strong>Navigation:</strong> Next/Previous/Back buttons at the bottom
            of each step. A stepper/progress indicator at the top shows all steps
            with their status (completed, current, upcoming, locked).
          </li>
          <li>
            <strong>Validation Gate:</strong> Before allowing the user to proceed
            to the next step, all fields on the current step are validated. Errors
            are displayed inline next to the relevant fields. The Next button is
            disabled until validation passes.
          </li>
          <li>
            <strong>State Preservation:</strong> All field values are stored
            globally and persist when navigating between steps. Returning to a
            previously visited step restores all previously entered values exactly.
          </li>
          <li>
            <strong>Conditional Steps:</strong> Steps can be skipped based on
            predicates evaluated against previously entered data (e.g., skip
            &quot;Employment Details&quot; if user selected &quot;Student&quot;
            as occupation on a prior step).
          </li>
          <li>
            <strong>Draft Saving:</strong> Form state is auto-saved to
            <code>localStorage</code> (with JSON serialization) at regular
            intervals and on every step change. On wizard mount, the user is
            prompted to restore an existing draft.
          </li>
          <li>
            <strong>Summary Review:</strong> The final step renders a read-only
            summary of all entered data, grouped by step, before the user submits.
          </li>
          <li>
            <strong>Linear vs Non-linear:</strong> The wizard supports both modes.
            In linear mode, users must complete steps sequentially. In non-linear
            mode, users can jump to any completed or current step freely.
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> Tab through fields within a step,
            Enter to submit the current step (trigger validation and advance),
            Arrow keys to navigate the stepper, Escape to cancel and prompt
            confirmation.
          </li>
          <li>
            <strong>Accessibility:</strong>
            <code>aria-current=&quot;step&quot;</code> on the active step in the
            stepper, <code>aria-live</code> announcements when validation errors
            occur or step changes, focus management on step change (move focus to
            step heading or first error field).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Step transitions should not cause visible
            jank. Validation should run in under 50ms per step for typical forms
            (up to 15 fields).
          </li>
          <li>
            <strong>Scalability:</strong> The wizard should handle up to 12 steps
            with 20+ fields each without performance degradation or memory leaks.
          </li>
          <li>
            <strong>Reliability:</strong> Draft persistence must survive page
            refreshes and browser crashes. Data loss on navigation is unacceptable.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for step
            definitions, field types, validation results, and wizard state.
          </li>
          <li>
            <strong>Extensibility:</strong> New field types and validators should
            be pluggable without modifying core wizard logic.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            User navigates away mid-wizard (browser back button, link click) —
            draft should be saved; on return, offer restore prompt.
          </li>
          <li>
            Conditional step logic changes mid-wizard — if a user goes back and
            changes an answer that affects step visibility, the remaining step path
            must recalculate dynamically.
          </li>
          <li>
            Validation errors on a step the user has already passed (e.g., async
            validation reveals an error on step 2 while user is on step 4) — how
            does the system surface and block submission?
          </li>
          <li>
            Draft data in <code>localStorage</code> is stale or corrupted — graceful
            fallback to fresh state without crashing.
          </li>
          <li>
            Concurrent tabs — should drafts sync across tabs? (Assumption: no,
            each tab maintains independent wizard state.)
          </li>
          <li>
            Server-side rendering — the wizard is inherently client-side (involves
            user interaction, <code>localStorage</code>, focus management). Must
            not break during SSR hydration.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate <strong>wizard orchestration</strong> from{" "}
          <strong>step rendering</strong>. The orchestration layer (Zustand store +
          custom hooks) manages the current step index, field values keyed by step,
          validation results, navigation history, conditional step resolution, and
          draft persistence. The rendering layer (wizard component, stepper, step
          renderer, field renderer, summary) subscribes to the orchestration state
          and renders the appropriate UI.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>React Hook Form with nested forms:</strong> RHF excels at
            single-form validation but struggles with multi-step flows where each
            step is validated independently and state must persist across unmounted
            steps. Workarounds involve <code>keepMounted</code> or persisting to
            external storage, adding complexity. Zustand provides a cleaner
            separation.
          </li>
          <li>
            <strong>XState (state machine):</strong> A state machine is an excellent
            fit for wizard flows with complex conditional logic and transitions.
            However, it introduces significant learning curve and boilerplate for
            simpler wizards. We use a lightweight predicate-based step router
            instead, which covers 90% of use cases with less overhead.
          </li>
          <li>
            <strong>Context API + useReducer:</strong> Viable but requires wrapping
            the wizard tree in a provider. Every step re-renders on any state
            change unless context is carefully split. Zustand selectors prevent
            unnecessary re-renders with less boilerplate.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + declarative step definitions is optimal:</strong>{" "}
          Zustand provides a lightweight, selector-based global store. Step
          definitions are declarative JSON/TS objects, making them easy to generate
          from CMS content, feature flags, or API responses. The validation gate
          runs per-step, independent of other steps, enabling parallel development
          of step content. Draft persistence is a store concern, handled
          transparently via middleware. This pattern is used in production
          applications like multi-step onboarding flows, loan applications, and
          configuration wizards.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>
          The system consists of seven modules across types, stores, hooks, and
          components:
        </p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">
            1. Type Definitions (<code>wizard-types.ts</code>)
          </h4>
          <p>
            Defines the core interfaces: <code>StepDefinition</code> (title, fields,
            validators, skipStep predicate), <code>WizardState</code> (currentStep,
            visitedSteps, fieldValues keyed by step ID, validationResults per step,
            isLinear, isSubmitted), <code>StepValidationResult</code> (isValid,
            errors map, async validation status), <code>FieldDefinition</code> (type,
            label, required, validators, placeholder), and <code>FieldValue</code>{" "}
            (union of string, number, boolean, array, or object). These types form
            the contract between all modules. See the Example tab for the complete
            type definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">
            2. Zustand Store (<code>wizard-store.ts</code>)
          </h4>
          <p>
            Manages the global wizard state: current step index, field values
            organized as a map of step ID to field-value map, validation results per
            step, visited steps set, navigation history stack, and draft metadata.
            Exposes actions for navigating (next, previous, goToStep), setting field
            values, running validation, saving/restoring drafts, and submitting.
            Draft persistence to <code>localStorage</code> uses JSON serialization
            with a versioned schema for forward compatibility.
          </p>
          <p className="mt-3">
            <strong>Key state shape:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>steps: StepDefinition[]</code> — step configuration
            </li>
            <li>
              <code>currentStepIndex: number</code> — active step
            </li>
            <li>
              <code>fieldValues: Record&lt;string, Record&lt;string, FieldValue&gt;&gt;</code> — values per step
            </li>
            <li>
              <code>validationResults: Record&lt;string, StepValidationResult&gt;</code>
            </li>
            <li>
              <code>visitedSteps: Set&lt;string&gt;</code> — completed steps
            </li>
            <li>
              <code>history: string[]</code> — navigation stack for back button
            </li>
            <li>
              <code>draftKey: string</code> — localStorage key for this wizard
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">
            3. Validation Gate (<code>validation-gate.ts</code>)
          </h4>
          <p>
            Per-step validation engine supporting both synchronous validators
            (required, minLength, maxLength, pattern matching, numeric range) and
            asynchronous validators (API uniqueness checks, external service calls).
            Validators are composable — each field can have an array of validators
            that run in sequence. Errors are aggregated into a map of field name to
            error message. Async validators return a Promise and the validation
            result tracks a <code>pending</code> flag. See the Example tab for the
            complete validation engine with debounce support.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">
            4. Step Router (<code>step-router.ts</code>)
          </h4>
          <p>
            Handles conditional step logic. Each step can define a{" "}
            <code>skipStep</code> predicate function that receives the current field
            values and returns a boolean. The step router evaluates all predicates
            and computes the effective step path — an ordered array of step IDs that
            excludes skipped steps. It also maintains a navigation history stack for
            accurate back-button behavior (when going back, the router returns to the
            last visited step, not necessarily the previous index).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">
            5. Custom Hooks (<code>use-wizard.ts</code>,{" "}
            <code>use-step-validation.ts</code>, <code>use-step-history.ts</code>)
          </h4>
          <p>
            <code>useWizard</code> is the main orchestrator hook — it wraps store
            access, exposes navigation methods (next, previous, goToStep), validation
            triggers, draft save/restore, and submit. It handles the lifecycle: on
            mount, attempt draft restore; on unmount, auto-save; on step change, run
            conditional step recalculation.
          </p>
          <p className="mt-2">
            <code>useStepValidation</code> provides per-field validation with
            debounced input (default 300ms), real-time error display, and async
            validator status tracking. It prevents premature error display by only
            showing errors after the field has been touched or the step submission
            has been attempted.
          </p>
          <p className="mt-2">
            <code>useStepHistory</code> manages the navigation history stack,
            tracking completed steps and enabling accurate back-button behavior. It
            distinguishes between forward navigation (push to history) and backward
            navigation (pop from history), ensuring the stepper always reflects the
            correct state.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">
            6. Wizard Components (<code>wizard.tsx</code>,{" "}
            <code>wizard-stepper.tsx</code>, <code>wizard-step.tsx</code>,{" "}
            <code>wizard-summary.tsx</code>,{" "}
            <code>wizard-field-renderer.tsx</code>)
          </h4>
          <p>
            The root <code>Wizard</code> component assembles the stepper, step
            renderer, and draft restore prompt. The <code>WizardStepper</code> renders
            the progress indicator with completed/current/upcoming/locked states. The{" "}
            <code>WizardStep</code> renders individual steps with field rendering,
            validation errors, and Next/Prev/Submit buttons. The{" "}
            <code>WizardSummary</code> renders the final review screen grouping all
            entered data by step. The <code>WizardFieldRenderer</code> dynamically
            renders form fields based on step field definitions (text input, textarea,
            select, checkbox, radio group, date picker, file upload). See the Example
            tab for all component implementations.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store is the single source of truth. Field values are stored
          as a nested map: step ID maps to a field-name-to-value map. This structure
          ensures that each step&apos;s data is isolated and can be validated
          independently. Validation results are similarly keyed by step ID. The
          visited steps set tracks which steps have been completed (passed validation).
          The history stack enables accurate back navigation — going back pops the
          current step from history and navigates to the previous entry.
        </p>
        <p>
          Draft persistence runs on a timer (every 2 seconds) and on every step
          change. The store serializes <code>fieldValues</code>,{" "}
          <code>validationResults</code>, <code>visitedSteps</code>, and{" "}
          <code>currentStepIndex</code> to JSON and writes to{" "}
          <code>localStorage</code> under a versioned key (e.g.,{" "}
          <code>wizard:v1:onboarding</code>). On mount, the store attempts to parse
          and restore. If parsing fails (corrupted data), it falls back to fresh
          state. The version key enables schema migration — if the wizard structure
          changes, old drafts with incompatible schemas are discarded gracefully.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User opens the wizard. <code>useWizard</code> hook mounts, checks
            <code>localStorage</code> for an existing draft.
          </li>
          <li>
            If draft exists, a restore prompt appears. User confirms, draft state
            is loaded into the store. If no draft, wizard starts fresh at step 0.
          </li>
          <li>
            Step router evaluates <code>skipStep</code> predicates and computes the
            effective step path. Current step is set to the first non-skipped step.
          </li>
          <li>
            <code>WizardStepper</code> renders the progress bar with the current step
            highlighted (<code>aria-current=&quot;step&quot;</code>).
          </li>
          <li>
            <code>WizardStep</code> renders fields for the current step via{" "}
            <code>WizardFieldRenderer</code>.
          </li>
          <li>
            User fills in fields. <code>useStepValidation</code> debounces input,
            runs sync validators on change, and displays errors on blur or after
            first submit attempt.
          </li>
          <li>
            User clicks Next. Validation gate runs all validators for the current
            step. If invalid, errors display inline and focus moves to the first
            error field. If valid, step is marked as visited, field values are saved,
            history is updated, and the next step renders.
          </li>
          <li>
            Draft auto-saves to <code>localStorage</code> in the background.
          </li>
          <li>
            On the final step (summary), user reviews all data grouped by step and
            clicks Submit. The wizard aggregates all field values, submits to the
            target API, marks <code>isSubmitted: true</code>, and clears the draft.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional data flow pattern. All state
          mutations flow through the Zustand store, and all rendering flows from store
          subscriptions. Step transitions are gated by validation, and conditional
          step resolution happens before each navigation decision.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Validation Flow (Detailed)</h3>
        <p>
          When the user attempts to advance from a step, the following sequence occurs:
        </p>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            <code>useWizard.next()</code> is called.
          </li>
          <li>
            The hook retrieves the current step&apos;s field definitions from the
            steps array.
          </li>
          <li>
            It gathers the current field values for this step from the store.
          </li>
          <li>
            Each field&apos;s validators run synchronously. If any validator fails,
            the error message is recorded and the validation result for this step
            is set to <code>isValid: false</code>.
          </li>
          <li>
            If sync validation passes and the step has async validators, those run
            in parallel. The step enters a <code>validating</code> state, and the
            Next button shows a loading spinner.
          </li>
          <li>
            If all validators pass, the step is marked as visited, the history stack
            is updated, and the step router computes the next effective step index.
          </li>
          <li>
            Focus is programmatically moved to the new step&apos;s heading
            (<code>headingRef.current?.focus()</code>) and an aria-live region
            announces the step change to screen readers.
          </li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Conditional Step Resolution</h3>
        <p>
          Conditional steps are resolved dynamically before each navigation action.
          The step router iterates through the steps array, evaluates each step&apos;s{" "}
          <code>skipStep</code> predicate (if present) against the current field
          values, and builds an effective step path — an ordered array of step IDs
          that excludes skipped steps. This path is recomputed whenever field values
          change on a step that affects downstream predicates. For example, if the
          user goes back to step 2 and changes their occupation from &quot;Employed&quot;
          to &quot;Student,&quot; the step router re-evaluates and may insert or
          remove the &quot;Employment Details&quot; step from the effective path.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Browser back button:</strong> The <code>beforeunload</code> event
            triggers a draft save. If the user returns, the restore prompt appears.
            The wizard does not attempt to preserve its state in the browser history
            — each wizard instance is independent.
          </li>
          <li>
            <strong>Corrupted draft:</strong> If <code>JSON.parse</code> fails on
            restore, the store logs a warning, discards the corrupted data, and
            initializes fresh state. No crash occurs.
          </li>
          <li>
            <strong>Async validation failure on a past step:</strong> If an async
            validator on step 2 fails while the user is on step 5, the step&apos;s{" "}
            <code>validationResults</code> are updated. The submit button on the
            final step checks all visited steps&apos; validation results and disables
            submission if any step has <code>isValid: false</code>. The user is
            prompted to revisit the failing step.
          </li>
          <li>
            <strong>SSR safety:</strong> The wizard component uses a{" "}
            <code>useEffect</code> to mount, ensuring <code>localStorage</code> access
            and focus management only occur on the client. During SSR, the component
            renders a skeleton or returns null.
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
          <h3 className="mb-3 text-lg font-semibold">&#x1F4E6; Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 13 files:
            TypeScript interfaces, Zustand store with draft persistence, validation
            gate engine, step router with conditional logic, three custom hooks
            (orchestration, per-step validation, navigation history), five components
            (root wizard, stepper, step renderer, summary, dynamic field renderer),
            and a full EXPLANATION.md walkthrough. Click the <strong>Example</strong>{" "}
            toggle at the top of the article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Type Definitions (wizard-types.ts)</h3>
        <p>
          Defines the <code>StepDefinition</code> interface with title, fields array,
          optional validators, optional <code>skipStep</code> predicate, and metadata.
          The <code>WizardState</code> interface tracks current step index, field
          values keyed by step ID, validation results per step, visited steps set,
          navigation history, linear mode flag, and submission status. The{" "}
          <code>StepValidationResult</code> interface tracks <code>isValid</code> boolean,
          an errors map (field name to error message), and async validation status
          (<code>idle | running | done</code>). Field types cover text, textarea,
          select, radio, checkbox, date, number, email, phone, and file.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Zustand Store (wizard-store.ts)</h3>
        <p>
          The store manages field values, validation results, navigation state, and
          draft persistence. Key design decisions include: using versioned{" "}
          <code>localStorage</code> keys for forward-compatible schema migration,
          JSON serialization with <code>JSON.stringify</code>/<code>JSON.parse</code>{" "}
          wrapped in try-catch for corruption handling, auto-save via{" "}
          <code>setInterval</code> (2-second cadence) with cleanup on store destroy,
          and a <code>draftKey</code> that uniquely identifies this wizard instance
          for multi-wizard scenarios.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Validation Gate (validation-gate.ts)</h3>
        <p>
          The validation engine supports composable sync validators (required,
          minLength, maxLength, pattern, min, max, email format, phone format) and
          async validators (API uniqueness checks). Each validator is a pure function
          returning an optional error string. The engine runs validators in sequence,
          short-circuiting on the first failure. Async validators run in parallel
          after sync validation passes, returning a Promise that resolves to a
          <code>StepValidationResult</code>. The engine also supports a debounce
          wrapper for real-time validation during typing.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Step Router (step-router.ts)</h3>
        <p>
          The step router evaluates <code>skipStep</code> predicates against current
          field values and computes an effective step path. It maintains a navigation
          history stack for accurate back-button behavior. When going back, it pops
          the current step and navigates to the previous entry. When going forward,
          it pushes the current step to history. The router also exposes a{" "}
          <code>canGoToStep(stepId)</code> method that checks whether a step is
          accessible (not locked behind an incomplete prerequisite in linear mode).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: useWizard Hook</h3>
        <p>
          The main orchestrator hook wraps store access and exposes a unified API:{" "}
          <code>next()</code> (validates and advances), <code>previous()</code>
          (goes back without validation), <code>goToStep(index)</code> (jumps to
          a specific step if allowed), <code>setFieldValue(field, value)</code>,{" "}
          <code>submit()</code> (aggregates all data and calls the submit callback),{" "}
          <code>restoreDraft()</code>, and <code>clearDraft()</code>. On mount, it
          attempts draft restore and fires a callback with the restore status. On
          unmount, it triggers a final draft save.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: useStepValidation Hook</h3>
        <p>
          Per-field validation hook that debounces input (default 300ms), runs sync
          validators on change, and displays errors on blur or after the first
          submit attempt. It tracks a <code>touched</code> flag per field to avoid
          showing errors for fields the user hasn&apos;t interacted with yet. Async
          validators are tracked with a <code>status</code> field
          (<code>idle | running | done</code>) to enable loading indicators on
          individual fields.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Wizard Component Assembly</h3>
        <p>
          The root <code>Wizard</code> component assembles the stepper at the top,
          the current step renderer in the middle, and navigation buttons at the
          bottom. It conditionally renders the summary step as the final step, the
          draft restore prompt on mount, and a loading overlay during async
          validation. The stepper uses <code>aria-current=&quot;step&quot;</code> on
          the active step and visual indicators (checkmarks for completed, numbered
          circles for upcoming, lock icons for locked steps in linear mode).
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
                <td className="p-2">Step validation (sync)</td>
                <td className="p-2">O(f &times; v)</td>
                <td className="p-2">O(f) — errors map</td>
              </tr>
              <tr>
                <td className="p-2">Step validation (async)</td>
                <td className="p-2">O(a) — parallel</td>
                <td className="p-2">O(a) — pending promises</td>
              </tr>
              <tr>
                <td className="p-2">Conditional step resolution</td>
                <td className="p-2">O(s) — one predicate per step</td>
                <td className="p-2">O(s) — effective path array</td>
              </tr>
              <tr>
                <td className="p-2">Draft save (serialize + write)</td>
                <td className="p-2">O(n) — JSON stringify all values</td>
                <td className="p-2">O(n) — serialized data</td>
              </tr>
              <tr>
                <td className="p-2">Draft restore (parse + hydrate)</td>
                <td className="p-2">O(n) — JSON parse + iterate</td>
                <td className="p-2">O(n) — hydrated state</td>
              </tr>
              <tr>
                <td className="p-2">History push/pop</td>
                <td className="p-2">O(1) — array push/pop</td>
                <td className="p-2">O(h) — history length</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>f</code> is the number of fields per step, <code>v</code> is the
          number of validators per field, <code>a</code> is the number of async
          validators, <code>s</code> is the total number of steps, <code>n</code> is
          the total number of field values, and <code>h</code> is the history depth.
          For typical wizards (8 steps, 10 fields each, 3 validators per field), all
          operations complete in under 10ms.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>JSON serialization on draft save:</strong> For wizards with 100+
            field values (large configuration wizards), <code>JSON.stringify</code>
            and <code>localStorage.setItem</code> can take 5-10ms. Mitigation: only
            serialize changed fields (diff-based save) or throttle saves to every
            2 seconds.
          </li>
          <li>
            <strong>Re-render cascades:</strong> If the store subscriber selects the
            entire <code>fieldValues</code> object, every field value change triggers
            a re-render of all steps. Mitigation: use Zustand selectors to subscribe
            to only the current step&apos;s field values, so only the active step
            re-renders.
          </li>
          <li>
            <strong>Conditional step recalculation:</strong> Re-evaluating all{" "}
            <code>skipStep</code> predicates on every field change is O(s). For
            wizards with complex predicates involving multiple field lookups, this
            adds up. Mitigation: only re-evaluate predicates for steps downstream
            from the changed field, and cache predicate results.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Selector-based subscriptions:</strong> Each WizardStep subscribes
            to only its own field values and validation results via Zustand selectors.
            Changing a value on step 3 does not re-render steps 1, 2, 4, or 5.
          </li>
          <li>
            <strong>Debounced validation:</strong> Real-time field validation uses a
            300ms debounce to avoid running validators on every keystroke. This is
            critical for fields with async validators (API calls).
          </li>
          <li>
            <strong>Memoized step rendering:</strong> The step renderer uses{" "}
            <code>React.memo</code> on the WizardStep component with a custom equality
            function that compares only the step&apos;s own field values and validation
            state. Unvisited steps with no data are not rendered at all.
          </li>
          <li>
            <strong>Lazy draft persistence:</strong> Instead of serializing the entire
            state on every change, the store tracks a <code>dirty</code> flag and only
            persists when the flag is set and the throttle interval has elapsed.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Data Sanitization</h3>
        <p>
          Field values entered by users may contain malicious content (XSS payloads,
          SQL injection attempts). While React automatically escapes string content
          rendered as text, any field value that is later rendered as HTML (e.g., rich
          text fields) must be sanitized using a library like DOMPurify before rendering.
          Values submitted to the server should be validated and sanitized server-side
          as well — client-side validation is a UX concern, not a security boundary.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Draft Storage Risks</h3>
        <p>
          Storing draft data in <code>localStorage</code> means it is accessible to
          any JavaScript running on the same origin. Sensitive data (PII, financial
          information, health records) should not be stored in <code>localStorage</code>{" "}
          in plain text. For sensitive wizards, use one of these strategies:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Encrypt before storing:</strong> Use the Web Crypto API to encrypt
            field values with a key derived from a user-specific secret before writing
            to <code>localStorage</code>. Decrypt on restore.
          </li>
          <li>
            <strong>Server-side drafts:</strong> Instead of <code>localStorage</code>,
            persist drafts to a secure backend API with authentication. The client only
            stores a draft ID (opaque token) in a session cookie.
          </li>
          <li>
            <strong>Session-only storage:</strong> Use <code>sessionStorage</code>{" "}
            instead of <code>localStorage</code> so drafts are cleared when the tab
            closes. This trades persistence across sessions for reduced exposure.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              Tab navigates through form fields within the current step. Enter
              triggers step submission (validation + advance). Escape opens a
              confirmation dialog to cancel the wizard.
            </li>
            <li>
              Arrow Left/Right on the stepper navigates between steps. Arrow keys
              are only effective on steps that are unlocked (visited or accessible
              in non-linear mode).
            </li>
            <li>
              The Next/Previous/Submit buttons are native{" "}
              <code>&lt;button&gt;</code> elements, automatically keyboard-accessible.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              The active step in the stepper has{" "}
              <code>aria-current=&quot;step&quot;</code> so screen readers announce
              which step the user is on.
            </li>
            <li>
              An <code>aria-live=&quot;polite&quot;</code> region announces step
              changes (e.g., &quot;Step 3 of 8: Payment Details&quot;) and
              validation errors (e.g., &quot;2 errors on this step&quot;).
            </li>
            <li>
              Validation errors on individual fields are linked via{" "}
              <code>aria-describedby</code> pointing to the error message element.
            </li>
            <li>
              The summary step uses semantic headings and definition lists
              (<code>&lt;dl&gt;</code>) to present field labels and values in a
              screen-reader-friendly structure.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Focus Management</h4>
          <p>
            When the step changes, focus is programmatically moved to the new
            step&apos;s heading element. When validation fails, focus moves to the
            first field with an error. This prevents the disorienting experience of
            focus remaining on the &quot;Next&quot; button while the content below
            has changed. See the Example tab for the exact focus management
            implementation using <code>useRef</code> and{" "}
            <code>requestAnimationFrame</code>.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">CSRF Protection on Submit</h3>
        <p>
          When the wizard submits data to the server, include a CSRF token (if the
          backend uses session-based authentication). The submit function should
          attach the token to the request headers. If using token-based authentication
          (JWT in Authorization header), CSRF is less of a concern, but the server
          should still validate the request origin.
        </p>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Validation gate:</strong> Test each sync validator (required,
            minLength, pattern, email format) with valid and invalid inputs. Test
            async validators with mocked API responses (success, failure, timeout).
            Verify error aggregation produces the correct error map.
          </li>
          <li>
            <strong>Step router:</strong> Test conditional step resolution with
            various field value combinations. Verify that <code>skipStep</code>{" "}
            predicates correctly include/exclude steps. Test history push/pop
            behavior for back/forward navigation.
          </li>
          <li>
            <strong>Store actions:</strong> Test next/previous/goToStep update
            <code>currentStepIndex</code> correctly. Test <code>setFieldValue</code>{" "}
            stores values under the correct step ID. Test draft save/restore with
            mock <code>localStorage</code>.
          </li>
          <li>
            <strong>Draft persistence:</strong> Test JSON serialization and
            deserialization round-trips. Test corrupted data handling (invalid JSON
            in <code>localStorage</code>). Test versioned key migration (old draft
            with <code>wizard:v0:</code> key is ignored by <code>v1</code> store).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full wizard flow:</strong> Render the Wizard component, fill in
            fields on each step, click Next, verify validation passes, verify the
            correct next step renders. Repeat for all steps including conditional
            skips. On the summary step, verify all entered data is displayed grouped
            by step. Click Submit, verify the submit callback is called with the
            aggregated data.
          </li>
          <li>
            <strong>Validation blocking:</strong> Fill in a step with invalid data,
            click Next, verify errors display inline and the step does not advance.
            Fix errors, click Next, verify advancement.
          </li>
          <li>
            <strong>Draft restore:</strong> Fill in 3 steps, manually trigger draft
            save, unmount the wizard, remount it, verify the restore prompt appears,
            confirm restore, verify all 3 steps&apos; data is restored.
          </li>
          <li>
            <strong>Linear vs non-linear:</strong> In linear mode, verify that
            clicking on an unvisited/upcoming step in the stepper does not navigate.
            In non-linear mode, verify navigation to any step is allowed.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            SSR rendering: verify the wizard returns null or a skeleton during SSR
            and mounts correctly on hydration.
          </li>
          <li>
            Keyboard-only navigation: Tab through all fields, press Enter to submit
            step, Arrow keys on stepper, Escape to cancel. Verify all interactions
            work without a mouse.
          </li>
          <li>
            Accessibility: run axe-core automated checks on the rendered wizard,
            verify <code>aria-current</code>, <code>aria-live</code>,{" "}
            <code>aria-describedby</code>, focus management, and keyboard navigation.
          </li>
          <li>
            Concurrent wizard instances: render two wizards with different{" "}
            <code>draftKey</code> values on the same page. Verify their state is
            independent and drafts do not interfere.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Storing form state in individual component state:</strong>{" "}
            Candidates often use <code>useState</code> per step, which means navigating
            away from a step unmounts it and loses its state. Interviewers expect
            candidates to recognize that multi-step forms need centralized state
            management (Zustand, Context, or a parent component lifting state up).
          </li>
          <li>
            <strong>Validating only on submit:</strong> Running validation only when
            the user clicks Submit on the final step means they can progress through
            all steps with invalid data. Validation must be per-step, blocking
            advancement until the current step is valid.
          </li>
          <li>
            <strong>Ignoring conditional step complexity:</strong> Candidates design
            a fixed step sequence and don&apos;t account for steps that should be
            shown or hidden based on prior answers. Interviewers look for candidates
            who discuss dynamic step path computation.
          </li>
          <li>
            <strong>No draft persistence:</strong> Without draft saving, a page
            refresh causes total data loss. For production wizards (especially
            multi-minute ones like loan applications), this is unacceptable.
            Interviewers expect candidates to discuss persistence strategies.
          </li>
          <li>
            <strong>Accessibility as an afterthought:</strong> Rendering a stepper
            without <code>aria-current</code>, not managing focus on step change,
            and not announcing validation errors to screen readers are common
            oversights. These are baseline requirements for production applications.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Linear vs Non-linear Navigation</h4>
          <p>
            Linear mode (force sequential completion) is simpler to implement and
            ensures data integrity — every step is validated before the next begins.
            Non-linear mode (allow jumping between steps) provides flexibility for
            users who want to fill in easy steps first and come back to complex ones.
            The trade-off is complexity: non-linear mode requires tracking which steps
            are &quot;unlocked&quot; and handling out-of-order validation. Most
            production wizards default to linear mode but offer a non-linear toggle
            for power users.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">localStorage vs Server-side Drafts</h4>
          <p>
            <code>localStorage</code> is simple, fast, and requires no backend
            infrastructure. It works well for non-sensitive data and single-device
            workflows. However, it does not sync across devices, is vulnerable to
            XSS, and has a 5-10MB storage limit. Server-side drafts solve these
            problems but add API complexity, authentication requirements, and network
            latency. For enterprise applications handling sensitive data, server-side
            drafts with encryption are the right choice. For consumer-facing wizards,
            <code>localStorage</code> with a &quot;Continue where you left off&quot;
            prompt is usually sufficient.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">State Machine vs Predicate-based Routing</h4>
          <p>
            A state machine (XState) provides a rigorous way to model wizard flows
            with explicit transitions, guards, and side effects. It is ideal for
            wizards with complex conditional logic, parallel steps, or retry/cancel
            semantics. However, it adds significant cognitive overhead and boilerplate.
            A predicate-based step router (evaluating <code>skipStep</code> functions)
            covers 90% of use cases with a fraction of the complexity. Interviewers
            appreciate candidates who can articulate when a state machine is justified
            and when a simpler approach suffices.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle a wizard where the user can save progress and
              resume days later from a different device?
            </p>
            <p className="mt-2 text-sm">
              A: Move draft persistence from <code>localStorage</code> to a server-side
              API. Each draft is stored in a database row keyed by user ID and wizard
              type. The client sends a PATCH request with the current field values on
              every auto-save. On mount, the client fetches the latest draft from the
              API. This enables cross-device continuity. To handle concurrent edits
              (user editing on two devices simultaneously), use optimistic locking with
              a <code>version</code> field — if the client&apos;s version is stale,
              reject the save and prompt the user to reload.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement undo/redo within a wizard step?
            </p>
            <p className="mt-2 text-sm">
              A: Maintain a command history stack per step. Each field change pushes
              a command object {"`{ field, previousValue, newValue }`"} onto the stack.
              Undo pops the last command and restores <code>previousValue</code>. Redo
              re-applies <code>newValue</code>. Cap the stack at 50 entries to prevent
              memory growth. The command pattern integrates cleanly with the Zustand
              store — the undo/redo actions are just additional store methods.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support collaborative editing (multiple users filling
              in the same wizard simultaneously)?
            </p>
            <p className="mt-2 text-sm">
              A: Use a CRDT (Conflict-free Replicated Data Type) like Yjs or
              Automerge for field values. Each client applies local changes to the
              CRDT, which automatically resolves conflicts. Sync via WebSockets. The
              Zustand store wraps the CRDT as its source of truth. Validation runs on
              the resolved state. This is an advanced use case (e.g., collaborative
              application forms) and requires careful handling of concurrent edits to
              the same field.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you A/B test different step orderings or step groupings?
            </p>
            <p className="mt-2 text-sm">
              A: Externalize the step definitions to a configuration service or feature
              flag platform (LaunchDarkly, Split). The wizard receives its step array
              as a prop from the configuration service. Different user cohorts receive
              different step orderings or groupings. Track completion rates, time-to-complete,
              and drop-off points per cohort. The wizard component itself is agnostic
              to step order — it simply renders whatever step array it receives.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle file uploads within a wizard step?
            </p>
            <p className="mt-2 text-sm">
              A: File uploads require special handling. The field definition includes
              type <code>file</code> with constraints (max size, allowed MIME types,
              max count). The <code>WizardFieldRenderer</code> renders a file input
              with drag-and-drop support. Uploaded files are stored temporarily in
              memory (as <code>File</code> objects) and uploaded to a presigned URL
              (e.g., S3) immediately, not on final submit. The store stores the
              resulting file URLs (strings), not the <code>File</code> objects
              themselves, because <code>File</code> objects are not JSON-serializable
              and cannot persist to <code>localStorage</code>. On draft restore, the
              file URLs are displayed as &quot;already uploaded&quot; with an option
              to replace.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement a &quot;Save as Template&quot; feature where
              users can save their completed wizard as a reusable template for future
              submissions?
            </p>
            <p className="mt-2 text-sm">
              A: After submission, the aggregated field values are serialized and
              stored as a template in the database with a user-provided name. The
              template stores field values but not validation results (templates are
              starting points, not completed forms). When creating a new wizard, the
              user can select a template, and the <code>restoreDraft</code> logic
              hydrates the wizard with the template&apos;s field values. Conditional
              steps are re-evaluated based on the template data. Templates can be
              shared across users (team templates) or kept private.
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
              href="https://www.nngroup.com/articles/forms-across-pages/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Forms Across Multiple Pages
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/progress-indicators/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Progress Indicators in UX
            </a>
          </li>
          <li>
            <a
              href="https://zustand.docs.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Authorable Practices — Multi-step Form Patterns
            </a>
          </li>
          <li>
            <a
              href="https://react.dev/reference/react/useId"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React — Accessible Form Field Identification
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/forms/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Form UX Best Practices and Accessibility
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
