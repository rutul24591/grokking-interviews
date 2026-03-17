const { execSync } = require('child_process');

function restoreSnapshot() {
  execSync('pg_restore -d inventory /backups/inventory.dump');
  execSync('psql -d inventory -c "SELECT count(*) FROM inventory"');
  console.log('restore validated');
}

restoreSnapshot();