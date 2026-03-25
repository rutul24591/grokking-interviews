function escapeHtmlText(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const payload = `<img src=x onerror=alert("xss") />`;

process.stdout.write("payload:\n");
process.stdout.write(`${payload}\n\n`);

process.stdout.write("escaped (HTML text context):\n");
process.stdout.write(`${escapeHtmlText(payload)}\n\n`);

process.stdout.write("WARNING: This is not a full sanitizer. For rich HTML, use a battle-tested allowlist sanitizer.\n");

