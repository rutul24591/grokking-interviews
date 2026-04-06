// ============================================================
// components/documentation-page.tsx
// MDX-based documentation with live examples
// ============================================================

"use client";

import { type ReactNode } from "react";

// ── Props ───────────────────────────────────────────────────

interface DocumentationPageProps {
  /** Page title */
  title: string;
  /** Component name this page documents */
  componentName: string;
  /** Page sections */
  sections: DocSection[];
  /** Live example to render */
  liveExample?: {
    description: string;
    render: () => ReactNode;
  };
  /** Do examples (correct usage patterns) */
  doExamples?: Array<{
    description: string;
    render: () => ReactNode;
  }>;
  /** Don't examples (anti-patterns to avoid) */
  dontExamples?: Array<{
    description: string;
    render: () => ReactNode;
  }>;
  /** Props table definition */
  propsTable?: PropDefinition[];
}

interface DocSection {
  heading: string;
  content: string;
}

interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
}

// ── Component ───────────────────────────────────────────────

/**
 * Renders an MDX-style documentation page for a component.
 *
 * Includes structured sections (description, usage, props table),
 * live component examples, do/don't patterns, and a generated
 * props reference table.
 *
 * In production, this would parse MDX files and render them
 * with custom components for live previews.
 */
export function DocumentationPage({
  title,
  componentName,
  sections,
  liveExample,
  doExamples,
  dontExamples,
  propsTable,
}: DocumentationPageProps) {
  return (
    <article className="mx-auto max-w-4xl font-sans">
      {/* Page Header */}
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-lg text-gray-600">
          Documentation for the <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">{componentName}</code> component.
        </p>
      </header>

      {/* Content Sections */}
      {sections.map((section, index) => (
        <section key={index} className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            {section.heading}
          </h2>
          <p className="leading-relaxed text-gray-700">{section.content}</p>
        </section>
      ))}

      {/* Live Example */}
      {liveExample && (
        <section className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Interactive Example
          </h2>
          <p className="mb-4 text-gray-600">{liveExample.description}</p>
          <div className="flex min-h-[80px] items-center justify-center rounded-lg border border-gray-200 bg-white p-6">
            {liveExample.render()}
          </div>
        </section>
      )}

      {/* Props Table */}
      {propsTable && propsTable.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Props</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 pr-4 text-left font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="py-2 pr-4 text-left font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="py-2 pr-4 text-left font-semibold text-gray-900">
                    Required
                  </th>
                  <th className="py-2 pr-4 text-left font-semibold text-gray-900">
                    Default
                  </th>
                  <th className="py-2 text-left font-semibold text-gray-900">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {propsTable.map((prop) => (
                  <tr key={prop.name}>
                    <td className="py-2 pr-4">
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-900">
                        {prop.name}
                      </code>
                    </td>
                    <td className="py-2 pr-4">
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-blue-600">
                        {prop.type}
                      </code>
                    </td>
                    <td className="py-2 pr-4">
                      {prop.required ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                          Required
                        </span>
                      ) : (
                        <span className="text-gray-400">Optional</span>
                      )}
                    </td>
                    <td className="py-2 pr-4">
                      {prop.defaultValue ? (
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-600">
                          {prop.defaultValue}
                        </code>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-2 text-gray-700">{prop.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Do Examples */}
      {doExamples && doExamples.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-green-800">
            Do
          </h2>
          <div className="space-y-4">
            {doExamples.map((example, index) => (
              <div
                key={index}
                className="rounded-lg border border-green-200 bg-green-50 p-4"
              >
                <p className="mb-3 text-sm text-green-700">
                  {example.description}
                </p>
                <div className="flex min-h-[60px] items-center justify-center rounded border border-green-200 bg-white p-4">
                  {example.render()}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Don't Examples */}
      {dontExamples && dontExamples.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-red-800">
            Don&apos;t
          </h2>
          <div className="space-y-4">
            {dontExamples.map((example, index) => (
              <div
                key={index}
                className="rounded-lg border border-red-200 bg-red-50 p-4"
              >
                <p className="mb-3 text-sm text-red-700">
                  {example.description}
                </p>
                <div className="flex min-h-[60px] items-center justify-center rounded border border-red-200 bg-white p-4 opacity-75">
                  {example.render()}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
