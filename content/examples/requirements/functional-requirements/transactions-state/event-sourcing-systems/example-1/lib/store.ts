type EventType = "order-created" | "payment-authorized" | "payment-captured" | "refund-issued";

const state = {
  snapshotVersion: 42,
  replayLag: 3,
  events: [
    { id: "ev-1", type: "order-created" as EventType, entityId: "ord-100", sequence: 1 },
    { id: "ev-2", type: "payment-authorized" as EventType, entityId: "ord-100", sequence: 2 },
    { id: "ev-3", type: "payment-captured" as EventType, entityId: "ord-100", sequence: 3 }
  ],
  lastMessage: "Event-sourced transaction systems should expose append-only history, snapshot health, and replay lag."
};

function projectStatus() {
  const last = state.events[state.events.length - 1];
  return {
    orderId: last.entityId,
    status: last.type === "refund-issued" ? "refunded" : last.type === "payment-captured" ? "captured" : last.type === "payment-authorized" ? "authorized" : "created"
  };
}

export function snapshot() {
  return structuredClone({
    snapshotVersion: state.snapshotVersion,
    replayLag: state.replayLag,
    projection: projectStatus(),
    events: state.events,
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "append-event", value?: EventType) {
  if (type === "append-event" && value) {
    state.events.push({
      id: `ev-${state.events.length + 1}`,
      type: value,
      entityId: "ord-100",
      sequence: state.events.length + 1
    });
    state.replayLag = Math.max(0, state.replayLag - 1);
    state.snapshotVersion += 1;
    state.lastMessage = `Appended ${value} and advanced the projection snapshot.`;
  }
  return snapshot();
}
