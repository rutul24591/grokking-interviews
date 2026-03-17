const http = require('http');
http.createServer((req, res) => res.end('immutable')).listen(3000);