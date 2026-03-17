const http = require('http');
http.createServer((req, res) => res.end('containerized')).listen(3000);