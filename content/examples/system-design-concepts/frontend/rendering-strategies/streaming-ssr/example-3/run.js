import http from "node:http";

function startOrigin() {
  const origin = http.createServer((_req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });

    res.write("<!doctype html><meta charset=utf-8><title>Origin</title>");
    res.write("<body style='font-family:system-ui;background:#060912;color:#e6e9f2'>");
    res.write("<pre>");

    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      res.write(`chunk ${i}/5 @ ${new Date().toISOString()}\\n`);
      if (i >= 5) {
        clearInterval(timer);
        res.end("</pre></body>");
      }
    }, 450);
  });

  origin.listen(3060, () => {
    // eslint-disable-next-line no-console
    console.log("origin      http://localhost:3060");
  });
}

function startProxy({ port, mode }) {
  const proxy = http.createServer((req, res) => {
    const upstream = http.request(
      {
        hostname: "localhost",
        port: 3060,
        path: req.url,
        method: req.method,
        headers: { ...req.headers, host: "localhost:3060" },
      },
      (up) => {
        res.writeHead(up.statusCode ?? 200, up.headers);

        if (mode === "stream") {
          up.pipe(res);
          return;
        }

        // Buffering mode: read everything first, then respond.
        const chunks = [];
        up.on("data", (c) => chunks.push(c));
        up.on("end", () => {
          res.end(Buffer.concat(chunks));
        });
      },
    );

    upstream.on("error", () => {
      res.writeHead(502, { "Content-Type": "text/plain" });
      res.end("Bad gateway");
    });
    upstream.end();
  });

  proxy.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`${mode.padEnd(10)} http://localhost:${port}`);
  });
}

startOrigin();
startProxy({ port: 3061, mode: "stream" });
startProxy({ port: 3062, mode: "buffer" });

