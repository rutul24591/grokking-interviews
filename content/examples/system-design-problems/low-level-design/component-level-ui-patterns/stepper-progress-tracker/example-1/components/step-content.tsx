'use client';
import { useState, useCallback, type ReactNode } from 'react';

interface StepContentProps {
  stepId: string;
  isActive: boolean;
  isCompleted: boolean;
  isValidating: boolean;
  errors: string[];
  children: ReactNode;
  className?: string;
}

export function StepContent({
  stepId,
  isActive,
  isCompleted,
  isValidating,
  errors,
  children,
  className = '',
}: StepContentProps) {
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleInteraction = useCallback(() => {
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  // Only show errors after user interaction or on submit attempt
  const showErrors = hasInteracted && !isValidating && errors.length > 0;

  return (
    <div
      id={`step-content-${stepId}`}
      role="tabpanel"
      aria-labelledby={`step-${stepId}`}
      className={`${className} ${isActive ? '' : 'hidden'}`}
    >
      {/* Validation state indicator */}
      {isValidating && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm text-blue-700 dark:text-blue-300">Validating...</span>
        </div>
      )}

      {showErrors && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg" role="alert">
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            {errors.map((err, i) => (
              <li key={i} className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isCompleted && !isActive && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Step completed
          </div>
        </div>
      )}

      {/* Wrap children with interaction tracking */}
      <div onClick={handleInteraction} onChange={handleInteraction}>
        {children}
      </div>
    </div>
  );
}

// Wrapper with automatic validation on next
interface StepContentWithValidationProps {
  stepId: string;
  isActive: boolean;
  isCompleted: boolean;
  isValidating: boolean;
  errors: string[];
  onValidate: () => Promise<boolean>;
  children: ReactNode;
  className?: string;
}

export function StepContentWithValidation({
  stepId,
  isActive,
  isCompleted,
  isValidating,
  errors,
  onValidate,
  children,
  className = '',
}: StepContentWithValidationProps) {
  return (
    <StepContent
      stepId={stepId}
      isActive={isActive}
      isCompleted={isCompleted}
      isValidating={isValidating}
      errors={errors}
      className={className}
    >
      {children}
    </StepContent>
  );
}
