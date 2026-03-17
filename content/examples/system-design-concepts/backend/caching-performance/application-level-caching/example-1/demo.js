// Application-level caching demo.

const { Cache } = require('./cache');
const cache = new Cache();
cache.set('user:1', { name: 'Ada' }, 50);
console.log(cache.get('user:1'));
setTimeout(()=>console.log(cache.get('user:1')), 80);
