const state = {
  items: [
    { id: "sku-1", label: "Annual membership", available: 12, reserved: 2, oversellRisk: false },
    { id: "sku-2", label: "Workshop seat", available: 1, reserved: 3, oversellRisk: true }
  ],
  lastMessage: "Inventory management should show reserved stock, available stock, and oversell risk during transaction processing."
};

export function snapshot() {
  return structuredClone({
    items: state.items,
    summary: {
      oversellRisk: state.items.filter((item) => item.oversellRisk).length
    },
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "reserve" | "release", value?: string) {
  state.items = state.items.map((item) => {
    if (item.id !== value) return item;
    if (type === "reserve") {
      const available = Math.max(0, item.available - 1);
      const reserved = item.reserved + 1;
      return { ...item, available, reserved, oversellRisk: reserved > available + reserved / 2 };
    }
    const available = item.available + 1;
    const reserved = Math.max(0, item.reserved - 1);
    return { ...item, available, reserved, oversellRisk: false };
  });
  state.lastMessage = `${type} processed for ${value}.`;
  return snapshot();
}
