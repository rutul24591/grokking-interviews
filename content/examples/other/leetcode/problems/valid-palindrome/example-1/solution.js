function isPalindromeFiltered(s) {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0;
  let right = cleaned.length - 1;
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left += 1;
    right -= 1;
  }
  return true;
}

if (require.main === module) {
  console.log(isPalindromeFiltered("A man, a plan, a canal: Panama"));
  console.log(isPalindromeFiltered("race a car"));
}

module.exports = { isPalindromeFiltered };
