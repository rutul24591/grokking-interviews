// Core TypeScript interfaces for the Form Builder system.
// These types define the schema format, runtime state, and validation rules.

/** All supported field input types. */
export type FieldType =
  | "text"
  | "email"
  | "number"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "file";

/** Operators used in conditional visibility rules. */
export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "greater_than"
  | "less_than"
  | "is_empty"
  | "is_not_empty";

/** Logical combinators for compound conditional rules. */
export type ConditionCombinator = "and" | "or" | "not";

/** A single conditional rule comparing a source field to a target value. */
export interface SimpleConditionRule {
  type: "simple";
  sourceField: string;
  operator: ConditionOperator;
  targetValue: unknown;
}

/** A compound rule combining multiple rules with AND/OR/NOT. */
export interface CompoundConditionRule {
  type: "compound";
  combinator: ConditionCombinator;
  rules: ConditionRule[];
}

/** Any conditional rule — simple or compound. */
export type ConditionRule = SimpleConditionRule | CompoundConditionRule;

/** Sync validation rule types. */
export type SyncValidatorType =
  | "required"
  | "minLength"
  | "maxLength"
  | "pattern"
  | "min"
  | "max"
  | "email";

/** A sync validation rule with optional configuration. */
export interface SyncValidationRule {
  type: SyncValidatorType;
  message?: string;
  value?: number | string | RegExp;
}

/** An async validation rule that returns a Promise<string | null>. */
export interface AsyncValidationRule {
  type: "async";
  message?: string;
  validator: (value: unknown, formValues: Record<string, unknown>) => Promise<string | null>;
  debounceMs?: number;
}

/** Any validation rule — sync or async. */
export type ValidationRule = SyncValidationRule | AsyncValidationRule;

/** Select/radio option definition. */
export interface FieldOption {
  label: string;
  value: string | number;
}

/** Schema definition for a single form field. */
export interface FieldDefinition {
  /** Unique field identifier used as the key in form state. */
  name: string;
  /** Human-readable label displayed next to the input. */
  label: string;
  /** Input type determining the rendered component. */
  type: FieldType;
  /** Initial/default value for the field. */
  defaultValue?: unknown;
  /** Placeholder text for text-like inputs. */
  placeholder?: string;
  /** Helper text displayed below the input. */
  helperText?: string;
  /** Whether the field is disabled. */
  disabled?: boolean;
  /** Whether the field is required (visual indicator + validation). */
  required?: boolean;
  /** Validation rules applied to this field. */
  validators?: ValidationRule[];
  /** Conditional visibility rules — field is hidden if rules evaluate to false. */
  visibility?: ConditionRule;
  /** Whether to clear the field value when hidden by a visibility rule. */
  clearOnHide?: boolean;
  /** Options for select and radio fields. */
  options?: FieldOption[];
  /** Accept attribute for file fields (e.g., "image/*", ".pdf"). */
  accept?: string;
  /** Maximum file size in bytes for file fields. */
  maxFileSize?: number;
  /** Whether multiple files can be uploaded. */
  multiple?: boolean;
  /** Step ID for multi-step forms — fields without this belong to the default single step. */
  stepId?: string;
  /** Extra metadata for custom rendering logic. */
  meta?: Record<string, unknown>;
}

/** A single step in a multi-step form. */
export interface Step {
  /** Unique step identifier. */
  id: string;
  /** Display title shown in the stepper. */
  title: string;
  /** Optional description. */
  description?: string;
  /** Field names belonging to this step. */
  fieldNames: string[];
}

/** Runtime state for a single field. */
export interface FieldState {
  /** Current field value. */
  value: unknown;
  /** Initial value (used for dirty comparison). */
  initialValue: unknown;
  /** Whether the user has visited this field (onBlur). */
  touched: boolean;
  /** Whether the value has changed from the initial value. */
  dirty: boolean;
  /** Validation error message (null if valid). */
  error: string | null;
  /** Whether an async validator is currently running. */
  validating: boolean;
}

/** Current submission state of the form. */
export type SubmissionState = "idle" | "submitting" | "submitted" | "error";

/** Runtime state for the entire form. */
export interface FormState<TValues extends Record<string, unknown> = Record<string, unknown>> {
  /** Map of field name to field state. */
  fields: Record<string, FieldState>;
  /** All field definitions from the schema. */
  definitions: Record<string, FieldDefinition>;
  /** Current step index (0-based). */
  currentStep: number;
  /** Steps configuration for multi-step forms. */
  steps: Step[];
  /** Map of step ID to whether the step has been validated. */
  stepValidity: Record<string, boolean>;
  /** Map of field name to error message (aggregated for quick lookup). */
  errors: Record<string, string | null>;
  /** Whether the entire form is valid (no errors across all fields). */
  isValid: boolean;
  /** Current submission state. */
  submissionState: SubmissionState;
  /** Submission error message. */
  submissionError: string | null;
  /** Whether a draft exists in localStorage. */
  hasDraft: boolean;
  /** Timestamp of the last draft save. */
  lastDraftSave: number | null;
  /** Complete form values as a flat object (convenience for consumers). */
  values: TValues;
  /** Set of field names with pending async validations. */
  pendingAsyncValidations: Set<string>;
}

/** Payload returned to the onSubmit callback. */
export interface FormSubmitPayload<TValues extends Record<string, unknown> = Record<string, unknown>> {
  /** All field values as a flat object. */
  values: TValues;
  /** Timestamp of submission. */
  submittedAt: Date;
  /** Whether this was restored from a draft. */
  fromDraft: boolean;
}

/** Configuration options for the FormBuilder. */
export interface FormBuilderConfig {
  /** Unique form identifier used for draft storage key. */
  formId: string;
  /** Form schema — array of field definitions. */
  fields: FieldDefinition[];
  /** Steps configuration (omit for single-step forms). */
  steps?: Step[];
  /** Callback invoked on successful form submission. */
  onSubmit?: (payload: FormSubmitPayload) => void | Promise<void>;
  /** Whether to enable draft auto-save to localStorage. */
  enableDrafts?: boolean;
  /** Debounce delay for draft auto-save in milliseconds. */
  draftDebounceMs?: number;
  /** Whether to prompt user to restore draft on mount. */
  promptDraftRestore?: boolean;
}
