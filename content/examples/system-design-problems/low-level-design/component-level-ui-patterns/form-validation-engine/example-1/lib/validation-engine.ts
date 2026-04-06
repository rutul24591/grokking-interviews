import type {
  ValidationConfig,
  ValidationRule,
  AsyncRule,
  ValidationError,
  ValidationResult,
  FieldErrors,
  ValidationMode,
} from "./validation-types";
import { validateSync } from "./sync-validators";
import {
  createAsyncValidator,
  type AsyncValidatorInstance,
} from "./async-validator";
import {
  CrossFieldValidator,
} from "./cross-field-validator";

// ─── Default i18n Dictionary ─────────────────────────────────────────

const DEFAULT_I18N: Record<string, string> = {
  "validation.required": "This field is required.",
  "validation.minLength": "Must be at least {min} characters.",
  "validation.maxLength": "Must be no more than {max} characters.",
  "validation.pattern": "Value does not match the required pattern.",
  "validation.email": "Please enter a valid email address.",
  "validation.phone": "Please enter a valid phone number.",
  "validation.url": "Please enter a valid URL.",
  "validation.min": "Value must be at least {min}.",
  "validation.max": "Value must be no more than {max}.",
  "validation.matches": "Must match the value in {targetField}.",
  "validation.passwordMismatch": "Passwords do not match.",
  "validation.dateRangeInvalid": "End date must be after start date.",
  "validation.conditionalRequired": "This field is required.",
  "validation.unexpectedError": "Validation failed. Please try again.",
  "validation.asyncError": "Could not verify value. Please try again.",
};

// ─── Message Interpolation ───────────────────────────────────────────

export function interpolateMessage(
  messageKey: string,
  params?: Record<string, string | number>,
  dictionary?: Record<string, string>
): string {
  const dict = dictionary || DEFAULT_I18N;
  let template = dict[messageKey] || messageKey;

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      template = template.replace(
        new RegExp(`\\{${key}\\}`, "g"),
        String(value)
      );
    }
  }

  return template;
}

// ─── Validation Engine ───────────────────────────────────────────────

export class ValidationEngine {
  private config: ValidationConfig;
  private fieldRuleMap = new Map<string, ValidationRule[]>();
  private fieldAsyncRuleMap = new Map<string, AsyncRule[]>();
  private fieldModeMap = new Map<string, ValidationMode>();
  private asyncValidators = new Map<string, AsyncValidatorInstance>();
  private crossFieldValidator: CrossFieldValidator | null = null;
  private pendingAsyncValidations = new Set<Promise<void>>();
  private resultCache = new Map<string, ValidationError[]>();

  constructor(config: ValidationConfig) {
    this.config = config;
    this.initialize();
  }

  private initialize(): void {
    // Build field -> rules map
    for (const field of this.config.fields) {
      this.fieldRuleMap.set(field.name, field.rules);
      if (field.asyncRules && field.asyncRules.length > 0) {
        this.fieldAsyncRuleMap.set(field.name, field.asyncRules);
      }
      if (field.mode) {
        this.fieldModeMap.set(field.name, field.mode);
      }
    }

    // Build cross-field validator if rules exist
    if (this.config.crossFieldRules && this.config.crossFieldRules.length > 0) {
      this.crossFieldValidator = new CrossFieldValidator(
        this.config.crossFieldRules
      );
    }

    // Create async validator instances for each field
    for (const entry of Array.from(this.fieldAsyncRuleMap.entries())) {
      const [fieldName, asyncRules] = entry;
      const defaultDebounce = this.config.debounceMs || 300;
      // Use the first async rule's config; multiple async rules per field are merged
      const primaryRule = asyncRules[0];
      this.asyncValidators.set(
        fieldName,
        createAsyncValidator({
          checkFn: primaryRule.check,
          debounceMs: primaryRule.debounceMs || defaultDebounce,
          cacheMaxSize: primaryRule.cacheSize || 100,
        })
      );
    }
  }

  /**
   * Get the validation mode for a field (falls back to form-level mode).
   */
  getMode(fieldName: string): ValidationMode {
    return (
      this.fieldModeMap.get(fieldName) || this.config.mode || "onSubmit"
    );
  }

  /**
   * Check if a field should be validated in the given trigger context.
   */
  shouldValidate(
    fieldName: string,
    trigger: "change" | "blur" | "submit"
  ): boolean {
    const mode = this.getMode(fieldName);
    switch (mode) {
      case "onChange":
        return trigger === "change";
      case "onBlur":
        return trigger === "blur";
      case "onSubmit":
        return trigger === "submit";
      case "all":
        return true;
      default:
        return trigger === "submit";
    }
  }

  /**
   * Validate a single field (sync only).
   */
  validateFieldSync(
    fieldName: string,
    value: unknown,
    allValues: Record<string, unknown>
  ): ValidationError[] {
    const cacheKey = `${fieldName}:${JSON.stringify(value)}`;
    const cached = this.resultCache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const rules = this.fieldRuleMap.get(fieldName) || [];
    const errors = validateSync(value, rules, allValues);

    this.resultCache.set(cacheKey, errors);
    return errors;
  }

  /**
   * Trigger async validation for a field. Returns a promise that resolves
   * when the async check completes.
   */
  validateFieldAsync(
    fieldName: string,
    value: unknown,
    onResult: (error: ValidationError | null) => void
  ): void {
    const asyncValidator = this.asyncValidators.get(fieldName);
    if (!asyncValidator) {
      onResult(null);
      return;
    }

    asyncValidator.validate(value, onResult);
  }

  /**
   * Cancel pending async validation for a field.
   */
  cancelAsync(fieldName: string): void {
    const asyncValidator = this.asyncValidators.get(fieldName);
    if (asyncValidator) {
      asyncValidator.cancel();
    }
  }

  /**
   * Validate all fields (sync + cross-field). Returns aggregated result.
   */
  validateAll(
    values: Record<string, unknown>
  ): ValidationResult {
    const fieldErrors: FieldErrors = {};

    // Validate each field's sync rules
    for (const fieldName of Array.from(this.fieldRuleMap.keys())) {
      const value = values[fieldName];
      const errors = this.validateFieldSync(fieldName, value, values);
      if (errors.length > 0) {
        fieldErrors[fieldName] = this.interpolateErrors(errors);
      }
    }

    // Run cross-field validation
    if (this.crossFieldValidator) {
      const crossErrors = this.crossFieldValidator.validateAll(values);
      for (const [fieldName, errors] of Object.entries(crossErrors)) {
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = [];
        }
        fieldErrors[fieldName].push(
          ...this.interpolateErrors(errors)
        );
      }
    }

    const errorCount = Object.values(fieldErrors).reduce(
      (sum, errors) => sum + errors.length,
      0
    );

    return {
      valid: errorCount === 0,
      fieldErrors,
      errorCount,
    };
  }

  /**
   * Check if the entire form is valid (considering only sync validation).
   */
  isValid(values: Record<string, unknown>): boolean {
    return this.validateAll(values).valid;
  }

  /**
   * Wait for all pending async validations to complete.
   */
  async waitForAsyncValidations(): Promise<void> {
    if (this.pendingAsyncValidations.size === 0) return;
    const validations = Array.from(this.pendingAsyncValidations);
    await Promise.all(validations);
    this.pendingAsyncValidations.clear();
  }

  /**
   * Get fields that depend on the changed field (for cascade revalidation).
   */
  getDependentFields(changedField: string): string[] {
    if (!this.crossFieldValidator) return [];
    return this.crossFieldValidator.getDependentFields(changedField);
  }

  /**
   * Resolve error messages using i18n dictionary.
   */
  private interpolateErrors(
    errors: ValidationError[]
  ): ValidationError[] {
    const dictionary = this.config.i18n?.[this.config.locale || "en"];
    return errors.map((error) => ({
      ...error,
      message: interpolateMessage(
        error.messageKey,
        error.params,
        dictionary
      ),
    }));
  }

  /**
   * Clear the result cache (e.g., on form reset).
   */
  clearCache(): void {
    this.resultCache.clear();
  }

  /**
   * Clean up all async validators (e.g., on component unmount).
   */
  cleanup(): void {
    for (const validator of Array.from(this.asyncValidators.values())) {
      validator.cancel();
      validator.clearCache();
    }
    this.pendingAsyncValidations.clear();
  }
}
