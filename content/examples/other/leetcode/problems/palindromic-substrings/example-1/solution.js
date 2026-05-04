function countSubstringsBrute(s) {
  function isPal(left, right) {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left += 1;
      right -= 1;
    }
    return true;
  }

  let count = 0;
  for (let i = 0; i < s.length; i += 1) {
    for (let j = i; j < s.length; j += 1) {
      if (isPal(i, j)) count += 1;
    }
  }
  return count;
}

if (require.main === module) {
  console.log(countSubstringsBrute("aaa"));
}

module.exports = { countSubstringsBrute };
