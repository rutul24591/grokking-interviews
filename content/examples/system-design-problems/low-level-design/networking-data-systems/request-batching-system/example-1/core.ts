export function createBatcher<TArg, TResult>(args: {
  maxWaitMs: number;
  maxBatchSize: number;
  exec: (items: TArg[]) => Promise<TResult[]>;
}) {
  let queue: { arg: TArg; resolve: (r: TResult) => void; reject: (e: unknown) => void }[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;

  async function flush() {
    const batch = queue;
    queue = [];
    if (timer) clearTimeout(timer);
    timer = null;

    try {
      const res = await args.exec(batch.map((x) => x.arg));
      for (let i = 0; i < batch.length; i += 1) batch[i].resolve(res[i]);
    } catch (e) {
      for (const x of batch) x.reject(e);
    }
  }

  return (arg: TArg) =>
    new Promise<TResult>((resolve, reject) => {
      queue.push({ arg, resolve, reject });
      if (queue.length >= args.maxBatchSize) {
        void flush();
        return;
      }
      if (!timer) timer = setTimeout(() => void flush(), args.maxWaitMs);
    });
}
