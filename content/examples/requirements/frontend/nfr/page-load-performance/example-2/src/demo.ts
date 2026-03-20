async function delay(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchA() {
  await delay(120);
  return "A";
}

async function fetchB() {
  await delay(180);
  return "B";
}

async function fetchC() {
  await delay(90);
  return "C";
}

const t1 = Date.now();
const seq = [await fetchA(), await fetchB(), await fetchC()];
const seqMs = Date.now() - t1;

const t2 = Date.now();
const par = await Promise.all([fetchA(), fetchB(), fetchC()]);
const parMs = Date.now() - t2;

console.log(JSON.stringify({ seq, seqMs, par, parMs, winMs: seqMs - parMs }, null, 2));

