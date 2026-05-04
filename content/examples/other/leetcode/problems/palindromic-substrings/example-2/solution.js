function countSubstrings(s) {
  function expand(left, right) {
    let count = 0;
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      count += 1;
      left -= 1;
      right += 1;
    }
    return count;
  }

  let total = 0;
  for (let i = 0; i < s.length; i += 1) {
    total += expand(i, i); // odd
    total += expand(i, i + 1); // even
  }
  return total;
}

if (require.main === module) {
  console.log(countSubstrings("aaa"));
}

module.exports = { countSubstrings };
