const items = [
  "Avoid storing refresh/access tokens in localStorage (XSS can steal).",
  "Prefer HttpOnly cookies for long-lived credentials; use SameSite + CSRF defenses.",
  "Keep access tokens short-lived; rotate refresh tokens on use (replay detection).",
  "Clear auth state on logout across tabs (BroadcastChannel) and devices (server revocation).",
  "Do not log tokens or secrets; scrub analytics and error reports.",
  "Encrypt offline data at rest if you must store sensitive content locally."
];

process.stdout.write("Secure storage checklist:\n");
for (const i of items) process.stdout.write(`- ${i}\n`);

