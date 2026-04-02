type Event = { id: string; payload: string };

class Consumer {
  private processed = new Set<string>();
  private sideEffect: string[] = [];

  handle(e: Event) {
    if (this.processed.has(e.id)) return { processed: false };
    this.processed.add(e.id);
    this.sideEffect.push(`effect:${e.payload}`);
    return { processed: true };
  }

  effects() {
    return this.sideEffect;
  }
}

const consumer = new Consumer();
consumer.handle({ id: "e1", payload: "a" });
consumer.handle({ id: "e1", payload: "a" }); // replay

console.log(JSON.stringify({ effects: consumer.effects() }, null, 2));

