const { execSync } = require('child_process');

function snapshot() {
  execSync('pg_dump -Fc -f /backups/orders.dump orders');
  console.log('snapshot completed');
}

function shipWal() {
  execSync('rsync -az /var/lib/postgresql/wal standby:/wal');
  console.log('wal shipped');
}

snapshot();
shipWal();