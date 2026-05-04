export function memoizeOne<TArgs extends unknown[], TResult>(fn: (...args: TArgs) => TResult) {
  let lastArgs: TArgs | null = null;
  let lastRes: TResult;
  return (...args: TArgs) => {
    if (lastArgs && lastArgs.length === args.length && lastArgs.every((v, i) => v === args[i])) {
      return lastRes;
    }
    lastArgs = args;
    lastRes = fn(...args);
    return lastRes;
  };
}
