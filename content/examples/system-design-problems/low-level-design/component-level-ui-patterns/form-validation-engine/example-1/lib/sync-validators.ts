import type {
  SyncValidatorFn,
  ValidationError,
  ValidationRule,
  RequiredRule,
  MinLengthRule,
  MaxLengthRule,
  PatternRule,
  EmailRule,
  PhoneRule,
  UrlRule,
  MinRule,
  MaxRule,
  MatchesRule,
  CustomRule,
} from "./validation-types";

// ─── Individual Sync Validators ──────────────────────────────────────

export const required: SyncValidatorFn = (
  value: unknown
): ValidationError | null => {
  if (value === undefined || value === null || value === "") {
    return {
      code: "required",
      messageKey: "validation.required",
      params: {},
    };
  }
  if (Array.isArray(value) && value.length === 0) {
    return {
      code: "required",
      messageKey: "validation.required",
      params: {},
    };
  }
  return null;
};

export const minLength: SyncValidatorFn = (
  value: unknown,
  params?: Record<string, unknown>
): ValidationError | null => {
  if (typeof value !== "string") return null;
  const min = params?.min as number | undefined;
  if (min === undefined) return null;
  if (value.length < min) {
    return {
      code: "minLength",
      messageKey: "validation.minLength",
      params: { min },
    };
  }
  return null;
};

export const maxLength: SyncValidatorFn = (
  value: unknown,
  params?: Record<string, unknown>
): ValidationError | null => {
  if (typeof value !== "string") return null;
  const max = params?.max as number | undefined;
  if (max === undefined) return null;
  if (value.length > max) {
    return {
      code: "maxLength",
      messageKey: "validation.maxLength",
      params: { max },
    };
  }
  return null;
};

export const pattern: SyncValidatorFn = (
  value: unknown,
  params?: Record<string, unknown>
): ValidationError | null => {
  if (typeof value !== "string") return null;
  const patternParam = params?.pattern;
  if (!patternParam) return null;
  const regex =
    patternParam instanceof RegExp
      ? patternParam
      : new RegExp(patternParam as string);
  if (!regex.test(value)) {
    return {
      code: "pattern",
      messageKey: "validation.pattern",
      params: { pattern: String(patternParam) },
    };
  }
  return null;
};

// Common patterns as standalone validators
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const PHONE_REGEX =
  /^\+?[1-9]\d{1,14}$/;

const URL_REGEX =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const email: SyncValidatorFn = (
  value: unknown
): ValidationError | null => {
  if (typeof value !== "string") return null;
  if (!EMAIL_REGEX.test(value)) {
    return {
      code: "email",
      messageKey: "validation.email",
    };
  }
  return null;
};

export const phone: SyncValidatorFn = (
  value: unknown
): ValidationError | null => {
  if (typeof value !== "string") return null;
  if (!PHONE_REGEX.test(value)) {
    return {
      code: "phone",
      messageKey: "validation.phone",
    };
  }
  return null;
};

export const url: SyncValidatorFn = (
  value: unknown
): ValidationError | null => {
  if (typeof value !== "string") return null;
  if (!URL_REGEX.test(value)) {
    return {
      code: "url",
      messageKey: "validation.url",
    };
  }
  return null;
};

export const min: SyncValidatorFn = (
  value: unknown,
  params?: Record<string, unknown>
): ValidationError | null => {
  if (typeof value !== "number") return null;
  const minValue = params?.min as number | undefined;
  if (minValue === undefined) return null;
  if (value < minValue) {
    return {
      code: "min",
      messageKey: "validation.min",
      params: { min: minValue },
    };
  }
  return null;
};

export const max: SyncValidatorFn = (
  value: unknown,
  params?: Record<string, unknown>
): ValidationError | null => {
  if (typeof value !== "number") return null;
  const maxValue = params?.max as number | undefined;
  if (maxValue === undefined) return null;
  if (value > maxValue) {
    return {
      code: "max",
      messageKey: "validation.max",
      params: { max: maxValue },
    };
  }
  return null;
};

export const matches: SyncValidatorFn = (
  value: unknown,
  params?: Record<string, unknown>
): ValidationError | null => {
  const targetValue = params?.targetValue;
  if (value !== targetValue) {
    return {
      code: "matches",
      messageKey: "validation.matches",
      params: { targetField: (params?.targetField as string) || "field" },
    };
  }
  return null;
};

export const custom: SyncValidatorFn = (
  value: unknown,
  params?: Record<string, unknown>
): ValidationError | null => {
  const validateFn = params?.validate as
    | ((value: unknown) => ValidationError | null)
    | undefined;
  if (!validateFn) return null;
  try {
    return validateFn(value);
  } catch {
    return {
      code: "unexpected_error",
      messageKey: "validation.unexpectedError",
    };
  }
};

// ─── Validator Registry ──────────────────────────────────────────────

const syncValidatorRegistry: Record<string, SyncValidatorFn> = {
  required,
  minLength,
  maxLength,
  pattern,
  email,
  phone,
  url,
  min,
  max,
  matches,
  custom,
};

export function getSyncValidator(type: string): SyncValidatorFn | undefined {
  return syncValidatorRegistry[type];
}

// ─── Rule Chain Execution (Short-Circuit) ────────────────────────────

export function validateSync(
  value: unknown,
  rules: ValidationRule[],
  allValues?: Record<string, unknown>
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const rule of rules) {
    const validator = getSyncValidator(rule.type);
    if (!validator) continue;

    const params: Record<string, unknown> = {};

    // Extract rule-specific params
    if (rule.type === "minLength") {
      params.min = (rule as MinLengthRule).min;
    } else if (rule.type === "maxLength") {
      params.max = (rule as MaxLengthRule).max;
    } else if (rule.type === "pattern") {
      params.pattern = (rule as PatternRule).pattern;
    } else if (rule.type === "min") {
      params.min = (rule as MinRule).value;
    } else if (rule.type === "max") {
      params.max = (rule as MaxRule).value;
    } else if (rule.type === "matches") {
      const matchesRule = rule as MatchesRule;
      params.targetField = matchesRule.targetField;
      params.targetValue = allValues?.[matchesRule.targetField];
    } else if (rule.type === "custom") {
      params.validate = (rule as CustomRule).validate;
    }

    let error: ValidationError | null | Promise<ValidationError | null>;
    if (rule.type === "custom") {
      error = validator(value, params);
      // Custom validators can be sync or async; handle both
      if (error instanceof Promise) {
        // For sync chain, we skip async custom validators here
        continue;
      }
    } else {
      error = validator(value, params);
    }

    if (error) {
      // Override messageKey if rule provides a custom one
      if (rule.messageKey) {
        (error as ValidationError).messageKey = rule.messageKey;
      }
      errors.push(error as ValidationError);
      // Short-circuit: stop on first error
      break;
    }
  }

  return errors;
}
