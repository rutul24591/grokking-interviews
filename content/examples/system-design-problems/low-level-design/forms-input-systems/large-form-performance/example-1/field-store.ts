import { createStore } from "zustand/vanilla";

export type FieldId = string;

export type FieldState = {
  value: unknown;
  error: string | null;
  touched: boolean;
};

export type FormState = {
  fields: Record<FieldId, FieldState>;
};

export type FormActions = {
  setFieldValue: (id: FieldId, value: unknown) => void;
  setFieldError: (id: FieldId, error: string | null) => void;
  touch: (id: FieldId) => void;
};

export function createLargeFormStore(initial: FormState) {
  return createStore<FormState & FormActions>((set) => ({
    ...initial,
    setFieldValue(id, value) {
      set((s) => ({ fields: { ...s.fields, [id]: { ...s.fields[id], value } } }));
    },
    setFieldError(id, error) {
      set((s) => ({ fields: { ...s.fields, [id]: { ...s.fields[id], error } } }));
    },
    touch(id) {
      set((s) => ({ fields: { ...s.fields, [id]: { ...s.fields[id], touched: true } } }));
    },
  }));
}

// Interview note: the *important* part is selector subscriptions per-field,
// not reading the entire `fields` object in each component.

