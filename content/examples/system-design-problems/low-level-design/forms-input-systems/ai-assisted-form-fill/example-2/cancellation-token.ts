export function createCancellationToken() {
  let canceled = false;
  return {
    cancel() {
      canceled = true;
    },
    get canceled() {
      return canceled;
    },
  };
}

