const http = require('http');
http.createServer((req, res) => res.end('green')).listen(3000);