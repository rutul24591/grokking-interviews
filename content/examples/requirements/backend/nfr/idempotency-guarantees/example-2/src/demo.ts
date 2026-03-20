type State<T> =
  | { status: "in_progress"; startedAt: number }
  | { status: "completed"; completedAt: number; value: T };

class Store<T> {
  private map = new Map<string, State<T>>();

  begin(key: string) {
    const existing = this.map.get(key);
    if (existing) return existing;
    const s: State<T> = { status: "in_progress", startedAt: Date.now() };
    this.map.set(key, s);
    return s;
  }

  complete(key: string, value: T) {
    const s: State<T> = { status: "completed", completedAt: Date.now(), value };
    this.map.set(key, s);
    return s;
  }

  get(key: string) {
    return this.map.get(key) ?? null;
  }
}

const store = new Store<{ chargeId: string }>();
console.log(store.begin("k1"));
console.log(store.complete("k1", { chargeId: "ch_123" }));
console.log(store.get("k1"));

