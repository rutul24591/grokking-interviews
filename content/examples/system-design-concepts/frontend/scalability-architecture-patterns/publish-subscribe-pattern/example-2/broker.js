export function createBroker() {
  /** @type {Map<string, Set<(msg:any)=>void>>} */
  const subs = new Map();
  /** @type {Set<(msg:any)=>void>} */
  const wildcard = new Set();

  function subscribe(topic, handler) {
    if (topic === "*") {
      wildcard.add(handler);
      return () => wildcard.delete(handler);
    }
    if (!subs.has(topic)) subs.set(topic, new Set());
    subs.get(topic).add(handler);
    return () => subs.get(topic)?.delete(handler);
  }

  function publish(topic, payload) {
    const msg = { topic, ts: Date.now(), payload };
    wildcard.forEach((h) => h(msg));
    subs.get(topic)?.forEach((h) => h(msg));
    return msg;
  }

  return { subscribe, publish, stats: () => ({ topics: subs.size, wildcard: wildcard.size }) };
}

