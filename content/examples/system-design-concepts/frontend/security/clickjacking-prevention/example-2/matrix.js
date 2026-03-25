const lines = [
  "X-Frame-Options: DENY -> never allow framing",
  "X-Frame-Options: SAMEORIGIN -> allow only same-origin framing",
  "CSP frame-ancestors 'none' -> never allow framing",
  "CSP frame-ancestors 'self' https://partner.example -> allowlist partners"
];
for (const l of lines) process.stdout.write(`- ${l}\n`);

