const items = [
  "Do state changes use POST/PUT/PATCH/DELETE (not GET)?",
  "Do you validate Origin (and Referer fallback) for browser requests?",
  "Do you have a CSRF token for cookie-authenticated actions?",
  "Are SameSite cookies configured correctly (Lax/Strict) for your UX?",
  "Is CORS disallowing credentialed cross-origin requests by default?",
  "Do you rotate tokens on login and on privilege changes?"
];

process.stdout.write("CSRF checklist:\n");
for (const i of items) process.stdout.write(`- ${i}\n`);

