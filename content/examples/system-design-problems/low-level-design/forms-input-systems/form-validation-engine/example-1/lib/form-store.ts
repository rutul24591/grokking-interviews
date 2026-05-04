import { createStore } from "zustand/vanilla";
import type { FieldName, ValidationPlan, ValidationResult } from "./types";
import { runAsyncValidators, runSyncValidators } from "./validation-engine";

export type FormState<TValues> = {
  values: TValues;
  touched: Record<FieldName, boolean>;
  validating: Record<FieldName, boolean>;
  errors: ValidationResult;
  // per-field token to prevent async race overwrites
  fieldToken: Record<FieldName, number>;
};

export type FormActions<TValues> = {
  setValue: (field: FieldName, value: unknown) => void;
  touch: (field: FieldName) => void;
  validateSync: () => ValidationResult;
  validateAsync: (scope?: { field?: FieldName }) => Promise<ValidationResult>;
};

export type FormStore<TValues> = ReturnType<typeof createFormStore<TValues>>;

export function createFormStore<TValues extends Record<string, unknown>>(args: {
  initialValues: TValues;
  plan: ValidationPlan<TValues>;
}) {
  const { initialValues, plan } = args;

  return createStore<FormState<TValues> & FormActions<TValues>>((set, get) => ({
    values: initialValues,
    touched: {},
    validating: {},
    errors: { isValid: true, fieldErrors: {}, formErrors: [] },
    fieldToken: {},

    setValue(field, value) {
      set((s) => ({
        values: { ...s.values, [field]: value } as TValues,
      }));
      // optionally validate-on-change at call site
    },

    touch(field) {
      set((s) => ({ touched: { ...s.touched, [field]: true } }));
    },

    validateSync() {
      const res = runSyncValidators(plan, get().values);
      set({ errors: res });
      return res;
    },

    async validateAsync(scope) {
      const field = scope?.field;
      const token = (get().fieldToken[field ?? "__form__"] ?? 0) + 1;

      set((s) => ({
        fieldToken: { ...s.fieldToken, [field ?? "__form__"]: token },
        validating: field ? { ...s.validating, [field]: true } : s.validating,
      }));

      const allow = (validatorId: string) => {
        const current = get().fieldToken[field ?? "__form__"] ?? 0;
        return current === token;
      };

      const res = await runAsyncValidators(plan, get().values, allow);
      if (!allow("__final__")) return get().errors;

      set((s) => ({
        errors: res,
        validating: field ? { ...s.validating, [field]: false } : s.validating,
      }));
      return res;
    },
  }));
}

