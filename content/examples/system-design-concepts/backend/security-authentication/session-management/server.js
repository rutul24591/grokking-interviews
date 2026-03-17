const express = require('express');
const redis = require('redis');
const app = express();
const cache = redis.createClient({ url: process.env.REDIS_URL });

app.post('/login', async (req, res) => {
  const sid = 's_' + Date.now();
  await cache.set('sess:' + sid, JSON.stringify({ userId: 'u1' }), { EX: 3600 });
  res.setHeader('Set-Cookie', 'sid=' + sid + '; HttpOnly; Secure; SameSite=Strict');
  res.json({ ok: true });
});

app.get('/me', async (req, res) => {
  const sid = (req.headers.cookie || '').replace('sid=', '');
  const session = await cache.get('sess:' + sid);
  if (!session) return res.status(401).json({ error: 'no session' });
  res.json(JSON.parse(session));
});

app.listen(3000);