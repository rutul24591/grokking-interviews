const crypto = require("crypto");

function sha(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function buildMerkleRoot(leaves) {
  let level = leaves.map((leaf) => sha(leaf));
  while (level.length > 1) {
    const next = [];
    for (let index = 0; index < level.length; index += 2) {
      const left = level[index];
      const right = level[index + 1] ?? left;
      next.push(sha(left + right));
    }
    level = next;
  }
  return level[0];
}

module.exports = { sha, buildMerkleRoot };
