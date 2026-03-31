const retryAfterMs = 3000;
const attempts = [0, 500, 1000, 3000];
for (const atMs of attempts) {
  console.log(`${atMs}ms -> ${atMs >= retryAfterMs ? "safe retry" : "back off"}`);
}
