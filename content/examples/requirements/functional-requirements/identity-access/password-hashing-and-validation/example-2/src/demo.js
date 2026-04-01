function evaluatePolicy(password) {
  const checks = {
    minLength: password.length >= 12,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
    bannedSubstring: /password|admin|qwerty/i.test(password)
  };

  return {
    ...checks,
    accepted: checks.minLength && checks.upper && checks.number && checks.symbol && !checks.bannedSubstring
  };
}

console.log(evaluatePolicy("StrongerPass!42"));
console.log(evaluatePolicy("AdminPassword123"));
