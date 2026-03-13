// L1/L2 coherence demo.

const l1 = new Map([['k','v1']]);
const l2 = new Map([['k','v1']]);
function write(key, val){ l2.set(key, val); l1.delete(key); }
write('k','v2');
console.log(l1.has('k'), l2.get('k'));
