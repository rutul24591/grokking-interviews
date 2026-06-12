export type PdfViewerStage = "empty" | "loading-document" | "indexing-pages" | "rendering-visible" | "ready" | "ready";

export type PdfViewerTransition = {
  command: string;
  from: PdfViewerStage;
  to: PdfViewerStage;
  revision: number;
};

export type PdfViewerState = {
  id: string;
  stage: PdfViewerStage;
  revision: number;
  audit: string[];
};

// Render only a bounded visible-page window and cancel work for pages leaving that window.
export function applyPdfViewerTransition(
  state: PdfViewerState,
  transition: PdfViewerTransition,
): PdfViewerState {
  if (transition.revision <= state.revision) return state;
  if (transition.from !== state.stage) {
    throw new Error(`Invalid document viewport transition: ${state.stage} -> ${transition.to}`);
  }
  return {
    ...state,
    stage: transition.to,
    revision: transition.revision,
    audit: [...state.audit, `${transition.revision}:${transition.command}`],
  };
}

export function runPdfViewerProtocolScenario() {
  const transitions: PdfViewerTransition[] = [
  { command: "load-document", from: "empty", to: "loading-document", revision: 1 },
  { command: "index-pages", from: "loading-document", to: "indexing-pages", revision: 2 },
  { command: "render-visible-window", from: "indexing-pages", to: "rendering-visible", revision: 3 },
  { command: "cache-page-bitmap", from: "rendering-visible", to: "ready", revision: 4 },
  { command: "evict-distant-pages", from: "ready", to: "ready", revision: 5 },
  ];
  return transitions.reduce(applyPdfViewerTransition, {
    id: "pdf-viewer-case-17",
    stage: "empty",
    revision: 0,
    audit: [],
  });
}

export const PdfViewerInvariant =
  "Render only a bounded visible-page window and cancel work for pages leaving that window.";
