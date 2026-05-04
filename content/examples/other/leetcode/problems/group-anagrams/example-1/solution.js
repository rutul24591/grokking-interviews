function groupAnagramsSortKey(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}

if (require.main === module) {
  console.log(groupAnagramsSortKey(["eat", "tea", "tan", "ate", "nat", "bat"]));
}

module.exports = { groupAnagramsSortKey };
