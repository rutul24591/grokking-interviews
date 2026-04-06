# Form Builder — Architecture Walkthrough

## Overview

The Form Builder is a schema-driven form rendering system that generates complete, production-ready forms from JSON definitions. It supports dynamic field types, conditional visibility, sync + async validation, multi-step flows, draft persistence, and full accessibility.

## Architecture

The system is organized into three independent layers:

```
┌─────────────────────────────────────────┐
│           Schema Definition              │
│     (JSON: fields, rules, conditions)    │
├─────────────────────────────────────────┤
│           State Management               │
│     (Zustand store: values, state)       │
├─────────────────────────────────────────┤
│           Rendering Layer                │
│     (Components: FormBuilder, Fields)    │
└─────────────────────────────────────────┘
```

### Layer 1: Schema Definition

The schema is a pure JSON structure defining the form's structure. It consists of:

- **FieldDefinitions**: Each field has a `name`, `label`, `type`, `defaultValue`, `validators`, `visibility` rules, and optional metadata.
- **Steps**: For multi-step forms, each step has an `id`, `title`, and `fieldNames` array listing which fields belong to it.
- **ValidationRules**: Sync validators (required, minLength, maxLength, pattern, min, max, email) and async validators (custom functions returning `Promise<string | null>`).
- **ConditionRules**: Simple rules (field operator value) and compound rules (AND/OR/NOT compositions) for conditional visibility.

### Layer 2: State Management (Zustand Store)

The Zustand store is the single source of truth. It maintains:

- **fields**: A flat map of `fieldName → FieldState` where each `FieldState` tracks `value`, `initialValue`, `touched`, `dirty`, `error`, and `validating`.
- **definitions**: A lookup map of `fieldName → FieldDefinition` for quick schema access.
- **currentStep**: The active step index (0-based).
- **stepValidity**: A map of `stepId → boolean` tracking which steps have been validated.
- **errors**: An aggregated error map for quick lookup.
- **submissionState**: Tracks the form's submission lifecycle (`idle`, `submitting`, `submitted`, `error`).
- **pendingAsyncValidations**: A Set of field names with active async validations.

#### Key Store Actions

| Action | Description |
|--------|-------------|
| `initialize` | Batch-registers all fields from schema, merges drafts, runs initial validation |
| `setFieldValue` | Updates value, marks dirty, clears error |
| `setFieldError` | Sets/clears validation error, recomputes form validity |
| `setFieldTouched` | Marks field as visited (triggers error display) |
| `setFieldValidating` | Sets/clears async validation in-progress flag |
| `nextStep` | Validates current step fields, advances if valid |
| `previousStep` | Navigates back without validation |
| `goToStep` | Direct navigation (validates preceding steps) |
| `submitForm` | Full validation → async wait → invoke callback |
| `saveDraft` | Serialize values (exclude files) → localStorage |
| `restoreDraft` | Load from localStorage → merge with schema defaults |

### Layer 3: Rendering

#### Component Hierarchy

```
FormBuilder (root)
├── FormStepper (multi-step indicator)
├── FormStep (step wrapper + navigation)
│   └── FormField[] (dynamic field renderers)
│       ├── TextInput (text, email, number, date)
│       ├── SelectInput (dropdown)
│       ├── CheckboxInput (boolean)
│       ├── RadioInput (radio group)
│       └── FileInput (file upload)
└── FieldConditions (visibility wrapper)
```

#### FormBuilder

The root component. On mount, it calls `store.initialize()` with the schema. It renders the stepper (if multi-step), the current step's fields, navigation buttons, and wraps everything in a `<form>` element with a submit handler.

#### FormField

A dynamic renderer that maps a `FieldDefinition.type` to the correct input component. Uses the `useField` hook for state management. Renders the label, input, error message (with `role="alert"`), and helper text.

#### FormStep

Contains the Next/Previous/Submit buttons. The Next button triggers `store.nextStep()` which validates all fields in the current step. If validation fails, it scrolls to the first error and focuses the invalid field.

#### FormStepper

Renders a horizontal step indicator with three states: completed (checkmark, green), current (highlighted circle, accent color), and upcoming (dimmed, gray). Includes an `aria-live="polite"` region for screen reader announcements.

#### FieldConditions

A conditional visibility wrapper that evaluates boolean expression trees against current form values. Subscribes to only the fields referenced in its rules (dependency extraction), minimizing re-renders. When visibility changes from true to false, optionally clears the field value (configurable via `clearOnHide`).

## Data Flow

### Field Change Lifecycle

1. User types into an input → `onChange` fires
2. `onChange` calls `store.setFieldValue(name, value)`
3. Store updates the value, marks field as `dirty`, clears the error
4. Zustand notifies subscribers — only the changed FormField re-renders
5. Debounced validation timer starts (300ms)
6. On blur, `onBlur` calls `store.setFieldTouched(name)` and runs sync validators
7. If sync validators pass, async validators run (debounced)
8. During async validation, `validating` is set to `true` (shows spinner)
9. On completion, `error` is set (or cleared) and `validating` is set to `false`
10. The debounced draft subscription fires (500ms), serializes values to localStorage

### Step Navigation Flow

1. User clicks "Next"
2. `FormStep` calls `store.nextStep()`
3. Store runs sync validation on all fields in the current step
4. If any field fails, errors are set, navigation is blocked, focus moves to first error
5. If all pass, `currentStep` is incremented and `stepValidity[stepId]` is set to `true`
6. The FormStepper updates to show the new current step
7. The screen reader announces the new step via `aria-live` region

### Submission Flow

1. User clicks "Submit"
2. Store runs sync validation on ALL fields across ALL steps
3. Store checks for pending async validations — if any exist, submission is blocked
4. If all pass, `submissionState` is set to `"submitting"`
5. The `onSubmit` callback is invoked with the complete values payload
6. On success, `submissionState` becomes `"submitted"` and the draft is cleared
7. On failure, `submissionState` becomes `"error"` with an error message

## Design Decisions

### Why Zustand over React Hook Form / Formik?

- **Schema-driven rendering**: React Hook Form and Formik assume you know your fields at compile time. Our form builder renders entirely from a runtime JSON schema.
- **Fine-grained subscriptions**: Zustand selectors ensure only the changed field re-renders. React Hook Form uses uncontrolled inputs (good for performance but makes validation trickier). Formik uses controlled inputs with Context API (causes full-form re-renders).
- **Custom state model**: We track `touched`, `dirty`, `validating` per field — React Hook Form doesn't have a native `dirty` flag per field, and Formik's `dirty` is form-level only.

### Why controlled inputs instead of uncontrolled?

Controlled inputs provide predictable state management and make validation straightforward. The performance concern (re-render on every keystroke) is mitigated by Zustand's selector subscriptions — only the changed field re-renders. For extremely large forms (200+ fields), uncontrolled inputs with ref-based validation would be a better choice.

### Why separate sync and async validation?

Sync validation is fast (sub-millisecond) and should run immediately on blur. Async validation involves network requests and should be debounced. By separating them, we can:
- Show sync errors immediately
- Debounce async validators to avoid API spam
- Gate step navigation on sync validation only (async can continue in the background)
- Block submission on pending async validations

### Why exclude File objects from drafts?

File objects are not JSON-serializable. `JSON.stringify(new File(...))` produces `"{}"`. Attempting to store them in localStorage would lose the data. The correct approach is to skip file fields during draft serialization, warn the user on restore that files must be re-uploaded, and for a production system, upload files to a server immediately and store only the file URL in the draft.

## Performance Considerations

| Concern | Mitigation |
|---------|-----------|
| Full form re-render on field change | Zustand selectors — each FormField subscribes to its own field state |
| Rapid async validator firing | Debounce (300ms) + AbortController to cancel stale requests |
| Conditional rule evaluation on every change | Dependency graph — only evaluate rules referencing the changed field |
| localStorage write blocking main thread | Debounce at 500ms + filter out File objects |
| Large form DOM node count | Virtual scrolling (react-window) for 100+ fields per step |

## Accessibility

- Every input has a `<label>` with `htmlFor` matching the input's `id`
- Radio groups use `<fieldset>` with `<legend>`
- Error messages have `role="alert"` and `aria-live="assertive"`
- Inputs have `aria-describedby` pointing to their error message element
- The FormStepper has an `aria-live="polite"` region announcing step changes
- Required fields have `aria-required="true"`
- Current step has `aria-current="step"`
- Non-navigable steps have `aria-disabled="true"`
- Full keyboard navigation (Tab through fields, Enter to submit)
