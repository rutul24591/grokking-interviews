function redirectLoop(redirects, start) {
  const seen = new Set();
  let current = start;
  while (redirects[current]) {
    if (seen.has(current)) return true;
    seen.add(current);
    current = redirects[current];
  }
  return false;
}

console.log(redirectLoop({ "/billing": "/login", "/login": "/billing" }, "/billing"));
