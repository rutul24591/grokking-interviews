const express = require('express');
const redis = require('redis');

const app = express();
app.use(express.json());

const cache = redis.createClient({ url: process.env.REDIS_URL });

app.post('/orders', async (req, res) => {
  const key = req.header('Idempotency-Key');
  if (!key) return res.status(400).json({ error: 'missing key' });

  const existing = await cache.get('idem:' + key);
  if (existing) return res.json(JSON.parse(existing));

  const order = { id: 'order_' + Date.now(), total: req.body.total };
  await cache.set('idem:' + key, JSON.stringify(order), { EX: 86400 });
  res.status(201).json(order);
});

app.listen(3000);