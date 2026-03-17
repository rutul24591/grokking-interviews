const fs = require('fs');
function log(entry){ fs.appendFileSync('wal.log', JSON.stringify(entry)+'\n'); }
module.exports={ log };