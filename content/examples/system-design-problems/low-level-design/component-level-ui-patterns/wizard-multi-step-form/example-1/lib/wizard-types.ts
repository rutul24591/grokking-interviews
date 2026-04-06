/**
 * Wizard / Multi-step Form — Type Definitions
 *
 * Core interfaces that define the contract between all wizard modules:
 * step definitions, field types, validation results, wizard state, and
 * navigation modes.
 */

// ---------------------------------------------------------------------------
// Field Types
// ---------------------------------------------------------------------------

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "phone"
  | "file";

// ---------------------------------------------------------------------------
// Field Definition — describes a single form field within a step
// ---------------------------------------------------------------------------

export interface FieldDefinition {
  /** Unique field identifier within the step */
  name: string;
  /** Human-readable label */
  label: string;
  /** Input type */
  type: FieldType;
  /** Whether this field is mandatory */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Options for select/radio fields */
  options?: Array<{ value: string; label: string }>;
  /** Validation rules applied to this field */
  validators?: FieldValidator[];
  /** Help text shown below the field */
  helpText?: string;
  /** Minimum value (for number/date fields) */
  min?: number | string;
  /** Maximum value (for number/date fields) */
  max?: number | string;
  /** Minimum character length (for text fields) */
  minLength?: number;
  /** Maximum character length (for text fields) */
  maxLength?: number;
  /** Regex pattern for validation (for text/email/phone fields) */
  pattern?: string;
  /** File upload constraints */
  fileOptions?: {
    acceptedMimeTypes: string[];
    maxSizeBytes: number;
    maxFiles?: number;
  };
}

// ---------------------------------------------------------------------------
// Validators
// ---------------------------------------------------------------------------

export type SyncValidator = (value: FieldValue) => string | undefined;

export type AsyncValidator = (
  value: FieldValue,
  allValues: Record<string, FieldValue>,
) => Promise<string | undefined>;

export interface FieldValidator {
  /** Validator function (sync or async) */
  validate: SyncValidator | AsyncValidator;
  /** Whether this is an async validator */
  async: boolean;
  /** Error message override (optional — validator return value takes precedence) */
  message?: string;
}

// ---------------------------------------------------------------------------
// Field Value — union of all possible field value types
// ---------------------------------------------------------------------------

export type FieldValue =
  | string
  | number
  | boolean
  | string[]
  | File[]
  | null
  | undefined;

// ---------------------------------------------------------------------------
// Step Definition — describes a single step in the wizard
// ---------------------------------------------------------------------------

export interface StepDefinition {
  /** Unique step identifier */
  id: string;
  /** Display title shown in stepper and step heading */
  title: string;
  /** Optional description shown below the title */
  description?: string;
  /** Fields rendered on this step */
  fields: FieldDefinition[];
  /**
   * Predicate that determines whether this step should be skipped.
   * Receives all current field values and returns true to skip.
   */
  skipStep?: (fieldValues: Record<string, Record<string, FieldValue>>) => boolean;
  /** Optional icon name for the stepper */
  icon?: string;
}

// ---------------------------------------------------------------------------
// Validation Result — per-step validation state
// ---------------------------------------------------------------------------

export type AsyncValidationStatus = "idle" | "running" | "done";

export interface StepValidationResult {
  /** Whether the step passed all validation */
  isValid: boolean;
  /** Map of field name to error message */
  errors: Record<string, string>;
  /** Whether any field-level async validators are still running */
  asyncStatus: AsyncValidationStatus;
}

// ---------------------------------------------------------------------------
// Wizard State — the complete Zustand store shape
// ---------------------------------------------------------------------------

export interface WizardState {
  /** Step definitions passed to the wizard */
  steps: StepDefinition[];
  /** Zero-based index of the currently active step */
  currentStepIndex: number;
  /** Field values organized as { stepId: { fieldName: value } } */
  fieldValues: Record<string, Record<string, FieldValue>>;
  /** Validation results per step */
  validationResults: Record<string, StepValidationResult>;
  /** Set of step IDs that have been completed (passed validation) */
  visitedSteps: string[];
  /** Navigation history stack for back-button behavior */
  history: string[];
  /** Whether the wizard enforces sequential completion */
  isLinear: boolean;
  /** Whether the wizard has been submitted */
  isSubmitted: boolean;
  /** Whether a draft was found on mount */
  hasDraft: boolean;
  /** The localStorage key used for draft persistence */
  draftKey: string;
  /** Schema version for forward-compatible migrations */
  schemaVersion: number;
  /** Whether the store is currently restoring a draft */
  isRestoring: boolean;
  /** Error message if draft restoration failed */
  restoreError: string | null;
}

// ---------------------------------------------------------------------------
// Draft — serializable snapshot persisted to localStorage
// ---------------------------------------------------------------------------

export interface WizardDraft {
  schemaVersion: number;
  timestamp: number;
  fieldValues: Record<string, Record<string, FieldValue>>;
  validationResults: Record<string, StepValidationResult>;
  visitedSteps: string[];
  currentStepIndex: number;
  history: string[];
}

// ---------------------------------------------------------------------------
// Wizard Submit Payload — aggregated data sent on submission
// ---------------------------------------------------------------------------

export interface WizardSubmitPayload {
  /** All field values flattened across steps */
  data: Record<string, FieldValue>;
  /** Timestamp when the wizard was completed */
  completedAt: number;
  /** Total number of steps in the wizard */
  totalSteps: number;
  /** Number of steps the user actually completed (excludes skipped) */
  completedSteps: number;
}

// ---------------------------------------------------------------------------
// Step Status — used by the stepper to render visual states
// ---------------------------------------------------------------------------

export type StepStatus = "completed" | "current" | "upcoming" | "locked" | "skipped";

// ---------------------------------------------------------------------------
// Wizard Configuration — props for the root Wizard component
// ---------------------------------------------------------------------------

export interface WizardConfig {
  /** Step definitions */
  steps: StepDefinition[];
  /** Callback invoked on successful submission */
  onSubmit: (payload: WizardSubmitPayload) => void | Promise<void>;
  /** Callback invoked when the user cancels the wizard */
  onCancel?: () => void;
  /** Whether to enforce sequential completion */
  linear?: boolean;
  /** Unique key for draft persistence (default: "wizard:default") */
  draftKey?: string;
  /** Auto-save interval in milliseconds (default: 2000) */
  autoSaveInterval?: number;
  /** Whether to show a summary/review step before submission */
  showSummary?: boolean;
  /** Label for the submit button (default: "Submit") */
  submitLabel?: string;
  /** Label for the next button (default: "Next") */
  nextLabel?: string;
  /** Label for the previous button (default: "Previous") */
  prevLabel?: string;
}
