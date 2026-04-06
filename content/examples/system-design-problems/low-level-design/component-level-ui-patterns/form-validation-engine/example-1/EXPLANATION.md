# Form Validation Engine — Implementation Walkthrough

## Architecture Overview

The Form Validation Engine is a reusable, framework-agnostic validation system designed for large-scale React applications. It separates validation logic from UI rendering, supports synchronous and asynchronous validation rules, handles cross-field dependencies, and provides internationalized error messages.

### Key Design Decisions

1. **Engine is stateless**: The core `ValidationEngine` class receives values and config, returns results. State lives in React hooks. This makes the engine testable in isolation and framework-agnostic.

2. **Short-circuit sync validation**: Rule chains stop executing on the first error, avoiding unnecessary computation.

3. **Debounce + AbortController for async**: Prevents network floods during rapid typing and discards stale responses that could corrupt validation state.

4. **Dependency graph for cross-field validation**: Tracks which fields depend on which others, enabling automatic cascade revalidation when a source field changes.

5. **i18n via template interpolation**: Error messages use placeholder syntax (`{min}`, `{max}`) resolved against a locale dictionary at runtime.

---

## File-by-File Breakdown

### 1. `lib/validation-types.ts` — Type Definitions

Defines all TypeScript interfaces used throughout the engine:

- **`ValidationRule`**: Union of rule discriminators (`required`, `minLength`, `pattern`, `email`, `custom`, etc.) with rule-specific parameters.
- **`ValidationError`**: Carries an error code, message key for i18n lookup, and optional interpolation params.
- **`ValidationResult`**: Aggregates per-field errors, a valid flag, and total error count.
- **`ValidationConfig`**: Caller-facing configuration for fields, mode, debounce, cross-field rules, and i18n.
- **Hook return types**: `UseFieldValidationReturn`, `UseFormValidationReturn`, `UseAsyncValidationReturn` define the contract for each hook.

### 2. `lib/sync-validators.ts` — Built-in Sync Validators

Each validator is a pure function with signature `(value, params?) => ValidationError | null`:

| Validator | Purpose |
|---|---|
| `required` | Checks for undefined, null, empty string, or empty array |
| `minLength` | String must be at least N characters |
| `maxLength` | String must be no more than N characters |
| `pattern` | Value must match a regex pattern |
| `email` | Valid email format (RFC 5322 simplified) |
| `phone` | E.164 phone format |
| `url` | Valid URL format |
| `min` / `max` | Numeric range validation |
| `matches` | Value must equal another field's value |
| `custom` | User-provided validator function |

The `validateSync` function iterates through a field's rule chain, looks up each validator in the registry, executes it with extracted params, and short-circuits on the first error.

### 3. `lib/async-validator.ts` — Async Validation with Debounce

Key components:

- **`LRUCache`**: Deduplicates repeated values. Before making a network call, checks the cache. Evicts least recently used entries when max size is reached.

- **`createAsyncValidator`**: Factory that returns an `AsyncValidatorInstance` with `validate`, `cancel`, and `clearCache` methods. Each `validate` call:
  1. Checks the cache
  2. Cancels any in-flight request via `AbortController.abort()`
  3. Starts a debounce timer
  4. After debounce, creates a new `AbortController` and calls the check function
  5. On resolution, stores result in cache and calls the result callback (only if not aborted)

- **`debounceAsync`**: Standalone debounce utility for async functions, returning a `{ debounced, cancel }` pair.

### 4. `lib/cross-field-validator.ts` — Cross-Field Dependencies

- **`DependencyGraph`**: Directed map from source field to dependent fields. Supports:
  - `addDependency(source, target)`: Register a dependency
  - `getDependents(source)`: Get direct dependents
  - `getAllDependents(source)`: Get all transitively dependent fields with cycle detection (visited Set prevents infinite loops)

- **Built-in cross-field rules**:
  - `passwordMatch`: Two fields must have equal values
  - `dateRange`: End date must be after start date
  - `conditionalRequired`: Field B required when field A equals a specific value

- **`CrossFieldValidator`**: Wraps the dependency graph and rule execution. `validateAll` runs all cross-field rules and returns per-field error arrays. `getDependentFields` returns the cascade list for a changed field.

### 5. `lib/validation-engine.ts` — Core Engine

The central orchestrator:

- **Constructor**: Accepts `ValidationConfig`, builds field-to-rules maps, creates async validator instances, and initializes the cross-field validator.

- **`validateFieldSync(fieldName, value, allValues)`**: Runs sync rule chain for a single field. Caches results by `fieldName:value` to avoid recomputation.

- **`validateFieldAsync(fieldName, value, onResult)`**: Triggers the async validator for a field. Non-blocking; result is delivered via callback.

- **`validateAll(values)`**: Full-form validation. Runs sync rules for all fields, then cross-field rules. Aggregates errors, interpolates messages, and returns a `ValidationResult`.

- **`interpolateMessage(messageKey, params, dictionary)`**: Resolves message keys against the i18n dictionary and substitutes `{placeholder}` params.

- **`cleanup()`**: Cancels all async validators and clears caches. Call on component unmount.

### 6. `lib/error-formatter.ts` — Error Display Utilities

- **`formatValidationResult(result, dictionary)`**: Converts `ValidationResult` into display-ready `FormattedValidationResult` with interpolated messages, anchor IDs, and error count summary.

- **`formatErrorCount(count, dictionary)`**: Returns localized string like "3 errors found" with proper pluralization.

- **`groupErrorsByField(result, dictionary)`**: Returns `Record<fieldName, string[]>` for inline error display.

- **`getFirstErrorForField(fieldName, result, dictionary)`**: Returns the first error message for a field (for single-error display).

### 7. `hooks/use-field-validation.ts` — Per-Field Hook

Manages per-field state:

- `value`, `touched`, `errors`, `asyncLoading` state
- `onChange`: Updates value, marks touched, triggers sync validation if mode is `change`
- `onBlur`: Marks touched, triggers sync validation if mode is `blur` or `change`
- `setError`: Sets or clears an async error (called by the async validation callback)

### 8. `hooks/use-form-validation.ts` — Form-Level Hook

Manages form-level state:

- `values`, `touched`, `errors`, `isValid`, `errorCount` state
- `setValue`: Updates a field value, triggers sync validation, and cascade revalidation for dependent fields (batched via `queueMicrotask`)
- `handleSubmit`: Validates all fields, blocks submission if invalid, marks all fields as touched
- `reset`: Clears all state to initial values
- Cleanup: Calls `engine.cleanup()` on unmount

### 9. `hooks/use-async-validation.ts` — Async Validation Hook

Wraps the async validator factory:

- `isAsyncValidating`: Loading state for the async check
- `asyncError`: Current async validation error (or null if valid)
- `validateAsync(value)`: Triggers debounced async validation
- `cancelAsync()`: Cancels in-flight async validation
- Cleanup: Cancels async validator and sets `isMountedRef` to false on unmount

### 10. `components/validation-error.tsx` — Inline Error

- Renders an error message with an error icon (SVG exclamation mark)
- Uses `role="alert"` and `aria-live="polite"` for screen reader announcements
- Generates a unique `id` for `aria-describedby` linking from the input field
- `ValidationErrorList` renders multiple errors for a single field

### 11. `components/validation-summary.tsx` — Error Summary

- Renders at the top of the form when errors exist
- Uses `role="alert"` and `aria-live="assertive"` for immediate screen reader announcement
- Each error is a button that scrolls to and focuses the corresponding field
- Styled with red border and background for visual prominence

### 12. `components/validation-provider.tsx` — Context Provider

- Provides form-level validation state to all descendants via React Context
- `useValidationContext`: Returns the full context value
- `useFieldContext(fieldName)`: Selector hook that returns only a specific field's state, preventing unnecessary re-renders for unrelated field changes

---

## Usage Example

```typescript
// 1. Define validation config
const config: ValidationConfig = {
  fields: [
    {
      name: "email",
      rules: [
        { type: "required" },
        { type: "email" },
      ],
      asyncRules: [
        {
          type: "async",
          check: async (value, signal) => {
            const response = await fetch(`/api/check-email?email=${value}`, { signal });
            const data = await response.json();
            return data.available ? null : { code: "emailTaken", messageKey: "validation.emailTaken" };
          },
          debounceMs: 400,
        },
      ],
    },
    {
      name: "password",
      rules: [
        { type: "required" },
        { type: "minLength", min: 8 },
      ],
    },
    {
      name: "confirmPassword",
      rules: [
        { type: "required" },
      ],
    },
  ],
  crossFieldRules: [
    {
      type: "passwordMatch",
      sourceField: "password",
      targetField: "confirmPassword",
    },
  ],
  mode: "onBlur",
  locale: "en",
  i18n: {
    en: {
      "validation.emailTaken": "This email is already registered.",
    },
  },
};

// 2. Use in a component
function RegistrationForm() {
  const { values, errors, isValid, setValue, handleSubmit } = useFormValidation(config);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit((vals) => console.log("Submitted:", vals));
    }}>
      <ValidationProvider values={values} errors={errors} touched={new Set()} isValid={isValid} errorCount={Object.values(errors).flat().length} setValue={setValue}>
        <ValidationSummary errors={formatValidationResult({ valid: isValid, fieldErrors: errors, errorCount: Object.values(errors).flat().length }).errors} />
        {/* ... fields ... */}
      </ValidationProvider>
    </form>
  );
}
```

---

## Testing Notes

- **Sync validators**: Test each validator with valid/invalid inputs and boundary values. Test short-circuit by providing a rule chain where the first rule fails — verify subsequent rules are not executed.

- **Async validator**: Mock `setTimeout` and `AbortController`. Test that debounce delays the check, that changing the value mid-flight aborts the previous request, and that cached results are returned without network calls.

- **Cross-field validator**: Test dependency graph registration, cascade revalidation, and cycle detection. Test built-in rules with valid and invalid value combinations.

- **Integration**: Render a form with the hooks, simulate user interactions, and assert on inline error display, summary content, and submit gating.
