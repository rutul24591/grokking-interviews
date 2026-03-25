function isAllowedOrigin({ origin, host }) {
  if (!origin || !host) return false;
  return origin === `https://${host}` || origin === `http://${host}`;
}

const cases = [
  { origin: "https://example.com", host: "example.com" },
  { origin: "https://evil.com", host: "example.com" },
  { origin: null, host: "example.com" },
  { origin: "null", host: "example.com" }
];

for (const c of cases) {
  process.stdout.write(`${JSON.stringify(c)} -> allowed=${isAllowedOrigin(c)}\n`);
}

