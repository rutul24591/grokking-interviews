const http = require('http');
http.createServer((req, res) => res.end('configured')).listen(3000);