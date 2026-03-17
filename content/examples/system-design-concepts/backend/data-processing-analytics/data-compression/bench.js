const { compress } = require('./compress');
const payload = 'x'.repeat(1000);
console.log(compress(payload).length);