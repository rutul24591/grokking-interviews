const errors = [
  { code: 503, retryable: true },
  { code: 429, retryable: true },
  { code: 403, retryable: false }
];
console.table(errors);
