function series(...as: number[]) {
  return as.reduce((acc, a) => acc * a, 1);
}

function parallelIndependent(a: number, b: number) {
  // P(up) = 1 - P(both down)
  return 1 - (1 - a) * (1 - b);
}

const service = 0.999; // 99.9%
const db = 0.9995; // 99.95%
const cache = 0.995; // 99.5%

const allRequired = series(service, db, cache);
const redundantService = parallelIndependent(0.999, 0.999);

console.log(JSON.stringify({ allRequired, redundantService }, null, 2));

