function calculateRange(scrollTop, viewportHeight, rowHeight, count) {
  const startIndex = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(viewportHeight / rowHeight);
  const endIndex = Math.min(count - 1, startIndex + visibleCount);
  return { startIndex, endIndex };
}
console.log(calculateRange(2400, 600, 48, 10000));
