// Cache-aside demo.

const cache = new Map();
const db = new Map([['k','v']]);
function get(key){
  if(cache.has(key)) return cache.get(key);
  const val = db.get(key);
  cache.set(key, val);
  return val;
}
console.log(get('k'));
