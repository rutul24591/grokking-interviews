function csp(directives) {
  const parts = [];
  for (const [k, v] of Object.entries(directives)) {
    const vals = Array.isArray(v) ? v : [v];
    parts.push([k, ...vals].join(" "));
  }
  return parts.join("; ");
}

const policy = csp({
  "default-src": ["'none'"],
  "base-uri": ["'none'"],
  "frame-ancestors": ["'none'"],
  "script-src": ["'self'", "'nonce-<nonce>'"],
  "connect-src": ["'self'", "https://api.example.com"]
});

process.stdout.write(`${policy}\n`);

