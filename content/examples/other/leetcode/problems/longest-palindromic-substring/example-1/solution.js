function longestPalindromeBrute(s) {
  function isPal(left, right) {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left += 1;
      right -= 1;
    }
    return true;
  }

  let bestL = 0;
  let bestR = -1;
  for (let i = 0; i < s.length; i += 1) {
    for (let j = i; j < s.length; j += 1) {
      if (j - i <= bestR - bestL) continue;
      if (isPal(i, j)) {
        bestL = i;
        bestR = j;
      }
    }
  }
  return s.slice(bestL, bestR + 1);
}

if (require.main === module) {
  console.log(longestPalindromeBrute("babad"));
}

module.exports = { longestPalindromeBrute };
