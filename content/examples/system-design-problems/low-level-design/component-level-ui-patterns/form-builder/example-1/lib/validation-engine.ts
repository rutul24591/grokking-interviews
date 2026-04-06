// Sync + async validation pipeline.
// Executes validation rules against field values and returns error messages.

import type {
  SyncValidationRule,
  AsyncValidationRule,
  ValidationRule,
  FieldDefinition,
} from "../lib/form-types";

/** Default error messages for built-in sync validators. */
const DEFAULT_MESSAGES: Record<string, string> = {
  required: "This field is required",
  minLength: ({ value }: { value: number }) =>
    `Minimum length is ${value} characters`,
  maxLength: ({ value }: { value: number }) =>
    `Maximum length is ${value} characters`,
  pattern: "Invalid format",
  min: ({ value }: { value: number }) => `Minimum value is ${value}`,
  max: ({ value }: { value: number }) => `Maximum value is ${value}`,
  email: "Please enter a valid email address",
};

/** Resolve the error message from a rule, falling back to defaults. */
function resolveMessage(
  rule: SyncValidationRule,
  defaultMessageKey: string
): string {
  if (rule.message) return rule.message;
  const defaultMsg = DEFAULT_MESSAGES[defaultMessageKey];
  return typeof defaultMsg === "function"
    ? defaultMsg({ value: rule.value })
    : defaultMsg;
}

/** Email regex for sync validation — covers 99% of real-world cases. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Execute a single sync validation rule against a value.
 * Returns an error string if validation fails, null if it passes.
 */
export function runSyncValidator(
  value: unknown,
  rule: SyncValidationRule
): string | null {
  switch (rule.type) {
    case "required": {
      if (value === undefined || value === null || value === "") {
        return resolveMessage(rule, "required");
      }
      if (Array.isArray(value) && value.length === 0) {
        return resolveMessage(rule, "required");
      }
      return null;
    }

    case "minLength": {
      if (typeof value !== "string") return null;
      const min = typeof rule.value === "number" ? rule.value : 0;
      if (value.length < min) {
        return resolveMessage(rule, "minLength");
      }
      return null;
    }

    case "maxLength": {
      if (typeof value !== "string") return null;
      const max = typeof rule.value === "number" ? rule.value : Infinity;
      if (value.length > max) {
        return resolveMessage(rule, "maxLength");
      }
      return null;
    }

    case "pattern": {
      if (typeof value !== "string") return null;
      const regex = rule.value instanceof RegExp ? rule.value : new RegExp(rule.value as string);
      if (!regex.test(value)) {
        return resolveMessage(rule, "pattern");
      }
      return null;
    }

    case "min": {
      if (typeof value !== "number") return null;
      const min = typeof rule.value === "number" ? rule.value : -Infinity;
      if (value < min) {
        return resolveMessage(rule, "min");
      }
      return null;
    }

    case "max": {
      if (typeof value !== "number") return null;
      const max = typeof rule.value === "number" ? rule.value : Infinity;
      if (value > max) {
        return resolveMessage(rule, "max");
      }
      return null;
    }

    case "email": {
      if (typeof value !== "string") return null;
      if (value === "") return null; // let 'required' handle empty
      if (!EMAIL_REGEX.test(value)) {
        return resolveMessage(rule, "email");
      }
      return null;
    }

    default:
      return null;
  }
}

/**
 * Run all sync validators for a field in sequence.
 * First failing validator short-circuits and returns its error.
 * Returns null if all validators pass.
 */
export function runSyncValidators(
  value: unknown,
  validators: SyncValidationRule[]
): string | null {
  for (const validator of validators) {
    const error = runSyncValidator(value, validator);
    if (error) return error;
  }
  return null;
}

/**
 * Run all async validators for a field in parallel.
 * Returns the first error from any failing validator.
 * Returns null if all pass.
 */
export async function runAsyncValidators(
  value: unknown,
  formValues: Record<string, unknown>,
  validators: AsyncValidationRule[]
): Promise<string | null> {
  const results = await Promise.all(
    validators.map(async (validator) => {
      try {
        return await validator.validator(value, formValues);
      } catch {
        return validator.message ?? "Validation failed";
      }
    })
  );

  // Return the first non-null error
  for (const error of results) {
    if (error) return error;
  }
  return null;
}

/**
 * Separate sync and async validators from a mixed rules array.
 */
export function splitValidators(rules: ValidationRule[]): {
  sync: SyncValidationRule[];
  async: AsyncValidationRule[];
} {
  const sync: SyncValidationRule[] = [];
  const async: AsyncValidationRule[] = [];

  for (const rule of rules) {
    if (rule.type === "async") {
      async.push(rule);
    } else {
      sync.push(rule);
    }
  }

  return { sync, async };
}

/**
 * Validate a single field against its definition's rules.
 * Runs sync validators first (short-circuit on first failure),
 * then async validators in parallel.
 */
export async function validateField(
  fieldName: string,
  value: unknown,
  definition: FieldDefinition,
  formValues: Record<string, unknown>
): Promise<string | null> {
  const validators = definition.validators ?? [];
  const { sync, async: asyncValidators } = splitValidators(validators);

  // Add implicit required validator if field is marked required
  const effectiveSync = definition.required
    ? [{ type: "required" as const }, ...sync]
    : sync;

  // Run sync validators first — short-circuit on first failure
  const syncError = runSyncValidators(value, effectiveSync);
  if (syncError) return syncError;

  // Run async validators in parallel
  if (asyncValidators.length === 0) return null;

  return runAsyncValidators(value, formValues, asyncValidators);
}

/**
 * Validate all fields in a given set and return an error map.
 * Only runs sync validators (for step-gate validation).
 */
export function validateFieldsSync(
  fieldNames: string[],
  values: Record<string, unknown>,
  definitions: Record<string, FieldDefinition>
): Record<string, string | null> {
  const errors: Record<string, string | null> = {};

  for (const name of fieldNames) {
    const definition = definitions[name];
    if (!definition) continue;

    const validators = definition.validators ?? [];
    const { sync } = splitValidators(validators);

    const effectiveSync = definition.required
      ? [{ type: "required" as const }, ...sync]
      : sync;

    errors[name] = runSyncValidators(values[name], effectiveSync);
  }

  return errors;
}

/** Active async validation trackers keyed by field name. */
const activeAsyncValidations = new Map<string, AbortController>();

/**
 * Run async validation for a field with AbortController support.
 * If a previous async validation is still running for this field,
 * it is aborted before starting a new one.
 */
export async function validateFieldAsync(
  fieldName: string,
  value: unknown,
  definition: FieldDefinition,
  formValues: Record<string, unknown>
): Promise<string | null> {
  const asyncValidators = (definition.validators ?? []).filter(
    (v): v is AsyncValidationRule => v.type === "async"
  );

  if (asyncValidators.length === 0) return null;

  // Abort any previous pending validation for this field
  const previousController = activeAsyncValidations.get(fieldName);
  if (previousController) {
    previousController.abort();
  }

  const controller = new AbortController();
  activeAsyncValidations.set(fieldName, controller);

  try {
    const results = await Promise.all(
      asyncValidators.map(async (validator) => {
        if (controller.signal.aborted) return null;
        try {
          return await validator.validator(value, formValues);
        } catch {
          if (controller.signal.aborted) return null;
          return validator.message ?? "Validation failed";
        }
      })
    );

    if (controller.signal.aborted) return null;

    for (const error of results) {
      if (error) return error;
    }
    return null;
  } finally {
    activeAsyncValidations.delete(fieldName);
  }
}

/** Check if a field has a pending async validation. */
export function hasPendingAsyncValidation(fieldName: string): boolean {
  return activeAsyncValidations.has(fieldName);
}

/** Abort all pending async validations (e.g., on form unmount). */
export function abortAllAsyncValidations(): void {
  for (const [, controller] of activeAsyncValidations) {
    controller.abort();
  }
  activeAsyncValidations.clear();
}
