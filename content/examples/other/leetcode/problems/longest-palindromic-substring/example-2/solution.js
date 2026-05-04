function longestPalindrome(s) {
  let bestL = 0;
  let bestR = 0;

  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left -= 1;
      right += 1;
    }
    // now (left,right) is one step beyond palindrome
    const L = left + 1;
    const R = right - 1;
    if (R - L > bestR - bestL) {
      bestL = L;
      bestR = R;
    }
  }

  for (let i = 0; i < s.length; i += 1) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.slice(bestL, bestR + 1);
}

if (require.main === module) {
  console.log(longestPalindrome("babad"));
}

module.exports = { longestPalindrome };
