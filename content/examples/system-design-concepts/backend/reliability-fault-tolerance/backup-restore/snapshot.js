const { execSync } = require('child_process');

function fullSnapshot() {
  execSync('pg_dump -Fc -f /backups/inventory.dump inventory');
  console.log('full snapshot done');
}

fullSnapshot();