const express = require('express');
const axios = require('axios');
const redis = require('redis');

const app = express();
const cache = redis.createClient({ url: process.env.REDIS_URL });
const flags = require('./feature-flags.json');

app.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  let price;
  if (flags.enablePriceRefresh) {
    try {
      const resp = await axios.get('http://pricing:4001/prices/' + id, { timeout: 200 });
      price = resp.data.price;
      await cache.set('price:' + id, JSON.stringify(price), { EX: 300 });
    } catch {
      // fallback to cache
    }
  }
  if (!price) {
    const cached = await cache.get('price:' + id);
    price = cached ? JSON.parse(cached) : null;
  }
  res.json({ id, price, personalized: flags.enablePersonalization });
});

app.listen(3000);