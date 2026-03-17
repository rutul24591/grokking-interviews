const crypto = require('crypto');

function hash(value) {
  return parseInt(crypto.createHash('md5').update(value).digest('hex').slice(0, 8), 16);
}

const ring = [
  { node: 'node-a', pos: hash('node-a#1') },
  { node: 'node-b', pos: hash('node-b#1') },
  { node: 'node-c', pos: hash('node-c#1') },
].sort((a, b) => a.pos - b.pos);

function lookup(key) {
  const h = hash(key);
  for (const entry of ring) if (h <= entry.pos) return entry.node;
  return ring[0].node;
}

console.log(lookup('user:123'));
