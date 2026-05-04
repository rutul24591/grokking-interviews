export type AnnotationId = string;

export type PdfRect = { x: number; y: number; w: number; h: number }; // normalized 0..1

export type Highlight = {
  id: AnnotationId;
  page: number;
  rects: PdfRect[];
  color: string;
  note?: string;
  createdAt: number;
};

export type AnnotationState = {
  highlights: Record<AnnotationId, Highlight>;
};

export function addHighlight(state: AnnotationState, h: Highlight): AnnotationState {
  return { highlights: { ...state.highlights, [h.id]: h } };
}

