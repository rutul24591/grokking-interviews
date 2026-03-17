const http = require('http');
http.createServer((req, res) => res.end('canary')).listen(3000);