type Response = { seq: number; value: string };

async function fetchWithDelay(seq: number, delayMs: number) {
  await new Promise((r) => setTimeout(r, delayMs));
  return { seq, value: `resp_${seq}` } satisfies Response;
}

let latestSeq = 0;
let applied: Response | null = null;

async function issue(seq: number, delayMs: number) {
  latestSeq = Math.max(latestSeq, seq);
  const res = await fetchWithDelay(seq, delayMs);
  if (res.seq !== latestSeq) return { ignored: true, res };
  applied = res;
  return { ignored: false, res };
}

const out = await Promise.all([issue(1, 300), issue(2, 50), issue(3, 120)]);

console.log(JSON.stringify({ out, applied }, null, 2));

