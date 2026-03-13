// Distributed cache shard.

const nodes = ['n1','n2'];
const key = 'user:1';
const node = nodes[key.length % nodes.length];
console.log(node);
