const index = {};
function add(doc) {
  doc.text.split(/\s+/).forEach(word => {
    index[word] = index[word] || new Set();
    index[word].add(doc.id);
  });
}
function search(term) { return Array.from(index[term] || []); }
module.exports = { add, search };