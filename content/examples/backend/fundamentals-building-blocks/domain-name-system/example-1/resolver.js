// Recursive resolver that walks zones and caches answers.

const { zones } = require("./records");
const { TTLCache } = require("./cache");

const cache = new TTLCache();

function resolve(domain, type) {
  const cacheKey = `${domain}|${type}`;
  const cached = cache.get(cacheKey);
  if (cached) return { ...cached, cached: true };

  const labels = domain.split(".").reverse();
  let node = zones[labels[0]];
  if (!node) return null;

  for (let i = 1; i < labels.length; i += 1) {
    node = node.children[labels[i]];
    if (!node) return null;
  }

  const recordName = "@";
  const record = node.records[recordName] || node.records[domain.split(".")[0]];
  if (!record) return null;

  if (record.CNAME && type !== "CNAME") {
    const cname = record.CNAME;
    const resolved = resolve(cname, type);
    if (!resolved) return null;
    cache.set(cacheKey, resolved, record.TTL);
    return { ...resolved, cname, cached: false };
  }

  if (!record[type]) return null;
  const answer = { type, value: record[type], ttl: record.TTL };
  cache.set(cacheKey, answer, record.TTL);
  return { ...answer, cached: false };
}

module.exports = { resolve };
