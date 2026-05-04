export function createTokenBuffer(flushEveryMs: number, onFlush: (text: string) => void) {
  let buf = "";
  let timer: ReturnType<typeof setTimeout> | null = null;

  function schedule() {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      if (buf) {
        onFlush(buf);
        buf = "";
      }
    }, flushEveryMs);
  }

  return {
    push(token: string) {
      buf += token;
      schedule();
    },
    flush() {
      if (timer) clearTimeout(timer);
      timer = null;
      if (buf) {
        onFlush(buf);
        buf = "";
      }
    },
  };
}
