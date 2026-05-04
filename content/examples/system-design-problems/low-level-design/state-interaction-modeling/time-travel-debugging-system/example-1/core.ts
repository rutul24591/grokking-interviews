export function createRingBuffer<T>(limit: number) {
  const arr: T[] = [];
  return {
    push(x: T) {
      arr.push(x);
      if (arr.length > limit) arr.shift();
    },
    snapshot() {
      return arr.slice();
    },
    at(i: number) {
      return arr[i] ?? null;
    },
  };
}
