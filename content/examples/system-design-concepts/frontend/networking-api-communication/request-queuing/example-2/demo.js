const jobs = ["a1", "a2", "a3", "a4", "a5"];
const concurrency = 2;
let inFlight = 0;

for (const job of jobs) {
  if (inFlight >= concurrency) {
    console.log(`queue ${job}`);
    continue;
  }
  inFlight += 1;
  console.log(`start ${job}`);
}
