import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";

const HTTP_PORT = 8080;
const HTTPS_PORT = 8443;

const certDir = path.join(process.cwd(), "certs");
const keyPath = path.join(certDir, "key.pem");
const certPath = path.join(certDir, "cert.pem");

function json(res, status, body, extraHeaders = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    ...extraHeaders
  });
  res.end(JSON.stringify(body));
}

function addSecurityHeaders(res) {
  // Demo headers (keep focused on HTTPS/TLS; CSP has its own article/examples).
  res.setHeader("Strict-Transport-Security", "max-age=86400");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
}

const httpServer = http.createServer((req, res) => {
  const host = req.headers.host?.split(":")[0] ?? "localhost";
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const target = `https://${host}:${HTTPS_PORT}${url.pathname}${url.search}`;
  res.statusCode = 308;
  res.setHeader("Location", target);
  res.end(`Redirecting to ${target}`);
});

const httpsServer = https.createServer(
  {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
    // Production-ish defaults (Node will still choose safe ciphers by default).
    minVersion: "TLSv1.2"
  },
  (req, res) => {
    addSecurityHeaders(res);
    const url = new URL(req.url ?? "/", `https://${req.headers.host ?? "localhost"}`);

    if (req.method === "GET" && url.pathname === "/health") {
      const socket = req.socket;
      const protocol = typeof socket.getProtocol === "function" ? socket.getProtocol() : "unknown";
      const cipher = typeof socket.getCipher === "function" ? socket.getCipher() : null;

      return json(res, 200, {
        ok: true,
        protocol,
        cipher,
        note: "TLS info is from the server-side socket"
      });
    }

    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("HTTPS server is running. Try /health");
    }

    return json(res, 404, { error: "Not found" });
  }
);

httpServer.listen(HTTP_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`HTTP redirect server on http://localhost:${HTTP_PORT} -> https://localhost:${HTTPS_PORT}`);
});

httpsServer.listen(HTTPS_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`HTTPS server on https://localhost:${HTTPS_PORT}`);
});

