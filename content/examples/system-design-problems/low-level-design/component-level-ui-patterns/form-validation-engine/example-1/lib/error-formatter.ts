import type {
  ValidationError,
  FieldErrors,
  ValidationResult,
} from "./validation-types";
import { interpolateMessage } from "./validation-engine";

// ─── Error Formatter ─────────────────────────────────────────────────

export interface FormattedError {
  fieldName: string;
  message: string;
  anchorId: string;
  code: string;
}

export interface FormattedValidationResult {
  errors: FormattedError[];
  errorCount: number;
  isValid: boolean;
  summary: string;
}

/**
 * Format a ValidationResult into display-ready strings.
 */
export function formatValidationResult(
  result: ValidationResult,
  dictionary?: Record<string, string>
): FormattedValidationResult {
  const errors: FormattedError[] = [];

  for (const [fieldName, fieldErrors] of Object.entries(result.fieldErrors)) {
    for (const error of fieldErrors) {
      const message = interpolateMessage(
        error.messageKey,
        error.params,
        dictionary
      );

      errors.push({
        fieldName,
        message,
        anchorId: `${fieldName}-error`,
        code: error.code,
      });
    }
  }

  const summary = formatErrorCount(errors.length, dictionary);

  return {
    errors,
    errorCount: errors.length,
    isValid: errors.length === 0,
    summary,
  };
}

/**
 * Format error count with proper pluralization.
 */
export function formatErrorCount(
  count: number,
  dictionary?: Record<string, string>
): string {
  if (count === 0) {
    return dictionary?.["validation.noErrors"] || "No errors";
  }

  const template =
    dictionary?.["validation.errorCount"] || "{count} error{plural} found";

  const plural = count === 1 ? "" : "s";

  return template
    .replace("{count}", String(count))
    .replace("{plural}", plural);
}

/**
 * Group errors by field name for inline display.
 */
export function groupErrorsByField(
  result: ValidationResult,
  dictionary?: Record<string, string>
): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  for (const [fieldName, fieldErrors] of Object.entries(result.fieldErrors)) {
    grouped[fieldName] = fieldErrors.map((error) =>
      interpolateMessage(error.messageKey, error.params, dictionary)
    );
  }

  return grouped;
}

/**
 * Get the first error message for a field (for single-error display).
 */
export function getFirstErrorForField(
  fieldName: string,
  result: ValidationResult,
  dictionary?: Record<string, string>
): string | null {
  const fieldErrors = result.fieldErrors[fieldName];
  if (!fieldErrors || fieldErrors.length === 0) return null;

  const firstError = fieldErrors[0];
  return interpolateMessage(firstError.messageKey, firstError.params, dictionary);
}

/**
 * Check if a specific field has any errors.
 */
export function hasFieldError(
  fieldName: string,
  result: ValidationResult
): boolean {
  const fieldErrors = result.fieldErrors[fieldName];
  return fieldErrors !== undefined && fieldErrors.length > 0;
}

/**
 * Check if a specific field has a specific error code.
 */
export function hasFieldErrorCode(
  fieldName: string,
  errorCode: string,
  result: ValidationResult
): boolean {
  const fieldErrors = result.fieldErrors[fieldName];
  if (!fieldErrors) return false;
  return fieldErrors.some((error) => error.code === errorCode);
}
