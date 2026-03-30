const entries = [
  { key: 'catalog', age: 12, ttl: 10, tag: 'catalog' },
  { key: 'home', age: 3, ttl: 60, tag: 'home' }
];
const afterTtl = entries.filter((entry) => entry.age <= entry.ttl);
const afterTag = afterTtl.filter((entry) => entry.tag !== 'home');
console.log({ afterTtl, afterTag });
