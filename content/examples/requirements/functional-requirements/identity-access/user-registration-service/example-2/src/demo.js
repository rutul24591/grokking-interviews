function normalizeEmail(input) {
  return input.trim().toLowerCase();
}

console.log(normalizeEmail(" Avery@example.com "));
console.log(normalizeEmail("TEAM@EXAMPLE.COM"));
