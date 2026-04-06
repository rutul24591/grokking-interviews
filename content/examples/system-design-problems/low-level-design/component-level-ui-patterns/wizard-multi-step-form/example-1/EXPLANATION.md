# Wizard / Multi-step Form — Implementation Walkthrough

## Architecture Overview

This implementation follows a **store + hooks + components** pattern:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Wizard Config │────▶│  Zustand Store   │────▶│    Wizard       │
│   (steps+opts)  │     │  (state+drafts)  │     │  (root compon.) │
└─────────────────┘     └────────┬─────────┘     └────────┬────────┘
                                 │                        │
                    ┌────────────┼────────────┐           │
                    │            │            │           │
            ┌───────▼────┐ ┌───▼────┐  ┌────▼─────┐     │
            │Validation  │ │Step    │  │useWizard │◀────┘
            │Gate        │ │Router  │  │hook      │
            └────────────┘ └────────┘  └──────────┘
                                            │
                    ┌───────────────────────┼───────────────┐
                    │                       │               │
              ┌─────▼──────┐    ┌──────────▼───┐  ┌───────▼────────┐
              │WizardStepper │  │ WizardStep   │  │WizardSummary   │
              └─────────────┘   └──────┬───────┘  └────────────────┘
                                       │
                              ┌────────▼────────┐
                              │WizardField      │
                              │Renderer         │
                              └─────────────────┘
```

### Design Decisions

1. **Zustand for state management** — Selector-based subscriptions prevent unnecessary re-renders. Each step component only subscribes to its own field values.

2. **Declarative step definitions** — Steps are defined as typed objects with fields, validators, and optional skip predicates. This makes steps easy to generate from CMS content, feature flags, or API responses.

3. **Validation gate per step** — Each step validates independently before allowing advancement. Sync validators run in sequence (short-circuit on first failure), async validators run in parallel after sync passes.

4. **Draft persistence with versioned schema** — `localStorage` drafts use a versioned key (`wizard:v1:{draftKey}`) for forward-compatible migrations. Corrupted data is handled gracefully with try-catch around `JSON.parse`.

5. **Conditional step routing** — `skipStep` predicates are evaluated against all field values to compute an effective step path. The path is recomputed whenever field values change on steps that affect downstream predicates.

## File Structure

```
example-1/
├── lib/
│   ├── wizard-types.ts          # TypeScript interfaces, constants
│   ├── wizard-store.ts          # Zustand store: state, navigation, draft persistence
│   ├── validation-gate.ts       # Sync + async validation engine
│   └── step-router.ts           # Conditional step logic, navigation history
├── hooks/
│   ├── use-wizard.ts            # Main orchestrator hook
│   ├── use-step-validation.ts   # Per-field validation with debounce
│   └── use-step-history.ts      # Navigation history for back button
├── components/
│   ├── wizard.tsx               # Root wizard with stepper, step renderer, draft restore
│   ├── wizard-stepper.tsx       # Progress indicator with completed/current/upcoming/locked
│   ├── wizard-step.tsx          # Step container with fields, errors, Next/Prev buttons
│   ├── wizard-summary.tsx       # Review screen showing all data grouped by step
│   └── wizard-field-renderer.tsx # Dynamic field rendering (text, select, radio, etc.)
└── EXPLANATION.md               # This file
```

## Key Implementation Details

### Zustand Store (lib/wizard-store.ts)

The store is the single source of truth. Key aspects:

- **Field values as nested map**: `Record<stepId, Record<fieldName, value>>` ensures each step's data is isolated.
- **Versioned draft keys**: `wizard:v1:{draftKey}` enables schema migration. Old drafts with incompatible schemas are discarded.
- **Auto-save interval**: `setInterval` (default 2s) with cleanup on store destroy. Final save on unmount.
- **Corruption handling**: `JSON.parse` wrapped in try-catch. Failed parse returns `null`, store initializes fresh state.
- **Navigation history**: Array-based stack for accurate back-button behavior. Going forward pushes current step ID; going back pops it.

### Validation Gate (lib/validation-gate.ts)

The validation engine supports composable validators:

- **Sync validators**: `required`, `minLength`, `maxLength`, `pattern`, `min`, `max`, `email`, `phone`. Each is a factory function returning a validator.
- **Auto-derived validators**: The engine automatically adds validators based on field definition properties (`required` adds required validator, `minLength` adds minLength, `type === "email"` adds email format check).
- **Async validators**: Run in parallel after sync validation passes. Return `Promise<string | undefined>`.
- **Short-circuit**: Sync validators run in sequence, stopping at the first failure.
- **Debounced validation**: `createDebouncedValidator` wraps any validator function with a delay timer for real-time validation during typing.

### Step Router (lib/step-router.ts)

Conditional step resolution:

- **`computeEffectiveStepPath`**: Iterates all steps, evaluates `skipStep` predicates, returns ordered array of non-skipped step IDs.
- **`canAccessStep`**: In linear mode, only visited steps and the next unvisited step are accessible. In non-linear mode, all steps are accessible.
- **Navigation history**: `pushToHistory`/`popFromHistory` maintain the back-button stack.

### useWizard Hook (hooks/use-wizard.ts)

The main orchestrator:

- **`next()`**: Runs sync validation on the current step. If valid, marks step as visited and advances. Returns `true`/`false` for success/failure.
- **`previous()`**: Goes back without validation.
- **`goToStep(index)`**: Jumps to a specific step (respects linear mode constraints).
- **`setFieldValue(fieldName, value)`**: Updates the field value for the current step.
- **`submit()`**: Aggregates all field values across steps into a flat payload, calls the `onSubmit` callback, clears the draft.
- **Store caching**: Uses a `Map<draftKey, store>` singleton pattern so multiple wizard instances on the same page don't interfere.

### useStepValidation Hook (hooks/use-step-validation.ts)

Per-field validation:

- **Debounced**: Runs validation 300ms after the last field value change (configurable).
- **Touched tracking**: Errors only display after a field has been blurred (`touched`) or a submit attempt has been made.
- **`getFieldError(fieldName)`**: Returns the error message only if the field is touched or submit attempted; otherwise returns `undefined`.

### Root Wizard Component (components/wizard.tsx)

Assembly and lifecycle:

- **SSR-safe**: Uses `useState(false)` + `useEffect` to ensure client-only rendering. Renders a skeleton during SSR.
- **Draft restore prompt**: On mount, checks `hasDraft` from store. If true, shows a "Continue where you left off?" dialog with Continue/Start Fresh options.
- **Submitted state**: Renders a success screen with a checkmark icon after submission.
- **Summary step**: If `config.showSummary` is true, the last step renders `WizardSummary` instead of `WizardStep`.

### Stepper Component (components/wizard-stepper.tsx)

Progress indicator:

- **Visual states**: Completed (green checkmark), Current (blue highlighted circle with number), Upcoming (gray numbered circle), Locked (gray lock icon), Skipped (dimmed with strikethrough).
- **Keyboard navigation**: Arrow Left/Right moves between steps.
- **Accessibility**: `aria-current="step"` on the active step, `aria-label` on each step button with status description.
- **Connector lines**: Horizontal lines between steps, colored green for completed/up-to-current, gray for remaining.

### Summary Component (components/wizard-summary.tsx)

Review screen:

- **Grouped by step**: Each step's data is rendered in a separate card with the step title as heading.
- **Definition lists**: Uses `<dl>`, `<dt>`, `<dd>` for semantic, screen-reader-friendly markup.
- **Value formatting**: Booleans render as "Yes"/"No", numbers with locale formatting, arrays as comma-separated strings, empty values as em-dash.

### Field Renderer (components/wizard-field-renderer.tsx)

Dynamic field rendering:

- **Supported types**: `text`, `email`, `number`, `textarea`, `select`, `radio`, `checkbox`, `date`, `phone`, `file`.
- **Error display**: Red border on invalid fields, error message in red text below the field with `role="alert"`.
- **Accessibility**: `aria-invalid="true"` on invalid fields, `aria-describedby` linking to the error message element, `<label>` or `<legend>` for each field.
- **Forward ref**: Uses `forwardRef` to allow the parent `WizardStep` to focus the first error field when validation fails.

## Data Flow

```
User types in field
    │
    ▼
setFieldValue(fieldName, value)
    │
    ▼
Zustand store updates fieldValues[stepId][fieldName]
    │
    ▼
useStepValidation debounce timer (300ms)
    │
    ▼
validateStepSync(fields, fieldValues) → errors map
    │
    ▼
WizardFieldRenderer receives error prop
    │
    ▼
Renders red border + error message below field
```

### Step Advancement Flow

```
User clicks Next
    │
    ▼
next() called
    │
    ▼
validateStepSync(currentStep.fields, currentStep.fieldValues)
    │
    ├─── Invalid → setStepValidation(stepId, result), return false
    │               Errors displayed inline, focus moves to first error field
    │
    └─── Valid → markVisited(stepId), store.next()
                   History updated, next step renders
                   Draft auto-saved in background
```

## Performance Considerations

| Operation | Time | Space |
|---|---|---|
| Step validation (sync) | O(f × v) | O(f) — errors map |
| Conditional step resolution | O(s) | O(s) — effective path |
| Draft save (JSON stringify) | O(n) | O(n) — serialized data |
| History push/pop | O(1) | O(h) — history length |

Where `f` = fields per step, `v` = validators per field, `s` = total steps, `n` = total field values, `h` = history depth.

### Optimizations

1. **Selector-based subscriptions**: Each `WizardStep` subscribes only to its own `fieldValues[stepId]`. Changing a value on step 3 does not re-render steps 1, 2, 4, or 5.

2. **Debounced validation**: 300ms debounce prevents validators from running on every keystroke, critical for async validators (API calls).

3. **Lazy draft persistence**: Draft saves are throttled to the auto-save interval (default 2s), not on every field change.

## Accessibility

- **Keyboard**: Tab through fields, Enter to submit step, Arrow keys on stepper, Escape to cancel.
- **Screen readers**: `aria-current="step"` on active step, `aria-live="polite"` for step changes, `aria-live="assertive"` for validation errors, `aria-describedby` linking fields to error messages.
- **Focus management**: Focus moves to step heading on step change, to first error field on validation failure.
