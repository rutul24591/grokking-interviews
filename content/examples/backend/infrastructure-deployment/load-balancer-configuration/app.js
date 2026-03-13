const http = require('http');
http.createServer((req, res) => {
  if (req.url === '/health') return res.end('ok');
  res.end('lb');
}).listen(3000);