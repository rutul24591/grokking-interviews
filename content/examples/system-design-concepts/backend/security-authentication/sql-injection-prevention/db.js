const { Client } = require('pg');
const db = new Client({ connectionString: process.env.DB_URL });

async function getUser(id) {
  const res = await db.query('SELECT id, email FROM users WHERE id = $1', [id]);
  return res.rows[0];
}

module.exports = { getUser };