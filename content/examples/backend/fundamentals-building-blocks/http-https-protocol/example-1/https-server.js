// HTTPS server with TLS using a local self-signed certificate.

const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("content/examples/backend/fundamentals-building-blocks/http-https-protocol/localhost.key"),
  cert: fs.readFileSync("content/examples/backend/fundamentals-building-blocks/http-https-protocol/localhost.crt"),
};

const server = https.createServer(options, (req, res) => {
  if (req.method === "GET" && req.url === "/status") {
    const payload = JSON.stringify({ status: "secure", time: new Date().toISOString() }, null, 2);
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(payload),
    });
    res.end(payload);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(4011, () => {
  console.log("HTTPS server listening on https://localhost:4011/status");
});
