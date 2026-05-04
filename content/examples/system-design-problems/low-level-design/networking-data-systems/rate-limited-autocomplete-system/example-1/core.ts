export function createTokenBucket(args: { capacity: number; refillPerSec: number }) {
  let tokens = args.capacity;
  let last = Date.now();

  function refill(now: number) {
    const dt = (now - last) / 1000;
    last = now;
    tokens = Math.min(args.capacity, tokens + dt * args.refillPerSec);
  }

  return {
    allow(now = Date.now()) {
      refill(now);
      if (tokens >= 1) {
        tokens -= 1;
        return true;
      }
      return false;
    },
  };
}
