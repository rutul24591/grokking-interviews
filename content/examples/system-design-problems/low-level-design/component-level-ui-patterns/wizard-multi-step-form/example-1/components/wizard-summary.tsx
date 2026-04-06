/**
 * Wizard / Multi-step Form — Summary Component
 *
 * Review screen showing all entered data grouped by step. Renders as a
 * read-only view with semantic markup (definition lists) for accessibility.
 * Includes a Submit button and a Back button to return to the last step.
 */

"use client";

import type { StepDefinition, FieldValue } from "../../lib/wizard-types";

interface WizardSummaryProps {
  /** All step definitions */
  steps: StepDefinition[];
  /** All field values across all steps */
  allFieldValues: Record<string, Record<string, FieldValue>>;
  /** Callback when Submit is clicked */
  onSubmit: () => void;
  /** Label for the Submit button */
  submitLabel: string;
}

/**
 * Format a field value for display based on its type.
 */
function formatValue(
  value: FieldValue,
  fieldType: string,
): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    // Check if it's a File array
    if (value[0] instanceof File) {
      return `${value.length} file(s) uploaded`;
    }
    return value.map(String).join(", ");
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  return String(value);
}

export function WizardSummary({
  steps,
  allFieldValues,
  onSubmit,
  submitLabel,
}: WizardSummaryProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Review Your Information
      </h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Please review all the information below before submitting. Click Edit on
        any section to make changes.
      </p>

      {/* Data grouped by step */}
      <div className="space-y-6">
        {steps.map((step) => {
          const stepValues = allFieldValues[step.id] ?? {};
          const hasData = Object.keys(stepValues).length > 0;

          if (!hasData) return null;

          return (
            <div
              key={step.id}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50"
            >
              <h3 className="mb-3 font-medium text-gray-800 dark:text-gray-200">
                {step.title}
              </h3>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {step.fields.map((field) => {
                  const value = stepValues[field.name];
                  if (value === null || value === undefined || value === "") {
                    return null;
                  }
                  return (
                    <div key={field.name}>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {field.label}
                      </dt>
                      <dd className="mt-0.5 text-sm text-gray-900 dark:text-gray-100">
                        {formatValue(value, field.type)}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      <div className="mt-6 flex items-center justify-end border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          onClick={onSubmit}
          className="rounded-md bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-600"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
