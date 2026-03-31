function renderDocument(inlineCssBytes) {
  return `<!doctype html><html><head><style>${"a".repeat(inlineCssBytes)}</style></head><body><h1>Article</h1></body></html>`;
}

for (const bytes of [6 * 1024, 48 * 1024]) {
  const html = renderDocument(bytes);
  console.log(`inline CSS: ${bytes} bytes -> html payload: ${Buffer.byteLength(html)} bytes`);
}
