// FormField — dynamic field renderer based on field type.
// Maps a FieldDefinition to the appropriate input component.

"use client";

import { useField } from "../hooks/use-field";
import type { FieldDefinition, FieldOption } from "../lib/form-types";

interface FormFieldProps {
  definition: FieldDefinition;
}

/** Generate a stable DOM id from the field name. */
function fieldId(name: string): string {
  return `field-${name}`;
}

/** Generate the error message DOM id. */
function errorId(name: string): string {
  return `field-${name}-error`;
}

/** Render a text-like input (text, email, number, date). */
function TextInput({
  id,
  type,
  value,
  placeholder,
  disabled,
  required,
  onChange,
  onBlur,
  ariaDescribedBy,
}: {
  id: string;
  type: string;
  value: unknown;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  ariaDescribedBy?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={(value as string) ?? ""}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      aria-required={required}
      aria-describedby={ariaDescribedBy}
      onChange={(e) => {
        const raw = e.target.value;
        // Coerce to number for number inputs
        onChange(type === "number" ? (raw === "" ? "" : Number(raw)) : raw);
      }}
      onBlur={onBlur}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}

/** Render a select dropdown. */
function SelectInput({
  id,
  value,
  options,
  placeholder,
  disabled,
  required,
  onChange,
  onBlur,
  ariaDescribedBy,
}: {
  id: string;
  value: unknown;
  options: FieldOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  ariaDescribedBy?: string;
}) {
  return (
    <select
      id={id}
      value={(value as string) ?? ""}
      disabled={disabled}
      required={required}
      aria-required={required}
      aria-describedby={ariaDescribedBy}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={String(opt.value)} value={String(opt.value)}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/** Render a checkbox input. */
function CheckboxInput({
  id,
  value,
  disabled,
  onChange,
  onBlur,
  ariaDescribedBy,
}: {
  id: string;
  value: unknown;
  disabled?: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  ariaDescribedBy?: string;
}) {
  return (
    <input
      id={id}
      type="checkbox"
      checked={Boolean(value)}
      disabled={disabled}
      aria-describedby={ariaDescribedBy}
      onChange={(e) => onChange(e.target.checked)}
      onBlur={onBlur}
      className="h-4 w-4 rounded border-border text-accent focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}

/** Render a radio group. */
function RadioInput({
  id,
  name,
  value,
  options,
  disabled,
  required,
  onChange,
  onBlur,
  ariaDescribedBy,
}: {
  id: string;
  name: string;
  value: unknown;
  options: FieldOption[];
  disabled?: boolean;
  required?: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  ariaDescribedBy?: string;
}) {
  return (
    <fieldset
      id={id}
      disabled={disabled}
      aria-required={required}
      aria-describedby={ariaDescribedBy}
      className="space-y-2"
    >
      {options.map((opt) => (
        <label
          key={String(opt.value)}
          className="flex items-center gap-2 text-sm"
        >
          <input
            type="radio"
            name={name}
            value={String(opt.value)}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            onBlur={onBlur}
            className="h-4 w-4 border-border text-accent focus:ring-accent"
          />
          {opt.label}
        </label>
      ))}
    </fieldset>
  );
}

/** Render a file upload input. */
function FileInput({
  id,
  accept,
  multiple,
  disabled,
  onChange,
  onBlur,
  ariaDescribedBy,
}: {
  id: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  ariaDescribedBy?: string;
}) {
  return (
    <input
      id={id}
      type="file"
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      aria-describedby={ariaDescribedBy}
      onChange={(e) => {
        const files = e.target.files;
        onChange(multiple ? Array.from(files ?? []) : files?.[0] ?? null);
      }}
      onBlur={onBlur}
      className="w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
    />
  );
}

/** Loading spinner shown during async validation. */
function ValidatingSpinner() {
  return (
    <div className="ml-2 inline-flex items-center" aria-label="Validating">
      <svg
        className="h-4 w-4 animate-spin text-accent"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
}

/** Main FormField component — dispatches to the correct input type. */
export function FormField({ definition }: FormFieldProps) {
  const {
    value,
    touched,
    error,
    validating,
    disabled,
    required,
    onChange,
    onBlur,
  } = useField(definition.name);

  const id = fieldId(definition.name);
  const errorIdVal = errorId(definition.name);
  const showHint = touched || error !== null;
  const describedBy = showHint && error ? errorIdVal : undefined;

  const renderInput = () => {
    switch (definition.type) {
      case "text":
      case "email":
      case "date":
        return (
          <TextInput
            id={id}
            type={definition.type === "email" ? "email" : definition.type}
            value={value}
            placeholder={definition.placeholder}
            disabled={disabled}
            required={required}
            onChange={onChange}
            onBlur={onBlur}
            ariaDescribedBy={describedBy}
          />
        );

      case "number":
        return (
          <TextInput
            id={id}
            type="number"
            value={value}
            placeholder={definition.placeholder}
            disabled={disabled}
            required={required}
            onChange={onChange}
            onBlur={onBlur}
            ariaDescribedBy={describedBy}
          />
        );

      case "select":
        return (
          <SelectInput
            id={id}
            value={value}
            options={definition.options ?? []}
            placeholder={definition.placeholder}
            disabled={disabled}
            required={required}
            onChange={onChange}
            onBlur={onBlur}
            ariaDescribedBy={describedBy}
          />
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <CheckboxInput
              id={id}
              value={value}
              disabled={disabled}
              onChange={onChange}
              onBlur={onBlur}
              ariaDescribedBy={describedBy}
            />
            <label htmlFor={id} className="text-sm">
              {definition.label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </label>
          </div>
        );

      case "radio":
        return (
          <>
            <legend className="mb-1 text-sm font-medium">{definition.label}</legend>
            <RadioInput
              id={id}
              name={definition.name}
              value={value}
              options={definition.options ?? []}
              disabled={disabled}
              required={required}
              onChange={onChange}
              onBlur={onBlur}
              ariaDescribedBy={describedBy}
            />
          </>
        );

      case "file":
        return (
          <FileInput
            id={id}
            accept={definition.accept}
            multiple={definition.multiple}
            disabled={disabled}
            onChange={onChange}
            onBlur={onBlur}
            ariaDescribedBy={describedBy}
          />
        );

      default:
        return (
          <TextInput
            id={id}
            type="text"
            value={value}
            placeholder={definition.placeholder}
            disabled={disabled}
            required={required}
            onChange={onChange}
            onBlur={onBlur}
            ariaDescribedBy={describedBy}
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      {/* Label (except checkbox, which renders inline) */}
      {definition.type !== "checkbox" && (
        <label
          htmlFor={id}
          className="block text-sm font-medium"
        >
          {definition.label}
          {required && <span className="ml-1 text-red-500">*</span>}
          {validating && <ValidatingSpinner />}
        </label>
      )}

      {/* Input */}
      {renderInput()}

      {/* Helper text */}
      {definition.helperText && !error && (
        <p className="text-xs text-muted-foreground">{definition.helperText}</p>
      )}

      {/* Error message */}
      {showHint && error && (
        <p
          id={errorIdVal}
          role="alert"
          aria-live="assertive"
          className="text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
