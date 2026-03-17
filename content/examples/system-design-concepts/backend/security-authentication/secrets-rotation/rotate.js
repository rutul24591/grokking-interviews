const fs = require('fs');
const keys = { active: 'key_newer', previous: 'key_new' };
fs.writeFileSync('./keys.json', JSON.stringify(keys, null, 2));