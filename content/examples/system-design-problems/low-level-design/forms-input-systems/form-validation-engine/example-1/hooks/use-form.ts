import { useMemo } from "react";
import { useStore } from "zustand";
import type { ValidationPlan } from "../lib/types";
import { createFormStore } from "../lib/form-store";

export function useForm<TValues extends Record<string, unknown>>(args: {
  initialValues: TValues;
  plan: ValidationPlan<TValues>;
}) {
  const store = useMemo(
    () => createFormStore({ initialValues: args.initialValues, plan: args.plan }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const values = useStore(store, (s) => s.values);
  const errors = useStore(store, (s) => s.errors);
  const touched = useStore(store, (s) => s.touched);
  const validating = useStore(store, (s) => s.validating);

  return {
    values,
    errors,
    touched,
    validating,
    setValue: store.getState().setValue,
    touch: store.getState().touch,
    validateSync: store.getState().validateSync,
    validateAsync: store.getState().validateAsync,
  };
}

