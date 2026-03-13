const { keyFor } = require('./partitioner');
console.log('key', keyFor({ userId: 'u1' }));