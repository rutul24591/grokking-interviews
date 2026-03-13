const { Client } = require('pg');

async function verify() {
  const client = new Client({ connectionString: process.env.DB_URL });
  await client.connect();
  const { rows } = await client.query('SELECT count(*) FROM orders');
  console.log('row count', rows[0].count);
  await client.end();
}

verify();