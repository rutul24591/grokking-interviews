let stolen: Array<{ ts: number; token: string }> = [];

export function recordStolen(token: string) {
  stolen = [{ ts: Date.now(), token }, ...stolen].slice(0, 20);
}

export function listStolen() {
  return stolen;
}

export function resetStolen() {
  stolen = [];
}

