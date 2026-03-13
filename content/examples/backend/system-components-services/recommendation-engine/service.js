const { score } = require('./scorer');
function recommend(user, items) {
  return items.map(i => ({ ...i, score: score(user, i) }))
    .sort((a,b) => b.score - a.score)
    .slice(0, 3);
}
module.exports = { recommend };