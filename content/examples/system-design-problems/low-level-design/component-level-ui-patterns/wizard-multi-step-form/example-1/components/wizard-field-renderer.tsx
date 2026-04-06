/**
 * Wizard / Multi-step Form — Dynamic Field Renderer
 *
 * Renders form fields dynamically based on step field definitions. Supports
 * text, email, number, textarea, select, radio, checkbox, date, phone, and
 * file input types. Displays validation errors inline below each field.
 */

"use client";

import { forwardRef } from "react";
import type { FieldDefinition, FieldValue } from "../../lib/wizard-types";

interface WizardFieldRendererProps {
  /** Field definition */
  field: FieldDefinition;
  /** Current value */
  value: FieldValue;
  /** Error message (if any) */
  error?: string;
  /** Callback when value changes */
  onChange: (value: FieldValue) => void;
  /** Callback when field is blurred */
  onBlur?: () => void;
}

export const WizardFieldRenderer = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  WizardFieldRendererProps
>(({ field, value, error, onChange, onBlur }, ref) => {
  const id = `field-${field.name}`;
  const errorId = `error-${field.name}`;
  const hasError = error !== undefined && error !== "";

  const commonProps = {
    id,
    name: field.name,
    "aria-invalid": hasError ? "true" : "false",
    "aria-describedby": hasError ? errorId : undefined,
    className: `block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
      hasError
        ? "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
        : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
    } text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`,
    onBlur,
  };

  switch (field.type) {
    case "textarea":
      return (
        <div>
          <label
            htmlFor={id}
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {field.label}
            {field.required && <span className="ml-1 text-red-500">*</span>}
          </label>
          <textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            {...commonProps}
            value={typeof value === "string" ? value : ""}
            placeholder={field.placeholder}
            rows={4}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.helpText && !hasError && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {field.helpText}
            </p>
          )}
          {hasError && (
            <p id={errorId} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
      );

    case "select":
      return (
        <div>
          <label
            htmlFor={id}
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {field.label}
            {field.required && <span className="ml-1 text-red-500">*</span>}
          </label>
          <select
            ref={ref as React.ForwardedRef<HTMLSelectElement>}
            {...commonProps}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">{field.placeholder ?? "Select..."}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {field.helpText && !hasError && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {field.helpText}
            </p>
          )}
          {hasError && (
            <p id={errorId} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
      );

    case "radio":
      return (
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="ml-1 text-red-500">*</span>}
          </legend>
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  ref={ref as React.ForwardedRef<HTMLInputElement>}
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => onChange(opt.value)}
                  onBlur={onBlur}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                  aria-invalid={hasError ? "true" : "false"}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
          {field.helpText && !hasError && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {field.helpText}
            </p>
          )}
          {hasError && (
            <p id={errorId} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
        </fieldset>
      );

    case "checkbox":
      return (
        <div>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              type="checkbox"
              name={field.name}
              checked={typeof value === "boolean" ? value : false}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              aria-invalid={hasError ? "true" : "false"}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </span>
          </label>
          {field.helpText && !hasError && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {field.helpText}
            </p>
          )}
          {hasError && (
            <p id={errorId} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
      );

    case "file":
      return (
        <div>
          <label
            htmlFor={id}
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {field.label}
            {field.required && <span className="ml-1 text-red-500">*</span>}
          </label>
          <input
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            type="file"
            id={id}
            name={field.name}
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                onChange(Array.from(files));
              }
            }}
            onBlur={onBlur}
            accept={field.fileOptions?.acceptedMimeTypes.join(",")}
            className={`block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300 dark:hover:file:bg-blue-900/50 ${
              hasError
                ? "text-red-600 dark:text-red-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? errorId : undefined}
          />
          {field.helpText && !hasError && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {field.helpText}
              {field.fileOptions &&
                ` (Max: ${(field.fileOptions.maxSizeBytes / (1024 * 1024)).toFixed(0)}MB, ${field.fileOptions.acceptedMimeTypes.join(", ")})`}
            </p>
          )}
          {hasError && (
            <p id={errorId} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
      );

    default:
      // text, email, number, date, phone
      return (
        <div>
          <label
            htmlFor={id}
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {field.label}
            {field.required && <span className="ml-1 text-red-500">*</span>}
          </label>
          <input
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            {...commonProps}
            type={field.type === "phone" ? "tel" : field.type}
            value={typeof value === "string" || typeof value === "number" ? value : ""}
            placeholder={field.placeholder}
            onChange={(e) => {
              if (field.type === "number") {
                const num = e.target.valueAsNumber;
                onChange(isNaN(num) ? "" : num);
              } else {
                onChange(e.target.value);
              }
            }}
          />
          {field.helpText && !hasError && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {field.helpText}
            </p>
          )}
          {hasError && (
            <p id={errorId} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
      );
  }
});

WizardFieldRenderer.displayName = "WizardFieldRenderer";
