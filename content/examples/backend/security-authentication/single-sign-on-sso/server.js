const express = require('express');
const { handleCallback } = require('./callback');
const app = express();

app.get('/callback', handleCallback);
app.listen(3000);