import http from "node:http";

const PORT = 4666;

http
  .createServer((req, res) => {
    const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Attacker</title></head>
  <body>
    <h1>Attacker iframe page</h1>
    <p>If clickjacking defenses are working, the iframe below should be blocked.</p>
    <iframe src="http://localhost:3000/protected" style="width: 800px; height: 360px; border: 2px solid red;"></iframe>
  </body>
</html>`;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  })
  .listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`attacker page on http://localhost:${PORT}`);
  });

