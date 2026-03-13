// Plain HTTP server that exposes a small API response.

const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/status") {
    const payload = JSON.stringify({ status: "ok", time: new Date().toISOString() }, null, 2);
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

server.listen(4010, () => {
  console.log("HTTP server listening on http://localhost:4010/status");
});
