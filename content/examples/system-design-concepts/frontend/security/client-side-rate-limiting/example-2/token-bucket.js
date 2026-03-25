function simulate({ capacity, refillPerSec, seconds }) {
  let tokens = capacity;
  for (let t = 0; t <= seconds; t += 1) {
    tokens = Math.min(capacity, tokens + refillPerSec);
    const take = Math.min(tokens, 3); // burst
    tokens -= take;
    process.stdout.write(`t=${t}s took=${take} remaining=${tokens}\n`);
  }
}

simulate({ capacity: 5, refillPerSec: 5, seconds: 5 });

