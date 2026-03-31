const received = [
  { id: 11, message: "new comment" },
  { id: 11, message: "duplicate resend" },
  { id: 12, message: "editor update" }
];

const seen = new Set();
for (const event of received) {
  if (seen.has(event.id)) {
    console.log(`drop duplicate event ${event.id}`);
    continue;
  }
  seen.add(event.id);
  console.log(`apply event ${event.id}: ${event.message}`);
}
