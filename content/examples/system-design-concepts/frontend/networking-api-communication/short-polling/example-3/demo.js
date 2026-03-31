const intervalMs = 1000;
const requestDurationMs = 1400;

if (requestDurationMs > intervalMs) {
  console.log("overlap risk -> wait for completion before scheduling next poll");
} else {
  console.log("no overlap risk");
}
