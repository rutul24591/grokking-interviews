"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  ValidationError,
  AsyncValidatorFn,
  UseAsyncValidationReturn,
} from "../lib/validation-types";
import { createAsyncValidator } from "../lib/async-validator";

interface UseAsyncValidationOptions {
  validatorFn: AsyncValidatorFn;
  debounceMs?: number;
  cacheSize?: number;
}

/**
 * Async validation hook with debounce, loading state, and AbortController cancellation.
 */
export function useAsyncValidation(
  options: UseAsyncValidationOptions
): UseAsyncValidationReturn {
  const {
    validatorFn,
    debounceMs = 300,
    cacheSize = 100,
  } = options;

  const [isAsyncValidating, setIsAsyncValidating] = useState(false);
  const [asyncError, setAsyncError] = useState<ValidationError | null>(null);

  const asyncValidatorRef = useRef(
    createAsyncValidator({
      checkFn: validatorFn,
      debounceMs,
      cacheMaxSize: cacheSize,
    })
  );

  const isMountedRef = useRef(true);

  const validateAsync = useCallback(
    async (value: unknown): Promise<ValidationError | null> => {
      return new Promise<ValidationError | null>((resolve) => {
        setIsAsyncValidating(true);
        setAsyncError(null);

        asyncValidatorRef.current.validate(value, (error) => {
          if (isMountedRef.current) {
            setAsyncError(error);
            setIsAsyncValidating(false);
          }
          resolve(error);
        });
      });
    },
    []
  );

  const cancelAsync = useCallback(() => {
    asyncValidatorRef.current.cancel();
    if (isMountedRef.current) {
      setIsAsyncValidating(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      asyncValidatorRef.current.cancel();
    };
  }, []);

  return {
    isAsyncValidating,
    asyncError,
    validateAsync,
    cancelAsync,
  };
}
