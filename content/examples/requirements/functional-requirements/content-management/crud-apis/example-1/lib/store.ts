type RecordItem = {
  id: string;
  title: string;
  status: "draft" | "published" | "deleted";
};

const crudState: { items: RecordItem[]; lastMessage: string } = {
  items: [
    { id: "c-101", title: "Content Preview", status: "published" },
    { id: "c-102", title: "Version Recovery Playbook", status: "draft" }
  ],
  lastMessage: "CRUD APIs need explicit state transitions so clients can reason about draft, publish, and deletion outcomes."
};

export function snapshot() {
  return structuredClone(crudState);
}

export function mutate(type: "create" | "update" | "delete", id?: string) {
  if (type === "create") {
    const nextId = `c-${100 + crudState.items.length + 1}`;
    crudState.items.unshift({ id: nextId, title: "New Article Draft", status: "draft" });
    crudState.lastMessage = `Created ${nextId} and returned the new draft resource.`;
    return snapshot();
  }

  const item = crudState.items.find((entry) => entry.id === id);
  if (!item) {
    return snapshot();
  }

  if (type === "update") {
    item.title = `${item.title} · updated`;
    crudState.lastMessage = `${item.id} accepted an update without losing resource identity.`;
  }

  if (type === "delete") {
    item.status = "deleted";
    crudState.lastMessage = `${item.id} transitioned to deleted so downstream readers stop surfacing it.`;
  }

  return snapshot();
}
