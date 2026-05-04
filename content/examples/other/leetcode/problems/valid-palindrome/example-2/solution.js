function isAlnum(ch) {
  const code = ch.charCodeAt(0);
  return (
    (code >= 48 && code <= 57) ||
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122)
  );
}

function isPalindromeTwoPointers(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    while (left < right && !isAlnum(s[left])) left += 1;
    while (left < right && !isAlnum(s[right])) right -= 1;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left += 1;
    right -= 1;
  }
  return true;
}

if (require.main === module) {
  console.log(isPalindromeTwoPointers("A man, a plan, a canal: Panama"));
  console.log(isPalindromeTwoPointers("race a car"));
}

module.exports = { isPalindromeTwoPointers };
