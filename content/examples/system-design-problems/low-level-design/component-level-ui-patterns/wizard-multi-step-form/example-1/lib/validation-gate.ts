/**
 * Wizard / Multi-step Form — Validation Gate Engine
 *
 * Per-step validation engine supporting synchronous validators (required,
 * minLength, maxLength, pattern, min, max, email, phone) and asynchronous
 * validators (API uniqueness checks). Validators are composable and run in
 * sequence, short-circuiting on the first failure.
 */

import type {
  FieldDefinition,
  FieldValue,
  FieldValidator,
  StepValidationResult,
  SyncValidator,
  AsyncValidator,
} from "./wizard-types";

// ---------------------------------------------------------------------------
// Built-in sync validator factories
// ---------------------------------------------------------------------------

export const validators = {
  required: (message = "This field is required"): SyncValidator => {
    return (value: FieldValue): string | undefined => {
      if (value === null || value === undefined || value === "") {
        return message;
      }
      if (Array.isArray(value) && value.length === 0) {
        return message;
      }
      return undefined;
    };
  },

  minLength: (min: number, message?: string): SyncValidator => {
    return (value: FieldValue): string | undefined => {
      if (typeof value === "string" && value.length < min) {
        return message ?? `Minimum ${min} characters required.`;
      }
      return undefined;
    };
  },

  maxLength: (max: number, message?: string): SyncValidator => {
    return (value: FieldValue): string | undefined => {
      if (typeof value === "string" && value.length > max) {
        return message ?? `Maximum ${max} characters allowed.`;
      }
      return undefined;
    };
  },

  pattern: (regex: RegExp, message: string): SyncValidator => {
    return (value: FieldValue): string | undefined => {
      if (typeof value === "string" && !regex.test(value)) {
        return message;
      }
      return undefined;
    };
  },

  min: (min: number, message?: string): SyncValidator => {
    return (value: FieldValue): string | undefined => {
      if (typeof value === "number" && value < min) {
        return message ?? `Value must be at least ${min}.`;
      }
      return undefined;
    };
  },

  max: (max: number, message?: string): SyncValidator => {
    return (value: FieldValue): string | undefined => {
      if (typeof value === "number" && value > max) {
        return message ?? `Value must be at most ${max}.`;
      }
      return undefined;
    };
  },

  email: (message = "Please enter a valid email address."): SyncValidator => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (value: FieldValue): string | undefined => {
      if (typeof value === "string" && value.length > 0 && !emailRegex.test(value)) {
        return message;
      }
      return undefined;
    };
  },

  phone: (message = "Please enter a valid phone number."): SyncValidator => {
    const phoneRegex = /^\+?[\d\s\-()]{7,15}$/;
    return (value: FieldValue): string | undefined => {
      if (typeof value === "string" && value.length > 0 && !phoneRegex.test(value)) {
        return message;
      }
      return undefined;
    };
  },
};

// ---------------------------------------------------------------------------
// Validation engine
// ---------------------------------------------------------------------------

/**
 * Run all sync validators for a single field. Returns the first error message
 * or undefined if all validators pass.
 */
export function runSyncValidators(
  value: FieldValue,
  fieldValidators: FieldValidator[],
): string | undefined {
  for (const validator of fieldValidators) {
    if (validator.async) continue; // Skip async validators in sync pass
    const error = (validator.validate as SyncValidator)(value);
    if (error) {
      return validator.message ?? error;
    }
  }
  return undefined;
}

/**
 * Run all async validators for a single field. Returns a Promise that resolves
 * to the first error message or undefined.
 */
export async function runAsyncValidators(
  value: FieldValue,
  allValues: Record<string, FieldValue>,
  fieldValidators: FieldValidator[],
): Promise<string | undefined> {
  const asyncValidators = fieldValidators.filter((v) => v.async);
  if (asyncValidators.length === 0) return undefined;

  const results = await Promise.all(
    asyncValidators.map(async (validator) => {
      const error = await (validator.validate as AsyncValidator)(value, allValues);
      return error ? validator.message ?? error : undefined;
    }),
  );

  // Return the first error found
  return results.find((r) => r !== undefined);
}

/**
 * Validate all fields on a step (sync pass). Returns a StepValidationResult.
 */
export function validateStepSync(
  fields: FieldDefinition[],
  fieldValues: Record<string, FieldValue>,
): StepValidationResult {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = fieldValues[field.name];
    const fieldValidators: FieldValidator[] = [];

    // Auto-add required validator if field is marked required
    if (field.required) {
      fieldValidators.push({ validate: validators.required(), async: false });
    }

    // Add field-level minLength/maxLength validators from definition
    if (field.minLength !== undefined) {
      fieldValidators.push({
        validate: validators.minLength(field.minLength),
        async: false,
      });
    }
    if (field.maxLength !== undefined) {
      fieldValidators.push({
        validate: validators.maxLength(field.maxLength),
        async: false,
      });
    }

    // Add pattern validator from definition
    if (field.pattern !== undefined) {
      fieldValidators.push({
        validate: validators.pattern(new RegExp(field.pattern), "Invalid format."),
        async: false,
      });
    }

    // Add min/max validators for number fields
    if (field.type === "number") {
      if (field.min !== undefined && typeof field.min === "number") {
        fieldValidators.push({
          validate: validators.min(field.min),
          async: false,
        });
      }
      if (field.max !== undefined && typeof field.max === "number") {
        fieldValidators.push({
        validate: validators.max(field.max),
          async: false,
        });
      }
    }

    // Add email/phone validators based on type
    if (field.type === "email") {
      fieldValidators.push({ validate: validators.email(), async: false });
    }
    if (field.type === "phone") {
      fieldValidators.push({ validate: validators.phone(), async: false });
    }

    // Merge with explicitly defined validators
    const allValidators = [...fieldValidators, ...(field.validators ?? [])];

    const error = runSyncValidators(value, allValidators);
    if (error) {
      errors[field.name] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    asyncStatus: "idle",
  };
}

/**
 * Validate all fields on a step including async validators.
 * Returns a Promise resolving to StepValidationResult.
 */
export async function validateStepAsync(
  fields: FieldDefinition[],
  fieldValues: Record<string, FieldValue>,
  syncResult: StepValidationResult,
): Promise<StepValidationResult> {
  // If sync validation already failed, skip async
  if (!syncResult.isValid) {
    return { ...syncResult, asyncStatus: "done" };
  }

  const errors: Record<string, string> = { ...syncResult.errors };

  for (const field of fields) {
    const value = fieldValues[field.name];
    const allValidators = [...(field.validators ?? [])];
    const asyncValidators = allValidators.filter((v) => v.async);

    if (asyncValidators.length === 0) continue;

    const error = await runAsyncValidators(value, fieldValues, asyncValidators);
    if (error) {
      errors[field.name] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    asyncStatus: "done",
  };
}

/**
 * Debounce wrapper for real-time field validation during typing.
 */
export function createDebouncedValidator<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delayMs);
  };
}
