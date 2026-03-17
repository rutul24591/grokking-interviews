const express = require('express');
const app = express();
app.get('/users', (req, res) => res.redirect('http://localhost:3001/users'));
app.get('/orders', (req, res) => res.redirect('http://localhost:3002/orders'));
app.listen(3000);