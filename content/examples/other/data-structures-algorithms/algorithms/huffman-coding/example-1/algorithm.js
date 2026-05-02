function buildTree(freq) {
  const nodes = Object.entries(freq).map(([sym, w]) => ({ sym, w, left: null, right: null }));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.w - b.w || String(a.sym).localeCompare(String(b.sym)));
    const left = nodes.shift();
    const right = nodes.shift();
    nodes.push({ sym: null, w: left.w + right.w, left, right });
  }
  return nodes[0];
}

function buildCodes(node, prefix = "", out = {}) {
  if (!node) return out;
  if (node.sym !== null) out[node.sym] = prefix || "0";
  else {
    buildCodes(node.left, prefix + "0", out);
    buildCodes(node.right, prefix + "1", out);
  }
  return out;
}

module.exports = { buildTree, buildCodes };
