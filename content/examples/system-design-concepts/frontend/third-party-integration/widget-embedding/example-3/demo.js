const heartbeats = [true, true, false, false];
let missed = 0;

for (const beat of heartbeats) {
  missed = beat ? 0 : missed + 1;
  console.log(`${beat ? "heartbeat ok" : "heartbeat missed"} -> ${missed >= 2 ? "collapse widget and show fallback CTA" : "keep widget mounted"}`);
}
