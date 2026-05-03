function submasks(mask) {
  const out = [];
  let sub = mask;
  while (true) {
    out.push(sub);
    if (sub === 0) break;
    sub = (sub - 1) & mask;
  }
  return out;
}

console.log(submasks(0b1011).map((v) => v.toString(2)));
