function containsDuplicate(nums) {
  const s = new Set();
  for (const x of nums) {
    if (s.has(x)) return true;
    s.add(x);
  }
  return false;
}

if (require.main===module) {
  console.log(containsDuplicate([1,2,3,1]));
}

module.exports = { containsDuplicate };
