const { buildTree, buildCodes } = require("../example-1/algorithm");
const freq = { a: 3, b: 2, c: 1 };
const tree = buildTree(freq);
const codes = buildCodes(tree);

function encode(text) {
  return [...text].map((ch) => codes[ch]).join("");
}

function decode(bits) {
  const out = [];
  let node = tree;
  for (const bit of bits) {
    node = bit === "0" ? node.left : node.right;
    if (node.sym !== null) {
      out.push(node.sym);
      node = tree;
    }
  }
  return out.join("");
}

const msg = "abac";
const bits = encode(msg);
console.log("bits:", bits);
console.log("decoded:", decode(bits));
