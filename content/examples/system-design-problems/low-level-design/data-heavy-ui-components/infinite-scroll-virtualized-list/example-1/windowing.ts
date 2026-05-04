export type Window = { start: number; end: number };

export function computeWindow(args: {
  itemCount: number;
  itemHeight: number;
  viewportHeight: number;
  scrollTop: number;
  overscan: number;
}) {
  const { itemCount, itemHeight, viewportHeight, scrollTop, overscan } = args;
  const first = Math.floor(scrollTop / itemHeight);
  const visible = Math.ceil(viewportHeight / itemHeight);
  const start = Math.max(0, first - overscan);
  const end = Math.min(itemCount, first + visible + overscan);
  return { start, end } satisfies Window;
}

