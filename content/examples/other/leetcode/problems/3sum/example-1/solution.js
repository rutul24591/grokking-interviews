function threeSumBrute(nums) {
  const triples = new Set();
  const n = nums.length;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      for (let k = j + 1; k < n; k += 1) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const t = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
          triples.add(t.join(","));
        }
      }
    }
  }
  return Array.from(triples, (s) => s.split(",").map((x) => Number(x)));
}

if (require.main === module) {
  console.log(threeSumBrute([-1, 0, 1, 2, -1, -4]));
}

module.exports = { threeSumBrute };
