// Simulates workload using the connection pool.

const { ConnectionPool } = require("./pool");

const pool = new ConnectionPool(2);

async function runTask(id, duration) {
  const conn = await pool.acquire();
  console.log(`Task ${id} acquired connection ${conn.id}`);
  await new Promise((resolve) => setTimeout(resolve, duration));
  pool.release(conn);
  console.log(`Task ${id} released connection ${conn.id}`);
}

Promise.all([
  runTask(1, 200),
  runTask(2, 200),
  runTask(3, 200),
  runTask(4, 200),
]).catch((error) => console.error(error));
