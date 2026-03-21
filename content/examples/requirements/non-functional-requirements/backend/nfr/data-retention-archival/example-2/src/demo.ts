function yyyymmdd(d: Date) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function partitions(days: number) {
  const out: string[] = [];
  for (let i = 0; i < days; i++) {
    out.push(yyyymmdd(new Date(Date.now() - i * 24 * 60 * 60 * 1000)));
  }
  return out;
}

const keepDays = 30;
const existing = partitions(120); // last 120 days
const deletable = existing.slice(keepDays);

console.log(JSON.stringify({ keepDays, existing: existing.length, deletable: deletable.length, sample: deletable.slice(0, 5) }, null, 2));

