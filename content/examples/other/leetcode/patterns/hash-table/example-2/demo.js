function groupAnagrams(words) {
  const map = new Map();
  for (const word of words) {
    const key = [...word].sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(word);
  }
  return [...map.values()];
}

console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));
