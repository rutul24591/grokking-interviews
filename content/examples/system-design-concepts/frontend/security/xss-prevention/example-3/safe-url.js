const ALLOWED = new Set(["http:", "https:", "mailto:", "tel:"]);

function sanitizeHref(input) {
  try {
    // Use a base to support relative paths.
    const u = new URL(input, "https://example.com");
    if (!ALLOWED.has(u.protocol)) return "about:blank";
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : input;
  } catch {
    return "about:blank";
  }
}

const candidates = [
  "https://safe.example/path",
  "javascript:alert(1)",
  "data:text/html,<script>alert(1)</script>",
  "/relative/path",
  "mailto:test@example.com"
];

for (const c of candidates) process.stdout.write(`${c} -> ${sanitizeHref(c)}\n`);

