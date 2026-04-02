function range(opts: { scrollTop: number; rowHeight: number; viewportHeight: number; count: number; overscan: number }) {
  const start = Math.max(0, Math.floor(opts.scrollTop / opts.rowHeight) - opts.overscan);
  const visible = Math.ceil(opts.viewportHeight / opts.rowHeight) + opts.overscan * 2;
  const end = Math.min(opts.count, start + visible);
  return { start, end, rendered: end - start };
}

console.log(
  JSON.stringify(
    {
      example: range({ scrollTop: 900, rowHeight: 36, viewportHeight: 520, count: 10_000, overscan: 6 })
    },
    null,
    2,
  ),
);

