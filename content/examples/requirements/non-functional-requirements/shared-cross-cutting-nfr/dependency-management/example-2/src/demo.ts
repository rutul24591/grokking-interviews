function bump(from: string, to: string) {
  const a = from.split(".").map(Number);
  const b = to.split(".").map(Number);
  if (a[0] !== b[0]) return "major";
  if (a[1] !== b[1]) return "minor";
  if (a[2] !== b[2]) return "patch";
  return "none";
}

console.log(bump("1.2.3", "2.0.0"));
console.log(bump("1.2.3", "1.3.0"));
console.log(bump("1.2.3", "1.2.4"));

