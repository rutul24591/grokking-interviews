export type ViewerState = {
  page: number;
  pageCount: number;
  zoom: number; // 0.5..4
  rotationDeg: 0 | 90 | 180 | 270;
  search: {
    query: string;
    matches: { page: number; rects: { x: number; y: number; w: number; h: number }[] }[];
    activeIndex: number;
    status: "idle" | "searching" | "done";
  };
};

export function createViewer(pageCount: number): ViewerState {
  return {
    page: 1,
    pageCount,
    zoom: 1,
    rotationDeg: 0,
    search: { query: "", matches: [], activeIndex: 0, status: "idle" },
  };
}

export function setZoom(s: ViewerState, zoom: number) {
  return { ...s, zoom: Math.max(0.5, Math.min(4, zoom)) };
}

export function goToPage(s: ViewerState, page: number) {
  return { ...s, page: Math.max(1, Math.min(s.pageCount, page)) };
}

