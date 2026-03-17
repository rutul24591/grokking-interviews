// Multi-level cache.

const l1=new Map();
const l2=new Map([['k','v']]);
function get(key){ return l1.get(key) || l2.get(key); }
console.log(get('k'));
