type Write = { region: string; value: string; ts: number };

function lww(a: Write, b: Write) {
  return a.ts >= b.ts ? a : b;
}

const w1: Write = { region: "us-east", value: "A", ts: 100 };
const w2: Write = { region: "eu-west", value: "B", ts: 120 };

console.log(JSON.stringify({ winner: lww(w1, w2) }, null, 2));

