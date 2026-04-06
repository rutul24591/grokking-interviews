"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type {
  FieldErrors,
  FormState,
} from "../../lib/validation-types";

// ─── Context Shape ───────────────────────────────────────────────────

interface ValidationContextValue {
  values: Record<string, unknown>;
  errors: FieldErrors;
  touched: Set<string>;
  isValid: boolean;
  errorCount: number;
  setValue: (fieldName: string, value: unknown) => void;
  isFieldTouched: (fieldName: string) => boolean;
  getFieldErrors: (fieldName: string) => FieldErrors[string];
  isFieldInvalid: (fieldName: string) => boolean;
}

const ValidationContext = createContext<ValidationContextValue | null>(null);

// ─── Provider Props ──────────────────────────────────────────────────

interface ValidationProviderProps {
  values: Record<string, unknown>;
  errors: FieldErrors;
  touched: Set<string>;
  isValid: boolean;
  errorCount: number;
  setValue: (fieldName: string, value: unknown) => void;
  children: ReactNode;
}

/**
 * Context provider for form-level validation state.
 * Makes validation state available to all descendant components without prop drilling.
 */
export function ValidationProvider({
  values,
  errors,
  touched,
  isValid,
  errorCount,
  setValue,
  children,
}: ValidationProviderProps) {
  const contextValue = useMemo<ValidationContextValue>(
    () => ({
      values,
      errors,
      touched,
      isValid,
      errorCount,
      setValue,
      isFieldTouched: (fieldName: string) => touched.has(fieldName),
      getFieldErrors: (fieldName: string) => errors[fieldName] || [],
      isFieldInvalid: (fieldName: string) =>
        errors[fieldName] !== undefined && errors[fieldName].length > 0,
    }),
    [values, errors, touched, isValid, errorCount, setValue]
  );

  return (
    <ValidationContext.Provider value={contextValue}>
      {children}
    </ValidationContext.Provider>
  );
}

/**
 * Hook to consume the validation context.
 * Must be used within a ValidationProvider.
 */
export function useValidationContext(): ValidationContextValue {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error(
      "useValidationContext must be used within a ValidationProvider"
    );
  }
  return context;
}

/**
 * Selector hook to get a specific field&apos;s validation state.
 * Prevents unnecessary re-renders by only subscribing to the field&apos;s data.
 */
export function useFieldContext(fieldName: string) {
  const context = useValidationContext();

  return useMemo(
    () => ({
      value: context.values[fieldName],
      errors: context.errors[fieldName] || [],
      touched: context.touched.has(fieldName),
      invalid: context.isFieldInvalid(fieldName),
      setValue: (value: unknown) => context.setValue(fieldName, value),
    }),
    [context, fieldName]
  );
}
