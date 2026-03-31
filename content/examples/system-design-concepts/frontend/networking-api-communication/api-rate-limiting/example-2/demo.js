const limit = 5;
let tokens = 5;
for (let index = 1; index <= 8; index += 1) {
  const allowed = tokens > 0;
  if (allowed) tokens -= 1;
  console.log(`request ${index} -> ${allowed ? "allow" : "reject"}`);
}
