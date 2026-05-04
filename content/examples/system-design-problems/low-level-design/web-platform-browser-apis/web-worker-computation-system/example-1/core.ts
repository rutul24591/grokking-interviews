export type Job<TIn, TOut> = { id: string; input: TIn };

export type WorkerPool<TIn, TOut> = {
  submit: (job: Job<TIn, TOut>) => Promise<TOut>;
};

export function createInProcessPool<TIn, TOut>(fn: (input: TIn) => Promise<TOut>): WorkerPool<TIn, TOut> {
  // In browsers, wrap postMessage/MessageChannel. This is a testable stand-in.
  return { submit: (job) => fn(job.input) };
}
