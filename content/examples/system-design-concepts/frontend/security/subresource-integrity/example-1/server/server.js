import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const PORT = 4555;

const appJsPath = path.join(process.cwd(), "app.js");
const appJs = fs.readFileSync(appJsPath);

function sriSha384(buf) {
  const hash = createHash("sha384").update(buf).digest("base64");
  return `sha384-${hash}`;
}

const goodIntegrity = sriSha384(appJs);
const badIntegrity = goodIntegrity.replace("sha384-", "sha384-x"); // intentionally wrong

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (req.method === "GET" && url.pathname === "/app.js") {
      res.writeHead(200, { "Content-Type": "application/javascript; charset=utf-8" });
      return res.end(appJs);
    }

    if (req.method === "GET" && url.pathname === "/") {
      const useBad = url.searchParams.get("bad") === "1";
      const integrity = useBad ? badIntegrity : goodIntegrity;
      const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SRI Demo</title>
  </head>
  <body>
    <h1>SRI demo</h1>
    <p>Integrity used: <code>${integrity}</code></p>
    <p>Status: <code id="status">pending (script not executed)</code></p>
    <script src="/app.js" integrity="${integrity}" crossorigin="anonymous"></script>
    <p>
      If the hash is wrong, the browser blocks the script and you should see an error in DevTools console.
    </p>
  </body>
</html>`;
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(html);
    }

    res.statusCode = 404;
    res.end("Not found");
  })
  .listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`SRI demo server on http://localhost:${PORT} (good) and http://localhost:${PORT}/?bad=1 (bad hash)`);
  });

