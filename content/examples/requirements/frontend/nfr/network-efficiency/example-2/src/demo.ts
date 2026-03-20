function pLimit(concurrency: number) {
  let active = 0;
  const queue: Array<() => void> = [];
  const next = () => {
    active--;
    const fn = queue.shift();
    if (fn) fn();
  };

  return async function <T>(task: () => Promise<T>): Promise<T> {
    if (active >= concurrency) {
      await new Promise<void>((resolve) => queue.push(resolve));
    }
    active++;
    try {
      return await task();
    } finally {
      next();
    }
  };
}

async function fakeFetch(id: number) {
  const ms = 50 + Math.floor(Math.random() * 80);
  await new Promise((r) => setTimeout(r, ms));
  return { id, ms };
}

const limit = pLimit(3);
const tasks = Array.from({ length: 10 }, (_, i) => () => fakeFetch(i + 1));

const start = Date.now();
const results = await Promise.all(tasks.map((t) => limit(t)));
const elapsed = Date.now() - start;

console.log(JSON.stringify({ concurrency: 3, elapsedMs: elapsed, results }, null, 2));

