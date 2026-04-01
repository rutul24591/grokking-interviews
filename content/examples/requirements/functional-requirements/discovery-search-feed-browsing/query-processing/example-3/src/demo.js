function malformedFilterGuard(parts) {
  return parts.filter((part) => part.includes(':') && part.endsWith(':'));
}
console.log(malformedFilterGuard(['content-type:', 'search', 'level:advanced']));
