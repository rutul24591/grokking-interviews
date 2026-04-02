type Sink = { surface: string; usesInnerHtml: boolean; trustedHtml: boolean; cspNonce: boolean };

function assessXssRisk(sink: Sink) {
  const safe = !sink.usesInnerHtml || (sink.trustedHtml && sink.cspNonce);
  return {
    surface: sink.surface,
    safe,
    remediation: safe ? 'keep-current-render-path' : 'escape-or-sanitize-before-render',
  };
}

const results = [
  { surface: 'markdown-preview', usesInnerHtml: true, trustedHtml: false, cspNonce: true },
  { surface: 'admin-banner', usesInnerHtml: true, trustedHtml: true, cspNonce: true },
].map(assessXssRisk);

console.table(results);
if (results[0].safe) throw new Error('Markdown preview should require sanitization');
