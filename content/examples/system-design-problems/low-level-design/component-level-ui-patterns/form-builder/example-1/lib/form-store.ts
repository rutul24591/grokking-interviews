// Zustand store for form state management.
// Handles field registry, value tracking, dirty/touched state,
// step navigation, submission, and draft persistence.

import { create } from "zustand";
import type {
  FieldDefinition,
  FieldState,
  FormState,
  Step,
  FieldBuilderConfig,
  FormSubmitPayload,
} from "../lib/form-types";
import { validateFieldsSync } from "../lib/validation-engine";

const DRAFT_PREFIX = "form-builder-draft:";

/** Get the localStorage key for a given form ID. */
function getDraftKey(formId: string): string {
  return `${DRAFT_PREFIX}${formId}`;
}

/** Serializable representation of form values (excludes File objects). */
interface DraftData {
  values: Record<string, unknown>;
  savedAt: number;
  version: number;
}

/** Try to load a draft from localStorage. Returns null if none exists. */
function loadDraft(formId: string): DraftData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getDraftKey(formId));
    if (!raw) return null;
    return JSON.parse(raw) as DraftData;
  } catch {
    return null;
  }
}

/** Save form values to localStorage as a draft. */
function saveDraft(formId: string, values: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    // Filter out File objects (non-serializable)
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(values)) {
      if (value instanceof File || value instanceof FileList) continue;
      if (Array.isArray(value)) {
        sanitized[key] = value.filter(
          (item) => !(item instanceof File || item instanceof FileList)
        );
      }
      sanitized[key] = value;
    }

    const draft: DraftData = {
      values: sanitized,
      savedAt: Date.now(),
      version: 1,
    };
    localStorage.setItem(getDraftKey(formId), JSON.stringify(draft));
  } catch {
    // localStorage might be full or disabled
    console.warn("Failed to save form draft to localStorage");
  }
}

/** Clear a draft from localStorage. */
function clearDraft(formId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getDraftKey(formId));
}

/** Compute whether a field is dirty (value differs from initial). */
function isDirty(value: unknown, initialValue: unknown): boolean {
  if (value === initialValue) return false;
  // Deep comparison for arrays/objects
  return JSON.stringify(value) !== JSON.stringify(initialValue);
}

/** Build initial field state from a definition. */
function createFieldState(definition: FieldDefinition, savedValue?: unknown): FieldState {
  const value = savedValue !== undefined ? savedValue : definition.defaultValue;
  return {
    value,
    initialValue: definition.defaultValue,
    touched: false,
    dirty: isDirty(value, definition.defaultValue),
    error: null,
    validating: false,
  };
}

/** Build the initial fields record from definitions, optionally merging draft values. */
function buildFields(
  definitions: FieldDefinition[],
  draftValues?: Record<string, unknown>
): Record<string, FieldState> {
  const fields: Record<string, FieldState> = {};
  for (const def of definitions) {
    const savedValue = draftValues?.[def.name];
    fields[def.name] = createFieldState(def, savedValue);
  }
  return fields;
}

/** Build the definitions lookup map. */
function buildDefinitions(
  definitions: FieldDefinition[]
): Record<string, FieldDefinition> {
  const map: Record<string, FieldDefinition> = {};
  for (const def of definitions) {
    map[def.name] = def;
  }
  return map;
}

/** Collect all field values into a flat object. */
function collectValues(fields: Record<string, FieldState>): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const [name, state] of Object.entries(fields)) {
    values[name] = state.value;
  }
  return values;
}

/** Check if the entire form has any errors. */
function computeFormValidity(
  fields: Record<string, FieldState>,
  stepValidity: Record<string, boolean>,
  steps: Step[]
): boolean {
  // If there are steps, all steps must be valid
  if (steps.length > 0) {
    return steps.every((step) => stepValidity[step.id] !== false);
  }
  // Single-step: no field should have an error
  return Object.values(fields).every((field) => !field.error);
}

/** Form store interface. */
interface FormStore {
  // State
  fields: Record<string, FieldState>;
  definitions: Record<string, FieldDefinition>;
  currentStep: number;
  steps: Step[];
  stepValidity: Record<string, boolean>;
  errors: Record<string, string | null>;
  isValid: boolean;
  submissionState: "idle" | "submitting" | "submitted" | "error";
  submissionError: string | null;
  hasDraft: boolean;
  lastDraftSave: number | null;
  pendingAsyncValidations: Set<string>;

  // Actions
  initialize: (config: FormBuilderConfig) => void;
  setFieldValue: (name: string, value: unknown) => void;
  setFieldError: (name: string, error: string | null) => void;
  setFieldTouched: (name: string) => void;
  setFieldValidating: (name: string, validating: boolean) => void;
  setStepValidity: (stepId: string, valid: boolean) => void;
  nextStep: () => boolean;
  previousStep: () => void;
  goToStep: (index: number) => boolean;
  submitForm: (onSubmit?: (payload: FormSubmitPayload) => void | Promise<void>) => Promise<boolean>;
  saveDraft: () => void;
  restoreDraft: () => boolean;
  clearDraft: () => void;
  resetForm: () => void;
  addPendingAsync: (name: string) => void;
  removePendingAsync: (name: string) => void;
}

/** Create a form store instance. */
export const useFormStore = create<FormStore>((set, get) => ({
  // Initial state
  fields: {},
  definitions: {},
  currentStep: 0,
  steps: [],
  stepValidity: {},
  errors: {},
  isValid: false,
  submissionState: "idle",
  submissionError: null,
  hasDraft: false,
  lastDraftSave: null,
  pendingAsyncValidations: new Set<string>(),

  initialize: (config: FormBuilderConfig) => {
    const draft = config.enableDrafts !== false ? loadDraft(config.formId) : null;
    const fields = buildFields(config.fields, draft?.values);
    const definitions = buildDefinitions(config.fields);
    const steps = config.steps ?? [];

    // Initialize step validity
    const stepValidity: Record<string, boolean> = {};
    for (const step of steps) {
      stepValidity[step.id] = false;
    }

    // Run initial sync validation on all fields
    const fieldNames = config.fields.map((f) => f.name);
    const values = collectValues(fields);
    const initialErrors = validateFieldsSync(fieldNames, values, definitions);

    set({
      fields,
      definitions,
      steps,
      stepValidity,
      errors: initialErrors,
      isValid: Object.values(initialErrors).every((e) => !e),
      hasDraft: !!draft,
      lastDraftSave: draft?.savedAt ?? null,
    });
  },

  setFieldValue: (name: string, value: unknown) => {
    const { fields, definitions } = get();
    const field = fields[name];
    if (!field) return;

    const newDirty = isDirty(value, field.initialValue);

    set({
      fields: {
        ...fields,
        [name]: {
          ...field,
          value,
          dirty: newDirty,
          error: null, // Clear error on change — re-validate on blur/submit
        },
      },
    });
  },

  setFieldError: (name: string, error: string | null) => {
    const { fields, errors } = get();
    const field = fields[name];
    if (!field) return;

    const newErrors = { ...errors, [name]: error };

    set({
      fields: {
        ...fields,
        [name]: { ...field, error },
      },
      errors: newErrors,
      isValid: Object.values(newErrors).every((e) => !e),
    });
  },

  setFieldTouched: (name: string) => {
    const { fields } = get();
    const field = fields[name];
    if (!field || field.touched) return;

    set({
      fields: {
        ...fields,
        [name]: { ...field, touched: true },
      },
    });
  },

  setFieldValidating: (name: string, validating: boolean) => {
    const { fields } = get();
    const field = fields[name];
    if (!field) return;

    set({
      fields: {
        ...fields,
        [name]: { ...field, validating },
      },
    });
  },

  setStepValidity: (stepId: string, valid: boolean) => {
    const { stepValidity } = get();
    set({
      stepValidity: { ...stepValidity, [stepId]: valid },
    });
  },

  nextStep: () => {
    const { currentStep, steps, fields, definitions } = get();
    if (steps.length === 0 || currentStep >= steps.length - 1) return false;

    const currentStepDef = steps[currentStep];
    const values = collectValues(fields);

    // Validate all fields in the current step
    const stepErrors = validateFieldsSync(currentStepDef.fieldNames, values, definitions);

    // Check if any field has an error
    const stepValid = Object.values(stepErrors).every((e) => !e);

    if (!stepValid) {
      // Update errors for this step's fields
      const { errors } = get();
      set({
        errors: { ...errors, ...stepErrors },
        stepValidity: { ...get().stepValidity, [currentStepDef.id]: false },
      });
      return false;
    }

    // Mark current step as valid
    set({
      currentStep: currentStep + 1,
      stepValidity: { ...get().stepValidity, [currentStepDef.id]: true },
    });

    return true;
  },

  previousStep: () => {
    const { currentStep, steps } = get();
    if (currentStep <= 0) return;
    set({ currentStep: currentStep - 1 });
  },

  goToStep: (index: number) => {
    const { steps, stepValidity } = get();
    if (index < 0 || index >= steps.length) return false;

    // Can only navigate to completed steps or the next uncompleted step
    if (index > 0) {
      const allPrecedingValid = steps
        .slice(0, index)
        .every((step) => stepValidity[step.id]);
      if (!allPrecedingValid) return false;
    }

    set({ currentStep: index });
    return true;
  },

  submitForm: async (onSubmit) => {
    const { fields, definitions, values: _values } = get();
    const values = collectValues(fields);

    // Run sync validation on ALL fields
    const allFieldNames = Object.keys(fields);
    const errors = validateFieldsSync(allFieldNames, values, definitions);
    const hasErrors = Object.values(errors).some((e) => e);

    if (hasErrors) {
      set({
        errors,
        submissionState: "error",
        submissionError: "Please fix the errors before submitting",
      });
      return false;
    }

    // Check for pending async validations
    const { pendingAsyncValidations } = get();
    if (pendingAsyncValidations.size > 0) {
      // In a real implementation, we'd wait for pending async validations
      // For now, reject submission
      set({
        submissionState: "error",
        submissionError: "Please wait for all validations to complete",
      });
      return false;
    }

    set({ submissionState: "submitting", submissionError: null });

    try {
      const payload: FormSubmitPayload = {
        values: values as Record<string, unknown>,
        submittedAt: new Date(),
        fromDraft: get().hasDraft,
      };

      await onSubmit?.(payload);

      set({
        submissionState: "submitted",
        submissionError: null,
      });

      // Clear draft on successful submission
      const { formId } = get() as unknown as { formId?: string };
      if (formId) clearDraft(formId);

      return true;
    } catch (err) {
      set({
        submissionState: "error",
        submissionError: err instanceof Error ? err.message : "Submission failed",
      });
      return false;
    }
  },

  saveDraft: () => {
    const { fields } = get() as unknown as { fields: Record<string, FieldState>; definitions: Record<string, FieldDefinition> };
    const values = collectValues(fields);
    // We need the formId — in practice this is stored on init
    // For now, use a placeholder
    saveDraft("default-form", values);
    set({ lastDraftSave: Date.now() });
  },

  restoreDraft: () => {
    const { definitions } = get();
    const definitionsArray = Object.values(definitions);
    if (definitionsArray.length === 0) return false;

    const formId = "default-form"; // In practice, stored on init
    const draft = loadDraft(formId);
    if (!draft) return false;

    const fields = buildFields(definitionsArray, draft.values);
    const values = collectValues(fields);
    const allFieldNames = definitionsArray.map((d) => d.name);
    const errors = validateFieldsSync(allFieldNames, values, definitions);

    set({
      fields,
      errors,
      hasDraft: false,
      lastDraftSave: draft.savedAt,
    });

    return true;
  },

  clearDraft: () => {
    clearDraft("default-form");
    set({ hasDraft: false });
  },

  resetForm: () => {
    const { definitions } = get();
    const definitionsArray = Object.values(definitions);
    const fields = buildFields(definitionsArray);
    const allFieldNames = definitionsArray.map((d) => d.name);
    const errors = validateFieldsSync(allFieldNames, {}, definitions);

    set({
      fields,
      currentStep: 0,
      errors,
      isValid: Object.values(errors).every((e) => !e),
      submissionState: "idle",
      submissionError: null,
    });
  },

  addPendingAsync: (name: string) => {
    const { pendingAsyncValidations } = get();
    const next = new Set(pendingAsyncValidations);
    next.add(name);
    set({ pendingAsyncValidations: next });
  },

  removePendingAsync: (name: string) => {
    const { pendingAsyncValidations } = get();
    const next = new Set(pendingAsyncValidations);
    next.delete(name);
    set({ pendingAsyncValidations: next });
  },
}));
