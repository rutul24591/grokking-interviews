const { execSync } = require('child_process');

function shipLogs() {
  execSync('rsync -az /var/lib/postgresql/wal backup:/wal');
  console.log('logs shipped');
}

shipLogs();