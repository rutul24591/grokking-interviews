const express = require('express');
const { Client } = require('pg');
const redis = require('redis');

const app = express();
let ready = false;

const db = new Client({ connectionString: process.env.DB_URL });
const cache = redis.createClient({ url: process.env.REDIS_URL });

async function warmup() {
  await db.connect();
  await cache.connect();
  ready = true;
}

warmup();

app.get('/health/live', (req, res) => res.json({ ok: true }));
app.get('/health/startup', (req, res) => res.json({ ready }));
app.get('/health/ready', async (req, res) => {
  if (!ready) return res.status(503).json({ ok: false });
  try {
    await db.query('SELECT 1');
    await cache.ping();
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false });
  }
});

app.listen(3000);