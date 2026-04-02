function csp(directives: Record<string, string[]>) {
  return Object.entries(directives)
    .map(([k, v]) => `${k} ${v.join(" ")}`)
    .join("; ");
}

const header = csp({
  "default-src": ["'self'"],
  "script-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'none'"],
  "frame-ancestors": ["'none'"]
});

console.log(JSON.stringify({ header }, null, 2));

