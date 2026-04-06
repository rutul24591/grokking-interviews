// ============================================================
// components/library-playground.tsx
// Interactive component viewer with prop controls
// ============================================================

"use client";

import { useState, useMemo, type ReactNode } from "react";
import type { PlaygroundControl } from "../lib/library-types";

// ── Props ───────────────────────────────────────────────────

interface LibraryPlaygroundProps {
  /** Component name being showcased */
  componentName: string;
  /** Available prop controls for this component */
  controls: PlaygroundControl[];
  /** Render function that receives current prop values and returns the component */
  renderComponent: (props: Record<string, string | number | boolean>) => ReactNode;
  /** Optional code snippet showing current prop values */
  showCodePreview?: boolean;
}

// ── Component ───────────────────────────────────────────────

/**
 * Interactive playground component that lets consumers
 * experiment with component props in real-time.
 *
 * Displays prop controls (select, text, number, boolean, color)
 * in a sidebar and renders the component preview with the
 * current prop values applied.
 *
 * Usage:
 *   <LibraryPlayground
 *     componentName="Button"
 *     controls={[
 *       { prop: "variant", controlType: "select", label: "Variant",
 *         options: ["primary", "secondary", "ghost"], defaultValue: "primary" },
 *       { prop: "size", controlType: "select", label: "Size",
 *         options: ["sm", "md", "lg"], defaultValue: "md" },
 *       { prop: "disabled", controlType: "boolean", label: "Disabled",
 *         defaultValue: false },
 *     ]}
 *     renderComponent={(props) => <Button {...props}>Click me</Button>}
 *   />
 */
export function LibraryPlayground({
  componentName,
  controls,
  renderComponent,
  showCodePreview = true,
}: LibraryPlaygroundProps) {
  // Current prop values, initialized to defaults
  const [propValues, setPropValues] = useState<Record<string, string | number | boolean>>(() => {
    const initial: Record<string, string | number | boolean> = {};
    for (const control of controls) {
      initial[control.prop] = control.defaultValue;
    }
    return initial;
  });

  // Update a single prop value
  const updateProp = (prop: string, value: string | number | boolean) => {
    setPropValues((prev) => ({ ...prev, [prop]: value }));
  };

  // Reset all props to defaults
  const resetProps = () => {
    const defaults: Record<string, string | number | boolean> = {};
    for (const control of controls) {
      defaults[control.prop] = control.defaultValue;
    }
    setPropValues(defaults);
  };

  // Generate a code preview string
  const codePreview = useMemo(() => {
    const propStrings = Object.entries(propValues)
      .filter(([, value]) => value !== false && value !== "" && value !== 0)
      .map(([key, value]) => {
        if (typeof value === "boolean") {
          return value ? key : "";
        }
        return `${key}="${value}"`;
      })
      .filter(Boolean);

    return `<${componentName}${propStrings.length > 0 ? " " : ""}${propStrings.join(" ")}>
  Content
</${componentName}>`;
  }, [componentName, propValues]);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 font-sans lg:flex-row">
      {/* Controls Sidebar */}
      <div className="w-full space-y-4 lg:w-64 lg:flex-none">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Controls</h3>
          <button
            onClick={resetProps}
            className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
          >
            Reset
          </button>
        </div>

        {controls.map((control) => (
          <div key={control.prop} className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              {control.label}
            </label>

            {control.controlType === "select" && control.options && (
              <select
                value={propValues[control.prop] as string}
                onChange={(e) => updateProp(control.prop, e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm"
              >
                {control.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {control.controlType === "text" && (
              <input
                type="text"
                value={propValues[control.prop] as string}
                onChange={(e) => updateProp(control.prop, e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm"
              />
            )}

            {control.controlType === "number" && (
              <input
                type="number"
                value={propValues[control.prop] as number}
                onChange={(e) =>
                  updateProp(control.prop, Number(e.target.value))
                }
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm"
              />
            )}

            {control.controlType === "boolean" && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={propValues[control.prop] as boolean}
                  onChange={(e) => updateProp(control.prop, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">
                  {propValues[control.prop] ? "Enabled" : "Disabled"}
                </span>
              </div>
            )}

            {control.controlType === "color" && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={propValues[control.prop] as string}
                  onChange={(e) => updateProp(control.prop, e.target.value)}
                  className="h-8 w-8 rounded border border-gray-300"
                />
                <code className="text-xs text-gray-500">
                  {propValues[control.prop] as string}
                </code>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Preview Area */}
      <div className="min-h-[200px] flex-1">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Preview</h3>
        <div className="flex min-h-[120px] items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-8">
          {renderComponent(propValues)}
        </div>

        {/* Code Preview */}
        {showCodePreview && (
          <div className="mt-4 rounded-lg bg-gray-900 p-4">
            <pre className="overflow-x-auto text-sm text-green-400">
              <code>{codePreview}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
