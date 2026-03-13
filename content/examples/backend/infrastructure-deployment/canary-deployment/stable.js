const http = require('http');
http.createServer((req, res) => res.end('stable')).listen(3000);