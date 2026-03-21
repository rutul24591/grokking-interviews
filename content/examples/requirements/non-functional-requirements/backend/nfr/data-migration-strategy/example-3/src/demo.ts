type Legacy = { id: string; fullName: string };
type Next = { id: string; firstName: string; lastName: string };

function toFullName(n: Next) {
  return `${n.firstName}${n.lastName ? " " + n.lastName : ""}`.trim();
}

function shadowCompare(legacy: Legacy, next: Next) {
  const expected = legacy.fullName.trim();
  const observed = toFullName(next).trim();
  return { ok: expected === observed, expected, observed };
}

const legacy: Legacy = { id: "u1", fullName: "Alice Johnson" };
const nextOk: Next = { id: "u1", firstName: "Alice", lastName: "Johnson" };
const nextBad: Next = { id: "u1", firstName: "Alice", lastName: "Jonson" };

console.log(JSON.stringify({ ok: shadowCompare(legacy, nextOk), mismatch: shadowCompare(legacy, nextBad) }, null, 2));

