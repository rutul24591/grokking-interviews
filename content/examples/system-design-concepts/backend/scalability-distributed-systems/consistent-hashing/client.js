// Route key using the hash ring
const key = 'user:123';
const node = lookup(key);
console.log('route', key, 'to', node);
