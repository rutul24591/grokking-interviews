const N = 3, R = 2, W = 2;

async function read(key) {
  const responses = await Promise.all(replicas.map(r => r.get(key)));
  return responses.sort((a, b) => b.version - a.version)[0];
}

async function write(key, value) {
  const acks = await Promise.all(replicas.map(r => r.put(key, value)));
  if (acks.filter(Boolean).length < W) throw new Error('write_failed');
}
