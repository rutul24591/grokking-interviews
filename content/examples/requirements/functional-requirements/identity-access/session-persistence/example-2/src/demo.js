function cookieTtl(rememberMe, days) {
  return rememberMe ? days * 24 * 60 * 60 : 0;
}

console.log(cookieTtl(true, 14));
console.log(cookieTtl(false, 14));
