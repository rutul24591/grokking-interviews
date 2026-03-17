import Image from "next/image";
import type { ComponentProps } from "react";

type ArchitectureDiagramProps = {
  src: string;
  alt: string;
  caption?: string;
  title?: string;
} & Omit<ComponentProps<typeof Image>, "alt">;

/**
 * Architecture Diagram Component
 * 
 * Reusable component for displaying architecture diagrams with proper styling,
 * captions, and dark mode support.
 * 
 * @example
 * ```tsx
 * <ArchitectureDiagram
 *   src="/diagrams/system-design-concepts/backend/caching-strategies-diagram.svg"
 *   alt="Cache-aside pattern showing request flow through cache to database"
 *   title="Cache-Aside Pattern"
 *   caption="In cache-aside, the application checks cache first, then falls back to database."
 * />
 * ```
 */
export function ArchitectureDiagram({
  src,
  alt,
  caption,
  title,
  className = "",
  ...props
}: ArchitectureDiagramProps) {
  return (
    <figure className={`my-8 ${className}`}>
      {title && (
        <figcaption className="mb-3 text-center text-sm font-semibold text-heading">
          {title}
        </figcaption>
      )}
      <div className="relative overflow-hidden rounded-xl border border-theme bg-panel shadow-soft-theme">
        <Image
          src={src}
          alt={alt}
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 960px"
          {...props}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Flow Diagram Component
 * 
 * For sequence diagrams and data flow visualizations.
 */
type FlowDiagramProps = {
  steps: Array<{
    from: string;
    action: string;
    to?: string;
  }>;
  title?: string;
};

export function FlowDiagram({ steps, title }: FlowDiagramProps) {
  return (
    <div className="my-6 rounded-xl border border-theme bg-panel-soft p-6">
      {title && (
        <h4 className="mb-4 text-center font-semibold text-heading">
          {title}
        </h4>
      )}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
              {index + 1}
            </div>
            <div className="flex-1 rounded-lg bg-panel px-4 py-2 text-sm text-body">
              <strong className="text-accent">{step.from}</strong>
              <span className="mx-2 text-muted">→</span>
              <span>{step.action}</span>
              {step.to && (
                <>
                  <span className="mx-2 text-muted">→</span>
                  <strong className="text-accent">{step.to}</strong>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Comparison Table Component
 * 
 * For comparing different approaches, patterns, or technologies.
 */
type ComparisonTableProps = {
  items: Array<{
    name: string;
    pros: string[];
    cons: string[];
    bestFor: string;
  }>;
  title?: string;
};

export function ComparisonTable({ items, title }: ComparisonTableProps) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-theme">
      {title && (
        <div className="border-b border-theme bg-panel-soft px-6 py-4">
          <h4 className="text-center font-semibold text-heading">{title}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-panel">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-heading">
                Approach
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-heading">
                Pros
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-heading">
                Cons
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-heading">
                Best For
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item, index) => (
              <tr key={index} className="bg-panel-soft">
                <td className="px-6 py-4 font-medium text-heading">
                  {item.name}
                </td>
                <td className="px-6 py-4 align-top">
                  <ul className="space-y-1">
                    {item.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-body">
                        <span className="mt-0.5 text-green-500">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 align-top">
                  <ul className="space-y-1">
                    {item.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-body">
                        <span className="mt-0.5 text-red-500">✗</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm text-muted">{item.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
