const http = require('http');
http.createServer((req, res) => res.end('blue')).listen(3000);