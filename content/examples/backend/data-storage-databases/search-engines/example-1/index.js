// Inverted index builder.

function tokenize(text) {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);
}

function buildIndex(docs) {
  const index = new Map();
  for (const doc of docs) {
    const counts = new Map();
    for (const token of tokenize(doc.text)) {
      counts.set(token, (counts.get(token) || 0) + 1);
    }
    for (const [token, count] of counts.entries()) {
      if (!index.has(token)) index.set(token, []);
      index.get(token).push({ id: doc.id, count });
    }
  }
  return index;
}

module.exports = { buildIndex, tokenize };
