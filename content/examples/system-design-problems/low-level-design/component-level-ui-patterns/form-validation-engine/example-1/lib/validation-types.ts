// ─── Validation Rule Types ───────────────────────────────────────────

export type SyncRuleType =
  | "required"
  | "minLength"
  | "maxLength"
  | "pattern"
  | "email"
  | "phone"
  | "url"
  | "min"
  | "max"
  | "matches"
  | "custom";

export type ValidationMode = "onChange" | "onBlur" | "onSubmit" | "all";

export interface ValidationError {
  code: string;
  messageKey: string;
  params?: Record<string, string | number>;
  field?: string;
  retryable?: boolean;
}

export interface BaseRule {
  type: SyncRuleType;
  messageKey?: string;
}

export interface RequiredRule extends BaseRule {
  type: "required";
}

export interface MinLengthRule extends BaseRule {
  type: "minLength";
  min: number;
}

export interface MaxLengthRule extends BaseRule {
  type: "maxLength";
  max: number;
}

export interface PatternRule extends BaseRule {
  type: "pattern";
  pattern: RegExp | string;
}

export interface EmailRule extends BaseRule {
  type: "email";
}

export interface PhoneRule extends BaseRule {
  type: "phone";
}

export interface UrlRule extends BaseRule {
  type: "url";
}

export interface MinRule extends BaseRule {
  type: "min";
  value: number;
}

export interface MaxRule extends BaseRule {
  type: "max";
  value: number;
}

export interface MatchesRule extends BaseRule {
  type: "matches";
  targetField: string;
}

export interface CustomRule extends BaseRule {
  type: "custom";
  validate: CustomValidatorFn;
}

export type ValidationRule =
  | RequiredRule
  | MinLengthRule
  | MaxLengthRule
  | PatternRule
  | EmailRule
  | PhoneRule
  | UrlRule
  | MinRule
  | MaxRule
  | MatchesRule
  | CustomRule;

// ─── Async Rule Types ────────────────────────────────────────────────

export interface AsyncRule {
  type: "async";
  check: AsyncValidatorFn;
  debounceMs?: number;
  cacheSize?: number;
  precondition?: ValidationRule[];
  messageKey?: string;
}

// ─── Cross-Field Rule Types ──────────────────────────────────────────

export type CrossFieldRuleType = "passwordMatch" | "dateRange" | "conditionalRequired";

export interface PasswordMatchRule {
  type: "passwordMatch";
  sourceField: string;
  targetField: string;
  messageKey?: string;
}

export interface DateRangeRule {
  type: "dateRange";
  startField: string;
  endField: string;
  messageKey?: string;
}

export interface ConditionalRequiredRule {
  type: "conditionalRequired";
  sourceField: string;
  sourceValue: unknown;
  targetField: string;
  messageKey?: string;
}

export type CrossFieldRule = PasswordMatchRule | DateRangeRule | ConditionalRequiredRule;

// ─── Validator Function Signatures ───────────────────────────────────

export type CustomValidatorFn = (
  value: unknown,
  allValues?: Record<string, unknown>
) => ValidationError | null | Promise<ValidationError | null>;

export type AsyncValidatorFn = (
  value: unknown,
  signal: AbortSignal
) => Promise<ValidationError | null>;

export type SyncValidatorFn = (
  value: unknown,
  params?: Record<string, unknown>
) => ValidationError | null;

// ─── Field and Form State Types ──────────────────────────────────────

export interface FieldErrors {
  [fieldName: string]: ValidationError[];
}

export interface FieldState {
  value: unknown;
  touched: boolean;
  errors: ValidationError[];
  asyncLoading: boolean;
  asyncValidating: boolean;
}

export interface FormState {
  values: Record<string, unknown>;
  touched: Set<string>;
  errors: FieldErrors;
  asyncLoading: Record<string, boolean>;
  pendingAsyncCount: number;
  isValid: boolean;
  errorCount: number;
}

export interface ValidationResult {
  valid: boolean;
  fieldErrors: FieldErrors;
  errorCount: number;
}

// ─── Configuration Types ─────────────────────────────────────────────

export interface FieldConfig {
  name: string;
  rules: ValidationRule[];
  asyncRules?: AsyncRule[];
  mode?: ValidationMode;
}

export interface I18nDictionary {
  [locale: string]: {
    [messageKey: string]: string;
  };
}

export interface ValidationConfig {
  fields: FieldConfig[];
  mode?: ValidationMode;
  debounceMs?: number;
  crossFieldRules?: CrossFieldRule[];
  i18n?: I18nDictionary;
  locale?: string;
}

// ─── Hook Return Types ───────────────────────────────────────────────

export interface UseFieldValidationReturn {
  value: unknown;
  errors: ValidationError[];
  touched: boolean;
  asyncLoading: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  setError: (error: ValidationError | null) => void;
}

export interface UseFormValidationReturn {
  values: Record<string, unknown>;
  errors: FieldErrors;
  isValid: boolean;
  errorCount: number;
  touched: Set<string>;
  setValue: (fieldName: string, value: unknown) => void;
  handleSubmit: (onSubmit: (values: Record<string, unknown>) => void) => void;
  reset: () => void;
}

export interface UseAsyncValidationReturn {
  isAsyncValidating: boolean;
  asyncError: ValidationError | null;
  validateAsync: (value: unknown) => Promise<ValidationError | null>;
  cancelAsync: () => void;
}
