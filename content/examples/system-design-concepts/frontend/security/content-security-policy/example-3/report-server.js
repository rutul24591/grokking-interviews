import http from "node:http";

const PORT = 4005;

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => resolve(body));
  });
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    if (req.method === "POST" && url.pathname === "/csp-report") {
      const body = await readBody(req);
      process.stdout.write(`CSP report received: ${body}\n`);
      res.writeHead(204);
      return res.end();
    }
    res.writeHead(404);
    res.end("Not found");
  })
  .listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`CSP report server on http://localhost:${PORT}`);
  });

