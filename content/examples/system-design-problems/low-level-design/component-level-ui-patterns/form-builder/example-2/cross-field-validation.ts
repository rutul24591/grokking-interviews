/**
 * Cross-Field Validation — Validators that depend on multiple field values.
 *
 * Interview edge case: When field A depends on field B's value, validation must
 * re-run on BOTH fields when either changes. Common cases: password match,
 * date range (end > start), sum of percentages = 100.
 */

export type CrossFieldValidator = (
  values: Record<string, unknown>,
) => Record<string, string | null>;

/**
 * Password must match confirmation validator.
 */
export const passwordMatch: CrossFieldValidator = (values) => {
  const pw = values.password as string | undefined;
  const confirm = values.confirmPassword as string | undefined;
  if (!confirm) return {};
  if (pw !== confirm) return { confirmPassword: 'Passwords do not match' };
  return { confirmPassword: null };
};

/**
 * End date must be after start date validator.
 */
export const dateRange: CrossFieldValidator = (values) => {
  const start = values.startDate as string | undefined;
  const end = values.endDate as string | undefined;
  if (!start || !end) return {};
  if (new Date(end) <= new Date(start)) return { endDate: 'End date must be after start date' };
  return { endDate: null };
};

/**
 * Runs all cross-field validators and merges results.
 * Only returns errors for fields that have non-null errors.
 */
export function runCrossFieldValidation(
  values: Record<string, unknown>,
  validators: CrossFieldValidator[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const validator of validators) {
    const result = validator(values);
    for (const [field, error] of Object.entries(result)) {
      if (error) errors[field] = error;
    }
  }
  return errors;
}
