const stream = [
  { id: 101, data: "article update 101" },
  { id: 102, data: "article update 102" },
  { id: 103, data: "article update 103" }
];

const lastEventId = 101;
for (const event of stream.filter((item) => item.id > lastEventId)) {
  console.log(`replay after reconnect -> ${event.id} ${event.data}`);
}
