function partition(id, count) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i)) % count;
  return hash;
}
module.exports = { partition };