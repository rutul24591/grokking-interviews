const batchResult = [
  { id: "a1", ok: true },
  { id: "a2", ok: false, error: "not found" },
  { id: "a3", ok: true }
];

for (const item of batchResult) {
  if (!item.ok) {
    console.log(`request ${item.id} failed -> ${item.error}`);
    continue;
  }
  console.log(`request ${item.id} succeeded`);
}
