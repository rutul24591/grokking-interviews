"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-form-builder",
  title: "Design a Form Builder",
  description:
    "Complete LLD solution for a production-grade form builder supporting dynamic fields, JSON schema definitions, conditional visibility, sync + async validation, multi-step flows, draft persistence, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "form-builder",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "form-builder",
    "dynamic-forms",
    "validation",
    "conditional-fields",
    "multi-step",
    "state-management",
    "accessibility",
    "json-schema",
  ],
  relatedTopics: [
    "data-table",
    "file-upload-widget",
    "search-autocomplete",
    "modal-component",
  ],
};

export default function FormBuilderArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable form builder system for a large-scale React
          application. The form builder must render forms dynamically from a JSON schema
          definition, support multiple field types (text, email, number, select, checkbox,
          radio, date, file), allow fields to be added or removed at runtime based on user
          actions, and evaluate conditional visibility rules (show field X only when field
          Y has value Z). The system must provide a robust validation engine handling both
          synchronous validators (required, minLength, maxLength, pattern matching) and
          asynchronous validators (e.g., checking username availability against an API). It
          must also support multi-step form flows with navigation (next, previous, back),
          step-level validation gates that prevent advancing until the current step is
          valid, and a comprehensive form state model tracking per-field value, touched
          state, dirty state, error messages, and async validation status.
        </p>
        <p>
          The system must also support draft saving and restoring — users should be able
          to save their progress to localStorage or a remote API and resume later. Form
          submission must collect all field values, run a final validation pass across all
          fields (including async validators), and invoke a configurable submit handler.
          Accessibility is non-negotiable: proper label associations, error announcements
          to screen readers, step progress indicators announced via ARIA live regions, and
          full keyboard navigation.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with TypeScript and Zustand for state
            management.
          </li>
          <li>
            Form schemas are defined as JSON objects and may be fetched from a CMS or
            configuration service at runtime.
          </li>
          <li>
            The form builder must handle forms with 50+ fields without performance
            degradation.
          </li>
          <li>
            Conditional field rules may reference multiple fields with compound logical
            expressions (AND, OR, NOT).
          </li>
          <li>
            Async validators may take up to 5 seconds; the UI must show a loading
            indicator during validation.
          </li>
          <li>
            Draft saves occur on every field change (debounced) and on explicit
            user action (Save Draft button).
          </li>
          <li>
            Multi-step forms can have 2–10 steps, each with its own subset of fields.
          </li>
          <li>
            The application supports light and dark mode.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Schema-Driven Rendering:</strong> Forms are defined via a JSON schema
            that declares field types, labels, default values, validation rules, and
            conditional visibility. The renderer consumes this schema and produces the
            appropriate field components.
          </li>
          <li>
            <strong>Field Type Support:</strong> The system must support text, email,
            number, select, checkbox, radio, date, and file input types. Each type maps
            to a specific native or custom input component with appropriate attributes.
          </li>
          <li>
            <strong>Dynamic Field Addition/Removal:</strong> Users can add or remove
            fields at runtime (e.g., adding an additional phone number, removing an
            address line). The schema must support repeatable field groups.
          </li>
          <li>
            <strong>Conditional Visibility:</strong> Fields can declare visibility rules
            based on other field values. A rule might state: show the &quot;Company&quot;
            field only if the &quot;Employment Status&quot; field equals
            &quot;Employed&quot;. Rules support AND, OR, and NOT compositions.
          </li>
          <li>
            <strong>Validation Engine:</strong> Support sync validators (required,
            minLength, maxLength, email pattern, numeric range) and async validators
            (debounced API calls like username availability). Validators run on field
            change and on blur.
          </li>
          <li>
            <strong>Multi-Step Forms:</strong> Forms can be split into logical steps with
            next/previous navigation. The system validates the current step before
            allowing navigation forward. A step progress indicator shows completed,
            current, and upcoming steps.
          </li>
          <li>
            <strong>Form State Management:</strong> Track per-field value, touched
            (user has visited the field), dirty (value changed from initial), error
            (validation message), and validating (async validation in progress) state.
          </li>
          <li>
            <strong>Draft Persistence:</strong> Auto-save form state to localStorage
            (debounced at 500ms) and support explicit draft save/restore via API. On
            page load, check for a saved draft and prompt the user to restore.
          </li>
          <li>
            <strong>Form Submission:</strong> On submit, run full validation across all
            fields (including async validators), collect all values into a single payload
            object, and invoke a configurable submit callback. Show a loading state
            during submission and handle errors gracefully.
          </li>
          <li>
            <strong>Accessibility:</strong> All fields must have properly associated
            labels, error messages must be announced to screen readers via ARIA
            live regions, step progress must be announced, and the form must be fully
            navigable via keyboard.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Rendering a 50-field form should not cause
            visible jank. Field changes should update only the affected field component
            (no full form re-render). Validation should run asynchronously without
            blocking the main thread.
          </li>
          <li>
            <strong>Scalability:</strong> The system should handle forms with 100+ fields
            and 10+ steps without memory leaks or state corruption.
          </li>
          <li>
            <strong>Reliability:</strong> Draft saves must be resilient to network
            failures (retry with exponential backoff for API saves). Form state must
            survive page refreshes when using localStorage drafts.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for field definitions,
            validation rules, form state, and step configurations. Generic types should
            allow consumers to type their form values.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            A conditional field becomes visible but its dependent field value changes
            before the user interacts with it — the visibility rule must re-evaluate.
          </li>
          <li>
            Async validator is still running when the user navigates to the next step —
            the navigation must wait for pending async validations to complete.
          </li>
          <li>
            User saves a draft, the schema changes on the server (new field added), and
            the user restores the draft — the system must merge the old draft with the
            new schema gracefully.
          </li>
          <li>
            File upload field in a multi-step form — file data cannot be serialized to
            localStorage. The system must handle file fields separately (skip during draft
            save, warn user on restore).
          </li>
          <li>
            User changes a field value that triggers a conditional rule, causing many
            fields to appear/disappear simultaneously — batch the visibility updates to
            avoid layout thrashing.
          </li>
          <li>
            Form is submitted while an async validator is still running — the submit
            handler must await all pending validations before proceeding.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate the <strong>form schema definition</strong>, the
          <strong>form state management</strong>, and the <strong>form rendering</strong>
          into three independent layers. The schema is a pure JSON structure describing
          fields, their types, validation rules, and conditional visibility. The state
          layer uses Zustand to manage per-field values, touched/dirty/error/validating
          flags, step state, and draft persistence. The rendering layer consumes the
          schema and state to produce field components, step wrappers, a stepper
          indicator, and conditional visibility evaluators.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>React Hook Form:</strong> A mature library with excellent performance
            (uncontrolled inputs, minimal re-renders). However, it does not natively
            support JSON schema-driven rendering, conditional field visibility based on
            other field values, or multi-step navigation with validation gates. We would
            need to build substantial abstractions on top of it. For a form builder that
            must render entirely from a schema, a custom Zustand-based approach provides
            more control over the rendering and state lifecycle.
          </li>
          <li>
            <strong>Formik:</strong> Similar to React Hook Form but uses controlled
            inputs, which causes more re-renders for large forms. Lacks native schema
            support and multi-step navigation. Heavier bundle size.
          </li>
          <li>
            <strong>JSON Schema + AJV Validator:</strong> Using JSON Schema as the
            definition format and AJV for validation is a strong choice for the validation
            layer. However, JSON Schema alone does not cover conditional visibility,
            multi-step flows, or draft persistence. We use JSON Schema as the format for
            field definitions but build our own rendering and state layers.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + Schema-Driven Rendering is optimal:</strong> Zustand
          provides fine-grained selector subscriptions so individual field components
          only re-render when their own state changes. The schema-driven approach means
          the entire form is a data structure — forms can be defined in a CMS, stored
          in a database, or generated dynamically without code changes. This pattern
          is used by production form builders like React JSON Schema Form and Formio.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of six modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Form Types &amp; Interfaces (<code>form-types.ts</code>)</h4>
          <p>
            Defines the core type system that underpins the entire form builder. The
            <code>FieldType</code> union covers all supported input types. The
            <code>FieldDefinition</code> interface describes a single field&apos;s schema:
            its name, label, type, default value, validation rules, conditional visibility
            rules, and optional metadata (placeholder, helper text, disabled state). The
            <code>ValidationRule</code> union supports sync rules (required, minLength,
            maxLength, pattern, min, max, email) and async rules (custom async function
            returning a promise). The <code>FieldValue</code> type maps field names to
            their runtime values (string, number, boolean, Date, File, or null). The
            <code>FieldState</code> interface tracks per-field runtime state: value,
            touched, dirty, error, and validating. The <code>FormState</code> interface
            aggregates all field states, tracks the overall form validity, submission
            state, and current step. The <code>Step</code> interface defines a step in a
            multi-step form: id, title, description, field names belonging to this step,
            and validation status. See the Example tab for complete type definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Validation Engine (<code>validation-engine.ts</code>)</h4>
          <p>
            A pure-function validation pipeline that executes rules against field values
            and returns error messages. Sync validators run immediately and return a
            string error or null. Async validators return a Promise that resolves to an
            error string or null. The engine supports rule composition — multiple
            validators run in sequence, and the first failing validator&apos;s error
            message is returned. The engine debounces async validators (default: 300ms)
            to avoid excessive API calls during rapid typing. Error aggregation collects
            all field errors into a single record for form-level validity checks. See the
            Example tab for the complete validation pipeline implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Form Store (<code>form-store.ts</code>)</h4>
          <p>
          The Zustand store is the single source of truth for all form state. It
            maintains a registry of field definitions (from the schema), per-field state
            (value, touched, dirty, error, validating), step state (current step index,
            step validity map), submission state (idle, submitting, submitted, error),
            and draft state (last saved timestamp, draft key). The store exposes actions
            for registering fields, updating field values, running validation, navigating
            steps, submitting the form, and saving/loading drafts. Draft persistence to
            localStorage is handled via a debounced subscription that serializes field
            values (excluding File objects) and writes to storage on every change. See the
            Example tab for the complete store implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. useField Hook (<code>use-field.ts</code>)</h4>
          <p>
            A custom React hook that provides field-level state and actions to individual
            field components. It subscribes to the Zustand store for its specific field
            (using a selector that only re-renders when this field&apos;s state changes),
            exposes the current value, touched, dirty, error, and validating state, and
            provides an onChange handler that updates the store value, marks the field as
            dirty and touched, and triggers validation (sync immediately, async after
            debounce). See the Example tab for the complete hook implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. useForm Hook (<code>use-form.ts</code>)</h4>
          <p>
            A custom React hook that provides form-level state and actions. It subscribes
            to the store for form-wide state (all field values, current step, submission
            state, overall validity) and exposes actions for step navigation (next,
            previous, goToStep), form submission, draft save/restore, and accessing the
            complete form values object. The next action runs validation on all fields in
            the current step and only advances if all are valid. See the Example tab for
            the complete hook implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Component Layer</h4>
          <p>
            <strong>FormBuilder (<code>form-builder.tsx</code>)</strong> — Root component
            that accepts a form schema and optional configuration. Initializes the store
            with field definitions, renders the form stepper (if multi-step), and renders
            the current step&apos;s fields or all fields (if single-step). Wraps children
            in a form element with submit handler.
          </p>
          <p className="mt-3">
            <strong>FormField (<code>form-field.tsx</code>)</strong> — Dynamic field
            renderer that maps a FieldDefinition to the appropriate input component based
            on field type. Renders label, input, error message, and helper text. Uses the
            useField hook for state management.
          </p>
          <p className="mt-3">
            <strong>FormStep (<code>form-step.tsx</code>)</strong> — Step wrapper that
            renders a subset of fields belonging to a step. Runs validation gate before
            allowing step advancement. Renders navigation buttons (Next, Previous) with
            appropriate disabled states.
          </p>
          <p className="mt-3">
            <strong>FormStepper (<code>form-stepper.tsx</code>)</strong> — Step progress
            indicator showing all steps with completed (checkmark), current (highlighted),
            and upcoming (dimmed) states. Each step is clickable if already completed or
            if all preceding steps are valid. Announces current step to screen readers
            via aria-live region.
          </p>
          <p className="mt-3">
            <strong>FieldConditions (<code>field-conditions.tsx</code>)</strong> —
            Conditional visibility evaluator. Accepts a field&apos;s visibility rules and
            the current form values, evaluates the boolean expression tree (AND, OR, NOT
            compositions), and returns whether the field should be rendered. Re-evaluates
            whenever any referenced field value changes.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store maintains a flat map of field states keyed by field name.
          Each field state entry holds the current value, a touched flag (set on blur),
          a dirty flag (set when value differs from the initial/default value), an error
          string (set when validation fails), and a validating flag (set when an async
          validator is running). Step state tracks the current step index and a validity
          map from step ID to boolean. Submission state tracks whether the form is idle,
          currently submitting, successfully submitted, or errored.
        </p>
        <p>
          Draft persistence works via a Zustand middleware or a useEffect subscription
          that debounces field value changes at 500ms and serializes the values to
          localStorage under a key derived from the form ID. On initialization, the store
          checks for a saved draft and, if found, merges it with the schema defaults
          (new fields get their defaults, removed fields are dropped, existing fields
          retain their saved values). File-type fields are excluded from draft
          serialization since File objects are not JSON-serializable.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/form-builder-architecture.svg"
          alt="Form Builder Architecture"
          caption="Architecture of the form builder showing schema-driven rendering, Zustand store, and validation pipeline"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            FormBuilder mounts with a form schema. It initializes the Zustand store with
            field definitions and default values.
          </li>
          <li>
            The store checks for a saved draft in localStorage. If found, it merges the
            draft values with the defaults and updates the store.
          </li>
          <li>
            FormField components render for each visible field in the current step. Each
            FormField calls useField(name), which subscribes to that field&apos;s state
            in the store.
          </li>
          <li>
            User types into a text field. The onChange handler calls
            store.setFieldValue(name, newValue).
          </li>
          <li>
            The store updates the field value, marks it as dirty, runs sync validators
            immediately, and schedules async validators (debounced).
          </li>
          <li>
            If a sync validator fails, the error is set on the field state and the
            FormField re-renders with the error message below the input.
          </li>
          <li>
            Async validators run after debounce. The validating flag is set to true
            during execution, showing a spinner. On completion, the error is updated
            and validating is set to false.
          </li>
          <li>
            The debounced draft subscription fires after 500ms of inactivity, serializes
            field values (excluding files), and writes to localStorage.
          </li>
          <li>
            User clicks &quot;Next&quot; on a multi-step form. FormStep runs validation
            on all fields in the current step. If all pass, it advances the current step
            index. If any fail, it scrolls to the first invalid field and focuses it.
          </li>
          <li>
            User clicks &quot;Submit&quot; on the final step. The submit handler runs
            validation on all fields across all steps, awaits any pending async
            validators, collects all values into a payload object, and calls the
            onSubmit callback.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional data flow pattern. All state
          mutations flow through the Zustand store, and all rendering flows from store
          subscriptions via the useField and useForm hooks. This ensures predictable
          behavior and makes the system testable in isolation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Conditional Visibility Evaluation Flow</h3>
        <p>
          Conditional visibility is evaluated as a boolean expression tree. Each rule node
          in the tree references a source field, an operator (equals, not equals, contains,
          greater than, less than, is empty, is not empty), and a target value. Compound
          nodes combine child rules with AND, OR, or NOT operators. The FieldConditions
          component evaluates the tree against the current form values whenever any
          referenced field value changes. If the result changes from false to true, the
          field is rendered and registered with the store. If it changes from true to
          false, the field is unmounted and its value is optionally cleared from the store
          (configurable per field).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Async validation during step navigation:</strong> Before advancing to
            the next step, the FormStep component checks for any fields with
            <code>validating: true</code> in the current step. If found, it waits for the
            validating flag to become false (by subscribing to the store) before
            proceeding. If the async validator ultimately returns an error, navigation is
            blocked.
          </li>
          <li>
            <strong>Schema changes between draft saves:</strong> When a draft is restored
            against a new schema, the merge algorithm iterates the new schema&apos;s field
            definitions. For each field, it checks if a saved value exists. If yes, it
            uses the saved value (with type coercion if the field type changed). If no,
            it uses the field&apos;s default value. Fields in the draft but not in the new
            schema are dropped. A warning is logged for any type coercion failures.
          </li>
          <li>
            <strong>File fields and draft persistence:</strong> File objects are
            non-serializable. The draft subscription filters out fields of type
            <code>&quot;file&quot;</code> before serialization. On draft restore, file
            fields retain their default value (null). A user-facing message informs them
            that file attachments must be re-uploaded.
          </li>
          <li>
            <strong>Mass conditional visibility changes:</strong> When a field value
            changes and triggers a rule that affects 20+ other fields, the store batches
            the visibility updates in a single state update via Zustand&apos;s batch
            mechanism. The React renderer processes this as one re-render cycle, avoiding
            layout thrashing.
          </li>
          <li>
            <strong>SSR safety:</strong> The form store initializes field state lazily
            inside a useEffect, ensuring no localStorage access during SSR. The
            FormBuilder renders a skeleton during SSR and hydrates with full form content
            on the client.
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
            The complete, production-ready implementation consists of 11 files: TypeScript
            interfaces for all form constructs, a sync + async validation pipeline, a
            Zustand store with field registry and draft persistence, useField and useForm
            hooks, a dynamic form builder renderer, individual field components, step
            wrappers with validation gates, a stepper progress indicator, a conditional
            visibility evaluator, and a full EXPLANATION.md walkthrough. Click the
            <strong>Example</strong> toggle at the top of the article to view all source
            files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Form Types (form-types.ts)</h3>
        <p>
          Defines the complete type system: <code>FieldType</code> union for all input
          types, <code>FieldDefinition</code> for schema-driven field declarations with
          nested <code>ValidationRule</code> and <code>ConditionRule</code> types,
          <code>FieldState</code> for per-field runtime state, <code>FormState</code> for
          aggregate form state, and <code>Step</code> for multi-step configuration. Uses
          TypeScript generics (<code>FormState&lt;TValues&gt;</code>) so consumers can
          type their form values end-to-end.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Validation Engine (validation-engine.ts)</h3>
        <p>
          A pure-function pipeline that executes sync validators in sequence (first
          failure short-circuits) and async validators with configurable debounce (default
          300ms). Each validator is a function accepting a field value and optional
          configuration, returning a string error or null. Async validators return
          Promises. The engine tracks active async validations via a Set of field names
          so the store can gate step navigation and submission on pending validations.
          Built-in validators cover required, minLength, maxLength, pattern (regex), min,
          max, email, and custom functions.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Form Store (form-store.ts)</h3>
        <p>
          The Zustand store with actions for field registration (batch-register from
          schema), value updates (setFieldValue marks dirty and triggers validation),
          blur handling (sets touched flag), step navigation (validates current step
          before advancing), submission (validates all fields, awaits pending async,
          invokes callback), and draft operations (save to localStorage with debouncing,
          load from localStorage with schema merge). The store uses selectors for
          granular subscriptions so individual field components only re-render when their
          own state changes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: useField Hook (use-field.ts)</h3>
        <p>
          Subscribes to a single field&apos;s state in the store via a stable selector.
          Returns the current value, touched, dirty, error, and validating state along
          with onChange and onBlur handlers. The onChange handler updates the store, and
          the onBlur handler marks the field as touched and triggers validation if not
          already run. Uses <code>useCallback</code> to memoize handlers and prevent
          unnecessary re-renders of child input components.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: useForm Hook (use-form.ts)</h3>
        <p>
          Subscribes to form-wide state (current step, step validity map, submission
          state, overall form validity). Returns actions for step navigation (next with
          validation gate, previous without validation, goToStep for direct navigation to
          completed steps), form submission, draft save/restore, and accessing the
          complete values object. The next action is the most complex — it validates all
          fields in the current step, waits for pending async validations, and only
          advances the step index if all fields pass.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: FormBuilder Component (form-builder.tsx)</h3>
        <p>
          Root component accepting a form schema and configuration. On mount, it
          batch-registers all field definitions with the store. Renders the FormStepper
          (if multi-step), the current step&apos;s fields via FormStep, or all fields in
          a single layout. Wraps everything in a <code>&lt;form&gt;</code> element with
          an onSubmit handler that prevents default, runs full validation, and invokes
          the submit callback. Handles draft restore prompts on initialization.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: FormField Component (form-field.tsx)</h3>
        <p>
          Dynamic field renderer using a type-to-component map. For each field type, it
          renders the appropriate native input: <code>&lt;input type=&quot;text&quot;&gt;</code>
          for text/email/number/date, <code>&lt;select&gt;</code> with options for select,
          <code>&lt;input type=&quot;checkbox&quot;&gt;</code> for boolean fields,
          <code>&lt;fieldset&gt;</code> with radio inputs for radio groups, and a custom
          file uploader for file type. Wraps the input with a <code>&lt;label&gt;</code>
          element (properly associated via htmlFor), an error message element (visible
          when error exists, with <code>role=&quot;alert&quot;</code>), and optional
          helper text.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: FormStep Component (form-step.tsx)</h3>
        <p>
          Renders a subset of fields belonging to a step (determined by the step&apos;s
          fieldNames array). Contains Next and Previous buttons. The Next button triggers
          validation on all current step fields, scrolls to the first invalid field if
          validation fails, and calls the store&apos;s nextStep action if all pass. The
          Previous button navigates back without validation. Both buttons are disabled
          during async validation or form submission.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: FormStepper Component (form-stepper.tsx)</h3>
        <p>
          Renders a horizontal step indicator with three visual states: completed
          (checkmark icon, muted color), current (highlighted circle with step number,
          accent color), and upcoming (dimmed circle, gray). Each step displays its title
          and is clickable if the step is completed or if all preceding steps are valid.
          Includes an <code>aria-live=&quot;polite&quot;</code> region that announces the
          current step title and number (e.g., &quot;Step 2 of 4: Personal Details&quot;)
          when the step changes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 10: FieldConditions Component (field-conditions.tsx)</h3>
        <p>
          Evaluates conditional visibility rules against current form values. Supports
          simple rules (single field operator value) and compound rules (AND/OR/NOT of
          nested rules). Uses a recursive evaluation function that walks the rule tree.
          Subscribes to the store for only the fields referenced in its rules (computed
          via a dependency extraction function), minimizing unnecessary re-renders. When
          visibility changes, optionally clears the field value from the store
          (configurable via <code>clearOnHide</code> flag on the field definition).
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
                <td className="p-2">setFieldValue</td>
                <td className="p-2">O(1) — map update</td>
                <td className="p-2">O(n) — n field states</td>
              </tr>
              <tr>
                <td className="p-2">Sync validation</td>
                <td className="p-2">O(v) — v validators per field</td>
                <td className="p-2">O(1) — single error string</td>
              </tr>
              <tr>
                <td className="p-2">Async validation</td>
                <td className="p-2">O(a) — a async validators, debounced</td>
                <td className="p-2">O(a) — pending promise refs</td>
              </tr>
              <tr>
                <td className="p-2">Conditional evaluation</td>
                <td className="p-2">O(r) — r rules in expression tree</td>
                <td className="p-2">O(d) — d tree depth (recursion)</td>
              </tr>
              <tr>
                <td className="p-2">Step validation</td>
                <td className="p-2">O(f * v) — f fields * v validators</td>
                <td className="p-2">O(f) — f error results</td>
              </tr>
              <tr>
                <td className="p-2">Draft serialization</td>
                <td className="p-2">O(n) — iterate all field values</td>
                <td className="p-2">O(n) — serialized JSON string</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is the total number of fields, <code>v</code> is the number
          of validators per field, <code>a</code> is the number of async validators,
          <code>r</code> is the number of conditional rules, <code>f</code> is the number
          of fields in a step, and <code>d</code> is the depth of the conditional rule
          tree. For a 50-field form with 3 validators per field, validation completes in
          sub-millisecond time.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full form re-rendering on field change:</strong> If the store
            subscriber selects the entire form state, every field change triggers a
            re-render of all field components. Mitigation: use Zustand selectors to
            subscribe each FormField to only its own field state. Only the changed field
            re-renders.
          </li>
          <li>
            <strong>Async validator debounce lag:</strong> With a 300ms debounce, rapid
            typing delays validation feedback. Users may type for 2 seconds before seeing
            the first async error. Mitigation: reduce debounce to 150ms for short fields
            (username, email) and keep 300ms for longer fields. Use a trailing-edge
            debounce to validate after the user stops typing.
          </li>
          <li>
            <strong>Conditional rule explosion:</strong> Forms with 100+ conditional rules
            evaluated on every field change can become expensive. Mitigation: build a
            dependency graph mapping each field to the rules that reference it. Only
            evaluate rules whose dependencies changed. This reduces evaluation from O(all
            rules) to O(affected rules).
          </li>
          <li>
            <strong>localStorage write latency:</strong> Serializing and writing large
            form state to localStorage on every change can block the main thread.
            Mitigation: debounce at 500ms, use requestIdleCallback for the write
            operation, and limit draft size (exclude file fields, truncate long text
            values).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Selector-based subscriptions:</strong> Each FormField subscribes to
            its own field state by name. Changing one field only re-renders that field
            component and any fields whose conditional visibility depends on it.
          </li>
          <li>
            <strong>Memoized field components:</strong> Wrap FormField in
            <code>React.memo</code> with a custom comparison function that checks if the
            field value, error, and validating state are unchanged. Prevents re-renders
            when unrelated form state changes.
          </li>
          <li>
            <strong>Dependency graph for conditions:</strong> Pre-compute a reverse
            dependency map from the schema: for each field, list the fields whose
            visibility depends on it. On value change, only re-evaluate conditions for
            dependent fields rather than scanning all rules.
          </li>
          <li>
            <strong>Virtual scrolling for large forms:</strong> For forms with 100+ fields
            in a single step, use virtual scrolling (react-window) to render only the
            fields visible in the viewport. This reduces DOM node count and improves
            scroll performance.
          </li>
          <li>
            <strong>AbortController for async validators:</strong> When a field value
            changes while an async validator is still running, abort the previous request
            using AbortController before starting a new one. This prevents stale responses
            from overwriting current validation results.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Sanitization</h3>
        <p>
          Field values are user input and must be treated as potentially malicious. When
          rendering field values back to the user (e.g., in error messages, helper text,
          or preview panels), always escape HTML entities. React&apos;s default string
          rendering escapes automatically, but if you use <code>dangerouslySetInnerHTML</code>
          for rich text fields, sanitize with DOMPurify first. Form submission payloads
          should be validated server-side — client-side validation is for UX only and
          must never be trusted for security decisions.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Async Validator Trust</h3>
        <p>
          Async validators often make API calls (e.g., checking username availability).
          These calls should include anti-CSRF tokens if the API is authenticated. Rate
          limit async validator calls on the server side to prevent abuse (e.g., a script
          triggering thousands of username-check requests). On the client, debounce
          prevents excessive requests but is not a security measure — server-side rate
          limiting is required.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Label Associations</h4>
          <ul className="space-y-2">
            <li>
              Every input must have a <code>&lt;label&gt;</code> element with
              <code>htmlFor</code> matching the input&apos;s <code>id</code>. For radio
              groups, use <code>&lt;fieldset&gt;</code> with <code>&lt;legend&gt;</code>
              as the group label.
            </li>
            <li>
              Required fields must indicate requiredness visually (asterisk) and
              programmatically (<code>aria-required=&quot;true&quot;</code>).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Error Announcements</h4>
          <ul className="space-y-2">
            <li>
              Each field&apos;s error message renders in an element with
              <code>role=&quot;alert&quot;</code> and <code>aria-live=&quot;assertive&quot;</code>,
              ensuring screen readers announce errors immediately.
            </li>
            <li>
              The input element has <code>aria-describedby</code> pointing to the error
              message element, so screen readers read the error when the field is focused.
            </li>
            <li>
              On form submission with errors, focus moves to the first invalid field
              and a summary message announces the total number of errors via an
              <code>aria-live=&quot;assertive&quot;</code> region at the form top.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Step Progress</h4>
          <ul className="space-y-2">
            <li>
              The FormStepper includes an <code>aria-live=&quot;polite&quot;</code> region
              announcing step changes: &quot;Step 2 of 4: Personal Details&quot;.
            </li>
            <li>
              Each step button has <code>aria-current=&quot;step&quot;</code> for the
              current step and <code>aria-disabled=&quot;true&quot;</code> for
              non-navigable steps.
            </li>
            <li>
              The form element has <code>aria-label</code> describing the form purpose
              (e.g., &quot;Registration Form, Step 2 of 4&quot;).
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Draft Security</h3>
        <ul className="space-y-2">
          <li>
            <strong>localStorage exposure:</strong> Draft data stored in localStorage is
            accessible to any script running on the same origin. Do not store sensitive
            data (passwords, PII, tokens) in drafts. If the form collects sensitive data,
            disable draft persistence entirely or use session storage (cleared on tab
            close).
          </li>
          <li>
            <strong>Schema tampering:</strong> If form schemas are fetched from a
            server and cached client-side, an attacker could modify the cached schema to
            add/remove fields or disable validators. Always validate submitted data
            server-side against the authoritative schema on the server.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Validation engine:</strong> Test each sync validator (required,
            minLength, maxLength, pattern, email) with valid and invalid inputs. Test
            async validators with mocked API responses (success and failure). Test
            debounce behavior — validator should not fire until the debounce period
            elapses. Test that rapid value changes abort previous pending async calls.
          </li>
          <li>
            <strong>Store actions:</strong> Test setFieldValue updates value and marks
            dirty, setFieldTouched marks touched, nextStep validates current step and
            advances only if valid, submit runs all validations and invokes callback.
            Test draft save serializes values correctly and draft load merges with schema
            defaults.
          </li>
          <li>
            <strong>Conditional evaluation:</strong> Test simple rules (equals, not
            equals, is empty), compound rules (AND, OR, NOT nesting), and edge cases
            (referencing a field that does not exist, circular dependencies).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Form rendering lifecycle:</strong> Render FormBuilder with a schema,
            assert all fields render with correct labels and input types. Change a field
            value, assert the store updates and the field re-renders with the new value.
            Trigger a validation error, assert the error message appears.
          </li>
          <li>
            <strong>Multi-step navigation:</strong> Render a 3-step form, fill step 1,
            click Next, assert step 2 renders. Fill step 2 with invalid data, click Next,
            assert validation errors appear and step does not advance. Fix errors, click
            Next, assert step 3 renders. Click Previous, assert step 2 renders with
            previously entered values.
          </li>
          <li>
            <strong>Conditional visibility:</strong> Render a form with a conditional
            field (visible when another field equals a specific value). Change the
            triggering field, assert the conditional field appears. Change the triggering
            field back, assert the conditional field disappears and its value clears.
          </li>
          <li>
            <strong>Draft persistence:</strong> Fill a form, wait for debounce to fire,
            reload the page, assert the draft restore prompt appears. Accept restore,
            assert all fields populate with saved values.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            100-field form: verify rendering completes within 200ms, field changes do
            not cause jank, memory usage remains stable.
          </li>
          <li>
            Async validator with 5-second response time: verify loading indicator shows,
            submit waits for completion, AbortController cancels on value change.
          </li>
          <li>
            Schema change between draft saves: add a new field, remove an old field,
            change a field type. Verify draft restore handles all three cases correctly.
          </li>
          <li>
            Accessibility: run axe-core automated checks on rendered form, verify label
            associations, aria-live regions, keyboard navigation through all fields and
            step controls, and screen reader announcements.
          </li>
          <li>
            File field handling: verify file values are excluded from draft serialization,
            restore prompt warns about file re-upload, file validation (size, type) runs
            correctly.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Hardcoding field components instead of using schema-driven rendering:</strong>
            Candidates often create individual field components for each form field,
            defeating the purpose of a form builder. Interviewers expect a data-driven
            approach where the form renders entirely from a schema definition. The schema
            is the abstraction that makes the builder reusable.
          </li>
          <li>
            <strong>Ignoring dirty/touched state semantics:</strong> Many candidates
            track only value and error, omitting touched (user visited the field) and
            dirty (value changed from initial). These flags are critical for UX: errors
            should only show on touched or dirty fields, not on initial render. The
            submit button should be disabled when the form is not dirty (no changes made).
          </li>
          <li>
            <strong>Not handling async validation during submission:</strong> A common
            oversight is submitting the form while async validators are still running.
            The submit handler must check for pending async validations, wait for them to
            complete, and only then proceed with submission. This requires tracking
            active async validations in the store.
          </li>
          <li>
            <strong>Serializing File objects to localStorage:</strong> File objects are
            not JSON-serializable. Attempting to serialize them produces an empty object
            (<code>{"{}"}</code>). Candidates must explicitly exclude file fields from
            draft persistence and handle them separately (e.g., upload to a server and
            store the file URL in the draft).
          </li>
          <li>
            <strong>Not clearing conditional field values on hide:</strong> When a field
            becomes hidden due to a conditional rule, its value may still exist in the
            form state and get submitted. Interviewers expect candidates to discuss
            whether hidden field values should be cleared (default) or retained
            (configurable), and the implications for form submission.
          </li>
          <li>
            <strong>Validating all fields on every change:</strong> Running validation
            across all 50 fields when one field changes is wasteful. Validation should
            run only on the changed field (on change) and on the current step fields (on
            step navigation). Full-form validation runs only on submission.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Controlled vs Uncontrolled Inputs</h4>
          <p>
            Controlled inputs (value from state, onChange updates state) provide
            predictable state management and make validation straightforward. However,
            every keystroke triggers a React re-render. For 50+ fields, this can cause
            noticeable input lag. Uncontrolled inputs (refs, defaultValue) avoid
            re-renders but make validation trickier — you must read values from refs
            rather than state. The hybrid approach used here stores values in Zustand
            (controlled) but uses <code>React.memo</code> and selector subscriptions to
            ensure only the changed field re-renders. For extremely large forms (200+
            fields), consider uncontrolled inputs with ref-based validation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">localStorage vs Server-Side Drafts</h4>
          <p>
            localStorage drafts are fast, offline-capable, and require no server
            infrastructure. However, they are origin-scoped (not available across
            devices), vulnerable to XSS (any script on the origin can read them), and
            limited to ~5-10MB. Server-side drafts survive device changes, can be shared
            across sessions, and support collaboration (multiple users editing the same
            draft). The trade-off is latency (network round-trip), complexity (API
            endpoints, auth), and cost (storage). A hybrid approach saves to localStorage
            for immediate feedback and periodically syncs to the server for persistence.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Eager vs Lazy Validation</h4>
          <p>
            Eager validation runs on every keystroke, providing immediate feedback but
            potentially annoying users (seeing &quot;Email is invalid&quot; while still
            typing). Lazy validation runs on blur, waiting until the user leaves the
            field. The best UX combines both: sync validators run on blur (not on every
            keystroke), async validators run on blur with debounce, and all validators
            run on step navigation and submission. This avoids false positives during
            typing while ensuring errors are caught promptly.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">JSON Schema vs Custom Schema Format</h4>
          <p>
            Using JSON Schema (draft-07+) as the field definition format provides
            interoperability — schemas can be shared with backend validators, generated
            from OpenAPI specs, and validated with AJV. However, JSON Schema does not
            cover conditional visibility, multi-step flows, or UI hints (placeholder,
            helper text). You need a custom extension (e.g., <code>x-visibility</code>,
            <code>x-step</code>) or a parallel schema. A custom schema format gives full
            control but sacrifices interoperability. For internal tools, a custom format
            is often simpler. For public APIs, JSON Schema with extensions is preferred.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support cross-field validation (e.g., &quot;Confirm Email&quot;
              must match &quot;Email&quot;)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>crossField</code> validator type that references another field
              by name. The validator receives the current field value and the referenced
              field value from the form state. Both fields register a dependency on each
              other, so when either changes, both re-validate. The error message on the
              dependent field updates accordingly. For complex cross-field rules (e.g.,
              date range: end date must be after start date), the same pattern applies —
              the validator accesses both values from the store.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement field-level debounce without debouncing the
              entire store update?
            </p>
            <p className="mt-2 text-sm">
              A: Separate the store update (which should be immediate for responsive UI)
              from the validation trigger (which should be debounced). When setFieldValue
              is called, the store updates the value immediately. Then it schedules a
              debounced validation task for that specific field. If setFieldValue is
              called again for the same field within the debounce window, the previous
              task is cancelled and a new one is scheduled. This way, the UI updates on
              every keystroke, but validation runs only after the user pauses.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle form versioning (schema evolves while users have
              saved drafts)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>version</code> field to the schema and to each saved draft.
              When restoring a draft, compare the draft version with the current schema
              version. If they differ, run a migration function that maps old field names
              to new ones, applies type coercions, and drops deprecated fields. Store
              migrations as a series of version-to-version transforms (v1 to v2, v2 to
              v3) so drafts from any version can be migrated forward. If migration fails,
              prompt the user to start fresh.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support form branching (user clones an existing form as a
              starting point)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>cloneFrom</code> parameter to the FormBuilder that accepts a
              form ID. On initialization, fetch the source form&apos;s saved values, merge
              them with the current schema (same as draft restore but without the user
              prompt), and mark the form as a clone. Update the draft key to use a new ID
              so the clone&apos;s drafts don&apos;t overwrite the original. Preserve
              metadata (original form ID, clone timestamp) for audit purposes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support internationalization (i18n) for form labels,
              errors, and helper text?
            </p>
            <p className="mt-2 text-sm">
              A: Store all user-facing strings as i18n keys in the schema instead of
              literal strings (e.g., <code>label: &quot;form.email.label&quot;</code>).
              The FormField component resolves keys to localized strings using the
              app&apos;s i18n library (e.g., react-i18next). Validation error messages
              follow the same pattern — validators return error keys, not literal strings.
              The schema itself can be locale-specific: fetch <code>/api/schema?lang=en</code>
              for English or <code>/api/schema?lang=de</code> for German, allowing
              entirely different form structures per locale.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add real-time collaborative form editing (multiple users
              editing the same draft simultaneously)?
            </p>
            <p className="mt-2 text-sm">
              A: Replace localStorage with a WebSocket connection to a collaboration
              server. Each field change broadcasts an operational transform (OT) or
              CRDT update to the server, which propagates to other connected clients.
              Resolve conflicts using last-write-wins for simple fields or CRDT merging
              for complex types. Show other users&apos; cursors and in-progress edits via
              presence indicators. Use Yjs or Automerge as the CRDT library. The Zustand
              store integrates with the CRDT via a middleware that applies remote updates
              as local store actions.
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
              React Hook Form — Performant Form Library for React
            </a>
          </li>
          <li>
            <a
              href="https://rjsf-team.github.io/react-jsonschema-form/docs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React JSON Schema Form — Schema-Driven Form Generation
            </a>
          </li>
          <li>
            <a
              href="https://zustand.docs.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Library Documentation
            </a>
          </li>
          <li>
            <a
              href="https://json-schema.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              JSON Schema Specification — Form Definition Format
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/tutorials/forms/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Form Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://formio.github.io/formio.js/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Formio — Open Source Form Builder Platform
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
