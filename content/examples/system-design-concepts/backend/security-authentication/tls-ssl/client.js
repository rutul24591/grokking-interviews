const https = require('https');

https.get('https://localhost:3443/health', res => {
  console.log('status', res.statusCode);
});