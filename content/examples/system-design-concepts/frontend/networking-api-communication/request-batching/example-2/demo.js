const events = [
  { at: 0, id: "a1" },
  { at: 10, id: "a2" },
  { at: 18, id: "a3" },
  { at: 55, id: "a4" }
];

let batch = [];
let windowStart = 0;
for (const event of events) {
  if (batch.length === 0) {
    windowStart = event.at;
  }
  if (event.at - windowStart > 20) {
    console.log(`flush batch -> ${batch.join(", ")}`);
    batch = [];
    windowStart = event.at;
  }
  batch.push(event.id);
}
console.log(`flush batch -> ${batch.join(", ")}`);
