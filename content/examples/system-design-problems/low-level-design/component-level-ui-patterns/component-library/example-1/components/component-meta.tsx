// ============================================================
// components/component-meta.tsx
// Development-only component showing component metadata
// ============================================================

"use client";

import type { ComponentMeta } from "../lib/library-types";
import { getComponent } from "../lib/component-registry";

// ── Props ───────────────────────────────────────────────────

interface ComponentMetaDisplayProps {
  /** Name of the registered component to display metadata for */
  componentName: string;
  /** Whether to show detailed token usage */
  showTokens?: boolean;
  /** Whether to show deprecation info */
  showDeprecation?: boolean;
}

// ── Component ───────────────────────────────────────────────

/**
 * Development-only component that displays metadata for a
 * registered library component.
 *
 * Shows component name, version, accessibility status,
 * associated design tokens, and deprecation info.
 * Automatically hidden in production builds.
 *
 * Usage:
 *   <ComponentMetaDisplay componentName="Button" showTokens />
 */
export function ComponentMetaDisplay({
  componentName,
  showTokens = false,
  showDeprecation = false,
}: ComponentMetaDisplayProps) {
  // Strip from production builds
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const meta = getComponent(componentName);

  if (!meta) {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
        Component &quot;{componentName}&quot; is not registered.
      </div>
    );
  }

  const statusColor = {
    pass: "bg-green-100 text-green-800",
    fail: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    partial: "bg-orange-100 text-orange-800",
  }[meta.a11yStatus];

  return (
    <div className="rounded border border-gray-200 bg-gray-50 p-4 text-sm font-sans">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">{meta.name}</h4>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
          v{meta.version}
        </span>
      </div>

      {/* Description */}
      <p className="mb-3 text-gray-600">{meta.description}</p>

      {/* Accessibility Status */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-gray-500">Accessibility:</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}
        >
          {meta.a11yStatus.toUpperCase()}
        </span>
      </div>

      {/* Violations */}
      {meta.a11yViolations && meta.a11yViolations.length > 0 && (
        <div className="mb-3">
          <span className="font-medium text-gray-700">Violations:</span>
          <ul className="mt-1 list-inside list-disc text-xs text-red-600">
            {meta.a11yViolations.map((v, i) => (
              <li key={i}>
                [{v.impact}] {v.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Category */}
      <div className="mb-3 text-gray-500">
        Category: <span className="text-gray-700">{meta.category}</span>
      </div>

      {/* Design Tokens */}
      {showTokens && meta.tokens.length > 0 && (
        <div className="mb-3">
          <span className="font-medium text-gray-700">Design Tokens:</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {meta.tokens.map((token) => (
              <code
                key={token}
                className="rounded bg-gray-200 px-1.5 py-0.5 text-xs"
              >
                {token}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* Deprecation Info */}
      {showDeprecation && meta.deprecated && meta.deprecationInfo && (
        <div className="rounded border border-amber-200 bg-amber-50 p-3">
          <p className="font-medium text-amber-800">Deprecated</p>
          <p className="mt-1 text-xs text-amber-700">
            Deprecated since v{meta.deprecationInfo.since}.{" "}
            Will be removed in v{meta.deprecationInfo.removeIn}.
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Replacement: <code>{meta.deprecationInfo.replacement}</code>
          </p>
          <a
            href={meta.deprecationInfo.migrationGuide}
            className="mt-1 inline-block text-xs text-amber-600 underline"
          >
            View migration guide
          </a>
        </div>
      )}
    </div>
  );
}
