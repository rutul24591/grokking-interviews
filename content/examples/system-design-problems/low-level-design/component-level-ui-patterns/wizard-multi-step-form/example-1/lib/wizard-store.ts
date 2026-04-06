/**
 * Wizard / Multi-step Form — Zustand Store
 *
 * Manages the global wizard state: current step index, field values keyed by
 * step, validation results, visited steps, navigation history, and draft
 * persistence to localStorage with JSON serialization and versioned schema.
 */

import { create } from "zustand";
import type {
  WizardState,
  StepDefinition,
  StepValidationResult,
  FieldValue,
  WizardDraft,
  WizardSubmitPayload,
} from "./wizard-types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SCHEMA_VERSION = 1;
const DRAFT_KEY_PREFIX = "wizard";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildDraftKey(rawKey: string): string {
  return `${DRAFT_KEY_PREFIX}:v${SCHEMA_VERSION}:${rawKey}`;
}

function serializeDraft(state: Partial<WizardState>): WizardDraft {
  return {
    schemaVersion: SCHEMA_VERSION,
    timestamp: Date.now(),
    fieldValues: state.fieldValues ?? {},
    validationResults: state.validationResults ?? {},
    visitedSteps: state.visitedSteps ?? [],
    currentStepIndex: state.currentStepIndex ?? 0,
    history: state.history ?? [],
  };
}

function saveDraftToLocalStorage(key: string, draft: WizardDraft): void {
  try {
    localStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // Storage quota exceeded — silently fail
    console.warn("[Wizard] Failed to save draft: localStorage quota exceeded.");
  }
}

function loadDraftFromLocalStorage(key: string): WizardDraft | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WizardDraft;
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      console.warn(
        `[Wizard] Draft schema version ${parsed.schemaVersion} does not match current ${SCHEMA_VERSION}. Discarding.`,
      );
      return null;
    }
    return parsed;
  } catch {
    console.warn("[Wizard] Failed to parse draft data. Discarding corrupted data.");
    return null;
  }
}

function clearDraftFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Initial state factory
// ---------------------------------------------------------------------------

function createInitialState(
  steps: StepDefinition[],
  draftKey: string,
  isLinear: boolean,
): WizardState {
  const initialValues: Record<string, Record<string, FieldValue>> = {};
  const initialValidation: Record<string, StepValidationResult> = {};

  for (const step of steps) {
    initialValues[step.id] = {};
    initialValidation[step.id] = {
      isValid: false,
      errors: {},
      asyncStatus: "idle",
    };
  }

  return {
    steps,
    currentStepIndex: 0,
    fieldValues: initialValues,
    validationResults: initialValidation,
    visitedSteps: [],
    history: [],
    isLinear,
    isSubmitted: false,
    hasDraft: false,
    draftKey: buildDraftKey(draftKey),
    schemaVersion: SCHEMA_VERSION,
    isRestoring: false,
    restoreError: null,
  };
}

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

interface WizardStore extends WizardState {
  // Navigation
  next: () => void;
  previous: () => void;
  goToStep: (index: number) => void;
  setStepValidation: (stepId: string, result: StepValidationResult) => void;
  // Field values
  setFieldValue: (stepId: string, fieldName: string, value: FieldValue) => void;
  // Draft
  saveDraft: () => void;
  restoreDraft: () => boolean;
  clearDraft: () => void;
  // Submit
  submit: () => WizardSubmitPayload | null;
  // Reset
  reset: () => void;
  // Internal
  markVisited: (stepId: string) => void;
}

// ---------------------------------------------------------------------------
// Store creation factory — returns a bound store for a given configuration
// ---------------------------------------------------------------------------

export function createWizardStore(
  steps: StepDefinition[],
  draftKey: string = "default",
  isLinear: boolean = true,
) {
  const storeKey = buildDraftKey(draftKey);

  return create<WizardStore>((set, get) => {
    const base = createInitialState(steps, draftKey, isLinear);

    // Attempt draft restore on store creation
    const existingDraft = loadDraftFromLocalStorage(storeKey);
    if (existingDraft) {
      base.hasDraft = true;
      base.fieldValues = existingDraft.fieldValues;
      base.validationResults = existingDraft.validationResults;
      base.visitedSteps = existingDraft.visitedSteps;
      base.currentStepIndex = existingDraft.currentStepIndex;
      base.history = existingDraft.history;
    }

    return {
      ...base,

      next: () => {
        const { currentStepIndex, steps: currentSteps, history } = get();
        if (currentStepIndex < currentSteps.length - 1) {
          const currentStep = currentSteps[currentStepIndex];
          set({
            currentStepIndex: currentStepIndex + 1,
            history: [...history, currentStep.id],
          });
        }
      },

      previous: () => {
        const { history, steps: currentSteps } = get();
        if (history.length > 0) {
          const prevStepId = history[history.length - 1];
          const prevIndex = currentSteps.findIndex((s) => s.id === prevStepId);
          if (prevIndex >= 0) {
            set({
              currentStepIndex: prevIndex,
              history: history.slice(0, -1),
            });
          }
        } else if (get().currentStepIndex > 0) {
          set({ currentStepIndex: get().currentStepIndex - 1 });
        }
      },

      goToStep: (index: number) => {
        const { steps: currentSteps, isLinear: linear, visitedSteps } = get();
        if (index < 0 || index >= currentSteps.length) return;

        // In linear mode, only allow navigation to visited steps or the next unvisited
        if (linear) {
          const maxAccessible = visitedSteps.length;
          if (index > maxAccessible) return;
        }

        const currentStep = currentSteps[get().currentStepIndex];
        set({
          currentStepIndex: index,
          history: [...get().history, currentStep.id],
        });
      },

      setStepValidation: (stepId: string, result: StepValidationResult) => {
        set((state) => ({
          validationResults: {
            ...state.validationResults,
            [stepId]: result,
          },
        }));
      },

      setFieldValue: (stepId: string, fieldName: string, value: FieldValue) => {
        set((state) => ({
          fieldValues: {
            ...state.fieldValues,
            [stepId]: {
              ...(state.fieldValues[stepId] ?? {}),
              [fieldName]: value,
            },
          },
        }));
      },

      saveDraft: () => {
        const state = get();
        const draft = serializeDraft(state);
        saveDraftToLocalStorage(state.draftKey, draft);
      },

      restoreDraft: () => {
        const { draftKey: key } = get();
        const draft = loadDraftFromLocalStorage(key);
        if (!draft) {
          set({ isRestoring: false, restoreError: "No draft found." });
          return false;
        }

        set({
          fieldValues: draft.fieldValues,
          validationResults: draft.validationResults,
          visitedSteps: draft.visitedSteps,
          currentStepIndex: draft.currentStepIndex,
          history: draft.history,
          hasDraft: true,
          isRestoring: false,
          restoreError: null,
        });
        return true;
      },

      clearDraft: () => {
        const { draftKey: key } = get();
        clearDraftFromLocalStorage(key);
        set({ hasDraft: false });
      },

      submit: () => {
        const { steps: currentSteps, fieldValues, visitedSteps } = get();

        // Flatten all field values across steps
        const flattened: Record<string, FieldValue> = {};
        for (const [stepId, fields] of Object.entries(fieldValues)) {
          for (const [fieldName, value] of Object.entries(fields)) {
            flattened[`${stepId}.${fieldName}`] = value;
          }
        }

        const payload: WizardSubmitPayload = {
          data: flattened,
          completedAt: Date.now(),
          totalSteps: currentSteps.length,
          completedSteps: visitedSteps.length,
        };

        set({ isSubmitted: true });
        clearDraftFromLocalStorage(get().draftKey);
        return payload;
      },

      reset: () => {
        const state = get();
        const fresh = createInitialState(state.steps, "default", state.isLinear);
        fresh.draftKey = state.draftKey;
        clearDraftFromLocalStorage(state.draftKey);
        set(fresh);
      },

      markVisited: (stepId: string) => {
        set((state) => ({
          visitedSteps: state.visitedSteps.includes(stepId)
            ? state.visitedSteps
            : [...state.visitedSteps, stepId],
        }));
      },
    };
  });
}
