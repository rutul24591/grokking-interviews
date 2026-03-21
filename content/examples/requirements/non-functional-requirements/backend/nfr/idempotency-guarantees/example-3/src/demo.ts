type OutboxEvent = { id: string; type: string; payload: unknown };

class Publisher {
  private published = new Set<string>();
  publish(e: OutboxEvent) {
    if (this.published.has(e.id)) return { published: false };
    this.published.add(e.id);
    return { published: true };
  }
}

const publisher = new Publisher();
const event: OutboxEvent = { id: "evt-1", type: "charge.created", payload: { chargeId: "ch_1" } };

console.log(JSON.stringify({ first: publisher.publish(event), retry: publisher.publish(event) }, null, 2));

