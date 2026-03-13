function dominates(a, b) {
  let greater = false;
  for (const k in b) {
    if ((a[k] || 0) < (b[k] || 0)) return false;
    if ((a[k] || 0) > (b[k] || 0)) greater = true;
  }
  return greater;
}

const v1 = { a: 2, b: 1 };
const v2 = { a: 1, b: 2 };
console.log(dominates(v1, v2));
