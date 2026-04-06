/**
 * Wizard / Multi-step Form — Root Wizard Component
 *
 * Assembles the stepper, step renderer, draft restore prompt, and navigation
 * controls. Manages the overall wizard lifecycle and delegates to child
 * components for rendering.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { WizardConfig, StepDefinition, FieldValue } from "../../lib/wizard-types";
import { useWizard } from "../../hooks/use-wizard";
import { WizardStepper } from "./wizard-stepper";
import { WizardStep } from "./wizard-step";
import { WizardSummary } from "./wizard-summary";

interface WizardProps {
  config: WizardConfig;
}

export function Wizard({ config }: WizardProps) {
  const {
    currentStepIndex,
    currentStep,
    totalSteps,
    effectivePath,
    fieldValues,
    allFieldValues,
    validationResult,
    isCurrentStepValid,
    visitedSteps,
    isLinear,
    isSubmitted,
    hasDraft,
    isRestoring,
    next,
    previous,
    goToStep,
    setFieldValue,
    restoreDraft,
    clearDraft,
    submit,
    isNextDisabled,
    isLastStep,
    isFirstStep,
  } = useWizard(config);

  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // SSR-safe mount
  useEffect(() => {
    setIsMounted(true);
    if (hasDraft) {
      setShowRestorePrompt(true);
    }
  }, [hasDraft]);

  const handleRestoreDraft = useCallback(() => {
    restoreDraft();
    setShowRestorePrompt(false);
  }, [restoreDraft]);

  const handleDiscardDraft = useCallback(() => {
    clearDraft();
    setShowRestorePrompt(false);
  }, [clearDraft]);

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  const handlePrevious = useCallback(() => {
    previous();
  }, [previous]);

  const handleSubmit = useCallback(() => {
    submit();
  }, [submit]);

  const handleStepClick = useCallback(
    (index: number) => {
      goToStep(index);
    },
    [goToStep],
  );

  const handleFieldChange = useCallback(
    (fieldName: string, value: FieldValue) => {
      setFieldValue(fieldName, value);
    },
    [setFieldValue],
  );

  // Submitted state
  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-green-300 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-900/20">
        <svg
          className="mb-4 h-16 w-16 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="mb-2 text-2xl font-bold text-green-800 dark:text-green-200">
          Submitted Successfully
        </h2>
        <p className="text-green-700 dark:text-green-300">
          Your form has been submitted. Thank you!
        </p>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="animate-pulse rounded-lg border border-gray-200 bg-gray-100 p-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 h-6 w-48 rounded bg-gray-300 dark:bg-gray-600" />
        <div className="mb-4 h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Draft Restore Prompt */}
      {showRestorePrompt && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20">
          <p className="mb-3 font-medium text-amber-800 dark:text-amber-200">
            A previous draft was found. Would you like to continue where you left off?
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="rounded-md border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:border-amber-600 dark:bg-gray-800 dark:text-amber-300 dark:hover:bg-amber-900/30"
            >
              Start Fresh
            </button>
          </div>
        </div>
      )}

      {/* Stepper */}
      <WizardStepper
        steps={config.steps}
        currentStepIndex={currentStepIndex}
        visitedSteps={visitedSteps}
        effectivePath={effectivePath}
        isLinear={isLinear}
        onStepClick={handleStepClick}
      />

      {/* Step Content */}
      <div className="mt-8">
        {/* Check if this is the summary step (last step with showSummary enabled) */}
        {config.showSummary && currentStepIndex === totalSteps - 1 ? (
          <WizardSummary
            steps={config.steps}
            allFieldValues={allFieldValues}
            onSubmit={handleSubmit}
            submitLabel={config.submitLabel ?? "Submit"}
          />
        ) : currentStep ? (
          <WizardStep
            step={currentStep}
            fieldValues={fieldValues}
            validationResult={validationResult}
            onFieldChange={handleFieldChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            nextLabel={config.nextLabel ?? "Next"}
            prevLabel={config.prevLabel ?? "Previous"}
            isNextDisabled={isNextDisabled}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep && !config.showSummary}
          />
        ) : null}
      </div>
    </div>
  );
}
