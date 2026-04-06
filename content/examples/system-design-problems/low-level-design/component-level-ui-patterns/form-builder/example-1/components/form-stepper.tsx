// FormStepper — step progress indicator with completed/current/upcoming states.
// Announces current step to screen readers via aria-live region.

"use client";

import { useEffect, useRef } from "react";
import { useFormStore } from "../lib/form-store";

interface StepInfo {
  id: string;
  title: string;
}

interface FormStepperProps {
  /** All steps in the form. */
  steps: StepInfo[];
  /** Current step index (0-based). */
  currentStep: number;
}

/** Checkmark icon for completed steps. */
function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-white"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function FormStepper({ steps, currentStep }: FormStepperProps) {
  const stepValidity = useFormStore((state) => state.stepValidity);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Announce step change to screen readers
  useEffect(() => {
    if (liveRegionRef.current && steps[currentStep]) {
      liveRegionRef.current.textContent = `Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep].title}`;
    }
  }, [currentStep, steps]);

  const canNavigateToStep = (index: number): boolean => {
    if (index === currentStep) return false;
    if (index < currentStep) return true; // Can always go back
    // Can navigate forward only if all preceding steps are valid
    return steps
      .slice(0, index)
      .every((step) => stepValidity[step.id]);
  };

  return (
    <nav aria-label="Form progress" className="w-full">
      {/* Screen reader announcement */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Visual stepper */}
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;
          const isNavigable = canNavigateToStep(index);

          return (
            <li
              key={step.id}
              className="flex flex-1 flex-col items-center"
            >
              {/* Step indicator line */}
              {index > 0 && (
                <div
                  className={`absolute h-0.5 w-full ${
                    index <= currentStep ? "bg-accent" : "bg-border"
                  }`}
                  style={{
                    left: "-50%",
                    top: "1rem",
                    width: "100%",
                  }}
                />
              )}

              {/* Step circle */}
              <button
                type="button"
                onClick={() => {
                  if (isNavigable) {
                    useFormStore.getState().goToStep(index);
                  }
                }}
                disabled={!isNavigable}
                aria-current={isCurrent ? "step" : undefined}
                aria-disabled={!isNavigable}
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isCompleted
                    ? "bg-accent text-white"
                    : isCurrent
                      ? "bg-accent text-white ring-2 ring-accent ring-offset-2"
                      : "bg-muted text-muted-foreground"
                } ${isNavigable && !isCurrent ? "cursor-pointer hover:bg-accent/80 hover:text-white" : "cursor-not-allowed"}`}
              >
                {isCompleted ? <CheckIcon /> : index + 1}
              </button>

              {/* Step title */}
              <span
                className={`mt-2 text-center text-xs font-medium ${
                  isCurrent
                    ? "text-foreground"
                    : isCompleted
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50"
                }`}
              >
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
