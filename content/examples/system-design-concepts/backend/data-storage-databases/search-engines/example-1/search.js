// Query execution using inverted index.

function search(index, query) {
  const tokens = query.toLowerCase().split(/\W+/).filter(Boolean);
  const scores = new Map();
  for (const token of tokens) {
    const postings = index.get(token) || [];
    for (const post of postings) {
      scores.set(post.id, (scores.get(post.id) || 0) + post.count);
    }
  }
  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }));
}

module.exports = { search };
