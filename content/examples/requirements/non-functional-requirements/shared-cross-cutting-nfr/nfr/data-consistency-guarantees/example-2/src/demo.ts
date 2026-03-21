function isStrong(N: number, R: number, W: number) {
  return R + W > N;
}

console.log({ N: 3, R: 1, W: 1, strong: isStrong(3, 1, 1) });
console.log({ N: 3, R: 2, W: 2, strong: isStrong(3, 2, 2) });

