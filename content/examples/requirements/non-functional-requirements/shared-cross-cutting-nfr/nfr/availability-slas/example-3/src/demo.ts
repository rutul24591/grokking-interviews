type Interval = { startMin: number; endMin: number; kind: "down" | "maintenance" };

function minutesInMonth(days = 30) {
  return days * 24 * 60;
}

function overlap(a: Interval, b: Interval) {
  return Math.max(0, Math.min(a.endMin, b.endMin) - Math.max(a.startMin, b.startMin));
}

const total = minutesInMonth();
const events: Interval[] = [
  { startMin: 100, endMin: 160, kind: "down" },
  { startMin: 300, endMin: 360, kind: "maintenance" },
  { startMin: 320, endMin: 340, kind: "down" }, // downtime during maintenance excluded
];

const maintenance = events.filter((e) => e.kind === "maintenance");
const down = events.filter((e) => e.kind === "down");

let downMin = 0;
for (const d of down) {
  let excluded = 0;
  for (const m of maintenance) excluded += overlap(d, m);
  downMin += (d.endMin - d.startMin) - excluded;
}

const availability = 1 - downMin / total;
console.log({ total, downMin, availability });

