import { randomBytes } from "node:crypto";
import { buildCsp } from "../../lib/csp";

export async function GET() {
  const nonce = randomBytes(16).toString("base64");
  const csp = buildCsp({ nonce });

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CSP Nonce Demo</title>
  </head>
  <body>
    <h1>CSP demo (nonce)</h1>
    <p>Allowed script status: <code id="ok">pending</code></p>
    <p>Blocked script status: <code id="blocked">pending</code></p>

    <script nonce="${nonce}">
      document.getElementById('ok').textContent = 'ran (nonce matched)';
    </script>

    <script>
      // This should be blocked because it lacks the nonce.
      document.getElementById('blocked').textContent = 'ran (should not happen)';
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": csp
    }
  });
}

