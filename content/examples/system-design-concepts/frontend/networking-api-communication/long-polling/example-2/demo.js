const responses = [
  { at: 1200, hasUpdate: false },
  { at: 2800, hasUpdate: true },
  { at: 4600, hasUpdate: true }
];

let nextPollAt = 0;
for (const response of responses) {
  console.log(`open poll at ${nextPollAt} ms`);
  console.log(`server returns at ${response.at} ms -> ${response.hasUpdate ? "event" : "timeout"}`);
  nextPollAt = response.at + 10;
}
