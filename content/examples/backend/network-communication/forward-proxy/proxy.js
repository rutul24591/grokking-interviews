import http from "http";
import fetch from "node-fetch";

const allowedHosts = ["example.com", "api.example.com"];

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://placeholder");
  const host = url.hostname;
  if (!allowedHosts.includes(host)) {
    res.writeHead(403);
    res.end("blocked");
    return;
  }

  console.log("proxying to:", host);
  const upstream = await fetch("http://" + host + url.pathname);
  const body = await upstream.text();
  res.writeHead(upstream.status, { "content-type": "text/plain" });
  res.end(body);
});

server.listen(4700, () => console.log("forward proxy on :4700"));