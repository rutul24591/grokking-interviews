/**
 * Wizard / Multi-step Form — Stepper Component
 *
 * Progress indicator showing all steps with their status:
 * completed (checkmark), current (highlighted), upcoming (numbered),
 * locked (lock icon in linear mode), and skipped (dimmed).
 *
 * Supports click navigation for completed steps and non-linear mode.
 * Keyboard accessible with Arrow Left/Right.
 */

"use client";

import { useCallback, useRef } from "react";
import type { StepDefinition } from "../../lib/wizard-types";

interface WizardStepperProps {
  /** All step definitions */
  steps: StepDefinition[];
  /** Current active step index */
  currentStepIndex: number;
  /** Completed step IDs */
  visitedSteps: string[];
  /** Effective step path (excludes skipped) */
  effectivePath: string[];
  /** Whether linear mode is enforced */
  isLinear: boolean;
  /** Callback when a step is clicked */
  onStepClick: (index: number) => void;
}

export function WizardStepper({
  steps,
  currentStepIndex,
  visitedSteps,
  effectivePath,
  isLinear,
  onStepClick,
}: WizardStepperProps) {
  const stepperRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
        onStepClick(nextIndex);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prevIndex = Math.max(currentStepIndex - 1, 0);
        onStepClick(prevIndex);
      }
    },
    [currentStepIndex, steps.length, onStepClick],
  );

  return (
    <nav
      ref={stepperRef}
      aria-label="Progress"
      onKeyDown={handleKeyDown}
      className="mb-8"
    >
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = visitedSteps.includes(step.id);
          const isCurrent = index === currentStepIndex;
          const isSkipped = !effectivePath.includes(step.id);
          const isLocked =
            isLinear && !isCompleted && !isCurrent && index > currentStepIndex;

          let statusClass = "";
          let icon = null;

          if (isSkipped) {
            statusClass =
              "text-gray-300 dark:text-gray-600 line-through opacity-50";
            icon = (
              <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm">
                {index + 1}
              </span>
            );
          } else if (isCompleted) {
            statusClass =
              "bg-green-600 text-white dark:bg-green-500";
            icon = (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            );
          } else if (isCurrent) {
            statusClass =
              "border-2 border-blue-600 bg-blue-600 text-white dark:border-blue-400 dark:bg-blue-400";
            icon = (
              <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                {index + 1}
              </span>
            );
          } else if (isLocked) {
            statusClass =
              "border-2 border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500";
            icon = (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            );
          } else {
            // Upcoming
            statusClass =
              "border-2 border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400";
            icon = (
              <span className="flex h-8 w-8 items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
            );
          }

          const canClick =
            isCompleted || (!isLinear && !isLocked) || isCurrent;

          return (
            <li key={step.id} className="flex flex-1 flex-col items-center">
              {/* Connector line (except last) */}
              {index > 0 && (
                <div
                  className={`absolute h-0.5 w-full -translate-x-1/2 ${
                    isCompleted || (index <= currentStepIndex && !isLocked)
                      ? "bg-green-600 dark:bg-green-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                  style={{ top: "1rem" }}
                  aria-hidden="true"
                />
              )}

              {/* Step circle */}
              <button
                type="button"
                disabled={!canClick}
                onClick={() => canClick && onStepClick(index)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${step.title}${isCompleted ? " (completed)" : ""}${isCurrent ? " (current)" : ""}${isLocked ? " (locked)" : ""}`}
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${statusClass} ${canClick ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"}`}
              >
                {icon}
              </button>

              {/* Step label */}
              <span
                className={`mt-2 truncate text-xs font-medium max-w-20 text-center ${
                  isCurrent
                    ? "text-blue-700 dark:text-blue-300"
                    : isCompleted
                      ? "text-green-700 dark:text-green-300"
                      : isSkipped
                        ? "text-gray-300 dark:text-gray-600"
                        : "text-gray-500 dark:text-gray-400"
                }`}
                title={step.title}
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
