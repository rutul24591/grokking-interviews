import { createStore } from "zustand/vanilla";
import type { StepGraph, StepId } from "./step-definition";
import type { FieldErrors } from "./validation";
import { isValid } from "./validation";

export type WizardState<TValues> = {
  values: TValues;
  currentStep: StepId;
  visited: Record<StepId, boolean>;
  stepErrors: Record<StepId, FieldErrors>;
  submitting: boolean;
  submissionError: string | null;
};

export type WizardActions<TValues> = {
  setValue: (field: keyof TValues & string, value: unknown) => void;
  validateCurrent: () => { ok: boolean; errors: FieldErrors };
  goNext: () => { ok: boolean; to?: StepId | null; errors?: FieldErrors };
  goPrev: () => { ok: boolean; to?: StepId | null };
  submit: (fn: (values: TValues) => Promise<void>) => Promise<{ ok: boolean }>;
};

export function createWizardStore<TValues extends Record<string, unknown>>(args: {
  graph: StepGraph<TValues>;
  initialValues: TValues;
}) {
  const { graph, initialValues } = args;

  return createStore<WizardState<TValues> & WizardActions<TValues>>((set, get) => ({
    values: initialValues,
    currentStep: graph.start,
    visited: { [graph.start]: true },
    stepErrors: {},
    submitting: false,
    submissionError: null,

    setValue(field, value) {
      set((s) => ({ values: { ...s.values, [field]: value } as TValues }));
    },

    validateCurrent() {
      const step = graph.steps[get().currentStep];
      const errors = step.validate?.(get().values) ?? {};
      set((s) => ({
        stepErrors: { ...s.stepErrors, [step.id]: errors },
      }));
      return { ok: isValid(errors), errors };
    },

    goNext() {
      const step = graph.steps[get().currentStep];
      const { ok, errors } = get().validateCurrent();
      if (!ok) return { ok: false, errors };

      const next = step.next(get().values);
      if (next !== null && !graph.steps[next]) throw new Error(`Unknown step: ${next}`);

      if (next) {
        set((s) => ({
          currentStep: next,
          visited: { ...s.visited, [next]: true },
        }));
      }
      return { ok: true, to: next };
    },

    goPrev() {
      const step = graph.steps[get().currentStep];
      const prev = step.prev?.(get().values) ?? null;
      if (prev !== null && !graph.steps[prev]) throw new Error(`Unknown step: ${prev}`);
      if (!prev) return { ok: false, to: null };
      set({ currentStep: prev });
      return { ok: true, to: prev };
    },

    async submit(fn) {
      // Guard against double-submit.
      if (get().submitting) return { ok: false };
      set({ submitting: true, submissionError: null });
      try {
        // Validate current before final submit (often also validate all visited).
        const { ok } = get().validateCurrent();
        if (!ok) return { ok: false };
        await fn(get().values);
        return { ok: true };
      } catch (e) {
        set({ submissionError: e instanceof Error ? e.message : "Unknown error" });
        return { ok: false };
      } finally {
        set({ submitting: false });
      }
    },
  }));
}

