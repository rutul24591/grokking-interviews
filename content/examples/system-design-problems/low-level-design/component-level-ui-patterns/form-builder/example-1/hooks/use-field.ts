// useField hook — provides field-level state and actions to individual field components.
// Subscribes to the Zustand store for its specific field using a selector.

import { useCallback, useRef, useEffect } from "react";
import { useFormStore } from "../lib/form-store";

/** Return type of the useField hook. */
interface UseFieldReturn {
  /** Current field value. */
  value: unknown;
  /** Whether the user has visited this field. */
  touched: boolean;
  /** Whether the value has changed from the initial value. */
  dirty: boolean;
  /** Validation error message (null if valid). */
  error: string | null;
  /** Whether an async validator is currently running. */
  validating: boolean;
  /** Whether the field is disabled. */
  disabled: boolean;
  /** Whether the field is required. */
  required: boolean;
  /** onChange handler — updates store value and marks dirty. */
  onChange: (value: unknown) => void;
  /** onBlur handler — marks field as touched and triggers validation. */
  onBlur: () => void;
}

/**
 * Hook for individual field state management.
 * Subscribes to the Zustand store for the specified field name,
 * providing value, touched, dirty, error, validating state,
 * and onChange/onBlur handlers.
 *
 * @param name - The field name (must match a registered field definition).
 * @returns Field state and handlers.
 */
export function useField(name: string): UseFieldReturn {
  // Subscribe to only this field's state — prevents unnecessary re-renders
  const fieldState = useFormStore((state) => state.fields[name]);
  const definition = useFormStore((state) => state.definitions[name]);

  // Refs for debounce timing and async validation tracking
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const asyncValidatorRunning = useRef(false);

  const onChange = useCallback(
    (value: unknown) => {
      // Update store immediately for responsive UI
      useFormStore.getState().setFieldValue(name, value);

      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Schedule validation after debounce (default 300ms)
      debounceTimerRef.current = setTimeout(() => {
        // In a real implementation, trigger validation pipeline here
        // For now, clear the error on change — full validation runs on blur
        const currentField = useFormStore.getState().fields[name];
        if (currentField && currentField.dirty) {
          // Run sync validators on the new value
          // This would integrate with the validation engine
        }
      }, 300);
    },
    [name]
  );

  const onBlur = useCallback(() => {
    // Mark as touched
    useFormStore.getState().setFieldTouched(name);

    // Clear debounce timer and run validation immediately
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // In a real implementation, run full validation pipeline here:
    // 1. Run sync validators → set error if fails
    // 2. Run async validators with debounce → set validating=true, then set error
    const field = useFormStore.getState().fields[name];
    const def = useFormStore.getState().definitions[name];
    if (field && def && def.validators) {
      // Sync validation
      // Async validation (would call validation engine)
    }
  }, [name]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    value: fieldState?.value ?? definition?.defaultValue ?? "",
    touched: fieldState?.touched ?? false,
    dirty: fieldState?.dirty ?? false,
    error: fieldState?.error ?? null,
    validating: fieldState?.validating ?? false,
    disabled: definition?.disabled ?? false,
    required: definition?.required ?? false,
    onChange,
    onBlur,
  };
}
