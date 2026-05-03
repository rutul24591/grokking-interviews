function factorialIter(n) {
  if (n < 0) throw new Error("n must be non-negative");
  let out = 1;
  for (let i = 2; i <= n; i += 1) out *= i;
  return out;
}
console.log(factorialIter(5));
