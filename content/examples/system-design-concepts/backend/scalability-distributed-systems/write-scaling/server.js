const buffer = [];
setInterval(async () => {
  if (buffer.length == 0) return;
  const batch = buffer.splice(0, 100);
  await db.bulkInsert(batch);
}, 50);

function enqueueWrite(record) {
  buffer.push(record);
}
