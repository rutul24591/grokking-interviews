const express = require('express');
const redis = require('redis');

const app = express();
const cache = redis.createClient({ url: process.env.REDIS_URL });

app.get('/health', (req, res) => res.status(200).json({ ok: true }));

app.get('/cart/:id', async (req, res) => {
  const key = 'cart:' + req.params.id;
  const cached = await cache.get(key);
  if (cached) return res.json(JSON.parse(cached));
  const cart = { id: req.params.id, items: [] };
  await cache.set(key, JSON.stringify(cart), { EX: 60 });
  res.json(cart);
});

app.listen(4000);