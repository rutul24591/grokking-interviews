const steps = [
  { name: "detect", minutes: 2 },
  { name: "page_oncall", minutes: 3 },
  { name: "promote_failover", minutes: 5 },
  { name: "warmup", minutes: 8 },
  { name: "validate", minutes: 4 }
];

const rtoMinutes = steps.reduce((acc, s) => acc + s.minutes, 0);
console.log(JSON.stringify({ steps, rtoMinutes }, null, 2));

