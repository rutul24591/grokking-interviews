export type Window1D = { start: number; end: number };
export type Window2D = { rows: Window1D; cols: Window1D };

export function window1d(args: {
  count: number;
  itemSize: number;
  viewportSize: number;
  scrollOffset: number;
  overscan: number;
}): Window1D {
  const { count, itemSize, viewportSize, scrollOffset, overscan } = args;
  const first = Math.floor(scrollOffset / itemSize);
  const visible = Math.ceil(viewportSize / itemSize);
  const start = Math.max(0, first - overscan);
  const end = Math.min(count, first + visible + overscan);
  return { start, end };
}

export function window2d(args: {
  rowCount: number;
  colCount: number;
  rowHeight: number;
  colWidth: number;
  viewportHeight: number;
  viewportWidth: number;
  scrollTop: number;
  scrollLeft: number;
  overscanRows: number;
  overscanCols: number;
}): Window2D {
  return {
    rows: window1d({
      count: args.rowCount,
      itemSize: args.rowHeight,
      viewportSize: args.viewportHeight,
      scrollOffset: args.scrollTop,
      overscan: args.overscanRows,
    }),
    cols: window1d({
      count: args.colCount,
      itemSize: args.colWidth,
      viewportSize: args.viewportWidth,
      scrollOffset: args.scrollLeft,
      overscan: args.overscanCols,
    }),
  };
}

