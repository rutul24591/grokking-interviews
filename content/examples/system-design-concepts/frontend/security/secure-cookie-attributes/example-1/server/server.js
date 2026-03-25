import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const PORT = 9443;
const UI_ORIGIN = "http://localhost:3000";

const certDir = path.join(process.cwd(), "certs");
const keyPath = path.join(certDir, "key.pem");
const certPath = path.join(certDir, "cert.pem");

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin === UI_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
}

function json(req, res, status, body, extraHeaders = {}) {
  setCors(req, res);
  res.writeHead(status, { "Content-Type": "application/json", ...extraHeaders });
  res.end(JSON.stringify(body));
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (!k) continue;
    out[k] = rest.join("=");
  }
  return out;
}

function buildHostSessionCookie(value) {
  // __Host- rules: Secure + Path=/ + NO Domain attribute.
  return [
    `__Host-session=${value}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=3600"
  ].join("; ");
}

function clearHostSessionCookie() {
  return [
    "__Host-session=",
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0"
  ].join("; ");
}

const server = https.createServer(
  { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath), minVersion: "TLSv1.2" },
  async (req, res) => {
    const url = new URL(req.url ?? "/", `https://${req.headers.host ?? "localhost"}`);

    if (req.method === "OPTIONS") {
      setCors(req, res);
      res.writeHead(204);
      return res.end();
    }

    if (req.method === "POST" && url.pathname === "/login") {
      const token = `sess_${randomUUID()}`;
      return json(req, res, 200, { ok: true }, { "Set-Cookie": buildHostSessionCookie(token) });
    }

    if (req.method === "POST" && url.pathname === "/logout") {
      return json(req, res, 200, { ok: true }, { "Set-Cookie": clearHostSessionCookie() });
    }

    if (req.method === "GET" && url.pathname === "/whoami") {
      const cookies = parseCookies(req.headers.cookie);
      const session = cookies["__Host-session"];
      return json(req, res, 200, {
        authenticated: Boolean(session),
        sessionPreview: session ? `${session.slice(0, 10)}…` : null,
        note: "Session cookie is HttpOnly + Secure + SameSite=Lax + Path=/ with __Host- prefix."
      });
    }

    return json(req, res, 404, { error: "Not found" });
  }
);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Secure cookie server on https://localhost:${PORT}`);
});

