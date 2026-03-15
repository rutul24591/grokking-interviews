"use client";

interface MermaidDiagramProps {
  chart: string;
  caption?: string;
}

/**
 * MermaidDiagram Component - Placeholder
 * 
 * Note: Per project guidelines, Mermaid diagrams are not used for new content.
 * This component is a placeholder for existing articles that reference it.
 * 
 * For new articles, use custom SVG diagrams via the ArticleImage component instead.
 */
export function MermaidDiagram({ chart, caption }: MermaidDiagramProps) {
  return (
    <figure className="my-6 overflow-hidden rounded-lg border border-theme bg-panel-soft">
      <div className="overflow-x-auto p-4">
        <pre className="text-xs text-muted whitespace-pre-wrap font-mono">
          {chart}
        </pre>
      </div>
      {caption && (
        <figcaption className="mt-3 border-t border-theme px-4 py-2 text-center text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
