type Item = { id: string; createdAt: number; legalHold: boolean };

const now = Date.now();
const items: Item[] = [
  { id: "a", createdAt: now - 40 * 24 * 3600 * 1000, legalHold: false },
  { id: "b", createdAt: now - 40 * 24 * 3600 * 1000, legalHold: true },
  { id: "c", createdAt: now - 5 * 24 * 3600 * 1000, legalHold: false },
];

const retentionDays = 30;
const kept = items.filter((i) => i.legalHold || now - i.createdAt <= retentionDays * 24 * 3600 * 1000);
console.log({ kept: kept.map((k) => k.id) });

