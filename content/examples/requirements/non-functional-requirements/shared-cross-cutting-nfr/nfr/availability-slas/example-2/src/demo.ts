function serial(avails: number[]) {
  return avails.reduce((p, a) => p * a, 1);
}

function parallel(avails: number[]) {
  const down = avails.reduce((p, a) => p * (1 - a), 1);
  return 1 - down;
}

const api = 0.999;
const db = 0.999;
console.log({ serial: serial([api, db]), parallel: parallel([api, db]) });

