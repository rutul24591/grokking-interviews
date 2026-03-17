const { Client } = require('pg');
const queue = require('./queue');

const db = new Client({ connectionString: process.env.DB_URL });

async function processMessage(msg) {
  const exists = await db.query('SELECT 1 FROM processed_messages WHERE id = $1', [msg.id]);
  if (exists.rowCount) return;

  await db.query('INSERT INTO payments(id, amount) VALUES($1,$2)', [msg.id, msg.amount]);
  await db.query('INSERT INTO processed_messages(id) VALUES($1)', [msg.id]);
}

queue.consume(async (msg, ack) => {
  await processMessage(msg);
  ack();
});