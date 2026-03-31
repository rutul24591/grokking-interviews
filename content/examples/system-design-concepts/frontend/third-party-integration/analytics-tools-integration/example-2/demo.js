const events = [
  { at: 0, type: "page_view" },
  { at: 30, type: "scroll_depth" },
  { at: 70, type: "share_click" },
  { at: 260, type: "cta_click" }
];

let batch = [];
let windowStart = 0;
for (const event of events) {
  if (batch.length === 0) windowStart = event.at;
  if (event.at - windowStart > 100) {
    console.log(`flush -> ${batch.map((item) => item.type).join(", ")}`);
    batch = [];
    windowStart = event.at;
  }
  batch.push(event);
}
console.log(`flush -> ${batch.map((item) => item.type).join(", ")}`);
