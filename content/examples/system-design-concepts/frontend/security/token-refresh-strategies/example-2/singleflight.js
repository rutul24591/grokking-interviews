function createSingleflight(fn) {
  let inFlight = null;
  return async () => {
    if (inFlight) return inFlight;
    inFlight = Promise.resolve()
      .then(fn)
      .finally(() => {
        inFlight = null;
      });
    return inFlight;
  };
}

let refreshCalls = 0;
const refresh = createSingleflight(async () => {
  refreshCalls += 1;
  await new Promise((r) => setTimeout(r, 50));
  return { accessToken: `a_${Date.now()}` };
});

const results = await Promise.all(Array.from({ length: 10 }, () => refresh()));
process.stdout.write(`refreshCalls=${refreshCalls}\n`);
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);

