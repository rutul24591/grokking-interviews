function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function modAssign(key: string, n: number) {
  return hash(key) % n;
}

function movement(keys: string[], n1: number, n2: number) {
  let moved = 0;
  for (const k of keys) if (modAssign(k, n1) !== modAssign(k, n2)) moved++;
  return moved / keys.length;
}

const keys = Array.from({ length: 1000 }, (_, i) => `k${i}`);
console.log(JSON.stringify({ moduloMovement: movement(keys, 4, 5) }, null, 2));

