"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  ValidationError,
  UseFieldValidationReturn,
} from "../lib/validation-types";

interface UseFieldValidationOptions {
  initialValue?: unknown;
  onChange?: (value: unknown) => void;
  onBlur?: () => void;
  validateOn?: "change" | "blur";
}

/**
 * Per-field validation hook.
 * Manages field value, touched state, errors, and async loading state.
 */
export function useFieldValidation(
  fieldName: string,
  validate: (
    trigger: "change" | "blur",
    value: unknown
  ) => ValidationError[],
  options: UseFieldValidationOptions = {}
): UseFieldValidationReturn {
  const {
    initialValue = "",
    onChange: externalOnChange,
    onBlur: externalOnBlur,
    validateOn = "blur",
  } = options;

  const [value, setValue] = useState<unknown>(initialValue);
  const [touched, setTouched] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [asyncLoading, setAsyncLoading] = useState(false);

  const valueRef = useRef(value);
  valueRef.current = value;

  const handleFieldChange = useCallback(
    (newValue: unknown) => {
      setValue(newValue);
      setTouched(true);

      externalOnChange?.(newValue);

      if (validateOn === "change") {
        const validationErrors = validate("change", newValue);
        setErrors(validationErrors);
      }
    },
    [validate, externalOnChange, validateOn]
  );

  const handleFieldBlur = useCallback(() => {
    setTouched(true);
    externalOnBlur?.();

    if (validateOn === "blur" || validateOn === "change") {
      const validationErrors = validate("blur", valueRef.current);
      setErrors(validationErrors);
    }
  }, [validate, externalOnBlur, validateOn]);

  const setError = useCallback(
    (error: ValidationError | null) => {
      if (error === null) {
        setErrors([]);
      } else {
        setErrors((prev) => {
          // Replace errors with the same code, or add new error
          const filtered = prev.filter((e) => e.code !== error.code);
          return [...filtered, error];
        });
      }
      setAsyncLoading(false);
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setErrors([]);
      setAsyncLoading(false);
    };
  }, []);

  return {
    value,
    errors,
    touched,
    asyncLoading,
    onChange: handleFieldChange,
    onBlur: handleFieldBlur,
    setError,
  };
}
