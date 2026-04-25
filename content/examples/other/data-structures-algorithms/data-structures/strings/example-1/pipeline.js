function normalize(query) {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

function tokenize(query) {
  return normalize(query).split(" ").filter(Boolean);
}

function canonicalKey(query) {
  return tokenize(query).join("|");
}

module.exports = { normalize, tokenize, canonicalKey };
