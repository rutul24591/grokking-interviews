"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-form-validation-engine",
  title: "Design a Form Validation Engine",
  description:
    "Complete LLD solution for a reusable form validation engine supporting sync/async rules, cross-field validation, debounced async checks, i18n message interpolation, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "form-validation-engine",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "form-validation",
    "sync-validation",
    "async-validation",
    "cross-field-validation",
    "i18n",
    "accessibility",
    "debounce",
  ],
  relatedTopics: [
    "form-builder",
    "wizard-multi-step-form",
    "client-side-validation",
    "real-time-validation",
  ],
};

export default function FormValidationEngineArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable form validation engine for a large-scale React
          application. The engine must validate individual fields and entire forms using
          declarative rule definitions, support both synchronous and asynchronous
          validation, handle cross-field dependencies (such as password confirmation and
          date ranges), provide internationalized error messages with variable
          interpolation, and integrate seamlessly with accessibility requirements. Any
          component in the application should be able to use the engine without duplicating
          validation logic, and the engine must perform efficiently even on forms with
          dozens of fields and complex async rules.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <li>
            Forms may have 10-50+ fields, each with 1-8 validation rules.
          </li>
          <li>
            Async validation rules involve server-side checks (username availability,
            email uniqueness) that require network calls.
          </li>
          <li>
            The engine must support multiple validation modes: onChange, onBlur, onSubmit,
            and all (trigger on every interaction).
          </li>
          <li>
            Error messages must be internationalized with template interpolation (for
            example, &quot;Must be at least {"{"}min{"}"} characters&quot;).
          </li>
          <li>
            The engine must be accessible: inline errors below fields, summary at form top,
            and aria-live announcements for screen readers.
          </li>
          <li>
            Cross-field validation includes password/confirm-password matching, date range
            validation (end date after start date), and conditional requirements (field B
            required only when field A has a specific value).
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Rule Definition:</strong> Declarative rule configuration per field
            including required, minLength, maxLength, pattern, email, phone, url, min,
            max, matches, and custom validators.
          </li>
          <li>
            <strong>Sync Validation:</strong> Instant feedback on blur, change, or submit.
            Rules execute as a chain, short-circuiting on the first error.
          </li>
          <li>
            <strong>Async Validation:</strong> Server-side checks with debounce (to avoid
            excessive network calls on every keystroke), AbortController cancellation (to
            discard stale responses), and deduplication (to avoid re-checking identical
            values).
          </li>
          <li>
            <strong>Cross-Field Validation:</strong> Rules that depend on multiple field
            values (password match, date range, conditional requirements) with a dependency
            graph to revalidate dependent fields when a source field changes.
          </li>
          <li>
            <strong>Validation Modes:</strong> Configurable trigger modes — onChange
            (validate on every keystroke), onBlur (validate when field loses focus),
            onSubmit (validate only on form submission), and all (both onChange and onBlur).
          </li>
          <li>
            <strong>Error Aggregation:</strong> Per-field error lists, form-level valid/
            invalid state, and total error count for summary display.
          </li>
          <li>
            <strong>Error Display:</strong> Inline error messages below each invalid field,
            a summary list at the top of the form with anchor links to fields, and
            aria-live=&quot;polite&quot; announcements for screen readers.
          </li>
          <li>
            <strong>Custom Validators:</strong> User-defined validator functions that
            return a ValidationError object or null, composable with built-in rules.
          </li>
          <li>
            <strong>i18n Support:</strong> Error message templates with interpolation
            placeholders (for example, &quot;Must be between {"{"}min{"}"} and {"{"}max{"}"}
            characters&quot;) loaded from a locale dictionary.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Sync validation must complete in under 1ms per
            field. Async validation must debounce at a configurable interval (default
            300ms) and cancel in-flight requests on value change.
          </li>
          <li>
            <strong>Scalability:</strong> The engine must handle forms with 50+ fields
            and 5+ async validators per form without blocking the main thread.
          </li>
          <li>
            <strong>Reliability:</strong> Validation state must remain consistent across
            re-renders. No stale closures in async callbacks. AbortController ensures
            out-of-order responses are discarded.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for ValidationRule,
            ValidationError, FieldErrors, ValidationConfig, and ValidationResult types.
          </li>
          <li>
            <strong>Accessibility:</strong> Inline errors linked to fields via
            aria-describedby, summary region with role=&quot;alert&quot;, and aria-live
            announcements on validation state changes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            User types rapidly in a field with async validation — debounce and
            AbortController must prevent stale results from overwriting valid state.
          </li>
          <li>
            Cross-field dependency: changing the start date should revalidate the end date
            field if it was already invalid. Dependency graph must trigger cascade
            revalidation.
          </li>
          <li>
            Form submission while async validation is still in-flight — submit must wait
            for all pending async validators to resolve or reject.
          </li>
          <li>
            Field value resets to empty after being valid — engine must clear errors for
            that field but not mark it as valid until rules pass again.
          </li>
          <li>
            Custom validator throws an exception — engine must catch the error, log it,
            and treat it as a validation failure with a generic error message.
          </li>
          <li>
            i18n locale changes at runtime — all error messages must re-render with the
            new locale without requiring a page reload.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate the <strong>validation logic</strong> from the
          <strong>UI rendering</strong> using a modular architecture. The engine consists
          of pure validator functions (sync and async), a central orchestration layer that
          executes rule chains and aggregates errors, and React hooks that bridge the
          engine to component state. Cross-field validation is handled by a dependency
          graph that tracks which fields depend on which other fields and triggers cascade
          revalidation when a source value changes.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>React Hook Form + Zod:</strong> Excellent for general form validation
            with schema-based rules. However, Zod schemas are defined upfront and are less
            flexible for dynamic rule injection at runtime. Async validation with Zod
            requires custom refinement functions that lack built-in debounce and
            AbortController support. For a reusable engine that must be configurable
            declaratively and support dynamic async rules, a custom engine provides more
            control.
          </li>
          <li>
            <strong>Formik + Yup:</strong> Similar trade-offs. Formik manages form state
            and validation together, coupling state management with validation logic. Yup
            schemas are powerful but do not natively support cross-field dependency graphs
            or debounced async validation. The engine would need significant wrappers to
            add these features.
          </li>
          <li>
            <strong>Inline validation in each component:</strong> Each component implements
            its own validation logic. This leads to duplicated code, inconsistent error
            messages, and no centralized error aggregation. Unmaintainable at scale.
          </li>
        </ul>
        <p>
          <strong>Why a custom modular engine is optimal:</strong> A custom engine
          provides full control over rule execution order, async debouncing, dependency
          graph management, and i18n interpolation. The modular design (separate modules
          for sync validators, async validators, cross-field validators, and error
          formatting) allows each piece to be tested in isolation and composed together
          flexibly. React hooks provide the bridge to component state without coupling the
          engine to any specific UI framework.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The engine consists of eight modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Validation Types (<code>validation-types.ts</code>)</h4>
          <p>
            Defines the core TypeScript interfaces used throughout the engine. The
            <code>ValidationRule</code> union type represents individual rules (required,
            minLength, pattern, custom, async). The <code>ValidationError</code> interface
            carries an error code, message key, and optional interpolation params.
            <code>FieldErrors</code> maps field names to arrays of ValidationError objects.
            <code>ValidationResult</code> aggregates per-field errors and a top-level valid
            flag. <code>ValidationConfig</code> allows callers to configure modes, debounce
            intervals, and i18n dictionaries.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Sync Validators (<code>sync-validators.ts</code>)</h4>
          <p>
            Pure functions that take a value and optional parameters, returning
            ValidationError or null. Includes built-in validators for required, minLength,
            maxLength, pattern, email, phone, url, min, max, and matches. Each validator
            is a standalone function that can be composed into rule chains. The
            <code>validateSync</code> function iterates through a field&apos;s rule chain,
            short-circuits on the first error, and returns the result. See the Example tab
            for the complete implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Async Validator (<code>async-validator.ts</code>)</h4>
          <p>
            Handles server-side validation with debounce, AbortController cancellation, and
            result deduplication. The <code>createAsyncValidator</code> factory returns a
            function that wraps a user-provided async check (e.g., API call). It maintains
            an internal cache of previously checked values to avoid redundant network
            requests. Each invocation creates a new AbortController; if the value changes
            before the previous request completes, the old controller is aborted. Debounce
            interval is configurable (default 300ms). See the Example tab for the complete
            implementation with cache management and abort logic.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Cross-Field Validator (<code>cross-field-validator.ts</code>)</h4>
          <p>
            Manages cross-field dependencies and cascade revalidation. The dependency graph
            tracks which fields depend on which other fields (for example, confirmPassword
            depends on password). When a source field changes, all dependent fields are
            revalidated. Supports built-in cross-field rules: password match, date range
            (end after start), and conditional requirement (field B required when field A
            equals a specific value). See the Example tab for the dependency graph
            implementation and rule definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Validation Engine (<code>validation-engine.ts</code>)</h4>
          <p>
            The central orchestrator. Accepts a ValidationConfig and field values, executes
            sync rule chains, triggers async validators, resolves cross-field dependencies,
            and aggregates results into a ValidationResult. The engine exposes methods for
            validating a single field, validating all fields, and checking overall form
            validity. It also manages i18n message interpolation by resolving error message
            keys against the loaded locale dictionary and substituting interpolation params.
            See the Example tab for the complete engine implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Error Formatter (<code>error-formatter.ts</code>)</h4>
          <p>
            Translates ValidationError objects into display-ready strings using i18n
            templates. Supports pluralization (for example, &quot;1 error&quot; vs
            &quot;3 errors&quot;) and nested error grouping for complex fields. The
            formatter also produces the data structure needed by the validation summary
            component (field name, error message, anchor ID). See the Example tab for the
            complete formatter with i18n template resolution.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. React Hooks</h4>
          <p>
            Three hooks bridge the engine to React component state:
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <code>useFieldValidation</code> — per-field hook tracking value, validation
              trigger on blur/change, error display state, and async loading state.
            </li>
            <li>
              <code>useFormValidation</code> — form-level hook aggregating validity across
              all fields, managing touch tracking, and gating form submission until all
              validators resolve.
            </li>
            <li>
              <code>useAsyncValidation</code> — dedicated hook for async validation with
              debounce, loading state, and AbortController cancellation integrated into the
              field validation lifecycle.
            </li>
          </ul>
          <p className="mt-3">
            See the Example tab for the complete hook implementations.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The engine itself is stateless — it receives field values and config, returns
          results. State lives in React hooks: <code>useFormValidation</code> maintains
          the field values map, touched fields set, per-field errors, async loading flags,
          and the overall form valid state. This separation ensures the engine is
          framework-agnostic and testable in isolation, while the hooks handle React
          lifecycle concerns (state updates, cleanup on unmount, debounced effects).
        </p>
        <p>
          Async validation state is the most complex part. Each field with async rules
          tracks its own loading flag and debounce timer. When the field value changes,
          the debounce timer resets. When the debounce fires, the async validator runs
          with a fresh AbortController. If the value changes again before the async check
          completes, the AbortController cancels the in-flight request and a new one
          begins. This prevents stale results from corrupting the validation state.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/form-validation-engine-architecture.svg"
          alt="Form validation engine architecture showing rule evaluation, async validation, and state management"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Form component initializes with <code>useFormValidation(config)</code>, which
            creates the engine and registers all field definitions.
          </li>
          <li>
            Each field uses <code>useFieldValidation(fieldName)</code>, which binds
            onChange and onBlur handlers to the engine.
          </li>
          <li>
            On user input (onChange) or blur (onBlur), the handler updates the field value
            and triggers sync validation for that field.
          </li>
          <li>
            Sync validators run as a chain, short-circuiting on the first error. The result
            updates per-field errors in the form state.
          </li>
          <li>
            If the field has async rules, the async hook debounces the check. After the
            debounce interval, the async validator fires with an AbortController.
          </li>
          <li>
            When the async check resolves, the result updates per-field errors. If the
            request was aborted (value changed mid-flight), the result is discarded.
          </li>
          <li>
            If a cross-field dependency exists (for example, confirmPassword depends on
            password), changing the source field triggers revalidation of all dependent
            fields.
          </li>
          <li>
            On form submission, <code>useFormValidation</code> validates all fields
            (including untouched fields), waits for all pending async validators, and
            returns the final ValidationResult. If invalid, submission is blocked.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a layered approach: field value changes trigger the
          sync validation layer, which may trigger the async validation layer, which may
          trigger cross-field cascade revalidation. Results bubble up from individual
          field validators to the form-level aggregator, which updates the overall valid
          state and re-renders the form with updated error display.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Sync Validation Execution</h3>
        <p>
          When a field value changes, the engine retrieves the field&apos;s rule chain
          (array of ValidationRule objects). It iterates through the chain, calling each
          validator function with the current value and rule parameters. On the first
          validator that returns a ValidationError, iteration stops (short-circuit) and
          the error is stored in the field&apos;s error array. If all validators pass,
          the field&apos;s error array is cleared. This is an O(r) operation where r is
          the number of rules per field (typically 1-8).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Async Validation Execution</h3>
        <p>
          After sync validation passes (or concurrently, depending on config), async
          validators are triggered. Each async validator has its own debounce timer. When
          the timer fires, the engine creates an AbortController, passes it to the async
          check function, and awaits the result. If the field value changes before the
          check completes, the AbortController is aborted, the promise rejects, and the
          result is discarded. A new debounce cycle begins with the updated value. Results
          are cached by value to avoid redundant network calls for repeated inputs.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Cross-Field Cascade Revalidation</h3>
        <p>
          The dependency graph is a directed map: source field name to array of dependent
          field names. When field A changes, the engine looks up A in the graph and
          revalidates each dependent field B. If B also has dependents, the cascade
          continues (with cycle detection to prevent infinite loops). Each cascade
          revalidation runs both sync and async validators for the dependent field. This
          ensures that changing a password automatically revalidates the confirm-password
          field, and changing a start date revalidates the end date field.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Rapid typing with async validation:</strong> Each keystroke resets the
            debounce timer. No network call fires until the user stops typing for the
            debounce interval (default 300ms). If the user types continuously, no async
            requests are made until they pause.
          </li>
          <li>
            <strong>Form submit during async validation:</strong> The submit handler awaits
            all pending async validators before returning the final ValidationResult.
            Aborted requests are excluded from the pending set. This ensures the form
            cannot be submitted with incomplete validation results.
          </li>
          <li>
            <strong>Custom validator exception:</strong> Wrapped in a try/catch block. On
            exception, the engine logs the error and returns a generic ValidationError
            with code &quot;unexpected_error&quot;. The field is marked invalid with a
            fallback message (for example, &quot;Validation failed. Please try again.&quot;).
          </li>
          <li>
            <strong>Runtime locale change:</strong> The locale dictionary is stored in
            React state (or a Zustand store). When the locale changes, the error formatter
            re-resolves all existing ValidationError objects against the new dictionary,
            and the form re-renders with translated messages.
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
            The complete, production-ready implementation consists of 13 files: TypeScript
            interfaces, sync validators, async validator with debounce and AbortController,
            cross-field validator with dependency graph, core validation engine, error
            formatter with i18n, three React hooks, three UI components, and a full
            EXPLANATION.md walkthrough. Click the <strong>Example</strong> toggle at the
            top of the article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Validation Types (validation-types.ts)</h3>
        <p>
          Defines the foundational types: <code>ValidationRule</code> (union of rule
          discriminators with parameters), <code>ValidationError</code> (code, messageKey,
          params), <code>FieldErrors</code> (record mapping field name to error array),
          <code>ValidationResult</code> (valid flag, field errors map, error count),
          <code>ValidationConfig</code> (mode, debounceMs, i18n dictionary, cross-field
          rules), and <code>ValidatorFn</code> (pure function signature for custom
          validators). The types are designed to be fully extensible — consumers can add
          new rule discriminators and validator functions without modifying the engine.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Sync Validators (sync-validators.ts)</h3>
        <p>
          Each built-in validator is a pure function with the signature
          <code>(value: unknown, params?: object) =</code> ValidationError | null.
          Validators are grouped in a registry map keyed by rule name. The
          <code>validateSync</code> function accepts a value, a rule chain, and iterates
          through the chain, looking up each validator in the registry and executing it.
          Short-circuit behavior ensures the first failing validator stops execution.
          Custom validators are appended to the chain and executed after built-in
          validators. Email, phone, and url validators use well-tested regex patterns.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Async Validator (async-validator.ts)</h3>
        <p>
          The async validator factory accepts an async check function and debounce
          configuration, and returns a debounced, cancellable validator. It maintains a
          Map cache of previously checked values mapped to their results. Before making a
          network call, it checks the cache. On cache miss, it creates an AbortController,
          stores it as the active controller, and calls the check function with the
          controller signal. If a new call arrives before the previous one completes, it
          aborts the old controller and creates a new one. The cache has a configurable
          max size (default 100 entries) with LRU eviction.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Cross-Field Validator (cross-field-validator.ts)</h3>
        <p>
          The dependency graph is implemented as a Map from source field name to an array
          of dependent field names. Built-in cross-field rules include:
          <code>matches</code> (two fields must have equal values, for example
          password/confirm-password), <code>dateRange</code> (end date must be after start
          date), and <code>conditionalRequired</code> (field B is required when field A
          equals a specific value). When a field value changes, the graph is consulted and
          all dependent fields are queued for revalidation. Cycle detection uses a visited
          Set to prevent infinite cascades in circular dependency graphs.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Validation Engine (validation-engine.ts)</h3>
        <p>
          The engine class accepts a ValidationConfig on construction. It exposes
          <code>validateField(fieldName, value, allValues)</code> for single-field
          validation, <code>validateAll(values)</code> for full-form validation, and
          <code>isValid()</code> for checking overall form validity. Internally, it
          orchestrates sync validation (via the sync validator registry), async validation
          (via async validator factories), cross-field validation (via the dependency
          graph), and error aggregation (collecting per-field errors into a
          ValidationResult). i18n message interpolation happens in the error aggregation
          step — each ValidationError&apos;s messageKey is resolved against the locale
          dictionary, and params are substituted into the template string.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Error Formatter (error-formatter.ts)</h3>
        <p>
          The error formatter takes a ValidationResult and the i18n dictionary, and
          produces a display-ready structure: an array of objects with field name,
          interpolated error message, and anchor ID (for linking from the summary to the
          field). It also provides a <code>formatErrorCount</code> function that returns
          a localized string like &quot;3 errors found&quot; with proper pluralization
          rules based on the locale.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: React Hooks</h3>
        <p>
          <code>useFieldValidation</code> manages per-field state: current value, touched
          flag, errors array, and async loading flag. It binds onChange and onBlur
          handlers to the engine and triggers validation based on the configured mode.
          <code>useFormValidation</code> manages form-level state: values map, touched
          fields set, aggregate errors, submit readiness, and pending async count. It
          exposes a <code>handleSubmit</code> function that validates all fields, awaits
          pending async validators, and calls the user&apos;s submit callback only if the
          form is valid. <code>useAsyncValidation</code> wraps the async validator
          factory, managing debounce timers, AbortController lifecycle, and loading state
          transitions.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: UI Components</h3>
        <p>
          <code>ValidationError</code> renders an inline error message below a field with
          an error icon and aria-live=&quot;polite&quot; for screen reader announcements.
          <code>ValidationSummary</code> renders a list of all errors at the top of the
          form with anchor links to each invalid field.
          <code>ValidationProvider</code> is a React context provider that makes the
          form-level validation state available to all descendant components, eliminating
          prop drilling for nested form fields.
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
                <td className="p-2">validateField (sync)</td>
                <td className="p-2">O(r) — r rules in chain</td>
                <td className="p-2">O(1) — single error returned</td>
              </tr>
              <tr>
                <td className="p-2">validateAll (sync)</td>
                <td className="p-2">O(f * r) — f fields, r rules each</td>
                <td className="p-2">O(f * e) — e errors per field</td>
              </tr>
              <tr>
                <td className="p-2">Async validation (per field)</td>
                <td className="p-2">O(1) network call after debounce</td>
                <td className="p-2">O(c) — c cached results</td>
              </tr>
              <tr>
                <td className="p-2">Cross-field cascade</td>
                <td className="p-2">O(d * r) — d dependent fields</td>
                <td className="p-2">O(v) — v visited nodes for cycle detection</td>
              </tr>
              <tr>
                <td className="p-2">Error formatting</td>
                <td className="p-2">O(f * e) — interpolate each error message</td>
                <td className="p-2">O(f * e) — formatted error array</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>f</code> is the number of fields, <code>r</code> is rules per field,
          <code>e</code> is errors per field, <code>d</code> is dependent fields in the
          cascade, <code>c</code> is cache size, and <code>v</code> is visited nodes.
          For a 30-field form with 5 rules each, full sync validation completes in under
          5ms.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Cross-field cascade revalidation:</strong> In the worst case (every
            field depends on every other field), a single change triggers O(f * r)
            revalidations. For forms with 50+ fields and dense dependency graphs, this
            could cause noticeable lag. Mitigation: batch cascade revalidations into a
            single microtask using <code>queueMicrotask</code>, so all dependent fields
            revalidate in one render cycle rather than triggering multiple re-renders.
          </li>
          <li>
            <strong>Async validation cache growth:</strong> Without a max size limit, the
            cache grows unbounded. The LRU eviction with a default max of 100 entries
            prevents memory leaks. For forms with highly variable async inputs (e.g.,
            free-text search), consider increasing the cache size or using a TTL-based
            eviction strategy.
          </li>
          <li>
            <strong>Re-render cascades:</strong> When form-level error state changes, all
            field components re-render. Mitigation: use React.memo on field components
            and only pass the specific field&apos;s error state as props, so only the
            affected field re-renders. The ValidationProvider context can be split into
            granular selectors (similar to Zustand) to prevent unnecessary re-renders.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Short-circuit evaluation:</strong> Sync validation stops at the first
            error. For fields with 8 rules, this means most validation chains complete
            after 1-2 validator calls, not all 8.
          </li>
          <li>
            <strong>Parallel async execution:</strong> Async validators for different
            fields run in parallel (each with its own AbortController), not sequentially.
            This reduces total async validation time from O(n * latency) to O(max latency)
            for n fields.
          </li>
          <li>
            <strong>Debounced async validators:</strong> The debounce timer prevents
            network calls during rapid typing. For a user typing 5 characters per second,
            a 300ms debounce reduces async calls by approximately 80% compared to
            validating on every keystroke.
          </li>
          <li>
            <strong>Result caching:</strong> Sync and async validation results are cached
            by field value. If a user changes a field from &quot;abc&quot; to &quot;def&quot;
            and back to &quot;abc&quot;, the cached result is returned immediately without
            re-executing validators.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Sanitization</h3>
        <p>
          Validation error messages may contain interpolated values from user input (for
          example, the actual value that failed validation). If these values are rendered
          as HTML (via <code>dangerouslySetInnerHTML</code>), they become XSS vectors.
          Always interpolate values as plain text into i18n templates, never as raw HTML.
          React&apos;s default text rendering escapes special characters, so using text
          interpolation in JSX is safe. Custom validators that
          construct error messages from user input must sanitize the input before
          embedding it in the message string.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Server-Side Validation is Mandatory</h3>
        <p>
          Client-side validation improves user experience but provides zero security
          guarantees. A malicious actor can bypass client-side validation by modifying
          JavaScript, using browser DevTools, or sending requests directly to the API.
          Every validation rule enforced on the client must also be enforced on the
          server. The async validation layer (which calls the server for uniqueness
          checks) is the only security-critical validation in the engine. All sync
          validators are UX-only and must be duplicated server-side.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Inline Error Association</h4>
          <ul className="space-y-2">
            <li>
              Each invalid field has <code>aria-invalid=&quot;true&quot;</code> set when
              errors exist.
            </li>
            <li>
              The inline error message element has a unique <code>id</code> (e.g.,
              <code>email-error</code>), and the input element references it via
              <code>aria-describedby=&quot;email-error&quot;</code>.
            </li>
            <li>
              Screen readers announce the error message when the user focuses the field.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Error Summary</h4>
          <ul className="space-y-2">
            <li>
              The validation summary at the top of the form uses <code>role=&quot;alert&quot;</code>
              to ensure screen readers announce the error list immediately.
            </li>
            <li>
              Each summary item is an anchor link that focuses the corresponding invalid
              field when clicked.
            </li>
            <li>
              On form submission with errors, focus is moved to the summary container so
              screen reader users hear the errors without navigating manually.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Live Announcements</h4>
          <p>
            A hidden <code>aria-live=&quot;polite&quot;</code> region is updated with the
            error count whenever validation state changes (for example, &quot;3 errors
            found&quot;). This ensures screen reader users are informed of validation
            changes even when not focused on a specific field. The region is polite so it
            does not interrupt ongoing screen reader speech.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Rate Limiting Async Validation</h3>
        <ul className="space-y-2">
          <li>
            <strong>Debounce:</strong> The debounce mechanism (default 300ms) acts as a
            client-side rate limiter, preventing excessive API calls during rapid input.
          </li>
          <li>
            <strong>AbortController:</strong> Cancelling in-flight requests prevents
            resource waste and ensures stale results do not corrupt validation state.
          </li>
          <li>
            <strong>Deduplication:</strong> The result cache prevents re-checking identical
            values, further reducing unnecessary network traffic.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Sync validators:</strong> Test each built-in validator (required,
            minLength, email, etc.) with valid and invalid inputs. Test boundary values
            (exact minLength, maxLength). Test custom validator functions returning error
            and null. Test short-circuit behavior — verify that the first failing validator
            stops chain execution.
          </li>
          <li>
            <strong>Async validator:</strong> Test debounce timing — verify no network
            call fires before the debounce interval. Test AbortController cancellation —
            verify that changing the value mid-request aborts the previous request and
            discards its result. Test deduplication — verify that checking the same value
            twice returns the cached result without a network call. Test cache eviction —
            verify LRU eviction when the cache exceeds max size.
          </li>
          <li>
            <strong>Cross-field validator:</strong> Test dependency graph registration and
            lookup. Test cascade revalidation — verify that changing a source field
            triggers revalidation of all dependent fields. Test cycle detection — verify
            that circular dependencies do not cause infinite loops. Test built-in rules:
            password match, date range, and conditional requirements.
          </li>
          <li>
            <strong>Error formatter:</strong> Test i18n template interpolation with various
            param sets. Test pluralization rules for different locales. Test anchor ID
            generation for summary links.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full validation flow:</strong> Render a form with sync and async rules,
            simulate user input, verify inline errors appear/disappear correctly. Submit
            the form, verify async validators complete before submission. Verify form-level
            valid state updates correctly.
          </li>
          <li>
            <strong>Cross-field revalidation:</strong> Fill a password field, then fill
            confirm-password with a mismatch. Verify both fields show errors. Fix the
            password field and verify confirm-password revalidates automatically.
          </li>
          <li>
            <strong>Validation modes:</strong> Configure a form with onBlur mode. Type an
            invalid value and verify no error appears until blur. Configure with onChange
            mode and verify errors appear on every keystroke. Configure with onSubmit mode
            and verify no validation until submit.
          </li>
          <li>
            <strong>Accessibility:</strong> Run axe-core automated checks on a form with
            errors. Verify aria-invalid, aria-describedby, aria-live, and role=&quot;alert&quot;
            attributes. Test keyboard navigation — verify focus moves to summary on submit
            with errors.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Rapid typing in an async-validated field: verify debounce prevents network
            flood, no stale results corrupt state.
          </li>
          <li>
            Form submission during pending async validation: verify submit awaits all
            pending validators before returning result.
          </li>
          <li>
            Custom validator throws exception: verify error is caught, logged, and field
            marked invalid with generic message.
          </li>
          <li>
            Runtime locale change: verify all error messages re-render in the new locale.
          </li>
          <li>
            Form with 50 fields and 5 async validators each: verify no memory leaks, all
            AbortControllers cleaned up on unmount, final state is consistent.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Validating on every keystroke without debounce:</strong> Candidates
            often trigger async validation on every onChange event, causing a network call
            per keystroke. Interviewers expect candidates to discuss debounce strategies
            and their impact on server load and user experience.
          </li>
          <li>
            <strong>Not handling race conditions in async validation:</strong> Without
            AbortController or some cancellation mechanism, a slow async validation for an
            earlier value can overwrite the result of a faster validation for a later
            value. This is a critical concurrency bug. Interviewers look for candidates
            who identify and solve this.
          </li>
          <li>
            <strong>Ignoring cross-field dependencies:</strong> Candidates validate each
            field in isolation, missing scenarios like confirm-password not revalidating
            when the original password changes. Interviewers expect discussion of
            dependency graphs and cascade revalidation.
          </li>
          <li>
            <strong>No short-circuit optimization:</strong> Running all validators even
            after the first error is wasteful. Interviewers look for candidates who
            implement short-circuit evaluation for sync validation chains.
          </li>
          <li>
            <strong>Skipping accessibility:</strong> Rendering errors without
            aria-invalid, aria-describedby, or aria-live regions means screen reader users
            cannot understand why their input is rejected. This is a critical oversight
            for production systems.
          </li>
          <li>
            <strong>Coupling validation logic to UI:</strong> Implementing validation
            directly inside React components without a separate engine layer makes the
            logic untestable in isolation and impossible to reuse across frameworks.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Custom Engine vs React Hook Form + Zod</h4>
          <p>
            React Hook Form + Zod is the pragmatic choice for most applications. It
            provides unmanaged form state (minimizing re-renders), schema-based validation,
            and excellent TypeScript support. However, it couples the application to
            specific libraries and makes it harder to support dynamic rule injection,
            custom async debouncing, and cross-field dependency graphs without significant
            wrappers. A custom engine provides full control and framework independence at
            the cost of implementation complexity. For a reusable engine shared across
            dozens of forms with varying requirements, the custom approach pays off. For a
            single application with standard forms, React Hook Form + Zod is the better
            choice.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Debounce Interval: 300ms vs 500ms vs 1000ms</h4>
          <p>
            A shorter debounce (100ms) makes async validation feel snappier but increases
            network calls. A longer debounce (1000ms) reduces server load but makes the
            user wait longer for feedback. The default 300ms is a balance — it covers
            typical typing cadence (most users pause 200-400ms between words) while
            keeping server calls reasonable. For high-latency APIs (external services),
            500ms may be better. For low-latency internal APIs, 100ms is acceptable.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Eager vs Lazy Cross-Field Revalidation</h4>
          <p>
            Eager revalidation triggers dependent field validation immediately when a
            source field changes. This provides the most responsive UX but can cause
            cascade chains (A changes, revalidates B, which revalidates C, etc.). Lazy
            revalidation defers dependent field validation until the dependent field is
            next interacted with. This reduces computation but means errors may not appear
            until the user focuses the dependent field. Eager is preferred for tightly
            coupled fields (password/confirm-password); lazy is acceptable for loosely
            coupled fields (date range where the user will likely fill both fields
            sequentially).
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support dynamic validation rules (rules that change based
              on user role, feature flags, or server config)?
            </p>
            <p className="mt-2 text-sm">
              A: The ValidationConfig would accept a rule resolver function that takes the
              current context (role, flags, config) and returns the rule chain for each
              field. The engine would call this resolver on initialization and on context
              changes. This allows rules to be fetched from a server and applied
              dynamically without code changes. The resolver result is cached to avoid
              recomputation on every validation call.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle multi-language forms where different fields use
              different locales?
            </p>
            <p className="mt-2 text-sm">
              A: The ValidationConfig would accept a per-field locale override. The error
              formatter would use the field&apos;s locale (falling back to the form-level
              locale) when interpolating the error message. This is useful for forms with
              fields in different languages (e.g., a multilingual CMS where field labels
              and error messages must match the field&apos;s language). The locale
              dictionary would need entries for all supported languages.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you test the async validation race condition in CI?
            </p>
            <p className="mt-2 text-sm">
              A: Use a mock server that introduces controlled delays. Send a request for
              value A with a 500ms delay, then immediately change the value to B (which
              resolves in 100ms). Assert that the final validation state reflects B&apos;s
              result, not A&apos;s. In Jest, use fake timers and mock AbortController to
              verify the first request was aborted. In Playwright, use route interception
              to delay responses and assert the correct result wins.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add conditional async validation (e.g., only check username
              availability if the username format is valid)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>precondition</code> field to the async rule config. The
              precondition is a sync validator that must pass before the async validator
              fires. For username, the precondition would be a pattern check. If the
              pattern fails, the async validator is skipped entirely (no debounce timer,
              no network call). This prevents sending invalid usernames to the server for
              availability checks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support validation rule composition (combining multiple
              rules into a reusable group)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>ruleGroup</code> type to the ValidationRule union. A rule
              group contains an array of rules and an optional name. When the engine
              encounters a rule group, it flattens it into the rule chain. This allows
              consumers to define common rule groups (e.g., &quot;strong password&quot;
              with minLength, uppercase, lowercase, number, special character) and reuse
              them across fields. The flattening happens at config resolution time, so the
              engine executes a flat chain with no nesting overhead.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What happens if the async validation API is down (server error, timeout)?
            </p>
            <p className="mt-2 text-sm">
              A: The async validator should catch network errors and return a
              ValidationError with a retryable flag. The UI can then display a message
              like &quot;Could not verify availability. Please try again.&quot; with a
              retry button. The engine should not block form submission on async failures
              caused by network errors (since the user cannot fix a server outage).
              Instead, it marks the field as &quot;async_pending&quot; and allows
              submission with a warning. The server-side validation will catch any issues
              on submission.
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
              href="https://react-hook-form.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Hook Form — Performant Form Validation Library
            </a>
          </li>
          <li>
            <a
              href="https://zod.dev/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zod — TypeScript-First Schema Validation
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Form Validation Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/tutorials/forms/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA — Accessible Forms Patterns
            </a>
          </li>
          <li>
            <a
              href="https://www.developer.mozilla.org/en-US/docs/Web/API/AbortController"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — AbortController API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/debounce-input"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Debouncing Input for Performance
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
