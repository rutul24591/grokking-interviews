function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const input = `<img src=x onerror=alert(1)>`;
console.log(JSON.stringify({ input, escaped: escapeHtml(input) }, null, 2));

