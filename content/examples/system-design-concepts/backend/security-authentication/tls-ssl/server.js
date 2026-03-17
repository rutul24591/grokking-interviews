const fs = require('fs');
const https = require('https');
const express = require('express');

const app = express();
app.get('/health', (req, res) => res.json({ ok: true }));

const options = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.crt'),
  ca: fs.readFileSync('./certs/ca.pem'),
  honorCipherOrder: true,
  minVersion: 'TLSv1.2'
};

https.createServer(options, app).listen(3443);