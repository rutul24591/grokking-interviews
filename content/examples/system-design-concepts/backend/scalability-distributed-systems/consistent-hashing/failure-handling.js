// If a node fails, re-route to next node
const failed = 'node-b';
const candidates = ring.filter(n => n.node != failed);
function lookupWithFailover(key) {
  const h = hash(key);
  for (const entry of candidates) if (h <= entry.pos) return entry.node;
  return candidates[0].node;
}
console.log(lookupWithFailover('user:123'));
